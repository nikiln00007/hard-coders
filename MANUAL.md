# 📘 WorthIt — The A-to-Z Operational & Technical Manual
### CodeCanvas 2K26 | Theme: MONEYMATTERS — MAKE MONEY MAKE SENSE

---

## 📑 Table of Contents
1. [Executive Summary & Product Philosophy](#1-executive-summary--product-philosophy)
2. [Architectural Overview & Folder Map](#2-architectural-overview--folder-map)
3. [Core Mathematical Engines & Formulas](#3-core-mathematical-engines--formulas)
   - [3.1 The Life-Hours Engine](#31-the-life-hours-engine)
   - [3.2 Compound Wealth & Dual Trajectory Simulator](#32-compound-wealth--dual-trajectory-simulator)
   - [3.3 EMI & True Financing Cost Formula](#33-emi--true-financing-cost-formula)
   - [3.4 Reverse SIP Goal Calculation](#34-reverse-sip-goal-calculation)
   - [3.5 Indian Tax Engines (Budget 2024–2027)](#35-indian-tax-engines-budget-20242027)
4. [Comprehensive Page-by-Page Manual](#4-comprehensive-page-by-page-manual)
   - [Overview & Dashboard](#page-1-overview--dashboard)
   - [Expenses Tracker & Auto-Categorization](#page-2-expenses-tracker--auto-categorization)
   - [Life-Hours Interactive Converter](#page-3-life-hours-interactive-converter)
   - [Future Self Wealth Simulator](#page-4-future-self-wealth-simulator)
   - ["Should I Buy This?" Decision Sandbox](#page-5-should-i-buy-this-decision-sandbox)
   - [Leak Detector & The Chai Factor](#page-6-leak-detector--the-chai-factor)
   - [ScamShield Cyber Fraud Defense](#page-7-scamshield-cyber-fraud-defense)
   - [Life Goals & Reverse SIP Architecture](#page-8-life-goals--reverse-sip-architecture)
   - [Money Personality Archetype Quiz](#page-9-money-personality-archetype-quiz)
   - [Tax Savings & Regime Comparator](#page-10-tax-savings--regime-comparator)
   - [Monthly Money Report Card](#page-11-monthly-money-report-card)
   - [Settings, Portability & Privacy](#page-12-settings-portability--privacy)
5. [ScamShield Detection Rule Matrix](#5-scamshield-detection-rule-matrix)
6. [Data Schema & Storage Lifecycle](#6-data-schema--storage-lifecycle)
7. [Hackathon Demo Presentation Script](#7-hackathon-demo-presentation-script)
8. [FAQ & Troubleshooting](#8-faq--troubleshooting)

---

## 1. Executive Summary & Product Philosophy

Modern fintech applications in India (cred, gpay, phonepe, groww, zerodha) are either transaction facilitators or stock brokers. They encourage spending velocity or speculative trading. None of them sit beside the user when they are about to make an impulse decision on Amazon or Swiggy at 11:30 PM.

### The "Money Makes Sense" Paradigm
1. **Time is the Real Currency**: Money is abstract paper; your biological life and hours at a desk are finite. Translating ₹3,500 into "20 hours and 30 minutes of labor" instantly pierces dopamine illusions.
2. **Compound Opportunity Cost**: Spending ₹50,000 on a depreciating phone is not just losing ₹50,000—it is forfeiting ₹1,76,000 of wealth your future 40-year-old self desperately needs.
3. **Local Indian Context**: Real-world Indians deal with UPI collect scams, 80C paperwork traps, high rent in metro cities, and ₹40 canteen tea micro-leaks. WorthIt is engineered specifically for this reality.

---

## 2. Architectural Overview & Folder Map

```
code-canvas/
├── index.html                   # Entry HTML with Inter fonts preconnect
├── package.json                 # React 19, Recharts 3, Framer Motion, Tailwind v4
├── tsconfig.json                # TypeScript bundler mode, strict JSX
├── vite.config.ts               # Vite bundler config with optimizeDeps
├── src/
│   ├── main.tsx                 # React DOM mount point & AppProvider
│   ├── index.css                # Tailwind v4 theme, custom variables & badges
│   ├── app/
│   │   ├── providers.tsx        # Global AppContext & Reducer (state persistence)
│   │   └── router.tsx           # React Router v6 BrowserRouter setup
│   ├── components/
│   │   └── layout/
│   │       └── AppLayout.tsx    # Responsive sidebar navigation, theme switcher
│   ├── pages/
│   │   ├── Dashboard.tsx        # Overview, metrics, Recharts area/pie graphs
│   │   ├── Expenses.tsx         # Full CRUD, CSV import, SMS parser, filters
│   │   ├── LifeHours.tsx        # Real-time labor calculator & compare items
│   │   ├── Simulator.tsx        # Current vs Better Path area charts & milestones
│   │   ├── DecisionSandbox.tsx  # Impulse tester, EMI engine, 48-hr timer
│   │   ├── LeakDetector.tsx     # The Chai Factor, subscription drain audit
│   │   ├── ScamShield.tsx       # Live heuristic scam score, helpline 1930
│   │   ├── LifeGoals.tsx        # Reverse SIP planner, deposit modals, progress
│   │   ├── MoneyPersonality.tsx # 6-archetype quiz, strengths, blind spots
│   │   ├── TaxSavings.tsx       # New vs Old Regime, 80C, 80D, HRA engine
│   │   ├── MoneyReport.tsx      # Printable executive report card
│   │   └── Settings.tsx         # Hourly rate setup, JSON export/import, demo reset
│   ├── lib/
│   │   ├── categorization/      # Auto-categorization keyword heuristics
│   │   ├── finance/
│   │   │   ├── calculations.ts  # EMI, SIP, Future Value, Health score
│   │   │   └── life-hours.ts    # Labor-time conversions & readable tags
│   │   ├── scam-detection/      # Regex rule patterns & scoring engine
│   │   └── storage/             # LocalStorage serialize/deserialize helpers
│   ├── data/
│   │   └── demo-data.ts         # Pre-configured persona (Priya Sharma)
│   └── types/
│       └── index.ts             # TypeScript interfaces for all data models
```

---

## 3. Core Mathematical Engines & Formulas

### 3.1 The Life-Hours Engine
The system computes an individual's effective hourly earning rate:
$$\text{Hourly Rate} = \frac{\text{Monthly Take-Home Income}}{\text{Working Days Per Month} \times \text{Working Hours Per Day}}$$

When any monetary sum $A$ is inspected:
$$\text{Total Hours} = \frac{A}{\text{Hourly Rate}}$$
$$\text{Total Days} = \frac{\text{Total Hours}}{\text{Working Hours Per Day}}$$

*Example:* For an income of ₹30,000/month across 22 days at 8 hours/day:
- $\text{Hourly Rate} = \frac{30000}{176} = \text{₹}170.45/\text{hour}$
- A pair of sneakers costing ₹3,400 requires $\frac{3400}{170.45} = 19.95\text{ hours}$ (approx. $2.5$ full working shifts).

---

### 3.2 Compound Wealth & Dual Trajectory Simulator
For monthly investments compounding at annual rate $r$ over $n$ months with initial balance $P_0$:
$$r_m = (1 + r)^{1/12} - 1$$
$$FV = P_0 (1 + r_m)^n + \text{SIP} \times \frac{(1 + r_m)^n - 1}{r_m}$$

The simulation models two parallel trajectories simultaneously:
1. **Current Path**: Baseline SIP $S_{\text{current}}$ at rate $r$.
2. **Better Path**: Boosted SIP $S_{\text{current}} + \Delta S$ at rate $r$.
3. **Compounding Bonus**:
$$\Delta \text{Wealth} - \Delta \text{Invested} = \text{Pure Compounding Yield}$$

---

### 3.3 EMI & True Financing Cost Formula
$$\text{EMI} = P \times r_m \times \frac{(1 + r_m)^m}{(1 + r_m)^m - 1}$$
Where:
- $P$ is Loan Principal (Price minus Down Payment)
- $r_m = \frac{\text{Annual Interest Rate}}{12 \times 100}$
- $m$ is tenure in months

**Total Real Cost:**
$$\text{Total Outflow} = (\text{EMI} \times m) + \text{Processing Fees} + \text{GST (18\% on fees)}$$
$$\text{Hidden Interest Drain} = \text{Total Outflow} - P$$

---

### 3.4 Reverse SIP Goal Calculation
To reach a future goal target $G$ from current savings $C$ in $m$ months at annual return rate $r$:
$$\text{Remaining Gap} = G - C \times (1 + r_m)^m$$
$$\text{Required Monthly SIP} = \frac{\text{Remaining Gap} \times r_m}{(1 + r_m)^m - 1}$$

---

### 3.5 Indian Tax Engines (Budget 2024–2027)

#### New Tax Regime (Default)
- **Standard Deduction**: ₹75,000
- **Tax Slabs**:
  - Up to ₹3,00,000: **Nil (0%)**
  - ₹3,00,001 to ₹7,00,000: **5%**
  - ₹7,00,001 to ₹10,00,000: **10%**
  - ₹10,00,001 to ₹12,00,000: **15%**
  - ₹12,00,001 to ₹15,00,000: **20%**
  - Above ₹15,00,000: **30%**
- **Section 87A Rebate**: Full tax rebate if Net Taxable Income $\le \text{₹}7,00,000$. Effectively, salary up to **₹7,75,000 pays ₹0 income tax**.
- **Cess**: 4% Health & Education Cess on total tax.

#### Old Tax Regime
- **Standard Deduction**: ₹50,000
- **HRA Exemption**: Minimum of:
  1. Actual HRA received
  2. $\text{Rent Paid} - 10\% \text{ of Basic Salary}$
  3. $50\% \text{ of Basic Salary}$ (Metro: Delhi, Mumbai, Kolkata, Chennai) or $40\%$ (Non-Metro)
- **Section 80C**: Capped at ₹1,50,000 (ELSS, EPF, PPF, Life Insurance)
- **Section 80D**: Capped at ₹25,000 / ₹50,000 (Health insurance premiums)
- **Section 80CCD(1B)**: Up to ₹50,000 additional deduction for NPS Tier 1.

---

## 4. Comprehensive Page-by-Page Manual

### Page 1: Overview & Dashboard
- **Health Score Ring**: Evaluates 5 dimensions: Savings Rate, Expense-to-Income, Emergency Fund coverage, Debt Ratio, and Budget Adherence.
- **Life-Hours Ratio Bar**: Visual comparison of monthly income converted to hours vs. hours already spent on expenses.
- **Weekly Trend Area Chart**: Displays spend progression over the month with custom gradients.
- **Category Pie Chart**: Interactive breakdown with dynamic color mapping.

### Page 2: Expenses Tracker & Auto-Categorization
- **CRUD Operations**: Add, edit, or delete transactions with instant state recalculations.
- **Auto-Categorization Engine**: Matches merchant descriptions against regex patterns (e.g. *Swiggy/Zomato* $\to$ *Food & Dining*, *DMart/Blinkit* $\to$ *Groceries*, *Rapido/Uber* $\to$ *Transport*).
- **CSV Import**: Upload bank statements; automatically maps columns (`Date`, `Description`, `Amount`, `Type`).
- **SMS Parser**: Paste raw bank SMS alerts (e.g. *"INR 350.00 debited from A/c..."*) to extract amount, merchant, and date automatically.

### Page 3: Life-Hours Interactive Converter
- **Earnings Profile**: Sliders for monthly income, days, and hours.
- **Catalog Comparison**: Pre-loaded typical lifestyle goods (Chai, Movie Ticket, Earbuds, Smartwatch, Smartphone, Bike) with instant time calculations.
- **Custom Comparison List**: Add any two items to evaluate which requires more working shifts.

### Page 4: Future Self Wealth Simulator
- **Interactive Age Sliders**: Current age up to retirement age (e.g. 24 to 55).
- **Preset Quick Injections**:
  - *Skip 1 Swiggy/Day*: +₹3,000/mo @ 12%
  - *Plug Subscriptions*: +₹1,000/mo @ 12%
  - *10% Step-Up SIP*: +₹5,000/mo @ 13%
- **Milestone Cards**: Real-time age estimates for achieving ₹10 Lakhs, ₹50 Lakhs, and ₹1 Crore.

### Page 5: "Should I Buy This?" Decision Sandbox
- **Form Inputs**: Item name, sticker price, necessity toggle, cash vs. EMI mode.
- **Verdict Engine**:
  - 🟢 **GO**: Minor discretionary spend (<15% income or <3 working shifts).
  - 🟡 **WAIT**: Moderate spend (15–50% income); initiates 48-hour cooling period.
  - 🔴 **SKIP**: High-risk impulse purchase (>50% income or high-interest EMI for non-essentials).
- **48-Hour Cooling Off Timer**: Stores items in an active countdown tracker.

### Page 6: Leak Detector & The Chai Factor
- **Silent Drain Audit**: Identifies recurring monthly or weekly micro-expenses.
- **The Chai Factor Deep Dive**: Demonstrates the exponential compound penalty of a ₹40 daily habit over 10 and 20 years.
- **One-Click "Plug Leak"**: Marks subscriptions cancelled and updates net annual recovery metrics.

### Page 7: ScamShield Cyber Fraud Defense
- **Real-Time Text Scanner**: Evaluates messages against high-risk fraud signatures.
- **0–100 Threat Meter**: Color-coded risk assessment (Low, Medium, High, Critical).
- **National Helpline 1930**: Direct copy action and official Cyber Crime reporting link.

### Page 8: Life Goals & Reverse SIP Architecture
- **Goal Cards**: Set custom milestone targets (Vacation, Car, House, Laptop).
- **Reverse Planner**: Computes the exact monthly SIP needed to reach the target on schedule at specified CAGR.
- **Deposit Action**: Add lump-sum contributions with real-time progress bar recalculation.

### Page 9: Money Personality Archetype Quiz
- **6-Question Scenario Quiz**: Real-world behavioral situations (bonuses, group dining, flash sales).
- **Personalized Profile**: Unlocks dominant archetype with Superpowers, Blind Spots, and Custom Wealth Protocols.

### Page 10: Tax Savings & Regime Comparator
- **Side-by-Side Cards**: Real-time tax comparison between New and Old Regimes.
- **Recommendation Engine**: Automatically selects the winning regime and calculates exact annual savings.
- **Tax Labor Reality Check**: Displays how many calendar working shifts are consumed purely paying taxes.

### Page 11: Monthly Money Report Card
- **Executive Report**: Structured overview of income, spending, savings rate, and top category breakdown.
- **Clean Print Stylesheet**: Optimized for printing or saving to PDF (`window.print()`).

### Page 12: Settings, Portability & Privacy
- **Client-Side Persistence**: 100% stored in browser LocalStorage.
- **Data Export & Import**: Full JSON backup and restore capabilities.
- **Demo Data Reset**: Instant one-click restore to Priya Sharma's baseline portfolio.

---

## 5. ScamShield Detection Rule Matrix

| Pattern Name | Trigger Conditions / Keywords | Weight | Threat Justification |
| :--- | :--- | :---: | :--- |
| **UPI PIN Request** | `enter/share/provide ... upi pin/mpin` | 30 | Legitimate UPI payment receipts never require entering or sharing a PIN. |
| **OTP Request** | `share/tell/send ... otp/verification code` | 25 | Banks and payment gateways explicitly prohibit asking customers for OTPs. |
| **Pay to Receive Money** | `pay/send ... to receive/claim/credit` | 30 | Classic UPI collect request deception. Receiving money never requires making a debit. |
| **Fake KYC Suspension** | `kyc/account ... suspend/block/freeze` | 20 | Urgency-driven social engineering threatening immediate account closure. |
| **Guaranteed Returns** | `guaranteed/assured ... profit/double/triple` | 20 | Ponzi / unregulated investment fraud promising zero risk with abnormal gains. |
| **Work From Home Part-Time** | `earn 5000-15000/day ... rating/youtube/amazon` | 25 | Task/pre-payment scam involving Telegram groups and fake merchant tasks. |
| **Suspicious Shortened Link** | `bit.ly, tinyurl, .xyz, .top, .apk` | 15 | Phishing vectors hosting malware APKs or fake banking portals. |

---

## 6. Data Schema & Storage Lifecycle

All state is serialized under the LocalStorage key: `worthit_app_state`.

```typescript
interface AppState {
  preferences: {
    monthlyIncome: number;
    workingDaysPerMonth: number;
    workingHoursPerDay: number;
    currency: string;
    language: 'en' | 'hi' | 'ta' | 'te';
    theme: 'dark' | 'light';
  };
  transactions: Transaction[];
  goals: FinancialGoal[];
  simulatorConfig: SimulatorConfig;
  gamification: GamificationState;
  quizResult?: MoneyPersonality;
}
```

- **Persistence**: Any Reducer action automatically triggers `saveAppState(state)`.
- **Zero Network Exposure**: No tracking cookies, analytics pixels, or remote database calls.

---

## 7. Hackathon Demo Presentation Script

### Hook (0:00 – 0:45)
> *"Judges, let me ask you a question: When you spend ₹500 on dinner, what does that ₹500 mean to you? It’s just numbers on a screen. But for Priya, a 24-year-old developer making ₹30,000 a month, that ₹500 isn't just ₹500—it is **3 hours of her life sitting at her desk**. Welcome to **WorthIt**, where we make money make sense."*

### The Problem (0:45 – 1:30)
> *"Young Indians are caught between UPI instant payments, predatory No-Cost EMIs, confusing tax regimes, and sophisticated cyber scams. Existing apps track transactions after the money is already gone. WorthIt intervenes **before** the damage happens."*

### Feature Walkthrough (1:30 – 3:30)
1. **Show Dashboard**: Highlight the Financial Health Score and Life-Hours balance.
2. **Open Should I Buy This**: Test a ₹26,990 headphone. Show the verdict turning amber/red, displaying that it costs **13.2 working shifts**, and revealing ₹1.2 Lakhs in lost 10-year compounding.
3. **Open Leak Detector**: Point out the **Chai Factor** (how ₹40 daily canteens equal ₹8.79 Lakhs in retirement).
4. **Open ScamShield**: Paste a real-world fake KYC SMS. Show the meter jump to **Critical 85/100** with instant access to Cyber Crime 1930.
5. **Open Tax Comparator**: Demonstrate how the New Regime saves ₹14,200 without locking up ₹1.5L in 3-year ELSS.

### Conclusion (3:30 – 4:00)
> *"WorthIt is private, local-first, mathematically rigorous, and built specifically for the economic reality of young India. Thank you!"*

---

## 8. FAQ & Troubleshooting

#### Q: How do I change the baseline hourly rate?
**A:** Navigate to **Settings** (`/settings`) or the top of **Life-Hours** (`/life-hours`), update your monthly take-home income or daily shift hours, and click **Save Changes**. All tags across the application will recalculate instantly.

#### Q: How do I export or backup my transactions?
**A:** Go to **Settings** $\to$ click **Export Backup (JSON)**. This downloads a `.json` snapshot of all your transactions, custom goals, and preferences. You can restore it on any machine using **Import Backup (JSON)**.

#### Q: Can I run WorthIt completely offline?
**A:** Yes. WorthIt has zero backend dependencies. Once the page is loaded, all calculations, graphs, and local storage operations function 100% offline.
