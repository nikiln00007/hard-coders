// ============================================================
// Settings & Profile Management Page
// ============================================================
import { useState } from 'react';
import {
  User, Globe, Moon, Sun,
  Award, RotateCcw, Download, Upload, CheckCircle2,
  Shield
} from 'lucide-react';
import { useAppState, usePreferences } from '../app/providers';
import { calculateHourlyRate } from '../lib/finance/life-hours';
import { exportAppStateAsJSON, importAppStateFromJSON } from '../lib/storage';

export default function Settings() {
  const { state, dispatch } = useAppState();
  const { preferences, updatePreferences } = usePreferences();

  const [income, setIncome] = useState(preferences.monthlyIncome || 30000);
  const [days, setDays] = useState(preferences.workingDaysPerMonth || 22);
  const [hours, setHours] = useState(preferences.workingHoursPerDay || 8);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const hourlyRate = calculateHourlyRate({
    monthlyIncome: income,
    workingDaysPerMonth: days,
    workingHoursPerDay: hours,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      monthlyIncome: income,
      workingDaysPerMonth: days,
      workingHoursPerDay: hours,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDemo = () => {
    if (confirm('Reset everything to Priya Sharma’s demo portfolio? Any custom changes will be replaced.')) {
      dispatch({ type: 'RESET_DEMO' });
      setIncome(30000);
      setDays(22);
      setHours(8);
    }
  };

  const handleExportJSON = () => {
    const jsonStr = exportAppStateAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `worthit-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importAppStateFromJSON(content);
      if (success) {
        window.location.reload();
      } else {
        alert('Invalid backup file. Could not restore data.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="badge badge-purple">Configuration & Privacy</span>
          <span className="badge badge-green">100% Client-Side Local Storage</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1">Preferences & Account</h1>
        <p className="text-muted text-sm mt-1">
          Customize your life-hours baseline, app theme, currency display, and manage your data backups.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Left Column: Earnings & Theme */}
        <div className="md:col-span-7 space-y-6">
          {/* Earnings Profile */}
          <div className="card space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2 text-primary">
              <User size={18} className="text-purple-400" />
              Earnings Profile & Hourly Rate
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="label">Monthly Take-Home Income (₹)</label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="input text-base font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Working Days / Month</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={31}
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="label">Working Hours / Day</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={24}
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="input text-xs"
                  />
                </div>
              </div>

              {/* Computed Hourly Rate Box */}
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/30 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-muted">Your Effective Time Value:</div>
                  <div className="text-lg font-black text-purple-300">
                    ₹{hourlyRate.toFixed(2)} / hour
                  </div>
                </div>
                <div className="text-right text-[11px] text-muted">
                  Total Labor: {days * hours} hrs/mo
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                {savedSuccess ? (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Profile Saved!
                  </span>
                ) : (
                  <span />
                )}
                <button type="submit" className="btn btn-primary text-xs">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Localization & Appearance */}
          <div className="card space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2 text-primary">
              <Globe size={18} className="text-purple-400" />
              Appearance & Localization
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="label">Theme Mode</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updatePreferences({ theme: 'dark' })}
                    className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-1.5 font-medium ${
                      preferences.theme === 'dark'
                        ? 'bg-purple-900/40 border-purple-500 text-purple-300'
                        : 'bg-surface-2 border-border text-muted'
                    }`}
                  >
                    <Moon size={14} /> Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => updatePreferences({ theme: 'light' })}
                    className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-1.5 font-medium ${
                      preferences.theme === 'light'
                        ? 'bg-purple-900/40 border-purple-500 text-purple-300'
                        : 'bg-surface-2 border-border text-muted'
                    }`}
                  >
                    <Sun size={14} /> Light
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Currency Display</label>
                <select
                  value={preferences.currency}
                  onChange={(e) => updatePreferences({ currency: e.target.value })}
                  className="input text-xs"
                >
                  <option value="INR">INR (₹) — Indian Rupee</option>
                  <option value="USD">USD ($) — US Dollar</option>
                  <option value="EUR">EUR (€) — Euro</option>
                  <option value="GBP">GBP (£) — British Pound</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label text-xs">Interface Language</label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिन्दी' },
                  { code: 'ta', label: 'தமிழ்' },
                  { code: 'te', label: 'తెలుగు' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => updatePreferences({ language: lang.code as any })}
                    className={`py-1.5 rounded-lg border text-center transition-all ${
                      preferences.language === lang.code
                        ? 'bg-purple-900/40 border-purple-500 text-purple-300 font-bold'
                        : 'bg-surface-2 border-border text-muted'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Badges & Data Management */}
        <div className="md:col-span-5 space-y-6">
          {/* Gamification Badges */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2 text-primary">
                <Award size={18} className="text-amber-400" />
                Achievements & Badges
              </h3>
              <span className="badge badge-amber text-[10px]">
                {state.gamification.badges.filter((b) => b.unlocked).length} / {state.gamification.badges.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {state.gamification.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                    badge.unlocked
                      ? 'bg-surface-2 border-purple-500/40 text-primary'
                      : 'bg-surface-1/40 border-border/40 opacity-40'
                  }`}
                >
                  <span className="text-xl flex-shrink-0">{badge.icon}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-xs truncate">{badge.name}</div>
                    <div className="text-[10px] text-muted truncate">{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Portability & Demo Reset */}
          <div className="card space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2 text-primary">
              <Shield size={18} className="text-emerald-400" />
              Data Security & Storage
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              All transactions and profile parameters are stored exclusively in your browser’s LocalStorage. No server tracks your financial life.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleExportJSON}
                className="w-full btn btn-secondary text-xs flex items-center justify-center gap-2 py-2"
              >
                <Download size={14} /> Export Backup (JSON)
              </button>

              <label className="w-full btn btn-secondary text-xs flex items-center justify-center gap-2 py-2 cursor-pointer">
                <Upload size={14} /> Import Backup (JSON)
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleResetDemo}
                className="w-full btn btn-secondary text-rose-400 hover:text-rose-300 text-xs flex items-center justify-center gap-2 py-2"
              >
                <RotateCcw size={14} /> Reset Demo Data (Priya Sharma)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
