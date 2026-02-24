import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Shield, Search, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VisibilityLab() {
    const [isScanning, setIsScanning] = useState(false);
    const [scanResults, setScanResults] = useState<any>(null);

    const startScan = async () => {
        setIsScanning(true);
        setScanResults(null);
        // Simulation
        await new Promise(resolve => setTimeout(resolve, 3000));
        setScanResults({
            score: 78,
            flags: [
                { type: 'positive', msg: 'Consistent digital footprint detected.' },
                { type: 'warning', msg: 'Multiple inquiry spikes in last 30 days.' },
                { type: 'positive', msg: 'Verified address history matches records.' }
            ],
            visibility: 'High - Tier 1 Ready'
        });
        setIsScanning(false);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-12 bg-[#020412] min-h-screen">
            {/* Header */}
            <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                    Node: Visibility_Lab_03
                </div>
                <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                    FUNDING <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">VISIBILITY</span> LAB
                </h1>
                <p className="text-slate-400 font-medium max-w-2xl mx-auto">
                    Analyze your digital footprint and funding readiness before you apply.
                    This node simulates institutional underwriting algorithms.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Control Center */}
                <Card className="bg-[#0A0F29]/80 border-white/10 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                    <CardHeader>
                        <CardTitle className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                            <Activity className="text-blue-400" /> Scanner Control
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Initialize the Visibility Protocol to audit your cross-platform digital presence.
                            Institutional lenders use this data to verify your identity and risk profile.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                <Search className="text-slate-500 w-5 h-5" />
                                <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">Public Data Scraper: <span className="text-emerald-500">READY</span></span>
                            </div>
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                <Shield className="text-slate-500 w-5 h-5" />
                                <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">ID Verification: <span className="text-emerald-500">READY</span></span>
                            </div>
                        </div>

                        <Button
                            onClick={startScan}
                            disabled={isScanning}
                            className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-lg rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all"
                        >
                            {isScanning ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Scanning Assets...
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Zap className="w-5 h-5" /> Initialize Audit
                                </div>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results Area */}
                <div className="space-y-8">
                    {isScanning ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
                            ))}
                        </div>
                    ) : scanResults ? (
                        <div className="space-y-6">
                            <Card className="bg-gradient-to-br from-blue-900/20 to-black border-blue-500/20">
                                <CardContent className="p-8 text-center space-y-4">
                                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em]">Visibility Score</p>
                                    <div className="text-7xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                        {scanResults.score}<span className="text-3xl text-blue-500/50">/100</span>
                                    </div>
                                    <p className="text-lg font-bold text-emerald-400 uppercase tracking-widest italic">{scanResults.visibility}</p>
                                </CardContent>
                            </Card>

                            <div className="space-y-4">
                                {scanResults.flags.map((flag: any, i: number) => (
                                    <div key={i} className={cn(
                                        "flex gap-4 p-4 rounded-xl border backdrop-blur-sm",
                                        flag.type === 'positive' ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-amber-500/5 border-amber-500/20 text-amber-400"
                                    )}>
                                        {flag.type === 'positive' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                                        <p className="text-xs font-bold uppercase tracking-wider leading-relaxed">{flag.msg}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-[400px] border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center p-12 opacity-30">
                            <Activity className="w-12 h-12 mb-4" />
                            <p className="text-xs uppercase tracking-widest font-black">No Active Scan Session</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
