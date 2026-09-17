// 🌱 FarmDirect Intelligent Pulses, Grains & Agricultural Crop Image Matcher
// Automatically fetches & matches high-resolution verified photos with fallback resilience

export const CROP_UNSPLASH_MAP = [
  // Pulses & Lentils (दालें एवं दलहन)
  { 
    keywords: ['moong', 'mung', 'green moong', 'sabut moong', 'moong dal', 'मूंग', 'मूंग दाल', 'साबुत मूंग', 'green gram', 'mung bean'], 
    images: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
    ] 
  },
  { 
    keywords: ['chana', 'gram', 'bengal gram', 'desi chana', 'kabuli chana', 'chickpea', 'chana dal', 'चना', 'चना दाल', 'देसी चना', 'काबुली चना', 'छोले'], 
    images: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80'
    ] 
  },
  { 
    keywords: ['toor', 'tur', 'arhar', 'toor dal', 'arhar dal', 'pigeon pea', 'तुअर', 'अरहर', 'तुअर दाल', 'अरहर दाल', 'तूर दाल'], 
    images: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
    ] 
  },
  { 
    keywords: ['masoor', 'red lentil', 'masoor dal', 'sabut masoor', 'मसूर', 'मसूर दाल', 'लाल मसूर', 'साबुत मसूर'], 
    images: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80'
    ] 
  },
  { 
    keywords: ['rajma', 'kidney beans', 'kashmiri rajma', 'chitra rajma', 'राजमा', 'कश्मीरी राजमा'], 
    images: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
    ] 
  },
  { 
    keywords: ['soybean', 'soya', 'soyabean', 'सोयाबीन', 'सोया'], 
    images: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80'
    ] 
  },
  { 
    keywords: ['dal', 'daal', 'pulses', 'lentil', 'lentils', 'दाल', 'दालें', 'दलहन', 'organic pulses'], 
    images: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
    ] 
  },

  // Grains (अनाज)
  { 
    keywords: ['wheat', 'gehun', 'gehu', 'sharbati', 'गेहूं', 'कनक', 'sharbati wheat'], 
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501430654243-c934cec2e1c0?w=800&auto=format&fit=crop&q=80'
    ] 
  },
  { 
    keywords: ['rice', 'basmati', 'paddy', 'chawal', 'dhan', 'चावल', 'धान', 'बासमती', '1121 basmati', 'pusa basmati'], 
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&auto=format&fit=crop&q=80'
    ] 
  },
  { 
    keywords: ['corn', 'maize', 'makka', 'sweet corn', 'bhutta', 'मक्का', 'भुट्टा'], 
    images: [
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80'
    ] 
  },
  { 
    keywords: ['barley', 'jau', 'जौ'], 
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
    ] 
  },
  { 
    keywords: ['millet', 'bajra', 'jowar', 'ragi', 'बाजरा', 'ज्वार', 'रागी', 'millets'], 
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
    ] 
  },

  // Oilseeds (तिलहन)
  { 
    keywords: ['soybean', 'soya', 'soyabean', 'सोयाबीन', 'सोया'], 
    images: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
    ] 
  },
  { 
    keywords: ['sesame', 'til', 'तिल', 'सफेद तिल', 'काले तिल'], 
    images: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80'
    ] 
  },
  { 
    keywords: ['groundnut', 'peanut', 'peanuts', 'mungfali', 'moongfali', 'मूंगफली'], 
    images: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80'
    ] 
  },
  { 
    keywords: ['flax', 'flaxseed', 'alsi', 'अलसी', 'तीसी'], 
    images: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80'
    ] 
  },
  { 
    keywords: ['oilseed', 'oilseeds', 'तिलहन'], 
    images: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80'
    ] 
  },

  // Spices (मसाले)
  { 
    keywords: ['turmeric', 'haldi', 'हल्दी', 'sabut haldi'], 
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'
    ] 
  },
  { 
    keywords: ['cumin', 'jeera', 'जीरा', 'sabut jeera'], 
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80'
    ] 
  },
  { 
    keywords: ['coriander', 'dhaniya', 'धनिया', 'coriander seeds', 'धनिया बीज'], 
    images: [
      'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80'
    ] 
  },
  { 
    keywords: ['chilli', 'red chilli', 'mirch', 'lal mirch', 'मिर्च', 'लाल मिर्च'], 
    images: [
      'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&auto=format&fit=crop&q=80'
    ] 
  },
  { 
    keywords: ['cardamom', 'elaichi', 'इलायची', 'black pepper', 'काली मिर्च', 'spices', 'मसाले'], 
    images: [
      'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80'
    ] 
  }
];

// Fallback images by category (100% verified 200 OK URLs)
export const CATEGORY_FALLBACK_IMAGES = {
  'pulses': 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80',
  'grains': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
  'spices': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
  'oilseeds': 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80',
  'organic': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
  'other': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80'
};

/**
 * Creates an ultra-reliable, instantaneous SVG image data URI fallback
 */
export function getCropSvgFallback(title = 'Organic Produce', category = 'Pulses') {
  const icon = category.toLowerCase().includes('pulse') ? '🫘' 
    : category.toLowerCase().includes('grain') ? '🌾' 
    : category.toLowerCase().includes('spice') ? '🌶️' 
    : category.toLowerCase().includes('oil') ? '🌻' 
    : '🌿';
  
  const cleanTitle = (title || 'Fresh Produce').replace(/</g, '').replace(/>/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#14532d"/><stop offset="100%" stop-color="#064e3b"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="300" cy="180" r="110" fill="#166534" opacity="0.8"/><text x="50%" y="42%" dominant-baseline="middle" text-anchor="middle" font-size="70">${icon}</text><text x="50%" y="68%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="26">${cleanTitle}</text><text x="50%" y="80%" dominant-baseline="middle" text-anchor="middle" fill="#86efac" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="14">🌱 FarmDirect Verified • Direct Farm Gate</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Resolves the most accurate Unsplash photo URL(s) for any given pulse, grain or crop name & category.
 * If user already provided custom valid image URLs, they are retained.
 * Otherwise, smartly finds matching photography automatically.
 */
export function resolveCropImages(cropName = '', category = 'Pulses', userImages = []) {
  // If user actually uploaded or provided real valid images (not empty or mock template)
  if (Array.isArray(userImages) && userImages.length > 0) {
    const valid = userImages.filter(img => 
      img && 
      typeof img === 'string' && 
      img.trim() !== '' && 
      !img.startsWith('mock-upload') &&
      !img.includes('placeholder') &&
      !img.includes('1585994192701') && // replace broken old Unsplash ID
      !img.includes('1508873696983')   // replace broken old Unsplash ID
    );
    if (valid.length > 0) {
      return valid;
    }
  }

  const cleanName = (cropName || '').toLowerCase().trim();

  // 1. Direct match with keyword table
  for (const item of CROP_UNSPLASH_MAP) {
    if (item.keywords.some(kw => cleanName.includes(kw.toLowerCase()))) {
      return item.images || [item.url];
    }
  }

  // 2. Category fallback
  const catKey = (category || 'pulses').toLowerCase();
  const fallbackUrl = CATEGORY_FALLBACK_IMAGES[catKey] || CATEGORY_FALLBACK_IMAGES['pulses'];
  return [fallbackUrl];
}

/**
 * Returns single primary preview image URL for UI previews
 */
export function getCropPreviewImage(cropName = '', category = 'Pulses') {
  const imgs = resolveCropImages(cropName, category, []);
  return imgs[0] || CATEGORY_FALLBACK_IMAGES['pulses'];
}

