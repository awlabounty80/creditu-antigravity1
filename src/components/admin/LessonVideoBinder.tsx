
import { useState, useEffect } from 'react';
import { Search, Link as LinkIcon, Save, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LessonVideoBinder() {
    const [lessons, setLessons] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [selectedLesson, setSelectedLesson] = useState<any>(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [chatLog, setChatLog] = useState('');
    const [forceAvatar, setForceAvatar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Fetch lessons on mount
    useEffect(() => {
        const fetchLessons = async () => {
            const { data } = await supabase
                .from('lessons')
                .select('id, title, module_id')
                .order('title');
            if (data) setLessons(data);
        };
        fetchLessons();
    }, []);

    const filteredLessons = lessons.filter(l =>
        l.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleBind = async () => {
        if (!selectedLesson || !videoUrl) return;

        setLoading(true);

        // Fetch current content first to append properly
        const { data: currentData } = await supabase
            .from('lessons')
            .select('content')
            .eq('id', selectedLesson.id)
            .single();

        let newContent = currentData?.content || "";
        // Remove existing tag
        // Remove existing tags
        newContent = newContent
            .replace(/VIDEO_URL:.*(\n|$)/g, '')
            .replace(/VIDEO_MODE:.*(\n|$)/g, '')
            .replace(/CHAT_LOG_START[\s\S]*?CHAT_LOG_END/g, '');

        // Prepend new video tags
        const modeTag = forceAvatar ? "VIDEO_MODE: AVATAR\n" : "VIDEO_MODE: VIDEO\n";
        newContent = `VIDEO_URL: ${videoUrl}\n${modeTag}\n${newContent}`;

        // Append Chat Log if exists
        if (chatLog.trim()) {
            newContent = `${newContent}\n\nCHAT_LOG_START\n${chatLog.trim()}\nCHAT_LOG_END`;
        }

        // Update lesson content
        const { error } = await supabase
            .from('lessons')
            .update({ content: newContent })
            .eq('id', selectedLesson.id);

        if (error) {
            alert('Error binding video: ' + error.message);
        } else {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
        setLoading(false);
    };

    return (
        <Card className="bg-[#0A0F1E] border border-slate-800 text-white h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <LinkIcon className="w-5 h-5 text-indigo-400" />
                    Video Binder
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* 1. Paste URL */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">1. Paste Video URL</label>
                    <div className="flex gap-2">
                        <Input
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="https://..."
                            className="bg-black/50 border-white/10 text-xs font-mono"
                        />
                    </div>
                </div>

                {/* 1.5 Chat Log */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">OPTIONAL: Archive Chat Log</label>
                    <Textarea
                        value={chatLog}
                        onChange={(e) => setChatLog(e.target.value)}
                        placeholder="Paste chat history here..."
                        className="bg-black/50 border-white/10 text-xs font-mono min-h-[100px]"
                    />
                </div>

                {/* 1.5 View Mode */}
                <div className="flex items-center space-x-2 bg-black/20 p-3 rounded-lg border border-white/5">
                    <Switch id="view-mode" checked={forceAvatar} onCheckedChange={setForceAvatar} />
                    <Label htmlFor="view-mode" className="text-xs font-bold uppercase text-slate-400 cursor-pointer">
                        {forceAvatar ? "Default: 3D Avatar (User can switch to Video)" : "Default: Video Embed"}
                    </Label>
                </div>

                {/* 2. Select Lesson */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">2. Select Target Lesson</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search lesson title..."
                            className="bg-black/50 border-white/10 pl-9"
                        />
                    </div>

                    {search && (
                        <div className="max-h-40 overflow-y-auto border border-white/5 rounded-lg bg-black/20 mt-2 custom-scrollbar">
                            {filteredLessons.map(lesson => (
                                <button
                                    key={lesson.id}
                                    onClick={() => { setSelectedLesson(lesson); setSearch(''); }}
                                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-indigo-500/20 hover:text-white transition-colors flex items-center justify-between"
                                >
                                    <span>{lesson.title}</span>
                                    <span className="text-[10px] bg-slate-800 px-1.5 rounded">{lesson.id.slice(0, 4)}...</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {selectedLesson && (
                        <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg flex items-center justify-between mt-2">
                            <span className="font-bold text-indigo-300 text-sm">{selectedLesson.title}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedLesson(null)}
                                className="h-6 w-6 p-0 hover:bg-indigo-500/20"
                            >x</Button>
                        </div>
                    )}
                </div>

                {/* 3. Execute */}
                <Button
                    onClick={handleBind}
                    disabled={!selectedLesson || !videoUrl || loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {success ? (
                        <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Success!
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Bind Video to Lesson
                        </>
                    )}
                </Button>

            </CardContent>
        </Card>
    );
}
