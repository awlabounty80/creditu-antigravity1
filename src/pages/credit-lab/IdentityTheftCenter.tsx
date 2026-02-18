import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Lock, FileWarning, Fingerprint, Siren, Gavel, ExternalLink, CheckCircle2, AlertTriangle, EyeOff, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function IdentityTheftCenter() {
    const [activeTab, setActiveTab] = useState<'emergency' | 'legal' | 'protection'>('emergency');

    const handleCopyAffidavit = () => {
        const text = `I, [Name], declare under penalty of perjury that I am a victim of identity theft. The accounts listed below were not authorized by me and are a result of this theft. I request that these items be blocked from my credit report pursuant to FCRA Section 605B.`;
        navigator.clipboard.writeText(text);
        toast.success("Affidavit Template Copied");
    };

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12 font-sans selection:bg-red-500/30">
            {/* HERRO HEADER */}
            <div className="max-w-7xl mx-auto mb-12 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-4 animate-pulse">
                    <Siren className="w-3 h-3" />
                    Defcon 1: Active Threat Response
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 font-heading bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                    Identity Theft Command
                </h1>
                <p className="text-slate-400 max-w-2xl text-lg">
                    Deploy the "Nuclear Option" (FCRA 605B) to block fraudulent accounts in 4 business days.
                    Manage affidavits, suppress secondary bureaus, and activate military-grade protection.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT: NAVIGATION & TOOLS */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Status Card */}
                    <Card className="bg-[#0A0F1E] border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-400">
                                <ShieldAlert className="w-5 h-5" /> Threat Level Assessment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10">
                                <div className="text-sm font-bold text-red-300 mb-1">Immediate Action Required</div>
                                <p className="text-xs text-red-400/70">If you suspect ID theft, speed is your only ally. Federal law gives you immense power, but only if you follow the procedural triggers correctly.</p>
                            </div>

                            <Button
                                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold h-12 shadow-lg shadow-red-900/20"
                                onClick={() => window.open('https://myfreescorenow.com/enroll/?AID=TheCreditStore&PID=78496', '_blank')}
                            >
                                <Lock className="w-4 h-4 mr-2" />
                                Activate Full Protection
                            </Button>
                            <p className="text-[10px] text-center text-slate-500">Includes $1M Insurance & Neural Monitoring</p>
                        </CardContent>
                    </Card>

                    {/* Quick Nav */}
                    <div className="space-y-2">
                        <button onClick={() => setActiveTab('emergency')} className={`w-full text-left p-4 rounded-xl border transition-all ${activeTab === 'emergency' ? 'bg-red-500/10 border-red-500 text-white' : 'bg-[#0A0F1E] border-white/5 text-slate-400 hover:border-red-500/50'}`}>
                            <div className="flex items-center gap-3">
                                <ZapIcon active={activeTab === 'emergency'} />
                                <div>
                                    <div className="font-bold">Protocol 1: Comparison Block</div>
                                    <div className="text-xs opacity-70">The "4-Day" Removal Rule</div>
                                </div>
                            </div>
                        </button>

                        <button onClick={() => setActiveTab('legal')} className={`w-full text-left p-4 rounded-xl border transition-all ${activeTab === 'legal' ? 'bg-amber-500/10 border-amber-500 text-white' : 'bg-[#0A0F1E] border-white/5 text-slate-400 hover:border-amber-500/50'}`}>
                            <div className="flex items-center gap-3">
                                <Gavel className={`w-5 h-5 ${activeTab === 'legal' ? 'text-amber-400' : 'text-slate-500'}`} />
                                <div>
                                    <div className="font-bold">Protocol 2: Legal Swarm</div>
                                    <div className="text-xs opacity-70">Affidavits & Police Reports</div>
                                </div>
                            </div>
                        </button>

                        <button onClick={() => setActiveTab('protection')} className={`w-full text-left p-4 rounded-xl border transition-all ${activeTab === 'protection' ? 'bg-blue-500/10 border-blue-500 text-white' : 'bg-[#0A0F1E] border-white/5 text-slate-400 hover:border-blue-500/50'}`}>
                            <div className="flex items-center gap-3">
                                <Fingerprint className={`w-5 h-5 ${activeTab === 'protection' ? 'text-blue-400' : 'text-slate-500'}`} />
                                <div>
                                    <div className="font-bold">Protocol 3: Deep Freeze</div>
                                    <div className="text-xs opacity-70">Lockdown & Monitoring</div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* RIGHT: CONTENT AREA */}
                <div className="lg:col-span-8">

                    {/* VIEW: EMERGENCY (605B) */}
                    {activeTab === 'emergency' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className="bg-[#0A0F1E] border-white/10 overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-red-500 to-orange-500" />
                                <CardHeader>
                                    <CardTitle className="text-2xl text-white">FCRA Section 605B: The "Block"</CardTitle>
                                    <p className="text-slate-400">
                                        The most powerful tool in the FCRA. Bureaus <span className="text-red-400 font-bold">MUST BLOCK</span> information resulting from identity theft within 4 business days of receiving your report.
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-black/30 rounded border border-white/5">
                                            <div className="text-red-500 font-bold text-lg mb-1">Step 1</div>
                                            <div className="text-sm text-slate-300">File FTC Report</div>
                                            <a href="https://identitytheft.gov" target="_blank" className="text-xs text-blue-400 hover:underline mt-2 block">Go to IdentityTheft.gov</a>
                                        </div>
                                        <div className="p-4 bg-black/30 rounded border border-white/5">
                                            <div className="text-orange-500 font-bold text-lg mb-1">Step 2</div>
                                            <div className="text-sm text-slate-300">Identify Accounts</div>
                                            <div className="text-xs text-slate-500 mt-2">List all fraudulent items</div>
                                        </div>
                                        <div className="p-4 bg-black/30 rounded border border-white/5">
                                            <div className="text-emerald-500 font-bold text-lg mb-1">Step 3</div>
                                            <div className="text-sm text-slate-300">Send 605B Letter</div>
                                            <div className="text-xs text-slate-500 mt-2">Certified Mail recommended</div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-red-950/20 border border-red-500/20 rounded-xl">
                                        <h3 className="text-red-400 font-bold flex items-center gap-2 mb-4">
                                            <FileWarning className="w-5 h-5" />
                                            Infinite Power Knowledge: procedural Attack
                                        </h3>
                                        <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                            Most consumer disputes (Section 611) take 30 days. <span className="text-white font-bold">Section 605B takes 4 days.</span> If you confirm identity theft, do NOT use the standard dispute process. Use the "Block" provision. If the bureau fails to block within 4 days, they are in willful non-compliance ($1,000 statutory damages per violation).
                                        </p>
                                        <p className="text-sm text-slate-300 leading-relaxed">
                                            <strong>Required Attachments:</strong> Proof of Identity, Copy of FTC Report, and a statement identifying the fraudulent accounts.
                                        </p>
                                    </div>

                                    <div className="flex justify-end">
                                        <Link to="/dashboard/library/letters">
                                            <Button className="bg-white text-black hover:bg-slate-200">
                                                Go to Letter Library (Select 'Identity Theft')
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* VIEW: LEGAL (Affidavits) */}
                    {activeTab === 'legal' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className="bg-[#0A0F1E] border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-white">Legal Documentation Engine</CardTitle>
                                    <p className="text-slate-400">
                                        Without an affidavit, your claim is just hearsay. With an affidavit, it is Sworn Testimony.
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="p-6 bg-amber-950/10 border border-amber-500/20 rounded-xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <FileText className="w-24 h-24 text-amber-500" />
                                        </div>
                                        <h3 className="text-amber-400 font-bold text-lg mb-2">General Affidavit of Fact</h3>
                                        <p className="text-sm text-slate-300 mb-4 pr-12">
                                            A generic sworn statement you can use if you don't have a police report yet. Note: Ideally, get it notarized.
                                        </p>
                                        <div className="bg-black/40 p-4 rounded border border-white/10 font-mono text-xs text-slate-400 mb-4 whitespace-pre-wrap">
                                            {`I, [Your Name], residing at [Address], do solemnly swear that...\n1. I am over the age of 18 and competent to make this affidavit.\n2. I am the victim of identity theft.\n3. The accounts listed in Exhibit A were opened without my permission...`}
                                        </div>
                                        <Button onClick={handleCopyAffidavit} variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                                            <Download className="w-4 h-4 mr-2" /> Copy Full Template
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-2 mb-2 text-white font-bold">
                                                <ExternalLink className="w-4 h-4 text-slate-400" /> Police Report
                                            </div>
                                            <p className="text-xs text-slate-400 mb-3">
                                                Go to your local station or file online. Give them the FTC report number.
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-2 mb-2 text-white font-bold">
                                                <EyeOff className="w-4 h-4 text-slate-400" /> LexisNexis Opt-Out
                                            </div>
                                            <p className="text-xs text-slate-400 mb-3">
                                                Freeze your "Secondary" report to stop synthetic ID validation.
                                            </p>
                                            <a href="https://optout.lexisnexis.com/" target="_blank" className="text-xs text-blue-400 underline">Official Opt-Out</a>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* VIEW: PROTECTION */}
                    {activeTab === 'protection' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className="bg-gradient-to-br from-slate-900 to-black border-white/10 shadow-2xl">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl text-white font-bold">Ironclad Defense System</CardTitle>
                                            <p className="text-slate-300 mt-2 font-medium">
                                                Cleaning your report is useless if the backdoor is left open.
                                            </p>
                                        </div>
                                        <div className="p-3 bg-indigo-500/20 rounded-full border border-indigo-500/30">
                                            <ShieldAlert className="w-8 h-8 text-indigo-400" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-5 rounded-xl bg-blue-950/40 border border-blue-500/30 hover:border-blue-500/50 transition-colors">
                                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/50">
                                                <Lock className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-lg">Bureau Lock</h4>
                                                <p className="text-blue-100/80">Prevent any new inquiries instantly.</p>
                                                <Link to="/dashboard/credit-lab/freeze" className="text-cyan-400 hover:text-cyan-300 font-bold underline decoration-cyan-400/50 mt-1 block flex items-center gap-1">
                                                    Go to Freeze Center <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-5 rounded-xl bg-orange-950/40 border border-orange-500/30 hover:border-orange-500/50 transition-colors">
                                            <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center shrink-0 shadow-lg shadow-orange-900/50">
                                                <EyeOff className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-lg">Dark Web Scan</h4>
                                                <p className="text-orange-100/80">See if your SSN implies synthetic ID usage.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center pt-8 border-t border-white/10">
                                        <h3 className="text-xl font-bold text-white mb-6">Complete Your Security Perimeter</h3>
                                        <Button
                                            size="lg"
                                            className="w-full md:w-auto px-12 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-lg shadow-[0_0_25px_rgba(16,185,129,0.4)] animate-pulse border border-emerald-400/20"
                                            onClick={() => window.open('https://myfreescorenow.com/enroll/?AID=TheCreditStore&PID=78496', '_blank')}
                                        >
                                            Enroll in $1M Identity Protection
                                        </Button>
                                        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-400 font-medium">
                                            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> 24/7 Monitoring</span>
                                            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Insurance</span>
                                            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Recovery Concierge</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const ZapIcon = ({ active }: { active: boolean }) => (
    <svg className={`w-5 h-5 ${active ? 'text-red-500' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
);
