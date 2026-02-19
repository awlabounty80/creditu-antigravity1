
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, AlertCircle, ArrowLeft, ShieldCheck, Mail, Key } from 'lucide-react'
import { CreditULogo } from '@/components/common/CreditULogo'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [usePassword, setUsePassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sent, setSent] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    // Get the return url from location state - prioritizing Orientation for Dorm Week
    const from = location.state?.from?.pathname || "/dashboard/orientation"

    useEffect(() => {
        // Check if already logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) navigate(from, { replace: true })
        })

        // Listen for auth state changes (e.g. Magic Link completion)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                navigate(from, { replace: true })
            }
        })

        return () => subscription.unsubscribe()
    }, [navigate, from])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (usePassword) {
                // Password Login
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })

                if (error) throw error
                navigate(from, { replace: true })
            } else {
                // Magic Link Login
                const { error } = await supabase.auth.signInWithOtp({
                    email,
                    options: {
                        shouldCreateUser: true,
                        emailRedirectTo: `${window.location.origin}/dashboard/orientation`,
                    }
                })

                if (error) throw error
                setSent(true)
            }
        } catch (err: any) {
            setError(err.message)
            setSent(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#020412] text-white selection:bg-indigo-500/30 flex items-center justify-center p-6">

            {/* Cinematic Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050a1f] via-[#020412] to-black z-0 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full border border-indigo-900/20 bg-gradient-to-b from-indigo-500/5 to-transparent z-0 blur-3xl pointer-events-none animate-spin-ultra-slow"></div>

            <div className="relative z-10 w-full max-w-md">

                {/* Back Link */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <Link to="/" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Return to Gate
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "backOut" }}
                >
                    <Card className="bg-[#0A0F1E]/80 border-white/10 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden relative">
                        {/* Top Shine */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

                        <CardContent className="pt-8 px-8 pb-8">

                            <div className="text-center mb-12">
                                <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/10 mb-2 overflow-hidden border border-white/5 opacity-50">
                                    <CreditULogo className="w-full h-full" variant="white" showShield={false} iconClassName="w-16 h-16" />
                                </div>
                            </div>

                            {sent ? (
                                <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in duration-300">
                                    <div className="bg-emerald-500/10 text-emerald-400 p-6 rounded-xl border border-emerald-500/20">
                                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">Access Key Dispatched</h3>
                                        <p className="text-sm opacity-80 leading-relaxed">
                                            Your secure entry link has been sent to <span className="text-white font-mono">{email}</span>.
                                            <br /><span className="text-xs text-amber-500 mt-2 block font-medium">⚠️ Check your spam/promotions folder if it doesn't appear instantly.</span>
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            variant="ghost"
                                            className="text-slate-500 hover:text-white hover:bg-white/5"
                                            onClick={() => setSent(false)}
                                        >
                                            Use a different email
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleLogin} className="space-y-6">
                                    {error && (
                                        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-200">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-slate-500 ml-1">Email Address</label>
                                            <div className="relative group">
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your real email address..."
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    className="bg-black/40 border-white/10 text-white h-12 pl-4 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all font-medium placeholder:text-slate-700"
                                                />
                                            </div>
                                        </div>

                                        {usePassword && (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                                <label className="text-xs font-bold uppercase text-slate-500 ml-1">Secure Password</label>
                                                <div className="relative group">
                                                    <Input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        className="bg-black/40 border-white/10 text-white h-12 pl-4 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all font-medium placeholder:text-slate-700"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className={cn(
                                            "w-full h-12 font-bold tracking-wide text-white shadow-lg transition-all",
                                            "bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02] shadow-indigo-900/20"
                                        )}
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="animate-spin mr-2" /> : usePassword ? <Key className="mr-2 w-4 h-4" /> : <ShieldCheck className="mr-2 w-4 h-4" />}
                                        {loading ? 'Verifying Credentials...' : usePassword ? 'Authenticate' : 'Send Access Link'}
                                    </Button>

                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setUsePassword(!usePassword)
                                                setError(null)
                                            }}
                                            className="text-xs text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-widest font-bold"
                                        >
                                            {usePassword ? "Use Magic Link Instead" : "Login with Password"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </CardContent>

                        <div className="bg-black/40 p-4 text-center border-t border-white/5">
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Secure Connection: TLS 1.3
                            </p>
                        </div>
                    </Card>
                </motion.div>

                <div className="mt-8 text-center">
                    <p className="text-slate-600 text-xs">
                        By accessing this terminal you agree to the <span className="text-slate-400 hover:text-white cursor-pointer underline decoration-slate-600 underline-offset-4">University Charter</span>.
                    </p>
                </div>

            </div>
        </div>
    )
}
