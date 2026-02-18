import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, GraduationCap, Target, Award, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const totalSteps = 5;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            // Complete onboarding
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        }
    };

    const handleSkip = () => {
        navigate('/dashboard');
    };

    const progress = (step / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-[#020412] text-white flex items-center justify-center p-6">
            <div className="max-w-4xl w-full">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Step {step} of {totalSteps}</span>
                        <button onClick={handleSkip} className="text-sm text-slate-500 hover:text-white transition-colors">
                            Skip Tour
                        </button>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Step 1: Welcome */}
                {step === 1 && (
                    <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                        <CardContent className="p-12 text-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
                                <GraduationCap className="w-10 h-10 text-white" />
                            </div>

                            <h1 className="text-4xl font-heading font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                Welcome to Credit U™
                            </h1>

                            <p className="text-xl text-slate-300 mb-6">
                                Your journey to financial mastery begins here
                            </p>

                            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                                Credit U™ is an institutional-grade financial education platform built with HBCU excellence.
                                We combine source-verified content, professional tools, and gamified learning to help you
                                master credit fundamentals.
                            </p>

                            <div className="grid md:grid-cols-3 gap-4 mb-8">
                                <div className="p-4 rounded-xl bg-white/5">
                                    <div className="text-3xl font-bold text-indigo-400 mb-1">515</div>
                                    <div className="text-sm text-slate-400">Total Lessons</div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5">
                                    <div className="text-3xl font-bold text-purple-400 mb-1">13</div>
                                    <div className="text-sm text-slate-400">Professional Tools</div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5">
                                    <div className="text-3xl font-bold text-emerald-400 mb-1">100%</div>
                                    <div className="text-sm text-slate-400">Source-Verified</div>
                                </div>
                            </div>

                            <Button onClick={handleNext} size="lg" className="gap-2">
                                Let's Get Started
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Learning Path */}
                {step === 2 && (
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-12">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6">
                                <Target className="w-8 h-8 text-white" />
                            </div>

                            <h2 className="text-3xl font-bold mb-4">6-Level Progressive Learning</h2>

                            <p className="text-slate-300 mb-6">
                                You'll advance through 6 levels of mastery, from basic literacy to advanced application.
                                Progress is based on demonstrated knowledge, not time spent.
                            </p>

                            <div className="space-y-3 mb-8">
                                {[
                                    { level: 'Orientation', focus: 'Literacy & vocabulary', lessons: 15 },
                                    { level: 'Freshman', focus: 'Credit factors & scoring', lessons: 100 },
                                    { level: 'Sophomore', focus: 'Rights & processes', lessons: 100 },
                                    { level: 'Junior', focus: 'Planning & strategy', lessons: 100 },
                                    { level: 'Senior', focus: 'Optimization & readiness', lessons: 100 },
                                    { level: 'Graduate', focus: 'Synthesis & application', lessons: 100 }
                                ].map((level, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-white">{level.level}</div>
                                            <div className="text-xs text-slate-400">{level.focus}</div>
                                        </div>
                                        <div className="text-sm text-slate-500">{level.lessons} lessons</div>
                                    </div>
                                ))}
                            </div>

                            <Button onClick={handleNext} className="w-full gap-2">
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Gamification */}
                {step === 3 && (
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-12">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6">
                                <Award className="w-8 h-8 text-white" />
                            </div>

                            <h2 className="text-3xl font-bold mb-4">Earn Rewards as You Learn</h2>

                            <p className="text-slate-300 mb-6">
                                Every action you take earns Moo Points. Use them in the Moo Store to unlock premium
                                features, tools, and consultations.
                            </p>

                            <div className="grid md:grid-cols-2 gap-4 mb-8">
                                <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                                    <div className="text-4xl font-bold text-indigo-400 mb-2">100</div>
                                    <div className="text-sm text-slate-400 mb-1">Points per Lesson</div>
                                    <div className="text-xs text-slate-500">Complete video lessons to earn</div>
                                </div>

                                <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                                    <div className="text-4xl font-bold text-emerald-400 mb-2">50</div>
                                    <div className="text-sm text-slate-400 mb-1">Points per Quiz</div>
                                    <div className="text-xs text-slate-500">Pass quizzes to earn</div>
                                </div>

                                <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                                    <div className="text-4xl font-bold text-amber-400 mb-2">25</div>
                                    <div className="text-sm text-slate-400 mb-1">Points per Tool</div>
                                    <div className="text-xs text-slate-500">Use professional tools to earn</div>
                                </div>

                                <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                                    <div className="text-4xl font-bold text-purple-400 mb-2">10</div>
                                    <div className="text-sm text-slate-400 mb-1">Points Daily</div>
                                    <div className="text-xs text-slate-500">Login bonus every day</div>
                                </div>
                            </div>

                            <Button onClick={handleNext} className="w-full gap-2">
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Step 4: Tools */}
                {step === 4 && (
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-12">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6">
                                <Zap className="w-8 h-8 text-white" />
                            </div>

                            <h2 className="text-3xl font-bold mb-4">13 Professional Tools</h2>

                            <p className="text-slate-300 mb-6">
                                Access professional-grade tools to apply what you learn. From credit score simulators
                                to FCRA dispute generators, we've got you covered.
                            </p>

                            <div className="grid md:grid-cols-2 gap-3 mb-8">
                                {[
                                    'Credit Score Simulator',
                                    'FCRA Dispute Generator',
                                    'Interactive Quizzes',
                                    'Utilization Calculator',
                                    'DTI Calculator',
                                    'Debt Payoff Calculator',
                                    'Credit Report Auditor',
                                    'Security Freeze Manager'
                                ].map((tool, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                        <span className="text-sm text-white">{tool}</span>
                                    </div>
                                ))}
                            </div>

                            <Button onClick={handleNext} className="w-full gap-2">
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Step 5: Ready to Start */}
                {step === 5 && (
                    <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                        <CardContent className="p-12 text-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>

                            <h2 className="text-3xl font-bold mb-4">You're All Set!</h2>

                            <p className="text-slate-300 mb-6">
                                You're ready to begin your journey to financial mastery. Remember:
                            </p>

                            <div className="space-y-3 mb-8 max-w-md mx-auto text-left">
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-white mb-1">Learn at Your Pace</div>
                                        <div className="text-sm text-slate-400">No time limits, advance by mastery</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-white mb-1">All Content Verified</div>
                                        <div className="text-sm text-slate-400">100% source-verified from FCRA, FDCPA, FICO, CFPB</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-white mb-1">Educational Only</div>
                                        <div className="text-sm text-slate-400">No financial advice, just knowledge</div>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleNext} size="lg" className="gap-2">
                                Enter Credit U™
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
