
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Circle, ArrowRight, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CourseProps {
    id: string
    title: string
    description: string
    progress: number
    totalModules: number
    completedModules: number
    isLocked?: boolean
    image?: string
}

export function CourseCard({ course }: { course: CourseProps }) {
    const isCompleted = course.progress === 100
    const isStarted = course.progress > 0

    return (
        <Card className={cn(
            "group overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4",
            course.isLocked ? "bg-muted/50 border-l-muted-foreground/20 opacity-80" : "bg-card glass-card hover:-translate-y-1",
            isCompleted ? "border-l-green-500" : course.isLocked ? "border-l-muted" : "border-l-primary"
        )}>
            <div className="h-40 bg-muted relative overflow-hidden">
                {course.image && (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                        <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </>
                )}
                <div className="absolute bottom-4 left-4 z-20">
                    <span className={cn(
                        "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider backdrop-blur-md",
                        course.isLocked ? "bg-black/50 text-white" : "bg-white/90 text-primary"
                    )}>
                        {course.isLocked ? "Locked" : isCompleted ? "Completed" : "In Progress"}
                    </span>
                </div>
            </div>

            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl font-heading leading-tight">{course.title}</CardTitle>
                    {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                    ) : course.isLocked ? (
                        <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
                    ) : (
                        <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                    {course.description}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right mt-1">
                        {course.completedModules} / {course.totalModules} Modules
                    </p>
                </div>
            </CardContent>

            <CardFooter>
                {course.isLocked ? (
                    <Button variant="outline" className="w-full" disabled>
                        <Lock className="w-4 h-4 mr-2" /> Locked
                    </Button>
                ) : (
                    <Link to={`/course/${course.id}`} className="w-full">
                        <Button className="w-full group-hover:bg-primary/90 transition-colors">
                            {isStarted ? "Continue Learning" : "Start Course"}
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                )}
            </CardFooter>
        </Card>
    )
}
