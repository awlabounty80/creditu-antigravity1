import { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { generateStudentId } from '@/lib/studentId';

// Types
export interface ApplicantData {
    firstName: string;
    lastName: string;
    email: string;
    goal: string;
    plan?: 'auditor' | 'semester' | 'founders';
    studentId?: string;
}

interface AdmissionsContextType {
    applicant: ApplicantData;
    updateApplicant: (data: Partial<ApplicantData>) => void;
    processEnrollment: (planId: string) => Promise<{ success: boolean; error?: string }>;
    isProcessing: boolean;
}

const defaultApplicant: ApplicantData = {
    firstName: '',
    lastName: '',
    email: '',
    goal: ''
};

const AdmissionsContext = createContext<AdmissionsContextType | undefined>(undefined);

export function AdmissionsProvider({ children }: { children: ReactNode }) {
    const [applicant, setApplicant] = useState<ApplicantData>(defaultApplicant);
    const [isProcessing, setIsProcessing] = useState(false);

    const updateApplicant = (data: Partial<ApplicantData>) => {
        setApplicant(prev => ({ ...prev, ...data }));
    };

    const processEnrollment = async (planId: string): Promise<{ success: boolean; error?: string }> => {
        setIsProcessing(true);
        // REAL AUTH: Trigger Magic Link for the student
        try {
            const { error: authError } = await supabase.auth.signInWithOtp({
                email: applicant.email,
                options: {
                    emailRedirectTo: `${window.location.origin}/onboarding`,
                    data: {
                        first_name: applicant.firstName,
                        last_name: applicant.lastName,
                    }
                }
            });

            if (authError) throw authError;
            console.log("Magic Link dispatched successfully.");
        } catch (authErr) {
            console.error("Critical: Enrollment email failed:", authErr);
            setIsProcessing(false);
            return {
                success: false,
                error: "Communication failure. Please verify email and try again."
            };
        }

        // SIMULATION: Fake Payment Delay (reduced since we now have real networking)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate ID
        const newStudentId = generateStudentId();

        // Update state with plan and ID
        setApplicant(prev => ({
            ...prev,
            plan: planId as any,
            studentId: newStudentId
        }));

        // SIMULATION: Success
        setIsProcessing(false);
        return { success: true };
    };

    return (
        <AdmissionsContext.Provider value={{ applicant, updateApplicant, processEnrollment, isProcessing }}>
            {children}
        </AdmissionsContext.Provider>
    );
}

export function useAdmissions() {
    const context = useContext(AdmissionsContext);
    if (context === undefined) {
        throw new Error('useAdmissions must be used within an AdmissionsProvider');
    }
    return context;
}
