import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Lock, ExternalLink, Info } from 'lucide-react'

const BUREAUS = [
    {
        name: "Experian",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        link: "https://www.experian.com/freeze/center.html",
        desc: "Largest data aggregator. Freeze here first.",
        logo: "E"
    },
    {
        name: "Equifax",
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        link: "https://www.equifax.com/personal/credit-report-services/credit-freeze/",
        desc: "Known for data breaches. Essential to lock.",
        logo: "Q"
    },
    {
        name: "TransUnion",
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        link: "https://www.transunion.com/credit-freeze",
        desc: "Often used by auto lenders and landlords.",
        logo: "T"
    },
    {
        name: "Innovis",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        link: "https://www.innovis.com/securityFreeze/index",
        desc: "The 'Fourth Bureau'. Often overlooked.",
        logo: "I"
    },
    {
        name: "LexisNexis",
        color: "text-red-800",
        bg: "bg-red-900/10",
        border: "border-red-900/20",
        link: "https://consumer.risk.lexisnexis.com/freeze",
        desc: "Secondary bureau used for insurance and bankruptcies.",
        logo: "L"
    }
]

export default function SecurityFreeze() {
    const navigate = useNavigate()

    return (
        <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="space-y-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard/credit-lab')} className="gap-2 text-slate-400 hover:text-white pl-0">
                    <ArrowLeft className="w-4 h-4" /> Back to Lab
                </Button>
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2">Security Freeze Center</h1>
                    <p className="text-slate-400 max-w-2xl">
                        Locking your credit file is the single most effective way to prevent identity theft.
                        It prevents creditors from accessing your file, stopping unauthorized accounts.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BUREAUS.map((bureau) => (
                    <Card key={bureau.name} className={`bg-[#0A0F1E] ${bureau.border} relative overflow-hidden group`}>
                        <div className={`absolute top-0 right-0 p-4 opacity-10 font-black text-6xl ${bureau.color}`}>
                            {bureau.logo}
                        </div>
                        <CardHeader>
                            <CardTitle className={`text-2xl font-bold ${bureau.color}`}>{bureau.name}</CardTitle>
                            <CardDescription className="text-slate-400">{bureau.desc}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className="w-full gap-2 border border-white/10 hover:bg-white/5"
                                variant="outline"
                                onClick={() => window.open(bureau.link, '_blank')}
                            >
                                <Lock size={14} /> Freeze Now <ExternalLink size={12} className="opacity-50" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-xl flex gap-4 items-start">
                <div className="p-3 bg-blue-500/10 rounded-full text-blue-400 shrink-0">
                    <Info size={24} />
                </div>
                <div>
                    <h3 className="text-white font-bold mb-1">Impact on Score</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Freezing your credit does <strong>NOT</strong> impact your credit score.
                        It also does not prevent you from using existing credit cards.
                        You will need to temporarily "thaw" your report (using a PIN) if you apply for new credit.
                    </p>
                </div>
            </div>
        </div>
    )
}
