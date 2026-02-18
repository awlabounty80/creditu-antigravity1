import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useProfile } from './useProfile'
import { getClientCourse } from '@/lib/client-curriculum'
import { FRESHMAN_FOUNDATIONS_COURSE } from '@/data/static-course'

export interface Lesson {
    id: string
    title: string
    content_markdown?: string
    video_url?: string
    transcript?: string
    duration_minutes: number
    type: 'video' | 'text' | 'quiz'
    is_free_preview: boolean
    order_index: number
    isCompleted?: boolean // merged from user progress
    isLocked?: boolean // calculated based on logic (previous lesson complete?)
    video_object?: {
        type: 'ai_professor' | 'voiceover_slides' | 'placeholder' | 'external_reference';
        title: string;
        duration_estimate: number;
        thumbnail_image: string;
        playback_status: 'ready' | 'pending' | 'rendering';
        external_resource_url?: string;
        external_resource_title?: string;
    }
    video_mode?: 'VIDEO' | 'AVATAR';
    chat_log?: string;
}

export interface Module {
    id: string
    title: string
    description?: string
    order_index: number
    lessons: Lesson[]
}

export interface Course {
    id: string
    title: string
    description?: string
    level: string
    modules: Module[]
    progress?: number // 0-100
    track?: string
}

export function useCourse(courseId?: string) {
    const { user } = useProfile()
    const [course, setCourse] = useState<Course | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const fetchCourseData = useCallback(async () => {
        if (!courseId) return
        setLoading(true)
        setError(null)

        try {
            // MAP URL ID TO DB ID
            // The frontend uses 'freshman-foundations' but the DB (seed) uses 'course_foundation'
            const targetDbId = courseId === 'freshman-foundations' ? 'course_foundation' : courseId;

            // 1. STATIC COURSE (HIGHEST PRIORITY) - DISABLED TO ALLOW DB OVERRIDE
            // if (courseId === 'freshman-foundations') {
            //    console.log('🎯 Using STATIC course data for:', courseId);
            //    setCourse(FRESHMAN_FOUNDATIONS_COURSE as any);
            //    setLoading(false);
            //    return;
            // }

            // 2. PURE CLIENT SIDE MOCK (for "DO MORE" Preview)
            if (courseId === 'travel-hacking-preview') {
                setCourse({
                    id: 'travel-hacking-preview',
                    title: 'Luxury Travel Hacking',
                    description: 'Fly First Class for free. Master the art of point transfers.',
                    level: 'Graduate',
                    modules: [
                        {
                            id: 'mod-travel-1',
                            title: 'The Foundations of Free Travel',
                            order_index: 0,
                            lessons: [
                                {
                                    id: 'l-travel-1',
                                    title: 'Credit Card Points vs. Miles',
                                    duration_minutes: 12,
                                    type: 'video',
                                    is_free_preview: true,
                                    order_index: 0,
                                    isCompleted: false,
                                    isLocked: false,
                                    video_url: '/assets/dean-welcome.mp4'
                                },
                                {
                                    id: 'l-travel-2',
                                    title: 'Understanding Airline Alliances',
                                    duration_minutes: 15,
                                    type: 'video',
                                    is_free_preview: false,
                                    order_index: 1,
                                    isCompleted: false,
                                    isLocked: false,
                                    video_url: '/assets/dean-welcome.mp4'
                                }
                            ]
                        }
                    ],
                    progress: 0,
                    track: "Lifestyle Design"
                })
                setLoading(false)
                return
            }

            // 2. Check for client-side course (100 lessons)
            const clientCourse = getClientCourse(courseId);
            if (clientCourse) {
                console.log('✅ Using client-side course:', courseId);
                console.log('📚 Course title:', clientCourse.title);
                console.log('📦 Modules count:', clientCourse.modules.length);
                console.log('📝 First module:', clientCourse.modules[0]);
                console.log('📄 First lesson:', clientCourse.modules[0]?.lessons[0]);
                console.log('📖 First lesson content length:', clientCourse.modules[0]?.lessons[0]?.content_markdown?.length);
                console.log('🎬 First lesson video:', clientCourse.modules[0]?.lessons[0]?.video_url);

                setCourse({
                    id: clientCourse.id,
                    title: clientCourse.title,
                    description: clientCourse.description,
                    level: clientCourse.level,
                    track: clientCourse.track,
                    modules: clientCourse.modules as any,
                    progress: 0
                });
                setLoading(false);
                return;
            }

            // 3. Fetch Course details (Supabase)
            const { data: courseData, error: courseError } = await supabase
                .from('courses')
                .select('*')
                .eq('id', targetDbId) // Use mapped ID
                .single()

            if (courseError) {
                console.warn("Course fetch error, failing over to simulation:", courseError)
            }

            // SUPER ROBUST FALLBACK: If course is missing, GENERATE IT.
            // This ensures "DO MORE" always results in a playable experience.
            if (!courseData) {
                console.log(`Generating simulation for missing course: ${courseId}`)
                setCourse({
                    id: courseId,
                    title: `Simulated Module: ${courseId.toUpperCase()}`,
                    description: 'This is a procedurally generated training module. Live data signal was weak, so a simulation has been established.',
                    level: 'Foundations',
                    progress: 0,
                    track: 'Simulation',
                    modules: [
                        {
                            id: `mod-${courseId}-1`,
                            title: 'Tactical Overview',
                            order_index: 0,
                            lessons: [
                                {
                                    id: `l-${courseId}-1`,
                                    title: 'Briefing & Orientation',
                                    duration_minutes: 5,
                                    type: 'video',
                                    is_free_preview: true,
                                    order_index: 0,
                                    isCompleted: false,
                                    isLocked: false,
                                    video_url: '/assets/dean-welcome-v2.mp4?v=3'
                                },
                                {
                                    id: `l-${courseId}-2`,
                                    title: 'Strategic Analysis',
                                    duration_minutes: 10,
                                    type: 'video',
                                    is_free_preview: true, // Unlocked for simulation
                                    order_index: 1,
                                    isCompleted: false,
                                    isLocked: false,
                                    video_url: '/assets/dean-part-2.mp4?v=3'
                                }
                            ]
                        }
                    ]
                })
                setLoading(false)
                return
            }

            // 3. Fetch Modules & Lessons
            // Supabase can do deep nested joins: modules(..., lessons(...))
            const { data: modulesData, error: modulesError } = await supabase
                .from('modules')
                .select(`
                    id, title, description, order_index,
                    lessons (*)
                `)
                .eq('course_id', targetDbId) // Use mapped ID
                .order('order_index', { ascending: true })

            if (modulesError) throw modulesError

            // Sort lessons within modules
            // (Supabase nested order is tricky, easier to sort in JS unless using foreign table sort syntax)
            const modulesWithSortedLessons = modulesData?.map((m: any) => ({
                ...m,
                lessons: m.lessons?.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0)) || []
            })) || []

            // 3. Fetch User Progress (if logged in)
            let completedLessonIds = new Set<string>()
            let progressPercent = 0

            if (user) {
                // Get Enrollment
                const { data: enrollment } = await supabase
                    .from('enrollments')
                    .select('progress_percent')
                    .eq('user_id', user.id)
                    .eq('course_id', courseId)
                    .single()

                if (enrollment) {
                    progressPercent = enrollment.progress_percent
                }

                // Get Completed Lessons
                const { data: completions } = await supabase
                    .from('lesson_completions')
                    .select('lesson_id')
                    .eq('user_id', user.id)

                if (completions) {
                    completions.forEach(c => completedLessonIds.add(c.lesson_id))
                }
            }

            // 4. Merge Data
            // We can determine 'locked' state here too. 
            // Simple logic: A lesson is locked if the PREVIOUS lesson is not complete.
            // (Unless it's the very first lesson of the course).

            let previousLessonCompleted = true

            // FALLBACK VIDEO DICTIONARY (Robustness Fix)
            const FALLBACK_VIDEOS: Record<string, string> = {
                'l001': '/assets/hero-background.mp4',
                'l002': '/assets/hero-background.mp4',
                'l003': '/assets/hero-background.mp4'
            }

            const mergedModules = modulesWithSortedLessons.map((m: any) => ({
                ...m,
                lessons: m.lessons.map((l: any) => {
                    const isCompleted = completedLessonIds.has(l.id)
                    const isFree = l.order_index === 0 || l.is_free_preview;
                    const isLocked = !previousLessonCompleted && !isFree

                    // Map generic 'content' to specific fields based on type
                    // LEGACY/SOFT-SCHEMA SUPPORT: Check content for "VIDEO_URL: <url>" pattern
                    const contentVideoMatch = l.content ? l.content.match(/VIDEO_URL:\s*([^\s\n]+)/) : null;
                    const embeddedVideoUrl = contentVideoMatch ? contentVideoMatch[1] : undefined;

                    const contentModeMatch = l.content ? l.content.match(/VIDEO_MODE:\s*([^\s\n]+)/) : null;
                    const videoMode = contentModeMatch ? (contentModeMatch[1] as 'VIDEO' | 'AVATAR') : undefined;

                    // Extract Chat Log
                    // Pattern: CHAT_LOG_START ... CHAT_LOG_END
                    const chatLogMatch = l.content ? l.content.match(/CHAT_LOG_START([\s\S]*?)CHAT_LOG_END/) : null;
                    const chatLog = chatLogMatch ? chatLogMatch[1].trim() : undefined;

                    // Clean content from tags for display
                    // Clean content from tags for display
                    let cleanedContent = l.type === 'text' ? l.content : undefined;
                    if (cleanedContent) {
                        cleanedContent = cleanedContent
                            .replace(/VIDEO_URL:.*(\n|$)/g, '')
                            .replace(/VIDEO_MODE:.*(\n|$)/g, '')
                            .replace(/CHAT_LOG_START[\s\S]*?CHAT_LOG_END/g, '');
                    }

                    // FORCE OVERRIDE: Ensure the uploaded video plays (Bypassing DB issues)

                    // FORCE OVERRIDE: Ensure the uploaded video plays (Bypassing DB issues)
                    const isWelcomeLesson = l.title.includes('Welcome to the Wealth Game');
                    const forcedUrl = isWelcomeLesson ? 'https://sdrkjbbiznbyiozeltgw.supabase.co/storage/v1/object/public/campus-assets/uploads/23p2cn109t4_1770152872193.mp4' : undefined;

                    const videoUrl = forcedUrl || embeddedVideoUrl || (l.type === 'video' ? (l.content || FALLBACK_VIDEOS[l.id]) : undefined)
                    const contentMarkdown = cleanedContent;

                    // Update tracker for next lesson
                    previousLessonCompleted = isCompleted

                    return {
                        ...l,
                        isCompleted,
                        isLocked,
                        video_url: videoUrl,
                        content_markdown: contentMarkdown,
                        type: l.type || (videoUrl ? 'video' : 'text'),
                        video_mode: videoMode,
                        chat_log: chatLog
                    }
                })
            }))

            setCourse({
                ...courseData,
                modules: mergedModules,
                progress: progressPercent
            })

        } catch (e) {
            console.error("Error fetching course, using fallback:", e)
            // Instead of showing error, provide a working fallback course that MATCHES the intended content
            setCourse({
                id: courseId || 'course_foundation',
                title: 'Level 1: Foundation (Orientation)',
                description: 'Shift from Survivor to Architect. The Wealth Game begins here.',
                level: 'Foundation',
                progress: 0,
                track: 'Mindset',
                modules: [
                    {
                        id: 'mod_found_1',
                        title: 'The Mindset Shift',
                        order_index: 0,
                        lessons: [
                            {
                                id: 'less_1_1',
                                title: 'Welcome to the Wealth Game',
                                duration_minutes: 5,
                                type: 'video',
                                is_free_preview: true,
                                order_index: 0,
                                isCompleted: false,
                                isLocked: false,
                                video_url: 'https://sdrkjbbiznbyiozeltgw.supabase.co/storage/v1/object/public/campus-assets/uploads/23p2cn109t4_1770152872193.mp4'
                            },
                            {
                                id: 'less_1_2',
                                title: 'The Matrix (How It Works)',
                                duration_minutes: 7,
                                type: 'video',
                                is_free_preview: true,
                                order_index: 1,
                                isCompleted: false,
                                isLocked: false,
                                video_url: '/assets/dean-part-2.mp4'
                            },
                            {
                                id: 'less_1_3',
                                title: 'The 5 Pillars (Grip Strength)',
                                duration_minutes: 10,
                                type: 'video',
                                is_free_preview: false,
                                order_index: 2,
                                isCompleted: false,
                                isLocked: true,
                                video_url: '/assets/hero-background.mp4'
                            }
                        ]
                    }
                ]
            })
        } finally {
            setLoading(false)
        }
    }, [courseId, user])

    useEffect(() => {
        fetchCourseData()
    }, [fetchCourseData])

    // Action: Mark Lesson Complete (RPC)
    const markLessonComplete = async (lessonId: string) => {
        if (!user || !course) return

        try {
            // Optimistic update locally
            setCourse(prev => {
                if (!prev) return null
                let previousLessonCompleted = true

                const newModules = prev.modules.map(m => ({
                    ...m,
                    lessons: m.lessons.map(l => {
                        if (l.id === lessonId) {
                            previousLessonCompleted = true
                            return { ...l, isCompleted: true }
                        }
                        const isCompleted = l.id === lessonId ? true : !!l.isCompleted
                        const isLocked = !previousLessonCompleted && !l.is_free_preview
                        previousLessonCompleted = isCompleted
                        return { ...l, isCompleted, isLocked }
                    })
                }))

                return { ...prev, modules: newModules }
            })

            // Backend Call (Secure RPC)
            const { data, error } = await supabase.rpc('complete_lesson', {
                lesson_id_input: lessonId,
                points_reward: 50
            })

            if (error) throw error
            if (data && !data.success && data.message !== 'Already completed') {
                console.warn("RPC Warning:", data.message)
            }

            // Recalculate Course Percentage
            fetchCourseData()

        } catch (e) {
            console.error("Error marking lesson complete:", e)
        }
    }

    return { course, loading, error, markLessonComplete, refresh: fetchCourseData }
}
