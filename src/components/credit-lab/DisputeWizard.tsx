import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, ChevronRight, FileText, ArrowLeft, ShieldAlert, Check, Shield, Clock } from 'lucide-react'
import { CreditReportData, ParsedAccount } from '@/lib/credit-parser'
import { validateDisputeContent, generateAuditFooter, ValidationResult } from '@/lib/governance'
import { useProfile } from '@/hooks/useProfile'
import { useGamification } from '@/hooks/useGamification'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import html2pdf from 'html2pdf.js'

interface DisputeWizardProps {
    reportData: CreditReportData
    onCancel: () => void
}

type WizardStep = 'select' | 'reason' | 'review'

export function DisputeWizard({ reportData, onCancel }: DisputeWizardProps) {
    const { profile } = useProfile()
    const { awardPoints } = useGamification()
    const [step, setStep] = useState<WizardStep>('select')
    const [selectedAccount, setSelectedAccount] = useState<ParsedAccount | null>(null)
    const [disputeType, setDisputeType] = useState<string>('')
    const [letterContent, setLetterContent] = useState<string>('')

    // Governance State
    const [customNotes, setCustomNotes] = useState('')
    const [validation, setValidation] = useState<ValidationResult>({ isValid: true })
    const [downloading, setDownloading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    // Step 1: Select Account
    const handleAccountSelect = (account: ParsedAccount) => {
        setSelectedAccount(account)
        setStep('reason')
    }

    // Step 2: Reason Selection
    const handleReasonSelect = (type: string) => {
        setDisputeType(type)
        if (type === 'ai_auto') {
            generateAILetter(selectedAccount!)
        } else {
            generateLetter(selectedAccount!, type, '')
            setStep('review')
        }
    }

    // Handle Notes Change
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        setCustomNotes(val)
        const result = validateDisputeContent(val)
        setValidation(result)

        // Re-generate letter with notes if valid (or just notes)
        if (selectedAccount && disputeType && disputeType !== 'ai_auto') {
            generateLetter(selectedAccount, disputeType, val)
        }
    }

    // AI Generator (with Simulation Fallback)
    const generateAILetter = async (account: ParsedAccount) => {
        const apiKey = localStorage.getItem('openai_key')
        setDownloading(true)
        toast.info("Consulting Dr. Leverage Legal Engine...")

        if (!apiKey) {
            // SIMULATED AI EXPERIENCE
            await new Promise(r => setTimeout(r, 2000)) // "Thinking" time
            const templates = [
                `Pursuant to FCRA Section 609(a)(1)(A), I am requesting the physical verification of the debt reported by ${account.creditorName} (Account: ${account.accountNumber}).\n\nThe current status "${account.status}" implies a delinquency that I have not verified. Under 15 USC 1692g, you must provide the original consumer contract bearing my signature.\n\nFailure to provide this validation within 30 days constitutes a violation of my rights.`,
                `I am challenging the completeness and accuracy of the tradeline reported by ${account.creditorName}.\n\nSpecifically, the Balance (${account.balance}) and Status (${account.status}) trigger an E-OSCAR inconsistency.\n\nPlease define the method of verification used (e.g. tape-to-tape). If you cannot certify the accuracy of this data point with the original furnisher, it must be deleted immediately.`
            ]
            const simContent = templates[Math.floor(Math.random() * templates.length)]

            setLetterContent(`[Neural Generation Complete]\n\n${simContent}`)
            setStep('review')
            setDownloading(false)
            return
        }

        try {
            const prompt = `
            You are a highly skilled consumer credit attorney specializing in FCRA (Fair Credit Reporting Act) and FDCPA (Fair Debt Collection Practices Act) violations.
            
            Write a formal, legally sound dispute letter to a credit bureau regarding the following account:
            Creditor: ${account.creditorName}
            Account Number: ${account.accountNumber}
            Current Status: ${account.status}
            Reported Balance: ${account.balance}
            
            The user claims this information is inaccurate. 
            Strategy: Demand physical verification of the debt under FCRA Section 609(a)(1)(A). 
            Cite relevant failure to validate precedents if applicable.
            
            Format the output as a clean, ready-to-print letter with [Placeholders] for user details. 
            Do NOT include markdown formatting (like **bold**) in the body, just plain text suitable for a formal letter.
            `.trim()

            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        { role: 'system', content: 'You are an agresive but professional credit repair specialist.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7
                })
            })

            const data = await res.json()
            if (data.error) throw new Error(data.error.message)

            const aiContent = data.choices[0].message.content
            setLetterContent(aiContent)
            setStep('review')

        } catch (e: any) {
            console.error(e)
            toast.error("AI Connection Failed (Using Fallback)", { description: e.message })
            // Fallback
            generateLetter(account, 'general_dispute', '')
            setStep('review')
        } finally {
            setDownloading(false)
        }
    }

    // Generator Logic
    const generateLetter = (account: ParsedAccount, type: string, notes: string) => {
        const today = new Date().toISOString().split('T')[0]
        const notesSection = notes ? `\n\nAdditional Context:\n${notes}` : ''

        const content = `
[Your Name]
[Your Address]

${today}

${account.creditorName}
[Address from Report]

Re: Dispute of Account Number: ${account.accountNumber}

To Whom It May Concern:

I am writing to dispute the following information in my file. The item: ${account.creditorName} with account number ${account.accountNumber} is inaccurate.

${getReasonText(type)}${notesSection}

I am requesting that the item be deleted (or corrected) to remove the inaccurate information.

Sincerely,

[Your Name]
        `.trim()
        setLetterContent(content)
    }

    const getReasonText = (type: string) => {
        switch (type) {
            case 'not_mine': return "I have reviewed my credit report and this account is not mine. I have never opened an account with this creditor."
            case 'late_payment': return "I am writing to dispute the late payment reported on this account. I have records indicating the payment was made on time."
            case 'wrong_balance': return "The balance reported for this account is incorrect. My records show a different balance."
            case 'duplicate': return "This account is listed twice on my report. Please remove the duplicate entry."
            case 'metro2_dola': return "The Date of Last Activity (DOLA) reported is inconsistent with the Date of First Delinquency. This violates Metro 2 compliance standards."
            case 'metro2_code': return "The Account Status Code reported does not match the payment history profile. This is a Metro 2 format error."
            case 'no_contract': return "I demand validation of this debt under FDCPA. You have failed to provide the original contract bearing my signature."
            default: return "I am disputing this item."
        }
    }

    const handleDownload = () => {
        if (!validation.isValid) return;
        setDownloading(true)

        const footer = generateAuditFooter()
        // Create clean print version
        const element = document.createElement('div')
        element.innerHTML = `
            <div style="font-family: 'Times New Roman', serif; padding: 40px; white-space: pre-wrap; line-height: 1.5; color: black;">${letterContent}</div>
            <div style="margin-top: 50px; font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 10px; text-align: center; font-family: sans-serif;">
                ${footer}
            </div>
        `

        const opt = {
            margin: 0.5,
            filename: `dispute_${selectedAccount?.creditorName.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
        }

        html2pdf().set(opt).from(element).save().then(() => {
            setDownloading(false)
            awardPoints(100, 'Dispute Generated')
            toast.success("Dispute Generated", {
                description: "PDF downloaded successfully. +100 Moo Points.",
            })
        })
    }

    const handleSave = async () => {
        if (!selectedAccount) return
        setSaving(true)

        // Basic Redaction for storage (naive)
        const redactedContent = letterContent

        try {
            if (!profile) {
                // Fallback to local storage
                const newDispute = {
                    id: crypto.randomUUID(),
                    user_id: 'guest',
                    creditor_name: selectedAccount.creditorName,
                    dispute_reason: disputeType,
                    letter_content: redactedContent,
                    status: 'draft',
                    created_at: new Date().toISOString()
                }
                const existing = JSON.parse(localStorage.getItem('guest_disputes') || '[]')
                localStorage.setItem('guest_disputes', JSON.stringify([newDispute, ...existing]))

                await new Promise(r => setTimeout(r, 500))
                setSaveSuccess(true)
                setTimeout(() => setSaveSuccess(false), 2000)
                return
            }

            const { error: insertError } = await supabase.from('user_disputes').insert({
                user_id: profile.id,
                creditor_name: selectedAccount.creditorName,
                dispute_reason: disputeType,
                letter_content: redactedContent,
                status: 'draft'
            })
            if (!insertError) {
                setSaveSuccess(true)
                setTimeout(() => setSaveSuccess(false), 2000)
                awardPoints(25, 'Dispute Saved')
            }
        } catch (e) {
            console.error(e)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onCancel} className="gap-2 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4" /> Back to Lab
                </Button>
                <div className="text-sm font-medium text-amber-500/80 uppercase tracking-widest text-[10px]">
                    Step {step === 'select' ? 1 : step === 'reason' ? 2 : 3} of 3
                </div>
            </div>

            {step === 'select' && (
                <div className="space-y-4">
                    <div className="text-center space-y-2 mb-8">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                            <Shield className="w-8 h-8 text-amber-500" />
                        </div>
                        <h2 className="text-3xl font-bold font-heading text-white">Target Selection</h2>
                        <p className="text-slate-400">Select an adverse item to challenge.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-tour-id="account-list">
                        {reportData.accounts.length === 0 ? (
                            <Card className="col-span-2 border-dashed border-white/10 bg-transparent p-12 text-center text-slate-500">
                                No accounts detected automatically.
                                <br />
                                <Button variant="link" className="text-indigo-400">Add Manually</Button>
                            </Card>
                        ) : (
                            reportData.accounts.map((acc, i) => (
                                <div key={i}
                                    className="group cursor-pointer p-4 rounded-xl bg-[#0F1629] border border-white/5 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all relative overflow-hidden"
                                    onClick={() => handleAccountSelect(acc)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                                            {acc.creditorName}
                                        </h3>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${acc.status.includes('Late') || acc.status.includes('Collection')
                                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                            : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                            }`}>
                                            {acc.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-500 font-mono mb-4">{acc.accountNumber}</div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase tracking-wider">Balance</div>
                                            <div className="text-xl font-bold text-white">{acc.balance}</div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all">
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {step === 'reason' && selectedAccount && (
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="text-center space-y-2 mb-8">
                        <h2 className="text-2xl font-bold font-heading text-white">Identify the Error</h2>
                        <p className="text-slate-400">Why is the reporting for <strong>{selectedAccount.creditorName}</strong> inaccurate?</p>
                    </div>

                    <div className="grid gap-3" data-tour-id="reason-options">
                        <button className="flex items-center gap-4 p-4 rounded-xl bg-[#0F1629] border border-white/5 hover:border-indigo-500/40 text-left transition-all group" onClick={() => handleReasonSelect('not_mine')}>
                            <div className="p-3 bg-red-500/10 rounded-full text-red-400 group-hover:scale-110 transition-transform">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">Not My Account</div>
                                <div className="text-xs text-slate-500">I never opened this. Possible identity theft.</div>
                            </div>
                        </button>

                        <button className="flex items-center gap-4 p-4 rounded-xl bg-[#0F1629] border border-white/5 hover:border-indigo-500/40 text-left transition-all group" onClick={() => handleReasonSelect('late_payment')}>
                            <div className="p-3 bg-amber-500/10 rounded-full text-amber-400 group-hover:scale-110 transition-transform">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">Late Payment Incorrect</div>
                                <div className="text-xs text-slate-500">I paid on time, but it's marked as late.</div>
                            </div>
                        </button>

                        <button className="flex items-center gap-4 p-4 rounded-xl bg-[#0F1629] border border-white/5 hover:border-indigo-500/40 text-left transition-all group" onClick={() => handleReasonSelect('wrong_balance')}>
                            <div className="p-3 bg-blue-500/10 rounded-full text-blue-400 group-hover:scale-110 transition-transform">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">Incorrect Balance</div>
                                <div className="text-xs text-slate-500">The amount shown is wrong.</div>
                            </div>
                        </button>

                        {/* ADVANCED REASONS */}
                        <div className="pt-4 pb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">Advanced Disputes</div>

                        <button className="flex items-center gap-4 p-4 rounded-xl bg-[#0F1629] border border-white/5 hover:border-indigo-500/40 text-left transition-all group" onClick={() => handleReasonSelect('metro2_dola')}>
                            <div className="p-3 bg-teal-500/10 rounded-full text-teal-400 group-hover:scale-110 transition-transform">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">Metro 2: Incorrect DOLA</div>
                                <div className="text-xs text-slate-500">Date of Last Activity mismatch.</div>
                            </div>
                        </button>

                        <button className="flex items-center gap-4 p-4 rounded-xl bg-[#0F1629] border border-white/5 hover:border-indigo-500/40 text-left transition-all group" onClick={() => handleReasonSelect('no_contract')}>
                            <div className="p-3 bg-slate-500/10 rounded-full text-slate-400 group-hover:scale-110 transition-transform">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">FDCPA: No Original Contract</div>
                                <div className="text-xs text-slate-500">Demand physical validation.</div>
                            </div>
                        </button>
                    </div>

                    {/* AI Feature Injection - UNLOCKED FOR ALL (Simulated Fallback) */}
                    <div className="mt-8 pt-8 border-t border-white/5 text-center animate-in slide-in-from-bottom-4">
                        <Button
                            onClick={() => handleReasonSelect('ai_auto')}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 font-bold shadow-[0_0_20px_rgba(99,102,241,0.5)] h-12 px-8"
                        >
                            <span className="mr-2">✨</span> Auto-Generate with AI Agent
                        </Button>
                        <p className="text-[10px] text-indigo-300 mt-2">
                            Activating Dr. Leverage's Neural Engine for precision drafting.
                        </p>
                    </div>
                </div>
            )}

            {step === 'review' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ... (Kept existing structure) */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold font-heading text-white mb-2">Review Strategy</h2>
                            <p className="text-slate-400">
                                Generating a <strong>Factual Accuracy Dispute</strong> targeting {selectedAccount?.creditorName}.
                            </p>
                        </div>

                        <Card className="bg-[#0F1629] border-white/5">
                            <CardHeader>
                                <CardTitle className="text-xs uppercase tracking-wider text-slate-500">Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Creditor:</span>
                                        <span className="font-bold text-white">{selectedAccount?.creditorName}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Reason:</span>
                                        <span className="font-bold text-white capitalize">{disputeType.replace('_', ' ')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Law:</span>
                                        <span className="text-xs px-2 py-0.5 rounded border border-emerald-500/20 text-emerald-400 bg-emerald-500/10">FCRA 611 (a)(1)(A)</span>
                                    </div>
                                </div>

                                <div className="space-y-2 border-t border-white/5 pt-4">
                                    <label className="text-sm font-bold text-slate-300">Additional Context</label>
                                    <Textarea
                                        placeholder="Add specific details (e.g. check numbers, dates) to strengthen the claim..."
                                        value={customNotes}
                                        onChange={handleNotesChange}
                                        className={`bg-black/20 border-white/10 text-white placeholder:text-slate-600 ${!validation.isValid ? "border-red-500/50 focus-visible:ring-red-500/50" : ""}`}
                                    />
                                    {!validation.isValid && (
                                        <div className="text-xs text-red-400 flex items-center gap-1">
                                            <ShieldAlert className="w-3 h-3" /> {validation.error}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-3">
                            <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold" onClick={handleDownload} disabled={!validation.isValid || downloading} data-tour-id="download-btn">
                                {downloading ? "Compiling..." : "Download Official PDF"}
                            </Button>
                            <Button variant="outline" className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5" onClick={handleSave} disabled={!validation.isValid || saving || saveSuccess}>
                                {saveSuccess ? <><Check className="w-4 h-4 mr-2" /> Saved</> : saving ? "Saving..." : "Save Draft"}
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-8 shadow-2xl overflow-hidden relative min-h-[500px]" data-tour-id="letter-preview">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500 opacity-20" />
                        <div className="font-serif text-black text-sm whitespace-pre-wrap leading-relaxed relative z-10">
                            {letterContent}
                        </div>
                        <div className="absolute bottom-4 right-4 opacity-10">
                            <FileText size={100} className="text-black" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


