import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Package } from "lucide-react";

// Mock toast until sonner is installed or we use a simple alert
const toast = {
    error: (msg: string) => alert(`Error: ${msg}`),
    success: (msg: string) => alert(`Success: ${msg}`)
};

export const ExchangeManager = () => {
    const [loading, setLoading] = useState(false);
    const [newItem, setNewItem] = useState({
        id: "",
        name: "",
        price: 0,
        tier: "common",
        icon: "Box", // Default to Box lucide icon name
        description: "",
        category: "General"
    });

    const addItem = async () => {
        if (!newItem.id || !newItem.name) {
            toast.error("ID and Name are required");
            return;
        }

        setLoading(true);
        const { error } = await supabase
            .from('moo_store_items')
            .insert([newItem]);

        if (error) {
            toast.error("Deployment failed: " + error.message);
        } else {
            toast.success(`${newItem.name} is now live in the Exchange!`);
            setNewItem({ id: "", name: "", price: 0, tier: "common", icon: "Box", description: "", category: "General" });
        }
        setLoading(false);
    };

    return (
        <div className="p-8 bg-[#050505] border border-white/10 rounded-[2rem] space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Package className="text-emerald-400 h-5 w-5" />
                <h2 className="text-xl font-bold italic tracking-tighter text-white">ASSET DEPLOYMENT</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    placeholder="Asset ID (e.g. quantum-ai)"
                    value={newItem.id}
                    onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                />
                <Input
                    placeholder="Asset Name (e.g. Quantum Ledger)"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                />
                <Input
                    type="number"
                    placeholder="Price in $CU"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseInt(e.target.value) })}
                    className="bg-white/5 border-white/10 text-white"
                />
                <select
                    className="bg-white/5 border-white/10 rounded-md p-2 text-sm text-gray-400"
                    value={newItem.tier}
                    onChange={(e) => setNewItem({ ...newItem, tier: e.target.value })}
                >
                    <option value="common">Common</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                </select>
                <Input
                    placeholder="Lucide Icon Name (e.g. Zap)"
                    value={newItem.icon}
                    onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                />
                <Input
                    placeholder="Category"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                />
            </div>

            <textarea
                placeholder="Asset Description..."
                className="w-full bg-white/5 border-white/10 rounded-md p-3 text-sm min-h-[100px] text-white"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />

            <Button
                onClick={addItem}
                disabled={loading}
                className="w-full bg-white text-black font-black hover:bg-white/90"
            >
                {loading ? "Deploying..." : "DEPLOY ASSET"}
            </Button>
        </div>
    );
};
