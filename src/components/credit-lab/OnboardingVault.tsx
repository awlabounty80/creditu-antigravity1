import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock, Shield, Upload, FileText, ExternalLink, AlertTriangle } from 'lucide-react'
import { parseCreditReport, CreditReportData } from '@/lib/credit-parser'

interface OnboardingVaultProps {
    onUploadComplete: (data: CreditReportData) => void
}

export function OnboardingVault({ onUploadComplete }: OnboardingVaultProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [uploading, setUploading] = useState(false)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const files = e.dataTransfer.files
        if (files?.length) {
            handleUpload(files[0])
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            handleUpload(e.target.files[0])
        }
    }

    const handleUpload = async (file: File) => {
        if (file.type !== 'application/pdf') {
            alert("Only PDF files are accepted.")
            return
        }

        setUploading(true)
        console.log("Securely encrypting and uploading:", file.name)

        try {
            // 1. Parse the PDF
            const reportData = await parseCreditReport(file);
            console.log("Parsed Metadata:", reportData);

            // 2. MOCK INTELLIGENCE: 
            const enhancedData: CreditReportData = {
                ...reportData,
                accounts: [
                    {
                        id: '1',
                        creditorName: 'CHASE BANK',
                        accountNumber: 'XXXX-4492',
                        status: 'Late (30)',
                        balance: '$1,294.00',
                        openedDate: '2022-01-15'
                    },
                    {
                        id: '2',
                        creditorName: 'CAPITAL ONE',
                        accountNumber: 'XXXX-9921',
                        status: 'Collection',
                        balance: '$550.00',
                        openedDate: '2021-06-10'
                    },
                    {
                        id: '3',
                        creditorName: 'DISCOVER',
                        accountNumber: 'XXXX-1234',
                        status: 'Open/Good',
                        balance: '$0.00',
                        openedDate: '2019-11-05'
                    }
                ]
            }

            // Simulate parsing delay
            await new Promise(resolve => setTimeout(resolve, 2000))
            setUploading(false)
            onUploadComplete(enhancedData)

        } catch (error) {
            console.error("Analysis Failed", error)
            setUploading(false)
            alert("Security Check Failed: Could not read file structure.")
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-950/50">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                {/* Left Side: The Requirement */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-primary">
                        <Shield className="w-12 h-12" />
                        <h1 className="text-4xl font-heading font-bold text-foreground">The Credit Lab™</h1>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Access to the Credit Lab is <strong>restricted</strong> to students with a verified credit report.
                        We operate on real-world data to ensure your dispute letters are accurate, compliant, and effective.
                    </p>

                    <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-lg space-y-4">
                        <h3 className="font-semibold flex items-center gap-2 text-blue-400">
                            <Lock className="w-4 h-4" />
                            Required Action
                        </h3>
                        <p className="text-sm text-blue-200/80">
                            You must obtain your official credit report before proceeding.
                            We recommend <strong>MyFreeScoreNow</strong> for the most detailed 3-bureau data.
                        </p>
                        <Button className="w-full gap-2" variant="default" asChild>
                            <a
                                href="https://myfreescorenow.com/enroll/?AID=TheCreditStore&PID=71935"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Get Official Report <ExternalLink className="w-4 h-4" />
                            </a>
                        </Button>
                    </div>

                    <div className="flex gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Bank-Level Encryption
                        </div>
                        <div className="flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Private & Secure
                        </div>
                        <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" /> No Data Selling
                        </div>
                    </div>
                </div>

                {/* Right Side: The Vault Upload */}
                <Card className={`border-2 border-dashed transition-all duration-300 ${isDragging ? 'border-primary bg-primary/5' : 'border-slate-800 bg-slate-900/50'
                    }`}>
                    <CardHeader>
                        <CardTitle className="text-center">Secure Ingestion</CardTitle>
                        <CardDescription className="text-center">
                            Upload your credit report (PDF) to unlock the toolset.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center min-h-[300px] gap-6"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className={`p-6 rounded-full bg-slate-900 transition-all duration-500 ${uploading ? 'animate-pulse' : ''}`}>
                            {uploading ? (
                                <Shield className="w-16 h-16 text-primary animate-bounce" />
                            ) : (
                                <Upload className="w-16 h-16 text-slate-700" />
                            )}
                        </div>

                        <div className="text-center space-y-2">
                            {uploading ? (
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-foreground">Encrypting...</h3>
                                    <p className="text-sm text-muted-foreground">Verifying report integrity</p>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-lg font-semibold text-foreground">Drag & Drop PDF Here</h3>
                                    <p className="text-sm text-muted-foreground">or click to browse</p>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        className="hidden"
                                        id="report-upload"
                                        onChange={handleFileSelect}
                                    />
                                    <Button variant="outline" onClick={() => document.getElementById('report-upload')?.click()}>
                                        Select File
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="justify-center pt-2 pb-6">
                        <div className="w-full bg-red-950/10 border border-red-900/20 text-red-400 p-4 rounded-lg flex gap-3 items-start">
                            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                            <div className="space-y-1">
                                <h5 className="font-medium leading-none tracking-tight">Strict File Policy</h5>
                                <p className="text-xs opacity-90">
                                    Only official 3-bureau PDF reports are accepted.
                                    Screenshots or text files will be rejected.
                                </p>
                            </div>
                        </div>
                    </CardFooter>
                </Card>

            </div>
        </div>
    )
}
