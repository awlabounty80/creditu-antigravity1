
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

export type GuidanceMode = 'FULL' | 'LIGHT' | 'SILENT';

interface ProfessorPrefs {
    user_id: string;
    creditlab_orientation_completed: boolean;
    guidance_mode: GuidanceMode;
    voice_enabled: boolean;
    captions_enabled: boolean;
}

interface ProfessorTrigger {
    id: string;
    text: string;
    audioUrl?: string;
    duration?: number;
    emotion?: 'neutral' | 'happy' | 'warning' | 'thinking';
}

interface ProfessorContextType {
    prefs: ProfessorPrefs;
    setGuidanceMode: (mode: GuidanceMode) => Promise<void>;
    markOrientationCompleted: () => Promise<void>;
    toggleVoice: () => Promise<void>;
    toggleCaptions: () => Promise<void>;
    triggerGuidance: (trigger: ProfessorTrigger) => void;
    activeTrigger: ProfessorTrigger | null;
    dismissTrigger: () => void;
    resetOrientation: () => Promise<void>;
    loading: boolean;
}

const ProfessorContext = createContext<ProfessorContextType | undefined>(undefined);

export const ProfessorProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [prefs, setPrefs] = useState<ProfessorPrefs>({
        user_id: '',
        creditlab_orientation_completed: false,
        guidance_mode: 'FULL',
        voice_enabled: true,
        captions_enabled: true
    });
    const [activeTrigger, setActiveTrigger] = useState<ProfessorTrigger | null>(null);
    const [loading, setLoading] = useState(true);

    // Load Prefs from DB
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        loadPrefs();
    }, [user]);

    const loadPrefs = async () => {
        try {
            const { data, error } = await supabase
                .from('professor_prefs')
                .select('*')
                .eq('user_id', user!.id)
                .single();

            if (data) {
                setPrefs(data);
            } else if (error && error.code === 'PGRST116') {
                // No row found, create default
                const defaultPrefs = {
                    user_id: user!.id,
                    creditlab_orientation_completed: false,
                    guidance_mode: 'FULL' as GuidanceMode,
                    voice_enabled: true,
                    captions_enabled: true
                };
                const { data: newData } = await supabase
                    .from('professor_prefs')
                    .insert(defaultPrefs)
                    .select()
                    .single();
                if (newData) setPrefs(newData);
            }
        } catch (err) {
            console.error("Error loading professor prefs:", err);
        } finally {
            setLoading(false);
        }
    };

    const updatePref = async (updates: Partial<ProfessorPrefs>) => {
        if (!user) {
            console.error("updatePref: No user found!");
            throw new Error("User not authenticated.");
        }

        // Optimistic UI
        const newPrefs = { ...prefs, ...updates };
        setPrefs(newPrefs);

        const { error } = await supabase
            .from('professor_prefs')
            .update(updates)
            .eq('user_id', user.id);

        if (error) {
            console.error("Supabase Update Error:", error);
            // Revert on error
            setPrefs(prefs);
            throw error;
        }
    };

    const setGuidanceMode = (mode: GuidanceMode) => updatePref({ guidance_mode: mode });

    const markOrientationCompleted = async () => {
        try {
            await updatePref({ creditlab_orientation_completed: true, guidance_mode: 'FULL' });
        } catch (e) {
            console.error("Failed to mark orientation complete:", e);
            throw e; // Propagate to Modal
        }
    };
    const toggleVoice = () => updatePref({ voice_enabled: !prefs.voice_enabled });
    const toggleCaptions = () => updatePref({ captions_enabled: !prefs.captions_enabled });

    const triggerGuidance = (trigger: ProfessorTrigger) => {
        if (prefs.guidance_mode === 'SILENT') return;
        // Logic for Light mode etc can go here
        setActiveTrigger(trigger);
        if (trigger.duration) {
            setTimeout(() => setActiveTrigger(null), trigger.duration);
        }
    };

    const dismissTrigger = () => setActiveTrigger(null);

    // Debug / Admin
    const resetOrientation = () => updatePref({ creditlab_orientation_completed: false });

    return (
        <ProfessorContext.Provider value={{
            prefs,
            setGuidanceMode,
            markOrientationCompleted,
            resetOrientation,
            toggleVoice,
            toggleCaptions,
            triggerGuidance,
            activeTrigger,
            dismissTrigger,
            loading
        }}>
            {children}
        </ProfessorContext.Provider>
    );
};

export const useProfessor = () => {
    const context = useContext(ProfessorContext);
    if (!context) throw new Error("useProfessor must be used within ProfessorProvider");
    return context;
};
