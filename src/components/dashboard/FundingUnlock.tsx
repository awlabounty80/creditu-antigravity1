import { motion } from 'framer-motion'
import { Lock, ArrowRight, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useRevenue } from '@/hooks/useRevenue'
import { useNavigate } from 'react-router-dom'

export function FundingUnlock() {
    const { readinessScore, offers, isEligible } = useRevenue()
    const navigate = useNavigate()

    return (
        <div className="space-y-6">
            {/* Readiness Tracker */}
            <Card className="border-emerald-500/20 bg-gradient-to-br from-[#0F1629] to-[#0A0F1E] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
                <CardContent className="p-6 relative z-10">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                            </div>
                            <h3 className="font-heading font-bold text-lg text-white">Capital Readiness</h3>
                        </div>
                        <span className="font-mono font-bold text-2xl text-emerald-400">{readinessScore}%</span>
                    </div>

                    <div className="w-full bg-black/50 h-2 rounded-full mb-3 overflow-hidden border border-white/5">
                        <div
                            className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            style={{ width: `${readinessScore}%` }}
                        ></div>
                    </div>

                    <p className="text-xs text-slate-400">
                        {isEligible
                            ? <span className="text-emerald-400 flex items-center gap-1">Protocol Match Found <ArrowRight size={10} /></span>
                            : "Optimization required for institutional access."}
                    </p>
                </CardContent>
            </Card>

            {/* Offers Grid */}
            {isEligible ? (
                <div className="space-y-4">
                    {offers.map((offer, idx) => (
                        <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card
                                onClick={() => navigate('/dashboard/credit-lab')}
                                className="border-l-2 border-l-emerald-500 bg-[#0F1629] hover:bg-[#151b30] transition-colors border-y-0 border-r-0 rounded-r-lg group cursor-pointer"
                            >
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-white text-sm">{offer.title}</h4>
                                            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border border-emerald-500/30">
                                                {offer.value}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-500">{offer.description}</p>
                                    </div>
                                    <ArrowRight className="text-slate-600 group-hover:text-emerald-400 transition-colors w-4 h-4" />
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-6 flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                        <Lock className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-300">Capital Locked</p>
                        <p className="text-xs text-slate-500">Reach 500 Knowledge Points</p>
                    </div>
                </div>
            )}
        </div>
    )
}
