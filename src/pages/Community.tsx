import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trophy, Users, Crown, Plus, Globe, Share2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useProfile } from '@/hooks/useProfile'
import { useGamification } from '@/hooks/useGamification'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Types
interface LeaderboardEntry {
    rank: number
    id: string
    name: string
    level: string
    points: number
    avatar: string
    isCurrentUser: boolean
}

interface ForumThread {
    id: string
    title: string
    category: string
    views: number
    created_at: string
    author_id: string
    replies_count?: number
}

const CATEGORIES = ["General", "Success Stories", "Credit Reports", "Credit Scoring", "Dispute Strategies"]

export default function Community() {
    const { user } = useProfile()
    const { awardPoints } = useGamification()
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [threads, setThreads] = useState<ForumThread[]>([])
    const [newThreadOpen, setNewThreadOpen] = useState(false)
    const [newThreadTitle, setNewThreadTitle] = useState('')
    const [newThreadCategory, setNewThreadCategory] = useState(CATEGORIES[0])

    useEffect(() => {
        async function fetchData() {
            // 1. Leaderboard
            const { data: lbData } = await supabase
                .from('profiles')
                .select('id, first_name, last_name, academic_level, moo_points')
                .order('moo_points', { ascending: false })
                .limit(10)

            if (lbData) {
                const mappedLb = lbData.map((p: any, index: number) => ({
                    rank: index + 1,
                    id: p.id,
                    name: `${p.first_name || 'Student'} ${p.last_name?.charAt(0) || ''}.`,
                    level: p.academic_level,
                    points: p.moo_points || 0,
                    avatar: `${p.first_name?.charAt(0) || 'S'}${p.last_name?.charAt(0) || ''}`.toUpperCase(),
                    isCurrentUser: user?.id === p.id
                }))
                setLeaderboard(mappedLb)
            }

            // 2. Forum Threads
            const { data: thData } = await supabase
                .from('forum_threads')
                .select('*')
                .order('created_at', { ascending: false })

            if (thData && thData.length > 0) {
                setThreads(thData)
            } else {
                // FALLBACK: SEEDED CONTENT for "Do More" Aliveness
                setThreads([
                    { id: 'm1', title: 'How I deleted 3 collections in 30 days using Metro 2', category: 'Success Stories', views: 1250, created_at: new Date().toISOString(), author_id: 'sys', replies_count: 45 },
                    { id: 'm2', title: 'The hidden list of secondary bureaus you MUST freeze', category: 'Dispute Strategies', views: 890, created_at: new Date(Date.now() - 86400000).toISOString(), author_id: 'sys', replies_count: 12 },
                    { id: 'm3', title: 'Just booked Emirates First Class for $80!', category: 'General', views: 3400, created_at: new Date(Date.now() - 172800000).toISOString(), author_id: 'sys', replies_count: 156 },
                ])
            }
        }
        fetchData()

        // Subscription
        const channel = supabase
            .channel('public:forum_threads')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'forum_threads' }, (payload) => {
                setThreads(prev => [payload.new as ForumThread, ...prev])
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [user])

    const handleCreateThread = async () => {
        if (!user || !newThreadTitle) return
        try {
            const { error } = await supabase.from('forum_threads').insert({
                title: newThreadTitle, category: newThreadCategory, author_id: user.id
            })
            if (error) throw error
            awardPoints(10, 'Created Forum Thread')
            setNewThreadOpen(false); setNewThreadTitle('')
        } catch (e) {
            console.error("Error creating thread:", e)
        }
    }

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-8 relative overflow-x-hidden">
            {/* Atmosphere */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg border border-white/10">
                            <Globe className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-heading font-black tracking-tight text-white mb-1">
                                GLOBAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">CAMPUS</span>
                            </h1>
                            <p className="text-slate-400 font-light">Network with wealth builders worldwide.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={() => setNewThreadOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 shadow-[0_0_20px_rgba(79,70,229,0.3)]" data-tour-id="comm-start-btn">
                            <Plus className="mr-2 h-4 w-4" /> Start Discussion
                        </Button>
                    </div>
                </div>

                {/* Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT: Leaderboard */}
                    <div className="lg:col-span-1 space-y-6" data-tour-id="comm-leaderboard">
                        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl overflow-hidden h-fit">
                            <div className="p-6 border-b border-white/5 bg-white/5">
                                <h2 className="font-heading font-bold text-xl flex items-center gap-2 text-amber-400">
                                    <Trophy size={18} /> Top Performers
                                </h2>
                            </div>
                            <div className="divide-y divide-white/5">
                                {leaderboard.map((student) => (
                                    <div key={student.rank} className={cn("p-4 flex items-center gap-3 hover:bg-white/5 transition-colors", student.isCurrentUser && "bg-indigo-500/10")}>
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                                            student.rank === 1 ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.6)]" :
                                                student.rank === 2 ? "bg-slate-300 text-black" :
                                                    student.rank === 3 ? "bg-amber-700 text-white" : "bg-white/5 text-slate-500"
                                        )}
                                            {...(student.isCurrentUser ? { 'data-amara-vision': 'My Global Rank' } : {})}
                                        >
                                            {student.rank}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-sm text-slate-200 flex items-center gap-2">
                                                {student.name}
                                                {student.rank === 1 && <Crown size={12} className="text-amber-400 fill-amber-400" />}
                                                {student.isCurrentUser && <span className="text-[9px] bg-indigo-500 px-1.5 rounded uppercase tracking-wider">You</span>}
                                            </div>
                                            <div className="text-xs text-slate-500 uppercase tracking-wider">{student.level}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono font-bold text-emerald-400 text-sm">{student.points.toLocaleString()}</div>
                                            <div className="text-[10px] text-slate-600 uppercase">PTS</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Inspiration Wall */}
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Crown size={18} className="text-amber-400" />
                                <h3 className="font-heading font-bold text-lg text-white">Founding Inspirations</h3>
                            </div>
                            {[
                                { name: "Nivla West", link: "https://www.youtube.com/@nivlawest", role: "Credit Matrix Decoder" },
                                { name: "Alicia Lyttle", link: "https://www.youtube.com/@AliciaLyttle", role: "AI & Wealth Architect" },
                                { name: "Marcus Y Rosier", link: "https://www.youtube.com/@marcusyrosier", role: "Financial Sovereign" }
                            ].map((mentor) => (
                                <a href={mentor.link} target="_blank" rel="noopener noreferrer" key={mentor.name} className="block group">
                                    <div className="p-4 rounded-xl bg-slate-900 border border-white/5 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex items-center justify-between">
                                        <div>
                                            <div className="font-bold text-white group-hover:text-amber-400 transition-colors">{mentor.name}</div>
                                            <div className="text-xs text-slate-500 uppercase tracking-wider">{mentor.role}</div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all">
                                            <Share2 size={14} />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Forum */}
                    <div className="lg:col-span-2 space-y-6" data-tour-id="comm-feed">
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {CATEGORIES.map(cat => (
                                <button key={cat} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 hover:border-indigo-500/30 whitespace-nowrap transition-all">
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            {threads.map((thread) => (
                                <motion.div
                                    key={thread.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="p-6 bg-slate-900/60 border border-white/5 hover:border-indigo-500/30 rounded-2xl transition-all cursor-pointer group backdrop-blur-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{thread.category}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-slate-500 text-xs">
                                                <span className="flex items-center gap-1"><Users size={12} /> {thread.views}</span>
                                                <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-200 group-hover:text-white group-hover:underline decoration-indigo-500/50 underline-offset-4 transition-all">
                                            {thread.title}
                                        </h3>
                                    </div>
                                </motion.div>
                            ))}
                            {threads.length === 0 && (
                                <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-2xl">
                                    <p className="text-slate-500">No discussions yet. Start the conversation!</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Create Modal */}
                <AnimatePresence>
                    {newThreadOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                onClick={() => setNewThreadOpen(false)}
                            />
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                                className="relative bg-slate-900 border border-white/10 p-8 rounded-2xl w-full max-w-lg shadow-2xl"
                            >
                                <h2 className="text-2xl font-bold text-white mb-6">Start Discussion</h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500">Topic Title</label>
                                        <Input value={newThreadTitle} onChange={e => setNewThreadTitle(e.target.value)} className="bg-black/50 border-white/10 text-white" placeholder="What's on your mind?" autoFocus data-tour-id="comm-title-input" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500">Category</label>
                                        <select
                                            className="w-full bg-black/50 border border-white/10 text-white rounded-md h-10 px-3 text-sm focus:outline-none focus:border-indigo-500"
                                            value={newThreadCategory}
                                            onChange={e => setNewThreadCategory(e.target.value)}
                                            data-tour-id="comm-category-select"
                                        >
                                            {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button variant="ghost" onClick={() => setNewThreadOpen(false)} className="text-slate-400 hover:text-white">Cancel</Button>
                                        <Button onClick={handleCreateThread} className="bg-indigo-600 hover:bg-indigo-500 font-bold" data-tour-id="comm-post-btn">Post Global</Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    )
}
