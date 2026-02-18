
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Zap, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CreditUniversityEnrollment() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

    return (
        <section ref={containerRef} className="relative w-full py-20 px-4 md:px-8 mt-12 mb-20 overflow-hidden rounded-[3rem] border border-amber-500/10 bg-slate-950">

            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
                <motion.div
                    style={{ y, rotate }}
                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"
                />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">

                {/* Hook / Orchestration */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-6 animate-pulse">
                        Clearance Level: Applicant
                    </span>
                    <h2 className="font-heading text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tight mb-6">
                        THE DORM WAS <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-700">THE FILTER.</span><br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-600">THIS IS THE SOURCE.</span>
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        You've reset your foundation. Now, authorize the construction of your empire.
                        Join the elite collective mastering the algorithms of wealth.
                    </p>
                </motion.div>

                {/* Attraction / Value Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {[
                        { icon: Shield, title: "Regulation First", desc: "Master FCRA, FDCPA, and Metro 2 reporting. Use the law as your leverage, not luck." },
                        { icon: Zap, title: "Strategic Positioning", desc: "Optimize utilization, timing, and mix. Engineer your profile for algorithmic approval." },
                        { icon: Globe, title: "Systematic Execution", desc: "Follow proven protocols. No guessing, no emotion—just repeatable results." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2, duration: 0.6 }}
                            className="bg-white/5 border border-white/5 p-8 rounded-2xl hover:bg-white/10 transition-colors group text-left relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <item.icon size={80} />
                            </div>
                            <item.icon className="w-8 h-8 text-amber-500 mb-4" />
                            <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Persuasion / CTA */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    className="relative inline-block"
                >
                    <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-20 animate-pulse-slow"></div>
                    <Link to="/signup">
                        <Button className="relative h-auto py-6 px-12 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white border-0 rounded-full shadow-[0_10px_40px_rgba(245,158,11,0.3)] transition-all hover:scale-105 group overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                            <div className="flex flex-col items-center">
                                <span className="font-heading font-black text-2xl tracking-widest flex items-center gap-3">
                                    ENROLL NOW <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-100 opacity-80 mt-1">
                                    Class of 2026 • Limited Seats
                                </span>
                            </div>
                        </Button>
                    </Link>
                    <p className="mt-6 text-slate-500 text-xs font-mono">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 inline mr-2" />
                        30-Day "Iron-Clad" Satisfaction Guarantee
                    </p>
                </motion.div>

            </div>
        </section>
    );
}
