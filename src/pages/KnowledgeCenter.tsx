import { useState, useMemo } from 'react';
import { useGamification } from '@/hooks/useGamification';
import { toast } from 'sonner';
import { useSound } from '@/hooks/useSound';
import confetti from 'canvas-confetti';

import {
    BookOpen,
    Calculator,
    GraduationCap,
    FileText,
    Search,
    Scale,
    TrendingDown,
    Shield,
    Landmark,
    CreditCard,
    Gavel,
    Book,
    CheckCircle2,
    Lightbulb,
    Zap,
    ChevronRight,
    ArrowLeft,
    Share2,
    Bookmark,
    ExternalLink,
    Clock,
    XCircle,
    Trophy,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
// Removed legacy FULL_ARTICLES import
import { Input } from '@/components/ui/input';
import { KNOWLEDGE_BASE_ARTICLES } from '@/data/knowledge-base';
import { EXTERNAL_RESOURCES, RESOURCE_CATEGORIES } from '@/data/external-resources';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

// ------------------------------------------------------------------
// DATA CONSTANTS (IMPORTED & EXTENDED)
// ------------------------------------------------------------------

// 1. Articles List (Metadata for Grid)
const ARTICLES = [
    { id: 'KB-001', title: 'The Ultimate Guide to FCRA Rights', category: 'Legal', level: 'FRESHMAN', icon: Scale },
    { id: 'KB-002', title: 'Credit Utilization: The 30% Myth vs Reality', category: 'Scoring', level: 'FRESHMAN', icon: CreditCard },
    { id: 'KB-003', title: 'How to Remove Hard Inquiries (The Legal Way)', category: 'Dispute Strategy', level: 'JUNIOR', icon: Shield },
    { id: 'KB-004', title: 'Debt Snowball vs. Avalanche: Mathematical Breakdown', category: 'Debt', level: 'FRESHMAN', icon: TrendingDown },
    { id: 'KB-005', title: 'Section 609 Dispute Letters Explained', category: 'Dispute Strategy', level: 'SOPHOMORE', icon: FileText },
    { id: 'KB-006', title: 'Understanding "Date of First Delinquency" (DOFD)', category: 'Legal', level: 'JUNIOR', icon: Scale },
    { id: 'KB-007', title: 'Pay for Delete: Negotiating with Collectors', category: 'Debt', level: 'SENIOR', icon: Gavel },
    { id: 'KB-008', title: 'Bankruptcy Chapters 7 vs 13', category: 'Legal', level: 'JUNIOR', icon: Landmark },
    { id: 'KB-009', title: 'FICO 8 vs FICO 9: Scoring Models Compared', category: 'Scoring', level: 'SOPHOMORE', icon: Calculator },
    { id: 'KB-010', title: 'Dealing with "Zombie Debt" and Statute of Limitations', category: 'Legal', level: 'SENIOR', icon: Search },
    { id: 'KB-011', title: 'Medical Debt Rights: The No Surprises Act', category: 'Legal', level: 'FRESHMAN', icon: Shield },
    { id: 'KB-012', title: 'Authorized User Tradelines: Pros & Cons', category: 'Scoring', level: 'FRESHMAN', icon: CreditCard },
    { id: 'KB-013', title: 'How to Freeze Your Credit (and Why You Should)', category: 'Security', level: 'FRESHMAN', icon: Shield },
    { id: 'KB-014', title: 'Student Loan Rehabilitation vs Consolidation', category: 'Debt', level: 'SOPHOMORE', icon: GraduationCap },
    { id: 'KB-015', title: 'Goodwill Letters: Removing Late Payments', category: 'Dispute Strategy', level: 'SOPHOMORE', icon: FileText },
    { id: 'KB-016', title: 'Mortgage Underwriting: DTI & LTV Explained', category: 'Lending', level: 'JUNIOR', icon: Landmark },
    { id: 'KB-017', title: 'VA Loan Residual Income Requirements', category: 'Lending', level: 'SENIOR', icon: Landmark },
    { id: 'KB-018', title: 'ChexSystems: The "Other" Credit Report', category: 'Banking', level: 'SOPHOMORE', icon: BookOpen },
    { id: 'KB-019', title: 'Identity Theft Recovery Steps (FTC)', category: 'Security', level: 'CRITICAL', icon: Shield },
    { id: 'KB-020', title: 'Metro 2 Format: How Credit Reporting Works', category: 'Technical', level: 'SENIOR', icon: Calculator },
];


// 2. Glossary (Excerpt for brevity - full list presumed in real app)
const GLOSSARY = [
    { term: 'Acceleration Clause', def: 'A contract provision that allows a lender to require a borrower to repay all of an outstanding loan if certain requirements are not met.' },
    { term: 'Account Aging', def: 'The average age of all accounts on a credit report. 15% of FICO score.' },
    { term: 'Annual Percentage Rate (APR)', def: 'The cost of carrying a balance on a loan or credit card, expressed as a yearly rate.' },
    { term: 'Arrears', def: 'Money that is owed and should have been paid earlier.' },
    { term: 'Authorized User', def: 'A person who has permission to use a credit card account but is not legally responsible for the debt.' },
    { term: 'Adverse Action', def: 'A denial of credit or a change in terms based on information in a credit report.' },
    { term: 'Bankruptcy', def: 'A legal proceeding involving a person or business that is unable to repay outstanding debts.' },
    { term: 'Beneficiary', def: 'The entity or person designated to receive the benefits of a contract.' },
    { term: 'Bureau', def: 'Credit Reporting Agency (CRA) such as Equifax, Experian, or TransUnion.' },
    { term: 'Capacity', def: 'A borrower\'s ability to repay debt based on income and other obligations.' },
    { term: 'Charge-Off', def: 'A declaration by a creditor that an amount of debt is unlikely to be collected. Occurs after 180 days delinquent.' },
    { term: 'Collateral', def: 'Property or other asset that a borrower offers as a way for a lender to secure the loan.' },
    { term: 'Collection', def: 'An account that has been transferred to a third-party agency for recovery.' },
    { term: 'Compound Interest', def: 'Interest calculated on the initial principal and also on the accumulated interest.' },
    { term: 'Consumer Financial Protection Bureau (CFPB)', def: 'Federal agency that regulates consumer financial products and services.' },
    { term: 'Credit Limit', def: 'The maximum amount of credit a lender will extend to a client.' },
    { term: 'Credit Mix', def: 'The variety of credit accounts spread across revolving and installment debts. 10% of FICO score.' },
    { term: 'Credit Utilization', def: 'The ratio of your credit card balances to credit limits. 30% of FICO score.' },
    { term: 'Date of First Delinquency (DOFD)', def: 'The date the first payment was missed that led to the current status. Determines the 7-year reporting limit.' },
    { term: 'Debt-to-Income Ratio (DTI)', def: 'The percentage of your gross monthly income that goes to paying your monthly debt payments.' },
    { term: 'Default', def: 'Failure to fulfill an obligation, especially to repay a loan.' },
    { term: 'Default Judgment', def: 'A judgment entered against a party who has failed to defend against a claim that has been brought by another party.' },
    { term: 'Deficiency Judgment', def: 'A court order placing personal liability on a debtor for the unpaid balance of a secured debt after foreclosure/repossession.' },
    { term: 'Delinquency', def: 'The state of being past due on a debt.' },
    { term: 'Dispute', def: 'The process of challenging inaccurate information on a credit report with the bureaus.' },
    { term: 'E-OSCAR', def: 'The automated system used by credit bureaus to share dispute information with creditors.' },
    { term: 'Equal Credit Opportunity Act (ECOA)', def: 'Federal law prohibiting discrimination in lending.' },
    { term: 'Equity', def: ' The difference between the market value of a property and the amount the owner still owes.' },
    { term: 'Fair Credit Reporting Act (FCRA)', def: 'Federal law regulating the collection of consumers\' credit information and access to their credit reports.' },
    { term: 'Fair Debt Collection Practices Act (FDCPA)', def: 'Federal law that limits the behavior and actions of third-party debt collectors.' },
    { term: 'FICO Score', def: 'The most widely used credit scoring model created by Fair Isaac Corporation.' },
    { term: 'Finance Charge', def: 'The total cost of borrowing, including interest and fees.' },
    { term: 'Fixed Rate', def: 'An interest rate that does not change over the life of the loan.' },
    { term: 'Foreclosure', def: 'The legal process by which a lender takes control of a property, evicts the homeowner and sells the home after a homeowner is unable to make full principal and interest payments.' },
    { term: 'Garnishment', def: 'A legal process that allows a creditor to collect a debt by taking a portion of your wages.' },
    { term: 'Goodwill Letter', def: 'A request to a creditor to remove a late payment record as an act of kindness, not based on error.' },
    { term: 'Grace Period', def: 'The time during which you are allowed to pay your credit card bill without having to pay interest.' },
    { term: 'Hard Inquiry', def: 'A check of your credit report by a lender when you apply for credit. Affects score slightly.' },
    { term: 'Home Equity Line of Credit (HELOC)', def: 'A loan in which the lender agrees to lend a maximum amount within an agreed period, where the collateral is the borrower\'s equity in their house.' },
    { term: 'Inquiry', def: 'A record of who has looked at your credit file.' },
    { term: 'Installment Loan', def: 'A loan that is repaid over time with a set number of scheduled payments.' },
    { term: 'Interest Rate', def: 'The proportion of a loan that is charged as interest to the borrower.' },
    { term: 'Judgment', def: 'A decision by a court of law determining that one party is indebted to another.' },
    { term: 'Jumbo Loan', def: 'A mortgage that exceeds the conforming loan limits set by Fannie Mae and Freddie Mac.' },
    { term: 'Lien', def: 'A right to keep possession of property belonging to another person until a debt owed by that person is discharged.' },
    { term: 'Loan-to-Value (LTV)', def: 'A ratio used in mortgage lending to determine the amount necessary to put in a down-payment.' },
    { term: 'Metro 2', def: 'The standard data format for reporting credit history to the credit bureaus.' },
    { term: 'Negative Item', def: 'Information in a credit history that lowers a credit score, such as late payments or collections.' },
    { term: 'Notice of Default', def: 'A public notice filed with a court that states that the borrower of a mortgage is in default.' },
    { term: 'Pay for Delete', def: 'A negotiation strategy where a debtor agrees to pay the debt in full or part if the creditor agrees to remove the negative item from the credit report.' },
    { term: 'PITI', def: 'Acronym for Principal, Interest, Taxes, and Insurance—the components of a mortgage payment.' },
    { term: 'Predatory Lending', def: 'Unscrupulous actions carried out by a lender to entice, induce and assist a borrower in taking a loan that carries high fees and interests.' },
    { term: 'Principal', def: 'The original sum of money borrowed in a loan or put into an investment.' },
    { term: 'Promissory Note', def: 'A financial instrument that contains a written promise by one party to pay another party a definite sum of money.' },
    { term: 'Re-aging', def: 'The illegal practice of changing the Date of First Delinquency on a debt to keep it on a credit report longer.' },
    { term: 'Reaffirmation Agreement', def: 'An agreement made between a creditor and a debtor that waives discharge of a debt that would otherwise be discharged in pending bankruptcy proceedings.' },
    { term: 'Repossession', def: 'Retaking possession of an asset or property by a lender when a borrower defaults on payments.' },
    { term: 'Residual Income', def: 'Discretionary income available after meeting all financial obligations.' },
    { term: 'Revolving Credit', def: 'Credit that is automatically renewed as debts are paid off (e.g., credit cards).' },
    { term: 'Secured Card', def: 'A type of credit card that is backed by a cash deposit from the cardholder.' },
    { term: 'Settlement', def: 'An agreement between a debtor and creditor to pay a lump sum that is less than the full amount owed to satisfy a debt.' },
    { term: 'Soft Inquiry', def: 'A credit check that does not affect a credit score.' },
    { term: 'Statute of Limitations (SOL)', def: 'The maximum time after an event within which legal proceedings may be initiated.' },
    { term: 'Subprime', def: 'Classification of borrowers with a tarnished or limited credit history.' },
    { term: 'Tradeline', def: 'An account listed on a credit report.' },
    { term: 'TransUnion', def: 'One of the three major credit reporting agencies.' },
    { term: 'Truth in Lending Act (TILA)', def: 'Federal law designed to promote the informed use of consumer credit.' },
    { term: 'Underwriting', def: 'The process a lender uses to determine if the risk of lending to a particular borrower is acceptable.' },
    { term: 'Unsecured Debt', def: 'A loan that is not backed by an underlying asset.' },
    { term: 'Usury', def: 'The illegal action or practice of lending money at unreasonably high rates of interest.' },
    { term: 'Validation Letter', def: 'A letter sent to a debt collector within 30 days of initial contact requesting proof of the debt.' },
    { term: 'VantageScore', def: 'A consumer credit-scoring model, created through a joint venture of the three major credit bureaus.' },
    { term: 'Variable Rate', def: 'An interest rate on a loan or security that fluctuates over time.' },
    { term: 'Wage Assignment', def: 'A voluntary agreement where a borrower allows a lender to deduct payments directly from their paycheck.' },
    { term: 'Zombie Debt', def: 'Old debt that has fallen off a credit report or passed the statute of limitations but is still being pursued by collectors.' },
];

// ------------------------------------------------------------------
// COMPONENT: QUIZ VIEW
// ------------------------------------------------------------------
const QuizView = ({ article, onClose, onComplete }: { article: any, onClose: () => void, onComplete: (score: number) => void }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const { awardPoints } = useGamification();

    const question = article.quiz?.[currentQuestion];
    const totalQuestions = article.quiz?.length || 0;

    const handleAnswer = (index: number) => {
        setSelectedOption(index);
        setIsAnswered(true);
        if (question && index === question.correctAnswer) {
            setScore(s => s + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(c => c + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
        }
    };

    const handleFinish = () => {
        const passRate = (score / totalQuestions) * 100;
        if (passRate >= 70) {
            awardPoints(100, 'Quiz Master');
        }
        onComplete(score);
        onClose();
    };

    if (!question) return <div>Error: No quiz data found.</div>;

    if (showResults) {
        const passRate = (score / totalQuestions) * 100;
        const passed = passRate >= 70;

        return (
            <div className="p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {passed ? <Trophy className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{passed ? 'Quiz Mastered!' : 'Keep Studying'}</h2>
                    <p className="text-slate-400">You scored {score} out of {totalQuestions}</p>
                </div>

                {passed ? (
                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6">
                        <p className="text-lg text-indigo-300 font-semibold mb-2">Rewards Earned</p>
                        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
                            <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                            <span>+100 XP</span>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-800/50 rounded-xl p-4">
                        <p className="text-slate-300">Review the article and try again to earn your XP!</p>
                    </div>
                )}

                <Button
                    onClick={handleFinish}
                    className={`w-full py-6 text-lg ${passed ? 'bg-green-600 hover:bg-green-500' : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                    {passed ? 'Claim Rewards & Finish' : 'Close & Review'}
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <span className="text-indigo-400 font-medium text-sm tracking-wider uppercase">Question {currentQuestion + 1} of {totalQuestions}</span>
                    <div className="h-2 w-48 bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                        />
                    </div>
                </div>
                <div className="text-slate-400 font-mono text-sm">
                    Score: {score}
                </div>
            </div>

            {/* Question */}
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-8 leading-relaxed">
                {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-4 mb-8">
                {question.options.map((option: string, index: number) => {
                    let stateStyles = "bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600";

                    if (isAnswered) {
                        if (index === question.correctAnswer) {
                            stateStyles = "bg-green-500/20 border-green-500/50 text-green-200";
                        } else if (selectedOption === index) {
                            stateStyles = "bg-red-500/20 border-red-500/50 text-red-200";
                        } else {
                            stateStyles = "opacity-50 bg-slate-900 border-slate-800";
                        }
                    } else if (selectedOption === index) {
                        stateStyles = "bg-indigo-600 border-indigo-500";
                    }

                    return (
                        <button
                            key={index}
                            disabled={isAnswered}
                            onClick={() => handleAnswer(index)}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${stateStyles}`}
                        >
                            <span className="font-medium">{option}</span>
                            {isAnswered && index === question.correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                            {isAnswered && selectedOption === index && index !== question.correctAnswer && <XCircle className="w-5 h-5 text-red-400" />}
                        </button>
                    );
                })}
            </div>

            {/* Explanation / Next */}
            {isAnswered && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4 mb-6">
                        <div className="flex gap-3">
                            <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-indigo-200 font-medium mb-1">Explanation</p>
                                <p className="text-slate-300 text-sm leading-relaxed">{question.explanation}</p>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={handleNext}
                        className="w-full bg-white text-slate-900 hover:bg-slate-200 py-6 text-lg font-semibold shadow-xl shadow-indigo-500/10"
                    >
                        {currentQuestion < totalQuestions - 1 ? 'Next Question' : 'See Results'}
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            )}
        </div>
    );
};

// COMPONENT: ARTICLE READER OVERLAY
// ------------------------------------------------------------------
const ArticleReader = ({ articleId, onClose }: { articleId: string, onClose: () => void }) => {
    const article = Object.values(KNOWLEDGE_BASE_ARTICLES).find(a => a.id === articleId);
    const [viewMode, setViewMode] = useState<'content' | 'quiz'>('content');
    const { awardPoints } = useGamification();
    const { playSuccess } = useSound();

    if (!article) return null;

    const handleMarkComplete = () => {
        playSuccess();
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#6366f1', '#a855f7', '#ec4899'] });
        awardPoints(50, 'Learning');
        toast.success("Knowledge Acquired!", { description: "You've earned 50 XP." });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#020412] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 z-[106]" />
            <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center sticky top-0 bg-[#020412]/80 backdrop-blur-md z-[105] border-b border-white/5 mt-1">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={onClose} className="gap-2 text-slate-400 hover:text-white">
                        <ArrowLeft className="w-4 h-4" /> Back to Library
                    </Button>
                    {viewMode === 'quiz' && (
                        <Button variant="ghost" onClick={() => setViewMode('content')} className="gap-2 text-indigo-400 hover:text-indigo-300">
                            Return to Article
                        </Button>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white"><Bookmark className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white"><Share2 className="w-4 h-4" /></Button>
                </div>
            </div>

            {/* Content Content */}
            <div className="max-w-3xl mx-auto px-6 pb-32 mt-8">
                {viewMode === 'content' ? (
                    <>
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/20">
                                {article.category}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-6 leading-tight">
                                {article.title}
                            </h1>
                            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-xs">
                                        {article.author?.[0]}
                                    </span>
                                    <span>{article.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>5 min read</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    Source Verified
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-invert prose-lg max-w-none text-slate-300 font-serif leading-loose article-content prose-headings:font-sans prose-headings:font-bold prose-h1:text-white prose-h2:text-indigo-400 prose-h3:text-indigo-300 prose-strong:text-white prose-blockquote:border-l-indigo-500 prose-blockquote:bg-white/5 prose-blockquote:p-4 prose-blockquote:not-italic prose-li:text-slate-300">
                            <ReactMarkdown>{article.content || ''}</ReactMarkdown>
                        </div>

                        {/* Footer Engagement */}
                        <div className="mt-16 pt-16 border-t border-white/10 text-center">
                            <h3 className="text-2xl font-bold text-white mb-8">Mastered this topic?</h3>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 h-12 text-lg"
                                    onClick={handleMarkComplete}
                                >
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    Yes, I learned something
                                </Button>

                                <Button
                                    variant="outline"
                                    className="border-white/10 text-slate-300 hover:bg-white/5 h-12 text-lg"
                                    onClick={() => {
                                        if (article.quiz && article.quiz.length > 0) {
                                            setViewMode('quiz');
                                        } else {
                                            toast.error("Quiz not available yet.");
                                        }
                                    }}
                                >
                                    <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                                    Take Quiz
                                </Button>
                            </div>
                            <p className="text-slate-500 mt-6 text-sm">
                                Marking as complete awards <span className="text-indigo-400 font-bold">50 XP</span>.
                                Passing the quiz awards <span className="text-yellow-400 font-bold">100 XP</span>.
                            </p>
                        </div>
                    </>
                ) : (
                    <QuizView
                        article={article}
                        onClose={onClose}
                        onComplete={() => {
                            // handled in QuizView
                        }}
                    />
                )}
            </div>
            <style>{`
                .article-content h2 { color: white; font-size: 2rem; margin-top: 3rem; margin-bottom: 1.5rem; font-family: sans-serif; font-weight: 800; }
                .article-content h3 { color: #818cf8; font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: sans-serif; font-weight: 700; }
                .article-content h4 { color: #a5b4fc; font-size: 1.2rem; margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: 700; }
                .article-content strong { color: white; font-weight: 700; }
                .article-content ul, .article-content ol { margin-left: 1.5rem; margin-bottom: 1.5rem; list-style-position: outside; }
                .article-content list-decimal { list-style-type: decimal; }
                .article-content list-disc { list-style-type: disc; }
                .article-content li { margin-bottom: 0.5rem; }
                .callout-primary { background: rgba(99, 102, 241, 0.1); border-left: 4px solid #6366f1; padding: 1.5rem; border-radius: 0.5rem; margin: 2rem 0; }
                .callout-warning { background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; padding: 1.5rem; border-radius: 0.5rem; margin: 2rem 0; }
                .callout-success { background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; padding: 1.5rem; border-radius: 0.5rem; margin: 2rem 0; }
            `}</style>
        </div>
    );
}

// ------------------------------------------------------------------
// MAIN COMPONENT: KNOWLEDGE CENTER
// ------------------------------------------------------------------


export default function KnowledgeCenter() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'articles' | 'glossary'>('articles');
    const [selectedCategory, setSelectedCategory] = useState<typeof RESOURCE_CATEGORIES[number] | 'All'>('All');
    const [readingArticle, setReadingArticle] = useState<string | null>(null);
    const { playHover, playClick } = useSound();
    // const { awardPoints } = useGamification();

    const filteredResources = useMemo(() => {
        if (!EXTERNAL_RESOURCES || !Array.isArray(EXTERNAL_RESOURCES)) return [];
        if (selectedCategory === 'All') return EXTERNAL_RESOURCES;
        return EXTERNAL_RESOURCES.filter(r => r.category === selectedCategory);
    }, [selectedCategory]);

    const filteredArticles = useMemo(() => {
        if (!KNOWLEDGE_BASE_ARTICLES) return [];
        let filtered = Object.values(KNOWLEDGE_BASE_ARTICLES).map(article => {
            const metadata = ARTICLES.find(m => m.id === article.id);
            return {
                ...article,
                category: metadata?.category || article.category, // Use metadata category if available for consistency
                icon: metadata?.icon || BookOpen // Fallback to BookOpen if no icon found
            };
        });

        if (!Array.isArray(filtered)) return [];

        // Map new categories to old article categories (temporary mapping)
        if (selectedCategory !== 'All') {
            const catMap: Record<string, string> = {
                'Credit Reports & Scores': 'Scoring',
                'Disputes': 'Dispute Strategy',
                'Protection': 'Security',
                'Debt': 'Debt',
                'Home & Wealth': 'Lending',
                'Student Loans': 'Debt',
                'Start Here': 'Legal',
                'Banking & Specialty': 'Banking',
                'Investig': 'Technical',
                'Business': 'Personal Finance'
            };
            const target = catMap[selectedCategory] || selectedCategory;
            filtered = filtered.filter(a => a.category === target || a.category === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return filtered;
    }, [searchQuery, selectedCategory]);

    const filteredGlossary = useMemo(() => {
        const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));
        if (!searchQuery) return sorted;
        return sorted.filter(g =>
            g.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.def.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    // Group Glossary by Letter
    const glossaryGrouped = useMemo(() => {
        const groups: Record<string, typeof GLOSSARY> = {};
        filteredGlossary.forEach(item => {
            const letter = item.term[0].toUpperCase();
            if (!groups[letter]) groups[letter] = [];
            groups[letter].push(item);
        });
        return groups;
    }, [filteredGlossary]);

    // Render Reading Mode
    if (readingArticle) {
        return <ArticleReader articleId={readingArticle} onClose={() => setReadingArticle(null)} />;
    }

    // Render Reading Mode
    // if (readingArticle) {
    //     return <ArticleReader articleId={readingArticle} onClose={() => setReadingArticle(null)} />;
    // }

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12 font-sans selection:bg-indigo-500/30">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-heading font-black mb-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-4">
                            <Book className="w-12 h-12 text-indigo-400" />
                            Knowledge Center
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl">
                            Institution-grade financial education. Source-verified. Compliance-safe.
                            Access over 100+ resources to master your financial life.
                        </p>
                    </div>
                </div>

                {/* Search & Tabs */}
                <div className="flex flex-col md:flex-row gap-6 mb-10 sticky top-0 bg-[#020412]/95 backdrop-blur-sm z-50 py-4 border-b border-white/5">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                        <Input
                            type="text"
                            placeholder="Search glossary terms & articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-14 rounded-xl text-lg focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex flex-col gap-4 mb-8">
                        {/* Main View Toggle */}
                        <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-xl w-fit mx-auto">
                            <button
                                onClick={() => { playClick(); setActiveTab('articles'); }}
                                onMouseEnter={() => playHover()}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'articles'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Library
                            </button>
                            <button
                                onClick={() => { playClick(); setActiveTab('glossary'); }}
                                onMouseEnter={() => playHover()}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'glossary'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Glossary
                            </button>
                        </div>

                        {/* Category Pills (Only visible in Library view) */}
                        {activeTab === 'articles' && (
                            <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar px-4 sm:px-0">
                                <button
                                    onClick={() => setSelectedCategory('All')}
                                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all border ${selectedCategory === 'All'
                                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                                        : 'bg-slate-800/50 border-white/10 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400'
                                        }`}
                                >
                                    All Resources
                                </button>
                                {RESOURCE_CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all border ${selectedCategory === cat
                                            ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400'
                                            : 'bg-slate-800/50 border-white/10 text-slate-400 hover:border-indigo-500/30 hover:text-indigo-400'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}



                {activeTab === 'articles' ? (
                    <div className="space-y-12">

                        {/* Section 1: Official Tools & Resources (The Vault) */}
                        {(selectedCategory !== 'All' || !searchQuery) && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-emerald-400" />
                                        Official Tools & Resources ({filteredResources?.length || 0})
                                    </h2>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Trusted Sources</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredResources.map((resource) => (
                                        <a
                                            key={resource.id}
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group bg-slate-800/30 border border-white/5 rounded-xl p-4 hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all flex flex-col h-full"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex flex-wrap gap-2">
                                                    {resource.tags.map(tag => {
                                                        let badgeColor = 'bg-slate-700/50 text-slate-400 border-transparent';
                                                        if (tag === 'Official' || tag === 'Gov') badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                                                        if (tag === 'Tool') badgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
                                                        if (tag === 'PDF' || tag === 'Guide') badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';

                                                        return (
                                                            <span key={tag} className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColor}`}>
                                                                {tag}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                                            </div>
                                            <h3 className="text-white font-medium mb-1 group-hover:text-indigo-300 transition-colors">{resource.title}</h3>
                                            <p className="text-sm text-slate-400 line-clamp-2">{resource.description}</p>
                                        </a>
                                    ))}
                                    {filteredResources.length === 0 && (
                                        <div className="col-span-full py-8 text-center text-slate-500 border border-dashed border-white/10 rounded-xl">
                                            No external resources found for this category.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Section 2: Credit U Guides (Articles) */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-indigo-400" />
                                    Credit U Guides & Action Plans ({filteredArticles?.length || 0})
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredArticles.map((article) => (
                                    <button
                                        key={article.id}
                                        onClick={() => setReadingArticle(article.id)}
                                        className="group text-left bg-slate-800/50 border border-white/5 rounded-2xl p-6 hover:bg-slate-800 hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="p-3 rounded-xl bg-slate-900/50 group-hover:bg-indigo-500/10 transition-colors border border-white/5 group-hover:border-indigo-500/20">
                                                    <BookOpen className="w-6 h-6 text-indigo-400" />
                                                </div>
                                                <div className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Mastered</span>
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                                                {article.title}
                                            </h3>

                                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                                <span className="flex items-center gap-1 group-hover:text-indigo-400/80 transition-colors">
                                                    <Clock className="w-4 h-4" />
                                                    5 min read
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Trophy className="w-4 h-4 text-amber-400/80" />
                                                    100 XP
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {filteredArticles.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-slate-400">No guides found for this filter.</p>
                                </div>
                            )}
                        </div>

                        {/* Disclaimer Footer */}
                        <div className="mt-12 pt-8 border-t border-white/5 text-center px-4 mb-8">
                            <p className="text-sm text-slate-500 max-w-2xl mx-auto">
                                External resources are provided for educational purposes. Credit U is not affiliated with any third-party sites unless explicitly stated.
                                Always use official .gov sites for sensitive requests.
                            </p>
                        </div>

                    </div>
                ) : (
                    <div className="space-y-12 animate-in fade-in duration-500">
                        {Object.keys(glossaryGrouped).sort().map(letter => (
                            <div key={letter} className="relative">
                                <div className="sticky top-24 bg-[#020412]/95 backdrop-blur z-30 py-2 border-b border-indigo-500/30 mb-6 flex items-center">
                                    <span className="text-4xl font-black text-indigo-500/20 absolute left-0 -z-10">{letter}</span>
                                    <span className="text-2xl font-bold text-indigo-400 ml-4">{letter}</span>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {glossaryGrouped[letter].map((term, idx) => (
                                        <div
                                            key={idx}
                                            className="p-5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-colors"
                                        >
                                            <h4 className="font-bold text-indigo-200 mb-2 flex items-center gap-2">
                                                <Lightbulb className="w-4 h-4 text-amber-400 opacity-50" />
                                                {term.term}
                                            </h4>
                                            <p className="text-sm text-slate-400 leading-relaxed">
                                                {term.def}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {Object.keys(glossaryGrouped).length === 0 && (
                            <div className="text-center py-20">
                                <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-400">No terms found</h3>
                                <p className="text-slate-500">Try adjusting your search query.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}


