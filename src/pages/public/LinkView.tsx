
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ExternalLink,
    BookOpen,
    GraduationCap,
    ShieldCheck,
    Zap,
    Globe,
    MessageCircle,
    Instagram,
    Twitter,
    Github,
    Youtube,
    Copy,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const LinkCategory = ({ title, description, children }: { title: string, description?: string, children: React.ReactNode }) => (
    <div className="space-y-4 w-full max-w-md mx-auto">
        <div className="px-4">
            <h2 className="text-indigo-400 font-bold text-xs uppercase tracking-widest">{title}</h2>
            {description && <p className="text-slate-400 text-[10px]">{description}</p>}
        </div>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const GlassLink = ({ href, icon: Icon, label, subtext, premium }: { href: string, icon: any, label: string, subtext?: string, premium?: boolean }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`
            group relative flex items-center gap-4 p-4 rounded-2xl w-full
            border border-white/10 backdrop-blur-md transition-all duration-300
            ${premium
                ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 shadow-lg shadow-indigo-500/10 border-indigo-500/30'
                : 'bg-white/5 hover:bg-white/10'}
        `}
    >
        <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${premium ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300 group-hover:text-white'}
            transition-colors
        `}>
            <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
            <div className="font-bold text-slate-100">{label}</div>
            {subtext && <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{subtext}</div>}
        </div>
        <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-white transition-opacity" />

        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.a>
);

export default function LinkView() {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-x-hidden font-sans">
            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[40%] -right-[15%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-6 py-16 flex flex-col items-center">
                {/* Header / Avatar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 relative"
                >
                    {/* Share Button */}
                    <div className="absolute -top-10 right-0 md:-right-12">
                        <motion.button
                            onClick={copyToClipboard}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md hover:bg-white/10 transition-colors group relative"
                        >
                            <AnimatePresence mode="wait">
                                {copied ? (
                                    <motion.div
                                        key="check"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                    >
                                        <Check className="h-4 w-4 text-green-400" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="copy"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                    >
                                        <Copy className="h-4 w-4 text-slate-400 group-hover:text-white" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Tooltip */}
                            <AnimatePresence>
                                {copied && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-green-400"
                                    >
                                        Copied!
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>

                    <div className="relative mb-6 inline-block">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <div className="w-24 h-24 rounded-full border-2 border-white/20 p-1 relative z-10 bg-[#0a0f2c]/80 overflow-hidden">
                            <img
                                src="/assets/logo-icon.png"
                                alt="Credit University"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=CU';
                                }}
                            />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2 italic">CREDIT UNIVERSITY™</h1>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto">Master the systems of financial leverage and asset protection.</p>
                </motion.div>

                {/* Categories */}
                <div className="space-y-12 w-full">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <LinkCategory title="Main Portals" description="Access your primary university interfaces">
                            <GlassLink
                                href="/dorm-week"
                                icon={Zap}
                                label="Join Dorm Week"
                                subtext="The 7-Day Foundation (Free Enrollment)"
                                premium
                            />
                            <GlassLink
                                href="/apply"
                                icon={GraduationCap}
                                label="Full University Admissions"
                                subtext="Apply for the Class of 2026"
                            />
                            <GlassLink
                                href="/login"
                                icon={ShieldCheck}
                                label="Student Login"
                                subtext="Access your Student Cockpit"
                            />
                        </LinkCategory>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <LinkCategory title="The Ecosystem" description="Resources and specialized labs">
                            <GlassLink
                                href="/dashboard/credit-lab"
                                icon={BookOpen}
                                label="Free Credit Tools"
                                subtext="Dispute generators & simulators"
                            />
                            <GlassLink
                                href="/tuition"
                                icon={Globe}
                                label="View Curriculum"
                                subtext="Explore the 4 Pillars of Credit Mastery"
                            />
                        </LinkCategory>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <LinkCategory title="Community & Signal">
                            <div className="flex justify-center gap-4 py-2">
                                <motion.a
                                    href="https://instagram.com"
                                    whileHover={{ y: -5, color: '#e1306c' }}
                                    className="p-3 bg-white/5 rounded-full text-slate-400 hover:bg-white/10 transition-colors"
                                >
                                    <Instagram className="h-6 w-6" />
                                </motion.a>
                                <motion.a
                                    href="https://twitter.com"
                                    whileHover={{ y: -5, color: '#1da1f2' }}
                                    className="p-3 bg-white/5 rounded-full text-slate-400 hover:bg-white/10 transition-colors"
                                >
                                    <Twitter className="h-6 w-6" />
                                </motion.a>
                                <motion.a
                                    href="https://youtube.com"
                                    whileHover={{ y: -5, color: '#ff0000' }}
                                    className="p-3 bg-white/5 rounded-full text-slate-400 hover:bg-white/10 transition-colors"
                                >
                                    <Youtube className="h-6 w-6" />
                                </motion.a>
                            </div>
                        </LinkCategory>
                    </motion.div>
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 text-center"
                >
                    <div className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">
                        © 2026 Credit University • All Protocols Active
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

