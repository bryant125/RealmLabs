import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-48 pb-24 lg:pt-64 lg:pb-44 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          {/* Left: Copy */}
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-3 px-3 py-1 mb-8 rounded-lg bg-indigo-50 border border-indigo-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span className="text-[10px] font-mono-tech font-bold text-indigo-700 uppercase tracking-widest">Active Build Protocol</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black font-outfit leading-[0.9] mb-8 text-slate-900 tracking-tight">
              Engineering <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Superior</span> <br/>
              Mobile Apps.
            </h1>
            
            <p className="text-xl text-slate-500 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Production-grade architecture for the world's most ambitious iOS and Android products. No shortcuts, just engineering excellence.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <a 
                href="mailto:support@realmlabs.app"
                className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl shadow-slate-200 hover:bg-indigo-600 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 uppercase text-sm tracking-widest"
              >
                Contact Us
                <i className="fas fa-paper-plane text-[10px] opacity-40"></i>
              </a>
            </div>
          </div>

          {/* Right: Technical Device Mockup & System Status */}
          <div className="flex-1 relative flex justify-center lg:justify-end">
            <div className="relative w-[300px] md:w-[350px] animate-float">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] -z-10"></div>
              
              <div className="relative glass-card p-4 rounded-[3.5rem] border-[8px] border-slate-900 shadow-2xl">
                <div className="aspect-[9/19] bg-white rounded-[2.8rem] overflow-hidden relative border-4 border-slate-50">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-full z-20"></div>
                  <div className="h-full flex flex-col pt-12">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System.OS</span>
                      <i className="fas fa-circle text-green-500 text-[6px]"></i>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="h-32 rounded-2xl bg-slate-900 p-4 text-white flex flex-col justify-end">
                        <div className="text-[8px] font-mono-tech text-indigo-400 uppercase tracking-widest mb-1">Compute</div>
                        <div className="text-2xl font-black font-outfit">OPTIMAL</div>
                      </div>
                      <div className="h-40 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
                        <i className="fas fa-fingerprint text-3xl mb-2"></i>
                        <span className="text-[8px] font-mono-tech uppercase">Securing Interface</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Status Overlay - Integrated from Footer */}
              <div className="absolute -left-16 bottom-12 w-64 glass-card p-5 rounded-2xl border-l-4 border-indigo-600 shadow-xl hidden xl:block">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">System Status</span>
                  <div className="flex gap-1">
                    <span className="w-1 h-1 rounded-full bg-green-500"></span>
                    <span className="w-1 h-1 rounded-full bg-green-500"></span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono-tech">
                    <span className="text-slate-400 uppercase">Core Latency</span>
                    <span className="text-slate-900 font-bold">12ms</span>
                  </div>
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[94%] bg-indigo-500"></div>
                  </div>
                  <div className="flex justify-between items-center text-[8px] font-mono-tech uppercase tracking-widest">
                    <span className="text-indigo-600">Operational</span>
                    <span className="text-slate-400">100% Up</span>
                  </div>
                </div>
              </div>

              {/* Float Cards */}
              <div className="absolute -right-8 top-1/4 glass-card p-3 rounded-xl shadow-lg border-r-4 border-slate-900 hidden md:block">
                <div className="text-[8px] font-mono-tech uppercase text-slate-400 mb-1">Encrypted</div>
                <div className="text-xs font-black text-slate-900">AES-256</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;