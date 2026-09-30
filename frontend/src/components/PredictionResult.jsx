import React from 'react';
import { AlertTriangle, CheckCircle2, Heart, ShieldAlert, Tag, Sparkles } from 'lucide-react';
import ToxicityBar from './ToxicityBar';

export default function PredictionResult({ result }) {
  if (!result || !result.predictions) return null;

  const { predictions, labels, sentiment, sentiment_label, is_positive } = result;
  
  const maxScore = Math.max(...Object.values(predictions));
  const isToxic = labels && labels.length > 0;
  const isPositiveComment = is_positive || sentiment === 'positive';

  return (
    <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6">
      {/* Verdict Banner */}
      <div className={`rounded-2xl p-6 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isToxic
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
          : isPositiveComment
          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl ${
            isToxic
              ? 'bg-rose-500/20 text-rose-400'
              : isPositiveComment
              ? 'bg-emerald-500/25 text-emerald-300'
              : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            {isToxic ? (
              <AlertTriangle className="w-7 h-7" />
            ) : isPositiveComment ? (
              <Heart className="w-7 h-7 fill-emerald-400/20 text-emerald-400" />
            ) : (
              <CheckCircle2 className="w-7 h-7" />
            )}
          </div>
          <div>
            <div className="text-xs font-mono font-semibold uppercase tracking-wider opacity-80 mb-0.5">
              Toxicity Verdict
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <span>{sentiment_label || (isToxic ? 'Potentially Toxic Comment' : isPositiveComment ? 'Positive & Wholesome' : 'Clean & Civil Comment')}</span>
              {isPositiveComment && <Sparkles className="w-5 h-5 text-amber-300 inline-block" />}
            </h3>
          </div>
        </div>

        {/* Max Risk Score Pill */}
        <div className="flex items-center gap-2 bg-black/60 px-4.5 py-2.5 rounded-full border border-white/10">
          <span className="text-xs text-zinc-400 font-mono">Peak Risk Score:</span>
          <span className={`text-lg font-bold font-mono ${
            isToxic ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            {Math.round(maxScore * 100)}%
          </span>
        </div>
      </div>

      {/* Flagged Labels & Positive Acknowledgements */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
          <Tag className="w-3.5 h-3.5 text-zinc-200" />
          <span>Active Classification Tags ({isToxic ? labels.length : (isPositiveComment ? 2 : 1)})</span>
        </div>
        
        {isToxic ? (
          <div className="flex flex-wrap gap-2">
            {labels.map((lbl) => (
              <span
                key={lbl}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                {lbl.replace('_', ' ')}
              </span>
            ))}
          </div>
        ) : isPositiveComment ? (
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Positive & Friendly
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Wholesome
            </span>
          </div>
        ) : (
          <p className="text-xs text-zinc-400 italic bg-black/40 px-4 py-3 rounded-2xl border border-white/5 font-mono">
            No toxicity thresholds exceeded. Comment appears safe and appropriate.
          </p>
        )}
      </div>

      {/* Probability Bars Grid */}
      <div className="space-y-4 pt-2">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-zinc-400" />
          <span>Category Probability Scores</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(predictions).map(([catKey, score]) => (
            <ToxicityBar key={catKey} categoryKey={catKey} score={score} />
          ))}
        </div>
      </div>
    </div>
  );
}
