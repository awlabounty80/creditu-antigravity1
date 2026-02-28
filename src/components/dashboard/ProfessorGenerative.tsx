import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Cpu } from 'lucide-react';
import { synthesizeSpeech } from '@/lib/deepgram';

interface ProfessorGenerativeProps {
    transcript?: string;
    professorImage?: string;
    onComplete?: () => void;
}

export function ProfessorGenerative({
    transcript,
    professorImage = '/assets/dr-leverage-transmission.png',
    onComplete
}: ProfessorGenerativeProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlayback = async () => {
        if (!transcript) return;

        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
            return;
        }

        if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
            return;
        }

        // Initialize TTS
        setIsLoading(true);
        try {
            const url = await synthesizeSpeech(transcript);
            setAudioUrl(url);
            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => {
                setIsPlaying(false);
                if (onComplete) onComplete();
            };

            await audio.play();
            setIsPlaying(true);
        } catch (err) {
            console.error("Aura TTS failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

    return (
        <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-black group shadow-3xl text-white">
            {/* Background Image */}
            <img
                src={professorImage}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${isPlaying ? 'scale-110 opacity-60' : 'opacity-40 grayscale group-hover:grayscale-0'}`}
                alt="Professor"
            />

            {/* HUD Overlays */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-emerald-500 ${isPlaying ? 'animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'opacity-50'}`} />
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.2em]">
                    {isPlaying ? "Transmission Active" : "Link Standby"}
                </span>
            </div>

            {/* Neural Waves FX (Animated lines when playing) */}
            {isPlaying && (
                <div className="absolute inset-x-0 bottom-24 flex items-center justify-center gap-1 h-8">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div
                            key={i}
                            className="w-1 bg-indigo-500/50 rounded-full animate-bounce"
                            style={{
                                height: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.1}s`,
                                animationDuration: '0.6s'
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Play/Loading State */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button
                    onClick={togglePlayback}
                    className="pointer-events-auto w-20 h-20 rounded-full bg-indigo-600/20 backdrop-blur-xl border border-indigo-500/30 flex items-center justify-center hover:scale-110 hover:bg-indigo-600 hover:border-indigo-400 transition-all shadow-2xl group/btn"
                >
                    {isLoading ? (
                        <Cpu className="w-8 h-8 text-indigo-400 animate-spin" />
                    ) : isPlaying ? (
                        <Pause className="w-8 h-8 text-white fill-current" />
                    ) : (
                        <Play className="w-8 h-8 text-white fill-current translate-x-1" />
                    )}
                </button>
            </div>

            {/* Bottom ID Bar */}
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black to-transparent">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="font-heading font-black text-2xl uppercase italic tracking-tighter">
                            Dr. <span className="text-indigo-400">Leverage</span>
                        </h3>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                            Neural Sync: v1.0.5 // AURA READY
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
