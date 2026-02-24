import { useNavigate } from 'react-router-dom'
import { DisputeWizard } from '@/components/credit-lab/DisputeWizard'
import { CreditReportData } from '@/lib/credit-parser'

// Mock Data for Phase 3 Ingestion
const MOCK_REPORT_DATA: CreditReportData = {
    rawText: "MOCK REPORT GENERATED FOR DEMONSTRATION",
    reportDate: new Date().toISOString(),
    accounts: [
        {
            id: "1",
            creditorName: "CHASE BANK USA",
            accountNumber: "4400 0012 3456 ****",
            status: "Late 30 Days",
            balance: "$4,520",
            openedDate: "2021-05-15",
            bureau: "Experian"
        },
        {
            id: "2",
            creditorName: "PORTFOLIO RECOVERY",
            accountNumber: "991823****",
            status: "Collection",
            balance: "$1,200",
            openedDate: "2019-11-02",
            bureau: "Equifax"
        },
        {
            id: "3",
            creditorName: "CAPITAL ONE",
            accountNumber: "5100 1199 2288 ****",
            status: "Current",
            balance: "$0",
            openedDate: "2020-02-20",
            bureau: "TransUnion"
        }
    ]
}

export default function DisputePage() {
    const navigate = useNavigate()

    return (
        <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-white mb-2">Dispute Wizard AI</h1>
                <p className="text-slate-400">Select an item below to generate a factual accuracy dispute letter.</p>
            </div>

            <DisputeWizard
                reportData={MOCK_REPORT_DATA}
                onCancel={() => navigate('/dashboard/credit-lab')}
            />
        </div>
    )
}
