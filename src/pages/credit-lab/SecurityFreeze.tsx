
import { useNavigate } from 'react-router-dom';
import {
    Lock,
    ShieldCheck,
    ExternalLink,
    AlertTriangle,
    Globe,
    Phone,
    FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ------------------------------------------------------------------
// SECURITY FREEZE DATABASE (EXPANDED)
// ------------------------------------------------------------------
const BUREAUS = [
    // THE BIG THREE
    {
        id: 'experian',
        name: "Experian",
        category: "Major Bureau",
        link: "https://www.experian.com/freeze/center.html",
        phone: "1-888-397-3742",
        desc: "The largest data aggregator. Freezing here stops most credit card applications.",
        color: "text-blue-500",
        border: "hover:border-blue-500/50",
        bg: "bg-blue-500/10"
    },
    {
        id: 'equifax',
        name: "Equifax",
        category: "Major Bureau",
        link: "https://www.equifax.com/personal/credit-report-services/credit-freeze/",
        phone: "1-800-349-9960",
        desc: "Critically important due to past data breaches. Freeze immediately.",
        color: "text-red-500",
        border: "hover:border-red-500/50",
        bg: "bg-red-500/10"
    },
    {
        id: 'transunion',
        name: "TransUnion",
        category: "Major Bureau",
        link: "https://www.transunion.com/credit-freeze",
        phone: "1-888-909-8872",
        desc: "Often used by auto lenders and landlords for background checks.",
        color: "text-cyan-500",
        border: "hover:border-cyan-500/50",
        bg: "bg-cyan-500/10"
    },
    // BANKING & EMPLOYMENT
    {
        id: 'chexsystems',
        name: "ChexSystems",
        category: "Banking",
        link: "https://www.chexsystems.com/security-freeze/place-freeze",
        phone: "1-800-428-9623",
        desc: "Used by banks to screen new checking accounts. Freeze to stop bank fraud.",
        color: "text-emerald-500",
        border: "hover:border-emerald-500/50",
        bg: "bg-emerald-500/10"
    },
    {
        id: 'earlywarning',
        name: "Early Warning",
        category: "Banking",
        link: "https://www.earlywarning.com/consumer-information",
        phone: "1-800-325-7775",
        desc: "Owned by big banks (Zelle). Critical to freeze for protecting bank accounts.",
        color: "text-emerald-400",
        border: "hover:border-emerald-400/50",
        bg: "bg-emerald-400/10"
    },
    {
        id: 'worknumber',
        name: "The Work Number",
        category: "Employment",
        link: "https://employees.theworknumber.com/employee-data-freeze",
        phone: "1-866-222-5880",
        desc: "Owned by Equifax. Tracks your salary and employment history. Freeze for privacy.",
        color: "text-amber-500",
        border: "hover:border-amber-500/50",
        bg: "bg-amber-500/10"
    },
    // SUBPRIME & BEHAVIOR
    {
        id: 'clarity',
        name: "Clarity Services",
        category: "Subprime / Behavior",
        link: "https://www.clarityservices.com/consumer/security-freeze/",
        phone: "1-866-390-3118",
        desc: "Owned by Experian. Tracks payday loans and subprime credit behavior.",
        color: "text-rose-500",
        border: "hover:border-rose-500/50",
        bg: "bg-rose-500/10"
    },
    {
        id: 'factortrust',
        name: "FactorTrust",
        category: "Subprime / Behavior",
        link: "https://www.factortrust.com/consumer/security-freeze.html",
        phone: "1-844-773-3391",
        desc: "Owned by TransUnion. Tracks short-term lending and behavioral data.",
        color: "text-rose-400",
        border: "hover:border-rose-400/50",
        bg: "bg-rose-400/10"
    },
    {
        id: 'datax',
        name: "DataX",
        category: "Subprime / Behavior",
        link: "https://consumers.dataxltd.com/consumerCreditFreeze",
        phone: "1-800-295-4790",
        desc: "Owned by Equifax. Focuses on underbanked and subprime lending records.",
        color: "text-rose-600",
        border: "hover:border-rose-600/50",
        bg: "bg-rose-600/10"
    },
    // SPECIALTY & PUBLIC
    {
        id: 'innovis',
        name: "Innovis",
        category: "Secondary Bureau",
        link: "https://www.innovis.com/securityFreeze/index",
        phone: "1-800-540-2505",
        desc: "The 'Fourth Bureau'. Often overlooked but used for identity verification.",
        color: "text-amber-400",
        border: "hover:border-amber-400/50",
        bg: "bg-amber-400/10"
    },
    {
        id: 'lexisnexis',
        name: "LexisNexis",
        category: "Public Records",
        link: "https://consumer.risk.lexisnexis.com/freeze",
        phone: "1-800-456-6432",
        desc: "Aggregates public records, bankruptcies, and insurance claims. The 'Big Brother'.",
        color: "text-slate-400",
        border: "hover:border-slate-500/50",
        bg: "bg-slate-500/10"
    },
    {
        id: 'corelogic',
        name: "CoreLogic Credco",
        category: "Housing / Rental",
        link: "https://consumers.teletrack.com/freeze",
        phone: "1-877-532-8778",
        desc: "Dominant in mortgage and rental screening. Freeze during eviction disputes.",
        color: "text-orange-500",
        border: "hover:border-orange-500/50",
        bg: "bg-orange-500/10"
    },
    {
        id: 'nctue',
        name: "NCTUE",
        category: "Utilities",
        link: "https://nctue.com/consumer/",
        phone: "1-866-349-5185",
        desc: "National Consumer Telecom & Utilities Exchange. Stops utility fraud.",
        color: "text-purple-500",
        border: "hover:border-purple-500/50",
        bg: "bg-purple-500/10"
    },
    {
        id: 'optout',
        name: "OptOutPrescreen",
        category: "Marketing",
        link: "https://www.optoutprescreen.com/",
        phone: "1-888-567-8688",
        desc: "Stops 'Pre-Approved' credit offers (junk mail) for 5 years or permanently.",
        color: "text-pink-500",
        border: "hover:border-pink-500/50",
        bg: "bg-pink-500/10"
    }
];

export default function SecurityFreeze() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12 font-sans selection:bg-red-500/30">
            {/* Background Ambience (Security Red/Green) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 animate-pulse">
                                <Lock className="w-8 h-8 text-red-500" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-heading font-black bg-gradient-to-r from-red-400 via-rose-500 to-red-600 bg-clip-text text-transparent">
                                Security Command
                            </h1>
                        </div>
                        <p className="text-slate-400 text-lg max-w-3xl">
                            Lock down your financial identity. Freezing your reports is the single most effective defense against identity theft. It does not affect your score.
                        </p>
                    </div>
                </div>

                {/* Major Bureaus */}
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" /> Major Credit Bureaus
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {BUREAUS.slice(0, 3).map((bureau) => (
                        <Card key={bureau.id} className={`bg-[#0A0F1E] border-white/5 transition-all group overflow-hidden ${bureau.border}`}>
                            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                                <Lock size={100} />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className={`bg-black/40 border-white/10 ${bureau.color}`}>
                                        {bureau.category}
                                    </Badge>
                                </div>
                                <CardTitle className={`text-2xl font-bold ${bureau.color} group-hover:brightness-125 transition-all`}>
                                    {bureau.name}
                                </CardTitle>
                                <CardDescription className="text-slate-400 leading-relaxed">
                                    {bureau.desc}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 group-hover:border-white/20"
                                    onClick={() => window.open(bureau.link, '_blank')}
                                >
                                    <Globe className="w-4 h-4 mr-2 opacity-50" /> Online Freeze
                                    <ExternalLink className="w-3 h-3 ml-auto opacity-30" />
                                </Button>
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-mono">
                                    <Phone className="w-3 h-3" /> {bureau.phone}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Specialty Bureaus */}
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-indigo-500" /> Specialty, Banking & Behavior
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {BUREAUS.slice(3).map((bureau) => (
                        <Card key={bureau.id} className={`bg-[#0A0F1E] border-white/5 transition-all group overflow-hidden ${bureau.border}`}>
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className={`bg-black/40 border-white/10 ${bureau.color}`}>
                                        {bureau.category}
                                    </Badge>
                                </div>
                                <CardTitle className={`text-xl font-bold ${bureau.color}`}>
                                    {bureau.name}
                                </CardTitle>
                                <CardDescription className="text-slate-400 text-sm">
                                    {bureau.desc}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    size="sm"
                                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10"
                                    onClick={() => window.open(bureau.link, '_blank')}
                                >
                                    <Globe className="w-4 h-4 mr-2 opacity-50" /> Portal Link
                                    <ExternalLink className="w-3 h-3 ml-auto opacity-30" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Info Block */}
                <div className="bg-amber-900/10 border border-amber-500/20 p-6 rounded-xl flex gap-4 items-start">
                    <div className="p-3 bg-amber-500/10 rounded-full text-amber-500 shrink-0 animate-pulse">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-1">Important: Keep Your PINs Safe</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            When you freeze your credit, the bureau may issue you a <strong>PIN (Personal Identification Number)</strong>.
                            You MUST store this PIN in a secure location (like a password manager).
                            If you lose it, unfreezing your credit can be a difficult and time-consuming process requiring mail-in identity verification.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
