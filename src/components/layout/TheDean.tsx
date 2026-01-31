import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, ChevronRight } from 'lucide-react'
import { useDean } from '@/hooks/useDean'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function TheDean() {
    const { message, isOpen, setIsOpen } = useDean()

    // If no message, we might still want to show the bubble if user opens it, 
    // but for now let's stick to the existing logic: hide if no message.
    if (!message) return null

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.3, type: "spring" }}
                        className="mb-4 bg-[#0F172A] border border-amber-500/30 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] rounded-2xl p-5 max-w-sm pointer-events-auto relative overflow-hidden"
                    >
                        {/* Background Effects */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-indigo-500 to-amber-500"></div>
                        <div className="absolute -left-10 -top-10 w-20 h-20 bg-amber-500/10 rounded-full blur-xl"></div>

                        <div className="flex justify-between items-start gap-3 mb-3 relative z-10">
                            <h4 className="font-heading font-bold text-white text-sm flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-400" /> The Dean
                            </h4>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-sm text-slate-200 leading-relaxed mb-4 relative z-10 font-light">
                            {message.text}
                        </p>

                        {message.actionLabel && message.actionLink && (
                            <Button size="sm" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0" asChild>
                                <Link to={message.actionLink}>
                                    {message.actionLabel} <ChevronRight className="w-3 h-3 ml-1" />
                                </Link>
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Avatar Trigger */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0F172A] to-[#1E293B] shadow-[0_0_20px_rgba(79,70,229,0.5)] flex items-center justify-center text-white border-2 border-amber-500/50 pointer-events-auto relative group overflow-hidden"
            >
                {/* Internal Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent pointer-events-none z-10"></div>

                {/* Video Avatar */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                >
                    <source src="/assets/dean-welcome.mp4" type="video/mp4" />
                </video>

                {/* Icon Overlay (if video fails or for interaction hint) */}
                <div className="relative z-20">
                    {isOpen && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 w-full h-full">
                            <X className="w-6 h-6 text-white" />
                        </div>
                    )}
                </div>

                {/* Status Dot */}
                <div className="absolute top-1 right-1 w-3 h-3 bg-emerald-500 border-2 border-[#0F172A] rounded-full z-20 animate-pulse"></div>
            </motion.button>
        </div>
    )
}
