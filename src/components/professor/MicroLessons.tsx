import React from 'react';
import { useProfessor } from './ProfessorContext';
import { Play, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Lesson {
    id: string;
    title: string;
    duration: string;
    triggerText: string;
    icon?: 'play' | 'fileText';
}

const LESSONS: Lesson[] = [
    { id: 'l1', title: 'Why 45 Days?', duration: '45s', triggerText: "The 45-day cycle is crucial because credit bureaus legally have 30 days to investigate, plus 15 days for mail processing. Patience prevents premature re-disputing.", icon: 'play' },
    { id: 'l2', title: 'The "Validation" Method', duration: '60s', triggerText: "Validation is not just asking 'is this mine?'. It's asking 'can you prove this exists with a signed contract?'. It shifts the burden of proof to them.", icon: 'play' },
    { id: 'l3', title: 'Handling "Verified" Responses', duration: '50s', triggerText: "If they say 'Verified', don't panic. It often just means their computer matched your name. The next step is a 'Method of Verification' procedural request.", icon: 'fileText' }
];

export const MicroLessons = () => {
    const { triggerGuidance } = useProfessor();

    const playLesson = (lesson: Lesson) => {
        triggerGuidance({
            id: `lesson-${lesson.id}`,
            text: lesson.triggerText, // "Playing" the lesson via the professor
            emotion: 'happy',
            duration: 12000 // Longer duration for lessons
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {LESSONS.map((l, i) => (
                <motion.button
                    key={l.id}
                    onClick={() => playLesson(l)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-indigo-300 hover:shadow-md transition-all text-left"
                >
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        {l.icon === 'play' ? <Play className="h-4 w-4 ml-0.5" /> : <FileText className="h-4 w-4" />}
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-900 uppercase tracking-tight">{l.title}</div>
                        <div className="text-[10px] text-slate-500">{l.duration} • Audio Briefing</div>
                    </div>
                </motion.button>
            ))}
        </div>
    );
};
