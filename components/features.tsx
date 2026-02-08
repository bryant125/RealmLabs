import { Card } from "@/components/ui/card";
import { GraduationCap, Briefcase, Heart, Users, Brain, Shield, Clock } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

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
            className={`relative overflow-hidden group border border-white/10 bg-[#111] rounded-[2.5rem] ${className}`}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            rgba(206, 255, 0, 0.15),
                            transparent 80%
                        )
                    `,
                }}
            />
            <div className="relative h-full w-full">{children}</div>
        </div>
    );
}

export function Features() {
    return (
        <section className="py-32 relative overflow-hidden bg-black" id="features">
            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
                        More focus. <span className="text-neon">Less noise.</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        A complete suite of tools designed to help you reclaim your time and sanity.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Large Card */}
                    <FeatureCard className="md:col-span-2 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group/card">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-16 h-16 rounded-3xl bg-neon/10 flex items-center justify-center border border-neon/20 shadow-[0_0_30px_rgba(206,255,0,0.1)]">
                                    <Shield className="w-8 h-8 text-neon" />
                                </div>
                                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon/10 border border-neon/20 text-neon text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(206,255,0,0.2)]">
                                    <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                                    Active
                                </div>
                            </div>

                            <h3 className="text-4xl font-bold text-white mb-4 tracking-tight">Hardcore App Blocking</h3>
                            <p className="text-gray-400 text-xl font-light leading-relaxed max-w-md">
                                Stop doomscrolling dead in its tracks. Our blocking technology integrates deep with Apple Screen Time API.
                            </p>
                        </div>

                        {/* Visual Mockup */}
                        <div className="mt-10 flex flex-col gap-3 relative">
                            {/* Decorative gradient behind items */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm transition-transform duration-300 group-hover/card:translate-x-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xs ring-1 ring-white/10 shadow-lg">IG</div>
                                    <span className="font-medium text-white text-lg">Instagram</span>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    Blocked
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm opacity-80 transition-transform duration-300 group-hover/card:translate-x-4 delay-75">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-xs ring-1 ring-white/10 shadow-lg">TT</div>
                                    <span className="font-medium text-white text-lg">TikTok</span>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    Blocked
                                </div>
                            </div>
                        </div>
                    </FeatureCard>

                    {/* Tall Card - Rewire (Fixed Layout) */}
                    <FeatureCard className="md:row-span-2 p-8 md:p-10 flex flex-col relative overflow-hidden group/tall">
                        {/* Content Top */}
                        <div className="relative z-20 mb-6">
                            <div className="w-16 h-16 rounded-3xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                                <Brain className="w-8 h-8 text-purple-400" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">Rewire Your Brain</h3>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Break the dopamine loop. Replace scrolling with calorie burning activities.
                            </p>
                        </div>

                        {/* Combined Visual Container (Fills Space) */}
                        <div className="flex-1 relative w-full bg-[#0a0510] rounded-2xl border border-purple-500/10 overflow-hidden flex flex-col">

                            {/* Background Animation Layer */}
                            <div className="absolute inset-0 z-0">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)]" />
                                <div className="absolute inset-0 opacity-20"
                                    style={{
                                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.7) 1px, transparent 0)',
                                        backgroundSize: '24px 24px'
                                    }}
                                />
                                {/* Active Synapses (Background) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-purple-500/20 rounded-full animate-spin [animation-duration:15s]" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-purple-500/10 rounded-full animate-spin [animation-duration:10s] direction-reverse" />
                            </div>

                            {/* Metrics Overlay (Top of Container) */}
                            <div className="relative z-10 grid grid-cols-1 gap-3 p-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md flex items-center justify-between">
                                    <div>
                                        <div className="text-purple-300/60 text-[10px] font-bold uppercase tracking-wider mb-0.5">Attention Span</div>
                                        <div className="text-white text-xl font-bold">+140%</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <span className="text-emerald-400 text-sm">▲</span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md flex items-center justify-between">
                                    <div>
                                        <div className="text-purple-300/60 text-[10px] font-bold uppercase tracking-wider mb-0.5">Brain Fog</div>
                                        <div className="text-white text-xl font-bold">-65%</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <span className="text-emerald-400 text-sm">▼</span>
                                    </div>
                                </div>
                            </div>

                            {/* Neural Center (Bottom of Container) */}
                            <div className="flex-1 relative min-h-[120px] flex items-center justify-center mt-auto">
                                <div className="relative">
                                    <div className="w-6 h-6 bg-purple-400 rounded-full shadow-[0_0_30px_rgba(168,85,247,1)] animate-pulse z-10 relative" />
                                    {[...Array(8)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute top-1/2 left-1/2 w-1 h-24 bg-gradient-to-t from-transparent via-purple-500/40 to-transparent origin-bottom"
                                            style={{
                                                transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                                            }}
                                        >
                                            <div className="absolute top-0 w-full h-full bg-purple-400 blur-sm opacity-50 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                                        </div>
                                    ))}
                                </div>

                                <div className="absolute bottom-4 flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-purple-500/30 backdrop-blur-md">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                                    <span className="text-[10px] font-bold text-purple-200 uppercase tracking-widest">Neuroplasticity</span>
                                </div>
                            </div>

                        </div>
                    </FeatureCard>

                    {/* Card 3 - Health Sync */}
                    <FeatureCard className="p-8 md:p-10 flex flex-col justify-between group/health">
                        <div>
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                                <Heart className="w-7 h-7 text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Health Sync</h3>
                            <p className="text-gray-400">
                                Seamlessly syncs with Apple Health & Watch.
                            </p>
                        </div>

                        <div className="mt-6 flex items-center gap-4">
                            {/* Mock Rings */}
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-red-500/20" fill="none" />
                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-red-500" strokeDasharray="175" strokeDashoffset="40" fill="none" strokeLinecap="round" />
                                    <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="4" className="text-green-500/20" fill="none" />
                                    <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="4" className="text-green-500" strokeDasharray="125" strokeDashoffset="30" fill="none" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">Apple Health</div>
                                <div className="text-xs text-emerald-400 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Connected
                                </div>
                            </div>
                        </div>
                    </FeatureCard>

                    {/* Card 4 - Time Reclaimed */}
                    <FeatureCard className="p-8 md:p-10 flex flex-col justify-between group/time">
                        <div>
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                                <Clock className="w-7 h-7 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Time Reclaimed</h3>
                            <p className="text-gray-400">
                                Save 2+ hours daily on average.
                            </p>
                        </div>

                        <div className="mt-6">
                            <div className="text-4xl font-bold text-white tracking-tight flex items-baseline gap-1">
                                +2<span className="text-xl text-gray-400">h</span> 15<span className="text-xl text-gray-400">m</span>
                            </div>
                            <div className="mt-2 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full inline-block">
                                Saved Today
                            </div>
                        </div>
                    </FeatureCard>
                </div>
            </div>
        </section>
    );
}
