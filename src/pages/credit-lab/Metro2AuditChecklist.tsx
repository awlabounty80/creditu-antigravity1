import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ClipboardCheck, 
    ShieldCheck, 
    Zap, 
    FileSearch, 
    ArrowRight, 
    CheckCircle2, 
    AlertCircle,
    Info,
    Download,
    ExternalLink,
    ChevronRight,
    Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuditItem {
    id: string;
    title: string;
    description: string;
    legal_basis: string;
    metro2_point?: string;
}

interface AuditPhase {
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    items: AuditItem[];
}

const AUDIT_PHASES: AuditPhase[] = [
    {
        title: "PHASE 1: PERSONAL HYGIENE",
        subtitle: "FCRA § 611 - Identity Normalization",
        icon: ShieldCheck,
        color: "blue",
        items: [
            {
                id: "ph-1",
                title: "Name Normalization",
                description: "Delete all aliases, misspelled names, and maiden names. One name only.",
                legal_basis: "FCRA § 611",
                metro2_point: "J1 Segment Verification"
            },
            {
                id: "ph-2",
                title: "Address Scrub",
                description: "Delete every address except your current primary residence. Essential for account detachment.",
                legal_basis: "FCRA § 605",
                metro2_point: "J2 Segment Alignment"
            },
            {
                id: "ph-3",
                title: "Employer Purge",
                description: "Remove old employers. These are used by collectors to skip-trace and find you.",
                legal_basis: "FCRA § 604",
                metro2_point: "Employment Loophole"
            },
            {
                id: "ph-4",
                title: "SSN Variation Check",
                description: "Ensure only one SSN variation exists. Multiples indicate identity fragmentation.",
                legal_basis: "FACTA § 112",
                metro2_point: "Compliance Segment"
            }
        ]
    },
    {
        title: "PHASE 2: BUREAU SCRUB",
        subtitle: "The Secondary Suppression Protocol",
        icon: Lock,
        color: "amber",
        items: [
            {
                id: "bs-1",
                title: "LexisNexis Freeze",
                description: "Block the primary pipeline for public records, bankruptcies, and judgements.",
                legal_basis: "GLBA Privacy Rule",
                metro2_point: "Third-Party Verification"
            },
            {
                id: "bs-2",
                title: "SageStream & Innovis Freeze",
                description: "Cut off the secondary credit verification pipelines used by auto and credit card lenders.",
                legal_basis: "FCRA § 611(a)",
                metro2_point: "Furnisher Connectivity"
            },
            {
                id: "bs-3",
                title: "CoreLogic Teletrack Freeze",
                description: "Essential for removing subprime and payday loan history from showing up.",
                legal_basis: "FCRA § 604(g)",
                metro2_point: "Risk Data Scrub"
            }
        ]
    },
    {
        title: "PHASE 3: METRO 2® COMPLIANCE",
        subtitle: "The Forensic Data Audit",
        icon: FileSearch,
        color: "indigo",
        items: [
            {
                id: "m2-1",
                title: "DLA Alignment",
                description: "Match Date of Last Activity across all three bureaus. Discrepancy requires deletion.",
                legal_basis: "Metro 2® Field 17",
                metro2_point: "Logical Date Field"
            },
            {
                id: "m2-2",
                title: "Payment History Gap Analysis",
                description: "Scan for missing 'OK' or 'ND' marks in the 24-month grid. Unreported data = Non-compliance.",
                legal_basis: "FCRA § 623",
                metro2_point: "Payment Rating Grid"
            },
            {
                id: "m2-3",
                title: "Account Status Sync",
                description: "Ensure Status '97' or '64' (Charge-off) matches exactly in balance and reporting date.",
                legal_basis: "Metro 2® Status Code",
                metro2_point: "Status Code Validation"
            },
            {
                id: "m2-4",
                title: "Inquiry Suppression",
                description: "Remove hard pulls not tied to open accounts. Use FCRA § 604 unauthorized pull.",
                legal_basis: "FCRA § 604",
                metro2_point: "Permissible Purpose"
            }
        ]
    }
];

export default function Metro2AuditChecklist() {
    const navigate = useNavigate();
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [activePhase, setActivePhase] = useState(0);

    const toggleItem = (id: string) => {
        setCheckedItems(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const progress = (checkedItems.length / AUDIT_PHASES.flatMap(p => p.items).length) * 100;

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 pb-32">
            {/* Header */}
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-500">
                            <Zap className="w-3 h-3" />
                            Elite Auditor Tool
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                            Metro 2® Audit <span className="text-blue-500">Checklist</span>
                        </h1>
                        <p className="text-slate-400 text-xl font-medium max-w-2xl">
                            The Architect's Guide to forensic credit restoration. Audit your bureau files with surgical precision using federal compliance standards.
                        </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col items-center gap-2 min-w-[200px]">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Audit Completion</div>
                        <div className="text-4xl font-black italic text-blue-500">{Math.round(progress)}%</div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
                            <motion.div 
                                className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Navigation Hub */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {AUDIT_PHASES.map((phase, idx) => {
                        const Icon = phase.icon;
                        const phaseItems = phase.items.map(i => i.id);
                        const completedInPhase = checkedItems.filter(id => phaseItems.includes(id)).length;
                        const isComplete = completedInPhase === phase.items.length;

                        return (
                            <button
                                key={idx}
                                onClick={() => setActivePhase(idx)}
                                className={`p-6 rounded-[2.5rem] border-2 transition-all duration-500 text-left relative overflow-hidden group ${
                                    activePhase === idx 
                                    ? `bg-${phase.color}-600/10 border-${phase.color}-500 shadow-[0_0_30px_rgba(59,130,246,0.1)]` 
                                    : 'bg-white/5 border-white/5 hover:border-white/10'
                                }`}
                            >
                                <div className={`inline-flex p-3 rounded-2xl mb-4 ${activePhase === idx ? `bg-${phase.color}-500 text-white` : 'bg-white/5 text-slate-500'}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black italic uppercase">{phase.title}</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mt-1">{phase.subtitle}</p>
                                
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        {completedInPhase} / {phase.items.length} Points Verified
                                    </div>
                                    {isComplete && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                </div>

                                {activePhase === idx && (
                                    <motion.div 
                                        layoutId="active-indicator"
                                        className={`absolute bottom-0 left-0 right-0 h-1 bg-${phase.color}-500`} 
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Active Phase Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activePhase}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 md:p-12"
                    >
                        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
                            <div>
                                <h2 className="text-3xl font-black italic uppercase text-white mb-2">{AUDIT_PHASES[activePhase].title}</h2>
                                <p className="text-slate-400 font-medium italic">{AUDIT_PHASES[activePhase].subtitle}</p>
                            </div>
                            <div className="flex gap-4">
                                <button className="px-6 h-12 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    Download Phase Guide
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {AUDIT_PHASES[activePhase].items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    onClick={() => toggleItem(item.id)}
                                    className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-6 ${
                                        checkedItems.includes(item.id)
                                        ? 'bg-blue-500/10 border-blue-500/50'
                                        : 'bg-white/5 border-white/5 hover:border-white/10'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${
                                        checkedItems.includes(item.id)
                                        ? 'bg-blue-500 border-blue-500 text-white'
                                        : 'bg-transparent border-white/20 text-transparent'
                                    }`}>
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-lg font-black italic uppercase">{item.title}</h4>
                                            <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black uppercase text-slate-500">
                                                {item.legal_basis}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed italic">"{item.description}"</p>
                                    </div>

                                    <div className="hidden md:flex flex-col items-end gap-1 opacity-40">
                                        <div className="text-[8px] font-black uppercase tracking-widest text-slate-500">Metro 2 Point</div>
                                        <div className="text-[10px] font-black text-blue-400 uppercase italic">{item.metro2_point}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-12 p-8 bg-blue-600/10 rounded-3xl border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <AlertCircle className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black italic uppercase">Audit Strategy Tip</h4>
                                    <p className="text-slate-300 text-sm italic">Never dispute more than 5 personal info items at once to avoid 'frivolous' flags.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setActivePhase((prev) => (prev + 1) % AUDIT_PHASES.length)}
                                className="px-8 h-14 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
                            >
                                Next Phase
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Footer Disclaimer */}
                <div className="max-w-3xl mx-auto text-center space-y-4 opacity-30">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed">
                        OFFICIAL CREDIT UNIVERSITY AUDIT PROTOCOL // NON-COMPLIANCE DETECTION ENGINE // FCRA & FDCPA COMPLIANT
                    </p>
                    <p className="text-[8px] italic text-slate-500">
                        Disclaimer: This checklist is for educational purposes only. Credit University is not a credit repair organization. Results vary based on individual bureau reporting accuracy.
                    </p>
                </div>
            </div>

            {/* Sticky Navigation Back */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <button 
                    onClick={() => navigate('/learn')}
                    className="flex items-center gap-3 px-8 h-16 bg-white text-black rounded-full font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all"
                >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Return to Campus
                </button>
            </div>
        </div>
    );
}
