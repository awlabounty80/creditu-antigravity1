import { X, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function AnnouncementBanner() {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-1 shadow-lg shadow-indigo-500/20 animate-in slide-in-from-top-4 fade-in duration-700">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

            <div className="bg-[#0A0F1E] rounded-xl p-5 relative z-10 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300 shrink-0">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm mb-1">Vision Center Initialized</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                You can now manifest your financial goals. Set targets for Homes, Cars, and Business Empires.
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setIsVisible(false)} className="text-slate-500 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={() => window.location.href = '/dashboard/vision'}
                        size="sm"
                        variant="secondary"
                        className="w-full text-xs font-bold h-8 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20"
                    >
                        Launch Vision Center
                    </Button>
                </div>
            </div>
        </div>
    )
}
