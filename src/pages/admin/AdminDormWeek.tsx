// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useDormWeek, SiteState, DormWeekMode } from '@/hooks/useDormWeek';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, ShieldCheck, Users, Clock } from 'lucide-react';

export default function AdminDormWeek() {
    const { siteState, loading: stateLoading } = useDormWeek();
    const [editState, setEditState] = useState<Partial<SiteState>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [searchEmail, setSearchEmail] = useState('');
    const [studentStatus, setStudentStatus] = useState<any>(null);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (siteState) {
            setEditState(siteState);
        }
    }, [siteState]);

    const handleSaveState = async () => {
        setIsSaving(true);
        const { error } = await supabase
            .from('dormweek_site_state')
            .upsert({
                id: (siteState as any)?.id || undefined,
                ...editState,
                updated_at: new Date().toISOString()
            });

        if (!error) {
            alert("Site state updated successfully.");
            window.location.reload();
        } else {
            alert("Error updating state: " + error.message);
        }
        setIsSaving(false);
    };

    const handleSearchStudent = async () => {
        setSearching(true);
        const { data, error } = await supabase
            .from('dormweek_student_status')
            .select('*')
            .eq('email', searchEmail)
            .single();

        setStudentStatus(data);
        if (error) console.warn("No status found for this email.");
        setSearching(false);
    };

    const handleToggleStatus = async (field: string, value: boolean) => {
        const { error } = await supabase
            .from('dormweek_student_status')
            .upsert({
                email: searchEmail,
                [field]: value,
                updated_at: new Date().toISOString()
            }, { onConflict: 'email' });

        if (!error) handleSearchStudent();
    };

    if (stateLoading) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading Config...</div>;

    return (
        <div className="p-8 space-y-8 max-w-4xl mx-auto">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Dorm Week Control Center</h1>
                    <p className="text-slate-400 text-sm">Manage global timing, site modes, and student overrides.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Site State Configuration */}
                <Card className="bg-[#0A0F1E] border-white/10 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-indigo-400" /> Global State
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500">Operation Mode</label>
                            <Select
                                value={editState.mode}
                                onValueChange={(v: DormWeekMode) => setEditState({ ...editState, mode: v })}
                            >
                                <SelectTrigger className="bg-black/40 border-white/10 text-white">
                                    <SelectValue placeholder="Select Mode" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0A0F1E] border-white/10 text-white">
                                    <SelectItem value="prereg">Pre-Registration (Admissions Mode)</SelectItem>
                                    <SelectItem value="dormweek">Dorm Week Active (Portal Open)</SelectItem>
                                    <SelectItem value="closed">Closed (Waitlist Mode)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500">Starts At</label>
                                <Input
                                    type="datetime-local"
                                    className="bg-black/40 border-white/10 text-white"
                                    value={editState.dorm_week_start?.slice(0, 16) || ''}
                                    onChange={(e) => setEditState({ ...editState, dorm_week_start: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500">Ends At</label>
                                <Input
                                    type="datetime-local"
                                    className="bg-black/40 border-white/10 text-white"
                                    value={editState.dorm_week_end?.slice(0, 16) || ''}
                                    onChange={(e) => setEditState({ ...editState, dorm_week_end: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500">Apply Page Redirect</label>
                            <Select
                                value={editState.apply_redirect_mode}
                                onValueChange={(v: any) => setEditState({ ...editState, apply_redirect_mode: v })}
                            >
                                <SelectTrigger className="bg-black/40 border-white/10 text-white">
                                    <SelectValue placeholder="Select Behavior" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0A0F1E] border-white/10 text-white">
                                    <SelectItem value="redirect_to_dormweek">Redirect to Dorm Week Hub</SelectItem>
                                    <SelectItem value="daily_spin">Keep as Daily Dorm Spin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            className="w-full h-12 bg-white text-black hover:bg-slate-200 font-black uppercase tracking-widest"
                            onClick={handleSaveState}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5 mr-2" />}
                            Commit Changes
                        </Button>
                    </CardContent>
                </Card>

                {/* Individual Overrides */}
                <Card className="bg-[#0A0F1E] border-white/10 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-amber-500" /> Student Overrides
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-2">
                            <Input
                                placeholder="student@email.com"
                                className="bg-black/40 border-white/10 text-white"
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                            />
                            <Button variant="outline" onClick={handleSearchStudent} disabled={searching} className="border-white/10 text-white">
                                {searching ? <Loader2 className="animate-spin" /> : "Search"}
                            </Button>
                        </div>

                        {studentStatus ? (
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400 font-bold uppercase">Accepted Status</span>
                                    <span className="text-white font-mono">{studentStatus.acceptance_status}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400 font-bold uppercase">Dorm Key Issued</span>
                                    <Button
                                        size="sm"
                                        variant={studentStatus.dorm_key ? "default" : "outline"}
                                        onClick={() => handleToggleStatus('dorm_key', !studentStatus.dorm_key)}
                                        className={studentStatus.dorm_key ? "bg-emerald-600" : ""}
                                    >
                                        {studentStatus.dorm_key ? "YES" : "NO"}
                                    </Button>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400 font-bold uppercase">Admin Override</span>
                                    <Button
                                        size="sm"
                                        variant={studentStatus.admin_override ? "default" : "outline"}
                                        onClick={() => handleToggleStatus('admin_override', !studentStatus.admin_override)}
                                        className={studentStatus.admin_override ? "bg-red-600" : ""}
                                    >
                                        {studentStatus.admin_override ? "ON" : "OFF"}
                                    </Button>
                                </div>
                            </div>
                        ) : searchEmail && !searching && (
                            <div className="text-center py-4 text-slate-600 text-xs">
                                No records found. Status will be created on save.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
