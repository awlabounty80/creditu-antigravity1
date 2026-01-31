import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Crown, CheckCircle2, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdmissions } from '@/context/AdmissionsContext'

export default function Admissions() {
    const navigate = useNavigate()
    const { applicant, updateApplicant } = useAdmissions()

    const handleProceed = () => {
        // In real app, validate fields here
        if (!applicant.firstName || !applicant.email) {
            alert("Please complete all required fields.")
            return
        }
        navigate('/tuition')
    }

    return (
        <div className="min-h-screen bg-[#020412] text-white font-sans selection:bg-amber-500/30 overflow-x-hidden relative">

            {/* --- ATMOSPHERE --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-900/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-amber-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
            </div>

            <nav className="relative z-50 p-6 flex justify-between items-center max-w-7xl mx-auto">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-white/5 border border-white/10 p-2 rounded-lg backdrop-blur-md group-hover:bg-white/10 transition-all">
                        <Crown className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="font-heading font-bold tracking-tight">CREDIT U</span>
                </Link>
                <Link to="/gate">
                    <Button variant="ghost" className="text-slate-400 hover:text-white">Back to Gate</Button>
                </Link>
            </nav>

            <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-6 lg:p-12 items-center min-h-[85vh]">

                {/* Left: Value Prop */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest">
                        Fall 2026 Enrollment Open
                    </div>

                    <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight drop-shadow-2xl">
                        Begin Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Dynasty.</span>
                    </h1>

                    <p className="text-xl text-indigo-200/80 leading-relaxed font-light max-w-lg">
                        You are applying to the world's premier financial intelligence university.
                        This is an induction into a new class of wealth builders.
                    </p>

                    <div className="grid gap-4 py-4">
                        {[
                            "Full Access to 'The Credit Lab' AI",
                            "Personalized Wealth Strategy",
                            "Business Funding Certification",
                            "Exclusive Alumni Network"
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl backdrop-blur-sm"
                            >
                                <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-400">
                                    <CheckCircle2 size={18} />
                                </div>
                                <span className="font-medium text-slate-200">{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right: Application Form */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    <Card className="bg-[#0a0f29]/80 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-indigo-500"></div>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-heading text-white">New Student Application</CardTitle>
                            <CardDescription className="text-slate-400">Secure your spot in the incoming class.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">First Name</Label>
                                    <Input
                                        placeholder="Enter first name"
                                        className="bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus:border-amber-500/50 transition-colors"
                                        value={applicant.firstName}
                                        onChange={(e) => updateApplicant({ firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Last Name</Label>
                                    <Input
                                        placeholder="Enter last name"
                                        className="bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus:border-amber-500/50 transition-colors"
                                        value={applicant.lastName}
                                        onChange={(e) => updateApplicant({ lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Email Address</Label>
                                <Input
                                    placeholder="name@example.com"
                                    type="email"
                                    className="bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus:border-amber-500/50 transition-colors"
                                    value={applicant.email}
                                    onChange={(e) => updateApplicant({ email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Primary Goal</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                    value={applicant.goal}
                                    onChange={(e) => updateApplicant({ goal: e.target.value })}
                                >
                                    <option value="">Select a goal...</option>
                                    <option value="Fix Personal Credit">Fix Personal Credit</option>
                                    <option value="Build Business Credit">Build Business Credit</option>
                                    <option value="Buy a Home">Buy a Home</option>
                                    <option value="General Wealth Building">General Wealth Building</option>
                                </select>
                            </div>

                            <div className="pt-4">
                                <Button
                                    className="w-full h-14 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold text-lg shadow-lg shadow-amber-900/20"
                                    onClick={handleProceed}
                                >
                                    Proceed to Tuition <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                            <p className="text-xs text-center text-slate-500">
                                By proceeding, you agree to our Code of Conduct.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

            </div>
        </div>
    )
}
