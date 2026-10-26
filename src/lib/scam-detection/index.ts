// ============================================================
// Scam Detection Rule Engine
// ============================================================
import type { ScamFlag, ScamAnalysisResult, RiskLevel } from '../../types';

interface DetectionRule {
  name: string;
  description: string;
  weight: number;
  detect: (text: string) => string | null; // returns evidence snippet or null
}

const DETECTION_RULES: DetectionRule[] = [
  {
    name: 'UPI PIN Request',
    description: 'Asks for your UPI PIN — legitimate services never request this',
    weight: 30,
    detect: (text) => {
      const match = text.match(/(?:enter|share|send|provide|give|tell).{0,30}(?:upi\s*pin|mpin)/i);
      return match ? match[0] : null;
    },
  },
  {
    name: 'OTP Request',
    description: 'Asks for OTP — banks and services never ask you to share OTPs',
    weight: 25,
    detect: (text) => {
      const match = text.match(/(?:share|send|enter|provide|give|tell|forward).{0,30}(?:otp|one.time.password|verification.code)/i);
      return match ? match[0] : null;
    },
  },
  {
    name: 'KYC Suspension Threat',
    description: 'Fake KYC alert threatening account suspension',
    weight: 20,
    detect: (text) => {
      const match = text.match(/(?:kyc|account).{0,40}(?:suspend|block|deactivat|freez|close|expire)/i);
      return match ? match[0] : null;
    },
  },
  {
    name: 'Pay to Receive Money',
    description: 'Asks you to pay money to receive money — classic scam pattern',
    weight: 30,
    detect: (text) => {
      const match = text.match(/(?:pay|send|transfer).{0,50}(?:receiv|get|claim|collect|credit)/i) ||
        text.match(/(?:receiv|collect|claim).{0,50}(?:pay|send|transfer)/i);
      return match ? match[0] : null;
    },
  },
  {
    name: 'Guaranteed Returns',
    description: 'Promises guaranteed high returns — legitimate investments carry risk',
    weight: 20,
    detect: (text) => {
      const match = text.match(/(?:guaranteed|assured|fixed|certain).{0,30}(?:return|profit|earning|income|double|triple)/i);
      return match ? match[0] : null;
    },
  },
  {
    name: 'Urgent Action Required',
    description: 'Creates false urgency to pressure immediate action',
    weight: 15,
    detect: (text) => {
      const match = text.match(/(?:urgent|immediate|within\s*\d+\s*(?:hour|min|hr)|last\s*chance|act\s*now|expire\s*(?:today|soon)|hurry)/i);
      return match ? match[0] : null;
    },
  },
  {
    name: 'Suspicious Link',
    description: 'Contains suspicious URL that may be a phishing attempt',
    weight: 15,
    detect: (text) => {
      const match = text.match(/(?:https?:\/\/)?(?:bit\.ly|tinyurl|goo\.gl|t\.co|rb\.gy|is\.gd|cutt\.ly|shorturl|click\.here|verify\.now|update\.now)/i) ||
        text.match(/(?:https?:\/\/)?[\w-]+\.(?:xyz|top|club|win|info|work|click|loan|buzz|site|online|live)\b/i);
      return match ? match[0] : null;
    },
  },
  {
    name: 'Lottery/Prize Scam',
    description: 'Claims you won a prize or lottery you did not enter',
    weight: 25,
    detect: (text) => {
      const match = text.match(/(?:congratulat|you.{0,10}won|winner|prize|lottery|lucky\s*draw|reward\s*of|jackpot|bumper)/i);
      return match ? match[0] : null;
    },
  },
  {
    name: 'Loan Processing Fee',
    description: 'Asks for upfront fees to process a loan — legitimate lenders deduct from disbursement',
    weight: 20,
    detect: (text) => {
      const match = text.match(/(?:processing\s*fee|advance\s*fee|registration\s*fee|insurance\s*fee).{0,40}(?:pay|transfer|send|deposit)/i) ||
        text.match(/(?:pay|transfer|send|deposit).{0,40}(?:processing\s*fee|advance\s*fee|registration\s*fee)/i);
      return match ? match[0] : null;
    },
  },
  {
    name: 'Bank/Govt Impersonation',
    description: 'Impersonates a bank or government agency',
    weight: 15,
    detect: (text) => {
      const match = text.match(/(?:rbi|reserve\s*bank|income\s*tax|it\s*department|sbi|hdfc|icici|axis|kotak).{0,30}(?:alert|notice|warning|important|verify)/i);
      return match ? match[0] : null;
    },
  },
  {
    name: 'APK/App Install Request',
    description: 'Asks to install unknown apps — could contain malware',
    weight: 20,
    detect: (text) => {
      const match = text.match(/(?:install|download|update).{0,30}(?:\.apk|app|application|software)/i);
      return match ? match[0] : null;
    },
  },
  {
    name: 'Password Request',
    description: 'Asks for banking passwords or credentials',
    weight: 30,
    detect: (text) => {
      const match = text.match(/(?:share|send|enter|provide|give).{0,30}(?:password|passcode|credential|login|cvv|card\s*number|account\s*number)/i);
      return match ? match[0] : null;
    },
  },
  {
    name: 'Collect Request Warning',
    description: 'Mentions UPI collect request — scammers send collect requests disguised as refunds',
    weight: 15,
    detect: (text) => {
      const match = text.match(/(?:collect|payment)\s*request.{0,40}(?:accept|approve|confirm)/i) ||
        text.match(/(?:refund|cashback).{0,30}(?:collect|accept|approve)/i);
      return match ? match[0] : null;
    },
  },
  {
    name: 'Job/Task Payment Scam',
    description: 'Offers easy money for simple tasks like rating or reviewing',
    weight: 20,
    detect: (text) => {
      const match = text.match(/(?:earn|make|get).{0,20}(?:₹|rs|inr|rupee).{0,20}(?:per\s*(?:day|hour|task|review|click|like)|daily|easily)/i) ||
        text.match(/(?:work\s*from\s*home|part\s*time|freelance).{0,30}(?:₹|rs|inr).{0,10}\d+/i);
      return match ? match[0] : null;
    },
  },
];

/**
 * Analyze a message for scam indicators
 */
export function analyzeScamMessage(message: string): ScamAnalysisResult {
  if (!message.trim()) {
    return {
      riskLevel: 'low',
      riskScore: 0,
      flags: [],
      recommendations: ['Enter a message to analyze.'],
      safetyChecklist: getDefaultSafetyChecklist(),
    };
  }

  const flags: ScamFlag[] = [];
  let totalWeight = 0;

  for (const rule of DETECTION_RULES) {
    const evidence = rule.detect(message);
    if (evidence) {
      flags.push({
        pattern: rule.name,
        description: rule.description,
        evidence,
        weight: rule.weight,
      });
      totalWeight += rule.weight;
    }
  }

  // Calculate risk score (0-100), capped
  const riskScore = Math.min(100, totalWeight);

  // Determine risk level
  let riskLevel: RiskLevel;
  if (riskScore >= 70) riskLevel = 'critical';
  else if (riskScore >= 45) riskLevel = 'high';
  else if (riskScore >= 20) riskLevel = 'medium';
  else riskLevel = 'low';

  const recommendations = generateRecommendations(flags, riskLevel);
  const safetyChecklist = getDefaultSafetyChecklist();

  return {
    riskLevel,
    riskScore,
    flags,
    recommendations,
    safetyChecklist,
  };
}

function generateRecommendations(flags: ScamFlag[], riskLevel: RiskLevel): string[] {
  const recommendations: string[] = [];

  if (riskLevel === 'critical' || riskLevel === 'high') {
    recommendations.push('Do NOT respond to this message or click any links.');
    recommendations.push('Do NOT share any personal, banking, or financial information.');
    recommendations.push('Block the sender immediately.');
    recommendations.push('Report this to the Cyber Crime helpline (1930) or cybercrime.gov.in.');
  } else if (riskLevel === 'medium') {
    recommendations.push('Be cautious — verify the sender through official channels before taking action.');
    recommendations.push('Do not click any links in the message.');
    recommendations.push('Contact your bank directly using the number on their official website or your card.');
  } else {
    recommendations.push('This message appears relatively safe, but always stay vigilant.');
    recommendations.push('A low risk score does not guarantee the message is safe.');
  }

  if (flags.some(f => f.pattern.includes('UPI') || f.pattern.includes('OTP') || f.pattern.includes('Password'))) {
    recommendations.push('Remember: No legitimate service will ever ask for your UPI PIN, OTP, or password.');
  }

  return recommendations;
}

function getDefaultSafetyChecklist(): string[] {
  return [
    'Never share your UPI PIN with anyone',
    'Never share OTPs received on your phone',
    'Never approve unexpected UPI collect requests',
    'Never install APK files from unknown sources',
    'Verify bank messages through official bank apps/websites',
    'Report suspicious calls/messages to 1930 (Cyber Crime)',
    'Use only official app stores to download banking apps',
  ];
}

// Pre-built sample messages for demo
export const SAMPLE_SCAM_MESSAGES = [
  {
    label: '🏦 Fake KYC Alert',
    text: 'URGENT: Your SBI account will be suspended within 24 hours due to incomplete KYC. Click here to verify now: http://sbi-kyc-update.xyz/verify. Enter your account number and OTP to continue.',
  },
  {
    label: '🎁 Lottery Scam',
    text: 'Congratulations! You have won ₹50,00,000 in the Jio Lucky Draw 2026! To claim your prize, pay a processing fee of ₹4,999 to UPI ID: lottery_claim@ybl. Hurry, offer expires today!',
  },
  {
    label: '💼 Job Scam',
    text: 'Hi! Earn ₹5000-₹15000 per day from home! Just rate products on Amazon and get paid instantly. No experience needed. Send ₹500 registration fee to start. WhatsApp: +91-98765XXXXX',
  },
  {
    label: '💰 Loan Processing Fee',
    text: 'Your personal loan of ₹5,00,000 has been approved at 0% interest! Pay the processing fee of ₹3,500 to activate. Transfer to: loanprocess@paytm. Act within 2 hours.',
  },
  {
    label: '✅ Safe Transaction SMS',
    text: 'INR 450.00 debited from A/c XXXX1234 at SWIGGY on 25-10-2026. Avl Bal: INR 15,230.50. If not done by you, call 1800-XXX-XXXX.',
  },
];
