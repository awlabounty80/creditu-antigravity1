import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Cpu, Activity, FileText, Ban, Scale, MessageSquare, X, ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCowChat } from '@/components/credit-lab/CreditCowChat'

const TOOLS = [
    {
        id: 'cow',
        title: 'Ask Credit Cow',
        description: 'Chat with our AI Mascot for instant answers.',
        icon: MessageSquare,
        color: 'text-pink-400',
        bg: 'bg-pink-400/10',
        border: 'border-pink-400/20',
        locked: false,
        path: 'modal:cow'
    },
    {
        id: 'dispute-wizard',
        title: 'Dispute Wizard',
        description: 'AI-guided generation of dispute letters for all 3 bureaus.',
        icon: Shield,
        color: 'text-amber-400',
        bg: 'bg-amber-400/10',
        border: 'border-amber-400/20',
        locked: false,
        path: '/dashboard/credit-lab/dispute'
    },
    {
        id: 'fico-sim',
        title: 'FICO® Simulator',
        description: 'Project how specific actions will impact your score.',
        icon: Activity,
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/10',
        border: 'border-emerald-400/20',
        locked: false, // Unlocked for demo
        path: '/dashboard/credit-lab/simulator'
    },
    {
        id: 'audit',
        title: 'Report Auditor',
        description: 'Interactive checklist for identifying common credit defects.',
        icon: Cpu,
        color: 'text-indigo-400',
        bg: 'bg-indigo-400/10',
        border: 'border-indigo-400/20',
        locked: false,
        path: '/dashboard/credit-lab/audit'
    },
    {
        id: 'letters',
        title: 'Letter Library',
        description: 'Access 50+ templates for debt validation and goodwill.',
        icon: FileText,
        color: 'text-slate-200',
        bg: 'bg-slate-100/10',
        border: 'border-slate-100/20',
        locked: false,
        path: '/dashboard/library/letters'
    },
    {
        id: 'freeze',
        title: 'Security Freeze',
        description: 'One-click locks for TransUnion, Equifax, and Experian.',
        icon: Ban,
        color: 'text-red-400',
        bg: 'bg-red-400/10',
        border: 'border-red-400/20',
        locked: false, // Unlocked for DO MORE
        path: '/dashboard/credit-lab/freeze'
    },
    {
        id: 'legal',
        title: 'Consumer Law',
        description: 'Reference engine for FCRA, FDCPA, and FACTA rights.',
        icon: Scale,
        color: 'text-blue-300',
        bg: 'bg-blue-400/10',
        border: 'border-blue-400/20',
        locked: false,
        path: '/dashboard/library/law'
    },
    {
        id: 'id-theft',
        title: 'Identity Theft',
        description: 'Execute FCRA 605B blocks and fraud recovery protocols.',
        icon: ShieldAlert,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        locked: false,
        path: '/dashboard/credit-lab/identity-theft'
    }
]

export default function CreditTools({ defaultTab }: { defaultTab?: string }) {
    const navigate = useNavigate()
    const [activeModal, setActiveModal] = useState<string | null>(null)

    // Handle defaultTab if needed

    const handleToolClick = (tool: typeof TOOLS[0]) => {
        if (tool.locked) return
        if (tool.path.startsWith('modal:')) {
            setActiveModal(tool.path.split(':')[1])
        } else {
            navigate(tool.path)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            {/* Header / Hero Section */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/40 p-10 md:p-14 group shadow-2xl">
                {/* Background Visual */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/assets/cinematic/hbcu_matrix.png" 
                        alt="Matrix" 
                        className="w-full h-full object-cover opacity-15 group-hover:scale-105 transition-transform duration-[3000ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020412] via-[#020412]/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#020412] via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase">
                            Operational Excellence
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-heading font-black tracking-tight bg-gradient-to-r from-white via-white to-amber-400 bg-clip-text text-transparent italic">
                        The Credit Lab
                    </h1>
                    <p className="text-slate-300 text-xl max-w-2xl font-light leading-relaxed">
                        Institution-grade financial engineering tools. 
                        <span className="block text-slate-500 text-lg mt-2 italic">Execute advanced repair strategies with surgical precision.</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {TOOLS.map((tool) => (
                    <Card
                        key={tool.id}
                        className={`bg-slate-900/40 border-white/5 hover:border-amber-500/30 transition-all duration-500 cursor-pointer group relative overflow-hidden shadow-2xl hover:-translate-y-2`}
                        onClick={() => handleToolClick(tool)}
                    >
                        {tool.locked && (
                            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] z-20 flex items-center justify-center">
                                <div className="px-4 py-1.5 bg-slate-900 border border-white/10 rounded-full text-[10px] font-black tracking-widest text-slate-400 flex items-center gap-2 shadow-2xl">
                                    <Ban size={12} /> RESTRICTED
                                </div>
                            </div>
                        )}

                        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all duration-700 transform group-hover:scale-125 group-hover:rotate-6 ${tool.color}`}>
                            <tool.icon size={120} strokeWidth={1} />
                        </div>

                        <CardHeader className="relative z-10">
                            <div className={`w-14 h-14 rounded-2xl ${tool.bg} ${tool.border} border flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-500`}>
                                <tool.icon size={28} className={tool.color} />
                            </div>
                            <CardTitle className="text-2xl font-heading font-black text-white group-hover:text-amber-400 transition-colors italic tracking-tight">
                                {tool.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <CardDescription className="text-slate-400 text-base leading-relaxed h-14">
                                {tool.description}
                            </CardDescription>
                            
                            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-500 group-hover:text-amber-400/70 transition-colors">
                                <span className="uppercase tracking-[0.2em]">Enter Lab</span>
                                <div className="h-px flex-1 bg-white/5 group-hover:bg-amber-500/20 transition-colors"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Founder's Tier / Endowment Section */}
            <div className="p-1 rounded-[2.5rem] bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-purple-500/20 shadow-2xl">
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-[2.2rem] p-12 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 z-0">
                         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.1),transparent_70%)]"></div>
                    </div>
                    
                    <div className="relative z-10 space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black tracking-widest uppercase">
                            Premium Institutional Access
                        </div>
                        
                        <div className="max-w-3xl mx-auto space-y-4">
                            <h3 className="text-4xl md:text-5xl font-heading font-black text-white italic tracking-tighter">
                                Unlock the Full <span className="text-amber-400">Tactical Hub</span>
                            </h3>
                            <p className="text-slate-400 text-xl font-light leading-relaxed">
                                Graduate to the Founder's Tier and deploy the full credit repair arsenal, 
                                featuring direct bureau API integration and automated certified mail tracking.
                            </p>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4">
                            <Button size="lg" className="h-16 px-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white border-none shadow-2xl shadow-amber-900/40 text-lg font-black italic transform transition-all hover:scale-105 active:scale-95">
                                Secure Founder's Seat
                            </Button>
                            <p className="text-slate-500 text-sm font-mono tracking-tighter uppercase">
                                Only 12 Academy Seats Remaining
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Modal Overlay */}
            {activeModal === 'cow' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl relative animate-in zoom-in-95 duration-200">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-12 right-0 text-white hover:bg-white/10 rounded-full"
                            onClick={() => setActiveModal(null)}
                        >
                            <X size={24} />
                        </Button>
                        <CreditCowChat />
                    </div>
                </div>
            )}
        </div>
    )
}
