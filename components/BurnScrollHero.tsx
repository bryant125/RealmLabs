import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Trophy } from "lucide-react";

export function BurnScrollHero() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [5, -5]);
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 px-6 lg:px-12 overflow-hidden bg-black"
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                x.set((e.clientX - centerX) / 50);
                y.set((e.clientY - centerY) / 50);
            }}
            onMouseLeave={() => {
                x.set(0);
                y.set(0);
            }}
        >
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* Left Column: Phone */}
                <motion.div
                    style={{ rotateX, rotateY, z: 100 }}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative z-10 perspective-1000 flex justify-center lg:justify-end order-1 lg:order-1"
                >
                    <div className="relative w-full max-w-[500px] aspect-[4/5] flex items-center justify-center">
                        <motion.div
                            className="relative w-full h-full flex items-center justify-center"
                            animate={{ y: [-15, 15, -15] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            {/* New user provided image */}
                            <img
                                src="/hero-phone-v2.png"
                                alt="Burn Scroll Interface"
                                className="w-full h-full object-contain drop-shadow-2xl transform lg:-rotate-6 scale-125"
                            />
                        </motion.div>

                        {/* Glow behind phone */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-neon/10 blur-[100px] -z-10 rounded-full mix-blend-screen" />
                    </div>
                </motion.div>

                {/* Right Column: Content */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-10 z-10 order-2 lg:order-2"
                >
                    {/* Trust/Awards Section - Simplified */}
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <Trophy className="w-4 h-4 text-neon" />
                        <span className="text-xs font-bold tracking-widest uppercase text-gray-300">#1 Fitness Blocker</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-bold tracking-tighter text-white leading-[0.85]">
                        <span className="flex items-center gap-4">
                            Burn <span className="text-neon animate-pulse">🔥</span>
                        </span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon via-lime-400 to-neon animate-pulse mt-2">
                            to Unlock.
                        </span>
                    </h1>

                    <p className="text-2xl md:text-3xl text-gray-400 font-light max-w-xl leading-relaxed">
                        Stop doomscrolling. <span className="text-white font-medium">Burn Scroll</span> locks your apps until you burn the calories.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full lg:w-auto">
                        <Button size="lg" className="h-20 px-12 rounded-full text-2xl bg-neon text-black hover:bg-neon/90 font-bold tracking-wide w-full sm:w-auto shadow-[0_0_40px_rgba(206,255,0,0.4)] hover:scale-105 transition-all">
                            Download App
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-neon/5 rounded-full blur-[150px] -z-10 opacity-40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] -z-10 opacity-30 pointer-events-none" />
        </section>
    );
}
