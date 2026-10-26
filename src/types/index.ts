// ============================================================
// WorthIt — Core Data Models
// ============================================================

// --- User Preferences ---
export interface UserPreferences {
  profileType: 'demo' | 'custom';
  monthlyIncome: number;
  workingDaysPerMonth: number;
  workingHoursPerDay: number;
  currency: string;
  language: 'en' | 'hi' | 'ta' | 'te';
  theme: 'dark' | 'light';
  budgetPreferences: BudgetPreferences;
}

export interface BudgetPreferences {
  budgets: Budget[];
  savingsGoalPercent: number;
}

// --- Transactions ---
export type TransactionType = 'debit' | 'credit';
export type PaymentMethod = 'upi' | 'cash' | 'card' | 'netbanking' | 'wallet' | 'other';
export type TransactionSource = 'manual' | 'csv' | 'sms' | 'demo';

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Transport',
  'Shopping',
  'Rent & Housing',
  'Utilities',
  'Education',
  'Health',
  'Entertainment',
  'Subscriptions',
  'Investments & Savings',
  'Other',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string; // ISO date string
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  notes?: string;
  source: TransactionSource;
  createdAt: string;
}

// --- Budgets ---
export interface Budget {
  id: string;
  category: ExpenseCategory;
  amount: number;
  period: 'monthly' | 'weekly';
  startDate: string;
}

// --- Financial Goals ---
export interface FinancialGoal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  targetDate: string;
  returnAssumption?: number; // annual %
  createdAt: string;
}

// --- Simulator ---
export interface SimulatorConfig {
  currentAge: number;
  existingBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  monthlySIP: number;
  annualReturn: number;
  incomeGrowth: number;
  projectionYears: number;
}

export interface SimulatorScenario {
  label: string;
  monthlySIP: number;
  savingsRate: number;
  annualReturn: number;
}

export interface SimulatorResult {
  age: number;
  year: number;
  month: number;
  currentPathWealth: number;
  betterPathWealth: number;
  currentPathContributions: number;
  betterPathContributions: number;
}

// --- Purchase Decision ---
export interface PurchaseDecision {
  itemName: string;
  price: number;
  category: string;
  paymentType: 'cash' | 'emi';
  downPayment: number;
  loanAmount: number;
  annualInterestRate: number;
  loanTenureMonths: number;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  investmentReturn?: number;
  investmentYears?: number;
}

export interface PurchaseVerdict {
  verdict: 'GO' | 'WAIT' | 'SKIP';
  reasons: string[];
  workingHours: number;
  workingDays: number;
  percentOfIncome: number;
  remainingCash: number;
  emi?: number;
  totalRepayment?: number;
  totalInterest?: number;
  opportunityCost?: number;
}

// --- Leak Detector ---
export type LeakConfidence = 'likely_recurring' | 'possible_recurring' | 'frequent_small' | 'needs_review';

export interface RecurringExpenseFinding {
  id: string;
  merchant: string;
  estimatedAmount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  confidence: LeakConfidence;
  evidence: string[];
  reviewed: boolean;
  dismissed: boolean;
  transactions: string[]; // transaction IDs
}

// --- Scam Shield ---
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ScamFlag {
  pattern: string;
  description: string;
  evidence: string;
  weight: number;
}

export interface ScamAnalysisResult {
  riskLevel: RiskLevel;
  riskScore: number;
  flags: ScamFlag[];
  recommendations: string[];
  safetyChecklist: string[];
  aiExplanation?: string;
}

// --- Quiz ---
export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface QuizOption {
  label: string;
  scores: Record<MoneyPersonality, number>;
}

export type MoneyPersonality =
  | 'impulse_optimist'
  | 'anxious_saver'
  | 'balanced_builder'
  | 'future_focused'
  | 'social_spender'
  | 'cautious_explorer';

export interface PersonalityResult {
  type: MoneyPersonality;
  title: string;
  description: string;
  strengths: string[];
  blindSpots: string[];
  habits: string[];
  actions: string[];
}

// --- Gamification ---
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface GamificationState {
  badges: Badge[];
  streaks: {
    expenseReview: number;
    lastExpenseReviewDate?: string;
    goalUpdate: number;
    lastGoalUpdateDate?: string;
  };
  noSpendChallenge?: {
    startDate: string;
    targetDays: number;
    completedDays: number;
    active: boolean;
  };
}

// --- App State ---
export interface AppState {
  preferences: UserPreferences;
  transactions: Transaction[];
  goals: FinancialGoal[];
  simulatorConfig: SimulatorConfig;
  gamification: GamificationState;
  quizResult?: MoneyPersonality;
}
