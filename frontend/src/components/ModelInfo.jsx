import React from 'react';
import { Cpu, Layers, BarChart3, Server } from 'lucide-react';

export default function ModelInfo() {
  const categories = [
    { name: 'toxic', desc: 'Baseline toxicity, rude, unreasonable or offensive comments' },
    { name: 'severe_toxic', desc: 'Aggressive, extremely abusive or malicious hate language' },
    { name: 'obscene', desc: 'Vulgar, profane, or sexually explicit content' },
    { name: 'threat', desc: 'Expressing intent to commit physical harm or violence' },
    { name: 'insult', desc: 'Inflammatory remarks intended to demean individuals' },
    { name: 'identity_hate', desc: 'Hate speech targeting protected identity groups' }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      {/* Overview Card */}
      <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-white/10 text-white border border-white/10">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Machine Learning Architecture</h2>
            <p className="text-xs text-zinc-400 font-mono">TF-IDF Vectorizer + One-vs-Rest Logistic Regression</p>
          </div>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed mb-6">
          The Toxic Comment Classifier is trained on the Kaggle Jigsaw Toxic Comment Classification Challenge dataset.
          Unlike binary classification, toxic comment identification is a <strong className="text-white">multi-label classification problem</strong> where a single comment can simultaneously belong to multiple toxicity categories (e.g., both toxic and insult).
        </p>

        {/* Pipeline Diagram */}
        <div className="bg-black/60 p-5 rounded-2xl border border-white/10 mb-2">
          <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-4">
            Inference Pipeline Architecture
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-300">
            <span className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 shadow-sm font-semibold">Raw Comment</span>
            <span className="text-zinc-500 font-bold">→</span>
            <span className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 shadow-sm font-semibold">Regex Clean</span>
            <span className="text-zinc-500 font-bold">→</span>
            <span className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 shadow-sm font-semibold">TF-IDF Matrix</span>
            <span className="text-zinc-500 font-bold">→</span>
            <span className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 shadow-sm font-semibold">OneVsRest Classifier</span>
            <span className="text-zinc-500 font-bold">→</span>
            <span className="px-3.5 py-2.5 rounded-xl bg-white text-black font-extrabold shadow-sm">6 Class Probabilities</span>
          </div>
        </div>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ML Hyperparameters */}
        <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-zinc-400" />
            <span>ML Setup & Hyperparameters</span>
          </h3>
          <ul className="space-y-3 text-xs text-zinc-300">
            <li className="flex justify-between p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-zinc-400">Feature Extractor:</span>
              <span className="font-mono text-white font-semibold">TfidfVectorizer (Sublinear TF)</span>
            </li>
            <li className="flex justify-between p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-zinc-400">N-gram Range:</span>
              <span className="font-mono text-white font-semibold">(1, 2) Unigrams & Bigrams</span>
            </li>
            <li className="flex justify-between p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-zinc-400">Classifier Strategy:</span>
              <span className="font-mono text-white font-semibold">OneVsRest (6 Estimators)</span>
            </li>
            <li className="flex justify-between p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-zinc-400">Base Estimator:</span>
              <span className="font-mono text-white font-semibold">Logistic Regression (C=2.0)</span>
            </li>
            <li className="flex justify-between p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-zinc-400">Class Weighting:</span>
              <span className="font-mono text-white font-semibold">Balanced (Imbalance Mitigated)</span>
            </li>
          </ul>
        </div>

        {/* Serverless Specs */}
        <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <Server className="w-5 h-5 text-zinc-400" />
            <span>Serverless Infrastructure</span>
          </h3>
          <ul className="space-y-3 text-xs text-zinc-300">
            <li className="flex justify-between p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-zinc-400">Deployment Platform:</span>
              <span className="font-mono text-white font-semibold">Vercel Serverless Functions</span>
            </li>
            <li className="flex justify-between p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-zinc-400">Python Runtime:</span>
              <span className="font-mono text-white font-semibold">Python 3.9+ HTTP Handler</span>
            </li>
            <li className="flex justify-between p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-zinc-400">Model Artifact Size:</span>
              <span className="font-mono text-emerald-400 font-semibold">&lt; 5 MB Compressed</span>
            </li>
            <li className="flex justify-between p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-zinc-400">Cold Start Latency:</span>
              <span className="font-mono text-white font-semibold">&lt; 300 ms</span>
            </li>
            <li className="flex justify-between p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-zinc-400">API Endpoint:</span>
              <span className="font-mono text-rose-300 font-semibold">POST /api/predict</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Toxicity Categories Grid */}
      <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-zinc-400" />
          <span>Toxicity Categories Explained</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c.name} className="p-4 rounded-2xl bg-black/50 border border-white/10">
              <div className="text-xs font-bold uppercase text-white font-mono mb-1">{c.name.replace('_', ' ')}</div>
              <div className="text-xs text-zinc-400">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
