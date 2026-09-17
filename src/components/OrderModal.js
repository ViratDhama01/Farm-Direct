// 🌱 FarmDirect Order Flow Overlay Modal (Screen 8)
import { Icons } from '../lib/icons.js';
import { FarmDirectApi } from '../lib/supabase.js';
import { LanguageManager } from '../lib/translations.js';
import { resolveCropImages, getCropSvgFallback } from '../lib/cropImages.js';

export function renderOrderModal(container, { crop, quantity, currentUser, onClose, onOrderPlaced }) {
  const { t } = LanguageManager;
  let deliveryOption = 'Home Delivery';
  let deliveryFee = 40;
  let deliveryAddress = currentUser?.location || 'Meerut, Uttar Pradesh';
  let paymentMethod = 'UPI (PhonePe / GPay)';
  let isConfirmed = false;
  let confirmedOrder = null;

  const basePrice = quantity * crop.price_per_unit;

  function renderContent() {
    const totalAmount = basePrice + deliveryFee;

    if (isConfirmed && confirmedOrder) {
      container.innerHTML = `
        <div class="modal-overlay" id="order-backdrop">
          <div class="modal-container order-modal-container" style="text-align:center; padding:2rem 1.5rem;">
            <img 
              src="/logo.png" 
              alt="FarmDirect" 
              style="width:56px; height:56px; object-fit:contain; margin:0 auto 0.75rem auto; display:block; filter:drop-shadow(0 3px 8px rgba(22, 163, 74, 0.2));"
            />
            <div style="width:48px; height:48px; border-radius:50%; background:#dcfce7; color:#15803d; display:flex; align-items:center; justify-content:center; margin:0 auto 1rem auto;">
              <span style="width:28px; height:28px; display:inline-block;">${Icons.check}</span>
            </div>

            <h3 style="font-size:1.4rem; font-weight:800; color:#0f172a; margin-bottom:0.25rem;">${t('orderConfirmedTitle')}</h3>
            <p style="font-size:0.88rem; color:#64748b; margin-bottom:1.25rem;">
              ${t('orderConfirmedDesc')} <strong>#${confirmedOrder.id}</strong> ${t('orderConfirmedWithFarmer')} <strong>${crop.farmer_name}</strong>.
            </p>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem; text-align:left; margin-bottom:1.5rem; font-size:0.82rem;">
              <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem;">
                <span style="color:#64748b;">${t('orderSummaryProduce')}</span>
                <span style="font-weight:700; color:#0f172a;">${crop.title} (${quantity} kg)</span>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem;">
                <span style="color:#64748b;">${t('orderSummaryTotal')}</span>
                <span style="font-weight:800; color:#15803d;">₹${totalAmount}</span>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem;">
                <span style="color:#64748b;">${t('orderSummaryDelivery')}</span>
                <span style="font-weight:600;">${deliveryOption}</span>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span style="color:#64748b;">${t('orderSummaryStatus')}</span>
                <span style="color:#15803d; font-weight:700;">${t('orderStatusPreparing')}</span>
              </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:0.6rem;">
              <button id="btn-done-orders" class="btn-auth-full btn-auth-primary">
                ${t('btnViewMyOrders')}
              </button>
              <button id="btn-done-close" class="btn-auth-full btn-auth-outline">
                ${t('btnContinueBrowsing')}
              </button>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#btn-done-orders').addEventListener('click', () => {
        onOrderPlaced(confirmedOrder, true);
      });
      container.querySelector('#btn-done-close').addEventListener('click', () => {
        onOrderPlaced(confirmedOrder, false);
      });
      return;
    }

    container.innerHTML = `
      <div class="modal-overlay" id="order-backdrop">
        <div class="modal-container order-modal-container">
          <!-- Header -->
          <div class="order-modal-header" style="display:flex; align-items:center; justify-content:space-between;">
            <div style="display:flex; align-items:center; gap:8px;">
              <img src="/logo.png" alt="FarmDirect" style="width:24px; height:24px; object-fit:contain; border-radius:4px;" />
              <span>${t('placeOrderTitle')}</span>
            </div>
            <button id="btn-close-order-modal" class="btn-close-modal">
              <span style="width:18px; height:18px; display:inline-block;">${Icons.x}</span>
            </button>
          </div>

          <!-- Summary Box -->
          <div class="order-summary-card">
            <div class="order-summary-crop">
              <img
                src="${resolveCropImages(crop.title, crop.category, crop.images)[0]}"
                alt="${crop.title}"
                class="order-crop-thumb"
                onerror="this.onerror=null; this.src='${getCropSvgFallback(crop.title, crop.category)}'"
              />
              <div>
                <div style="font-weight:700; font-size:0.95rem; color:#0f172a;">${crop.title}</div>
                <div style="font-size:0.8rem; color:#64748b;">₹${crop.price_per_unit} / kg • ${quantity} kg</div>
              </div>
            </div>

            <div style="text-align:right;">
              <span style="font-size:0.75rem; color:#64748b; display:block;">${t('totalAmountLabel')}</span>
              <span style="font-size:1.4rem; font-weight:800; color:#15803d;">₹${totalAmount}</span>
            </div>
          </div>

          <!-- Delivery Option -->
          <div class="order-section-title">${t('deliveryOptionLabel')}</div>
          <div class="delivery-options-group">
            <div class="option-radio-card ${deliveryOption === 'Self Pickup' ? 'selected' : ''}" data-delivery="Self Pickup">
              <div class="radio-left">
                <input type="radio" name="delivery" ${deliveryOption === 'Self Pickup' ? 'checked' : ''} />
                <span>${t('deliverySelfPickup')}</span>
              </div>
              <span class="radio-cost-tag">${t('free')}</span>
            </div>

            <div class="option-radio-card ${deliveryOption === 'Home Delivery' ? 'selected' : ''}" data-delivery="Home Delivery">
              <div class="radio-left">
                <input type="radio" name="delivery" ${deliveryOption === 'Home Delivery' ? 'checked' : ''} />
                <span>${t('deliveryHomeDelivery')}</span>
              </div>
              <span class="radio-cost-tag">+₹40</span>
            </div>
          </div>

          <!-- Delivery Address -->
          <div class="order-section-title">${t('deliveryAddressLabel')}</div>
          <div class="address-box">
            <div style="display:flex; align-items:center; gap:0.4rem;">
              <span style="color:#15803d; width:16px; height:16px; display:inline-block;">${Icons.mapPin}</span>
              <span id="display-address-text" style="font-weight:500;">${deliveryAddress}</span>
            </div>
            <button id="btn-change-address" style="color:#15803d; font-weight:700; font-size:0.82rem;">${t('btnChangeAddress')}</button>
          </div>

          <!-- Payment Method -->
          <div class="order-section-title">${t('paymentMethodLabel')}</div>
          <div class="payment-options-group">
            <div class="option-radio-card ${paymentMethod.includes('UPI') ? 'selected' : ''}" data-payment="UPI (PhonePe / GPay)">
              <div class="radio-left">
                <input type="radio" name="payment" ${paymentMethod.includes('UPI') ? 'checked' : ''} />
                <span>${t('paymentUPI')}</span>
              </div>
            </div>

            <div class="option-radio-card ${paymentMethod.includes('Cash') ? 'selected' : ''}" data-payment="Cash on Delivery">
              <div class="radio-left">
                <input type="radio" name="payment" ${paymentMethod.includes('Cash') ? 'checked' : ''} />
                <span>${t('paymentCOD')}</span>
              </div>
            </div>

            <div class="option-radio-card ${paymentMethod.includes('Wallet') ? 'selected' : ''}" data-payment="Wallet">
              <div class="radio-left">
                <input type="radio" name="payment" ${paymentMethod.includes('Wallet') ? 'checked' : ''} />
                <span>${t('paymentWallet')}</span>
              </div>
            </div>
          </div>

          <!-- Confirm CTA -->
          <button id="btn-confirm-order" class="btn-auth-full btn-auth-primary" style="margin-top:0.5rem;">
            ${t('btnConfirmOrder')}
          </button>
        </div>
      </div>
    `;

    // Event listeners
    container.querySelector('#btn-close-order-modal').addEventListener('click', onClose);
    container.querySelector('#order-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'order-backdrop') onClose();
    });

    container.querySelectorAll('.delivery-options-group .option-radio-card').forEach(card => {
      card.addEventListener('click', () => {
        deliveryOption = card.dataset.delivery;
        deliveryFee = deliveryOption === 'Home Delivery' ? 40 : 0;
        renderContent();
      });
    });

    container.querySelectorAll('.payment-options-group .option-radio-card').forEach(card => {
      card.addEventListener('click', () => {
        paymentMethod = card.dataset.payment;
        renderContent();
      });
    });

    container.querySelector('#btn-change-address').addEventListener('click', () => {
      const newAddress = prompt('Enter your delivery address:', deliveryAddress);
      if (newAddress) {
        deliveryAddress = newAddress.trim();
        renderContent();
      }
    });

    container.querySelector('#btn-confirm-order').addEventListener('click', async () => {
      const orderPayload = {
        buyer_id: currentUser?.id || `buyer-${Date.now()}`,
        buyer_name: currentUser?.name || 'Buyer',
        buyer_phone: currentUser?.phone || '+91 98765 00000',
        farmer_id: crop.farmer_id,
        farmer_name: crop.farmer_name,
        crop_id: crop.id,
        crop_title: crop.title,
        crop_image: crop.images?.[0],
        quantity: quantity,
        unit: crop.unit || 'kg',
        unit_price: crop.price_per_unit,
        delivery_option: deliveryOption,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
        delivery_address: deliveryAddress,
        payment_method: paymentMethod
      };

      const created = await FarmDirectApi.createOrder(orderPayload);
      confirmedOrder = created;
      isConfirmed = true;
      renderContent();
    });
  }

  renderContent();
}
