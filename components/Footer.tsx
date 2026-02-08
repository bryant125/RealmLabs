import React from 'react';

interface FooterProps {
  onShowPrivacy: () => void;
  onShowTerms: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowPrivacy, onShowTerms }) => {
  return (
    <>
      <footer className="bg-white py-24 border-t border-slate-100 mb-24 lg:mb-0">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
            {/* Brand Block */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white -rotate-2">
                   <span className="font-mono-tech text-xs">[R]</span>
                </div>
                <div>
                  <span className="text-2xl font-black font-outfit uppercase tracking-tighter text-slate-900">Realm Labs</span>
                  <span className="text-[10px] font-mono-tech uppercase tracking-[0.5em] text-indigo-500 block mt-1 font-bold">Mobile Engineering</span>
                </div>
              </div>
              <p className="text-slate-400 text-lg font-light leading-relaxed mb-10 max-w-md">
                We engineer production-grade mobile systems. Specialized in Swift, Kotlin, and high-concurrency cloud infrastructure.
              </p>
            </div>

            {/* Inquiries */}
            <div className="lg:col-span-6 flex flex-col lg:items-end">
              <div className="text-left lg:text-right">
                <h6 className="text-[10px] font-mono-tech font-bold text-slate-400 uppercase tracking-[0.4em] mb-8">Inquiries</h6>
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-300 block mb-2 tracking-widest">Global Support</span>
                    <a href="mailto:support@realmlabs.app" className="text-2xl font-bold text-slate-900 hover:text-indigo-600 transition-colors">support@realmlabs.app</a>
                  </div>
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-slate-400 text-sm font-light">Available for engineering audit and project consultation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-24 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[9px] font-mono-tech text-slate-400 uppercase tracking-[0.5em]">
              &copy; {new Date().getFullYear()} Realm Labs.
            </p>
            <div className="flex gap-8 text-[9px] font-mono-tech text-slate-400 uppercase tracking-[0.4em] font-bold">
              <button onClick={onShowPrivacy} className="hover:text-indigo-600 transition-colors">Privacy Policy</button>
              <button onClick={onShowTerms} className="hover:text-indigo-600 transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING NAVIGATION */}
      <a 
        href="https://burnscroll.userjot.com/roadmap"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 left-8 z-[100] group hidden md:flex items-center"
      >
        <div className="glass-card pl-6 pr-4 py-3.5 rounded-2xl shadow-2xl flex items-center gap-4 transition-all hover:-translate-y-1 border-slate-200">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono-tech text-slate-400 uppercase tracking-widest leading-none mb-1">Engineering</span>
            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Roadmap</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs group-hover:bg-indigo-600 transition-colors shadow-lg">
            <i className="fas fa-layer-group"></i>
          </div>
        </div>
      </a>

      <a 
        href="https://burnscroll.userjot.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] group hidden md:flex items-center"
      >
        <div className="bg-slate-900 text-white pl-4 pr-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-4 transition-all hover:-translate-y-1 border border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs group-hover:rotate-12 transition-all shadow-lg shadow-indigo-500/20">
            <i className="fas fa-bullhorn"></i>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-mono-tech text-indigo-400 uppercase tracking-widest leading-none mb-1">Interface</span>
            <span className="text-xs font-black uppercase tracking-widest">Feedback</span>
          </div>
        </div>
      </a>
    </>
  );
};

export default Footer;