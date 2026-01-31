/**
 * DIRECT LESSON CONTENT MAPPING
 * Maps lesson IDs to their actual content
 */

import { COMPLETE_100_LESSONS } from '../data/complete-100-lessons';

// Create a map of lesson ID to content
export const LESSON_CONTENT_MAP = new Map<string, string>();

COMPLETE_100_LESSONS.forEach((lesson) => {
    const markdown = `# ${lesson.lessonTitle}

## Teaching Objective
${lesson.teachingObjective}

## Introduction
${lesson.structurePoints.introContext}

## Core Instruction

${lesson.structurePoints.coreInstruction.map((point: string, i: number) => `${i + 1}. ${point}`).join('\n\n')}

## Summary
${lesson.structurePoints.reinforcementSummary}

---

**Professor**: ${lesson.professorPersonaId}  
**Duration**: ${lesson.minutes} minutes  
**Level**: ${lesson.courseLevel}  
`;

    LESSON_CONTENT_MAP.set(lesson.lessonId, markdown);
});

/**
 * Get lesson content by ID
 */
export function getLessonContent(lessonId: string): string | undefined {
    return LESSON_CONTENT_MAP.get(lessonId);
}

/**
 * Get lesson content by title (fallback)
 */
export function getLessonContentByTitle(title: string): string | undefined {
    const lesson = COMPLETE_100_LESSONS.find(l => l.lessonTitle === title);
    if (lesson) {
        return getLessonContent(lesson.lessonId);
    }
    return undefined;
}
