import { useState, useEffect } from 'react';
import { DigitalIDCard } from '@/components/referral/DigitalIDCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle2, Lock, BookOpen, Video, FileText, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DORM_WEEK_CURRICULUM } from '@/data/dorm-week-curriculum';

export default function DormWeekHub() {
    const [userState, setUserState] = useState<any>(null);

    useEffect(() => {
        const saved = localStorage.getItem('credit_u_reset_state');
        if (saved) {
            try {
                setUserState(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse user state in DormWeekHub", e);
            }
        }
    }, []);

    const coreDays = DORM_WEEK_CURRICULUM;


    if (!userState) {
        return (
            <div className="p-12 text-center space-y-8 bg-[#020412] min-h-screen flex flex-col items-center justify-center">
                <Lock className="w-16 h-16 text-slate-800 mb-4" />
                <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Protocol Locked</h1>
                <p className="text-slate-400 max-w-sm">Complete your Dorm Week registration to initialize this node.</p>
                <Link to="/dorm-week">
                    <Button className="bg-amber-500 text-black font-bold uppercase tracking-widest px-8 h-12 shadow-[0_0_20px_rgba(245,158,11,0.3)]">Register My ID</Button>
                </Link>
            </div>
        );
    }

    const completedCount = userState.completedDays?.length || 0;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 bg-[#020412] min-h-screen">
            {/* --- TOP BAR: STATUS --- */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/10 pb-12">
                <div className="space-y-4 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                        Node: Dorm_Week_Hub_01 // SECURE ACCESS
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                        DORM WEEK <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">COMMAND</span>
                    </h1>
                    <p className="text-slate-400 font-medium text-lg max-w-xl">
                        This building houses your persistent reset protocols and academic identity records.
                    </p>
                </div>

                <div className="shrink-0 transition-transform hover:scale-105 duration-500">
                    <DigitalIDCard
                        firstName={userState.firstName || 'STUDENT'}
                        lastName={userState.lastName || ''}
                        level={userState.studentLevel || 'FRESHMAN'}
                        mission={userState.primaryMission || 'FINANCIAL OPTIMIZATION'}
                        idCode={userState.studentIdCode || 'CU-PENDING'}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* --- CENTER COLUMN: THE PROTOCOL ARCHIVE --- */}
                <div className="xl:col-span-2 space-y-12">
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
                                <BookOpen className="text-blue-500" /> The 5-Day Curriculum
                            </h2>
                            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                                Status: {completedCount === 5 ? 'FULLY VERIFIED' : 'ACTIVE SEQUENCE'}
                            </div>
                        </div>

                        <div className="grid gap-6">
                            {coreDays.map((day, i) => {
                                const isDone = userState.completedDays?.includes(day.id);
                                const isLocked = !isDone && i > 0 && !userState.completedDays?.includes(coreDays[i - 1].id);

                                return (
                                    <div
                                        key={day.id}
                                        className={cn(
                                            "relative p-6 rounded-3xl border transition-all duration-300 group overflow-hidden",
                                            isDone ? "bg-emerald-500/5 border-emerald-500/20" :
                                                isLocked ? "bg-white/2 border-white/5 opacity-40 grayscale" :
                                                    "bg-[#0A0F1E] border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                                        )}
                                    >
                                        <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                            <div className={cn(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-2 font-black text-2xl transition-transform group-hover:scale-110",
                                                isDone ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" :
                                                    isLocked ? "bg-slate-900 border-slate-800 text-slate-700" :
                                                        "bg-blue-500/10 border-blue-500 text-blue-400"
                                            )}>
                                                0{day.id}
                                            </div>

                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-black text-white uppercase tracking-tight italic">
                                                        {day.title}: {day.theme}
                                                    </h3>
                                                    {isDone && (
                                                        <div className="bg-emerald-500/20 px-3 py-1 rounded-full text-[8px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                                                            <CheckCircle2 className="w-3 h-3" /> VERIFIED
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">{day.script?.[0]}</p>

                                                <div className="flex flex-wrap gap-4 pt-2">
                                                    {day.checklistItems?.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-600">
                                                            <div className={cn("w-1 h-1 rounded-full", isDone ? "bg-emerald-500" : "bg-slate-800")} />
                                                            {item}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="md:w-32 flex items-center justify-center">
                                                {!isLocked && (
                                                    <Link to="/dashboard/orientation">
                                                        <Button size="sm" variant="outline" className="text-[9px] font-black uppercase tracking-widest border-white/10 hover:bg-white/10">
                                                            {isDone ? 'REVIEW' : 'INITIALIZE'}
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>

                                        {/* Background Decor */}
                                        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                            {day.id % 2 === 0 ? <Video className="w-24 h-24" /> : <FileText className="w-24 h-24" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* --- RIGHT COLUMN: LOGISTICS & OATH --- */}
                <div className="space-y-8">
                    {/* Master Progress Ring */}
                    <Card className="bg-gradient-to-br from-[#0A0F1E] to-[#010208] border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-3xl" />
                        <CardHeader className="text-center pb-0">
                            <CardTitle className="text-xs font-black text-slate-500 uppercase tracking-widest">Master Reset Protocol</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 text-center space-y-6 relative z-10">
                            <div className="relative inline-flex items-center justify-center">
                                <svg className="w-40 h-40">
                                    <circle className="text-white/5" strokeWidth="8" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                                    <circle className="text-blue-500 transition-all duration-1000 ease-out" strokeWidth="8" strokeDasharray={440} strokeDashoffset={440 - (440 * (completedCount / 5))} strokeLinecap="round" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-white">{Math.round((completedCount / 5) * 100)}%</span>
                                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Complete</span>
                                </div>
                            </div>

                            <Link to="/dashboard/orientation" className="block w-full">
                                <Button className="w-full h-14 bg-white text-black font-black uppercase tracking-widest hover:bg-amber-500 transition-all rounded-2xl shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)]">
                                    CONTINUE THE MISSION
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Logistics Card */}
                    <Card className="bg-[#0A0F1E]/80 border-white/10 backdrop-blur-xl">
                        <CardContent className="p-6 space-y-6">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Shield className="w-3 h-3" /> Security & Identity
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">Registration ID</span>
                                    <span className="text-[10px] font-mono text-white text-right">{userState.studentIdCode || 'PENDING'}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">Start Protocol</span>
                                    <span className="text-[10px] font-mono text-white text-right">{new Date(userState.dormStartDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">Status</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-mono text-emerald-400 uppercase font-black">ACTIVE_IN_CORE</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Proclamation */}
                    <div className="bg-amber-500/5 border border-amber-500/20 p-8 rounded-[2rem] space-y-6 relative overflow-hidden group">
                        <Award className="w-12 h-12 text-amber-500/20 absolute -right-4 -top-4 transform rotate-12 transition-transform group-hover:scale-125" />
                        <h4 className="text-amber-500 font-black uppercase text-xs tracking-[0.3em]">The Reset Mandate</h4>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium italic relative z-10">
                            "You are currently in a high-intensity protocol. This building exists so that you never forget who you became during these 5 days."
                        </p>
                        <div className="pt-2">
                            <p className="text-[10px] text-slate-600 font-mono">— Office of the Dean</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
