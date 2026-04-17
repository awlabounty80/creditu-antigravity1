import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Box, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSound } from '@/hooks/useSound';
import { synthesizeSpeech } from '@/lib/deepgram';

interface AdvancedProfessorPlayerProps {
    transcript: string;
    videoUrl?: string;
    onComplete?: () => void;
    initialMode?: 'video' | 'avatar';
}

/**
 * AdvancedProfessorPlayer (Safe 2D HTML5 Fallback)
 * - Excludes 3D Gaussian Splatting and Three.js to guarantee Vercel deployment stability.
 * - Supports YouTube iframe embedding, native MP4 rendering, or fallback audio TTS mode.
 */
export function AdvancedProfessorPlayer({
    transcript,
    videoUrl,
    onComplete,
    initialMode = 'video'
}: AdvancedProfessorPlayerProps) {
    const isYouTube = videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
    const isVimeo = videoUrl && videoUrl.includes('vimeo.com');
    const isTwitch = videoUrl && videoUrl.includes('twitch.tv');
    const isEmbed = isYouTube || isVimeo || isTwitch;

    const [mode, setMode] = useState<'video' | 'avatar'>(initialMode);
    const isVideoMode = !!videoUrl && videoUrl.length > 0 && mode === 'video';

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const { playHover, playClick, playSuccess } = useSound();

    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const getEmbedUrl = (url: string) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            let videoId = '';
            if (url.includes('youtu.be')) videoId = url.split('youtu.be/')[1];
            else if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0`;
        }
        if (url.includes('vimeo.com')) {
            const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0];
            return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&background=1`;
        }
        if (url.includes('twitch.tv')) {
            const channel = url.split('twitch.tv/')[1]?.split('/')[0]?.split('?')[0];
            return `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}&autoplay=true&muted=false`;
        }
        return url;
    }

    // Safety timeout
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isLoading) setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [isLoading]);

    // Mode: 2D Video
    useEffect(() => {
        if (!isVideoMode || !videoRef.current || isEmbed) return;

        const video = videoRef.current;
        const handleCanPlay = () => setIsLoading(false);
        const handleTimeUpdate = () => setProgress((video.currentTime / video.duration) * 100);
        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(100);
            playSuccess();
            if (onComplete) onComplete();
        };

        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleEnded);

        if (video.readyState >= 3) setIsLoading(false);

        return () => {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleEnded);
        };
    }, [isVideoMode, onComplete, isEmbed]);

    // Mode: Avatar Fallback (Audio TTS Only)
    useEffect(() => {
        if (isVideoMode) return;
        let urlObj = '';

        const initAudio = async () => {
            try {
                const url = await synthesizeSpeech(transcript);
                urlObj = url;
                const audio = new Audio(url);
                audioRef.current = audio;

                audio.ontimeupdate = () => setProgress((audio.currentTime / audio.duration) * 100);
                audio.onended = () => {
                    setIsPlaying(false);
                    setProgress(100);
                    playSuccess();
                    if (onComplete) onComplete();
                };
                setIsLoading(false);
            } catch (err) {
                console.warn('TTS framework fallback active.');
                setIsLoading(false);
            }
        };
        initAudio();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (urlObj) URL.revokeObjectURL(urlObj);
        }
    }, [isVideoMode, transcript, onComplete]);

    const togglePlayback = () => {
        playClick();
        if (isVideoMode) {
            if (isEmbed) return;
            if (videoRef.current) {
                isPlaying ? videoRef.current.pause() : videoRef.current.play();
                setIsPlaying(!isPlaying);
            }
        } else {
            if (audioRef.current) {
                isPlaying ? audioRef.current.pause() : audioRef.current.play();
                setIsPlaying(!isPlaying);
            }
        }
    };

    const handleReset = () => {
        playClick();
        if (isVideoMode) {
            if (isEmbed) return;
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.pause();
                setIsPlaying(false);
                setProgress(0);
            }
        } else {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.pause();
                setIsPlaying(false);
                setProgress(0);
            }
        }
    };

    return (
        <div id="advanced-player-root" className="relative w-full aspect-video rounded-3xl overflow-hidden border border-indigo-500/30 shadow-[0_0_80px_rgba(79,70,229,0.25)] bg-[#020412] group font-sans">
            {isVideoMode && videoUrl && (
                isEmbed ? (
                    <iframe
                        src={getEmbedUrl(videoUrl)}
                        className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-auto"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        className="absolute inset-0 w-full h-full object-cover object-top bg-black z-20"
                        playsInline
                        autoPlay
                    />
                )
            )}

            {!isVideoMode && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 pointer-events-none">
                    <Box className="w-16 h-16 text-indigo-500/30 mb-6" />
                    <h3 className="text-white text-3xl font-heading font-black tracking-tighter uppercase mb-2">Neural Audio Link</h3>
                    <p className="text-slate-400 font-mono text-sm max-w-md text-center">{transcript}</p>
                </div>
            )}

            {!isEmbed && (
                <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center gap-6 bg-gradient-to-t from-black via-black/90 to-transparent z-50">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-16 h-16 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.5)] border border-indigo-400/50"
                        onClick={togglePlayback}
                        onMouseEnter={() => playHover()}
                    >
                        {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} className="ml-1" />}
                    </Button>

                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-emerald-400 font-mono text-sm">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.8)] transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-white"
                            onClick={handleReset}
                            onMouseEnter={() => playHover()}
                        >
                            <RotateCcw size={20} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-indigo-400 hover:text-indigo-300"
                            onClick={() => {
                                playSuccess();
                                setProgress(100);
                                if (onComplete) onComplete();
                            }}
                            onMouseEnter={() => playHover()}
                        >
                            <SkipForward size={20} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
