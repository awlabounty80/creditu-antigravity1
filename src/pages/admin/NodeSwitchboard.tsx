import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { NODES } from '@/nodes/NodeRegistry';
import { Shield, Hammer, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function NodeSwitchboard() {
    const [flags, setFlags] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('creditu_feature_flags') || '{}');
        setFlags(saved);
    }, []);

    const toggleFlag = (flag: string) => {
        const newFlags = { ...flags, [flag]: !flags[flag] };
        setFlags(newFlags);
        localStorage.setItem('creditu_feature_flags', JSON.stringify(newFlags));
        toast.success(`${flag} status updated.`);
    };

    const enableAll = () => {
        const allFlags: Record<string, boolean> = {};
        NODES.forEach(n => allFlags[n.featureFlag] = true);
        allFlags['ALL_NODES'] = true;
        setFlags(allFlags);
        localStorage.setItem('creditu_feature_flags', JSON.stringify(allFlags));
        toast.success("Global Node Override: ACTIVE");
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase italic flex items-center gap-3">
                        <Hammer className="text-amber-500" /> Node Switchboard
                    </h1>
                    <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-2">
                        Infrastructure Override // Production Hardening Active
                    </p>
                </div>
                <Button onClick={enableAll} variant="outline" className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10">
                    MASTER OVERRIDE
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {NODES.map(node => (
                    <Card key={node.id} className="bg-black/40 border-white/10 backdrop-blur-md">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold text-white uppercase tracking-wider">{node.name}</CardTitle>
                                <Switch
                                    checked={flags[node.featureFlag] || false}
                                    onCheckedChange={() => toggleFlag(node.featureFlag)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-slate-400 mb-4">{node.purpose}</p>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
                                    {node.route}
                                </span>
                                <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                                    {node.featureFlag}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="text-amber-500 h-6 w-6 mt-1 flex-shrink-0" />
                <div className="space-y-2">
                    <h4 className="text-amber-500 font-black uppercase text-sm">Pre-Flight Warning</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Toggling nodes here affects your local session immediately. Production values require a separate configuration push to the Cloud Feature Service.
                    </p>
                </div>
            </div>
        </div>
    );
}
