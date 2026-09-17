// 🌱 FarmDirect Notifications Drawer (Screen 9)
import { Icons } from '../lib/icons.js';
import { FarmDirectApi } from '../lib/supabase.js';

export function renderNotificationsDrawer(container, { userId, userRole, onClose, onNotificationClick }) {
  let activeTab = 'All';
  let subscription = null;

  async function loadAndRender() {
    const allNotifs = await FarmDirectApi.getNotifications(userRole, userId);

    const filteredNotifs = allNotifs.filter(n => {
      if (activeTab === 'All') return true;
      return n.category?.toLowerCase() === activeTab.toLowerCase();
    });

    container.innerHTML = `
      <div class="modal-overlay" id="notif-backdrop" style="justify-content: flex-end; padding:0;">
        <div class="notifications-panel">
          <!-- Header -->
          <div class="notifs-header">
            <h3 style="font-size:1.15rem; font-weight:800; color:#0f172a;">Notifications</h3>
            <button id="btn-close-notifs" class="btn-close-modal">
              <span style="width:18px; height:18px; display:inline-block;">${Icons.x}</span>
            </button>
          </div>

          <!-- Category Tabs (Matches Screen 9) -->
          <div class="notifs-tabs">
            ${['All', 'Orders', 'Messages', 'Alerts'].map(tab => `
              <button class="notif-tab-btn ${activeTab === tab ? 'active' : ''}" data-tab="${tab}">
                ${tab}
              </button>
            `).join('')}
          </div>

          <!-- Notifications List -->
          <div class="notifs-list">
            ${filteredNotifs.length === 0 ? `
              <div style="text-align:center; padding:2.5rem 1rem; color:#94a3b8;">
                <span style="width:36px; height:36px; display:inline-block; margin-bottom:0.5rem;">${Icons.bell}</span>
                <p style="font-size:0.85rem;">No notifications in ${activeTab}</p>
              </div>
            ` : filteredNotifs.map(notif => `
              <div class="notif-item-card ${!notif.read ? 'unread' : ''}" data-notif-id="${notif.id}">
                <div class="notif-title-row">
                  <span class="notif-item-title">
                    <span style="width:14px; height:14px; color:${notif.category === 'Alerts' ? '#eab308' : '#15803d'}; display:inline-block;">
                      ${notif.category === 'Alerts' ? Icons.trendingUp : Icons.packageCheck}
                    </span>
                    ${notif.title}
                  </span>
                  <span class="notif-item-time">${notif.time_ago}</span>
                </div>
                <div class="notif-item-msg">${notif.message}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Listeners
    container.querySelector('#btn-close-notifs').addEventListener('click', () => {
      if (subscription) subscription.unsubscribe();
      onClose();
    });
    container.querySelector('#notif-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'notif-backdrop') {
        if (subscription) subscription.unsubscribe();
        onClose();
      }
    });

    container.querySelectorAll('.notif-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        loadAndRender();
      });
    });

    container.querySelectorAll('.notif-item-card').forEach(card => {
      card.addEventListener('click', async () => {
        const id = card.dataset.notifId;
        await FarmDirectApi.markNotificationRead(id);
        card.classList.remove('unread');
      });
    });

    // Real-time subscription
    if (userId) {
      subscription = FarmDirectApi.subscribeToNotifications(userId, (newNotif) => {
        console.log('New real-time notification received:', newNotif);
        loadAndRender();
      });
    }
  }

  loadAndRender();
}
