import { useState } from 'react';
import { VoiceDrill } from '@/components/VoiceDrill';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Sparkles, Zap, Shield, Volume2 } from 'lucide-react';

export default function VoiceTrainingLab() {
    const navigate = useNavigate();
    const [activeDrill, setActiveDrill] = useState<string | null>(null);

    const drills = [
        {
            id: 'visualization-1',
            title: 'Daily Affirmation',
            phrase: 'I am the architect of my financial future.',
            difficulty: 'Basic',
            icon: Sparkles,
            color: 'text-emerald-400'
        },
        {
            id: 'strategy-1',
            title: 'Strategic Intent',
            phrase: 'Credit is a tool for leverage, not a shackle.',
            difficulty: 'Intermediate',
            icon: Zap,
            color: 'text-amber-400'
        },
        {
            id: 'command-1',
            title: 'Sovereignty Declaration',
            phrase: 'I command my resources with wisdom and precision.',
            difficulty: 'Advanced',
            icon: Shield,
            color: 'text-purple-400'
        }
    ];

    return (
        <div className="min-h-screen bg-[#020412] text-white selection:bg-indigo-500/30">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#020412]/80 backdrop-blur-md">
                <div className="container flex h-16 items-center justify-between px-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="hover:bg-white/5 text-slate-400 hover:text-white">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Return to Intelligence Center
                    </Button>
                    <div className="flex items-center gap-2">
                        <Mic className="h-5 w-5 text-indigo-500 animate-pulse" />
                        <span className="font-bold tracking-wider">VOICE COMMAND LAB</span>
                    </div>
                </div>
            </header>

            <main className="container py-12 max-w-5xl px-4 mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        Speak with Power.
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Your voice is the first instrument of negotiation. <br />
                        Train your articulation, confidence, and intent.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Drill Selection */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <Volume2 className="w-4 h-4" /> Available Modules
                        </div>

                        {drills.map((drill) => (
                            <div
                                key={drill.id}
                                onClick={() => setActiveDrill(drill.id)}
                                className={`p-6 rounded-2xl border cursor-pointer transition-all group relative overflow-hidden ${activeDrill === drill.id
                                    ? 'bg-indigo-950/40 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.1)]'
                                    : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full bg-black/50 border border-white/10 ${drill.color}`}>
                                            <drill.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-white transition-colors">
                                                {drill.title}
                                            </h3>
                                            <span className={`text-xs px-2 py-0.5 rounded border border-white/10 bg-black/20 ${drill.difficulty === 'Basic' ? 'text-emerald-400' :
                                                drill.difficulty === 'Intermediate' ? 'text-amber-400' :
                                                    'text-purple-400'
                                                }`}>
                                                {drill.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                    {activeDrill === drill.id && (
                                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Active Drill Arena */}
                    <div className="sticky top-24">
                        {activeDrill ? (
                            <div className="animate-in fade-in zoom-in-95 duration-500">
                                {drills.filter(d => d.id === activeDrill).map(drill => (
                                    <VoiceDrill
                                        key={drill.id}
                                        title={drill.title}
                                        targetPhrase={drill.phrase}
                                        difficulty={drill.difficulty as any}
                                        onComplete={(score) => console.log(`Completed ${drill.id} with ${score}`)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5 text-slate-500 p-8 text-center">
                                <Mic className="w-12 h-12 mb-4 opacity-20" />
                                <p className="text-lg font-medium">Select a training module to begin.</p>
                                <p className="text-sm opacity-50 mt-2">Microphone access will be requested.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
