import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Eye,
    EyeOff,
    CheckCircle,
    XCircle,
    BookOpen,
    Brain,
    Target,
    Lightbulb,
    Lock,
    ArrowRight,
    ArrowLeft,
    Clock,
    Heart,
    Shield,
    TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const VisibilityStrategyLab = () => {
    const navigate = useNavigate();

    const labIs = [
        { icon: Eye, text: "Guided financial visibility" },
        { icon: Clock, text: "Weekly interpretation rituals" },
        { icon: Target, text: "Credit-timing clarity" },
        { icon: Heart, text: "Fear-free decision making" },
        { icon: Brain, text: "Strategy before action" },
    ];

    const labIsNot = [
        { icon: XCircle, text: "A budgeting app" },
        { icon: XCircle, text: "A credit score tool" },
        { icon: XCircle, text: "Financial advice" },
        { icon: XCircle, text: "A quick fix" },
        { icon: XCircle, text: "Overwhelming data dumps" },
    ];

    const weeklyRitualSteps = [
        {
            step: 1,
            title: "Review",
            description: "Open your financial snapshot (any tool you choose)",
            icon: Eye,
        },
        {
            step: 2,
            title: "Reflect",
            description: "Answer 3 guided questions (provided by Credit U)",
            icon: Brain,
        },
        {
            step: 3,
            title: "Interpret",
            description: "Understand what the data is signaling — not judging",
            icon: Lightbulb,
        },
        {
            step: 4,
            title: "Decide",
            description: "Choose ONE aligned action for the week",
            icon: Target,
        },
    ];

    const valueStack = [
        { icon: BookOpen, text: "Weekly guided review prompts" },
        { icon: Brain, text: "Interpretation frameworks" },
        { icon: TrendingUp, text: "Credit utilization clarity" },
        { icon: Clock, text: "Timing guidance (paydown vs pause)" },
        { icon: Heart, text: "Emotional & spiritual money alignment" },
        { icon: Shield, text: "Protection from fear-based decisions" },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Back Navigation */}
            <div className="container mx-auto px-4 pt-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/dashboard")}
                    className="gap-2 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Campus
                </Button>
            </div>

            {/* Opening Authority Section */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-credit-gold/5">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
                        Clarity Changes Everything.
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
                        Credit U teaches you how money works.<br />
                        This lab teaches you how it's working in <span className="text-primary font-semibold">YOUR</span> life.
                    </p>
                    <p className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-xl mx-auto">
                        We don't react to numbers here.<br />
                        We interpret them.<br />
                        We move with wisdom, not panic.
                    </p>

                    {/* Dean's Note */}
                    <Card className="mt-12 bg-card/80 backdrop-blur border-credit-gold/20 max-w-2xl mx-auto">
                        <CardContent className="p-6 md:p-8">
                            <p className="text-sm uppercase tracking-widest text-credit-gold font-semibold mb-3">Dean's Note</p>
                            <p className="text-muted-foreground italic leading-relaxed">
                                "Financial clarity isn't about having all the answers. It's about asking the right questions
                                and giving yourself the grace to learn as you go. This lab is your space to breathe,
                                observe, and move forward — one thoughtful step at a time."
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Subtitle Section */}
            <section className="py-8 bg-primary">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-lg md:text-xl text-primary-foreground font-medium">
                        Visibility & Strategy Lab
                    </p>
                    <p className="text-primary-foreground/80 mt-2">
                        Learn to read your money clearly — and move with confidence.
                    </p>
                </div>
            </section>

            {/* What This Lab IS and IS NOT */}
            <section className="py-16 md:py-24 bg-secondary/50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
                        What This Lab Is <span className="text-credit-gold">&</span> Is Not
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                        {/* This Lab IS */}
                        <Card className="bg-card border-2 border-primary/20 hover:border-primary/40 transition-colors">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <CheckCircle className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">This Lab IS</h3>
                                </div>
                                <ul className="space-y-4">
                                    {labIs.map((item, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <item.icon className="w-5 h-5 text-credit-gold flex-shrink-0" />
                                            <span className="text-foreground/90">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* This Lab is NOT */}
                        <Card className="bg-card border-2 border-muted hover:border-muted-foreground/30 transition-colors">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-full bg-muted">
                                        <EyeOff className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">This Lab is NOT</h3>
                                </div>
                                <ul className="space-y-4">
                                    {labIsNot.map((item, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <item.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                            <span className="text-muted-foreground">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* The Visibility Phase */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
                        The Visibility Phase
                    </h2>
                    <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto text-lg">
                        Visibility is not about seeing more. It's about seeing <span className="text-primary font-semibold">clearly</span>.
                    </p>

                    <div className="bg-gradient-to-br from-primary/5 to-credit-gold/5 rounded-2xl p-8 md:p-12 border border-border">
                        <p className="text-foreground/80 text-lg leading-relaxed mb-8 text-center">
                            Before leverage comes understanding.<br />
                            Before action comes alignment.
                        </p>

                        <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
                            This lab teaches students to:
                        </h3>

                        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            {[
                                "Read patterns, not just numbers",
                                "Identify emotional spending",
                                "Understand cash flow impact on credit",
                                "Know what matters now — and what doesn't",
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 bg-card rounded-lg p-4 border border-border"
                                >
                                    <CheckCircle className="w-5 h-5 text-credit-gold flex-shrink-0 mt-0.5" />
                                    <span className="text-foreground/90">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Weekly Ritual Flow */}
            <section className="py-16 md:py-24 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        Weekly Ritual Flow
                    </h2>
                    <p className="text-center text-primary-foreground/80 mb-12 max-w-2xl mx-auto">
                        Your 4-step weekly practice for financial clarity
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {weeklyRitualSteps.map((step) => (
                            <Card
                                key={step.step}
                                className="bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur"
                            >
                                <CardContent className="p-6 text-center">
                                    <div className="w-12 h-12 rounded-full bg-credit-gold flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white font-bold text-lg">{step.step}</span>
                                    </div>
                                    <step.icon className="w-8 h-8 text-credit-gold mx-auto mb-3" />
                                    <h3 className="text-xl font-bold text-primary-foreground mb-2">{step.title}</h3>
                                    <p className="text-primary-foreground/80 text-sm">{step.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="mt-10 bg-credit-gold/20 border-credit-gold/30 max-w-xl mx-auto">
                        <CardContent className="p-4 text-center">
                            <Clock className="w-5 h-5 text-credit-gold inline-block mr-2" />
                            <span className="text-primary-foreground/90">
                                This takes 10–15 minutes. Consistency matters more than perfection.
                            </span>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Optional Tools Section */}
            <section className="py-16 md:py-24 bg-secondary/30">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
                        Optional Visibility Tools
                    </h2>
                    <p className="text-center text-muted-foreground mb-8">
                        (Student Choice)
                    </p>

                    <Card className="bg-card border-border">
                        <CardContent className="p-8 md:p-10">
                            <p className="text-foreground/80 leading-relaxed mb-6">
                                Some students choose to use external tools to view their finances in one place.
                            </p>
                            <p className="text-foreground font-medium mb-6">
                                Credit U does not require or endorse dependency on any platform.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                If you choose to use a tool, you will be taught:
                            </p>

                            <ul className="space-y-3">
                                {[
                                    "How to interpret the data correctly",
                                    "What to ignore",
                                    "What NOT to react to",
                                    "How to align actions with credit strategy",
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span className="text-foreground/90">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* What Students Receive */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
                        What Students Receive
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {valueStack.map((item, index) => (
                            <Card
                                key={index}
                                className="bg-card border-border hover:border-credit-gold/40 transition-colors"
                            >
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-credit-gold/10">
                                        <item.icon className="w-6 h-6 text-credit-gold" />
                                    </div>
                                    <span className="text-foreground font-medium">{item.text}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Access Control */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-credit-gold/10">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <Badge variant="outline" className="mb-6 px-4 py-2 text-base border-credit-gold text-credit-gold">
                        <Lock className="w-4 h-4 mr-2 inline-block" />
                        Unlocked After Foundations
                    </Badge>

                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                        Ready to Lead Your Money?
                    </h2>

                    <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                        This lab is for students ready to lead their money — not fear it.
                    </p>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 md:py-24 bg-primary">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                        Enter the Visibility & Strategy Lab
                    </h2>

                    <p className="text-primary-foreground/80 mb-10 max-w-lg mx-auto leading-relaxed">
                        You don't need more information.<br />
                        You need clear interpretation and confident next steps.
                    </p>

                    <Button
                        className="group bg-credit-gold hover:bg-yellow-600 text-white font-bold py-6 px-8 text-lg"
                        size="lg"
                        onClick={() => navigate("/dashboard/credit-lab")}
                    >
                        Enter the Lab
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default VisibilityStrategyLab;
