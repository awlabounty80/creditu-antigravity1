import { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Cpu, ShieldAlert, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getJulesClient, JulesSession, JulesActivity } from '@/lib/jules-client';
import { cn } from '@/lib/utils';

export function JulesTerminal() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [sessions, setSessions] = useState<JulesSession[]>([]);
    const [activeSession, setActiveSession] = useState<string | null>(null);
    const [activities, setActivities] = useState<JulesActivity[]>([]);
    const [isThinking, setIsThinking] = useState(false);

    // Auto-scroll
    const scrollRef = useRef<HTMLDivElement>(null);

    const client = getJulesClient();
    const hasKey = !!client;

    useEffect(() => {
        if (isOpen && hasKey) {
            loadSessions();
        }
    }, [isOpen]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeSession && isOpen) {
            loadActivities(activeSession);
            interval = setInterval(() => loadActivities(activeSession), 5000);
        }
        return () => clearInterval(interval);
    }, [activeSession, isOpen]);

    const loadSessions = async () => {
        if (!client) return;
        try {
            const list = await client.listSessions();
            setSessions(list);
            if (list.length > 0 && !activeSession) {
                setActiveSession(list[0].id);
            }
        } catch (e) {
            console.error("Failed to load Jules sessions", e);
        }
    };

    const loadActivities = async (sessionId: string) => {
        if (!client) return;
        try {
            const acts = await client.getActivities(sessionId);
            setActivities(acts.reverse()); // Show newest at bottom usually, but depends on API
        } catch (e) {
            console.error(e);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !client) return;
        const msg = input;
        setInput('');
        setIsThinking(true);

        try {
            if (!activeSession) {
                // Create new session
                const session = await client.createSession(msg);
                setActiveSession(session.id);
                setSessions([session, ...sessions]);
            } else {
                // Send to existing
                await client.sendMessage(activeSession, msg);
            }
            // Immediate refresh attempt
            if (activeSession) await loadActivities(activeSession);
        } catch (e) {
            console.error("Jules Error:", e);
        } finally {
            setIsThinking(false);
        }
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-500 shadow-2xl border border-indigo-400/50 z-50 flex items-center justify-center group"
            >
                <Cpu className="w-6 h-6 text-white animate-pulse" />
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black" />
            </Button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-[90vw] md:w-[600px] h-[600px] bg-black/90 backdrop-blur-xl border border-indigo-500/30 rounded-3xl shadow-3xl z-50 flex flex-col overflow-hidden font-mono text-sm animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-indigo-500/20 bg-indigo-900/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Terminal className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white tracking-widest uppercase text-xs">Jules Uplink</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${hasKey ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <span className="text-[10px] text-slate-400">{hasKey ? 'CONNECTED' : 'OFFLINE'}</span>
                        </div>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-white"
                >
                    Close
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar (Sessions) */}
                <div className="w-1/3 border-r border-indigo-500/20 bg-black/20 hidden md:flex flex-col">
                    <div className="p-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Threads</div>
                    <ScrollArea className="flex-1">
                        {sessions.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSession(s.id)}
                                className={cn(
                                    "w-full text-left p-3 hover:bg-white/5 transition-colors text-xs truncate border-l-2",
                                    activeSession === s.id ? "border-indigo-500 bg-indigo-500/10 text-white" : "border-transparent text-slate-400"
                                )}
                            >
                                {s.title || s.prompt || "Untitled Session"}
                            </button>
                        ))}
                        {sessions.length === 0 && (
                            <div className="p-4 text-center text-slate-600 italic text-xs">No active sessions</div>
                        )}
                    </ScrollArea>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col relative">
                    {!hasKey ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-red-950/20">
                            <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
                            <h3 className="text-white font-bold mb-2">Uplink Unauthorized</h3>
                            <p className="text-slate-400 text-xs mb-4">API Key not detected. Please add VITE_JULES_API_KEY to your env configuration.</p>
                        </div>
                    ) : (
                        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                            <div className="space-y-4">
                                {activities.length === 0 && (
                                    <div className="text-center py-12">
                                        <Cpu className="w-12 h-12 text-indigo-500/20 mx-auto mb-4" />
                                        <p className="text-slate-500 text-xs">System ready. Awaiting instructions.</p>
                                    </div>
                                )}
                                {activities.map((act, i) => (
                                    <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] text-indigo-400 uppercase font-bold">{act.type}</span>
                                        </div>
                                        <p className="text-slate-300 text-xs whitespace-pre-wrap">{act.content || "Processing..."}</p>
                                    </div>
                                ))}
                                {isThinking && (
                                    <div className="flex items-center gap-2 text-indigo-400 text-xs animate-pulse">
                                        <Activity className="w-3 h-3" /> Jules is working...
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    )}

                    {/* Input */}
                    <div className="p-3 bg-white/5 border-t border-indigo-500/20 flex gap-2">
                        <Input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder={hasKey ? "Deploy functionality (e.g. 'Fix the user profile bug')" : "Connection required"}
                            disabled={!hasKey || isThinking}
                            className="bg-black/50 border-white/10 text-white text-xs font-mono h-10 focus-visible:ring-indigo-500"
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!hasKey || isThinking}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white w-10 h-10 p-0 rounded-lg"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
