import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight, Printer, School } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmissions } from '@/context/AdmissionsContext'

export default function WelcomeFreshman() {
    const { applicant } = useAdmissions()

    // State Machine: 'intro' | 'dean' | 'card'
    const [viewState, setViewState] = useState<'intro' | 'dean' | 'card'>('intro')

    // Redirect if no applicant data (prevent direct access)
    // TEMPORARILY DISABLED FOR TESTING (Uncomment in prod)
    /*
    useEffect(() => {
        if (!applicant.email) {
            navigate('/')
        }
    }, [applicant, navigate])
    */

    const handleIntroEnded = () => {
        setViewState('dean')
    }

    const handleDeanEnded = () => {
        setViewState('card')
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans overflow-hidden flex flex-col items-center justify-center relative">

            <AnimatePresence mode="wait">

                {/* STATE 1: INTRO VIDEO (Using logo-animated as placeholder for Part 1) */}
                {viewState === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
                    >
                        <video
                            autoPlay
                            muted // Muted needed for autoplay usually, but we want sound. User might need to click.
                            playsInline
                            className="w-full h-full object-cover opacity-80"
                            onEnded={handleIntroEnded}
                            // Video 1 (Intro)
                            src="/assets/dean-welcome-v2.mp4"
                        />
                        <button
                            onClick={handleIntroEnded}
                            className="absolute bottom-10 right-10 text-white/50 hover:text-white text-xs uppercase tracking-widest"
                        >
                            Skip Intro
                        </button>
                    </motion.div>
                )}

                {/* STATE 2: DEAN WELCOME (Part 2) */}
                {viewState === 'dean' && (
                    <motion.div
                        key="dean"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
                    >
                        <video
                            autoPlay
                            className="w-full h-full object-cover"
                            onEnded={handleDeanEnded}
                            // Video 2 (Dean)
                            src="/assets/dean-part-2.mp4"
                        />
                        <div className="absolute bottom-0 left-0 w-full p-10 bg-gradient-to-t from-black via-black/50 to-transparent">
                            <h2 className="text-4xl font-heading font-bold text-amber-500 mb-2">The Dean</h2>
                            <p className="text-xl text-white/80">Orientation Protocol Initiated...</p>
                        </div>
                        <button
                            onClick={handleDeanEnded}
                            className="absolute bottom-10 right-10 text-white/50 hover:text-white text-xs uppercase tracking-widest z-50"
                        >
                            Skip Transmission
                        </button>
                    </motion.div>
                )}

                {/* STATE 3: ID CARD REVEAL */}
                {viewState === 'card' && (
                    <motion.div
                        key="card"
                        className="max-w-2xl w-full relative z-10 p-6"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                    >
                        <div className="text-center mb-8 space-y-4">
                            <div className="inline-flex p-4 rounded-full bg-emerald-500/10 mb-4 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black font-heading text-white tracking-tight">
                                YOU'RE IN.
                            </h1>
                            <p className="text-xl text-indigo-200/60">
                                Welcome to the Class of {new Date().getFullYear()}.
                            </p>
                        </div>

                        {/* FINAL ID CARD */}
                        <div className="w-full max-w-md mx-auto font-sans shadow-2xl rounded-xl overflow-hidden bg-white text-slate-900 border border-slate-200 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                            {/* Header */}
                            <div className="bg-[#0f172a] p-6 flex justify-between items-center relative overflow-hidden">
                                <div className="relative z-10 flex items-start gap-4">
                                    <div className="mt-1">
                                        <School className="text-amber-500" size={32} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-0.5">Freshman Admission</div>
                                        <div className="text-xl font-bold text-white tracking-wide font-heading">CREDIT UNIVERSITY</div>
                                    </div>
                                </div>
                                <div className="text-right relative z-10">
                                    <div className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-0.5">Semester</div>
                                    <div className="text-lg font-bold text-amber-400">FALL '26</div>
                                </div>

                                {/* Background Decor */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -translate-y-10 translate-x-10 pointer-events-none"></div>
                            </div>

                            {/* Body */}
                            <div className="p-8 relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4 mb-8">
                                    {/* Name */}
                                    <div>
                                        <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Student Name</div>
                                        <div className="text-2xl font-bold text-black uppercase tracking-tight leading-none bg-slate-100 p-2 rounded">
                                            {applicant.firstName || 'GUEST'} <br />{applicant.lastName || 'STUDENT'}
                                        </div>
                                    </div>

                                    {/* Student ID */}
                                    <div className="md:text-right">
                                        <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Student ID</div>
                                        <div className="text-lg font-bold text-indigo-600 font-mono tracking-wider">
                                            {applicant.studentId || "CU-2026-X892"}
                                        </div>
                                    </div>

                                    {/* Plan Level */}
                                    <div>
                                        <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Plan Level</div>
                                        <div className="text-sm font-bold text-black uppercase">
                                            FULL SEMESTER
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="md:text-right">
                                        <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Status</div>
                                        <div className="text-sm font-bold text-emerald-600 uppercase flex items-center justify-end gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            Active
                                        </div>
                                    </div>
                                </div>

                                {/* Footer / Barcode Area */}
                                <div className="flex justify-between items-end border-t border-dashed border-slate-200 pt-6 mt-4">
                                    {/* Fake Barcode */}
                                    <div className="h-8 flex items-end gap-[2px] opacity-40">
                                        {[...Array(20)].map((_, i) => (
                                            <div key={i} className={`bg-black w-[${Math.random() > 0.5 ? '2px' : '4px'}] h-full`}></div>
                                        ))}
                                    </div>

                                    <Printer className="text-slate-300" size={24} />
                                </div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-12 flex flex-col items-center gap-4"
                        >
                            <Link to="/gate" className="w-full">
                                <Button className="w-full h-16 text-xl font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 rounded-xl">
                                    Proceed to Campus <ArrowRight className="ml-2" />
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
