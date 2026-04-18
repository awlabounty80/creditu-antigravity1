import { createClient } from '@deepgram/sdk';

const deepgramApiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;

if (!deepgramApiKey) {
    console.warn('Missing VITE_DEEPGRAM_API_KEY in environment variables. Voice features may not work.');
}

// Initialize lazily to prevent top-level crash
let client: any = null;
const getDeepgramClient = () => {
    if (!deepgramApiKey) return null;
    if (!client) client = createClient(deepgramApiKey);
    return client;
};

export const deepgram = getDeepgramClient();

/**
 * Robust transcription helper with better defaults
 */
export const transcribeAudio = async (audioBlob: Blob) => {
    const dgClient = getDeepgramClient();
    if (!dgClient) throw new Error('Deepgram API Key is missing. Check VITE_DEEPGRAM_API_KEY.');

    try {
        const { result, error } = await (dgClient.listen.prerecorded as any).transcribeFile(
            audioBlob as any,
            {
                model: 'nova-2',
                smart_format: true,
                mimetype: 'audio/webm',
            }
        );

        if (error) throw error;
        return result;
    } catch (err: any) {
        console.error("Deepgram: Transcription error:", err);
        throw new Error(err.message || 'Transcription failed');
    }
};

/**
 * Synthesize speech and return an audio object that can be played
 */
export const synthesizeSpeech = async (text: string) => {
    if (!deepgramApiKey) throw new Error('Deepgram API Key is missing');

    try {
        const response = await fetch('https://api.deepgram.com/v1/speak?model=aura-asteria-en', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${deepgramApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`TTS failed: ${errorData.err_msg || response.statusText}`);
        }

        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);
    } catch (err: any) {
        console.error("Deepgram: Synthesis error:", err);
        throw err;
    }
};
