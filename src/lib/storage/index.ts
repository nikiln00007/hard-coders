// ============================================================
// Local Storage Engine with Versioning
// ============================================================
import type { AppState, UserPreferences, Transaction, FinancialGoal, SimulatorConfig, GamificationState, MoneyPersonality } from '../../types';
import { generateDemoData } from '../../data/demo-data';

const STORAGE_KEY = 'worthit_app_state';
const STORAGE_VERSION = 1;

interface StorageEnvelope {
  version: number;
  data: AppState;
  lastUpdated: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  profileType: 'demo',
  monthlyIncome: 30000,
  workingDaysPerMonth: 22,
  workingHoursPerDay: 8,
  currency: 'INR',
  language: 'en',
  theme: 'dark',
  budgetPreferences: {
    budgets: [],
    savingsGoalPercent: 20,
  },
};

const DEFAULT_SIMULATOR: SimulatorConfig = {
  currentAge: 22,
  existingBalance: 15000,
  monthlyIncome: 30000,
  monthlyExpenses: 25000,
  savingsRate: 17,
  monthlySIP: 3000,
  annualReturn: 12,
  incomeGrowth: 8,
  projectionYears: 30,
};

const DEFAULT_GAMIFICATION: GamificationState = {
  badges: [
    { id: 'first_expense', name: 'First Expense Added', description: 'Added your first expense', icon: '📝', unlocked: false },
    { id: 'budget_starter', name: 'Budget Starter', description: 'Created your first budget', icon: '📊', unlocked: false },
    { id: 'streak_7', name: 'Seven-Day Streak', description: 'Reviewed expenses for 7 days straight', icon: '🔥', unlocked: false },
    { id: 'sub_detective', name: 'Subscription Detective', description: 'Used Leak Detector', icon: '🔍', unlocked: false },
    { id: 'goal_setter', name: 'Goal Setter', description: 'Created a financial goal', icon: '🎯', unlocked: false },
    { id: 'scam_smart', name: 'Scam Smart', description: 'Analyzed a message in Scam Shield', icon: '🛡️', unlocked: false },
    { id: 'savings_champ', name: 'Savings Champion', description: 'Reached 20% savings rate', icon: '🏆', unlocked: false },
  ],
  streaks: {
    expenseReview: 0,
    goalUpdate: 0,
  },
};

/**
 * Load app state from localStorage
 */
export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return initializeWithDemoData();
    }

    const envelope: StorageEnvelope = JSON.parse(raw);

    if (envelope.version !== STORAGE_VERSION) {
      // Future: migration logic
      return initializeWithDemoData();
    }

    return envelope.data;
  } catch {
    return initializeWithDemoData();
  }
}

/**
 * Save app state to localStorage
 */
export function saveAppState(state: AppState): void {
  try {
    const envelope: StorageEnvelope = {
      version: STORAGE_VERSION,
      data: state,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
  } catch (e) {
    console.error('Failed to save app state:', e);
  }
}

/**
 * Initialize with demo data
 */
function initializeWithDemoData(): AppState {
  const demo = generateDemoData();
  const state: AppState = {
    preferences: { ...DEFAULT_PREFERENCES, profileType: 'demo' },
    transactions: demo.transactions,
    goals: demo.goals,
    simulatorConfig: DEFAULT_SIMULATOR,
    gamification: { ...DEFAULT_GAMIFICATION, badges: DEFAULT_GAMIFICATION.badges.map(b => ({ ...b })) },
  };
  saveAppState(state);
  return state;
}

/**
 * Reset to demo data
 */
export function resetToDemo(): AppState {
  localStorage.removeItem(STORAGE_KEY);
  return initializeWithDemoData();
}

// ---- Partial update helpers ----

export function updatePreferences(prefs: Partial<UserPreferences>): void {
  const state = loadAppState();
  state.preferences = { ...state.preferences, ...prefs };
  saveAppState(state);
}

export function addTransaction(tx: Transaction): void {
  const state = loadAppState();
  state.transactions = [tx, ...state.transactions];
  saveAppState(state);
}

export function updateTransaction(id: string, updates: Partial<Transaction>): void {
  const state = loadAppState();
  state.transactions = state.transactions.map(t => t.id === id ? { ...t, ...updates } : t);
  saveAppState(state);
}

export function deleteTransaction(id: string): void {
  const state = loadAppState();
  state.transactions = state.transactions.filter(t => t.id !== id);
  saveAppState(state);
}

export function addGoal(goal: FinancialGoal): void {
  const state = loadAppState();
  state.goals = [...state.goals, goal];
  saveAppState(state);
}

export function updateGoal(id: string, updates: Partial<FinancialGoal>): void {
  const state = loadAppState();
  state.goals = state.goals.map(g => g.id === id ? { ...g, ...updates } : g);
  saveAppState(state);
}

export function deleteGoal(id: string): void {
  const state = loadAppState();
  state.goals = state.goals.filter(g => g.id !== id);
  saveAppState(state);
}

export function updateSimulatorConfig(config: Partial<SimulatorConfig>): void {
  const state = loadAppState();
  state.simulatorConfig = { ...state.simulatorConfig, ...config };
  saveAppState(state);
}

export function updateGamification(gamification: Partial<GamificationState>): void {
  const state = loadAppState();
  state.gamification = { ...state.gamification, ...gamification };
  saveAppState(state);
}

export function setQuizResult(result: MoneyPersonality): void {
  const state = loadAppState();
  state.quizResult = result;
  saveAppState(state);
}

export function exportAppStateAsJSON(): string {
  const state = loadAppState();
  return JSON.stringify(state, null, 2);
}

export function importAppStateFromJSON(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr) as AppState;
    if (parsed && parsed.preferences && parsed.transactions) {
      saveAppState(parsed);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export { DEFAULT_PREFERENCES, DEFAULT_SIMULATOR, DEFAULT_GAMIFICATION };

