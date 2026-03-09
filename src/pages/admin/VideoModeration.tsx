import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { supabase } from '../../lib/supabaseClient';
import { CheckCircle, XCircle, Play, ExternalLink, ShieldCheck } from 'lucide-react';

export default function VideoModeration() {
    const [pendingVideos, setPendingVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('video_sources')
            .select('*')
            .eq('status', 'matched_pending_review')
            .order('created_at', { ascending: false });
        if (data) setPendingVideos(data);
        setLoading(false);
    };

    const handleAction = async (id: string, status: 'approved_external' | 'rejected') => {
        const { error } = await supabase
            .from('video_sources')
            .update({ status, is_admin_approved: status === 'approved_external' })
            .eq('id', id);

        if (!error) {
            setPendingVideos(prev => prev.filter(v => v.id !== id));
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-indigo-600" />
                        Video Ingestion Queue
                    </h1>
                    <p className="text-gray-500 mt-1">Review matched educational content from verified sources.</p>
                </div>
                <Button variant="outline" onClick={fetchPending}>Refresh Queue</Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : pendingVideos.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-20 text-center space-y-4">
                        <div className="p-4 bg-gray-50 rounded-full w-fit mx-auto">
                            <CheckCircle className="w-12 h-12 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Queue Clear</h3>
                        <p className="text-gray-500">All matched videos have been moderated.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingVideos.map((video) => (
                        <Card key={video.id} className="overflow-hidden border-2 hover:border-indigo-500/20 transition-all">
                            <CardHeader className="bg-gray-50 border-b p-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <CardTitle className="text-sm font-bold line-clamp-1">{video.title}</CardTitle>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                            Source: {video.source_platform} • {video.source_type}
                                        </p>
                                    </div>
                                    <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                        MATCHED
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="aspect-video bg-black relative group">
                                    <img src={video.thumbnail_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a href={video.video_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full shadow-xl">
                                            <Play className="fill-indigo-600 text-indigo-600 w-6 h-6" />
                                        </a>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Duration: {video.duration_seconds}s</span>
                                        <a href={video.video_url} target="_blank" className="text-indigo-600 font-bold flex items-center gap-1 hover:underline">
                                            View Source <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                            onClick={() => handleAction(video.id, 'approved_external')}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                            onClick={() => handleAction(video.id, 'rejected')}
                                        >
                                            <XCircle className="w-4 h-4 mr-2" /> Reject
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
