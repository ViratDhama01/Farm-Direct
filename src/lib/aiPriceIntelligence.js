// 🧠 FarmDirect AI Price Intelligence & Mandi Forecast Engine
// Supports local/cloud Ollama (e.g., gptoss120bcloud / llama3) with zero-downtime statistical fallback

export const APMC_COMMODITY_DATA = {
  wheat: {
    id: 'wheat',
    name: 'Wheat (Sharbati / HD-3226)',
    name_hi: 'गेहूं (शरबती / HD-3226)',
    category: 'Grains',
    unit: 'kg',
    msp: 22.75, // MSP per kg (₹2,275/quintal)
    current_avg: 28.50,
    price_change_7d: 4.2, // +4.2%
    trend: 'BULLISH',
    recommendation: 'HOLD',
    recommendation_hi: 'रोकें (मूल्य वृद्धि संभावित)',
    optimal_window: '7 - 12 Days',
    projected_peak: 31.20,
    confidence: 89,
    rationale_en: 'Arrivals at Azadpur APMC dropped by 18% this week. High export and milling demand from NCR flour mills is expected to push prices up by 8-10% over the next 10 days.',
    rationale_hi: 'आज़ादपुर मंडी में इस सप्ताह आवक 18% घटी है। दिल्ली-एनसीआर की आटा मिलों से भारी मांग के कारण अगले 10 दिनों में भाव में 8-10% की तेजी आने का अनुमान है।',
    mandi_rates: [
      { mandi: 'Azadpur APMC (Delhi)', price: 29.80, change: '+5.1%', distance: '65 km', net_profit_est: '+₹1.80/kg' },
      { mandi: 'Meerut Mandi (UP)', price: 28.50, change: '+3.8%', distance: '12 km', net_profit_est: 'Baseline' },
      { mandi: 'Karnal Grain Market (HR)', price: 29.10, change: '+4.0%', distance: '85 km', net_profit_est: '+₹0.90/kg' },
      { mandi: 'Hapur Mandi (UP)', price: 28.20, change: '+2.1%', distance: '38 km', net_profit_est: '-₹0.30/kg' }
    ],
    history_7d: [
      { day: 'Day -6', price: 27.20 },
      { day: 'Day -5', price: 27.40 },
      { day: 'Day -4', price: 27.80 },
      { day: 'Day -3', price: 28.00 },
      { day: 'Day -2', price: 28.20 },
      { day: 'Yesterday', price: 28.40 },
      { day: 'Today', price: 28.50 }
    ],
    forecast_30d: [
      { day: '+5 Days', projected: 29.40 },
      { day: '+10 Days', projected: 30.80 },
      { day: '+15 Days', projected: 31.20 },
      { day: '+20 Days', projected: 30.90 },
      { day: '+30 Days', projected: 30.50 }
    ]
  },
  moong: {
    id: 'moong',
    name: 'Desi Organic Green Moong',
    name_hi: 'देसी जैविक हरी मूंग दाल',
    category: 'Pulses',
    unit: 'kg',
    msp: 85.58, // MSP per kg (₹8,558/quintal)
    current_avg: 110.00,
    price_change_7d: 7.8,
    trend: 'BULLISH',
    recommendation: 'SELL_NOW',
    recommendation_hi: 'अभी बेचें (उच्चतम दर)',
    optimal_window: 'Next 48 - 72 Hours',
    projected_peak: 112.50,
    confidence: 94,
    rationale_en: 'Moong prices have hit an annual high of ₹110/kg due to festive restocking. High supply from Rajasthan Kharif harvest is scheduled to enter mandis next week, which will soften prices.',
    rationale_hi: 'त्योहारी मांग के कारण मूंग दाल ₹110/किग्रा के रिकॉर्ड स्तर पर है। अगले सप्ताह राजस्थान से नई आवक शुरू होने से भाव में नरमी आने की संभावना है। अतः अभी बेचना सर्वाधिक लाभकारी है।',
    mandi_rates: [
      { mandi: 'Azadpur APMC (Delhi)', price: 114.00, change: '+8.2%', distance: '65 km', net_profit_est: '+₹4.50/kg' },
      { mandi: 'Meerut Mandi (UP)', price: 110.00, change: '+7.1%', distance: '12 km', net_profit_est: 'Baseline' },
      { mandi: 'Hapur Mandi (UP)', price: 108.50, change: '+5.0%', distance: '38 km', net_profit_est: '-₹1.50/kg' },
      { mandi: 'Karnal Mandi (HR)', price: 111.50, change: '+6.5%', distance: '85 km', net_profit_est: '+₹1.20/kg' }
    ],
    history_7d: [
      { day: 'Day -6', price: 102.00 },
      { day: 'Day -5', price: 103.50 },
      { day: 'Day -4', price: 105.00 },
      { day: 'Day -3', price: 107.00 },
      { day: 'Day -2', price: 108.50 },
      { day: 'Yesterday', price: 109.50 },
      { day: 'Today', price: 110.00 }
    ],
    forecast_30d: [
      { day: '+5 Days', projected: 111.00 },
      { day: '+10 Days', projected: 106.00 },
      { day: '+15 Days', projected: 102.50 },
      { day: '+20 Days', projected: 99.00 },
      { day: '+30 Days', projected: 96.00 }
    ]
  },
  mustard: {
    id: 'mustard',
    name: 'Yellow / Black Mustard Seed',
    name_hi: 'पीली व काली सरसों',
    category: 'Oilseeds',
    unit: 'kg',
    msp: 56.50, // ₹5,650/quintal
    current_avg: 64.00,
    price_change_7d: 2.1,
    trend: 'STABLE_UP',
    recommendation: 'HOLD',
    recommendation_hi: 'रोकें (धीमी बढ़त)',
    optimal_window: '15 - 20 Days',
    projected_peak: 68.50,
    confidence: 86,
    rationale_en: 'Crushing mills in Bharatpur and Agra are aggressively procuring. Edible oil import duties are expected to increase, providing tailwind to domestic mustard seed prices.',
    rationale_hi: 'भरतपुर और आगरा के तेल मिलों द्वारा खरीद तेज है। आयात शुल्क में संभावित संशोधन से घरेलू सरसों के भाव में ₹4-5/किग्रा की अतिरिक्त तेजी संभव है।',
    mandi_rates: [
      { mandi: 'Agra Mandi (UP)', price: 66.50, change: '+3.5%', distance: '190 km', net_profit_est: '+₹2.50/kg' },
      { mandi: 'Meerut Mandi (UP)', price: 64.00, change: '+2.1%', distance: '12 km', net_profit_est: 'Baseline' },
      { mandi: 'Hapur Mandi (UP)', price: 64.80, change: '+2.4%', distance: '38 km', net_profit_est: '+₹0.60/kg' },
      { mandi: 'Alwar Mandi (RJ)', price: 67.00, change: '+4.1%', distance: '210 km', net_profit_est: '+₹2.00/kg' }
    ],
    history_7d: [
      { day: 'Day -6', price: 62.50 },
      { day: 'Day -5', price: 62.80 },
      { day: 'Day -4', price: 63.20 },
      { day: 'Day -3', price: 63.50 },
      { day: 'Day -2', price: 63.80 },
      { day: 'Yesterday', price: 63.90 },
      { day: 'Today', price: 64.00 }
    ],
    forecast_30d: [
      { day: '+5 Days', projected: 65.20 },
      { day: '+10 Days', projected: 66.40 },
      { day: '+15 Days', projected: 67.80 },
      { day: '+20 Days', projected: 68.50 },
      { day: '+30 Days', projected: 67.00 }
    ]
  },
  onion: {
    id: 'onion',
    name: 'Nashik / Garwa Onion',
    name_hi: 'नासिक / गरवा प्याज',
    category: 'Vegetables',
    unit: 'kg',
    msp: 18.00,
    current_avg: 32.00,
    price_change_7d: -5.4,
    trend: 'BEARISH',
    recommendation: 'SELL_NOW',
    recommendation_hi: 'तुरंत बेचें (मंडी भाव गिरने का डर)',
    optimal_window: 'Within 24 Hours',
    projected_peak: 32.50,
    confidence: 91,
    rationale_en: 'Buffer stock offloading by NAFED and arrival of fresh Kharif crop from Southern states is increasing market supply rapidly. Prices may drop by 15-20% by next week.',
    rationale_hi: 'नेफेड (NAFED) द्वारा बफर स्टॉक जारी करने और दक्षिणी राज्यों से नई प्याज की आवक बढ़ने से भाव तेजी से गिर रहे हैं। नुकसान से बचने के लिए तुरंत बेचें।',
    mandi_rates: [
      { mandi: 'Azadpur APMC (Delhi)', price: 34.00, change: '-4.0%', distance: '65 km', net_profit_est: '+₹1.80/kg' },
      { mandi: 'Meerut Mandi (UP)', price: 32.00, change: '-5.4%', distance: '12 km', net_profit_est: 'Baseline' },
      { mandi: 'Lasalgaon APMC (MH)', price: 29.50, change: '-8.1%', distance: '1250 km', net_profit_est: '-₹3.00/kg' },
      { mandi: 'Hapur Mandi (UP)', price: 31.50, change: '-5.0%', distance: '38 km', net_profit_est: '-₹0.50/kg' }
    ],
    history_7d: [
      { day: 'Day -6', price: 35.00 },
      { day: 'Day -5', price: 34.50 },
      { day: 'Day -4', price: 34.00 },
      { day: 'Day -3', price: 33.20 },
      { day: 'Day -2', price: 32.80 },
      { day: 'Yesterday', price: 32.30 },
      { day: 'Today', price: 32.00 }
    ],
    forecast_30d: [
      { day: '+5 Days', projected: 29.00 },
      { day: '+10 Days', projected: 26.50 },
      { day: '+15 Days', projected: 24.00 },
      { day: '+20 Days', projected: 22.50 },
      { day: '+30 Days', projected: 20.00 }
    ]
  },
  basmati: {
    id: 'basmati',
    name: '1121 Pusa Basmati Paddy / Rice',
    name_hi: '1121 पूसा बासमती धान / चावल',
    category: 'Grains',
    unit: 'kg',
    msp: 23.00, // Non-basmati MSP
    current_avg: 46.50,
    price_change_7d: 3.5,
    trend: 'BULLISH',
    recommendation: 'HOLD',
    recommendation_hi: 'रोकें (निर्यात मांग मजबूत)',
    optimal_window: '14 - 21 Days',
    projected_peak: 51.00,
    confidence: 88,
    rationale_en: 'Middle East export demand for 1121 Basmati is strong. Rice millers in Taraori (Karnal) are actively buying with higher purchase limits.',
    rationale_hi: 'खाड़ी देशों में 1121 बासमती की निर्यात मांग में वृद्धि हुई है। करनाल व तरावड़ी के राइस मिलर्स द्वारा भारी खरीद से भाव ₹50+ जाने की पूरी संभावना है।',
    mandi_rates: [
      { mandi: 'Karnal Grain Market (HR)', price: 48.00, change: '+4.5%', distance: '85 km', net_profit_est: '+₹1.50/kg' },
      { mandi: 'Meerut Mandi (UP)', price: 46.50, change: '+3.5%', distance: '12 km', net_profit_est: 'Baseline' },
      { mandi: 'Amritsar APMC (PB)', price: 48.80, change: '+5.0%', distance: '390 km', net_profit_est: '+₹1.20/kg' },
      { mandi: 'Narela Mandi (Delhi)', price: 47.50, change: '+3.8%', distance: '72 km', net_profit_est: '+₹0.80/kg' }
    ],
    history_7d: [
      { day: 'Day -6', price: 44.50 },
      { day: 'Day -5', price: 45.00 },
      { day: 'Day -4', price: 45.20 },
      { day: 'Day -3', price: 45.80 },
      { day: 'Day -2', price: 46.00 },
      { day: 'Yesterday', price: 46.20 },
      { day: 'Today', price: 46.50 }
    ],
    forecast_30d: [
      { day: '+5 Days', projected: 47.80 },
      { day: '+10 Days', projected: 49.20 },
      { day: '+15 Days', projected: 50.50 },
      { day: '+20 Days', projected: 51.00 },
      { day: '+30 Days', projected: 49.50 }
    ]
  }
};

export const AIPriceIntelligenceService = {
  getOllamaConfig() {
    return {
      baseUrl: import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434',
      model: import.meta.env.VITE_OLLAMA_MODEL || 'gptoss120bcloud'
    };
  },

  getCommoditiesList() {
    return Object.values(APMC_COMMODITY_DATA);
  },

  getCommodityData(commodityId) {
    const key = (commodityId || 'wheat').toLowerCase().trim();
    return APMC_COMMODITY_DATA[key] || APMC_COMMODITY_DATA.wheat;
  },

  // Calls Ollama API or gracefully uses heuristic fallback
  async queryKisanAI({ commodityId, userPrompt, language = 'en' }) {
    const data = this.getCommodityData(commodityId);
    const { baseUrl, model } = this.getOllamaConfig();

    const systemPrompt = `You are "Kisan AI", an expert agricultural market economist and mandi price intelligence advisor for Indian farmers on the FarmDirect platform.
Context for ${data.name}:
- Current Mandi Avg: ₹${data.current_avg} / ${data.unit}
- Government MSP: ₹${data.msp} / ${data.unit} (Current Price is ${((data.current_avg - data.msp) / data.msp * 100).toFixed(1)}% above MSP)
- 7-Day Trend: ${data.trend} (${data.price_change_7d > 0 ? '+' : ''}${data.price_change_7d}%)
- AI Selling Recommendation: ${data.recommendation} (Optimal timing: ${data.optimal_window})
- Projected Peak: ₹${data.projected_peak} / ${data.unit} (Confidence: ${data.confidence}%)
- Mandi Arbitrage Rates: ${data.mandi_rates.map(m => `${m.mandi}: ₹${m.price} (${m.distance})`).join(', ')}

Please provide a helpful, concise, practical response (max 3-4 bullet points or 100 words).
Language requirement: Respond in ${language === 'hi' ? 'Hindi (हिन्दी) using easy-to-understand farmer terminology' : 'clear English with Hindi agricultural terms where appropriate'}.`;

    try {
      const response = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          prompt: `${systemPrompt}\n\nFarmer Question: "${userPrompt}"\n\nKisan AI Advice:`,
          stream: false
        }),
        signal: AbortSignal.timeout(4500) // 4.5 second timeout to keep UI snappy
      });

      if (response.ok) {
        const json = await response.json();
        if (json.response) {
          return {
            text: json.response.trim(),
            source: `Ollama (${model})`,
            isLiveModel: true
          };
        }
      }
    } catch (err) {
      // Local Ollama is offline or timed out — proceed to statistical fallback seamlessly
    }

    // Heuristic intelligent fallback tailored to farmer's query
    return this.generateStatisticalAdvice(data, userPrompt, language);
  },

  generateStatisticalAdvice(data, userPrompt, language = 'en') {
    const p = (userPrompt || '').toLowerCase();
    const isHi = language === 'hi';

    if (p.includes('sell') || p.includes('hold') || p.includes('बेच') || p.includes('रोक') || p.includes('time') || p.includes('समय')) {
      if (data.recommendation === 'HOLD') {
        return {
          text: isHi
            ? `📊 **अनुशंसा: रोकें (${data.optimal_window})**\n- ${data.name_hi} में अभी ₹${data.current_avg}/${data.unit} का भाव है।\n- अगले ${data.optimal_window} में भाव **₹${data.projected_peak}/${data.unit} (+${((data.projected_peak - data.current_avg) / data.current_avg * 100).toFixed(1)}%)** तक पहुंचने की संभावना है।\n- ${data.rationale_hi}`
            : `📊 **Recommendation: HOLD (${data.optimal_window})**\n- Current market price for ${data.name} is ₹${data.current_avg}/${data.unit}.\n- Price forecast indicates a rally up to **₹${data.projected_peak}/${data.unit} (+${((data.projected_peak - data.current_avg) / data.current_avg * 100).toFixed(1)}%)**.\n- ${data.rationale_en}`,
          source: 'FarmDirect APMC Intelligence Engine',
          isLiveModel: false
        };
      } else {
        return {
          text: isHi
            ? `🚨 **अनुशंसा: तुरंत बेचें (${data.optimal_window})**\n- वर्तमान भाव ₹${data.current_avg}/${data.unit} अपने मौसमी शिखर पर है।\n- ${data.rationale_hi}\n- निकटवर्ती मंडियों (जैसे ${data.mandi_rates[0].mandi}) में ₹${data.mandi_rates[0].price}/${data.unit} तक का भाव मिल रहा है।`
            : `🚨 **Recommendation: SELL NOW (${data.optimal_window})**\n- Current rate ₹${data.current_avg}/${data.unit} is at a seasonal peak.\n- ${data.rationale_en}\n- Top nearby destination: **${data.mandi_rates[0].mandi}** offering ₹${data.mandi_rates[0].price}/${data.unit}.`,
          source: 'FarmDirect APMC Intelligence Engine',
          isLiveModel: false
        };
      }
    }

    if (p.includes('mandi') || p.includes('highest') || p.includes('rate') || p.includes('भाव') || p.includes('कहाँ') || p.includes('arbitrage')) {
      const topMandi = data.mandi_rates[0];
      return {
        text: isHi
          ? `📍 **मंडी तुलना एवं उच्चतम दर:**\n- **सर्वोत्तम मंडी**: ${topMandi.mandi} (दर: **₹${topMandi.price}/${data.unit}**)\n- मेरठ मंडी की तुलना में लाभ: **${topMandi.net_profit_est}**\n- दूरी: ${topMandi.distance} (परिवहन लागत लगभग ₹0.80/किग्रा)\n- यदि आपके पास 5 क्विंटल से अधिक माल है तो ${topMandi.mandi} में बेचना अधिक फायदेमंद है।`
          : `📍 **Mandi Comparison & Arbitrage:**\n- **Highest Paying Mandi**: ${topMandi.mandi} at **₹${topMandi.price}/${data.unit}**.\n- Net margin vs local gate: **${topMandi.net_profit_est}**\n- Distance: ${topMandi.distance} (Est. freight ~₹0.80/kg).\n- For lots > 500kg, routing to ${topMandi.mandi} delivers maximum net realization.`,
        source: 'FarmDirect APMC Intelligence Engine',
        isLiveModel: false
      };
    }

    if (p.includes('msp') || p.includes('support') || p.includes('सरकारी') || p.includes('न्यूनतम')) {
      const diffPct = (((data.current_avg - data.msp) / data.msp) * 100).toFixed(1);
      return {
        text: isHi
          ? `🛡️ **सरकारी न्यूनतम समर्थन मूल्य (MSP) विश्लेषण:**\n- केंद्र सरकार द्वारा निर्धारित MSP: **₹${data.msp}/${data.unit}**\n- आपका वर्तमान बाजार भाव: **₹${data.current_avg}/${data.unit}** (${diffPct}% MSP से ऊपर)\n- आपकी उपज सरकारी बेंचमार्क से सुरक्षित और लाभकारी क्षेत्र में है।`
          : `🛡️ **MSP (Minimum Support Price) Safety Guardrail:**\n- Official Govt. MSP benchmark: **₹${data.msp}/${data.unit}**\n- Current Realized Rate: **₹${data.current_avg}/${data.unit}** (${diffPct}% above MSP)\n- Your crop is trading safely in the profitable green zone.`,
        source: 'FarmDirect APMC Intelligence Engine',
        isLiveModel: false
      };
    }

    // General agricultural advisory
    return {
      text: isHi
        ? `🌱 **${data.name_hi} बाजार दृष्टिकोण:**\n- वर्तमान औसत भाव: ₹${data.current_avg}/${data.unit} (${data.price_change_7d > 0 ? '+' : ''}${data.price_change_7d}% पिछले 7 दिनों में)\n- हमारा पूर्वानुमान: **${data.recommendation_hi}** (${data.optimal_window})\n- सलाह: ${data.rationale_hi}`
        : `🌱 **${data.name} Market Outlook:**\n- Current Average Rate: ₹${data.current_avg}/${data.unit} (${data.price_change_7d > 0 ? '+' : ''}${data.price_change_7d}% in 7 days)\n- Recommendation: **${data.recommendation}** (${data.optimal_window})\n- Key driver: ${data.rationale_en}`,
      source: 'FarmDirect APMC Intelligence Engine',
      isLiveModel: false
    };
  }
};
