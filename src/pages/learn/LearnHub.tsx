import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { supabase } from '../../lib/supabaseClient'; // Ensure this exists or mock it
import { Track } from '../../types/curriculum';

export default function LearnHub() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTracks() {
            // Mock or Real fetch
            try {
                // In a real scenario: const { data, error } = await supabase.from('tracks').select('*').eq('is_published', true).order('order_index');
                // For Build Phase 1A, if DB isn't live yet, we might fallback to seed data or use the actual table if migrations ran.
                // Assuming migrations run manually or via tool, let's write the real code but handle empty.

                // MOCK SEED for Demo (since run_command to apply sql hasn't happened yet probably)
                const mockTracks: Track[] = [
                    {
                        id: '1', title: 'Freshman Core', slug: 'freshman-core',
                        description: 'The foundational knowledge required to understand the credit system.',
                        order_index: 1, is_published: true
                    }
                ];
                setTracks(mockTracks);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchTracks();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Campus...</div>;

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col items-start gap-2">
                <h1 className="text-4xl font-black text-blue-900 tracking-tight">The Yard</h1>
                <p className="text-gray-600 text-lg">Select a curriculum track to begin your education.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tracks.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">Campus is Quiet</h3>
                        <p className="text-gray-500 mb-6">No classes have been published yet.</p>
                        <div className="text-xs text-blue-600 font-mono bg-blue-50 inline-block px-4 py-2 rounded">
                            Dev Hint: Run the Seed SQL in Supabase.
                        </div>
                    </div>
                )}

                {tracks.map((track) => (
                    <Card key={track.id} className="group hover:shadow-xl transition-all duration-300 border-blue-100 cursor-pointer overflow-hidden">
                        <div className="h-48 bg-blue-900 relative">
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 text-white">
                                <div className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-1">Track {track.order_index}</div>
                                <h3 className="text-2xl font-bold">{track.title}</h3>
                            </div>
                        </div>
                        <CardContent className="p-6">
                            <p className="text-gray-600 mb-6 line-clamp-3">{track.description}</p>

                            <Link to={`/learn/${track.slug}`}>
                                <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold gap-2">
                                    Enter Classroom <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
