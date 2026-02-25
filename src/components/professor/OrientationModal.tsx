import React, { useState } from 'react';
import { useProfessor } from './ProfessorContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Shield, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export const OrientationModal = () => {
    const { prefs, markOrientationCompleted, loading } = useProfessor();
    const [step, setStep] = useState(1);
    const [quizAnswers, setQuizAnswers] = useState({ q1: '', q2: '', q3: '' });
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Don't show if already completed
    if (prefs.creditlab_orientation_completed) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white p-4 rounded-xl flex items-center gap-3 shadow-2xl">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                    <span className="text-sm font-bold text-slate-700">Professor initializing...</span>
                </div>
            </div>
        );
    }

    const handleQuizSelect = (question: 'q1' | 'q2' | 'q3', answer: string) => {
        setQuizAnswers(prev => ({ ...prev, [question]: answer }));
        setError(null);
    };

    const validateAndComplete = async () => {
        setSubmitting(true);
        console.log("Validating Answers:", quizAnswers);

        // Explicit Check
        if (quizAnswers.q1 !== 'no') {
            alert("Incorrect: We NEVER store your sensitive data.");
            setSubmitting(false);
            return;
        }
        if (quizAnswers.q2 !== 'sent_date') {
            alert("Incorrect: The timer starts when you mail the letter (Sent Date).");
            setSubmitting(false);
            return;
        }
        if (quizAnswers.q3 !== 'logging') {
            alert("Incorrect: You stop reminders by logging your results.");
            setSubmitting(false);
            return;
        }

        try {
            await markOrientationCompleted();
            // Force reload if state stuck
            // window.location.reload(); 
        } catch (e) {
            alert("Error saving progress. Please try again.");
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0f2c]/95 backdrop-blur-md p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="bg-[#0a0f2c] p-6 text-center border-b border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/10 blur-xl" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full border-2 border-amber-500/50 p-1 mb-3 bg-[#0a0f2c]">
                            <img src="/assets/professor/professor-creditlab.png" alt="Professor" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-wide">Protocol Orientation</h2>
                        <p className="text-blue-200/60 text-xs uppercase tracking-widest mt-1">Mandatory First-Time Briefing</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1 bg-slate-50">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-900 border-b pb-2">1. The Rules of Engagement</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="text-amber-600 font-bold text-sm mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Not Legal Advice</div>
                                        <p className="text-slate-600 text-sm">I provide educational strategies and governance templates. You are the sovereign decision maker.</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="text-blue-600 font-bold text-sm mb-2 flex items-center gap-2"><Shield className="w-4 h-4" /> Privacy Core</div>
                                        <p className="text-slate-600 text-sm">We do <span className="font-bold underline">not</span> store SSN, DOB, or ID docs. Data entered in letters is session-only.</p>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="text-indigo-600 font-bold text-sm mb-2 flex items-center gap-2"><Clock className="w-4 h-4" /> The 45-Day Cycle</div>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        Disputes require patience. The clock starts when you enter your <strong>Sent Date</strong>.
                                        You must not intervene until the cycle completes.
                                    </p>
                                </div>

                                <Button className="w-full bg-[#0a0f2c] hover:bg-blue-900 text-white py-6" onClick={() => setStep(2)}>
                                    Proceed to Governance Check <CheckCircle className="ml-2 w-4 h-4" />
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-900 border-b pb-2">2. Verify Understanding</h3>
                                <p className="text-slate-500 text-sm">Confirm your command of the protocol to unlock the Credit Lab.</p>

                                <div className="space-y-4">
                                    {/* Q1 */}
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold text-slate-800">Q1: Do we store your SSN or ID documents?</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleQuizSelect('q1', 'yes')}
                                                className={`flex-1 py-3 text-xs font-bold rounded-lg border transition-all ${quizAnswers.q1 === 'yes' ? 'bg-indigo-900 text-white border-indigo-900' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                                            >
                                                Yes, securely encryption
                                            </button>
                                            <button
                                                onClick={() => handleQuizSelect('q1', 'no')}
                                                className={`flex-1 py-3 text-xs font-bold rounded-lg border transition-all ${quizAnswers.q1 === 'no' ? 'bg-indigo-900 text-white border-indigo-900' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                                            >
                                                No, never stored
                                            </button>
                                        </div>
                                    </div>

                                    {/* Q2 */}
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold text-slate-800">Q2: What action officially starts the 45-day timer?</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => handleQuizSelect('q2', 'printing')}
                                                className={`py-2 text-[10px] font-bold rounded border transition-all ${quizAnswers.q2 === 'printing' ? 'bg-indigo-900 text-white' : 'bg-white text-slate-600'}`}
                                            >
                                                Printing the letter
                                            </button>
                                            <button
                                                onClick={() => handleQuizSelect('q2', 'sent_date')}
                                                className={`py-2 text-[10px] font-bold rounded border transition-all ${quizAnswers.q2 === 'sent_date' ? 'bg-indigo-900 text-white' : 'bg-white text-slate-600'}`}
                                            >
                                                Entering "Sent Date"
                                            </button>
                                        </div>
                                    </div>

                                    {/* Q3 */}
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold text-slate-800">Q3: How do you stop the daily reminders?</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => handleQuizSelect('q3', 'logging')}
                                                className={`py-2 text-[10px] font-bold rounded border transition-all ${quizAnswers.q3 === 'logging' ? 'bg-indigo-900 text-white' : 'bg-white text-slate-600'}`}
                                            >
                                                Log Round Results
                                            </button>
                                            <button
                                                onClick={() => handleQuizSelect('q3', 'ignore')}
                                                className={`py-2 text-[10px] font-bold rounded border transition-all ${quizAnswers.q3 === 'ignore' ? 'bg-indigo-900 text-white' : 'bg-white text-slate-600'}`}
                                            >
                                                Ignore them
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded flex items-center gap-2 animate-pulse">
                                        <AlertTriangle className="w-4 h-4" /> {error}
                                    </div>
                                )}

                                <Button
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg shadow-lg shadow-emerald-500/20"
                                    onClick={validateAndComplete}
                                    disabled={!quizAnswers.q1 || !quizAnswers.q2 || !quizAnswers.q3 || submitting}
                                >
                                    {submitting ? 'Unlocking Lab...' : 'Confirm & Enter Lab'}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};
