// 🧠 FarmDirect AI Price Intelligence & Decision Support Component
import { Icons } from '../lib/icons.js';
import { LanguageManager } from '../lib/translations.js';
import { AIPriceIntelligenceService, APMC_COMMODITY_DATA } from '../lib/aiPriceIntelligence.js';

export function renderPriceIntelligenceView(container, { farmerUser }) {
  const { t } = LanguageManager;
  const currentLang = LanguageManager.getCurrentLanguage();

  let selectedCommodityId = 'wheat';
  let isAskingAI = false;
  let chatMessages = [
    {
      sender: 'ai',
      text: currentLang === 'hi' 
        ? 'नमस्ते! मैं किसान AI हूँ। अपनी फसल का नाम चुनें या नीचे दिए गए त्वरित प्रश्नों पर क्लिक करें।'
        : 'Namaste! I am Kisan AI. Select a commodity or ask any question regarding mandi price trends, arbitrage, and optimal selling timing.',
      source: 'Kisan AI Engine',
      time: 'Just now'
    }
  ];
  let inputDraftText = '';

  function updateChatThread() {
    const thread = container.querySelector('#kisan-ai-chat-thread');
    if (!thread) return;
    const commodity = AIPriceIntelligenceService.getCommodityData(selectedCommodityId);
    thread.innerHTML = `
      ${chatMessages.map(msg => `
        <div style="align-self:${msg.sender === 'user' ? 'flex-end' : 'flex-start'}; max-width:85%; background:${msg.sender === 'user' ? '#15803d' : '#ffffff'}; color:${msg.sender === 'user' ? '#ffffff' : '#0f172a'}; border:${msg.sender === 'user' ? 'none' : '1px solid #e2e8f0'}; border-radius:12px; padding:0.75rem 1rem; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="font-size:0.85rem; line-height:1.5; white-space:pre-line;">
            ${msg.text}
          </div>
          <div style="font-size:0.68rem; margin-top:4px; opacity:0.75; text-align:right;">
            ${msg.source ? `${msg.source} • ` : ''}${msg.time}
          </div>
        </div>
      `).join('')}

      ${isAskingAI ? `
        <div style="align-self:flex-start; background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:0.6rem 1rem; font-size:0.8rem; color:#64748b; display:flex; align-items:center; gap:8px;">
          <span style="display:inline-block; animation:spin 1s linear infinite;">⏳</span>
          <span>Kisan AI is analyzing ${commodity.name} APMC trends...</span>
        </div>
      ` : ''}
    `;
    thread.scrollTop = thread.scrollHeight;
  }

  function render() {
    const existingInput = container.querySelector('#kisan-ai-input');
    if (existingInput) {
      inputDraftText = existingInput.value;
    }

    const commodity = AIPriceIntelligenceService.getCommodityData(selectedCommodityId);
    const commodities = AIPriceIntelligenceService.getCommoditiesList();
    const ollamaConfig = AIPriceIntelligenceService.getOllamaConfig();

    const isHold = commodity.recommendation === 'HOLD';
    const isSellNow = commodity.recommendation === 'SELL_NOW';
    const mspDiffPct = (((commodity.current_avg - commodity.msp) / commodity.msp) * 100).toFixed(1);

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.5rem;">
        
        <!-- 1. Header & Live Commodity Selector -->
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:1.25rem 1.5rem; box-shadow:var(--shadow-sm);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:1rem;">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:1.4rem;">📊</span>
                <h3 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin:0;">
                  ${t('priceIntelHubTitle') || 'APMC Mandi Price Intelligence & AI Forecast'}
                </h3>
              </div>
              <p style="font-size:0.8rem; color:#64748b; margin-top:2px;">
                ${t('priceIntelHubSubtitle') || 'Real-time eNAM APMC feeds, 30-day AI predictive trends & MSP protection'}
              </p>
            </div>

            <!-- Model Badge -->
            <div style="display:flex; align-items:center; gap:6px; background:#f0fdf4; border:1px solid #bbf7d0; padding:4px 12px; border-radius:9999px; font-size:0.75rem; font-weight:700; color:#15803d;">
              <span style="width:7px; height:7px; border-radius:50%; background:#16a34a; display:inline-block; box-shadow:0 0 6px #16a34a;"></span>
              <span>Model: ${ollamaConfig.model} (Ollama Hybrid)</span>
            </div>
          </div>

          <!-- Commodity Pills -->
          <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:4px;">
            ${commodities.map(c => `
              <button class="commodity-select-pill ${selectedCommodityId === c.id ? 'active' : ''}" data-commodity-id="${c.id}" style="padding:7px 14px; border-radius:10px; font-size:0.82rem; font-weight:700; border:1px solid ${selectedCommodityId === c.id ? '#15803d' : '#e2e8f0'}; background:${selectedCommodityId === c.id ? '#15803d' : '#f8fafc'}; color:${selectedCommodityId === c.id ? '#ffffff' : '#334155'}; cursor:pointer; white-space:nowrap; display:flex; align-items:center; gap:6px;">
                <span>${c.id === 'wheat' ? '🌾' : c.id === 'moong' ? '🌱' : c.id === 'mustard' ? '🌼' : c.id === 'onion' ? '🧅' : '🍚'}</span>
                <span>${currentLang === 'hi' ? c.name_hi : c.name.split('(')[0]}</span>
                <span style="font-size:0.75rem; opacity:0.9; padding-left:4px;">₹${c.current_avg}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 2. AI Decision Support & Forecast Banner -->
        <div style="background:linear-gradient(135deg, ${isHold ? '#064e3b' : isSellNow ? '#7c2d12' : '#1e3a8a'}, ${isHold ? '#15803d' : isSellNow ? '#dc2626' : '#2563eb'}); color:#ffffff; border-radius:16px; padding:1.5rem; box-shadow:var(--shadow-md); position:relative; overflow:hidden;">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem; align-items:center;">
            <div>
              <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.2); backdrop-filter:blur(6px); padding:4px 12px; border-radius:9999px; font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.75rem;">
                <span>${isHold ? '⏳' : '🚀'}</span>
                <span>${isHold ? (currentLang === 'hi' ? 'AI अनुशंसा: स्टॉक रोकें (HOLD)' : 'AI Recommendation: HOLD') : (currentLang === 'hi' ? 'AI अनुशंसा: तुरंत बेचें (SELL NOW)' : 'AI Recommendation: SELL NOW')}</span>
              </div>

              <h2 style="font-size:1.6rem; font-weight:900; line-height:1.2; margin-bottom:0.5rem; color:#ffffff;">
                ${currentLang === 'hi' ? commodity.name_hi : commodity.name}
              </h2>

              <p style="font-size:0.88rem; line-height:1.5; color:#dcfce7; margin-bottom:1rem;">
                ${currentLang === 'hi' ? commodity.rationale_hi : commodity.rationale_en}
              </p>

              <div style="display:flex; gap:1rem; flex-wrap:wrap; font-size:0.8rem;">
                <div style="background:rgba(0,0,0,0.2); padding:6px 12px; border-radius:8px;">
                  <span style="color:#bbf7d0; font-size:0.72rem; display:block;">${currentLang === 'hi' ? 'सर्वोत्तम समय' : 'Optimal Selling Window'}</span>
                  <strong style="color:#ffffff;">${commodity.optimal_window}</strong>
                </div>
                <div style="background:rgba(0,0,0,0.2); padding:6px 12px; border-radius:8px;">
                  <span style="color:#bbf7d0; font-size:0.72rem; display:block;">${currentLang === 'hi' ? 'अनुमानित शिखर भाव' : 'Projected Peak'}</span>
                  <strong style="color:#fef08a;">₹${commodity.projected_peak} / ${commodity.unit}</strong>
                </div>
                <div style="background:rgba(0,0,0,0.2); padding:6px 12px; border-radius:8px;">
                  <span style="color:#bbf7d0; font-size:0.72rem; display:block;">${currentLang === 'hi' ? 'AI सटीकता / विश्वास' : 'AI Confidence'}</span>
                  <strong style="color:#86efac;">${commodity.confidence}%</strong>
                </div>
              </div>
            </div>

            <!-- Price Snapshot Cards -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
              <div style="background:rgba(255,255,255,0.12); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.2); border-radius:12px; padding:1rem; text-align:center;">
                <span style="font-size:0.72rem; color:#bbf7d0; font-weight:700; text-transform:uppercase;">Current Mandi Avg</span>
                <div style="font-size:1.8rem; font-weight:900; color:#ffffff; margin:2px 0;">
                  ₹${commodity.current_avg}
                </div>
                <span style="font-size:0.75rem; font-weight:700; color:${commodity.price_change_7d >= 0 ? '#86efac' : '#fca5a5'};">
                  ${commodity.price_change_7d >= 0 ? '↑ +' : '↓ '}${commodity.price_change_7d}% (7d)
                </span>
              </div>

              <div style="background:rgba(255,255,255,0.12); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.2); border-radius:12px; padding:1rem; text-align:center;">
                <span style="font-size:0.72rem; color:#bbf7d0; font-weight:700; text-transform:uppercase;">Govt. MSP Benchmark</span>
                <div style="font-size:1.8rem; font-weight:900; color:#fef08a; margin:2px 0;">
                  ₹${commodity.msp}
                </div>
                <span style="font-size:0.75rem; font-weight:700; color:#86efac;">
                  +${mspDiffPct}% above MSP
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Historical Trends & 30-Day Predictive Trajectory Grid -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.25rem;">
          <!-- 7-Day APMC Historic Trend -->
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:1.25rem; box-shadow:var(--shadow-sm);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <h4 style="font-size:0.95rem; font-weight:800; color:#0f172a; margin:0; display:flex; align-items:center; gap:6px;">
                <span>📈</span>
                <span>${currentLang === 'hi' ? '7-दिवसीय मंडी भाव इतिहास' : '7-Day Mandi Price History'}</span>
              </h4>
              <span style="font-size:0.72rem; color:#64748b; font-weight:600;">₹ / ${commodity.unit}</span>
            </div>

            <!-- Bar representation -->
            <div style="display:flex; justify-content:space-between; align-items:flex-end; height:120px; padding:10px 0; border-bottom:1px solid #e2e8f0;">
              ${commodity.history_7d.map(h => {
                const heightPct = Math.max(30, Math.min(100, ((h.price / (commodity.current_avg * 1.15)) * 100)));
                return `
                  <div style="display:flex; flex-direction:column; align-items:center; gap:4px; flex:1;">
                    <span style="font-size:0.68rem; font-weight:700; color:#15803d;">₹${h.price}</span>
                    <div style="width:24px; height:${heightPct}px; background:#16a34a; border-radius:4px 4px 0 0; transition:height 0.3s ease;"></div>
                    <span style="font-size:0.65rem; color:#64748b; white-space:nowrap;">${h.day}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 30-Day AI Forecast Trajectory -->
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:1.25rem; box-shadow:var(--shadow-sm);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <h4 style="font-size:0.95rem; font-weight:800; color:#0f172a; margin:0; display:flex; align-items:center; gap:6px;">
                <span>🔮</span>
                <span>${currentLang === 'hi' ? '30-दिवसीय AI मूल्य पूर्वानुमान' : '30-Day AI Price Forecast'}</span>
              </h4>
              <span style="font-size:0.72rem; font-weight:700; color:#7c3aed; background:#f5f3ff; padding:2px 8px; border-radius:9999px;">
                ${commodity.confidence}% Confidence
              </span>
            </div>

            <!-- Forecast Bar representation -->
            <div style="display:flex; justify-content:space-between; align-items:flex-end; height:120px; padding:10px 0; border-bottom:1px solid #e2e8f0;">
              ${commodity.forecast_30d.map(f => {
                const heightPct = Math.max(30, Math.min(100, ((f.projected / (commodity.projected_peak * 1.1)) * 100)));
                const isPeak = f.projected === commodity.projected_peak;
                return `
                  <div style="display:flex; flex-direction:column; align-items:center; gap:4px; flex:1;">
                    <span style="font-size:0.68rem; font-weight:700; color:${isPeak ? '#d97706' : '#7c3aed'};">${isPeak ? '★ ' : ''}₹${f.projected}</span>
                    <div style="width:24px; height:${heightPct}px; background:${isPeak ? '#f59e0b' : '#8b5cf6'}; border-radius:4px 4px 0 0; transition:height 0.3s ease;"></div>
                    <span style="font-size:0.65rem; color:#64748b; white-space:nowrap;">${f.day}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- 4. Mandi Arbitrage Matrix & Regional Comparison -->
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:1.25rem; box-shadow:var(--shadow-sm);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:8px;">
            <div>
              <h4 style="font-size:1.05rem; font-weight:800; color:#0f172a; margin:0; display:flex; align-items:center; gap:6px;">
                <span>📍</span>
                <span>${currentLang === 'hi' ? 'क्षेत्रीय APMC मंडी भाव एवं आर्बिट्रेज तुलना' : 'Regional APMC Mandi Comparison & Arbitrage Radar'}</span>
              </h4>
              <span style="font-size:0.75rem; color:#64748b;">
                ${currentLang === 'hi' ? 'परिवहन लागत घटाने के बाद शुद्ध लाभ का अनुमान' : 'Compare realized payout after estimated freight charges'}
              </span>
            </div>
            <span style="font-size:0.75rem; font-weight:700; color:#15803d; background:#f0fdf4; border:1px solid #bbf7d0; padding:3px 10px; border-radius:9999px;">
              Live APMC Sync
            </span>
          </div>

          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">
              <thead>
                <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; color:#64748b; font-weight:600;">
                  <th style="padding:0.75rem;">Mandi Node</th>
                  <th style="padding:0.75rem;">Distance</th>
                  <th style="padding:0.75rem;">Mandi Rate</th>
                  <th style="padding:0.75rem;">24h Trend</th>
                  <th style="padding:0.75rem;">Net Realization Margin</th>
                </tr>
              </thead>
              <tbody>
                ${commodity.mandi_rates.map((m, idx) => `
                  <tr style="border-bottom:1px solid #f1f5f9; ${idx === 0 ? 'background:#f0fdf4;' : ''}">
                    <td style="padding:0.75rem; font-weight:700; color:#0f172a;">
                      ${idx === 0 ? '👑 ' : ''}${m.mandi}
                    </td>
                    <td style="padding:0.75rem; color:#64748b;">${m.distance}</td>
                    <td style="padding:0.75rem; font-weight:800; color:#15803d; font-size:0.95rem;">
                      ₹${m.price} / ${commodity.unit}
                    </td>
                    <td style="padding:0.75rem; font-weight:700; color:${m.change.startsWith('+') ? '#16a34a' : '#dc2626'};">
                      ${m.change}
                    </td>
                    <td style="padding:0.75rem;">
                      <span style="font-size:0.78rem; font-weight:800; padding:3px 8px; border-radius:6px; ${m.net_profit_est.startsWith('+') ? 'background:#dcfce7; color:#15803d;' : 'background:#f1f5f9; color:#475569;'}">
                        ${m.net_profit_est}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 5. Interactive "Ask Kisan AI" Advisor Chatbot -->
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:1.5rem; box-shadow:var(--shadow-sm);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.4rem;">🤖</span>
              <div>
                <h4 style="font-size:1.1rem; font-weight:800; color:#0f172a; margin:0;">
                  ${currentLang === 'hi' ? 'किसान AI मूल्य सलाहकार' : 'Ask Kisan AI — Price Advisory'}
                </h4>
                <span style="font-size:0.75rem; color:#64748b;">
                  ${currentLang === 'hi' ? 'फसल बिक्री, मंडी भाव, या मौसमी रणनीति पर कोई भी सवाल पूछें' : 'Ask real-time questions on optimal harvesting, MSP benchmarks, and arbitrage'}
                </span>
              </div>
            </div>

            <!-- Quick Suggestions -->
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button class="ai-quick-query-btn" data-query="Should I sell now or wait?" style="padding:4px 10px; font-size:0.72rem; font-weight:700; background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; border-radius:20px; cursor:pointer;">
                ${currentLang === 'hi' ? 'क्या मुझे अभी बेचना चाहिए या रुकना चाहिए?' : 'Should I sell now or wait?'}
              </button>
              <button class="ai-quick-query-btn" data-query="Which nearby mandi pays highest?" style="padding:4px 10px; font-size:0.72rem; font-weight:700; background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; border-radius:20px; cursor:pointer;">
                ${currentLang === 'hi' ? 'निकटतम उच्चतम मंडी कौन सी है?' : 'Which mandi pays highest?'}
              </button>
              <button class="ai-quick-query-btn" data-query="How does current price compare to MSP?" style="padding:4px 10px; font-size:0.72rem; font-weight:700; background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; border-radius:20px; cursor:pointer;">
                ${currentLang === 'hi' ? 'MSP से तुलना करें' : 'MSP Comparison'}
              </button>
            </div>
          </div>

          <!-- Chat Conversation Stream -->
          <div id="kisan-ai-chat-thread" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem; max-height:280px; overflow-y:auto; display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1rem;">
            ${chatMessages.map(msg => `
              <div style="align-self:${msg.sender === 'user' ? 'flex-end' : 'flex-start'}; max-width:85%; background:${msg.sender === 'user' ? '#15803d' : '#ffffff'}; color:${msg.sender === 'user' ? '#ffffff' : '#0f172a'}; border:${msg.sender === 'user' ? 'none' : '1px solid #e2e8f0'}; border-radius:12px; padding:0.75rem 1rem; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                <div style="font-size:0.85rem; line-height:1.5; white-space:pre-line;">
                  ${msg.text}
                </div>
                <div style="font-size:0.68rem; margin-top:4px; opacity:0.75; text-align:right;">
                  ${msg.source ? `${msg.source} • ` : ''}${msg.time}
                </div>
              </div>
            `).join('')}

            ${isAskingAI ? `
              <div style="align-self:flex-start; background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:0.6rem 1rem; font-size:0.8rem; color:#64748b; display:flex; align-items:center; gap:8px;">
                <span style="display:inline-block; animation:spin 1s linear infinite;">⏳</span>
                <span>Kisan AI is analyzing ${commodity.name} APMC trends...</span>
              </div>
            ` : ''}
          </div>

          <!-- Input Bar -->
          <div style="display:flex; gap:8px;">
            <input 
              type="text" 
              id="kisan-ai-input" 
              placeholder="${currentLang === 'hi' ? 'किसान AI से सवाल पूछें (उदा. गेहूं कब बेचें?)...' : 'Ask Kisan AI anything about market prices, timings, or mandi arbitrage...'}" 
              value="${inputDraftText ? inputDraftText.replace(/"/g, '&quot;') : ''}"
              style="flex:1; padding:0.75rem 1rem; border:1px solid #cbd5e1; border-radius:10px; font-size:0.85rem;"
            />
            <button id="btn-send-kisan-ai" class="btn-primary-green" style="padding:0.75rem 1.4rem; font-size:0.85rem; font-weight:800; border-radius:10px; display:flex; align-items:center; gap:6px;">
              <span>${Icons.send || '➤'}</span>
              <span>${currentLang === 'hi' ? 'पूछें' : 'Ask AI'}</span>
            </button>
          </div>
        </div>

      </div>
    `;

    // 1. Commodity selector handlers
    container.querySelectorAll('.commodity-select-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedCommodityId = btn.dataset.commodityId;
        render();
      });
    });

    // 2. Quick Query buttons
    container.querySelectorAll('.ai-quick-query-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.dataset.query;
        handleUserQuery(query);
      });
    });

    // 3. Send AI Query
    const inputEl = container.querySelector('#kisan-ai-input');
    const sendBtn = container.querySelector('#btn-send-kisan-ai');

    if (inputEl) {
      inputEl.addEventListener('input', (e) => {
        inputDraftText = e.target.value;
      });
    }

    const triggerSend = () => {
      const q = inputEl?.value.trim() || inputDraftText.trim();
      if (!q) return;
      inputDraftText = '';
      if (inputEl) inputEl.value = '';
      handleUserQuery(q);
    };

    sendBtn?.addEventListener('click', triggerSend);
    inputEl?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') triggerSend();
    });

    // Auto scroll chat thread
    const thread = container.querySelector('#kisan-ai-chat-thread');
    if (thread) thread.scrollTop = thread.scrollHeight;
  }

  async function handleUserQuery(userText) {
    chatMessages.push({
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    isAskingAI = true;
    updateChatThread();

    const response = await AIPriceIntelligenceService.queryKisanAI({
      commodityId: selectedCommodityId,
      userPrompt: userText,
      language: currentLang
    });

    isAskingAI = false;
    chatMessages.push({
      sender: 'ai',
      text: response.text,
      source: response.source,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    updateChatThread();
  }

  render();
}
