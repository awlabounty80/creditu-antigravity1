import { Button } from '@/components/ui/button'
import { Check, ShieldCheck, ArrowLeft, ArrowRight, Star, Loader2, Sparkles, TrendingUp, Lock } from 'lucide-react'
import { CreditULogo } from '@/components/common/CreditULogo'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdmissions } from '@/context/AdmissionsContext'

const ParticleBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[60vw] h-[60vw] bg-indigo-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[20%] w-[60vw] h-[60vw] bg-amber-900/10 rounded-full blur-[120px]"></div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-1 h-1 bg-amber-400 rounded-full"
                initial={{ opacity: 0, y: 0 }}
                animate={{
                    opacity: [0, 0.4, 0],
                    y: [0, -60]
                }}
                transition={{
                    duration: 5 + Math.random() * 5,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "easeInOut"
                }}
                style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                }}
            />
        ))}
    </div>
);

export default function Tuition() {
    const { processEnrollment, isProcessing, applicant } = useAdmissions()
    const navigate = useNavigate()

    const handleEnroll = async (planId: string) => {
        if (!applicant.email) {
            // If strictly enforcing application first:
            // alert("Please start your application first.")
            // navigate('/apply')
            // return

            // Allow bypassing for now if they are just looking, 
            // but normally we need the applicant context.
            // checks provided copy implies strictly "Invest in Sovereignty" page.
        }

        const result = await processEnrollment(planId)
        if (result.success) {
            navigate('/welcome')
        }
    }

    return (
        <div className="min-h-screen bg-[#020412] text-white font-sans selection:bg-amber-500/30 overflow-x-hidden p-6 md:p-12 relative">
            <ParticleBackground />

            {/* Processing Overlay */}
            {isProcessing && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
                    <Loader2 className="w-16 h-16 text-amber-500 animate-spin mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Securing Your Seat...</h2>
                    <p className="text-slate-400">Verifying credentials and creating student ID.</p>
                </div>
            )}

            <nav className="relative z-50 max-w-7xl mx-auto mb-12 flex justify-between items-center">
                <Link to="/apply" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={16} /> Back to Application
                </Link>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Secure Enrollment</span>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">

                {/* --- HERO UPGRADE --- */}
                <div className="text-center mb-16 space-y-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black tracking-widest uppercase mb-4 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    >
                        🔥 Founders Rate — Limited Time
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black font-heading drop-shadow-2xl uppercase tracking-tight leading-none"
                    >
                        Invest in Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-600">Sovereignty</span>.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-indigo-200/80 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        Start with the <span className="text-white font-bold">FREE 5-Day Credit U Dorm Week™ Reset</span>.<br />
                        Then unlock Full Access before new tiers drop.
                    </motion.p>
                </div>

                <div className="max-w-lg w-full space-y-8">

                    {/* --- SECTION 2: FREE DORM WEEK --- */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-blue-900/40 to-black border border-blue-500/30 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md group hover:border-blue-400/50 transition-all"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-50"><CreditULogo className="w-16 h-16 rotate-12" variant="gold" showShield={false} iconClassName="w-12 h-12" /></div>

                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                                🎓 Start With Dorm Week™
                            </h3>
                            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                                Join our 5-Day Credit U Dorm Week™ Reset — <strong className="text-white">FREE</strong>.<br />
                                Mandatory initiation. Maximum clarity.<br />
                                Orientation just turned into Homecoming.
                            </p>

                            <Link to="/dorm-week">
                                <Button className="w-full bg-[#0a0f29] border border-amber-500/50 hover:bg-amber-500 hover:text-black text-white h-12 rounded-xl font-bold uppercase tracking-wider relative overflow-hidden group/btn shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all duration-300">
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Start Free Dorm Week Reset <ArrowRight className="w-4 h-4" />
                                    </span>
                                    <div className="absolute inset-0 bg-blue-600/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>


                    {/* --- SECTION 3: PRICING CARD --- */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-b from-[#1e2448] to-[#0a0f29] border border-amber-500/50 rounded-3xl p-8 flex flex-col relative shadow-[0_0_50px_rgba(245,158,11,0.15)] w-full transform hover:scale-[1.02] transition-transform duration-300"
                    >
                        {/* Glowing Badge */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-[10px] font-black px-6 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-2 whitespace-nowrap z-20">
                            <Star size={12} fill="black" /> Founders Access
                        </div>

                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50"></div>

                        <h3 className="text-3xl font-bold text-white mb-2 text-center mt-4">Full Access</h3>
                        <p className="text-xs text-indigo-200/70 mb-8 text-center uppercase tracking-widest">Early access pricing before new tiers launch.</p>

                        <div className="flex flex-col items-center justify-center mb-8 relative">
                            {/* Struck Price */}
                            <div className="text-slate-500 text-xl font-medium line-through decoration-slate-600 decoration-2 mb-[-5px] relative">
                                $97.00
                            </div>

                            {/* Main Price */}
                            <div className="flex items-baseline gap-1 relative z-10">
                                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-yellow-600 drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]">
                                    $39.99
                                </span>
                                <span className="text-lg text-slate-400 font-medium">/mo</span>
                            </div>

                            {/* Founder Label */}
                            <div className="absolute -right-16 top-1/2 -translate-y-1/2 hidden md:block">
                                <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] px-2 py-1 rounded rotate-12 inline-block font-bold">
                                    FOUNDER RATE
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 mb-10 pl-2">
                            {[
                                "All Courses (Freshman to Senior)",
                                "Credit Lab AI Tools (Unlimited)",
                                "Dispute Letter Generator Pro",
                                "24/7 AI Dean Support",
                                "Live Weekly Strategy Calls",
                                "Founders Club Community"
                            ].map((item, i) => (
                                <div key={i} className="flex gap-3 text-sm text-white items-start">
                                    <div className="mt-0.5 p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 flex-shrink-0"><Check size={12} strokeWidth={3} /></div>
                                    <span className="leading-tight">{item}</span>
                                </div>
                            ))}
                            <div className="pt-2 text-[10px] text-amber-500/80 font-mono text-center uppercase tracking-wide border-t border-white/5 mt-4">
                                This rate disappears when additional tiers launch.
                            </div>
                        </div>

                        <Button
                            onClick={() => handleEnroll('semester')}
                            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black h-14 text-lg shadow-[0_0_30px_rgba(245,158,11,0.3)] uppercase tracking-widest relative overflow-hidden group"
                        >
                            <span className="relative z-10">Enroll Now</span>
                            <div className="absolute inset-0 bg-white/40 blur-lg -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                        </Button>
                    </motion.div>

                    {/* --- SECTION 5: FUTURE TIER TEASER --- */}
                    <div className="text-center space-y-6 pt-8 pb-12 opacity-60 hover:opacity-100 transition-opacity duration-500">
                        <div className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Coming Soon</div>
                        <div className="space-y-3 text-sm font-medium text-slate-400">
                            <div className="flex items-center justify-center gap-2"><Lock className="w-3 h-3" /> Elite Tier</div>
                            <div className="flex items-center justify-center gap-2"><Lock className="w-3 h-3" /> Business Builder Tier</div>
                            <div className="flex items-center justify-center gap-2"><Lock className="w-3 h-3" /> Executive Sovereignty Tier</div>
                        </div>
                        <p className="text-[10px] text-amber-500/80 font-mono mt-4">
                            ⚠ LOCK IN FOUNDER PRICING NOW
                        </p>
                    </div>

                </div>

                {/* --- FOOTER TRUST LINE --- */}
                <div className="mt-12 text-center border-t border-white/5 pt-12 w-full max-w-4xl opacity-50">
                    <p className="text-xs md:text-sm font-light tracking-[0.2em] text-slate-400 uppercase leading-loose mb-8">
                        Built for ownership. &nbsp;•&nbsp; Built for strategy. &nbsp;•&nbsp; Built for generational intelligence.
                    </p>

                    {/* --- DEV BYPASS --- */}
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-[10px] text-amber-500/50 font-mono uppercase tracking-[0.2em]">Testing fallback:</p>
                        <Link to="/welcome">
                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-amber-500 text-[10px] font-bold uppercase tracking-widest border border-white/5 bg-white/5">
                                [DEV] Bypass Email Wait & View ID Card
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}
