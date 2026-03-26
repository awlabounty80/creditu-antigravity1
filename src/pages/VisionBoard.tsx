import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, Trash2, CheckCircle, Target, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

interface Vision {
    id: string;
    title: string;
    image_url: string;
    is_completed: boolean;
}

const VISION_PRESETS = [
    { title: "800 Credit Score", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800" },
    { title: "Dream Home", url: "https://images.unsplash.com/photo-1600596542815-6ad4c12756ab?auto=format&fit=crop&q=80&w=800" },
    { title: "Debt Free", url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800" },
    { title: "New Car", url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800" }
];

export default function VisionBoard() {
    const [visions, setVisions] = useState<Vision[]>([]);
    const [newVisionTitle, setNewVisionTitle] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        loadVisions();
    }, []);

    async function loadVisions() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('user_visions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (data) setVisions(data);
    }

    async function addVision(title: string, url: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('user_visions').insert({
            user_id: user.id,
            title,
            image_url: url
        });

        if (!error) {
            loadVisions();
            setDialogOpen(false);
            setNewVisionTitle('');
        }
    }

    async function toggleComplete(id: string, currentStatus: boolean) {
        await supabase.from('user_visions').update({ is_completed: !currentStatus }).eq('id', id);
        loadVisions();
    }

    async function deleteVision(id: string) {
        await supabase.from('user_visions').delete().eq('id', id);
        loadVisions();
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 relative z-10">
            {/* Header / Hero Section */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/40 p-10 md:p-14 group shadow-2xl">
                {/* Background Visual */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/assets/cinematic/hbcu_homecoming.png" 
                        alt="Homecoming" 
                        className="w-full h-full object-cover opacity-15 group-hover:scale-105 transition-transform duration-[3000ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020412] via-[#020412]/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#020412] via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-10">
                    <div className="space-y-6 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-mono tracking-widest uppercase">
                                Manifestation Lab
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-heading font-black tracking-tight bg-gradient-to-r from-white via-white to-blue-400 bg-clip-text text-transparent italic">
                            Vision Board
                        </h1>
                        <p className="text-slate-300 text-xl max-w-2xl font-light leading-relaxed">
                            Institution-grade goal visualization. 
                            <span className="block text-slate-500 text-lg mt-2 italic">Define the life that Credit University infrastructure will build for you.</span>
                        </p>
                    </div>

                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-14 px-8 rounded-2xl shadow-lg shadow-blue-500/20 gap-3 border-none group">
                                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" /> 
                                Add to My Future
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-slate-950 border-white/10 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black italic">Anchor Your Vision</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                {VISION_PRESETS.map((preset) => (
                                    <div
                                        key={preset.title}
                                        className="relative group cursor-pointer rounded-2xl overflow-hidden aspect-video border-2 border-transparent hover:border-blue-500 active:scale-95 transition-all shadow-xl"
                                        onClick={() => addVision(preset.title, preset.url)}
                                    >
                                        <img src={preset.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={preset.title} />
                                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-[1px] group-hover:bg-slate-900/20 transition-all">
                                            <span className="text-white font-black text-lg tracking-tight italic">{preset.title}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="relative mt-8 mb-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/5" />
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">
                                    <span className="bg-slate-950 px-4">Or Custom Command</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <Input
                                    placeholder="Enter your specific goal..."
                                    value={newVisionTitle}
                                    onChange={(e) => setNewVisionTitle(e.target.value)}
                                    className="bg-slate-900/50 border-white/10 h-12 rounded-xl focus:ring-blue-500/50"
                                />
                                <Button onClick={() => addVision(newVisionTitle, 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=800')} className="bg-blue-600 hover:bg-blue-700 text-white font-black h-12 rounded-xl">
                                    Activate Manifestation
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Vision Grid */}
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
                {visions.map((vision) => (
                    <Card key={vision.id} className={`overflow-hidden group transition-all duration-500 bg-slate-900/40 border-white/5 shadow-xl ${vision.is_completed ? 'opacity-60 grayscale scale-95' : 'hover:shadow-blue-500/20 hover:border-blue-500/40 hover:-translate-y-2'}`}>
                        <div className="relative aspect-square overflow-hidden">
                            <img src={vision.image_url || 'https://via.placeholder.com/400'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={vision.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <Button size="icon" variant="destructive" className="h-9 w-9 bg-red-500/80 hover:bg-red-500 border border-red-500/50" onClick={() => deleteVision(vision.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            {vision.is_completed && (
                                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center">
                                    <div className="bg-emerald-500/90 text-white px-5 py-2 rounded-full text-xs font-black tracking-widest flex items-center gap-2 shadow-lg border border-emerald-400">
                                        <CheckCircle className="h-4 w-4" /> COMPLETED
                                    </div>
                                </div>
                            )}
                        </div>
                        <CardContent className="p-6">
                            <h3 className="font-heading font-bold text-white text-lg mb-4 truncate italic">{vision.title}</h3>
                            <Button
                                variant={vision.is_completed ? "outline" : "default"}
                                className={`w-full font-bold tracking-tight h-11 transition-all ${vision.is_completed ? 'border-white/10 text-slate-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20'}`}
                                onClick={() => toggleComplete(vision.id, vision.is_completed)}
                            >
                                {vision.is_completed ? "Mark Incomplete" : "Manifest This"}
                            </Button>
                        </CardContent>
                    </Card>
                ))}

                {visions.length === 0 && (
                    <div className="col-span-full py-32 text-center border-2 border-dashed border-white/10 rounded-[2rem] bg-slate-900/20 flex flex-col items-center justify-center text-slate-500 group hover:border-blue-500/30 transition-colors">
                        <div className="w-24 h-24 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform">
                            <Target className="h-12 w-12 opacity-40 text-blue-400" />
                        </div>
                        <p className="font-black text-white text-2xl mb-2 tracking-tight italic">The Board is Empty</p>
                        <p className="text-slate-400 max-w-sm font-light leading-relaxed">
                            Your financial manifestations are waiting. Click "Add Goal" to anchor your vision to the Credit University engine.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
