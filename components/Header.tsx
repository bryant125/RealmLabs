import React from 'react';
import { Link } from 'react-router-dom';

import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHome }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] py-4 md:py-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="glass-card rounded-2xl px-4 md:px-8 py-3 md:py-4 flex items-center justify-between shadow-sm border-slate-200/60 relative z-50 bg-white/80 backdrop-blur-md">
          <button onClick={onHome} className="flex items-center gap-3 group text-left relative z-50">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-6 shadow-lg shadow-slate-200">
              <span className="text-white font-black font-mono-tech text-[10px] md:text-xs tracking-tighter">
                [R]
              </span>
            </div>
            <div>
              <span className="text-xl md:text-2xl font-black font-outfit tracking-tighter text-slate-900 block leading-none">
                REALM<span className="text-indigo-600">LABS</span>
              </span>
              <span className="text-[8px] md:text-[10px] font-mono-tech uppercase tracking-[0.4em] text-slate-400 block mt-0.5 md:mt-1">
                Precision Build
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors py-2">
                Projects
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:rotate-180"><path d="m6 9 6 6 6-6" /></svg>
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 w-48">
                <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 overflow-hidden">
                  <Link
                    to="/burnscroll"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-md bg-black flex items-center justify-center text-neon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-slate-900">Burn Scroll</span>
                      <span className="block text-[10px] text-slate-500 font-medium">Mobile App</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Desktop Contact Button */}
          <a
            href="mailto:support@realmlabs.app"
            className="hidden md:block group relative px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest overflow-hidden transition-all hover:bg-indigo-600 active:scale-95 shadow-xl shadow-slate-200"
          >
            <span className="relative z-10">Contact Us</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden relative z-50 p-2 text-slate-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[70] md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 w-full sm:w-[320px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col p-6 z-50">
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-bold uppercase tracking-widest text-slate-900">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 text-slate-500 hover:text-slate-900 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Projects</h3>
                <Link
                  to="/burnscroll"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-neon shadow-lg shadow-black/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>
                  </div>
                  <div>
                    <span className="block text-lg font-bold text-slate-900">Burn Scroll</span>
                    <span className="block text-xs text-slate-500 font-medium">Mobile App</span>
                  </div>
                </Link>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-auto">
                <a
                  href="mailto:support@realmlabs.app"
                  className="flex items-center justify-center w-full px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-xl shadow-slate-200"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;