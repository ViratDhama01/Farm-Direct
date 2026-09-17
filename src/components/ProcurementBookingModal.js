// 🌱 FarmDirect Farmer Procurement & Priority Queue Pre-Booking Modal
import { Icons } from '../lib/icons.js';
import { FarmDirectApi } from '../lib/supabase.js';
import { LanguageManager } from '../lib/translations.js';

export function renderProcurementBookingModal(container, { item, farmerUser, onClose, onBookingConfirmed }) {
  const { t } = LanguageManager;
  const currentLang = LanguageManager.getCurrentLanguage();

  let selectedQty = Math.min(item.max_per_farmer || 10, 5);
  let landCategory = 'small';
  const defaultDate = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];
  let sowingDate = defaultDate;
  let isConfirmed = false;
  let confirmedBooking = null;

  function computeLivePriority() {
    return FarmDirectApi.calculatePriorityScore({
      landholdingCategory: landCategory,
      sowingDate: sowingDate,
      isVerified: true
    });
  }

  function renderContent() {
    const unitPrice = item.subsidized_price;
    const totalAmount = selectedQty * unitPrice;
    const marketAmount = selectedQty * item.market_price;
    const totalSavings = Math.max(0, marketAmount - totalAmount);
    const priorityScore = computeLivePriority();

    // SUCCESS TOKEN PASS VIEW
    if (isConfirmed && confirmedBooking) {
      container.innerHTML = `
        <div class="modal-overlay" id="procurement-modal-backdrop">
          <div class="modal-container" style="max-width: 620px; padding: 2rem 1.75rem; text-align:center;">
            <!-- Brand & Success Badge -->
            <img 
              src="/logo.png" 
              alt="FarmDirect" 
              style="width:52px; height:52px; object-fit:contain; margin:0 auto 0.5rem auto; display:block;"
            />
            <div style="display:inline-flex; align-items:center; gap:6px; background:#dcfce7; color:#15803d; font-size:0.85rem; font-weight:800; padding:4px 14px; border-radius:9999px; margin-bottom:1rem; border:1px solid #86efac;">
              <span>✓</span>
              <span>${currentLang === 'hi' ? 'आवंटन एवं टोकन जारी' : 'Allocation & Token Confirmed'}</span>
            </div>

            <h3 style="font-size:1.45rem; font-weight:900; color:#0f172a; margin-bottom:0.25rem;">
              ${confirmedBooking.item_name}
            </h3>
            <p style="font-size:0.85rem; color:#64748b; margin-bottom:1.5rem;">
              ${currentLang === 'hi' ? 'आपका सरकारी सब्सिडी टोकन तैयार है। भौतिक कतार में लगने की आवश्यकता नहीं है।' : 'Your digital procurement token has been generated. No need to stand in physical lines.'}
            </p>

            <!-- Digital Token Pass Card -->
            <div style="background:linear-gradient(135deg, #14532d, #15803d); color:#ffffff; border-radius:16px; padding:1.5rem; text-align:left; position:relative; overflow:hidden; box-shadow:0 10px 25px rgba(22,163,74,0.3); margin-bottom:1.5rem;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem;">
                <div>
                  <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:#bbf7d0; font-weight:700; display:block;">
                    ${currentLang === 'hi' ? 'डिजिटल मंडी टोकन' : 'Government Mandi Token'}
                  </span>
                  <div style="font-size:2.2rem; font-weight:900; letter-spacing:-0.5px; line-height:1.1; margin-top:2px;">
                    #${confirmedBooking.token_number}
                  </div>
                </div>
                <div style="background:rgba(255,255,255,0.2); backdrop-filter:blur(8px); padding:6px 12px; border-radius:8px; text-align:right;">
                  <span style="font-size:0.7rem; color:#dcfce7; display:block;">${t('priorityScoreLabel')}</span>
                  <span style="font-size:1.2rem; font-weight:900; color:#ffffff;">${confirmedBooking.priority_score}/100</span>
                </div>
              </div>

              <!-- Pass Grid -->
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; font-size:0.82rem; background:rgba(0,0,0,0.15); padding:1rem; border-radius:12px; border:1px solid rgba(255,255,255,0.15);">
                <div>
                  <span style="color:#bbf7d0; font-size:0.72rem; display:block;">${t('allocatedCenterLabel')}</span>
                  <strong style="color:#ffffff;">${confirmedBooking.distribution_center}</strong>
                </div>
                <div>
                  <span style="color:#bbf7d0; font-size:0.72rem; display:block;">${t('pickupSlotLabel')}</span>
                  <strong style="color:#fef08a;">${confirmedBooking.pickup_date}</strong>
                </div>
                <div>
                  <span style="color:#bbf7d0; font-size:0.72rem; display:block;">Assigned Counter</span>
                  <strong style="color:#ffffff;">${confirmedBooking.pickup_counter}</strong>
                </div>
                <div>
                  <span style="color:#bbf7d0; font-size:0.72rem; display:block;">Subsidized Total</span>
                  <strong style="color:#86efac; font-size:0.95rem;">₹${confirmedBooking.total_amount} (Saved ₹${confirmedBooking.subsidy_savings})</strong>
                </div>
              </div>

              <!-- Live Queue Position Alert -->
              <div style="margin-top:1rem; padding:0.6rem 0.85rem; background:rgba(255,255,255,0.12); border-radius:8px; font-size:0.75rem; display:flex; align-items:center; justify-content:space-between;">
                <span>🟢 Serving Token: <strong>#${confirmedBooking.currently_serving_token}</strong></span>
                <span>Queue Pos: <strong>${confirmedBooking.queue_position} ahead (~${confirmedBooking.estimated_wait_minutes}m)</strong></span>
              </div>
            </div>

            <!-- Actions -->
            <button id="btn-done-procurement" class="btn-primary-green" style="width:100%; padding:0.8rem; font-size:0.95rem; font-weight:800; border-radius:10px;">
              ${currentLang === 'hi' ? 'मेरी बुकिंग सूची देखें' : 'View My Procurements & Tokens'}
            </button>
          </div>
        </div>
      `;

      container.querySelector('#btn-done-procurement').addEventListener('click', () => {
        onBookingConfirmed(confirmedBooking);
      });
      return;
    }

    // FORM VIEW
    container.innerHTML = `
      <div class="modal-overlay" id="procurement-modal-backdrop">
        <div class="modal-container" style="max-width: 660px; padding: 1.75rem;">
          <!-- Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; border-bottom:1px solid #e2e8f0; padding-bottom:0.75rem;">
            <div style="display:flex; align-items:center; gap:0.6rem;">
              <span style="font-size:1.6rem;">${item.icon || '🚜'}</span>
              <div>
                <h3 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin:0;">
                  ${currentLang === 'hi' && item.name_hi ? item.name_hi : item.name}
                </h3>
                <span style="font-size:0.75rem; color:#15803d; font-weight:600;">
                  ${item.spec} • ${item.distribution_center}
                </span>
              </div>
            </div>
            <button id="btn-close-proc-modal" class="btn-close-modal">
              <span style="width:18px; height:18px; display:inline-block;">${Icons.x}</span>
            </button>
          </div>

          <!-- Price & Quota Banner -->
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:0.9rem 1.1rem; margin-bottom:1.25rem; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <span style="font-size:0.72rem; color:#64748b; text-transform:uppercase; font-weight:700; display:block;">${t('subsidyRate')}</span>
              <div style="font-size:1.4rem; font-weight:900; color:#15803d;">
                ₹${item.subsidized_price} <span style="font-size:0.8rem; font-weight:500; color:#475569;">/ ${item.unit}</span>
              </div>
              <span style="font-size:0.75rem; color:#94a3b8; text-decoration:line-through;">
                Open Market: ₹${item.market_price}
              </span>
            </div>

            <div style="text-align:right;">
              <span style="font-size:0.72rem; color:#64748b; font-weight:700; display:block;">${t('quotaRemaining')}</span>
              <span style="font-size:1.25rem; font-weight:800; color:#0f172a;">
                ${item.available_quota} / ${item.total_quota} ${item.unit}
              </span>
              <span style="font-size:0.72rem; color:#d97706; font-weight:600; display:block;">
                Max ${item.max_per_farmer} ${item.unit}/farmer
              </span>
            </div>
          </div>

          <!-- Quantity Selector -->
          <div style="margin-bottom:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
              <label style="font-size:0.82rem; font-weight:700; color:#0f172a;">
                ${currentLang === 'hi' ? 'आवश्यक मात्रा चुनें' : 'Select Required Quantity'} (${item.unit})
              </label>
              <span style="font-size:0.78rem; font-weight:700; color:#15803d;" id="proc-qty-display">
                ${selectedQty} ${item.unit}
              </span>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <input 
                type="range" 
                id="input-proc-qty" 
                min="1" 
                max="${item.max_per_farmer || 15}" 
                value="${selectedQty}" 
                style="flex:1; accent-color:#16a34a; cursor:pointer;"
              />
              <span style="font-size:0.9rem; font-weight:800; min-width:40px; text-align:center; color:#0f172a;">
                ${selectedQty}
              </span>
            </div>
            <p style="font-size:0.72rem; color:#64748b; margin-top:4px;">
              ${t('fairQuotaCapNotice')}
            </p>
          </div>

          <!-- Priority Factors: Landholding & Sowing Date -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.25rem;">
            <div>
              <label style="font-size:0.8rem; font-weight:700; color:#0f172a; display:block; margin-bottom:0.3rem;">
                ${t('landSizeLabel')} *
              </label>
              <select id="select-land-category" style="width:100%; padding:0.6rem; border:1px solid #cbd5e1; border-radius:8px; font-size:0.8rem; background:#ffffff;">
                <option value="marginal" ${landCategory === 'marginal' ? 'selected' : ''}>${t('marginalFarmer')} (+40 pts)</option>
                <option value="small" ${landCategory === 'small' ? 'selected' : ''}>${t('smallFarmer')} (+30 pts)</option>
                <option value="medium" ${landCategory === 'medium' ? 'selected' : ''}>${t('mediumFarmer')} (+20 pts)</option>
                <option value="large" ${landCategory === 'large' ? 'selected' : ''}>${t('largeFarmer')} (+10 pts)</option>
              </select>
            </div>

            <div>
              <label style="font-size:0.8rem; font-weight:700; color:#0f172a; display:block; margin-bottom:0.3rem;">
                ${t('sowingDateLabel')} *
              </label>
              <input 
                type="date" 
                id="input-sowing-date" 
                value="${sowingDate}" 
                style="width:100%; padding:0.55rem; border:1px solid #cbd5e1; border-radius:8px; font-size:0.8rem;"
              />
            </div>
          </div>

          <!-- Live Priority Score Card -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:0.85rem; margin-bottom:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span style="font-size:0.75rem; font-weight:700; color:#475569;">
                  🎯 ${currentLang === 'hi' ? 'अनुमानित कतार प्राथमिकता' : 'Estimated Queue Priority'}
                </span>
                <div style="font-size:0.72rem; color:#64748b;">
                  Based on smallholder status & sowing urgency
                </div>
              </div>
              <div style="text-align:right;">
                <span style="font-size:1.2rem; font-weight:900; color:#15803d;" id="live-priority-val">
                  ${priorityScore}/100
                </span>
                <span style="display:block; font-size:0.68rem; font-weight:700; color:#16a34a;">High Allocation Band</span>
              </div>
            </div>
          </div>

          <!-- Total Calculation Bar -->
          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem 0; border-top:1px solid #e2e8f0; margin-bottom:1rem;">
            <div>
              <span style="font-size:0.75rem; color:#64748b; display:block;">Total Payable (At Center)</span>
              <span style="font-size:1.35rem; font-weight:900; color:#15803d;">₹${totalAmount}</span>
            </div>
            <div style="text-align:right;">
              <span style="font-size:0.72rem; color:#64748b; display:block;">Subsidy Benefit</span>
              <span style="font-size:0.95rem; font-weight:800; color:#16a34a;">+₹${totalSavings} Saved</span>
            </div>
          </div>

          <!-- CTA Submit Button -->
          <button id="btn-submit-prebook" class="btn-primary-green" style="width:100%; padding:0.8rem; font-size:0.95rem; font-weight:800; border-radius:10px;">
            ${t('btnPreBookNow')} (${selectedQty} ${item.unit})
          </button>
        </div>
      </div>
    `;

    // Event Handlers
    container.querySelector('#btn-close-proc-modal')?.addEventListener('click', onClose);
    container.querySelector('#procurement-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'procurement-modal-backdrop') onClose();
    });

    const qtySlider = container.querySelector('#input-proc-qty');
    if (qtySlider) {
      qtySlider.addEventListener('input', (e) => {
        selectedQty = Number(e.target.value);
        renderContent();
      });
    }

    const landSelect = container.querySelector('#select-land-category');
    if (landSelect) {
      landSelect.addEventListener('change', (e) => {
        landCategory = e.target.value;
        renderContent();
      });
    }

    const dateInput = container.querySelector('#input-sowing-date');
    if (dateInput) {
      dateInput.addEventListener('change', (e) => {
        sowingDate = e.target.value;
        renderContent();
      });
    }

    const submitBtn = container.querySelector('#btn-submit-prebook');
    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Issuing Token & Allocating...';

        const bookingPayload = {
          item_id: item.id,
          farmer_id: farmerUser?.id,
          farmer_name: farmerUser?.name,
          farmer_phone: farmerUser?.phone,
          quantity: selectedQty,
          landholding_category: landCategory,
          land_area: landCategory === 'marginal' ? 'Marginal (< 1 Hectare)' : landCategory === 'small' ? 'Small Farmer (1-2 Hectares)' : 'Medium Farmer (2-5 Hectares)',
          sowing_date: sowingDate,
          distribution_center: item.distribution_center
        };

        const created = await FarmDirectApi.createProcurementBooking(bookingPayload);
        confirmedBooking = created;
        isConfirmed = true;
        renderContent();
      });
    }
  }

  renderContent();
}
