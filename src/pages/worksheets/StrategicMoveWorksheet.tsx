import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Printer, Shield, Target, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function StrategicMoveWorksheet() {
    const navigate = useNavigate();
    // State for inputs
    const [targetCard, setTargetCard] = useState({ name: '', balance: '', limit: '', utilization: 0 });
    const [payDown, setPayDown] = useState({ goalAmount: '', payDate: '' });
    const [authorizedUser, setAuthorizedUser] = useState({ name: '', relationship: '', status: '' });
    const [errors, setErrors] = useState([{ id: 1, item: '', disputeMethod: '' }]);

    // Effect to calculate utilization
    React.useEffect(() => {
        const b = parseFloat(targetCard.balance.replace(/,/g, '')) || 0;
        const l = parseFloat(targetCard.limit.replace(/,/g, '')) || 0;
        if (l > 0) {
            setTargetCard(prev => ({ ...prev, utilization: (b / l) * 100 }));
        }
    }, [targetCard.balance, targetCard.limit]);

    return (
        <div className="min-h-screen bg-white text-black font-sans p-8 md:p-16 print:p-0">
            {/* --- HEADER --- */}
            <div className="flex justify-between items-start border-b-4 border-black pb-6 mb-8">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Strategy Execution Log</h1>
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Official Credit U Intel Document // S-002</p>
                </div>
                <div className="text-right">
                    <div className="text-xs font-mono border border-black px-2 py-1 inline-block mb-2 bg-black text-white">ACTION REQUIRED</div>
                    <p className="text-sm font-bold">DATE: _________________</p>
                </div>
            </div>

            {/* Print Controls */}
            <div className="fixed top-4 left-4 print:hidden">
                <Button onClick={() => navigate('/dashboard/orientation')} variant="ghost" className="text-gray-500 hover:text-black gap-2">
                    <ArrowLeft className="w-4 h-4" /> Return to Dashboard
                </Button>
            </div>

            <div className="fixed top-4 right-4 print:hidden">
                <Button onClick={() => window.print()} className="bg-black text-white hover:bg-gray-800 gap-2 shadow-xl">
                    <Printer className="w-4 h-4" /> Print / Save to PDF
                </Button>
            </div>

            <div className="grid gap-12 max-w-4xl mx-auto">

                {/* 1. UTILIZATION ATTACK */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-black text-white p-2"><Target className="w-6 h-6" /></div>
                        <h2 className="text-2xl font-black uppercase">1. Utilization Attack Protocol</h2>
                    </div>
                    <p className="mb-4 text-sm font-medium italic text-gray-600">Identify your single highest-utilization card. This is your primary target.</p>

                    <div className="border-2 border-black p-6 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Target Card Issuer</label>
                                <input
                                    value={targetCard.name}
                                    onChange={e => setTargetCard({ ...targetCard, name: e.target.value })}
                                    placeholder="e.g. Chase Sapphire"
                                    className="w-full text-xl font-bold border-b-2 border-black bg-transparent focus:outline-none uppercase"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Current Utilization</label>
                                <div className={`text-3xl font-black ${targetCard.utilization > 30 ? 'text-red-600' : 'text-emerald-600'}`}>
                                    {targetCard.utilization.toFixed(1)}%
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Current Balance</label>
                                <div className="flex items-center text-xl font-bold border-b-2 border-dashed border-gray-400">
                                    <span className="text-gray-400 mr-1">$</span>
                                    <input
                                        type="number"
                                        value={targetCard.balance}
                                        onChange={e => setTargetCard({ ...targetCard, balance: e.target.value })}
                                        className="w-full bg-transparent focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Credit Limit</label>
                                <div className="flex items-center text-xl font-bold border-b-2 border-dashed border-gray-400">
                                    <span className="text-gray-400 mr-1">$</span>
                                    <input
                                        type="number"
                                        value={targetCard.limit}
                                        onChange={e => setTargetCard({ ...targetCard, limit: e.target.value })}
                                        className="w-full bg-transparent focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border-2 border-black p-4 mt-4">
                            <h3 className="font-black uppercase text-sm mb-3">The Pay-Down Mission</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase font-bold text-gray-500">Target Amount (&lt;9%)</label>
                                    <input
                                        value={payDown.goalAmount}
                                        onChange={e => setPayDown({ ...payDown, goalAmount: e.target.value })}
                                        placeholder="$0.00"
                                        className="w-full border-b border-black font-mono text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs uppercase font-bold text-gray-500">Execution Date</label>
                                    <input
                                        type="date"
                                        value={payDown.payDate}
                                        onChange={e => setPayDown({ ...payDown, payDate: e.target.value })}
                                        className="w-full border-b border-black font-mono text-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. FACTUAL ERROR SCAN */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-black text-white p-2"><AlertTriangle className="w-6 h-6" /></div>
                        <h2 className="text-2xl font-black uppercase">2. Factual Error Audit</h2>
                    </div>

                    <table className="w-full border-2 border-black">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="p-3 text-left w-1/2">Error Identified (Be Specific)</th>
                                <th className="p-3 text-left w-1/2">Dispute Strategy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3].map(i => (
                                <tr key={i} className="border-b border-black">
                                    <td className="p-0 border-r border-black">
                                        <textarea className="w-full h-20 p-3 resize-none focus:outline-none focus:bg-blue-50" placeholder="e.g. Wrong address on Experian..." />
                                    </td>
                                    <td className="p-0">
                                        <select className="w-full h-20 p-3 bg-transparent focus:outline-none focus:bg-blue-50">
                                            <option value="">Select Strategy...</option>
                                            <option value="letter">Certified Letter (Recommended)</option>
                                            <option value="online">Online Dispute (Faster, Riskier)</option>
                                            <option value="call">Phone Call</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* 3. AUTHORIZED USER SCOUT */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-black text-white p-2"><Shield className="w-6 h-6" /></div>
                        <h2 className="text-2xl font-black uppercase">3. Authorized User Scout</h2>
                    </div>
                    <p className="mb-4 text-sm font-medium italic text-gray-600">List one person with excellent credit (10+ years history, &lt;5% utilization) who might add you.</p>

                    <div className="border-2 border-dotted border-black p-6 rounded-xl flex flex-col md:flex-row gap-6 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Candidate Name</label>
                            <input className="w-full border-b-2 border-black text-xl font-bold focus:outline-none" placeholder="e.g. Aunt Marie" />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Est. Credit Age</label>
                            <input className="w-full border-b-2 border-black text-xl font-bold focus:outline-none" placeholder="e.g. 15 Years" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" className="w-6 h-6 accent-black" />
                            <span className="font-bold text-sm uppercase">Conversation Held</span>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <div className="border-t-4 border-black pt-8 mt-12 text-center">
                    <p className="font-bold uppercase tracking-widest text-xs mb-2">"Strategy without execution is just a hallucination."</p>
                    <p className="text-[10px] text-gray-500">© 2024 Credit U. Do Not Distribute.</p>
                </div>

                <div className="print:hidden text-center mt-12 mb-12">
                    <p className="text-sm text-gray-500 mb-4">Done with your plan?</p>
                    <Button onClick={() => navigate('/dashboard/orientation')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-full shadow-lg gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95">
                        <CheckCircle2 className="w-5 h-5" /> Mark Strategy as Complete
                    </Button>
                </div>
            </div>
        </div>
    );
}
