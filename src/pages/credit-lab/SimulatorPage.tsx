import React, { useState, useEffect } from 'react'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calculator, BrainCircuit, ArrowLeft, Database } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

export default function SimulatorPage() {
    const navigate = useNavigate()
    const [score, setScore] = useState(720)
    const [utilization, setUtilization] = useState([30])
    const [paymentHistory, setPaymentHistory] = useState([100])
    const [newCredit, setNewCredit] = useState([0])
    const [age, setAge] = useState([5])
    const [isSynced, setIsSynced] = useState(false)

    useEffect(() => {
        const savedData = localStorage.getItem('credit_report_data')
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData)
                if (parsed.score && parsed.score !== "N/A") {
                    const realScore = parseInt(parsed.score)
                    setScore(realScore)
                    setIsSynced(true)
                    // Optionally adjust sliders to match real data if we have it
                    // For now, just setting the score as a baseline
                }
            } catch (e) {
                console.error("Failed to sync simulator baseline", e)
            }
        }
    }, [])

    const calculateScore = () => {
        let base = isSynced ? score : 600
        // Adjust logic slightly if we are simulating from a real base
        if (isSynced) {
            // Relative change simulation
            let diff = 0
            diff -= ((utilization[0] - 30) * 1.5) // Change from baseline
            diff += ((paymentHistory[0] - 100) * 2.0)
            diff -= (newCredit[0] * 5)
            diff += ((age[0] - 5) * 3)
            return Math.min(850, Math.max(300, Math.round(score + diff)))
        } else {
            // Standard static simulation
            base -= (utilization[0] * 2.2)
            base += (paymentHistory[0] * 1.5)
            base -= (newCredit[0] * 8)
            base += (age[0] * 4)
            return Math.min(850, Math.max(300, Math.round(base)))
        }
    }

    useEffect(() => {
        if (!isSynced) {
            setScore(calculateScore())
        }
    }, [utilization, paymentHistory, newCredit, age])

    // Specific effect for synced simulation to avoid loop
    const [projectedScore, setProjectedScore] = useState(720)
    useEffect(() => {
        setProjectedScore(calculateScore())
    }, [utilization, paymentHistory, newCredit, age, score])

    const getScoreColor = (s: number) => {
        if (s >= 750) return "text-emerald-400"
        if (s >= 700) return "text-emerald-300"
        if (s >= 650) return "text-amber-400"
        return "text-red-500"
    }

    return (
        <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="space-y-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard/credit-lab')} className="gap-2 text-slate-400 hover:text-white pl-0">
                    <ArrowLeft className="w-4 h-4" /> Back to Lab
                </Button>
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2">FICO® Simulator</h1>
                    <p className="text-slate-400">Project how financial decisions will impact your score before you make them.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm" data-tour-id="sim-controls">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Calculator className="w-5 h-5 text-indigo-400" /> Simulation Parameters
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Adjust variables to project future outcomes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-10">
                        <div className="space-y-4" data-tour-id="sim-utilization">
                            <div className="flex justify-between text-white">
                                <Label>Credit Card Utilization</Label>
                                <span className="font-mono font-bold text-amber-400">{utilization}%</span>
                            </div>
                            <Slider value={utilization} onValueChange={setUtilization} max={100} step={1} className="py-2" />
                            <p className="text-xs text-slate-500">Target: &lt;10% for maximum impact (30% of Score).</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-white">
                                <Label>On-Time Payment History</Label>
                                <span className="font-mono font-bold text-emerald-400">{paymentHistory}%</span>
                            </div>
                            <Slider value={paymentHistory} onValueChange={setPaymentHistory} max={100} step={1} min={80} className="py-2" />
                            <p className="text-xs text-slate-500">The most critical factor (35% of Score).</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-white">
                                <Label>Hard Inquiries (6 Months)</Label>
                                <span className="font-mono font-bold text-indigo-400">{newCredit}</span>
                            </div>
                            <Slider value={newCredit} onValueChange={setNewCredit} max={10} step={1} className="py-2" />
                            <p className="text-xs text-slate-500">New credit applications (10% of Score).</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-white">
                                <Label>Average Age of Credit (Years)</Label>
                                <span className="font-mono font-bold text-purple-400">{age} Yrs</span>
                            </div>
                            <Slider value={age} onValueChange={setAge} max={20} step={1} className="py-2" />
                            <p className="text-xs text-slate-500">Length of credit history (15% of Score).</p>
                        </div>

                        {/* Quick Scenarios */}
                        <div className="pt-6 border-t border-white/5 space-y-4">
                            <Label className="text-slate-300">Run Quick Scenario</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="h-auto py-3 border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-400 text-xs text-slate-400" onClick={() => { setUtilization([2]); setPaymentHistory([100]); setNewCredit([0]); }}>
                                    Debt Free Strategy
                                </Button>
                                <Button variant="outline" className="h-auto py-3 border-indigo-500/20 hover:bg-indigo-500/10 hover:text-indigo-400 text-xs text-slate-400" onClick={() => { setUtilization([15]); setNewCredit([2]); setPaymentHistory([100]); }}>
                                    Buying a Home
                                </Button>
                                <Button variant="outline" className="h-auto py-3 border-red-500/20 hover:bg-red-500/10 hover:text-red-400 text-xs text-slate-400" onClick={() => { setUtilization([95]); setNewCredit([0]); }}>
                                    Maxed Out Cards
                                </Button>
                                <Button variant="outline" className="h-auto py-3 border-amber-500/20 hover:bg-amber-500/10 hover:text-amber-400 text-xs text-slate-400" onClick={() => { setPaymentHistory([90]); setUtilization([50]); }}>
                                    Missed Payments
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-950 to-black border-white/10 relative overflow-hidden min-h-[400px]" data-tour-id="sim-result">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>

                    {isSynced && (
                        <div className="absolute top-6 left-6 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2 z-20">
                            <Database className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live Sync Active</span>
                        </div>
                    )}

                    <div className="relative z-10 flex flex-col items-center justify-center w-72 h-72 rounded-full border-4 border-white/5 bg-slate-900/80 backdrop-blur-xl shadow-[0_0_50px_rgba(79,70,229,0.2)]">
                        <span className="text-lg text-slate-400 mb-2 uppercase tracking-widest text-[10px]">Projected Score</span>
                        <span className={cn("text-7xl font-bold font-heading tabular-nums tracking-tighter", getScoreColor(projectedScore))} data-amara-vision="Projected Score">
                            {projectedScore}
                        </span>

                        {/* Rotating Rings */}
                        <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-spin-ultra-slow"></div>
                        <div className="absolute inset-2 rounded-full border border-amber-500/20 animate-reverse-spin"></div>
                    </div>

                    <div className="mt-12 text-center max-w-sm relative z-10 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
                            <BrainCircuit size={12} /> AI Projection
                        </div>
                        <p className="text-slate-500 text-sm">
                            {isSynced
                                ? `Simulation initialized from your synced baseline of ${score}.`
                                : "This is a simulation based on FICO® 8 algorithms. Actual scores may vary based on bureau data."}
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}
