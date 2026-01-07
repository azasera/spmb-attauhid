-- HAPUS DATA SMA YANG SALAH UPLOAD
-- Jalankan di Supabase SQL Editor

-- ========================================
-- STEP 1: CEK DATA SMA YANG ADA
-- ========================================
-- Lihat semua data SMA
SELECT 
  students.noTes,
  students.data->>'namaSiswa' as nama,
  students.data->>'asrama' as asrama,
  students.status,
  students.createdAt
FROM students 
WHERE students.lembaga = 'SMA'
ORDER BY students.createdAt DESC;

-- Hitung total data SMA
SELECT COUNT(*) as total_data_sma FROM students WHERE lembaga = 'SMA';

-- ========================================
-- STEP 2: HAPUS SEMUA DATA SMA
-- ========================================
-- ⚠️ HATI-HATI: Ini akan hapus SEMUA data SMA
-- Pastikan sudah cek di STEP 1

DELETE FROM students WHERE lembaga = 'SMA';

-- ========================================
-- STEP 3: VERIFIKASI SETELAH HAPUS
-- ========================================
-- Cek apakah data SMA sudah terhapus
SELECT COUNT(*) as sisa_data_sma FROM students WHERE lembaga = 'SMA';
-- Harusnya return 0

-- Cek data lembaga lain masih ada
SELECT 
  lembaga,
  COUNT(*) as total
FROM students 
GROUP BY lembaga;
