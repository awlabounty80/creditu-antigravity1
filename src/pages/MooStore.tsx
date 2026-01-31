import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    Gift, Cpu, ShieldAlert, Activity, Users, Ticket,
    Crown, Shield, Book, Calculator, Headphones, Sun, MapPin, CheckCircle, Sparkles, Search, HeartHandshake, Image as ImageIcon
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
// @ts-ignore
import html2pdf from 'html2pdf.js'

// --- CONTENT DATABASE ---
// This maps Reward IDs to actual content (PDF templates, Links, etc.)
const CONTENT_MAP: Record<string, { type: 'pdf' | 'link' | 'image', content?: string, url?: string, filename?: string }> = {
    'goodwill_letter': {
        type: 'pdf',
        filename: 'Goodwill_Adjustment_Letter.pdf',
        content: `[Date]\n\n[Your Name]\n[Your Address]\n[City, State, Zip]\n\n[Creditor Name]\n[Creditor Address]\n[City, State, Zip]\n\nRE: Goodwill Adjustment Request for Account # [Account Number]\n\nTo Whom It May Concern,\n\nI am writing to you today to request a goodwill adjustment on the above-referenced account. I have been a loyal customer of [Creditor Name] for [Years] years and have greatly appreciated the service provided.\n\nHowever, I noticed that my credit report reflects a late payment from [Date of Late Payment]. At that time, I experienced [briefly explain hardship, e.g., a family emergency/moving/unemployment], which caused this uncharacteristic oversight. Since then, I have brought my account current and maintained a perfect payment record.\n\nBecause this single negative item is severely impacting my creditworthiness, I am respectfully requesting that you remove the late payment data from my credit files with Equifax, Experian, and TransUnion as a gesture of goodwill.\n\nThank you for your time and consideration.\n\nSincerely,\n\n[Your Name]`
    },
    'pay_delete': {
        type: 'pdf',
        filename: 'Pay_For_Delete_Agreement.pdf',
        content: `[Date]\n\n[Collection Agency Name]\n[Address]\n\nRE: Pay for Delete Offer - Account # [Account Number]\n\nTo Whom It May Concern,\n\nI am writing to settle the account referenced above. I am aware of the unpaid balance of $[Amount]. While I dispute the validity of the full amount, I am willing to pay the full balance of $[Amount] as a settlement in full, IF AND ONLY IF you agree to the following terms:\n\n1. You agree to DELETE this account listing entirely from all three credit reporting agencies (Equifax, Experian, TransUnion).\n2. You will not sell or transfer this debt to another agency.\n3. You will consider the account "Paid in Full" with a $0 balance.\n\nUpon receipt of a signed letter on your company letterhead agreeing to these terms, I will send a cashier's check or money order immediately.\n\nPlease sign and return this agreement to the address above.\n\nSincerely,\n\n[Your Name]`
    },
    'dispute_ai': {
        type: 'link',
        url: '/dashboard/credit-lab/dispute'
    },
    'simulator': {
        type: 'link',
        url: '/dashboard/credit-lab/simulator'
    },
    'wallpaper_1': {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?auto=format&fit=crop&q=80',
        filename: 'Credit_Empire_Wallpaper.jpg'
    },
    'metro2_guide': {
        type: 'pdf',
        filename: 'Metro2_Compliance_Guide.pdf',
        content: `METRO 2® COMPLIANCE GUIDE FOR CONSUMERS\n\n1. INTRODUCTION\nThe Metro 2® format is the standard data format used by the consumer reporting agencies (Equifax, Experian, TransUnion, Innovis) for accepting credit history data. It was developed to ensure compliance with the Fair Credit Reporting Act (FCRA).\n\n2. KEY FIELDS TO AUDIT\nWhen auditing your raw credit data (available via specialized reports), check these fields:\n\n- Field 17: Account Status. Codes like '93' (Collection) or '71-84' (Late) must be accurate to the day.\n- Field 9: Date Opened. This must match the creditor's records exactly.\n- Field 14: Payment History Profile. This 24-month string must not show data for months prior to the account opening.\n\n3. THE "E-OSCAR" SYSTEM\nMost disputes are processed by an automated system called e-OSCAR. Using specific Metro 2 terminology (e.g., "Compliance Condition Code") can force a human review.\n\n(This is a summarized guide for educational purposes)`
    },
    'black_card': {
        type: 'link',
        url: '/dashboard/settings' // Navigate to settings
    },
    'leverage_call': {
        type: 'link',
        url: '/contact' // Placeholder
    },
    'snowball_calc': {
        type: 'link',
        url: 'https://www.calculator.net/debt-payoff-calculator.html'
    }
}

const ICON_MAP: Record<string, any> = {
    cpu: Cpu,
    shield_alert: ShieldAlert,
    activity: Activity,
    users: Users,
    ticket: Ticket,
    crown: Crown,
    shield: Shield,
    book: Book,
    calculator: Calculator,
    headphones: Headphones,
    sun: Sun,
    map_pin: MapPin,
    gift: Gift,
    heart_handshake: HeartHandshake,
    handshake: HeartHandshake,
    image: ImageIcon
}

// ... (Existing ICON_MAP)

// Mock Data for Client-Side "DO MORE"
const FALLBACK_REWARDS: Reward[] = [
    { id: 'goodwill_letter', section: 'power_tools', title: 'Goodwill Adjustment Template', description: 'Request removal of a single late payment from a good standing account.', cost: 300, icon_key: 'handshake', unlock_threshold: 0 },
    { id: 'pay_delete', section: 'power_tools', title: 'Pay-For-Delete Agreement', description: 'Binding contract to remove collections upon payment.', cost: 500, icon_key: 'shield', unlock_threshold: 0 },
    { id: 'metro2_guide', section: 'all', title: 'Metro 2® Compliance Manual', description: 'Deep dive into the data format used by bureaus.', cost: 800, icon_key: 'book', unlock_threshold: 0 },
    { id: 'wallpaper_1', section: 'all', title: 'Credit Empire Wallpaper', description: 'High-res digital art for your dashboard.', cost: 50, icon_key: 'image', unlock_threshold: 0 },
    { id: 'dispute_ai', section: 'access', title: 'AI Dispute Engine Access', description: 'Unlimited generations with Dr. Leverage.', cost: 1000, icon_key: 'cpu', unlock_threshold: 0 },
    { id: 'leverage_call', section: 'access', title: 'Private Strategy Call', description: '15-min consultation with a chaotic good credit expert.', cost: 5000, icon_key: 'headphones', unlock_threshold: 0 }
]

interface Reward {
    id: string
    section: string
    title: string
    description: string
    cost: number
    icon_key: string
    unlock_threshold: number
}

const SECTIONS = [
    { id: 'all', label: 'Marketplace' },
    { id: 'inventory', label: 'My Inventory' },
    { id: 'power_tools', label: 'Tools' },
    { id: 'access', label: 'Access' },
    { id: 'identity', label: 'Identity' },
]

export default function MooStore() {
    const navigate = useNavigate()
    const [rewards, setRewards] = useState<Reward[]>([])
    const [userPoints, setUserPoints] = useState(0)
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [selectedTab, setSelectedTab] = useState('all')
    const [successItem, setSuccessItem] = useState<string | null>(null)
    const [inventory, setInventory] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        try {
            // 1. Fetch Rewards Catalog
            const { data: rewardsData } = await supabase
                .from('rewards')
                .select('*')
                .order('cost', { ascending: true })

            if (rewardsData && rewardsData.length > 0) {

                setRewards(rewardsData)
            } else {
                // Fallback for Demo/Unseeded State
                setRewards(FALLBACK_REWARDS)
            }

            // 2. Fetch User Profile & Inventory
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('moo_points')
                    .eq('id', user.id)
                    .single()
                if (profile) setUserPoints(profile.moo_points || 0)

                const { data: inv } = await supabase
                    .from('user_rewards')
                    .select('reward_id')
                    .eq('user_id', user.id)

                if (inv) {
                    setInventory(new Set(inv.map(i => i.reward_id)))
                }
            }
        } catch (error) {
            console.error("Error loading store:", error)
        }
        setLoading(false)
    }

    // --- ACTIONS ---

    async function logAccess(rewardId: string) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Log access optimistically
        const { error } = await supabase.rpc('increment_access', { r_id: rewardId, u_id: user.id })

        if (error) {
            // Fallback if RPC doesn't exist (manual update)
            await supabase.from('user_rewards')
                .update({ last_accessed_at: new Date().toISOString() })
                .eq('user_id', user.id)
                .eq('reward_id', rewardId)
        }
    }

    async function handlePurchase(reward: Reward) {
        if (inventory.has(reward.id)) {
            handleAccess(reward.id)
            return
        }

        if (userPoints < reward.cost) return
        if (!confirm(`Confirm Exchange: ${reward.cost} Points for "${reward.title}"?`)) return

        setProcessingId(reward.id)

        try {
            const { data, error } = await supabase.rpc('purchase_reward_v2', {
                reward_uuid: reward.id
            })

            if (error) throw error

            if (data.success) {
                setUserPoints(data.remaining_points)
                setSuccessItem(reward.title)
                setInventory(prev => new Set(prev).add(reward.id))
                setTimeout(() => setSuccessItem(null), 3000)
            } else {
                alert(data.message || "Purchase failed")
            }
        } catch (error: any) {
            console.error("Purchase error:", error)
            alert("Transaction failed. System busy.")
        } finally {
            setProcessingId(null)
        }
    }

    async function handleAccess(rewardId: string) {
        const item = CONTENT_MAP[rewardId]
        if (!item) {
            alert("Access denied: Item content not found.")
            return
        }

        logAccess(rewardId)

        if (item.type === 'link' && item.url) {
            navigate(item.url)
        } else if (item.type === 'pdf' && item.content) {
            const element = document.createElement('div')
            element.innerHTML = `
                <div style="font-family: 'Times New Roman', serif; padding: 40px; white-space: pre-wrap; line-height: 1.5; color: black;">
                    <h1 style="font-size: 18pt; text-align: center; margin-bottom: 30px; font-weight: bold; text-transform: uppercase;">${rewardId.replace(/_/g, ' ').toUpperCase()}</h1>
                    ${item.content.replace(/\n/g, '<br/>')}
                </div>
                <div style="margin-top: 50px; font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 10px; text-align: center; font-family: sans-serif;">
                    Generated by Credit U™ Secure Docs • ${new Date().toLocaleDateString()}
                </div>
            `
            const opt = {
                margin: 1,
                filename: item.filename || 'document.pdf',
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
            }
            html2pdf().set(opt).from(element).save()
        } else if (item.type === 'image' && item.url) {
            window.open(item.url, '_blank')
        }
    }

    // --- FILTERING ---

    const getFilteredRewards = () => {
        let items = rewards

        // Search
        if (searchQuery) {
            items = items.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase()))
        }

        // Tab Filter
        if (selectedTab === 'inventory') {
            return items.filter(r => inventory.has(r.id))
        }
        if (selectedTab !== 'all') {
            return items.filter(r => r.section === selectedTab)
        }
        return items
    }

    const displayedRewards = getFilteredRewards()
    const ownedCount = rewards.filter(r => inventory.has(r.id)).length

    if (loading) return <div className="p-12 text-center text-indigo-400 font-mono animate-pulse">Initializing Emporium...</div>

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-8 relative overflow-hidden font-sans">

            {/* Header / Stats */}
            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
                            <Crown size={12} /> Sovereign Emporium
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-2 flex items-center gap-3">
                            Moo Store™
                        </h1>
                        <p className="text-slate-400 font-light max-w-lg">
                            Exchange your <span className="text-amber-400">discipline</span> for ownership.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-slate-900/50 border border-white/10 px-6 py-4 rounded-xl flex flex-col items-center">
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Inventory</span>
                            <div className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" /> {ownedCount}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-900 to-black border border-amber-500/30 px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.1)] flex flex-col items-end min-w-[200px]" data-tour-id="moo-points">
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Available Capital</span>
                            <div className="text-3xl font-mono font-bold text-white flex items-center gap-3" data-amara-vision="Wallet Balance">
                                <Sparkles className="w-5 h-5 text-amber-400" />
                                {userPoints.toLocaleString()} <span className="text-sm text-base text-slate-500">PTS</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Interface */}
                <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">

                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <TabsList className="bg-white/5 border border-white/5 p-1 h-auto flex-wrap justify-start" data-tour-id="moo-tabs">
                            {SECTIONS.map(section => (
                                <TabsTrigger
                                    key={section.id}
                                    value={section.id}
                                    className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white h-9 px-4 rounded-md text-slate-400 text-xs uppercase font-bold tracking-wider"
                                >
                                    {section.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Search catalog..."
                                className="pl-9 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Recommendations (Only on All tab and if not searching) */}
                    {selectedTab === 'all' && !searchQuery && (
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
                                <Sparkles size={12} /> Recommended For You
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {rewards.filter(r => !inventory.has(r.id)).slice(0, 3).map(rec => {
                                    const Icon = ICON_MAP[rec.icon_key] || Gift
                                    return (
                                        <div key={rec.id} className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 p-4 rounded-xl flex items-center gap-4 hover:border-indigo-500/40 transition-colors cursor-pointer" onClick={() => handlePurchase(rec)}>
                                            <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-300">
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-white">{rec.title}</div>
                                                <div className="text-xs text-indigo-300">{rec.cost} PTS</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Grid */}
                    <AnimatePresence mode='popLayout'>
                        {displayedRewards.length === 0 ? (
                            <div className="text-center py-20 text-slate-500">
                                <p>No items found in this section.</p>
                                {selectedTab === 'inventory' && <Button variant="link" onClick={() => setSelectedTab('all')}>Browse Marketplace</Button>}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-tour-id="moo-grid">
                                {displayedRewards.map((reward) => {
                                    const Icon = ICON_MAP[reward.icon_key] || Gift
                                    const isOwned = inventory.has(reward.id)
                                    const canAfford = userPoints >= reward.cost || isOwned

                                    return (
                                        <motion.div
                                            key={reward.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className={`h-full bg-slate-900/40 backdrop-blur-sm border ${isOwned ? 'border-emerald-500/20 bg-emerald-900/5' : canAfford ? 'border-white/10 hover:border-indigo-500/50' : 'border-white/5 opacity-70'} rounded-2xl p-6 flex flex-col transition-all group relative overflow-hidden`}>

                                                <div className="flex justify-between items-start mb-6">
                                                    <div className={`p-3 rounded-xl ${isOwned ? 'bg-emerald-500/10 text-emerald-400' : canAfford ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800/50 text-slate-600'}`}>
                                                        <Icon size={24} />
                                                    </div>
                                                    {isOwned && <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20">OWNED</Badge>}
                                                </div>

                                                <h3 className={`font-bold text-lg mb-2 leading-tight ${canAfford ? 'text-white' : 'text-slate-500'}`}>
                                                    {reward.title}
                                                </h3>
                                                <p className="text-sm text-slate-400 mb-6 flex-1 line-clamp-3">
                                                    {reward.description}
                                                </p>

                                                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                                    <div className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-slate-600'}`}>
                                                        {isOwned ? (
                                                            <span className="text-xs text-slate-500">READY</span>
                                                        ) : (
                                                            <>{reward.cost} <span className="text-[10px] text-slate-500">PTS</span></>
                                                        )}
                                                    </div>

                                                    <Button
                                                        size="sm"
                                                        onClick={() => handlePurchase(reward)}
                                                        disabled={(!canAfford && !isOwned) || processingId === reward.id}
                                                        className={`h-8 px-4 font-bold text-xs transition-all ${isOwned
                                                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                                            : canAfford
                                                                ? 'bg-white text-black hover:bg-indigo-400 hover:scale-105'
                                                                : 'bg-white/5 text-slate-600 hover:bg-white/10'
                                                            }`}
                                                    >
                                                        {processingId === reward.id ? 'Processing...' : isOwned ? 'ACCESS CONTENT' : canAfford ? 'ACQUIRE' : 'LOCKED'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                    </AnimatePresence>

                </Tabs>

                {/* Purchase Success Modal */}
                <AnimatePresence>
                    {successItem && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-[#0A0F1E] border border-emerald-500/50 p-8 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.2)] max-w-md w-full text-center relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-emerald-500/5"></div>
                                <div className="relative z-10">
                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400 border border-emerald-500/20">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h3 className="text-3xl font-heading font-bold text-white mb-2">Acquired!</h3>
                                    <p className="text-slate-400 mb-8">
                                        You are now the owner of <strong>{successItem}</strong>.
                                    </p>
                                    <Button onClick={() => setSuccessItem(null)} className="bg-emerald-600 hover:bg-emerald-500 text-white w-full h-12 text-lg font-bold">
                                        Open Inventory
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    )
}
