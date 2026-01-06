-- Setup Storage Bucket untuk Backup
-- Jalankan di Supabase SQL Editor

-- CATATAN: Bucket storage tidak bisa dibuat via SQL
-- Anda harus membuat bucket secara manual di Supabase Dashboard

-- Langkah-langkah:
-- 1. Buka Supabase Dashboard: https://supabase.com/dashboard
-- 2. Pilih project Anda
-- 3. Klik "Storage" di sidebar kiri
-- 4. Klik tombol "New bucket"
-- 5. Isi form:
--    - Name: backups
--    - Public: OFF (unchecked)
--    - File size limit: 50 MB
--    - Allowed MIME types: application/json
-- 6. Klik "Create bucket"

-- Setelah bucket dibuat, Anda bisa set policies untuk akses:

-- Policy 1: Allow authenticated users to upload backups
CREATE POLICY "Allow authenticated users to upload backups"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'backups');

-- Policy 2: Allow authenticated users to read backups
CREATE POLICY "Allow authenticated users to read backups"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'backups');

-- Policy 3: Allow authenticated users to delete backups
CREATE POLICY "Allow authenticated users to delete backups"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'backups');

-- Policy 4: Allow authenticated users to update backups
CREATE POLICY "Allow authenticated users to update backups"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'backups');

-- Verifikasi bucket sudah dibuat (jalankan setelah membuat bucket):
-- SELECT * FROM storage.buckets WHERE name = 'backups';

-- Verifikasi policies:
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%backup%';
