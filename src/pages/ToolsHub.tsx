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
            path: '/dashboard/knowledge',
            color: 'from-amber-500 to-orange-500',
            features: ['Instant calculations', 'Optimization tips', 'Per-card analysis']
        },
        {
            id: 'dti-calc',
            title: 'Debt-to-Income Calculator',
            description: 'Understand your DTI ratio for loan qualification',
            icon: Calculator,
            path: '/dashboard/knowledge',
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
