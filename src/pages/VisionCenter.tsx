import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Quote, Trash2, Target, Car, Home, Plane, Briefcase, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useProfile } from '@/hooks/useProfile'
import { useGamification } from '@/hooks/useGamification'
import { supabase } from '@/lib/supabase'

// Mock Affirmations Bank
const AFFIRMATIONS = [
    "I am the architect of my financial freedom.",
    "Debt does not define me; my vision defines me.",
    "Money flows to me when my inner order is restored.",
    "I am worthy of abundance and peace.",
    "Every dispute is a step towards my liberty.",
    "My past is a lesson, not a life sentence.",
    "I am building an empire, one credit point at a time.",
    "My credit score is a reflection of my discipline.",
    "I attract opportunities for wealth constantly."
]

interface VisionItem {
    id: string
    type: 'goal' | 'image' | 'text'
    category?: 'home' | 'auto' | 'business' | 'travel' | 'other'
    content: string
    caption?: string
    targetScore?: number
}

const CATEGORIES = [
    { id: 'home', label: 'Real Estate', icon: Home, color: 'text-emerald-400', minScore: 720 },
    { id: 'auto', label: 'Dream Car', icon: Car, color: 'text-amber-400', minScore: 680 },
    { id: 'business', label: 'Empire', icon: Briefcase, color: 'text-indigo-400', minScore: 750 },
    { id: 'travel', label: 'Luxury Travel', icon: Plane, color: 'text-sky-400', minScore: 660 },
]

export default function VisionCenter() {
    const { profile } = useProfile()
    const { awardPoints } = useGamification()
    const [affirmation, setAffirmation] = useState("")
    const [items, setItems] = useState<VisionItem[]>([])
    const [isAdding, setIsAdding] = useState(false)

    // New Item State
    const [newItemCategory, setNewItemCategory] = useState<string>('home')
    const [newItemContent, setNewItemContent] = useState("")

    useEffect(() => {
        setAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)])
        if (profile) {
            fetchItems()
        } else {
            const saved = localStorage.getItem('vision_board_items')
            if (saved) {
                setItems(JSON.parse(saved))
            } else {
                setItems([
                    { id: '1', type: 'goal', category: 'business', content: 'Launch Credit Repair Agency', targetScore: 750 },
                    { id: '2', type: 'image', content: 'https://images.unsplash.com/photo-1600596542815-27bfef40878a?auto=format&fit=crop&w=800&q=80', caption: 'The Headquarters' }
                ])
            }
        }
    }, [profile])

    async function fetchItems() {
        const { data } = await supabase
            .from('vision_items')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) {
            setItems(data.map(d => ({
                id: d.id,
                type: d.type as any,
                category: d.category as any,
                content: d.content,
                caption: d.caption,
                targetScore: d.target_score
            })))
        }
    }

    const handleAddItem = async () => {
        if (!newItemContent) return

        const categoryData = CATEGORIES.find(c => c.id === newItemCategory)
        const target = categoryData?.minScore || 700

        if (!profile) {
            // Local Fallback
            const newItem: VisionItem = {
                id: Date.now().toString(),
                type: 'goal',
                category: newItemCategory as any,
                content: newItemContent,
                targetScore: target
            }
            const updated = [newItem, ...items]
            setItems(updated)
            localStorage.setItem('vision_board_items', JSON.stringify(updated))
        } else {
            // DB Save
            const { data } = await supabase.from('vision_items').insert({
                user_id: profile.id,
                type: 'goal',
                category: newItemCategory,
                content: newItemContent,
                target_score: target
            }).select().single()

            if (data) {
                setItems(prev => [{
                    id: data.id,
                    type: data.type as any,
                    category: data.category as any,
                    content: data.content,
                    caption: data.caption,
                    targetScore: data.target_score
                }, ...prev])
                awardPoints(50, 'Vision Manifested')
            }
        }
        setNewItemContent("")
        setIsAdding(false)
    }

    const handleDelete = async (id: string) => {
        setItems(items.filter(i => i.id !== id))

        if (profile) {
            await supabase.from('vision_items').delete().eq('id', id)
        } else {
            const updated = items.filter(i => i.id !== id)
            localStorage.setItem('vision_board_items', JSON.stringify(updated))
        }
    }

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12 relative overflow-x-hidden">
            {/* Atmosphere */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10 space-y-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium backdrop-blur-md">
                        <Target size={14} className="text-amber-400" /> Goal Setting
                    </div>

                    <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tight drop-shadow-2xl">
                        VISION <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">CENTER</span>
                    </h1>

                    <div className="max-w-3xl mx-auto relative">
                        <Quote className="absolute -top-4 -left-8 w-8 h-8 text-indigo-500/20" />
                        <p className="text-xl md:text-2xl text-indigo-200/80 font-light italic leading-relaxed">
                            "{affirmation}"
                        </p>
                        <Quote className="absolute -bottom-4 -right-8 w-8 h-8 text-indigo-500/20 rotate-180" />
                    </div>
                </motion.div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Add New Trigger */}
                    <AnimatePresence mode='wait'>
                        {!isAdding ? (
                            <motion.button
                                layoutId="add-card"
                                onClick={() => setIsAdding(true)}
                                className="group h-[350px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-slate-500 hover:text-amber-400"
                                data-tour-id="add-manifestation"
                            >
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Plus size={32} />
                                </div>
                                <span className="font-heading font-bold tracking-widest uppercase text-sm">Manifest New Goal</span>
                            </motion.button>
                        ) : (
                            <motion.div layoutId="add-card" className="col-span-1 md:col-span-2 lg:col-span-1">
                                <Card className="h-[350px] bg-slate-900/80 border-amber-500/30 backdrop-blur-xl relative overflow-hidden flex flex-col">
                                    <CardContent className="p-6 flex-1 flex flex-col gap-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-lg text-white">New Manifestation</h3>
                                            <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white"><Trash2 size={16} /></Button>
                                        </div>

                                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" data-tour-id="category-selector">
                                            {CATEGORIES.map(cat => {
                                                const Icon = cat.icon
                                                const isSelected = newItemCategory === cat.id
                                                return (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => setNewItemCategory(cat.id)}
                                                        className={cn(
                                                            "flex flex-col items-center gap-1 p-3 rounded-xl min-w-[80px] border transition-all",
                                                            isSelected ? "bg-amber-500/20 border-amber-500 text-amber-400" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                                                        )}
                                                        data-tour-id={`cat-${cat.id}`}
                                                    >
                                                        <Icon size={20} />
                                                        <span className="text-[10px] uppercase font-bold">{cat.label}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs text-slate-400 uppercase font-bold">Your Vision</label>
                                            <Textarea
                                                placeholder="Describe your goal (e.g., 'Buy a 4-bedroom house in Atlanta')"
                                                className="bg-black/40 border-white/10 text-white resize-none"
                                                rows={3}
                                                value={newItemContent}
                                                onChange={e => setNewItemContent(e.target.value)}
                                                autoFocus
                                                data-tour-id="vision-input"
                                            />
                                        </div>

                                        <Button onClick={handleAddItem} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold" data-tour-id="confirm-vision">
                                            Confirm Goal
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Existing Items */}
                    <AnimatePresence>
                        {items.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                className="h-[350px]"
                            >
                                <div className="h-full relative group perspective-1000">
                                    {item.type === 'image' ? (
                                        <div className="h-full rounded-3xl overflow-hidden relative shadow-2xl border border-white/10 bg-black">
                                            <img src={item.content} alt="Vision" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>

                                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                                <p className="font-heading font-bold text-2xl text-white">{item.caption || "Vision"}</p>
                                                <div className="w-12 h-1 bg-amber-500 mt-2"></div>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="h-full rounded-3xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm hover:border-indigo-500/50 transition-colors">

                                            {/* Category Icon */}
                                            <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

                                            {/* Top Metadata */}
                                            <div className="flex justify-between items-start relative z-10">
                                                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                                                    {(() => {
                                                        const Cat = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[0]
                                                        const Icon = Cat.icon
                                                        return <Icon className={Cat.color} size={24} />
                                                    })()}
                                                </div>

                                                <div className="flex flex-col items-end">
                                                    <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1">Target Score</div>
                                                    <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded border border-white/5">
                                                        <Lock size={10} className="text-slate-500" />
                                                        <span className="font-mono text-sm font-bold text-emerald-400">{item.targetScore}+</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="relative z-10">
                                                <h3 className="text-2xl font-bold font-heading leading-tight text-white mb-4">
                                                    {item.content}
                                                </h3>
                                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 w-[65%]"></div>
                                                </div>
                                                <div className="flex justify-between mt-2 text-xs text-slate-400">
                                                    <span>Progress</span>
                                                    <span>65%</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="absolute bottom-4 right-4 p-2 rounded-full text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                </div>
            </div>
        </div>
    )
}
