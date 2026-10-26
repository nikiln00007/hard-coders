💎 WorthIt — Your Money. Your Time. Your Future.
"WorthIt doesn't just track money. It shows what money means."

WorthIt is an India-focused personal finance platform that turns spending into working hours, helps users identify hidden expenses, simulate future wealth, plan financial goals, make smarter purchase decisions, and recognize common digital-payment scam warnings.

Hackathon: CodeCanvas 2K26
Team: Hard Coders
Theme: MONEYMATTERS — Make Money Make Sense
👥 Team Members
- NIKIL N
- AKASH M
📌 Project Description
Money is easy to spend when we see only its price. But every purchase also represents time spent working to earn that money.

WorthIt helps users understand the real cost of purchases by converting prices into working hours and connecting everyday financial choices with longer-term goals.

Instead of asking only, “Can I afford this?”, WorthIt encourages users to ask:
- How many hours of work does this purchase represent?
- How much money am I spending, and where is it going?
- Could this purchase delay one of my financial goals?
- How might regular savings and investment contributions affect my future?
- Does this message or payment request show common scam warning signs?
WorthIt combines deterministic financial calculations, transaction analysis, interactive charts, goal planning, and optional AI-powered explanations in a responsive interface.

Data integrity principle: Financial figures should be calculated by application logic. AI can explain results, but must not replace calculations or invent transactions, prices, or financial facts.
✨ Features
1. ⏱️ Life-Hours Converter
- Price-to-Time Conversion: Convert a purchase price into estimated working hours based on monthly income and working hours.
- Human-Scale Breakdown: Show the equivalent in work shifts and working days when the required inputs are available.
- Purchase Context: Help users compare the cost of everyday purchases in terms of time and earnings.
- Input Validation: Reject missing, zero, negative, or invalid income and work-hour values with clear messages.
2. 📊 Smart Expense Tracker
- Transaction Management: Add, edit, categorize, and analyse expenses.
- CSV Import: Upload bank statement CSV files, map columns, review rows, and import validated transactions.
- Pasted SMS Input: Where implemented, parse pasted transaction messages into editable transaction details.
- Expense Categories: Organize spending into categories such as food, shopping, travel, bills, and subscriptions.
- Transaction Review: Keep ambiguous entries pending review instead of silently guessing their meaning.
- Duplicate Protection: Prevent the same imported statement rows from being counted twice.
CSV upload uses statements provided by the user. It does not automatically connect to a bank or fetch new bank transactions.
3. 🔮 Future-You Simulator
- Scenario Planning: Adjust savings rates, monthly contributions, assumed returns, and investment horizons.
- Interactive Projections: Compare hypothetical future outcomes using charts.
- Net-Worth Estimates: Show projected values at selected future ages or dates when the required inputs are available.
- Transparent Assumptions: Make the contribution amount, time period, and assumed rate visible.
Investment projections are illustrative estimates, not guarantees of future returns.
4. 🛍️ Should I Buy?
- Purchase Evaluation: Review the cost of a potential purchase before spending.
- Cash vs EMI Comparison: Where the necessary inputs are provided, compare total cash price with instalments, interest, and fees.
- Affordability Context: Show how a purchase compares with the user's budget and available funds.
- Opportunity Cost: Illustrate what the money might become under a hypothetical savings or investment scenario.
- Goal Impact: Warn users when a purchase could delay a savings target, based on available data.
5. 🔍 Leak Detector
- Recurring-Payment Review: Identify possible subscriptions and repeated payments.
- Small-Expense Patterns: Highlight frequent small transactions that may add up over time.
- Category Analysis: Flag unusually high or increasing spending for review.
- User Confirmation: Present findings as possible patterns, not definite waste or fraud.
6. 🛡️ ScamShield
- Scam-Signal Checks: Highlight common warning signs in suspicious messages, UPI requests, links, and financial offers.
- Explainable Warnings: Explain which words or patterns triggered a warning.
- Safety Guidance: Encourage independent verification before transferring money or sharing information.
- Optional AI Assistance: AI explanations may be added if a secure provider integration is configured.
ScamShield cannot guarantee that a message is safe or fraudulent. Users should independently verify suspicious requests.
7. 🎯 Life Goals Planner
- Custom Goals: Create goals for a laptop, education, travel, an emergency fund, or other needs.
- Target Tracking: Store target amounts, target dates, priorities, and explicit allocations.
- Automatic Recalculation: Recalculate progress when validated transactions or goal allocations change.
- Contribution Planning: Estimate the amount needed per month to reach a target date.
- Funding Separation: Distinguish available cash, goal allocations, and investment holdings to avoid counting the same money twice.
For example, an investment should reduce a goal's cash allocation only when the user confirms that the investment was funded from money reserved for that goal. An investment from unallocated money should not silently reduce an unrelated goal.
8. 🧠 Money Personality Quiz
- Six Illustrative Profiles: Explore patterns in spending and saving habits through a short quiz.
- Personal Reflection: Provide simple suggestions based on quiz answers.
- Non-Clinical Results: Treat profiles as educational descriptions, not formal psychological assessments.
9. 🇮🇳 Tax & Savings Hints
- Tax-Regime Comparison: Provide educational old-vs-new Indian tax-regime estimates where supported rules and inputs are available.
- Savings Guidance: Help users estimate contributions required for their goals.
- Assumption Transparency: Display relevant tax year, assumptions, and limitations.
- Rule Updates: Verify tax rules before presenting estimates as current.
Tax calculations are estimates for educational use, not professional tax advice.
10. 🧾 Money Report Card
- Financial Summary: Summarize income, spending, savings, goal progress, and other available metrics.
- Trend Analysis: Display monthly comparisons and category breakdowns where sufficient data exists.
- PDF Export: Support report downloads if the required PDF dependency and implementation are present.
- Explainable Indicators: Show how each score or indicator is calculated.
11. 📈 Real-Data and Realtime Architecture
The project can be extended from local/demo data to a database-backed application:
- CSV-Based Transactions: Import real transaction records from user-provided statements.
- Supabase + PostgreSQL: Store authenticated users' accounts, transactions, goals, allocations, holdings, and price history.
- Supabase Realtime: Refresh the UI when authorized database records change.
- Market-Data API: Retrieve supported investment prices when a provider is selected and configured.
- Automatic Goal Engine: Recalculate balances and goals after confirmed financial changes.
- Clear Data Status: Display timestamps and mark missing or stale prices rather than inventing values.
These integrations require configuration and implementation. The application must not claim to have live bank synchronization or live market prices until the relevant service is connected and verified.
12. 🎨 Responsive User Experience
- Premium, modern fintech interface.
- Responsive layouts for desktop and mobile.
- Accessible inputs, navigation, and feedback.
- Interactive charts and clear financial summaries.
- Dark/light themes where implemented.
- English, Hindi, Tamil, and Telugu support where implemented.
- Graceful fallback behavior when optional services are unavailable.
🛠️ Tech Stack
Technology	Purpose
React	User interface and reusable components
TypeScript	Typed application logic
Vite	Development server and frontend build
Tailwind CSS / Vanilla CSS	Styling and responsive layouts
React Router	Application navigation
Recharts	Financial charts and projections
Framer Motion	Animations and transitions
Lucide React	Interface icons
React Context	Shared application state
LocalStorage	Local persistence where implemented
Papa Parse	CSV parsing, if installed
Supabase Auth	User authentication, if configured
Supabase PostgreSQL	Persistent financial records, if configured
Supabase Realtime	Database change notifications, if configured
Supabase Edge Functions	Server-side integration logic, if configured
Market-data API	Supported investment prices, once selected and configured
Claude API	Optional AI explanations, if configured
i18next	Optional localization support, if configured
jsPDF	Optional PDF report generation, if configured
Git and GitHub	Version control and collaboration


Check package.json and the current codebase for the exact installed dependencies and implemented features.
🤖 AI Tools & Development
Claude
May be used for optional AI-powered explanations and financial-language assistance if an API integration is configured.
ChatGPT
Used for project ideation, feature planning, prompt engineering, implementation guidance, documentation, and troubleshooting.
Antigravity
Used as an AI-assisted development environment for implementation, debugging, and UI improvements.

AI assistance can support development and explanations, but financial calculations, transaction totals, and goal progress must be produced by deterministic application logic. All generated code and outputs should be reviewed and tested by the team.
🧠 Important Prompts Used
Prompt 1 — Master Project Build
Build a responsive, accessible, demo-ready personal finance application called WorthIt for India. Convert prices into working hours, track expenses, import user-provided CSV statements, simulate future wealth, compare purchase options, identify potential recurring expenses, provide scam-awareness guidance, and plan savings goals. Use deterministic financial calculations, interactive charts, clear assumptions, privacy-conscious design, and graceful error handling. Do not claim live bank connectivity or market data unless those integrations are implemented and verified.

Prompt 2 — Goal Recalculation Engine
Implement a transaction-driven financial goal engine. Keep cash balances, investment holdings, and explicit goal allocations separate. Validate and deduplicate imported transactions. Recalculate financial summaries and goal progress after confirmed ledger changes. Never count the same money as both goal cash and an investment, and do not change goal allocations when the source of funds is ambiguous. Add tests for expenses, transfers, investment contributions, refunds, duplicate imports, and goal reallocation.

Prompt 3 — ScamShield Guidance
Act as a cautious digital-payment safety assistant. Identify common scam warning signs in the supplied message, explain why they are concerning, and give practical verification steps. Do not request or expose OTPs, UPI PINs, passwords, or other secrets. Do not guarantee that a message is safe or fraudulent. If evidence is insufficient, say so.

Prompt 4 — Secure API Integration
Integrate external APIs through a secure server-side implementation. Store credentials in environment secrets, keep private keys out of browser bundles and public repositories, validate provider responses, handle rate limits and errors, and clearly display unavailable or stale data. Do not fabricate responses when a provider is not configured.

Prompt 5 — Testing and Verification
Inspect the existing codebase before making changes. Identify the root cause of issues, implement focused fixes, preserve working features, and add or update tests. Run the available test suite and production build. Do not remove tests or replace real functionality with hardcoded mock data to make verification appear successful.

💻 AI-Assisted Code and Team Modifications
AI-assisted development may contribute to UI components, finance utilities, transaction handling, dashboard visualizations, and ScamShield explanations.

For the final submission, document the actual modifications made by the team, such as:
1. Financial Validation: Validate missing or invalid income and working-hour inputs in the Life-Hours Converter.
2. CSV Import: Normalize and validate statement rows, with duplicate protection and user review.
3. Goal Logic: Keep cash, investments, and goal allocations distinct to prevent double counting.
4. API Security: Keep provider credentials server-side and exclude secret files from version control.
5. UI Refinements: Improve responsive layouts, accessibility, and consistency across components.
6. Testing: Verify calculations, import behavior, and failure states.
Only claim changes that were actually implemented and verified in the project repository.
🐛 Bug Solved: Life-Hours Converter Validation
Problem
Invalid or missing income, working-day, or working-hour values could cause incorrect results or infinite values.
Solution
Input validation should reject missing, zero, negative, or invalid values before calculating the hourly rate or working hours. The interface should show a helpful validation message instead of displaying invalid results.
Verification Checklist
- [ ] Valid income and work-hour values produce the expected result.
- [ ] Zero income is handled safely.
- [ ] Missing inputs display a clear message.
- [ ] Invalid working-day and working-hour values are rejected.
- [ ] Results update when valid inputs change.
- [ ] The interface works on desktop and mobile.
Mark these items as complete only after testing the final implementation.
🧮 Financial Math Specification
WorthIt should use deterministic application code for financial calculations.
1. Hourly Earnings
\[
R = \frac{M}{D \times H}
\]
Where:
- \(R\) = estimated hourly earnings
- \(M\) = monthly income
- \(D\) = working days per month
- \(H\) = working hours per day
2. Life-Hours
\[
T = \frac{P}{R}
\]
Where:
- \(T\) = estimated working hours
- \(P\) = purchase price
- \(R\) = estimated hourly earnings
3. Lump-Sum Future Value
\[
FV = P(1+r)^t
\]
Where:
- \(P\) = starting amount
- \(r\) = assumed annual return as a decimal
- \(t\) = investment horizon in years
4. Recurring Contributions
For contributions made at the end of each period:
\[
FV = C\frac{(1+i)^N-1}{i}
\]
Where:
- \(C\) = contribution per period
- \(i\) = assumed return per period
- \(N\) = number of contributions
When the return rate is zero:
\[
FV = C \times N
\]
5. Goal Progress
\[
\text{Remaining} = \max(0,\text{Target} - \text{Eligible Funding})
\]
\[
\text{Progress} = \min\left(100,\frac{\text{Eligible Funding}}{\text{Target}}\times100\right)
\]
Eligible funding must follow WorthIt's explicit goal-allocation policy. Investment market-value changes should not silently alter goal cash allocations.

Calculations should validate inputs and avoid unnecessary rounding before displaying results.
Financial Disclaimer
WorthIt is an educational awareness tool, not professional financial, investment, or tax advice. Investment returns are uncertain, projections are not guarantees, and scam checks cannot guarantee safety.
🚀 Getting Started
Prerequisites
- Node.js version compatible with the repository
- npm or the package manager used by the project
- Git
- API credentials only for integrations that you intend to configure
1. Clone the Repository
Replace the placeholders with your actual public repository URL and folder name:
git clone <YOUR_PUBLIC_GITHUB_REPOSITORY_URL>
cd <YOUR_REPOSITORY_DIRECTORY>
npm install
2. Configure Environment Variables
If the project uses environment variables, create a local .env file based on .env.example when available.

Example frontend variables for a configured Supabase project:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
Only public/publishable Supabase credentials belong in frontend environment variables. Keep the Supabase service-role key and all market-data or AI provider secrets in server-side environment secrets.

Do not commit .env files or real API keys to GitHub.
3. Start the Development Server
npm run dev
Open the local URL printed by Vite in the terminal. It commonly uses http://localhost:5173.
4. Run Tests
Check the scripts available in package.json, then run the configured test command, for example:
npm test
5. Build for Production
npm run build
npm run preview
Confirm that the production build succeeds and that configured integrations work before deployment. If Supabase or a third-party provider is not configured, its features should display an honest setup or unavailable state.
📁 Project Structure
The exact structure depends on the repository. A possible organization is:
WorthIt/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   │   ├── money.ts
│   │   ├── goals.ts
│   │   └── csv.ts
│   ├── services/
│   ├── context/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   ├── migrations/
│   └── functions/
├── tests/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
This is a suggested structure, not a verified listing of the current repository files.
🔒 Privacy & Security
- API Key Protection: Keep private API keys and service-role credentials on the server.
- Environment Files: Exclude .env and other secret files from version control.
- Row-Level Security: Restrict each authenticated user to their own financial records.
- CSV Validation: Validate, deduplicate, and review transactions before importing.
- Financial Integrity: Use consistent, auditable transaction and goal-allocation records.
- AI Privacy: Avoid sending unnecessary personal financial information to external AI services.
- Scam Safety: Never ask users to enter OTPs, UPI PINs, or bank passwords into ScamShield.
- Honest Data Status: Clearly label demo data, stale prices, unsupported assets, and unconfigured integrations.
- Graceful Degradation: Keep local financial calculations usable when optional APIs are unavailable.
Actual security depends on the implementation, database policies, provider configuration, and deployment environment.
🗺️ Roadmap
Potential improvements include:
- More robust CSV column mapping and transaction classification.
- Better recurring-payment and subscription analysis.
- Complete database-backed goal reallocation and audit history.
- Secure cloud sync across devices.
- Market-data provider integration for supported assets.
- More detailed financial-independence planning.
- Expanded multilingual explanations.
- Accessibility improvements.
- More automated tests and production monitoring.
- Optional consent-based financial-data integrations if eligible and supported.
📜 License
Add the license selected by the team and include its corresponding LICENSE file before claiming the project is officially licensed.
🌟 Our Vision
We believe financial awareness begins when people understand not only how much something costs, but also what that money represents in their lives.

WorthIt connects earnings, spending, investments, and goals to help people make more informed financial decisions.

WorthIt — Your Money. Your Time. Your Future.
