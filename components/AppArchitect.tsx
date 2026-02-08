import React, { useState } from 'react';
import { generateAppRoadmap } from '../services/geminiService';
import { AppRoadmap } from '../types';

const AppArchitect: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [roadmap, setRoadmap] = useState<AppRoadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await generateAppRoadmap(idea);
      setRoadmap(result);
      setTimeout(() => {
        document.getElementById('roadmap-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError('Neural processing failed. Please try a different input.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="architect" className="py-32 bg-slate-50 border-y border-slate-200 relative overflow-hidden">
      {/* Schematic Accents */}
      <div className="absolute top-0 left-0 w-48 h-48 border-l border-t border-slate-200 -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
      
      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black font-outfit text-slate-900 mb-6 tracking-tighter">Define Your Protocol.</h2>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed text-lg font-light">
            Our neural engine will synthesize a production-ready roadmap for your mobile concept.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="max-w-3xl mx-auto mb-20">
          <div className="relative glass-card p-2 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border-2 border-slate-200">
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="E.g. A crypto wallet with biometric social recovery..."
              className="w-full bg-transparent rounded-[2rem] px-8 py-6 text-lg focus:outline-none placeholder:text-slate-300 font-light"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 px-10 bg-slate-900 text-white rounded-[1.8rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
            >
              {loading ? (
                <i className="fas fa-circle-notch animate-spin"></i>
              ) : (
                <>
                  <span>Architect</span>
                  <i className="fas fa-bolt-lightning text-indigo-400"></i>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-3xl text-center mb-12 flex items-center justify-center gap-3 font-mono-tech text-xs">
            <i className="fas fa-triangle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        {roadmap && (
          <div id="roadmap-results" className="animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <div className="p-8 md:p-12 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                  <div className="text-[10px] font-mono-tech text-indigo-600 uppercase tracking-[0.3em] mb-2 font-bold">Project Initialized</div>
                  <h3 className="text-3xl md:text-5xl font-black font-outfit text-slate-900 leading-none">{roadmap.appName}</h3>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-[0.3em] mb-2">Build Complexity</div>
                  <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${
                    roadmap.estimatedDifficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    roadmap.estimatedDifficulty === 'Intermediate' ? 'bg-indigo-100 text-indigo-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {roadmap.estimatedDifficulty}
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Tech & Features */}
                <div className="lg:col-span-4 space-y-12">
                  <div>
                    <h4 className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-[0.3em] mb-6 font-bold flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      Component Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {roadmap.techStack.map((tech, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-[0.3em] mb-6 font-bold flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      Core Logic
                    </h4>
                    <div className="space-y-3">
                      {roadmap.features.map((feature, i) => (
                        <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl text-sm font-medium text-slate-700 flex items-start gap-3 shadow-sm">
                          <i className="fas fa-check-circle text-indigo-500 mt-0.5"></i>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="lg:col-span-8">
                  <h4 className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-[0.3em] mb-10 font-bold flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    Deployment Pipeline
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {roadmap.timeline.map((step, i) => (
                      <div key={i} className="group p-6 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden transition-all hover:bg-white hover:border-indigo-600">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/50 -rotate-45 translate-x-8 -translate-y-8 flex items-center justify-center">
                          <i className={`fas ${step.icon} text-slate-200 group-hover:text-indigo-600 transition-colors`}></i>
                        </div>
                        <div className="relative">
                          <div className="text-xs font-mono-tech text-indigo-600 font-bold mb-3">PHASE_{i+1}</div>
                          <h5 className="font-black font-outfit text-slate-900 mb-2">{step.title}</h5>
                          <p className="text-slate-500 text-xs leading-relaxed font-light">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 p-8 bg-slate-900 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-md">
                      <h5 className="text-xl font-black font-outfit mb-2">Build This Module.</h5>
                      <p className="text-slate-400 text-xs font-light leading-relaxed">
                        Request a formal technical review and production quote for the {roadmap.appName} architecture.
                      </p>
                    </div>
                    <a 
                      href={`mailto:hello@realmlabs.io?subject=Build Request: ${roadmap.appName}&body=Project Architecture: ${roadmap.concept}`}
                      className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all flex items-center gap-3 shadow-lg shadow-indigo-200/20"
                    >
                      Initialize Project
                      <i className="fas fa-paper-plane text-[10px]"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AppArchitect;