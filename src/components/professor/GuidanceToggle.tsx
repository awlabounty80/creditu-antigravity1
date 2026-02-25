import React from 'react';
import { useProfessor } from './ProfessorContext';
import { Button } from '../ui/button';
import { MessageSquare, Bell, Moon } from 'lucide-react';

export const GuidanceToggle = () => {
    const { prefs, setGuidanceMode } = useProfessor();

    const cycleMode = () => {
        if (prefs.guidance_mode === 'FULL') setGuidanceMode('LIGHT');
        else if (prefs.guidance_mode === 'LIGHT') setGuidanceMode('SILENT');
        else setGuidanceMode('FULL');
    };

    const getIcon = () => {
        switch (prefs.guidance_mode) {
            case 'FULL': return <MessageSquare className="h-4 w-4 text-indigo-400" />;
            case 'LIGHT': return <Bell className="h-4 w-4 text-amber-400" />;
            case 'SILENT': return <Moon className="h-4 w-4 text-slate-400" />;
        }
    };

    const getLabel = () => {
        switch (prefs.guidance_mode) {
            case 'FULL': return 'Professor: Active';
            case 'LIGHT': return 'Professor: Light';
            case 'SILENT': return 'Professor: Silent';
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={cycleMode}
            className="flex items-center gap-2 text-xs font-medium border border-slate-700 bg-slate-800/50 hover:bg-slate-800"
        >
            {getIcon()}
            <span className="text-slate-300">{getLabel()}</span>
        </Button>
    );
};
