-- Credit Lab Professor Preferences
-- Adds a JSONB column to store non-PII UI settings.

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS credit_lab_preferences JSONB DEFAULT '{
  "orientationCompleted": false, 
  "guidanceMode": "FULL_GUIDANCE", 
  "voiceEnabled": true, 
  "captionsEnabled": true
}'::jsonb;

-- Update RLS (Policies should already cover update/select for owner, but just in case)
-- Existing policies on user_profiles usually allow owner to update their own row.
