import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function DebtPayoffCalculator() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate(-1)}
                    className="text-slate-400 hover:text-white pl-0"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Tools Hub
                </Button>

                <div className="space-y-2">
                    <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                            <Calculator className="w-6 h-6" />
                        </div>
                        Debt Payoff Calculator
                    </h1>
                    <p className="text-slate-400">
                        Compare Snowball vs Avalanche methods to mathematically eradicate your balances.
                    </p>
                </div>

                <Card className="bg-white/5 border-white/10 mt-8">
                    <CardHeader>
                        <CardTitle className="text-xl font-heading text-slate-300 text-center">
                            Module Under Construction 🛠️
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 flex flex-col items-center justify-center space-y-4">
                        <Calculator className="w-16 h-16 text-slate-700 animate-pulse" />
                        <p className="text-slate-500 text-center max-w-sm">
                            The advanced simulation logic for this timeline comparison tool is currently being calibrated by the development team. 
                        </p>
                        <Button 
                            variant="default"
                            className="bg-red-500 hover:bg-red-600 text-white mt-4"
                            onClick={() => navigate('/dashboard/tools')}
                        >
                            Return to Tools Hub
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
