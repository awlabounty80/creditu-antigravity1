import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface DisputeData {
    yourName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    ssn: string;
    dob: string;
    accountName: string;
    accountNumber: string;
    disputeReason: string;
    explanation: string;
}

export default function DisputeLetterGenerator() {
    const [step, setStep] = useState(1);
    const [bureau, setBureau] = useState<'experian' | 'equifax' | 'transunion' | null>(null);
    const [data, setData] = useState<DisputeData>({
        yourName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        ssn: '',
        dob: '',
        accountName: '',
        accountNumber: '',
        disputeReason: '',
        explanation: ''
    });

    const [history, setHistory] = useState<{ date: string, bureau: string, account: string }[]>([]);

    // Load draft and history
    useEffect(() => {
        const savedDraft = localStorage.getItem('dispute_draft');
        if (savedDraft) setData(JSON.parse(savedDraft));

        const savedHistory = localStorage.getItem('dispute_history');
        if (savedHistory) setHistory(JSON.parse(savedHistory));
    }, []);

    // Save draft
    useEffect(() => {
        localStorage.setItem('dispute_draft', JSON.stringify(data));
    }, [data]);

    const bureauAddresses = {
        experian: 'Experian\nP.O. Box 4500\nAllen, TX 75013',
        equifax: 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
        transunion: 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
    };

    const disputeReasons = [
        'Account does not belong to me',
        'Incorrect payment history',
        'Account was paid on time',
        'Account balance is incorrect',
        'Account is older than 7 years',
        'Duplicate account listing',
        'Account was closed by me',
        'Identity theft/fraud'
    ];

    const reasonTemplates: Record<string, string> = {
        'Account does not belong to me': "I have reviewed my credit report and identified an account that does not belong to me. I have never opened this account with this creditor. This suggests a potential error in your files or identity theft. Please verify the original signed application or remove this item immediately.",
        'Incorrect payment history': "The payment history regarding this account is inaccurate. Specifically, the late payment reported is incorrect. I have maintained a record of on-time payments for this account. Please verify this with the creditor's payment records and correct my file.",
        'Account was paid on time': "This account is marked as late, but it was paid on time. I dispute this negative status. Please investigate the payment posting dates and correct the reporting to 'Current' or 'Paid as Agreed'.",
        'Account balance is incorrect': "The balance listed for this account is incorrect. My records indicate a different balance. Please verify the current balance with the creditor and update the amount or remove the account if it cannot be verified.",
        'Account is older than 7 years': "This item is obsolete under the FCRA. The date of first delinquency is more than 7 years ago. Please remove this outdated negative item from my credit file immediately as required by law.",
        'Duplicate account listing': "This account appears to be listed twice on my credit report. It refers to the same debt. Please remove the duplicate listing to prevent double-counting of this liability.",
        'Account was closed by me': "This account is reported as 'Closed by Grantor' or similar, but it was closed by my request. Please update the status to 'Closed by Consumer' to accurately reflect the account history.",
        'Identity theft/fraud': "I am a victim of identity theft. This account was opened fraudulently without my authorization. I have enclosed a copy of my identity theft report/affidavit. Please block this information from my credit report pursuant to section 605B of the FCRA."
    };

    const handleReasonChange = (reason: string) => {
        setData(prev => ({
            ...prev,
            disputeReason: reason,
            explanation: reasonTemplates[reason] || prev.explanation // Auto-fill if empty or template exists
        }));
    };

    const generateLetter = () => {
        if (!bureau) return '';

        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        return `${data.yourName}
${data.address}
${data.city}, ${data.state} ${data.zip}

${today}

${bureauAddresses[bureau]}

RE: Formal Dispute of Inaccurate Information
SSN: XXX-XX-${data.ssn.slice(-4)}
Date of Birth: ${data.dob}

Dear Sir or Madam:

I am writing to dispute inaccurate information appearing on my credit report. Under the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681, I have the right to dispute incomplete or inaccurate information, and you are required to conduct a reasonable investigation.

DISPUTED ITEM:
Creditor/Account Name: ${data.accountName}
Account Number: ${data.accountNumber}
Reason for Dispute: ${data.disputeReason}

EXPLANATION:
${data.explanation}

Under 15 U.S.C. § 1681i(a)(1)(A), you must investigate this dispute within 30 days of receipt. If the information cannot be verified as accurate, it must be deleted from my credit file pursuant to 15 U.S.C. § 1681i(a)(5)(A).

I request that you:
1. Conduct a thorough investigation of the disputed item
2. Contact the furnisher to verify the accuracy of this information
3. Provide me with written results of your investigation
4. Remove this item if it cannot be verified as accurate and complete

Enclosed are copies of documents supporting my dispute. Please update my credit report and send me a corrected copy once the investigation is complete.

I expect compliance with the FCRA and look forward to your prompt response within the statutory 30-day period.

Sincerely,

${data.yourName}

---
ENCLOSURES:
- Copy of driver's license or state ID
- Copy of utility bill or bank statement (address verification)
- Supporting documentation for dispute

---
IMPORTANT NOTICE:
This letter was generated using Credit U™ educational tools. It is based on your legal rights under the Fair Credit Reporting Act (FCRA). This is not legal advice. For complex disputes, consult a consumer law attorney.

Sources:
- 15 U.S.C. § 1681 et seq. (Fair Credit Reporting Act)
- Consumer Financial Protection Bureau (consumerfinance.gov)
- Federal Trade Commission (ftc.gov/credit)
`;
    };

    const downloadLetter = () => {
        const letter = generateLetter();
        const blob = new Blob([letter], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Credit_Dispute_Letter_${bureau}_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        // Save to History
        if (bureau) {
            const newEntry = {
                date: new Date().toLocaleDateString(),
                bureau: bureau,
                account: data.accountName || 'Unknown Account'
            };
            const updatedHistory = [newEntry, ...history];
            setHistory(updatedHistory);
            localStorage.setItem('dispute_history', JSON.stringify(updatedHistory));
        }
    };

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-heading font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            FCRA Dispute Letter Generator
                        </h1>
                        <p className="text-slate-400">
                            Generate legally compliant dispute letters based on the Fair Credit Reporting Act.
                        </p>
                    </div>
                </div>

                {/* Dispute History (New Feature) */}
                {history.length > 0 && step === 1 && (
                    <div className="mb-8 bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Clock className="w-3 h-3" /> Recent Disputes
                        </h3>
                        <div className="space-y-2">
                            {history.slice(0, 3).map((h, i) => (
                                <div key={i} className="flex justify-between items-center text-sm p-2 hover:bg-white/5 rounded">
                                    <div className="flex items-center gap-3">
                                        <span className="text-indigo-400 font-bold capitalize">{h.bureau}</span>
                                        <span className="text-slate-300">{h.account}</span>
                                    </div>
                                    <span className="text-slate-500 text-xs">{h.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex items-center flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-500'
                                }`}>
                                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                            </div>
                            {s < 4 && <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-indigo-600' : 'bg-white/10'}`} />}
                        </div>
                    ))}
                </div>

                {/* Step 1: Select Bureau */}
                {step === 1 && (
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">Select Credit Bureau</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                {(['experian', 'equifax', 'transunion'] as const).map((b) => (
                                    <button
                                        key={b}
                                        onClick={() => { setBureau(b); setStep(2); }}
                                        className={`p-6 rounded-xl border-2 transition-all ${bureau === b
                                            ? 'border-indigo-500 bg-indigo-500/20'
                                            : 'border-white/10 bg-white/5 hover:border-indigo-500/50'
                                            }`}
                                    >
                                        <div className="text-lg font-bold capitalize mb-2">{b}</div>
                                        <div className="text-xs text-slate-400 whitespace-pre-line">{bureauAddresses[b]}</div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Personal Information */}
                {step === 2 && (
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">Your Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-white">Full Name</Label>
                                    <Input
                                        value={data.yourName}
                                        onChange={(e) => setData({ ...data, yourName: e.target.value })}
                                        className="bg-white/10 border-white/20 text-white"
                                    />
                                </div>
                                <div>
                                    <Label className="text-white">Street Address</Label>
                                    <Input
                                        value={data.address}
                                        onChange={(e) => setData({ ...data, address: e.target.value })}
                                        className="bg-white/10 border-white/20 text-white"
                                    />
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <Label className="text-white">City</Label>
                                        <Input
                                            value={data.city}
                                            onChange={(e) => setData({ ...data, city: e.target.value })}
                                            className="bg-white/10 border-white/20 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white">State</Label>
                                        <Input
                                            value={data.state}
                                            onChange={(e) => setData({ ...data, state: e.target.value })}
                                            className="bg-white/10 border-white/20 text-white"
                                            maxLength={2}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white">ZIP Code</Label>
                                        <Input
                                            value={data.zip}
                                            onChange={(e) => setData({ ...data, zip: e.target.value })}
                                            className="bg-white/10 border-white/20 text-white"
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-white">Last 4 of SSN</Label>
                                        <Input
                                            value={data.ssn}
                                            onChange={(e) => setData({ ...data, ssn: e.target.value })}
                                            className="bg-white/10 border-white/20 text-white"
                                            maxLength={4}
                                            placeholder="1234"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white">Date of Birth</Label>
                                        <Input
                                            type="date"
                                            value={data.dob}
                                            onChange={(e) => setData({ ...data, dob: e.target.value })}
                                            className="bg-white/10 border-white/20 text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                                <Button onClick={() => setStep(3)} className="flex-1">Continue</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Dispute Details */}
                {step === 3 && (
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Dispute Details</h2>
                                <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                    <CheckCircle className="w-3 h-3" /> Smart Templates Active
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label className="text-white">Account/Creditor Name</Label>
                                    <Input
                                        value={data.accountName}
                                        onChange={(e) => setData({ ...data, accountName: e.target.value })}
                                        className="bg-white/10 border-white/20 text-white"
                                        placeholder="e.g., ABC Credit Card Company"
                                    />
                                </div>
                                <div>
                                    <Label className="text-white">Account Number (last 4 digits)</Label>
                                    <Input
                                        value={data.accountNumber}
                                        onChange={(e) => setData({ ...data, accountNumber: e.target.value })}
                                        className="bg-white/10 border-white/20 text-white"
                                        placeholder="XXXX-XXXX-XXXX-1234"
                                    />
                                </div>
                                <div>
                                    <Label className="text-white">Reason for Dispute</Label>
                                    <select
                                        value={data.disputeReason}
                                        onChange={(e) => handleReasonChange(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/20 text-white rounded-md p-2 focus:border-indigo-500 outline-none"
                                    >
                                        <option value="" className="bg-slate-900 text-slate-500">Select a reason...</option>
                                        {disputeReasons.map((reason) => (
                                            <option key={reason} value={reason} className="bg-slate-900 text-white">{reason}</option>
                                        ))}
                                    </select>
                                    <p className="text-[10px] text-slate-400 mt-1">Selecting a reason will auto-generate a legal explanation below.</p>
                                </div>
                                <div>
                                    <Label className="text-white">Detailed Explanation</Label>
                                    <textarea
                                        value={data.explanation}
                                        onChange={(e) => setData({ ...data, explanation: e.target.value })}
                                        className="w-full bg-white/10 border border-white/20 text-white rounded-md p-3 min-h-[120px] font-mono text-sm"
                                        placeholder="Provide specific details about why this information is inaccurate..."
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                                <Button onClick={() => setStep(4)} className="flex-1">Generate Letter</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 4: Review & Download */}
                {step === 4 && (
                    <div className="space-y-6">
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold">Your Dispute Letter</h2>
                                    <Button onClick={downloadLetter} className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white">
                                        <Download className="w-4 h-4" />
                                        Download Letter
                                    </Button>
                                </div>
                                <div className="bg-white text-black p-8 rounded shadow-lg font-serif text-sm whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                                    {generateLetter()}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-amber-500/10 border-amber-500/20">
                            <CardContent className="p-4">
                                <div className="flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-amber-200/90 space-y-2">
                                        <p><strong>Next Steps:</strong></p>
                                        <ol className="list-decimal list-inside space-y-1 ml-2">
                                            <li>Print this letter and sign it</li>
                                            <li>Make copies for your records</li>
                                            <li>Gather supporting documents (ID, proof of address, evidence)</li>
                                            <li>Send via certified mail with return receipt requested</li>
                                            <li>Keep all receipts and tracking information</li>
                                            <li>Bureau must respond within 30 days per FCRA</li>
                                        </ol>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-4">
                            <Button variant="outline" onClick={() => setStep(3)}>Edit Details</Button>
                            <Button onClick={() => { setStep(1); setData({} as DisputeData); }} variant="outline">Start New Letter</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
