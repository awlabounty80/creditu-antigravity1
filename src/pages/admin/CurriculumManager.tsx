import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { supabase } from '../../lib/supabaseClient';
import { Track } from '../../types/curriculum';

export default function CurriculumManager() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTracks() {
            const { data } = await supabase.from('tracks').select('*').order('order_index');
            if (data) setTracks(data as Track[]);
            setLoading(false);
        }
        fetchTracks();
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-gray-900">Curriculum Manager</h1>
                <Button>+ New Track</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Published Tracks</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading && <p className="text-gray-500">Loading...</p>}

                        {!loading && tracks.length === 0 && (
                            <p className="text-gray-500 italic">No tracks found. Database is empty.</p>
                        )}

                        {tracks.map(track => (
                            <div key={track.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                                <div>
                                    <h3 className="font-bold">{track.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        Slug: {track.slug} • Order: {track.order_index} • {track.is_published ? 'Published' : 'Draft'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">Edit</Button>
                                    <Button variant="destructive" size="sm">Unpublish</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Ingestion Queue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-500 text-sm">No pending items from Batch Processor.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm">
                            <div className="flex justify-between py-2 border-b">
                                <span>Database Connection</span>
                                <span className="text-green-600 font-bold">Active</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span>Total Tracks</span>
                                <span className="font-bold">{tracks.length}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
