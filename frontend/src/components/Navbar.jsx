import React from 'react';
import { LayoutGrid, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'analyzer', label: 'Analyzer' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'model', label: 'Model Spec' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header className="sticky top-6 z-50 max-w-2xl mx-auto px-4">
      {/* Floating Centered Pill Navbar (Identical to Reference Image) */}
      <div className="bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-full px-5 py-2.5 flex items-center justify-between shadow-2xl">
        {/* Left Icon Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setActiveTab('analyzer')}
        >
          <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/15 group-hover:bg-white group-hover:text-black transition-all duration-300">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <span className="text-sm font-extrabold tracking-tight text-white hidden sm:inline-block">
            ToxiGuard
          </span>
        </div>

        {/* Center Navigation Links */}
        <nav className="flex items-center gap-5 sm:gap-6">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Capsule Button */}
        <button
          onClick={() => setActiveTab('analyzer')}
          className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white hover:text-black text-xs font-semibold text-white border border-white/15 transition-all duration-300 shadow-sm"
        >
          Analyze
        </button>
      </div>
    </header>
  );
}
