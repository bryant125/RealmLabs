import { Link } from "react-router-dom";
import { Logo } from "@/components/burnscroll/logo";
import { Twitter, Instagram, Linkedin, Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-black/80 border-t border-white/10 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-2 space-y-6">
                        <Logo />
                        <p className="text-muted-foreground w-full md:w-2/3">
                            Real Focus in Real-Time. Measure and improve your focus day by day.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-muted-foreground">
                            <li><Link to="/burnscroll" className="hover:text-white transition-colors">Download</Link></li>
                            <li><Link to="/burnscroll/use-cases" className="hover:text-white transition-colors">Use Cases</Link></li>
                            <li><Link to="/burnscroll/features" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link to="/burnscroll/contact" className="hover:text-white transition-colors">Contact & Support</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Legal</h4>
                        <ul className="space-y-4 text-muted-foreground">
                            <li><Link to="/burnscroll/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/burnscroll/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} BurnScroll. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
