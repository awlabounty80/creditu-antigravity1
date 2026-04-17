import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity, Box, Cpu, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';
// @ts-ignore
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import { useSound } from '@/hooks/useSound';
import { synthesizeSpeech } from '@/lib/deepgram';

interface AdvancedProfessorPlayerProps {
    transcript: string;

    videoUrl?: string; // If provided, uses Video Mode instead of 3D Mode
    onComplete?: () => void;
    initialMode?: 'video' | 'avatar';
}

/**
 * AdvancedProfessorPlayer (Hybrid 2D/3D + YouTube Support)
 * - If videoUrl is provided:
 *   - Checks if YouTube -> Embeds Iframe
 *   - Checks if MP4/Other -> Plays standard 2D video
 * - If no videoUrl, falls back to 3D Gaussian Splatting + TTS.
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

    // Internal state for toggling modes
    const [mode, setMode] = useState<'video' | 'avatar'>(initialMode);

    // Derived state: Video Mode only active if URL exists AND mode is 'video'
    const isVideoMode = !!videoUrl && videoUrl.length > 0 && mode === 'video';

    // Effect: Update mode if initialMode prop changes (or if we need to reset on new lesson)
    useEffect(() => {
        setMode(initialMode);
    }, [initialMode, videoUrl]);


    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentWord, setCurrentWord] = useState('');

    const [loadError, setLoadError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // SFX
    const { playHover, playClick, playSuccess } = useSound();

    // References
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const auraAudioRef = useRef<HTMLAudioElement | null>(null);

    // 3D Specific Refs
    const viewerRef = useRef<any>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const animationFrameRef = useRef<number>();

    // Helper to extract Embed URL (YouTube, Vimeo, Twitch)
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

    // Force Loading to clear after 3s to prevent getting stuck (Safety Timeout)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isLoading) {
                console.log("Force clearing loading state...");
                setIsLoading(false);
                // Only error if we really have nothing to show
                if (!isVideoMode && !viewerRef.current) setLoadError(true);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [isLoading, isVideoMode]);

    // ==========================================
    // MODE: 2D VIDEO PLAYER
    // ==========================================
    useEffect(() => {
        if (!isVideoMode || !videoRef.current || isEmbed) return;

        const video = videoRef.current;

        const handleCanPlay = () => setIsLoading(false);
        const handleTimeUpdate = () => {
            const pct = (video.currentTime / video.duration) * 100;
            setProgress(pct);
        };
        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(100);
            playSuccess();
            if (onComplete) onComplete();
        };

        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleEnded);

        // Also clear loading if it's already ready
        if (video.readyState >= 3) setIsLoading(false);

        return () => {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleEnded);
        };
    }, [isVideoMode, onComplete, isEmbed]);

    // ==========================================
    // MODE: 3D GAUSSIAN SPLAT + TTS
    // ==========================================
    useEffect(() => {
        if (isVideoMode) return; // Skip 3D setup if video mode

        // ... (Existing TTS logic) ...
        const synth = window.speechSynthesis;
        let auraUrl = '';

        const initTTS = async () => {
            if (!transcript) return;

            // Try Deepgram Aura first
            try {
                console.log("Initializing Deepgram Aura TTS...");
                const url = await synthesizeSpeech(transcript);
                auraUrl = url;
                const audio = new Audio(url);
                auraAudioRef.current = audio;

                audio.ontimeupdate = () => {
                    const pct = (audio.currentTime / audio.duration) * 100;
                    setProgress(pct);
                };

                audio.onended = () => {
                    setIsPlaying(false);
                    setProgress(100);
                    playSuccess();
                    if (onComplete) onComplete();
                };

                console.log("Aura TTS Ready.");
            } catch (err) {
                console.warn("Aura TTS failed, falling back to Web Speech API:", err);
                const utterance = new SpeechSynthesisUtterance(transcript);
                utterance.rate = 0.95;
                utterance.onboundary = (event) => {
                    if (event.name === 'word') {
                        setCurrentWord(transcript.substring(event.charIndex, event.charIndex + event.charLength));
                    }
                };
                utterance.onend = () => {
                    setIsPlaying(false);
                    setProgress(100);
                    playSuccess();
                    if (onComplete) onComplete();
                };
                utteranceRef.current = utterance;
            }
        };
        initTTS();

        // Used by 3D Setup
        if (!containerRef.current) return;

        // ... (3D Renderer Setup Logic) ...
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 1.5, 3);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const viewer = new GaussianSplats3D.Viewer({
            'threeScene': scene,
            'renderer': renderer,
            'camera': camera,
            'rootElement': containerRef.current
        });

        viewer.addSplatScene('/assets/professor.splat', { 'progressiveLoad': true })
            .then(() => {
                setIsLoading(false);
                viewerRef.current = viewer;
            })
            .catch(() => {
                setLoadError(true);
                setIsLoading(false);
            });

        // Loop
        let angle = 0;
        const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate);
            if (viewerRef.current) {
                angle += 0.005;
                camera.position.x = Math.sin(angle) * 3.5;
                camera.position.z = Math.cos(angle) * 3.5;
                camera.lookAt(0, 1.2, 0);
                viewer.update();
                viewer.render();
            } else {
                renderer.render(scene, camera);
            }
        };
        animate();

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            renderer.dispose();
            if (containerRef.current) containerRef.current.innerHTML = '';
            synth.cancel();
            if (auraAudioRef.current) {
                auraAudioRef.current.pause();
                auraAudioRef.current = null;
            }
            if (auraUrl) URL.revokeObjectURL(auraUrl);
        };
    }, [isVideoMode, transcript, onComplete]);


    // ==========================================
    // CONTROLS
    // ==========================================
    const togglePlayback = async () => {
        playClick();
        if (isVideoMode) {
            if (isEmbed) return; // Cannot control embed playback easily from outside
            if (videoRef.current) {
                if (isPlaying) {
                    videoRef.current.pause();
                } else {
                    videoRef.current.play();
                }
                setIsPlaying(!isPlaying);
            }
            return;
        }

        // TTS Mode (Aura or Fallback)
        if (auraAudioRef.current) {
            if (isPlaying) {
                auraAudioRef.current.pause();
            } else {
                auraAudioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        } else {
            // Fallback Web Speech
            const synth = window.speechSynthesis;
            if (isPlaying) {
                synth.pause();
                setIsPlaying(false);
            } else {
                if (synth.paused && synth.speaking) synth.resume();
                else if (utteranceRef.current) synth.speak(utteranceRef.current);
                setIsPlaying(true);
            }
        }
    };

    const handleReset = () => {
        playClick();
        if (isVideoMode) {
            if (isEmbed) return; // Cannot reset embed
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.pause();
                setIsPlaying(false);
                setProgress(0);
            }
        } else {
            if (auraAudioRef.current) {
                auraAudioRef.current.currentTime = 0;
                auraAudioRef.current.pause();
            }
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            setProgress(0);
        }
    };

    return (
        <div id="advanced-player-root" className="relative w-full aspect-video rounded-3xl overflow-hidden border border-indigo-500/30 shadow-[0_0_80px_rgba(79,70,229,0.25)] bg-[#020412] group font-sans">

            {/* 1. VIDEO ELEMENT (If Video Mode) */}
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

            {/* 2. 3D CONTAINER (If NOT Video Mode) */}
            {!isVideoMode && (
                <div ref={containerRef} className="absolute inset-0 w-full h-full z-0" />
            )}

            {/* 3. OVERLAYS */}
            {isLoading && !isEmbed && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-40 pointer-events-none">
                    <Cpu className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                    <p className="text-indigo-400 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">
                        {isVideoMode ? "Loading Video Feed..." : "Establishing Neural Link..."}
                    </p>
                </div>
            )}

            {loadError && !isVideoMode && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10 pointer-events-none">
                    <Activity className="w-12 h-12 text-indigo-500/50 animate-pulse" />
                </div>
            )}

            {/* 4. HUD */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center w-full px-12 z-30 pointer-events-none">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className={`w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)] ${isPlaying || isEmbed ? 'animate-pulse' : ''}`} />
                    <span className="text-emerald-400 font-mono text-[10px] tracking-[0.4em] uppercase">
                        {isVideoMode ? "Secure Video Feed" : "Neural Link Active"}
                    </span>
                </div>
                {!isVideoMode && (
                    <h3 className="text-white text-4xl font-heading font-black tracking-tighter drop-shadow-[0_0_30px_rgba(0,0,0,1)] uppercase">
                        {currentWord || (loadError ? "Audio Link Active" : "Stable Connection")}
                    </h3>
                )}
            </div>

            {/* 5. CONTROLS (Hidden if YouTube, as it has its own controls) */}
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
                            <div className="flex items-center gap-2">
                                <Box className="w-4 h-4 text-cyan-500" />
                                <span className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-widest">
                                    {isVideoMode ? "MP4 SOURCE" : auraAudioRef.current ? "NEURAL LINK: ENHANCED (AURA)" : "NEURAL LINK: FALLBACK"}
                                </span>
                            </div>
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
                            onClick={async () => {
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

            {/* SCANNING LINES FX */}
            <div className="absolute inset-0 pointer-events-none z-20 opacity-30">
                <div className="w-full h-px bg-indigo-500/20 absolute top-1/3 animate-[scan_4s_linear_infinite]" />
            </div>

            {/* MODE SWITCHER (Visible if both Video and Transcript are available) */}
            {videoUrl && transcript && (
                <div className="absolute top-4 right-4 z-[60]">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => setMode(mode === 'video' ? 'avatar' : 'video')}
                        className="bg-black/50 border border-indigo-500/30 text-indigo-400 hover:text-white hover:bg-indigo-600/80 backdrop-blur-md transition-all gap-2"
                    >
                        {mode === 'video' ? <Box className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
                            {mode === 'video' ? 'Switch to Neural' : 'Switch to Feed'}
                        </span>
                    </Button>
                </div>
            )}
        </div>
    );
}
