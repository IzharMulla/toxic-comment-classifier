import React from 'react';
import { Send, Trash2, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';

export default function CommentInput({
  commentText,
  setCommentText,
  onAnalyze,
  onClear,
  isLoading
}) {
  const MAX_CHARS = 5000;
  const charCount = commentText.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isEmpty = !commentText.trim();

  const sampleComments = [
    { label: 'Civil & Constructive', text: 'This article is very well written and provides useful references. Thanks for sharing!' },
    { label: 'Toxic & Insulting', text: 'You are completely stupid and your opinion is absolute garbage! Stop posting nonsense.' },
    { label: 'Obscene & Severe', text: 'What kind of damn edit is this? Go fuck yourself you pathetic piece of trash.' },
    { label: 'Threat & Hate', text: 'I know where you live and I am coming to attack you and your whole disgusting group.' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEmpty && !isOverLimit && !isLoading) {
      onAnalyze(commentText);
    }
  };

  return (
    <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center justify-between mb-4">
        <label htmlFor="comment" className="flex items-center gap-2.5 text-base font-extrabold text-white">
          <MessageSquare className="w-5 h-5 text-zinc-400" />
          <span>Enter Comment to Analyze</span>
        </label>
        
        <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
          isOverLimit 
            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-semibold' 
            : 'bg-white/5 text-zinc-400 border-white/10'
        }`}>
          {charCount} / {MAX_CHARS}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <textarea
            id="comment"
            rows="5"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Type or paste any comment, discussion post, or edit summary here..."
            className={`w-full bg-black/60 border rounded-2xl p-5 text-white placeholder-zinc-500 text-sm focus:outline-none transition-all duration-200 resize-y min-h-[140px] font-sans ${
              isOverLimit
                ? 'border-rose-500/80 focus:ring-2 focus:ring-rose-500/30'
                : 'border-white/10 focus:border-white/30 focus:ring-2 focus:ring-white/5'
            }`}
          />
          {isOverLimit && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Comment exceeds maximum character limit of 5000 characters.</span>
            </div>
          )}
        </div>

        {/* Action Buttons (Pill Style from Reference Image) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isEmpty || isOverLimit || isLoading}
              className={`flex items-center gap-2.5 px-8 py-3.5 rounded-full font-extrabold text-sm shadow-xl transition-all duration-300 ${
                isEmpty || isOverLimit || isLoading
                  ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-white/5 shadow-none'
                  : 'bg-white hover:bg-zinc-200 text-black shadow-white/10 hover:shadow-2xl hover:scale-102 active:scale-98'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{isLoading ? 'Analyzing...' : 'Analyze Comment'}</span>
            </button>

            <button
              type="button"
              onClick={onClear}
              disabled={isEmpty && !commentText}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4 text-zinc-400" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </form>

      {/* Quick Preset Examples */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
          <span>Quick Preset Sample Comments:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleComments.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCommentText(sample.text)}
              className="px-4 py-2 rounded-full text-xs font-medium bg-white/5 hover:bg-white hover:text-black text-zinc-300 border border-white/10 transition-all duration-300 text-left"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
