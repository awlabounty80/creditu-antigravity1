import { motion } from "framer-motion";

// Define Asset Interface locally or import if shared
export interface Asset {
    id: string;
    name: string;
    price: number;
    icon: any;
    iconColor: string;
    desc: string;
    glow: string;
    isLegendary?: boolean;
    action?: string;
}

interface AssetCardProps {
    asset: Asset;
    index: number;
    purchasing: string | null;
    handleAction: (asset: Asset) => void;
}

export const AssetCard = ({ asset, index, purchasing, handleAction }: AssetCardProps) => {
    return (
        <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`relative p-8 rounded-[2rem] border border-white/10 bg-[#0A0A0A] ${asset.glow}`}
        >
            {asset.isLegendary && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-lg shadow-yellow-500/50">
                    LEGENDARY ASSET
                </div>
            )}

            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                <asset.icon className={`h-7 w-7 ${asset.iconColor}`} />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{asset.name}</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-8 h-[40px]">
                {asset.desc}
            </p>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                <span className="text-2xl font-black text-white tracking-tight">
                    {asset.price === 0 ? "ACCESS" : `${asset.price} CU`}
                </span>
                <button
                    onClick={() => handleAction(asset)}
                    className="px-4 py-2 bg-white text-black rounded-xl font-bold text-sm hover:scale-105 transition-transform"
                    disabled={purchasing === asset.id}
                >
                    {purchasing === asset.id ? "..." : asset.price === 0 ? "Download" : "Acquire"}
                </button>
            </div>
        </motion.div>
    );
};
