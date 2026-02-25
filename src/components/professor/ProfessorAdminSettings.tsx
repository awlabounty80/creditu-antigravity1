import React, { useState } from 'react';
import { useProfessor } from './ProfessorContext';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch'; // Assuming existing switch, simplified for now if missing
import { Input } from '../ui/input';

// Basic Switch fallback if not in UI kit yet
const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${active ? 'bg-indigo-600' : 'bg-slate-300'}`}
    >
        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
);

export const ProfessorAdminSettings = () => {
    const { prefs, toggleVoice, toggleCaptions } = useProfessor();
    const [name, setName] = useState('Professor Credit Lab');

    return (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Professor Settings (Admin)</h3>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-semibold">Enable Voice (Global)</div>
                        <div className="text-xs text-slate-500">Allow text-to-speech features</div>
                    </div>
                    <Toggle active={prefs.voice_enabled} onClick={toggleVoice} />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-semibold">Captions Required</div>
                        <div className="text-xs text-slate-500">Ensure text always displays</div>
                    </div>
                    <Toggle active={prefs.captions_enabled} onClick={toggleCaptions} />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Professor Name (Alias)</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dr. Leverage" />
                    <p className="text-xs text-indigo-600 mt-2 cursor-pointer hover:underline" onClick={() => setName("Dr. Leverage")}>
                        Use template: "Dr. Leverage"
                    </p>
                </div>

                <div className="pt-4 border-t">
                    <p className="text-xs text-slate-400">
                        Analytics: 94% Orientation Completion Rate. Most frequent topic: "Timing".
                    </p>
                </div>
            </div>
        </div>
    );
};
