import React, { useState, useEffect } from 'react';

export default function Navbar({ onStartApp }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <header className={`w-full max-w-5xl flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 ${
        scrolled 
          ? 'glass-panel' 
          : 'bg-white/40 backdrop-blur-sm border border-slate-200/30'
      }`}>
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 flex items-center justify-center relative">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="12" r="7" fill="currentColor" className="text-blue-600/80" />
              <circle cx="15" cy="12" r="7" fill="currentColor" className="text-indigo-400/80" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            SpendNest
          </span>
        </div>
        
        {/* Links */}
        <nav className="hidden md:flex gap-6 items-center">
          <button onClick={() => scrollTo('features')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</button>
          <button onClick={() => scrollTo('how-it-works')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How It Works</button>
          <button onClick={() => scrollTo('pricing')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pricing</button>
          <button onClick={() => scrollTo('about')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">About</button>
        </nav>

        {/* Auth / CTA */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:block text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors px-2">
            Log in
          </button>
          <button 
            onClick={onStartApp} 
            className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 shadow-sm interactive-btn"
          >
            Go to Dashboard
          </button>
        </div>

      </header>
    </div>
  );
}
