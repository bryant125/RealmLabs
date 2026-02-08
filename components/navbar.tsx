import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

const navLinks = [
    { name: "Use Cases", href: "#" },
    { name: "Features", href: "#features" },
    { name: "Support", href: "#" },
];

export function Navbar() {
    return (
        <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
            <div className="flex items-center gap-2 p-2 pl-4 pr-2 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
                <Logo />

                <div className="hidden md:flex items-center gap-1 ml-4 mr-2">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-2 ml-2">
                    <Button className="h-9 rounded-full bg-neon text-black hover:bg-neon/90 font-semibold px-5">
                        Download
                    </Button>
                </div>
            </div>
        </nav>
    );
}
