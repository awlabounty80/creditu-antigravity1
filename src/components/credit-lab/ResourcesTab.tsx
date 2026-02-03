import { useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, BookOpen, ExternalLink, ShieldCheck, HelpingHand, HeartHandshake } from 'lucide-react'
import { generateAuditFooter } from '@/lib/governance'
import html2pdf from 'html2pdf.js'

export function ResourcesTab() {
    const [downloading, setDownloading] = useState<string | null>(null)

    const templates = [
        {
            id: 'goodwill',
            title: 'Goodwill Adjustment',
            icon: HeartHandshake,
            description: 'Request removal of a late payment record from an account with otherwise good history.',
            content: `[Your Name]
[Your Address]
[Date]

[Creditor Name]
[Creditor Address]

Re: Goodwill Adjustment Request
Account Number: [Account Number]

To Whom It May Concern:

I am writing to express my appreciation for the relationship I have had with your institution. I have been a loyal customer for [Number] years.

I am writing to respectfully request a "goodwill adjustment" regarding the late payment reported on [Date]. I normally pride myself on my financial responsibility, but at that time I experienced [Reason, e.g., an unexpected emergency].

Since then, I have maintained a perfect payment history. I am asking that you consider removing this single negative item from my credit report as a gesture of goodwill.

Thank you for your time and consideration.

Sincerely,

[Your Name]`
        },
        {
            id: 'pay_delete',
            title: 'Pay for Delete Offer',
            icon: HelpingHand,
            description: 'Negotiate to pay a collection account in full or partial exchange for its deletion.',
            content: `[Your Name]
[Your Address]
[Date]

[Collection Agency Name]
[Address]

Re: Account Number [Account Number]

To Whom It May Concern:

I am writing regarding the above-referenced account. I am willing to pay this account in the amount of $[Amount] as settlement in full, PROVIDED THAT you agree to delete this account from all credit reporting agencies (Equifax, Experian, and TransUnion).

If you agree to these terms, please send me a signed letter on your company letterhead stating that upon receipt of payment, the account will be deleted from my credit file.

Upon receipt of this written agreement, I will immediately send the payment via [Method].

Sincerely,

[Your Name]`
        },
        {
            id: 'validation',
            title: 'Debt Validation',
            icon: ShieldCheck,
            description: 'Demand proof that a debt is valid and that the collector has the right to collect it.',
            content: `[Your Name]
[Your Address]
[Date]

[Collection Agency Name]
[Address]

Re: Validation of Debt
Account Number: [Account Number]

To Whom It May Concern:

I am writing in response to your communication regarding the above-referenced account. I am requesting validation of this debt pursuant to the Fair Debt Collection Practices Act (FDCPA).

Please provide me with the following:
1. Proof that I owe this debt.
2. The name and address of the original creditor.
3. Proof that you are licensed to collect debts in my state.

Until this debt is validated, you must cease all collection activity and stop reporting this debt to any credit reporting agency.

Sincerely,

[Your Name]`
        }
    ]

    const handleDownload = (template: typeof templates[0]) => {
        setDownloading(template.id)
        const footer = generateAuditFooter()

        const element = document.createElement('div')
        element.innerHTML = `
            <div style="font-family: monospace; padding: 40px; white-space: pre-wrap;">${template.content}</div>
            <div style="margin-top: 50px; font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 10px; text-align: center;">
                ${footer}
            </div>
        `

        const opt = {
            margin: 0.5,
            filename: `${template.id}_template.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
        }

        html2pdf().set(opt).from(element).save().then(() => {
            setDownloading(null)
        })
    }

    return (
        <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold font-heading mb-2 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" /> Template Library
                        </h3>
                        <p className="text-muted-foreground text-sm">Professional templates for manual disputes.</p>
                    </div>
                    <div className="grid gap-4">
                        {templates.map(t => (
                            <Card key={t.id} className="hover:border-primary transition-colors cursor-pointer group" onClick={() => handleDownload(t)}>
                                <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                                    <div className="p-2 bg-primary/10 rounded-md text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <t.icon className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <CardTitle className="text-base">{t.title}</CardTitle>
                                        <CardDescription className="text-xs">{t.description}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardFooter className="pt-2 justify-end">
                                    <Button size="sm" variant="ghost" className="h-8 gap-2 text-primary" disabled={downloading === t.id}>
                                        {downloading === t.id ? "Generating..." : <><Download className="w-3 h-3" /> Download PDF</>}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold font-heading mb-2 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" /> Education Center
                        </h3>
                        <p className="text-muted-foreground text-sm">Learn how to master the credit system.</p>
                    </div>

                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                        <CardHeader>
                            <CardTitle className="text-blue-900">Understanding Disputes</CardTitle>
                            <CardDescription className="text-blue-700">
                                Learn the legal framework behind credit repair (FCRA/FDCPA) and your rights as a consumer.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = '/curriculum'}>
                                <ExternalLink className="w-4 h-4" /> Go to Course 102
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>The 30% Rule</CardTitle>
                            <CardDescription>
                                Why utilization is the second biggest factor in your score and how to manage it.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button variant="outline" className="w-full gap-2" onClick={() => window.location.href = '/curriculum'}>
                                <ExternalLink className="w-4 h-4" /> Go to Course 101
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
