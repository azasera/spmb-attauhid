-- Setup Supabase Storage untuk Backup Feature
-- Run this SQL in your Supabase SQL Editor if bucket is not auto-created

-- Create storage bucket for backups
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'backups',
  'backups',
  false,
  52428800, -- 50MB
  ARRAY['application/json']
)
ON CONFLICT (id) DO NOTHING;

-- Create policies for authenticated users
CREATE POLICY IF NOT EXISTS "Allow authenticated users to upload backups"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'backups');

CREATE POLICY IF NOT EXISTS "Allow authenticated users to read backups"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'backups');

CREATE POLICY IF NOT EXISTS "Allow authenticated users to update backups"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'backups');

CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete backups"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'backups');

-- Grant permissions
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated;

-- Verify setup
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'backups';
