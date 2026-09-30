import React from 'react';

const CATEGORY_META = {
  toxic: {
    label: 'Toxic',
    description: 'Rude, disrespectful, or unreasonable comment likely to make people leave.',
    barBg: 'bg-rose-500',
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
  },
  severe_toxic: {
    label: 'Severe Toxic',
    description: 'Extremely hateful, aggressive, or damaging language.',
    barBg: 'bg-red-600',
    badgeBg: 'bg-red-950/60 text-red-400 border-red-800/40'
  },
  obscene: {
    label: 'Obscene',
    description: 'Vulgar, profane, or sexually explicit language.',
    barBg: 'bg-amber-500',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  },
  threat: {
    label: 'Threat',
    description: 'Statements expressing intent to inflict harm, violence, or damage.',
    barBg: 'bg-rose-600',
    badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/40'
  },
  insult: {
    label: 'Insult',
    description: 'Insulting, inflammatory, or belittling remarks targeted at individuals.',
    barBg: 'bg-orange-500',
    badgeBg: 'bg-orange-500/10 text-orange-300 border-orange-500/30'
  },
  identity_hate: {
    label: 'Identity Hate',
    description: 'Hate speech targeted at race, religion, gender, ethnicity, or sexual orientation.',
    barBg: 'bg-purple-500',
    badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30'
  }
};

export default function ToxicityBar({ categoryKey, score }) {
  const meta = CATEGORY_META[categoryKey] || {
    label: categoryKey,
    description: '',
    barBg: 'bg-zinc-400',
    badgeBg: 'bg-white/10 text-white border-white/20'
  };

  const percentage = Math.round(score * 100);
  const isHighRisk = score >= 0.40;

  return (
    <div className="bg-black/50 border border-white/10 rounded-2xl p-4.5 sm:p-5 transition-all hover:border-white/20">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">{meta.label}</span>
          {isHighRisk && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${meta.badgeBg}`}>
              Detected
            </span>
          )}
        </div>

        <span className={`text-base font-extrabold font-mono ${isHighRisk ? 'text-rose-400' : 'text-zinc-400'}`}>
          {percentage}%
        </span>
      </div>

      <p className="text-xs text-zinc-400 mb-3 leading-snug">
        {meta.description}
      </p>

      {/* Progress Bar Container */}
      <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
        <div
          className={`h-full rounded-full ${meta.barBg} transition-all duration-700 ease-out`}
          style={{ width: `${Math.max(percentage, 2)}%` }}
        />
      </div>
    </div>
  );
}
