import { DashboardLayout } from "../components/layout/DashboardLayout";
import { NetworkStatsCards } from "../components/community/NetworkStatsCards";

export const CommunityStatsPage = () => {
    return (
        <DashboardLayout>
            <div className="bg-[#050505] min-h-screen p-8 text-white space-y-12">
                <header>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">CAMPUS PULSE</h1>
                    <p className="text-gray-400 max-w-xl text-lg">
                        Real-time telemetry of the Credit U academic network.
                    </p>
                </header>

                <div className="max-w-5xl">
                    <NetworkStatsCards />
                </div>
            </div>
        </DashboardLayout>
    );
};
