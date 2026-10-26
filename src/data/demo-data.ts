// ============================================================
// Demo Data for Priya — Fictional Indian User
// ============================================================
import type { Transaction, FinancialGoal, ExpenseCategory } from '../types';

function generateId(): string {
  return `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function createTx(
  desc: string,
  amount: number,
  category: ExpenseCategory,
  daysBack: number,
  method: 'upi' | 'cash' | 'card' = 'upi'
): Transaction {
  return {
    id: generateId() + '_' + daysBack,
    description: desc,
    amount,
    type: 'debit',
    date: daysAgo(daysBack),
    category,
    paymentMethod: method,
    source: 'demo',
    createdAt: new Date().toISOString(),
  };
}

export function generateDemoData(): { transactions: Transaction[]; goals: FinancialGoal[] } {
  const transactions: Transaction[] = [
    // Income
    {
      id: 'income_salary',
      description: 'Salary — October 2026',
      amount: 30000,
      type: 'credit',
      date: daysAgo(25),
      category: 'Other',
      paymentMethod: 'netbanking',
      source: 'demo',
      createdAt: new Date().toISOString(),
    },

    // Rent
    createTx('Rent — PG Accommodation', 8000, 'Rent & Housing', 24),

    // Food & Dining
    createTx('Swiggy — Biryani order', 280, 'Food & Dining', 1),
    createTx('Zomato — Pizza delivery', 450, 'Food & Dining', 3),
    createTx('Chai & snacks — canteen', 60, 'Food & Dining', 2, 'cash'),
    createTx('Swiggy — South Indian', 220, 'Food & Dining', 5),
    createTx('Dominos — Pizza party', 850, 'Food & Dining', 8),
    createTx('Tea stall — daily chai', 30, 'Food & Dining', 0, 'cash'),
    createTx('Zomato — Lunch order', 190, 'Food & Dining', 10),
    createTx('Street food — chaat', 80, 'Food & Dining', 12, 'cash'),
    createTx('Swiggy — Dinner', 350, 'Food & Dining', 15),
    createTx('Cafe Coffee Day', 320, 'Food & Dining', 18),

    // Groceries
    createTx('BigBasket — Weekly groceries', 1200, 'Groceries', 7),
    createTx('DMart — Monthly provisions', 2800, 'Groceries', 20),
    createTx('Blinkit — Milk & bread', 180, 'Groceries', 4),
    createTx('Zepto — Vegetables', 350, 'Groceries', 14),

    // Transport
    createTx('Rapido — Office commute', 120, 'Transport', 1),
    createTx('Metro card recharge', 500, 'Transport', 6),
    createTx('Ola Auto — Market', 180, 'Transport', 9),
    createTx('Petrol', 800, 'Transport', 13),
    createTx('Rapido — College run', 90, 'Transport', 16),

    // Shopping
    createTx('Amazon — Earphones', 899, 'Shopping', 4),
    createTx('Myntra — T-shirt', 599, 'Shopping', 11),
    createTx('Flipkart — Phone case', 299, 'Shopping', 17),

    // Utilities
    createTx('Airtel Broadband', 799, 'Utilities', 22),
    createTx('Electricity bill', 1200, 'Utilities', 21),
    createTx('Jio Recharge', 299, 'Utilities', 19),

    // Education
    createTx('Udemy — React course', 499, 'Education', 10),

    // Subscriptions
    createTx('Netflix subscription', 199, 'Subscriptions', 23),
    createTx('Spotify Premium', 119, 'Subscriptions', 23),
    createTx('YouTube Premium', 129, 'Subscriptions', 23),

    // Entertainment
    createTx('BookMyShow — Movie ticket', 350, 'Entertainment', 6),

    // Health
    createTx('Apollo Pharmacy — Medicines', 420, 'Health', 15),

    // Investments
    createTx('Groww — SIP Mutual Fund', 3000, 'Investments & Savings', 25),
  ];

  const goals: FinancialGoal[] = [
    {
      id: 'goal_1',
      name: 'Emergency Fund',
      icon: '🛡️',
      targetAmount: 90000,
      currentAmount: 15000,
      monthlyContribution: 3000,
      targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'goal_2',
      name: 'New Laptop',
      icon: '💻',
      targetAmount: 55000,
      currentAmount: 12000,
      monthlyContribution: 5000,
      targetDate: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'goal_3',
      name: 'Weekend Trip — Goa',
      icon: '✈️',
      targetAmount: 25000,
      currentAmount: 5000,
      monthlyContribution: 4000,
      targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    },
  ];

  return { transactions, goals };
}
