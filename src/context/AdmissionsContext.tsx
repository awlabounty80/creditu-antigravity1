import { createContext, useContext, useState, ReactNode } from 'react';

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
        console.log(`Processing enrollment for ${applicant.email} on plan ${planId}`);

        // SIMULATION: Fake Payment Delay
        await new Promise(resolve => setTimeout(resolve, 3000));

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
