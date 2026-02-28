import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, AlertCircle, CheckCircle, Database, Server, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BureauConnectModalProps {
    isOpen: boolean
    onClose: () => void
    onConnect: () => void
}

export function BureauConnectModal({ isOpen, onClose, onConnect }: BureauConnectModalProps) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [ssn, setSsn] = useState("")
    const [error, setError] = useState("")

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setStep(1)
            setSsn("")
            setError("")
        }
    }, [isOpen])

    const handleVerify = () => {
        if (ssn.length < 4) {
            setError("Input Invalid")
            return
        }
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            setLoading(false)
            setStep(2)
        }, 1500)
    }

    const handleConnect = () => {
        setLoading(true)
        // Simulate Bureau Handshake
        setTimeout(() => {
            setLoading(false)
            setStep(3)
            setTimeout(() => {
                onConnect()
                onClose()
            }, 1000)
        }, 2500)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-lg bg-[#0F1629] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-indigo-900/20 p-6 border-b border-white/5 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Database className="w-5 h-5 text-indigo-400" />
                                Tri-Bureau Uplink
                            </h2>
                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Secure Metro2 Connection</p>
                        </div>
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8">
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 text-amber-200 text-sm">
                                    <AlertCircle className="shrink-0 w-5 h-5 text-amber-500" />
                                    <p>
                                        You are currently viewing <strong>Simulated Data</strong>. To access your real-time report, we must verify your identity.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Last 4 Digits of SSN</label>
                                    <div className="flex gap-2">
                                        <div className="bg-white/5 h-12 w-full rounded-lg border border-white/10 flex items-center px-4 font-mono text-slate-500 select-none">XXX - XX - </div>
                                        <Input
                                            value={ssn}
                                            onChange={(e) => setSsn(e.target.value)}
                                            maxLength={4}
                                            placeholder="1234"
                                            className="w-24 h-12 bg-white/10 border-white/20 text-white font-mono text-center tracking-widest text-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                        />
                                    </div>
                                    {error && <p className="text-red-400 text-xs">{error}</p>}
                                </div>

                                <div className="text-xs text-slate-500 flex items-center gap-2 justify-center pt-4">
                                    <Lock size={12} /> 256-bit AES Encryption • No Hard Inquiry
                                </div>

                                <Button onClick={handleVerify} disabled={loading} className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all">
                                    {loading ? <Loader2 className="animate-spin" /> : "Verify Identity"}
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="text-center space-y-6 py-4">
                                <div className="w-20 h-20 mx-auto bg-indigo-500/10 rounded-full flex items-center justify-center relative">
                                    <Server className="w-10 h-10 text-indigo-500" />
                                    <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-ping"></div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Identity Confirmed</h3>
                                    <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">
                                        We are ready to establish a secure tunnel to Equifax, Experian, and TransUnion.
                                    </p>

                                    <div className="bg-black/40 rounded-lg p-3 max-w-sm mx-auto mb-6 text-left font-mono text-[10px] text-slate-400 space-y-1">
                                        <div className="flex justify-between text-emerald-500"><span>&gt; AUTH_TOKEN_GEN</span> <span>OK</span></div>
                                        <div className="flex justify-between"><span>&gt; EQUIFAX_PING</span> <span>...</span></div>
                                        <div className="flex justify-between"><span>&gt; EXPERIAN_PING</span> <span>...</span></div>
                                    </div>
                                </div>

                                <Button onClick={handleConnect} disabled={loading} className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20">
                                    {loading ? "Establishing Uplink..." : "Connect & Fetch Data"}
                                </Button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="text-center py-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-24 h-24 mx-auto bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                                >
                                    <CheckCircle className="w-12 h-12 text-white" />
                                </motion.div>
                                <h3 className="text-2xl font-black text-white">SYSTEM SYNCHRONIZED</h3>
                                <p className="text-slate-400 mt-2">Financial Nervous System is now live.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
