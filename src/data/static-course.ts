/**
 * STATIC COURSE DATA - FRESHMAN FOUNDATIONS
 * Direct course object with all 100 lessons embedded
 */

import { COMPLETE_100_LESSONS } from './complete-100-lessons';

// Available videos (rotate through these)
const VIDEOS = [
    '/assets/dean-welcome.mp4',
    '/assets/hero-background.mp4',
    '/assets/logo-animated.mp4'
];

// Create the complete course with all lessons
export const FRESHMAN_FOUNDATIONS_COURSE = {
    id: 'freshman-foundations',
    title: 'Freshman: Foundations of Credit',
    description: 'Master the fundamentals of credit with 100 source-verified lessons from DR_LEVERAGE.',
    level: 'FRESHMAN',
    track: 'Foundations',
    progress: 0,
    modules: Array.from({ length: 10 }, (_, moduleIndex) => ({
        id: `mod-${moduleIndex + 1}`,
        title: `Module ${moduleIndex + 1}: Lessons ${moduleIndex * 10 + 1}-${(moduleIndex + 1) * 10}`,
        description: `Credit education module ${moduleIndex + 1}`,
        order_index: moduleIndex,
        lessons: COMPLETE_100_LESSONS.slice(moduleIndex * 10, (moduleIndex + 1) * 10).map((lesson, lessonIndex) => {
            const globalIndex = moduleIndex * 10 + lessonIndex;

            return {
                id: lesson.lessonId,
                title: lesson.lessonTitle,
                content_markdown: `# ${lesson.lessonTitle}

## Teaching Objective
${lesson.teachingObjective}

## Introduction
${lesson.structurePoints.introContext}

## Core Instruction

${lesson.structurePoints.coreInstruction.map((point, i) => `${i + 1}. ${point}`).join('\n\n')}

## Summary
${lesson.structurePoints.reinforcementSummary}

---

**Professor**: ${lesson.professorPersonaId}  
**Duration**: ${lesson.minutes} minutes  
**Level**: ${lesson.courseLevel}  
`,
                video_url: VIDEOS[globalIndex % VIDEOS.length],
                duration_minutes: lesson.minutes,
                type: 'video' as const,
                is_free_preview: globalIndex < 5,
                order_index: lessonIndex,
                isCompleted: false,
                isLocked: false
            };
        })
    }))
};
