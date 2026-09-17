// 🌱 FarmDirect Initial Seed / Mock Database & Local Persistence

export const INITIAL_CROPS = [
  // ==========================================
  // 1. PULSES (दालें)
  // ==========================================
  {
    id: "crop-moong-01",
    farmer_id: "farmer-rohit",
    farmer_name: "Rohit Sharma",
    farmer_avatar: "👨‍🌾",
    farmer_phone: "+91 98765 12340",
    farmer_rating: 4.8,
    farmer_reviews_count: 38,
    farmer_verified: true,
    title: "Organic Green Moong Dal",
    category: "Pulses",
    quantity_available: 800,
    unit: "kg",
    price_per_unit: 92,
    quality_grade: "Grade A",
    location: "Meerut, Uttar Pradesh",
    distance_km: 12,
    harvest_date: "Harvested 2 days ago",
    description: "100% natural, unpolished organic Green Moong (whole sabut). Sun-dried and machine cleaned with high protein content and excellent sprout rate.",
    tags: ["Organic", "High Protein", "Unpolished"],
    images: [
      "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    price_intelligence: {
      current_market: 90,
      nearby_avg: 92,
      highest_market: 98,
      trend: "Increasing (↑ 6%)",
      trend_direction: "up",
      demand: "High",
      suggested_action: "Strong wholesale pulse demand in Western UP & NCR mandis"
    },
    reviews: [
      {
        id: "rev-1",
        buyer_name: "Neha Verma",
        buyer_type: "Grocery Wholesaler",
        date: "12 Aug 2025",
        rating: 5,
        comment: "Excellent quality pulses! Clean and well sorted. Will order again in bulk."
      }
    ]
  },
  {
    id: "crop-chana-02",
    farmer_id: "farmer-suresh",
    farmer_name: "Suresh Kumar",
    farmer_avatar: "👨‍🌾",
    farmer_phone: "+91 98765 23451",
    farmer_rating: 4.7,
    farmer_reviews_count: 26,
    farmer_verified: true,
    title: "Desi Chana (Bengal Gram)",
    category: "Pulses",
    quantity_available: 1500,
    unit: "kg",
    price_per_unit: 68,
    quality_grade: "Grade A",
    location: "Bijnor, Uttar Pradesh",
    distance_km: 45,
    harvest_date: "Harvested 3 days ago",
    description: "Premium brown desi chana. Bold grain size, low moisture, ideal for roasting, besan making, and whole cooking.",
    tags: ["Desi Variety", "Grade A", "Farm Fresh"],
    images: [
      "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    price_intelligence: {
      current_market: 65,
      nearby_avg: 68,
      highest_market: 74,
      trend: "Stable (→ 2%)",
      trend_direction: "stable",
      demand: "High",
      suggested_action: "Mandi prices stable; high volume sales recommended"
    },
    reviews: [
      {
        id: "rev-2",
        buyer_name: "Amit Patel",
        buyer_type: "Food Processor",
        date: "10 Aug 2025",
        rating: 5,
        comment: "Clean bold chana with zero pest infestation. Prompt pickup."
      }
    ]
  },
  {
    id: "crop-toor-03",
    farmer_id: "farmer-anil",
    farmer_name: "Anil Singh",
    farmer_avatar: "👨‍🌾",
    farmer_phone: "+91 98765 34562",
    farmer_rating: 4.9,
    farmer_reviews_count: 31,
    farmer_verified: true,
    title: "Desi Toor Dal (Arhar Dal)",
    category: "Pulses",
    quantity_available: 950,
    unit: "kg",
    price_per_unit: 115,
    quality_grade: "Grade A",
    location: "Saharanpur, Uttar Pradesh",
    distance_km: 60,
    harvest_date: "Harvested 2 days ago",
    description: "Unpolished organic Arhar / Toor dal. Machine sorted, natural yellow color without any synthetic polish or coloring.",
    tags: ["Unpolished", "Pure Organic", "Export Grade"],
    images: [
      "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    price_intelligence: {
      current_market: 112,
      nearby_avg: 115,
      highest_market: 125,
      trend: "Increasing (↑ 8%)",
      trend_direction: "up",
      demand: "Very High",
      suggested_action: "Toor dal price surging in Delhi-NCR; optimal selling window"
    },
    reviews: []
  },
  {
    id: "crop-rajma-07",
    farmer_id: "farmer-anil",
    farmer_name: "Anil Singh",
    farmer_avatar: "👨‍🌾",
    farmer_phone: "+91 98765 34562",
    farmer_rating: 4.9,
    farmer_reviews_count: 31,
    farmer_verified: true,
    title: "Kashmiri Red Rajma",
    category: "Pulses",
    quantity_available: 600,
    unit: "kg",
    price_per_unit: 125,
    quality_grade: "Grade A",
    location: "Shimla, Himachal Pradesh",
    distance_km: 180,
    harvest_date: "Harvested 4 days ago",
    description: "Authentic mountain-grown Kashmiri red kidney beans (Chitra Rajma). Melts easily on cooking with distinct rich flavor.",
    tags: ["Mountain Grown", "Chitra Rajma", "Grade A"],
    images: [
      "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    price_intelligence: {
      current_market: 120,
      nearby_avg: 125,
      highest_market: 140,
      trend: "Increasing (↑ 10%)",
      trend_direction: "up",
      demand: "High",
      suggested_action: "Premium pulse demand high across urban grocery stores"
    },
    reviews: []
  },
  {
    id: "crop-masoor-09",
    farmer_id: "farmer-rohit",
    farmer_name: "Rohit Sharma",
    farmer_avatar: "👨‍🌾",
    farmer_phone: "+91 98765 12340",
    farmer_rating: 4.8,
    farmer_reviews_count: 38,
    farmer_verified: true,
    title: "Desi Masoor Dal (Red Lentils)",
    category: "Pulses",
    quantity_available: 1100,
    unit: "kg",
    price_per_unit: 84,
    quality_grade: "Grade A",
    location: "Meerut, Uttar Pradesh",
    distance_km: 12,
    harvest_date: "Harvested 1 day ago",
    description: "Unpolished natural small-grain red masoor dal. Rich in iron, quick-cooking, freshly dehusked from local farm gate.",
    tags: ["Unpolished", "Direct Farm", "High Iron"],
    images: [
      "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    price_intelligence: {
      current_market: 80,
      nearby_avg: 84,
      highest_market: 90,
      trend: "Increasing (↑ 5%)",
      trend_direction: "up",
      demand: "High",
      suggested_action: "Strong retail inquiries in Meerut APMC"
    },
    reviews: []
  },

  // ==========================================
  // 2. GRAINS (अनाज)
  // ==========================================
  {
    id: "crop-wheat-04",
    farmer_id: "farmer-rohit",
    farmer_name: "Rohit Sharma",
    farmer_avatar: "👨‍🌾",
    farmer_phone: "+91 98765 12340",
    farmer_rating: 4.8,
    farmer_reviews_count: 38,
    farmer_verified: true,
    title: "Sharbati Golden Wheat",
    category: "Grains",
    quantity_available: 3000,
    unit: "kg",
    price_per_unit: 34,
    quality_grade: "Grade A",
    location: "Meerut, Uttar Pradesh",
    distance_km: 12,
    harvest_date: "Harvested 3 days ago",
    description: "Premium Sharbati wheat grains from traditional harvest. Golden luster, heavy grains yielding soft, nutritious rotis.",
    tags: ["Sharbati", "Grade A", "Direct Mandi"],
    images: [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1501430654243-c934cec2e1c0?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    price_intelligence: {
      current_market: 32,
      nearby_avg: 34,
      highest_market: 38,
      trend: "Increasing (↑ 5%)",
      trend_direction: "up",
      demand: "High",
      suggested_action: "High wholesale volume trade ongoing"
    },
    reviews: []
  },
  {
    id: "crop-rice-05",
    farmer_id: "farmer-suresh",
    farmer_name: "Suresh Kumar",
    farmer_avatar: "👨‍🌾",
    farmer_phone: "+91 98765 23451",
    farmer_rating: 4.7,
    farmer_reviews_count: 26,
    farmer_verified: true,
    title: "1121 Basmati Paddy Rice",
    category: "Grains",
    quantity_available: 2200,
    unit: "kg",
    price_per_unit: 48,
    quality_grade: "Grade A",
    location: "Karnal, Haryana",
    distance_km: 70,
    harvest_date: "Harvested 1 day ago",
    description: "Authentic Karnal 1121 aromatic Basmati paddy. Extra long slender grain with delicate natural aroma.",
    tags: ["1121 Basmati", "Aromatic", "Export Quality"],
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    price_intelligence: {
      current_market: 45,
      nearby_avg: 48,
      highest_market: 54,
      trend: "Increasing (↑ 7%)",
      trend_direction: "up",
      demand: "Very High",
      suggested_action: "High mill inquiries in Karnal & Delhi hubs"
    },
    reviews: []
  },
  {
    id: "crop-corn-08",
    farmer_id: "farmer-rohit",
    farmer_name: "Rohit Sharma",
    farmer_avatar: "👨‍🌾",
    farmer_phone: "+91 98765 12340",
    farmer_rating: 4.8,
    farmer_reviews_count: 38,
    farmer_verified: true,
    title: "Golden Sweet Corn Grains (मक्का)",
    category: "Grains",
    quantity_available: 1400,
    unit: "kg",
    price_per_unit: 26,
    quality_grade: "Grade A",
    location: "Meerut, Uttar Pradesh",
    distance_km: 12,
    harvest_date: "Harvested 2 days ago",
    description: "Sun-dried yellow maize corn kernels. Low moisture content, ideal for flour mills, poultry feed, and food processing.",
    tags: ["Sun Dried", "High Starch", "Cleaned"],
    images: [
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    price_intelligence: {
      current_market: 24,
      nearby_avg: 26,
      highest_market: 30,
      trend: "Stable (→ 1%)",
      trend_direction: "stable",
      demand: "Moderate",
      suggested_action: "Feed mill procurement steady"
    },
    reviews: []
  },
  {
    id: "crop-bajra-10",
    farmer_id: "farmer-priya",
    farmer_name: "Priya Devi",
    farmer_avatar: "👨‍🌾",
    farmer_phone: "+91 98765 45673",
    farmer_rating: 4.9,
    farmer_reviews_count: 45,
    farmer_verified: true,
    title: "Desi Pearl Millet (बाजरा)",
    category: "Grains",
    quantity_available: 1800,
    unit: "kg",
    price_per_unit: 28,
    quality_grade: "Grade A",
    location: "Muzaffarnagar, Uttar Pradesh",
    distance_km: 35,
    harvest_date: "Harvested 3 days ago",
    description: "Nutrient-rich desi bajra millet grains. High fiber, gluten-free traditional superfood grain grown with zero synthetic boosters.",
    tags: ["Millet", "Gluten Free", "Superfood"],
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    price_intelligence: {
      current_market: 26,
      nearby_avg: 28,
      highest_market: 32,
      trend: "Increasing (↑ 4%)",
      trend_direction: "up",
      demand: "High",
      suggested_action: "Millet demand rising in NCR health store chains"
    },
    reviews: []
  },

  // ==========================================
  // 3. SPICES (मसाले)
  // ==========================================
  {
    id: "crop-turmeric-11",
    farmer_id: "farmer-rohit",
    farmer_name: "Rohit Sharma",
    farmer_avatar: "👨‍🌾",
    farmer_phone: "+91 98765 12340",
    farmer_rating: 4.8,
    farmer_reviews_count: 38,
    farmer_verified: true,
    title: "Salem Pure Turmeric Root (हल्दी)",
    category: "Spices",
    quantity_available: 650,
    unit: "kg",
    price_per_unit: 135,
    quality_grade: "Grade A",
    location: "Meerut, Uttar Pradesh",
    distance_km: 12,
    harvest_date: "Harvested 4 days ago",
    description: "Whole finger turmeric roots (Sabut Haldi). Naturally sun-cured with high 4.8% curcumin content and vibrant aromatic color.",
    tags: ["High Curcumin", "Sun Cured", "Natural Aromatic"],
    images: [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    price_intelligence: {
      current_market: 130,
      nearby_avg: 135,
      highest_market: 150,
      trend: "Increasing (↑ 9%)",
      trend_direction: "up",
      demand: "Very High",
      suggested_action: "Ayurvedic and spice export mills bidding aggressively"
    },
    reviews: []
  },
  {
    id: "crop-cumin-12",
    farmer_id: "farmer-suresh",
    farmer_name: "Suresh Kumar",
    farmer_avatar: "👨‍🌾",
    farmer_phone: "+91 98765 23451",
    farmer_rating: 4.7,
    farmer_reviews_count: 26,
    farmer_verified: true,
    title: "Unpolished Cumin Seeds (जीरा)",
    category: "Spices",
    quantity_available: 450,
    unit: "kg",
    price_per_unit: 240,
    quality_grade: "Grade A",
    location: "Bijnor, Uttar Pradesh",
    distance_km: 45,
    harvest_date: "Harvested 2 days ago",
    description: "Machine-cleaned whole cumin seeds (Sabut Jeera). 99.5% purity, bold seeds with intense essential oil fragrance.",
    tags: ["99.5% Pure", "High Essential Oil", "Cleaned"],
    images: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    price_intelligence: {
      current_market: 230,
      nearby_avg: 240,
      highest_market: 265,
      trend: "Increasing (↑ 12%)",
      trend_direction: "up",
      demand: "High",
      suggested_action: "Unjha and Delhi spice terminals witnessing price peaks"
    },
    reviews: []
  },
  {
    id: "crop-coriander-13",
    farmer_id: "farmer-anil",
    farmer_name: "Anil Singh",
    farmer_avatar: "👨‍🌾",
    farmer_phone: "+91 98765 34562",
    farmer_rating: 4.9,
    farmer_reviews_count: 31,
    farmer_verified: true,
    title: "Whole Green Coriander Seeds (धनिया)",
    category: "Spices",
    quantity_available: 750,
    unit: "kg",
    price_per_unit: 95,
    quality_grade: "Grade A",
    location: "Saharanpur, Uttar Pradesh",
    distance_km: 60,
    harvest_date: "Harvested 3 days ago",
    description: "Eagle variety green coriander seeds. Naturally dried to preserve greenish tinge and sweet citrusy aroma.",
    tags: ["Eagle Variety", "Green Seeds", "Aromatic"],
    images: [
      "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    price_intelligence: {
      current_market: 90,
      nearby_avg: 95,
      highest_market: 105,
      trend: "Stable (→ 2%)",
      trend_direction: "stable",
      demand: "Moderate",
      suggested_action: "Steady local spice grinding unit sales"
    },
    reviews: []
  },

  // ==========================================
  // 4. OILSEEDS (तिलहन)
  // ==========================================
  {
    id: "crop-soybean-14",
    farmer_id: "farmer-rohit",
    farmer_name: "Rohit Sharma",
    farmer_avatar: "👨‍🌾",
    farmer_phone: "+91 98765 12340",
    farmer_rating: 4.8,
    farmer_reviews_count: 38,
    farmer_verified: true,
    title: "Organic Yellow Soybean (सोयाबीन)",
    category: "Oilseeds",
    quantity_available: 1200,
    unit: "kg",
    price_per_unit: 54,
    quality_grade: "Grade A",
    location: "Meerut, Uttar Pradesh",
    distance_km: 12,
    harvest_date: "Harvested 2 days ago",
    description: "High-protein yellow soybean seeds (40%+ protein, 20% oil content). Clean sorted, ideal for cold-press oil, tofu, and soymilk production.",
    tags: ["40% Protein", "Clean Sorted", "Grade A"],
    images: [
      "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    price_intelligence: {
      current_market: 50,
      nearby_avg: 54,
      highest_market: 60,
      trend: "Increasing (↑ 6%)",
      trend_direction: "up",
      demand: "High",
      suggested_action: "Oil extraction solvent plants actively purchasing"
    },
    reviews: []
  },
  {
    id: "crop-sesame-15",
    farmer_id: "farmer-suresh",
    farmer_name: "Suresh Kumar",
    farmer_avatar: "👨‍🌾",
    farmer_phone: "+91 98765 23451",
    farmer_rating: 4.7,
    farmer_reviews_count: 26,
    farmer_verified: true,
    title: "Natural White Sesame Seeds (सफेद तिल)",
    category: "Oilseeds",
    quantity_available: 500,
    unit: "kg",
    price_per_unit: 160,
    quality_grade: "Grade A",
    location: "Bijnor, Uttar Pradesh",
    distance_km: 45,
    harvest_date: "Harvested 4 days ago",
    description: "Premium unhulled natural white sesame seeds (Safed Til). Rich in calcium and zinc, high 50% natural oil content.",
    tags: ["Unhulled", "High Oil Content", "Direct Farm"],
    images: [
      "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    price_intelligence: {
      current_market: 152,
      nearby_avg: 160,
      highest_market: 175,
      trend: "Increasing (↑ 8%)",
      trend_direction: "up",
      demand: "Very High",
      suggested_action: "Winter confectionary and bakery demand soaring"
    },
    reviews: []
  },
  {
    id: "crop-flax-16",
    farmer_id: "farmer-priya",
    farmer_name: "Priya Devi",
    farmer_avatar: "👨‍🌾",
    farmer_phone: "+91 98765 45673",
    farmer_rating: 4.9,
    farmer_reviews_count: 45,
    farmer_verified: true,
    title: "Golden Flax Seeds / Alsi (अलसी)",
    category: "Oilseeds",
    quantity_available: 800,
    unit: "kg",
    price_per_unit: 78,
    quality_grade: "Grade A",
    location: "Muzaffarnagar, Uttar Pradesh",
    distance_km: 35,
    harvest_date: "Harvested 3 days ago",
    description: "Omega-3 rich golden brown flaxseeds (Alsi). Naturally harvested, cleaned, and tested for low moisture and high ALA content.",
    tags: ["Omega-3 Rich", "Alsi", "Superfood"],
    images: [
      "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    price_intelligence: {
      current_market: 74,
      nearby_avg: 78,
      highest_market: 85,
      trend: "Increasing (↑ 4%)",
      trend_direction: "up",
      demand: "Moderate",
      suggested_action: "Health food packaging mills sourcing continuously"
    },
    reviews: []
  },

  // ==========================================
  // 5. ORGANIC (जैविक)
  // ==========================================
  {
    id: "crop-org-wheat-17",
    farmer_id: "farmer-rohit",
    farmer_name: "Rohit Sharma",
    farmer_avatar: "👨‍🌾",
    farmer_phone: "+91 98765 12340",
    farmer_rating: 4.8,
    farmer_reviews_count: 38,
    farmer_verified: true,
    title: "Certified Organic Khapli Emmer Wheat",
    category: "Organic",
    quantity_available: 1500,
    unit: "kg",
    price_per_unit: 62,
    quality_grade: "Grade A",
    location: "Meerut, Uttar Pradesh",
    distance_km: 12,
    harvest_date: "Harvested 2 days ago",
    description: "Ancient heritage Emmer wheat (Khapli / Samba). Certified organic, diabetic-friendly low glycemic index, chemical-free farming.",
    tags: ["Certified Organic", "Ancient Grain", "Diabetic Friendly"],
    images: [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1501430654243-c934cec2e1c0?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    price_intelligence: {
      current_market: 58,
      nearby_avg: 62,
      highest_market: 70,
      trend: "Increasing (↑ 8%)",
      trend_direction: "up",
      demand: "Very High",
      suggested_action: "Premium organic flour brands buying at top rates"
    },
    reviews: []
  },
  {
    id: "crop-org-moong-18",
    farmer_id: "farmer-suresh",
    farmer_name: "Suresh Kumar",
    farmer_avatar: "👨‍🌾",
    farmer_phone: "+91 98765 23451",
    farmer_rating: 4.7,
    farmer_reviews_count: 26,
    farmer_verified: true,
    title: "Certified Organic Sprouting Moong (जैविक मूंग)",
    category: "Organic",
    quantity_available: 900,
    unit: "kg",
    price_per_unit: 98,
    quality_grade: "Grade A",
    location: "Bijnor, Uttar Pradesh",
    distance_km: 45,
    harvest_date: "Harvested 1 day ago",
    description: "NPOP certified organic green gram. 98%+ germination sprout rate, zero synthetic pesticides, packed in unbleached jute bags.",
    tags: ["NPOP Certified", "Zero Pesticide", "98% Sprout Rate"],
    images: [
      "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    price_intelligence: {
      current_market: 92,
      nearby_avg: 98,
      highest_market: 108,
      trend: "Increasing (↑ 7%)",
      trend_direction: "up",
      demand: "High",
      suggested_action: "Organic retail supermarkets placing repeated weekly orders"
    },
    reviews: []
  },
  {
    id: "crop-org-turmeric-19",
    farmer_id: "farmer-anil",
    farmer_name: "Anil Singh",
    farmer_avatar: "👨‍🌾",
    farmer_phone: "+91 98765 34562",
    farmer_rating: 4.9,
    farmer_reviews_count: 31,
    farmer_verified: true,
    title: "Organic High-Curcumin Turmeric (जैविक हल्दी)",
    category: "Organic",
    quantity_available: 350,
    unit: "kg",
    price_per_unit: 180,
    quality_grade: "Grade A",
    location: "Shimla, Himachal Pradesh",
    distance_km: 180,
    harvest_date: "Harvested 3 days ago",
    description: "Certified organic mountain turmeric with verified 7.2% curcumin potency. Naturally shade-dried and unpolished.",
    tags: ["7.2% Curcumin", "Mountain Organic", "Pure Natural"],
    images: [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    price_intelligence: {
      current_market: 170,
      nearby_avg: 180,
      highest_market: 210,
      trend: "Increasing (↑ 15%)",
      trend_direction: "up",
      demand: "Very High",
      suggested_action: "Pharma and wellness brands offering premium contract pricing"
    },
    reviews: []
  }
];

export const INITIAL_ORDERS = [
  {
    id: "FD2234",
    buyer_id: "buyer-neha",
    buyer_name: "Neha Verma",
    buyer_phone: "+91 98765 88990",
    farmer_id: "farmer-rohit",
    farmer_name: "Rohit Sharma",
    crop_id: "crop-moong-01",
    crop_title: "Organic Green Moong Dal",
    crop_image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&auto=format&fit=crop&q=80",
    quantity: 25,
    unit: "kg",
    unit_price: 92,
    delivery_option: "Home Delivery",
    delivery_fee: 40,
    total_amount: 2340,
    delivery_address: "Meerut, Uttar Pradesh",
    payment_method: "UPI (PhonePe / GPay)",
    status: "Confirmed",
    date: "Today, 11:30 AM",
    time_ago: "5h ago"
  },
  {
    id: "FD1187",
    buyer_id: "buyer-neha",
    buyer_name: "Neha Verma",
    buyer_phone: "+91 98765 88990",
    farmer_id: "farmer-suresh",
    farmer_name: "Suresh Kumar",
    crop_id: "crop-chana-02",
    crop_title: "Desi Chana (Bengal Gram)",
    crop_image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&auto=format&fit=crop&q=80",
    quantity: 50,
    unit: "kg",
    unit_price: 68,
    delivery_option: "Self Pickup (at farm)",
    delivery_fee: 0,
    total_amount: 3400,
    delivery_address: "Bijnor, Uttar Pradesh",
    payment_method: "Cash on Delivery",
    status: "Delivered",
    date: "Yesterday",
    time_ago: "1d ago"
  },
  {
    id: "FD9821",
    buyer_id: "buyer-amit",
    buyer_name: "Amit Patel",
    buyer_phone: "+91 98111 22334",
    farmer_id: "farmer-rohit",
    farmer_name: "Rohit Sharma",
    crop_id: "crop-wheat-04",
    crop_title: "Sharbati Golden Wheat",
    crop_image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80",
    quantity: 100,
    unit: "kg",
    unit_price: 34,
    delivery_option: "Home Delivery",
    delivery_fee: 40,
    total_amount: 3440,
    delivery_address: "Civil Lines, Meerut",
    payment_method: "UPI",
    status: "Preparing",
    date: "Today, 02:15 PM",
    time_ago: "2h ago"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    role: "farmer",
    category: "Orders",
    title: "New buyer interest",
    message: "Rahul Sharma is interested in your Green Moong Dal listing (50 kg)",
    time_ago: "2h ago",
    read: false,
    icon: "user-check"
  },
  {
    id: "notif-2",
    role: "both",
    category: "Orders",
    title: "Order placed",
    message: "Your order #FD2234 has been confirmed by farmer Rohit.",
    time_ago: "5h ago",
    read: false,
    icon: "package-check"
  },
  {
    id: "notif-3",
    role: "both",
    category: "Orders",
    title: "Order delivered",
    message: "Order #FD1187 for Desi Chana has been delivered successfully.",
    time_ago: "1d ago",
    read: true,
    icon: "truck"
  },
  {
    id: "notif-4",
    role: "farmer",
    category: "Alerts",
    title: "Price alert",
    message: "Green Moong price in your area increased by 6% on eNAM pulse mandi index.",
    time_ago: "1d ago",
    read: false,
    icon: "trending-up"
  },
  {
    id: "notif-5",
    role: "both",
    category: "Messages",
    title: "New message",
    message: "Priya Devi sent you a message regarding pulse dispatch.",
    time_ago: "2d ago",
    read: true,
    icon: "message-square"
  }
];

export const DEFAULT_FARMER_USER = {
  id: "farmer-rohit",
  name: "Rohit Sharma",
  role: "farmer",
  phone: "+91 98765 12340",
  location: "Meerut, Uttar Pradesh",
  avatar: "👨‍🌾",
  verified: true,
  rating: 4.6,
  reviewsCount: 32,
  stats: {
    totalProduce: 2000,
    sold: 1450,
    remaining: 550,
    revenue: 42000,
    avgPrice: 28,
    marketTrend: "Increasing (↑ 12%)"
  }
};

export const DEFAULT_BUYER_USER = {
  id: "buyer-neha",
  name: "Neha Verma",
  role: "buyer",
  phone: "+91 98765 88990",
  location: "Meerut, Uttar Pradesh",
  avatar: "🛒",
  verified: true,
  businessType: "Wholesale & Retail Buyer"
};

// ==========================================
// 4. GOVERNMENT SUBSIDIZED PROCUREMENT CATALOG
// ==========================================
export const INITIAL_PROCUREMENT_ITEMS = [
  {
    id: "proc-dap-01",
    category: "Fertilizers",
    name: "DAP Fertilizer (IFFCO / KRIBHCO 18:46:0)",
    name_hi: "डीएपी उर्वरक (इफको / कृभको 18:46:0)",
    spec: "50 kg Sealed Subsidized Bag",
    subsidized_price: 1350,
    market_price: 1950,
    total_quota: 1000,
    available_quota: 640,
    unit: "bags",
    max_per_farmer: 15,
    distribution_center: "Meerut Sadar PAC / IFFCO Kendra",
    district: "Meerut, Uttar Pradesh",
    active_season: "Rabi Season 2025-26",
    badge: "High Demand 🔥",
    icon: "🫘"
  },
  {
    id: "proc-urea-02",
    category: "Fertilizers",
    name: "Neem Coated Urea (46% Nitrogen)",
    name_hi: "नीम कोटेड यूरिया (46% नाइट्रोजन)",
    spec: "45 kg Official Subsidized Bag",
    subsidized_price: 266.50,
    market_price: 450,
    total_quota: 2500,
    available_quota: 1820,
    unit: "bags",
    max_per_farmer: 20,
    distribution_center: "Meerut Sadar PAC / IFFCO Kendra",
    district: "Meerut, Uttar Pradesh",
    active_season: "Rabi Season 2025-26",
    badge: "Government Fixed",
    icon: "🌱"
  },
  {
    id: "proc-potash-03",
    category: "Fertilizers",
    name: "MOP (Muriate of Potash 60% K2O)",
    name_hi: "एमओपी पोटाश (60% K2O)",
    spec: "50 kg Standard Bag",
    subsidized_price: 1700,
    market_price: 2250,
    total_quota: 500,
    available_quota: 310,
    unit: "bags",
    max_per_farmer: 10,
    distribution_center: "Hapur Mandi Agriculture Hub",
    district: "Hapur, Uttar Pradesh",
    active_season: "Rabi Season 2025-26",
    badge: "Subsidized",
    icon: "🧪"
  },
  {
    id: "proc-nano-04",
    category: "Fertilizers",
    name: "IFFCO Nano Urea (Liquid Formulation)",
    name_hi: "इफको नैनो यूरिया (तरल बोतल)",
    spec: "500 ml Bottle (Equivalent to 1 Bag)",
    subsidized_price: 225,
    market_price: 260,
    total_quota: 1200,
    available_quota: 950,
    unit: "bottles",
    max_per_farmer: 30,
    distribution_center: "Meerut Sadar PAC / IFFCO Kendra",
    district: "Meerut, Uttar Pradesh",
    active_season: "All Seasons",
    badge: "Eco-Friendly 🌿",
    icon: "🧴"
  },
  {
    id: "proc-wheat-seed-05",
    category: "Seeds",
    name: "Certified Wheat Seed (HD-3226 Pusa)",
    name_hi: "प्रमाणित गेहूं बीज (एचडी-3226 पूसा)",
    spec: "40 kg Graded & Treated Bag",
    subsidized_price: 1150,
    market_price: 1650,
    total_quota: 800,
    available_quota: 430,
    unit: "bags",
    max_per_farmer: 10,
    distribution_center: "Meerut Mandi Seed Corporation",
    district: "Meerut, Uttar Pradesh",
    active_season: "Rabi 2025-26",
    badge: "High Yield 🌾",
    icon: "🌾"
  },
  {
    id: "proc-machinery-drone-06",
    category: "Machinery",
    name: "Drone Agricultural Spraying Service (Kisan Drone)",
    name_hi: "ड्रोन कीटनाशक एवं नैनो यूरिया छिड़काव सेवा",
    spec: "Per Acre Advanced Multi-Rotor Drone Spray",
    subsidized_price: 250,
    market_price: 500,
    total_quota: 150,
    available_quota: 85,
    unit: "acres",
    max_per_farmer: 25,
    distribution_center: "District Agriculture Custom Hiring Center",
    district: "Meerut, Uttar Pradesh",
    active_season: "Active Sowing Window",
    badge: "80% Water Saving 🚁",
    icon: "🚁"
  },
  {
    id: "proc-machinery-harvester-07",
    category: "Machinery",
    name: "Multi-Crop Combine Harvester with SMS",
    name_hi: "मल्टी-क्रॉप कंबाइन हार्वेस्टर (एसएमएस सहित)",
    spec: "Per Hour Subsidized Rental with Operator",
    subsidized_price: 1400,
    market_price: 2200,
    total_quota: 40,
    available_quota: 18,
    unit: "hours",
    max_per_farmer: 10,
    distribution_center: "Cooperative Block Machine Bank",
    district: "Meerut, Uttar Pradesh",
    active_season: "Harvest Season",
    badge: "Govt Subsidized 🚜",
    icon: "🚜"
  },
  {
    id: "proc-machinery-leveler-08",
    category: "Machinery",
    name: "Laser Land Leveler with High Power Tractor",
    name_hi: "लेजर लैंड लेवलर एवं उच्च शक्ति ट्रैक्टर",
    spec: "Per Hour Precision Leveling Service",
    subsidized_price: 700,
    market_price: 1100,
    total_quota: 50,
    available_quota: 24,
    unit: "hours",
    max_per_farmer: 12,
    distribution_center: "Cooperative Block Machine Bank",
    district: "Meerut, Uttar Pradesh",
    active_season: "Pre-Sowing Land Prep",
    badge: "30% Water Saving 📐",
    icon: "📐"
  }
];

// ==========================================
// 5. INITIAL ACTIVE PROCUREMENT BOOKINGS & TOKENS
// ==========================================
export const INITIAL_PROCUREMENT_BOOKINGS = [
  {
    id: "BK-DAP-108",
    token_number: 108,
    farmer_id: "6c15a7eb-9948-4e4c-a27b-083e29d77ec3",
    farmer_name: "vaishnavi",
    farmer_phone: "+91 8209379826",
    item_id: "proc-dap-01",
    item_name: "DAP Fertilizer (50 kg Bag)",
    quantity: 10,
    unit: "bags",
    unit_price: 1350,
    total_amount: 13500,
    subsidy_savings: 6000,
    landholding_category: "small",
    land_area: "1.5 Hectares (Small Farmer)",
    sowing_date: "2026-09-18",
    priority_score: 85,
    status: "Confirmed",
    queue_position: 4,
    currently_serving_token: 104,
    estimated_wait_minutes: 15,
    pickup_date: "Tomorrow, 10:30 AM - 11:00 AM",
    pickup_counter: "Counter #2 (East Gate)",
    distribution_center: "Meerut Sadar PAC / IFFCO Kendra",
    qr_code_id: "FD-PRC-DAP-108-VSH",
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "BK-DRN-204",
    token_number: 204,
    farmer_id: "6c15a7eb-9948-4e4c-a27b-083e29d77ec3",
    farmer_name: "vaishnavi",
    farmer_phone: "+91 8209379826",
    item_id: "proc-machinery-drone-06",
    item_name: "Drone Agricultural Spraying Service",
    quantity: 5,
    unit: "acres",
    unit_price: 250,
    total_amount: 1250,
    subsidy_savings: 1250,
    landholding_category: "small",
    land_area: "1.5 Hectares (Small Farmer)",
    sowing_date: "2026-09-20",
    priority_score: 78,
    status: "Confirmed",
    queue_position: 2,
    currently_serving_token: 202,
    estimated_wait_minutes: 8,
    pickup_date: "Thursday, 09:00 AM - 10:00 AM",
    pickup_counter: "Drone Fleet Hub #1",
    distribution_center: "District Agriculture Custom Hiring Center",
    qr_code_id: "FD-PRC-DRN-204-VSH",
    created_at: new Date(Date.now() - 7200000).toISOString()
  }
];
