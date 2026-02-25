import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import { ProfessorProvider } from "../professor/ProfessorContext";
import { ProfessorOverlay } from "../professor/ProfessorOverlay";
import { OrientationModal } from "../professor/OrientationModal";

export default function AppLayout() {
    return (
        <ProfessorProvider>
            <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20">
                {/* Sidebar (Fixed) */}
                <Navigation />

                {/* Main Content Area (Offset by Sidebar Width) */}
                <main className="flex-1 pl-64 transition-all duration-300 relative">
                    <div className="min-h-screen w-full">
                        <Outlet />
                    </div>

                    {/* Professor Layer (Global) */}
                    <ProfessorOverlay />
                    <OrientationModal />
                </main>
            </div>
        </ProfessorProvider>
    );
}
