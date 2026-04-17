import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useSound } from '@/hooks/useSound';

export function BureauSyncStatus() {
    const { playHover, playClick } = useSound();
    
    // Simulating a state where the user is halfway through their 30-day window
    const [daysRemaining, setDaysRemaining] = useState(14);
    const totalDays = 30;
    
    const percentage = Math.max(0, Math.min(100, (daysRemaining / totalDays) * 100));
    
    const isNeedsSync = daysRemaining <= 0;
    const isWarning = daysRemaining <= 5 && daysRemaining > 0;
    
    // Status color mapping
    const statusColor = isNeedsSync 
        ? 'rose' // Critical / Need to pull
        : isWarning 
            ? 'amber' // Warning
            : 'emerald'; // Good standing

    // Helper for Tailwind dynamic colors (prevents PurgeCSS from dropping them if we use full classes)
    const getBgColor = () => {
        if (isNeedsSync) return 'bg-rose-500';
        if (isWarning) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    const getTextColor = () => {
        if (isNeedsSync) return 'text-rose-400';
        if (isWarning) return 'text-amber-400';
        return 'text-emerald-400';
    };

    const getBorderHover = () => {
        if (isNeedsSync) return 'hover:border-rose-500/50';
        if (isWarning) return 'hover:border-amber-500/50';
        return 'hover:border-emerald-500/50';
    };

    return (
        <Card 
            className={`bg-[#0A0F1E] border-white/5 relative overflow-hidden group transition-all duration-500 ${getBorderHover()}`}
            onMouseEnter={playHover}
        >
             {/* Glow Overlay */}
             <div className={`absolute top-0 right-0 p-16 rounded-full blur-2xl -mr-8 -mt-8 opacity-10 group-hover:opacity-20 transition-colors ${getBgColor()}`}></div>
             
             <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Bureau Sync Logic</h3>
                        {isNeedsSync ? (
                            <AlertTriangle className={`w-5 h-5 ${getTextColor()} animate-pulse`} />
                        ) : (
                            <ShieldCheck className={`w-5 h-5 ${getTextColor()}`} />
                        )}
                    </div>
                    
                    <div className="flex items-end gap-2 mb-1">
                        <div className={`text-5xl font-black leading-none tracking-tighter ${isNeedsSync ? 'text-rose-500' : 'text-white'}`}>
                            {daysRemaining}
                        </div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest pb-1">Days</div>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Until Next Report Required</div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-5 overflow-hidden border border-white/5">
                        <div 
                            className={`h-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.2)] ${getBgColor()}`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-2">
                    {/* Simulated "Sync Now" button that will be active when they need it */}
                    <a 
                        href="https://app.myfreescorenow.com/enroll/B02B3904"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={playClick}
                        className={`w-full py-2.5 rounded-xl border text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2
                            ${isNeedsSync || isWarning 
                                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.15)]' 
                                : 'bg-slate-800 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                            }
                        `}
                    >
                        <RotateCcw className={`w-3 h-3 ${isNeedsSync && 'animate-spin-slow'}`} /> 
                        {isNeedsSync ? 'critical: pull now' : 'manual remote pull'}
                    </a>
                </div>
             </CardContent>
        </Card>
    );
}
