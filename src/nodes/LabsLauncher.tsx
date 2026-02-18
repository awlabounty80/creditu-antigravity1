import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { NODES } from '@/nodes/NodeRegistry';
import { Beaker, ArrowRight, Zap } from 'lucide-react';

export default function LabsLauncher() {
    const [activeNodes, setActiveNodes] = useState<any[]>([]);

    useEffect(() => {
        const flags = JSON.parse(localStorage.getItem('creditu_feature_flags') || '{}');
        const active = NODES.filter(node => flags[node.featureFlag] === true || flags['ALL_NODES'] === true);
        setActiveNodes(active);
    }, []);

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.3em] mb-4">
                    <Beaker className="w-3 h-3" /> Experimental Division
                </div>
                <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-tight">
                    THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">INNOVATION</span> LABS
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                    Welcome to the Credit U Skunkworks. These modules are the frontier of financial intelligence. Early access only.
                </p>
            </div>

            {activeNodes.length === 0 ? (
                <div className="bg-[#050914] border border-white/5 rounded-3xl p-20 text-center space-y-6">
                    <Zap className="w-12 h-12 text-slate-800 mx-auto" />
                    <p className="text-slate-600 font-mono text-sm uppercase tracking-widest">
                        Scanning for Active Protocol Nodes... [NONE FOUND]
                    </p>
                    <p className="text-xs text-slate-700 max-w-sm mx-auto">
                        Nodes must be initialized via the Admin Switchboard before they appear in the local environment.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activeNodes.map(node => (
                        <Card key={node.id} className="group bg-[#0A0F1E]/80 border-white/10 hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden backdrop-blur-xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader>
                                <div className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mb-2">Protocol: {node.id.replace('-', '_')}</div>
                                <CardTitle className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors uppercase italic">{node.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-sm text-slate-400 leading-relaxed h-12 overflow-hidden">{node.purpose}</p>
                                <Link to={node.route}>
                                    <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 group-hover:border-indigo-500/30 transition-all font-bold uppercase tracking-widest text-xs h-12 rounded-xl">
                                        Initialize Sequence <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
