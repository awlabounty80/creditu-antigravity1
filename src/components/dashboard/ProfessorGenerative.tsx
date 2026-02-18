
import React from 'react';
import { Play } from 'lucide-react';

interface ProfessorGenerativeProps {
    transcript?: string;
    guidance?: any;
    professorImage?: string;
    onComplete?: () => void;
}

export function ProfessorGenerative({
    transcript,
    guidance,
    professorImage = '/assets/dr-leverage-transmission.png',
    onComplete
}: ProfessorGenerativeProps) {
    return (
        <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-black group shadow-3xl flex items-center justify-center text-white">
            {/* Safe Fallback Component - 3D Engine Disabled for Stability */}
            <div className="text-center p-6">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Play className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">Dr. Leverage</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    {transcript ? "Transmission Active" : "Neural Link Established"}
                </p>
            </div>
            {onComplete && (
                <button onClick={onComplete} className="absolute top-4 right-4 text-xs text-slate-500">Close</button>
            )}
        </div>
    );
}
