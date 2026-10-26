// ============================================================
// Dashboard — Financial Overview
// ============================================================
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Clock, PlusCircle, Shield,
  ShoppingBag, Target, ArrowRight, Wallet, PiggyBank,
  Sparkles, Upload,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { useAppState } from '../app/providers';
import { formatINR } from '../lib/finance/calculations';
import { amountToLifeHours } from '../lib/finance/life-hours';
import { calculateHealthScore, calculateSavingsRate } from '../lib/finance/calculations';
import type { ExpenseCategory } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#F97316',
  'Groceries': '#34D399',
  'Transport': '#3B82F6',
  'Shopping': '#EC4899',
  'Rent & Housing': '#8B5CF6',
  'Utilities': '#F59E0B',
  'Education': '#6366F1',
  'Health': '#14B8A6',
  'Entertainment': '#F472B6',
  'Subscriptions': '#A855F7',
  'Investments & Savings': '#10B981',
  'Other': '#6B7280',
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

export default function Dashboard() {
  const { state, lifeHoursConfig } = useAppState();
  const { transactions, preferences, goals } = state;

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthTx = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const income = thisMonthTx
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0) || preferences.monthlyIncome;

    const expenses = thisMonthTx
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);

    const remaining = income - expenses;
    const savingsRate = calculateSavingsRate(income, expenses);

    // Category breakdown
    const categoryMap = new Map<ExpenseCategory, number>();
    thisMonthTx.filter(t => t.type === 'debit').forEach(t => {
      categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
    });

    const categoryData = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Weekly spending trend
    const weeklyData: { week: string; amount: number }[] = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - i * 7);
      const weekLabel = `Week ${4 - i}`;
      const weekAmount = thisMonthTx
        .filter(t => {
          const d = new Date(t.date);
          return t.type === 'debit' && d >= weekStart && d < weekEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);
      weeklyData.push({ week: weekLabel, amount: weekAmount });
    }

    // Essential vs discretionary
    const essentialCategories = ['Rent & Housing', 'Groceries', 'Utilities', 'Transport', 'Health', 'Education'];
    const essential = thisMonthTx
      .filter(t => t.type === 'debit' && essentialCategories.includes(t.category))
      .reduce((sum, t) => sum + t.amount, 0);
    const discretionary = expenses - essential;

    // Biggest category
    const biggestCategory = categoryData[0];

    // Life hours for total spending
    const totalLifeHours = amountToLifeHours(expenses, lifeHoursConfig);

    // Health score
    const investmentAmount = thisMonthTx
      .filter(t => t.type === 'debit' && t.category === 'Investments & Savings')
      .reduce((sum, t) => sum + t.amount, 0);
    const subscriptionAmount = thisMonthTx
      .filter(t => t.type === 'debit' && t.category === 'Subscriptions')
      .reduce((sum, t) => sum + t.amount, 0);
    const healthResult = calculateHealthScore({
      savingsRate,
      expenseToIncomeRatio: expenses / (income || 1),
      hasBudget: preferences.budgetPreferences.budgets.length > 0,
      emergencyMonths: investmentAmount > 0 ? 1 : 0,
      recurringCommitments: subscriptionAmount,
      income,
    });

    return {
      income, expenses, remaining, savingsRate,
      categoryData, weeklyData,
      essential, discretionary,
      biggestCategory, totalLifeHours,
      healthScore: healthResult.score,
      healthBreakdown: healthResult.breakdown,
    };
  }, [transactions, preferences, lifeHoursConfig]);

  // Smart insights
  const insights = useMemo(() => {
    const items: { icon: string; text: string; type: 'info' | 'warning' | 'success' }[] = [];

    if (stats.biggestCategory) {
      const pct = ((stats.biggestCategory.value / stats.expenses) * 100).toFixed(0);
      items.push({
        icon: '📊',
        text: `${stats.biggestCategory.name} accounts for ${pct}% of your spending.`,
        type: 'info',
      });
    }

    if (stats.savingsRate >= 20) {
      items.push({ icon: '🎉', text: `Your savings rate is ${stats.savingsRate.toFixed(0)}% — great job!`, type: 'success' });
    } else if (stats.savingsRate > 0) {
      items.push({ icon: '💡', text: `Your savings rate is ${stats.savingsRate.toFixed(0)}%. Aim for at least 20%.`, type: 'warning' });
    }

    if (stats.discretionary > stats.essential) {
      items.push({ icon: '⚠️', text: 'Discretionary spending exceeds essentials this month.', type: 'warning' });
    }

    items.push({
      icon: '⏱️',
      text: `You exchanged ${stats.totalLifeHours.formatted} of work for this month's spending.`,
      type: 'info',
    });

    return items;
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Welcome + Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, <span className="text-violet-bright">Priya</span> 👋
          </h1>
          <p className="text-muted mt-1 text-sm">Here's your financial overview for this month.</p>
        </div>
        <Link to="/expenses" className="btn btn-primary btn-sm">
          <PlusCircle size={16} /> Add Expense
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Income', value: stats.income, icon: Wallet, color: 'text-positive', bg: 'rgba(52,211,153,0.1)' },
          { label: 'Spending', value: stats.expenses, icon: TrendingDown, color: 'text-error', bg: 'rgba(251,113,133,0.1)' },
          { label: 'Remaining', value: stats.remaining, icon: PiggyBank, color: stats.remaining >= 0 ? 'text-positive' : 'text-error', bg: stats.remaining >= 0 ? 'rgba(52,211,153,0.1)' : 'rgba(251,113,133,0.1)' },
          { label: 'Savings Rate', value: null, displayValue: `${stats.savingsRate.toFixed(0)}%`, icon: TrendingUp, color: stats.savingsRate >= 20 ? 'text-positive' : 'text-warning', bg: stats.savingsRate >= 20 ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="card card-compact"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted font-medium uppercase tracking-wider">{stat.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: stat.bg }}>
                <stat.icon size={16} className={stat.color} />
              </div>
            </div>
            <p className={`text-xl sm:text-2xl font-bold tabular-nums ${stat.color}`}>
              {stat.displayValue || formatINR(stat.value!)}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Spending Breakdown */}
        <motion.div
          custom={4}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="card lg:col-span-1"
        >
          <h3 className="font-semibold mb-4">Spending Breakdown</h3>
          {stats.categoryData.length > 0 ? (
            <>
              <div className="flex justify-center mb-4">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={stats.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {stats.categoryData.map((entry) => (
                        <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#6B7280'} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => formatINR(Number(val) || 0)}
                      contentStyle={{
                        background: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {stats.categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: CATEGORY_COLORS[cat.name] || '#6B7280' }}
                      />
                      <span className="truncate">{cat.name}</span>
                    </div>
                    <span className="font-medium tabular-nums">{formatINR(cat.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state py-8">
              <p className="text-sm">No expenses recorded yet.</p>
            </div>
          )}
        </motion.div>

        {/* Weekly Trend + Life Hours */}
        <motion.div
          custom={5}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="card lg:col-span-2 space-y-6"
        >
          <div>
            <h3 className="font-semibold mb-4">Weekly Spending Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats.weeklyData}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,160,186,0.1)" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  formatter={(val: any) => formatINR(Number(val) || 0)}
                  contentStyle={{
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fill="url(#spendGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Life-Hours Widget */}
          <div className="p-4 rounded-xl bg-violet/10 border border-violet/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={18} className="text-violet-bright" />
              <h4 className="font-semibold text-sm">Life-Hours This Month</h4>
            </div>
            <p className="text-2xl font-bold text-violet-bright tabular-nums">
              {stats.totalLifeHours.formatted}
            </p>
            <p className="text-xs text-muted mt-1">
              of work exchanged for ₹{stats.expenses.toLocaleString('en-IN')} in spending
            </p>
          </div>
        </motion.div>
      </div>

      {/* Smart Insights + Health Score */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Smart Insights */}
        <motion.div
          custom={6}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="card"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-violet-bright" />
            <h3 className="font-semibold">Smart Insights</h3>
          </div>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl text-sm ${
                  insight.type === 'warning' ? 'bg-warning/10' :
                  insight.type === 'success' ? 'bg-positive/10' :
                  'bg-violet/5'
                }`}
              >
                <span className="text-base flex-shrink-0">{insight.icon}</span>
                <span>{insight.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Health Score */}
        <motion.div
          custom={7}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="card"
        >
          <h3 className="font-semibold mb-4">Financial Health Score</h3>
          <div className="flex items-center gap-6 mb-6">
            <div className="score-circle">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-surface-3)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke={stats.healthScore >= 70 ? '#34D399' : stats.healthScore >= 40 ? '#FBBF24' : '#FB7185'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(stats.healthScore / 100) * 264} 264`}
                />
              </svg>
              <span className="score-value">{stats.healthScore}</span>
            </div>
            <div>
              <p className="font-semibold text-lg">
                {stats.healthScore >= 70 ? 'Good' : stats.healthScore >= 40 ? 'Fair' : 'Needs Work'}
              </p>
              <p className="text-xs text-muted mt-1">Based on your savings rate, expenses, and financial habits.</p>
            </div>
          </div>
          <div className="space-y-3">
            {stats.healthBreakdown.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted">{item.label}</span>
                  <span className="font-medium tabular-nums">{item.score}/{item.maxScore}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${
                      item.score / item.maxScore >= 0.7 ? 'progress-fill-green' :
                      item.score / item.maxScore >= 0.4 ? 'progress-fill-amber' :
                      'progress-fill-red'
                    }`}
                    style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Essential vs Discretionary */}
      <motion.div
        custom={8}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="card"
      >
        <h3 className="font-semibold mb-4">Essential vs. Discretionary</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-positive/5 border border-positive/20">
            <p className="text-xs text-muted mb-1 uppercase tracking-wider">Essential</p>
            <p className="text-2xl font-bold text-positive tabular-nums">{formatINR(stats.essential)}</p>
            <p className="text-xs text-muted mt-1">Rent, groceries, utilities, transport, health, education</p>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <p className="text-xs text-muted mb-1 uppercase tracking-wider">Discretionary</p>
            <p className="text-2xl font-bold text-warning tabular-nums">{formatINR(stats.discretionary)}</p>
            <p className="text-xs text-muted mt-1">Shopping, dining out, subscriptions, entertainment</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        custom={9}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Add Expense', icon: PlusCircle, path: '/expenses', color: '#8B5CF6' },
            { label: 'Import CSV', icon: Upload, path: '/expenses', color: '#3B82F6' },
            { label: 'Simulate Future', icon: TrendingUp, path: '/simulator', color: '#34D399' },
            { label: 'Check Scam', icon: Shield, path: '/scam-shield', color: '#FB7185' },
            { label: 'Should I Buy?', icon: ShoppingBag, path: '/should-i-buy', color: '#F59E0B' },
            { label: 'Set a Goal', icon: Target, path: '/life-goals', color: '#EC4899' },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="card card-compact flex flex-col items-center gap-2 text-center hover:border-violet/50 transition-all group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: `${action.color}15` }}
              >
                <action.icon size={20} style={{ color: action.color }} />
              </div>
              <span className="text-xs font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Goals Preview */}
      {goals.length > 0 && (
        <motion.div
          custom={10}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Your Goals</h3>
            <Link to="/life-goals" className="text-xs text-violet-bright flex items-center gap-1 hover:underline">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {goals.slice(0, 3).map((goal) => {
              const pct = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
              return (
                <div key={goal.id} className="p-3 rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{goal.icon}</span>
                    <span className="font-medium text-sm truncate">{goal.name}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted mb-2">
                    <span>{formatINR(goal.currentAmount)}</span>
                    <span>{formatINR(goal.targetAmount)}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-muted mt-2 tabular-nums">{pct.toFixed(0)}% complete</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
