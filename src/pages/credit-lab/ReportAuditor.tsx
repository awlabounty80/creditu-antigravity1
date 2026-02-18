import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
    ArrowRight,
    ShieldCheck,
    Search,
    Info,
    AlertTriangle,
    AlertCircle,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Zap
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type ImpactLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

interface AuditItem {
    id: string;
    label: string;
    description: string;
    impact: ImpactLevel;
    strategy: string;
}

const AUDIT_DATA: { id: string; title: string; items: AuditItem[] }[] = [
    {
        id: 'personal',
        title: 'Personal Identity',
        items: [
            {
                id: 'p1',
                label: 'Misspelled Name or Alias',
                description: 'Variations of your name (e.g., "J Smith" vs "John Smith") can cause "mixed files" where another person\'s bad credit appears on your report.',
                impact: 'MEDIUM',
                strategy: 'Dispute all incorrect name variations. Retain only your current legal name.'
            },
            {
                id: 'p2',
                label: 'Old or Incorrect Addresses',
                description: 'Credit bureaus use old addresses to "link" you to old negative accounts. If an old address is removed, the link to the collection often breaks.',
                impact: 'HIGH',
                strategy: 'Aggressively dispute all non-current addresses before disputing accounts.'
            },
            {
                id: 'p3',
                label: 'Unknown Employer Listed',
                description: 'Employer information is data sold for marketing and collections. It does not help your score but can help collectors find you.',
                impact: 'LOW',
                strategy: 'Request removal of all employer data as outdated or inaccurate.'
            }
        ]
    },
    {
        id: 'account',
        title: 'Account Status',
        items: [
            {
                id: 'a1',
                label: 'Closed Account reported as Open',
                description: 'A closed account reporting as "Open" confuses the scoring algorithm regarding your utilization and available credit mix.',
                impact: 'HIGH',
                strategy: 'Demand the status be updated to "Closed/Paid" or deleted entirely.'
            },
            {
                id: 'a2',
                label: 'Account you do not recognize (Identity Theft)',
                description: 'Any account you did not authorize is potential fraud. FCRA Section 605B provides strict removal requirements for theft.',
                impact: 'CRITICAL',
                strategy: 'File an FTC Fraud Affidavit immediately and demand a 4-day block on the reporting.'
            },
            {
                id: 'a3',
                label: 'Authorized User account negative history',
                description: 'You are rarely liable for Authorized User accounts, yet their late payments can drag down your score.',
                impact: 'HIGH',
                strategy: 'Dispute as "Not my responsibility - Authorized User only" to have it removed.'
            }
        ]
    },
    {
        id: 'dates',
        title: 'Critical Dates',
        items: [
            {
                id: 'd1',
                label: 'Collection older than 7 years',
                description: 'The Reporting Period for negative items is generally 7 years + 180 days from the Date of First Delinquency (DOFD).',
                impact: 'CRITICAL',
                strategy: 'Statute of Limitations expired. Demand immediate deletion as "Obsolete".'
            },
            {
                id: 'd2',
                label: 'Hard Inquiry older than 2 years',
                description: 'Hard inquiries must be removed after 2 years. They stop affecting your FICO score after 12 months.',
                impact: 'LOW',
                strategy: 'Dispute as "Outdated reporting".'
            },
            {
                id: 'd3',
                label: 'Payment History late after closing',
                description: 'A creditor cannot report new late payments on an account that was already closed and has a zero balance.',
                impact: 'HIGH',
                strategy: 'Dispute as "Inaccurate Reporting" - cannot be late on closed account.'
            }
        ]
    }
]

const ImpactBadge = ({ level }: { level: ImpactLevel }) => {
    const colors = {
        CRITICAL: 'bg-red-500/10 text-red-400 border-red-500/20',
        HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        MEDIUM: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        LOW: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    }
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${colors[level]}`}>
            {level}
        </span>
    )
}

export default function ReportAuditor() {
    const navigate = useNavigate()
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

    const toggleCheck = (id: string) => {
        const next = new Set(checkedItems)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setCheckedItems(next)
    }

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const next = new Set(expandedItems)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setExpandedItems(next)
    }

    // Collect strategies from checked items
    const activeStrategies = AUDIT_DATA.flatMap(section =>
        section.items.filter(item => checkedItems.has(item.id))
    );

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12 font-sans relative">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-20 w-64 h-64 bg-emerald-600/20 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10 pb-32">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 text-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.2)]">
                            <Search size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Report Auditor</h1>
                            <p className="text-slate-400 text-lg">Systematic analysis & strategy generator.</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8">
                    {AUDIT_DATA.map((section) => (
                        <Card key={section.id} className="bg-[#0A0F1E]/80 backdrop-blur border border-white/5 p-6 overflow-hidden">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 pb-4 border-b border-white/5">
                                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                {section.title}
                            </h3>
                            <div className="space-y-4">
                                {section.items.map((item) => {
                                    const isExpanded = expandedItems.has(item.id);
                                    const isChecked = checkedItems.has(item.id);

                                    return (
                                        <div
                                            key={item.id}
                                            className={`
                                                relative rounded-xl transition-all duration-300 border
                                                ${isChecked ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/5 border-transparent hover:bg-white/10'}
                                            `}
                                        >
                                            {/* Header Row */}
                                            <div className="flex items-start p-4 gap-4">
                                                <Checkbox
                                                    id={item.id}
                                                    checked={isChecked}
                                                    onCheckedChange={() => toggleCheck(item.id)}
                                                    className="mt-1 border-white/30 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 cursor-pointer" onClick={(e) => toggleExpand(item.id, e)}>
                                                        <Label className="text-lg font-medium text-slate-200 cursor-pointer hover:text-white transition-colors">
                                                            {item.label}
                                                        </Label>
                                                        <ImpactBadge level={item.impact} />
                                                    </div>

                                                    {/* Expanded Content */}
                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="pt-3 pb-1 text-slate-400 text-sm leading-relaxed space-y-2">
                                                                    <p className="flex gap-2">
                                                                        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                                                                        {item.description}
                                                                    </p>
                                                                    <div className="flex gap-2 p-3 bg-black/20 rounded-lg border border-white/5 mt-2">
                                                                        <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                                                        <span className="text-amber-200/80 font-mono text-xs">
                                                                            <strong className="text-amber-400">STRATEGY:</strong> {item.strategy}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                <button
                                                    onClick={(e) => toggleExpand(item.id, e)}
                                                    className="p-1 hover:bg-white/10 rounded-full text-slate-500 transition-colors"
                                                >
                                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Generated Strategy Section - Visible when items checked */}
                <AnimatePresence>
                    {activeStrategies.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-8 mb-24"
                        >
                            <Card className="bg-gradient-to-br from-[#0B0D18] to-[#121425] border border-indigo-500/30 p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />

                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <Zap className="w-6 h-6 text-amber-400" />
                                    Generated Audit Strategy
                                </h2>

                                <div className="space-y-4 relative z-10">
                                    {activeStrategies.map((item, idx) => (
                                        <div key={item.id} className="flex gap-4 items-start p-4 bg-white/5 rounded-xl border border-white/5">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-500/20">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-200 text-sm mb-1">{item.label}</h4>
                                                <p className="text-indigo-200 text-sm font-medium">{item.strategy}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: activeStrategies.length > 0 ? 1 : 0, y: activeStrategies.length > 0 ? 0 : 20 }}
                    className="fixed bottom-8 left-0 w-full px-6 pointer-events-none z-50"
                >
                    <div className="max-w-4xl mx-auto pointer-events-auto">
                        <div className="bg-indigo-900/90 backdrop-blur-md border border-indigo-500/50 p-4 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg text-xl">
                                    {activeStrategies.length}
                                </div>
                                <div>
                                    <p className="font-bold text-white text-lg">File Defects Confirmed</p>
                                    <p className="text-indigo-200 text-xs">Your audit report is ready.</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => navigate('/dashboard/credit-lab/dispute')}
                                className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold h-12 px-8 w-full md:w-auto text-lg shadow-xl"
                            >
                                Launch Dispute Wizard <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
