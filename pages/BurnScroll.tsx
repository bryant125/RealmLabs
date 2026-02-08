import { Navbar } from "@/components/burnscroll/navbar";
import { Hero } from "@/components/burnscroll/hero";
import { HowItWorks } from "@/components/burnscroll/how-it-works";
import { Stats } from "@/components/burnscroll/stats";
import { Features } from "@/components/burnscroll/features";
import { Benefits } from "@/components/burnscroll/benefits";
import { Footer } from "@/components/burnscroll/footer";

const BurnScroll = () => {
    return (
        <div className="bg-black min-h-screen text-white font-sans selection:bg-neon selection:text-black">
            <Navbar />
            <main>
                <Hero />
                <HowItWorks />
                <Stats />
                <Features />
                <Benefits />
            </main>
            <Footer />
        </div>
    );
};

export default BurnScroll;
