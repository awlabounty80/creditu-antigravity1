
import { useState } from 'react';
import { Upload, X, FileVideo, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function MediaUploader({ onUploadComplete }: { onUploadComplete?: (url: string) => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [successUrl, setSuccessUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError(null);
            setSuccessUrl(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setProgress(0);
        setError(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            // 1. Upload
            const { error: uploadError } = await supabase.storage
                .from('campus-assets')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                throw uploadError;
            }

            // 2. Get URL
            const { data } = supabase.storage
                .from('campus-assets')
                .getPublicUrl(filePath);

            setSuccessUrl(data.publicUrl);
            if (onUploadComplete) onUploadComplete(data.publicUrl);

        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.message || 'Upload failed. Ensure "campus-assets" bucket exists.');
        } finally {
            setUploading(false);
            setProgress(100);
        }
    };

    return (
        <Card className="bg-[#0A0F1E] border-dashed border-2 border-indigo-500/30">
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-indigo-500/10 rounded-full">
                    {successUrl ? (
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                    ) : (
                        <Upload className="w-8 h-8 text-indigo-400" />
                    )}
                </div>

                <div className="text-center">
                    <h3 className="text-lg font-bold text-white">Upload Media</h3>
                    <p className="text-slate-400 text-xs mt-1">Videos, Images, or Documents</p>
                </div>

                {!file && !successUrl && (
                    <div className="relative group">
                        <Button variant="outline" className="border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10">
                            Select File
                        </Button>
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                            accept="video/*,image/*,application/pdf"
                        />
                    </div>
                )}

                {file && !successUrl && (
                    <div className="w-full space-y-3">
                        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                            <FileVideo className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-white truncate max-w-[200px]">{file.name}</span>
                            <button onClick={() => setFile(null)} disabled={uploading} className="ml-auto text-slate-500 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {uploading && <Progress value={progress} className="h-1 bg-slate-800" />}

                        <Button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                                </>
                            ) : (
                                'Confirm Upload'
                            )}
                        </Button>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 text-red-400 text-xs bg-red-900/20 p-2 rounded w-full">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {successUrl && (
                    <div className="w-full bg-emerald-900/20 p-3 rounded-lg border border-emerald-500/30 text-center">
                        <p className="text-xs text-emerald-300 font-bold mb-2">Upload Complete!</p>
                        <code className="block bg-black/50 p-2 rounded text-[10px] text-slate-300 break-all select-all">
                            {successUrl}
                        </code>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-xs text-emerald-400 hover:text-emerald-300"
                            onClick={() => { setFile(null); setSuccessUrl(null); }}
                        >
                            Upload Another
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
