import React from 'react';
import { Cpu } from 'lucide-react';

export default function Loading() {
  return (
    <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-8 sm:p-12 text-center shadow-2xl backdrop-blur-2xl">
      <div className="relative inline-flex items-center justify-center mb-4">
        <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-white animate-spin" />
        <Cpu className="w-6 h-6 text-white absolute" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">Analyzing Comment Toxicity...</h3>
      <p className="text-xs text-zinc-400 max-w-sm mx-auto font-mono">
        Running text through TF-IDF Vectorizer and OneVsRest Logistic Regression models on Vercel Serverless Engine.
      </p>
    </div>
  );
}
