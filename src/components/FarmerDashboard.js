// 🌱 FarmDirect Farmer Management, Procurements & Intelligence Dashboard
import { Icons } from '../lib/icons.js';
import { FarmDirectApi } from '../lib/supabase.js';
import { LanguageManager } from '../lib/translations.js';
import { resolveCropImages, getCropSvgFallback } from '../lib/cropImages.js';
import { renderProcurementBookingModal } from './ProcurementBookingModal.js';
import { renderPriceIntelligenceView } from './PriceIntelligenceView.js';

export function renderFarmerDashboard(container, { farmerUser, onOpenAddCrop, onEditCrop, onSelectCrop }) {
  const { t } = LanguageManager;
  const currentLang = LanguageManager.getCurrentLanguage();

  let activeTab = sessionStorage.getItem('farmdirect_farmer_active_tab') || 'my_listings';
  let farmerCrops = [];
  let allMarketCrops = [];
  let incomingOrders = [];
  let procurementItems = [];
  let farmerBookings = [];
  let selectedProcCat = 'All';
  let activeModalItem = null;

  async function loadDataAndRender() {
    farmerCrops = await FarmDirectApi.getFarmerCrops(farmerUser?.id, farmerUser?.name);
    allMarketCrops = await FarmDirectApi.getCrops();
    incomingOrders = await FarmDirectApi.getFarmerOrders(farmerUser?.id, farmerUser?.name);
    procurementItems = await FarmDirectApi.getProcurementCatalog(selectedProcCat);
    farmerBookings = await FarmDirectApi.getFarmerProcurementBookings(farmerUser?.id);

    // Dynamic stats computation for current farmer
    const totalProduce = farmerCrops.reduce((acc, c) => acc + (Number(c.quantity_available) || 0), 0);
    const totalSold = incomingOrders.reduce((acc, o) => acc + (Number(o.quantity) || 0), 0);
    const totalRevenue = incomingOrders.reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0);

    const activeTokensCount = farmerBookings.filter(b => b.status === 'Confirmed').length;

    container.innerHTML = `
      <div class="farmer-layout">
        <!-- Farmer Sidebar (Matches Screen 10) -->
        <aside class="farmer-sidebar">
          <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:1.25rem; padding-bottom:0.75rem; border-bottom:1px solid #e2e8f0;">
            <img 
              src="/logo.png" 
              alt="FarmDirect Logo" 
              style="width:34px; height:34px; border-radius:8px; object-fit:contain; box-shadow:0 2px 6px rgba(22, 163, 74, 0.2);"
            />
            <div>
              <div style="font-weight:900; font-size:1.05rem; color:#14532d; letter-spacing:-0.3px;">FarmDirect</div>
              <div style="font-size:0.7rem; color:#64748b; font-weight:600;">${t('farmerPortalLabel')}</div>
            </div>
          </div>
          <nav class="farmer-nav-list">
            <button class="farmer-nav-item ${activeTab === 'home_feed' ? 'active' : ''}" data-tab="home_feed">
              <span>${Icons.home}</span>
              <span>${t('navHomeFeed')}</span>
            </button>

            <button class="farmer-nav-item ${activeTab === 'my_listings' ? 'active' : ''}" data-tab="my_listings">
              <span>${Icons.list}</span>
              <span>${t('navMyListings')} (${farmerCrops.length})</span>
            </button>

            <button class="farmer-nav-item ${activeTab === 'my_orders' ? 'active' : ''}" data-tab="my_orders">
              <span>${Icons.packageCheck}</span>
              <span>${t('navMyOrders')} (${incomingOrders.length})</span>
            </button>

            <!-- 🚜 Farmer Procurements Tab -->
            <button class="farmer-nav-item ${activeTab === 'procurements' ? 'active' : ''}" data-tab="procurements" style="${activeTab === 'procurements' ? 'background:#f0fdf4; color:#15803d; font-weight:800;' : ''}">
              <span style="font-size:1.1rem;">🚜</span>
              <span style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                <span>${t('navProcurements')}</span>
                ${activeTokensCount > 0 ? `<span style="font-size:0.68rem; font-weight:800; background:#16a34a; color:#ffffff; padding:1px 7px; border-radius:9999px;">${activeTokensCount}</span>` : ''}
              </span>
            </button>

            <button class="farmer-nav-item ${activeTab === 'ai_intel' ? 'active' : ''}" data-tab="ai_intel" style="${activeTab === 'ai_intel' ? 'background:#f0fdf4; color:#15803d; font-weight:800;' : ''}">
              <span>${Icons.trendingUp}</span>
              <span style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                <span>${t('navPriceIntel')}</span>
                <span style="font-size:0.68rem; font-weight:800; background:#dcfce7; color:#15803d; padding:1px 7px; border-radius:9999px; border:1px solid #86efac;">AI LIVE</span>
              </span>
            </button>
          </nav>

          <!-- Quick Farm Verification Card -->
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:0.85rem; font-size:0.78rem;">
            <div style="font-weight:700; color:#15803d; display:flex; align-items:center; gap:4px; margin-bottom:4px;">
              <span>${Icons.check}</span> ${t('verifiedFarmer')}
            </div>
            <div style="color:#334155;">${t('enamNode')}: Meerut Mandi</div>
            <div style="color:#64748b; font-size:0.72rem; margin-top:2px;">ID: #FD-FRM-${farmerUser?.id?.slice(-5) || '9218'}</div>
          </div>
        </aside>

        <!-- Farmer Main Area -->
        <main class="main-content" style="flex:1;">
          <!-- Top Action Bar -->
          <div class="farmer-action-bar">
            <div>
              <h2 style="font-size:1.4rem; font-weight:800; color:#0f172a;">
                ${activeTab === 'my_listings' ? t('dashMyListings') :
                  activeTab === 'my_orders' ? t('dashMyOrders') :
                  activeTab === 'procurements' ? t('procurementHubTitle') :
                  activeTab === 'ai_intel' ? t('dashPriceIntel') : t('dashHomeFeed')}
              </h2>
              <p style="font-size:0.85rem; color:#64748b;">
                ${t('dashWelcome')} ${farmerUser?.name} • ${farmerUser?.location}
              </p>
            </div>

            <button id="btn-add-crop-action" class="btn-primary-green" style="font-size:0.92rem; padding:0.7rem 1.4rem;">
              <span style="width:16px; height:16px; display:inline-block;">${Icons.plus}</span>
              ${t('btnAddCrop')}
            </button>
          </div>

          <!-- Farmer Analytics Dashboard Cards (Matches Section 13 in Requirements) -->
          <div class="analytics-cards-grid">
            <div class="analytics-stat-card">
              <div class="stat-header">${t('statTotalProduce')}</div>
              <div class="stat-value">${totalProduce.toLocaleString()} <span style="font-size:1rem; font-weight:500; color:#64748b;">kg</span></div>
              <div class="stat-trend">${t('statProduceTrend')}</div>
            </div>

            <div class="analytics-stat-card">
              <div class="stat-header">${t('statProduceSold')}</div>
              <div class="stat-value">${totalSold.toLocaleString()} <span style="font-size:1rem; font-weight:500; color:#64748b;">kg</span></div>
              <div class="stat-trend" style="color:#15803d;">↑ 72% ${t('statFulfillment')}</div>
            </div>

            <div class="analytics-stat-card">
              <div class="stat-header">${t('statRemainingStock')}</div>
              <div class="stat-value">${farmerCrops.reduce((a, c) => a + c.quantity_available, 0)} <span style="font-size:1rem; font-weight:500; color:#64748b;">kg</span></div>
              <div class="stat-trend" style="color:#d97706;">${t('statStockReady')}</div>
            </div>

            <div class="analytics-stat-card">
              <div class="stat-header">${t('statTotalRevenue')}</div>
              <div class="stat-value" style="color:#15803d;">₹${totalRevenue.toLocaleString()}</div>
              <div class="stat-trend">${t('statAvgRealised')}</div>
            </div>
          </div>

          <!-- AI Decision Support Banner (From Section 7 & 8) -->
          <div class="ai-advice-banner">
            <div class="ai-advice-content">
              <h4>
                <span style="width:18px; height:18px; display:inline-block;">${Icons.trendingUp}</span>
                ${t('aiAdviceTitle')}
              </h4>
              <p>
                ${t('aiAdviceDesc')} <strong style="color:#15803d;">${t('aiAdviceAction')}</strong>
              </p>
            </div>
            <button id="btn-quick-list-recommendation" style="background:#ffffff; color:#14532d; font-weight:700; font-size:0.82rem; padding:0.5rem 1rem; border-radius:8px; white-space:nowrap;">
              ${t('btnQuickList')}
            </button>
          </div>

          <!-- TAB CONTENT: MY LISTINGS -->
          ${activeTab === 'my_listings' ? `
            ${farmerCrops.length === 0 ? `
              <div style="padding: 3.5rem 1.5rem; text-align:center; background:#ffffff; border-radius:16px; border:1px solid #e2e8f0; box-shadow:var(--shadow-sm);">
                <span style="font-size:3.5rem; display:block; margin-bottom:0.75rem;">🌾</span>
                <h3 style="font-size:1.35rem; font-weight:800; color:#0f172a; margin-bottom:0.4rem;">${t('noProduceListed')}</h3>
                <p style="color:#64748b; font-size:0.92rem; max-width:480px; margin:0 auto 1.5rem auto;">
                  ${t('noProduceListedDesc')}
                </p>
                <button id="btn-empty-add-crop" class="btn-primary-green" style="margin:0 auto; font-size:0.95rem; padding:0.75rem 1.5rem;">
                  <span style="width:18px; height:18px; display:inline-block;">${Icons.plus}</span>
                  ${t('btnAddFirstCrop')}
                </button>
              </div>
            ` : `
            <div class="listings-grid">
              ${farmerCrops.map(crop => {
                const cropImgs = resolveCropImages(crop.title, crop.category, crop.images);
                const primaryImg = cropImgs[0];
                const fallbackSvg = getCropSvgFallback(crop.title, crop.category);
                const isOutOfStock = crop.status === 'out_of_stock' || (Number(crop.quantity_available) || 0) <= 0;
                const isUnlisted = crop.status === 'unlisted';

                return `
                <div class="crop-card ${isOutOfStock ? 'is-out-of-stock' : ''}" data-crop-id="${crop.id}" style="${isOutOfStock ? 'border-color:#fca5a5;' : ''}">
                  <div class="card-image-wrap">
                    <img 
                      src="${primaryImg}" 
                      alt="${crop.title}" 
                      class="card-img" 
                      loading="lazy" 
                      onerror="this.onerror=null; this.src='${fallbackSvg}'"
                      style="${isOutOfStock ? 'filter: saturate(0.65);' : ''}"
                    />
                    <div class="badge-grade">
                      ${Icons.check} ${crop.quality_grade || 'Grade A'}
                    </div>
                    ${isUnlisted ? `
                      <div class="badge-tag" style="background:#64748b;">⚪ ${t('unlistedBadge') || 'Unlisted (Zero Stock)'}</div>
                    ` : isOutOfStock ? `
                      <div class="badge-tag" style="background:#dc2626;">🔴 ${t('outOfStockBadge') || 'Out of Stock'}</div>
                    ` : `
                      <div class="badge-tag" style="background:#15803d;">${t('activeListing')}</div>
                    `}
                  </div>

                  <div class="card-body">
                    <div class="card-header-row">
                      <h3 class="card-title">${crop.title}</h3>
                    </div>

                    ${isUnlisted ? `
                      <div class="card-qty" style="color:#64748b; font-weight:700;">
                        ⚪ 0 ${crop.unit || 'kg'} (${t('unlistedBadge') || 'Unlisted'})
                      </div>
                    ` : isOutOfStock ? `
                      <div class="card-qty" style="color:#dc2626; font-weight:700;">
                        🔴 0 ${crop.unit || 'kg'} (${t('outOfStockBadge') || 'Out of Stock'})
                        ${crop.hours_until_unlisted ? `<span style="font-size:0.7rem; color:#b91c1c; font-weight:600; display:block; margin-top:2px;">⏱️ ${t('autoUnlistingIn')} ${crop.hours_until_unlisted}h</span>` : ''}
                      </div>
                    ` : `
                      <div class="card-qty">${crop.quantity_available?.toLocaleString()} ${crop.unit || 'kg'} ${t('inInventory')}</div>
                    `}

                    <div class="card-price-row">
                      <span class="card-price">₹${crop.price_per_unit}</span>
                      <span class="card-unit">/ ${crop.unit || 'kg'}</span>
                    </div>

                    <div class="card-location">
                      <span>${Icons.mapPin}</span>
                      <span>${crop.location}</span>
                    </div>

                    <div class="card-divider"></div>

                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <span style="font-size:0.75rem; color:#64748b;">${crop.harvest_date || t('harvestRecently')}</span>
                      <div style="display:flex; gap:0.4rem;">
                        <button class="btn-farmer-edit" data-edit-id="${crop.id}" style="padding:4px 10px; font-size:0.75rem; color:#15803d; border:1px solid #86efac; background:#f0fdf4; border-radius:6px; font-weight:700; cursor:pointer;">
                          ✏️ ${isOutOfStock || isUnlisted ? 'Restock' : (t('btnEditListing') || 'Edit')}
                        </button>
                        <button class="btn-farmer-delete" data-delete-id="${crop.id}" style="padding:4px 8px; font-size:0.75rem; color:#ef4444; border:1px solid #fecaca; border-radius:6px; font-weight:600; cursor:pointer;">
                          ${t('btnDeleteCrop')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                `;
              }).join('')}
            </div>
            `}
          ` : ''}

          <!-- TAB CONTENT: MY ORDERS (Incoming orders from buyers) -->
          ${activeTab === 'my_orders' ? `
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden; box-shadow:var(--shadow-sm);">
              ${incomingOrders.length === 0 ? `
                <div style="padding:3.5rem 1.5rem; text-align:center; color:#64748b;">
                  <span style="font-size:3rem; display:block; margin-bottom:0.5rem;">📦</span>
                  <h4 style="font-size:1.1rem; font-weight:700; color:#0f172a; margin-bottom:0.25rem;">No Incoming Orders Yet</h4>
                  <p style="font-size:0.85rem;">When buyers place orders on your produce, they will instantly appear here with live tracking.</p>
                </div>
              ` : `
              <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">
                  <thead>
                    <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; color:#64748b; font-weight:600;">
                      <th style="padding:1rem;">${t('orderIdLabel')}</th>
                      <th style="padding:1rem;">${t('buyerLabel')}</th>
                      <th style="padding:1rem;">${t('produceLabel')}</th>
                      <th style="padding:1rem;">${t('qtyLabel')}</th>
                      <th style="padding:1rem;">${t('totalLabel')} (₹)</th>
                      <th style="padding:1rem;">${t('statusLabel')}</th>
                      <th style="padding:1rem; min-width:180px;">${t('actionLabel')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${incomingOrders.map(order => {
                      const st = (order.status || 'placed').toLowerCase();
                      let badgeBg = 'background:#fef3c7; color:#b45309; border:1px solid #fde68a;';
                      let statusText = '🟡 Order Placed';

                      if (st.includes('deliver')) {
                        badgeBg = 'background:#dcfce7; color:#15803d; border:1px solid #86efac;';
                        statusText = '🎉 Delivered';
                      } else if (st.includes('out') || st.includes('transit') || st.includes('dispatch')) {
                        badgeBg = 'background:#ede9fe; color:#6d28d9; border:1px solid #c4b5fd;';
                        statusText = '🚚 Out for Delivery';
                      } else if (st.includes('confirm')) {
                        badgeBg = 'background:#dbeafe; color:#1d4ed8; border:1px solid #93c5fd;';
                        statusText = '✅ Confirmed';
                      } else if (st.includes('cancel') || st.includes('reject')) {
                        badgeBg = 'background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;';
                        statusText = '❌ Rejected';
                      }

                      return `
                      <tr style="border-bottom:1px solid #f1f5f9;">
                        <td style="padding:1rem; font-weight:700; color:#0f172a;">
                          #${order.id}
                          <div style="font-size:0.72rem; color:#94a3b8; font-weight:normal;">${order.date || 'Today'}</div>
                        </td>
                        <td style="padding:1rem;">
                          <div style="font-weight:600; color:#0f172a;">${order.buyer_name}</div>
                          <div style="font-size:0.75rem; color:#64748b;">${order.buyer_phone || '+91 98765 88990'}</div>
                        </td>
                        <td style="padding:1rem;">
                          <div style="font-weight:700; color:#0f172a;">${order.crop_title}</div>
                          <div style="font-size:0.75rem; color:#64748b;">${order.delivery_option}</div>
                        </td>
                        <td style="padding:1rem; font-weight:600;">${order.quantity} ${order.unit || 'kg'}</td>
                        <td style="padding:1rem; font-weight:800; color:#15803d; font-size:0.95rem;">₹${order.total_amount}</td>
                        <td style="padding:1rem;">
                          <span style="display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:9999px; font-size:0.75rem; font-weight:700; ${badgeBg}">
                            ${statusText}
                          </span>
                        </td>
                        <td style="padding:1rem;">
                          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                            ${st === 'placed' || st === 'order placed' ? `
                              <button class="btn-quick-status" data-order-id="${order.id}" data-target-status="Confirmed" style="padding:5px 10px; background:#16a34a; color:#ffffff; border:none; border-radius:6px; font-weight:700; font-size:0.75rem; cursor:pointer;">
                                ✓ Confirm
                              </button>
                              <button class="btn-quick-status" data-order-id="${order.id}" data-target-status="Cancelled" style="padding:5px 10px; background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; border-radius:6px; font-weight:700; font-size:0.75rem; cursor:pointer;">
                                ✕ Reject
                              </button>
                            ` : st.includes('confirm') ? `
                              <button class="btn-quick-status" data-order-id="${order.id}" data-target-status="Out for Delivery" style="padding:5px 10px; background:#7c3aed; color:#ffffff; border:none; border-radius:6px; font-weight:700; font-size:0.75rem; cursor:pointer;">
                                🚚 Dispatch
                              </button>
                            ` : st.includes('out') || st.includes('transit') || st.includes('preparing') ? `
                              <button class="btn-quick-status" data-order-id="${order.id}" data-target-status="Delivered" style="padding:5px 10px; background:#15803d; color:#ffffff; border:none; border-radius:6px; font-weight:700; font-size:0.75rem; cursor:pointer;">
                                🎉 Mark Delivered
                              </button>
                            ` : st.includes('cancel') || st.includes('reject') ? `
                              <span style="font-size:0.75rem; color:#dc2626; font-weight:700;">❌ Rejected</span>
                            ` : `
                              <span style="font-size:0.75rem; color:#15803d; font-weight:700;">✓ Completed</span>
                            `}

                            <select class="order-status-select" data-order-id="${order.id}" style="padding:3px 6px; border-radius:6px; font-size:0.72rem; border:1px solid #cbd5e1; background:#f8fafc; color:#475569; cursor:pointer;">
                              <option value="placed" ${st === 'placed' ? 'selected' : ''}>Placed</option>
                              <option value="Confirmed" ${st.includes('confirm') ? 'selected' : ''}>Confirmed</option>
                              <option value="Out for Delivery" ${st.includes('out') || st.includes('transit') ? 'selected' : ''}>Out for Delivery</option>
                              <option value="Delivered" ${st.includes('deliver') ? 'selected' : ''}>Delivered</option>
                              <option value="Cancelled" ${st.includes('cancel') || st.includes('reject') ? 'selected' : ''}>Rejected / Cancelled</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
              `}
            </div>
          ` : ''}

          <!-- TAB CONTENT: 🚜 FARMER PROCUREMENTS & PRIORITY QUEUE PRE-BOOKING -->
          ${activeTab === 'procurements' ? `
            <div style="display:flex; flex-direction:column; gap:1.75rem;">
              <!-- 1. Block Quota Availability Ticker Banner -->
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:1.5rem; box-shadow:var(--shadow-sm);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:8px;">
                  <div>
                    <h3 style="font-size:1.15rem; font-weight:800; color:#0f172a; margin-bottom:2px; display:flex; align-items:center; gap:8px;">
                      <span>🏢</span>
                      <span>${t('blockCenterQuotaTitle')}</span>
                    </h3>
                    <span style="font-size:0.78rem; color:#64748b;">
                      Node: <strong>Meerut Sadar PAC & Cooperative Mandi Center</strong> (Block Quota Live Monitor)
                    </span>
                  </div>
                  <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; background:#f0fdf4; color:#15803d; padding:4px 10px; border-radius:9999px; border:1px solid #bbf7d0;">
                    <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#16a34a; box-shadow:0 0 6px #16a34a;"></span>
                    <span>Live Mandi Stock Sync</span>
                  </div>
                </div>

                <!-- Block Quota Grid -->
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">
                  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                      <span style="font-weight:700; font-size:0.85rem; color:#0f172a;">🫘 DAP 50kg Bags</span>
                      <span style="font-size:0.75rem; font-weight:800; color:#15803d;">64% Left</span>
                    </div>
                    <div style="font-size:1.3rem; font-weight:900; color:#0f172a; margin-bottom:4px;">
                      640 <span style="font-size:0.8rem; font-weight:500; color:#64748b;">/ 1,000 bags</span>
                    </div>
                    <div style="height:6px; background:#e2e8f0; border-radius:9999px; overflow:hidden;">
                      <div style="height:100%; width:64%; background:#16a34a;"></div>
                    </div>
                  </div>

                  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                      <span style="font-weight:700; font-size:0.85rem; color:#0f172a;">🌱 Neem Urea 45kg</span>
                      <span style="font-size:0.75rem; font-weight:800; color:#15803d;">72% Left</span>
                    </div>
                    <div style="font-size:1.3rem; font-weight:900; color:#0f172a; margin-bottom:4px;">
                      1,820 <span style="font-size:0.8rem; font-weight:500; color:#64748b;">/ 2,500 bags</span>
                    </div>
                    <div style="height:6px; background:#e2e8f0; border-radius:9999px; overflow:hidden;">
                      <div style="height:100%; width:72%; background:#16a34a;"></div>
                    </div>
                  </div>

                  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                      <span style="font-weight:700; font-size:0.85rem; color:#0f172a;">🌾 HD-3226 Seed</span>
                      <span style="font-size:0.75rem; font-weight:800; color:#d97706;">53% Left</span>
                    </div>
                    <div style="font-size:1.3rem; font-weight:900; color:#0f172a; margin-bottom:4px;">
                      430 <span style="font-size:0.8rem; font-weight:500; color:#64748b;">/ 800 bags</span>
                    </div>
                    <div style="height:6px; background:#e2e8f0; border-radius:9999px; overflow:hidden;">
                      <div style="height:100%; width:53%; background:#d97706;"></div>
                    </div>
                  </div>

                  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                      <span style="font-weight:700; font-size:0.85rem; color:#0f172a;">🚁 Machinery Slots</span>
                      <span style="font-size:0.75rem; font-weight:800; color:#7c3aed;">Active Hub</span>
                    </div>
                    <div style="font-size:1.3rem; font-weight:900; color:#0f172a; margin-bottom:4px;">
                      85 <span style="font-size:0.8rem; font-weight:500; color:#64748b;">Drone Acres Avail.</span>
                    </div>
                    <div style="height:6px; background:#e2e8f0; border-radius:9999px; overflow:hidden;">
                      <div style="height:100%; width:56%; background:#7c3aed;"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 2. My Active Pre-Bookings & Live Queue Pass -->
              <div>
                <h3 style="font-size:1.2rem; font-weight:800; color:#0f172a; margin-bottom:0.85rem; display:flex; align-items:center; gap:8px;">
                  <span>🎟️</span>
                  <span>${t('myTokensTab')} (${farmerBookings.length})</span>
                </h3>

                ${farmerBookings.length === 0 ? `
                  <div style="background:#ffffff; border:1px dashed #cbd5e1; border-radius:14px; padding:2rem; text-align:center; color:#64748b;">
                    <span style="font-size:2.5rem; display:block; margin-bottom:0.4rem;">🎫</span>
                    <p style="font-weight:600; color:#0f172a;">No Active Pre-Booking Tokens</p>
                    <p style="font-size:0.82rem; margin-top:2px;">Select an item from the subsidized catalog below to secure guaranteed allocation.</p>
                  </div>
                ` : `
                  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.25rem;">
                    ${farmerBookings.map(bk => {
                      const isConfirmed = bk.status === 'Confirmed';
                      return `
                      <div style="background:#ffffff; border:1px solid ${isConfirmed ? '#86efac' : '#e2e8f0'}; border-radius:16px; padding:1.25rem; box-shadow:var(--shadow-sm); position:relative; overflow:hidden;">
                        ${isConfirmed ? `<div style="position:absolute; top:0; left:0; right:0; height:4px; background:#16a34a;"></div>` : ''}
                        
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.85rem;">
                          <div>
                            <span style="font-size:0.72rem; color:#64748b; font-weight:700; text-transform:uppercase;">${t('tokenNumberLabel')}</span>
                            <div style="font-size:1.6rem; font-weight:900; color:#14532d; line-height:1.1;">
                              #${bk.token_number}
                            </div>
                            <span style="font-size:0.75rem; color:#94a3b8;">${bk.id}</span>
                          </div>
                          <div style="text-align:right;">
                            <span style="padding:4px 10px; border-radius:9999px; font-size:0.75rem; font-weight:800; background:${isConfirmed ? '#dcfce7' : '#fee2e2'}; color:${isConfirmed ? '#15803d' : '#b91c1c'}; border:1px solid ${isConfirmed ? '#86efac' : '#fca5a5'};">
                              ${bk.status}
                            </span>
                            <div style="font-size:0.75rem; font-weight:700; color:#16a34a; margin-top:4px;">
                              Priority: ${bk.priority_score}/100
                            </div>
                          </div>
                        </div>

                        <div style="font-weight:800; font-size:1.05rem; color:#0f172a; margin-bottom:0.25rem;">
                          ${bk.item_name}
                        </div>
                        <div style="font-size:0.82rem; color:#64748b; margin-bottom:0.85rem;">
                          ${bk.quantity} ${bk.unit} • ₹${bk.total_amount} (Subsidy Savings: <strong style="color:#15803d;">₹${bk.subsidy_savings}</strong>)
                        </div>

                        <!-- Live Queue Tracker Bar -->
                        ${isConfirmed ? `
                        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:0.75rem; font-size:0.75rem; margin-bottom:1rem;">
                          <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-weight:700;">
                            <span style="color:#15803d;">🟢 Now Serving: #${bk.currently_serving_token}</span>
                            <span style="color:#16a34a;">${bk.queue_position} Ahead (~${bk.estimated_wait_minutes}m)</span>
                          </div>
                          <div style="color:#334155; font-size:0.72rem; margin-top:2px;">
                            📍 Slot: <strong>${bk.pickup_date}</strong> at <strong>${bk.pickup_counter}</strong>
                          </div>
                        </div>
                        ` : ''}

                        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:0.75rem;">
                          <span style="font-size:0.72rem; color:#64748b;">
                            Hub: ${bk.distribution_center.split('/')[0]}
                          </span>
                          ${isConfirmed ? `
                            <button class="btn-cancel-proc" data-booking-id="${bk.id}" style="padding:4px 10px; font-size:0.75rem; color:#ef4444; background:#fef2f2; border:1px solid #fecaca; border-radius:6px; font-weight:700; cursor:pointer;">
                              Cancel
                            </button>
                          ` : ''}
                        </div>
                      </div>
                      `;
                    }).join('')}
                  </div>
                `}
              </div>

              <!-- 3. Subsidized Procurement Catalog -->
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:8px;">
                  <div>
                    <h3 style="font-size:1.2rem; font-weight:800; color:#0f172a; margin-bottom:2px;">
                      📦 ${t('catalogTab')}
                    </h3>
                    <p style="font-size:0.8rem; color:#64748b;">
                      Direct government cooperative allocation for verified farmers with priority queue slots
                    </p>
                  </div>

                  <!-- Category filter pills -->
                  <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    ${['All', 'Fertilizers', 'Seeds', 'Machinery'].map(cat => `
                      <button class="proc-cat-chip ${selectedProcCat === cat ? 'active' : ''}" data-cat="${cat}" style="padding:5px 12px; border-radius:20px; font-size:0.75rem; font-weight:700; border:1px solid ${selectedProcCat === cat ? '#16a34a' : '#cbd5e1'}; background:${selectedProcCat === cat ? '#16a34a' : '#ffffff'}; color:${selectedProcCat === cat ? '#ffffff' : '#475569'}; cursor:pointer;">
                        ${cat === 'All' ? 'All Inputs' : cat}
                      </button>
                    `).join('')}
                  </div>
                </div>

                <!-- Catalog Grid -->
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;">
                  ${procurementItems.map(item => `
                    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:1.25rem; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:space-between; transition:transform 0.2s ease;">
                      <div>
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
                          <div style="width:44px; height:44px; border-radius:12px; background:#f0fdf4; display:flex; align-items:center; justify-content:center; font-size:1.5rem; border:1px solid #bbf7d0;">
                            ${item.icon || '📦'}
                          </div>
                          <span style="font-size:0.7rem; font-weight:700; background:#fef3c7; color:#b45309; padding:2px 8px; border-radius:9999px; border:1px solid #fde68a;">
                            ${item.badge}
                          </span>
                        </div>

                        <h4 style="font-size:1rem; font-weight:800; color:#0f172a; margin-bottom:0.25rem; line-height:1.3;">
                          ${currentLang === 'hi' && item.name_hi ? item.name_hi : item.name}
                        </h4>
                        <div style="font-size:0.78rem; color:#64748b; margin-bottom:0.85rem;">
                          ${item.spec}
                        </div>

                        <!-- Price Row -->
                        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:0.75rem; margin-bottom:1rem;">
                          <div style="display:flex; justify-content:space-between; align-items:baseline;">
                            <div>
                              <span style="font-size:0.7rem; color:#64748b; font-weight:600; display:block;">Govt. Subsidized</span>
                              <span style="font-size:1.25rem; font-weight:900; color:#15803d;">₹${item.subsidized_price}</span>
                              <span style="font-size:0.75rem; color:#64748b;">/ ${item.unit}</span>
                            </div>
                            <div style="text-align:right;">
                              <span style="font-size:0.7rem; color:#94a3b8; text-decoration:line-through; display:block;">Market: ₹${item.market_price}</span>
                              <span style="font-size:0.75rem; font-weight:800; color:#16a34a;">Save ₹${item.market_price - item.subsidized_price}</span>
                            </div>
                          </div>
                        </div>

                        <div style="font-size:0.75rem; color:#475569; margin-bottom:1rem;">
                          📍 Hub: <strong>${item.distribution_center}</strong><br/>
                          📊 Block Quota: <strong>${item.available_quota} ${item.unit} remaining</strong>
                        </div>
                      </div>

                      <button class="btn-open-prebook btn-primary-green" data-item-id="${item.id}" style="width:100%; padding:0.65rem; font-size:0.88rem; font-weight:800; border-radius:10px; display:flex; align-items:center; justify-content:center; gap:6px;">
                        <span>🎟️</span>
                        <span>${t('btnPreBookNow')}</span>
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}

          <!-- TAB CONTENT: PRICE INTELLIGENCE & AI DECISION SUPPORT -->
          ${activeTab === 'ai_intel' ? `
            <div id="ai-price-intel-host"></div>
          ` : ''}

          <!-- TAB CONTENT: HOME FEED (Farmer browsing all crops in Marketplace) -->
          ${activeTab === 'home_feed' ? `
            <div class="listings-grid">
              ${allMarketCrops.map(crop => {
                const cropImgs = resolveCropImages(crop.title, crop.category, crop.images);
                const primaryImg = cropImgs[0];
                const fallbackSvg = getCropSvgFallback(crop.title, crop.category);

                return `
                <div class="crop-card" data-crop-id="${crop.id}">
                  <div class="card-image-wrap">
                    <img 
                      src="${primaryImg}" 
                      alt="${crop.title}" 
                      class="card-img" 
                      loading="lazy" 
                      onerror="this.onerror=null; this.src='${fallbackSvg}'"
                    />
                    <div class="badge-grade">${Icons.check} ${crop.quality_grade || 'Grade A'}</div>
                  </div>
                  <div class="card-body">
                    <h3 class="card-title">${crop.title}</h3>
                    <div class="card-qty">${crop.quantity_available} kg ${t('available')}</div>
                    <div class="card-price-row"><span class="card-price">₹${crop.price_per_unit}</span> / kg</div>
                    <div class="card-location" style="font-size:0.75rem; color:#64748b; margin-top:4px;">
                      <span>${Icons.mapPin}</span>
                      <span>${crop.location}</span>
                    </div>
                  </div>
                </div>
                `;
              }).join('')}
            </div>
          ` : ''}
        </main>

        <!-- Floating Add Crop Button (Desktop/Mobile) -->
        <button id="floating-farmer-add-btn" class="floating-add-btn">
          <span style="width:20px; height:20px; display:inline-block;">${Icons.plus}</span>
          Add Listing
        </button>

        <!-- Procurement Modal Host -->
        <div id="procurement-modal-container"></div>
      </div>
    `;

    // Tab switching
    container.querySelectorAll('.farmer-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        sessionStorage.setItem('farmdirect_farmer_active_tab', activeTab);
        loadDataAndRender();
      });
    });

    // Procurement Category Filter Chips
    container.querySelectorAll('.proc-cat-chip').forEach(chip => {
      chip.addEventListener('click', async () => {
        selectedProcCat = chip.dataset.cat;
        procurementItems = await FarmDirectApi.getProcurementCatalog(selectedProcCat);
        loadDataAndRender();
      });
    });

    // Open Pre-Book Modal for Subsidized Input
    container.querySelectorAll('.btn-open-prebook').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const itemId = btn.dataset.itemId;
        const item = procurementItems.find(p => String(p.id) === String(itemId));
        if (item) {
          activeModalItem = item;
          renderProcModal();
        }
      });
    });

    // Cancel Active Pre-Booking Token & Restore Quota
    container.querySelectorAll('.btn-cancel-proc').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const bookingId = btn.dataset.bookingId;
        if (confirm(t('confirmCancelToken') || 'Are you sure you want to cancel this pre-booking and release your token?')) {
          await FarmDirectApi.cancelProcurementBooking(bookingId);
          loadDataAndRender();
        }
      });
    });

    function renderProcModal() {
      const modalHost = container.querySelector('#procurement-modal-container');
      if (!modalHost) return;
      if (!activeModalItem) {
        modalHost.innerHTML = '';
        return;
      }
      renderProcurementBookingModal(modalHost, {
        item: activeModalItem,
        farmerUser,
        onClose: () => {
          activeModalItem = null;
          modalHost.innerHTML = '';
        },
        onBookingConfirmed: (bk) => {
          activeModalItem = null;
          modalHost.innerHTML = '';
          activeTab = 'procurements';
          loadDataAndRender();
        }
      });
    }

    // Price intelligence component mount
    if (activeTab === 'ai_intel') {
      const intelHost = container.querySelector('#ai-price-intel-host');
      if (intelHost) {
        renderPriceIntelligenceView(intelHost, { farmerUser });
      }
    }

    // Add crop actions
    container.querySelector('#btn-add-crop-action')?.addEventListener('click', onOpenAddCrop);
    container.querySelector('#floating-farmer-add-btn')?.addEventListener('click', onOpenAddCrop);
    container.querySelector('#btn-quick-list-recommendation')?.addEventListener('click', onOpenAddCrop);
    container.querySelector('#btn-empty-add-crop')?.addEventListener('click', onOpenAddCrop);

    // Edit listing action
    container.querySelectorAll('.btn-farmer-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cropId = btn.dataset.editId;
        const crop = farmerCrops.find(c => String(c.id) === String(cropId));
        if (crop && onEditCrop) {
          onEditCrop(crop);
        }
      });
    });

    // Delete listing action
    container.querySelectorAll('.btn-farmer-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const cropId = btn.dataset.deleteId;
        if (confirm(t('confirmDeleteCrop'))) {
          await FarmDirectApi.deleteCrop(cropId);
          loadDataAndRender();
        }
      });
    });

    // Quick one-click status buttons
    container.querySelectorAll('.btn-quick-status').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const orderId = btn.dataset.orderId;
        const targetStatus = btn.dataset.targetStatus;
        await FarmDirectApi.updateOrderStatus(orderId, targetStatus);
        loadDataAndRender();
      });
    });

    // Order status dropdown select
    container.querySelectorAll('.order-status-select').forEach(select => {
      select.addEventListener('change', async (e) => {
        const orderId = select.dataset.orderId;
        const newStatus = e.target.value;
        await FarmDirectApi.updateOrderStatus(orderId, newStatus);
        loadDataAndRender();
      });
    });

    // Crop card click
    container.querySelectorAll('.crop-card').forEach(card => {
      card.addEventListener('click', () => {
        const cropId = card.dataset.cropId;
        const crop = [...farmerCrops, ...allMarketCrops].find(c => String(c.id) === String(cropId));
        if (crop) onSelectCrop(crop);
      });
    });
  }

  // Synthesized Web Audio API Bell Chime
  function playOrderChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.12); // A5
      osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.24); // D6
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      // Audio context policy
    }
  }

  // Floating Real-Time Incoming Order Toast Notification
  function showOrderToast(order) {
    if (!order) return;
    playOrderChime();

    const existing = document.getElementById('farmer-incoming-order-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'farmer-incoming-order-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      background: #ffffff;
      border: 2px solid #16a34a;
      border-radius: 16px;
      padding: 1.15rem 1.4rem;
      box-shadow: 0 12px 35px rgba(22, 163, 74, 0.25);
      display: flex;
      align-items: center;
      gap: 1rem;
      max-width: 420px;
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    toast.innerHTML = `
      <div style="width:46px; height:46px; border-radius:12px; background:#dcfce7; color:#15803d; display:flex; align-items:center; justify-content:center; font-size:1.6rem; flex-shrink:0;">
        📦
      </div>
      <div style="flex:1;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
          <span style="font-size:0.75rem; font-weight:800; color:#15803d; text-transform:uppercase; letter-spacing:0.5px;">New Order Received!</span>
          <span style="font-size:0.72rem; color:#94a3b8;">Just now</span>
        </div>
        <div style="font-weight:800; font-size:0.92rem; color:#0f172a; line-height:1.3;">
          ${order.buyer_name || 'Buyer'} ordered ${order.quantity} kg of ${order.crop_title}
        </div>
        <div style="font-size:0.8rem; color:#15803d; font-weight:700; margin-top:3px;">
          Total: ₹${order.total_amount} • #${order.id}
        </div>
      </div>
      <button id="toast-close-btn" style="background:none; border:none; color:#94a3b8; font-size:1.1rem; cursor:pointer; padding:4px;">✕</button>
    `;
    document.body.appendChild(toast);
    toast.querySelector('#toast-close-btn')?.addEventListener('click', () => toast.remove());

    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 8000);
  }

  // Cleanup previous instance listeners & timers on this container
  if (container.__farmerCleanup) {
    container.__farmerCleanup();
  }

  // Listen to cross-window, local, and Supabase real-time updates
  const onOrderCreated = (e) => {
    showOrderToast(e.detail?.order);
    if (activeTab !== 'ai_intel') {
      loadDataAndRender();
    }
  };
  const onOrderUpdate = () => {
    if (activeTab !== 'ai_intel') {
      loadDataAndRender();
    }
  };
  const onProcurementUpdate = () => {
    if (activeTab !== 'ai_intel') {
      loadDataAndRender();
    }
  };
  const onStorageChange = (e) => {
    if ((e.key === 'farmdirect_orders' || e.key === 'farmdirect_crops') && activeTab !== 'ai_intel') {
      loadDataAndRender();
    }
  };

  window.addEventListener('farmdirect:order_created', onOrderCreated);
  window.addEventListener('farmdirect:order_status_updated', onOrderUpdate);
  window.addEventListener('farmdirect:crops_updated', onOrderUpdate);
  window.addEventListener('farmdirect:procurement_updated', onProcurementUpdate);
  window.addEventListener('storage', onStorageChange);

  // Periodic liveness polling (every 3 seconds) ensures zero latency sync for listings & orders
  const pollTimer = setInterval(() => {
    // Never interrupt user when inside AI Price Intelligence or actively typing in any input field
    if (activeTab === 'ai_intel') return;
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'SELECT')) {
      return;
    }
    loadDataAndRender();
  }, 3000);

  container.__farmerCleanup = () => {
    window.removeEventListener('farmdirect:order_created', onOrderCreated);
    window.removeEventListener('farmdirect:order_status_updated', onOrderUpdate);
    window.removeEventListener('farmdirect:crops_updated', onOrderUpdate);
    window.removeEventListener('farmdirect:procurement_updated', onProcurementUpdate);
    window.removeEventListener('storage', onStorageChange);
    clearInterval(pollTimer);
  };

  loadDataAndRender();
}
