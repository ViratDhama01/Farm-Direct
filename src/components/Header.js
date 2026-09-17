// 🌱 FarmDirect Top Navigation Bar with Interactive Location & Category Dropdowns + Bilingual Support
import { Icons } from '../lib/icons.js';
import { FarmDirectApi } from '../lib/supabase.js';
import { LanguageManager } from '../lib/translations.js';

export function renderHeader(container, { user, onSearch, onOpenNotifs, onOpenBuyerOrders, onLogout, onFilter, onLangChange, unreadCount = 3, currentFilters = {} }) {
  const isFarmer = user?.role === 'farmer';
  const { t } = LanguageManager;
  const currentLang = LanguageManager.getCurrentLanguage();

  const selectedLoc = currentFilters?.location || 'all';
  const selectedCat = currentFilters?.category || 'All';

  const locationsList = [
    { id: 'all', en: 'All Locations (Pan-India)', hi: 'सभी स्थान (अखिल भारतीय)' },
    // North India
    { id: 'Delhi', en: 'Azadpur Mandi, Delhi', hi: 'आज़ादपुर मंडी, दिल्ली' },
    { id: 'Meerut', en: 'Meerut, Uttar Pradesh', hi: 'मेरठ, उत्तर प्रदेश' },
    { id: 'Hapur', en: 'Hapur, Uttar Pradesh', hi: 'हापुड़, उत्तर प्रदेश' },
    { id: 'Muzaffarnagar', en: 'Muzaffarnagar, UP', hi: 'मुज़फ़्फ़रनगर, उत्तर प्रदेश' },
    { id: 'Varanasi', en: 'Varanasi, Uttar Pradesh', hi: 'वाराणसी, उत्तर प्रदेश' },
    { id: 'Karnal', en: 'Karnal, Haryana', hi: 'करनाल, हरियाणा' },
    { id: 'Ludhiana', en: 'Ludhiana, Punjab', hi: 'लुधियाना, पंजाब' },
    { id: 'Bhatinda', en: 'Bhatinda, Punjab', hi: 'बठिंडा, पंजाब' },
    { id: 'Shimla', en: 'Shimla, Himachal Pradesh', hi: 'शिमला, हिमाचल प्रदेश' },
    // Rajasthan & West India
    { id: 'Jaipur', en: 'Jaipur, Rajasthan', hi: 'जयपुर, राजस्थान' },
    { id: 'Jodhpur', en: 'Jodhpur, Rajasthan', hi: 'जोधपुर, राजस्थान' },
    { id: 'Kota', en: 'Kota, Rajasthan', hi: 'कोटा, राजस्थान' },
    { id: 'Bikaner', en: 'Bikaner, Rajasthan', hi: 'बीकानेर, राजस्थान' },
    { id: 'Unjha', en: 'Unjha Mandi, Gujarat', hi: 'उंझा मंडी, गुजरात' },
    { id: 'Ahmedabad', en: 'Ahmedabad, Gujarat', hi: 'अहमदाबाद, गुजरात' },
    { id: 'Rajkot', en: 'Rajkot, Gujarat', hi: 'राजकोट, गुजरात' },
    // Central India
    { id: 'Indore', en: 'Indore, Madhya Pradesh', hi: 'इंदौर, मध्य प्रदेश' },
    { id: 'Ujjain', en: 'Ujjain, Madhya Pradesh', hi: 'उज्जैन, मध्य प्रदेश' },
    { id: 'Bhopal', en: 'Bhopal, Madhya Pradesh', hi: 'भोपाल, मध्य प्रदेश' },
    // Maharashtra
    { id: 'Nashik', en: 'Nashik, Maharashtra', hi: 'नासिक, महाराष्ट्र' },
    { id: 'Nagpur', en: 'Nagpur, Maharashtra', hi: 'नागपुर, महाराष्ट्र' },
    { id: 'Pune', en: 'Pune, Maharashtra', hi: 'पुणे, महाराष्ट्र' },
    { id: 'Mumbai', en: 'Vashi APMC, Navi Mumbai', hi: 'वाशी एपीएमसी, मुंबई' },
    // South India
    { id: 'Guntur', en: 'Guntur, Andhra Pradesh', hi: 'गुंटूर, आंध्र प्रदेश' },
    { id: 'Kurnool', en: 'Kurnool, Andhra Pradesh', hi: 'कुरनूल, आंध्र प्रदेश' },
    { id: 'Bengaluru', en: 'Bengaluru, Karnataka', hi: 'बेंगलुरु, कर्नाटक' },
    { id: 'Gulbarga', en: 'Gulbarga, Karnataka', hi: 'गुलबर्गा, कर्नाटक' },
    { id: 'Warangal', en: 'Warangal, Telangana', hi: 'वारंगल, तेलंगाना' },
    { id: 'Erode', en: 'Erode, Tamil Nadu', hi: 'इरोड, तमिलनाडु' },
    { id: 'Kochi', en: 'Kochi, Kerala', hi: 'कोच्चि, केरल' },
    // East India
    { id: 'Patna', en: 'Patna, Bihar', hi: 'पटना, बिहार' },
    { id: 'Kolkata', en: 'Kolkata, West Bengal', hi: 'कोलकाता, पश्चिम बंगाल' },
    { id: 'Sambalpur', en: 'Sambalpur, Odisha', hi: 'संबलपुर, ओडिशा' },
    { id: 'Guwahati', en: 'Guwahati, Assam', hi: 'गुवाहाटी, असम' }
  ];

  const categoriesList = [
    { id: 'All', icon: '🌾', en: 'All Crops', hi: 'सभी फसलें' },
    { id: 'Pulses', icon: '🫘', en: 'Pulses', hi: 'दालें' },
    { id: 'Grains', icon: '🌾', en: 'Grains', hi: 'अनाज' },
    { id: 'Spices', icon: '🌶️', en: 'Spices', hi: 'मसाले' },
    { id: 'Oilseeds', icon: '🌻', en: 'Oilseeds', hi: 'तिलहन' },
    { id: 'Organic', icon: '🌿', en: 'Organic', hi: 'जैविक' }
  ];

  const currentLocObj = locationsList.find(l => l.id === selectedLoc) || locationsList[0];
  const currentCatObj = categoriesList.find(c => c.id === selectedCat) || categoriesList[0];

  const locButtonLabel = currentLang === 'hi' ? currentLocObj.hi : currentLocObj.en;
  const catButtonLabel = currentLang === 'hi' ? `${currentCatObj.icon} ${currentCatObj.hi}` : `${currentCatObj.icon} ${currentCatObj.en}`;

  container.innerHTML = `
    <header class="top-nav">
      <!-- Crisp Modern Logo & Bilingual Brand -->
      <div class="brand-logo-wrap" id="header-brand-logo" style="cursor:pointer;" title="FarmDirect Home">
        <img 
          src="/logo.png" 
          alt="FarmDirect Logo" 
          style="width:40px; height:40px; border-radius:10px; object-fit:contain; flex-shrink:0; box-shadow:0 3px 8px rgba(22, 163, 74, 0.25);"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        />
        <div style="display:none; width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg, #16a34a, #15803d); color:#ffffff; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(22, 163, 74, 0.35); flex-shrink:0;">
          <span style="width:22px; height:22px; display:inline-block;">${Icons.leaf}</span>
        </div>
        <div style="display:flex; flex-direction:column; line-height:1.15;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="brand-name" style="font-size:1.24rem; font-weight:900; letter-spacing:-0.5px; color:#14532d;">FarmDirect</span>
            <span style="font-size:0.75rem; font-weight:700; color:#15803d; background:#dcfce7; padding:1px 6px; border-radius:6px;">फार्मडायरेक्ट</span>
          </div>
          <span class="brand-tagline" style="font-size:0.72rem; color:#64748b; font-weight:500;">
            ${currentLang === 'hi' ? 'खेत से लोगों तक — सीधा • निष्पक्ष • बेहतर' : 'From Farm to People — Direct. Fair. Better.'}
          </span>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="nav-search-bar">
        <span class="nav-search-icon">${Icons.search}</span>
        <input
          type="text"
          id="global-search-input"
          placeholder="${t('headerSearchPlaceholder')}"
          value="${currentFilters?.search || ''}"
        />
      </div>

      <!-- Nav Controls -->
      <div class="nav-controls-group">
        <!-- Bilingual Language Toggle -->
        <button id="lang-toggle-btn" class="nav-pill-btn" style="background:#ffffff; border:1px solid #cbd5e1; cursor:pointer; font-weight:700; font-size:0.75rem; display:flex; align-items:center; gap:5px; padding:0.4rem 0.65rem; border-radius:20px; box-shadow:0 1px 3px rgba(0,0,0,0.05);" title="Switch Language / भाषा बदलें">
          <span style="font-size:0.88rem;">🌐</span>
          <span style="${currentLang === 'en' ? 'color:#15803d; font-weight:800;' : 'color:#64748b;'}">EN</span>
          <span style="color:#cbd5e1;">|</span>
          <span style="${currentLang === 'hi' ? 'color:#15803d; font-weight:800;' : 'color:#64748b;'}">हिन्दी</span>
        </button>

        <!-- Location Dropdown Relative Container -->
        <div style="position:relative; display:inline-block;">
          <button class="nav-pill-btn" id="location-select-btn" style="cursor:pointer; display:flex; align-items:center; gap:5px; padding:0.4rem 0.75rem; background:#ffffff; border:1px solid #cbd5e1; border-radius:20px; font-weight:600; font-size:0.8rem; color:#1e293b;" title="Filter by Location">
            <span style="color:#15803d; width:15px; height:15px; display:inline-block;">${Icons.mapPin}</span>
            <span id="loc-btn-text" style="max-width:130px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${locButtonLabel}</span>
            <span style="width:13px; height:13px; display:inline-block; color:#64748b;">${Icons.chevronDown}</span>
          </button>

          <!-- Location Floating Menu -->
          <div id="location-dropdown-menu" style="display:none; position:absolute; top:calc(100% + 6px); left:0; min-width:270px; background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.12); padding:0.4rem 0; z-index:1050;">
            <div style="padding:0.4rem 0.85rem; font-size:0.72rem; font-weight:800; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid #f1f5f9;">
              📍 ${currentLang === 'hi' ? 'स्थान चुनें (मंडी क्षेत्र)' : 'Select Mandi / Region'}
            </div>
            <div style="max-height:340px; overflow-y:auto;">
              ${locationsList.map(loc => `
                <button class="header-dropdown-item loc-item" data-id="${loc.id}" style="width:100%; text-align:left; padding:0.55rem 0.85rem; background:none; border:none; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; justify-content:space-between; gap:8px; color:${selectedLoc === loc.id ? '#15803d; font-weight:700; background:#f0fdf4;' : '#334155;'};">
                  <span>📍 ${loc.en}</span>
                  <span style="font-size:0.72rem; color:#64748b;">${loc.hi}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Categories Dropdown Relative Container -->
        <div style="position:relative; display:inline-block;">
          <button class="nav-pill-btn" id="category-dropdown-btn" style="cursor:pointer; display:flex; align-items:center; gap:5px; padding:0.4rem 0.75rem; background:#ffffff; border:1px solid #cbd5e1; border-radius:20px; font-weight:600; font-size:0.8rem; color:#1e293b;" title="Filter by Category">
            <span id="cat-btn-text">${catButtonLabel}</span>
            <span style="width:13px; height:13px; display:inline-block; color:#64748b;">${Icons.chevronDown}</span>
          </button>

          <!-- Categories Floating Menu -->
          <div id="category-dropdown-menu" style="display:none; position:absolute; top:calc(100% + 6px); right:0; min-width:210px; background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.12); padding:0.4rem 0; z-index:1050;">
            <div style="padding:0.4rem 0.85rem; font-size:0.72rem; font-weight:800; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid #f1f5f9;">
              🌾 ${currentLang === 'hi' ? 'श्रेणी चुनें' : 'Produce Category'}
            </div>
            <div style="max-height:260px; overflow-y:auto;">
              ${categoriesList.map(cat => `
                <button class="header-dropdown-item cat-item" data-id="${cat.id}" style="width:100%; text-align:left; padding:0.55rem 0.85rem; background:none; border:none; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; justify-content:space-between; gap:8px; color:${selectedCat === cat.id ? '#15803d; font-weight:700; background:#f0fdf4;' : '#334155;'};">
                  <span>${cat.icon} ${cat.en}</span>
                  <span style="font-size:0.72rem; color:#64748b;">${cat.hi}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Buyer My Orders Button (Prominent & Accessible) -->
        ${!isFarmer ? `
          <button id="header-buyer-orders-btn" class="nav-pill-btn" style="background:#f0fdf4; border:1px solid #86efac; color:#15803d; cursor:pointer; font-weight:700; font-size:0.8rem; display:flex; align-items:center; gap:6px; padding:0.4rem 0.85rem; border-radius:20px; box-shadow:0 1px 3px rgba(22,163,74,0.15);" title="View My Orders & Tracking">
            <span style="font-size:0.95rem;">📦</span>
            <span>${currentLang === 'hi' ? 'मेरे ऑर्डर' : 'My Orders'}</span>
          </button>
        ` : ''}

        <!-- Notification Bell -->
        <button class="notification-btn" id="header-notif-btn" title="${t('notifBell')}">
          <span style="width:20px; height:20px; color:#334155; display:inline-block;">${Icons.bell}</span>
          ${unreadCount > 0 ? '<span class="notif-badge-dot"></span>' : ''}
        </button>

        <!-- User Profile Pill & Logout -->
        <div style="display:flex; align-items:center; gap:0.5rem; background:#f8fafc; padding:0.25rem 0.6rem; border-radius:9999px; border:1px solid #e2e8f0;">
          <div class="user-profile-avatar-badge" style="width:34px; height:34px; border-radius:50%; background:${isFarmer ? '#dcfce7' : '#e0f2fe'}; color:${isFarmer ? '#15803d' : '#0369a1'}; display:flex; align-items:center; justify-content:center; font-size:1.1rem; font-weight:700; flex-shrink:0; border:1.5px solid ${isFarmer ? '#86efac' : '#7dd3fc'};">
            ${isFarmer ? '👨‍🌾' : '🛒'}
          </div>
          <div style="display:flex; flex-direction:column; text-align:left; line-height:1.15;">
            <span style="font-size:0.82rem; font-weight:700; color:#0f172a;">${user?.name || 'User'}</span>
            <span class="role-tag-pill ${isFarmer ? 'farmer' : 'buyer'}" style="font-size:0.65rem; padding:1px 6px;">
              ${isFarmer ? (currentLang === 'hi' ? '👨‍🌾 किसान' : '👨‍🌾 Farmer') : (currentLang === 'hi' ? '🛒 खरीदार' : '🛒 Buyer')}
            </span>
          </div>

          <button id="header-logout-btn" title="${t('logout')}" style="margin-left:4px; padding:4px; border-radius:50%; color:#94a3b8; display:flex; align-items:center; cursor:pointer;">
            <span style="width:18px; height:18px; display:inline-block;">${Icons.logOut}</span>
          </button>
        </div>
      </div>
    </header>
  `;

  // Search input event
  const searchInput = container.querySelector('#global-search-input');
  searchInput.addEventListener('input', (e) => {
    onSearch(e.target.value.trim());
  });

  // Language toggle event
  container.querySelector('#lang-toggle-btn').addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'hi' : 'en';
    LanguageManager.setLanguage(newLang);
    onLangChange();
  });

  // Location Dropdown Toggle
  const locBtn = container.querySelector('#location-select-btn');
  const locMenu = container.querySelector('#location-dropdown-menu');
  const catBtn = container.querySelector('#category-dropdown-btn');
  const catMenu = container.querySelector('#category-dropdown-menu');

  locBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = locMenu.style.display === 'block';
    locMenu.style.display = isVisible ? 'none' : 'block';
    catMenu.style.display = 'none';
  });

  catBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = catMenu.style.display === 'block';
    catMenu.style.display = isVisible ? 'none' : 'block';
    locMenu.style.display = 'none';
  });

  // Location Item Clicks
  locMenu.querySelectorAll('.loc-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const locId = item.getAttribute('data-id');
      locMenu.style.display = 'none';
      if (onFilter) {
        onFilter({ type: 'location', value: locId });
      }
    });
  });

  // Category Item Clicks
  catMenu.querySelectorAll('.cat-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const catId = item.getAttribute('data-id');
      catMenu.style.display = 'none';
      if (onFilter) {
        onFilter({ type: 'category', value: catId });
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    if (locMenu) locMenu.style.display = 'none';
    if (catMenu) catMenu.style.display = 'none';
  });

  // Logo click resets filter
  container.querySelector('#header-brand-logo').addEventListener('click', () => {
    if (onFilter) {
      onFilter({ type: 'reset' });
    }
  });

  // Buyer My Orders Button
  container.querySelector('#header-buyer-orders-btn')?.addEventListener('click', () => {
    if (onOpenBuyerOrders) onOpenBuyerOrders();
  });

  // Notifications Bell
  container.querySelector('#header-notif-btn').addEventListener('click', () => {
    onOpenNotifs();
  });

  // Sign out button
  container.querySelector('#header-logout-btn').addEventListener('click', () => {
    if (confirm(t('confirmSignOut'))) {
      onLogout();
    }
  });
}
