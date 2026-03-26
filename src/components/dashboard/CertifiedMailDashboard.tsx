import React from 'react';
import { Mail, Clock, ShieldCheck, ExternalLink, QrCode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

export const CertifiedMailDashboard = () => {
    const activeDisputes = [
        { id: 'MOV-7721', bureau: 'Experian', status: 'In Flight', daysLeft: 12, type: 'MOV Demand' },
        { id: 'ITS-0091', bureau: 'TransUnion', status: 'Delivered', daysLeft: 28, type: 'Notice of Intent to Sue' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">Certified Mail Vault</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Tracking 30-Day Investigation Window</p>
                </div>
                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                    <ShieldCheck className="w-6 h-6 text-indigo-400" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeDisputes.map((dispute) => (
                    <Card key={dispute.id} className="bg-[#0A0F1E] border-white/5 overflow-hidden group hover:border-indigo-500/30 transition-all duration-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-black text-indigo-400 uppercase tracking-widest">{dispute.bureau}</CardTitle>
                            <QrCode className="w-4 h-4 text-slate-700" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">{dispute.type}</h3>
                                <p className="text-[10px] text-slate-500 font-mono tracking-tight">TRACKING #: v2026-TX-{dispute.id}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] uppercase font-black tracking-widest">
                                    <span className="text-slate-400">Time to Resolution</span>
                                    <span className="text-indigo-400">{dispute.daysLeft} Days</span>
                                </div>
                                <Progress value={(30 - dispute.daysLeft) / 30 * 100} className="h-1 bg-white/5" indicatorClassName="bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                            </div>

                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="flex-1 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest">
                                    View Receipt
                                </Button>
                                <Button size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    Track Live <ExternalLink className="ml-2 w-3 h-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
