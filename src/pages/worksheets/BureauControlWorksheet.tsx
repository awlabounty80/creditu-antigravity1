import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Shield, Check, Lock, AlertTriangle, ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BureauControlWorksheet() {
    const navigate = useNavigate();

    // Checkbox State
    const [audit, setAudit] = useState({
        exp_name: false, exp_addy: false,
        equ_name: false, equ_addy: false,
        tu_name: false, tu_addy: false,
        ln_frozen: false, chex_frozen: false,
        opt_out: false
    });

    const toggle = (key: keyof typeof audit) => {
        setAudit(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8 md:p-16 print:bg-white print:p-0">
            {/* HEADER */}
            <div className="flex justify-between items-start border-b-4 border-slate-900 pb-6 mb-8 print:border-black">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Bureau Control Center</h1>
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Credit Architect Protocol // C-002</p>
                </div>
                <div className="text-right">
                    <div className="text-xs font-mono border border-slate-900 px-2 py-1 inline-block mb-2 uppercase">Official Audit</div>
                    <p className="text-sm font-bold">DAY 02</p>
                </div>
            </div>

            {/* Print Controls */}
            <div className="fixed top-4 left-4 print:hidden">
                <Button onClick={() => navigate('/dashboard/orientation')} variant="ghost" className="text-slate-500 hover:text-slate-900 gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Orientation
                </Button>
            </div>
            <div className="fixed top-4 right-4 print:hidden">
                <Button onClick={() => window.print()} className="bg-slate-900 text-white hover:bg-slate-700 gap-2 shadow-lg font-bold">
                    <Printer className="w-4 h-4" /> Print Intel
                </Button>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">

                {/* SECTION 1: THE FOUNDATION AUDIT */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-slate-900 text-white p-2 rounded"><Shield className="w-6 h-6" /></div>
                        <h2 className="text-2xl font-black uppercase tracking-tight">1. Primary Bureau Audit</h2>
                    </div>
                    <p className="mb-6 text-slate-600 font-medium">Lenders deny you if your personal data looks unstable. Verify consistency.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* EXPERIAN */}
                        <div className="border-2 border-slate-200 p-6 rounded-xl bg-white print:border-black">
                            <h3 className="font-bold text-lg mb-4 text-blue-600 uppercase tracking-widest print:text-black">Experian</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                    <div className={`w-5 h-5 border-2 border-slate-300 rounded flex items-center justify-center ${audit.exp_name ? 'bg-blue-600 border-blue-600' : ''}`}>
                                        {audit.exp_name && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="text-sm font-bold">Name Exact Match</span>
                                    <input type="checkbox" className="hidden" checked={audit.exp_name} onChange={() => toggle('exp_name')} />
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                    <div className={`w-5 h-5 border-2 border-slate-300 rounded flex items-center justify-center ${audit.exp_addy ? 'bg-blue-600 border-blue-600' : ''}`}>
                                        {audit.exp_addy && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="text-sm font-bold">Current Address Only</span>
                                    <input type="checkbox" className="hidden" checked={audit.exp_addy} onChange={() => toggle('exp_addy')} />
                                </label>
                            </div>
                        </div>

                        {/* EQUIFAX */}
                        <div className="border-2 border-slate-200 p-6 rounded-xl bg-white print:border-black">
                            <h3 className="font-bold text-lg mb-4 text-red-600 uppercase tracking-widest print:text-black">Equifax</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                    <div className={`w-5 h-5 border-2 border-slate-300 rounded flex items-center justify-center ${audit.equ_name ? 'bg-red-600 border-red-600' : ''}`}>
                                        {audit.equ_name && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="text-sm font-bold">Name Exact Match</span>
                                    <input type="checkbox" className="hidden" checked={audit.equ_name} onChange={() => toggle('equ_name')} />
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                    <div className={`w-5 h-5 border-2 border-slate-300 rounded flex items-center justify-center ${audit.equ_addy ? 'bg-red-600 border-red-600' : ''}`}>
                                        {audit.equ_addy && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="text-sm font-bold">Current Address Only</span>
                                    <input type="checkbox" className="hidden" checked={audit.equ_addy} onChange={() => toggle('equ_addy')} />
                                </label>
                            </div>
                        </div>

                        {/* TRANSUNION */}
                        <div className="border-2 border-slate-200 p-6 rounded-xl bg-white print:border-black">
                            <h3 className="font-bold text-lg mb-4 text-cyan-600 uppercase tracking-widest print:text-black">TransUnion</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                    <div className={`w-5 h-5 border-2 border-slate-300 rounded flex items-center justify-center ${audit.tu_name ? 'bg-cyan-600 border-cyan-600' : ''}`}>
                                        {audit.tu_name && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="text-sm font-bold">Name Exact Match</span>
                                    <input type="checkbox" className="hidden" checked={audit.tu_name} onChange={() => toggle('tu_name')} />
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                    <div className={`w-5 h-5 border-2 border-slate-300 rounded flex items-center justify-center ${audit.tu_addy ? 'bg-cyan-600 border-cyan-600' : ''}`}>
                                        {audit.tu_addy && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="text-sm font-bold">Current Address Only</span>
                                    <input type="checkbox" className="hidden" checked={audit.tu_addy} onChange={() => toggle('tu_addy')} />
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: SECONDARY SUPPRESSION */}
                <section className="bg-slate-900 text-white p-8 rounded-xl print:bg-transparent print:text-black print:border-2 print:border-black">
                    <div className="flex items-center gap-3 mb-6">
                        <Lock className="w-6 h-6 text-amber-400 print:text-black" />
                        <h2 className="text-xl font-black uppercase tracking-tight">2. Secondary Bureau Protocol</h2>
                    </div>
                    <p className="text-slate-400 mb-8 text-sm print:text-black">These "Hidden" bureaus house your worst data. Suppressing them stops the bleeding.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-amber-400 font-bold uppercase tracking-widest text-xs mb-4 print:text-black">Action Targets</h4>
                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 bg-white/5 rounded border border-white/10 cursor-pointer hover:bg-white/10 print:border-slate-300">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">LexisNexis Frozen</span>
                                        <a href="https://consumer.risk.lexisnexis.com/freeze" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300" onClick={(e) => e.stopPropagation()}>
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full relative transition-colors ${audit.ln_frozen ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${audit.ln_frozen ? 'left-7' : 'left-1'}`} />
                                    </div>
                                    <input type="checkbox" className="hidden" checked={audit.ln_frozen} onChange={() => toggle('ln_frozen')} />
                                </label>
                                <label className="flex items-center justify-between p-4 bg-white/5 rounded border border-white/10 cursor-pointer hover:bg-white/10 print:border-slate-300">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">ChexSystems Frozen</span>
                                        <a href="https://www.chexsystems.com/security-freeze/place-freeze" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300" onClick={(e) => e.stopPropagation()}>
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full relative transition-colors ${audit.chex_frozen ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${audit.chex_frozen ? 'left-7' : 'left-1'}`} />
                                    </div>
                                    <input type="checkbox" className="hidden" checked={audit.chex_frozen} onChange={() => toggle('chex_frozen')} />
                                </label>
                                <label className="flex items-center justify-between p-4 bg-white/5 rounded border border-white/10 cursor-pointer hover:bg-white/10 print:border-slate-300">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">Opt-Out Prescreen (5 Years)</span>
                                        <a href="https://www.optoutprescreen.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300" onClick={(e) => e.stopPropagation()}>
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full relative transition-colors ${audit.opt_out ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${audit.opt_out ? 'left-7' : 'left-1'}`} />
                                    </div>
                                    <input type="checkbox" className="hidden" checked={audit.opt_out} onChange={() => toggle('opt_out')} />
                                </label>
                            </div>
                        </div>

                        <div className="bg-black/30 p-6 rounded text-sm print:bg-slate-100">
                            <h4 className="font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-400 print:text-black" /> Why This Matters
                            </h4>
                            <ul className="space-y-3 text-slate-300 print:text-black">
                                <li>• LexisNexis feeds public records (Bankruptcies/Judgments) to the big 3.</li>
                                <li>• ChexSystems decides if you can open a bank account.</li>
                                <li>• Opting out stops "Trigger Leads" (Junk mail when you apply for credit).</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: DISPUTE PLANNER */}
                <section>
                    <h2 className="text-xl font-black uppercase bg-slate-900 text-white px-4 py-2 mb-6 inline-block print:text-black print:bg-transparent print:border-2 print:border-black">3. Correction Strategy</h2>
                    <p className="mb-4 text-sm font-medium italic">Identify incorrect personal data to purge.</p>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left bg-white">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 text-xs font-black uppercase text-slate-500">Data Point</th>
                                    <th className="p-4 text-xs font-black uppercase text-slate-500">Status</th>
                                    <th className="p-4 text-xs font-black uppercase text-slate-500">Correction Needed?</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="p-4 font-bold">Name Variations</td>
                                    <td className="p-4 text-sm text-slate-500">e.g. John A. Doe vs John Doe</td>
                                    <td className="p-4"><input className="w-full border-b border-slate-200 focus:border-blue-500 outline-none" placeholder="List variations to delete" /></td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold">Old Addresses</td>
                                    <td className="p-4 text-sm text-slate-500">Any address &gt;2 years old</td>
                                    <td className="p-4"><input className="w-full border-b border-slate-200 focus:border-blue-500 outline-none" placeholder="List addresses to remove" /></td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold">Employer Info</td>
                                    <td className="p-4 text-sm text-slate-500">Old jobs or misspellings</td>
                                    <td className="p-4"><input className="w-full border-b border-slate-200 focus:border-blue-500 outline-none" placeholder="List employers to remove" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="print:hidden text-center pb-12">
                    <Button
                        onClick={() => navigate('/dashboard/orientation')}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-6 px-12 rounded-full shadow-xl gap-2 transition-transform hover:scale-105"
                    >
                        AUDIT COMPLETE // SAVE
                    </Button>
                </div>

            </div>
        </div>
    );
}
