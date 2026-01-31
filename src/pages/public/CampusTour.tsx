import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShieldCheck, GraduationCap, TrendingUp, Sparkles, BrainCircuit } from 'lucide-react'

// Sub-components for sections to keep things clean
const HeroSection = () => (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-credit-royal-600/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px]"></div>

        <div className="relative container mx-auto px-6 text-center space-y-8 max-w-5xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-credit-royal-300 animate-fade-in-up">
                <Sparkles size={12} />
                <span>Now Enrolling: Fall Semester 2026</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight animate-fade-in-up delay-100">
                Master Your Credit.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-credit-royal-300 via-indigo-200 to-white">Build Your Legacy.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                The world's first AI-governed financial university. We don't just fix credit—we teach you to think like a lender, behave like an owner, and grow like an institution.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                <Link to="/signup">
                    <Button size="lg" className="h-14 px-8 text-lg bg-credit-royal-600 hover:bg-credit-royal-500 shadow-xl shadow-credit-royal-900/20 border-t border-white/10 rounded-full">
                        Enroll Now
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </Link>
                <Link to="/how-it-works">
                    <Button size="lg" variant="ghost" className="h-14 px-8 text-lg text-slate-300 hover:text-white rounded-full">
                        Explore the Campus
                    </Button>
                </Link>
            </div>

            <div className="pt-12 grid grid-cols-3 gap-8 text-center text-slate-500 text-sm animate-fade-in-up delay-400 border-t border-white/5 mt-12">
                <div>
                    <span className="block text-2xl font-bold text-white mb-1">AI-Powered</span>
                    24/7 Guidance
                </div>
                <div>
                    <span className="block text-2xl font-bold text-white mb-1">Bank-Grade</span>
                    Security & Privacy
                </div>
                <div>
                    <span className="block text-2xl font-bold text-white mb-1">Credit Lab</span>
                    Bureau-Aware Analysis
                </div>
            </div>
        </div>
    </div>
)

const FeaturesGrid = () => (
    <section className="py-24 bg-slate-950 relative">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white">An Elite Financial Education</h2>
                <p className="text-slate-400">
                    Credit U isn't an app. It's a campus. Every hall is designed to elevate your financial intelligence and capability.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 bg-credit-royal-500/20 rounded-xl flex items-center justify-center mb-6 text-credit-royal-300 group-hover:scale-110 transition-transform">
                        <TrendingUp size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">The Credit Lab</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Upload your report and let our AI dissect it with lender-grade precision. Generate dispute letters, simulator scenarios, and actionable repayment plans.
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 text-emerald-300 group-hover:scale-110 transition-transform">
                        <GraduationCap size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">The Curriculum</h3>
                    <p className="text-slate-400 leading-relaxed">
                        From "Freshman Orientation" to "Dr. of Credit." Earn credits, unlock badges, and master the hidden language of the financial elite.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 text-indigo-300 group-hover:scale-110 transition-transform">
                        <BrainCircuit size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">The Dean (AI)</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Your personal financial strategist. "The Dean" watches your progress, offers encouragement, and provides context-aware advice when you get stuck.
                    </p>
                </div>
            </div>
        </div>
    </section>
)

const TrustSection = () => (
    <section className="py-24 border-y border-white/5 bg-slate-900/50">
        <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 mb-8 text-emerald-400 bg-emerald-950/30 px-4 py-2 rounded-full border border-emerald-900/50">
                <ShieldCheck size={16} />
                <span className="text-sm font-medium">Bank-Grade Security</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Safe. Secure. Sovereign.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-12">
                Your data is yours. We use enterprise-grade encryption and strict access controls.
                We never sell your data to lenders. You are the customer, not the product.
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Placeholders for logos - text for now to avoid broken images */}
                <span className="text-xl font-bold text-slate-500">256-Bit SSL</span>
                <span className="text-xl font-bold text-slate-500">SOC2 Compliant</span>
                <span className="text-xl font-bold text-slate-500">GDPR Ready</span>
            </div>
        </div>
    </section>
)

export default function CampusTour() {
    return (
        <div className="bg-slate-950 min-h-screen">
            <HeroSection />
            <FeaturesGrid />
            <TrustSection />
            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-credit-royal-900/20"></div>
                <div className="relative container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to Start Your Semester?</h2>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                        Join thousands of students building their financial legacy today.
                    </p>
                    <Link to="/apply">
                        <Button size="lg" className="h-16 px-12 text-xl bg-white text-credit-royal-900 hover:bg-slate-100 shadow-2xl rounded-full font-bold">
                            Apply for Admission
                        </Button>
                    </Link>
                    <p className="mt-8 text-sm text-slate-500">No credit card required for Freshman Orientation.</p>
                </div>
            </section>
        </div>
    )
}
