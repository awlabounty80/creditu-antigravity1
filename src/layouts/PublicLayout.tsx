import { Outlet, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CreditULogo } from '@/components/common/CreditULogo'

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-credit-royal-500/30">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <CreditULogo className="w-12 h-12" showShield={false} iconClassName="w-10 h-10" />
                        <div className="flex flex-col">
                            <span className="font-bold text-xl tracking-tight text-white leading-none">CREDIT U</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 group-hover:text-credit-royal-400 transition-colors">University AI</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                        <Link to="/about" className="hover:text-white transition-colors">About</Link>
                        <Link to="/how-it-works" className="hover:text-white transition-colors">How it Works</Link>
                        <Link to="/pricing" className="hover:text-white transition-colors">Tuition</Link>
                        <Link to="/trust" className="hover:text-white transition-colors">Trust & Safety</Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">
                                Student Login
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="bg-credit-royal-600 hover:bg-credit-royal-500 text-white shadow-lg shadow-credit-royal-900/20 border-t border-white/10">
                                Enroll Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-20">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-slate-950 pt-20 pb-10">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <CreditULogo className="w-5 h-5" variant="gold" showShield={false} iconClassName="w-5 h-5" />
                                <span className="font-bold text-lg">CREDIT U</span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                The world's first AI-governed credit mastery university.
                                Providing the blueprint for generational wealth and financial sovereignty.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Campuses</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link to="#" className="hover:text-credit-royal-400 transition-colors">Credit Lab</Link></li>
                                <li><Link to="#" className="hover:text-credit-royal-400 transition-colors">Vision Center</Link></li>
                                <li><Link to="#" className="hover:text-credit-royal-400 transition-colors">The Dean (AI)</Link></li>
                                <li><Link to="#" className="hover:text-credit-royal-400 transition-colors">Community Hall</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">University</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link to="#" className="hover:text-credit-royal-400 transition-colors">About Us</Link></li>
                                <li><Link to="#" className="hover:text-credit-royal-400 transition-colors">Tuition & Plans</Link></li>
                                <li><Link to="#" className="hover:text-credit-royal-400 transition-colors">Founders Club</Link></li>
                                <li><Link to="#" className="hover:text-credit-royal-400 transition-colors">Contact Admissions</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link to="#" className="hover:text-credit-royal-400 transition-colors">Privacy Policy</Link></li>
                                <li><Link to="#" className="hover:text-credit-royal-400 transition-colors">Terms of Service</Link></li>
                                <li><Link to="#" className="hover:text-credit-royal-400 transition-colors">Student Bill of Rights</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                        <p>&copy; 2024 Credit U University AI. All rights reserved.</p>
                        <p>Designed for Legacy.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
