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
import { loadStripe } from '@stripe/stripe-js'

// --- INITIALIZE STRIPE ---
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

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
            console.log('[MicroOfferCheckout] Fetching offer for slug:', slug)

            // Safety timeout
            const timeout = setTimeout(() => {
                if (loading) {
                    console.error('[MicroOfferCheckout] Fetch timeout reached')
                    toast.error("Network synchronization timeout.")
                    setLoading(false)
                }
            }, 10000)

            try {
                const { data, error } = await supabase
                    .from('micro_offers')
                    .select('*')
                    .eq('slug', slug)
                    .single()

                clearTimeout(timeout)

                if (error) {
                    console.error('[MicroOfferCheckout] Supabase error:', error)
                    toast.error("Offer protocol not found.")
                    navigate('/pre-reg')
                    return
                }

                if (!data) {
                    console.error('[MicroOfferCheckout] No data returned for slug:', slug)
                    toast.error("Offer data missing.")
                    navigate('/pre-reg')
                    return
                }

                console.log('[MicroOfferCheckout] Offer loaded:', data.title)
                setOffer(data)
                setLoading(false)
            } catch (err) {
                console.error('[MicroOfferCheckout] Unexpected error:', err)
                setLoading(false)
            }
        }
        fetchOffer()
    }, [slug, navigate])

    const handlePurchase = async () => {
        if (!offer) {
            console.error('[MicroOfferCheckout] Cannot purchase: No offer data.')
            return
        }
        setIsPurchasing(true)
        console.log('[MicroOfferCheckout] Starting purchase sequence for:', offer.title)
        console.log('[MicroOfferCheckout] Payload verification:', {
            offerId: offer.id,
            offerTitle: offer.title,
            price: offer.price,
            origin: window.location.origin
        })

        if (!supabase || !supabase.functions) {
            console.error('[MicroOfferCheckout] Supabase client or functions module missing!', supabase)
            toast.error("System configuration error. Please refresh.")
            setIsPurchasing(false)
            return
        }

        try {
            console.log('[MicroOfferCheckout] Calling Stripe Session Generator via direct fetch...')

            // 1. Call Supabase Edge Function to create Stripe Session
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({
                    offerId: offer.id,
                    offerTitle: offer.title,
                    price: offer.price,
                    successUrl: `${window.location.origin}/welcome?success=true`,
                    cancelUrl: window.location.href,
                })
            })

            console.log('[MicroOfferCheckout] Fetch status:', response.status)
            const data = await response.json()
            console.log('[MicroOfferCheckout] Fetch response data:', data)

            if (!response.ok) {
                console.error('[MicroOfferCheckout] Fetch failed:', data)
                throw new Error(data.error || `Server responded with ${response.status}`)
            }

            // 2. Redirect to Stripe Checkout URL
            if (data?.url) {
                console.log('[MicroOfferCheckout] Redirecting to Stripe:', data.url)
                window.location.href = data.url
            } else {
                console.error('[MicroOfferCheckout] No URL in response data:', data)
                throw new Error("Stripe session creation failed - No URL returned.")
            }

        } catch (error: any) {
            console.error('[MicroOfferCheckout] Critical Purchase Error:', error)
            // Log the full error object for deep debugging
            console.dir(error)

            const errorMessage = error.message || (typeof error === 'string' ? error : "Financial synchronization failed.")
            toast.error(errorMessage)
            setIsPurchasing(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020412] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            </div>
        )
    }

    if (!offer) {
        return (
            <div className="min-h-screen bg-[#020412] flex flex-col items-center justify-center space-y-6">
                <ShieldCheck className="w-16 h-16 text-slate-700" />
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Synchronization Failed</h2>
                    <p className="text-slate-500 mb-6">We couldn't retrieve the offer protocol from the server.</p>
                </div>
                <Button
                    onClick={() => window.location.reload()}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-2 rounded-lg"
                >
                    Retry Connection
                </Button>
                <Link to="/pre-reg" className="text-xs text-slate-500 hover:text-white uppercase tracking-widest font-bold">
                    Back to Orientation
                </Link>
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
                            {Array.isArray(offer.description) ? offer.description.map((item: string, i: number) => (
                                <div key={i} className="flex items-start gap-4 group">
                                    <div className="mt-1 p-1 rounded-full bg-emerald-500/20 text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    <span className="text-slate-200 font-medium group-hover:text-white transition-colors tracking-tight">{item}</span>
                                </div>
                            )) : (
                                <p className="text-slate-500 text-xs italic">Protocol details encrypted.</p>
                            )}
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

                                <button
                                    onClick={(e) => {
                                        console.log('[MicroOfferCheckout] NATIVE BUTTON CLICKED', e)
                                        handlePurchase()
                                    }}
                                    disabled={isPurchasing}
                                    style={{
                                        width: '100%',
                                        height: '4rem',
                                        backgroundColor: 'white',
                                        color: 'black',
                                        fontWeight: 900,
                                        fontSize: '1.125rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        borderRadius: '0.75rem',
                                        border: 'none',
                                        cursor: isPurchasing ? 'not-allowed' : 'pointer',
                                        position: 'relative',
                                        zIndex: 100,
                                        opacity: isPurchasing ? 0.5 : 1
                                    }}
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
                                </button>

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
