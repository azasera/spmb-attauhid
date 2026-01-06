-- ✅ COPY-PASTE SQL INI KE SUPABASE SQL EDITOR
-- URL: https://supabase.com/dashboard/project/eknvmtigbjzjwclfcwlh/sql/new

-- ========================================
-- CREATE STORAGE BUCKET FOR BACKUPS
-- ========================================

-- Step 1: Create bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('backups', 'backups', false, 52428800, ARRAY['application/json'])
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create policies for authenticated users
CREATE POLICY IF NOT EXISTS "Allow authenticated users to upload backups"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'backups');

CREATE POLICY IF NOT EXISTS "Allow authenticated users to read backups"
ON storage.objects FOR SELECT 
TO authenticated
USING (bucket_id = 'backups');

CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete backups"
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'backups');

CREATE POLICY IF NOT EXISTS "Allow authenticated users to update backups"
ON storage.objects FOR UPDATE 
TO authenticated
USING (bucket_id = 'backups');

-- ========================================
-- VERIFY SETUP
-- ========================================

-- Check bucket created
SELECT 
  '✅ Bucket Created' as status,
  id,
  name,
  CASE WHEN public THEN '⚠️ Public' ELSE '✅ Private' END as access,
  file_size_limit / 1048576 || ' MB' as size_limit
FROM storage.buckets 
WHERE name = 'backups';

-- Check policies created
SELECT 
  '✅ Policies Created' as status,
  policyname,
  cmd as operation
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%backup%'
ORDER BY policyname;

-- ========================================
-- EXPECTED RESULTS:
-- ========================================
-- Result 1: Bucket Created
--   ✅ Bucket Created | backups | backups | ✅ Private | 50 MB
--
-- Result 2: Policies Created (4 rows)
--   ✅ Policies Created | Allow authenticated users to delete backups | DELETE
--   ✅ Policies Created | Allow authenticated users to read backups   | SELECT
--   ✅ Policies Created | Allow authenticated users to update backups | UPDATE
--   ✅ Policies Created | Allow authenticated users to upload backups | INSERT
--
-- If you see these results, setup is successful! ✅

-- ========================================
-- NEXT STEPS:
-- ========================================
-- 1. Refresh your application (F5)
-- 2. Error "Bucket not found" should be gone
-- 3. Test backup feature in Admin dashboard
-- 4. Done! 🎉
