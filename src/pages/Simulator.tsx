// ============================================================
// Future Self Wealth Simulator — Dual-Path Wealth Engine
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Award, Zap,
  Info, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from 'recharts';
import { useAppState } from '../app/providers';
import { formatINR } from '../lib/finance/calculations';

interface ScenarioPreset {
  label: string;
  icon: string;
  extraSip: number;
  returnRate: number;
  desc: string;
}

const PRESETS: ScenarioPreset[] = [
  {
    label: 'Skip 1 Swiggy/Day',
    icon: '🍕',
    extraSip: 3000,
    returnRate: 12,
    desc: 'Invest ₹100/day saved from impulse dining out',
  },
  {
    label: 'Plug Subscriptions',
    icon: '📱',
    extraSip: 1000,
    returnRate: 12,
    desc: 'Cancel unused gym/streaming services',
  },
  {
    label: '10% Step-Up SIP',
    icon: '🚀',
    extraSip: 5000,
    returnRate: 13,
    desc: 'Aggressive index investing with yearly hike',
  },
  {
    label: 'Balanced Builder',
    icon: '⚖️',
    extraSip: 2500,
    returnRate: 11,
    desc: 'Moderate allocation across diversified funds',
  },
];

export default function Simulator() {
  const { state, dispatch } = useAppState();
  const cfg = state.simulatorConfig;

  // Local state with defaults from context
  const [currentAge, setCurrentAge] = useState(cfg.currentAge || 24);
  const [existingSavings, setExistingSavings] = useState(cfg.existingBalance || 25000);
  const [currentSIP, setCurrentSIP] = useState(cfg.monthlySIP || 2000);
  const [extraSIP, setExtraSIP] = useState(3000);
  const [expectedReturn, setExpectedReturn] = useState(cfg.annualReturn || 12);
  const [targetRetireAge, setTargetRetireAge] = useState(55);
  const [selectedPreset, setSelectedPreset] = useState<string | null>('Skip 1 Swiggy/Day');

  const yearsToProject = Math.max(5, targetRetireAge - currentAge);

  // Calculate wealth trajectories
  const { trajectoryData, summary } = useMemo(() => {
    const data: Array<{
      year: number;
      age: number;
      currentWealth: number;
      betterWealth: number;
      currentInvested: number;
      betterInvested: number;
    }> = [];

    const monthlyReturn = Math.pow(1 + expectedReturn / 100, 1 / 12) - 1;
    const betterMonthlySIP = currentSIP + extraSIP;

    let curBal = existingSavings;
    let betBal = existingSavings;
    let curInvested = existingSavings;
    let betInvested = existingSavings;

    // Start point
    data.push({
      year: 0,
      age: currentAge,
      currentWealth: Math.round(curBal),
      betterWealth: Math.round(betBal),
      currentInvested: Math.round(curInvested),
      betterInvested: Math.round(betInvested),
    });

    for (let yr = 1; yr <= yearsToProject; yr++) {
      for (let m = 0; m < 12; m++) {
        curBal = curBal * (1 + monthlyReturn) + currentSIP;
        betBal = betBal * (1 + monthlyReturn) + betterMonthlySIP;
        curInvested += currentSIP;
        betInvested += betterMonthlySIP;
      }

      data.push({
        year: yr,
        age: currentAge + yr,
        currentWealth: Math.round(curBal),
        betterWealth: Math.round(betBal),
        currentInvested: Math.round(curInvested),
        betterInvested: Math.round(betInvested),
      });
    }

    const finalPoint = data[data.length - 1];
    const wealthDelta = finalPoint.betterWealth - finalPoint.currentWealth;
    const investedDelta = finalPoint.betterInvested - finalPoint.currentInvested;
    const compoundBonus = wealthDelta - investedDelta;

    // Calculate milestones
    const milestones = [
      { target: 1000000, label: '₹10 Lakh Milestone' },
      { target: 5000000, label: '₹50 Lakh Semi-Freedom' },
      { target: 10000000, label: '₹1 Crore Crorepati Club' },
    ].map(m => {
      const curYear = data.find(d => d.currentWealth >= m.target);
      const betYear = data.find(d => d.betterWealth >= m.target);
      return {
        ...m,
        currentAgeAchieved: curYear ? curYear.age : null,
        betterAgeAchieved: betYear ? betYear.age : null,
        yearsSaved: curYear && betYear ? curYear.year - betYear.year : (curYear ? null : (betYear ? 'Years Ahead!' : null))
      };
    });

    return {
      trajectoryData: data,
      summary: {
        finalCurrentWealth: finalPoint.currentWealth,
        finalBetterWealth: finalPoint.betterWealth,
        wealthDelta,
        investedDelta,
        compoundBonus,
        milestones,
      },
    };
  }, [currentAge, yearsToProject, existingSavings, currentSIP, extraSIP, expectedReturn]);

  const applyPreset = (preset: ScenarioPreset) => {
    setSelectedPreset(preset.label);
    setExtraSIP(preset.extraSip);
    setExpectedReturn(preset.returnRate);
  };

  const handleSaveToProfile = () => {
    dispatch({
      type: 'UPDATE_SIMULATOR',
      payload: {
        currentAge,
        existingBalance: existingSavings,
        monthlySIP: currentSIP,
        annualReturn: expectedReturn,
      },
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-purple">AI Wealth Forecasting</span>
            <span className="badge badge-green">Compounding Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1">Future Self Simulator</h1>
          <p className="text-muted text-sm mt-1">
            Compare your <span className="text-purple-400 font-medium">Current Trajectory</span> vs{' '}
            <span className="text-emerald-400 font-medium">Better Path</span> with compound interest.
          </p>
        </div>
        <button
          onClick={handleSaveToProfile}
          className="btn btn-secondary self-start md:self-center flex items-center gap-2 text-xs"
        >
          <RefreshCw size={14} /> Sync to Profile
        </button>
      </div>

      {/* Preset Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PRESETS.map((preset) => {
          const isSelected = selectedPreset === preset.label;
          return (
            <motion.button
              key={preset.label}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => applyPreset(preset)}
              className={`p-4 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-900/20'
                  : 'bg-card border-border hover:border-border-focus'
              }`}
            >
              <div className="text-2xl mb-1">{preset.icon}</div>
              <div className="font-semibold text-sm">{preset.label}</div>
              <div className="text-xs text-muted mt-1 leading-snug">{preset.desc}</div>
              <div className="text-xs font-mono text-purple-400 mt-2 font-medium">
                +₹{preset.extraSip.toLocaleString('en-IN')}/mo @ {preset.returnRate}%
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Main Interactive Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card space-y-5"
        >
          <h3 className="font-bold text-base flex items-center gap-2 text-primary">
            <Zap size={18} className="text-purple-400" />
            Simulation Parameters
          </h3>

          {/* Age range */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted">Current Age / Retirement</span>
              <span className="font-semibold text-purple-300">{currentAge} yrs → {targetRetireAge} yrs</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min={18}
                max={60}
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="input text-xs"
                placeholder="Current age"
              />
              <input
                type="number"
                min={currentAge + 1}
                max={80}
                value={targetRetireAge}
                onChange={(e) => setTargetRetireAge(Number(e.target.value))}
                className="input text-xs"
                placeholder="Target age"
              />
            </div>
          </div>

          {/* Initial Balance */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted">Existing Savings / Portfolio</span>
              <span className="font-semibold text-purple-300">₹{existingSavings.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={0}
              max={1000000}
              step={10000}
              value={existingSavings}
              onChange={(e) => setExistingSavings(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          {/* Current SIP */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted">Current Monthly Investment</span>
              <span className="font-semibold text-purple-300">₹{currentSIP.toLocaleString('en-IN')}/mo</span>
            </div>
            <input
              type="range"
              min={500}
              max={50000}
              step={500}
              value={currentSIP}
              onChange={(e) => setCurrentSIP(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          {/* Extra Boost (Better Path) */}
          <div className="p-3.5 rounded-xl bg-purple-900/20 border border-purple-500/30">
            <div className="flex justify-between text-xs mb-1 font-semibold text-emerald-300">
              <span>Better Path SIP Boost</span>
              <span>+₹{extraSIP.toLocaleString('en-IN')}/mo</span>
            </div>
            <input
              type="range"
              min={500}
              max={30000}
              step={500}
              value={extraSIP}
              onChange={(e) => {
                setExtraSIP(Number(e.target.value));
                setSelectedPreset(null);
              }}
              className="w-full accent-emerald-500"
            />
            <div className="text-[11px] text-muted mt-1.5">
              Total monthly investing on Better Path: <strong className="text-emerald-400">₹{(currentSIP + extraSIP).toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Expected Return */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted">Expected Annual Return (CAGR)</span>
              <span className="font-semibold text-purple-300">{expectedReturn}%</span>
            </div>
            <input
              type="range"
              min={6}
              max={18}
              step={0.5}
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-muted mt-1">
              <span>FD (7%)</span>
              <span>Nifty 50 (12%)</span>
              <span>MidCap (15%)</span>
            </div>
          </div>
        </motion.div>

        {/* Wealth Chart & Visuals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card lg:col-span-2 space-y-6"
        >
          {/* Top Wealth Callout Cards */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40">
              <div className="text-xs text-muted">Current Trajectory @ {targetRetireAge}</div>
              <div className="text-xl font-extrabold text-purple-300 mt-1">
                {formatINR(summary.finalCurrentWealth)}
              </div>
              <div className="text-[11px] text-muted mt-0.5">
                Invested: ₹{(trajectoryData[trajectoryData.length - 1]?.currentInvested || 0).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
              <div className="text-xs text-muted">Better Path @ {targetRetireAge}</div>
              <div className="text-xl font-extrabold text-emerald-400 mt-1">
                {formatINR(summary.finalBetterWealth)}
              </div>
              <div className="text-[11px] text-muted mt-0.5">
                Invested: ₹{(trajectoryData[trajectoryData.length - 1]?.betterInvested || 0).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40">
              <div className="text-xs text-muted">Extra Wealth Created</div>
              <div className="text-xl font-extrabold text-amber-400 mt-1">
                +{formatINR(summary.wealthDelta)}
              </div>
              <div className="text-[11px] text-amber-300/80 mt-0.5 flex items-center gap-1">
                <Sparkles size={12} /> {formatINR(summary.compoundBonus)} pure compound gains!
              </div>
            </div>
          </div>

          {/* Area Chart */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm">Portfolio Wealth Projection ({yearsToProject} Years)</h4>
              <span className="text-xs text-muted">Age {currentAge} to {targetRetireAge}</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="betterGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="curGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,160,186,0.1)" />
                <XAxis dataKey="age" tick={{ fontSize: 11 }} tickFormatter={(age) => `Age ${age}`} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => {
                    if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`;
                    if (v >= 100000) return `₹${(v / 100000).toFixed(0)}L`;
                    return `₹${(v / 1000).toFixed(0)}k`;
                  }}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    formatINR(Number(val) || 0),
                    name === 'betterWealth' ? 'Better Path' : 'Current Path',
                  ]}
                  labelFormatter={(age) => `At Age ${age}`}
                  contentStyle={{
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={30}
                  formatter={(value) => (value === 'betterWealth' ? 'Better Path Portfolio' : 'Current Path Portfolio')}
                />
                <Area
                  type="monotone"
                  dataKey="betterWealth"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#betterGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="currentWealth"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#curGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Compounding Insight Callout */}
          <div className="p-4 rounded-xl bg-surface-2 border border-border flex items-start gap-3">
            <Info size={20} className="text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-muted leading-relaxed">
              <strong className="text-primary font-medium">The Power of Compounding: </strong>
              By increasing your monthly savings by just <strong className="text-emerald-400">₹{extraSIP.toLocaleString('en-IN')}</strong>,
              you personally contribute an extra <strong className="text-primary">₹{summary.investedDelta.toLocaleString('en-IN')}</strong> over {yearsToProject} years.
              Yet your portfolio grows by an extra <strong className="text-emerald-400">₹{summary.wealthDelta.toLocaleString('en-IN')}</strong>.
              That means <strong className="text-amber-400">₹{summary.compoundBonus.toLocaleString('en-IN')}</strong> came completely from pure compound returns!
            </div>
          </div>
        </motion.div>
      </div>

      {/* Freedom Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card space-y-4"
      >
        <div className="flex items-center gap-2">
          <Award size={20} className="text-amber-400" />
          <h3 className="font-bold text-lg">Financial Freedom Milestones</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {summary.milestones.map((milestone) => (
            <div
              key={milestone.label}
              className="p-4 rounded-xl bg-card border border-border relative overflow-hidden"
            >
              <div className="font-bold text-sm text-primary mb-1">{milestone.label}</div>
              <div className="text-xs text-muted">Target: ₹{(milestone.target / 100000).toFixed(0)} Lakhs</div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Current Path:</span>
                  <span className="font-semibold text-purple-300">
                    {milestone.currentAgeAchieved ? `Age ${milestone.currentAgeAchieved}` : 'Not reached'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Better Path:</span>
                  <span className="font-semibold text-emerald-400">
                    {milestone.betterAgeAchieved ? `Age ${milestone.betterAgeAchieved}` : 'Not reached'}
                  </span>
                </div>
              </div>

              {milestone.yearsSaved && typeof milestone.yearsSaved === 'number' && (
                <div className="mt-3 pt-2 border-t border-border flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                  <Sparkles size={13} />
                  Achieved {milestone.yearsSaved} years earlier!
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
