import React from 'react';

const SERVICES = [
  {
    title: 'NATIVE ENGINE',
    desc: 'High-performance iOS & Android systems built with Swift and Kotlin at the core.',
    icon: 'fa-code-branch',
    code: '01'
  },
  {
    title: 'CROSS-SYNC',
    desc: 'Unified codebases using React Native & Flutter for lightning-fast multi-platform deployment.',
    icon: 'fa-microchip',
    code: '02'
  },
  {
    title: 'NEURAL DESIGN',
    desc: 'Predictive UI/UX design systems that prioritize user intent and seamless interaction.',
    icon: 'fa-vector-square',
    code: '03'
  },
  {
    title: 'BACKEND CORE',
    desc: 'Distributed cloud infrastructure built to support global scalability and high concurrency.',
    icon: 'fa-shield-halved',
    code: '04'
  }
];

const Services: React.FC = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-[10px] font-mono-tech font-bold text-slate-400 uppercase tracking-[0.5em]">Engineering Modules</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((s, i) => (
            <div key={i} className="group relative blueprint-border p-8 bg-white border border-slate-200 transition-all hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-50">
              <div className="text-[10px] font-mono-tech text-slate-300 mb-6 flex justify-between">
                <span>MODULE_{s.code}</span>
                <i className="fas fa-plus"></i>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <i className={`fas ${s.icon} text-lg`}></i>
              </div>
              <h3 className="text-lg font-black font-outfit text-slate-900 mb-4 tracking-tight">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;