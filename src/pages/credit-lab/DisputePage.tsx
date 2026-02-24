import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DisputeWizard } from '@/components/credit-lab/DisputeWizard'
import { CreditReportData } from '@/lib/credit-parser'
import { Button } from '@/components/ui/button'
import { FileText, Upload } from 'lucide-react'

const INITIAL_EMPTY_REPORT: CreditReportData = {
    rawText: "",
    reportDate: new Date().toISOString(),
    accounts: []
}

export default function DisputePage() {
    const navigate = useNavigate()
    const [reportData, setReportData] = useState<CreditReportData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const savedData = localStorage.getItem('credit_report_data')
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData)
                setReportData({
                    rawText: "RECOVERED FROM NEURAL SYNC",
                    reportDate: parsed.timestamp || new Date().toISOString(),
                    accounts: parsed.accounts || [],
                    score: parsed.score
                })
            } catch (e) {
                console.error("Failed to parse saved credit data", e)
            }
        }
        setIsLoading(false)
    }, [])

    if (isLoading) return <div className="p-20 text-center animate-pulse text-indigo-400">Synchronizing Local Records...</div>

    return (
        <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <FileText className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Dispute Wizard AI</h1>
                    </div>
                    <p className="text-slate-400 max-w-md">Select items from your synchronized report to generate factual accuracy challenges.</p>
                </div>

                {reportData && reportData.accounts.length > 0 && (
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                            {reportData.accounts.length} Tradelines Synced
                        </span>
                    </div>
                )}
            </div>

            <DisputeWizard
                reportData={reportData || INITIAL_EMPTY_REPORT}
                onCancel={() => navigate('/dashboard/credit-lab')}
            />
        </div>
    )
}
