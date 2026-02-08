import { Navbar } from "@/components/burnscroll/navbar";
import { Footer } from "@/components/burnscroll/footer";
import { Mail } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-neon selection:text-black font-sans flex flex-col">
            <Navbar />

            <div className="flex-grow pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Header Section */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                            Contact & Support
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            We're here to help. Reach out to us for support, feedback, or just to say hello.
                        </p>
                    </div>

                    {/* Contact Methods Grid */}
                    <div className="grid md:grid-cols-1 gap-6 max-w-2xl mx-auto">

                        {/* Email Support Card */}
                        <div className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center space-y-4 hover:border-neon/50 transition-all duration-300 group">
                            <div className="w-16 h-16 rounded-full bg-neon/10 flex items-center justify-center text-neon group-hover:scale-110 transition-transform duration-300">
                                <Mail className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Email Support</h3>
                                <p className="text-gray-400 mb-6">
                                    For general inquiries, technical support, or partnership opportunities.
                                </p>
                                <a
                                    href="mailto:support@realmlabs.app"
                                    className="text-xl font-semibold text-neon hover:text-white transition-colors border-b-2 border-neon/20 hover:border-white pb-1"
                                >
                                    support@realmlabs.app
                                </a>
                            </div>
                        </div>

                    </div>

                    {/* FAQ / Additional Info (Optional filler for better layout) */}
                    <div className="text-center pt-12">
                        <p className="text-gray-500">
                            Our team typically responds within 24 hours.
                        </p>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}
