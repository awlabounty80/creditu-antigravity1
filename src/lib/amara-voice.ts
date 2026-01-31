/*
  PHASE 12: GLOBAL VOICE AUTHORITY
  Centralized voice controller for Credit U.
  Enforces "Guide Amara U." as the master voice and "Dr. Leverage" as the secondary.
  Prevents robotic fallbacks by favoring silence if quality voices are missing.
*/

type VoicePersona = 'AMARA' | 'LEVERAGE';
type VoiceEmotion = 'CALM' | 'ENERGIZE' | 'STEADY' | 'SOFT' | 'EFFICIENT' | 'HELP_DESK';

class AmaraVoiceEngine {
    private voices: SpeechSynthesisVoice[] = [];
    private initialized = false;

    constructor() {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            this.loadVoices();
            window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
    }

    private loadVoices() {
        this.voices = window.speechSynthesis.getVoices();
        this.initialized = true;
    }

    private getAmaraVoice(): SpeechSynthesisVoice | null {
        // Priority List for Amara (Warm, Human, Natural)
        const priorities = [
            'Google US English', // Often highest quality on Chrome
            'Samantha',          // Mac OS Natural
            'Microsoft Zira',    // Windows (Acceptable)
            'Female'
        ];

        for (const p of priorities) {
            const voice = this.voices.find(v => v.name.includes(p));
            if (voice) return voice;
        }
        return null;
    }

    private getLeverageVoice(): SpeechSynthesisVoice | null {
        // Priority List for Dr. Leverage (Professor, Male, Structured)
        const priorities = [
            'Google UK English Male',
            'Daniel',
            'Microsoft David',
            'Male'
        ];

        for (const p of priorities) {
            const voice = this.voices.find(v => v.name.includes(p));
            if (voice) return voice;
        }
        return null;
    }

    public speak(text: string, persona: VoicePersona, emotion: VoiceEmotion) {
        if (!this.initialized) this.loadVoices();

        let voice: SpeechSynthesisVoice | null = null;

        if (persona === 'LEVERAGE') {
            voice = this.getLeverageVoice();
        } else {
            voice = this.getAmaraVoice();
        }

        // CRITICAL RULE: Silence preferred over generic robotic speech fallback
        // If we can't find a designated voice profile, we do NOT speak.
        if (!voice) {
            console.warn(`[AmaraVoice] No suitable voice found for ${persona}. Maintaining silence.`);
            return;
        }

        this.stop();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.volume = 1.0;

        // Emotional Tuning
        if (persona === 'LEVERAGE') {
            utterance.pitch = 0.9; // Slightly deeper
            utterance.rate = 0.95; // Measured, professor-like
        } else {
            // Amara Dynamic Emotion
            switch (emotion) {
                case 'CALM':
                    utterance.rate = 0.95;
                    utterance.pitch = 1.0;
                    break;
                case 'ENERGIZE':
                    utterance.rate = 1.1;
                    utterance.pitch = 1.05;
                    break;
                case 'SOFT':
                    utterance.rate = 0.9;
                    utterance.pitch = 0.95;
                    utterance.volume = 0.8;
                    break;
                case 'HELP_DESK':
                    utterance.rate = 1.08; // Brisk but not rushed
                    utterance.pitch = 1.02; // Clear and bright
                    break;
                case 'EFFICIENT':
                    utterance.rate = 1.15;
                    break;
                case 'STEADY':
                default:
                    utterance.rate = 1.0;
                    utterance.pitch = 1.0;
                    break;
            }
        }

        window.speechSynthesis.speak(utterance);
    }

    public stop() {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }
}

export const amaraVoice = new AmaraVoiceEngine();
