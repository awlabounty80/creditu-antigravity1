import { IMediaFactory, MediaInput, MediaAsset, GOVERNANCE_PROTOCOLS } from './media-factory';

/**
 * CREDIT U™ BATCH GENERATION PROCESSOR
 * PROTOCOL: FX-Batch-v1
 * 
 * Handles high-volume lesson manufacturing.
 */

export interface BatchLessonDefinition {
    lessonId: string; // {{LEVEL}}-{{MODULE}}-{{LESSON_NUMBER}}
    courseLevel: 'FOUNDATION' | 'FRESHMAN' | 'SOPHOMORE' | 'JUNIOR' | 'SENIOR' | 'GRADUATE';
    moduleName: string;
    lessonTitle: string;
    teachingObjective: string;
    professorPersonaId: string; // {{PERSONA_ID}}
    minutes: number;
    // The "Structured Input" required by the prompt
    structurePoints: {
        introContext: string;
        coreInstruction: string[];
        reinforcementSummary: string;
    }
}

export class BatchProcessor {
    constructor(private factory: IMediaFactory) { }

    /**
     * Processes a list of lessons into institutional media assets.
     */
    async processBatch(batch: BatchLessonDefinition[]): Promise<{
        success: MediaAsset[],
        failures: { id: string, reason: string }[]
    }> {
        const results: MediaAsset[] = [];
        const failures: { id: string, reason: string }[] = [];

        console.log(`[BatchProcessor] Initializing batch of ${batch.length} lessons.`);
        console.log(`[BatchProcessor] TEAMS: ${GOVERNANCE_PROTOCOLS.CULTURAL_SAFETY}`);

        for (const lesson of batch) {
            try {
                // 1. Validation Phase
                if (!lesson.lessonId || !lesson.teachingObjective) {
                    throw new Error("Missing critical identifiers (ID or Objective).");
                }

                // 2. Cultural & Tone Check (Simulated)
                // In a real engine, this would analyze the script text.
                // Here we enforce the flag presence conceptually.
                const culturalCompliance = true;
                if (!culturalCompliance) {
                    throw new Error("Cultural Representation Check Failed.");
                }

                // 3. Construct Standardized Script
                // Enforcing: Intro -> Core -> Summary
                const scriptPayload = `
                    [OPENING - 45s]
                    CONTEXT: ${lesson.structurePoints.introContext}
                    OBJECTIVE: ${lesson.teachingObjective}

                    [CORE INSTRUCTION - ${lesson.minutes}m]
                    ${lesson.structurePoints.coreInstruction.map(p => `- ${p}`).join('\n')}

                    [SUMMARY - 60s]
                    TAKEAWAY: ${lesson.structurePoints.reinforcementSummary}
                `;

                // 4. Send to Media Factory
                const input: MediaInput = {
                    lessonId: lesson.lessonId,
                    level: lesson.courseLevel,
                    teachingObjective: lesson.teachingObjective,
                    scriptContent: scriptPayload,
                    professor: lesson.professorPersonaId as any, // Cast to tight type
                    culturalDirectiveFlag: true, // MANDATORY
                    visualDirectives: ['Institutional', 'Academic', 'Talking Head']
                };

                const asset = await this.factory.generateAsset(input);
                results.push(asset);

            } catch (error) {
                console.error(`[BatchProcessor] Failed lesson ${lesson.lessonId}:`, error);
                failures.push({
                    id: lesson.lessonId,
                    reason: error instanceof Error ? error.message : "Unknown error"
                });
            }
        }

        return { success: results, failures };
    }
}
