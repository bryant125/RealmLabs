import React, { useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Shield, Zap, Activity } from "lucide-react";
import { Navbar } from "@/components/burnscroll/navbar";
import { Footer } from "@/components/burnscroll/footer";

// Mock Slider if simple one needed
const SimpleSlider = ({ value, onChange }: { value: number, onChange: (val: number) => void }) => (
    <div className="relative w-full h-6 flex items-center cursor-pointer group" onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percentage = Math.max(0, Math.min(100, (x / width) * 100));
        onChange(Math.round((percentage / 100) * 12)); // 0-12 hours
    }}>
        <div className="absolute inset-0 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-neon transition-all duration-300" style={{ width: `${(value / 12) * 100}%` }} />
        </div>
        <div
            className="absolute h-5 w-5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300 group-hover:scale-110"
            style={{ left: `calc(${(value / 12) * 100}% - 10px)` }}
        />
    </div>
);

function FeatureCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={`relative overflow-hidden group border border-white/5 bg-[#050505] rounded-[2.5rem] ${className}`}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            800px circle at ${mouseX}px ${mouseY}px,
                            rgba(255, 255, 255, 0.08),
                            transparent 80%
                        )
                    `,
                }}
            />
            <div className="relative h-full w-full z-10">{children}</div>
        </div>
    );
}

export default function FeaturesPage() {
    // State for interactive demos
    const [apps, setApps] = useState([
        { id: 'ig', name: "Instagram", icon: "IG", color: "from-purple-600 to-pink-600", blocked: true },
        { id: 'tt', name: "TikTok", icon: "TT", color: "from-black to-gray-800", blocked: true },
        { id: 'sc', name: "Snapchat", icon: "SC", color: "from-yellow-400 to-yellow-300", blocked: false },
    ]);

    const [difficulty, setDifficulty] = useState<'normal' | 'hardcore' | 'nuke'>('hardcore');
    const [limit, setLimit] = useState(2);
    const [score, setScore] = useState(0);

    // Animate score on load
    useEffect(() => {
        const timer = setInterval(() => {
            setScore(prev => {
                if (prev >= 98) {
                    clearInterval(timer);
                    return 98;
                }
                return prev + 1;
            });
        }, 20);
        return () => clearInterval(timer);
    }, []);

    const toggleApp = (id: string) => {
        setApps(apps.map(app =>
            app.id === id ? { ...app, blocked: !app.blocked } : app
        ));
    };

    return (
        <main className="min-h-screen bg-black text-white selection:bg-neon selection:text-black font-sans">
            <Navbar />

            <section className="pt-40 pb-20 relative overflow-hidden bg-black">
                {/* Background Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24 space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-8xl font-bold tracking-tighter text-white"
                        >
                            Ingredients of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-neon to-emerald-400 animate-gradient-x">Focus.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-xl text-gray-400 max-w-2xl mx-auto font-light"
                        >
                            Industrial-grade blocking technology. Zero distractions.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-6 h-auto md:h-[850px]">

                        {/* Card 1: Blocklist (Interactive) */}
                        <FeatureCard className="md:col-span-3 md:row-span-2 p-8 flex flex-col justify-between bg-gradient-to-b from-[#0a0a0a] to-black">
                            <div className="mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                                    <Shield className="w-7 h-7 text-blue-400" />
                                </div>
                                <h3 className="text-4xl font-bold text-white mb-3">Blocklist</h3>
                                <p className="text-gray-400 text-lg">Tap to toggle blocking state.</p>
                            </div>

                            <div className="flex-1 overflow-hidden relative rounded-3xl bg-[#111] border border-white/5 p-2 shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none z-20" />
                                <div className="flex flex-col gap-2 p-2">
                                    {apps.map((app) => (
                                        <motion.div
                                            key={app.id}
                                            layout
                                            onClick={() => toggleApp(app.id)}
                                            className={`
                                                relative flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300
                                                ${app.blocked
                                                    ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10'
                                                    : 'bg-white/5 border-white/5 hover:bg-white/10'}
                                            `}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                                                    {app.icon}
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-white text-lg block">{app.name}</span>
                                                    <span className={`text-xs font-medium ${app.blocked ? 'text-red-400' : 'text-emerald-400'}`}>
                                                        {app.blocked ? 'Distraction blocked' : 'Usage allowed'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={`
                                                w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center
                                                ${app.blocked ? 'bg-red-500 justify-end' : 'bg-white/20 justify-start'}
                                            `}>
                                                <motion.div
                                                    layout
                                                    className="w-6 h-6 rounded-full bg-white shadow-sm"
                                                />
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Mock Extra Items to fill space */}
                                    <div className="opacity-30 pointer-events-none grayscale">
                                        <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">FB</div>
                                                <span className="font-semibold text-white text-lg">Facebook</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FeatureCard>

                        {/* Card 2: Difficulty Levels */}
                        <FeatureCard className="md:col-span-3 p-8 flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-neon/10 flex items-center justify-center mb-6">
                                    <Zap className="w-7 h-7 text-neon" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">Difficulty</h3>
                                <p className="text-gray-400">How strict do you want to be?</p>
                            </div>
                            <div className="mt-8 grid grid-cols-3 gap-4">
                                {[
                                    { id: 'normal', label: 'Normal', emoji: '😌', desc: 'Can cancel' },
                                    { id: 'hardcore', label: 'Hardcore', emoji: '🔥', desc: 'Cannot cancel' },
                                    { id: 'nuke', label: 'Nuke', emoji: '😈', desc: 'Phone bricked' }
                                ].map((level) => (
                                    <button
                                        key={level.id}
                                        onClick={() => setDifficulty(level.id as any)}
                                        className={`
                                            relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 group
                                            ${difficulty === level.id
                                                ? 'bg-neon text-black border-neon shadow-[0_0_20px_rgba(206,255,0,0.4)] transform scale-105'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'}
                                        `}
                                    >
                                        <span className="text-3xl filter drop-shadow-lg">{level.emoji}</span>
                                        <div className="text-center">
                                            <span className={`block text-sm font-bold uppercase tracking-wider ${difficulty === level.id ? 'text-black' : 'text-white'}`}>
                                                {level.label}
                                            </span>
                                            <span className={`text-[10px] ${difficulty === level.id ? 'text-black/70' : 'text-gray-500'}`}>
                                                {level.desc}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </FeatureCard>

                        {/* Card 3: App Limits (Circular Slider Concept) */}
                        <FeatureCard className="md:col-span-1 md:col-start-4 p-6 flex flex-col justify-center items-center text-center bg-[#080808]">
                            <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                                {/* Simple Visualization of a dial */}
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                                    <circle
                                        cx="64" cy="64" r="58"
                                        stroke="currentColor" strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={364}
                                        strokeDashoffset={364 - (limit / 12) * 364}
                                        strokeLinecap="round"
                                        className="text-emerald-500 transition-all duration-500"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-white">{limit}h</span>
                                    <span className="text-xs text-emerald-400 font-medium tracking-wide">ALLOWED</span>
                                </div>
                            </div>

                            <h4 className="font-bold text-white mb-2">Daily Limit</h4>
                            <SimpleSlider value={limit} onChange={setLimit} />
                            <p className="text-xs text-gray-500 mt-3">Slide to adjust cap</p>
                        </FeatureCard>

                        {/* Card 4: Focus Score / Stats */}
                        <FeatureCard className="md:col-span-2 p-8 relative overflow-hidden flex flex-col justify-between">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-white">Focus Score</h3>
                                    <Activity className="text-neon w-6 h-6 animate-pulse" />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-7xl font-mono font-bold text-white tracking-tighter">
                                        {score}
                                    </span>
                                    <span className="text-xl text-gray-500 font-medium">/ 100</span>
                                </div>
                                <p className="text-gray-400 mt-2 text-sm">Top 1% of users today.</p>
                            </div>

                            {/* Abstract Chart Background */}
                            <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end gap-1 p-8 opacity-20">
                                {[40, 60, 45, 70, 85, 95, 80, 75, 60, 90, 100].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: '0%' }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 1, delay: i * 0.05 }}
                                        className="flex-1 bg-neon rounded-t-sm"
                                    />
                                ))}
                            </div>

                            <div className="absolute right-0 top-0 w-64 h-64 bg-neon/10 blur-[80px] rounded-full pointer-events-none" />
                        </FeatureCard>

                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
