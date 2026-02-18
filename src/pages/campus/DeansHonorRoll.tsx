import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    Trophy,
    Star,
    Award,
    GraduationCap,
    Users,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CreditULogo } from "@/components/common/CreditULogo";
import { toast } from "sonner";

interface HonorStudent {
    id: string;
    user_id: string;
    display_name: string | null;
    cumulative_gpa: number;
    total_credits: number;
    academic_level: string;
    honor_type: string;
    last_updated: string;
    opt_in: boolean;
}

const honorTypeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    summa_cum_laude: {
        label: "Summa Cum Laude",
        icon: <CreditULogo className="h-6 w-6" variant="gold" showShield={false} iconClassName="h-5 w-5" />,
        color: "text-purple-500 bg-purple-500/10 border-purple-500/30"
    },
    magna_cum_laude: {
        label: "Magna Cum Laude",
        icon: <Star className="h-5 w-5" />,
        color: "text-credit-gold bg-credit-gold/10 border-credit-gold/30"
    },
    cum_laude: {
        label: "Cum Laude",
        icon: <Award className="h-5 w-5" />,
        color: "text-blue-500 bg-blue-500/10 border-blue-500/30"
    },
    deans_list: {
        label: "Dean's List",
        icon: <Trophy className="h-5 w-5" />,
        color: "text-green-500 bg-green-500/10 border-green-500/30"
    }
};

const academicLevelLabels: Record<string, string> = {
    freshman: "Freshman",
    sophomore: "Sophomore",
    junior: "Junior",
    senior: "Senior",
    alumni: "Alumni",
    foundation: "Foundation"
};

const DeansHonorRoll = () => {
    // Adapted to use local useProfile instead of useAuth
    const { user, profile, loading: authLoading } = useProfile();
    const navigate = useNavigate();
    const [students, setStudents] = useState<HonorStudent[]>([]);
    const [loading, setLoading] = useState(true);
    const [userOptIn, setUserOptIn] = useState(true);
    const [userOnRoll, setUserOnRoll] = useState<HonorStudent | null>(null);

    useEffect(() => {
        fetchHonorRoll();
    }, []);

    useEffect(() => {
        if (user) {
            checkUserStatus();
        }
    }, [user]);

    const fetchHonorRoll = async () => {
        try {
            const { data, error } = await supabase
                .from('honor_roll')
                .select('*')
                .eq('opt_in', true)
                .gte('cumulative_gpa', 3.0)
                .order('cumulative_gpa', { ascending: false })
                .limit(50);

            // If table doesn't exist, this might error. Gracefully handle it.
            if (error) {
                if (error.code === '42P01') {
                    console.warn("Honor Roll table not found.");
                    setStudents([]);
                    return;
                }
                throw error;
            }
            setStudents(data || []);
        } catch (error) {
            console.error('Error fetching honor roll:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkUserStatus = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('honor_roll')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'row not found' sometimes
            if (data) {
                setUserOnRoll(data);
                setUserOptIn(data.opt_in);
            }
        } catch (error) {
            console.error('Error checking user status:', error);
        }
    };

    const handleJoin = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Calculate pseudo-GPA from profile/points if available, or default to 4.0 for demo
            const demoGPA = 4.0;

            const { error } = await supabase
                .from('honor_roll')
                .insert({
                    user_id: user.id,
                    display_name: profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : 'Scholar',
                    cumulative_gpa: demoGPA,
                    total_credits: 12, // Demo credits
                    academic_level: 'freshman',
                    honor_type: 'summa_cum_laude', // Default for demo
                    opt_in: true
                });

            if (error) throw error;

            // Refresh
            await checkUserStatus();
            await fetchHonorRoll();
            toast.success("Welcome to the Dean's Honor Roll!");

        } catch (error: any) {
            console.error('Error joining honor roll:', error);

            // Handle Duplicate Key (Already Joined)
            if (error.code === '23505') {
                toast.info("You are already on the Honor Roll.");
                await checkUserStatus();
                return;
            }

            // If RLS fails (42501), warn user
            if (error.code === '42501') {
                toast.error("Database Permissions Error");
                alert("REQUIRED ACTION: You must run the SQL command to allow users to join. Check the chat for the code.");
            } else {
                toast.error("Failed to join Honor Roll. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleOptIn = async () => {
        if (!user || !userOnRoll) return;

        const newOptIn = !userOptIn;
        setUserOptIn(newOptIn);

        try {
            await supabase
                .from('honor_roll')
                .update({ opt_in: newOptIn })
                .eq('user_id', user.id);

            // Refresh the list
            fetchHonorRoll();
        } catch (error) {
            console.error('Error updating opt-in:', error);
            setUserOptIn(!newOptIn); // Revert on error
        }
    };

    // Group students by honor type
    const groupedStudents = students.reduce((acc, student) => {
        if (!acc[student.honor_type]) acc[student.honor_type] = [];
        acc[student.honor_type].push(student);
        return acc;
    }, {} as Record<string, HonorStudent[]>);

    const honorOrder = ['summa_cum_laude', 'magna_cum_laude', 'cum_laude', 'deans_list'];

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading Honor Roll...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-credit-gold" />
                        <span className="font-semibold">Dean's Honor Roll</span>
                    </div>
                    {!userOnRoll && !loading && (
                        <Button size="sm" onClick={handleJoin} className="bg-credit-gold hover:bg-yellow-600 text-black font-bold ml-4">
                            Apply for Honors
                        </Button>
                    )}
                </div>
            </header>

            <main className="container py-8 max-w-4xl">
                {/* Hero Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-credit-gold/20 mb-4">
                        <GraduationCap className="h-8 w-8 text-credit-gold" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Dean's Honor Roll</h1>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Recognizing Credit U scholars who have demonstrated exceptional academic achievement
                        with a cumulative GPA of 3.0 or higher.
                    </p>
                </div>

                {/* User Status Card */}
                {user && userOnRoll && (
                    <Card className="mb-8 border-credit-gold/30 bg-gradient-to-br from-card to-credit-gold/5">
                        <CardContent className="py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                        honorTypeConfig[userOnRoll.honor_type]?.color || "bg-muted"
                                    )}>
                                        {honorTypeConfig[userOnRoll.honor_type]?.icon || <Star className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold">Your Standing</p>
                                        <p className="text-sm text-muted-foreground">
                                            {honorTypeConfig[userOnRoll.honor_type]?.label} • {userOnRoll.cumulative_gpa.toFixed(2)} GPA
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Label htmlFor="opt-in" className="text-sm text-muted-foreground">
                                        Show on Roll
                                    </Label>
                                    <Switch
                                        id="opt-in"
                                        checked={userOptIn}
                                        onCheckedChange={toggleOptIn}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="py-4 text-center">
                            <Users className="h-5 w-5 text-primary mx-auto mb-1" />
                            <p className="text-2xl font-bold">{students.length}</p>
                            <p className="text-xs text-muted-foreground">Honor Students</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="py-4 text-center">
                            <CreditULogo className="h-6 w-6 mx-auto mb-1" variant="gold" showShield={false} iconClassName="h-5 w-5" />
                            <p className="text-2xl font-bold">
                                {groupedStudents['summa_cum_laude']?.length || 0}
                            </p>
                            <p className="text-xs text-muted-foreground">Summa Cum Laude</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="py-4 text-center">
                            <Star className="h-5 w-5 text-credit-gold mx-auto mb-1" />
                            <p className="text-2xl font-bold">
                                {groupedStudents['magna_cum_laude']?.length || 0}
                            </p>
                            <p className="text-xs text-muted-foreground">Magna Cum Laude</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="py-4 text-center">
                            <Sparkles className="h-5 w-5 text-green-500 mx-auto mb-1" />
                            <p className="text-2xl font-bold">
                                {students.length > 0 ? students[0].cumulative_gpa.toFixed(2) : '0.00'}
                            </p>
                            <p className="text-xs text-muted-foreground">Top GPA</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Honor Roll List */}
                {students.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Students Yet</h3>
                            <p className="text-muted-foreground">
                                Be the first to earn a spot on the Dean's Honor Roll by achieving a 3.0 GPA or higher.
                            </p>
                            {!userOnRoll && (
                                <Button onClick={handleJoin} className="mt-6 bg-credit-gold hover:bg-yellow-600 text-black font-bold">
                                    Claim Your Spot (Demo)
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-8">
                        {honorOrder.map(honorType => {
                            const typeStudents = groupedStudents[honorType];
                            if (!typeStudents || typeStudents.length === 0) return null;

                            const config = honorTypeConfig[honorType];

                            return (
                                <div key={honorType}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className={cn("p-2 rounded-lg", config.color)}>
                                            {config.icon}
                                        </div>
                                        <div>
                                            <h2 className="font-semibold">{config.label}</h2>
                                            <p className="text-xs text-muted-foreground">
                                                {typeStudents.length} student{typeStudents.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-3">
                                        {typeStudents.map((student, index) => (
                                            <Card
                                                key={student.id}
                                                className={cn(
                                                    "transition-colors",
                                                    user && student.user_id === user.id && "ring-2 ring-credit-gold"
                                                )}
                                            >
                                                <CardContent className="py-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                                                                {index + 1}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">
                                                                    {student.display_name || `Scholar #${student.id.slice(0, 6)}`}
                                                                    {user && student.user_id === user.id && (
                                                                        <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                                                                    )}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {academicLevelLabels[student.academic_level] || student.academic_level} •
                                                                    {student.total_credits} credits
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-bold text-primary">
                                                                {student.cumulative_gpa.toFixed(2)}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">GPA</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    <Separator className="mt-6" />
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Eligibility Info */}
                <Card className="mt-8 bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-sm">Honor Roll Eligibility</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p><strong>Dean's List:</strong> 3.0 - 3.49 GPA</p>
                        <p><strong>Cum Laude:</strong> 3.5 - 3.69 GPA</p>
                        <p><strong>Magna Cum Laude:</strong> 3.7 - 3.89 GPA</p>
                        <p><strong>Summa Cum Laude:</strong> 3.9+ GPA</p>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default DeansHonorRoll;
