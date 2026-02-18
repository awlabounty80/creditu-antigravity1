import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft, Target, Calendar, Activity, ShieldAlert, Cpu } from 'lucide-react';

export default function WealthSystemsWorksheet() {
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
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8 md:p-16 print:bg-white print:p-0">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start border-b-4 border-slate-900 pb-6 mb-8 print:border-black">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 text-slate-900">Wealth System Architecture</h1>
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Automate The Empire Protocol // C-004</p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                    <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 font-bold uppercase text-xs tracking-widest rounded-full print:border print:border-black print:text-black print:bg-transparent">
                        <Cpu className="w-4 h-4" /> System Online
                    </div>
                </div>
            </div>

            {/* Print Controls */}
            <div className="fixed top-4 left-4 print:hidden">
                <Button onClick={() => navigate('/dashboard/orientation')} variant="ghost" className="text-slate-500 hover:text-slate-900 gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
            </div>

            <div className="fixed top-4 right-4 print:hidden">
                <Button onClick={() => window.print()} className="bg-slate-900 text-white hover:bg-slate-700 gap-2 shadow-lg font-bold">
                    <Printer className="w-4 h-4" /> Print Plan
                </Button>
            </div>

            <div className="grid gap-12 max-w-4xl mx-auto">

                {/* STEP 1: 90-DAY EXECUTION PLAN */}
                <section className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm print:shadow-none print:border-black">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4 print:border-slate-300">
                        <div className="bg-slate-100 p-2 rounded text-slate-900 print:bg-transparent"><Target className="w-6 h-6" /></div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Step 1: The 90-Day Execution Sequence</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Target Payoff Amount</label>
                            <input className="w-full bg-transparent border-b border-slate-700 text-lg print:border-black print:text-black" placeholder="Enter Amount" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Payoff Deadline (90 Days)</label>
                            <input className="w-full bg-transparent border-b border-slate-700 text-lg print:border-black print:text-black" type="date" />
                        </div>
                    </div>
                </section>

                {/* STEP 2: UTILIZATION TARGET (LIVE CALCULATOR) */}
                <section className="bg-slate-900 text-white p-8 rounded-xl shadow-lg print:bg-transparent print:text-black print:border-2 print:border-black print:shadow-none">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-white/10 p-2 rounded text-white print:bg-transparent print:text-black"><Activity className="w-6 h-6" /></div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tight">Step 2: Utilization Target</h2>
                            <p className="text-xs text-slate-400 print:text-slate-600">Input your numbers to see your zone.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Total Balance ($)</label>
                            <input
                                value={balance}
                                onChange={e => setBalance(e.target.value)}
                                className="w-full text-3xl font-black bg-transparent border-b-2 border-slate-700 focus:border-white outline-none py-2 text-white print:text-black print:border-slate-300"
                                placeholder="0"
                                type="number"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Total Credit Limit ($)</label>
                            <input
                                value={limit}
                                onChange={e => setLimit(e.target.value)}
                                className="w-full text-3xl font-black bg-transparent border-b-2 border-slate-700 focus:border-white outline-none py-2 text-white print:text-black print:border-slate-300"
                                placeholder="0"
                                type="number"
                            />
                        </div>
                    </div>

                    {/* RESULTS DISPLAY */}
                    <div className="bg-white/5 p-6 rounded-lg border border-white/10 print:border-slate-200 print:bg-slate-50">
                        <div className="flex justify-between items-end mb-2">
                            <div className="text-xs font-bold uppercase text-slate-400">Current Utilization</div>
                            <div className={`text-4xl font-black ${zoneColor} print:text-black`}>{utilization.toFixed(1)}%</div>
                        </div>
                        <div className={`text-sm font-bold uppercase tracking-widest ${zoneColor} mb-4 print:text-black`}>
                            {zone || 'WAITING FOR DATA...'}
                        </div>

                        {/* Progress Bar Visual */}
                        <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden relative print:bg-slate-200">
                            {/* Zones */}
                            <div className="absolute left-0 h-full bg-emerald-500 w-[3%] opacity-30" title="Elite"></div>
                            <div className="absolute left-0 h-full bg-blue-500 w-[10%] opacity-20" title="Prime"></div>
                            <div className="absolute left-0 h-full bg-yellow-500 w-[30%] opacity-10" title="Survival"></div>

                            {/* Actual Bar */}
                            <div className={`h-full transition-all duration-500 ${utilization > 30 ? 'bg-red-500' : utilization > 10 ? 'bg-yellow-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(utilization, 100)}%` }}></div>
                        </div>
                    </div>
                </section>

                {/* STEP 3 & 4: RHYTHM & FREEZE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Step 3 */}
                    <section className="bg-white p-8 rounded-xl border border-slate-200 print:border-black">
                        <div className="flex items-center gap-2 mb-6">
                            <Calendar className="w-5 h-5 text-slate-900" />
                            <h2 className="text-lg font-black uppercase">Step 3: Payment Automation</h2>
                        </div>
                        <div className="space-y-4">
                            {["Autopay ON (Minimums)", "One extra principal payment/mo", "Statement dates tracked"].map((item, i) => (
                                <label key={i} className="flex items-center gap-3 p-3 border border-slate-100 rounded hover:bg-slate-50 cursor-pointer print:border-slate-200">
                                    <input type="checkbox" className="w-5 h-5 accent-slate-900" />
                                    <span className="font-bold text-sm text-slate-700">{item}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Step 4 */}
                    <section className="bg-red-50 p-8 rounded-xl border border-red-100 print:bg-transparent print:border-black">
                        <div className="flex items-center gap-2 mb-6">
                            <ShieldAlert className="w-5 h-5 text-red-600 print:text-black" />
                            <h2 className="text-lg font-black uppercase text-red-900 print:text-black">Step 4: The Freeze Protocol</h2>
                        </div>
                        <div className="space-y-2 text-sm text-red-800 font-medium mb-6 print:text-black">
                            <p>🚫 No random credit applications</p>
                            <p>🚫 No unnecessary hard inquiries</p>
                            <p>🚫 No emotional approvals</p>
                        </div>
                        <div className="border-t border-red-200 pt-4 print:border-black">
                            <input className="w-full bg-transparent border-b-2 border-red-300 text-red-900 font-script text-xl placeholder-red-300/50 print:border-black print:text-black print:placeholder-gray-400" placeholder="Sign to Commit" />
                            <p className="text-xs font-bold uppercase text-red-400 mt-1 print:text-black">Signature of Commitment</p>
                        </div>
                    </section>
                </div>

                <div className="print:hidden text-center pb-12">
                    <Button
                        onClick={() => navigate('/dashboard/orientation')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 px-12 rounded-full shadow-xl gap-2 transition-transform hover:scale-105"
                    >
                        SYSTEMS LOCKED // PROCEED
                    </Button>
                </div>

            </div>
        </div>
    );
}
