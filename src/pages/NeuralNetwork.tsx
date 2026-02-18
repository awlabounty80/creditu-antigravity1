import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Network, Share2, Activity, Zap, AlertCircle, Shield, CheckCircle, History, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Node {
    id: string
    x: number
    y: number
    label: string
    value: string
    status: 'optimal' | 'warning' | 'critical'
    icon: any
    details: string
}

interface Connection {
    from: string
    to: string
}

const nodes: Node[] = [
    { id: 'score', x: 50, y: 50, label: 'FICO 8', value: '720', status: 'optimal', icon: Shield, details: 'Your central credit score is healthy. Primary drivers are Payment History and Low Utilization.' },
    { id: 'payment', x: 20, y: 30, label: 'Payment History', value: '100%', status: 'optimal', icon: CheckCircle, details: 'You have missed 0 payments in the last 7 years. This is the strongest part of your profile.' },
    { id: 'utilization', x: 80, y: 30, label: 'Utilization', value: '12%', status: 'optimal', icon: Activity, details: 'Total usage is low. Recommended to keep below 10% for maximum points.' },
    { id: 'age', x: 20, y: 70, label: 'Credit Age', value: '4.2 Yrs', status: 'warning', icon: History, details: 'Your average age is moderate. Avoid opening new accounts to let this mature.' },
    { id: 'mix', x: 80, y: 70, label: 'Credit Mix', value: '3 Types', status: 'optimal', icon: Share2, details: 'Good mix of Credit Cards, Auto Loan, and Student Loan.' },
    { id: 'inquiries', x: 50, y: 90, label: 'Hard Inquiries', value: '4', status: 'critical', icon: AlertCircle, details: 'High number of inquiries detected in the last 12 months. Stop applying for credit immediately.' },
]

const connections: Connection[] = [
    { from: 'score', to: 'payment' },
    { from: 'score', to: 'utilization' },
    { from: 'score', to: 'age' },
    { from: 'score', to: 'mix' },
    { from: 'score', to: 'inquiries' },
    { from: 'payment', to: 'age' }, // Correlation
    { from: 'utilization', to: 'inquiries' } // Correlation
]

export default function NeuralNetwork() {
    const [selectedNode, setSelectedNode] = useState<Node | null>(null)
    const [hoveredNode, setHoveredNode] = useState<string | null>(null)

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12 relative overflow-hidden font-sans">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

            <div className="relative z-10 h-full flex flex-col">
                <header className="mb-8 flex items-center justify-between pointer-events-none">
                    <div>
                        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                            <Network className="w-10 h-10 text-cyan-500" /> NEURAL NETWORK
                        </h1>
                        <p className="text-slate-400">Visual Credit Logic Explorer</p>
                    </div>
                </header>

                <div className="flex-1 relative min-h-[600px] border border-white/10 rounded-3xl bg-black/40 backdrop-blur-sm overflow-hidden">
                    {/* SVG Layer for Connections */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {connections.map((conn, i) => {
                            const from = nodes.find(n => n.id === conn.from)!
                            const to = nodes.find(n => n.id === conn.to)!
                            // Simple linear interpolation for positions assuming % based mapping
                            // We need to convert % to pixels roughly or use a viewBox
                            // To keep it simple in responsive, we'll use % coordinates in line?
                            // SVG lines don't take % well for x1/y1 without a viewbox.
                            // Let's use a standard 100x100 coord system
                            return (
                                <motion.line
                                    key={i}
                                    x1={`${from.x}%`}
                                    y1={`${from.y}%`}
                                    x2={`${to.x}%`}
                                    y2={`${to.y}%`}
                                    stroke="url(#gradient)"
                                    strokeWidth="1"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.3 }}
                                    transition={{ duration: 1.5, delay: i * 0.1 }}
                                />
                            )
                        })}
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#06b6d4" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Nodes Layer */}
                    {nodes.map((node) => (
                        <motion.button
                            key={node.id}
                            onClick={() => setSelectedNode(node)}
                            onHoverStart={() => setHoveredNode(node.id)}
                            onHoverEnd={() => setHoveredNode(null)}
                            className={cn(
                                "absolute w-16 h-16 -ml-8 -mt-8 rounded-full border-2 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 z-20 group",
                                node.status === 'optimal' ? "bg-cyan-900/80 border-cyan-500 text-cyan-400" :
                                    node.status === 'warning' ? "bg-amber-900/80 border-amber-500 text-amber-400" :
                                        "bg-red-900/80 border-red-500 text-red-400",
                                selectedNode?.id === node.id ? "scale-125 ring-4 ring-white/20" : "hover:scale-110"
                            )}
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.5 }}
                        >
                            <node.icon className="w-6 h-6" />

                            {/* Pulse Effect */}
                            <div className={cn(
                                "absolute inset-0 rounded-full animate-ping opacity-20",
                                node.status === 'optimal' ? "bg-cyan-500" :
                                    node.status === 'warning' ? "bg-amber-500" : "bg-red-500"
                            )} />

                            {/* Hover Label */}
                            <div className={cn(
                                "absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 backdrop-blur px-3 py-1 rounded-md border border-white/10 text-xs font-bold transition-opacity pointer-events-none",
                                hoveredNode === node.id || selectedNode?.id === node.id ? "opacity-100" : "opacity-0"
                            )}>
                                {node.label}: <span className={cn(
                                    node.status === 'optimal' ? "text-cyan-400" :
                                        node.status === 'warning' ? "text-amber-400" : "text-red-400"
                                )}>{node.value}</span>
                            </div>
                        </motion.button>
                    ))}

                    {/* Node Details Panel */}
                    <AnimatePresence>
                        {selectedNode && (
                            <motion.div
                                initial={{ x: "100%", opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: "100%", opacity: 0 }}
                                className="absolute right-0 top-0 bottom-0 w-full md:w-96 bg-black/90 backdrop-blur-xl border-l border-white/10 p-8 shadow-2xl z-30 flex flex-col"
                            >
                                <button
                                    onClick={() => setSelectedNode(null)}
                                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>

                                <div className="mt-8">
                                    <div className={cn(
                                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border",
                                        selectedNode.status === 'optimal' ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-500" :
                                            selectedNode.status === 'warning' ? "bg-amber-500/10 border-amber-500/30 text-amber-500" :
                                                "bg-red-500/10 border-red-500/30 text-red-500"
                                    )}>
                                        <selectedNode.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-1">{selectedNode.label}</h3>
                                    <div className="text-sm font-mono text-slate-500 mb-6 uppercase tracking-widest">
                                        Data Node: {selectedNode.id.toUpperCase()}
                                    </div>

                                    <div className="prose prose-invert">
                                        <p className="text-lg leading-relaxed text-slate-300">
                                            {selectedNode.details}
                                        </p>
                                    </div>

                                    <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
                                        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-yellow-500" /> Neural Optimization
                                        </h4>
                                        <p className="text-xs text-slate-400">
                                            Calculating impact...
                                        </p>
                                        <div className="h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "70%" }}
                                                className="h-full bg-cyan-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
