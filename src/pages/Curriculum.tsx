
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Lock, ArrowRight, PlayCircle, BookOpen, CheckCircle, Clock, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { useProfile } from '@/hooks/useProfile'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { getAllClientCourses } from '@/lib/client-curriculum'

// Types
interface CourseProps {
    id: string
    title: string
    description: string
    slug: string
    progress: number
    totalModules: number
    completedModules: number
    isLocked?: boolean
    image?: string
    credits_value: number
    track?: string
}

export default function Curriculum() {
    const { user } = useProfile()
    const [courses, setCourses] = useState<CourseProps[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchCourses() {
            setLoading(true)
            setError(null)
            try {
                // 1. Fetch Published Courses
                const { data: coursesData, error: coursesError } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('is_published', true)
                    .order('created_at', { ascending: true })

                if (coursesError) throw coursesError

                // 2. Fetch Enrollments (if user logged in)
                const enrollmentsByKey: Record<string, number> = {}
                if (user) {
                    const { data: enrollments } = await supabase
                        .from('enrollments')
                        .select('course_id, progress_percent')
                        .eq('user_id', user.id)

                    if (enrollments) {
                        enrollments.forEach((e: any) => {
                            enrollmentsByKey[e.course_id] = e.progress_percent
                        })
                    }
                }

                // 3. Map Data
                let finalCourses: CourseProps[] = []

                if (coursesData && coursesData.length > 0) {
                    finalCourses = coursesData.map(c => ({
                        id: c.id,
                        title: c.title,
                        slug: c.slug,
                        description: c.description || "",
                        progress: enrollmentsByKey[c.id] || 0,
                        totalModules: 5, // Placeholder
                        completedModules: 0,
                        image: c.thumbnail_url || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80",
                        credits_value: c.credits_value || 0,
                        track: c.track || "Personal Credit Track"
                    }))
                } else {
                    // Fallback to "Upcoming/Mock" if DB is empty to show "DO MORE" value
                    // Or append them if we want to show future signals
                }

                // INJECT UPCOMING / EXPANDED CURRICULUM (User Request: "DO MORE" content)
                const EXPANDED_CONTENT = [
                    {
                        id: "freshman-orientation",
                        title: "Freshman Orientation: Personal Credit Foundations",
                        slug: "freshman-orientation",
                        description: "Dr. Leverage's mandatory 5-class certification. Remove fear, restore trust, and master the system.",
                        progress: 0,
                        totalModules: 5,
                        completedModules: 0,
                        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80",
                        credits_value: 500,
                        track: "Personal Credit",
                        isLocked: false
                    },
                    {
                        id: "travel-hacking-preview",
                        title: "Luxury Travel Hacking",

                        slug: "travel-hacking",
                        description: "Fly First Class for free. Master the art of point transfers, airline alliances, and status matching.",
                        progress: 0,
                        totalModules: 2,
                        completedModules: 0,
                        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2000",
                        credits_value: 150,
                        track: "Lifestyle Design",
                        isLocked: false, // Unlocked for DO MORE preview
                        isPreview: true
                    }
                ]

                // ADD CLIENT-SIDE COURSES (100 lessons)
                const clientCourses = getAllClientCourses();
                clientCourses.forEach(cc => {
                    finalCourses.push({
                        id: cc.id,
                        title: cc.title,
                        slug: cc.id,
                        description: cc.description,
                        progress: 0,
                        totalModules: cc.modules.length,
                        completedModules: 0,
                        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80",
                        credits_value: cc.credits_value,
                        track: cc.track,
                        isLocked: false
                    });
                });

                // Merge (avoid duplicates if seed ran)
                const existingSlugs = new Set(finalCourses.map(c => c.slug))
                EXPANDED_CONTENT.forEach(ex => {
                    if (!existingSlugs.has(ex.slug)) {
                        finalCourses.push(ex as any)
                    }
                })

                setCourses(finalCourses)
            } catch (err: any) {
                console.error("Fetch error:", err)
                setError(err.message || "Failed to load curriculum")
            } finally {
                setLoading(false)
            }
        }
        fetchCourses()
    }, [user])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020412] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    <p className="text-slate-500 font-mono text-sm tracking-widest animate-pulse">DECRYPTING CURRICULUM...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#020412] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-red-900/10 border border-red-500/20 p-6 rounded-2xl flex flex-col items-center text-center gap-4">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <h3 className="text-xl font-bold text-white">Connection Interrupted</h3>
                    <p className="text-slate-400 text-sm">{error}</p>
                    <Button onClick={() => window.location.reload()} variant="outline" className="mt-2 border-red-500/20 hover:bg-red-500/10 text-red-400">
                        Retry uplink
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-white mb-2">
                        ACADEMIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">CATALOG</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl text-lg font-light leading-relaxed">
                        Access classified financial intelligence. Completion of these modules unlocks higher tiers of funding authority.
                    </p>
                </div>

                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                        <Input
                            type="search"
                            placeholder="Search intelligence database..."
                            className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:bg-white/10 transition-all rounded-xl"
                        />
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {courses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <Lock className="w-16 h-16 mb-4 opacity-20" />
                    <h3 className="text-lg font-bold text-slate-400">No Courses Decoded</h3>
                    <p className="max-w-md text-center text-sm mt-2 opacity-60">The curriculum database appears empty. Please contact the administrator to seed the intelligence matrix.</p>
                </div>
            )}

            {/* Course Grid - Grouped by Tracks */}
            <div className="space-y-16">
                {[
                    "Personal Credit",
                    "Business Credit",
                    "Credit Rebuild",
                    "Lifestyle Design",
                    "Emotional Healing"
                ].map((trackName) => {
                    const trackCourses = courses.filter(c => c.track === trackName || (trackName === "Financial Literacy Foundations" && !c.track));
                    if (trackCourses.length === 0) return null;

                    return (
                        <div key={trackName} className="relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-8 w-1 bg-indigo-500 rounded-full" />
                                <h2 className="text-2xl font-bold text-white tracking-tight">{trackName}</h2>
                                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                {trackCourses.map((course, idx) => (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={cn(
                                            "group relative flex flex-col rounded-3xl overflow-hidden border transition-all duration-500",
                                            course.isLocked
                                                ? "bg-black/40 border-white/5 opacity-70 grayscale hover:grayscale-0 hover:opacity-100"
                                                : "bg-[#0A0F1E] border-white/10 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-900/20 hover:-translate-y-2"
                                        )}
                                    >
                                        {/* Image Header */}
                                        <div className="relative h-56 overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/20 to-transparent z-10" />
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />

                                            {/* Badges */}
                                            <div className="absolute top-4 left-4 z-20 flex gap-2">
                                                <div className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/10 shadow-lg",
                                                    course.isLocked ? "bg-black/60 text-slate-300" :
                                                        course.progress >= 100 ? "bg-emerald-500/90 text-white border-emerald-400/50" : "bg-indigo-600/90 text-white border-indigo-400/50"
                                                )}>
                                                    {course.isLocked ? "Clearance Required" : course.progress >= 100 ? "Certified" : "Active"}
                                                </div>
                                            </div>

                                            {/* Credits Value */}
                                            <div className="absolute top-4 right-4 z-20">
                                                <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 text-xs font-bold text-amber-400 shadow-lg">
                                                    {course.credits_value}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-8 pt-2 flex flex-col relative z-20">
                                            <div className="mb-4">
                                                <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-indigo-300 transition-colors">
                                                    {course.title}
                                                </h3>
                                                <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                                                    {course.description}
                                                </p>
                                            </div>

                                            {/* Stats */}
                                            <div className="flex items-center gap-6 mb-6 text-xs font-medium text-slate-500">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4 text-indigo-500" />
                                                    <span>{course.totalModules} Modules</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-indigo-500" />
                                                    <span>Self-Paced</span>
                                                </div>
                                            </div>

                                            {/* Progress & Action */}
                                            <div className="mt-auto space-y-4">
                                                {!course.isLocked && (
                                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-indigo-500 h-full rounded-full"
                                                            style={{ width: `${course.progress}%` }}
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between">
                                                    {course.isLocked ? (
                                                        <Button variant="ghost" disabled className="w-full border border-white/5 bg-white/5 text-slate-500 h-12 rounded-xl">
                                                            <Lock className="w-4 h-4 mr-2" /> Access Denied
                                                        </Button>
                                                    ) : (
                                                        <Link to={course.id === 'freshman-orientation' ? '/dashboard/class/freshman/1' : `/dashboard/course/${course.id}`} className="w-full">
                                                            <Button className={cn(
                                                                "w-full h-12 rounded-xl font-bold tracking-wide transition-all",
                                                                course.progress >= 100
                                                                    ? "bg-emerald-900/40 text-emerald-400 hover:bg-emerald-900/60 border border-emerald-500/20"
                                                                    : "bg-white text-black hover:bg-slate-200 hover:scale-[1.02] shadow-lg shadow-white/5"
                                                            )}>
                                                                {course.progress >= 100 ? (
                                                                    <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Review Material</span>
                                                                ) : course.progress > 0 ? (
                                                                    <span className="flex items-center">Resume <PlayCircle className="w-4 h-4 ml-2" /></span>
                                                                ) : (
                                                                    <span className="flex items-center">Start Mission <ArrowRight className="w-4 h-4 ml-2" /></span>
                                                                )}
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center mt-16 pb-12 opacity-50 hover:opacity-100 transition-opacity">
                <p className="text-xs text-slate-500 font-mono uppercase tracking-widest text-center">
                    New intelligence packs declassified weekly.<br />
                    Confidential Property of Credit U™.
                </p>
            </div>
        </div>
    )
}
