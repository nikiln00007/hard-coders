// ============================================================
// "Should I Buy This?" — Interactive Purchase Decision Sandbox
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  HelpCircle, CheckCircle2, XCircle, Clock,
  ShieldCheck, Flame, Zap, Trash2, Hourglass
} from 'lucide-react';
import { useAppState } from '../app/providers';
import { formatINR, calculateEMI, futureValueOfLumpSum } from '../lib/finance/calculations';
import { amountToLifeHours } from '../lib/finance/life-hours';

interface CoolingItem {
  id: string;
  name: string;
  price: number;
  addedAt: number;
  coolHours: number;
}

export default function DecisionSandbox() {
  const { state } = useAppState();
  const lifeHoursConfig = {
    monthlyIncome: state.preferences.monthlyIncome,
    workingDaysPerMonth: state.preferences.workingDaysPerMonth,
    workingHoursPerDay: state.preferences.workingHoursPerDay,
  };

  // Input states
  const [itemName, setItemName] = useState('Sony WH-1000XM5 Headphones');
  const [price, setPrice] = useState(26990);
  const [category, setCategory] = useState('Electronics');
  const [isNecessity, setIsNecessity] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'emi'>('cash');
  const [emiTenure, setEmiTenure] = useState(6);
  const [emiInterestRate, setEmiInterestRate] = useState(15);
  const [processingFee, setProcessingFee] = useState(299);

  // Impulse cooling list
  const [coolingList, setCoolingList] = useState<CoolingItem[]>([
    {
      id: 'cool-1',
      name: 'Mechanical Gaming Keyboard',
      price: 6499,
      addedAt: Date.now() - 1000 * 60 * 60 * 22, // 22 hours ago
      coolHours: 48,
    },
  ]);

  // Calculations
  const lifeHours = useMemo(() => {
    return amountToLifeHours(price, lifeHoursConfig);
  }, [price, lifeHoursConfig]);

  const emiCalculation = useMemo(() => {
    if (paymentMode === 'cash') return null;
    const monthlyEMI = calculateEMI(price, emiInterestRate, emiTenure);
    const totalPayment = monthlyEMI * emiTenure + processingFee;
    const totalInterest = totalPayment - price;
    return {
      monthlyEMI: Math.round(monthlyEMI),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
    };
  }, [price, paymentMode, emiInterestRate, emiTenure, processingFee]);

  // Opportunity cost if invested for 5 & 10 years at 12%
  const opportunityCost5Yr = useMemo(() => {
    return Math.round(futureValueOfLumpSum(price, 12, 60));
  }, [price]);

  const opportunityCost10Yr = useMemo(() => {
    return Math.round(futureValueOfLumpSum(price, 12, 120));
  }, [price]);

  // Verdict Logic
  const verdictResult = useMemo(() => {
    const monthlyIncome = state.preferences.monthlyIncome || 30000;
    const pctOfIncome = (price / monthlyIncome) * 100;
    const workingDays = lifeHours.totalDays;

    let verdict: 'GO' | 'WAIT' | 'SKIP';
    const reasons: string[] = [];

    if (isNecessity) {
      verdict = 'GO';
      reasons.push('Marked as essential necessity for work or daily living.');
    } else if (pctOfIncome > 50 || workingDays > 12) {
      verdict = 'SKIP';
      reasons.push(`Costs ${workingDays.toFixed(1)} full days of your labor (${pctOfIncome.toFixed(0)}% of monthly salary).`);
      if (paymentMode === 'emi') {
        reasons.push('Financing non-essentials via high-interest EMI damages wealth trajectory.');
      }
      reasons.push('High impulse risk. Could delay primary financial goals.');
    } else if (pctOfIncome > 15 || workingDays > 3) {
      verdict = 'WAIT';
      reasons.push(`Moderate purchase (${workingDays.toFixed(1)} work days).`);
      reasons.push('Apply the 48-Hour Rule before confirming payment.');
      reasons.push('Check if you still crave this after 2 days of reflection.');
    } else {
      verdict = 'GO';
      reasons.push('Comfortably within your monthly discretionary allowance.');
      reasons.push(`Only takes ${lifeHours.formatted} of your labor.`);
    }

    return { verdict, reasons, pctOfIncome, workingDays };
  }, [price, state.preferences.monthlyIncome, lifeHours, isNecessity, paymentMode]);

  const addToCoolingOff = () => {
    if (!itemName.trim() || price <= 0) return;
    const newItem: CoolingItem = {
      id: `cool-${Date.now()}`,
      name: itemName,
      price,
      addedAt: Date.now(),
      coolHours: 48,
    };
    setCoolingList([newItem, ...coolingList]);
  };

  const removeCoolingItem = (id: string) => {
    setCoolingList(coolingList.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="badge badge-purple">Impulse Armor</span>
          <span className="badge badge-amber">Opportunity Cost Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1">"Should I Buy This?" Sandbox</h1>
        <p className="text-muted text-sm mt-1">
          Stress-test any purchase before swiping your card. Translate price tags into real labor hours and missed compounding.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Purchase Configuration Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 card space-y-4"
        >
          <h3 className="font-bold text-base flex items-center gap-2 text-primary">
            <Zap size={18} className="text-purple-400" />
            Purchase Under Consideration
          </h3>

          <div>
            <label className="label">Item / Service Name</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="input text-sm"
              placeholder="e.g. iPhone 16, Sneakers, Watch"
            />
          </div>

          <div>
            <label className="label">Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
              className="input text-base font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input text-xs"
              >
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion & Apparel</option>
                <option value="Dining">Dining Out & Nightlife</option>
                <option value="Travel">Travel & Leisure</option>
                <option value="Hobbies">Hobbies & Gaming</option>
                <option value="Fitness">Fitness & Health</option>
                <option value="Home">Home & Decor</option>
              </select>
            </div>
            <div>
              <label className="label">Necessity Check</label>
              <button
                type="button"
                onClick={() => setIsNecessity(!isNecessity)}
                className={`w-full h-[38px] rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  isNecessity
                    ? 'bg-emerald-950/60 border-emerald-500/70 text-emerald-300'
                    : 'bg-surface-2 border-border text-muted hover:text-primary'
                }`}
              >
                {isNecessity ? <CheckCircle2 size={14} /> : <HelpCircle size={14} />}
                {isNecessity ? 'Essential Need' : 'Discretionary Want'}
              </button>
            </div>
          </div>

          {/* Payment Method Toggle */}
          <div className="pt-2 border-t border-border">
            <label className="label">Payment Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMode('cash')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border ${
                  paymentMode === 'cash'
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-surface-2 border-border text-muted'
                }`}
              >
                Upfront Cash / UPI
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('emi')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border ${
                  paymentMode === 'emi'
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-surface-2 border-border text-muted'
                }`}
              >
                EMI / BNPL Loan
              </button>
            </div>
          </div>

          {/* EMI Sub-form */}
          {paymentMode === 'emi' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 space-y-3"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label text-[11px]">Tenure (Months)</label>
                  <select
                    value={emiTenure}
                    onChange={(e) => setEmiTenure(Number(e.target.value))}
                    className="input text-xs"
                  >
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                    <option value={9}>9 Months</option>
                    <option value={12}>12 Months</option>
                    <option value={18}>18 Months</option>
                    <option value={24}>24 Months</option>
                  </select>
                </div>
                <div>
                  <label className="label text-[11px]">Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    value={emiInterestRate}
                    onChange={(e) => setEmiInterestRate(Number(e.target.value))}
                    className="input text-xs"
                    step={0.5}
                  />
                </div>
              </div>
              <div>
                <label className="label text-[11px]">Processing Fee + GST (₹)</label>
                <input
                  type="number"
                  value={processingFee}
                  onChange={(e) => setProcessingFee(Number(e.target.value))}
                  className="input text-xs"
                />
              </div>
            </motion.div>
          )}

          <div className="pt-2">
            <button
              onClick={addToCoolingOff}
              className="w-full btn btn-secondary flex items-center justify-center gap-2 text-xs"
            >
              <Hourglass size={14} className="text-amber-400" />
              Add to 48-Hour Cooling List
            </button>
          </div>
        </motion.div>

        {/* Verdict & Impact Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Verdict Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-2xl border ${
              verdictResult.verdict === 'GO'
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-100'
                : verdictResult.verdict === 'WAIT'
                ? 'bg-amber-950/30 border-amber-500/50 text-amber-100'
                : 'bg-rose-950/30 border-rose-500/50 text-rose-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    verdictResult.verdict === 'GO'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : verdictResult.verdict === 'WAIT'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {verdictResult.verdict === 'GO' && <CheckCircle2 size={28} />}
                  {verdictResult.verdict === 'WAIT' && <Hourglass size={28} />}
                  {verdictResult.verdict === 'SKIP' && <XCircle size={28} />}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold opacity-80">
                    Decision Recommendation
                  </div>
                  <div className="text-2xl font-black">
                    {verdictResult.verdict === 'GO' && 'VERDICT: SAFE TO BUY (GO)'}
                    {verdictResult.verdict === 'WAIT' && 'VERDICT: 48-HR COOLING PERIOD (WAIT)'}
                    {verdictResult.verdict === 'SKIP' && 'VERDICT: HIGH REGRET RISK (SKIP)'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 text-xs opacity-90 pl-1">
              {verdictResult.reasons.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Three Reality Checks */}
          <div className="grid sm:grid-cols-3 gap-3">
            {/* Life Hours */}
            <div className="card p-4 space-y-1">
              <div className="text-xs text-muted flex items-center gap-1.5">
                <Clock size={14} className="text-purple-400" />
                Labor Cost
              </div>
              <div className="text-xl font-extrabold text-purple-300">
                {lifeHours.formatted}
              </div>
              <div className="text-[11px] text-muted">
                {lifeHours.totalDays.toFixed(1)} whole working shifts
              </div>
            </div>

            {/* Income Share */}
            <div className="card p-4 space-y-1">
              <div className="text-xs text-muted flex items-center gap-1.5">
                <Zap size={14} className="text-amber-400" />
                Monthly Share
              </div>
              <div className="text-xl font-extrabold text-amber-300">
                {verdictResult.pctOfIncome.toFixed(1)}%
              </div>
              <div className="text-[11px] text-muted">
                of your monthly pay
              </div>
            </div>

            {/* Opportunity Cost */}
            <div className="card p-4 space-y-1">
              <div className="text-xs text-muted flex items-center gap-1.5">
                <Flame size={14} className="text-emerald-400" />
                Wealth Loss (5Y / 10Y)
              </div>
              <div className="text-xl font-extrabold text-emerald-400">
                {formatINR(opportunityCost5Yr)}
              </div>
              <div className="text-[11px] text-muted">
                {formatINR(opportunityCost10Yr)} in 10 yrs @ 12%
              </div>
            </div>
          </div>

          {/* EMI Reality Check Box (if EMI mode) */}
          {paymentMode === 'emi' && emiCalculation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4 bg-purple-950/20 border-purple-800/40 space-y-3"
            >
              <h4 className="font-bold text-sm text-purple-300 flex items-center gap-2">
                <ShieldCheck size={16} /> EMI Reality Check
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-surface-2">
                  <div className="text-muted">Monthly Outflow</div>
                  <div className="font-bold text-sm text-primary mt-1">₹{emiCalculation.monthlyEMI.toLocaleString('en-IN')}/mo</div>
                  <div className="text-[10px] text-muted">for {emiTenure} months</div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-2">
                  <div className="text-muted">Total Interest + Fees</div>
                  <div className="font-bold text-sm text-rose-400 mt-1">₹{emiCalculation.totalInterest.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-rose-300">Extra money lost</div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-2">
                  <div className="text-muted">Total Price Paid</div>
                  <div className="font-bold text-sm text-primary mt-1">₹{emiCalculation.totalPayment.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-muted">vs ₹{price.toLocaleString('en-IN')} sticker</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 48-Hour Cooling Off List */}
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Hourglass size={16} className="text-amber-400" />
                Active 48-Hour Impulse Cooling Off List
              </h4>
              <span className="badge badge-amber text-[10px]">{coolingList.length} items</span>
            </div>

            {coolingList.length === 0 ? (
              <div className="text-xs text-muted py-4 text-center">
                No items in cooling period. Whenever you feel an impulse, park it here!
              </div>
            ) : (
              <div className="space-y-2">
                {coolingList.map((item) => {
                  const hoursElapsed = Math.floor((Date.now() - item.addedAt) / (1000 * 60 * 60));
                  const hoursRemaining = Math.max(0, item.coolHours - hoursElapsed);
                  const progressPct = Math.min(100, (hoursElapsed / item.coolHours) * 100);

                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-surface-2 border border-border flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold truncate">{item.name}</span>
                          <span className="font-mono font-medium">{formatINR(item.price)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1.5 text-[11px] text-muted">
                          <span>
                            {hoursRemaining > 0 ? (
                              <span className="text-amber-400 font-medium">{hoursRemaining} hours left to cool</span>
                            ) : (
                              <span className="text-emerald-400 font-medium">Cooling complete! Still want it?</span>
                            )}
                          </span>
                          <span>{progressPct.toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full transition-all ${
                              hoursRemaining === 0 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeCoolingItem(item.id)}
                        className="text-muted hover:text-rose-400 p-1.5 rounded-lg transition-colors"
                        title="Dismiss"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
