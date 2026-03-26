import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// --- Types ---
interface CinematicBriefingProps {
    assets: string[];
    text: string;
    id: string;
    onProgress?: (p: number) => void;
    onStateChange?: (s: boolean) => void;
    accentColor?: string;
}

// --- VOICE & CAPTION ENGINE ---
export const VoiceEngine = ({ 
    text, 
    id,
    onProgress,
    onStateChange,
    accentColor = "indigo",
    compact = false
}: { 
    text: string; 
    id: string;
    onProgress?: (p: number) => void;
    onStateChange?: (s: boolean) => void;
    accentColor?: string;
    compact?: boolean;
}) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentCaption, setCurrentCaption] = useState("");
    const [progress, setProgress] = useState(0);

    const speak = () => {
        if (!text) return;
        window.speechSynthesis.cancel();
        
        const briefingText = text.length > 1000 ? text.substring(0, 1000) + "..." : text;
        const cleanText = briefingText.replace(/[#*`]/g, ''); 
        
        const msg = new SpeechSynthesisUtterance(cleanText);
        msg.rate = 1.0; 
        msg.pitch = 1.0;
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || voices[0];
        if (preferredVoice) msg.voice = preferredVoice;

        msg.onboundary = (event) => {
            const charCount = cleanText.length;
            const p = (event.charIndex / charCount) * 100;
            setProgress(p);
            if (onProgress) onProgress(p);
            
            const words = cleanText.substring(event.charIndex).split(' ');
            setCurrentCaption(words.slice(0, 10).join(' ') + '...');
        };

        msg.onstart = () => {
            setIsSpeaking(true);
            if (onStateChange) onStateChange(true);
        };
        msg.onend = () => {
            setIsSpeaking(false);
            if (onStateChange) onStateChange(false);
            setCurrentCaption("");
            setProgress(0);
            if (onProgress) onProgress(0);
        };

        window.speechSynthesis.speak(msg);
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        if (onStateChange) onStateChange(false);
        setCurrentCaption("");
        setProgress(0);
        if (onProgress) onProgress(0);
    };

    const colorMap: Record<string, string> = {
        indigo: "border-indigo-500/50 text-indigo-400 bg-indigo-600/20 hover:bg-indigo-600 shadow-indigo-500/20",
        amber: "border-amber-500/50 text-amber-400 bg-amber-600/20 hover:bg-amber-600 shadow-amber-500/20",
        emerald: "border-emerald-500/50 text-emerald-400 bg-emerald-600/20 hover:bg-emerald-600 shadow-emerald-500/20",
        pink: "border-pink-500/50 text-pink-400 bg-pink-600/20 hover:bg-pink-600 shadow-pink-500/20"
    };

    const progressColors: Record<string, string> = {
        indigo: "bg-indigo-500",
        amber: "bg-amber-500",
        emerald: "bg-emerald-500",
        pink: "bg-pink-500"
    };

    return (
        <div className={cn(
            "flex flex-col items-center gap-6 z-30 w-full",
            !compact && "absolute inset-x-0 bottom-0 p-8 pt-24 bg-gradient-to-t from-black via-black/80 to-transparent"
        )}>
            <AnimatePresence mode="wait">
                {currentCaption && (
                    <motion.div 
                        key={currentCaption}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-black/60 backdrop-blur-xl px-8 py-4 md:px-12 md:py-6 rounded-3xl border border-white/10 text-lg md:text-xl font-bold text-center w-full max-w-3xl shadow-2xl text-white tracking-tight"
                    >
                        {currentCaption}
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className="flex flex-col items-center gap-4 w-full max-w-md">
                <Button 
                    onClick={isSpeaking ? stop : speak}
                    className={cn(
                        "h-14 px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] gap-3 transition-all",
                        isSpeaking 
                            ? colorMap[accentColor] || colorMap.indigo
                            : "bg-white text-black hover:bg-slate-50 shadow-xl"
                    )}
                >
                    {isSpeaking ? (
                        <><div className={cn("w-2 h-2 rounded-full animate-pulse", progressColors[accentColor] || progressColors.indigo)} /> TERMINATE AUDIO</>
                    ) : (
                        <><PlayCircle className="w-5 h-5" /> INITIATE AUDIO BRIEFING</>
                    )}
                </Button>
                
                {/* Progress Bar */}
                {isSpeaking && (
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                            className={cn("h-full", progressColors[accentColor] || progressColors.indigo)}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};


// --- CINEMATIC REEL ENGINE ---
export const CinematicBriefing = ({ 
    assets, 
    text, 
    id,
    onProgress,
    onStateChange,
    accentColor = "indigo"
}: CinematicBriefingProps) => {
    const [index, setIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // TIMING MAP FOR ASSET ROTATION
    const timingMap = [
        { time: 0, index: 0 },
        { time: 10, index: 1 },
        { time: 20, index: 2 },
        { time: 35, index: 3 },
        { time: 50, index: 4 }
    ].filter(t => t.index < assets.length);

    useEffect(() => {
        if (!isSpeaking) {
            const interval = setInterval(() => {
                setIndex((prev) => (prev + 1) % assets.length);
            }, 8000);
            return () => clearInterval(interval);
        } else {
            // Active Briefing Sync: Map progress (0-100) to 60s window
            const currentTime = (progress / 100) * 60;
            const activeBeat = [...timingMap].reverse().find(beat => currentTime >= beat.time);
            if (activeBeat && activeBeat.index < assets.length) {
                setIndex(activeBeat.index);
            }
        }
    }, [isSpeaking, progress, assets.length]);

    const handleProgress = (p: number) => {
        setProgress(p);
        if (onProgress) onProgress(p);
    };

    const handleStateChange = (s: boolean) => {
        setIsSpeaking(s);
        if (onStateChange) onStateChange(s);
    };

    return (
        <div className="relative w-full h-full overflow-hidden bg-black rounded-3xl border border-white/10 group shadow-3xl">
            {/* Background Glow */}
            <div className={cn(
                "absolute -inset-4 opacity-20 blur-3xl transition-opacity duration-1000",
                isSpeaking ? "opacity-40" : "group-hover:opacity-30",
                `bg-${accentColor}-500`
            )} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={assets[index]}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ 
                        scale: 1.25, // Ken Burns zoom
                        opacity: 1,
                        x: [0, -20, 0, 20, 0], // Subtle pan
                        transition: { 
                            scale: { duration: 25, ease: "linear" },
                            opacity: { duration: 2 },
                            x: { duration: 40, ease: "linear", repeat: Infinity }
                        }
                    }}
                    exit={{ opacity: 0, scale: 1.3, transition: { duration: 2 } }}
                    className="absolute inset-0"
                >
                    <img
                        src={assets[index]}
                        className="w-full h-full object-cover"
                        alt="Cinematic Briefing"
                    />
                    {/* Elite Fintech Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/20 to-transparent" />
                </motion.div>
            </AnimatePresence>
            
            {/* Mission HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none border-[2px] border-white/5 z-10">
                <div className={cn("absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 m-6 transition-colors duration-500", `border-${accentColor}-500/30`)} />
                <div className={cn("absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 m-6 transition-colors duration-500", `border-${accentColor}-500/30`)} />
            </div>

            <div className="absolute top-10 left-10 z-20 flex items-center gap-4">
                <div className={cn("w-1 h-8 shadow-[0_0_20px_rgba(99,102,241,0.8)] transition-all", `bg-${accentColor}-500`)} />
                <div className="flex flex-col">
                    <div className="font-black text-white text-[10px] tracking-[0.4em] uppercase">
                        Sovereign Hub // Feed Active
                    </div>
                    <div className={cn("font-mono text-[8px] tracking-widest uppercase opacity-70", `text-${accentColor}-400`)}>
                        {isSpeaking ? `Briefing Sync: ${Math.round(progress)}%` : 'System Standby'}
                    </div>
                </div>
            </div>

            <VoiceEngine 
                text={text} 
                id={id} 
                onProgress={handleProgress}
                onStateChange={handleStateChange}
                accentColor={accentColor}
            />
        </div>
    );
};
