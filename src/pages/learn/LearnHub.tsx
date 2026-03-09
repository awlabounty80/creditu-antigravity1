import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, GraduationCap, Clock, Award } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { getAllClientCourses } from '../../lib/client-curriculum';

export default function LearnHub() {
    const [tracks, setTracks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load data from high-fidelity client curriculum
        try {
            const courses = getAllClientCourses();
            setTracks(courses);
        } catch (e) {
            console.error("Error loading tracks:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#020412]">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-indigo-300 font-mono text-xs tracking-widest">INITIALIZING CAMPUS NETWORK...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Yard Header */}
                <div className="relative">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
                    <div className="relative z-10 flex flex-col items-start gap-3">
                        <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                            Official Credit U™ Campus
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Yard</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">
                            Master the mechanics of wealth. Select a curriculum track below to enter your classroom.
                        </p>
                    </div>
                </div>

                {/* Track Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tracks.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <BookOpen className="h-16 w-16 mx-auto text-slate-700 mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-2">Campus is Quiet</h3>
                            <p className="text-slate-500">No classes have been declassified for your profile yet.</p>
                        </div>
                    )}

                    {tracks.map((track) => {
                        const lessonCount = track.modules.reduce((acc: number, mod: any) => acc + mod.lessons.length, 0);

                        return (
                            <Card key={track.id} className="group relative bg-[#0A0F1E] border-white/5 hover:border-indigo-500/30 transition-all duration-500 overflow-hidden rounded-3xl shadow-2xl">
                                {/* Ambient Glow */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />

                                <div className="aspect-[16/10] bg-gradient-to-br from-indigo-950 to-indigo-900 relative overflow-hidden">
                                    {/* Grid Overlay */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />

                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/20 to-transparent" />

                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded text-[9px] font-black text-yellow-500 uppercase tracking-tighter">
                                                {track.level}
                                            </span>
                                            <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest">
                                                Track 01
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black text-white leading-tight">{track.title}</h3>
                                    </div>
                                </div>

                                <CardContent className="p-8 pt-6 space-y-6">
                                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                                        {track.description}
                                    </p>

                                    {/* Stats Row */}
                                    <div className="flex items-center justify-between py-4 border-y border-white/5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Lessons</span>
                                            <div className="flex items-center gap-1.5 text-white font-bold">
                                                <GraduationCap className="w-4 h-4 text-indigo-400" />
                                                <span>{lessonCount} Classes</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 text-right">
                                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Rewards</span>
                                            <div className="flex items-center gap-1.5 text-white font-bold justify-end">
                                                <Award className="w-4 h-4 text-yellow-500" />
                                                <span>{track.credits_value} Credits</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Link to={`/learn/${track.id}`}>
                                        <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base rounded-2xl gap-3 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all group/btn">
                                            ENTER CLASSROOM
                                            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
