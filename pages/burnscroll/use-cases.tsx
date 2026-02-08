import { Navbar } from "@/components/burnscroll/navbar";
import { Footer } from "@/components/burnscroll/footer";
import { Button } from "@/components/burnscroll/ui/button";
import { GraduationCap, Briefcase, Dumbbell, ArrowRight, CheckCircle2 } from "lucide-react";

export default function UseCasesPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-neon selection:text-black font-sans">
            <Navbar />

            {/* Hero Section */}
            <div className="pt-32 pb-20 px-6 text-center">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                    Who is <span className="text-neon">BurnScroll</span> for?
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Whether you're a student, an athlete, or a professional, BurnScroll helps you reclaim your time.
                </p>
            </div>

            {/* Use Cases List */}
            <div className="max-w-7xl mx-auto px-6 space-y-32 pb-32">

                {/* 1. The Student */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 relative h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 group">
                        <img
                            src="/burnscroll/step-1-block.png"
                            alt="Student focusing"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 backdrop-blur-md mb-4">
                                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Deep Focus Mode</span>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-6">
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <GraduationCap className="w-8 h-8 text-blue-400" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold">The Student</h2>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            Exams are coming up, but TikTok is calling. BurnScroll locks your distractions during study hours. Want to scroll? Burn 50 active calories first.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                                <span>Block social media during study blocks</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                                <span>Break the dopamine loop before exams</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                                <span>Turn procrastination into physical activity</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 2. The Fitness Enthusiast */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="w-16 h-16 rounded-2xl bg-neon/10 flex items-center justify-center border border-neon/20">
                            <Dumbbell className="w-8 h-8 text-neon" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold">The Athlete</h2>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            Use your phone habit as a trigger for workouts. Connect your Apple Watch and make every minute of scrolling a reward for your sweat.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-neon" />
                                <span>Syncs with Apple Health & Watch</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-neon" />
                                <span>Gamify your fitness goals</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-neon" />
                                <span>Guilt-free scrolling post-workout</span>
                            </li>
                        </ul>
                    </div>
                    <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 group">
                        <img
                            src="/burnscroll/step-2-burn.png"
                            alt="Athlete working out"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/20 border border-neon/30 backdrop-blur-md mb-4">
                                <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                                <span className="text-xs font-bold text-neon uppercase tracking-wider">Active Workout</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. The Professional (Reusing Focus/Reward visualization concepts) */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 relative h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 group">
                        <img
                            src="/burnscroll/step-3-scroll.png"
                            alt="Relaxing after work"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 backdrop-blur-md mb-4">
                                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">Reward Time</span>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-6">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                            <Briefcase className="w-8 h-8 text-purple-400" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold">The Professional</h2>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            Reclaim your work day. Block distractions during deep work sessions and save your dopamine hits for when the work is actually done.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                                <span>Boost productivity by 40%</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                                <span>Eliminate "just one quick check"</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                                <span>Improve sleep quality</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

            {/* CTA */}
            <div className="py-20 text-center bg-zinc-900/50 border-t border-white/5">
                <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to join them?</h2>
                <Button className="h-12 rounded-full bg-neon text-black hover:bg-neon/90 font-bold px-8 text-lg">
                    Download Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>

            <Footer />
        </main>
    );
}
