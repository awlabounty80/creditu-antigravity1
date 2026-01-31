import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ArrowRight, ShieldCheck, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AUDIT_POINTS = [
    {
        id: 'personal',
        title: 'Personal Identity',
        items: [
            { id: 'p1', label: 'Misspelled Name or Alias' },
            { id: 'p2', label: 'Old or Incorrect Addresses' },
            { id: 'p3', label: 'Unknown Employer Listed' }
        ]
    },
    {
        id: 'account',
        title: 'Account Status',
        items: [
            { id: 'a1', label: 'Closed Account reported as Open' },
            { id: 'a2', label: 'Account you do not recognize (Identity Theft)' },
            { id: 'a3', label: 'Authorized User account reporting negative history' }
        ]
    },
    {
        id: 'dates',
        title: 'Critical Dates',
        items: [
            { id: 'd1', label: 'Collection older than 7 years' },
            { id: 'd2', label: 'Inquiry older than 2 years' },
            { id: 'd3', label: 'Payment History showing late after account closed' }
        ]
    }
]

export default function ReportAuditor() {
    const navigate = useNavigate()
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

    const toggleItem = (id: string) => {
        const next = new Set(checkedItems)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setCheckedItems(next)
    }

    const reportCount = checkedItems.size

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12 font-sans relative">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-indigo-600/20 rounded-xl border border-indigo-500/30 text-indigo-400">
                        <Search size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-white">Report Auditor</h1>
                        <p className="text-slate-400">Systematic analysis of credit file defects.</p>
                    </div>
                </div>

                <div className="grid gap-8">
                    {AUDIT_POINTS.map((section) => (
                        <Card key={section.id} className="bg-[#0A0F1E] border border-white/10 p-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                {section.title}
                            </h3>
                            <div className="space-y-3">
                                {section.items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                                        <Checkbox
                                            id={item.id}
                                            checked={checkedItems.has(item.id)}
                                            onCheckedChange={() => toggleItem(item.id)}
                                            className="border-white/20 data-[state=checked]:bg-indigo-600"
                                        />
                                        <Label htmlFor={item.id} className="text-slate-300 font-medium cursor-pointer flex-1">
                                            {item.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: reportCount > 0 ? 1 : 0, y: reportCount > 0 ? 0 : 20 }}
                    className="fixed bottom-8 left-0 w-full px-6 pointer-events-none"
                >
                    <div className="max-w-4xl mx-auto pointer-events-auto">
                        <div className="bg-indigo-900/90 backdrop-blur-md border border-indigo-500/50 p-4 rounded-2xl shadow-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-white">
                                    {reportCount}
                                </div>
                                <div>
                                    <p className="font-bold text-white">Defects Identified</p>
                                    <p className="text-indigo-200 text-xs">Ready for dispute processing.</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => navigate('/dashboard/credit-lab/dispute')}
                                className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold h-12 px-8"
                            >
                                Launch Dispute Wizard <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
