import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { BadgeCheck, Lock, MousePointer2 } from "lucide-react";

export default function Index() {
    return (
        <div className="min-h-screen bg-[#0033A0] text-white flex flex-col font-sans selection:bg-yellow-400 selection:text-black">

            {/* Navigation */}
            <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl font-black tracking-tight">Credit U</span>
                    </Link>
                    <div className="hidden md:flex gap-6 text-sm font-medium text-white/90">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <Link to="/admissions" className="hover:text-white transition-colors">Admissions</Link>
                        <Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
                        <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                        <Link to="/about" className="hover:text-white transition-colors">About</Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/auth">
                        <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white font-medium">
                            Sign In
                        </Button>
                    </Link>
                    <Link to="/auth">
                        <Button className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 font-bold px-6 shadow-lg shadow-black/20">
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
                {/* Background Decor (Subtle Gradient/Glow) */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#002270]/80 pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center mt-10">

                    {/* Badge/Logo Placeholder */}
                    <div className="mb-8 animate-in fade-in zoom-in duration-700 hover:scale-105 transition-transform cursor-pointer">
                        <img 
                            src="/assets/credit-u-seal.png" 
                            alt="Credit University Seal" 
                            className="w-48 h-48 md:w-64 md:h-64 rounded-full shadow-[0_0_50px_rgba(250,204,21,0.3)] filter drop-shadow-2xl"
                        />
                    </div>

                    {/* Headlines */}
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 drop-shadow-xl">
                        Welcome to The Credit<br />
                        University AI&trade;
                    </h1>

                    <h2 className="text-xl md:text-2xl font-bold text-blue-100 mb-6 max-w-2xl">
                        Where Credit Meets Culture, Legacy, and AI Power.
                    </h2>

                    <p className="text-lg text-blue-200 mb-10 max-w-3xl font-light leading-relaxed">
                        The first HBCU-inspired financial literacy campus powered by AI. Graduate into financial freedom with our proven curriculum.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-5 mb-16">
                        <Link to="/auth">
                            <Button className="h-14 px-8 text-lg bg-yellow-400 text-blue-900 hover:bg-yellow-300 font-bold rounded-xl shadow-xl shadow-yellow-900/20 w-full sm:w-auto">
                                <div className="mr-2 h-5 w-5 bg-blue-900 rounded-full flex items-center justify-center text-yellow-400 text-[10px]">🎓</div>
                                Start Orientation
                            </Button>
                        </Link>
                        <Link to="/auth">
                            <Button variant="outline" className="h-14 px-8 text-lg border-2 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300 font-bold rounded-xl w-full sm:w-auto">
                                <Lock className="mr-2 h-5 w-5" />
                                Explore Credit Tools
                            </Button>
                        </Link>
                    </div>

                    {/* Feature Points */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left md:text-center max-w-5xl w-full mb-12">
                        <div className="flex items-start md:items-center gap-3 md:flex-col">
                            <div className="min-w-6 h-6 rounded-full border border-yellow-400 flex items-center justify-center text-yellow-400 mt-1 md:mt-0">
                                <BadgeCheck className="h-3.5 w-3.5" />
                            </div>
                            <p className="text-sm text-blue-100 font-medium">AI-powered credit education designed for real results</p>
                        </div>
                        <div className="flex items-start md:items-center gap-3 md:flex-col">
                            <div className="min-w-6 h-6 rounded-full border border-yellow-400 flex items-center justify-center text-yellow-400 mt-1 md:mt-0">
                                <BadgeCheck className="h-3.5 w-3.5" />
                            </div>
                            <p className="text-sm text-blue-100 font-medium">Step-by-step courses from Foundation to Senior level</p>
                        </div>
                        <div className="flex items-start md:items-center gap-3 md:flex-col">
                            <div className="min-w-6 h-6 rounded-full border border-yellow-400 flex items-center justify-center text-yellow-400 mt-1 md:mt-0">
                                <BadgeCheck className="h-3.5 w-3.5" />
                            </div>
                            <p className="text-sm text-blue-100 font-medium">Tools, templates, and community support included</p>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="flex flex-col items-center gap-2 animate-bounce opacity-50">
                        <MousePointer2 className="h-5 w-5 text-yellow-400" />
                    </div>

                </div>
            </main>
        </div>
    );
}
