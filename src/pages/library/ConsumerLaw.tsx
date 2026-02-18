import { useState, useMemo } from 'react';
import {
    Scale,
    Book,
    Search,
    Gavel,
    ShieldAlert,
    FileText,
    ChevronRight,
    Landmark,
    Scroll,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

// ------------------------------------------------------------------
// CONSUMER LAW DATABASE (INFINITE KNOWLEDGE)
// ------------------------------------------------------------------
const LAW_LIBRARY = [
    {
        id: 'FCRA-604',
        act: 'FCRA',
        section: 'Section 604',
        title: 'Permissible Purposes of Consumer Reports',
        summary: 'Defines the only legal reasons a credit bureau can share your report (e.g., credit application, employment, court order).',
        text: `
(a) In general. Subject to subsection (c), any consumer reporting agency may furnish a consumer report under the following circumstances and no other:
(1) In response to the order of a court having jurisdiction to issue such an order, or a subpoena issued in connection with proceedings before a Federal grand jury.
(2) In accordance with the written instructions of the consumer to whom it relates.
(3) To a person which it has reason to believe—
(A) intends to use the information in connection with a credit transaction involving the consumer on whom the information is to be furnished and involving the extension of credit to, or review or collection of an account of, the consumer; or
(B) intends to use the information for employment purposes...
        `,
        strategy: 'Use this section to dispute hard inquiries that you did not authorize ("No Permissible Purpose"). Check for "promotional" inquiries that are not coded correctly.'
    },
    {
        id: 'FCRA-605b',
        act: 'FCRA',
        section: 'Section 605B',
        title: 'Block of Information Resulting from Identity Theft',
        summary: 'Requires bureaus to block reporting of any information identified as resulting from identity theft within 4 business days.',
        text: `
(a) Block. Except as otherwise provided in this section, a consumer reporting agency shall block the reporting of any information in the file of a consumer that the consumer identifies as information that resulted from an alleged identity theft, not later than 4 business days after the date of receipt by such agency of—
(1) appropriate proof of the identity of the consumer;
(2) a copy of an identity theft report;
(3) the identification of such information by the consumer...
        `,
        strategy: 'This is the "Nuclear Option" for victims of fraud. You must have an FTC Affidavit or Police Report to trigger this rapid 4-day block.'
    },
    {
        id: 'FCRA-609',
        act: 'FCRA',
        section: 'Section 609',
        title: 'Disclosures to Consumers',
        summary: 'Requires bureaus to disclose "all information in the consumer\'s file" and the sources of that information.',
        text: `
(a) Every consumer reporting agency shall, upon request, and subject to section 610(a)(1) [15 U.S.C. § 1681h], clearly and accurately disclose to the consumer:
(1) All information in the consumer's file at the time of the request...
(2) The sources of the information...
(3) Identification of each person (including each end-user identified under section 607(e)(1) [15 U.S.C. § 1681e]) that procured a consumer report...
        `,
        strategy: 'The basis of the "609 Dispute Letter". Demanding the "source of information" forces bureaus to verify if they actually have the data or are just parroting a furnisher.'
    },
    {
        id: 'FCRA-611',
        act: 'FCRA',
        section: 'Section 611',
        title: 'Procedure in Case of Disputed Accuracy',
        summary: 'Mandates that bureaus conduct a "reasonable reinvestigation" within 30 days of a dispute.',
        text: `
(a) Reinvestigations of Disputed Information
(1) Reinvestigation Required.
(A) In general. Subject to subsection (f), if the completeness or accuracy of any item of information contained in a consumer's file at a consumer reporting agency is disputed by the consumer and the consumer notifies the agency directly... the agency shall, free of charge, conduct a reasonable reinvestigation to determine whether the disputed information is inaccurate and record the current status of the disputed information, or delete the item from the file in accordance with paragraph (5), before the end of the 30-day period beginning on the date on which the agency receives the notice of the dispute from the consumer.
        `,
        strategy: 'The core of most disputes. If they don\'t reply in 30 days, or if they "verify" without proof, they violate 611.'
    },
    {
        id: 'FCRA-623',
        act: 'FCRA',
        section: 'Section 623',
        title: 'Responsibilities of Furnishers of Information',
        summary: 'Prohibits creditors (banks, collectors) from reporting inaccurate information and requires them to update data.',
        text: `
(a) Duty of Furnishers of Information to Provide Accurate Information.
(1) Prohibition.
(A) Reporting information with actual knowledge of errors. A person shall not furnish any information relating to a consumer to any consumer reporting agency if the person knows or has reasonable cause to believe that the information is inaccurate...
(B) Reporting information after notice and confirmation of errors. A person shall not furnish information relating to a consumer to any consumer reporting agency if... the person has been notified by the consumer... that the information is inaccurate; and the information is, in fact, inaccurate.
        `,
        strategy: 'Use this to attack the Original Creditor directly (Direct-to-Furnisher disputes). If a bank knows an item is wrong but keeps reporting it, they are liable.'
    },
    {
        id: 'FDCPA-809',
        act: 'FDCPA',
        section: 'Section 809',
        title: 'Validation of Debts',
        summary: 'Gives consumers the right to request validation of a debt within 30 days of initial communication.',
        text: `
(b) Disputed debts. If the consumer notifies the debt collector in writing within the thirty-day period described in subsection (a) that the debt, or any portion thereof, is disputed, or that the consumer requests the name and address of the original creditor, the debt collector shall cease collection of the debt, or any disputed portion thereof, until the debt collector obtains verification of the debt or a copy of a judgment... and a copy of such verification or judgment, or name and address of the original creditor, is mailed to the consumer by the debt collector.
        `,
        strategy: 'The "Debt Validation Letter" law. If a collector contacts you, send a DV letter immediately. They must stop ALL collection activity until they validate.'
    },
    {
        id: 'FDCPA-806',
        act: 'FDCPA',
        section: 'Section 806',
        title: 'Harassment or Abuse',
        summary: 'Prohibits debt collectors from using threats, profanity, or frequent calls to annoy consumers.',
        text: `
A debt collector may not engage in any conduct the natural consequence of which is to harass, oppress, or abuse any person in connection with the collection of a debt.
(5) Causing a telephone to ring or engaging any person in telephone conversation repeatedly or continuously with intent to annoy, abuse, or harass any person at the called number.
        `,
        strategy: 'Keep a call log. If they call excessively (e.g., 7 times in 7 days), you may be entitled to $1,000 in statutory damages per lawsuit.'
    },
    {
        id: 'FDCPA-807',
        act: 'FDCPA',
        section: 'Section 807',
        title: 'False or Misleading Representations',
        summary: 'Prohibits lying about the debt amount, legal status, or consequences of non-payment.',
        text: `
A debt collector may not use any false, deceptive, or misleading representation or means in connection with the collection of any debt.
(2) The false representation of—
(A) the character, amount, or legal status of any debt; or
(B) any services rendered or compensation which may be lawfully received by any debt collector for the collection of a debt.
        `,
        strategy: 'If a collector says they will "garnish your wages" without a court order, or claims to be an attorney when they are not, that is a violation.'
    }
];

export default function ConsumerLaw() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeAct, setActiveAct] = useState<'ALL' | 'FCRA' | 'FDCPA'>('ALL');

    const filteredLaws = useMemo(() => {
        let results = LAW_LIBRARY;
        if (activeAct !== 'ALL') {
            results = results.filter(law => law.act === activeAct);
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            results = results.filter(law =>
                law.title.toLowerCase().includes(query) ||
                law.section.toLowerCase().includes(query) ||
                law.summary.toLowerCase().includes(query)
            );
        }
        return results;
    }, [searchQuery, activeAct]);

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12 font-sans selection:bg-amber-500/30">
            {/* Background Ambience (Law = Gold/Teal) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                <Scale className="w-8 h-8 text-amber-500" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-heading font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent">
                                Consumer Law Engine
                            </h1>
                        </div>
                        <p className="text-slate-400 text-lg max-w-3xl">
                            The foundation of all credit repair. Reference the source code of the Fair Credit Reporting Act (15 U.S.C. § 1681) and Fair Debt Collection Practices Act.
                        </p>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="space-y-6 mb-12">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/50" />
                        <Input
                            type="text"
                            placeholder="Search Statutes (e.g., 'Validation', '609', 'Harassment')..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-14 rounded-xl text-lg focus:ring-2 focus:ring-amber-500/50 transition-all font-mono"
                        />
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2">
                        <Button
                            variant={activeAct === 'ALL' ? 'default' : 'outline'}
                            className={activeAct === 'ALL' ? 'bg-amber-500 text-black hover:bg-amber-600' : 'border-white/10 text-slate-400 hover:text-white'}
                            onClick={() => setActiveAct('ALL')}
                        >
                            All Statutes
                        </Button>
                        <Button
                            variant={activeAct === 'FCRA' ? 'default' : 'outline'}
                            className={activeAct === 'FCRA' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'border-white/10 text-slate-400 hover:text-white'}
                            onClick={() => setActiveAct('FCRA')}
                        >
                            FCRA (Reporting)
                        </Button>
                        <Button
                            variant={activeAct === 'FDCPA' ? 'default' : 'outline'}
                            className={activeAct === 'FDCPA' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'border-white/10 text-slate-400 hover:text-white'}
                            onClick={() => setActiveAct('FDCPA')}
                        >
                            FDCPA (Collections)
                        </Button>
                    </div>
                </div>

                {/* Law Grid */}
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {filteredLaws.map((law) => (
                        <Card key={law.id} className="bg-[#0A0F1E] border-white/5 hover:border-amber-500/30 transition-all group overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Gavel size={120} />
                            </div>

                            <CardHeader className="relative z-10 pb-2">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-widest ${law.act === 'FCRA'
                                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        }`}>
                                        {law.act}
                                    </span>
                                    <span className="text-amber-500 font-mono text-sm">{law.section}</span>
                                </div>
                                <CardTitle className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                                    {law.title}
                                </CardTitle>
                                <CardDescription className="text-lg text-slate-400 mt-2 leading-relaxed">
                                    {law.summary}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="relative z-10 space-y-6">
                                <div className="bg-black/40 border border-white/5 rounded-lg p-6 font-serif text-slate-300 italic leading-loose">
                                    "{law.text.trim()}"
                                </div>

                                <div className="flex items-start gap-3 bg-white/5 rounded-lg p-4 border border-white/5">
                                    <div className="p-2 bg-amber-500/10 rounded-full mt-1">
                                        <ShieldAlert className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-amber-100 text-sm uppercase tracking-wide mb-1">Tactical Application</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            {law.strategy}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredLaws.length === 0 && (
                        <div className="text-center py-20 text-slate-500">
                            <Book className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p>No statutes found matching your query.</p>
                        </div>
                    )}
                </div>

                <div className="mt-12 text-center text-xs text-slate-600 font-mono">
                    Official Text Sourced from U.S. House of Representatives Office of the Law Revision Counsel (uscode.house.gov).
                    <br />Not Legal Advice.
                </div>
            </div>
        </div>
    );
}
