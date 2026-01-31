import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

export function ActiveMissionCard() {
    return (
        <Card className="bg-[#0F1629] border-white/5 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full blur-xl -mr-10 -mt-10 pointer-events-none"></div>

            <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Mission</span>
                    <Clock className="w-3 h-3 text-slate-600 ml-auto" />
                </div>

                <h3 className="font-heading font-black text-xl text-white mb-6">90-Day Reconstruction</h3>

                <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
                    <div>
                        <div className="text-3xl font-mono font-bold text-white mb-1">42</div>
                        <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Days</div>
                    </div>
                    <div className="relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-white/5"></div>
                        <div className="pl-4">
                            <div className="text-3xl font-mono font-bold text-white mb-1">12</div>
                            <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Hrs</div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-white/5"></div>
                        <div className="pl-4">
                            <div className="text-3xl font-mono font-bold text-white mb-1">05</div>
                            <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Mins</div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6 w-full bg-black h-1 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full w-[45%] shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                </div>
            </CardContent>
        </Card>
    )
}
