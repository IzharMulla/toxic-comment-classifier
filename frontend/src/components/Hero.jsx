import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-16 pb-10 text-center max-w-5xl mx-auto px-4 sm:px-6">
      {/* Massive Headline */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
        Detect Toxicity <br />
        <span className="text-zinc-500 font-semibold">Before It Spreads</span>
      </h1>

      {/* Subtitle with Dashes */}
      <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
        ~ Real-time multi-label classification using TF-IDF feature extraction and One-vs-Rest Logistic Regression for automated comment moderation. ~
      </p>
    </section>
  );
}
