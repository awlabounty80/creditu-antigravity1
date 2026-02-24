import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Check,
    ArrowLeft,
    ShieldCheck,
    Zap,
    Lock,
    RefreshCw,
    TrendingUp,
    GraduationCap,
    Star,
    Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

const ICONS: Record<string, any> = {
    RefreshCw,
    TrendingUp,
    GraduationCap,
    Star
}

export default function MicroOfferCheckout() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [offer, setOffer] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isPurchasing, setIsPurchasing] = useState(false)

    useEffect(() => {
        const fetchOffer = async () => {
            const { data, error } = await supabase
                .from('micro_offers')
                .select('*')
                .eq('slug', slug)
                .single()

            if (error || !data) {
                toast.error("Offer protocol not found.")
                navigate('/pre-reg')
                return
            }

            setOffer(data)
            setLoading(false)
        }
        fetchOffer()
    }, [slug, navigate])

    const handlePurchase = async () => {
        setIsPurchasing(true)

        // SIMULATION: In a real app, this triggers Stripe
        await new Promise(resolve => setTimeout(resolve, 2000))

        // On success, apply tag to current user profile if logged in
        // For this pre-reg flow, we'd usually ask for email first if they aren't logged in
        toast.success("Intelligence Secured. Check your inbox for access.")
        setIsPurchasing(false)
        navigate('/welcome')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020412] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            </div>
        )
    }

    const OfferIcon = ICONS[offer.icon_key] || Star

    return (
        <div className="min-h-screen bg-[#020412] text-white font-sans selection:bg-amber-500/30 overflow-x-hidden p-6 md:p-12 relative">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-amber-600/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
            </div>

            <nav className="relative z-50 max-w-4xl mx-auto mb-12 flex justify-between items-center">
                <Link to="/pre-reg" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
                    <ArrowLeft size={14} /> Back to Orientation
                </Link>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Encrypted Checkout</span>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* LEFT: CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div>
                            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl w-fit mb-6 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                                <OfferIcon size={32} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none mb-4">
                                {offer.headline}
                            </h1>
                            <p className="text-slate-400 text-lg font-light leading-relaxed">
                                {offer.title}: A specialized extraction module designed for rapid results.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6">What You Get:</h3>
                            {offer.description.map((item: string, i: number) => (
                                <div key={i} className="flex items-start gap-4 group">
                                    <div className="mt-1 p-1 rounded-full bg-emerald-500/20 text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    <span className="text-slate-200 font-medium group-hover:text-white transition-colors tracking-tight">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                            <div className="flex items-center gap-4 text-xs font-mono text-slate-500 mb-2">
                                <Lock size={12} /> SECURE INTEL SOURCE
                            </div>
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                                Note: This is a standalone module. Dorm Week enrollment is NOT required to utilize this intelligence.
                            </p>
                        </div>
                    </motion.div>

                    {/* RIGHT: CHECKOUT CARD */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="bg-gradient-to-b from-slate-900 to-black border-slate-800 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />

                            <CardContent className="p-8 md:p-10 text-center">
                                <div className="mb-8">
                                    <span className="text-xs font-black text-amber-500 uppercase tracking-[0.4em] mb-4 block">Access Fee</span>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-7xl font-black italic tracking-tighter text-white">
                                            ${Math.floor(offer.price)}
                                        </span>
                                        <span className="text-2xl font-black italic text-slate-500">.{((offer.price % 1) * 100).toFixed(0).padStart(2, '0')}</span>
                                    </div>
                                    <div className="mt-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">One-Time Secure Investment</div>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div className="flex items-center justify-between text-sm py-4 border-y border-white/5">
                                        <span className="text-slate-400 font-bold uppercase tracking-wider">Module Type</span>
                                        <span className="text-white font-black uppercase italic">Intelligence Extraction</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-2">
                                        <span className="text-slate-400 font-bold uppercase tracking-wider">Delivery</span>
                                        <span className="text-emerald-500 font-black uppercase italic">Instant Activation</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handlePurchase}
                                    disabled={isPurchasing}
                                    className="w-full h-16 bg-white hover:bg-slate-200 text-black font-black text-lg uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] transition-all relative overflow-hidden group"
                                >
                                    <AnimatePresence mode="wait">
                                        {isPurchasing ? (
                                            <motion.div
                                                key="loading"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center gap-2"
                                            >
                                                <Loader2 className="w-5 h-5 animate-spin" /> SYNCHRONIZING...
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="idle"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center gap-2"
                                            >
                                                <Zap size={20} fill="currentColor" /> {offer.custom_cta}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Button>

                                <div className="mt-8 flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-2 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
                                        <div className="w-8 h-5 bg-white/20 rounded-sm" />
                                        <div className="w-8 h-5 bg-white/20 rounded-sm" />
                                        <div className="w-8 h-5 bg-white/20 rounded-sm" />
                                    </div>
                                    <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest leading-loose">
                                        Secure Payment Processed via Credit U Global Gateways.<br />
                                        Satisfaction Guaranteed or Full Alignment Refund.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>

            {/* Floating Elements for Vibe */}
            <div className="fixed bottom-12 left-12 p-4 bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl hidden lg:block z-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black">JB</div>
                    <div>
                        <div className="text-[10px] font-black uppercase text-white">Just Purchased</div>
                        <div className="text-[8px] font-bold uppercase text-slate-500">Atlanta, GA</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
