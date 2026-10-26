// ============================================================
// Tax Savings & Regime Comparison Engine (FY 2026-27 / Latest)
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Receipt, PiggyBank, Clock
} from 'lucide-react';
import { useAppState } from '../app/providers';
import { formatINR } from '../lib/finance/calculations';
import { amountToLifeHours } from '../lib/finance/life-hours';

export default function TaxSavings() {
  const { state } = useAppState();
  const defaultAnnualSalary = (state.preferences.monthlyIncome || 30000) * 12;

  // Inputs
  const [grossSalary, setGrossSalary] = useState(defaultAnnualSalary > 400000 ? defaultAnnualSalary : 750000);
  const [basicSalary, setBasicSalary] = useState(Math.round(grossSalary * 0.5));
  const [rentPaidAnnual, setRentPaidAnnual] = useState(120000); // 10k/mo
  const [isMetro, setIsMetro] = useState(true);
  const [section80C, setSection80C] = useState(150000); // ELSS, PF, PPF
  const [section80D, setSection80D] = useState(25000); // Health Insurance
  const [sectionNPS, setSectionNPS] = useState(50000); // 80CCD(1B)

  const lifeHoursConfig = {
    monthlyIncome: Math.round(grossSalary / 12),
    workingDaysPerMonth: state.preferences.workingDaysPerMonth || 22,
    workingHoursPerDay: state.preferences.workingHoursPerDay || 8,
  };

  // Tax computation logic
  const taxResults = useMemo(() => {
    // ---- 1. NEW REGIME (Budget 2024 / FY 2025-27 standard deduction ₹75,000) ----
    const newStdDeduction = 75000;
    const newTaxableIncome = Math.max(0, grossSalary - newStdDeduction);

    let newTax = 0;
    if (newTaxableIncome <= 300000) {
      newTax = 0;
    } else if (newTaxableIncome <= 700000) {
      newTax = (newTaxableIncome - 300000) * 0.05;
    } else if (newTaxableIncome <= 1000000) {
      newTax = 400000 * 0.05 + (newTaxableIncome - 700000) * 0.10;
    } else if (newTaxableIncome <= 1200000) {
      newTax = 400000 * 0.05 + 300000 * 0.10 + (newTaxableIncome - 1000000) * 0.15;
    } else if (newTaxableIncome <= 1500000) {
      newTax = 400000 * 0.05 + 300000 * 0.10 + 200000 * 0.15 + (newTaxableIncome - 1200000) * 0.20;
    } else {
      newTax =
        400000 * 0.05 +
        300000 * 0.10 +
        200000 * 0.15 +
        300000 * 0.20 +
        (newTaxableIncome - 1500000) * 0.30;
    }

    // Section 87A rebate under New Regime (Full rebate if taxable income <= ₹7,00,000, effective income up to ₹7.75L with std deduction)
    if (newTaxableIncome <= 700000) {
      newTax = 0;
    }
    const newCess = newTax * 0.04;
    const totalNewTax = Math.round(newTax + newCess);

    // ---- 2. OLD REGIME ----
    const oldStdDeduction = 50000;

    // HRA Exemption: Min of:
    // a) Actual HRA received (~40% of basic usually)
    // b) Rent paid - 10% of basic
    // c) 50% basic (metro) or 40% basic (non-metro)
    const hraReceived = Math.round(basicSalary * 0.4);
    const rentMinusTenPct = Math.max(0, rentPaidAnnual - basicSalary * 0.1);
    const metroCap = basicSalary * (isMetro ? 0.5 : 0.4);
    const hraExemption = Math.min(hraReceived, rentMinusTenPct, metroCap);

    const capped80C = Math.min(150000, section80C);
    const capped80D = Math.min(50000, section80D);
    const cappedNPS = Math.min(50000, sectionNPS);

    const totalOldDeductions =
      oldStdDeduction + hraExemption + capped80C + capped80D + cappedNPS;
    const oldTaxableIncome = Math.max(0, grossSalary - totalOldDeductions);

    let oldTax = 0;
    if (oldTaxableIncome <= 250000) {
      oldTax = 0;
    } else if (oldTaxableIncome <= 500000) {
      oldTax = (oldTaxableIncome - 250000) * 0.05;
    } else if (oldTaxableIncome <= 1000000) {
      oldTax = 250000 * 0.05 + (oldTaxableIncome - 500000) * 0.20;
    } else {
      oldTax = 250000 * 0.05 + 500000 * 0.20 + (oldTaxableIncome - 1000000) * 0.30;
    }

    // Section 87A rebate under Old Regime (if taxable income <= ₹5,00,000)
    if (oldTaxableIncome <= 500000) {
      oldTax = 0;
    }
    const oldCess = oldTax * 0.04;
    const totalOldTax = Math.round(oldTax + oldCess);

    const difference = Math.abs(totalNewTax - totalOldTax);
    const winner = totalNewTax <= totalOldTax ? 'NEW' : 'OLD';

    return {
      totalNewTax,
      totalOldTax,
      difference,
      winner,
      newTaxableIncome,
      oldTaxableIncome,
      totalOldDeductions,
      hraExemption,
    };
  }, [grossSalary, basicSalary, rentPaidAnnual, isMetro, section80C, section80D, sectionNPS]);

  const bestTax = taxResults.winner === 'NEW' ? taxResults.totalNewTax : taxResults.totalOldTax;
  const taxHours = amountToLifeHours(bestTax, lifeHoursConfig);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="badge badge-purple">Budget 2024-2027 Calibrated</span>
          <span className="badge badge-green">Zero-Jargon Tax Optimization</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1">Tax Savings & Regime Comparator</h1>
        <p className="text-muted text-sm mt-1">
          Stop guessing which tax regime saves you more money. Compare the New vs Old Regime side-by-side.
        </p>
      </div>

      {/* Recommendation Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
          taxResults.winner === 'NEW'
            ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-100'
            : 'bg-purple-950/30 border-purple-500/50 text-purple-100'
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="badge badge-green text-xs font-bold">RECOMMENDED CHOICE</span>
            <span className="text-xs opacity-80">Based on your current salary and deductions</span>
          </div>
          <h2 className="text-2xl font-black text-primary">
            Choose the {taxResults.winner === 'NEW' ? 'NEW Tax Regime' : 'OLD Tax Regime'}
          </h2>
          <p className="text-xs opacity-90 max-w-xl">
            {taxResults.winner === 'NEW'
              ? `You will save ${formatINR(taxResults.difference)} every year under the New Regime! Plus, you don't have to lock up ₹1.5L into 3-year lock-in ELSS funds or submit paper receipts.`
              : `You will save ${formatINR(taxResults.difference)} every year under the Old Regime thanks to your high HRA and Section 80 deductions.`}
          </p>
        </div>
        <div className="text-center md:text-right flex-shrink-0">
          <div className="text-xs text-muted">Annual Tax Savings</div>
          <div className="text-3xl font-black text-emerald-400 mt-1">
            {formatINR(taxResults.difference)}
          </div>
          <div className="text-[11px] text-muted">money kept in your bank account</div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Salary & Deductions Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="card space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2 text-primary">
              <Receipt size={18} className="text-purple-400" />
              Annual Income Details
            </h3>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted">Gross Annual Salary (CTC)</span>
                <span className="font-semibold text-purple-300">{formatINR(grossSalary)}/yr</span>
              </div>
              <input
                type="range"
                min={300000}
                max={3000000}
                step={25000}
                value={grossSalary}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setGrossSalary(val);
                  setBasicSalary(Math.round(val * 0.5));
                }}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-[10px] text-muted mt-1">
                <span>₹3L (Zero Tax)</span>
                <span>₹7.75L (Zero Tax in New)</span>
                <span>₹15L</span>
                <span>₹30L</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="label text-xs">Annual Basic Salary</label>
                <input
                  type="number"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(Number(e.target.value))}
                  className="input text-xs"
                />
              </div>
              <div>
                <label className="label text-xs">Annual Rent Paid</label>
                <input
                  type="number"
                  value={rentPaidAnnual}
                  onChange={(e) => setRentPaidAnnual(Number(e.target.value))}
                  className="input text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-muted">Metro City (Mumbai, Delhi, Kolkata, Chennai)</span>
              <button
                type="button"
                onClick={() => setIsMetro(!isMetro)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                  isMetro ? 'bg-purple-900/40 border-purple-500 text-purple-300' : 'bg-surface-2 border-border text-muted'
                }`}
              >
                {isMetro ? 'Metro (50% HRA)' : 'Non-Metro (40% HRA)'}
              </button>
            </div>
          </div>

          {/* Old Regime Deductions Card */}
          <div className="card space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2 text-primary">
              <PiggyBank size={18} className="text-emerald-400" />
              Old Regime Deductions (Section 80)
            </h3>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted">Section 80C (ELSS, PF, PPF, Life Ins.)</span>
                <span className="font-semibold text-emerald-400">{formatINR(section80C)} (Max 1.5L)</span>
              </div>
              <input
                type="range"
                min={0}
                max={150000}
                step={5000}
                value={section80C}
                onChange={(e) => setSection80C(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted">Section 80D (Health Insurance Premium)</span>
                <span className="font-semibold text-emerald-400">{formatINR(section80D)} (Max 50k)</span>
              </div>
              <input
                type="range"
                min={0}
                max={50000}
                step={2500}
                value={section80D}
                onChange={(e) => setSection80D(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted">Section 80CCD(1B) (NPS National Pension)</span>
                <span className="font-semibold text-emerald-400">{formatINR(sectionNPS)} (Max 50k)</span>
              </div>
              <input
                type="range"
                min={0}
                max={50000}
                step={2500}
                value={sectionNPS}
                onChange={(e) => setSectionNPS(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* New Regime Card */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                taxResults.winner === 'NEW'
                  ? 'bg-purple-950/30 border-purple-500 shadow-lg shadow-purple-900/20'
                  : 'bg-card border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-primary">New Tax Regime</span>
                {taxResults.winner === 'NEW' && <span className="badge badge-green text-[10px]">WINNER</span>}
              </div>
              <div className="text-2xl font-black text-purple-400 mt-3">
                {formatINR(taxResults.totalNewTax)}
              </div>
              <div className="text-xs text-muted">Total annual tax payable</div>

              <div className="mt-4 pt-4 border-t border-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Standard Deduction:</span>
                  <span className="text-primary font-mono">₹75,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Net Taxable Income:</span>
                  <span className="text-primary font-mono">{formatINR(taxResults.newTaxableIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Paperwork / Receipts:</span>
                  <span className="text-emerald-400 font-semibold">Zero Proofs Needed</span>
                </div>
              </div>
            </div>

            {/* Old Regime Card */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                taxResults.winner === 'OLD'
                  ? 'bg-purple-950/30 border-purple-500 shadow-lg shadow-purple-900/20'
                  : 'bg-card border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-primary">Old Tax Regime</span>
                {taxResults.winner === 'OLD' && <span className="badge badge-green text-[10px]">WINNER</span>}
              </div>
              <div className="text-2xl font-black text-amber-400 mt-3">
                {formatINR(taxResults.totalOldTax)}
              </div>
              <div className="text-xs text-muted">Total annual tax payable</div>

              <div className="mt-4 pt-4 border-t border-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Total Deductions:</span>
                  <span className="text-primary font-mono">{formatINR(taxResults.totalOldDeductions)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">HRA Exemption:</span>
                  <span className="text-primary font-mono">{formatINR(taxResults.hraExemption)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">80C + 80D + NPS:</span>
                  <span className="text-primary font-mono">{formatINR(section80C + section80D + sectionNPS)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Labor Time Lost to Tax */}
          <div className="card p-4 space-y-2 bg-surface-2 border-border">
            <div className="text-xs text-muted flex items-center gap-1.5">
              <Clock size={14} className="text-amber-400" />
              Tax Labor Reality Check
            </div>
            <div className="text-sm text-primary leading-relaxed">
              At your current earnings, paying <strong className="text-purple-300">{formatINR(bestTax)}</strong> in annual tax means you work{' '}
              <strong className="text-amber-400">{taxHours.formatted}</strong> ({taxHours.totalDays.toFixed(1)} full work days) purely for the tax department before you earn a single rupee for yourself!
            </div>
          </div>

          {/* New Regime Slabs Reference */}
          <div className="card p-4 space-y-3">
            <h4 className="font-bold text-xs text-muted uppercase tracking-wider">
              New Regime Slab Rates (FY 2024-25 / FY 2025-27)
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted">Up to ₹3,00,000</span>
                <span className="font-medium text-emerald-400">Nil (0%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted">₹3,00,001 - ₹7,00,000</span>
                <span className="font-medium text-primary">5% (Full 87A rebate)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted">₹7,00,001 - ₹10,00,000</span>
                <span className="font-medium text-primary">10%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted">₹10,00,001 - ₹12,00,000</span>
                <span className="font-medium text-primary">15%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Above ₹15,00,000</span>
                <span className="font-medium text-rose-400">30%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
