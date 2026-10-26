💎 WorthIt — Your Money. Your Time. Your Future.
CodeCanvas 2K26 | Team Hard Coders
Theme: MONEYMATTERS — Make Money Make Sense
WorthIt doesn't just track money. It shows what money means.

WorthIt is an India-focused personal finance platform that turns spending into working hours, helps users find hidden expenses, simulate future wealth, plan goals, make smarter purchase decisions, and spot common digital-payment scam warnings.
✨ Key Features
- Life-Hours Converter: Converts prices into working hours and days based on income and work hours.
- Smart Expense Tracker: Add, edit, categorize, and analyse expenses; import CSV files or parse pasted transaction SMS.
- Future-You Simulator: Compare hypothetical savings and investment scenarios with interactive projections.
- Should I Buy?: Compare cash and EMI costs, interest, affordability, and opportunity cost.
- Leak Detector: Flags possible recurring payments and frequent small expenses for review.
- ScamShield: Highlights common scam signals in suspicious messages, UPI requests, and financial offers.
- Life Goals Planner: Set savings targets, track progress, and estimate required contributions.
- Money Personality Quiz: Explore spending and saving habits through six illustrative profiles.
- Tax & Savings Hints: Educational old-vs-new Indian tax-regime estimates, subject to supported rules.
- Money Report Card: Summarize financial activity and export a PDF where supported.
- More tools: Financial-health insights, habit tracking, badges, Jargon Buster, English/Hindi/Tamil/Telugu support, dark/light themes, and responsive layouts where implemented.
🛠️ Tech Stack
React · TypeScript · Vite · Tailwind CSS · Vanilla CSS · React Router · Recharts · Framer Motion · Lucide React · React Context · LocalStorage

Optional integrations, if configured: Claude API for explanations, i18next for translations, and jsPDF for PDF reports. Check package.json for the exact installed dependencies.
🚀 Getting Started
Prerequisites: Node.js, npm (or the package manager used by the repository), and Git.
git clone <YOUR_PUBLIC_GITHUB_REPOSITORY_URL>
cd <YOUR_REPOSITORY_DIRECTORY>
npm install
npm run dev
Open the local URL shown in the terminal (Vite commonly uses http://localhost:5173).

Production build:
npm run build
npm run preview
Confirm the available scripts in package.json before running tests or linting.
🧩 How It Works
The interface connects to shared application state, finance utilities, transaction analysis, scam-detection rules, local storage, and dashboard charts. Financial figures are calculated deterministically; AI is intended only to explain results and must not replace calculations. The app can use clearly labelled fictional demo data (for example, ₹30,000 monthly income) and should never imply that it is connected to a real bank unless that integration exists.
🔐 Privacy & Disclaimer
- Never enter or request UPI PINs, OTPs, bank passwords, or authentication secrets.
- Keep API keys server-side and out of public repositories.
- Investment projections, tax estimates, spending patterns, and scam scores are estimates, not guarantees or professional financial advice.
- ScamShield cannot guarantee that a message is safe; verify suspicious requests independently.
- Actual privacy and security depend on the implemented storage and integrations.
🤖 AI Tools & Development
AI tools used: Claude, ChatGPT, and Antigravity.

AI-assisted code was used for areas such as UI components, finance utilities, transaction handling, dashboard visualizations, and ScamShield explanations. The team reviewed and modified generated code for project requirements, validation, consistency, and integration.

Independently solved bug — Life-Hours Converter: Invalid or missing income, working-day, or working-hour values could cause incorrect or infinite results. Input validation was added so invalid values show a helpful message instead. Testing covered valid inputs, zero income, missing values, and invalid working-hour configurations.

Master prompt summary: Build a responsive, accessible, demo-ready fintech app with a premium purple interface, functional navigation, deterministic financial calculations, transaction tools, interactive projections, scam-awareness checks, privacy-conscious AI explanations, local persistence, and graceful error handling.
🏆 Team
- NIKIL N
- AKASH M
Built by Hard Coders for CodeCanvas 2K26.
🗺️ Roadmap
Potential improvements: stronger receipt/SMS extraction, more robust recurring-payment analysis, expanded financial-independence planning, richer multilingual explanations, optional secure cloud sync, accessibility improvements, and additional automated tests.
