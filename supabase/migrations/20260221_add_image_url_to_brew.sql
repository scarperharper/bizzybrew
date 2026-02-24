-- Add image_url column to brew table
ALTER TABLE brew ADD COLUMN image_url TEXT;

-- Add comment to document the column
COMMENT ON COLUMN brew.image_url IS 'Public URL of the brew image stored in Supabase storage';
