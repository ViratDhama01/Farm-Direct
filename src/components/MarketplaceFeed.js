// 🌱 FarmDirect Marketplace Feed (Desktop & Mobile View - Bilingual English / हिन्दी)
import { Icons } from '../lib/icons.js';
import { LanguageManager } from '../lib/translations.js';
import { resolveCropImages, getCropSvgFallback } from '../lib/cropImages.js';

export function renderMarketplaceFeed(container, { crops, filters = {}, onSelectCrop, onFilterChange, onOpenBuyerOrders, currentCategory = 'All' }) {
  const { t } = LanguageManager;
  const currentLang = LanguageManager.getCurrentLanguage();

  const categories = [
    { name: 'All', en: 'All Crops', hi: 'सभी फसलें', icon: '🌾' },
    { name: 'Pulses', en: 'Pulses', hi: 'दालें', icon: '🫘' },
    { name: 'Grains', en: 'Grains', hi: 'अनाज', icon: '🌾' },
    { name: 'Spices', en: 'Spices', hi: 'मसाले', icon: '🌶️' },
    { name: 'Oilseeds', en: 'Oilseeds', hi: 'तिलहन', icon: '🌻' },
    { name: 'Organic', en: 'Organic', hi: 'जैविक', icon: '🌿' }
  ];

  const currentMaxPrice = filters.maxPrice ?? 500;
  const currentGrade = filters.grade || 'all';
  const currentQuantity = filters.quantityRange || 'all';
  const currentSort = filters.sort || 'latest';
  const currentHarvest = filters.harvest || 'all';

  function renderGridHtml(cropList) {
    if (cropList.length === 0) {
      return `
        <div style="grid-column: 1 / -1; padding: 3rem; text-align:center; background:#ffffff; border-radius:16px; border:1px solid #e2e8f0; box-shadow:var(--shadow-sm);">
          <span style="font-size:3rem; display:block; margin-bottom:0.75rem;">🌱</span>
          <h3 style="font-size:1.25rem; font-weight:700; color:#0f172a; margin-bottom:0.4rem;">${t('noProduceFound')}</h3>
          <p style="color:#64748b; font-size:0.9rem; margin-bottom:1.25rem;">${t('noProduceDesc')}</p>
          <button id="empty-reset-btn" class="btn-primary-green" style="margin:0 auto; padding:0.6rem 1.4rem;">${t('btnResetFilters')}</button>
        </div>
      `;
    }

    return cropList.map(crop => {
      const cropImgs = resolveCropImages(crop.title, crop.category, crop.images);
      const primaryImg = cropImgs[0];
      const fallbackDataUri = getCropSvgFallback(crop.title, crop.category);
      const isOutOfStock = crop.status === 'out_of_stock' || (Number(crop.quantity_available) || 0) <= 0;

      return `
      <div class="crop-card ${isOutOfStock ? 'is-out-of-stock' : ''}" data-crop-id="${crop.id}" style="${isOutOfStock ? 'border-color:#fca5a5;' : ''}">
        <div class="card-image-wrap">
          <img 
            src="${primaryImg}" 
            alt="${crop.title}" 
            class="card-img" 
            loading="lazy" 
            onerror="this.onerror=null; this.src='${fallbackDataUri}'"
            style="${isOutOfStock ? 'filter: saturate(0.65);' : ''}"
          />
          ${isOutOfStock ? `
            <div class="badge-grade" style="background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; font-weight:800;">
              🔴 ${t('outOfStockBadge') || 'Out of Stock'}
            </div>
          ` : `
            <div class="badge-grade">
              <span style="width:12px; height:12px; color:#15803d; display:inline-block;">${Icons.check}</span>
              ${crop.quality_grade || 'Grade A'}
            </div>
          `}
          ${crop.tags?.[0] && !isOutOfStock ? `<div class="badge-tag">${crop.tags[0]}</div>` : ''}
        </div>

        <div class="card-body">
          <div class="card-header-row">
            <h3 class="card-title">${crop.title}</h3>
          </div>

          ${isOutOfStock ? `
            <div class="card-qty" style="color:#dc2626; font-weight:700;">
              🔴 ${t('outOfStockBadge') || 'Out of Stock'}
              ${crop.hours_until_unlisted ? `<span style="font-size:0.7rem; color:#b91c1c; font-weight:600; display:block; margin-top:2px;">⏱️ ${t('autoUnlistingIn')} ${crop.hours_until_unlisted}h</span>` : ''}
            </div>
          ` : `
            <div class="card-qty">${crop.quantity_available?.toLocaleString()} ${crop.unit || 'kg'} ${t('available')}</div>
          `}

          <div class="card-price-row">
            <span class="card-price">₹${crop.price_per_unit}</span>
            <span class="card-unit">/ ${crop.unit || 'kg'}</span>
          </div>

          <div class="card-location">
            <span>${Icons.mapPin}</span>
            <span>${crop.location.split(',')[0]}, ${crop.distance_km || 12} km</span>
          </div>

          <div class="card-divider"></div>

          <div class="card-footer">
            <div class="farmer-tag">
              <div class="farmer-tag-avatar-badge" style="width:26px; height:26px; border-radius:50%; background:#dcfce7; color:#15803d; display:inline-flex; align-items:center; justify-content:center; font-size:0.85rem; border:1px solid #86efac; flex-shrink:0;">
                👨‍🌾
              </div>
              <div>
                <div class="farmer-tag-name">${crop.farmer_name}</div>
                <div class="farmer-tag-rating">
                  <span style="width:12px; height:12px; display:inline-block;">${Icons.star}</span>
                  <span>${crop.farmer_rating || '4.6'}</span>
                  <span style="color:#94a3b8; font-weight:400;">(${crop.farmer_reviews_count || '25'})</span>
                </div>
              </div>
            </div>

            <span class="harvest-tag">${crop.harvest_date || (currentLang === 'hi' ? 'ताजा कटाई' : 'Fresh Harvest')}</span>
          </div>
        </div>
      </div>
      `;
    }).join('');
  }

  function attachCardListeners() {
    container.querySelectorAll('.crop-card').forEach(card => {
      card.addEventListener('click', () => {
        const cropId = card.dataset.cropId;
        const crop = crops.find(c => String(c.id) === String(cropId));
        if (crop && onSelectCrop) onSelectCrop(crop);
      });
    });

    container.querySelector('#empty-reset-btn')?.addEventListener('click', () => {
      if (onFilterChange) onFilterChange({ reset: true });
    });
  }

  function updateSliderBackground(sliderEl, val) {
    if (!sliderEl) return;
    const min = Number(sliderEl.min) || 10;
    const max = Number(sliderEl.max) || 500;
    const percentage = ((Number(val) - min) / (max - min)) * 100;
    sliderEl.style.background = `linear-gradient(to right, #16a34a 0%, #16a34a ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
  }

  // Fast In-Place Update: If the layout already exists, only update the grid & active highlights without tearing down the DOM
  const existingGrid = container.querySelector('#produce-grid');
  const existingSidebar = container.querySelector('.filter-sidebar');

  if (existingGrid && existingSidebar) {
    existingGrid.innerHTML = renderGridHtml(crops);
    attachCardListeners();

    // Update active category items & chips
    container.querySelectorAll('.category-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.category === currentCategory);
    });
    container.querySelectorAll('.category-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.category === currentCategory);
    });

    // Update slider UI if not currently being dragged
    const slider = container.querySelector('#filter-price-slider');
    const priceValText = container.querySelector('#price-range-val');
    if (slider && document.activeElement !== slider) {
      slider.value = currentMaxPrice;
      updateSliderBackground(slider, currentMaxPrice);
      if (priceValText) {
        priceValText.innerText = currentMaxPrice >= 500 ? '₹10 - ₹500+' : `₹10 - ₹${currentMaxPrice}`;
      }
    }
    return;
  }

  // Full Initial Render
  container.innerHTML = `
    <div class="app-container">
      <!-- Left Sidebar (Desktop View) -->
      <aside class="filter-sidebar">
        <!-- Quick My Orders Box for Buyers -->
        <div style="margin-bottom:1.25rem; padding:0.85rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="font-size:0.75rem; font-weight:700; color:#15803d; margin-bottom:0.4rem; display:flex; align-items:center; gap:5px;">
            <span>📦</span>
            <span>${currentLang === 'hi' ? 'ऑर्डर ट्रैकिंग' : 'Buyer Dashboard'}</span>
          </div>
          <button id="btn-sidebar-my-orders" style="width:100%; padding:0.55rem 0.75rem; background:#16a34a; color:#ffffff; border:none; border-radius:8px; font-weight:700; font-size:0.82rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 2px 6px rgba(22,163,74,0.25);">
            <span>📦</span>
            <span>${currentLang === 'hi' ? 'मेरे ऑर्डर देखें' : 'My Orders & Tracking'}</span>
          </button>
        </div>

        <div class="sidebar-title">${t('categoriesLabel')}</div>
        <div class="category-list" id="sidebar-categories">
          ${categories.map(cat => `
            <div class="category-nav-item ${currentCategory === cat.name ? 'active' : ''}" data-category="${cat.name}">
              <span style="font-size:1.1rem;">${cat.icon}</span>
              <div style="display:flex; flex-direction:column; line-height:1.15;">
                <span style="font-weight:600;">${currentLang === 'hi' ? cat.hi : cat.en}</span>
                <span style="font-size:0.68rem; color:#94a3b8;">${currentLang === 'hi' ? cat.en : cat.hi}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="sidebar-title" style="margin-top:1.5rem;">${t('filtersLabel')}</div>

        <!-- Price Range Slider -->
        <div class="filter-section">
          <div class="filter-label">
            <span>${t('priceRangeLabel')}</span>
            <span id="price-range-val" style="color:#15803d; font-weight:700;">₹10 - ₹${currentMaxPrice}${currentMaxPrice >= 500 ? '+' : ''}</span>
          </div>
          <input
            type="range"
            id="filter-price-slider"
            class="filter-range-slider"
            min="10"
            max="500"
            step="5"
            value="${currentMaxPrice}"
          />
        </div>

        <!-- Quantity Filter -->
        <div class="filter-section">
          <label class="filter-label">${t('quantityLabel')}</label>
          <select id="filter-quantity" class="filter-select">
            <option value="all" ${currentQuantity === 'all' ? 'selected' : ''}>${t('anyQuantity')}</option>
            <option value="small" ${currentQuantity === 'small' ? 'selected' : ''}>${t('qtySmall')}</option>
            <option value="medium" ${currentQuantity === 'medium' ? 'selected' : ''}>${t('qtyMedium')}</option>
            <option value="bulk" ${currentQuantity === 'bulk' ? 'selected' : ''}>${t('qtyBulk')}</option>
          </select>
        </div>

        <!-- Quality / Grade Filter -->
        <div class="filter-section">
          <label class="filter-label">${t('qualityLabel')}</label>
          <select id="filter-grade" class="filter-select">
            <option value="all" ${currentGrade === 'all' ? 'selected' : ''}>${t('anyGrade')}</option>
            <option value="Grade A" ${currentGrade === 'Grade A' ? 'selected' : ''}>${t('gradeA')}</option>
            <option value="Organic" ${currentGrade === 'Organic' ? 'selected' : ''}>${t('gradeOrganic')}</option>
          </select>
        </div>

        <!-- Harvest Date -->
        <div class="filter-section">
          <label class="filter-label">${t('harvestLabel')}</label>
          <select id="filter-harvest" class="filter-select">
            <option value="all" ${currentHarvest === 'all' ? 'selected' : ''}>${t('anyDate')}</option>
            <option value="today" ${currentHarvest === 'today' ? 'selected' : ''}>${t('harvestToday')}</option>
            <option value="recent" ${currentHarvest === 'recent' ? 'selected' : ''}>${t('harvestRecent')}</option>
          </select>
        </div>

        <button id="btn-reset-filters" style="width:100%; padding:0.5rem; font-size:0.8rem; color:#64748b; border:1px dashed #cbd5e1; border-radius:8px; margin-top:0.5rem; cursor:pointer;">
          ${t('btnResetFilters')}
        </button>
      </aside>

      <!-- Main Feed Content Area -->
      <main class="main-content">
        <!-- Top Category Chips & Sort Controls -->
        <div class="content-top-bar">
          <div class="chips-scroll-wrap" id="top-chips-row">
            ${categories.map(cat => `
              <button class="category-chip ${currentCategory === cat.name ? 'active' : ''}" data-category="${cat.name}">
                <span>${cat.icon}</span>
                <span>${currentLang === 'hi' ? cat.hi : cat.en}</span>
              </button>
            `).join('')}
          </div>

          <div class="sort-dropdown-wrap">
            <span style="font-size:0.8rem; color:#64748b; font-weight:600;">${t('sortBy')}:</span>
            <select id="sort-crops-select" class="sort-select">
              <option value="latest" ${currentSort === 'latest' ? 'selected' : ''}>${t('sortLatest')}</option>
              <option value="price_asc" ${currentSort === 'price_asc' ? 'selected' : ''}>${t('sortPriceLowHigh')}</option>
              <option value="price_desc" ${currentSort === 'price_desc' ? 'selected' : ''}>${t('sortPriceHighLow')}</option>
              <option value="rating" ${currentSort === 'rating' ? 'selected' : ''}>${t('sortTopRated')}</option>
            </select>
          </div>
        </div>

        <!-- Grid of Produce Cards -->
        <div class="listings-grid" id="produce-grid">
          ${renderGridHtml(crops)}
        </div>
      </main>
    </div>
  `;

  // Attach card listeners
  attachCardListeners();

  // Category sidebar clicks
  container.querySelectorAll('.category-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const cat = item.dataset.category;
      onFilterChange({ category: cat });
    });
  });

  // Top category chips clicks
  container.querySelectorAll('.category-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const cat = chip.dataset.category;
      onFilterChange({ category: cat });
    });
  });

  // Price slider setup
  const slider = container.querySelector('#filter-price-slider');
  const priceValText = container.querySelector('#price-range-val');
  if (slider) {
    updateSliderBackground(slider, currentMaxPrice);

    slider.addEventListener('input', (e) => {
      const val = Number(e.target.value);
      updateSliderBackground(slider, val);
      if (priceValText) {
        priceValText.innerText = val >= 500 ? '₹10 - ₹500+' : `₹10 - ₹${val}`;
      }
      onFilterChange({ maxPrice: val >= 500 ? null : val });
    });
  }

  // Sort dropdown
  container.querySelector('#sort-crops-select')?.addEventListener('change', (e) => {
    onFilterChange({ sort: e.target.value });
  });

  // Grade filter
  container.querySelector('#filter-grade')?.addEventListener('change', (e) => {
    onFilterChange({ grade: e.target.value });
  });

  // Quantity filter
  container.querySelector('#filter-quantity')?.addEventListener('change', (e) => {
    onFilterChange({ quantityRange: e.target.value });
  });

  // Harvest filter
  container.querySelector('#filter-harvest')?.addEventListener('change', (e) => {
    onFilterChange({ harvest: e.target.value });
  });

  // Quick My Orders Button in Sidebar
  container.querySelector('#btn-sidebar-my-orders')?.addEventListener('click', () => {
    if (onOpenBuyerOrders) onOpenBuyerOrders();
  });

  // Reset filters
  const resetBtn = container.querySelector('#btn-reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (slider) {
        slider.value = 500;
        updateSliderBackground(slider, 500);
      }
      if (priceValText) {
        priceValText.innerText = '₹10 - ₹500+';
      }
      onFilterChange({ reset: true });
    });
  }
}
