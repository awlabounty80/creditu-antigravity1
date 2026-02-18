import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Vault, UploadCloud, FileText, Search, ShieldCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Doc {
    id: string
    name: string
    type: string
    date: string
    status: 'analyzing' | 'secure' | 'action_required'
    analysisResult?: string
}

export default function TheVault() {
    const [isLocked, setIsLocked] = useState(true)
    const [documents, setDocuments] = useState<Doc[]>([
        { id: '1', name: 'Equifax_Response_Jan24.pdf', type: 'Bureau Response', date: '2024-01-15', status: 'secure', analysisResult: 'Standard verification notice. No action needed.' },
        { id: '2', name: 'TransUnion_Dispute_Result.pdf', type: 'Dispute Result', date: '2024-01-10', status: 'action_required', analysisResult: 'Stall Letter Detected. They claim ID is unreadable. Re-send ID immediately.' }
    ])
    const [uploading, setUploading] = useState(false)

    const handleUnlock = () => {
        // Simple animation trigger
        setTimeout(() => setIsLocked(false), 800)
    }

    const handleUpload = () => {
        setUploading(true)
        setTimeout(() => {
            const newDoc: Doc = {
                id: Math.random().toString(),
                name: 'Experian_Scan_003.jpg',
                type: 'Bureau Response',
                date: new Date().toISOString().split('T')[0],
                status: 'analyzing'
            }
            setDocuments([newDoc, ...documents])
            setUploading(false)

            // Simulate AI Analysis
            setTimeout(() => {
                setDocuments(prev => prev.map(d => d.id === newDoc.id ? {
                    ...d,
                    status: 'secure',
                    analysisResult: 'Analysis Complete: Item Deleted! This letter confirms deletion of the collection account.'
                } : d))
            }, 3000)
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-[#050B1D] text-white p-6 md:p-12 font-sans relative overflow-hidden">

            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-12 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter mb-2 flex items-center gap-3">
                            <Vault className="w-10 h-10 text-amber-500" /> THE VAULT
                        </h1>
                        <p className="text-slate-400">Secure Document Storage & Intelligent Analysis</p>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Encryption Active</span>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {isLocked ? (
                        <motion.div
                            key="locked"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                            className="h-[60vh] flex flex-col items-center justify-center"
                        >
                            <button
                                onClick={handleUnlock}
                                className="group relative w-64 h-64 rounded-full bg-gradient-to-br from-slate-800 to-black border-4 border-slate-700 shadow-2xl flex items-center justify-center hover:scale-105 transition-transform duration-500"
                            >
                                <div className="absolute inset-2 border border-dashed border-white/20 rounded-full animate-[spin_20s_linear_infinite]" />
                                <div className="absolute inset-0 bg-amber-500/5 rounded-full group-hover:bg-amber-500/10 transition-colors" />
                                <Vault className="w-24 h-24 text-slate-500 group-hover:text-amber-400 transition-colors duration-500" />
                                <div className="absolute bottom-10 text-xs text-slate-500 uppercase tracking-widest font-bold group-hover:text-white">Click to Open</div>
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                        >
                            {/* Upload Area */}
                            <div className="lg:col-span-4 space-y-6">
                                <Card className="bg-black/40 border-white/10 p-8 text-center border-dashed border-2 hover:border-amber-500/50 transition-colors group cursor-pointer" onClick={handleUpload}>
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-500/20 transition-colors">
                                        {uploading ? (
                                            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                                        ) : (
                                            <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-amber-500 transition-colors" />
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Upload Bureau Letter</h3>
                                    <p className="text-sm text-slate-400">Drag & Drop or process via Camera</p>
                                    <p className="text-xs text-amber-500/70 mt-4 uppercase tracking-wider font-bold">Auto-OCR Enabled</p>
                                </Card>

                                <div className="bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-2xl">
                                    <h4 className="text-indigo-300 font-bold mb-2 flex items-center gap-2">
                                        <Search className="w-4 h-4" /> Why upload?
                                    </h4>
                                    <p className="text-sm text-indigo-200/70 leading-relaxed">
                                        The Vault doesn't just store files. It reads them. Our system analyzes bureau responses to detect "Stall Letters", "Deletions", or "Verifications" and suggests your next move.
                                    </p>
                                </div>
                            </div>

                            {/* Document List */}
                            <div className="lg:col-span-8 space-y-4">
                                <h2 className="text-lg font-bold text-white mb-4">Secure Storage ({documents.length})</h2>
                                <div className="space-y-3">
                                    {documents.map((doc) => (
                                        <motion.div
                                            key={doc.id}
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-4 hover:bg-white/10 transition-colors"
                                        >
                                            <div className="p-3 bg-black/50 rounded-lg">
                                                <FileText className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-white">{doc.name}</h3>
                                                    {doc.status === 'analyzing' && <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full animate-pulse">ANALYZING</span>}
                                                    {doc.status === 'action_required' && <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">ACTION REQUIRED</span>}
                                                    {doc.status === 'secure' && <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">SECURE</span>}
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                                    <span>{doc.type}</span>
                                                    <span>•</span>
                                                    <span>{doc.date}</span>
                                                </div>
                                                {doc.analysisResult && (
                                                    <div className={cn("mt-3 text-sm p-3 rounded-lg border",
                                                        doc.status === 'action_required' ? "bg-red-900/10 border-red-500/20 text-red-200" :
                                                            doc.status === 'secure' ? "bg-emerald-900/10 border-emerald-500/20 text-emerald-200" :
                                                                "bg-white/5 border-white/10 text-slate-300"
                                                    )}>
                                                        <span className="font-bold opacity-70 block text-[10px] uppercase mb-1">AI Analysis Result:</span>
                                                        {doc.analysisResult}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Search className="w-4 h-4" /></Button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
