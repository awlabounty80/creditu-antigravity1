import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft, Target, Lock, Calendar, CreditCard, Activity, ShieldAlert, TrendingUp, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditULogo } from '@/components/common/CreditULogo';

export default function ApprovalFormulaWorksheet() {
    const navigate = useNavigate();

    // State for Utilization Calculator
    const [balance, setBalance] = useState('');
    const [limit, setLimit] = useState('');
    const [utilization, setUtilization] = useState(0);
    const [zone, setZone] = useState('');
    const [zoneColor, setZoneColor] = useState('text-gray-500');

    useEffect(() => {
        const b = parseFloat(balance.replace(/,/g, '')) || 0;
        const l = parseFloat(limit.replace(/,/g, '')) || 0;
        if (l > 0) {
            const util = (b / l) * 100;
            setUtilization(util);
            if (util <= 3) {
                setZone('ELITE OPTIMIZATION ZONE (1-3%)');
                setZoneColor('text-emerald-500');
            } else if (util <= 10) {
                setZone('PRIME POSITIONING ZONE (<10%)');
                setZoneColor('text-blue-500');
            } else if (util <= 30) {
                setZone('SURVIVAL ZONE (<30%)');
                setZoneColor('text-yellow-500');
            } else {
                setZone('DANGER ZONE (>30%)');
                setZoneColor('text-red-500');
            }
        } else {
            setUtilization(0);
            setZone('');
        }
    }, [balance, limit]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50 text-slate-900 font-sans p-8 md:p-16 print:bg-white print:p-0 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none print:hidden">
                <motion.div
                    className="absolute top-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
                    animate={{
                        scale: [1.3, 1, 1.3],
                        opacity: [0.4, 0.2, 0.4],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* --- HEADER --- */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row justify-between items-start border-b-4 border-slate-900 pb-6 mb-8 print:border-black relative z-10"
            >
                <div className="flex items-center gap-6">
                    <CreditULogo className="w-16 h-16 md:w-20 md:h-20" variant="navy" showShield={false} />
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-2 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
                            90-Day Execution Plan
                        </h1>
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Personal Credit Power Sequence // Day 04
                        </p>
                    </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-900 to-purple-900 text-white px-4 py-2 font-bold uppercase text-xs tracking-widest rounded-full shadow-lg print:border print:border-black print:text-black print:bg-transparent"
                    >
                        <Activity className="w-4 h-4" /> Execution Mode Activated
                    </motion.div>
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
                    <Printer className="w-4 h-4" /> Print Plan
                </Button>
            </div>

            <div className="grid gap-12 max-w-4xl mx-auto relative z-10">

                {/* STEP 1: CURRENT POSITION */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border-2 border-slate-200 shadow-lg print:shadow-none print:border-black print:bg-white"
                >
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4 print:border-slate-300">
                        <motion.div
                            initial={{ rotate: -180, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ delay: 0.4, type: "spring" }}
                            className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded text-white print:bg-transparent print:text-black"
                        >
                            <Target className="w-6 h-6" />
                        </motion.div>
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Step 1: Identify Your Current Position</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Credit Score Range</label>
                            <input className="w-full text-xl font-bold border-b-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none py-2 bg-transparent transition-all" placeholder="e.g. 680-700" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Total Balances</label>
                            <input className="w-full text-xl font-bold border-b-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none py-2 bg-transparent transition-all" placeholder="$" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Total Limits</label>
                            <input className="w-full text-xl font-bold border-b-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none py-2 bg-transparent transition-all" placeholder="$" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Open Accounts</label>
                            <input className="w-full text-xl font-bold border-b-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none py-2 bg-transparent transition-all" placeholder="#" />
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Late Payments Reporting?</label>
                        <input className="w-full text-lg border-b-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none py-2 bg-transparent transition-all" placeholder="List any or write 'NONE'" />
                    </div>
                </motion.section>

                {/* STEP 2: UTILIZATION TARGET (LIVE CALCULATOR) */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="bg-gradient-to-br from-slate-900 to-purple-900 text-white p-8 rounded-xl shadow-2xl print:bg-transparent print:text-black print:border-2 print:border-black print:shadow-none relative overflow-hidden"
                >
                    {/* Animated glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 print:hidden" />

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="bg-white/10 p-2 rounded text-white print:bg-transparent print:text-black"
                        >
                            <Activity className="w-6 h-6" />
                        </motion.div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Step 2: Utilization Target</h2>
                            <p className="text-xs text-slate-400 print:text-slate-600">Live Calculator: Input your numbers to see your zone.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-2 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Total Balance ($)
                            </label>
                            <input
                                value={balance}
                                onChange={e => setBalance(e.target.value)}
                                className="w-full text-3xl font-black bg-white/10 border-b-2 border-slate-700 focus:border-white focus:ring-2 focus:ring-white/20 outline-none py-2 text-white print:text-black print:border-slate-300 print:bg-transparent rounded px-2 transition-all"
                                placeholder="0"
                                type="number"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-2 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Total Credit Limit ($)
                            </label>
                            <input
                                value={limit}
                                onChange={e => setLimit(e.target.value)}
                                className="w-full text-3xl font-black bg-white/10 border-b-2 border-slate-700 focus:border-white focus:ring-2 focus:ring-white/20 outline-none py-2 text-white print:text-black print:border-slate-300 print:bg-transparent rounded px-2 transition-all"
                                placeholder="0"
                                type="number"
                            />
                        </div>
                    </div>

                    {/* RESULTS DISPLAY */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={zone}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 print:border-slate-200 print:bg-slate-50 relative z-10"
                        >
                            <div className="flex justify-between items-end mb-4">
                                <div className="text-xs font-bold uppercase text-slate-400">Current Utilization</div>
                                <motion.div
                                    key={utilization}
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className={`text-5xl font-black ${zoneColor} print:text-black`}
                                >
                                    {utilization.toFixed(1)}%
                                </motion.div>
                            </div>
                            <div className={`text-sm font-bold uppercase tracking-widest ${zoneColor} mb-4 print:text-black`}>
                                {zone || 'WAITING FOR DATA...'}
                            </div>

                            {/* Progress Bar Visual */}
                            <div className="w-full h-6 bg-slate-800 rounded-full overflow-hidden relative print:bg-slate-200">
                                {/* Zones */}
                                <div className="absolute left-0 h-full bg-emerald-500 w-[3%] opacity-30" title="Elite"></div>
                                <div className="absolute left-0 h-full bg-blue-500 w-[10%] opacity-20" title="Prime"></div>
                                <div className="absolute left-0 h-full bg-yellow-500 w-[30%] opacity-10" title="Survival"></div>

                                {/* Actual Bar */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(utilization, 100)}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className={`h-full ${utilization > 30 ? 'bg-red-500' : utilization > 10 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                                />
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 relative z-10">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Target Payoff Amount</label>
                            <input className="w-full bg-white/10 border-b-2 border-slate-700 focus:border-white text-lg print:border-black print:text-black py-2 px-2 rounded transition-all" placeholder="Enter Amount" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Payoff Deadline (90 Days)</label>
                            <input className="w-full bg-white/10 border-b-2 border-slate-700 focus:border-white text-lg print:border-black print:text-black py-2 px-2 rounded transition-all" type="date" />
                        </div>
                    </div>
                </motion.section>

                {/* STEP 3 & 4: RHYTHM & FREEZE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Step 3 */}
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border-2 border-slate-200 print:border-black print:bg-white shadow-lg"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-black uppercase">Step 3: Payment Rhythm</h2>
                        </div>
                        <div className="space-y-4">
                            {["Autopay ON (Minimums)", "One extra principal payment/mo", "Statement dates tracked"].map((item, i) => (
                                <motion.label
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + i * 0.1 }}
                                    className="flex items-center gap-3 p-3 border-2 border-slate-100 rounded-lg hover:bg-blue-50 hover:border-blue-200 cursor-pointer print:border-slate-200 transition-all"
                                >
                                    <input type="checkbox" className="w-5 h-5 accent-blue-600" />
                                    <span className="font-bold text-sm text-slate-700">{item}</span>
                                </motion.label>
                            ))}
                        </div>
                    </motion.section>

                    {/* Step 4 */}
                    <motion.section
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-xl border-2 border-red-200 print:bg-transparent print:border-black shadow-lg relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 print:hidden" />
                        <div className="flex items-center gap-2 mb-6 relative z-10">
                            <ShieldAlert className="w-5 h-5 text-red-600 print:text-black" />
                            <h2 className="text-lg font-black uppercase text-red-900 print:text-black">Step 4: The Freeze</h2>
                        </div>
                        <div className="space-y-2 text-sm text-red-800 font-medium mb-6 print:text-black relative z-10">
                            <p>🚫 No random credit applications</p>
                            <p>🚫 No unnecessary hard inquiries</p>
                            <p>🚫 No emotional approvals</p>
                        </div>
                        <div className="border-t-2 border-red-200 pt-4 print:border-black relative z-10">
                            <input className="w-full bg-white/50 border-b-2 border-red-300 focus:border-red-500 text-red-900 font-script text-xl placeholder-red-300/50 print:border-black print:text-black print:placeholder-gray-400 py-2 px-2 rounded transition-all" placeholder="Sign to Commit" />
                            <p className="text-xs font-bold uppercase text-red-400 mt-2 print:text-black">Signature of Commitment</p>
                        </div>
                    </motion.section>
                </div>

                {/* REFLECTION */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-center py-12 px-8 bg-gradient-to-br from-slate-900 to-purple-900 text-white rounded-2xl print:bg-transparent print:text-black print:border-2 print:border-black shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 print:hidden" />
                    <h3 className="text-xl md:text-2xl font-serif italic mb-6 relative z-10">
                        "If my credit profile could speak today, what would it say about my financial discipline?"
                    </h3>
                    <textarea
                        className="w-full max-w-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-lg p-4 text-white placeholder-white/30 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 h-32 print:bg-transparent print:border-black print:text-black print:placeholder-gray-400 relative z-10 transition-all"
                        placeholder="It would say..."
                    />
                </motion.section>

                <div className="print:hidden text-center pb-12">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            onClick={() => navigate('/dashboard/orientation')}
                            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-6 px-12 rounded-full shadow-xl gap-2 text-lg"
                        >
                            <Zap className="w-5 h-5" />
                            EXECUTION MODE CONFIRMED
                        </Button>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
