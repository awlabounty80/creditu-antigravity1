-- Step 1: Create professor_prefs table
-- Strict adherence to Execution Blueprint

CREATE TABLE IF NOT EXISTS public.professor_prefs (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    creditlab_orientation_completed BOOLEAN DEFAULT false,
    guidance_mode TEXT CHECK (guidance_mode IN ('FULL', 'LIGHT', 'SILENT')) DEFAULT 'FULL',
    voice_enabled BOOLEAN DEFAULT true,
    captions_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.professor_prefs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own prefs" 
ON public.professor_prefs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prefs" 
ON public.professor_prefs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prefs" 
ON public.professor_prefs FOR UPDATE 
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_professor_prefs_modtime
    BEFORE UPDATE ON public.professor_prefs
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
