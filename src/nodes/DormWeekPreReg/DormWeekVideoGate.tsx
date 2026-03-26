// CACHE_BUST_OMEGA_2026_0306_0255
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DormWeekVideoGate() {
    const navigate = useNavigate();
    const [playbackState, setPlaybackState] = useState<'initial' | 'playing' | 'completed'>('initial');
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleStartVideo = () => {
        setPlaybackState('playing');
        if (videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    };

    const handleVideoEnded = () => {
        setPlaybackState('completed');
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white selection:bg-amber-500/30 flex flex-col items-center justify-center">
            {/* FULL SCREEN VIDEO BACKGROUND */}
            <div className="absolute inset-0 z-0 bg-black">
                <video 
                    ref={videoRef}
                    src="/assets/meta-ai-hero-video.mp4"
                    autoPlay
                    loop={playbackState === 'initial'}
                    muted={playbackState === 'initial'}
                    playsInline
                    onEnded={handleVideoEnded}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${playbackState === 'completed' ? 'opacity-30' : 'opacity-100'}`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black transition-opacity duration-1000 pointer-events-none ${playbackState === 'completed' ? 'via-black/70 to-black/80 opacity-100' : 'via-transparent to-black/30 opacity-50'}`} />
            </div>

            <div className="relative z-10 w-full max-w-5xl flex flex-col items-center justify-between min-h-screen p-6 py-12">
                <div className="text-center space-y-4 pt-12 min-h-[160px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {playbackState === 'playing' ? (
                            <motion.div 
                                key="playing-text"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.2 }}
                                className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                            >
                                <motion.div 
                                    animate={{ scale: [1, 1.1, 1] }} 
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="px-4"
                                >
                                    <p className="text-3xl md:text-5xl font-black text-[#f59e0b] uppercase italic tracking-widest drop-shadow-[0_4px_10px_rgba(0,0,0,1)] bg-black/80 px-10 py-5 rounded-full border-2 border-amber-500/50 flex flex-wrap justify-center items-center text-center leading-tight mx-auto max-w-[90vw]">
                                        YOU ARE BEING 
                                        <span className="mx-3 text-white drop-shadow-[0_0_20px_rgba(245,158,11,1)] text-5xl md:text-7xl underline decoration-amber-500 decoration-4 underline-offset-8">
                                            RUSH
                                        </span> 
                                        TO THE FRONT LINE
                                    </p>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="default-text"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] leading-tight">
                                    Welcome To Credit U <br />
                                    <span className="text-amber-400">Dorm Week Rush.</span>
                                </h1>
                                <p className="text-xl md:text-2xl font-bold text-amber-500 uppercase italic drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] bg-black/40 px-6 py-3 rounded-full inline-block backdrop-blur-sm border border-amber-500/20">
                                    Where credit gets lit. <span className="text-white">Where U rise.</span>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                    <div key={playbackState} className="w-full flex justify-center pb-12">
                        {playbackState === 'initial' && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                onClick={handleStartVideo}
                                className="h-24 px-12 md:px-20 text-2xl md:text-3xl font-black uppercase tracking-[0.2em] text-black rounded-full shadow-[0_0_60px_rgba(245,158,11,0.6)] transition-all duration-300 border-4 border-amber-300 flex items-center group relative overflow-hidden bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 hover:scale-105"
                            >
                                <span className="relative z-10 flex items-center drop-shadow-sm">
                                    START REGISTRATION <Play className="w-10 h-10 ml-6 group-hover:scale-125 transition-transform fill-black" />
                                </span>
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                            </motion.button>
                        )}

                        {playbackState === 'completed' && (
                            <motion.button
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ 
                                    opacity: 1, 
                                    y: 0,
                                    scale: [1, 1.05, 1],
                                    boxShadow: [
                                        "0px 0px 10px rgba(245, 158, 11, 0.4)",
                                        "0px 0px 40px rgba(245, 158, 11, 1)",
                                        "0px 0px 10px rgba(245, 158, 11, 0.4)"
                                    ]
                                }}
                                transition={{ 
                                    opacity: { duration: 0.5 },
                                    y: { duration: 0.5 },
                                    scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 },
                                    boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }
                                }}
                                onClick={() => navigate('/admissions/register')}
                                className="h-16 px-10 md:px-16 text-lg md:text-xl font-bold uppercase tracking-wider text-white rounded-full transition-colors duration-300 flex items-center group relative overflow-hidden bg-[#e08f10] hover:bg-[#d48100] border-2 border-amber-400"
                            >
                                <span className="relative z-10 flex items-center drop-shadow-md">
                                    CLICK TO OPEN GATE <ChevronRight className="w-6 h-6 ml-2 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </motion.button>
                        )}
                    </div>
                </AnimatePresence>
            </div>
        </div>
    );
}
