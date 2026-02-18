import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
    DollarSign,
    Home,
    Car,
    CreditCard,
    TrendingDown,
    Activity,
    PieChart,
    Info,
    Landmark,
    ArrowUpRight,
    CheckCircle,
    ChevronDown,
    Calculator,
    RefreshCw,
    BookOpen,
    X,
    Shield
} from 'lucide-react';

interface DebtProfile {
    rent: number;
    autos: number;
    cards: number;
    loans: number;
    other: number;
}

type LoanType = 'Conventional' | 'FHA' | 'VA';
type IncomeFrequency = 'Monthly' | 'Annual' | 'Bi-Weekly' | 'Weekly';
type HousingMode = 'Payment' | 'LoanAmount';

export default function DebtToIncomeCalculator() {
    // State with LocalStorage Persistence
    const [income, setIncome] = useState<number>(() => {
        const saved = localStorage.getItem('dti_income');
        return saved ? parseFloat(saved) : 5000;
    });

    const [incomeFrequency, setIncomeFrequency] = useState<IncomeFrequency>(() => {
        return (localStorage.getItem('dti_income_freq') as IncomeFrequency) || 'Monthly';
    });

    const [debts, setDebts] = useState<DebtProfile>(() => {
        const saved = localStorage.getItem('dti_debts');
        return saved ? JSON.parse(saved) : {
            rent: 1200,
            autos: 400,
            cards: 200,
            loans: 100,
            other: 0
        };
    });

    const [reductionSimulation, setReductionSimulation] = useState<number>(0);
    const [interestRate, setInterestRate] = useState<number>(6.5);
    const [selectedLoanType, setSelectedLoanType] = useState<LoanType>('Conventional');

    // New: Housing Input Mode (Payment vs Loan Amount)
    const [housingMode, setHousingMode] = useState<HousingMode>('Payment');
    const [targetLoanAmount, setTargetLoanAmount] = useState<number>(250000);

    // Knowledge Base State
    const [showGuide, setShowGuide] = useState(false);

    // Persistence Effects
    useEffect(() => { localStorage.setItem('dti_income', income.toString()); }, [income]);
    useEffect(() => { localStorage.setItem('dti_income_freq', incomeFrequency); }, [incomeFrequency]);
    useEffect(() => { localStorage.setItem('dti_debts', JSON.stringify(debts)); }, [debts]);

    // Explicit Calculation (Sanitized Sum)
    const totalMonthlyDebt = (debts.rent || 0) + (debts.autos || 0) + (debts.cards || 0) + (debts.loans || 0) + (debts.other || 0);

    const updateDebt = (field: keyof DebtProfile, val: string) => {
        setDebts(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));
    };

    // Auto-Calculate Housing Payment
    useEffect(() => {
        if (housingMode === 'LoanAmount' && targetLoanAmount > 0) {
            const r = interestRate / 100 / 12;
            const n = 360;
            const pi = targetLoanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const piti = pi * 1.25;

            if (Math.abs(debts.rent - piti) > 1) {
                setDebts(prev => ({ ...prev, rent: Math.round(piti) }));
            }
        }
    }, [housingMode, targetLoanAmount, interestRate]);

    const getMonthlyIncome = () => {
        if (!income) return 0;
        switch (incomeFrequency) {
            case 'Annual': return income / 12;
            case 'Bi-Weekly': return (income * 26) / 12;
            case 'Weekly': return (income * 52) / 12;
            default: return income;
        }
    };

    const monthlyIncome = getMonthlyIncome();

    const loanLimits: Record<LoanType, number> = {
        'Conventional': 0.43,
        'FHA': 0.57,
        'VA': 0.41
    };

    const nonHousingDebt = totalMonthlyDebt - debts.rent;
    const backEndDti = monthlyIncome > 0 ? (totalMonthlyDebt / monthlyIncome) * 100 : 0;
    const frontEndDti = monthlyIncome > 0 ? (debts.rent / monthlyIncome) * 100 : 0;
    const residualIncome = monthlyIncome - totalMonthlyDebt;

    const simulatedDebt = Math.max(0, totalMonthlyDebt - reductionSimulation);
    const simulatedDti = monthlyIncome > 0 ? (simulatedDebt / monthlyIncome) * 100 : 0;

    const maxAllowedDebt = monthlyIncome * loanLimits[selectedLoanType];
    const maxHousingPayment = Math.max(0, maxAllowedDebt - nonHousingDebt);

    const calculateLoanPower = (monthlyPayment: number, rate: number) => {
        if (monthlyPayment <= 0 || rate <= 0) return 0;
        const r = rate / 100 / 12;
        const n = 360;
        const discountFactor = (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
        return monthlyPayment * discountFactor;
    };

    const estPrincipalAndInterestBudget = maxHousingPayment * 0.8;
    const estMortgagePower = calculateLoanPower(estPrincipalAndInterestBudget, interestRate);

    const getStatusColor = (dti: number) => {
        const limit = loanLimits[selectedLoanType] * 100;
        if (dti <= 36) return 'text-emerald-400';
        if (dti <= limit) return 'text-amber-400';
        return 'text-red-500';
    };

    const getRecommendation = (dti: number) => {
        const limit = loanLimits[selectedLoanType] * 100;
        if (dti <= 36) return "Excellent. You are in the 'Safe Zone'. Lenders view you as a low-risk borrower.";
        if (dti <= limit) return `Good / Borderline. You are within the ${limit}% limit for ${selectedLoanType} loans.`;
        if (selectedLoanType === 'Conventional' && dti <= 57) return "High Risk for Conventional. Consider switching to FHA (up to 57%) to see if you qualify.";
        return `Critical. Your DTI (${dti.toFixed(1)}%) exceeds the ${limit}% limit. Lower your target loan amount or pay off other debts.`;
    };

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12 font-sans selection:bg-indigo-500/30">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-4xl font-heading font-bold mb-2 flex items-center gap-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            <TrendingDown className="w-10 h-10 text-indigo-400" /> Debt-to-Income Master
                        </h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <p className="text-slate-400 text-lg">
                                Optimize your Front-End and Back-End ratios based on specific loan programs.
                            </p>
                            <button
                                onClick={() => setShowGuide(true)}
                                className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-500/20 transition-all"
                            >
                                <BookOpen className="w-3 h-3" /> DTI Guide
                            </button>
                        </div>
                    </div>
                    {/* Clear Data visual aid */}
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-white/5 px-3 py-1 rounded-full cursor-pointer hover:bg-white/10" onClick={() => localStorage.clear()} title="Click to Reset All Data">
                        <RefreshCw className="w-3 h-3" /> Reset Data
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Inputs (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm shadow-xl">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-emerald-400 text-lg">
                                    <DollarSign className="w-5 h-5" /> Financial Inputs
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Income Section */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Gross Income</Label>
                                        <div className="relative">
                                            <select
                                                value={incomeFrequency}
                                                onChange={(e) => setIncomeFrequency(e.target.value as IncomeFrequency)}
                                                className="bg-white/5 border border-white/10 rounded text-[10px] uppercase font-bold text-indigo-400 px-2 py-1 outline-none focus:border-indigo-500 appearance-none pr-6 cursor-pointer hover:bg-white/10 transition-colors"
                                            >
                                                <option value="Monthly">Monthly</option>
                                                <option value="Annual">Annual</option>
                                                <option value="Bi-Weekly">Bi-Weekly</option>
                                                <option value="Weekly">Weekly</option>
                                            </select>
                                            <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-indigo-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-emerald-500 font-bold">$</span>
                                            <Input
                                                type="number"
                                                value={income}
                                                onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                                                className="bg-[#0A0C16] border-white/10 text-emerald-300 font-mono text-xl pl-8 py-6 focus:ring-0 focus:border-emerald-500/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    {incomeFrequency !== 'Monthly' && (
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-[10px] text-slate-500">Converted to Monthly:</span>
                                            <span className="text-xs font-mono text-emerald-400 font-bold">${monthlyIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 border-b border-white/5 pb-2">
                                        <span className="flex items-center gap-2"><TrendingDown className="w-3 h-3" /> Monthly Debts</span>
                                        <span className="text-indigo-400 font-mono">${totalMonthlyDebt.toLocaleString()}</span>
                                    </div>

                                    {/* Housing Input - Dynamic Mode */}
                                    <div className="space-y-2 p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                                        <div className="flex justify-between items-center mb-1">
                                            <Label className="text-xs text-indigo-300 font-bold">Proposed Housing</Label>
                                            <div className="flex gap-1">
                                                <button onClick={() => setHousingMode('Payment')} className={`px-2 py-0.5 text-[8px] uppercase font-bold rounded ${housingMode === 'Payment' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-500'}`}>Payment</button>
                                                <button onClick={() => setHousingMode('LoanAmount')} className={`px-2 py-0.5 text-[8px] uppercase font-bold rounded ${housingMode === 'LoanAmount' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-500'}`}>Loan Amt</button>
                                            </div>
                                        </div>

                                        <div className="relative group">
                                            <Home className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 opacity-70`} />
                                            {housingMode === 'Payment' ? (
                                                <Input
                                                    type="number"
                                                    value={debts.rent}
                                                    onChange={(e) => updateDebt('rent', e.target.value)}
                                                    className="bg-white/5 border-white/10 text-white pl-10 focus:bg-white/10 transition-colors"
                                                    placeholder="Enter Monthly Rent/Mortgage"
                                                />
                                            ) : (
                                                <Input
                                                    type="number"
                                                    value={targetLoanAmount}
                                                    onChange={(e) => setTargetLoanAmount(parseFloat(e.target.value) || 0)}
                                                    className="bg-white/5 border-white/10 text-emerald-400 pl-10 focus:bg-white/10 transition-colors"
                                                    placeholder="Enter Loan Amount"
                                                />
                                            )}
                                        </div>
                                        {housingMode === 'LoanAmount' && (
                                            <div className="text-[10px] text-indigo-300/60 text-right">
                                                Est. Payment (PITI): ${debts.rent.toLocaleString()}/mo
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        {[
                                            { id: 'autos', label: 'Auto Loans', icon: Car, color: 'text-blue-400' },
                                            { id: 'cards', label: 'Credit Cards', icon: CreditCard, color: 'text-rose-400' },
                                            { id: 'loans', label: 'Student Loans', icon: Landmark, color: 'text-amber-400' },
                                            { id: 'other', label: 'Alimony / Other', icon: PieChart, color: 'text-slate-400' }
                                        ].map((item) => (
                                            <div key={item.id} className="space-y-2">
                                                <Label className="text-xs text-slate-400">{item.label}</Label>
                                                <div className="relative group">
                                                    <item.icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${item.color} opacity-70`} />
                                                    <Input
                                                        type="number"
                                                        value={debts[item.id as keyof DebtProfile]}
                                                        onChange={(e) => updateDebt(item.id as keyof DebtProfile, e.target.value)}
                                                        className="bg-white/5 border-white/10 text-white pl-10 focus:bg-white/10 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Analytics (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Main Analysis Card */}
                        <Card className="bg-[#0B0D18] border-white/10 overflow-hidden shadow-2xl relative">
                            {/* ... (Keep existing Analytics Logic) ... */}
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 opacity-50"></div>

                            <div className="p-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                    <div className="space-y-1">
                                        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-indigo-400" /> Back-End Ratio (Total)
                                        </h3>
                                        <p className="text-slate-500 text-xs text-indigo-200">
                                            Target: {loanLimits[selectedLoanType] * 100}% for {selectedLoanType}
                                        </p>
                                    </div>

                                    <div className="flex p-1 bg-white/5 rounded-lg border border-white/10">
                                        {(Object.keys(loanLimits) as LoanType[]).map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedLoanType(type)}
                                                className={`
                                                    text-[10px] font-bold px-4 py-2 rounded-md transition-all duration-300
                                                    ${selectedLoanType === type
                                                        ? 'bg-indigo-500 text-white shadow-lg'
                                                        : 'text-slate-400 hover:text-white hover:bg-white/5'}
                                                `}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-center gap-12 mb-8">
                                    <div className="relative">
                                        <div className={`text-8xl font-black font-mono tracking-tighter ${getStatusColor(backEndDti)} drop-shadow-2xl transition-colors duration-500`}>
                                            {backEndDti.toFixed(1)}<span className="text-4xl text-slate-600 ml-1">%</span>
                                        </div>
                                        <div className={`absolute -right-6 -top-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/5 border border-white/10 ${getStatusColor(backEndDti)}`}>
                                            {backEndDti <= loanLimits[selectedLoanType] * 100 ? 'Approved' : 'Denied'}
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full space-y-6">
                                        <div className="relative h-6 bg-slate-900 rounded-full overflow-hidden shadow-inner border border-white/5">
                                            <div
                                                className="absolute inset-y-0 w-0.5 bg-white/30 z-10 transition-all duration-500"
                                                style={{ left: `${loanLimits[selectedLoanType] * 100}%` }}
                                            />
                                            <div className="absolute inset-y-0 left-0 w-[36%] bg-emerald-900/20 border-r border-white/5"></div>
                                            <div
                                                className={`absolute top-1 bottom-1 w-1.5 rounded-full ${getStatusColor(backEndDti).replace('text-', 'bg-')} shadow-[0_0_15px_currentColor] transition-all duration-1000 ease-out`}
                                                style={{ left: `${Math.min(backEndDti, 98)}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-slate-500">
                                            <span>0%</span>
                                            <span className={backEndDti <= 36 ? 'text-emerald-400' : ''}>36% Safe</span>
                                            <span className="text-indigo-400 transition-all duration-500" style={{ transform: `translateX(${selectedLoanType === 'FHA' ? '20px' : '0'})` }}>
                                                {loanLimits[selectedLoanType] * 100}% Limit
                                            </span>
                                            <span>100%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 pt-6">
                                    <div className="px-4 text-center group">
                                        <div className="text-xs uppercase font-bold text-slate-500 mb-2">Front-End (Housing)</div>
                                        <div className="text-3xl font-bold text-white mb-1">{frontEndDti.toFixed(1)}%</div>
                                        <div className="text-[10px] text-slate-600">
                                            {housingMode === 'LoanAmount' ? 'Based on Proposed Loan' : 'Based on Input Payment'}
                                        </div>
                                    </div>
                                    <div className="px-4 text-center group">
                                        <div className="text-xs uppercase font-bold text-slate-500 mb-2">Buying Power (Residual)</div>
                                        <div className="text-3xl font-bold text-emerald-400 font-mono mb-1">${residualIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                        <div className="text-[10px] text-slate-600">Monthly Cash Flow</div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Mortgage Power Card */}
                        <Card className="bg-gradient-to-r from-teal-950/40 to-emerald-950/40 border-emerald-500/20 shadow-lg relative overflow-hidden transition-all duration-500">
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <DollarSign className="w-64 h-64" />
                            </div>

                            <div className="p-8 relative z-10">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                            <Home className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">Max Loan Amount</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/10 text-white uppercase tracking-wider">{selectedLoanType}</span>
                                                <span className="text-xs text-emerald-200/60">Limit: {loanLimits[selectedLoanType] * 100}% DTI</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-black/30 p-4 rounded-xl border border-white/5 min-w-[200px]">
                                        <div className="flex justify-between items-center mb-3">
                                            <Label className="text-xs uppercase font-bold text-emerald-400">Interest Rate</Label>
                                            <span className="text-sm font-mono font-bold text-white">{interestRate}%</span>
                                        </div>
                                        <Slider
                                            value={[interestRate]}
                                            min={2.5}
                                            max={10.0}
                                            step={0.125}
                                            onValueChange={(v) => setInterestRate(v[0])}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                    <div className="space-y-2">
                                        <div className="text-xs uppercase text-emerald-200/50 font-bold tracking-widest">Max Monthly Housing Payment</div>
                                        <div className={`text-5xl font-black font-mono tracking-tighter ${maxHousingPayment > 0 ? 'text-white' : 'text-red-400'}`}>
                                            ${maxHousingPayment.toFixed(0)}
                                            {maxHousingPayment <= 0 && <span className="text-lg font-sans text-red-500 ml-3">DTI Exceeded</span>}
                                        </div>
                                        <div className="text-xs text-emerald-200/40 max-w-xs">
                                            Max PITI allowed for {selectedLoanType} loans ({(loanLimits[selectedLoanType] * 100).toFixed(0)}% Back-End DTI).
                                        </div>
                                    </div>
                                    <div className="space-y-2 relative">
                                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 hidden md:block text-emerald-500/20">
                                            <ArrowUpRight className="w-12 h-12" />
                                        </div>
                                        <div className="text-xs uppercase text-emerald-400 font-bold tracking-widest text-right">Max Loan Amount</div>
                                        <div className="text-4xl font-bold font-mono text-emerald-400 text-right">
                                            ${Math.max(0, estMortgagePower).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </div>
                                        <div className="text-xs text-emerald-200/40 text-right">
                                            30yr Fixed @ {interestRate}% (Est. 20% Taxes/Ins)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900/20 to-violet-900/20 border border-indigo-500/20">
                            <div className="flex items-center gap-2 mb-3 text-indigo-300 text-sm font-bold uppercase tracking-wider">
                                <ArrowUpRight className="w-4 h-4" /> Quick Simulator
                            </div>
                            <p className="text-xs text-indigo-200/70 mb-4">
                                If you pay off <span className="text-white font-bold">${reductionSimulation || '...'}</span>/mo of debt:
                            </p>
                            <Input
                                type="number"
                                placeholder="Reduction amount ($)"
                                value={reductionSimulation}
                                onChange={(e) => setReductionSimulation(parseFloat(e.target.value) || 0)}
                                className="bg-indigo-950/40 border-indigo-500/30 text-white mb-3"
                            />
                            {reductionSimulation > 0 && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Projected DTI:</span>
                                    <span className={`font-bold font-mono ${getStatusColor(simulatedDti)}`}>
                                        {simulatedDti.toFixed(1)}%
                                    </span>
                                </div>
                            )}
                        </div>

                        <Card className="bg-slate-900/30 border-white/5">
                            <CardContent className="p-6">
                                <div className="flex gap-4">
                                    <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-1" />
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-white text-sm uppercase tracking-wide">Expert Assessment</h4>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {getRecommendation(backEndDti)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Educational Overlay */}
                {showGuide && (
                    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
                        <div className="bg-[#0B0D18] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl flex flex-col">
                            {/* Overlay Header */}
                            <div className="p-6 border-b border-white/10 sticky top-0 bg-[#0B0D18]/95 backdrop-blur z-10 flex justify-between items-center">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                                    <BookOpen className="w-6 h-6 text-indigo-400" /> DTI Knowledge Base
                                </h2>
                                <button
                                    onClick={() => setShowGuide(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            {/* Overlay Content */}
                            <div className="p-8 space-y-8 text-slate-300 leading-relaxed">
                                <section className="space-y-3">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-emerald-400" /> What is the Debt-to-Income (DTI) Ratio?
                                    </h3>
                                    <p>
                                        Your DTI ratio is the percentage of your gross monthly income that goes toward paying your monthly debt payments. Lenders use this ratio to measure your ability to manage your monthly payments and repay the money you plan to borrow.
                                    </p>
                                </section>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                                        <h4 className="font-bold text-indigo-300 uppercase text-sm tracking-wider">Front-End Ratio (Housing)</h4>
                                        <p className="text-sm">
                                            The percentage of income that goes toward housing costs (Rent/Mortgage + Taxes + Insurance).
                                            <br /><strong className="text-white">Ideal: Below 28%</strong>
                                        </p>
                                    </div>
                                    <div className="p-6 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                                        <h4 className="font-bold text-purple-300 uppercase text-sm tracking-wider">Back-End Ratio (Total)</h4>
                                        <p className="text-sm">
                                            The percentage of income that goes toward ALL debts (Housing + Credit Cards + Loans + etc).
                                            <br /><strong className="text-white">Ideal: Below 36% (Standard Limit: 43%)</strong>
                                        </p>
                                    </div>
                                </div>

                                <section className="space-y-3">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-amber-400" /> Loan Specific Limits
                                    </h3>
                                    <ul className="space-y-4">
                                        <li className="flex gap-4 items-start">
                                            <span className="font-bold text-white min-w-[120px]">Conventional:</span>
                                            <span>Typically capped at <strong className="text-white">43-45%</strong>. Borrowers with high credit scores and cash reserves may be approved up to 50% in some cases, but 43% is the "Qualified Mortgage" safe harbor.</span>
                                        </li>
                                        <li className="flex gap-4 items-start">
                                            <span className="font-bold text-white min-w-[120px]">FHA Loans:</span>
                                            <span>More lenient (Federal Housing Administration). Often allow ratios up to <strong className="text-white">57%</strong> with compensating factors (like cash reserves or residual income).</span>
                                        </li>
                                        <li className="flex gap-4 items-start">
                                            <span className="font-bold text-white min-w-[120px]">VA Loans:</span>
                                            <span>Technically have a <strong className="text-white">41%</strong> benchmark, but VA underwriters focus heavily on "Residual Income" (cash left over). High residual income can allow for DTIs well above 50-60%.</span>
                                        </li>
                                    </ul>
                                </section>

                                <section className="space-y-3">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <TrendingDown className="w-5 h-5 text-indigo-400" /> How to Lower Your DTI
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 rounded-lg">
                                            <h5 className="font-bold text-white mb-1">Before applying for a mortgage:</h5>
                                            <ul className="list-disc list-inside text-sm space-y-1 text-slate-400">
                                                <li>Pay off small balances to eliminate monthly minimums.</li>
                                                <li>Avoid taking on new debt (no new cars/furniture).</li>
                                                <li>Increase your income (side hustles, raises).</li>
                                            </ul>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-lg">
                                            <h5 className="font-bold text-white mb-1">During the process:</h5>
                                            <ul className="list-disc list-inside text-sm space-y-1 text-slate-400">
                                                <li>Use the "Quick Simulator" on this page to see the impact of paying off specific debts.</li>
                                                <li>Consider a lower loan amount or larger down payment.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
