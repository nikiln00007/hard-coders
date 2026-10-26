// ============================================================
// Life-Hours Converter Page
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAppState } from '../app/providers';
import { amountToLifeHours, calculateHourlyRate } from '../lib/finance/life-hours';
import { formatINR } from '../lib/finance/calculations';

const EXAMPLE_ITEMS = [
  { name: 'Chai', price: 20 },
  { name: 'Movie ticket', price: 350 },
  { name: 'Shoes', price: 899 },
  { name: 'Wireless earbuds', price: 1499 },
  { name: 'Smartwatch', price: 3999 },
  { name: 'Online course', price: 4999 },
  { name: 'Smartphone', price: 15999 },
  { name: 'Laptop', price: 45000 },
  { name: 'Bike', price: 85000 },
  { name: 'Used Car', price: 350000 },
];

export default function LifeHours() {
  const { state, dispatch, lifeHoursConfig } = useAppState();
  const { preferences } = state;

  const [purchasePrice, setPurchasePrice] = useState<number>(899);
  const [compareItems, setCompareItems] = useState<{ name: string; price: number }[]>([
    { name: 'Shoes', price: 899 },
    { name: 'Phone', price: 15999 },
  ]);

  const hourlyRate = useMemo(() => calculateHourlyRate(lifeHoursConfig), [lifeHoursConfig]);
  const result = useMemo(() => amountToLifeHours(purchasePrice, lifeHoursConfig), [purchasePrice, lifeHoursConfig]);

  const handleIncomeChange = (val: number) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: { monthlyIncome: val } });
  };
  const handleDaysChange = (val: number) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: { workingDaysPerMonth: val } });
  };
  const handleHoursChange = (val: number) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: { workingHoursPerDay: val } });
  };

  const addCompareItem = (name: string, price: number) => {
    if (!compareItems.find(c => c.price === price && c.name === name)) {
      setCompareItems([...compareItems, { name, price }]);
    }
  };

  const removeCompareItem = (index: number) => {
    setCompareItems(compareItems.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Life-Hours Converter</h1>
        <p className="text-muted text-sm mt-1">See how much of your working life a purchase really costs.</p>
      </div>

      {/* Income Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <h3 className="font-semibold mb-4">Your Earnings Profile</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Monthly Income</label>
            <input
              type="number"
              className="input"
              value={preferences.monthlyIncome}
              onChange={(e) => handleIncomeChange(Number(e.target.value))}
              min={0}
            />
          </div>
          <div>
            <label className="label">Working Days / Month</label>
            <input
              type="number"
              className="input"
              value={preferences.workingDaysPerMonth}
              onChange={(e) => handleDaysChange(Number(e.target.value))}
              min={1}
              max={31}
            />
          </div>
          <div>
            <label className="label">Working Hours / Day</label>
            <input
              type="number"
              className="input"
              value={preferences.workingHoursPerDay}
              onChange={(e) => handleHoursChange(Number(e.target.value))}
              min={1}
              max={24}
            />
          </div>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-violet/10 border border-violet/20">
          <p className="text-sm">
            Your hourly rate: <span className="font-bold text-violet-bright tabular-nums">{formatINR(Math.round(hourlyRate))}/hr</span>
          </p>
        </div>
      </motion.div>

      {/* Converter */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
        <h3 className="font-semibold mb-4">Convert a Purchase</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1 w-full">
            <label className="label">Purchase Price (₹)</label>
            <input
              type="number"
              className="input text-xl font-bold"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              min={0}
              placeholder="Enter amount..."
            />
          </div>
          <div className="flex items-center pt-6">
            <ArrowRight size={24} className="text-muted hidden sm:block" />
          </div>
          <div className="flex-1 w-full p-4 rounded-xl bg-violet/10 border border-violet/20">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Time Cost</p>
            {hourlyRate > 0 ? (
              <>
                <p className="text-3xl font-bold text-violet-bright tabular-nums">
                  {result.formatted}
                </p>
                <p className="text-sm text-muted mt-2">
                  {formatINR(purchasePrice)} = {result.totalHours.toFixed(1)} working hours
                  ({result.totalDays.toFixed(1)} working days)
                </p>
              </>
            ) : (
              <p className="text-sm text-warning">Set your income and working hours to see the conversion.</p>
            )}
          </div>
        </div>

        {/* Visual bar */}
        {hourlyRate > 0 && purchasePrice > 0 && (
          <div className="mt-6">
            <p className="text-xs text-muted mb-2">Time-cost visualization (max 8 hours = 1 work day)</p>
            <div className="h-8 rounded-lg overflow-hidden bg-surface-3 relative">
              <motion.div
                className="h-full rounded-lg bg-gradient-to-r from-violet to-violet-bright"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (result.totalHours / 8) * 100)}%` }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                {result.totalHours <= 8
                  ? `${result.formatted} of an 8-hour day`
                  : `${result.totalDays.toFixed(1)} full work days`}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Example Items */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
        <h3 className="font-semibold mb-4">Common Purchases</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {EXAMPLE_ITEMS.map((item) => {
            const lh = amountToLifeHours(item.price, lifeHoursConfig);
            return (
              <button
                key={item.name}
                onClick={() => {
                  setPurchasePrice(item.price);
                  addCompareItem(item.name, item.price);
                }}
                className="p-3 rounded-xl border border-border text-left hover:border-violet/50 transition-all group"
              >
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="text-xs text-muted tabular-nums">{formatINR(item.price)}</p>
                <p className="text-xs text-violet-bright mt-1 tabular-nums font-medium">
                  ⏱ {lh.formattedShort}
                </p>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Comparison */}
      {compareItems.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
          <h3 className="font-semibold mb-4">Compare Purchases</h3>
          <div className="space-y-3">
            {compareItems.map((item, i) => {
              const lh = amountToLifeHours(item.price, lifeHoursConfig);
              const maxHours = Math.max(...compareItems.map(c => amountToLifeHours(c.price, lifeHoursConfig).totalHours));
              return (
                <div key={i} className="flex items-center gap-3">
                  <button onClick={() => removeCompareItem(i)} className="text-xs text-error hover:text-error/80">✕</button>
                  <div className="w-24 text-sm font-medium truncate">{item.name}</div>
                  <div className="flex-1">
                    <div className="h-6 rounded-md overflow-hidden bg-surface-3 relative">
                      <motion.div
                        className="h-full rounded-md bg-gradient-to-r from-violet to-violet-bright"
                        initial={{ width: 0 }}
                        animate={{ width: `${maxHours > 0 ? (lh.totalHours / maxHours) * 100 : 0}%` }}
                        transition={{ duration: 0.5 }}
                      />
                      <span className="absolute inset-0 flex items-center px-2 text-xs font-medium text-white">
                        {lh.formatted}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-muted tabular-nums w-20 text-right">{formatINR(item.price)}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
