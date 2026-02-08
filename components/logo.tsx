import { Link } from "react-router-dom";

export const Logo = () => {
    return (
        <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 group-hover:scale-110 transition-transform duration-300">
                <img
                    src="/logo.jpg"
                    alt="BurnScroll Logo"
                    className="absolute inset-0 w-full h-full object-contain rounded-full"
                />
            </div>
            <span className="text-xl font-bold font-outfit tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neon to-white">
                BurnScroll
            </span>
        </Link>
    );
};
