// ============================================================
// Leak Detector — Subscription & Micro-Spend Audit
// ============================================================
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets, ShieldAlert, Sparkles, CheckCircle2,
  Zap, RefreshCw, TrendingUp
} from 'lucide-react';
import { useAppState } from '../app/providers';
import { formatINR, futureValueOfContributions } from '../lib/finance/calculations';
import { amountToLifeHours } from '../lib/finance/life-hours';

interface DetectedLeak {
  id: string;
  name: string;
  category: 'Subscription' | 'Micro-Spend' | 'Impulse Service';
  amount: number;
  period: 'monthly' | 'daily' | 'weekly';
  annualCost: number;
  occurrences: number;
  plugged: boolean;
  actionTip: string;
}

export default function LeakDetector() {
  const { state, dispatch } = useAppState();
  const lifeHoursConfig = {
    monthlyIncome: state.preferences.monthlyIncome,
    workingDaysPerMonth: state.preferences.workingDaysPerMonth,
    workingHoursPerDay: state.preferences.workingHoursPerDay,
  };

  // Pre-seed detected leaks from existing transactions or realistic presets
  const [leaks, setLeaks] = useState<DetectedLeak[]>([
    {
      id: 'leak-1',
      name: 'Netflix Premium 4K',
      category: 'Subscription',
      amount: 649,
      period: 'monthly',
      annualCost: 649 * 12,
      occurrences: 6,
      plugged: false,
      actionTip: 'Downgrade to Standard or share a family bundle',
    },
    {
      id: 'leak-2',
      name: 'Daily Office Canteen Chai & Samosa',
      category: 'Micro-Spend',
      amount: 60,
      period: 'daily',
      annualCost: 60 * 22 * 12, // 22 work days * 12 months = ₹15,840
      occurrences: 22,
      plugged: false,
      actionTip: 'Bring your own herbal tea blend or reduce to 1 cup',
    },
    {
      id: 'leak-3',
      name: 'Swiggy / Zomato Late Night Deliveries',
      category: 'Impulse Service',
      amount: 350,
      period: 'weekly',
      annualCost: 350 * 52, // ₹18,200
      occurrences: 4,
      plugged: false,
      actionTip: 'Pre-stock healthy frozen snacks to curb late midnight cravings',
    },
    {
      id: 'leak-4',
      name: 'Spotify Premium Individual',
      category: 'Subscription',
      amount: 119,
      period: 'monthly',
      annualCost: 119 * 12,
      occurrences: 8,
      plugged: false,
      actionTip: 'Switch to Duo/Family plan with friends or free tier with adblocker',
    },
    {
      id: 'leak-5',
      name: 'Unused Cloud Storage Tier',
      category: 'Subscription',
      amount: 130,
      period: 'monthly',
      annualCost: 130 * 12,
      occurrences: 5,
      plugged: false,
      actionTip: 'Back up photos to local drive and downgrade to 15GB free tier',
    },
    {
      id: 'leak-6',
      name: 'Convenience Cab Rides for <1 km',
      category: 'Micro-Spend',
      amount: 90,
      period: 'weekly',
      annualCost: 90 * 52, // ₹4,680
      occurrences: 12,
      plugged: false,
      actionTip: 'Walk the 800 meters — save cash and hit your daily 10k step goal!',
    },
  ]);

  // Aggregate stats
  const stats = useMemo(() => {
    const activeLeaks = leaks.filter((l) => !l.plugged);
    const pluggedLeaks = leaks.filter((l) => l.plugged);

    const totalAnnualBleed = activeLeaks.reduce((sum, l) => sum + l.annualCost, 0);
    const totalMonthlyBleed = Math.round(totalAnnualBleed / 12);
    const totalPluggedSavings = pluggedLeaks.reduce((sum, l) => sum + l.annualCost, 0);

    // If total monthly bleed is invested at 12% CAGR
    const invested10Yr = Math.round(futureValueOfContributions(totalMonthlyBleed, 12, 120));
    const invested20Yr = Math.round(futureValueOfContributions(totalMonthlyBleed, 12, 240));

    // Life hours lost per year
    const hoursLostYearly = amountToLifeHours(totalAnnualBleed, lifeHoursConfig);

    return {
      activeCount: activeLeaks.length,
      pluggedCount: pluggedLeaks.length,
      totalAnnualBleed,
      totalMonthlyBleed,
      totalPluggedSavings,
      invested10Yr,
      invested20Yr,
      hoursLostYearly,
    };
  }, [leaks, lifeHoursConfig]);

  const togglePlugLeak = (id: string) => {
    setLeaks((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const updated = { ...l, plugged: !l.plugged };
          if (!l.plugged) {
            // Unlocked badge bonus in state
            dispatch({ type: 'UNLOCK_BADGE', payload: 'badge_leak_plugger' });
          }
          return updated;
        }
        return l;
      })
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="badge badge-rose">Silent Bleed Audit</span>
          <span className="badge badge-purple">The Chai & Latte Factor</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1">Leak & Subscription Detector</h1>
        <p className="text-muted text-sm mt-1">
          Tiny recurring fees and everyday micro-transactions quietly devour your wealth. Identify and plug them here.
        </p>
      </div>

      {/* Top Impact Callout Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 space-y-1 bg-rose-950/20 border-rose-800/40">
          <div className="text-xs text-muted flex items-center gap-1.5">
            <Droplets size={14} className="text-rose-400" />
            Total Annual Bleed
          </div>
          <div className="text-2xl font-black text-rose-400">
            {formatINR(stats.totalAnnualBleed)}/yr
          </div>
          <div className="text-[11px] text-muted">
            ~{formatINR(stats.totalMonthlyBleed)} leaking every month
          </div>
        </div>

        <div className="card p-4 space-y-1 bg-purple-950/20 border-purple-800/40">
          <div className="text-xs text-muted flex items-center gap-1.5">
            <Zap size={14} className="text-purple-400" />
            Life-Hours Wasted
          </div>
          <div className="text-2xl font-black text-purple-300">
            {stats.hoursLostYearly.formattedShort}
          </div>
          <div className="text-[11px] text-muted">
            {stats.hoursLostYearly.totalDays.toFixed(1)} full shifts spent paying leaks
          </div>
        </div>

        <div className="card p-4 space-y-1 bg-emerald-950/20 border-emerald-800/40">
          <div className="text-xs text-muted flex items-center gap-1.5">
            <TrendingUp size={14} className="text-emerald-400" />
            10-Yr SIP Potential
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {formatINR(stats.invested10Yr)}
          </div>
          <div className="text-[11px] text-muted">
            if monthly bleed is invested @ 12%
          </div>
        </div>

        <div className="card p-4 space-y-1 bg-amber-950/20 border-amber-800/40">
          <div className="text-xs text-muted flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-400" />
            Money Recovered
          </div>
          <div className="text-2xl font-black text-amber-400">
            {formatINR(stats.totalPluggedSavings)}/yr
          </div>
          <div className="text-[11px] text-muted">
            from {stats.pluggedCount} plugged leaks
          </div>
        </div>
      </div>

      {/* The Chai Factor Deep Dive Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-surface-2 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-xl">☕</span>
            <h3 className="font-bold text-base text-primary">The Chai Factor In Numbers</h3>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            A single ₹40 cup of artisanal tea or coffee each workday equals <strong className="text-primary">₹880/month</strong>, or{' '}
            <strong className="text-rose-400">₹10,560/year</strong>. If you invest that ₹880 every month into an index fund for 20 years at 12%,
            it turns into a massive <strong className="text-emerald-400 font-bold">₹8,79,000</strong>!
          </p>
        </div>
        <div className="text-center md:text-right flex-shrink-0">
          <div className="text-xs text-muted">20-Year Chai Compound Return</div>
          <div className="text-2xl font-black text-emerald-400 mt-0.5">₹8.79 Lakhs</div>
          <div className="text-[11px] text-purple-300">from ₹40 daily micro-spends</div>
        </div>
      </motion.div>

      {/* Leaks Listing */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <ShieldAlert size={20} className="text-rose-400" />
            Detected Leaks & Recurring Drains ({leaks.length})
          </h3>
          <span className="text-xs text-muted">
            {stats.activeCount} active • {stats.pluggedCount} plugged
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <AnimatePresence>
            {leaks.map((leak) => {
              const itemHours = amountToLifeHours(leak.annualCost, lifeHoursConfig);

              return (
                <motion.div
                  key={leak.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 rounded-xl border transition-all ${
                    leak.plugged
                      ? 'bg-surface-1/40 border-emerald-800/40 opacity-75'
                      : 'bg-card border-border hover:border-purple-500/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`badge text-[10px] ${
                            leak.category === 'Subscription'
                              ? 'badge-purple'
                              : leak.category === 'Micro-Spend'
                              ? 'badge-amber'
                              : 'badge-rose'
                          }`}
                        >
                          {leak.category}
                        </span>
                        {leak.plugged && (
                          <span className="badge badge-green text-[10px] flex items-center gap-1">
                            <CheckCircle2 size={10} /> Plugged
                          </span>
                        )}
                      </div>
                      <h4 className={`font-semibold text-sm mt-1.5 ${leak.plugged ? 'line-through text-muted' : 'text-primary'}`}>
                        {leak.name}
                      </h4>
                      <div className="text-xs text-muted mt-0.5">
                        ₹{leak.amount.toLocaleString('en-IN')} / {leak.period} • {leak.occurrences} recorded cycles
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-bold text-sm ${leak.plugged ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {leak.plugged ? 'Saved' : 'Drains'} {formatINR(leak.annualCost)}/yr
                      </div>
                      <div className="text-[11px] text-muted">
                        ~{itemHours.formattedShort} labor/yr
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-3">
                    <div className="text-[11px] text-muted leading-tight truncate">
                      💡 {leak.actionTip}
                    </div>
                    <button
                      onClick={() => togglePlugLeak(leak.id)}
                      className={`btn text-xs py-1.5 px-3 flex-shrink-0 flex items-center gap-1.5 ${
                        leak.plugged
                          ? 'btn-secondary text-muted'
                          : 'btn-primary bg-emerald-600 hover:bg-emerald-500'
                      }`}
                    >
                      {leak.plugged ? (
                        <>
                          <RefreshCw size={12} /> Re-open
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={12} /> Plug Leak
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
