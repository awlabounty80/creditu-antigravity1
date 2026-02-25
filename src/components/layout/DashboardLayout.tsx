import React from 'react';
import Navigation from './Navigation';
import { ProfessorProvider } from '../professor/ProfessorContext';
import { ProfessorOverlay } from '../professor/ProfessorOverlay';
import { OrientationModal } from '../professor/OrientationModal';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ProfessorProvider>
            <div className="flex h-screen bg-[#0a0a0a] text-white">
                <Navigation />
                <main className="flex-1 overflow-y-auto relative">
                    {children}

                    {/* Professor Layer */}
                    <ProfessorOverlay />
                    <OrientationModal />
                </main>
            </div>
        </ProfessorProvider>
    );
};
