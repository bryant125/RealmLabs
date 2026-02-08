import { Link } from "react-router-dom";
import { Button } from "@/components/burnscroll/ui/button";
import { Logo } from "@/components/burnscroll/logo";

const navLinks = [
    { name: "Use Cases", href: "/burnscroll/use-cases" },
    { name: "Features", href: "/burnscroll/features" },
    { name: "Support", href: "/burnscroll/contact" },
];

export function Navbar() {
    return (
        <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
            <div className="flex items-center gap-2 p-2 pl-4 pr-2 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
                <Logo />

                <div className="hidden md:flex items-center gap-1 ml-4 mr-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2 ml-2">
                    <Button className="h-10 rounded-full bg-black text-white hover:bg-zinc-900 border border-white/20 font-semibold px-5 flex items-center gap-2 shadow-lg shadow-white/5">
                        <svg viewBox="0 0 384 512" fill="currentColor" className="w-4 h-4 mb-0.5">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-22-101.9-56.1-102.6-91.8zM248.2 86C261 68 266 43 263.1 18.6c-24.3 1.9-52 17-68 40.5-12.7 18.6-18.3 43-15.3 70 26.6 2.2 55.4-23.7 68.4-43.1z" />
                        </svg>
                        App Store
                    </Button>
                </div>
            </div>
        </nav>
    );
}
