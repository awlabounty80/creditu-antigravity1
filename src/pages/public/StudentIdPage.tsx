import React from 'react';
import { AdmissionSummary } from '@/nodes/DormWeekPreReg/AdmissionSummary';

export default function StudentIdPage() {
    const email = localStorage.getItem('cu_admissions_email') || 'awlabounty80@gmail.com';
    const name = localStorage.getItem('cu_admissions_name') || 'ASHLEY';

    const handleComplete = () => {
        window.location.href = '/learn';
    };

    return (
        <AdmissionSummary 
            email={email} 
            name={name} 
            onComplete={handleComplete} 
        />
    );
}
