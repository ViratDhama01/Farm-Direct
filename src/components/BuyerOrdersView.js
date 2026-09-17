// 🌱 FarmDirect Buyer Orders View & Real-Time Delivery Tracking (Zero-Flicker Architecture)
import { Icons } from '../lib/icons.js';
import { FarmDirectApi } from '../lib/supabase.js';
import { resolveCropImages, getCropSvgFallback } from '../lib/cropImages.js';

export function renderBuyerOrdersModal(container, { buyerUser, onClose }) {
  let isUnmounted = false;
  let lastStateFingerprint = '';

  // 1. Render the permanent, stable modal shell ONCE
  container.innerHTML = `
    <div class="modal-overlay" id="buyer-orders-backdrop" style="animation:fadeIn 0.2s ease-out;">
      <div class="modal-container" style="max-width: 720px; padding: 1.5rem 2rem;">
        <!-- Stable Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; border-bottom:1px solid #e2e8f0; padding-bottom:1rem;">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <img src="/logo.png" alt="FarmDirect" style="width:30px; height:30px; object-fit:contain; border-radius:6px;" />
            <div>
              <h3 style="font-size:1.35rem; font-weight:800; color:#0f172a; margin:0; line-height:1.2;">
                My Purchases & Orders
              </h3>
              <span style="font-size:0.75rem; color:#15803d; font-weight:600; display:inline-flex; align-items:center; gap:4px;">
                <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#16a34a; box-shadow:0 0 6px #16a34a;"></span>
                Live Mandi Tracking
              </span>
            </div>
          </div>
          <button id="btn-close-buyer-orders" class="btn-close-modal">
            <span style="width:18px; height:18px; display:inline-block;">${Icons.x}</span>
          </button>
        </div>

        <!-- Stable Scrollable List Container (No blinking) -->
        <div id="buyer-orders-list-inner" style="display:flex; flex-direction:column; gap:1.2rem; max-height:65vh; overflow-y:auto; padding-right:4px;">
          <div style="text-align:center; padding:3rem 1rem; color:#64748b;">
            <span style="font-size:2rem; display:block; margin-bottom:0.5rem;">⏳</span>
            <p style="font-size:0.85rem;">Loading your orders...</p>
          </div>
        </div>
      </div>
    </div>
  `;

  const listContainer = container.querySelector('#buyer-orders-list-inner');
  const closeBtn = container.querySelector('#btn-close-buyer-orders');
  const backdrop = container.querySelector('#buyer-orders-backdrop');

  const handleClose = () => {
    isUnmounted = true;
    window.removeEventListener('farmdirect:order_status_updated', onOrderChange);
    window.removeEventListener('storage', onOrderChange);
    if (pollInterval) clearInterval(pollInterval);
    onClose();
  };

  if (closeBtn) closeBtn.addEventListener('click', handleClose);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target.id === 'buyer-orders-backdrop') handleClose();
    });
  }

  // 2. Data loader that ONLY updates DOM if data has actually changed
  async function updateOrdersList() {
    if (isUnmounted || !listContainer) return;

    try {
      const orders = await FarmDirectApi.getBuyerOrders(buyerUser?.id);
      
      // Calculate data fingerprint to avoid redundant DOM touching
      const currentFingerprint = JSON.stringify(
        orders.map(o => `${o.id}_${o.status}_${o.quantity}_${o.total_amount}`)
      );

      if (currentFingerprint === lastStateFingerprint) {
        // Data unchanged: do NOT touch innerHTML to prevent any visual blink
        return;
      }

      lastStateFingerprint = currentFingerprint;

      if (!orders || orders.length === 0) {
        listContainer.innerHTML = `
          <div style="text-align:center; padding:3.5rem 1rem; color:#64748b;">
            <span style="font-size:3.2rem; display:block; margin-bottom:0.6rem;">📦</span>
            <p style="font-weight:700; font-size:1.1rem; color:#0f172a;">No orders placed yet</p>
            <p style="font-size:0.85rem; margin-top:4px;">Browse the marketplace feed to purchase fresh produce directly from farmers.</p>
          </div>
        `;
        return;
      }

      listContainer.innerHTML = orders.map(order => {
        const orderImg = order.crop_image && !order.crop_image.includes('1592924357228') && !order.crop_image.includes('1585994192701') 
          ? order.crop_image 
          : resolveCropImages(order.crop_title, 'Pulses', [])[0];
        const fallback = getCropSvgFallback(order.crop_title, 'Pulses');

        const st = (order.status || 'placed').toLowerCase();

        // 4-step progress: 1=Placed, 2=Confirmed, 3=Out for Delivery, 4=Delivered
        let stepNumber = 1;
        let badgeColor = 'background:#fef3c7; color:#b45309; border:1px solid #fde68a;';
        let badgeLabel = '🟡 Order Placed';
        let progressPercent = '25%';

        if (st.includes('deliver') || st.includes('complete')) {
          stepNumber = 4;
          badgeColor = 'background:#dcfce7; color:#15803d; border:1px solid #86efac;';
          badgeLabel = '🎉 Delivered';
          progressPercent = '100%';
        } else if (st.includes('out') || st.includes('transit') || st.includes('dispatch') || st.includes('preparing')) {
          stepNumber = 3;
          badgeColor = 'background:#ede9fe; color:#6d28d9; border:1px solid #c4b5fd;';
          badgeLabel = '🚚 Out for Delivery';
          progressPercent = '75%';
        } else if (st.includes('confirm')) {
          stepNumber = 2;
          badgeColor = 'background:#dbeafe; color:#1d4ed8; border:1px solid #93c5fd;';
          badgeLabel = '✅ Confirmed';
          progressPercent = '50%';
        } else if (st.includes('cancel')) {
          stepNumber = 0;
          badgeColor = 'background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;';
          badgeLabel = '❌ Cancelled';
          progressPercent = '0%';
        }

        return `
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:1.25rem; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <div>
              <span style="font-weight:800; color:#0f172a; font-size:1.05rem;">Order #${order.id}</span>
              <span style="font-size:0.75rem; color:#94a3b8; margin-left:8px;">${order.date || 'Today'}</span>
            </div>
            <span style="padding:4px 12px; border-radius:9999px; font-size:0.78rem; font-weight:700; ${badgeColor}">
              ${badgeLabel}
            </span>
          </div>

          <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem;">
            <img 
              src="${orderImg}" 
              alt="${order.crop_title}" 
              style="width:58px; height:58px; border-radius:10px; object-fit:cover; border:1px solid #e2e8f0;"
              onerror="this.onerror=null; this.src='${fallback}'"
            />
            <div style="flex:1;">
              <div style="font-weight:800; font-size:1.02rem; color:#0f172a;">${order.crop_title}</div>
              <div style="font-size:0.82rem; color:#64748b; margin-top:2px;">
                ${order.quantity} ${order.unit || 'kg'} • ₹${order.unit_price || order.price_per_kg}/kg • ${order.delivery_option || 'Direct Mandi Transport'}
              </div>
              <div style="font-size:0.78rem; color:#15803d; font-weight:600; margin-top:2px;">
                👨‍🌾 Farmer: ${order.farmer_name}
              </div>
            </div>
            <div style="text-align:right;">
              <span style="font-size:0.72rem; color:#64748b; display:block;">Total Amount</span>
              <span style="font-size:1.3rem; font-weight:900; color:#15803d;">₹${order.total_amount}</span>
            </div>
          </div>

          <!-- 4-Stage Real-Time Status Tracking Bar -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:0.9rem; font-size:0.75rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-weight:700; color:#475569;">
              <div style="display:flex; align-items:center; gap:4px; color:${stepNumber >= 1 ? '#15803d' : '#94a3b8'};">
                <span>${stepNumber >= 1 ? '✓' : '○'}</span>
                <span>Placed</span>
              </div>
              <div style="display:flex; align-items:center; gap:4px; color:${stepNumber >= 2 ? '#1d4ed8' : '#94a3b8'};">
                <span>${stepNumber >= 2 ? '✓' : '○'}</span>
                <span>Confirmed</span>
              </div>
              <div style="display:flex; align-items:center; gap:4px; color:${stepNumber >= 3 ? '#6d28d9' : '#94a3b8'};">
                <span>${stepNumber >= 3 ? '🚚' : '○'}</span>
                <span>Out for Delivery</span>
              </div>
              <div style="display:flex; align-items:center; gap:4px; color:${stepNumber >= 4 ? '#15803d' : '#94a3b8'};">
                <span>${stepNumber >= 4 ? '🎉' : '○'}</span>
                <span>Delivered</span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div style="height:6px; background:#e2e8f0; border-radius:9999px; overflow:hidden;">
              <div style="height:100%; width:${progressPercent}; background:${stepNumber === 4 ? '#16a34a' : stepNumber === 3 ? '#7c3aed' : '#2563eb'}; transition:width 0.4s ease-in-out;"></div>
            </div>

            <div style="margin-top:8px; font-size:0.72rem; color:#64748b; display:flex; justify-content:space-between; align-items:center;">
              <span>📍 Destination: ${order.delivery_address || 'Home Delivery'}</span>
              <span style="font-weight:600; color:#0f172a;">
                ${stepNumber === 4 ? 'Order Completed' : 'Estimated arrival: Today'}
              </span>
            </div>
          </div>
        </div>
        `;
      }).join('');
    } catch (err) {
      console.warn('Orders list render error:', err);
    }
  }

  // 3. Attach reactive event listeners
  const onOrderChange = () => {
    if (!isUnmounted) updateOrdersList();
  };

  window.addEventListener('farmdirect:order_status_updated', onOrderChange);
  window.addEventListener('storage', onOrderChange);

  // Background silent polling (every 4s) without re-creating DOM or causing any flicker
  const pollInterval = setInterval(() => {
    if (!isUnmounted) {
      updateOrdersList();
    } else {
      clearInterval(pollInterval);
    }
  }, 4000);

  // Initial load
  updateOrdersList();
}
