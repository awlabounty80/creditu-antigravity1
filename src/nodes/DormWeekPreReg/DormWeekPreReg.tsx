// CACHE_BUST_OMEGA_2026_0306_0255
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditUAdmissionsMachineV2 as CreditUAdmissionsMachine } from './CreditUAdmissionsMachineV2';
import { RegistrationForm } from './RegistrationForm';
import { AdmissionSummary } from './AdmissionSummary';
import { useDormWeek } from '@/hooks/useDormWeek';

export default function DormWeekPreReg() {
    const { captureLead, siteState, getAdmissionsSession } = useDormWeek();
    const [step, setStep] = useState<'register' | 'spin' | 'result'>('register');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Resume session if exists (or reset if requested)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const storedEmail = localStorage.getItem('cu_admissions_email');
        const storedName = localStorage.getItem('cu_admissions_name');

        if (params.get('reset') === 'true') {
            console.log("DormWeekPreReg: [FORCE RESET] Clearing local admissions data.");
            if (storedEmail) localStorage.removeItem(`cu_session_${storedEmail}`);
            localStorage.removeItem('cu_admissions_email');
            localStorage.removeItem('cu_admissions_name');
            // Remove the param and force RELOAD to ensure clean state
            window.history.replaceState({}, '', window.location.pathname);
            window.location.reload();
            return;
        }

        if (storedEmail) {
            setEmail(storedEmail);
            setName(storedName || '');

            getAdmissionsSession(storedEmail).then(session => {
                if (session) {
                    if (session.admissions_complete) {
                        setStep('result');
                    } else {
                        setStep('spin');
                    }
                }
            });
        }
    }, [getAdmissionsSession]);

    const handleRegister = async (data: { name: string; email: string; phone?: string }) => {
        setIsLoading(true);
        setError(null);

        // SAFETY TIMEOUT: Force-start after 1.5s regardless of DB status
        const safetyTimeout = setTimeout(() => {
            console.warn("handleRegister: Safety timeout reached. Forcing unlock.");
            setEmail(data.email);
            setName(data.name);
            setStep('spin');
            setIsLoading(false);
        }, 1500);

        try {
            const { success } = await captureLead(data.name, data.email, data.phone);

            if (success) {
                clearTimeout(safetyTimeout);
                localStorage.setItem('cu_admissions_email', data.email);
                localStorage.setItem('cu_admissions_name', data.name);
                setEmail(data.email);
                setName(data.name);

                // Check if session is already complete
                const session = await getAdmissionsSession(data.email);
                setStep(session?.admissions_complete ? 'result' : 'spin');
            }
        } catch (err: any) {
            console.warn("handleRegister: Recovering via local protocol.", err);
            clearTimeout(safetyTimeout);
            setEmail(data.email);
            setName(data.name);
            setStep('spin');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpinResult = (spinResult: any) => {
        setResult(spinResult);
        if (spinResult.spinCount === 3) {
            setStep('result');
        }
    };

    const handleFinalize = () => {
        // Redirect to student locker instead of directly to campus
        window.location.href = '/locker';
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white selection:bg-indigo-500/30 flex flex-col items-center justify-center">
            {/* STADIUM BACKGROUND (CINEMATIC) */}
            <div className="absolute inset-0 bg-cover bg-center brightness-[0.3] z-0 grayscale-[0.5]" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80")' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-0" />

            <div className="relative z-10 w-full max-w-5xl flex flex-col items-center p-6">
                <AnimatePresence mode="wait">
                    {step === 'register' && (
                        <motion.div
                            key="register-flow"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full flex flex-col items-center"
                        >
                            <div className="text-center mb-10 space-y-2">
                                <motion.h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                    Admissions Portal
                                </motion.h1>
                                <p className="text-xl md:text-2xl font-bold text-amber-500 tracking-[0.2em] uppercase italic">
                                    CLAIM YOUR SPOT AT THE TOP.
                                </p>
                            </div>

                            <RegistrationForm
                                onSubmit={handleRegister}
                                isLoading={isLoading}
                                error={error}
                            />

                            <button
                                onClick={() => window.location.href = '/admissions?reset=true'}
                                className="mt-8 text-[10px] text-white/20 uppercase tracking-[0.4em] hover:text-amber-500 transition-colors cursor-pointer"
                            >
                                Testing: Start Fresh Protocol
                            </button>
                        </motion.div>
                    )}

                    {step === 'spin' && (
                        <motion.div
                            key="spin-flow"
                            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="text-center w-full"
                        >
                            <CreditUAdmissionsMachine email={email} onResult={handleSpinResult} />
                        </motion.div>
                    )}

                    {step === 'result' && (
                        <AdmissionSummary
                            key="result-summary"
                            email={email}
                            name={name}
                            onComplete={handleFinalize}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

