# Supabase Setup

## Migrations

To apply the migrations to your Supabase database:

### Option 1: Using Supabase Dashboard (SQL Editor)
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Open and run each migration file in the `migrations/` folder in order

### Option 2: Using Supabase CLI
```bash
# Initialize Supabase in your project (if not already done)
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

## Storage Setup

### Create the Images Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the sidebar
3. Click **New bucket**
4. Create a bucket named `images`
5. Set it as **Public bucket** (or configure RLS policies as needed)

### Storage Policies

If you want more control, set up Row Level Security (RLS) policies:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to images
CREATE POLICY "Public read access to images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Current Migrations

- `20260221_add_image_url_to_brew.sql` - Adds image_url column to brew table
