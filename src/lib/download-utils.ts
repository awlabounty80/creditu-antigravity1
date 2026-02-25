// src/lib/download-utils.ts
import { supabase } from "./supabaseClient";

export const downloadAcademicAsset = async (fileName: string, assetName: string) => {
    try {
        // 1. Get the public URL from your 'assets' bucket
        const { data } = supabase.storage
            .from('academic-assets')
            .getPublicUrl(fileName);

        if (!data.publicUrl) throw new Error("File not found");

        // 2. Create a temporary 'a' tag to trigger download
        const link = document.createElement('a');
        link.href = data.publicUrl;
        link.download = fileName; // Ensures the browser saves it rather than just opening it
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Using alert as fallback for toast.success
        alert(`${assetName} is ready! Check your downloads folder.`);
    } catch (error) {
        console.error("Download error:", error);
        // Using alert as fallback for toast.error
        alert("Failed to fetch asset. Please contact the Dean.");
    }
};
