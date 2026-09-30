import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CommentInput from './components/CommentInput';
import PredictionResult from './components/PredictionResult';
import ModelInfo from './components/ModelInfo';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import { analyzeComment } from './services/api';
import { ShieldCheck, BookOpen, Code2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (textToAnalyze) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeComment(textToAnalyze);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to connect to toxicity analysis server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setCommentText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col font-sans selection:bg-white selection:text-black bg-grid-pattern top-spotlight">
      {/* Floating Centered Pill Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Hero Section shown on Analyzer tab */}
        {activeTab === 'analyzer' && <Hero />}

        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* TAB 1: ANALYZER */}
          {activeTab === 'analyzer' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <CommentInput
                commentText={commentText}
                setCommentText={setCommentText}
                onAnalyze={handleAnalyze}
                onClear={handleClear}
                isLoading={isLoading}
              />

              {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

              {isLoading && <Loading />}

              {result && !isLoading && <PredictionResult result={result} />}
            </div>
          )}

          {/* TAB 2: HOW IT WORKS */}
          {activeTab === 'how-it-works' && (
            <div className="max-w-4xl mx-auto space-y-8 py-8">
              <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl">
                <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-white" />
                  <span>How ToxiGuard Works</span>
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                  ToxiGuard processes online text comments through a multi-step natural language processing (NLP) and machine learning pipeline to detect 6 forms of toxicity.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                    <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-extrabold text-sm">
                      1
                    </div>
                    <h3 className="font-bold text-white text-base">Regex Preprocessing</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Strips HTML tags, URLs, user handles (@name), IP addresses, and standardizes lowercasing and extra whitespace.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                    <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-extrabold text-sm">
                      2
                    </div>
                    <h3 className="font-bold text-white text-base">TF-IDF Vectorization</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Converts text into numerical sparse feature matrices considering unigram & bigram frequencies with sublinear TF scaling.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                    <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-extrabold text-sm">
                      3
                    </div>
                    <h3 className="font-bold text-white text-base">Multi-Label Inference</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Six distinct binary Logistic Regression classifiers output independent probability scores for each toxicity label.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MODEL SPEC */}
          {activeTab === 'model' && <ModelInfo />}

          {/* TAB 4: ABOUT */}
          {activeTab === 'about' && (
            <div className="max-w-4xl mx-auto space-y-8 py-8">
              <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-white/10 text-white border border-white/10">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">About College ML Project</h2>
                    <p className="text-xs text-zinc-400 font-mono">Toxic Comment Classification System</p>
                  </div>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  This project was built as a full-stack Machine Learning college capstone application designed specifically for zero-overhead, production-ready serverless deployment on <strong className="text-white">Vercel</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-5 rounded-2xl bg-black/50 border border-white/10">
                    <h4 className="font-bold text-white mb-1">Frontend Stack</h4>
                    <p className="text-zinc-400">React 18, Vite, Tailwind CSS, Lucide Icons</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-black/50 border border-white/10">
                    <h4 className="font-bold text-white mb-1">Backend Stack</h4>
                    <p className="text-zinc-400">Vercel Python Serverless Function (`/api/predict`)</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-black/50 border border-white/10">
                    <h4 className="font-bold text-white mb-1">ML Core</h4>
                    <p className="text-zinc-400">Scikit-learn, TF-IDF Vectorizer, OneVsRest Classifier</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-black/50 border border-white/10">
                    <h4 className="font-bold text-white mb-1">Architecture</h4>
                    <p className="text-zinc-400">Single GitHub Repository → Vercel Deployment</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#08080a] py-8 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-zinc-400" />
            <span className="font-bold text-zinc-300">ToxiGuard ML System</span>
            <span>• College Final Year Machine Learning Project</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
