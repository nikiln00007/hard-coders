// ============================================================
// ScamShield — UPI & Financial Fraud Analyzer
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, AlertTriangle, PhoneCall,
  CheckCircle2, ExternalLink, Sparkles, Copy,
  Check
} from 'lucide-react';
import { analyzeScamMessage, SAMPLE_SCAM_MESSAGES } from '../lib/scam-detection';
import type { ScamAnalysisResult } from '../types';

export default function ScamShield() {
  const [inputText, setInputText] = useState(SAMPLE_SCAM_MESSAGES[0].text);
  const [copied, setCopied] = useState(false);

  // Live scam analysis
  const analysis: ScamAnalysisResult = analyzeScamMessage(inputText);

  const handleCopyHelpline = () => {
    navigator.clipboard.writeText('1930');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return <span className="badge badge-rose text-xs px-2.5 py-1">CRITICAL RISK</span>;
      case 'high':
        return <span className="badge badge-rose text-xs px-2.5 py-1">HIGH RISK</span>;
      case 'medium':
        return <span className="badge badge-amber text-xs px-2.5 py-1">MEDIUM RISK</span>;
      default:
        return <span className="badge badge-green text-xs px-2.5 py-1">LOW RISK (LIKELY SAFE)</span>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="badge badge-rose">Cyber Fraud Defense</span>
          <span className="badge badge-purple">UPI & OTP Security Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1">ScamShield</h1>
        <p className="text-muted text-sm mt-1">
          Paste any suspicious SMS, WhatsApp message, email, or UPI payment link to evaluate fraud risk in real-time.
        </p>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
            <PhoneCall size={20} />
          </div>
          <div>
            <div className="font-bold text-sm text-primary">National Cyber Crime Helpline: 1930</div>
            <div className="text-xs text-muted">
              Report financial fraud within 2 hours to freeze recipient accounts immediately.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleCopyHelpline}
            className="btn btn-secondary text-xs flex items-center gap-1.5 py-1.5"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? 'Copied 1930' : 'Copy 1930'}
          </button>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary text-xs flex items-center gap-1 py-1.5"
          >
            cybercrime.gov.in <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Presets */}
      <div>
        <label className="label text-xs font-semibold mb-2">Try Real-World Examples:</label>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_SCAM_MESSAGES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(sample.text)}
              className="px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-xs hover:border-purple-500/50 hover:bg-surface-3 transition-colors text-muted hover:text-primary font-medium"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <label className="label font-bold text-sm">Suspicious Text or Message</label>
              <button
                onClick={() => setInputText('')}
                className="text-xs text-muted hover:text-rose-400 transition-colors"
              >
                Clear
              </button>
            </div>
            <textarea
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste message here... e.g. 'Your bank account will be blocked today. Click here to verify KYC...'"
              className="input text-sm leading-relaxed font-sans"
            />
            <div className="text-[11px] text-muted flex items-center justify-between">
              <span>Characters: {inputText.length}</span>
              <span className="text-purple-400">Analysis runs locally — 100% private</span>
            </div>
          </div>

          {/* Golden Rules Checklist */}
          <div className="card space-y-3">
            <h4 className="font-bold text-sm text-primary flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              Golden Rules of Digital Safety
            </h4>
            <div className="space-y-2 text-xs">
              {analysis.safetyChecklist.slice(0, 5).map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 text-muted">
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* Risk Score Meter Card */}
          <motion.div
            key={analysis.riskScore}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`card p-6 border ${
              analysis.riskLevel === 'critical'
                ? 'bg-rose-950/30 border-rose-500/50'
                : analysis.riskLevel === 'high'
                ? 'bg-orange-950/30 border-orange-500/50'
                : analysis.riskLevel === 'medium'
                ? 'bg-amber-950/30 border-amber-500/50'
                : 'bg-emerald-950/30 border-emerald-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted">Fraud Threat Evaluation</div>
                <div className="mt-1 flex items-center gap-2">
                  {getRiskBadge(analysis.riskLevel)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black">
                  {analysis.riskScore}
                  <span className="text-base font-normal text-muted">/100</span>
                </div>
                <div className="text-[11px] text-muted">Risk Score</div>
              </div>
            </div>

            {/* Meter Bar */}
            <div className="w-full h-3 bg-background rounded-full overflow-hidden mt-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(5, analysis.riskScore)}%` }}
                className={`h-full rounded-full transition-all duration-500 ${
                  analysis.riskScore >= 70
                    ? 'bg-rose-500'
                    : analysis.riskScore >= 45
                    ? 'bg-orange-500'
                    : analysis.riskScore >= 20
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
            </div>
          </motion.div>

          {/* Detected Red Flags */}
          <div className="card space-y-3">
            <h4 className="font-bold text-sm text-primary flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-400" />
              Detected Red Flags ({analysis.flags.length})
            </h4>

            {analysis.flags.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                No obvious phishing or scam signatures detected in this text. Stay cautious anyway!
              </div>
            ) : (
              <div className="space-y-2.5">
                {analysis.flags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-surface-2 border border-rose-500/20 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-rose-400">{flag.pattern}</span>
                      <span className="badge badge-rose text-[10px]">+{flag.weight} Risk</span>
                    </div>
                    <div className="text-xs text-primary">{flag.description}</div>
                    {flag.evidence && (
                      <div className="text-[11px] font-mono text-muted bg-background/50 px-2 py-1 rounded mt-1 border border-border">
                        Matched: "{flag.evidence}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Recommendations */}
          <div className="card space-y-3">
            <h4 className="font-bold text-sm text-primary flex items-center gap-2">
              <Sparkles size={18} className="text-purple-400" />
              Recommended Immediate Actions
            </h4>
            <div className="space-y-2 text-xs">
              {analysis.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0 mt-1.5" />
                  <span className="text-primary">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
