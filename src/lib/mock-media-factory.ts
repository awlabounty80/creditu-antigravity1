import { IMediaFactory, MediaInput, MediaAsset } from './media-factory';

/**
 * MOCK MEDIA FACTORY
 * Simulates video generation for testing batch processing.
 * In production, this would connect to actual rendering engines.
 */
export class MockMediaFactory implements IMediaFactory {

    async generateAsset(input: MediaInput): Promise<MediaAsset> {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 100));

        // Validate cultural flag
        if (!input.culturalDirectiveFlag) {
            throw new Error("REJECTED: Cultural Directive Flag not set.");
        }

        // Calculate duration based on script length
        const estimatedDuration = Math.min(
            Math.max(180, input.scriptContent.length / 10),
            720
        );

        const asset: MediaAsset = {
            id: `asset-${input.lessonId}-${Date.now()}`,
            lessonIdRef: input.lessonId,
            format: 'LESSON_VIDEO',
            url: `/assets/generated/${input.lessonId}.mp4`,
            durationSeconds: Math.floor(estimatedDuration),
            thumbnailUrl: `/assets/thumbnails/${input.lessonId}.jpg`,
            metadata: {
                generatedAt: new Date().toISOString(),
                version: 'v1',
                engine: 'Credit-U-Media-Engine-v1',
                culturalCheckPassed: true
            }
        };

        console.log(`[MockFactory] Generated: ${asset.id} (${asset.durationSeconds}s)`);
        return asset;
    }

    validateAsset(asset: MediaAsset): boolean {
        return (
            asset.metadata.culturalCheckPassed === true &&
            asset.durationSeconds >= 180 &&
            asset.durationSeconds <= 720 &&
            asset.format === 'LESSON_VIDEO'
        );
    }

    validateInput(input: MediaInput): { valid: boolean; missingFields: string[] } {
        const missing: string[] = [];

        if (!input.lessonId) missing.push('lessonId');
        if (!input.teachingObjective) missing.push('teachingObjective');
        if (!input.scriptContent) missing.push('scriptContent');
        if (!input.culturalDirectiveFlag) missing.push('culturalDirectiveFlag');

        return {
            valid: missing.length === 0,
            missingFields: missing
        };
    }
}
