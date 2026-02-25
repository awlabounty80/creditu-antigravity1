export const shareAsset = async (assetName: string) => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Credit U Exchange',
                text: `I just unlocked ${assetName} on Credit U!`,
                url: window.location.href,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        // Fallback for desktop/unsupported browsers
        navigator.clipboard.writeText(`I just unlocked ${assetName} on Credit U! ${window.location.href}`);
        alert('Link copied to clipboard!');
    }
};
