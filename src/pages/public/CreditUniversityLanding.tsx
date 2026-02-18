import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Users, GraduationCap, PlayCircle, Star, Quote, ArrowRight } from 'lucide-react'
import { CreditULogo } from '@/components/common/CreditULogo'
import { motion } from 'framer-motion'

// Custom Background Component
const AuroraBackground = () => (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-amber-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
    </div>
)

// Floating Badge Component
const TrustBadge = ({ delay, label, icon: Icon }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full"
    >
        <div className="p-1 bg-amber-500/20 rounded-full text-amber-400">
            <Icon size={12} />
        </div>
        <span className="text-xs font-bold tracking-wide text-slate-200 uppercase">{label}</span>
    </motion.div>
)

export default function CreditUniversityLanding() {
    // Auto-Redirect removed to prevent entry page flashing.
    // Users can access dashboard via "Student Portal" link.

    return (
        <div className="min-h-screen bg-[#020412] text-white font-sans selection:bg-amber-500/30 overflow-x-hidden">

            {/* --- NAVIGATION --- */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020412]/80 backdrop-blur-xl transition-all duration-300">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-amber-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative bg-gradient-to-br from-indigo-950 to-black p-1 rounded-xl border border-white/10 shadow-xl overflow-hidden">
                                <CreditULogo className="w-12 h-12" variant="gold" showShield={false} iconClassName="w-10 h-10" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-heading font-black text-xl tracking-tight leading-none text-white">
                                CREDIT U
                            </span>
                            <span className="text-[9px] uppercase tracking-[0.3em] text-indigo-300/80">University AI</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {['Curriculum', 'Tuition', 'Mission'].map((item) => (
                            <Link key={item} to={`/${item.toLowerCase()}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group">
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-500 transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/gate" className="hidden md:block">
                            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">
                                Student Portal
                            </Button>
                        </Link>
                        <Link to="/apply">
                            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold px-8 shadow-lg shadow-amber-900/20 border-t border-white/20">
                                Apply Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="relative min-h-[110vh] flex flex-col justify-center pt-20 overflow-hidden">
                <AuroraBackground />

                {/* 3D Grid Floor */}
                <div className="absolute bottom-0 left-[-50%] w-[200%] h-[50vh] bg-[linear-gradient(transparent_0%,_rgba(67,56,202,0.1)_1px,_transparent_1px),linear-gradient(90deg,transparent_0%,_rgba(67,56,202,0.1)_1px,_transparent_1px)] bg-[size:60px_60px] [transform:perspective(1000px)_rotateX(70deg)] origin-bottom opacity-40 animate-grid-flow pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10 text-center mt-[-10vh]">

                    {/* Social Proof Ticker */}
                    <div className="flex justify-center gap-4 mb-12 flex-wrap">
                        <TrustBadge label="50K+ Students" icon={Users} delay={0.1} />
                        <TrustBadge label="HBCU Excellence" icon={GraduationCap} delay={0.2} />
                        <TrustBadge label="AI Powered" icon={Star} delay={0.3} />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="space-y-6"
                    >
                        <h1 className="font-heading text-7xl md:text-[9rem] font-black leading-[0.9] tracking-tighter text-white drop-shadow-2xl">
                            BUILD YOUR <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 animate-shimmer bg-[length:200%_auto]">DYNASTY</span>
                        </h1>

                        <p className="text-xl md:text-3xl text-indigo-200/80 max-w-4xl mx-auto font-light leading-normal">
                            The world's first <span className="text-white font-medium">Financial Intelligence University</span> designed to turn your credit into capital.
                        </p>
                    </motion.div>

                    {/* Action Deck */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-6 pt-16"
                    >
                        <Link to="/apply" className="group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-amber-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
                                <Button size="lg" className="relative h-20 px-12 text-xl bg-white text-indigo-950 hover:bg-amber-50 hover:text-black font-bold rounded-full transition-all border-4 border-white/10 group-hover:scale-105">
                                    Start Freshman Orientation
                                    <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform text-amber-600" />
                                </Button>
                            </div>
                            <div className="mt-4 text-xs font-medium text-slate-500 uppercase tracking-widest ">
                                Fall Semester closing soon
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* Floating Elements (Atmosphere) */}
                <div className="absolute top-1/3 left-10 w-2 h-2 bg-amber-400 rounded-full animate-ping-slow"></div>
                <div className="absolute bottom-1/3 right-10 w-2 h-2 bg-indigo-400 rounded-full animate-ping-slow" style={{ animationDelay: '1.5s' }}></div>

                {/* Video/Preview Scroller (Mock) */}
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#020412] to-transparent z-20"></div>
            </header>

            {/* --- IMMERSIVE VIDEO SECTION --- */}
            <section className="relative py-20 -mt-20 z-20">
                <div className="container mx-auto px-6">
                    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-2 overflow-hidden shadow-2xl shadow-indigo-900/50">
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black group cursor-pointer">
                            {/* Placeholder for Cinematic Trailer */}
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590579491624-f98f36d4c763?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity duration-700 group-hover:scale-105"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                                    <PlayCircle className="w-12 h-12 text-white fill-white/20" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 to-transparent">
                                <h3 className="text-2xl font-bold text-white mb-2">Welcome to The Yard</h3>
                                <p className="text-slate-300">Experience the energy of Credit U.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SOCIAL PROOF WALL --- */}
            <section className="py-24 bg-[#0a0f29]">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <CreditULogo className="w-16 h-16 mx-auto mb-6" variant="gold" showShield={false} iconClassName="w-12 h-12" />
                        <h2 className="text-4xl font-bold text-white font-heading mb-4">Real Results. Real Legacy.</h2>
                        <p className="text-slate-400">Join a network of alumni who are rewriting their family history.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { quote: "I deleted 3 collections and funded my business in 45 days. This isn't a course, it's a movement.", author: "Marcus T.", role: "Class of '24" },
                            { quote: "The AI Dean found loop-holes my lawyer missed. Credit U is the cheat code.", author: "Sarah J.", role: "Class of '25" },
                            { quote: "Finally, a place that looks like us and speaks the language of wealth. HBCU energy all day.", author: "David R.", role: "Alumni" }
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-indigo-900/10 border border-indigo-500/10 relative">
                                <Quote className="absolute top-6 left-6 w-8 h-8 text-indigo-500/20" />
                                <p className="text-slate-300 relative z-10 mb-6 leading-relaxed">"{item.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600"></div>
                                    <div>
                                        <div className="font-bold text-white">{item.author}</div>
                                        <div className="text-xs text-amber-500/80 uppercase tracking-wider">{item.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FINAL CALL --- */}
            <section className="py-32 bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 blur-[150px] rounded-full"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 font-heading">
                        DON'T WAIT FOR<br />PERMISSION.
                    </h2>
                    <Link to="/apply">
                        <Button className="h-16 px-12 text-lg bg-white text-black hover:bg-amber-400 font-bold rounded-full">
                            Take Your Seat at the Table
                        </Button>
                    </Link>
                </div>
            </section>

        </div>
    )
}
