// ============================================================
// Financial Calculations Engine
// ============================================================

/**
 * Calculate EMI using standard formula
 * EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 */
export function calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRate <= 0) return principal / tenureMonths;

  const monthlyRate = annualRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

/**
 * Calculate total repayment for a loan
 */
export function calculateTotalRepayment(emi: number, tenureMonths: number): number {
  return emi * tenureMonths;
}

/**
 * Calculate total interest paid
 */
export function calculateTotalInterest(principal: number, emi: number, tenureMonths: number): number {
  return (emi * tenureMonths) - principal;
}

/**
 * Future Value of monthly contributions (end-of-month)
 * FV = P × ((1+r)^n - 1) / r
 */
export function futureValueOfContributions(
  monthlyContribution: number,
  annualReturn: number,
  months: number
): number {
  if (months <= 0 || monthlyContribution <= 0) return 0;
  if (annualReturn <= 0) return monthlyContribution * months;

  const monthlyReturn = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;
  return monthlyContribution * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
}

/**
 * Future Value of a lump sum
 * FV = PV × (1+r)^n
 */
export function futureValueOfLumpSum(
  presentValue: number,
  annualReturn: number,
  months: number
): number {
  if (months <= 0 || presentValue <= 0) return presentValue;
  if (annualReturn <= 0) return presentValue;

  const monthlyReturn = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;
  return presentValue * Math.pow(1 + monthlyReturn, months);
}

/**
 * Calculate savings rate
 */
export function calculateSavingsRate(income: number, expenses: number): number {
  if (income <= 0) return 0;
  const savings = income - expenses;
  return Math.max(0, Math.min(100, (savings / income) * 100));
}

/**
 * Calculate financial health score (0-100)
 */
export function calculateHealthScore(params: {
  savingsRate: number;
  expenseToIncomeRatio: number;
  hasBudget: boolean;
  emergencyMonths: number;
  recurringCommitments: number;
  income: number;
}): { score: number; breakdown: { label: string; score: number; maxScore: number; tip: string }[] } {
  const breakdown: { label: string; score: number; maxScore: number; tip: string }[] = [];

  // Savings Rate (0-30 pts)
  const savingsScore = Math.min(30, Math.round(params.savingsRate * 1.5));
  breakdown.push({
    label: 'Savings Rate',
    score: savingsScore,
    maxScore: 30,
    tip: params.savingsRate < 20 ? 'Aim for at least 20% savings rate' : 'Great savings habit!'
  });

  // Expense Ratio (0-25 pts)
  const expenseScore = Math.max(0, Math.min(25, Math.round((1 - params.expenseToIncomeRatio) * 35)));
  breakdown.push({
    label: 'Expense Control',
    score: expenseScore,
    maxScore: 25,
    tip: params.expenseToIncomeRatio > 0.8 ? 'Try to keep expenses under 80% of income' : 'Good expense management!'
  });

  // Budget Adherence (0-15 pts)
  const budgetScore = params.hasBudget ? 15 : 0;
  breakdown.push({
    label: 'Budget Planning',
    score: budgetScore,
    maxScore: 15,
    tip: params.hasBudget ? 'Budgeting is a great habit!' : 'Set up a budget to improve your score'
  });

  // Emergency Fund (0-20 pts)
  const emergencyScore = Math.min(20, params.emergencyMonths * 5);
  breakdown.push({
    label: 'Emergency Fund',
    score: emergencyScore,
    maxScore: 20,
    tip: params.emergencyMonths < 3 ? 'Build at least 3 months of expenses as emergency fund' : 'Solid emergency reserves!'
  });

  // Low Recurring Burden (0-10 pts)
  const recurringRatio = params.income > 0 ? params.recurringCommitments / params.income : 1;
  const recurringScore = Math.max(0, Math.min(10, Math.round((1 - recurringRatio * 2) * 10)));
  breakdown.push({
    label: 'Financial Flexibility',
    score: recurringScore,
    maxScore: 10,
    tip: recurringRatio > 0.4 ? 'Recurring commitments are high — review subscriptions' : 'Manageable recurring expenses'
  });

  const score = Math.min(100, breakdown.reduce((sum, b) => sum + b.score, 0));

  return { score, breakdown };
}

/**
 * Format currency in INR
 */
export function formatINR(amount: number, compact = false): string {
  if (compact && Math.abs(amount) >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (compact && Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  if (compact && Math.abs(amount) >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format compact number
 */
export function formatCompactNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)} Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)} L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toFixed(0);
}
