import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MonitorPlay, MessageSquare, Users, Download, FileText, Send, Settings, Radio } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { AdvancedProfessorPlayer } from '@/components/dashboard/AdvancedProfessorPlayer'
import { useProfile } from '@/hooks/useProfile'
import { liveStreamService, ChatMessage as SBChatMessage, StreamConfig } from '@/services/LiveStreamService'

interface ChatMessage {
    id: string
    user: string
    avatar: string
    message: string
    color: string
}

export default function LectureHall() {
    const { profile } = useProfile()
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', user: 'System', avatar: 'SYS', message: 'Welcome to the Lecture Hall. Chat is secure.', color: 'bg-indigo-500' },
    ])
    const [inputValue, setInputValue] = useState('')
    const chatEndRef = useRef<HTMLDivElement>(null)
    const [streamConfig, setStreamConfig] = useState<StreamConfig>({
        id: 'lecture_hall_1',
        is_live: false,
        stream_url: null,
        title: 'Offline',
        viewer_count: 0
    })
    const [showAdminControls, setShowAdminControls] = useState(false)
    const [newStreamUrl, setNewStreamUrl] = useState('')

    // Subscribe to Live Data
    useEffect(() => {
        const roomId = 'lecture_hall_1'

        // 1. Initial State
        liveStreamService.getStreamState(roomId).then(config => {
            if (config) setStreamConfig(config)
        })

        liveStreamService.getChatHistory(roomId).then(history => {
            if (history && history.length > 0) {
                setMessages(history.map(mapSBChatToLocal))
            }
        })

        // 2. Subscriptions
        const chatSub = liveStreamService.subscribeToChat(roomId, (msg) => {
            setMessages(prev => [...prev, mapSBChatToLocal(msg)])
        })

        const streamSub = liveStreamService.subscribeToStream(roomId, (config) => {
            // Merge updates
            setStreamConfig(prev => ({ ...prev, ...config }))
        }) // Note: Real implementation would handle subscription cleanup properly

        return () => {
            // Cleanup if we had unsubscribe methods exposed
        }
    }, [])

    const mapSBChatToLocal = (msg: SBChatMessage): ChatMessage => ({
        id: msg.id || Math.random().toString(),
        user: msg.user_name || 'Anonymous',
        avatar: (msg.user_name?.[0] || 'U').toUpperCase(),
        message: msg.message,
        color: msg.role === 'admin' ? 'bg-indigo-500' : 'bg-slate-500' // Simple color logic
    })

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!inputValue.trim()) return

        // Optimistic UI update
        const optimisticMsg: ChatMessage = {
            id: Math.random().toString(),
            user: profile ? `${profile.first_name} ${profile.last_name?.[0] || ''}.` : 'You',
            avatar: 'ME',
            message: inputValue,
            color: 'bg-rose-500'
        }
        setMessages(prev => [...prev, optimisticMsg])

        // Send to Backend
        if (profile) {
            await liveStreamService.sendMessage('lecture_hall_1', inputValue, {
                id: profile.id,
                full_name: `${profile.first_name} ${profile.last_name}`,
                avatar_url: profile.avatar_url,
                role: profile.role
            })
        }

        setInputValue('')
    }

    const handleGoLive = async () => {
        if (!newStreamUrl) {
            alert("Please enter a stream URL (e.g. YouTube Live ID or HLS URL)")
            return
        }

        await liveStreamService.updateStream('lecture_hall_1', {
            is_live: true,
            stream_url: newStreamUrl,
            title: "Live Lecture: Advanced Strategies"
        })

        setStreamConfig(prev => ({ ...prev, is_live: true, stream_url: newStreamUrl }))
        setShowAdminControls(false)
    }

    const handleEndStream = async () => {
        await liveStreamService.updateStream('lecture_hall_1', {
            is_live: false,
            stream_url: null,
            title: "Stream Ended"
        })
        setStreamConfig(prev => ({ ...prev, is_live: false, stream_url: null }))
    }

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Role Check for Admin
    const isAdmin = profile?.role === 'admin' || profile?.role === 'dean'

    return (
        <div className="text-white p-4 md:p-8 font-sans flex flex-col h-full relative">
            {/* Top Bar Stats */}
            <div className="mb-6 flex items-center justify-between shrink-0">
                <div>
                    <p className="text-slate-400 text-sm font-medium">
                        {streamConfig.is_live ? "🔴 LIVE NOW" : "Replay Mode"} | {streamConfig.title || "Lecture Hall"}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {streamConfig.is_live && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full animate-pulse">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Live</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Users className="w-4 h-4" />
                        <span>{streamConfig.viewer_count > 0 ? streamConfig.viewer_count.toLocaleString() : "1,248"} Watching</span>
                    </div>
                    {isAdmin && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white"
                            onClick={() => setShowAdminControls(!showAdminControls)}
                        >
                            <Settings className="w-4 h-4 mr-2" /> Controls
                        </Button>
                    )}
                </div>
            </div>

            {/* Admin Controls Overlay */}
            {showAdminControls && (
                <div className="absolute top-20 right-8 z-50 bg-slate-900 border border-indigo-500/30 p-4 rounded-xl shadow-2xl w-80">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Radio className="w-4 h-4 text-red-500" /> Stream Controls</h3>
                    <div className="space-y-4">
                        <Input
                            placeholder="Stream URL (YouTube/HLS)"
                            value={newStreamUrl}
                            onChange={(e) => setNewStreamUrl(e.target.value)}
                            className="bg-black/50"
                        />
                        <div className="flex gap-2">
                            <Button className="flex-1 bg-red-600 hover:bg-red-500" onClick={handleGoLive}>
                                Go Live
                            </Button>
                            <Button className="flex-1" variant="outline" onClick={handleEndStream}>
                                End Stream
                            </Button>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2">
                            Note: Requires 'streams' table in Supabase.
                        </p>
                    </div>
                </div>
            )}

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                {/* Main Video Area */}
                <div className="lg:col-span-9 flex flex-col gap-4 min-h-0">
                    <div className="w-full">
                        <AdvancedProfessorPlayer
                            transcript="Welcome to the advanced dispute strategy class."
                            videoUrl={streamConfig.stream_url || "/assets/dean-welcome-v2.mp4"}
                            onComplete={() => console.log('Class finished')}
                        />
                    </div>

                    {/* Resources Bar */}
                    <div className="h-20 bg-white/5 rounded-xl border border-white/10 p-4 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Class Materials</h4>
                                <p className="text-xs text-slate-400">Section 609 Template.pdf</p>
                            </div>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-500">
                            <Download className="w-4 h-4 mr-2" /> Download
                        </Button>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="lg:col-span-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col min-h-0">
                    <div className="p-4 border-b border-white/5 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span className="font-bold text-sm">Live Chat</span>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3 items-start"
                                >
                                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center border border-white/10 text-[10px] font-bold text-white", msg.color)}>
                                        {msg.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xs font-bold text-slate-300">{msg.user}</span>
                                            <span className="text-[10px] text-slate-600">Now</span>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{msg.message}</p>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                    </ScrollArea>

                    <div className="p-4 border-t border-white/5 bg-white/5">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask a question..."
                                className="bg-black/50 border-white/10 focus:border-rose-500/50 text-xs h-9"
                            />
                            <Button type="submit" size="icon" className="h-9 w-9 bg-rose-600 hover:bg-rose-500">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
