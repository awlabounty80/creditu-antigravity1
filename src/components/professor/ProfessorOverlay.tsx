import React, { useState } from 'react';
import { useProfessor } from './ProfessorContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, MessageSquare, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { ProfessorChat } from './ProfessorChat';

// Real Avatar Component
const Avatar = ({ emotion, onClick }: { emotion?: string, onClick: () => void }) => (
    <div
        onClick={onClick}
        className={`w-20 h-20 rounded-full border-2 overflow-hidden shadow-2xl bg-[#0a0f2c] flex items-center justify-center relative
        ${emotion === 'warning' ? 'border-amber-500' : 'border-indigo-400'}
        cursor-pointer hover:scale-105 transition-transform duration-300 z-[60] group
    `}>
        <img
            src="/assets/professor/professor-creditlab.png"
            alt="Professor"
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
        />
        {/* Pulse effect if talking (simulated) */}
        <div className="absolute inset-0 border-2 border-white rounded-full opacity-20 animate-ping pointer-events-none"></div>
    </div>
);

export const ProfessorOverlay = () => {
    const { activeTrigger, dismissTrigger, prefs, toggleVoice, toggleCaptions, resetOrientation } = useProfessor();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showTranscript, setShowTranscript] = useState(false);

    // SILENT MODE: Minimalist Floating Button
    if (prefs.guidance_mode === 'SILENT') {
        return (
            <>
                <div className="fixed bottom-6 right-6 z-50 flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-full text-[10px] bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/90 hover:text-white"
                        onClick={useProfessor().resetOrientation}
                    >
                        Debug: Reset
                    </Button>
                    <Button
                        className="rounded-full shadow-2xl bg-[#0a0f2c] text-white hover:bg-indigo-900 border border-indigo-500/30"
                        onClick={() => setIsChatOpen(true)}
                    >
                        <MessageSquare className="h-4 w-4 mr-2" /> Ask Professor
                    </Button>
                </div>
                <AnimatePresence>
                    {isChatOpen && <ProfessorChat onClose={() => setIsChatOpen(false)} />}
                </AnimatePresence>
            </>
        );
    }

    return (
        <>
            {/* Active Guidance Bubble */}
            <AnimatePresence>
                {activeTrigger && !isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-8 right-8 z-50 flex items-end gap-4 max-w-md w-full pointer-events-none"
                    >
                        {/* Speech Bubble / Transcript Drawer */}
                        <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl rounded-br-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-indigo-100 flex-1 pointer-events-auto relative">

                            {/* Header Controls */}
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                                    {activeTrigger.emotion === 'warning' ? '⚠️ Important' : '🎓 Guidance Protocol'}
                                </span>
                                <button onClick={dismissTrigger} className="text-slate-300 hover:text-slate-500 transition-colors">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>

                            {/* Main Text */}
                            <p className="text-slate-800 text-sm font-medium leading-relaxed">
                                {activeTrigger.text}
                            </p>

                            {/* Footer / Controls */}
                            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100">
                                <button
                                    onClick={() => setShowTranscript(!showTranscript)}
                                    className={`text-xs flex items-center gap-1 transition-colors ${showTranscript ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-indigo-500'}`}
                                >
                                    <FileText className="h-3 w-3" /> Transcript
                                </button>

                                <div className="flex-1"></div>

                                <button onClick={toggleVoice} className="text-slate-400 hover:text-indigo-600 transition-colors">
                                    {prefs.voice_enabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                                </button>
                            </div>
                        </div>

                        {/* Avatar */}
                        <div className="flex-shrink-0 pointer-events-auto pb-1">
                            {/* The Avatar component is rendered below alongside the static button to prevent unmounting/remounting jumps */}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Static Avatar Button (Always visible unless chat open) */}
            {!isChatOpen && (
                <div className="fixed bottom-6 right-6 z-50 pointer-events-auto flex gap-2 items-end">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-full text-[10px] bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/90 hover:text-white mb-2"
                        onClick={resetOrientation}
                    >
                        Debug: Reset
                    </Button>
                    <Avatar
                        emotion={activeTrigger?.emotion || 'neutral'}
                        onClick={() => setIsChatOpen(true)}
                    />
                </div>
            )}

            {/* Chat Modal */}
            <AnimatePresence>
                {isChatOpen && <ProfessorChat onClose={() => setIsChatOpen(false)} />}
            </AnimatePresence>
        </>
    );
};
