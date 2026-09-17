// 🌱 FarmDirect Main Application Controller
import { FarmDirectApi } from './lib/supabase.js';
import { Icons } from './lib/icons.js';
import { 
  renderOnboarding, 
  renderLogin, 
  renderSignup, 
  renderRoleSelection
} from './components/AuthScreens.js';
import { renderHeader } from './components/Header.js';
import { renderMarketplaceFeed } from './components/MarketplaceFeed.js';
import { renderListingDetailModal } from './components/ListingDetailModal.js';
import { renderOrderModal } from './components/OrderModal.js';
import { renderNotificationsDrawer } from './components/NotificationsDrawer.js';
import { renderFarmerDashboard } from './components/FarmerDashboard.js';
import { renderAddCropModal } from './components/AddCropModal.js';
import { renderBuyerOrdersModal } from './components/BuyerOrdersView.js';

class FarmDirectApp {
  constructor() {
    this.appEl = document.getElementById('app');
    this.currentUser = FarmDirectApi.getCurrentUser();
    this.currentScreen = this.currentUser ? 'app' : 'onboarding';
    this.registrationState = { name: '', email: '', role: 'farmer' };

    // App state
    this.crops = [];
    this.selectedCrop = null;
    this.orderState = null; // { crop, quantity }
    this.showNotifications = false;
    this.showAddCrop = false;
    this.showBuyerOrders = false;

    // Filters
    this.filters = {
      search: '',
      category: 'All',
      location: 'all',
      maxPrice: null, // Default: no upper bound so all prices are visible
      grade: 'all',
      quantityRange: 'all',
      sort: 'latest'
    };

    this.init();
  }

  async init() {
    await this.refreshCrops();
    this.render();

    // 1. Real-time Supabase postgres_changes subscription
    try {
      this.realtimeChannel = FarmDirectApi.subscribeToMarketplace(async () => {
        await this.refreshCrops();
        if (this.currentScreen === 'app' && this.currentUser?.role !== 'farmer') {
          this.renderMainContent();
        }
      });
    } catch (e) {
      console.warn('Realtime channel subscribe warning:', e);
    }

    // 2. Instant local in-window event broadcast
    window.addEventListener('farmdirect:crops_updated', async () => {
      await this.refreshCrops();
      if (this.currentScreen === 'app' && this.currentUser?.role !== 'farmer') {
        this.renderMainContent();
      }
    });

    // 3. Cross-tab/Cross-window storage sync
    window.addEventListener('storage', async (e) => {
      if (e.key === 'farmdirect_crops' || e.key === 'farmdirect_orders' || e.key === 'farmdirect_notifications') {
        await this.refreshCrops();
        if (this.currentScreen === 'app' && this.currentUser?.role !== 'farmer') {
          this.renderMainContent();
        }
      }
    });

    // 4. Periodic liveness polling (every 3 seconds) for seamless multi-device sync
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(async () => {
      if (this.currentScreen === 'app' && this.currentUser?.role !== 'farmer') {
        const prevCount = this.crops.length;
        await this.refreshCrops();
        if (this.crops.length !== prevCount) {
          this.renderMainContent();
        }
      }
    }, 3000);
  }

  async refreshCrops() {
    this.crops = await FarmDirectApi.getCrops();
  }

  navigate(screen) {
    this.currentScreen = screen;
    this.currentUser = FarmDirectApi.getCurrentUser();
    this.render();
  }

  getFilteredCrops() {
    return this.crops.filter(crop => {
      // Exclude crops that have been unlisted (after 24 hours of 0 stock)
      if (crop.status === 'unlisted') {
        return false;
      }

      // Search
      if (this.filters.search) {
        const query = this.filters.search.toLowerCase().trim();
        const matchesTitle = (crop.title || '').toLowerCase().includes(query);
        const matchesFarmer = (crop.farmer_name || '').toLowerCase().includes(query);
        const matchesLocation = (crop.location || '').toLowerCase().includes(query);
        const matchesCategory = (crop.category || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesFarmer && !matchesLocation && !matchesCategory) {
          return false;
        }
      }

      // Category matching (handles Pulses, Grains, Spices, Oilseeds, Organic with tags)
      if (this.filters.category && this.filters.category !== 'All') {
        const targetCat = this.filters.category.toLowerCase().trim();
        const cropCat = (crop.category || '').toLowerCase().trim();
        const cropTitle = (crop.title || '').toLowerCase().trim();
        const cropTags = (crop.tags || []).map(t => String(t).toLowerCase());

        let matchesCat = cropCat === targetCat || cropCat.includes(targetCat) || targetCat.includes(cropCat);
        if (targetCat === 'organic' && (cropTags.includes('organic') || cropTitle.includes('organic') || (crop.quality_grade || '').toLowerCase().includes('organic'))) {
          matchesCat = true;
        }
        if (!matchesCat) return false;
      }

      // Location (Robust matching handling whitespace, commas, city and state names)
      if (this.filters.location && this.filters.location !== 'all') {
        const targetLoc = this.filters.location.toLowerCase().trim();
        const cropLoc = (crop.location || '').toLowerCase().trim();
        
        const normTarget = targetLoc.replace(/[^a-z0-9]/g, '');
        const normCrop = cropLoc.replace(/[^a-z0-9]/g, '');

        let isMatch = normCrop.includes(normTarget) || normTarget.includes(normCrop);
        
        if (!isMatch) {
          const targetTokens = targetLoc.split(/[\s,]+/);
          const cropTokens = cropLoc.split(/[\s,]+/);
          isMatch = targetTokens.some(t => t.length >= 3 && cropTokens.some(c => c.includes(t) || t.includes(c)));
        }

        if (!isMatch) return false;
      }

      // Max price
      if (this.filters.maxPrice !== null && this.filters.maxPrice !== undefined) {
        if (Number(crop.price_per_unit) > Number(this.filters.maxPrice)) return false;
      }

      // Grade
      if (this.filters.grade && this.filters.grade !== 'all') {
        if (this.filters.grade === 'Organic') {
          if (!crop.tags?.includes('Organic') && !crop.title?.toLowerCase().includes('organic')) return false;
        } else if (crop.quality_grade !== this.filters.grade) {
          return false;
        }
      }

      // Quantity range
      if (this.filters.quantityRange && this.filters.quantityRange !== 'all') {
        if (this.filters.quantityRange === 'small' && crop.quantity_available >= 100) return false;
        if (this.filters.quantityRange === 'medium' && (crop.quantity_available < 100 || crop.quantity_available > 500)) return false;
        if (this.filters.quantityRange === 'bulk' && crop.quantity_available < 500) return false;
      }

      return true;
    }).sort((a, b) => {
      if (this.filters.sort === 'price_asc') return a.price_per_unit - b.price_per_unit;
      if (this.filters.sort === 'price_desc') return b.price_per_unit - a.price_per_unit;
      if (this.filters.sort === 'rating') return (b.farmer_rating || 0) - (a.farmer_rating || 0);
      
      // Default: 'latest' (newest harvests and newly listed crops first)
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;
      return String(b.id).localeCompare(String(a.id));
    });
  }

  render() {
    this.appEl.innerHTML = '';

    // If user is not logged in or in auth screens
    if (this.currentScreen === 'onboarding') {
      renderOnboarding(this.appEl, (scr) => this.navigate(scr), this.registrationState);
      return;
    }
    if (this.currentScreen === 'login') {
      renderLogin(this.appEl, (scr) => this.navigate(scr), this.registrationState);
      return;
    }
    if (this.currentScreen === 'signup') {
      renderSignup(this.appEl, (scr) => this.navigate(scr), this.registrationState);
      return;
    }
    if (this.currentScreen === 'role_selection') {
      renderRoleSelection(this.appEl, (scr) => this.navigate(scr), this.registrationState);
      return;
    }

    // Authenticated App Shell
    const isFarmer = this.currentUser?.role === 'farmer';

    // 1. Header Container
    const headerContainer = document.createElement('div');
    renderHeader(headerContainer, {
      user: this.currentUser,
      unreadCount: 3,
      currentFilters: this.filters,
      onSearch: (searchTerm) => {
        this.filters.search = searchTerm;
        this.renderMainContent();
      },
      onFilter: (filter) => {
        if (filter.type === 'category') {
          this.filters.category = filter.value;
        } else if (filter.type === 'location') {
          this.filters.location = filter.value;
        } else if (filter.type === 'reset') {
          this.filters.category = 'All';
          this.filters.location = 'all';
          this.filters.search = '';
        }
        this.render();
      },
      onLangChange: () => {
        this.render();
      },
      onOpenNotifs: () => {
        this.showNotifications = true;
        this.renderModals();
      },
      onOpenBuyerOrders: () => {
        this.showBuyerOrders = true;
        this.renderModals();
      },
      onLogout: () => {
        FarmDirectApi.logout();
        this.currentUser = null;
        this.navigate('login');
      }
    });
    this.appEl.appendChild(headerContainer);

    // 2. Main Content Container
    this.mainAreaContainer = document.createElement('div');
    this.appEl.appendChild(this.mainAreaContainer);
    this.renderMainContent();

    // 3. Mobile Bottom Navigation (Matching screenshot)
    const mobileNav = document.createElement('nav');
    mobileNav.className = 'mobile-bottom-nav';
    mobileNav.innerHTML = `
      <button class="mobile-nav-btn active" id="mob-nav-home">
        <span>${Icons.home}</span>
        <span>${isFarmer ? 'Listings' : 'Feed'}</span>
      </button>
      <button class="mobile-nav-btn" id="mob-nav-orders">
        <span>${Icons.packageCheck}</span>
        <span>Orders</span>
      </button>
      <button class="mobile-nav-btn" id="mob-nav-notifs">
        <span>${Icons.bell}</span>
        <span>Alerts</span>
      </button>
      <button class="mobile-nav-btn" id="mob-nav-profile">
        <span>${Icons.user}</span>
        <span>Profile</span>
      </button>
    `;
    this.appEl.appendChild(mobileNav);

    mobileNav.querySelector('#mob-nav-home').addEventListener('click', () => {
      this.filters.search = '';
      this.filters.category = 'All';
      this.renderMainContent();
    });

    mobileNav.querySelector('#mob-nav-orders').addEventListener('click', () => {
      if (isFarmer) {
        // If farmer, farmer dashboard has My Orders tab
        this.renderMainContent();
      } else {
        this.showBuyerOrders = true;
        this.renderModals();
      }
    });

    mobileNav.querySelector('#mob-nav-notifs').addEventListener('click', () => {
      this.showNotifications = true;
      this.renderModals();
    });

    mobileNav.querySelector('#mob-nav-profile').addEventListener('click', () => {
      alert(`Logged in as: ${this.currentUser?.name}\nRole: ${this.currentUser?.role?.toUpperCase()}\nLocation: ${this.currentUser?.location}\nPhone: ${this.currentUser?.phone}`);
    });

    // 4. Modals Container
    this.modalsContainer = document.createElement('div');
    this.appEl.appendChild(this.modalsContainer);
    this.renderModals();
  }

  renderMainContent() {
    this.mainAreaContainer.innerHTML = '';
    const isFarmer = this.currentUser?.role === 'farmer';

    if (isFarmer) {
      // STRICT ROLE SEPARATION: Render Dedicated Farmer Dashboard
      renderFarmerDashboard(this.mainAreaContainer, {
        farmerUser: this.currentUser,
        onOpenAddCrop: () => {
          this.editingCrop = null;
          this.showAddCrop = true;
          this.renderModals();
        },
        onEditCrop: (crop) => {
          this.editingCrop = crop;
          this.showAddCrop = true;
          this.selectedCrop = null;
          this.renderModals();
        },
        onSelectCrop: (crop) => {
          this.selectedCrop = crop;
          this.renderModals();
        }
      });
    } else {
      // STRICT ROLE SEPARATION: Render Buyer Marketplace Feed
      const filteredCrops = this.getFilteredCrops();
      renderMarketplaceFeed(this.mainAreaContainer, {
        crops: filteredCrops,
        filters: this.filters,
        currentCategory: this.filters.category,
        onSelectCrop: (crop) => {
          this.selectedCrop = crop;
          this.renderModals();
        },
        onOpenBuyerOrders: () => {
          this.showBuyerOrders = true;
          this.renderModals();
        },
        onFilterChange: (changes) => {
          if (changes.reset) {
            this.filters = {
              search: '',
              category: 'All',
              location: 'all',
              maxPrice: null,
              grade: 'all',
              quantityRange: 'all',
              sort: 'latest'
            };
          } else {
            Object.assign(this.filters, changes);
          }
          this.renderMainContent();
        }
      });
    }
  }

  renderModals() {
    this.modalsContainer.innerHTML = '';

    // 1. Listing Detail Modal (Screen 7 & 9)
    if (this.selectedCrop) {
      const detailWrap = document.createElement('div');
      renderListingDetailModal(detailWrap, {
        crop: this.selectedCrop,
        currentUser: this.currentUser,
        onClose: () => {
          this.selectedCrop = null;
          this.renderModals();
        },
        onEditCrop: (crop) => {
          this.selectedCrop = null;
          this.editingCrop = crop;
          this.showAddCrop = true;
          this.renderModals();
        },
        onDeleteCrop: async (cropId) => {
          await FarmDirectApi.deleteCrop(cropId);
          this.selectedCrop = null;
          await this.refreshCrops();
          this.renderMainContent();
          this.renderModals();
        },
        onOpenOrder: (crop, quantity) => {
          this.selectedCrop = null;
          this.orderState = { crop, quantity };
          this.renderModals();
        }
      });
      this.modalsContainer.appendChild(detailWrap);
    }

    // 2. Order Flow Modal (Screen 8)
    if (this.orderState) {
      const orderWrap = document.createElement('div');
      renderOrderModal(orderWrap, {
        crop: this.orderState.crop,
        quantity: this.orderState.quantity,
        currentUser: this.currentUser,
        onClose: () => {
          this.orderState = null;
          this.renderModals();
        },
        onOrderPlaced: async (order, viewInOrders) => {
          this.orderState = null;
          await this.refreshCrops();
          this.renderMainContent();
          if (viewInOrders) {
            this.showBuyerOrders = true;
          }
          this.renderModals();
        }
      });
      this.modalsContainer.appendChild(orderWrap);
    }

    // 3. Notifications Drawer (Screen 9)
    if (this.showNotifications) {
      const notifWrap = document.createElement('div');
      renderNotificationsDrawer(notifWrap, {
        userId: this.currentUser?.id,
        userRole: this.currentUser?.role,
        onClose: () => {
          this.showNotifications = false;
          this.renderModals();
        }
      });
      this.modalsContainer.appendChild(notifWrap);
    }

    // 4. Add / Edit Crop Modal (Farmer Only)
    if (this.showAddCrop) {
      const addCropWrap = document.createElement('div');
      renderAddCropModal(addCropWrap, {
        farmerUser: this.currentUser,
        editCrop: this.editingCrop,
        onClose: () => {
          this.showAddCrop = false;
          this.editingCrop = null;
          this.renderModals();
        },
        onCropAdded: async (newCrop) => {
          this.showAddCrop = false;
          this.editingCrop = null;
          await this.refreshCrops();
          this.renderMainContent();
          this.renderModals();
          alert(`Successfully listed ${newCrop.title} (${newCrop.quantity_available} kg) for ₹${newCrop.price_per_unit}/kg!`);
        },
        onCropUpdated: async (updatedCrop) => {
          this.showAddCrop = false;
          this.editingCrop = null;
          await this.refreshCrops();
          this.renderMainContent();
          this.renderModals();
          alert(`Successfully updated ${updatedCrop.title}!`);
        }
      });
      this.modalsContainer.appendChild(addCropWrap);
    }

    // 5. Buyer Orders Modal (Buyer Only)
    if (this.showBuyerOrders) {
      const buyerOrdersWrap = document.createElement('div');
      renderBuyerOrdersModal(buyerOrdersWrap, {
        buyerUser: this.currentUser,
        onClose: () => {
          this.showBuyerOrders = false;
          this.renderModals();
        }
      });
      this.modalsContainer.appendChild(buyerOrdersWrap);
    }
  }
}

// Boot the application
document.addEventListener('DOMContentLoaded', () => {
  try {
    new FarmDirectApp();
  } catch (error) {
    console.error('Critical Application Error:', error);
    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; text-align:center; font-family:sans-serif; padding:2rem;">
          <span style="font-size:3rem; margin-bottom:1rem;">⚠️</span>
          <h2 style="color:#0f172a; margin-bottom:0.5rem;">Something went wrong</h2>
          <p style="color:#64748b; max-width:400px; margin-bottom:1.5rem;">The application failed to start. This could be due to a configuration error or a network issue.</p>
          <button onclick="location.reload()" style="padding:0.75rem 1.5rem; background:#15803d; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600;">Try Again</button>
          <p style="margin-top:1rem; font-size:0.75rem; color:#94a3b8;">Error: ${error.message}</p>
        </div>
      `;
    }
  }
});
