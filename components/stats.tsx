import { motion } from "framer-motion";

const stats = [
    { value: "2h", label: "Recovered Daily" },
    { value: "40%", label: "Sharper Focus" },
    { value: "98%", label: "Focus Score" },
];

export function Stats() {
    return (
        <section className="py-24 border-y border-white/5 bg-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center justify-center p-8 text-center group cursor-default">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-8xl font-bold text-neon mb-4 tracking-tighter"
                            >
                                {stat.value}
                            </motion.div>
                            <div className="text-gray-500 uppercase tracking-widest text-sm font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
