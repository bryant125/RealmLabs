import { motion } from "framer-motion";
import { Lock, Zap, Smartphone } from "lucide-react";

const steps = [
    {
        id: 1,
        title: "Block Distractions",
        description: "Select your distracting apps. They stay locked until you earn your screen time.",
        image: "/burnscroll/step-1-block.png",
        icon: Lock,
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20"
    },
    {
        id: 2,
        title: "Sweat to Earn",
        description: "Perform any exercise to burn calories relative to the time you want to scroll. e.g. 100 Active Calories = 20 mins.",
        image: "/burnscroll/step-2-burn.png",
        icon: Zap,
        color: "text-neon",
        bg: "bg-neon/10",
        border: "border-neon/20"
    },
    {
        id: 3,
        title: "Scroll Guilt-Free",
        description: "Unlock your apps and enjoy your earned time with zero guilt. You earned it.",
        image: "/burnscroll/step-3-scroll.png",
        icon: Smartphone,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    }
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(206,255,0,0.05),transparent_50%)]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                        How it <span className="text-neon">Works</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Turn your doomscrolling addiction into a fitness powerhouse in 3 simple steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="relative group h-full"
                        >
                            <div className="absolute inset-0 bg-white/5 rounded-3xl blur-xl group-hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 duration-500" />

                            <div className={`relative h-full bg-[#111] border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-colors duration-300 flex flex-col`}>
                                {/* Image Container */}
                                <div className="relative h-48 md:h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111] z-10" />
                                    <img
                                        src={step.image}
                                        alt={step.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />

                                    {/* Validating Step Badge */}
                                    <div className="absolute top-4 left-4 z-20">
                                        <div className={`w-10 h-10 rounded-full ${step.bg} ${step.border} border flex items-center justify-center backdrop-blur-md`}>
                                            <span className={`font-bold ${step.color}`}>{step.id}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 pt-2 flex-grow flex flex-col">
                                    <div className={`w-12 h-12 rounded-xl ${step.bg} ${step.border} border flex items-center justify-center mb-6`}>
                                        <step.icon className={`w-6 h-6 ${step.color}`} />
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
