import { Button } from '@/components/ui/button'
import { Check, ShieldCheck, ArrowLeft, Star, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdmissions } from '@/context/AdmissionsContext'

export default function Tuition() {
    const { processEnrollment, isProcessing, applicant } = useAdmissions()
    const navigate = useNavigate()

    const handleEnroll = async (planId: string) => {
        if (!applicant.email) {
            alert("Please start your application first.")
            navigate('/apply')
            return
        }

        const result = await processEnrollment(planId)
        if (result.success) {
            navigate('/welcome')
        }
    }

    return (
        <div className="min-h-screen bg-[#020412] text-white font-sans selection:bg-amber-500/30 overflow-x-hidden p-6 md:p-12 relative">
            {/* --- ATMOSPHERE --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[60vw] h-[60vw] bg-indigo-900/10 rounded-full blur-[120px]"></div>
            </div>

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

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold font-heading drop-shadow-2xl"
                    >
                        Invest in Your <span className="text-amber-400">Sovereignty.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-indigo-200/60 text-lg md:text-xl max-w-2xl mx-auto"
                    >
                        Select the tier that matches your ambition. All plans include the 30-Day Money Back Guarantee.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-center">
                    {/* Basic Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col hover:bg-white/10 transition-colors backdrop-blur-sm"
                    >
                        <h3 className="text-xl font-bold text-slate-300 mb-2">Auditor</h3>
                        <p className="text-sm text-slate-500 mb-6">For self-starters needing basic materials.</p>
                        <div className="text-4xl font-bold mb-8">$49<span className="text-lg text-slate-500 font-normal">/mo</span></div>

                        <div className="flex-1 space-y-4 mb-8">
                            <div className="flex gap-3 text-sm text-slate-300"><Check size={18} className="text-slate-500" /> Basic Course Access</div>
                            <div className="flex gap-3 text-sm text-slate-300"><Check size={18} className="text-slate-500" /> Community Read-Only</div>
                            <div className="flex gap-3 text-sm text-slate-300"><Check size={18} className="text-slate-500" /> Standard Templates</div>
                        </div>
                        <Button onClick={() => handleEnroll('auditor')} variant="outline" className="w-full border-white/10 hover:bg-white/10 h-12">Select Plan</Button>
                    </motion.div>

                    {/* Featured Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-b from-[#1e2448] to-[#0a0f29] border border-amber-500/50 rounded-3xl p-8 flex flex-col relative shadow-[0_0_50px_rgba(245,158,11,0.15)] transform md:scale-110 z-10"
                    >
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-2">
                            <Star size={12} fill="black" /> Most Popular
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">Full Semester</h3>
                        <p className="text-sm text-indigo-200/70 mb-6">Complete access to AI & Strategy.</p>
                        <div className="text-5xl font-bold mb-8 text-amber-400">$97<span className="text-lg text-slate-400 font-normal">/mo</span></div>

                        <div className="flex-1 space-y-4 mb-10">
                            {[
                                "All Courses & Content",
                                "Credit Lab AI (3 Reports/mo)",
                                "24/7 AI Dean Access",
                                "Dispute Generator Pro",
                                "Live Weekly Calls"
                            ].map((item, i) => (
                                <div key={i} className="flex gap-3 text-sm text-white items-center">
                                    <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400"><Check size={12} /></div>
                                    {item}
                                </div>
                            ))}
                        </div>
                        <Button onClick={() => handleEnroll('semester')} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold h-14 text-lg shadow-lg">Enroll Now</Button>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col hover:bg-white/10 transition-colors backdrop-blur-sm"
                    >
                        <h3 className="text-xl font-bold text-slate-300 mb-2">Founders Club</h3>
                        <p className="text-sm text-slate-500 mb-6">For business builders & scaling.</p>
                        <div className="text-4xl font-bold mb-8">$297<span className="text-lg text-slate-500 font-normal">/mo</span></div>

                        <div className="flex-1 space-y-4 mb-8">
                            <div className="flex gap-3 text-sm text-slate-300"><Check size={18} className="text-amber-500" /> Everything in Semester</div>
                            <div className="flex gap-3 text-sm text-slate-300"><Check size={18} className="text-amber-500" /> Business Credit Suite</div>
                            <div className="flex gap-3 text-sm text-slate-300"><Check size={18} className="text-amber-500" /> Unlimited Lab Runs</div>
                            <div className="flex gap-3 text-sm text-slate-300"><Check size={18} className="text-amber-500" /> Priority VIP Support</div>
                        </div>
                        <Button onClick={() => handleEnroll('founders')} variant="outline" className="w-full border-white/10 hover:bg-white/10 h-12">Select Plan</Button>
                    </motion.div>
                </div>

                <div className="mt-20 border-t border-white/5 pt-8 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50">
                    {/* Trust Logos Placeholder */}
                    <div className="h-8 bg-white/10 rounded animate-pulse"></div>
                    <div className="h-8 bg-white/10 rounded animate-pulse"></div>
                    <div className="h-8 bg-white/10 rounded animate-pulse"></div>
                    <div className="h-8 bg-white/10 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}
