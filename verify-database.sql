-- ✅ Verifikasi Database Setup - SPMB At Tauhid
-- Copy-paste ke Supabase SQL Editor dan Run untuk cek status

-- ========================================
-- 1. CEK TABLE YANG ADA
-- ========================================
SELECT 
  '1. TABLES' as check_type,
  table_name,
  CASE 
    WHEN table_name IN ('users', 'students', 'rubric_guides', 'app_settings') 
    THEN '✅ OK'
    ELSE '⚠️ Extra Table'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- ========================================
-- 2. CEK JUMLAH DATA
-- ========================================
SELECT 
  '2. DATA COUNT' as check_type,
  'users' as table_name,
  COUNT(*) as total_records
FROM users
UNION ALL
SELECT 
  '2. DATA COUNT',
  'students',
  COUNT(*)
FROM students
UNION ALL
SELECT 
  '2. DATA COUNT',
  'rubric_guides',
  COUNT(*)
FROM rubric_guides
UNION ALL
SELECT 
  '2. DATA COUNT',
  'app_settings',
  COUNT(*)
FROM app_settings;

-- ========================================
-- 3. CEK STORAGE BUCKETS
-- ========================================
SELECT 
  '3. STORAGE BUCKETS' as check_type,
  id,
  name,
  CASE 
    WHEN public THEN '⚠️ Public' 
    ELSE '✅ Private' 
  END as access,
  file_size_limit / 1048576 || ' MB' as size_limit,
  CASE 
    WHEN name = 'backups' THEN '✅ Backup bucket exists'
    ELSE '⚪ Other bucket'
  END as status
FROM storage.buckets
ORDER BY name;

-- ========================================
-- 4. CEK STORAGE POLICIES
-- ========================================
SELECT 
  '4. STORAGE POLICIES' as check_type,
  policyname,
  cmd as operation,
  CASE 
    WHEN policyname LIKE '%backup%' THEN '✅ Backup policy'
    ELSE '⚪ Other policy'
  END as status
FROM pg_policies 
WHERE tablename = 'objects'
ORDER BY policyname;

-- ========================================
-- 5. CEK KOLOM STUDENTS TABLE
-- ========================================
SELECT 
  '5. STUDENTS COLUMNS' as check_type,
  column_name,
  data_type,
  CASE 
    WHEN is_nullable = 'NO' THEN '✅ Required'
    ELSE '⚪ Optional'
  END as required
FROM information_schema.columns
WHERE table_name = 'students'
ORDER BY ordinal_position;

-- ========================================
-- 6. CEK SAMPLE DATA (5 SISWA TERAKHIR)
-- ========================================
SELECT 
  '6. RECENT STUDENTS' as check_type,
  "noTes",
  lembaga,
  data->>'namaSiswa' as nama_siswa,
  status,
  "createdAt"
FROM students
ORDER BY "createdAt" DESC
LIMIT 5;

-- ========================================
-- 7. CEK APP SETTINGS
-- ========================================
SELECT 
  '7. APP SETTINGS' as check_type,
  key,
  value,
  description
FROM app_settings
ORDER BY key;

-- ========================================
-- SUMMARY
-- ========================================
SELECT 
  '8. SUMMARY' as check_type,
  'Database Status' as item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM students LIMIT 1) 
    THEN '✅ Database is working'
    ELSE '⚠️ No data yet'
  END as status;

-- ========================================
-- EXPECTED RESULTS:
-- ========================================
-- 1. TABLES: Harus ada 4 table (users, students, rubric_guides, app_settings)
-- 2. DATA COUNT: Minimal ada data di users dan students
-- 3. STORAGE BUCKETS: Harus ada bucket 'backups' (jika sudah setup)
-- 4. STORAGE POLICIES: Harus ada policies untuk backup (jika sudah setup)
-- 5. STUDENTS COLUMNS: Harus ada kolom id, noTes, lembaga, data, status, dll
-- 6. RECENT STUDENTS: Menampilkan 5 siswa terakhir yang didaftarkan
-- 7. APP SETTINGS: Settings aplikasi (tahun_ajaran, dll)
-- 8. SUMMARY: Status keseluruhan database

-- ========================================
-- TROUBLESHOOTING:
-- ========================================
-- Jika bucket 'backups' tidak muncul:
--   → Jalankan setup-backup-storage.sql
--   → Atau buat manual di Dashboard > Storage > New bucket
--
-- Jika table tidak ada:
--   → Jalankan supabase-schema.sql
--
-- Jika data kosong:
--   → Normal untuk database baru
--   → Mulai input data via aplikasi
