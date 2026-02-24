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
    if (!deepgramApiKey) throw new Error('Deepgram API Key is missing');

    const response = await fetch('https://api.deepgram.com/v1/speak?model=aura-asteria-en', {
        method: 'POST',
        headers: {
            'Authorization': `Token ${deepgramApiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(`TTS failed: ${error.err_msg || response.statusText}`);
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
};
