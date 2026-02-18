import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { transcribeAudio } from '@/lib/deepgram';
import { toast } from 'sonner';

interface VoiceDrillProps {
    id: string;
    title: string;
    targetPhrase: string;
    difficulty: 'Basic' | 'Intermediate' | 'Advanced';
    onComplete?: (score: number) => void;
}

export const VoiceDrill = ({ id, title, targetPhrase, difficulty, onComplete }: VoiceDrillProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState<string | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number>();

    // Audio Visualization
    const drawVisualizer = () => {
        if (!analyserRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (!isRecording) return;

            animationFrameRef.current = requestAnimationFrame(draw);
            analyserRef.current!.getByteFrequencyData(dataArray);

            ctx.fillStyle = 'rgb(10, 15, 30)'; // Match background
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;

                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, '#fbbf24'); // Amber
                gradient.addColorStop(1, '#ef4444'); // Red

                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        draw();
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

            // Setup Visualizer
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyserRef.current = analyser;

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                // Stop tracks
                stream.getTracks().forEach(track => track.stop());
                audioContext.close();

                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                handleTranscription(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setTranscript(null);
            setError(null);
            setScore(null);

            // Start visualizer
            drawVisualizer();

        } catch (err) {
            console.error("Microphone Access Error:", err);
            setError("Microphone access denied. Please allow permissions.");
            toast.error("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        }
    };

    const handleTranscription = async (audioBlob: Blob) => {
        setIsProcessing(true);
        try {
            // Send to Deepgram via our lib
            const result = await transcribeAudio(audioBlob);
            const text = result?.results?.channels[0]?.alternatives[0]?.transcript || "";

            setTranscript(text);
            calculateScore(text);
        } catch (err) {
            console.error("Transcription Error:", err);
            setError("Failed to process audio. Check your API Key.");
            toast.error("Transcription failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    const calculateScore = (spokenText: string) => {
        if (!spokenText) {
            setScore(0);
            return;
        }

        // Simple Levenshtein distance or word match ratio
        const cleanTarget = targetPhrase.toLowerCase().replace(/[^\w\s]/g, '');
        const cleanSpoken = spokenText.toLowerCase().replace(/[^\w\s]/g, '');

        // Strictness: Check if target words are present in spoken
        const targetWords = cleanTarget.split(' ');
        const spokenWords = cleanSpoken.split(' ');

        let matches = 0;
        targetWords.forEach(word => {
            if (spokenWords.includes(word)) matches++;
        });

        const accuracy = Math.round((matches / targetWords.length) * 100);
        setScore(accuracy);

        if (accuracy > 80 && onComplete) {
            onComplete(accuracy);
            toast.success(`Excellent! ${accuracy}% Accuracy`);
        } else if (accuracy > 50) {
            toast.info(`Good try! ${accuracy}% Accuracy. Try again for perfection.`);
        } else {
            toast.warning(`Low accuracy (${accuracy}%). Try speaking clearer.`);
        }
    };

    return (
        <Card className="bg-black/40 border-white/10 overflow-hidden backdrop-blur-sm relative group hover:border-indigo-500/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className={cn(
                            "text-xs font-bold px-2 py-1 rounded-full border mb-2 inline-block",
                            difficulty === 'Basic' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                difficulty === 'Intermediate' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                    "bg-red-500/10 text-red-400 border-red-500/20"
                        )}>
                            {difficulty} DRILL
                        </span>
                        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
                        <p className="text-sm text-slate-400">Read the phrase aloud clearly.</p>
                    </div>
                    {score !== null && (
                        <div className={cn(
                            "text-2xl font-black px-4 py-2 rounded-lg border",
                            score >= 80 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" :
                                score >= 50 ? "bg-amber-500/20 text-amber-400 border-amber-500/50" :
                                    "bg-red-500/20 text-red-400 border-red-500/50"
                        )}>
                            {score}%
                        </div>
                    )}
                </div>

                <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-6 mb-6 text-center shadow-inner">
                    <p className="text-2xl md:text-3xl font-serif text-indigo-100 leading-relaxed">
                        "{targetPhrase}"
                    </p>
                </div>

                {/* Visualizer Canvas */}
                <div className="h-24 bg-black/50 rounded-lg mb-6 relative overflow-hidden flex items-center justify-center border border-white/5">
                    {isRecording ? (
                        <canvas ref={canvasRef} width="600" height="100" className="w-full h-full opacity-80" />
                    ) : (
                        <div className="text-slate-600 text-sm font-mono flex items-center gap-2">
                            <div className="w-full h-[1px] bg-slate-800 absolute top-1/2" />
                            <span className="bg-black/50 px-2 relative z-10">WAVEFORM_INACTIVE</span>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-4">
                    {isProcessing ? (
                        <Button disabled className="w-full h-14 bg-indigo-600/50 text-white rounded-full animate-pulse">
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing Speech Pattern...
                        </Button>
                    ) : (
                        !isRecording ? (
                            <Button
                                onClick={startRecording}
                                className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-lg shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all"
                            >
                                <Mic className="w-5 h-5 mr-2" /> Start Recording
                            </Button>
                        ) : (
                            <Button
                                onClick={stopRecording}
                                className="w-full h-14 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold text-lg animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                            >
                                <Square className="w-5 h-5 mr-2" /> Stop Recording
                            </Button>
                        )
                    )}

                    {/* Results */}
                    {transcript && (
                        <div className="w-full mt-4 p-4 rounded-lg bg-slate-900/50 border border-white/10 text-left">
                            <p className="text-xs text-slate-500 uppercase font-bold mb-2">Detailed Analysis</p>
                            <p className={cn(
                                "text-lg leading-relaxed",
                                score && score > 80 ? "text-emerald-300" : "text-slate-300"
                            )}>
                                "{transcript}"
                            </p>
                            {score !== null && score < 100 && (
                                <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {score < 50 ? "Phrase mismatch. Try articulating slower." : "Good match. Minor variations detected."}
                                </p>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="w-full mt-2 text-center text-red-400 text-sm bg-red-950/20 p-2 rounded border border-red-500/20">
                            {error}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
