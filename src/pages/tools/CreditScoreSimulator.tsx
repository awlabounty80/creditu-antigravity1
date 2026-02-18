import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
    Calculator, CreditCard, Calendar, CheckCircle2, RotateCcw, UploadCloud
} from 'lucide-react';

export default function CreditScoreSimulator() {
    // State for interactive factors
    const [utilization, setUtilization] = useState([30]); // Default 30%
    const [paymentHistory, setPaymentHistory] = useState(100); // 100% on time
    const [ageOfCredit, setAgeOfCredit] = useState([2]); // 2 years
    const [inquiries, setInquiries] = useState([0]); // 0 inquiries
    const [totalAccounts, setTotalAccounts] = useState([3]); // 3 accounts

    // Manual Score Inputs (State for the new feature)
    const [manualScores, setManualScores] = useState({ experian: '', transunion: '', equifax: '' });
    const [activeBureau, setActiveBureau] = useState<keyof typeof manualScores | 'generic'>('generic');

    // Base Score Logic (Simplified FICO Model)
    const projectedScore = useMemo(() => {
        let baseline = 650;

        // If a bureau is selected and has a score, use it as baseline
        if (activeBureau !== 'generic' && manualScores[activeBureau]) {
            baseline = parseInt(manualScores[activeBureau]) || 650;
            // Adjustment to normalize the "Default Simulator State" (which adds ~50 pts)
            // relative to the user's actual score.
            baseline = baseline - 50;
        }

        let score = baseline;

        // 1. Payment History (35%) - Most critical
        if (paymentHistory === 100) score += 50;
        else if (paymentHistory >= 98) score -= 20; // 1 late
        else if (paymentHistory >= 90) score -= 80; // Multiple lates
        else score -= 150; // Serious delinquency

        // 2. Utilization (30%)
        const util = utilization[0];
        if (util === 0) score += 10; // N/A usage
        else if (util <= 9) score += 60; // Excellent
        else if (util <= 29) score += 40; // Good
        else if (util <= 49) score += 15; // Okay
        else if (util <= 74) score -= 20; // High
        else score -= 60; // Maxed out

        // 3. Length of History (15%)
        const age = ageOfCredit[0];
        if (age < 2) score -= 10;
        else if (age < 5) score += 15;
        else if (age < 8) score += 30;
        else score += 50;

        // 4. New Credit / Inquiries (10%)
        const inq = inquiries[0];
        score -= (inq * 5); // -5 per inquiry

        // 5. Credit Mix (10%)
        const acc = totalAccounts[0];
        if (acc > 5) score += 10;
        if (acc > 10) score += 20;

        return Math.max(300, Math.min(850, score));
    }, [utilization, paymentHistory, ageOfCredit, inquiries, totalAccounts, manualScores, activeBureau]);

    const getScoreColor = (score: number) => {
        if (score >= 800) return 'text-emerald-400';
        if (score >= 740) return 'text-emerald-300';
        if (score >= 670) return 'text-blue-400';
        if (score >= 580) return 'text-amber-400';
        return 'text-red-400';
    };

    const getScoreRating = (score: number) => {
        if (score >= 800) return 'Exceptional';
        if (score >= 740) return 'Very Good';
        if (score >= 670) return 'Good';
        if (score >= 580) return 'Fair';
        return 'Poor';
    };

    const resetSimulator = () => {
        setUtilization([30]);
        setPaymentHistory(100);
        setAgeOfCredit([2]);
        setInquiries([0]);
        setTotalAccounts([3]);
        setActiveBureau('generic');
    };

    // Gauge Visualization Component
    const ScoreGauge = ({ score }: { score: number }) => {
        // Map 300-850 to 0-100% of half circle
        const percentage = Math.min(100, Math.max(0, (score - 300) / 550));

        return (
            <div className="relative w-64 h-32 mx-auto overflow-hidden mb-4">
                {/* Background Arc */}
                <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-[20px] border-slate-800 box-border border-b-0 border-l-0 bg-transparent rotate-45 transform text-center" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>

                {/* Colored Arcs simplified as gradient border/CSS */}
                <svg viewBox="0 0 200 100" className="w-full h-full">
                    {/* Track */}
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e293b" strokeWidth="20" strokeLinecap="round" />
                    {/* Active Segment (Approximation) */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="20"
                        strokeLinecap="round"
                        strokeDasharray={`${(percentage / 100) * 251} 251`} // 251 is approx length of arc radius 80
                        className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="50%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <Calculator className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h1 className="text-3xl font-heading font-bold">Credit Score Simulator</h1>
                        </div>
                        <p className="text-slate-400 max-w-2xl">
                            Interactive sandbox to visualize how changes in your credit profile impact your score.
                            Adjust the sliders to simulate real-world scenarios.
                        </p>
                    </div>
                    <button
                        onClick={resetSimulator}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                        <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                </div>

                {/* Credit Data Source Selection (New Feature) */}
                <Card className="bg-slate-900/50 border-white/10">
                    <CardHeader className="pb-3 border-b border-white/5">
                        <CardTitle className="text-base text-white flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Credit Profile Source
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Option 1: Manual Entry */}
                            <div className="space-y-4 border-r border-white/5 pr-6">
                                <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Option 1: Manual Entry</h4>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Experian', color: 'text-blue-400', key: 'experian' },
                                        { label: 'TransUnion', color: 'text-cyan-400', key: 'transunion' },
                                        { label: 'Equifax', color: 'text-red-400', key: 'equifax' }
                                    ].map(bureau => (
                                        <div key={bureau.label} className="flex items-center justify-between cursor-pointer group" onClick={() => setActiveBureau(bureau.key as any)}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full border ${activeBureau === bureau.key ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}></div>
                                                <span className={`text-xs ${bureau.color}`}>{bureau.label}</span>
                                            </div>
                                            <input
                                                type="number"
                                                placeholder="000"
                                                value={manualScores[bureau.key as keyof typeof manualScores]}
                                                onChange={(e) => {
                                                    setManualScores({ ...manualScores, [bureau.key]: e.target.value });
                                                    setActiveBureau(bureau.key as any);
                                                }}
                                                className={`w-20 bg-black/40 border rounded px-2 py-1 text-right text-sm text-white focus:border-indigo-500 outline-none transition-colors ${activeBureau === bureau.key ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-white/10'}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-[10px] text-slate-500 text-center pt-2">
                                    Select a bureau to use as baseline
                                </div>
                            </div>

                            {/* Option 2: Upload Report */}
                            <div className="space-y-4 border-r border-white/5 pr-6">
                                <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Option 2: Upload Report</h4>
                                <div className="border border-dashed border-white/20 rounded-xl p-4 text-center hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => {
                                    // Simulation of parsing 
                                    setUtilization([14]); setPaymentHistory(100); setAgeOfCredit([4]); setInquiries([1]);
                                }}>
                                    <div className="mx-auto w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <UploadCloud className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <p className="text-xs text-slate-400">Drag & drop PDF report</p>
                                    <p className="text-[10px] text-slate-600 mt-1">(Auto-populates simulator)</p>
                                </div>
                            </div>

                            {/* Option 3: Sync Platform */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Option 3: Auto-Sync</h4>
                                <div className="h-full flex flex-col justify-center">
                                    <button
                                        onClick={() => {
                                            // Simulation of sync
                                            setUtilization([42]); setPaymentHistory(98); setAgeOfCredit([2]); setInquiries([5]);
                                        }}
                                        className="w-full py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-bold hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw className="w-4 h-4" /> Sync with Platform
                                    </button>
                                    <p className="text-[10px] text-center text-slate-500 mt-2">Pull live data from linked accounts</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Scenarios (Restored Functionality) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button onClick={() => { setUtilization([5]); }} className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all text-left group">
                        <div className="text-emerald-400 font-bold text-sm mb-1 group-hover:translate-x-1 transition-transform">Pay Off Debt &rarr;</div>
                        <div className="text-xs text-emerald-200/60">Simulate 5% utilization</div>
                    </button>
                    <button onClick={() => { setPaymentHistory(90); }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all text-left group">
                        <div className="text-red-400 font-bold text-sm mb-1 group-hover:translate-x-1 transition-transform">Missed Payment &rarr;</div>
                        <div className="text-xs text-red-200/60">Simulate 30+ days late</div>
                    </button>
                    <button onClick={() => { setInquiries([3]); setAgeOfCredit([1]); }} className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl hover:bg-amber-500/20 transition-all text-left group">
                        <div className="text-amber-400 font-bold text-sm mb-1 group-hover:translate-x-1 transition-transform">New Cards &rarr;</div>
                        <div className="text-xs text-amber-200/60">Simulate hard inquiries</div>
                    </button>
                    <button onClick={() => { setUtilization([90]); }} className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl hover:bg-orange-500/20 transition-all text-left group">
                        <div className="text-orange-400 font-bold text-sm mb-1 group-hover:translate-x-1 transition-transform">Maxed Out &rarr;</div>
                        <div className="text-xs text-orange-200/60">Simulate 90% utilization</div>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Controls */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Factor 1: Payment History */}
                        <Card className="bg-slate-900/50 border-white/10 hover:border-indigo-500/20 transition-all">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-base text-white flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-purple-400" /> Payment Reliability
                                    </CardTitle>
                                    <Badge variant="outline" className={`${paymentHistory === 100 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'} border-0`}>
                                        {paymentHistory === 100 ? 'Perfect' : paymentHistory >= 90 ? 'Needs Work' : 'Critical'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        {[100, 98, 90, 80].map((val) => (
                                            <button
                                                key={val}
                                                onClick={() => setPaymentHistory(val)}
                                                className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-lg border transition-all
                                                    ${paymentHistory === val
                                                        ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                                            >
                                                {val === 100 ? '100% On-Time' : val === 98 ? '1 Late (30d)' : val === 90 ? 'Multiple Late' : 'Default'}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Payment history accounts for <span className="text-white font-bold">35%</span> of your score. Even one late payment can drop your score by 50-100 points.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Factor 2: Utilization */}
                        <Card className="bg-slate-900/50 border-white/10 hover:border-indigo-500/20 transition-all">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-base text-white flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-blue-400" /> Credit Utilization
                                    </CardTitle>
                                    <span className="font-mono font-bold text-blue-400">{utilization[0]}%</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <Slider
                                        defaultValue={[30]}
                                        value={utilization}
                                        onValueChange={setUtilization}
                                        max={100}
                                        step={1}
                                        className="py-4"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                        <span>0% (Excellent)</span>
                                        <span>30% (Good)</span>
                                        <span>100% (Maxed)</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Factor 3: Age & Mix */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-slate-900/50 border-white/10">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm text-white flex justify-between">
                                        <span>Age of Credit</span>
                                        <span className="text-emerald-400 font-mono">{ageOfCredit[0]} Years</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Slider
                                        defaultValue={[2]}
                                        value={ageOfCredit}
                                        onValueChange={setAgeOfCredit}
                                        min={0}
                                        max={20}
                                        step={1}
                                        className="py-4"
                                    />
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-900/50 border-white/10">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm text-white flex justify-between">
                                        <span>Hard Inquiries</span>
                                        <span className="text-amber-400 font-mono">{inquiries[0]}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Slider
                                        defaultValue={[0]}
                                        value={inquiries}
                                        onValueChange={setInquiries}
                                        min={0}
                                        max={10}
                                        step={1}
                                        className="py-4"
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column: Score Display */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            {/* Score Card */}
                            <Card className="bg-[#0A0F1E] border-indigo-500/30 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500"></div>
                                <CardContent className="pt-8 pb-8 text-center relative z-10">
                                    <ScoreGauge score={projectedScore} />

                                    <div className="-mt-12">
                                        <div className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-2">
                                            {activeBureau !== 'generic' ? `Projected ${activeBureau.charAt(0).toUpperCase() + activeBureau.slice(1)}` : 'Projected FICO®'} Score
                                        </div>
                                        <div className={`text-7xl font-black mb-2 font-mono ${getScoreColor(projectedScore)} transition-colors duration-500`}>
                                            {projectedScore}
                                        </div>
                                        <Badge variant="outline" className={`${getScoreColor(projectedScore)} border-current bg-transparent`}>
                                            {getScoreRating(projectedScore)} Rating
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recommendations */}
                            <Card className="bg-white/5 border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-sm uppercase font-bold text-slate-400 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Active Insights
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {paymentHistory < 100 && (
                                        <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-lg text-sm text-red-200">
                                            <span className="font-bold block mb-1">Critical Impact:</span>
                                            Missed payments are damaging. Make 100% on-time payments for 6+ months to recover.
                                        </div>
                                    )}
                                    {utilization[0] > 30 && (
                                        <div className="p-3 bg-amber-900/20 border border-amber-500/20 rounded-lg text-sm text-amber-200">
                                            <span className="font-bold block mb-1">High Utilization:</span>
                                            Reduce card balances below 30% ({utilization[0]}% currently) to boost score significantly.
                                        </div>
                                    )}
                                    {inquiries[0] > 2 && (
                                        <div className="p-3 bg-slate-800 border border-white/10 rounded-lg text-sm text-slate-300">
                                            <span className="font-bold block mb-1 text-white">Too Many Inquiries:</span>
                                            Avoid applying for new credit. Inquiries stay on report for 2 years.
                                        </div>
                                    )}
                                    {projectedScore >= 740 && (
                                        <div className="p-3 bg-emerald-900/20 border border-emerald-500/20 rounded-lg text-sm text-emerald-200">
                                            <span className="font-bold block mb-1">Excellent Status:</span>
                                            You qualify for the best interest rates. Keep doing what you're doing!
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Educational Context (Restored) */}
                <Card className="mt-8 bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-indigo-400" /> Understanding Score Factors
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <h4 className="font-bold text-indigo-400 mb-2">Payment History (35%)</h4>
                                <p className="text-slate-400">
                                    Most important factor. Late payments, especially 30+ days, cause severe damage.
                                    Consistent on-time payments build strong credit.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-400 mb-2">Amounts Owed (30%)</h4>
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
