import { Progress } from "@/components/ui/progress"
import { ShieldCheck } from "lucide-react"

export function SystemGaugeGrid() {
    const gauges = [
        { label: "Personal Credit", value: 0, color: "bg-indigo-500" },
        { label: "Business Credit", value: 0, color: "bg-emerald-500" },
        { label: "Credit Rebuild & Recovery", value: 0, color: "bg-blue-500" },
        { label: "Emotional + Financial Healing", value: 0, color: "bg-amber-500" },
    ]

    return (
        <div className="space-y-4 animate-in fade-in duration-700 delay-300">
            <div className="flex items-center gap-2 mb-2">
                <h3 className="font-heading text-lg font-bold text-white">System Dashboard</h3>
                <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck size={10} /> Secure Connection Established
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gauges.map((gauge) => (
                    <div key={gauge.label} className="bg-[#0F1629] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{gauge.label}</span>
                            <span className="text-xs font-mono font-bold text-slate-500">{gauge.value}%</span>
                        </div>
                        {/* @ts-ignore */}
                        <Progress value={gauge.value} className="h-1.5 bg-black" indicatorClassName={gauge.color} />
                    </div>
                ))}
            </div>
        </div>
    )
}
