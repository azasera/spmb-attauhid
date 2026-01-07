-- HAPUS DATA YANG SALAH UPLOAD
-- Pilih salah satu query di bawah sesuai kebutuhan

-- ========================================
-- OPSI 1: CEK DATA TERAKHIR YANG MASUK
-- ========================================
-- Jalankan ini dulu untuk lihat data terakhir
SELECT 
  id,
  noTes,
  lembaga,
  data->>'namaSiswa' as nama,
  data->>'asrama' as asrama,
  createdAt
FROM students 
ORDER BY createdAt DESC 
LIMIT 50;

-- ========================================
-- OPSI 2: HAPUS BERDASARKAN LEMBAGA
-- ========================================
-- Ganti 'SMA' dengan lembaga yang salah
-- CEK DULU berapa data:
SELECT COUNT(*) FROM students WHERE lembaga = 'SMA';

-- Kalau yakin, HAPUS:
DELETE FROM students WHERE lembaga = 'SMA';

-- ========================================
-- OPSI 3: HAPUS DATA TERBARU (X DATA TERAKHIR)
-- ========================================
-- Hapus 50 data terakhir yang masuk
-- CEK DULU data yang akan dihapus:
SELECT 
  noTes,
  data->>'namaSiswa' as nama,
  lembaga,
  createdAt
FROM students 
ORDER BY createdAt DESC 
LIMIT 50;

-- Kalau yakin, HAPUS:
DELETE FROM students 
WHERE id IN (
  SELECT id FROM students 
  ORDER BY createdAt DESC 
  LIMIT 50  -- ganti angka sesuai jumlah data yang salah
);

-- ========================================
-- OPSI 4: HAPUS BERDASARKAN NAMA SISWA
-- ========================================
-- Jika tahu nama-nama siswa yang salah
DELETE FROM students 
WHERE data->>'namaSiswa' IN (
  'NAMA SISWA 1',
  'NAMA SISWA 2',
  'NAMA SISWA 3'
  -- tambahkan nama lainnya
);

-- ========================================
-- OPSI 5: HAPUS SEMUA DATA DENGAN ASRAMA TERTENTU
-- ========================================
-- Hapus semua yang asramanya salah format
-- CEK DULU:
SELECT 
  COUNT(*),
  data->>'asrama' as asrama
FROM students 
GROUP BY data->>'asrama';

-- Hapus yang asramanya bukan ASRAMA atau NON ASRAMA:
DELETE FROM students 
WHERE data->>'asrama' NOT IN ('ASRAMA', 'NON ASRAMA');

-- ========================================
-- OPSI 6: HAPUS BERDASARKAN NOMOR TES
-- ========================================
-- Jika tahu pattern nomor tes yang salah
-- CEK DULU:
SELECT noTes, data->>'namaSiswa' as nama 
FROM students 
WHERE noTes LIKE 'SMA-2627-%'
ORDER BY noTes;

-- HAPUS:
DELETE FROM students 
WHERE noTes LIKE 'SMA-2627-%';

-- ========================================
-- VERIFIKASI SETELAH HAPUS
-- ========================================
-- Cek total data per lembaga
SELECT 
  lembaga,
  COUNT(*) as total
FROM students 
GROUP BY lembaga;

-- Cek data asrama
SELECT 
  data->>'asrama' as asrama,
  COUNT(*) as total
FROM students 
GROUP BY data->>'asrama';
