// ============================================================
// Life Goals & Reverse SIP Planner
// ============================================================
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Plus, Calendar, TrendingUp,
  CheckCircle2, Clock, Trash2, Edit3, X
} from 'lucide-react';
import { useAppState, useGoals } from '../app/providers';
import { formatINR } from '../lib/finance/calculations';
import { amountToLifeHours } from '../lib/finance/life-hours';
import type { FinancialGoal } from '../types';

const GOAL_ICONS = ['🛡️', '💻', '✈️', '🚗', '🏡', '💍', '🎓', '🏖️', '📈', '🚀'];

export default function LifeGoals() {
  const { state } = useAppState();
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals();

  const lifeHoursConfig = {
    monthlyIncome: state.preferences.monthlyIncome,
    workingDaysPerMonth: state.preferences.workingDaysPerMonth,
    workingHoursPerDay: state.preferences.workingHoursPerDay,
  };

  // Add/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [targetAmount, setTargetAmount] = useState(100000);
  const [currentAmount, setCurrentAmount] = useState(20000);
  const [targetDate, setTargetDate] = useState('2027-12-31');
  const [expectedReturn, setExpectedReturn] = useState(12);

  // Quick Deposit modal state
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedGoalForDeposit, setSelectedGoalForDeposit] = useState<FinancialGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState(2000);

  // Reverse SIP computation for a target
  const calculateRequiredSIP = (target: number, current: number, dateStr: string, returnRate: number) => {
    const remaining = Math.max(0, target - current);
    if (remaining === 0) return 0;

    const now = new Date();
    const end = new Date(dateStr);
    const months = Math.max(1, (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth()));

    const monthlyReturn = Math.pow(1 + returnRate / 100, 1 / 12) - 1;
    if (monthlyReturn === 0) return Math.round(remaining / months);

    // FV = P * ((1+r)^n - 1) / r  => P = FV * r / ((1+r)^n - 1)
    const requiredSIP = (remaining * monthlyReturn) / (Math.pow(1 + monthlyReturn, months) - 1);
    return Math.max(100, Math.round(requiredSIP));
  };

  const handleOpenAddModal = () => {
    setEditingGoalId(null);
    setName('');
    setIcon('🎯');
    setTargetAmount(100000);
    setCurrentAmount(0);
    setTargetDate('2027-12-31');
    setExpectedReturn(12);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (goal: FinancialGoal) => {
    setEditingGoalId(goal.id);
    setName(goal.name);
    setIcon(goal.icon);
    setTargetAmount(goal.targetAmount);
    setCurrentAmount(goal.currentAmount);
    setTargetDate(goal.targetDate);
    setExpectedReturn(goal.returnAssumption || 12);
    setIsModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || targetAmount <= 0) return;

    const requiredSIP = calculateRequiredSIP(targetAmount, currentAmount, targetDate, expectedReturn);

    if (editingGoalId) {
      updateGoal(editingGoalId, {
        name,
        icon,
        targetAmount,
        currentAmount,
        targetDate,
        returnAssumption: expectedReturn,
        monthlyContribution: requiredSIP,
      });
    } else {
      const newGoal: FinancialGoal = {
        id: `goal_${Date.now()}`,
        name,
        icon,
        targetAmount,
        currentAmount,
        targetDate,
        returnAssumption: expectedReturn,
        monthlyContribution: requiredSIP,
        createdAt: new Date().toISOString(),
      };
      addGoal(newGoal);
    }
    setIsModalOpen(false);
  };

  const handleQuickDeposit = () => {
    if (!selectedGoalForDeposit || depositAmount <= 0) return;
    const updatedAmount = selectedGoalForDeposit.currentAmount + depositAmount;
    updateGoal(selectedGoalForDeposit.id, {
      currentAmount: updatedAmount,
    });
    setDepositModalOpen(false);
  };

  // Aggregate stats
  const totals = useMemo(() => {
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const totalMonthlySIP = goals.reduce((sum, g) => {
      return sum + calculateRequiredSIP(g.targetAmount, g.currentAmount, g.targetDate, g.returnAssumption || 12);
    }, 0);
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    return { totalTarget, totalSaved, totalMonthlySIP, overallProgress };
  }, [goals]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-purple">Goal Architecture</span>
            <span className="badge badge-green">Reverse SIP Planner</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1">Financial Life Goals</h1>
          <p className="text-muted text-sm mt-1">
            Turn vague wishes into mathematically exact monthly investment plans.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="btn btn-primary self-start sm:self-center flex items-center gap-2 text-xs"
        >
          <Plus size={16} /> Add New Goal
        </button>
      </div>

      {/* Aggregate Overview Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 space-y-1">
          <div className="text-xs text-muted flex items-center gap-1.5">
            <Target size={14} className="text-purple-400" />
            Total Goals Value
          </div>
          <div className="text-2xl font-black text-primary">
            {formatINR(totals.totalTarget)}
          </div>
          <div className="text-[11px] text-muted">Across {goals.length} target milestones</div>
        </div>

        <div className="card p-4 space-y-1">
          <div className="text-xs text-muted flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" />
            Total Accumulated
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {formatINR(totals.totalSaved)}
          </div>
          <div className="text-[11px] text-muted">{totals.overallProgress.toFixed(1)}% achieved so far</div>
        </div>

        <div className="card p-4 space-y-1">
          <div className="text-xs text-muted flex items-center gap-1.5">
            <TrendingUp size={14} className="text-purple-400" />
            Required Monthly SIP
          </div>
          <div className="text-2xl font-black text-purple-300">
            {formatINR(totals.totalMonthlySIP)}/mo
          </div>
          <div className="text-[11px] text-muted">to hit every target date on time</div>
        </div>

        <div className="card p-4 space-y-1">
          <div className="text-xs text-muted flex items-center gap-1.5">
            <Clock size={14} className="text-amber-400" />
            Freedom In Labor
          </div>
          <div className="text-2xl font-black text-amber-400">
            {amountToLifeHours(totals.totalSaved, lifeHoursConfig).formattedShort}
          </div>
          <div className="text-[11px] text-muted">of freedom stored in your goals</div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {goals.map((goal) => {
            const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
            const reqSip = calculateRequiredSIP(goal.targetAmount, goal.currentAmount, goal.targetDate, goal.returnAssumption || 12);
            const lifeHours = amountToLifeHours(goal.targetAmount, lifeHoursConfig);

            return (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="card p-5 space-y-4 hover:border-purple-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-2xl">
                        {goal.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-primary">{goal.name}</h4>
                        <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
                          <Calendar size={12} /> Target: {goal.targetDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(goal)}
                        className="text-muted hover:text-purple-400 p-1 rounded"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="text-muted hover:text-rose-400 p-1 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-400">{formatINR(goal.currentAmount)}</span>
                      <span className="text-muted">{formatINR(goal.targetAmount)}</span>
                    </div>
                    <div className="w-full h-2.5 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-muted">
                      <span>{progress.toFixed(0)}% Funded</span>
                      <span>{formatINR(remaining)} remaining</span>
                    </div>
                  </div>

                  {/* Reverse SIP Callout */}
                  <div className="mt-4 p-3 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Required SIP:</span>
                      <strong className="text-purple-300 font-bold">{formatINR(reqSip)}/mo</strong>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-muted">
                      <span>Assumed Return:</span>
                      <span>{goal.returnAssumption || 12}% CAGR</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-muted">
                      <span>Labor Value:</span>
                      <span className="text-amber-300 font-mono">⏱ {lifeHours.formattedShort} of work</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedGoalForDeposit(goal);
                      setDepositModalOpen(true);
                    }}
                    className="w-full btn btn-secondary text-xs flex items-center justify-center gap-1.5 py-2"
                  >
                    <Plus size={14} className="text-emerald-400" />
                    Add Contribution / Deposit
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add / Edit Goal Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card w-full max-w-md p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">
                  {editingGoalId ? 'Edit Goal' : 'Create New Financial Goal'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-primary">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveGoal} className="space-y-4 text-xs">
                <div>
                  <label className="label">Choose Emoji Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {GOAL_ICONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setIcon(emoji)}
                        className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-all ${
                          icon === emoji ? 'bg-purple-950 border-purple-500 scale-110' : 'bg-surface-2 border-border'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Goal Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input text-sm"
                    placeholder="e.g. MacBook Pro M3, Goa Vacation, Car Downpayment"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Target Amount (₹)</label>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(Number(e.target.value))}
                      className="input text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="label">Current Saved (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(Number(e.target.value))}
                      className="input text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Target Completion Date</label>
                    <input
                      type="date"
                      required
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="input text-xs"
                    />
                  </div>
                  <div>
                    <label className="label">Expected Return (% p.a.)</label>
                    <input
                      type="number"
                      step={0.5}
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(Number(e.target.value))}
                      className="input text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary text-xs">
                    {editingGoalId ? 'Update Goal' : 'Save Goal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Deposit Modal */}
      <AnimatePresence>
        {depositModalOpen && selectedGoalForDeposit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card w-full max-w-sm p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <span>{selectedGoalForDeposit.icon}</span>
                  Add to {selectedGoalForDeposit.name}
                </h3>
                <button onClick={() => setDepositModalOpen(false)} className="text-muted hover:text-primary">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="label">Deposit Amount (₹)</label>
                  <input
                    type="number"
                    min={100}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="input text-base font-semibold"
                  />
                </div>

                <div className="flex gap-2">
                  {[500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className="btn btn-secondary text-[11px] flex-1 py-1"
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-surface-2 text-[11px] text-muted">
                  New Balance will be:{' '}
                  <strong className="text-emerald-400">
                    {formatINR(selectedGoalForDeposit.currentAmount + depositAmount)}
                  </strong>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDepositModalOpen(false)}
                    className="btn btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button onClick={handleQuickDeposit} className="btn btn-primary text-xs">
                    Confirm Deposit
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
