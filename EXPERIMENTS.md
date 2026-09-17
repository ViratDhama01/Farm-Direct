# 🧪 FarmDirect Experimental Features & Research Log

This document tracks all advanced experimentation modules, experimental features, queue algorithms, and future-forward enhancements built into the **FarmDirect** ecosystem.

---

## Experiment 1: Farmer Procurements & Priority Queue Pre-Booking System

### 1. Context & Motivation
- **The Challenge**: During peak sowing seasons (Rabi & Kharif), distribution centers for government-subsidized fertilizers (such as DAP and Urea) and cooperative machinery hubs face extreme demand surges. A block center typically receives a fixed quota (e.g., 1,000 bags of DAP for a block with 5,000 farmers).
- **Physical Bottleneck**: Farmers have to stand in physical queues for 6–10 hours without knowing if stock will be available when their turn arrives.
- **Goal**: Introduce a digital block-level pre-booking system with a multi-factor **Priority Queue Algorithm** that eliminates physical lines and ensures equitable, transparent input distribution.

---

### 2. Priority Queue Algorithm Mechanics

The system computes a composite **Priority Score ($P$)** from 0 to 100 for each procurement booking:

$$P = S_{\text{land}} + S_{\text{urgency}} + S_{\text{verification}} + S_{\text{fairness}}$$

#### A. Landholding Factor ($S_{\text{land}}$, Max: 40 pts)
- **Marginal Farmers (< 1 Hectare)**: $+40\text{ pts}$ (Highest priority to protect vulnerable smallholders)
- **Small Farmers (1 - 2 Hectares)**: $+30\text{ pts}$
- **Semi-Medium Farmers (2 - 4 Hectares)**: $+20\text{ pts}$
- **Medium & Large Farmers (> 4 Hectares)**: $+10\text{ pts}$

#### B. Sowing Window Urgency ($S_{\text{urgency}}$, Max: 30 pts)
- **Sowing within 1 to 5 days**: $+30\text{ pts}$ (Critical window)
- **Sowing within 6 to 12 days**: $+20\text{ pts}$
- **Sowing in 13+ days**: $+10\text{ pts}$

#### C. Verified Farm & Kisan Record ($S_{\text{verification}}$, Max: 20 pts)
- **eNAM / KCC / Aadhaar Verified Farmer**: $+20\text{ pts}$
- **Standard Registered Farmer**: $+10\text{ pts}$

#### D. Fair-Share Antihording Cap ($S_{\text{fairness}}$, Max: 10 pts)
- **First-time booking in season**: $+10\text{ pts}$
- **Hard Quota Limit**: Maximum 15 bags of DAP/Urea per farmer per booking lot to prevent black-market hoarding.

---

### 3. Digital Token & Time-Slot Management
1. **Dynamic Slot Assignment**: Automatically schedules pickup windows in 30-minute intervals (e.g., `Tuesday, 10:30 AM - 11:00 AM, Counter 2`).
2. **Live Queue Ticker**: Real-time counter tracker showing:
   - `Current Token Being Served: #104`
   - `Your Token: #108`
   - `Tokens Ahead: 4 (Est. wait: 12 minutes)`
3. **Mandi Pass / Digital Receipt**: Verification pass with unique procurement code for contactless verification at the distribution gate.

---

### 4. Catalog Categories & Items
- **Subsidized Fertilizers**: DAP (50kg bag @ ₹1,350), Neem Coated Urea (45kg bag @ ₹266.50), MOP Potash (@ ₹1,700), Nano Urea (500ml @ ₹225).
- **Custom Hiring Machinery**: Combine Harvester rental, Laser Land Leveler, Drone Crop Spraying, Solar Pump subsidy slots.
- **Certified Seed Lots**: High-Yield Wheat HD-3226, Desi Chana GNG-1581, Mustard Pioneer 45S46.

---

---

## Experiment 2: APMC Mandi Price Intelligence & Ollama LLM Advisory Engine

### 1. Context & Motivation
- **The Challenge**: Agricultural prices in India fluctuate drastically across mandis within a 50 km radius due to daily arrival volumes, local milling demand, export policies, and festive cycles. Farmers often sell prematurely at the village gate, losing 15–30% in potential revenue.
- **Goal**: Provide real-time APMC Mandi price feeds, MSP safety comparisons, 30-day AI predictive trajectory modeling, regional arbitrage detection, and a conversational **Kisan AI** assistant powered by Ollama (`gptoss120bcloud` / `llama3`).

---

### 2. Architecture: Hybrid LLM + APMC Ground Truth

```
┌─────────────────────────────────────────────────────────────┐
│                    FarmDirect Frontend                      │
├──────────────────────────────┬──────────────────────────────┤
│  1. Real APMC Feeds & MSP    │  2. Interactive AI Advisory  │
│  (Rates, 7-Day History,      │  (Hold vs Sell, Arbitrage,   │
│   Arrivals & Trend Data)     │   Festival Demand Insight)   │
└──────────────┬───────────────┴──────────────┬───────────────┘
               │                              │
               ▼                              ▼
    ┌──────────────────────┐      ┌───────────────────────────┐
    │  Kisan Prompt Engine │ ───► │  Ollama Endpoint          │
    │  (Injects Mandi Data │      │  (VITE_OLLAMA_URL or      │
    │   & Hindi/Eng context│      │   gptoss120bcloud host)   │
    └──────────────────────┘      └─────────────┬─────────────┘
                                                │ (Offline / Fallback)
                                                ▼
                                  ┌───────────────────────────┐
                                  │ Statistical Mandi Engine  │
                                  │ (Guarantees zero downtime │
                                  │  during live demos)       │
                                  └───────────────────────────┘
```

---

### 3. Core Modules & Capabilities

1. **APMC Price Feeds & MSP Benchmarking**:
   - Compares current mandi price against official government MSP (Minimum Support Price) benchmarks (e.g. Wheat @ ₹2,275/qtl, Moong @ ₹8,558/qtl, Mustard @ ₹5,650/qtl).
   - Real-time gauge: e.g. `+25.3% Above MSP (Safe Green Zone)`.

2. **AI "Hold vs. Sell" Recommendation Engine**:
   - Analyzes arrival volumes, milling demand, and festival cycles to produce clear badges: `⏳ HOLD FOR 7-12 DAYS` or `🚀 SELL NOW (PEAK RATE)`.
   - Projects anticipated price peak and confidence interval percentage.

3. **Regional Mandi Arbitrage Matrix**:
   - Compares 4+ nearby APMC Mandis (Azadpur APMC, Meerut, Karnal, Hapur) with freight distance and estimated net profit margin per kg after transport deduction.

4. **Conversational Kisan AI Advisory**:
   - Supports natural language query processing with pre-set quick prompt chips or free-form inquiries.
   - Dual-language response generation in **English** and **हिन्दी** (Hindi).

---

---

## Experiment 3: Automated Stock Deduction, Out-of-Stock State Machine & 24h Auto-Unlisting Lifecycle

### 1. Context & Motivation
- **The Challenge**: When buyers place orders on agricultural lots, inventory must synchronize accurately with the farmer's verified harvest volume. Premature deduction on order creation causes inventory lockups for abandoned or cancelled orders, whereas failure to deduct upon order confirmation creates double-booking risks.
- **24-Hour Grace Period**: When a farmer's crop reaches 0 kg (`quantity_available <= 0`), the produce should not immediately disappear from the marketplace—buyers who viewed the lot should be informed that it is temporarily out of stock (`🔴 Out of Stock`), while farmers are given a 24-hour window to restock newly harvested yields. After 24 hours of remaining at zero stock, the listing is automatically unlisted from the buyer marketplace feed to keep market offerings clean and relevant.

---

### 2. State Machine & Inventory Lifecycle

```
[ Active Listing ] ──(Order Confirmed)──► [ Stock Deducted (Qty - OrderQty) ]
        ▲                                            │
        │ (Restocked by Farmer)                      ▼
        │                                  ┌───────────────────┐
        └───────────────────────────────── │ Remaining Qty > 0?│
                                           └─────────┬─────────┘
                                                     │ No (Qty = 0)
                                                     ▼
                                      [ State: 'out_of_stock' ]
                                      - Sets out_of_stock_at timestamp
                                      - Displays 🔴 Out of Stock badge
                                      - Disables buyer order CTA
                                      - Starts 24h unlisting timer
                                                     │
                                      ┌──────────────┴──────────────┐
                                      │                             │
                        (Within 24 Hours)                  (After 24 Hours)
                                      ▼                             ▼
                        [ Visible as Out of Stock ]      [ State: 'unlisted' ]
                        - ⏱️ Countdown (e.g. 23h left)   - Filtered from Buyer Feed
                        - Farmer can 1-Click Restock     - Preserved in Farmer History
```

---

### 3. Core Mechanics & Implementation Details

1. **Order Confirmation Stock Deduction**:
   - In `FarmDirectApi.updateOrderStatus(orderId, status)`:
     - Upon status transitioning to `Confirmed` / `confirmed` / `in_transit` / `delivered`:
       - `newQty = Math.max(0, currentQty - orderQty)`
       - If `newQty === 0`:
         - `crop.status = 'out_of_stock'`
         - `crop.out_of_stock_at = new Date().toISOString()`
         - `crop.hours_until_unlisted = 24`
       - Sets `order.stock_deducted = true`.
       - Emits real-time reactive broadcast `farmdirect:crops_updated`.

2. **Order Cancellation Stock Restoration**:
   - If an order with `stock_deducted: true` is cancelled:
     - `crop.quantity_available += orderQty`
     - If `crop.quantity_available > 0`: `crop.status = 'active'`, resets out-of-stock timestamps.
     - `order.stock_deducted = false`.

3. **24-Hour Expiration & Auto-Unlisting Filter**:
   - In `FarmDirectApi.getCrops()` and `FarmDirectApp.getFilteredCrops()`:
     - Calculates `hoursElapsed = (Date.now() - outOfStockAt) / (1000 * 60 * 60)`.
     - If `hoursElapsed >= 24`: marks `crop.status = 'unlisted'`.
     - Buyer marketplace feed strictly excludes `status === 'unlisted'` items.

4. **UI States & Safeguards**:
   - **Marketplace Feed**: Displays `🔴 Out of Stock` badge on card image and quantity field with remaining hours countdown.
   - **Listing Detail Modal**: Replaces "Proceed to Order" with a disabled `🔴 Out of Stock` button and informational banner for buyers; gives owner farmers a 1-click `✏️ Restock / Edit Quantity` button.
   - **Farmer Dashboard**: Displays `🔴 Out of Stock` and `⚪ Unlisted (Zero Stock)` status tags with instant restock capability.

