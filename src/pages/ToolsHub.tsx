import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, FileText, TrendingUp, Shield, BookOpen, Brain } from 'lucide-react';

export default function ToolsHub() {
    const navigate = useNavigate();

    const tools = [
        {
            id: 'score-simulator',
            title: 'Credit Score Simulator',
            description: 'See how different actions impact your credit score in real-time',
            icon: TrendingUp,
            path: '/dashboard/tools/score-simulator',
            color: 'from-indigo-500 to-purple-500',
            features: ['Real-time calculations', 'Multiple scenarios', 'Educational breakdown']
        },
        {
            id: 'dispute-generator',
            title: 'FCRA Dispute Letter Generator',
            description: 'Generate legally compliant dispute letters for credit bureaus',
            icon: FileText,
            path: '/dashboard/tools/dispute-generator',
            color: 'from-emerald-500 to-teal-500',
            features: ['Step-by-step wizard', 'Legal compliance', 'Downloadable letters']
        },
        {
            id: 'interactive-quiz',
            title: 'Interactive Quizzes',
            description: 'Test your knowledge with instant feedback and detailed explanations',
            icon: Brain,
            path: '/dashboard/tools/quiz',
            color: 'from-purple-500 to-pink-500',
            features: ['Instant feedback', 'Source citations', 'Progress tracking']
        },
        {
            id: 'utilization-calc',
            title: 'Credit Utilization Calculator',
            description: 'Calculate your utilization ratio and get recommendations',
            icon: Calculator,
            path: '/dashboard/tools/utilization',
            color: 'from-amber-500 to-orange-500',
            features: ['Instant calculations', 'Optimization tips', 'Per-card analysis']
        },
        {
            id: 'dti-calc',
            title: 'Debt-to-Income Calculator',
            description: 'Understand your DTI ratio for loan qualification',
            icon: Calculator,
            path: '/dashboard/tools/dti',
            color: 'from-blue-500 to-cyan-500',
            features: ['Loan thresholds', 'Qualification guidance', 'Improvement strategies']
        },
        {
            id: 'report-auditor',
            title: 'Credit Report Auditor',
            description: 'Interactive checklist to identify errors on your credit report',
            icon: Shield,
            path: '/dashboard/credit-lab/audit',
            color: 'from-rose-500 to-pink-500',
            features: ['Error identification', 'Guided process', 'Action recommendations']
        },
        {
            id: 'knowledge-center',
            title: 'Knowledge Center',
            description: 'Access 100+ lessons, quizzes, and educational content',
            icon: BookOpen,
            path: '/dashboard/knowledge',
            color: 'from-violet-500 to-purple-500',
            features: ['100+ lessons', 'Interactive quizzes', 'Source-verified content']
        },
        {
            id: 'debt-payoff',
            title: 'Debt Payoff Calculator',
            description: 'Snowball vs Avalanche comparison for strategic debt reduction',
            icon: Calculator,
            path: '/dashboard/tools/debt-payoff',
            color: 'from-red-500 to-rose-500',
            features: ['Snowball method', 'Avalanche method', 'Payoff timeline']
        },
        {
            id: 'security-freeze',
            title: 'Security Freeze Manager',
            description: 'Bureau freeze management and identity protection guidelines',
            icon: Shield,
            path: '/dashboard/credit-lab/freeze',
            color: 'from-slate-500 to-slate-400',
            features: ['Bureau direct links', 'Freeze tracking', 'Unfreeze scheduling']
        },
        {
            id: 'dispute-wizard',
            title: 'Dispute Wizard',
            description: 'Step-by-step dispute process for correcting errors',
            icon: FileText,
            path: '/dashboard/credit-lab/dispute',
            color: 'from-amber-500 to-yellow-500',
            features: ['Guided workflow', 'Law citations', 'Follow-up tracking']
        },
        {
            id: 'score-simulator-lab',
            title: 'Score Simulator (Credit Lab)',
            description: 'Advanced credit impact analysis and staging',
            icon: TrendingUp,
            path: '/dashboard/credit-lab/simulator',
            color: 'from-sky-500 to-blue-500',
            features: ['Impact analysis', 'Timeline projections', 'What-if scenarios']
        },
        {
            id: 'credit-quest',
            title: 'Credit Quest',
            description: 'Interactive gamified learning scenarios for real-world application',
            icon: Brain,
            path: '/dashboard/quest',
            color: 'from-fuchsia-500 to-pink-500',
            features: ['Interactive modules', 'XP Rewards', 'Decision outcomes']
        },
        {
            id: 'vision-board',
            title: 'Vision Board',
            description: 'Goal visualization and financial blueprints',
            icon: BookOpen,
            path: '/dashboard/vision',
            color: 'from-teal-500 to-emerald-500',
            features: ['Goal setting', 'Visual tracking', 'Milestone rewards']
        }
    ];

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-heading font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Financial Tools & Resources
                    </h1>
                    <p className="text-slate-400">
                        Professional-grade tools for credit management, financial planning, and education.
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                        <Card
                            key={tool.id}
                            className="bg-white/5 border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                            onClick={() => navigate(tool.path)}
                        >
                            <CardContent className="p-6">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                                    <tool.icon className="w-full h-full text-white" />
                                </div>

                                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-indigo-400 transition-colors">
                                    {tool.title}
                                </h3>

                                <p className="text-slate-400 text-sm mb-4">
                                    {tool.description}
                                </p>

                                <div className="space-y-1">
                                    {tool.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-500">
                                            <div className="w-1 h-1 rounded-full bg-indigo-500" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Educational Note */}
                <Card className="mt-8 bg-indigo-500/10 border-indigo-500/20">
                    <CardContent className="p-6">
                        <div className="flex gap-4">
                            <Brain className="w-6 h-6 text-indigo-400 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-white mb-2">Educational Tools</h3>
                                <p className="text-sm text-indigo-200/80">
                                    All tools are designed for educational purposes and based on authoritative sources (FCRA, FDCPA, FICO, CFPB).
                                    Results are estimates and not financial advice. For personalized guidance, consult licensed professionals.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
