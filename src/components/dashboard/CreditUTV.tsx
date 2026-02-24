import { motion } from 'framer-motion';
import { AdvancedProfessorPlayer } from '@/components/dashboard/AdvancedProfessorPlayer';

interface CreditUTVProps {
    videoUrl?: string;
    transcript?: string;
    onComplete?: () => void;
}

export function CreditUTV({
    videoUrl,
    transcript = "Welcome to the broadcast.",
    onComplete
}: CreditUTVProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full max-w-4xl mx-auto"
        >
            {/* TV Decor - Premium Version (Floating Antennas) */}
            <div className="absolute -top-12 left-10 w-1 h-16 bg-gradient-to-t from-indigo-500/50 to-transparent rounded-full transform -rotate-15 blur-[1px] hidden md:block"></div>
            <div className="absolute -top-16 left-14 w-1 h-20 bg-gradient-to-t from-rose-500/40 to-transparent rounded-full transform rotate-15 blur-[1px] hidden md:block"></div>

            {/* Main TV Frame - Version 3 (Hyper-Premium) */}
            <div className="relative group">
                {/* Outer Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-rose-500/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>

                <div className="relative bg-black rounded-[2.5rem] p-1.5 border border-white/10 shadow-3xl overflow-hidden backdrop-blur-3xl">
                    {/* Glass Bezel Inner */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                    {/* Top Branding Bar */}
                    <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/5">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-rose-500/50 animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-indigo-500/30"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                            Credit U // Transmission v3.1 // AURA
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] font-mono text-indigo-400">ENCRYPTED</span>
                        </div>
                    </div>

                    {/* The Player Container */}
                    <div className="bg-[#020412] relative overflow-hidden">
                        <AdvancedProfessorPlayer
                            transcript={transcript}
                            videoUrl={videoUrl}
                            onComplete={onComplete}
                            initialMode="video"
                        />
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="px-6 py-2 bg-black flex justify-between items-center">
                        <div className="flex gap-4">
                            <div className="h-1 w-8 bg-indigo-500/20 rounded-full"></div>
                            <div className="h-1 w-12 bg-indigo-500/20 rounded-full"></div>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-1 h-1 rounded-full bg-white/10"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
