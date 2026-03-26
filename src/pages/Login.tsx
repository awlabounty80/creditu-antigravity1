import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Sparkles, ArrowRight, Zap, Trophy, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Success Transition
            console.log("Login: Success. Redirecting to Dashboard.");
            navigate('/dashboard');
        } catch (err: any) {
            console.error("Login: Error during authentication", err);
            setError(err.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Cinematic Video (Hero Video) */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
            >
                <source src="https://thecredituniversityai.com/wp-content/uploads/2025/01/hero-background.mp4" type="video/mp4" />
            </video>
            
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

            {/* Glowing background elements */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                {/* Branding / Header */}
                <div className="text-center mb-8">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest text-amber-500 mb-6"
                    >
                        <ShieldCheck className="w-3 h-3" />
                        Returning Student Protocol
                    </motion.div>
                    
                    <h1 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-4 flex flex-col leading-none">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-amber-500">Welcome Back</span>
                        <span className="text-3xl text-white/40 tracking-[0.2em] font-medium mt-2 not-italic">To The Yard</span>
                    </h1>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500" />
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Student Registry Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="bg-black/40 border-white/10 pl-12 h-14 rounded-xl focus:border-indigo-500 transition-all text-white font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Secure Access Key</Label>
                                <button type="button" className="text-[9px] text-indigo-400 hover:text-indigo-300 uppercase tracking-widest font-bold">Lost Key?</button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-black/40 border-white/10 pl-12 h-14 rounded-xl focus:border-indigo-500 transition-all text-white font-bold"
                                />
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black text-center uppercase tracking-tighter flex items-center justify-center gap-2"
                                >
                                    <AlertTriangle className="w-4 h-4" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            disabled={isLoading}
                            className="group relative w-full h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-600 hover:from-blue-500 hover:to-amber-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-900/40 overflow-hidden text-xl flex items-center justify-center"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Verifying Identity...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Authorize Access</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">New to Credit University AI?</p>
                        <Link 
                            to="/admissions/register" 
                            className="inline-flex items-center gap-2 text-white hover:text-amber-500 transition-colors font-black uppercase text-xs tracking-widest border border-white/10 px-6 py-3 rounded-full hover:border-amber-500/40 bg-white/5 shadow-lg shadow-indigo-500/10"
                        >
                            <Sparkles className="w-3 h-3" />
                            Initialize Admissions Sequence
                        </Link>
                    </div>
                </div>

                {/* Footer Metrics */}
                <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-3 h-3 text-amber-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white">Admissions Beta 2.0</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-blue-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white">Encrypted Protocol Active</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
