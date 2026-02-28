import { Lock, FileText, TrendingUp, Zap, Target, Shield, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export function FiveDaySystemBlueprint() {
    const days = [
        {
            day: 1,
            label: "Day 01",
            title: "Intel Analysis",
            desc: "Tri-Bureau Report Audit & Negative Item Identification",
            icon: Search,
            color: "text-blue-400",
            bg: "bg-blue-500",
            status: "unlocked"
        },
        {
            day: 2,
            label: "Day 02",
            title: "Suppression",
            desc: "Secondary Bureau Lock & Data Opt-Out Protocols",
            icon: Shield,
            color: "text-indigo-400",
            bg: "bg-indigo-500",
            status: "locked"
        },
        {
            day: 3,
            label: "Day 03",
            title: "Dispute Salvo",
            desc: "Metro2 Compliance Assualt & Factual Challenging",
            icon: FileText,
            color: "text-red-400",
            bg: "bg-red-500",
            status: "locked"
        },
        {
            day: 4,
            label: "Day 04",
            title: "Vitality Boost",
            desc: "Utilization Hacks & Authorized User Injection",
            icon: TrendingUp,
            color: "text-emerald-400",
            bg: "bg-emerald-500",
            status: "locked"
        },
        {
            day: 5,
            label: "Day 05",
            title: "Funding Launch",
            desc: "High-Limit Application Sequencing & Approval",
            icon: Zap,
            color: "text-amber-400",
            bg: "bg-amber-500",
            status: "locked"
        }
    ]

    return (
        <div className="w-full mb-12 animate-in slide-in-from-bottom-5 duration-1000 delay-300">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Target size={14} className="text-indigo-500" /> Tactical Roadmap: 5-Day Sprint
                </h3>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {days.map((item, i) => (
                    <div
                        key={i}
                        className={cn(
                            "group relative overflow-hidden rounded-xl bg-[#0F1629] border border-white/5 p-4 transition-all duration-300",
                            item.status === "unlocked" ? "hover:border-indigo-500/50 hover:bg-white/5 cursor-pointer ring-1 ring-indigo-500/20" : "opacity-60 grayscale hover:grayscale-0 hover:opacity-80"
                        )}
                    >
                        {/* Background Glow */}
                        {item.status === "unlocked" && (
                            <div className="absolute top-0 right-0 p-12 bg-indigo-500/10 rounded-full blur-2xl -mr-6 -mt-6 transition-opacity"></div>
                        )}

                        <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                            <div className="flex justify-between items-start">
                                <span className={cn("text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded-lg border border-white/5", item.status === "unlocked" ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" : "bg-black/20 text-slate-500")}>
                                    {item.label}
                                </span>
                                {item.status === "locked" ? <Lock size={12} className="text-slate-600" /> : <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>}
                            </div>

                            <div className="text-center md:text-left">
                                <div className={cn("w-10 h-10 mx-auto md:mx-0 rounded-full flex items-center justify-center mb-3 transition-colors border border-white/5", item.status === "unlocked" ? item.bg + "/10" : "bg-white/5")}>
                                    <item.icon size={18} className={item.status === "unlocked" ? item.color : "text-slate-500"} />
                                </div>
                                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">{item.title}</h4>
                                <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
