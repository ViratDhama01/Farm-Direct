// 🌱 FarmDirect Listing Detail View (Modal / Page - Screens 7 & 9)
import { Icons } from '../lib/icons.js';
import { LanguageManager } from '../lib/translations.js';
import { resolveCropImages, getCropSvgFallback } from '../lib/cropImages.js';

export function renderListingDetailModal(container, { crop, currentUser, onClose, onOpenOrder, onEditCrop, onDeleteCrop }) {
  const { t } = LanguageManager;
  let selectedQuantity = Math.min(10, crop.quantity_available || 10);
  if (selectedQuantity <= 0) selectedQuantity = 1;

  const isFarmer = currentUser?.role === 'farmer';
  const isMyListing = Boolean(
    currentUser && (
      (crop.farmer_id && currentUser.id && String(crop.farmer_id) === String(currentUser.id)) ||
      (crop.farmer_name && currentUser.name && crop.farmer_name.trim().toLowerCase() === currentUser.name.trim().toLowerCase())
    )
  );

  const isOutOfStock = crop.status === 'out_of_stock' || (Number(crop.quantity_available) || 0) <= 0;

  const images = resolveCropImages(crop.title, crop.category, crop.images);
  const fallbackSvg = getCropSvgFallback(crop.title, crop.category);

  const intel = crop.price_intelligence || {
    current_market: Math.round(crop.price_per_unit * 0.95),
    nearby_avg: crop.price_per_unit,
    highest_market: Math.round(crop.price_per_unit * 1.2),
    trend: "Increasing (↑ 6%)"
  };

  const reviews = crop.reviews && crop.reviews.length > 0 ? crop.reviews : [
    {
      buyer_name: "Neha Verma",
      buyer_type: "Wholesale Buyer",
      date: "12 Aug 2025",
      rating: 5,
      comment: "Excellent quality! Fresh and clean produce, uniform grain size."
    }
  ];

  container.innerHTML = `
    <div class="modal-overlay" id="detail-modal-backdrop">
      <div class="modal-container" id="detail-modal-box">
        <!-- Top Navigation Header -->
        <div class="modal-header-nav">
          <button class="btn-back-feed" id="btn-back-feed-action">
            <span style="width:18px; height:18px; display:inline-block;">${Icons.arrowLeft}</span>
            <span>${t('backToFeed')}</span>
          </button>
          <button class="btn-close-modal" id="btn-close-detail">
            <span style="width:18px; height:18px; display:inline-block;">${Icons.x}</span>
          </button>
        </div>

        <!-- 3-Column Layout Matching Screen 7 -->
        <div class="listing-detail-grid">
          <!-- Col 1: Image Gallery -->
          <div>
            <img 
              id="detail-hero-img" 
              src="${images[0]}" 
              alt="${crop.title}" 
              class="gallery-main-img" 
              onerror="this.onerror=null; this.src='${fallbackSvg}'"
              style="${isOutOfStock ? 'filter: saturate(0.7);' : ''}"
            />
            <div class="gallery-thumbs">
              ${images.map((img, idx) => `
                <img 
                  src="${img}" 
                  class="gallery-thumb-item ${idx === 0 ? 'active' : ''}" 
                  data-thumb-idx="${idx}" 
                  alt="Thumb ${idx + 1}" 
                  onerror="this.onerror=null; this.src='${fallbackSvg}'"
                />
              `).join('')}
            </div>
          </div>

          <!-- Col 2: Produce & Farmer Details -->
          <div class="detail-center-col">
            <div>
              <div class="detail-crop-title">
                <span>${crop.title}</span>
                ${isOutOfStock ? `
                  <span class="detail-badge-fresh" style="background:#fee2e2; color:#dc2626; border:1px solid #fca5a5;">
                    🔴 ${t('outOfStockBadge') || 'Out of Stock'}
                  </span>
                ` : `
                  <span class="detail-badge-fresh">Fresh</span>
                `}
              </div>
              ${isOutOfStock ? `
                <div class="detail-qty-available" style="color:#dc2626; font-weight:700;">
                  0 ${crop.unit || 'kg'} • ${t('outOfStockBadge') || 'Out of Stock'}
                  <div style="font-size:0.75rem; color:#b91c1c; font-weight:600; margin-top:2px;">
                    ⏱️ ${t('outOfStockDesc') || 'Currently out of stock (Auto-unlists in 24h)'}
                  </div>
                </div>
              ` : `
                <div class="detail-qty-available">${crop.quantity_available} ${crop.unit || 'kg'} ${t('available')}</div>
              `}
            </div>

            <div class="detail-price-text">
              ₹${crop.price_per_unit} <span style="font-size:1rem; font-weight:500; color:#64748b;">/ ${crop.unit || 'kg'}</span>
            </div>

            <div class="detail-loc-text">
              <span style="color:#15803d;">${Icons.mapPin}</span>
              <span>${crop.location} • ${crop.distance_km || 12} km</span>
            </div>

            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span class="badge-grade" style="position:static; display:inline-flex;">
                ${Icons.check} ${crop.quality_grade || 'Grade A'}
              </span>
            </div>

            <!-- Farmer Profile Snippet Card -->
            <div class="farmer-profile-card">
              <div class="farmer-profile-info">
                <div class="farmer-profile-avatar-badge" style="width:44px; height:44px; border-radius:50%; background:#dcfce7; color:#15803d; display:flex; align-items:center; justify-content:center; font-size:1.4rem; border:1.5px solid #86efac; flex-shrink:0;">
                  👨‍🌾
                </div>
                <div>
                  <div style="font-weight:700; font-size:0.95rem; color:#0f172a;">${crop.farmer_name}</div>
                  <div style="font-size:0.8rem; color:#d97706; display:flex; align-items:center; gap:3px;">
                    <span style="width:13px; height:13px; display:inline-block;">${Icons.star}</span>
                    <span>${crop.farmer_rating || '4.6'}</span>
                    <span style="color:#94a3b8;">(${crop.farmer_reviews_count || '32'} reviews)</span>
                  </div>
                </div>
              </div>

              <button id="btn-view-farmer-profile" style="font-size:0.82rem; font-weight:600; color:#15803d;">
                View Profile
              </button>
            </div>

            <!-- About Produce -->
            <div>
              <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:0.4rem;">${t('aboutProduceLabel')}</h4>
              <p style="font-size:0.85rem; color:#475569; line-height:1.5;">
                ${crop.description || t('defaultProduceDesc')}
              </p>
            </div>

            <!-- Produce Tags -->
            <div class="produce-tags-list">
              <span class="produce-tag-item">🌿 ${t('tagOrganic')}</span>
              <span class="produce-tag-item">🛡️ ${t('tagPesticideFree')}</span>
              <span class="produce-tag-item">🚜 ${t('tagFarmFresh')}</span>
            </div>

            <!-- Reviews Section -->
            <div class="reviews-section">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                <h4 style="font-size:0.95rem; font-weight:700;">${t('reviewsLabel')} (${reviews.length})</h4>
                <a href="#" style="font-size:0.8rem; font-weight:600; color:#15803d;">${t('viewAllReviews')}</a>
              </div>

              ${reviews.map(rev => `
                <div class="review-item">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
                    <span style="font-weight:700; font-size:0.85rem; color:#0f172a;">${rev.buyer_name}</span>
                    <span style="font-size:0.75rem; color:#94a3b8;">${rev.date || '12 Aug 2025'}</span>
                  </div>
                  <div style="color:#d97706; font-size:0.75rem; display:flex; gap:2px; margin-bottom:0.25rem;">
                    ${'★'.repeat(rev.rating)}${'☆'.repeat(5 - rev.rating)}
                  </div>
                  <div style="font-size:0.82rem; color:#475569;">${rev.comment}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Col 3: Role-Specific Action & Price Intelligence Column -->
          <div class="detail-right-col">
            <!-- Price Intelligence Card (Coming Soon) -->
            <div class="price-intelligence-card" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem;">
              <div class="intel-title" style="margin-bottom:0.5rem; display:flex; align-items:center; justify-content:space-between;">
                <div style="display:flex; align-items:center; gap:6px;">
                  <span style="color:#15803d; width:16px; height:16px; display:inline-block;">${Icons.trendingUp}</span>
                  <span style="font-size:0.88rem; font-weight:700;">${t('priceIntelligenceLabel')}</span>
                </div>
                <span style="font-size:0.7rem; font-weight:700; background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:9999px; border:1px solid #bbf7d0;">
                  ${t('badgeComingSoon')}
                </span>
              </div>

              <p style="font-size:0.8rem; color:#64748b; line-height:1.45; margin-bottom:0.65rem;">
                ${t('priceIntelModalDesc')}
              </p>

              <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
                <span style="font-size:0.72rem; font-weight:600; background:#ffffff; border:1px solid #cbd5e1; color:#334155; padding:2px 7px; border-radius:6px;">
                  ⚡ ${t('priceIntelPillEnam')}
                </span>
                <span style="font-size:0.72rem; font-weight:600; background:#ffffff; border:1px solid #cbd5e1; color:#334155; padding:2px 7px; border-radius:6px;">
                  📈 ${t('priceIntelPillAi')}
                </span>
              </div>
            </div>

            <!-- CONDITION 1: OWNER FARMER'S OWN LISTING -->
            ${isMyListing ? `
              <div style="background:${isOutOfStock ? '#fef2f2' : '#f0fdf4'}; border:1.5px solid ${isOutOfStock ? '#fca5a5' : '#bbf7d0'}; border-radius:14px; padding:1.15rem; display:flex; flex-direction:column; gap:0.75rem;">
                <div style="display:flex; align-items:center; justify-content:space-between;">
                  <span style="font-size:0.9rem; font-weight:800; color:${isOutOfStock ? '#991b1b' : '#14532d'};">👨‍🌾 ${t('yourActiveListing')}</span>
                  <span style="font-size:0.72rem; font-weight:700; background:${isOutOfStock ? '#fee2e2' : '#dcfce7'}; color:${isOutOfStock ? '#dc2626' : '#15803d'}; padding:2px 8px; border-radius:9999px; border:1px solid ${isOutOfStock ? '#fca5a5' : '#86efac'};">
                    ● ${isOutOfStock ? (t('outOfStockBadge') || 'Out of Stock') : t('badgeLiveMarket')}
                  </span>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; background:#ffffff; padding:0.75rem; border-radius:10px; border:1px solid #e2e8f0;">
                  <div>
                    <div style="font-size:0.72rem; color:#64748b;">${t('available')}</div>
                    <div style="font-size:0.95rem; font-weight:800; color:${isOutOfStock ? '#dc2626' : '#0f172a'};">${crop.quantity_available} ${crop.unit || 'kg'}</div>
                  </div>
                  <div>
                    <div style="font-size:0.72rem; color:#64748b;">Unit Price</div>
                    <div style="font-size:0.95rem; font-weight:800; color:#15803d;">₹${crop.price_per_unit} / kg</div>
                  </div>
                </div>

                <div class="total-price-display" style="background:#ffffff; padding:0.6rem 0.85rem; border-radius:8px; border:1px solid #e2e8f0; margin:0;">
                  <span style="color:#64748b; font-size:0.8rem;">${t('totalBatchValue')}</span>
                  <span class="total-price-val" style="font-size:1.1rem; color:${isOutOfStock ? '#64748b' : '#15803d'};">₹${(crop.quantity_available * crop.price_per_unit).toLocaleString()}</span>
                </div>

                ${isOutOfStock ? `
                  <div style="background:#fee2e2; border:1px solid #fca5a5; border-radius:8px; padding:0.65rem 0.8rem; font-size:0.78rem; color:#991b1b; line-height:1.4;">
                    ⚠️ ${t('outOfStockWarning') || 'This produce is currently out of stock. It will be unlisted after 24h if not restocked.'}
                    ${crop.hours_until_unlisted ? `<div style="font-weight:700; margin-top:3px;">⏱️ ${t('autoUnlistingIn')} ${crop.hours_until_unlisted} ${t('hoursRemaining') || 'hours'}</div>` : ''}
                  </div>
                ` : `
                  <p style="font-size:0.78rem; color:#475569; line-height:1.4; margin:0;">
                    ${t('farmerOwnListingNote')}
                  </p>
                `}

                <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.25rem;">
                  <button id="btn-edit-this-listing" style="width:100%; padding:0.65rem; background:#15803d; border:1px solid #166534; color:#ffffff; border-radius:8px; font-weight:700; font-size:0.85rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">
                    <span>✏️</span> <span>${isOutOfStock ? 'Restock / Edit Quantity' : t('btnEditListing')}</span>
                  </button>
                  <button id="btn-delete-this-listing" style="width:100%; padding:0.65rem; background:#fee2e2; border:1px solid #fca5a5; color:#dc2626; border-radius:8px; font-weight:700; font-size:0.82rem; cursor:pointer;">
                    🗑️ ${t('btnDeleteListing')}
                  </button>
                </div>
              </div>
            ` : isFarmer ? `
              <!-- CONDITION 2: FARMER BROWSING ANOTHER FARMER'S PRODUCE -->
              <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:14px; padding:1.15rem; display:flex; flex-direction:column; gap:0.75rem;">
                <div style="display:flex; align-items:center; justify-content:space-between;">
                  <span style="font-size:0.88rem; font-weight:800; color:#334155;">🌾 Wholesale Lot Info</span>
                  <span style="font-size:0.7rem; font-weight:700; background:#f1f5f9; color:#475569; padding:2px 8px; border-radius:9999px; border:1px solid #cbd5e1;">
                    ${t('badgeFarmerView')}
                  </span>
                </div>

                <div style="background:#ffffff; padding:0.75rem; border-radius:10px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <div style="font-size:0.72rem; color:#64748b;">Wholesale Price</div>
                    <div style="font-size:1.15rem; font-weight:800; color:#15803d;">₹${crop.price_per_unit} <span style="font-size:0.8rem; font-weight:500; color:#64748b;">/ kg</span></div>
                  </div>
                  <div style="text-align:right;">
                    <div style="font-size:0.72rem; color:#64748b;">Lot Quantity</div>
                    <div style="font-size:0.95rem; font-weight:700; color:${isOutOfStock ? '#dc2626' : '#0f172a'};">${crop.quantity_available} kg</div>
                  </div>
                </div>

                ${isOutOfStock ? `
                  <div style="background:#fee2e2; border:1px solid #fca5a5; border-radius:8px; padding:0.65rem 0.8rem; font-size:0.78rem; color:#991b1b; line-height:1.4;">
                    🔴 ${t('outOfStockBadge') || 'Out of Stock'}. (${t('autoUnlistingIn')} 24h).
                  </div>
                ` : `
                  <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:8px; padding:0.65rem 0.8rem; font-size:0.78rem; color:#065f46; line-height:1.4;">
                    ${t('farmerViewingOtherNote')}
                  </div>
                `}

                <button class="btn-place-order-large" id="btn-contact-farmer-direct" style="background:#15803d; color:#ffffff; font-weight:700; font-size:0.88rem;">
                  📞 ${t('btnContactFarmer')} (${crop.farmer_phone || '+91 98765 00000'})
                </button>
              </div>
            ` : isOutOfStock ? `
              <!-- CONDITION 3A: BUYER VIEW WHEN OUT OF STOCK -->
              <div style="background:#fef2f2; border:1.5px solid #fca5a5; border-radius:14px; padding:1.15rem; display:flex; flex-direction:column; gap:0.75rem;">
                <div style="display:flex; align-items:center; gap:6px;">
                  <span style="font-size:1.1rem;">🔴</span>
                  <span style="font-weight:800; font-size:0.95rem; color:#991b1b;">${t('outOfStockBadge') || 'Out of Stock'}</span>
                </div>

                <p style="font-size:0.8rem; color:#7f1d1d; line-height:1.45; margin:0;">
                  ${t('outOfStockWarning') || 'This produce item is currently out of stock. You can contact the farmer directly for upcoming harvest availability.'}
                </p>

                ${crop.hours_until_unlisted ? `
                  <div style="font-size:0.75rem; font-weight:700; color:#b91c1c; background:#fee2e2; padding:4px 8px; border-radius:6px;">
                    ⏱️ ${t('autoUnlistingIn')} ${crop.hours_until_unlisted} ${t('hoursRemaining') || 'hours'}
                  </div>
                ` : ''}

                <button class="btn-place-order-large" disabled style="background:#e2e8f0; color:#94a3b8; font-weight:700; cursor:not-allowed; border:none; box-shadow:none;">
                  🔴 ${t('btnOutOfStock') || 'Out of Stock'}
                </button>

                <button class="btn-contact-farmer-outline" id="btn-contact-farmer">
                  📞 ${t('btnContactFarmer')} (${crop.farmer_phone || '+91 98765 12340'})
                </button>
              </div>
            ` : `
              <!-- CONDITION 3B: NORMAL BUYER ORDER FLOW -->
              <div>
                <label style="font-size:0.82rem; font-weight:700; color:#0f172a; margin-bottom:0.4rem; display:block;">
                  ${t('selectQuantityLabel')}
                </label>
                <div class="qty-counter-box">
                  <button class="qty-btn" id="qty-minus-btn">-</button>
                  <span class="qty-display" id="qty-display-text">${selectedQuantity} kg</span>
                  <button class="qty-btn" id="qty-plus-btn">+</button>
                </div>
              </div>

              <!-- Total Price Calculation -->
              <div class="total-price-display">
                <span style="color:#64748b;">${t('totalPriceLabel')}</span>
                <span class="total-price-val" id="detail-total-price">₹${selectedQuantity * crop.price_per_unit}</span>
              </div>

              <!-- CTA Buttons -->
              <button class="btn-place-order-large" id="btn-trigger-order">
                ${t('btnPlaceOrder')}
              </button>

              <button class="btn-contact-farmer-outline" id="btn-contact-farmer">
                ${t('btnContactFarmer')} (${crop.farmer_phone || '+91 98765 12340'})
              </button>
            `}
          </div>
        </div>
      </div>
    </div>
  `;

  // Gallery Thumbnail Clicks
  const heroImg = container.querySelector('#detail-hero-img');
  const thumbs = container.querySelectorAll('.gallery-thumb-item');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      heroImg.src = thumb.src;
    });
  });

  // Quantity +/- Logic (Only present for buyers)
  const qtyMinus = container.querySelector('#qty-minus-btn');
  const qtyPlus = container.querySelector('#qty-plus-btn');
  const qtyDisplay = container.querySelector('#qty-display-text');
  const totalPriceDisplay = container.querySelector('#detail-total-price');

  if (qtyMinus && qtyPlus && qtyDisplay && totalPriceDisplay) {
    function updateTotals() {
      qtyDisplay.innerText = `${selectedQuantity} kg`;
      totalPriceDisplay.innerText = `₹${selectedQuantity * crop.price_per_unit}`;
    }

    qtyMinus.addEventListener('click', () => {
      if (selectedQuantity > 5) {
        selectedQuantity -= 5;
        updateTotals();
      }
    });

    qtyPlus.addEventListener('click', () => {
      if (selectedQuantity < crop.quantity_available) {
        selectedQuantity += 5;
        updateTotals();
      }
    });
  }

  // Close actions
  container.querySelector('#btn-back-feed-action').addEventListener('click', onClose);
  container.querySelector('#btn-close-detail').addEventListener('click', onClose);
  container.querySelector('#detail-modal-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'detail-modal-backdrop') onClose();
  });

  // Buyer Order trigger
  const triggerOrderBtn = container.querySelector('#btn-trigger-order');
  if (triggerOrderBtn) {
    triggerOrderBtn.addEventListener('click', () => {
      onOpenOrder(crop, selectedQuantity);
    });
  }

  // Edit Listing Action (Owner Farmer)
  const editListingBtn = container.querySelector('#btn-edit-this-listing');
  if (editListingBtn) {
    editListingBtn.addEventListener('click', () => {
      onClose();
      if (onEditCrop) {
        onEditCrop(crop);
      }
    });
  }

  // Delete Listing Action (Owner Farmer)
  const deleteListingBtn = container.querySelector('#btn-delete-this-listing');
  if (deleteListingBtn) {
    deleteListingBtn.addEventListener('click', async () => {
      if (confirm(t('confirmDeleteCrop'))) {
        if (onDeleteCrop) {
          await onDeleteCrop(crop.id);
        }
        onClose();
      }
    });
  }

  // Contact farmer actions
  const contactBuyerBtn = container.querySelector('#btn-contact-farmer');
  if (contactBuyerBtn) {
    contactBuyerBtn.addEventListener('click', () => {
      alert(`${t('contactFarmerAlert')} ${crop.farmer_name} at ${crop.farmer_phone || '+91 98765 12340'} ${t('contactFarmerReason') || ''}.`);
    });
  }

  const contactFarmerDirectBtn = container.querySelector('#btn-contact-farmer-direct');
  if (contactFarmerDirectBtn) {
    contactFarmerDirectBtn.addEventListener('click', () => {
      alert(`${t('contactFarmerAlert')} ${crop.farmer_name} at ${crop.farmer_phone || '+91 98765 00000'} for mandi wholesale inquiry.`);
    });
  }

  container.querySelector('#btn-view-farmer-profile').addEventListener('click', () => {
    alert(`${t('farmerProfileTitle')}: ${crop.farmer_name}\n${t('farmerProfileLoc')}: ${crop.location}\n${t('farmerProfileVerified')}.\n${t('farmerProfileRating')}: ${crop.farmer_rating} / 5.0`);
  });
}

