import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calculator, GraduationCap, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KNOWLEDGE_BASE_ARTICLES } from '@/data/knowledge-base';
import { QUIZZES } from '@/data/quizzes';
import { CALCULATORS } from '@/data/calculators';
import { searchGlossary } from '@/data/glossary';

export default function KnowledgeCenter() {
    const navigate = useNavigate(); // Hook for navigation
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'articles' | 'quizzes' | 'calculators' | 'glossary'>('articles');

    const articles = Object.values(KNOWLEDGE_BASE_ARTICLES);
    const quizzes = Object.values(QUIZZES);
    const calculators = Object.values(CALCULATORS);
    const glossaryResults = searchQuery ? searchGlossary(searchQuery) : [];

    // Navigation Handlers
    const handleArticleClick = (id: string) => {
        navigate(`/dashboard/library/article/${id}`);
    };

    const handleQuizClick = (id: string) => {
        navigate(`/dashboard/tools/quiz?id=${id}`);
    };

    const handleCalculatorClick = (id: string) => {
        switch (id) {
            case 'CALC-001': // Utilization
                navigate('/dashboard/tools/utilization');
                break;
            case 'CALC-003': // Debt Payoff
                navigate('/dashboard/tools/debt-payoff');
                break;
            default:
                navigate('/dashboard/tools'); // Fallback
        }
    };

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <h1 className="text-4xl font-heading font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Knowledge Center
                </h1>
                <p className="text-slate-400">
                    Institution-grade financial education. Source-verified. Compliance-safe.
                </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                        type="text"
                        placeholder="Search knowledge base, glossary, calculators..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex gap-2 border-b border-white/10 pb-2">
                    <Button
                        variant={activeTab === 'articles' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('articles')}
                        className="gap-2"
                    >
                        <FileText className="w-4 h-4" />
                        Articles ({articles.length})
                    </Button>
                    <Button
                        variant={activeTab === 'quizzes' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('quizzes')}
                        className="gap-2"
                    >
                        <GraduationCap className="w-4 h-4" />
                        Quizzes ({quizzes.length})
                    </Button>
                    <Button
                        variant={activeTab === 'calculators' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('calculators')}
                        className="gap-2"
                    >
                        <Calculator className="w-4 h-4" />
                        Calculators ({calculators.length})
                    </Button>
                    <Button
                        variant={activeTab === 'glossary' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('glossary')}
                        className="gap-2"
                    >
                        <BookOpen className="w-4 h-4" />
                        Glossary
                    </Button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto">
                {activeTab === 'articles' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {articles.map((article) => (
                            <div
                                key={article.id}
                                onClick={() => handleArticleClick(article.id)}
                                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer hover:border-indigo-500/30 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <span className="text-xs font-mono text-indigo-400">{article.id}</span>
                                        <h3 className="text-xl font-bold mt-1 group-hover:text-indigo-400 transition-colors">{article.title}</h3>
                                    </div>
                                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">
                                        {article.level}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm mb-4">{article.category}</p>
                                <div className="flex flex-wrap gap-2">
                                    {article.sources.map((source, idx) => (
                                        <span key={idx} className="text-xs bg-white/5 px-2 py-1 rounded text-slate-500">
                                            {source}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'quizzes' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {quizzes.map((quiz) => (
                            <div
                                key={quiz.id}
                                onClick={() => handleQuizClick(quiz.id)}
                                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer hover:border-emerald-500/30 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <span className="text-xs font-mono text-emerald-400">{quiz.id}</span>
                                        <h3 className="text-xl font-bold mt-1 group-hover:text-emerald-400 transition-colors">{quiz.title}</h3>
                                    </div>
                                    <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">
                                        {quiz.level}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm mb-4">{quiz.category}</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">{quiz.questions.length} Questions</span>
                                    <span className="text-slate-500">Pass: {quiz.passingScore}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'calculators' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {calculators.map((calc) => (
                            <div
                                key={calc.id}
                                onClick={() => handleCalculatorClick(calc.id)}
                                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer hover:border-amber-500/30 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <span className="text-xs font-mono text-amber-400">{calc.id}</span>
                                        <h3 className="text-xl font-bold mt-1 group-hover:text-amber-400 transition-colors">{calc.name}</h3>
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm mb-4">{calc.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {calc.sources.map((source, idx) => (
                                        <span key={idx} className="text-xs bg-white/5 px-2 py-1 rounded text-slate-500">
                                            {source}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'glossary' && (
                    <div className="space-y-4">
                        {glossaryResults.length > 0 ? (
                            glossaryResults.map((entry) => (
                                <div
                                    key={entry.term}
                                    className="bg-white/5 border border-white/10 rounded-xl p-6 relative group hover:border-white/20 transition-all"
                                >
                                    <h3 className="text-xl font-bold mb-2 text-white/90 group-hover:text-white transition-colors">{entry.term}</h3>
                                    <p className="text-slate-300 mb-4">{entry.definition}</p>
                                    <p className="text-slate-400 text-sm mb-4">{entry.context}</p>
                                    {entry.legalReference && (
                                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded p-3 mb-4">
                                            <span className="text-xs font-mono text-indigo-300">
                                                Legal Reference: {entry.legalReference}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        {entry.sources.map((source, idx) => (
                                            <span key={idx} className="text-xs bg-white/5 px-2 py-1 rounded text-slate-500">
                                                {source}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Enter a search term to explore the glossary</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
