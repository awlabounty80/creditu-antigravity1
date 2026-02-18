import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash2, Plus, Info, CheckCircle2, AlertTriangle, Calculator, ArrowDown, Sparkles, Calendar } from 'lucide-react';

interface CardData {
    id: string;
    name: string;
    balance: number;
    limit: number;
    statementDay?: number; // Day of month (1-31)
    apr?: number;
}

export default function CreditUtilizationCalculator() {
    const [cards, setCards] = useState<CardData[]>([]);
    const [openAdvanced, setOpenAdvanced] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState<number | ''>('');

    // Load from LocalStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('credit_util_cards');
        if (saved) {
            try {
                setCards(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load cards", e);
            }
        } else {
            // Default starter card
            setCards([{ id: '1', name: 'Example Card', balance: 500, limit: 1000, statementDay: 15, apr: 24.99 }]);
        }
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        localStorage.setItem('credit_util_cards', JSON.stringify(cards));
    }, [cards]);

    const addCard = () => {
        const newCard: CardData = {
            id: Date.now().toString(),
            name: `Card ${cards.length + 1}`,
            balance: 0,
            limit: 1000,
            statementDay: 1,
            apr: 0
        };
        setCards([...cards, newCard]);
    };

    const removeCard = (id: string) => {
        setCards(cards.filter(c => c.id !== id));
    };

    const updateCard = (id: string, field: keyof CardData, value: string | number) => {
        setCards(cards.map(c => {
            if (c.id === id) {
                return { ...c, [field]: value };
            }
            return c;
        }));
    };

    // Derived Calculations
    const totalBalance = cards.reduce((sum, card) => sum + (card.balance || 0), 0);
    const totalLimit = cards.reduce((sum, card) => sum + (card.limit || 0), 0);
    const utilization = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;

    // Advanced Calculations
    const totalInterestPerMonth = cards.reduce((sum, card) => {
        if (!card.apr || !card.balance) return sum;
        return sum + (card.balance * (card.apr / 100) / 12);
    }, 0);

    // Simulator Calculation
    const getProjectedUtilization = () => {
        if (typeof paymentAmount !== 'number' || paymentAmount <= 0) return utilization;
        const newBalance = Math.max(0, totalBalance - paymentAmount);
        return totalLimit > 0 ? (newBalance / totalLimit) * 100 : 0;
    };
    const projectedUtil = getProjectedUtilization();

    const getStatusColor = (util: number) => {
        if (util <= 9) return 'text-emerald-400';
        if (util <= 29) return 'text-emerald-300';
        if (util <= 49) return 'text-amber-400';
        if (util <= 74) return 'text-orange-400';
        return 'text-red-500';
    };

    const getProgressColor = (util: number) => {
        if (util <= 9) return 'bg-emerald-500';
        if (util <= 29) return 'bg-emerald-400';
        if (util <= 49) return 'bg-amber-500';
        if (util <= 74) return 'bg-orange-500';
        return 'bg-red-600';
    };

    const getAssessment = (util: number) => {
        if (util === 0) return "N/A. You have no debt usage, but having 1% usage is actually better for scoring than 0%.";
        if (util <= 9) return "Excellent. Put simply, this is the best place to be. You're mastering your credit.";
        if (util <= 29) return "Good. You are in the safe zone. Lenders view you as responsible.";
        if (util <= 48) return "Warning. You are approaching high utilization. Avoid new purchases.";
        if (util <= 74) return "High Risk. Your score is actively dropping. Pay this down immediately.";
        return "Critical. Maxed out cards are severe red flags to lenders. Stop using cards and pay down aggressively.";
    };

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <Calculator className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h1 className="text-3xl font-heading font-bold">Credit Utilization Command Center</h1>
                        </div>
                        <p className="text-slate-400">Track your cards, simulate payments, and optimize your credit score.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setOpenAdvanced(!openAdvanced)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-bold ${openAdvanced ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                        >
                            <Sparkles className="w-4 h-4" /> {openAdvanced ? 'Simple Mode' : 'Advanced Mode'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Column */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Card List */}
                        <Card className="bg-slate-900/50 border-white/10">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-bold text-white">Your Credit Arsenal</CardTitle>
                                <Button onClick={addCard} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                                    <Plus size={16} /> Add Card
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {cards.map((card) => {
                                    const cardUtil = card.limit > 0 ? (card.balance / card.limit) * 100 : 0;
                                    return (
                                        <div key={card.id} className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                                <div className="md:col-span-4 space-y-2">
                                                    <Label className="text-xs uppercase font-bold text-slate-500">Card Name</Label>
                                                    <Input
                                                        value={card.name}
                                                        onChange={(e) => updateCard(card.id, 'name', e.target.value)}
                                                        className="bg-white/5 border-white/10 text-white"
                                                    />
                                                </div>
                                                <div className="md:col-span-3 space-y-2">
                                                    <Label className="text-xs uppercase font-bold text-slate-500">Balance ($)</Label>
                                                    <Input
                                                        type="number"
                                                        value={card.balance}
                                                        onChange={(e) => updateCard(card.id, 'balance', parseFloat(e.target.value) || 0)}
                                                        className="bg-white/5 border-white/10 text-white font-mono"
                                                    />
                                                </div>
                                                <div className="md:col-span-3 space-y-2">
                                                    <Label className="text-xs uppercase font-bold text-slate-500">Limit ($)</Label>
                                                    <Input
                                                        type="number"
                                                        value={card.limit}
                                                        onChange={(e) => updateCard(card.id, 'limit', parseFloat(e.target.value) || 0)}
                                                        className="bg-white/5 border-white/10 text-white font-mono"
                                                    />
                                                </div>
                                                <div className="md:col-span-2 flex justify-end pb-1">
                                                    <Button variant="ghost" size="icon" onClick={() => removeCard(card.id)} className="text-slate-500 hover:text-red-400 hover:bg-red-500/10">
                                                        <Trash2 size={18} />
                                                    </Button>
                                                </div>
                                            </div>

                                            {openAdvanced && (
                                                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] uppercase font-bold text-indigo-400">Statement Day (1-31)</Label>
                                                        <Input
                                                            type="number"
                                                            min="1" max="31"
                                                            placeholder="DD"
                                                            value={card.statementDay || ''}
                                                            onChange={(e) => updateCard(card.id, 'statementDay', parseInt(e.target.value) || 0)}
                                                            className="bg-indigo-500/10 border-indigo-500/20 text-indigo-200 h-8 text-xs font-mono"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] uppercase font-bold text-amber-400">APR Interest (%)</Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="0.00%"
                                                            value={card.apr || ''}
                                                            onChange={(e) => updateCard(card.id, 'apr', parseFloat(e.target.value) || 0)}
                                                            className="bg-amber-500/10 border-amber-500/20 text-amber-200 h-8 text-xs font-mono"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                                                    <span>Utilization</span>
                                                    <span className={getStatusColor(cardUtil)}>{cardUtil.toFixed(1)}%</span>
                                                </div>
                                                <Progress value={cardUtil} className="h-1.5 bg-white/10" indicatorClassName={getProgressColor(cardUtil)} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {totalInterestPerMonth > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4">
                                <div className="p-4 bg-red-950/30 border border-red-500/20 rounded-xl flex items-center gap-4">
                                    <div className="p-3 bg-red-500/20 rounded-full">
                                        <AlertTriangle className="w-6 h-6 text-red-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase font-bold text-red-400">Monthly Interest Waste</div>
                                        <div className="text-2xl font-black text-white font-mono">${totalInterestPerMonth.toFixed(2)}</div>
                                        <div className="text-[10px] text-red-300/60">Money lost to banks every month</div>
                                    </div>
                                </div>
                                <div className="p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-xl flex items-center gap-4">
                                    <div className="p-3 bg-indigo-500/20 rounded-full">
                                        <Calendar className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase font-bold text-indigo-400">Next Optimization Date</div>
                                        <div className="text-sm font-bold text-white">Pay 3 Days Before Stmt Date</div>
                                        <div className="text-[10px] text-indigo-300/60">Hides balance from credit bureaus</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payoff Simulator */}
                        <Card className="bg-indigo-900/10 border-indigo-500/20 overflow-hidden">
                            <CardHeader className="bg-indigo-500/10 border-b border-indigo-500/10">
                                <CardTitle className="text-indigo-300 flex items-center gap-2">
                                    <Calculator className="w-5 h-5" /> Payoff Simulator
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase font-bold text-indigo-300/60">Simulator Payment Amount ($)</Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 font-bold">$</span>
                                                <Input
                                                    type="number"
                                                    value={paymentAmount}
                                                    onChange={(e) => setPaymentAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                                    className="bg-black/40 border-indigo-500/30 text-white font-mono text-xl pl-8 h-12 focus:border-indigo-400 transition-colors"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-500">Enter an amount you plan to pay to see the impact.</p>
                                        </div>

                                        {(typeof paymentAmount === 'number' && paymentAmount > 0) && (
                                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg animate-in fade-in slide-in-from-top-2">
                                                <h4 className="font-bold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4" /> AI Strategy
                                                </h4>
                                                <p className="text-sm text-emerald-200/80 leading-relaxed">
                                                    Apply this <span className="text-white font-bold">${paymentAmount.toLocaleString()}</span> to the card with the highest utilization % first. This creates the biggest credit score jump.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-black/20 rounded-xl p-6 border border-indigo-500/10 text-center">
                                        <div className="text-xs uppercase font-bold text-slate-500 mb-2">Projected New Utilization</div>
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="text-4xl font-black font-mono text-white">{projectedUtil.toFixed(1)}%</span>
                                            {(typeof paymentAmount === 'number' && paymentAmount > 0) && (
                                                <span className="flex items-center text-emerald-400 text-sm font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
                                                    <ArrowDown className="w-3 h-3 mr-1" />
                                                    {(utilization - projectedUtil).toFixed(1)}%
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-4 w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 transition-all duration-700 ease-out"
                                                style={{ width: `${Math.min(projectedUtil, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Analytics & Visualization */}
                    <div className="space-y-6">
                        <Card className={`border-white/10 ${utilization > 30 ? 'bg-red-950/20' : utilization > 10 ? 'bg-indigo-950/20' : 'bg-emerald-950/20'} transition-colors duration-500`}>
                            <CardHeader>
                                <CardTitle className="text-white">Current Total Utilization</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center py-6">
                                <div className={`text-6xl font-black font-mono mb-2 ${getStatusColor(utilization)}`}>
                                    {utilization.toFixed(1)}%
                                </div>
                                <Progress value={Math.min(utilization, 100)} className="h-3 bg-white/10" indicatorClassName={utilization > 30 ? 'bg-red-500' : utilization > 10 ? 'bg-indigo-500' : 'bg-emerald-500'} />

                                <div className="mt-6 flex justify-between text-xs text-slate-400 font-mono">
                                    <div>
                                        <div className="text-slate-500 uppercase">Total Debt</div>
                                        <div className="text-white text-lg">${totalBalance.toLocaleString()}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-slate-500 uppercase">Total Limit</div>
                                        <div className="text-white text-lg">${totalLimit.toLocaleString()}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/50 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Info className="w-4 h-4" /> Assessment
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-white text-sm leading-relaxed border-l-2 border-indigo-500 pl-4 py-1">
                                    {getAssessment(utilization)}
                                </p>
                            </CardContent>
                        </Card>


                        <div className="bg-slate-900/50 rounded-xl border border-white/10 overflow-hidden">
                            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-400" /> Score Optimization Path
                                </h3>
                            </div>
                            <div className="p-0">
                                {[
                                    { limit: 48, label: "Avoid Maxed Out Warning", color: "text-amber-400" },
                                    { limit: 28, label: "Safe Zone (Under 30%)", color: "text-emerald-400" },
                                    { limit: 8, label: "Excellent (AZEO Range)", color: "text-indigo-400" }
                                ].map((target) => {
                                    const targetBal = totalLimit * (target.limit / 100);
                                    const payNeeded = Math.max(0, totalBalance - targetBal);

                                    if (utilization <= target.limit) return null;

                                    return (
                                        <div key={target.limit} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                            <div className="space-y-1">
                                                <div className={`font-bold text-sm ${target.color}`}>{target.label}</div>
                                                <div className="text-xs text-slate-500">Target: {target.limit}% Utilization</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs uppercase font-bold text-slate-500">Pay Down</div>
                                                <div className="font-mono font-bold text-white">${payNeeded.toFixed(0)}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {utilization <= 8 && (
                                    <div className="p-6 text-center text-emerald-400 font-bold flex items-center justify-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" /> You are in the Elite Range!
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <h3 className="font-bold text-emerald-400 mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> The Pro Strategy (AZEO)</h3>
                            <p className="text-sm text-emerald-200/80">
                                "All Zero Except One" (AZEO) is a strategy where you pay off all cards to $0 balance before the statement date, except for one card which you leave with a small balance (under 8% or just $10-20). This maximizes your score.
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <h3 className="font-bold text-amber-400 mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> The Dangerous 30%</h3>
                            <p className="text-sm text-amber-200/80">
                                Once you cross 30% utilization (individually or aggregate), your score begins to drop rapidly. Creditors view high usage as high risk. Aim to never cross this line unless it's an emergency.
                            </p>
                        </div>
                        <div className="mt-4 text-center">
                            <a href="/dashboard/knowledge" className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
                                Learn more about Credit Scoring Models &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
