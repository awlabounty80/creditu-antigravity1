import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, AlertCircle } from 'lucide-react';

export default function CreditScoreSimulator() {
    const [currentScore, setCurrentScore] = useState(650);
    const [scenarios, setScenarios] = useState({
        payOffCard: false,
        addAccount: false,
        missPayment: false,
        increaseLimit: false
    });

    const calculateImpact = () => {
        let newScore = currentScore;
        const changes: { action: string; impact: number; reason: string }[] = [];

        if (scenarios.payOffCard) {
            const impact = 35;
            newScore += impact;
            changes.push({
                action: 'Pay off high-balance credit card',
                impact: +impact,
                reason: 'Reduces utilization from 80% to 10%, improving Amounts Owed factor (30% of score)'
            });
        }

        if (scenarios.addAccount) {
            const impact = -5;
            newScore += impact;
            changes.push({
                action: 'Open new credit card',
                impact: impact,
                reason: 'Hard inquiry and reduced average account age temporarily lower score'
            });
        }

        if (scenarios.missPayment) {
            const impact = -110;
            newScore += impact;
            changes.push({
                action: 'Miss payment by 30+ days',
                impact: impact,
                reason: 'Payment history is 35% of score. Late payments severely damage creditworthiness.'
            });
        }

        if (scenarios.increaseLimit) {
            const impact = 15;
            newScore += impact;
            changes.push({
                action: 'Request credit limit increase',
                impact: +impact,
                reason: 'Increases available credit, lowering utilization ratio without new debt'
            });
        }

        return { newScore: Math.max(300, Math.min(850, newScore)), changes };
    };

    const { newScore, changes } = calculateImpact();
    const totalImpact = newScore - currentScore;

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-heading font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Credit Score Simulator
                    </h1>
                    <p className="text-slate-400">
                        See how different actions impact your credit score. Educational estimates based on FICO scoring factors.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-6">
                                <Label className="text-white mb-2 block">Current Credit Score</Label>
                                <Input
                                    type="number"
                                    min="300"
                                    max="850"
                                    value={currentScore}
                                    onChange={(e) => setCurrentScore(Number(e.target.value))}
                                    className="bg-white/10 border-white/20 text-white text-2xl font-bold h-14"
                                />
                                <p className="text-xs text-slate-500 mt-2">Enter a score between 300-850</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold mb-4 text-white">Select Scenarios</h3>
                                <div className="space-y-4">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={scenarios.payOffCard}
                                            onChange={(e) => setScenarios({ ...scenarios, payOffCard: e.target.checked })}
                                            className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10"
                                        />
                                        <div>
                                            <div className="text-white font-medium group-hover:text-emerald-400 transition-colors">
                                                Pay off high-balance credit card
                                            </div>
                                            <div className="text-xs text-slate-500">Reduces utilization significantly</div>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={scenarios.increaseLimit}
                                            onChange={(e) => setScenarios({ ...scenarios, increaseLimit: e.target.checked })}
                                            className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10"
                                        />
                                        <div>
                                            <div className="text-white font-medium group-hover:text-emerald-400 transition-colors">
                                                Request credit limit increase
                                            </div>
                                            <div className="text-xs text-slate-500">Improves utilization ratio</div>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={scenarios.addAccount}
                                            onChange={(e) => setScenarios({ ...scenarios, addAccount: e.target.checked })}
                                            className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10"
                                        />
                                        <div>
                                            <div className="text-white font-medium group-hover:text-amber-400 transition-colors">
                                                Open new credit card
                                            </div>
                                            <div className="text-xs text-slate-500">Hard inquiry + reduced avg age</div>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={scenarios.missPayment}
                                            onChange={(e) => setScenarios({ ...scenarios, missPayment: e.target.checked })}
                                            className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10"
                                        />
                                        <div>
                                            <div className="text-white font-medium group-hover:text-red-400 transition-colors">
                                                Miss payment by 30+ days
                                            </div>
                                            <div className="text-xs text-slate-500">Severe negative impact</div>
                                        </div>
                                    </label>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results Section */}
                    <div className="space-y-6">
                        <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/30">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Calculator className="w-6 h-6 text-indigo-400" />
                                    <h3 className="text-lg font-bold text-white">Projected Score</h3>
                                </div>

                                <div className="flex items-baseline gap-4 mb-4">
                                    <div className="text-6xl font-heading font-bold text-white">
                                        {newScore}
                                    </div>
                                    {totalImpact !== 0 && (
                                        <div className={`flex items-center gap-1 text-2xl font-bold ${totalImpact > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            <TrendingUp className={totalImpact < 0 ? 'rotate-180' : ''} />
                                            {totalImpact > 0 ? '+' : ''}{totalImpact}
                                        </div>
                                    )}
                                </div>

                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
                                        style={{ width: `${((newScore - 300) / 550) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>300</span>
                                    <span>850</span>
                                </div>
                            </CardContent>
                        </Card>

                        {changes.length > 0 && (
                            <Card className="bg-white/5 border-white/10">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold mb-4 text-white">Impact Breakdown</h3>
                                    <div className="space-y-4">
                                        {changes.map((change, idx) => (
                                            <div key={idx} className="border-l-2 border-indigo-500/50 pl-4">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-white font-medium">{change.action}</span>
                                                    <span className={`font-bold ${change.impact > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                        {change.impact > 0 ? '+' : ''}{change.impact} pts
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400">{change.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="bg-amber-500/10 border-amber-500/20">
                            <CardContent className="p-4">
                                <div className="flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-amber-200/90">
                                        <strong>Educational Tool:</strong> This simulator provides estimates based on general FICO scoring factors.
                                        Actual score changes vary by individual credit profile. Not financial advice.
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Educational Context */}
                <Card className="mt-8 bg-white/5 border-white/10">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-4 text-white">Understanding Score Factors</h3>
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <h4 className="font-bold text-indigo-400 mb-2">Payment History (35%)</h4>
                                <p className="text-slate-400">
                                    Most important factor. Late payments, especially 30+ days, cause severe damage.
                                    Consistent on-time payments build strong credit.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-purple-400 mb-2">Amounts Owed (30%)</h4>
                                <p className="text-slate-400">
                                    Credit utilization ratio. Keep below 30% ideally. Paying down balances or increasing
                                    limits improves this factor quickly.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-emerald-400 mb-2">Length of History (15%)</h4>
                                <p className="text-slate-400">
                                    Average age of accounts. Opening new accounts temporarily lowers this.
                                    Keep old accounts open to maintain history.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-amber-400 mb-2">New Credit (10%)</h4>
                                <p className="text-slate-400">
                                    Hard inquiries from credit applications. Multiple inquiries for same loan type
                                    within 14-45 days count as one.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
