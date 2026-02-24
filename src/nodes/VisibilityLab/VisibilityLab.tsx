import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Shield, Search, Zap, CheckCircle2, AlertTriangle, FileText, Upload, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseCreditReport, CreditReportData } from '@/lib/credit-parser';

export default function VisibilityLab() {
    const [isScanning, setIsScanning] = useState(false);
    const [scanResults, setScanResults] = useState<{
        score: string | number;
        flags: { type: 'positive' | 'warning', msg: string }[];
        visibility: string;
        accountsCount: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setError("Invalid Format: Internal protocols require a PDF report.");
            return;
        }

        setError(null);
        setIsScanning(true);
        setScanResults(null);

        try {
            // Real Parsing Logic
            const reportData = await parseCreditReport(file);
            console.log("Visibility Lab // Data Received:", reportData);

            // Simulation Delay for "AI Logic" feel
            await new Promise(resolve => setTimeout(resolve, 2500));

            const scoreValue = reportData.score || "N/A";
            const accountCount = reportData.accounts?.length || 0;

            // Build Dynamic Flags based on parsed data
            const dynamicFlags: { type: 'positive' | 'warning', msg: string }[] = [];

            if (reportData.score && parseInt(reportData.score) > 700) {
                dynamicFlags.push({ type: 'positive', msg: 'Elite-tier credit score detected in report metadata.' });
            } else if (reportData.score && parseInt(reportData.score) < 600) {
                dynamicFlags.push({ type: 'warning', msg: 'Sub-prime signal detected. High lending risk profile.' });
            }

            if (accountCount > 10) {
                dynamicFlags.push({ type: 'positive', msg: `Strong credit mix with ${accountCount} historical accounts.` });
            } else {
                dynamicFlags.push({ type: 'warning', msg: 'Thin file detected. Insufficient accounts for Tier-1 funding.' });
            }

            const lateAccounts = reportData.accounts?.filter(a => a.status?.toLowerCase().includes('late') || a.status?.toLowerCase().includes('collection')) || [];
            if (lateAccounts.length > 0) {
                dynamicFlags.push({ type: 'warning', msg: `${lateAccounts.length} negative items found. Immediate dispute required.` });
            } else {
                dynamicFlags.push({ type: 'positive', msg: 'No active derogatory items found in recent scan.' });
            }

            setScanResults({
                score: scoreValue,
                flags: dynamicFlags,
                visibility: parseInt(scoreValue.toString()) > 720 ? 'High - Funding Optimal' : 'Moderate - Calibration Needed',
                accountsCount: accountCount
            });
        } catch (err) {
            console.error("Scan Failed:", err);
            setError("Sync Failed: Could not extract institutional markers from this file.");
        } finally {
            setIsScanning(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-12 bg-[#020412] min-h-screen font-sans">
            {/* Header */}
            <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                    <Cpu className="w-3 h-3" /> Node: Visibility_Lab_v2.1
                </div>
                <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                    FUNDING <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">VISIBILITY</span> LAB
                </h1>
                <p className="text-slate-400 font-medium max-w-2xl mx-auto text-sm">
                    Upload your raw data for institutional-grade interpretation.
                    Our neural engine scans for markers hidden from standard scoring models.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Control Center */}
                <Card className="bg-[#0A0F29]/80 border-white/10 backdrop-blur-xl relative overflow-hidden shadow-3xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>
                    <CardHeader>
                        <CardTitle className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                            <Activity className="text-indigo-400" /> Neural Link Controller
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-sm text-slate-400 leading-relaxed font-light">
                            Initialize the Visibility Protocol by uploading an official credit report PDF.
                            The system will decrypt institutional markers and assess your capital readiness.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                <Search className="text-slate-500 w-5 h-5" />
                                <span className="text-[10px] font-mono text-slate-300 uppercase tracking-[0.2em]">Data Scraper: <span className="text-emerald-500">READY</span></span>
                            </div>
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                <Shield className="text-slate-500 w-5 h-5" />
                                <span className="text-[10px] font-mono text-slate-300 uppercase tracking-[0.2em]">Marker Detection: <span className="text-emerald-500">READY</span></span>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-xs font-bold uppercase transition-all">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />

                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isScanning}
                            className="w-full h-20 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-lg rounded-2xl shadow-[0_10px_40px_rgba(79,70,229,0.3)] transition-all hover:-translate-y-1 active:translate-y-0"
                        >
                            {isScanning ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 border-4 border-white/20 border-t-indigo-200 rounded-full animate-spin" />
                                    Parsing Data...
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Upload className="w-6 h-6" /> Inject Report PDF
                                </div>
                            )}
                        </Button>
                        <p className="text-center text-[9px] text-slate-600 font-mono uppercase tracking-widest">
                            Encrypted 256-bit Secure Sink // No data retention
                        </p>
                    </CardContent>
                </Card>

                {/* Results Area */}
                <div className="space-y-8 min-h-[500px]">
                    {isScanning ? (
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse border border-white/5 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                                </div>
                            ))}
                        </div>
                    ) : scanResults ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Card className="bg-gradient-to-br from-indigo-900/20 via-black to-black border-indigo-500/20 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4">
                                    <div className="bg-emerald-500/10 text-emerald-400 text-[8px] font-black px-2 py-1 rounded border border-emerald-500/20">VERIFIED</div>
                                </div>
                                <CardContent className="p-10 text-center space-y-6">
                                    <div>
                                        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em] mb-2">Institutional score</p>
                                        <div className="text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(99,102,241,0.4)] tracking-tighter italic">
                                            {scanResults.score}<span className="text-4xl text-indigo-500/30 not-italic">/850</span>
                                        </div>
                                    </div>
                                    <div className="inline-block px-10 py-3 bg-white/5 border border-white/10 rounded-2xl">
                                        <p className="text-xl font-black text-emerald-400 uppercase tracking-widest italic">{scanResults.visibility}</p>
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                                        Data Points Mined: {scanResults.accountsCount} Accounts // Target: 12+
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4 ml-2">
                                    <FileText className="w-4 h-4" /> Strategic Assessment
                                </h3>
                                {scanResults.flags.map((flag: any, i: number) => (
                                    <div key={i} className={cn(
                                        "flex gap-4 p-5 rounded-2xl border backdrop-blur-md transition-all hover:scale-[1.02]",
                                        flag.type === 'positive' ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-amber-500/5 border-amber-500/20 text-amber-400"
                                    )}>
                                        <div className={cn("p-2 rounded-lg", flag.type === 'positive' ? "bg-emerald-500/10" : "bg-amber-500/10")}>
                                            {flag.type === 'positive' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-widest leading-relaxed mt-2">{flag.msg}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[500px] border-4 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 group transition-colors hover:border-indigo-500/10 grayscale hover:grayscale-0">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                                <Activity className="w-12 h-12 text-slate-700 group-hover:text-indigo-500 transition-colors" />
                            </div>
                            <h3 className="text-lg font-black text-slate-400 uppercase italic tracking-widest mb-2">Protocol Standby</h3>
                            <p className="text-xs text-slate-600 font-medium uppercase tracking-[0.2em] max-w-xs">
                                Waiting for data injection to synchronize neural markers.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
