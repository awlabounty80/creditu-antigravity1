import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    CheckCircle,
    XCircle,
    Trophy,
    RotateCcw,
    ArrowRight,
    Scale,
    Activity,
    Clock,
    Zap,
    BookOpen,
    TrendingDown,
    Award,
    Shuffle
} from 'lucide-react';
import { QUIZZES, calculateQuizScore, Quiz, QuizQuestion } from '@/data/quizzes';
import confetti from 'canvas-confetti';

// Metadata for enhanced UI - Dark Mode Optimized w/ High Contrast
const QUIZ_META: Record<string, { icon: any, color: string, gradient: string, xp: number, time: string }> = {
    'QUIZ-001': {
        icon: Scale,
        color: 'text-emerald-400',
        gradient: 'from-emerald-950/40 to-slate-950 hover:from-emerald-900/40 hover:to-slate-900',
        xp: 150,
        time: '5m'
    },
    'QUIZ-002': {
        icon: Activity,
        color: 'text-blue-400',
        gradient: 'from-blue-950/40 to-slate-950 hover:from-blue-900/40 hover:to-slate-900',
        xp: 100,
        time: '3m'
    },
    'QUIZ-003': {
        icon: TrendingDown,
        color: 'text-rose-400',
        gradient: 'from-rose-950/40 to-slate-950 hover:from-rose-900/40 hover:to-slate-900',
        xp: 200,
        time: '4m'
    },
    'DEFAULT': {
        icon: BookOpen,
        color: 'text-indigo-400',
        gradient: 'from-indigo-950/40 to-slate-950 hover:from-indigo-900/40 hover:to-slate-900',
        xp: 50,
        time: '5m'
    }
};

interface QuizHistory {
    [quizId: string]: {
        score: number;
        passed: boolean;
        date: string;
    }
}

export default function InteractiveQuiz() {
    // State
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    // Persistence
    const [history, setHistory] = useState<QuizHistory>(() => {
        const saved = localStorage.getItem('quiz_history');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('quiz_history', JSON.stringify(history));
    }, [history]);

    const getMeta = (id: string) => QUIZ_META[id] || QUIZ_META['DEFAULT'];

    // Helper: Shuffle Options but track correct answer
    const startQuiz = (quizId: string) => {
        const originalQuiz = QUIZZES[quizId];

        // Randomize Options Logic
        const randomizedQuestions = originalQuiz.questions.map(q => {
            // Create array of objects to track original index
            const optionsWithIndex = q.options.map((opt, i) => ({ opt, originalIndex: i }));

            // Shuffle
            for (let i = optionsWithIndex.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
            }

            // Find new correct answer index
            const newCorrectIndex = optionsWithIndex.findIndex(o => o.originalIndex === q.correctAnswer);

            return {
                ...q,
                options: optionsWithIndex.map(o => o.opt),
                correctAnswer: newCorrectIndex
            };
        });

        setActiveQuiz({ ...originalQuiz, questions: randomizedQuestions });
        setCurrentQuestion(0);
        setUserAnswers([]);
        setShowResults(false);
        setSelectedAnswer(null);
        setShowExplanation(false);
    };

    const handleAnswerSelect = (answerIndex: number) => {
        setSelectedAnswer(answerIndex);
        setShowExplanation(false);
    };

    const handleSubmitAnswer = () => {
        if (selectedAnswer === null || !activeQuiz) return;
        const question = activeQuiz.questions[currentQuestion];

        setShowExplanation(true);
        const newAnswers = [...userAnswers, selectedAnswer];
        setUserAnswers(newAnswers);

        if (selectedAnswer === question.correctAnswer) {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }
    };

    const handleNextQuestion = () => {
        if (!activeQuiz) return;

        if (currentQuestion < activeQuiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        if (!activeQuiz) return;
        setShowResults(true);
        const result = calculateQuizScore(activeQuiz, userAnswers);

        const bestScore = history[activeQuiz.id]?.score || 0;
        if (result.score >= bestScore) {
            setHistory(prev => ({
                ...prev,
                [activeQuiz.id]: {
                    score: result.score,
                    passed: result.passed,
                    date: new Date().toISOString()
                }
            }));
        }

        if (result.passed) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
    };

    const exitQuiz = () => {
        setActiveQuiz(null);
        setCurrentQuestion(0);
        setUserAnswers([]);
        setShowResults(false);
    };

    const question = activeQuiz?.questions[currentQuestion];

    // ------------------------------------------------------------------
    // VIEW: SELECTION SCREEN
    // ------------------------------------------------------------------
    if (!activeQuiz) {
        return (
            <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12 font-sans selection:bg-indigo-500/30">
                <div className="max-w-7xl mx-auto space-y-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
                        <div>
                            <h1 className="text-4xl font-heading font-bold mb-3 flex items-center gap-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                <Award className="w-10 h-10 text-indigo-400" /> Interactive Quizzes
                            </h1>
                            <p className="text-slate-400 max-w-2xl text-lg">
                                Master financial literacy through source-verified challenges.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-center group">
                                <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider group-hover:text-indigo-400 transition-colors">Passed</div>
                                <div className="text-2xl font-bold text-white font-mono">
                                    {Object.values(history).filter(h => h.passed).length} <span className="text-slate-600 text-lg">/ {Object.keys(QUIZZES).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quiz Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Object.values(QUIZZES).map((q) => {
                            const meta = getMeta(q.id);
                            const Icon = meta.icon;
                            const record = history[q.id];

                            return (
                                <Card
                                    key={q.id}
                                    className={`relative border-white/5 bg-gradient-to-br ${meta.gradient} backdrop-blur-md hover:border-indigo-500/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden`}
                                    onClick={() => startQuiz(q.id)}
                                >
                                    {/* Status Badges */}
                                    <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                                        {record?.passed ? (
                                            <div className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-emerald-500/20 shadow-glow">
                                                <CheckCircle className="w-3 h-3" /> Mastered
                                            </div>
                                        ) : (
                                            <div className="bg-white/5 text-slate-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div> Not Started
                                            </div>
                                        )}
                                    </div>

                                    <CardContent className="p-8 flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className={`p-4 rounded-2xl bg-black/40 border border-white/5 ${meta.color} shadow-inner`}>
                                                <Icon className="w-8 h-8" />
                                            </div>
                                        </div>

                                        <div className="mb-4 flex-grow">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">{q.category}</span>
                                            <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight">
                                                {q.title}
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/5 mb-4">
                                            <div>
                                                <div className="text-[10px] text-slate-500 uppercase font-bold">XP Reward</div>
                                                <div className="text-sm font-bold text-amber-400 flex items-center gap-1">
                                                    <Zap className="w-3 h-3" /> {meta.xp}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-slate-500 uppercase font-bold">Est. Time</div>
                                                <div className="text-sm font-bold text-indigo-300 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {meta.time}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto">
                                            <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border-0 w-full group-hover:bg-indigo-600 transition-colors">
                                                <Shuffle className="w-3 h-3 mr-2 opacity-50" /> Start Quiz
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        {/* Placeholder for future expansion */}
                        <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-8 flex flex-col items-center justify-center text-center text-slate-500 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                            <BookOpen className="w-8 h-8 mb-3 opacity-50" />
                            <h3 className="font-bold text-slate-400">More Coming Soon</h3>
                            <p className="text-xs mt-1">Check back for new challenges</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ------------------------------------------------------------------
    // VIEW: RESULTS SCREEN
    // ------------------------------------------------------------------
    if (showResults && activeQuiz) {
        const result = calculateQuizScore(activeQuiz, userAnswers);

        return (
            <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12">
                <div className="max-w-2xl mx-auto">
                    <Card className={`backdrop-blur-xl ${result.passed ? 'bg-emerald-950/40 border-emerald-500/30' : 'bg-amber-950/40 border-amber-500/30'}`}>
                        <CardContent className="p-12 text-center">
                            <div className="mb-8 relative inline-block">
                                <div className={`absolute inset-0 blur-xl ${result.passed ? 'bg-emerald-500/30' : 'bg-amber-500/30'}`}></div>
                                {result.passed ? (
                                    <Trophy className="w-24 h-24 mx-auto text-emerald-400 relative z-10" />
                                ) : (
                                    <RotateCcw className="w-24 h-24 mx-auto text-amber-400 relative z-10" />
                                )}
                            </div>

                            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                {result.passed ? 'Quiz Mastered!' : 'Keep Learning'}
                            </h2>

                            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-md mx-auto">
                                {result.passed
                                    ? `Outstanding work! You've demonstrated mastery of ${activeQuiz.title}.`
                                    : `You scored ${result.score.toFixed(0)}%. You need ${activeQuiz.passingScore}% to pass. Review the material and try again.`
                                }
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                                    <div className="text-xs uppercase text-slate-500 font-bold">Final Score</div>
                                    <div className="text-3xl font-mono font-bold text-white">{result.score.toFixed(0)}%</div>
                                </div>
                                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                                    <div className="text-xs uppercase text-slate-500 font-bold">XP Earned</div>
                                    <div className="text-3xl font-mono font-bold text-amber-400">
                                        {result.passed ? getMeta(activeQuiz.id).xp : 10}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <Button onClick={() => startQuiz(activeQuiz.id)} variant="outline" className="border-white/10 hover:bg-white/5 text-white bg-transparent">
                                    <RotateCcw className="w-4 h-4 mr-2" /> Retake
                                </Button>
                                <Button onClick={exitQuiz} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                                    Quiz Menu
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // ------------------------------------------------------------------
    // VIEW: QUESTION SCREEN
    // ------------------------------------------------------------------
    if (!question) return null;

    const isCorrect = selectedAnswer === question.correctAnswer;
    const progress = ((currentQuestion + 1) / activeQuiz.questions.length) * 100;

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12 font-sans">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={exitQuiz} className="text-slate-400 hover:text-white">
                                <ArrowRight className="w-5 h-5 rotate-180" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-slate-200">{activeQuiz.title}</h1>
                                <p className="text-xs text-slate-500 font-mono">
                                    QUESTION {currentQuestion + 1} / {activeQuiz.questions.length}
                                </p>
                            </div>
                        </div>
                        <div className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {getMeta(activeQuiz.id).time} Est.
                        </div>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-8">
                        <div
                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="space-y-6 animate-in slide-in-from-bottom duration-500 fade-in">
                        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                            {question.question}
                        </h2>

                        <div className="grid gap-3">
                            {question.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => !showExplanation && handleAnswerSelect(idx)}
                                    disabled={showExplanation}
                                    className={`
                                        group relative w-full p-5 rounded-xl border text-left transition-all duration-200
                                        ${selectedAnswer === idx
                                            ? showExplanation
                                                ? idx === question.correctAnswer
                                                    ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                                                    : 'border-red-500 bg-red-500/10'
                                                : 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                                            : showExplanation && idx === question.correctAnswer
                                                ? 'border-emerald-500 bg-emerald-500/10'
                                                : 'border-white/10 bg-slate-900/50 hover:bg-slate-800 hover:border-white/20'
                                        }
                                        ${showExplanation ? 'cursor-default' : 'active:scale-[0.99]'}
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`
                                            w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors shrink-0
                                            ${selectedAnswer === idx
                                                ? showExplanation
                                                    ? idx === question.correctAnswer
                                                        ? 'border-emerald-500 bg-emerald-500 text-white'
                                                        : 'border-red-500 bg-red-500 text-white'
                                                    : 'border-indigo-500 bg-indigo-500 text-white'
                                                : 'border-white/20 text-slate-500 group-hover:border-white/40'
                                            }
                                        `}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className={`font-medium text-lg ${selectedAnswer === idx ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                            {option}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {showExplanation && (
                            <div className={`mt-6 p-6 rounded-2xl animate-in zoom-in-95 duration-300 ${isCorrect ? 'bg-emerald-950/40 border border-emerald-500/30' : 'bg-amber-950/40 border border-amber-500/30'}`}>
                                <div className="flex gap-4">
                                    <div className={`p-2 rounded-lg h-fit ${isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                        {isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className={`font-bold text-lg ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {isCorrect ? 'Correct Answer!' : 'Incorrect'}
                                        </h3>
                                        <p className="text-slate-300 leading-relaxed">{question.explanation}</p>
                                        <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 font-mono uppercase tracking-wider">
                                            <BookOpen className="w-3 h-3" />
                                            Source: {question.source}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-8 flex justify-end">
                            {!showExplanation ? (
                                <Button
                                    onClick={handleSubmitAnswer}
                                    disabled={selectedAnswer === null}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
                                >
                                    Submit Answer
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNextQuestion}
                                    className="bg-white text-black hover:bg-slate-200 px-8 py-6 text-lg rounded-xl shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                                >
                                    {currentQuestion < activeQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
