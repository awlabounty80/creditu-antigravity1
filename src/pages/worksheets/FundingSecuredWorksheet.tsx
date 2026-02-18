import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, CheckCircle, XCircle, AlertTriangle, ArrowLeft, BarChart3, TrendingUp, Shield, Zap } from 'lucide-react';
import { CreditULogo } from '@/components/common/CreditULogo';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function FundingSecuredWorksheet() {
    const navigate = useNavigate();

    // Metric State
    const [score, setScore] = useState('');
    const [inquiries, setInquiries] = useState(0);
    const [utilization, setUtilization] = useState(0);
    const [derogs, setDerogs] = useState(0);
    const [age] = useState(0);

    // Calculated Status
    const [status, setStatus] = useState<any>({ label: 'ENTER DATA', color: 'bg-slate-200', text: 'text-slate-500' });

    useEffect(() => {
        const s = parseInt(score) || 0;

        if (s === 0) {
            setStatus({ label: 'WAITING FOR INPUT', color: 'bg-slate-100', text: 'text-slate-400' });
            return;
        }

        if (derogs > 0 || utilization > 50 || s < 620) {
            setStatus({ label: 'HIGH RISK // DO NOT APPLY', color: 'bg-red-100 border-red-500', text: 'text-red-600', icon: XCircle, gradient: 'from-red-500/20 to-red-600/20' });
        } else if (s >= 720 && utilization < 10 && inquiries < 2) {
            setStatus({ label: 'ELITE // FUNDING SECURED', color: 'bg-emerald-100 border-emerald-500', text: 'text-emerald-600', icon: CheckCircle, gradient: 'from-emerald-500/20 to-green-600/20' });
        } else if (s >= 660 && utilization < 30 && inquiries < 4) {
            setStatus({ label: 'POSITIONING // PROCEED WITH CAUTION', color: 'bg-amber-100 border-amber-500', text: 'text-amber-600', icon: AlertTriangle, gradient: 'from-amber-500/20 to-yellow-600/20' });
        } else {
            setStatus({ label: 'SUB-OPTIMAL // FIX BEFORE APPLYING', color: 'bg-orange-100 border-orange-500', text: 'text-orange-600', icon: AlertTriangle, gradient: 'from-orange-500/20 to-amber-600/20' });
        }

    }, [score, inquiries, utilization, derogs, age]);

    const getDetailedRecommendations = () => {
        const recs = [];
        const s = parseInt(score) || 0;

        if (derogs > 0) {
            recs.push({
                title: 'CRITICAL: Remove Negative Items',
                desc: 'Your profile has derogatory marks. These are the #1 reason for automatic denials. Go to the Credit Lab and use the Factual Dispute templates.',
                type: 'danger',
                icon: <XCircle className="w-5 h-5 text-red-500" />
            });
        }

        if (utilization > 10) {
            recs.push({
                title: 'Aggressive Debt Paydown',
                desc: `Your utilization is at ${utilization}%. To unlock Elite funding, you MUST be under 10%. Consider the "Balance Transfer" strategy or the "Weekly Payment" loop.`,
                type: 'warning',
                icon: <TrendingUp className="w-5 h-5 text-amber-500" />
            });
        }

        if (inquiries >= 3) {
            recs.push({
                title: 'Cool Down Period Required',
                desc: `${inquiries} inquiries is too high for top-tier lenders (Chase/Amex). Halt all applications for 90 days to let these age or use the "Inquiry Decryptor" protocol.`,
                type: 'info',
                icon: <Zap className="w-5 h-5 text-blue-500" />
            });
        }

        if (s > 0 && s < 700) {
            recs.push({
                title: 'Optimize Score for T-700',
                desc: 'You are below the magical 700 threshold. Add 2 New AU (Authorized User) tradelines or optimize your reporting dates to boost 20-40 points quickly.',
                type: 'neutral',
                icon: <BarChart3 className="w-5 h-5 text-slate-500" />
            });
        }

        if (recs.length === 0 && s >= 720) {
            recs.push({
                title: 'UNLOCKED: High Limit Sequence',
                desc: 'Your profile is perfect. Start with the Chase Trifecta then move to Amex Business cards. Your data points suggest $25k+ starting limits.',
                type: 'success',
                icon: <CheckCircle className="w-5 h-5 text-emerald-500" />
            });
        }

        return recs;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 text-slate-900 font-sans p-8 md:p-16 print:bg-white print:p-0 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none print:hidden">
                <motion.div
                    className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex justify-between items-start border-b-4 border-slate-900 pb-6 mb-8 print:border-black relative z-10"
            >
                <div className="flex items-center gap-6">
                    <CreditULogo className="w-16 h-16 md:w-20 md:h-20" variant="navy" showShield={false} />
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-2 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                            Approval Readiness Check
                        </h1>
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Funding Secured Protocol // C-003
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs font-mono border-2 border-slate-900 px-3 py-1.5 inline-block mb-2 uppercase font-bold bg-slate-900 text-white">
                        Pre-Flight Check
                    </div>
                    <p className="text-sm font-black text-blue-600">DAY 03</p>
                </div>
            </motion.div>

            {/* Print Controls */}
            <div className="fixed top-4 left-4 print:hidden z-50">
                <Button onClick={() => navigate('/dashboard/orientation')} variant="ghost" className="text-slate-500 hover:text-slate-900 gap-2 hover:bg-white/80 backdrop-blur-sm">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
            </div>
            <div className="fixed top-4 right-4 print:hidden z-50">
                <Button onClick={() => window.print()} className="bg-slate-900 text-white hover:bg-slate-700 gap-2 shadow-lg font-bold">
                    <Printer className="w-4 h-4" /> Print Report
                </Button>
            </div>

            <div className="max-w-4xl mx-auto grid gap-8 relative z-10">

                {/* 1. STATUS INDICATOR */}
                <AnimatePresence mode="wait">
                    <motion.section
                        key={status.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className={`p-8 md:p-12 rounded-2xl border-2 transition-all duration-500 flex flex-col items-center justify-center text-center gap-4 ${status.color} ${status.color.includes('border') ? '' : 'border-transparent'} relative overflow-hidden shadow-xl`}
                    >
                        {status.gradient && (
                            <div className={`absolute inset-0 bg-gradient-to-br ${status.gradient} opacity-50`} />
                        )}

                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="relative z-10"
                        >
                            {status.icon && <status.icon className={`w-20 h-20 ${status.text}`} strokeWidth={2.5} />}
                        </motion.div>

                        <h2 className={`text-3xl md:text-5xl font-black uppercase tracking-tighter ${status.text} relative z-10`}>
                            {status.label}
                        </h2>
                        <p className="text-sm font-bold uppercase tracking-widest opacity-60 relative z-10">
                            Based on live metrics below
                        </p>
                    </motion.section>
                </AnimatePresence>

                {/* 2. METRICS INPUT */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border-2 border-slate-200 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8 print:border-black print:bg-white"
                >
                    {/* CREDIT SCORE */}
                    <div>
                        <label className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                FICO 8 Score (Middle)
                            </span>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${parseInt(score) >= 700 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                Target: 700+
                            </span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={score}
                                onChange={e => setScore(e.target.value)}
                                className="w-full px-4 py-3 text-3xl font-black border-2 rounded-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                                placeholder="000"
                            />
                        </div>
                    </div>

                    {/* UTILIZATION */}
                    <div>
                        <label className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Total Utilization %
                            </span>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${utilization < 10 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                Target: &lt;10%
                            </span>
                        </label>
                        <div className="relative">
                            <div className="absolute right-4 top-3 text-slate-400 font-black text-2xl">%</div>
                            <input
                                type="number"
                                value={utilization}
                                onChange={e => setUtilization(Number(e.target.value))}
                                className="w-full px-4 py-3 text-3xl font-black border-2 rounded-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                                placeholder="00"
                            />
                        </div>
                    </div>

                    {/* INQUIRIES */}
                    <div>
                        <label className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                Inquiries (Last 6mo)
                            </span>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${inquiries < 2 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                Target: &lt;2
                            </span>
                        </label>
                        <div className="flex gap-2">
                            {[0, 1, 2, 3, 4, 5].map(n => (
                                <motion.button
                                    key={n}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setInquiries(n)}
                                    className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${inquiries === n ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}
                                >
                                    {n}{n === 5 ? '+' : ''}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* DEROGATORIES */}
                    <div>
                        <label className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Negative Items
                            </span>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${derogs === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                Target: 0
                            </span>
                        </label>
                        <div className="flex gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setDerogs(0)}
                                className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${derogs === 0 ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                            >
                                NONE
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setDerogs(1)}
                                className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${derogs > 0 ? 'bg-red-500 text-white border-red-500 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                            >
                                YES
                            </motion.button>
                        </div>
                    </div>
                </motion.section>

                {/* 3. ACTION PLAN */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <h3 className="text-xl md:text-2xl font-black uppercase mb-4 flex items-center gap-2">
                        <Shield className="w-6 h-6" />
                        Strategic Correction Plan
                    </h3>
                    <div className="bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl overflow-hidden print:border-black print:bg-white shadow-lg">
                        <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 border-b-2 border-slate-200 flex justify-between items-center print:bg-transparent print:border-black">
                            <span className="font-bold text-sm uppercase text-slate-500">Based on your status:</span>
                            <span className={`font-black uppercase ${status.text} text-lg`}>{status.label.split('//')[0]}</span>
                        </div>
                        <div className="p-8">
                            <AnimatePresence mode="wait">
                                {status.label.includes('ELITE') ? (
                                    <motion.div
                                        key="elite"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-4"
                                    >
                                        <p className="flex items-center gap-3 font-medium text-emerald-800 text-lg"><CheckCircle className="w-6 h-6 flex-shrink-0" /> Your profile is primed for high-limit funding.</p>
                                        <p className="flex items-center gap-3 font-medium text-emerald-800 text-lg"><CheckCircle className="w-6 h-6 flex-shrink-0" /> Execute the "Sequence" immediately.</p>
                                        <p className="flex items-center gap-3 font-medium text-emerald-800 text-lg"><CheckCircle className="w-6 h-6 flex-shrink-0" /> You are in the top tier of applicants.</p>
                                    </motion.div>
                                ) : status.label.includes('RISK') ? (
                                    <motion.div
                                        key="risk"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-4"
                                    >
                                        <p className="flex items-center gap-3 font-medium text-red-800 text-lg"><XCircle className="w-6 h-6 flex-shrink-0" /> STOP applying. You will be denied.</p>
                                        <p className="flex items-center gap-3 font-medium text-red-800 text-lg"><XCircle className="w-6 h-6 flex-shrink-0" /> Focus 100% on removing negative items (Credit Lab).</p>
                                        <p className="flex items-center gap-3 font-medium text-red-800 text-lg"><XCircle className="w-6 h-6 flex-shrink-0" /> Do not proceed until metrics improve.</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="caution"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-4"
                                    >
                                        <p className="flex items-center gap-3 font-medium text-amber-800 text-lg"><AlertTriangle className="w-6 h-6 flex-shrink-0" /> You are close, but specific metrics need work.</p>
                                        <p className="flex items-center gap-3 font-medium text-amber-800 text-lg"><AlertTriangle className="w-6 h-6 flex-shrink-0" /> Pay down utilization to &lt;10% before applying.</p>
                                        <p className="flex items-center gap-3 font-medium text-amber-800 text-lg"><AlertTriangle className="w-6 h-6 flex-shrink-0" /> Minimize inquiries for the next 3-6 months.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.section>

                {/* 4. TACTICAL RECOMMENDATIONS */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    <h3 className="text-xl md:text-2xl font-black uppercase mb-4 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                        Tactical Recommendations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence mode="popLayout">
                            {getDetailedRecommendations().map((rec, idx) => (
                                <motion.div
                                    key={rec.title}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`p-6 rounded-xl border-2 shadow-sm relative overflow-hidden flex flex-col gap-3 bg-white ${rec.type === 'danger' ? 'border-red-200' :
                                        rec.type === 'warning' ? 'border-amber-200' :
                                            rec.type === 'success' ? 'border-emerald-200' :
                                                'border-slate-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${rec.type === 'danger' ? 'bg-red-50' :
                                            rec.type === 'warning' ? 'bg-amber-50' :
                                                rec.type === 'success' ? 'bg-emerald-50' :
                                                    'bg-slate-50'
                                            }`}>
                                            {rec.icon}
                                        </div>
                                        <h4 className={`font-black uppercase tracking-tight ${rec.type === 'danger' ? 'text-red-900' :
                                            rec.type === 'warning' ? 'text-amber-900' :
                                                rec.type === 'success' ? 'text-emerald-900' :
                                                    'text-slate-900'
                                            }`}>
                                            {rec.title}
                                        </h4>
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                        {rec.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {(parseInt(score) === 0 || score === '') && (
                            <div className="col-span-full py-12 text-center bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Waiting for metric input data...</p>
                            </div>
                        )}
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
