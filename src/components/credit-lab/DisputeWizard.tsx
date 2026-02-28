import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
    ChevronRight, FileText, ArrowLeft, ShieldAlert, Check, Shield, Clock, Upload, Loader2,
    Scale, Zap, Brain
} from 'lucide-react'
import { CreditReportData, ParsedAccount, parseCreditReport } from '@/lib/credit-parser'
import { validateDisputeContent, generateAuditFooter, ValidationResult } from '@/lib/governance'
import { useProfile } from '@/hooks/useProfile'
import { useGamification } from '@/hooks/useGamification'
import { toast } from 'sonner'
import html2pdf from 'html2pdf.js'

// ------------------------------------------------------------------
// ADVANCED LEGAL TEMPLATES (INSTITUTION-GRADE)
// ------------------------------------------------------------------
const LEGAL_TEMPLATES: Record<string, string[]> = {
    'general': [
        "Pursuant to FCRA Section 609(a)(1)(A), I am requesting the physical verification of the debt reported. The current status implies a delinquency that I have not verified. Under 15 USC 1692g, you must provide the original consumer contract bearing my signature."
    ],
    'collection': [
        "I am challenging this collection account under FDCPA Section 809(b). The debt collector has failed to provide validation of the debt within the statutory 30-day period. Furthermore, the reporting of this item without proper validation constitutes a violation of FCRA Section 623(b).",
        "Demand for Validation: Please provide proof of assignment, the original account agreement, and a complete accounting ledger. If these cannot be produced, delete this item immediately in accordance with 15 U.S.C. § 1681i."
    ],
    'late_payment': [
        "I am disputing the late payment notations on this account. I maintain strict records, and this payment was submitted on or before the due date. The reporting of inaccurate late payments violates FCRA Section 611(a). Please verify with the creditor using the Metro 2 standard 'Account Information' segment.",
        "Goodwill Adjustment Request: I have been a loyal customer for years. This isolated late payment does not reflect my creditworthiness. I respectfully request a goodwill adjustment to remove this negative mark."
    ],
    'bankruptcy': [
        "This account was included in a Chapter 7 Bankruptcy (Case #[CASE_NUMBER]) and discharged on [DATE]. Reporting it with a balance or 'Past Due' status violates the permanent discharge injunction under 11 U.S.C. § 524. Update status to 'Discharged' with $0 balance immediately.",
        "Method of Verification Dispute: How did you verify this bankruptcy item? Public records are not sufficient verification under *Stevenson v. TRW Inc.* (987 F.2d 288). I demand you verify this with the court directly, not via a third-party aggregator like LexisNexis."
    ],
    'medical': [
        "This medical debt reporting violates the recent CFPB guidance and potentially the No Surprises Act. Furthermore, HIPAA regulations restrict the sharing of my medical information. Please prove you have a signed HIPAA release authorizing the display of this medical account on my commercial credit file.",
        "Under the new FCRA rules, paid medical collection debt must be removed. If this debt is paid or settled, delete it immediately. If unpaid, provide a breakdown of charges to verify it is not billing fraud."
    ],
    'inquiry': [
        "I did not authorize this hard inquiry. Under FCRA Section 604, a permissible purpose is required to access my report. I have no record of initiating a transaction with this entity. Remove this inquiry immediately as it is a result of identity fraud or clerical error.",
        "Permissible Purpose Challenge: Please provide the signed application or court order that granted you permissible purpose to access my credit file on this date."
    ]
};

interface DisputeWizardProps {
    reportData: CreditReportData
    onCancel: () => void
}

type WizardStep = 'select' | 'reason' | 'review'

export function DisputeWizard({ reportData, onCancel }: DisputeWizardProps) {
    useProfile()
    // @ts-ignore
    const { awardPoints } = useGamification()
    const [step, setStep] = useState<WizardStep>('select')
    const [accounts, setAccounts] = useState<ParsedAccount[]>(reportData.accounts)

    // MULTI-SELECT STATE
    const [selectedAccountIds, setSelectedAccountIds] = useState<Set<string>>(new Set())

    const [, setDisputeType] = useState<string>('')
    const [letterContent, setLetterContent] = useState<string>('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    // Sync with prop updates
    useEffect(() => {
        setAccounts(reportData.accounts)
    }, [reportData.accounts])

    // Governance State
    const [customNotes, setCustomNotes] = useState('')
    const [validation, setValidation] = useState<ValidationResult>({ isValid: true })
    const [downloading, setDownloading] = useState(false)

    // Strategy HUD State
    const [strategyLaw, setStrategyLaw] = useState<string>('FCRA 611')
    const [successProbability, setSuccessProbability] = useState<number>(0)


    // Handle File Upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsAnalyzing(true)
        toast.info("Initializing Quantum Parser...")

        try {
            const data = await parseCreditReport(file)
            if (data.accounts.length > 0) {
                setAccounts(prev => [...data.accounts, ...prev])

                // SYNC WITH PLATFORM
                localStorage.setItem('credit_report_data', JSON.stringify({
                    timestamp: new Date().toISOString(),
                    accounts: [...data.accounts],
                    score: data.score || "N/A"
                }));

                // AUTO-SELECT NEGATIVE ACCOUNTS ("The Magic")
                const negativeKeywords = ['late', 'collection', 'charge', 'past due', 'repossession', 'foreclosure', 'bankruptcy'];
                const autoSelected = new Set(selectedAccountIds);
                let autoCount = 0;

                data.accounts.forEach(acc => {
                    const status = acc.status.toLowerCase();
                    const isNegative = negativeKeywords.some(keyword => status.includes(keyword));

                    if (isNegative) {
                        const id = acc.accountNumber || acc.creditorName;
                        autoSelected.add(id);
                        autoCount++;
                    }
                });

                if (autoCount > 0) {
                    setSelectedAccountIds(autoSelected);
                    toast.success("Analysis Complete & Synced", {
                        description: `Auto-selected ${autoCount} negative items for dispute.`
                    });
                } else {
                    toast.success("Analysis Complete", { description: "No obvious negative items found. Select accounts manually." });
                }

            } else {
                toast.warning("No standard tradelines detected. Try a manual add.")
            }
        } catch (err) {
            console.error(err)
            toast.error("Parsing Failed: Encrypted/Invalid Format")
        } finally {
            setIsAnalyzing(false)
        }
    }

    // Step 1: Select Account (Toggle)
    const toggleAccount = (account: ParsedAccount) => {
        const newSet = new Set(selectedAccountIds);
        const id = account.accountNumber || account.creditorName; // Fallback ID

        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedAccountIds(newSet);
    }

    const selectAll = () => {
        if (selectedAccountIds.size === accounts.length) {
            setSelectedAccountIds(new Set());
        } else {
            const newSet = new Set(accounts.map(a => a.accountNumber || a.creditorName));
            setSelectedAccountIds(newSet);
        }
    }

    const handleProceedToReason = () => {
        if (selectedAccountIds.size === 0) {
            toast.error("Select at least one account to dispute.");
            return;
        }
        setStep('reason');
    }

    // Step 2: Reason Selection
    const handleReasonSelect = (type: string) => {
        setDisputeType(type)
        if (type === 'ai_auto') {
            generateBatchAILetter()
        } else {
            generateBatchLetter(type, '')
            setStep('review')
        }
    }

    // GENERATOR: Helper to get accounts from IDs
    const getSelectedAccounts = () => {
        return accounts.filter(a => selectedAccountIds.has(a.accountNumber || a.creditorName));
    }

    // AI Generator (Batch Mode)
    const generateBatchAILetter = async () => {
        setDownloading(true)
        toast.info(`Dr. Leverage is analyzing ${selectedAccountIds.size} accounts...`)

        const targetAccounts = getSelectedAccounts();

        // Simulate Thinking
        setTimeout(() => {
            const fullLetter = finalizeBatchLetter(targetAccounts, 'ai_auto');
            setLetterContent(fullLetter);

            // Update HUD
            setStrategyLaw('Multi-Factor Legal Matrix');
            setSuccessProbability(88); // High confidence for custom AI letters

            setStep('review');
            setDownloading(false);
        }, 1500);
    }

    const generateBatchLetter = (type: string, notes: string) => {
        const targetAccounts = getSelectedAccounts();

        // Update HUD
        if (type === 'not_mine') {
            setStrategyLaw('FCRA 605B (Identity Theft)');
            setSuccessProbability(92);
        } else if (type === 'metro2_dola') {
            setStrategyLaw('Metro 2 Compliance Standards');
            setSuccessProbability(78);
        } else {
            setStrategyLaw('FCRA 611 (Procedure in case of disputed accuracy)');
            setSuccessProbability(60);
        }

        const fullLetter = finalizeBatchLetter(targetAccounts, type, notes);
        setLetterContent(fullLetter);
    }

    const finalizeBatchLetter = (targetAccounts: ParsedAccount[], type: string, notes: string = '') => {
        const today = new Date().toISOString().split('T')[0]
        const notesSection = notes ? `\n\nAdditional Context:\n${notes}` : ''

        // Generate the definition list of items
        const itemsSection = targetAccounts.map((acc, index) => {
            // Determine content for this specific item
            let content = "";
            let reasonTitle = "";

            if (type === 'ai_auto') {
                // Smart select based on account status
                let category = 'general';
                if (acc.status.toLowerCase().includes('collection')) category = 'collection';
                if (acc.status.toLowerCase().includes('late')) category = 'late_payment';
                if (acc.creditorName.toLowerCase().includes('hospital') || acc.creditorName.toLowerCase().includes('medical')) category = 'medical';
                if (acc.status.toLowerCase().includes('bankruptcy')) category = 'bankruptcy';

                const templates = LEGAL_TEMPLATES[category] || LEGAL_TEMPLATES['general'];
                content = templates[0]; // Use the first powerful template
                reasonTitle = category === 'collection' ? 'Unverified Debt / FDCPA Violation' :
                    category === 'late_payment' ? 'Inaccurate Late Payment Reporting' :
                        category === 'medical' ? 'HIPAA / No Contract' : 'Factual Inaccuracy';
            } else {
                content = getReasonText(type);
                reasonTitle = type === 'not_mine' ? 'Not My Account' : type === 'late_payment' ? 'Late Payment Error' : 'Factual Inaccuracy';
            }

            return `
ITEM #${index + 1}
Creditor: ${acc.creditorName}
Account Number: ${acc.accountNumber}
Reason: ${reasonTitle}
details: ${content}
            `.trim();
        }).join('\n\n----------------------------\n\n');

        return `[Your Name]
[Your Address]
[SSN: XXX-XX-XXXX]
[DOB: XX/XX/XXXX]

${today}

To Whom It May Concern:

I am writing to formally dispute the accuracy of the following items on my credit report. I have identified ${targetAccounts.length} separate instances of inaccurate, unverified, or incomplete information.

Pursuant to the Fair Credit Reporting Act (FCRA), I desire that you conduct a reasonable investigation into each of the items listed below:

${itemsSection}

${notesSection}

I demand that you investigate these matters immediately. If you cannot verify the accuracy of this information with the original furnisher or provide the requested documentation, Federal Law requires you to delete these items from my credit file within 30 days.

Please send me an updated copy of my credit report reflecting these deletions.

Sincerely,

[Your Name]`.trim()
    }

    const getReasonText = (type: string) => {
        const t = LEGAL_TEMPLATES;
        switch (type) {
            case 'not_mine': return t['inquiry'][0]; // Reusing inquiry template for general "not mine" auth
            case 'late_payment': return t['late_payment'][0];
            case 'wrong_balance': return "The balance reported for this account is incorrect. My records show a different balance. Please recalculate and verify the ledger.";
            case 'duplicate': return "This account is listed twice on my report. Double reporting falsely inflates my debt-to-income ratio. Please remove the duplicate entry immediately.";
            case 'metro2_dola': return "The Date of Last Activity (DOLA) reported is inconsistent with the Date of First Delinquency. This violates Metro 2 compliance standards for data integrity.";
            case 'metro2_code': return "The Account Status Code reported does not match the payment history profile. This is a Metro 2 format error and must be corrected or deleted.";
            case 'no_contract': return t['general'][0];
            default: return "I am disputing this item for factual inaccuracy.";
        }
    }

    // Handle Notes Change
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        setCustomNotes(val)
        const result = validateDisputeContent(val)
        setValidation(result)
    }

    const handleDownload = () => {
        if (!validation.isValid) return;
        setDownloading(true)
        const footer = generateAuditFooter()
        const element = document.createElement('div')
        element.innerHTML = `
            <div style="font-family: 'Times New Roman', serif; padding: 40px; white-space: pre-wrap; line-height: 1.5; color: black;">${letterContent}</div>
            <div style="margin-top: 50px; font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 10px; text-align: center; font-family: sans-serif;">
                ${footer}
            </div>
        `
        const opt = {
            margin: 0.5,
            filename: `dispute_batch_${selectedAccountIds.size}_items.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
        }
        html2pdf().set(opt).from(element).save().then(() => {
            setDownloading(false)
            // @ts-ignore
            awardPoints(100 * selectedAccountIds.size, 'Batch Dispute Generated')
            toast.success("Batch Dispute Generated", { description: `${selectedAccountIds.size} Items Processed. +${100 * selectedAccountIds.size} Moo Points.` })
        })
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 min-h-screen">
            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onCancel} className="gap-2 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4" /> Back to Lab
                </Button>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Powered by Dr. Leverage™</span>
                </div>
            </div>

            {/* STEP 1: SELECT */}
            {step === 'select' && (
                <div className="space-y-6">
                    <div className="text-center space-y-2 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)] animate-pulse">
                            <Shield className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h2 className="text-3xl font-bold font-heading text-white">Target Selection</h2>
                        <p className="text-slate-400">Select multiple adverse items to challenge simultaneously.</p>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-2">
                            <Button variant="ghost" onClick={selectAll} className="text-xs text-slate-400 hover:text-white">
                                {selectedAccountIds.size === accounts.length ? "Deselect All" : "Select All"}
                            </Button>
                        </div>

                        {selectedAccountIds.size > 0 && (
                            <Button onClick={handleProceedToReason} className="bg-indigo-600 hover:bg-indigo-500 text-white animate-in slide-in-from-right-4">
                                Generate Dispute ({selectedAccountIds.size}) <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 1. GET REPORT CARD */}
                        <div
                            className="group cursor-pointer p-6 rounded-xl bg-gradient-to-br from-indigo-900/40 to-black border border-indigo-500/30 hover:border-indigo-400 transition-all flex flex-col items-center justify-center text-center gap-3 min-h-[160px] relative overflow-hidden"
                            onClick={() => window.open('https://myfreescorenow.com/enroll/?AID=TheCreditStore&PID=78496', '_blank')}
                        >
                            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">STEP 1</div>
                            <div className="w-14 h-14 bg-indigo-500/20 rounded-full flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                <FileText className="w-7 h-7 text-indigo-400 group-hover:text-white" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors">Get 3-Bureau Report</h3>
                                <p className="text-xs text-slate-400 mt-1">Official Data Source (MyFreeScoreNow)</p>
                            </div>
                        </div>

                        {/* 2. IMPORT CARD */}
                        <div
                            className="group cursor-pointer p-6 rounded-xl bg-[#0F1629] border border-dashed border-white/20 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex flex-col items-center justify-center text-center gap-3 min-h-[160px] relative overflow-hidden"
                            onClick={() => document.getElementById('report-upload')?.click()}
                        >
                            <div className="absolute top-0 right-0 bg-slate-700 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">STEP 2</div>
                            {isAnalyzing ? (
                                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                            ) : (
                                <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors relative z-10">
                                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-white" />
                                </div>
                            )}
                            <div className="relative z-10">
                                <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{isAnalyzing ? "Syncing Platform..." : "Upload & Sync"}</h3>
                                <p className="text-xs text-slate-500">HTML / PDF Format</p>
                            </div>
                            <input type="file" id="report-upload" className="hidden" accept=".pdf,.html" onChange={handleFileUpload} disabled={isAnalyzing} />
                        </div>

                        {/* Accounts List */}
                        {accounts.map((acc, i) => {
                            const id = acc.accountNumber || acc.creditorName;
                            const isSelected = selectedAccountIds.has(id);

                            return (
                                <div key={i}
                                    className={`group cursor-pointer p-6 rounded-xl border transition-all duration-300 relative overflow-hidden select-none
                                        ${isSelected
                                            ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500'
                                            : 'bg-[#0F1629] border-white/5 hover:border-indigo-500/30'
                                        }
                                    `}
                                    onClick={() => toggleAccount(acc)}
                                >
                                    {/* Selection Checkbox Visual */}
                                    <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600 bg-transparent'}`}>
                                        {isSelected && <Check className="w-4 h-4 text-white" />}
                                    </div>

                                    <div className="flex justify-between items-start mb-4 pr-10">
                                        <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors truncate max-w-[85%]">
                                            {acc.creditorName}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${acc.status.includes('Late') || acc.status.includes('Collection') ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                                            {acc.status}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-mono">#{acc.accountNumber}</span>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase tracking-wider">Balance</div>
                                            <div className="text-2xl font-bold text-white font-mono">{acc.balance}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* STEP 2: REASON */}
            {step === 'reason' && (
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold font-heading text-white">Identify the Defect</h2>
                        <p className="text-slate-400">Dr. Leverage will select the optimal legal argument based on your input.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <button className="p-4 rounded-xl bg-[#0F1629] border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-left transition-all group" onClick={() => handleReasonSelect('not_mine')}>
                            <div className="flex items-center gap-3 mb-2">
                                <ShieldAlert className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-white">Not My Account</span>
                            </div>
                            <p className="text-xs text-slate-500">I never authorized these accounts. Potential Identity Theft.</p>
                        </button>

                        <button className="p-4 rounded-xl bg-[#0F1629] border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-left transition-all group" onClick={() => handleReasonSelect('late_payment')}>
                            <div className="flex items-center gap-3 mb-2">
                                <Clock className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-white">Late Payment</span>
                            </div>
                            <p className="text-xs text-slate-500">Payments were made on time, or late dates are wrong.</p>
                        </button>

                        <button className="p-4 rounded-xl bg-[#0F1629] border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-left transition-all group" onClick={() => handleReasonSelect('metro2_dola')}>
                            <div className="flex items-center gap-3 mb-2">
                                <Scale className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-white">Metro 2 Compliance</span>
                            </div>
                            <p className="text-xs text-slate-500">Date of Last Activity mismatch / Technical error.</p>
                        </button>

                        <button className="p-4 rounded-xl bg-[#0F1629] border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-left transition-all group" onClick={() => handleReasonSelect('no_contract')}>
                            <div className="flex items-center gap-3 mb-2">
                                <FileText className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-white">Demand Validation</span>
                            </div>
                            <p className="text-xs text-slate-500">Demand original contract signatures (FDCPA).</p>
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <Button
                            onClick={() => handleReasonSelect('ai_auto')}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold h-16 px-10 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.3)] transform hover:scale-105 transition-all w-full md:w-auto"
                        >
                            <Brain className="w-6 h-6 mr-3 animate-pulse" />
                            <span className="flex flex-col items-start text-left">
                                <span className="text-xs uppercase tracking-wider opacity-80">Recommended</span>
                                <span className="text-lg">Auto-Generate Legal Strategy ({selectedAccountIds.size} Items)</span>
                            </span>
                        </Button>
                    </div>
                </div>
            )}

            {/* STEP 3: REVIEW */}
            {step === 'review' && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full">
                    {/* LEFT PANEL: CONFIG */}
                    <div className="xl:col-span-4 space-y-6">
                        <Card className="bg-[#0F1629] border-white/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-amber-400" />
                                    Strategy HUD
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Primary Law</span>
                                        <span className="font-bold text-emerald-400 text-xs bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{strategyLaw}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Success Probability</span>
                                            <span className="font-bold text-white">{successProbability}%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-gradient-to-r from-red-500 to-emerald-500 h-full" style={{ width: `${successProbability}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Items Disputed</span>
                                        <span className="font-bold text-white">{selectedAccountIds.size}</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-white/5">
                                    <label className="text-sm font-bold text-slate-300">Custom Facts</label>
                                    <Textarea
                                        placeholder="Add proof (e.g. 'Paid on 10/12/23')..."
                                        value={customNotes}
                                        onChange={handleNotesChange}
                                        className="bg-black/20 border-white/10 text-white text-sm"
                                    />
                                </div>
                                <Button className="w-full bg-white text-black hover:bg-slate-200 font-bold" onClick={handleDownload} disabled={downloading}>
                                    {downloading ? "Proccessing..." : "Download Batch PDF"}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT PANEL: EDIT */}
                    <div className="xl:col-span-8">
                        <div className="bg-white rounded-xl p-8 sm:p-12 shadow-2xl overflow-hidden relative min-h-[600px] text-black">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-50" />
                            {/* Paper Texture Effect */}
                            <div className="font-serif text-[11pt] whitespace-pre-wrap leading-relaxed">
                                {letterContent}
                            </div>
                            <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between items-center opacity-50">
                                <div className="text-[9px] font-sans text-gray-500 uppercase tracking-widest">
                                    Generated by Ethereal Mariner Compliance Engine
                                </div>
                                <Scale className="w-6 h-6 text-gray-300" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
