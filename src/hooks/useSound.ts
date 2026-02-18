import { useCallback } from 'react';
import { sfx } from '@/lib/sfx';

export function useSound() {
    const playHover = useCallback(() => {
        try {
            sfx.play('hover');
        } catch (e) {
            // Audio context might not be ready, ignore
        }
    }, []);

    const playClick = useCallback(() => {
        try {
            sfx.play('click');
        } catch (e) {
            // Audio context might not be ready, ignore
        }
    }, []);

    const playSuccess = useCallback(() => {
        try {
            sfx.play('success');
        } catch (e) {
            // Audio context might not be ready, ignore
        }
    }, []);

    const playError = useCallback(() => {
        try {
            sfx.play('error');
        } catch (e) {
            // Audio context might not be ready, ignore
        }
    }, []);

    return { playHover, playClick, playSuccess, playError };
}
