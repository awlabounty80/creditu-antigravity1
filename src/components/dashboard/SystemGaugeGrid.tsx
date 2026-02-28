import { useEffect, useState } from "react"
import { Activity, Zap, Database, Wifi, Radio, Signal } from "lucide-react"
import { cn } from "@/lib/utils"
import { BureauConnectModal } from "./BureauConnectModal"
import { Button } from "@/components/ui/button"

export function SystemGaugeGrid() {
    const [scanning, setScanning] = useState(true)
    const [systemHealth, setSystemHealth] = useState(65)
    const [, setTick] = useState(0)
    const [isConnected, setIsConnected] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Dynamic Data Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1)
            // Randomly fluctuate health slightly for "live" feel
            if (!scanning && Math.random() > 0.7 && !isConnected) {
                setSystemHealth(prev => Math.min(100, Math.max(85, prev + (Math.random() > 0.5 ? 1 : -1))))
            } else if (isConnected) {
                setSystemHealth(100) // Stabilize at 100 on connection
            }
        }, 100)

        // Initial Scan Sequence
        const scanTimer = setTimeout(() => {
            setScanning(false)
            setSystemHealth(isConnected ? 100 : 98)
        }, 3000)

        return () => {
            clearInterval(interval)
            clearTimeout(scanTimer)
        }
    }, [scanning, isConnected])

    const bureaus = [
        { name: "EQUIFAX", score: isConnected ? 742 : 724, status: "OPTIMIZED", color: "text-indigo-400", bg: "bg-indigo-500", delta: isConnected ? "+42" : "+12" },
        { name: "EXPERIAN", score: isConnected ? 738 : 718, status: isConnected ? "OPTIMIZED" : "ANALYZING", color: "text-emerald-400", bg: "bg-emerald-500", delta: isConnected ? "+35" : "+04" },
        { name: "TRANSUNION", score: isConnected ? 751 : 731, status: "OPTIMIZED", color: "text-blue-400", bg: "bg-blue-500", delta: isConnected ? "+48" : "+21" },
    ]

    const logs = [
        { time: "00:01.42", msg: "Establishing secure handshake..." },
        { time: "00:01.85", msg: "Parsing Metro2 data format..." },
        { time: "00:02.12", msg: "Filtering hard inquiries..." },
        { time: "00:02.95", msg: "Optimizing utilization ratios..." },
        { time: "00:03.44", msg: "Neural topology update complete." },
        { time: "00:04.01", msg: isConnected ? "UPLINK ESTABLISHED. LIVE FEED ACTIVE." : "Awaiting user command." },
    ]

    return (
        <div className="w-full space-y-6 font-mono text-sm relative select-none">
            <BureauConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConnect={() => setIsConnected(true)} />

            {/* Holographic Overlay Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/5 to-transparent pointer-events-none sticky top-0"></div>

            {/* TOP HUD BAR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* System Vitals */}
                <div className="md:col-span-2 bg-[#050A14]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors"></div>
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.01)_10px,rgba(255,255,255,0.01)_20px)] pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Activity className={cn("w-4 h-4 text-emerald-400", scanning && "animate-spin")} />
                            <span className="text-xs font-bold text-emerald-400 tracking-[0.2em] uppercase">System Integrity</span>
                        </div>
                        <div className="text-3xl font-black text-white tracking-tighter flex items-end gap-2">
                            {systemHealth}%
                            <span className="text-[10px] text-slate-500 font-mono mb-1.5 opacity-70">
                                {scanning ? "CALIBRATING..." : isConnected ? "OPTIMIZED" : "SIMULATION"}
                            </span>
                        </div>
                    </div>

                    {/* Live Sparkline Visual */}
                    <div className="flex items-center gap-4">
                        {!isConnected && (
                            <Button size="sm" onClick={() => setIsModalOpen(true)} className="h-8 bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white border border-indigo-500/50 text-[10px] font-bold tracking-wider uppercase animate-pulse">
                                <Signal className="w-3 h-3 mr-2" /> Connect Live Data
                            </Button>
                        )}
                        <div className="flex items-center gap-1 h-12 items-end">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-emerald-500/20 rounded-t-sm transition-all duration-300"
                                    style={{
                                        height: `${20 + Math.random() * 60}%`,
                                        opacity: i > 15 ? 0.3 : 1
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Network Status */}
                <div className="bg-[#050A14]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest">Uplink Status</span>
                        <Wifi className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className={cn("w-3 h-3 rounded-full absolute opacity-75 animate-ping", isConnected ? "bg-emerald-500" : "bg-amber-500")}></div>
                            <div className={cn("w-3 h-3 rounded-full relative", isConnected ? "bg-emerald-500" : "bg-amber-500")}></div>
                        </div>
                        <div>
                            <div className="text-white font-bold leading-none">{isConnected ? "SECURE UPLINK" : "SIMULATION MODE"}</div>
                            <div className="text-[10px] text-indigo-300/60 font-mono mt-1">{isConnected ? "METRO2 STREAM ACTIVE" : "LOCAL CACHE ONLY"}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TRI-BUREAU MATRIX */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bureaus.map((b) => (
                    <div key={b.name} className={cn("relative bg-[#0A0F1E] border rounded-xl overflow-hidden transition-all group", isConnected ? "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "border-white/5 hover:border-white/20")}>
                        {/* Header */}
                        <div className="bg-white/5 p-3 flex justify-between items-center border-b border-white/5">
                            <span className="text-[10px] font-bold text-slate-300 tracking-[0.2em]">{b.name}</span>
                            <Database size={12} className="text-slate-600 group-hover:text-white transition-colors" />
                        </div>

                        {/* Body */}
                        <div className="p-6 text-center relative">
                            {/* Scanning Effect */}
                            {(scanning || (!isConnected && Math.random() > 0.9)) && (
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[200%] w-full animate-[scan_2s_linear_infinite] pointer-events-none"></div>
                            )}

                            <div className="text-5xl font-black text-white mb-2 tracking-tighter group-hover:scale-110 transition-transform duration-500">
                                {scanning ? Math.floor(Math.random() * (850 - 300) + 300) : b.score}
                            </div>

                            <div className="flex justify-center items-center gap-2">
                                <div className={cn("px-2 py-0.5 rounded text-[10px] font-bold", b.bg + "/10", b.color)}>
                                    {b.status}
                                </div>
                                <span className={cn("text-[10px] font-mono", isConnected ? "text-emerald-400" : "text-slate-500")}>{b.delta}</span>
                            </div>
                        </div>

                        {/* Footer Data Stream */}
                        <div className="bg-black/40 p-2 border-t border-white/5 font-mono text-[9px] text-slate-600 truncate">
                            ID: {Math.random().toString(36).substring(7).toUpperCase()} // LATENCY: {Math.floor(Math.random() * 20)}ms
                        </div>
                    </div>
                ))}
            </div>

            {/* DEEP ANALYTICS & TERMINAL */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Funding Radar (Simulated visuals) */}
                <div className="bg-black/30 border border-white/10 rounded-xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-50">
                        <Radio className="text-amber-500 w-4 h-4 animate-pulse" />
                    </div>
                    <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Zap size={14} /> Funding Probability Vector
                    </h4>

                    <div className="flex items-center justify-center py-4">
                        {/* CSS Radar Chart Mockup */}
                        <div className="relative w-48 h-48">
                            {/* Axis Lines */}
                            <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-px bg-white/10 rotate-0"></div></div>
                            <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-px bg-white/10 rotate-60"></div></div>
                            <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-px bg-white/10 rotate-120"></div></div>

                            {/* Concentric Circles */}
                            <div className="absolute inset-0 m-auto w-3/4 h-3/4 border border-white/5 rounded-full"></div>
                            <div className="absolute inset-0 m-auto w-1/2 h-1/2 border border-white/5 rounded-full"></div>

                            {/* Data Polygon (Active Area) */}
                            <div className="absolute inset-0 m-auto w-3/4 h-3/4 bg-amber-500/10 border border-amber-500/50 skew-x-12 rotate-12 scale-[0.8] hover:scale-100 transition-transform duration-700"></div>

                            {/* Points */}
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] text-slate-400">INCOME</div>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-slate-400">HISTORY</div>
                            <div className="absolute top-1/4 right-0 text-[9px] text-slate-400">UTIL</div>
                            <div className="absolute top-1/4 left-0 text-[9px] text-slate-400">AGE</div>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <div className="text-2xl font-bold text-white mb-1">$50,000 - $150,000</div>
                        <p className="text-[10px] text-slate-500 uppercase">Estimated Approval Range</p>
                    </div>
                </div>

                {/* System Terminal */}
                <div className="bg-[#020408] border border-white/10 rounded-xl p-0 overflow-hidden flex flex-col min-h-[250px] font-mono text-xs shadow-inner">
                    <div className="bg-[#0F1629] p-2 border-b border-white/10 flex gap-2 items-center">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                        </div>
                        <div className="ml-auto text-[9px] text-slate-500">TERM_ROOT_ACCESS</div>
                    </div>
                    <div className="p-4 flex-1 text-emerald-500/80 space-y-1 overflow-hidden relative">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>

                        {logs.map((log, i) => (
                            <div key={i} className={cn("flex gap-3", i === logs.length - 1 && "text-emerald-400 font-bold")}>
                                <span className="text-slate-600 opacity-50">[{log.time}]</span>
                                <span className={cn("typing-effect", i === logs.length - 1 && "animate-pulse")}>
                                    {scanning && i === logs.length - 1 ? "Processing..." : log.msg}
                                </span>
                            </div>
                        ))}
                        <div className="flex gap-2 animate-pulse mt-2">
                            <span className="text-emerald-500">{">"}</span>
                            <span className="w-2 h-4 bg-emerald-500 block"></span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center py-4 opacity-30 text-[10px] uppercase tracking-[0.5em] text-white hover:opacity-100 transition-opacity">
                Fin-Tech Neural Layer v4.1
            </div>
        </div>
    )
}
