import { DashboardLayout } from "../components/layout/DashboardLayout";
import { LeaderboardTable } from "../components/community/LeaderboardTable";

const HonorRoll = () => {
    return (
        <DashboardLayout>
            <div className="bg-[#050505] min-h-screen p-8 text-white space-y-8">
                <header>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">HONOR ROLL</h1>
                    <p className="text-gray-400 max-w-xl text-lg">
                        The highest performing intellects in the network.
                        <br />
                        <span className="text-sm text-emerald-500 italic">Rankings update in real-time based on acquired $CU.</span>
                    </p>
                </header>

                <LeaderboardTable />
            </div>
        </DashboardLayout>
    );
};

export default HonorRoll;
