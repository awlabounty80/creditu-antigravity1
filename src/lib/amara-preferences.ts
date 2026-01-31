import { useState, useEffect } from "react";

/* 
  AMARA PREFERENCES
  User-controlled overrides for Agent behavior.
  These override automatic emotional adaptation.
*/

export type VoicePreference = "AUTO" | "ALWAYS_HELP_DESK" | "ALWAYS_COACH";

export interface AmaraPreferences {
    voiceMode: VoicePreference;
    enableSummonSound: boolean;
    reduceMotion: boolean;
}

const STORAGE_KEY = "amara_user_preferences";

const INITIAL_STATE: AmaraPreferences = {
    voiceMode: "AUTO",
    enableSummonSound: true,
    reduceMotion: false
};

export function useAmaraPreferences(userId?: string) {
    const [preferences, setPreferences] = useState<AmaraPreferences>(() => {
        if (typeof window === 'undefined') return INITIAL_STATE;
        const key = userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY;
        const saved = localStorage.getItem(key);
        if (!saved) return INITIAL_STATE;
        try {
            return { ...INITIAL_STATE, ...JSON.parse(saved) };
        } catch {
            return INITIAL_STATE;
        }
    });

    useEffect(() => {
        if (!userId) return;
        const key = `${STORAGE_KEY}:${userId}`;
        const saved = localStorage.getItem(key);
        if (saved) setPreferences({ ...INITIAL_STATE, ...JSON.parse(saved) });
        else setPreferences(INITIAL_STATE);
    }, [userId]);

    const updatePreference = (key: keyof AmaraPreferences, value: any) => {
        const newPrefs = { ...preferences, [key]: value };
        setPreferences(newPrefs);
        const storageKey = userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY;
        localStorage.setItem(storageKey, JSON.stringify(newPrefs));
    };

    return {
        preferences,
        updatePreference
    };
}
