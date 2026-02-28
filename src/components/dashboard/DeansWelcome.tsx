import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
// import { ProfessorGenerative } from './ProfessorGenerative'

export function DeansWelcome() {
    const [isOpen, setIsOpen] = useState(false)

    const togglePlay = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            {/* Minimized / Teaser View */}
            {/* LOCKED: DEAN SQUARE VIDEO PREVIEW */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-2xl overflow-hidden cursor-pointer group border border-amber-500/20 shadow-lg shadow-amber-900/10"
                onClick={togglePlay}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>

                {/* Thumbnail Video Loop */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700"
                >
                    <source src="/assets/dean-welcome.mp4" type="video/mp4" />
                </video>

                <div className="absolute bottom-0 left-0 w-full p-4 z-20 flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1">Incoming Transmission</div>
                        <h3 className="font-heading font-bold text-white text-lg">Message from The Dean</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all">
                        <Play className="w-4 h-4 ml-0.5" />
                    </div>
                </div>
            </motion.div>

            {/* Full Screen Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="aspect-video bg-black">
                                {/* <ProfessorGenerative
                                    transcript={transcript}
                                    onComplete={() => setIsOpen(false)}
                                /> */}
                                <div className="w-full h-full flex items-center justify-center text-white">
                                    <p>Transmission Incoming...</p>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 z-30 text-white/50 hover:text-white hover:bg-white/10 rounded-full"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
