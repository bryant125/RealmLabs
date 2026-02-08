import { Brain, Moon, Zap, Trophy } from "lucide-react";

const benefits = [
    {
        icon: <Brain className="w-8 h-8 text-purple-400" />,
        title: "Sharper Focus",
        value: "+40%",
        desc: "Increase in daily productivity span.",
        gradient: "from-purple-500/20 to-blue-500/20"
    },
    {
        icon: <Moon className="w-8 h-8 text-indigo-400" />,
        title: "Better Sleep",
        value: "92%",
        desc: "Of users report improved sleep quality.",
        gradient: "from-indigo-500/20 to-purple-500/20"
    },
    {
        icon: <Zap className="w-8 h-8 text-yellow-400" />,
        title: "Energy Levels",
        value: "2.5h",
        desc: "Extra active movement daily.",
        gradient: "from-yellow-500/20 to-orange-500/20"
    },
    {
        icon: <Trophy className="w-8 h-8 text-emerald-400" />,
        title: "Goal Completion",
        value: "3x",
        desc: "Higher likelihood of hitting daily targets.",
        gradient: "from-emerald-500/20 to-teal-500/20"
    }
];

export function Benefits() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl mx-auto pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Why <span className="text-neon">BurnScroll?</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        It's not just about blocking apps. It's about reclaiming your biology.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((item, i) => (
                        <div key={i} className="group relative p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>
                                <div className="text-4xl font-bold text-white mb-2 tracking-tight">
                                    {item.value}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
