import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';

export default function CreditPositionSnapshot() {
    const navigate = useNavigate();
    const [limit, setLimit] = useState('');
    const [balance, setBalance] = useState('');
    const [utilization, setUtilization] = useState(0);

    const [inquiries, setInquiries] = useState({ exp: '', equ: '', tu: '' });

    // Auto-Calculate Utilization
    useEffect(() => {
        const l = parseFloat(limit.replace(/,/g, ''));
        const b = parseFloat(balance.replace(/,/g, ''));
        if (l > 0 && b >= 0) {
            setUtilization((b / l) * 100);
        } else {
            setUtilization(0);
        }
    }, [limit, balance]);

    return (
        <div className="min-h-screen bg-white text-black font-sans p-8 md:p-16 print:p-0">
            {/* ... Header ... */}
            <div className="flex justify-between items-start border-b-4 border-black pb-6 mb-8">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Credit Position Snapshot</h1>
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Official Credit U Intel Document // C-001</p>
                </div>
                <div className="text-right">
                    <div className="text-xs font-mono border border-black px-2 py-1 inline-block mb-2">CONFIDENTIAL</div>
                    <p className="text-sm font-bold">DATE: _________________</p>
                </div>
            </div>

            {/* Print Controls */}
            <div className="fixed top-4 left-4 print:hidden">
                <Button onClick={() => navigate('/dashboard/orientation')} variant="ghost" className="text-black hover:bg-gray-100 gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
            </div>

            {/* Print Controls */}
            <div className="fixed top-4 right-4 print:hidden">
                <Button onClick={() => window.print()} className="bg-black text-white hover:bg-gray-800 gap-2">
                    <Printer className="w-4 h-4" /> Print / Save to PDF
                </Button>
            </div>

            <div className="grid gap-12 max-w-4xl mx-auto">
                {/* 1. BUREAU ACCESS */}
                <section>
                    <h2 className="text-xl font-black uppercase bg-black text-white px-4 py-2 mb-6 inline-block">1. Bureau Access Log</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['EXPERIAN', 'EQUIFAX', 'TRANSUNION'].map((bureau) => (
                            <div key={bureau} className="border-2 border-dashed border-gray-300 p-6 rounded-lg relative">
                                <h3 className="font-bold text-lg mb-4">{bureau}</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" className="w-5 h-5 border-2 border-black rounded-sm accent-black" />
                                        <span className="text-sm font-bold">Logged In</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Score (Do not panic)</p>
                                        <input
                                            type="text"
                                            placeholder="Enter Score..."
                                            className="h-8 border-b-2 border-black w-full font-mono text-xl focus:outline-none focus:border-blue-500 bg-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. NEGATIVE ITEM AUDIT */}
                <section>
                    <h2 className="text-xl font-black uppercase bg-black text-white px-4 py-2 mb-6 inline-block">2. Negative Item Audit</h2>
                    <p className="mb-4 text-sm font-medium italic">List any collections, charge-offs, or missed payments below.</p>
                    <table className="w-full border-collapse border-2 border-black">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-black p-3 text-left w-1/4">Creditor Name</th>
                                <th className="border border-black p-3 text-left w-1/4">Bureau(s)</th>
                                <th className="border border-black p-3 text-left w-1/4">Balance</th>
                                <th className="border border-black p-3 text-left w-1/4">Date of Last Activity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i}>
                                    <td className="border border-black p-0 h-12">
                                        <input className="w-full h-full p-2 bg-transparent focus:bg-blue-50 focus:outline-none" />
                                    </td>
                                    <td className="border border-black p-0 h-12">
                                        <input className="w-full h-full p-2 bg-transparent focus:bg-blue-50 focus:outline-none" />
                                    </td>
                                    <td className="border border-black p-0 h-12">
                                        <input className="w-full h-full p-2 bg-transparent focus:bg-blue-50 focus:outline-none" />
                                    </td>
                                    <td className="border border-black p-0 h-12">
                                        <input className="w-full h-full p-2 bg-transparent focus:bg-blue-50 focus:outline-none" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* 3. UTILIZATION CHECK */}
                <section>
                    <h2 className="text-xl font-black uppercase bg-black text-white px-4 py-2 mb-6 inline-block">3. Utilization Scan</h2>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="border border-black p-6 relative">
                            <h3 className="font-bold uppercase mb-4 text-gray-500 text-xs tracking-widest">Total Credit Limit</h3>
                            <div className="absolute bottom-4 right-4 text-2xl font-black opacity-10 pointer-events-none">$</div>
                            <input
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                className="h-10 border-b-2 border-black w-full text-2xl font-bold bg-transparent focus:outline-none focus:border-blue-500"
                                type="number"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="border border-black p-6 relative">
                            <h3 className="font-bold uppercase mb-4 text-gray-500 text-xs tracking-widest">Total Balance Owed</h3>
                            <div className="absolute bottom-4 right-4 text-2xl font-black opacity-10 pointer-events-none">$</div>
                            <input
                                value={balance}
                                onChange={(e) => setBalance(e.target.value)}
                                className="h-10 border-b-2 border-black w-full text-2xl font-bold bg-transparent focus:outline-none focus:border-blue-500"
                                type="number"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Auto-Calculated Result with Strategy */}
                    <div className="mt-8 p-6 bg-gray-50 border-2 border-black flex items-center justify-between">
                        <div>
                            <span className="font-black text-lg block mb-1">UTILIZATION %:</span>
                            <div className={`text-4xl font-black ${utilization > 30 ? 'text-red-600' : utilization < 10 ? 'text-emerald-600' : 'text-amber-500'}`}>
                                {utilization.toFixed(1)}%
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="font-black text-xs uppercase text-gray-400 block mb-1">Recommended Strategy</span>
                            <div className="text-sm font-bold max-w-xs">
                                {utilization > 30 && "CRITICAL: Stop spending. Execute 'Snowball Method' immediately."}
                                {utilization <= 30 && utilization >= 10 && "WARNING: Optimize payments to drop below 10% before applying."}
                                {utilization < 10 && utilization > 0 && "OPTIMAL: Maintenance Mode. Keep activity active but low."}
                                {utilization === 0 && "CAUTION: 0% usage can hurt scores. Spend $10 and pay it off."}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. INQUIRY COUNT */}
                <section>
                    <h2 className="text-xl font-black uppercase bg-black text-white px-4 py-2 mb-6 inline-block">4. Hard Inquiry Count (24 Months)</h2>
                    <div className="grid grid-cols-3 gap-0 text-center">
                        <div className="border-2 border-black p-4 border-r-0">
                            <h4 className="font-bold text-sm mb-2">EXPERIAN</h4>
                            <input
                                value={inquiries.exp}
                                onChange={(e) => setInquiries({ ...inquiries, exp: e.target.value })}
                                className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-full mx-auto text-center text-2xl font-bold focus:outline-none focus:border-blue-500 focus:bg-blue-50"
                            />
                        </div>
                        <div className="border-2 border-black p-4 border-r-0">
                            <h4 className="font-bold text-sm mb-2">EQUIFAX</h4>
                            <input
                                value={inquiries.equ}
                                onChange={(e) => setInquiries({ ...inquiries, equ: e.target.value })}
                                className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-full mx-auto text-center text-2xl font-bold focus:outline-none focus:border-blue-500 focus:bg-blue-50"
                            />
                        </div>
                        <div className="border-2 border-black p-4">
                            <h4 className="font-bold text-sm mb-2">TRANSUNION</h4>
                            <input
                                value={inquiries.tu}
                                onChange={(e) => setInquiries({ ...inquiries, tu: e.target.value })}
                                className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-full mx-auto text-center text-2xl font-bold focus:outline-none focus:border-blue-500 focus:bg-blue-50"
                            />
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <div className="border-t-4 border-black pt-8 mt-12 text-center">
                    <p className="font-bold uppercase tracking-widest text-xs mb-2">"We don't panic. We Position."</p>
                    <p className="text-[10px] text-gray-500">© 2024 Credit U. Do Not Distribute.</p>
                </div>
            </div>
        </div>
    );
}
