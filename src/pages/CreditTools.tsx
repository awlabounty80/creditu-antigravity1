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

export function CreditTools({ defaultTab }: { defaultTab?: string }) {
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
            <div>
                <h1 className="text-4xl font-heading font-bold text-white mb-2">Credit Lab</h1>
                <p className="text-slate-400 text-lg">Advanced tools for credit repair and score optimization.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOOLS.map((tool) => (
                    <Card
                        key={tool.id}
                        className={`bg-[#0A0F1E] border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group relative overflow-hidden`}
                        onClick={() => handleToolClick(tool)}
                    >
                        {tool.locked && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                                <div className="px-3 py-1 bg-black/50 border border-white/10 rounded-full text-xs font-mono text-slate-400 flex items-center gap-2">
                                    <Ban size={12} /> RESTRICTED
                                </div>
                            </div>
                        )}

                        <div className={`absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity ${tool.color}`}>
                            <tool.icon size={80} strokeWidth={1} />
                        </div>

                        <CardHeader>
                            <div className={`w-12 h-12 rounded-xl ${tool.bg} ${tool.border} border flex items-center justify-center mb-4 text-white`}>
                                <tool.icon size={24} className={tool.color} />
                            </div>
                            <CardTitle className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                {tool.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-slate-400 h-10">
                                {tool.description}
                            </CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Ingestion Note: This mirrors the 'Credit Studio' tab from Lovable */}
            <div className="p-1 rounded-2xl bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-emerald-500/20">
                <div className="bg-[#0A0F1E] rounded-xl p-8 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-2">Need the Heavy Artillery?</h3>
                        <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
                            Unlock the Full Credit Repair Suite, including letter generation,
                            certified mail tracking, and direct bureau API integration.
                        </p>
                        <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-none shadow-lg shadow-amber-900/20">
                            Upgrade to Founder's Tier
                        </Button>
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
