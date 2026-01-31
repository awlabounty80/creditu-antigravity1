import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight, Printer, Crown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdmissions } from '@/context/AdmissionsContext'

export default function WelcomeFreshman() {
    const { applicant } = useAdmissions()
    const navigate = useNavigate()

    // Redirect if no applicant data (prevent direct access)
    useEffect(() => {
        if (!applicant.email) {
            navigate('/')
        }
    }, [applicant, navigate])

    return (
        <div className="min-h-screen bg-[#020412] text-white font-sans selection:bg-amber-500/30 flex items-center justify-center p-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">

            <div className="max-w-2xl w-full">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="text-center mb-8 space-y-4"
                >
                    <div className="inline-flex p-4 rounded-full bg-emerald-500/10 mb-4 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black font-heading text-white tracking-tight">
                        YOU'RE IN.
                    </h1>
                    <p className="text-xl text-indigo-200/60">
                        Welcome to the Class of {new Date().getFullYear()}.
                    </p>
                </motion.div>

                {/* ADMISSION TICKET */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="bg-white text-black rounded-lg overflow-hidden shadow-2xl relative"
                >
                    {/* Ticket Header */}
                    <div className="bg-slate-900 text-white p-6 flex justify-between items-center border-b border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                        <div className="flex items-center gap-3 relative z-10">
                            <Crown className="text-amber-400 w-6 h-6" />
                            <div>
                                <div className="font-bold tracking-widest text-xs uppercase text-slate-400">Freshman Admission</div>
                                <div className="font-heading font-black text-xl">CREDIT UNIVERSITY</div>
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <div className="text-[10px] uppercase text-slate-500">Semester</div>
                            <div className="font-mono font-bold text-amber-400">FALL '26</div>
                        </div>
                    </div>

                    {/* Ticket Body */}
                    <div className="p-8 space-y-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Student Name</div>
                                <div className="text-2xl font-bold font-heading uppercase">{applicant.firstName} {applicant.lastName}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Student ID</div>
                                <div className="text-2xl font-mono font-bold text-indigo-600">
                                    {applicant.studentId || "PENDING"}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Plan Level</div>
                                <div className="font-bold flex items-center gap-2">
                                    {applicant.plan === 'founders' ? 'FOUNDERS CLUB' : 'FULL SEMESTER'}
                                    {applicant.plan === 'founders' && <Crown size={14} className="text-amber-500 fill-amber-500" />}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Status</div>
                                <div className="font-bold text-emerald-600 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                                    ACTIVE
                                </div>
                            </div>
                        </div>

                        {/* Barcode Strip */}
                        <div className="border-t-2 border-dashed border-slate-200 pt-6 flex justify-between items-end opacity-50">
                            <div className="h-12 w-full max-w-[200px] bg-black/10 flex items-center justify-center font-mono text-xs">
                                ||| || ||| | |||| ||
                            </div>
                            <Printer className="w-4 h-4" />
                        </div>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 flex flex-col items-center gap-4"
                >
                    <Link to="/gate" className="w-full">
                        <Button className="w-full h-16 text-xl font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 rounded-xl">
                            Enter The Gate <ArrowRight className="ml-2" />
                        </Button>
                    </Link>
                    <div className="text-xs text-slate-500">
                        Check your email ({applicant.email}) for your temporary password.
                    </div>
                </motion.div>

            </div>
        </div>
    )
}
