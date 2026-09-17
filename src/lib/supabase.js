import { createClient } from '@supabase/supabase-js';
import { 
  INITIAL_CROPS, 
  INITIAL_ORDERS, 
  INITIAL_NOTIFICATIONS,
  INITIAL_PROCUREMENT_ITEMS,
  INITIAL_PROCUREMENT_BOOKINGS
} from './mockData.js';
import { resolveCropImages } from './cropImages.js';

const supabaseUrl = (import.meta.env && import.meta.env.VITE_SUPABASE_URL) || '';
const supabaseAnonKey = (import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || '';

// Check if credentials are configured
const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

console.log('--- Supabase Diagnostic ---');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseAnonKey);
console.log('Is Configured:', isConfigured);
console.log('-------------------------');

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseLive = isConfigured;

// -------------------------------------------------------------
// LOCAL STATE MANAGEMENT & FALLBACK STORE
// -------------------------------------------------------------
const STORAGE_KEYS = {
  USER: 'farmdirect_current_user',
  USERS_LIST: 'farmdirect_registered_users',
  CROPS: 'farmdirect_crops',
  ORDERS: 'farmdirect_orders',
  NOTIFICATIONS: 'farmdirect_notifications',
  PROCUREMENT_ITEMS: 'farmdirect_procurement_items_v2',
  PROCUREMENT_BOOKINGS: 'farmdirect_procurement_bookings_v2'
};

function getStorage(key, defaultVal) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setStorage(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('Storage error:', e);
  }
}

const STORAGE_VERSION_KEY = 'farmdirect_data_version';
const CURRENT_STORAGE_VERSION = 'v7_clean_avatars_and_editing';

// Initialise storage if empty or migrate if old vegetable data exists
if (localStorage.getItem(STORAGE_VERSION_KEY) !== CURRENT_STORAGE_VERSION) {
  setStorage(STORAGE_KEYS.CROPS, INITIAL_CROPS);
  setStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  setStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
}

if (!localStorage.getItem(STORAGE_KEYS.USERS_LIST)) {
  setStorage(STORAGE_KEYS.USERS_LIST, []);
}

// =============================================================
// UNIFIED DATA & AUTH ACCESS API
// =============================================================
export const FarmDirectApi = {
  getCurrentUser() {
    return getStorage(STORAGE_KEYS.USER, null);
  },

  setCurrentUser(user) {
    setStorage(STORAGE_KEYS.USER, user);
    return user;
  },

  async logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
    if (isSupabaseLive && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Signout note:', err);
      }
    }
  },

  // -----------------------------------------------------------
  // AUTHENTICATION: REGISTER USER (Email + Password + Supabase Profiles Table)
  // -----------------------------------------------------------
  async registerUser({ name, email, phone, password, role, location, avatar }) {
    let authUserId = null;
    const cleanPhone = phone ? phone.trim() : '+91 98765 00000';
    const userEmail = email ? email.trim().toLowerCase() : `${Date.now()}@farmdirect.in`;

    if (isSupabaseLive && supabase) {
      try {
        // 1. Supabase Auth signup (This will now succeed because triggers are gone)
        const { data, error } = await supabase.auth.signUp({
          email: userEmail,
          password: password,
          options: {
            data: {
              full_name: name,
              role: role,
              phone: cleanPhone,
              location: location
            }
          }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
              email: userEmail,
              password: password
            });
            if (loginError) return { success: false, error: `Login failed: ${loginError.message}` };
            if (loginData?.user) {
              authUserId = loginData.user.id;
            }
          } else {
            return { success: false, error: `Auth signup failed: ${error.message}` };
          }
        } else if (data?.user) {
          authUserId = data.user.id;
        }

        // 2. Profile insertion (Now we do the work in JS to avoid DB trigger crashes)
        if (authUserId) {
          const { error: profileError } = await supabase.from('profiles').upsert([
            {
              id: authUserId,
              full_name: name,
              email: userEmail,
              role: role,
              phone: cleanPhone,
              location: location || 'Meerut, Uttar Pradesh',
              avatar_url: avatar || (role === 'farmer' ? '👨‍🌾' : '🛒'),
              is_verified: true
            }
          ], { onConflict: 'id' });

          if (profileError) {
            return { success: false, error: `User created, but profile save failed: ${profileError.message}` };
          }
        } else {
          return { success: false, error: 'Authentication succeeded but no User ID was returned.' };
        }
      } catch (err) {
        return { success: false, error: `System error: ${err.message}` };
      }
    }

    // Local Fallback
    const userId = authUserId || `${role}-${Date.now()}`;
    const userProfile = {
      id: userId,
      auth_user_id: authUserId,
      name: name,
      email: userEmail,
      phone: cleanPhone,
      password: password,
      role: role,
      location: location || 'Meerut, Uttar Pradesh',
      avatar: avatar || (role === 'farmer' ? '👨‍🌾' : '🛒'),
      is_verified: true
    };

    const registeredList = getStorage(STORAGE_KEYS.USERS_LIST, []);
    setStorage(STORAGE_KEYS.USERS_LIST, [userProfile, ...registeredList.filter(u => u.email !== userEmail && u.phone !== cleanPhone)]);
    this.setCurrentUser(userProfile);
    return { success: true, user: userProfile };
  },

  // -----------------------------------------------------------
  // AUTHENTICATION: LOGIN USER (Supports Mobile or Email + Password)
  // -----------------------------------------------------------
  async loginUser(identifier, password) {
    const rawId = identifier.trim();
    const cleanPhoneDigits = rawId.replace(/[^0-9]/g, '');
    const isEmail = rawId.includes('@');
    const userEmail = isEmail ? rawId.toLowerCase() : `${cleanPhoneDigits}@farmdirect.in`;

    if (isSupabaseLive && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password: password
        });

        if (error) {
          // Only fall back to local check if it's a "User not found" or similar
          // Otherwise, return the actual auth error (e.g., invalid password)
          if (!error.message.includes('Invalid login credentials')) {
             return { success: false, error: `Auth error: ${error.message}` };
          }
        } else if (data?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

          const role = profileData?.role || data.user.user_metadata?.role || (userEmail.includes('farmer') ? 'farmer' : 'buyer');
          const userProfile = {
            id: profileData?.id || data.user.id,
            name: profileData?.full_name || data.user.user_metadata?.full_name || rawId.split('@')[0],
            email: userEmail,
            role: role,
            phone: profileData?.phone || data.user.user_metadata?.phone || rawId,
            location: profileData?.location || data.user.user_metadata?.location || 'Meerut, Uttar Pradesh',
            avatar: role === 'farmer' ? '👨‍🌾' : '🛒',
            is_verified: true
          };

          this.setCurrentUser(userProfile);
          return { success: true, user: userProfile };
        }
      } catch (err) {
        return { success: false, error: `System error during login: ${err.message}` };
      }
    }

    // Local registered users check
    const registeredList = getStorage(STORAGE_KEYS.USERS_LIST, []);
    const foundUser = registeredList.find(u =>
      u.email?.toLowerCase() === rawId.toLowerCase() ||
      u.phone?.replace(/[^0-9]/g, '') === cleanPhoneDigits ||
      u.phone === rawId
    );

    if (foundUser && (!foundUser.password || foundUser.password === password)) {
      this.setCurrentUser(foundUser);
      return { success: true, user: foundUser };
    }

    return {
      success: false,
      error: 'Account not found. Please enter valid login details or register below.'
    };
  },

  // -----------------------------------------------------------
  // MEDIA STORAGE: Upload Images/Videos to Supabase Storage
  // -----------------------------------------------------------
  async uploadMedia(files) {
    if (!isSupabaseLive || !supabase) {
      console.warn('Supabase not live, skipping real upload');
      return files.map(f => `mock-upload-${Date.now()}-${f.name}`);
    }

    try {
      const uploadedUrls = [];
      for (const file of files) {
        const filePath = `crops/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('crop-media')
          .upload(filePath, file);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('crop-media')
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }
      return uploadedUrls;
    } catch (err) {
      console.error('Media upload error:', err);
      throw err;
    }
  },

  // -----------------------------------------------------------
  // REAL-TIME NOTIFICATIONS
  // -----------------------------------------------------------
  subscribeToNotifications(userId, callback) {
    if (!isSupabaseLive || !supabase) return null;

    const channel = supabase
      .channel('realtime-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();

    return channel;
  },

  // -----------------------------------------------------------
  // PRODUCE LISTINGS (Merged Real-Time Supabase + Local Storage Store)
  // -----------------------------------------------------------
  async getCrops() {
    let remoteCrops = [];

    if (isSupabaseLive && supabase) {
      try {
        let { data, error } = await supabase
          .from('listings')
          .select(`
            *,
            farmer:profiles!farmer_id(full_name, phone, location)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          // Fallback if profiles foreign relation fails
          const simpleRes = await supabase
            .from('listings')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });
          data = simpleRes.data;
        }

        if (Array.isArray(data) && data.length > 0) {
          remoteCrops = data.map(item => {
            const resolvedImages = resolveCropImages(item.crop_name, item.category, item.image_paths);
            return {
              id: String(item.id),
              farmer_id: item.farmer_id || 'farmer-remote',
              farmer_name: item.farmer?.full_name || 'Verified Farmer',
              farmer_phone: item.farmer?.phone || '+91 98765 00000',
              farmer_rating: 4.8,
              farmer_reviews_count: 12,
              farmer_verified: true,
              title: item.crop_name,
              category: item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'Produce',
              quantity_available: Number(item.quantity_kg) || 100,
              unit: 'kg',
              price_per_unit: Number(item.price_per_kg) || 20,
              quality_grade: item.grade || 'Grade A',
              location: item.location || item.farmer?.location || 'Meerut, Uttar Pradesh',
              distance_km: 12,
              harvest_date: item.harvest_date ? `Harvested on ${item.harvest_date}` : 'Harvested recently',
              description: `${item.crop_name} - Fresh produce directly from farm gate. Graded and packed with high quality standards.`,
              tags: ['Organic', 'Farm Fresh', 'Grade A'],
              images: resolvedImages,
              status: 'active',
              price_intelligence: {
                current_market: Math.round(Number(item.price_per_kg) * 0.95),
                nearby_avg: Number(item.price_per_kg),
                highest_market: Math.round(Number(item.price_per_kg) * 1.25),
                trend: 'Increasing (↑ 10%)'
              }
            };
          });
        }
      } catch (err) {
        console.warn('Supabase listings fetch notice:', err);
      }
    }

    const localList = getStorage(STORAGE_KEYS.CROPS, INITIAL_CROPS).map(crop => ({
      ...crop,
      id: String(crop.id),
      images: resolveCropImages(crop.title, crop.category, crop.images)
    }));

    // Seamlessly merge Local & Remote: local user-created listings always take precedence
    const cropMap = new Map();
    remoteCrops.forEach(crop => {
      cropMap.set(String(crop.id), crop);
    });
    localList.forEach(crop => {
      cropMap.set(String(crop.id), crop);
    });

    const now = Date.now();
    const processedCrops = Array.from(cropMap.values()).map(crop => {
      const qty = Number(crop.quantity_available) || 0;
      if (qty <= 0) {
        if (!crop.out_of_stock_at) {
          crop.out_of_stock_at = crop.updated_at || crop.created_at || new Date().toISOString();
        }
        const oosTime = new Date(crop.out_of_stock_at).getTime();
        const hoursElapsed = (now - oosTime) / (1000 * 60 * 60);
        if (hoursElapsed >= 24) {
          crop.status = 'unlisted';
          crop.hours_until_unlisted = 0;
        } else {
          crop.status = 'out_of_stock';
          crop.hours_until_unlisted = Math.max(1, Math.ceil(24 - hoursElapsed));
        }
      } else {
        if (crop.status === 'out_of_stock' || crop.status === 'unlisted') {
          crop.status = 'active';
          delete crop.out_of_stock_at;
          delete crop.hours_until_unlisted;
        }
      }
      return crop;
    });

    processedCrops.sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;
      return String(b.id).localeCompare(String(a.id));
    });

    return processedCrops;
  },

  async getFarmerCrops(farmerId, farmerName) {
    const all = await this.getCrops();
    return all.filter(c => {
      if (farmerId && String(c.farmer_id) === String(farmerId)) return true;
      if (farmerName && c.farmer_name && c.farmer_name.toLowerCase() === farmerName.toLowerCase()) return true;
      return false;
    });
  },

  async addCrop(newCrop) {
    const finalImages = resolveCropImages(newCrop.title, newCrop.category, newCrop.images);
    let assignedId = 'crop-' + Date.now();

    // Check if farmer_id is a valid UUID
    let farmerUuid = null;
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newCrop.farmer_id || '')) {
      farmerUuid = newCrop.farmer_id;
    }

    if (isSupabaseLive && supabase) {
      try {
        // If farmer_id is not a UUID, resolve from profiles
        if (!farmerUuid) {
          if (newCrop.farmer_name) {
            const { data: prof } = await supabase.from('profiles').select('id').ilike('full_name', newCrop.farmer_name).maybeSingle();
            if (prof?.id) farmerUuid = prof.id;
          }
          if (!farmerUuid) {
            const { data: profList } = await supabase.from('profiles').select('id').eq('role', 'farmer').limit(1);
            if (profList && profList.length > 0) farmerUuid = profList[0].id;
          }
        }

        const cat = (newCrop.category || 'pulses').toLowerCase();
        const validCat = ['pulses', 'grains', 'spices', 'oilseeds', 'organic'].includes(cat) ? cat : 'grains';

        // Format harvest_date as valid YYYY-MM-DD
        const todayStr = new Date().toISOString().split('T')[0];
        let harvestDateStr = todayStr;
        if (newCrop.harvest_date && /^\d{4}-\d{2}-\d{2}$/.test(newCrop.harvest_date)) {
          harvestDateStr = newCrop.harvest_date;
        }

        const payload = {
          crop_name: newCrop.title,
          category: validCat,
          quantity_kg: Number(newCrop.quantity_available) || 100,
          price_per_kg: Number(newCrop.price_per_unit) || 20,
          grade: newCrop.quality_grade || 'Grade A',
          location: newCrop.location || 'Jaipur, Rajasthan',
          harvest_date: harvestDateStr,
          image_paths: finalImages,
          is_active: true
        };

        if (farmerUuid) {
          payload.farmer_id = farmerUuid;
        }

        const { data, error } = await supabase
          .from('listings')
          .insert([payload])
          .select();

        if (!error && data && data.length > 0) {
          assignedId = String(data[0].id);
        } else if (error) {
          console.warn('Supabase listing insert notice:', error.message);
        }
      } catch (err) {
        console.warn('Listing insert notice:', err);
      }
    }

    const cropWithId = {
      ...newCrop,
      id: assignedId,
      images: finalImages,
      created_at: new Date().toISOString()
    };

    const current = getStorage(STORAGE_KEYS.CROPS, INITIAL_CROPS);
    // Guarantee it is immediately saved locally across accounts
    setStorage(STORAGE_KEYS.CROPS, [cropWithId, ...current.filter(c => String(c.id) !== String(assignedId))]);

    // Dispatch broadcast event for live reactive updates across portals
    window.dispatchEvent(new CustomEvent('farmdirect:crops_updated', {
      detail: { crop: cropWithId, type: 'added' }
    }));

    return cropWithId;
  },

  async updateCrop(cropId, updatedData) {
    const finalImages = resolveCropImages(updatedData.title, updatedData.category, updatedData.images);

    if (isSupabaseLive && supabase) {
      try {
        const cat = (updatedData.category || 'pulses').toLowerCase();
        const validCat = ['pulses', 'grains', 'spices', 'oilseeds', 'organic'].includes(cat) ? cat : 'grains';

        const todayStr = new Date().toISOString().split('T')[0];
        let harvestDateStr = todayStr;
        if (updatedData.harvest_date && /^\d{4}-\d{2}-\d{2}$/.test(updatedData.harvest_date)) {
          harvestDateStr = updatedData.harvest_date;
        }

        const payload = {
          crop_name: updatedData.title,
          category: validCat,
          quantity_kg: Number(updatedData.quantity_available) || 100,
          price_per_kg: Number(updatedData.price_per_unit) || 20,
          grade: updatedData.quality_grade || 'Grade A',
          location: updatedData.location,
          harvest_date: harvestDateStr,
          image_paths: finalImages,
          is_active: true
        };

        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cropId)) {
          await supabase
            .from('listings')
            .update(payload)
            .eq('id', cropId);
        }
      } catch (err) {
        console.warn('Listing update notice:', err);
      }
    }

    const current = getStorage(STORAGE_KEYS.CROPS, INITIAL_CROPS);
    let updatedCrop = null;
    const updatedList = current.map(c => {
      if (String(c.id) === String(cropId)) {
        updatedCrop = {
          ...c,
          ...updatedData,
          id: cropId,
          images: finalImages,
          updated_at: new Date().toISOString()
        };
        return updatedCrop;
      }
      return c;
    });

    if (!updatedCrop) {
      updatedCrop = {
        ...updatedData,
        id: cropId,
        images: finalImages
      };
      updatedList.unshift(updatedCrop);
    }

    setStorage(STORAGE_KEYS.CROPS, updatedList);

    window.dispatchEvent(new CustomEvent('farmdirect:crops_updated', {
      detail: { cropId, crop: updatedCrop, type: 'updated' }
    }));

    return updatedCrop;
  },

  async deleteCrop(cropId) {
    if (isSupabaseLive && supabase) {
      try {
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cropId)) {
          await supabase.from('listings').delete().eq('id', cropId);
        }
      } catch (err) {
        console.warn('Listing delete notice:', err);
      }
    }
    const current = getStorage(STORAGE_KEYS.CROPS, INITIAL_CROPS);
    setStorage(STORAGE_KEYS.CROPS, current.filter(c => String(c.id) !== String(cropId)));

    window.dispatchEvent(new CustomEvent('farmdirect:crops_updated', {
      detail: { cropId, type: 'deleted' }
    }));

    return true;
  },

  // -----------------------------------------------------------
  // REAL-TIME MARKETPLACE SUBSCRIPTIONS
  // -----------------------------------------------------------
  subscribeToMarketplace(onChange) {
    if (!isSupabaseLive || !supabase) return null;

    try {
      const channel = supabase
        .channel('realtime-marketplace-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'listings' },
          () => {
            if (onChange) onChange();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          () => {
            if (onChange) onChange();
          }
        )
        .subscribe();

      return channel;
    } catch (err) {
      console.warn('Realtime subscribe error:', err);
      return null;
    }
  },

  // -----------------------------------------------------------
  // ORDERS
  // -----------------------------------------------------------
  async createOrder(orderPayload) {
    const orderId = 'FD' + Math.floor(1000 + Math.random() * 9000);
    let assignedOrderId = orderId;

    const order = {
      id: orderId,
      ...orderPayload,
      status: 'placed',
      date: 'Just now',
      time_ago: 'Just now',
      created_at: new Date().toISOString()
    };

    if (isSupabaseLive && supabase) {
      try {
        let buyerUuid = null;
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(order.buyer_id || '')) {
          buyerUuid = order.buyer_id;
        } else {
          const { data: bProf } = await supabase.from('profiles').select('id').eq('role', 'buyer').limit(1);
          if (bProf && bProf.length > 0) buyerUuid = bProf[0].id;
        }

        let farmerUuid = null;
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(order.farmer_id || '')) {
          farmerUuid = order.farmer_id;
        } else {
          const { data: fProf } = await supabase.from('profiles').select('id').eq('role', 'farmer').limit(1);
          if (fProf && fProf.length > 0) farmerUuid = fProf[0].id;
        }

        const isListingUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(order.crop_id || '');

        const dbOrderPayload = {
          quantity_kg: Number(order.quantity) || 10,
          total_price: Number(order.total_amount) || 100,
          status: 'placed'
        };

        if (isListingUuid) {
          dbOrderPayload.listing_id = order.crop_id;
        } else {
          const { data: anyListing } = await supabase.from('listings').select('id').limit(1);
          if (anyListing && anyListing.length > 0) {
            dbOrderPayload.listing_id = anyListing[0].id;
          }
        }

        if (buyerUuid) dbOrderPayload.buyer_id = buyerUuid;
        if (farmerUuid) dbOrderPayload.farmer_id = farmerUuid;

        if (dbOrderPayload.listing_id) {
          const { data: orderData, error: orderErr } = await supabase
            .from('orders')
            .insert([dbOrderPayload])
            .select();

          if (!orderErr && orderData && orderData.length > 0) {
            assignedOrderId = String(orderData[0].id);
            order.id = assignedOrderId;
          }
        }
      } catch (err) {
        console.warn('Order insert notice:', err);
      }
    }

    order.stock_deducted = false;

    const currentOrders = getStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    setStorage(STORAGE_KEYS.ORDERS, [order, ...currentOrders]);

    const notifs = getStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif = {
      id: 'notif-' + Date.now(),
      user_id: order.farmer_id,
      role: 'farmer',
      category: 'Orders',
      title: 'New Order Received',
      message: `${order.buyer_name} ordered ${order.quantity} kg of ${order.crop_title} (₹${order.total_amount})`,
      time_ago: 'Just now',
      read: false,
      icon: 'package-check'
    };
    setStorage(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifs]);

    // Dispatch broadcast events for instant reactive updates across all components & portals
    window.dispatchEvent(new CustomEvent('farmdirect:order_created', {
      detail: { order, notification: newNotif }
    }));
    window.dispatchEvent(new CustomEvent('farmdirect:order_status_updated', {
      detail: { orderId: order.id, status: order.status }
    }));
    window.dispatchEvent(new CustomEvent('farmdirect:notification_received', {
      detail: { notification: newNotif }
    }));

    // Start seamless auto-progression demo sequence
    this.scheduleAutoProgression(order.id);

    return order;
  },

  scheduleAutoProgression(orderId) {
    // Only auto-dispatch and auto-deliver after farmer has manually confirmed
    setTimeout(async () => {
      const orders = getStorage(STORAGE_KEYS.ORDERS, []);
      const cur = orders.find(o => String(o.id) === String(orderId));
      if (cur && (cur.status === 'Confirmed' || cur.status === 'confirmed')) {
        await this.updateOrderStatus(orderId, 'Out for Delivery');
      }
    }, 25000);

    setTimeout(async () => {
      const orders = getStorage(STORAGE_KEYS.ORDERS, []);
      const cur = orders.find(o => String(o.id) === String(orderId));
      if (cur && (cur.status === 'Out for Delivery' || cur.status === 'out_for_delivery')) {
        await this.updateOrderStatus(orderId, 'Delivered');
      }
    }, 45000);
  },

  async getBuyerOrders(buyerId) {
    let remoteOrders = [];
    if (isSupabaseLive && supabase) {
      try {
        const { data } = await supabase
          .from('orders')
          .select(`
            *,
            listing:listings!listing_id(crop_name, price_per_kg, location),
            farmer:profiles!farmer_id(full_name, phone)
          `)
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          remoteOrders = data.map(o => ({
            id: String(o.id),
            crop_id: o.listing_id,
            crop_title: o.listing?.crop_name || 'Produce Lot',
            buyer_id: o.buyer_id,
            farmer_id: o.farmer_id,
            farmer_name: o.farmer?.full_name || 'Verified Farmer',
            farmer_phone: o.farmer?.phone || '+91 98765 00000',
            quantity: o.quantity_kg,
            price_per_kg: o.listing?.price_per_kg || 20,
            total_amount: o.total_price,
            status: o.status || 'placed',
            delivery_option: 'Standard Mandi Transport',
            delivery_address: o.listing?.location || 'Direct Mandi Gate',
            date: new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            created_at: o.created_at
          }));
        }
      } catch (err) {
        console.warn('Orders fetch error:', err);
      }
    }

    const localOrders = getStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const orderMap = new Map();
    remoteOrders.forEach(o => orderMap.set(String(o.id), o));
    localOrders.forEach(o => {
      const existing = orderMap.get(String(o.id)) || {};
      orderMap.set(String(o.id), { ...existing, ...o });
    });

    const all = Array.from(orderMap.values());
    all.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return all;
  },

  async getFarmerOrders(farmerId, farmerName) {
    let remoteOrders = [];
    if (isSupabaseLive && supabase) {
      try {
        let { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            listing:listings!listing_id(crop_name, price_per_kg, location),
            buyer:profiles!buyer_id(full_name, phone, location)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          const simpleRes = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
          data = simpleRes.data;
        }

        if (data && data.length > 0) {
          remoteOrders = data.map(o => ({
            id: String(o.id),
            crop_id: o.listing_id || o.crop_id,
            crop_title: o.crop_title || o.listing?.crop_name || 'Produce Lot',
            buyer_id: o.buyer_id,
            buyer_name: o.buyer_name || o.buyer?.full_name || 'Direct Buyer',
            buyer_phone: o.buyer_phone || o.buyer?.phone || '+91 98765 88990',
            farmer_id: o.farmer_id,
            farmer_name: o.farmer_name,
            quantity: o.quantity || o.quantity_kg,
            price_per_kg: o.price_per_kg || o.listing?.price_per_kg || 20,
            total_amount: o.total_amount || o.total_price,
            status: o.status || 'placed',
            delivery_option: o.delivery_option || 'Standard Mandi Delivery',
            delivery_address: o.delivery_address || o.buyer?.location || 'Mandi Drop Gate',
            date: o.date || new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            created_at: o.created_at
          }));
        }
      } catch (err) {
        console.warn('Orders fetch error:', err);
      }
    }

    const localOrders = getStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const orderMap = new Map();
    remoteOrders.forEach(o => {
      orderMap.set(String(o.id), o);
    });
    localOrders.forEach(o => {
      orderMap.set(String(o.id), o);
    });

    const all = Array.from(orderMap.values());
    all.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

    if (farmerId || farmerName) {
      const fId = farmerId ? String(farmerId).toLowerCase() : '';
      const fName = farmerName ? String(farmerName).toLowerCase() : '';
      const crops = getStorage(STORAGE_KEYS.CROPS, []);
      const farmerCropIds = new Set(
        crops
          .filter(c => (fId && String(c.farmer_id).toLowerCase() === fId) || (fName && c.farmer_name && c.farmer_name.toLowerCase() === fName))
          .map(c => String(c.id))
      );

      const filtered = all.filter(o => {
        if (fId && o.farmer_id && String(o.farmer_id).toLowerCase() === fId) return true;
        if (fName && o.farmer_name && o.farmer_name.toLowerCase() === fName) return true;
        if (o.crop_id && farmerCropIds.has(String(o.crop_id))) return true;
        return false;
      });

      return filtered.length > 0 ? filtered : all;
    }

    return all;
  },

  async updateOrderStatus(orderId, status) {
    // Map status to valid PostgreSQL enum (placed, preparing, in_transit, delivered, cancelled)
    const s = (status || '').toLowerCase().trim();
    let dbStatus = 'placed';
    if (s.includes('cancel')) dbStatus = 'cancelled';
    else if (s.includes('out') || s.includes('transit') || s.includes('dispatch') || s.includes('ship')) dbStatus = 'in_transit';
    else if (s.includes('deliver') || s.includes('complete')) dbStatus = 'delivered';
    else if (s.includes('confirm') || s.includes('prepar') || s.includes('accept')) dbStatus = 'preparing';

    if (isSupabaseLive && supabase) {
      try {
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId)) {
          await supabase.from('orders').update({ 
            status: dbStatus,
            updated_at: new Date().toISOString()
          }).eq('id', orderId);
        }
      } catch (err) {
        console.warn('Order status update error:', err);
      }
    }

    const all = getStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    let updatedOrder = null;
    const isConfirmed = s.includes('confirm') || s.includes('prepar') || s.includes('transit') || s.includes('out') || s.includes('deliver');
    const isCancelled = s.includes('cancel');

    const updatedList = all.map(o => {
      if (String(o.id) === String(orderId)) {
        updatedOrder = { ...o, status, updated_at: new Date().toISOString() };
        return updatedOrder;
      }
      return o;
    });

    // Handle inventory deduction on confirmation
    if (updatedOrder && isConfirmed && !updatedOrder.stock_deducted) {
      const allCrops = getStorage(STORAGE_KEYS.CROPS, INITIAL_CROPS);
      const targetCropId = String(updatedOrder.crop_id);
      let targetCrop = null;

      const updatedCrops = allCrops.map(crop => {
        if (String(crop.id) === targetCropId || (updatedOrder.crop_title && crop.title === updatedOrder.crop_title)) {
          const prevQty = Number(crop.quantity_available) || 0;
          const orderQty = Number(updatedOrder.quantity) || 0;
          const newQty = Math.max(0, prevQty - orderQty);
          
          crop.quantity_available = newQty;
          if (newQty === 0) {
            crop.status = 'out_of_stock';
            crop.out_of_stock_at = new Date().toISOString();
            crop.hours_until_unlisted = 24;
          }
          targetCrop = crop;
        }
        return crop;
      });

      setStorage(STORAGE_KEYS.CROPS, updatedCrops);
      updatedOrder.stock_deducted = true;

      // Update Supabase if live
      if (isSupabaseLive && supabase && targetCrop) {
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetCrop.id)) {
          supabase.from('listings').update({ quantity_kg: targetCrop.quantity_available }).eq('id', targetCrop.id).then(() => {});
        }
      }

      window.dispatchEvent(new CustomEvent('farmdirect:crops_updated', {
        detail: { crop: targetCrop, type: 'stock_deducted' }
      }));
    } else if (updatedOrder && isCancelled && updatedOrder.stock_deducted) {
      // Restore stock on order cancellation
      const allCrops = getStorage(STORAGE_KEYS.CROPS, INITIAL_CROPS);
      const targetCropId = String(updatedOrder.crop_id);
      let targetCrop = null;

      const updatedCrops = allCrops.map(crop => {
        if (String(crop.id) === targetCropId || (updatedOrder.crop_title && crop.title === updatedOrder.crop_title)) {
          const prevQty = Number(crop.quantity_available) || 0;
          const orderQty = Number(updatedOrder.quantity) || 0;
          crop.quantity_available = prevQty + orderQty;
          if (crop.quantity_available > 0) {
            crop.status = 'active';
            delete crop.out_of_stock_at;
            delete crop.hours_until_unlisted;
          }
          targetCrop = crop;
        }
        return crop;
      });

      setStorage(STORAGE_KEYS.CROPS, updatedCrops);
      updatedOrder.stock_deducted = false;

      if (isSupabaseLive && supabase && targetCrop) {
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetCrop.id)) {
          supabase.from('listings').update({ quantity_kg: targetCrop.quantity_available }).eq('id', targetCrop.id).then(() => {});
        }
      }

      window.dispatchEvent(new CustomEvent('farmdirect:crops_updated', {
        detail: { crop: targetCrop, type: 'stock_restored' }
      }));
    }

    setStorage(STORAGE_KEYS.ORDERS, updatedList);

    // Create real-time notification for both buyer and farmer
    if (updatedOrder) {
      const notifs = getStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
      const isConfirmedNotif = status.toLowerCase().includes('confirm');
      const isDelivered = status.toLowerCase().includes('deliver');
      const isDispatched = status.toLowerCase().includes('delivery') || status.toLowerCase().includes('transit') || status.toLowerCase().includes('out');

      const title = isDelivered ? 'Order Delivered 🎉' :
                    isDispatched ? 'Order In Transit / Out for Delivery 🚚' :
                    isConfirmedNotif ? 'Order Confirmed by Farmer ✅' : `Order Status Updated: ${status}`;

      const buyerNotif = {
        id: 'notif-' + Date.now(),
        user_id: updatedOrder.buyer_id,
        role: 'buyer',
        category: 'Orders',
        title: title,
        message: `Your order #${updatedOrder.id} for ${updatedOrder.crop_title || 'produce'} (${updatedOrder.quantity} kg) is now ${status}.`,
        time_ago: 'Just now',
        read: false,
        icon: 'package-check'
      };

      setStorage(STORAGE_KEYS.NOTIFICATIONS, [buyerNotif, ...notifs]);
    }

    // Broadcast across windows / listeners
    window.dispatchEvent(new CustomEvent('farmdirect:order_status_updated', {
      detail: { orderId, status }
    }));

    return true;
  },

  // -----------------------------------------------------------
  // NOTIFICATIONS
  // -----------------------------------------------------------
  async getNotifications(role, userId) {
    const all = getStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    if (!role) return all;
    return all.filter(n => {
      if (userId && n.user_id && n.user_id === userId) return true;
      return n.role === role || n.role === 'both';
    });
  },

  async markNotificationRead(notifId) {
    const all = getStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setStorage(STORAGE_KEYS.NOTIFICATIONS, all.map(n => n.id === notifId ? { ...n, read: true } : n));
    return true;
  },

  // -----------------------------------------------------------
  // 🚜 FARMER PROCUREMENTS & PRIORITY QUEUE SYSTEM
  // -----------------------------------------------------------
  async getProcurementCatalog(category = 'All') {
    const all = getStorage(STORAGE_KEYS.PROCUREMENT_ITEMS, INITIAL_PROCUREMENT_ITEMS);
    if (!category || category === 'All') return all;
    return all.filter(item => item.category.toLowerCase() === category.toLowerCase());
  },

  calculatePriorityScore({ landholdingCategory, sowingDate, isVerified = true }) {
    let score = 0;

    // 1. Landholding Factor (Max 40 pts - prioritizes small/marginal farmers)
    const landCat = (landholdingCategory || 'marginal').toLowerCase();
    if (landCat.includes('marginal')) score += 40;
    else if (landCat.includes('small')) score += 30;
    else if (landCat.includes('medium')) score += 20;
    else score += 10;

    // 2. Sowing Window Urgency Factor (Max 30 pts)
    if (sowingDate) {
      const targetDate = new Date(sowingDate).getTime();
      const now = Date.now();
      const diffDays = Math.max(0, Math.round((targetDate - now) / (1000 * 60 * 60 * 24)));
      if (diffDays <= 4) score += 30;
      else if (diffDays <= 10) score += 20;
      else score += 10;
    } else {
      score += 20;
    }

    // 3. Verification Factor (Max 20 pts)
    score += isVerified ? 20 : 10;

    // 4. Fair Season Allocation Bonus (10 pts)
    score += 10;

    return Math.min(100, Math.max(10, score));
  },

  async createProcurementBooking(payload) {
    const items = getStorage(STORAGE_KEYS.PROCUREMENT_ITEMS, INITIAL_PROCUREMENT_ITEMS);
    const bookings = getStorage(STORAGE_KEYS.PROCUREMENT_BOOKINGS, INITIAL_PROCUREMENT_BOOKINGS);

    const targetItem = items.find(i => String(i.id) === String(payload.item_id)) || items[0];
    const qty = Math.min(targetItem.max_per_farmer || 15, Math.max(1, Number(payload.quantity) || 1));

    // Deduct available block quota
    const updatedItems = items.map(item => {
      if (String(item.id) === String(targetItem.id)) {
        return {
          ...item,
          available_quota: Math.max(0, (Number(item.available_quota) || 0) - qty)
        };
      }
      return item;
    });
    setStorage(STORAGE_KEYS.PROCUREMENT_ITEMS, updatedItems);

    // Compute priority score
    const priorityScore = this.calculatePriorityScore({
      landholdingCategory: payload.landholding_category,
      sowingDate: payload.sowing_date,
      isVerified: true
    });

    const maxToken = bookings.reduce((max, b) => Math.max(max, b.token_number || 100), 100);
    const tokenNumber = maxToken + 1;
    const bookingId = `BK-${targetItem.name.substring(0, 3).toUpperCase()}-${tokenNumber}`;

    // Compute time slot (spaced 30-min window)
    const slotHours = 9 + ((tokenNumber % 8) * 0.5);
    const startHour = Math.floor(slotHours);
    const startMin = (slotHours % 1) * 60 === 0 ? '00' : '30';
    const endHour = Math.floor(slotHours + 0.5);
    const endMin = ((slotHours + 0.5) % 1) * 60 === 0 ? '00' : '30';

    const slotText = `Tomorrow, ${startHour.toString().padStart(2, '0')}:${startMin} - ${endHour.toString().padStart(2, '0')}:${endMin}`;
    const counterNum = `Counter #${(tokenNumber % 4) + 1} (Gate ${(tokenNumber % 2) + 1})`;

    const totalAmount = qty * targetItem.subsidized_price;
    const marketAmount = qty * targetItem.market_price;
    const subsidySavings = Math.max(0, marketAmount - totalAmount);

    const newBooking = {
      id: bookingId,
      token_number: tokenNumber,
      farmer_id: payload.farmer_id || 'farmer-vaishnavi',
      farmer_name: payload.farmer_name || 'vaishnavi',
      farmer_phone: payload.farmer_phone || '+91 8209379826',
      item_id: targetItem.id,
      item_name: targetItem.name,
      item_name_hi: targetItem.name_hi,
      item_category: targetItem.category,
      quantity: qty,
      unit: targetItem.unit || 'bags',
      unit_price: targetItem.subsidized_price,
      total_amount: totalAmount,
      subsidy_savings: subsidySavings,
      landholding_category: payload.landholding_category || 'small',
      land_area: payload.land_area || 'Small Farmer (< 2 Hectares)',
      sowing_date: payload.sowing_date || new Date().toISOString().split('T')[0],
      priority_score: priorityScore,
      status: 'Confirmed',
      queue_position: Math.max(1, (tokenNumber % 6) + 1),
      currently_serving_token: Math.max(100, tokenNumber - 4),
      estimated_wait_minutes: Math.max(5, ((tokenNumber % 6) + 1) * 4),
      pickup_date: slotText,
      pickup_counter: counterNum,
      distribution_center: payload.distribution_center || targetItem.distribution_center,
      qr_code_id: `FD-PRC-${targetItem.id}-${tokenNumber}-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString()
    };

    setStorage(STORAGE_KEYS.PROCUREMENT_BOOKINGS, [newBooking, ...bookings]);

    // Send farmer notification
    const notifs = getStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const procNotif = {
      id: 'notif-prc-' + Date.now(),
      user_id: payload.farmer_id,
      role: 'farmer',
      category: 'Procurement',
      title: `Token #${tokenNumber} Issued (${targetItem.name.split(' ')[0]})`,
      message: `Your pre-booking for ${qty} ${targetItem.unit} of ${targetItem.name} is confirmed. Priority Score: ${priorityScore}/100. Slot: ${slotText}`,
      time_ago: 'Just now',
      read: false,
      icon: 'check'
    };
    setStorage(STORAGE_KEYS.NOTIFICATIONS, [procNotif, ...notifs]);

    window.dispatchEvent(new CustomEvent('farmdirect:procurement_updated', {
      detail: { booking: newBooking }
    }));

    return newBooking;
  },

  async getFarmerProcurementBookings(farmerId) {
    const bookings = getStorage(STORAGE_KEYS.PROCUREMENT_BOOKINGS, INITIAL_PROCUREMENT_BOOKINGS);
    if (!farmerId) return bookings;
    return bookings.filter(b => String(b.farmer_id) === String(farmerId));
  },

  async cancelProcurementBooking(bookingId) {
    const bookings = getStorage(STORAGE_KEYS.PROCUREMENT_BOOKINGS, INITIAL_PROCUREMENT_BOOKINGS);
    const items = getStorage(STORAGE_KEYS.PROCUREMENT_ITEMS, INITIAL_PROCUREMENT_ITEMS);

    const targetBooking = bookings.find(b => String(b.id) === String(bookingId));
    if (!targetBooking) return false;

    // Restore quota
    const updatedItems = items.map(item => {
      if (String(item.id) === String(targetBooking.item_id)) {
        return {
          ...item,
          available_quota: (Number(item.available_quota) || 0) + (Number(targetBooking.quantity) || 0)
        };
      }
      return item;
    });
    setStorage(STORAGE_KEYS.PROCUREMENT_ITEMS, updatedItems);

    const updatedBookings = bookings.map(b => {
      if (String(b.id) === String(bookingId)) {
        return {
          ...b,
          status: 'Cancelled',
          updated_at: new Date().toISOString()
        };
      }
      return b;
    });
    setStorage(STORAGE_KEYS.PROCUREMENT_BOOKINGS, updatedBookings);

    window.dispatchEvent(new CustomEvent('farmdirect:procurement_updated', {
      detail: { bookingId, status: 'Cancelled' }
    }));

    return true;
  }
};
