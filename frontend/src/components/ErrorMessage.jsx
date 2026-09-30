import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ErrorMessage({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-rose-200 flex items-start justify-between gap-3 shadow-xl backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-rose-300">Analysis Error</h4>
          <p className="text-xs text-rose-200/90 mt-0.5 font-mono">{message}</p>
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-full text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
