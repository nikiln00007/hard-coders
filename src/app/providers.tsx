// ============================================================
// WorthIt App Context — Global State Management
// ============================================================
import React, { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';
import type {
  AppState, UserPreferences, Transaction, FinancialGoal,
  SimulatorConfig, GamificationState, MoneyPersonality,
} from '../types';
import { loadAppState, saveAppState, resetToDemo } from '../lib/storage';

// ---- Action Types ----
type AppAction =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: { id: string; updates: Partial<Transaction> } }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'IMPORT_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_GOAL'; payload: FinancialGoal }
  | { type: 'UPDATE_GOAL'; payload: { id: string; updates: Partial<FinancialGoal> } }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'UPDATE_SIMULATOR'; payload: Partial<SimulatorConfig> }
  | { type: 'UPDATE_GAMIFICATION'; payload: Partial<GamificationState> }
  | { type: 'SET_QUIZ_RESULT'; payload: MoneyPersonality }
  | { type: 'UNLOCK_BADGE'; payload: string }
  | { type: 'RESET_DEMO' };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'UPDATE_PREFERENCES':
      return { ...state, preferences: { ...state.preferences, ...action.payload } };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'IMPORT_TRANSACTIONS':
      return { ...state, transactions: [...action.payload, ...state.transactions] };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(g =>
          g.id === action.payload.id ? { ...g, ...action.payload.updates } : g
        ),
      };
    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter(g => g.id !== action.payload) };
    case 'UPDATE_SIMULATOR':
      return { ...state, simulatorConfig: { ...state.simulatorConfig, ...action.payload } };
    case 'UPDATE_GAMIFICATION':
      return { ...state, gamification: { ...state.gamification, ...action.payload } };
    case 'SET_QUIZ_RESULT':
      return { ...state, quizResult: action.payload };
    case 'UNLOCK_BADGE':
      return {
        ...state,
        gamification: {
          ...state.gamification,
          badges: state.gamification.badges.map(b =>
            b.id === action.payload ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() } : b
          ),
        },
      };
    case 'RESET_DEMO':
      return resetToDemo();
    default:
      return state;
  }
}

// ---- Context ----
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  lifeHoursConfig: { monthlyIncome: number; workingDaysPerMonth: number; workingHoursPerDay: number };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, null, () => loadAppState());

  // Persist on every change
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Theme effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.preferences.theme === 'dark');
    document.documentElement.classList.toggle('light', state.preferences.theme === 'light');
  }, [state.preferences.theme]);

  const lifeHoursConfig = {
    monthlyIncome: state.preferences.monthlyIncome,
    workingDaysPerMonth: state.preferences.workingDaysPerMonth,
    workingHoursPerDay: state.preferences.workingHoursPerDay,
  };

  return (
    <AppContext.Provider value={{ state, dispatch, lifeHoursConfig }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}

export function usePreferences() {
  const { state, dispatch } = useAppState();
  const update = useCallback(
    (prefs: Partial<UserPreferences>) => dispatch({ type: 'UPDATE_PREFERENCES', payload: prefs }),
    [dispatch]
  );
  return { preferences: state.preferences, updatePreferences: update };
}

export function useTransactions() {
  const { state, dispatch } = useAppState();
  return {
    transactions: state.transactions,
    addTransaction: (tx: Transaction) => dispatch({ type: 'ADD_TRANSACTION', payload: tx }),
    updateTransaction: (id: string, updates: Partial<Transaction>) =>
      dispatch({ type: 'UPDATE_TRANSACTION', payload: { id, updates } }),
    deleteTransaction: (id: string) => dispatch({ type: 'DELETE_TRANSACTION', payload: id }),
    importTransactions: (txs: Transaction[]) => dispatch({ type: 'IMPORT_TRANSACTIONS', payload: txs }),
  };
}

export function useGoals() {
  const { state, dispatch } = useAppState();
  return {
    goals: state.goals,
    addGoal: (goal: FinancialGoal) => dispatch({ type: 'ADD_GOAL', payload: goal }),
    updateGoal: (id: string, updates: Partial<FinancialGoal>) =>
      dispatch({ type: 'UPDATE_GOAL', payload: { id, updates } }),
    deleteGoal: (id: string) => dispatch({ type: 'DELETE_GOAL', payload: id }),
  };
}
