// ============================================================
// Money Personality Quiz & Behavioral Archetypes
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, CheckCircle2, ArrowRight, RotateCcw, AlertCircle
} from 'lucide-react';
import { useAppState } from '../app/providers';
import type { MoneyPersonality } from '../types';

interface ArchetypeProfile {
  title: string;
  tagline: string;
  emoji: string;
  color: string;
  description: string;
  strengths: string[];
  blindSpots: string[];
  goldenRules: string[];
}

const ARCHETYPES: Record<MoneyPersonality, ArchetypeProfile> = {
  impulse_optimist: {
    title: 'The Impulse Optimist',
    tagline: 'Life is short, experiences matter — but savings lag behind.',
    emoji: '🚀',
    color: '#F97316',
    description:
      'You are generous, optimistic, and believe things always work out. You love treating friends and enjoying life today, but you frequently experience buyer’s remorse and struggle with consistent long-term investing.',
    strengths: ['Abundance mindset', 'Generous and social', 'Decisive and open to novelty'],
    blindSpots: ['Vulnerable to flash sales & EMIs', 'Little emergency cushion', 'Underestimates small daily leaks'],
    goldenRules: [
      'Enforce the 48-Hour Cooling Off Rule on non-essentials.',
      'Automate your SIP on salary day before you can touch it.',
      'Delete saved credit cards from quick-commerce apps.',
    ],
  },
  anxious_saver: {
    title: 'The Anxious Saver',
    tagline: 'Safety first, always — but inflation is quietly eroding your cash.',
    emoji: '🛡️',
    color: '#06B6D4',
    description:
      'You find profound comfort in a fat bank balance. You rarely splurge and feel physical guilt spending money on yourself. However, keeping everything in low-yield savings accounts causes inflation to eat your real purchasing power.',
    strengths: ['Tremendous fiscal discipline', 'Zero debt risk', 'Bulletproof emergency buffer'],
    blindSpots: ['Suffers from cash-hoarding syndrome', 'Spends guiltily on deserved treats', 'Avoids equity compounding out of fear'],
    goldenRules: [
      'Allocate a 10% "Guilt-Free Fun" monthly budget that MUST be spent.',
      'Channel surplus savings from low-interest savings into low-cost index funds.',
      'Recognize that inflation is also an invisible tax.',
    ],
  },
  balanced_builder: {
    title: 'The Balanced Builder',
    tagline: 'The Zen master of cash flow: disciplined yet fulfilled.',
    emoji: '⚖️',
    color: '#10B981',
    description:
      'You have mastered the balance between living well today and building rock-solid wealth for tomorrow. You budget without feeling deprived and invest consistently without obsessing over daily market fluctuations.',
    strengths: ['Clear long-term vision', 'Low emotional spending', 'Steady compound compounding'],
    blindSpots: ['Can become over-complacent', 'May hesitate on career risks that multiply income'],
    goldenRules: [
      'Review your financial goals bi-annually and step-up SIPs with salary hikes.',
      'Protect downside with comprehensive term and health insurance.',
      'Mentor friends and family on your healthy habits.',
    ],
  },
  future_focused: {
    title: 'The Future Focused FIRE Architect',
    tagline: 'Compound interest evangelist — planning retirement at 35.',
    emoji: '📈',
    color: '#8B5CF6',
    description:
      'You track every rupee, optimize tax slabs down to the last rupee, and know your exact net worth down to the paise. You are on track for early financial freedom, but you risk missing out on spontaneous joys in your 20s.',
    strengths: ['High savings rate (40%+)', 'Deep financial literacy', 'Unmatched compounding trajectory'],
    blindSpots: ['Hyper-frugality risking social isolation', 'Analysis paralysis on small purchases'],
    goldenRules: [
      'Remember that your youth and health have diminishing returns with age.',
      'Budget explicitly for memorable life trips and milestone celebrations.',
      'Celebrate journey milestones, not just the final destination.',
    ],
  },
  social_spender: {
    title: 'The Social Spender',
    tagline: 'Generous friend, table-picker, easily swayed by FOMO.',
    emoji: '🥂',
    color: '#EC4899',
    description:
      'Your spending is heavily tethered to peer groups, dining out, lifestyle upgrades, and gifting. You want everyone to have a memorable time, but your bank account bears the brunt of group expectations.',
    strengths: ['Rich social capital', 'Wonderful host and friend', 'Generous spirit'],
    blindSpots: ['Peer pressure and FOMO spending', 'Split-bill friction', 'Lifestyle inflation'],
    goldenRules: [
      'Be honest with friends about budget boundaries without shame.',
      'Suggest budget-friendly gatherings (potlucks, home dinners).',
      'Pay yourself first before funding the weekend plans.',
    ],
  },
  cautious_explorer: {
    title: 'The Cautious Explorer',
    tagline: 'Curious about wealth creation, seeking trusted guidance.',
    emoji: '🧭',
    color: '#EAB308',
    description:
      'You are eager to grow your money and move past simple bank deposits, but the sea of mutual funds, crypto jargon, and tax jargon feels intimidating. With the right roadmap, you will thrive.',
    strengths: ['Willingness to learn', 'Prudent caution against get-rich-quick scams', 'Teachable'],
    blindSpots: ['Procrastination in starting SIPs', 'Overwhelmed by financial options'],
    goldenRules: [
      'Start simple: One Nifty 50 Index Fund via automated monthly SIP.',
      'Ignore daily financial news and noise.',
      'Use WorthIt to track your progress month by month.',
    ],
  },
};

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    archetype: MoneyPersonality;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'You just received a surprise ₹25,000 festive bonus from your employer. What is your immediate instinct?',
    options: [
      { text: 'Book that weekend getaway or buy the gadget on my wishlist!', archetype: 'impulse_optimist' },
      { text: 'Park it immediately into my bank savings account where it is safe.', archetype: 'anxious_saver' },
      { text: 'Split it: 60% into my equity fund, 40% for dinner with family.', archetype: 'balanced_builder' },
      { text: 'Invest 100% into high-growth index funds to accelerate retirement.', archetype: 'future_focused' },
      { text: 'Take all my close friends out for a lavish celebration dinner.', archetype: 'social_spender' },
    ],
  },
  {
    id: 2,
    question: 'How do you honestly feel when looking at your bank account statement?',
    options: [
      { text: 'Anxious! I am terrified money will disappear or an emergency will hit.', archetype: 'anxious_saver' },
      { text: 'A little surprised... "Where did all my money go this month?!"', archetype: 'impulse_optimist' },
      { text: 'Calm and steady. Everything is tracked and within expected bounds.', archetype: 'balanced_builder' },
      { text: 'Excited! I love tracking my net-worth curve climbing month over month.', archetype: 'future_focused' },
      { text: 'Guilty about recent group dinners, shopping, and convenience orders.', archetype: 'social_spender' },
    ],
  },
  {
    id: 3,
    question: 'Your friends suggest an upscale restaurant with ₹3,000/person average bill. What do you do?',
    options: [
      { text: 'Go along happily! You only live once, good food and laughs are worth it.', archetype: 'social_spender' },
      { text: 'Feel uncomfortable, order only a beverage, or make an excuse not to attend.', archetype: 'anxious_saver' },
      { text: 'Check if I have enough in my monthly dining-out allowance before RSVPing.', archetype: 'balanced_builder' },
      { text: 'Suggest a cooler, affordable alternative or invite them home instead.', archetype: 'future_focused' },
      { text: 'Swipe my card and offer to cover the bill or tip generously.', archetype: 'impulse_optimist' },
    ],
  },
  {
    id: 4,
    question: 'What is your primary relationship with investing (SIPs, stocks, mutual funds)?',
    options: [
      { text: 'I have automated SIPs running smoothly aligned to concrete life milestones.', archetype: 'balanced_builder' },
      { text: 'I research Sharpe ratios, alpha, and optimize expense ratios relentlessly.', archetype: 'future_focused' },
      { text: 'I keep most of my cash in fixed deposits or savings — market volatility stresses me.', archetype: 'anxious_saver' },
      { text: 'I keep meaning to start, but I never seem to have surplus left over.', archetype: 'impulse_optimist' },
      { text: 'I want to invest properly, but the overwhelming jargon makes me hesitate.', archetype: 'cautious_explorer' },
    ],
  },
  {
    id: 5,
    question: 'You see an eye-catching item online at 40% discount for only the next 3 hours. You:',
    options: [
      { text: 'Buy it immediately! It’s such an amazing deal, I would regret skipping it.', archetype: 'impulse_optimist' },
      { text: 'Add it to my 48-Hour cooling list; if I still need it in 2 days, I’ll decide.', archetype: 'balanced_builder' },
      { text: 'Calculate the life-hours of labor it costs and skip it.', archetype: 'future_focused' },
      { text: 'Close the browser tab immediately. I hate spending on non-essentials.', archetype: 'anxious_saver' },
      { text: 'Share the link in the group chat to see if any friends are buying it too.', archetype: 'social_spender' },
    ],
  },
  {
    id: 6,
    question: 'If you had to define your ultimate financial dream, it would be:',
    options: [
      { text: 'Complete autonomy — having enough passive income to retire in my 30s or 40s.', archetype: 'future_focused' },
      { text: 'Peace of mind — never having to worry about money or debt again.', archetype: 'anxious_saver' },
      { text: 'Living a rich, fulfilling life with zero financial anxiety and strong savings.', archetype: 'balanced_builder' },
      { text: 'Enjoying life without worrying about spreadsheets, restrictions, or budgets.', archetype: 'impulse_optimist' },
      { text: 'Having the wealth to treat my loved ones and create unforgettable memories.', archetype: 'social_spender' },
    ],
  },
];

export default function MoneyPersonality() {
  const { state, dispatch } = useAppState();

  const [currentStep, setCurrentStep] = useState(0); // 0 to QUESTIONS.length - 1
  const [answers, setAnswers] = useState<Record<number, MoneyPersonality>>({});
  const [finalArchetype, setFinalArchetype] = useState<MoneyPersonality | null>(
    state.quizResult || null
  );

  const handleSelectOption = (archetype: MoneyPersonality) => {
    const updated = { ...answers, [currentStep]: archetype };
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate winner
      const counts: Record<string, number> = {};
      Object.values(updated).forEach((a) => {
        counts[a] = (counts[a] || 0) + 1;
      });

      let topArchetype: MoneyPersonality = 'balanced_builder';
      let maxCount = 0;
      Object.entries(counts).forEach(([k, v]) => {
        if (v > maxCount) {
          maxCount = v;
          topArchetype = k as MoneyPersonality;
        }
      });

      setFinalArchetype(topArchetype);
      dispatch({ type: 'SET_QUIZ_RESULT', payload: topArchetype });
      dispatch({ type: 'UNLOCK_BADGE', payload: 'badge_self_aware' });
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentStep(0);
    setFinalArchetype(null);
  };

  const activeProfile = finalArchetype ? ARCHETYPES[finalArchetype] : null;

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2">
          <span className="badge badge-purple">Behavioral Fintech</span>
          <span className="badge badge-amber">Psychology of Money</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Money Personality Archetype</h1>
        <p className="text-muted text-sm max-w-xl mx-auto">
          Money is 20% math and 80% behavior. Discover your personal archetype to unlock tailored wealth habits.
        </p>
      </div>

      {!finalArchetype ? (
        /* Quiz Interface */
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="card p-6 md:p-8 space-y-6"
        >
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted">
              <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
              <span>{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}% Complete</span>
            </div>
            <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <h2 className="text-lg md:text-xl font-bold text-primary leading-snug">
            {QUESTIONS[currentStep].question}
          </h2>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {QUESTIONS[currentStep].options.map((option, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectOption(option.archetype)}
                className="w-full p-4 rounded-xl text-left bg-surface-2 border border-border hover:border-purple-500/60 hover:bg-purple-950/20 transition-all text-sm font-medium flex items-center justify-between group"
              >
                <span>{option.text}</span>
                <ArrowRight size={16} className="text-muted group-hover:text-purple-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-3" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      ) : (
        /* Results View */
        activeProfile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Hero Result Card */}
            <div
              className="card p-8 border text-center space-y-4 relative overflow-hidden"
              style={{ borderColor: activeProfile.color + '50' }}
            >
              <div className="text-5xl">{activeProfile.emoji}</div>
              <div>
                <span className="badge text-xs px-3 py-1" style={{ background: activeProfile.color + '25', color: activeProfile.color }}>
                  YOUR DOMINANT ARCHETYPE
                </span>
                <h2 className="text-3xl font-black text-primary mt-2">{activeProfile.title}</h2>
                <p className="text-sm text-muted italic mt-1">"{activeProfile.tagline}"</p>
              </div>
              <p className="text-sm text-primary max-w-2xl mx-auto leading-relaxed">
                {activeProfile.description}
              </p>
            </div>

            {/* Strengths & Blind Spots */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* Strengths */}
              <div className="card p-5 space-y-3 bg-emerald-950/20 border-emerald-800/40">
                <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 size={16} /> Superpowers & Strengths
                </h4>
                <div className="space-y-2 text-xs">
                  {activeProfile.strengths.map((str, i) => (
                    <div key={i} className="flex items-start gap-2 text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blind Spots */}
              <div className="card p-5 space-y-3 bg-rose-950/20 border-rose-800/40">
                <h4 className="font-bold text-sm text-rose-400 flex items-center gap-2">
                  <AlertCircle size={16} /> Hidden Financial Blind Spots
                </h4>
                <div className="space-y-2 text-xs">
                  {activeProfile.blindSpots.map((spot, i) => (
                    <div key={i} className="flex items-start gap-2 text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 mt-1.5" />
                      <span>{spot}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Golden Rules */}
            <div className="card p-6 space-y-4">
              <h4 className="font-bold text-base text-primary flex items-center gap-2">
                <Sparkles size={18} className="text-purple-400" />
                Tailored Wealth Action Protocol
              </h4>
              <div className="space-y-3 text-sm">
                {activeProfile.goldenRules.map((rule, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-surface-2 border border-border flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-primary">{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Retake Button */}
            <div className="text-center pt-2">
              <button
                onClick={handleRetake}
                className="btn btn-secondary text-xs inline-flex items-center gap-2"
              >
                <RotateCcw size={14} /> Retake Quiz
              </button>
            </div>
          </motion.div>
        )
      )}
    </div>
  );
}
