import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Shield, Target, QrCode } from 'lucide-react';

export function AgentIDCard() {
    const { profile } = useProfile();
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const card = e.currentTarget;
        const box = card.getBoundingClientRect();
        const x = e.clientX - box.left;
        const y = e.clientY - box.top;
        const centerX = box.width / 2;
        const centerY = box.height / 2;

        const rotateX = (centerY - y) / 10;
        const rotateY = (x - centerX) / 10;

        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    return (
        <div
            className="relative perspective-1000 w-full max-w-sm mx-auto"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="relative bg-[#0A0F1E] rounded-xl overflow-hidden shadow-2xl transition-transform duration-200 ease-out border border-white/10"
                style={{
                    transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* Holographic Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-white/0 to-white/5 pointer-events-none z-20" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none z-10" />

                {/* Scanning Laser */}
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-scan z-30 opacity-50" />
                <style>{`
                    @keyframes scan {
                        0% { top: 0%; opacity: 0; }
                        10% { opacity: 1; }
                        90% { opacity: 1; }
                        100% { top: 100%; opacity: 0; }
                    }
                    .animate-scan {
                        animation: scan 4s ease-in-out infinite;
                    }
                `}</style>

                {/* Header */}
                <div className="bg-indigo-900/20 p-4 border-b border-white/5 flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-indigo-400" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-300">AUTHORIZED PERSONNEL</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                        ID: {profile?.id?.slice(0, 8).toUpperCase() || 'UNKNOWN'}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 relative z-10" style={{ transform: 'translateZ(20px)' }}>
                    <div className="flex gap-4">
                        {/* Avatar */}
                        <div className="w-20 h-20 bg-black rounded-lg border border-indigo-500/30 overflow-hidden relative group">
                            <img
                                src={`https://api.dicebear.com/7.x/shapes/svg?seed=${profile?.id}`}
                                alt="Avatar"
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-indigo-500/10" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-2">
                            <div>
                                <h3 className="text-lg font-black text-white leading-none tracking-tight">
                                    {(profile?.first_name || 'STUDENT').toUpperCase()} {(profile?.last_name || '').toUpperCase()}
                                </h3>
                                <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mt-1">
                                    {profile?.academic_level || 'RECRUIT'}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                                <Target className="w-3 h-3" />
                                <span>CLEARANCE: LEVEL {profile?.academic_level === 'freshman' ? '1' : '2'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-6">
                        <div className="bg-white/5 p-2 rounded border border-white/5 text-center">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Credits</div>
                            <div className="text-lg font-mono text-emerald-400 font-bold">{(profile?.moo_points || 0).toLocaleString()}</div>
                        </div>
                        <div className="bg-white/5 p-2 rounded border border-white/5 text-center">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Rank</div>
                            <div className="text-lg font-mono text-amber-400 font-bold">#42</div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-black/40 p-3 border-t border-white/5 flex justify-between items-center">
                    <div className="text-[9px] text-slate-600 font-mono">
                        CREDIT U • SECURITY VERIFIED
                    </div>
                    <QrCode className="w-4 h-4 text-slate-700" />
                </div>
            </div>
        </div>
    );
}
