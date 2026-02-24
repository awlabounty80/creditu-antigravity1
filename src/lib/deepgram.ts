import { createClient } from '@deepgram/sdk';

const deepgramApiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;

if (!deepgramApiKey) {
    console.warn('Missing VITE_DEEPGRAM_API_KEY in environment variables. Voice features may not work.');
}

export const deepgram = createClient(deepgramApiKey || '');

export const transcribeAudio = async (audioBlob: Blob) => {
    if (!deepgramApiKey) throw new Error('Deepgram API Key is missing');

    const { result, error } = await (deepgram.listen.prerecorded as any).transcribeFile(
        audioBlob as any,
        {
            model: 'nova-2',
            smart_format: true,
            mimetype: 'audio/webm',
        }
    );

    if (error) throw error;
    return result;
};

export const synthesizeSpeech = async (text: string) => {
    // Placeholder for Deepgram Aura TTS integration
    // Currently Deepgram Node SDK supports this, but for browser usage we might fetch directly or use a proxy if needed
    // This is a placeholder for future expansion
};
