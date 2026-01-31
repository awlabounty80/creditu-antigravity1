/**
 * CREDIT U™ - CLIENT-SIDE CURRICULUM GENERATOR
 * 
 * Converts the 100 lesson scripts into playable courses with rotating video content
 */

import { COMPLETE_100_LESSONS } from '../data/complete-100-lessons';

// Available video files
const AVAILABLE_VIDEOS = [
    '/assets/dean-welcome.mp4',
    '/assets/hero-background.mp4',
    '/assets/logo-animated.mp4'
];

// Rotate through videos
function getVideoForLesson(lessonIndex: number): string {
    return AVAILABLE_VIDEOS[lessonIndex % AVAILABLE_VIDEOS.length];
}

export interface ClientLesson {
    id: string;
    title: string;
    content_markdown: string;
    video_url: string;
    duration_minutes: number;
    type: 'video';
    is_free_preview: boolean;
    order_index: number;
}

export interface ClientModule {
    id: string;
    title: string;
    description: string;
    order_index: number;
    lessons: ClientLesson[];
}

export interface ClientCourse {
    id: string;
    title: string;
    description: string;
    level: string;
    track: string;
    is_published: boolean;
    credits_value: number;
    modules: ClientModule[];
}

/**
 * Generate client-side courses from lesson data
 */
export function generateClientCourses(): ClientCourse[] {
    // Group lessons into modules of 10
    const modulesData: { [key: string]: ClientLesson[] } = {};

    COMPLETE_100_LESSONS.forEach((lesson, index) => {
        const moduleNumber = Math.floor(index / 10) + 1;
        const moduleKey = `module-${moduleNumber}`;

        if (!modulesData[moduleKey]) {
            modulesData[moduleKey] = [];
        }

        // Create markdown content from lesson structure
        const markdown = `# ${lesson.lessonTitle}

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
`;

        const clientLesson: ClientLesson = {
            id: lesson.lessonId,
            title: lesson.lessonTitle,
            content_markdown: markdown,
            video_url: getVideoForLesson(index),
            duration_minutes: lesson.minutes,
            type: 'video',
            is_free_preview: index < 5, // First 5 lessons are free preview
            order_index: index % 10
        };

        modulesData[moduleKey].push(clientLesson);
    });

    // Create modules
    const modules: ClientModule[] = Object.keys(modulesData)
        .sort()
        .map((key, index) => {
            const moduleNumber = index + 1;
            const startLesson = index * 10 + 1;
            const endLesson = Math.min(startLesson + 9, 100);

            return {
                id: `mod-${moduleNumber}`,
                title: `Module ${moduleNumber}: Lessons ${startLesson}-${endLesson}`,
                description: `${modulesData[key][0]?.title} through ${modulesData[key][modulesData[key].length - 1]?.title}`,
                order_index: index,
                lessons: modulesData[key]
            };
        });

    // Create the main course
    const course: ClientCourse = {
        id: 'freshman-foundations',
        title: 'Freshman: Foundations of Credit',
        description: 'Master the fundamentals of credit with 100 source-verified lessons from DR_LEVERAGE. Learn credit scoring, payment history, utilization, and more.',
        level: 'FRESHMAN',
        track: 'Foundations',
        is_published: true,
        credits_value: 10,
        modules
    };

    return [course];
}

/**
 * Get a specific course by ID
 */
export function getClientCourse(courseId: string): ClientCourse | null {
    const courses = generateClientCourses();
    return courses.find(c => c.id === courseId) || null;
}

/**
 * Get all client courses
 */
export function getAllClientCourses(): ClientCourse[] {
    return generateClientCourses();
}
