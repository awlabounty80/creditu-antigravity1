import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LEARNING_LEVELS, LearningLevel, getCurriculumSummary } from '@/lib/learning-levels';
import { CheckCircle, Lock, ArrowRight, Target, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LearningPath() {
    const navigate = useNavigate();
    const [selectedLevel, setSelectedLevel] = useState<LearningLevel | null>(null);

    // Mock student progress - in production, this would come from Supabase
    const studentProgress = {
        currentLevel: 'FRESHMAN' as LearningLevel,
        completedLevels: ['ORIENTATION'] as LearningLevel[],
        lessonsCompleted: 115,
        quizzesPassed: 8
    };

    const summary = getCurriculumSummary();
    const levels = Object.values(LEARNING_LEVELS);

    const isLevelUnlocked = (level: LearningLevel) => {
        const levelDef = LEARNING_LEVELS[level];
        const currentLevelNum = LEARNING_LEVELS[studentProgress.currentLevel].levelNumber;
        return levelDef.levelNumber <= currentLevelNum;
    };

    const isLevelCompleted = (level: LearningLevel) => {
        return studentProgress.completedLevels.includes(level);
    };

    const getLevelStatus = (level: LearningLevel) => {
        if (isLevelCompleted(level)) return 'completed';
        if (level === studentProgress.currentLevel) return 'current';
        if (isLevelUnlocked(level)) return 'unlocked';
        return 'locked';
    };

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-heading font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Your Learning Path
                    </h1>
                    <p className="text-slate-400">
                        Progress through 6 levels of financial mastery. Advance by demonstrating knowledge, not just time spent.
                    </p>
                </div>

                {/* Progress Summary */}
                <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 mb-8">
                    <CardContent className="p-6">
                        <div className="grid md:grid-cols-4 gap-6">
                            <div>
                                <div className="text-3xl font-bold mb-1">{studentProgress.currentLevel}</div>
                                <div className="text-sm text-slate-400">Current Level</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold mb-1">{studentProgress.completedLevels.length}/6</div>
                                <div className="text-sm text-slate-400">Levels Completed</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold mb-1">{studentProgress.lessonsCompleted}</div>
                                <div className="text-sm text-slate-400">Lessons Completed</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold mb-1">{summary.totalLessons}</div>
                                <div className="text-sm text-slate-400">Total Lessons Available</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Learning Path Visualization */}
                <div className="space-y-6 mb-8">
                    {levels.map((level) => {
                        const status = getLevelStatus(level.id);
                        const isSelected = selectedLevel === level.id;

                        return (
                            <Card
                                key={level.id}
                                className={`transition-all cursor-pointer ${status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30' :
                                        status === 'current' ? 'bg-indigo-500/10 border-indigo-500/30' :
                                            status === 'unlocked' ? 'bg-white/5 border-white/10 hover:border-indigo-500/50' :
                                                'bg-white/5 border-white/10 opacity-60'
                                    } ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
                                onClick={() => status !== 'locked' && setSelectedLevel(isSelected ? null : level.id)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        {/* Level Number & Status Icon */}
                                        <div className="flex-shrink-0">
                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    status === 'current' ? 'bg-indigo-500/20 text-indigo-400' :
                                                        status === 'unlocked' ? 'bg-white/10 text-white' :
                                                            'bg-white/5 text-slate-600'
                                                }`}>
                                                {status === 'completed' ? <CheckCircle className="w-8 h-8" /> :
                                                    status === 'locked' ? <Lock className="w-8 h-8" /> :
                                                        level.levelNumber}
                                            </div>
                                        </div>

                                        {/* Level Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                                                        Level {level.levelNumber}
                                                    </div>
                                                    <h3 className="text-xl font-bold mb-1">{level.title}</h3>
                                                    <p className="text-sm text-slate-400">{level.goal}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-bold">{level.estimatedLessons}</div>
                                                    <div className="text-xs text-slate-500">Lessons</div>
                                                </div>
                                            </div>

                                            {/* Expanded Details */}
                                            {isSelected && (
                                                <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-indigo-400 mb-2">Focus</h4>
                                                        <p className="text-sm text-slate-300">{level.focus}</p>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-bold text-indigo-400 mb-2">Authorized Sources</h4>
                                                        <ul className="space-y-1">
                                                            {level.authorizedSources.map((source, idx) => (
                                                                <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                                                                    <div className="w-1 h-1 rounded-full bg-indigo-500 mt-2" />
                                                                    {source}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-bold text-indigo-400 mb-2">Activities</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {level.activities.map((activity, idx) => (
                                                                <span key={idx} className="text-xs bg-white/10 px-3 py-1 rounded-full text-slate-300">
                                                                    {activity}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-bold text-emerald-400 mb-2">Advancement Criteria</h4>
                                                        <ul className="space-y-1">
                                                            {level.advancementCriteria.map((criteria, idx) => (
                                                                <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                                                                    <Target className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                                                    {criteria}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {status !== 'locked' && (
                                                        <Button
                                                            onClick={() => navigate('/dashboard/curriculum')}
                                                            className="w-full gap-2"
                                                        >
                                                            {status === 'current' ? 'Continue Learning' : 'View Curriculum'}
                                                            <ArrowRight className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Educational Note */}
                <Card className="bg-indigo-500/10 border-indigo-500/20">
                    <CardContent className="p-6">
                        <div className="flex gap-4">
                            <Award className="w-6 h-6 text-indigo-400 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-white mb-2">Progressive Mastery System</h3>
                                <p className="text-sm text-indigo-200/80 mb-3">
                                    Credit U™ uses a progressive learning model where advancement is based on demonstrated mastery,
                                    not time spent. Each level builds on the previous, ensuring you have a solid foundation before
                                    moving to more advanced concepts.
                                </p>
                                <div className="grid md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <div className="font-bold text-white mb-1">Source-Verified</div>
                                        <div className="text-indigo-200/70">All content backed by FCRA, FDCPA, FICO, CFPB</div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-white mb-1">No Advice</div>
                                        <div className="text-indigo-200/70">Educational content only, no financial advice</div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-white mb-1">Mastery-Based</div>
                                        <div className="text-indigo-200/70">Advance by demonstrating knowledge</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
