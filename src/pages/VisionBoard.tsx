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
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex justify-between items-end">
                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-blue-900 tracking-tight">Vision Board</h1>
                    <p className="text-gray-500 text-lg">Manifest your financial future. Pin your targets.</p>
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2">
                            <Plus className="h-4 w-4" /> Add Goal
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add to Vision Board</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {VISION_PRESETS.map((preset) => (
                                <div
                                    key={preset.title}
                                    className="relative group cursor-pointer rounded-xl overflow-hidden aspect-video border-2 border-transparent hover:border-blue-500 active:scale-95 transition-all"
                                    onClick={() => addVision(preset.title, preset.url)}
                                >
                                    <img src={preset.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={preset.title} />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">{preset.title}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="relative mt-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or Custom</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Goal Title (e.g. Vacation to Bali)"
                                value={newVisionTitle}
                                onChange={(e) => setNewVisionTitle(e.target.value)}
                            />
                            <Button onClick={() => addVision(newVisionTitle, 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=800')}>
                                Add
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {visions.map((vision) => (
                    <Card key={vision.id} className={`overflow-hidden group transition-all duration-300 ${vision.is_completed ? 'opacity-75 grayscale' : 'hover:shadow-xl hover:-translate-y-1'}`}>
                        <div className="relative aspect-square">
                            <img src={vision.image_url || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" alt={vision.title} />
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white" onClick={() => deleteVision(vision.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                            {vision.is_completed && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" /> COMPLETED
                                    </div>
                                </div>
                            )}
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-bold text-blue-900 mb-2 truncate">{vision.title}</h3>
                            <Button
                                variant={vision.is_completed ? "outline" : "default"}
                                size="sm"
                                className={`w-full ${vision.is_completed ? '' : 'bg-blue-600 hover:bg-blue-700'}`}
                                onClick={() => toggleComplete(vision.id, vision.is_completed)}
                            >
                                {vision.is_completed ? "Mark Incomplete" : "Manifest This"}
                            </Button>
                        </CardContent>
                    </Card>
                ))}

                {visions.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                        <Target className="h-12 w-12 mb-4 opacity-20" />
                        <p className="font-medium">No visions pending.</p>
                        <p className="text-sm">Click "Add Goal" to start manifesting.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
