import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import { QUIZZES, calculateQuizScore } from '@/data/quizzes';
import confetti from 'canvas-confetti';

export default function InteractiveQuiz() {
    const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const quiz = selectedQuiz ? QUIZZES[selectedQuiz] : null;
    const question = quiz?.questions[currentQuestion];

    const handleAnswerSelect = (answerIndex: number) => {
        setSelectedAnswer(answerIndex);
        setShowExplanation(false);
    };

    const handleSubmitAnswer = () => {
        if (selectedAnswer === null) return;

        setShowExplanation(true);
        const newAnswers = [...userAnswers, selectedAnswer];
        setUserAnswers(newAnswers);

        // Confetti if correct
        if (selectedAnswer === question?.correctAnswer) {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 }
            });
        }
    };

    const handleNextQuestion = () => {
        if (!quiz) return;

        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            setShowResults(true);
            const result = calculateQuizScore(quiz, userAnswers);
            if (result.passed) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setUserAnswers([]);
        setShowResults(false);
        setSelectedAnswer(null);
        setShowExplanation(false);
    };

    const selectNewQuiz = () => {
        setSelectedQuiz(null);
        resetQuiz();
    };

    // Quiz Selection Screen
    if (!selectedQuiz) {
        return (
            <div className="min-h-screen bg-[#020412] text-white p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-heading font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Interactive Quizzes
                        </h1>
                        <p className="text-slate-400">
                            Test your knowledge with source-verified questions and instant feedback.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {Object.values(QUIZZES).map((q) => (
                            <Card
                                key={q.id}
                                className="bg-white/5 border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer group"
                                onClick={() => setSelectedQuiz(q.id)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <span className="text-xs font-mono text-indigo-400">{q.id}</span>
                                            <h3 className="text-xl font-bold mt-1 group-hover:text-indigo-400 transition-colors">
                                                {q.title}
                                            </h3>
                                        </div>
                                        <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">
                                            {q.level}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-4">{q.category}</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">{q.questions.length} Questions</span>
                                        <span className="text-slate-500">Pass: {q.passingScore}%</span>
                                    </div>
                                    <Button className="w-full mt-4 group-hover:bg-indigo-600 transition-colors">
                                        Start Quiz
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Results Screen
    if (showResults && quiz) {
        const result = calculateQuizScore(quiz, userAnswers);

        return (
            <div className="min-h-screen bg-[#020412] text-white p-6">
                <div className="max-w-4xl mx-auto">
                    <Card className={`${result.passed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                        <CardContent className="p-8 text-center">
                            <div className="mb-6">
                                {result.passed ? (
                                    <Trophy className="w-20 h-20 mx-auto text-emerald-400" />
                                ) : (
                                    <RotateCcw className="w-20 h-20 mx-auto text-amber-400" />
                                )}
                            </div>

                            <h2 className="text-3xl font-bold mb-2">
                                {result.passed ? 'Congratulations!' : 'Keep Learning!'}
                            </h2>

                            <p className="text-xl mb-6">
                                You scored <span className="font-bold text-3xl">{result.score.toFixed(0)}%</span>
                            </p>

                            <p className="text-slate-400 mb-8">
                                {result.passed
                                    ? `You passed! You've demonstrated strong understanding of ${quiz.title.toLowerCase()}.`
                                    : `You need ${quiz.passingScore}% to pass. Review the material and try again.`
                                }
                            </p>

                            <div className="flex gap-4 justify-center">
                                <Button onClick={resetQuiz} variant="outline">
                                    Retake Quiz
                                </Button>
                                <Button onClick={selectNewQuiz}>
                                    Choose Another Quiz
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-6 bg-white/5 border-white/10">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold mb-4">Review Your Answers</h3>
                            <div className="space-y-4">
                                {result.feedback.map((fb, idx) => (
                                    <div key={idx} className="text-sm">
                                        {fb.startsWith('✓') ? (
                                            <div className="flex items-start gap-2 text-emerald-400">
                                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span>{fb}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-start gap-2 text-slate-300">
                                                <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" />
                                                <span>{fb}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Quiz Question Screen
    if (!question) return null;

    const isCorrect = selectedAnswer === question.correctAnswer;
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold">{quiz.title}</h1>
                            <p className="text-sm text-slate-400">
                                Question {currentQuestion + 1} of {quiz.questions.length}
                            </p>
                        </div>
                        <Button variant="outline" onClick={selectNewQuiz} size="sm">
                            Exit Quiz
                        </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <Card className="bg-white/5 border-white/10 mb-6">
                    <CardContent className="p-8">
                        <div className="flex items-start gap-3 mb-6">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${question.difficulty === 'EASY' ? 'bg-emerald-500/20 text-emerald-400' :
                                question.difficulty === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-red-500/20 text-red-400'
                                }`}>
                                {question.difficulty[0]}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold mb-2 text-white">{question.question}</h2>
                            </div>
                        </div>

                        {/* Answer Options */}
                        <div className="space-y-3">
                            {question.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => !showExplanation && handleAnswerSelect(idx)}
                                    disabled={showExplanation}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedAnswer === idx
                                        ? showExplanation
                                            ? idx === question.correctAnswer
                                                ? 'border-emerald-500 bg-emerald-500/20'
                                                : 'border-red-500 bg-red-500/20'
                                            : 'border-indigo-500 bg-indigo-500/20'
                                        : showExplanation && idx === question.correctAnswer
                                            ? 'border-emerald-500 bg-emerald-500/10'
                                            : 'border-white/10 bg-white/5 hover:border-indigo-500/50'
                                        } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswer === idx
                                            ? showExplanation
                                                ? idx === question.correctAnswer
                                                    ? 'border-emerald-500 bg-emerald-500'
                                                    : 'border-red-500 bg-red-500'
                                                : 'border-indigo-500 bg-indigo-500'
                                            : 'border-white/30'
                                            }`}>
                                            {showExplanation && idx === question.correctAnswer && (
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            )}
                                            {showExplanation && selectedAnswer === idx && idx !== question.correctAnswer && (
                                                <XCircle className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                        <span className="font-medium text-white">{option}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Explanation */}
                        {showExplanation && (
                            <div className={`mt-6 p-4 rounded-xl ${isCorrect ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-amber-500/10 border border-amber-500/30'
                                }`}>
                                <div className="flex items-start gap-3">
                                    {isCorrect ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        <p className={`font-bold mb-2 ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {isCorrect ? 'Correct!' : 'Not quite.'}
                                        </p>
                                        <p className="text-sm text-white mb-3">{question.explanation}</p>
                                        <p className="text-xs text-slate-400">Source: {question.source}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-6 flex gap-4">
                            {!showExplanation ? (
                                <Button
                                    onClick={handleSubmitAnswer}
                                    disabled={selectedAnswer === null}
                                    className="flex-1"
                                >
                                    Submit Answer
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNextQuestion}
                                    className="flex-1 gap-2"
                                >
                                    {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'View Results'}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
