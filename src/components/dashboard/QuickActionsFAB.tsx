import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, FileText, MessageCircle, Zap, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export function QuickActionsFAB() {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    const actions = [
        { label: 'Share Profile', icon: ExternalLink, color: 'bg-indigo-600', onClick: () => navigate('/links') },
        { label: 'New Dispute', icon: Zap, color: 'bg-amber-500', onClick: () => navigate('/dashboard/credit-lab') },
        { label: 'Transcript', icon: FileText, color: 'bg-indigo-500', onClick: () => navigate('/dashboard/profile') },
        { label: 'Support', icon: MessageCircle, color: 'bg-emerald-500', onClick: () => navigate('/dashboard/community') },
    ]

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        className="flex flex-col gap-3 items-end mb-2"
                    >
                        {actions.map((action, i) => (
                            <motion.button
                                key={action.label}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => {
                                    action.onClick()
                                    setIsOpen(false)
                                }}
                                className="group flex items-center gap-3 pl-3 pr-1 py-1"
                            >
                                <span className="text-sm font-bold text-white bg-black/80 px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 group-hover:bg-white group-hover:text-black transition-colors">
                                    {action.label}
                                </span>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                                    <action.icon size={20} />
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 'bg-red-500 rotate-45' : 'bg-white hover:bg-slate-200 text-black'}`}
            >
                <Plus size={28} />
            </Button>
        </div>
    )
}
