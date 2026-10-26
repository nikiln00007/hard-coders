// ============================================================
// Monthly Money Report Card & Executive Summary
// ============================================================
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Printer, CheckCircle2, Clock, Sparkles
} from 'lucide-react';
import { useAppState } from '../app/providers';
import {
  formatINR, calculateSavingsRate, calculateHealthScore
} from '../lib/finance/calculations';
import { amountToLifeHours } from '../lib/finance/life-hours';

export default function MoneyReport() {
  const { state } = useAppState();
  const { transactions, goals, preferences } = state;

  const lifeHoursConfig = {
    monthlyIncome: preferences.monthlyIncome,
    workingDaysPerMonth: preferences.workingDaysPerMonth,
    workingHoursPerDay: preferences.workingHoursPerDay,
  };

  // Monthly stats
  const stats = useMemo(() => {
    const monthlyIncome = preferences.monthlyIncome || 30000;
    const totalDebits = transactions
      .filter((t) => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);

    const netSavings = Math.max(0, monthlyIncome - totalDebits);
    const savingsRate = calculateSavingsRate(monthlyIncome, totalDebits);

    // Categories
    const catMap: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'debit')
      .forEach((t) => {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      });

    const sortedCats = Object.entries(catMap)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);

    const topCategory = sortedCats[0] || { name: 'Food & Dining', amount: 0 };

    // Life hours
    const expenseHours = amountToLifeHours(totalDebits, lifeHoursConfig);
    const savingsHours = amountToLifeHours(netSavings, lifeHoursConfig);

    // Health score
    const health = calculateHealthScore({
      savingsRate,
      expenseToIncomeRatio: totalDebits / (monthlyIncome || 1),
      hasBudget: true,
      emergencyMonths: 3,
      recurringCommitments: 5000,
      income: monthlyIncome,
    });

    let grade = 'A';
    if (health.score < 50) grade = 'D';
    else if (health.score < 65) grade = 'C';
    else if (health.score < 80) grade = 'B';
    else if (health.score < 90) grade = 'A-';
    else grade = 'A+';

    return {
      monthlyIncome,
      totalDebits,
      netSavings,
      savingsRate,
      sortedCats,
      topCategory,
      expenseHours,
      savingsHours,
      health,
      grade,
    };
  }, [transactions, preferences, lifeHoursConfig]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-purple">Executive Financial Brief</span>
            <span className="badge badge-green">October 2026</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1">Monthly Money Report</h1>
          <p className="text-muted text-sm mt-1">
            A comprehensive, clean evaluation of your earnings, spending behavior, and wealth velocity.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="btn btn-primary self-start sm:self-center flex items-center gap-2 text-xs"
        >
          <Printer size={16} /> Print / Export PDF
        </button>
      </div>

      {/* Printable Report Document Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 md:p-10 space-y-8 border bg-card print:border-none print:shadow-none"
      >
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-border">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted font-bold">WORTHIT FINANCIAL INTELLIGENCE</div>
            <h2 className="text-2xl font-black text-primary mt-1">Monthly Financial Health Report</h2>
            <div className="text-xs text-muted mt-1">
              Audit Period: October 1 - October 31, 2026 • Prepared for Priya Sharma
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-start">
            <div className="text-right">
              <div className="text-xs text-muted">Health Rating</div>
              <div className="text-3xl font-black text-purple-400">{stats.grade}</div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center font-black text-xl text-purple-300">
              {stats.health.score}
            </div>
          </div>
        </div>

        {/* Executive Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface-2 border border-border">
            <div className="text-xs text-muted">Monthly Earnings</div>
            <div className="text-lg font-bold text-primary mt-1">{formatINR(stats.monthlyIncome)}</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">100% Inflow</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-2 border border-border">
            <div className="text-xs text-muted">Total Spent</div>
            <div className="text-lg font-bold text-rose-400 mt-1">{formatINR(stats.totalDebits)}</div>
            <div className="text-[11px] text-muted mt-0.5">
              {((stats.totalDebits / stats.monthlyIncome) * 100).toFixed(0)}% of income
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-2 border border-border">
            <div className="text-xs text-muted">Net Surplus / Savings</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">{formatINR(stats.netSavings)}</div>
            <div className="text-[11px] text-emerald-300 mt-0.5">{stats.savingsRate.toFixed(1)}% savings rate</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-2 border border-border">
            <div className="text-xs text-muted">Labor In Expenses</div>
            <div className="text-lg font-bold text-amber-400 mt-1">{stats.expenseHours.formattedShort}</div>
            <div className="text-[11px] text-muted mt-0.5">{stats.expenseHours.totalDays.toFixed(1)} working days</div>
          </div>
        </div>

        {/* Life Hours Ratio Section */}
        <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-800/30 space-y-3">
          <h4 className="font-bold text-sm text-purple-300 flex items-center gap-2">
            <Clock size={16} /> Life-Hours Distribution
          </h4>
          <p className="text-xs text-muted leading-relaxed">
            During this 30-day cycle, you worked approximately <strong className="text-primary">{preferences.workingDaysPerMonth * preferences.workingHoursPerDay} hours</strong>.
            You traded <strong className="text-rose-400">{stats.expenseHours.formatted}</strong> to cover lifestyle, food, and housing bills,
            and saved <strong className="text-emerald-400">{stats.savingsHours.formatted}</strong> of permanent labor freedom for your future self!
          </p>
        </div>

        {/* Category Breakdown Table */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-primary">Top Expenditure Categories</h4>
          <div className="border border-border rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-surface-2 text-muted uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Rupees Spent</th>
                  <th className="py-2.5 px-4">% of Total</th>
                  <th className="py-2.5 px-4">Labor Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats.sortedCats.map((cat) => {
                  const pct = ((cat.amount / stats.totalDebits) * 100).toFixed(1);
                  const hrs = amountToLifeHours(cat.amount, lifeHoursConfig);
                  return (
                    <tr key={cat.name} className="hover:bg-surface-2/40">
                      <td className="py-2.5 px-4 font-semibold text-primary">{cat.name}</td>
                      <td className="py-2.5 px-4 font-mono">{formatINR(cat.amount)}</td>
                      <td className="py-2.5 px-4 text-muted">{pct}%</td>
                      <td className="py-2.5 px-4 text-purple-300 font-mono">{hrs.formattedShort}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Goals & Strategic Directives */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2">
            <h5 className="font-bold text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Monthly Accomplishments
            </h5>
            <ul className="space-y-1.5 text-xs text-muted">
              <li>• Maintained a healthy {stats.savingsRate.toFixed(0)}% savings rate</li>
              <li>• Successfully funded {goals.length} target milestones</li>
              <li>• Kept credit card & EMI debt at ₹0</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2">
            <h5 className="font-bold text-xs text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} /> Action Items for Next Month
            </h5>
            <ul className="space-y-1.5 text-xs text-muted">
              <li>• Curb dining out from {formatINR(stats.topCategory.amount)} down by 15%</li>
              <li>• Plug identified unused subscriptions via Leak Detector</li>
              <li>• Increase SIP by ₹1,000 to hit the 1-Crore milestone 2 years earlier</li>
            </ul>
          </div>
        </div>

        {/* Sign-off Footer */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted gap-2">
          <span>Generated by WorthIt Financial Intelligence Engine</span>
          <span>Verified Demo Report • CodeCanvas 2K26</span>
        </div>
      </motion.div>
    </div>
  );
}
