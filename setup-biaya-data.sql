-- Setup Data Biaya SPMB At Tauhid
-- Berdasarkan struktur dari gambar Biaya spmb.jpeg

-- Hapus data biaya yang ada (jika ada)
DELETE FROM costs;

-- Insert data biaya lengkap sesuai gambar
INSERT INTO costs (id, rowNumber, sequence, category, name, amount, lembaga, description, "createdAt", "updatedAt", "createdBy") VALUES
-- PENDAFTARAN CALON SISWA BARU
('cost-001', '1', 1, 'Pendaftaran Calon Siswa Baru', 'Pendaftaran Calon Siswa/i TK', 100000, 'TK', 'Biaya pendaftaran untuk calon siswa Taman Kanak-Kanak', NOW(), NOW(), 'admin'),
('cost-002', '2', 2, 'Pendaftaran Calon Siswa Baru', 'Pendaftaran Calon Siswa/i SD, SMP, SMA & MTA', 300000, 'SD/SMP/SMA/MTA', 'Biaya pendaftaran untuk calon siswa SD, SMP, SMA, dan MTA', NOW(), NOW(), 'admin'),

-- SPP
('cost-003', '3', 3, 'SPP', 'SPP siswa/i TK', 350000, 'TK', 'SPP bulanan siswa Taman Kanak-Kanak', NOW(), NOW(), 'admin'),
('cost-004', '4', 4, 'SPP', 'SPP siswa/i SD dan siswa/i SMP, SMA & MTA Non Asrama per semester', 2700000, 'SD/SMP/SMA/MTA', 'SPP semesteran untuk siswa non asrama SD, SMP, SMA, dan MTA', NOW(), NOW(), 'admin'),
('cost-004a', '4a', 4.1, 'SPP', 'Angsuran SPP siswa/i non asrama perbulan', 450000, 'SD/SMP/SMA/MTA', 'Angsuran bulanan SPP untuk siswa non asrama', NOW(), NOW(), 'admin'),
('cost-005', '5', 5, 'SPP', 'SPP Siswa Asrama SMP, SMA & MTA per semester', 7800000, 'SMP/SMA/MTA', 'SPP semesteran untuk siswa asrama SMP, SMA, dan MTA', NOW(), NOW(), 'admin'),
('cost-005a', '5a', 5.1, 'SPP', 'Angsuran SPP siswa/i asrama perbulan', 1300000, 'SMP/SMA/MTA', 'Angsuran bulanan SPP untuk siswa asrama', NOW(), NOW(), 'admin'),

-- UANG PANGKAL SISWA NON ASRAMA
('cost-006', '6', 6, 'Uang Pangkal Siswa Non Asrama', 'Uang Pangkal Siswa/i TK', 4200000, 'TK', 'Uang pangkal untuk siswa Taman Kanak-Kanak non asrama', NOW(), NOW(), 'admin'),
('cost-006a', '6a', 6.1, 'Uang Pangkal Siswa Non Asrama', 'Daftar ulang bagi siswa TK jenjang TK-A ke jenjang TK-B', 1900000, 'TK', 'Biaya daftar ulang untuk siswa TK dari TK-A ke TK-B', NOW(), NOW(), 'admin'),
('cost-007', '7', 7, 'Uang Pangkal Siswa Non Asrama', 'Uang Pangkal Siswa/i SD', 9100000, 'SD', 'Uang pangkal untuk siswa SD non asrama', NOW(), NOW(), 'admin'),
('cost-008', '8', 8, 'Uang Pangkal Siswa Non Asrama', 'Uang Pangkal Siswa/i Non Asrama SMP', 9800000, 'SMP', 'Uang pangkal untuk siswa SMP non asrama', NOW(), NOW(), 'admin'),
('cost-009', '9', 9, 'Uang Pangkal Siswa Non Asrama', 'Uang Pangkal Siswa/i Non Asrama SMA', 9800000, 'SMA', 'Uang pangkal untuk siswa SMA non asrama', NOW(), NOW(), 'admin'),
('cost-010', '10', 10, 'Uang Pangkal Siswa Non Asrama', 'Uang Pangkal Siswa/i Non Asrama MTA', 9700000, 'MTA', 'Uang pangkal untuk siswa MTA non asrama', NOW(), NOW(), 'admin'),

-- UANG PANGKAL SISWA ASRAMA
('cost-011', '11', 11, 'Uang Pangkal Siswa Asrama', 'Uang Pangkal Siswa Asrama SMP', 12800000, 'SMP', 'Uang pangkal untuk siswa SMP asrama', NOW(), NOW(), 'admin'),
('cost-012', '12', 12, 'Uang Pangkal Siswa Asrama', 'Uang Pangkal Siswa Asrama SMA', 12800000, 'SMA', 'Uang pangkal untuk siswa SMA asrama', NOW(), NOW(), 'admin'),
('cost-013', '13', 13, 'Uang Pangkal Siswa Asrama', 'Uang Pangkal Siswa Asrama MTA', 12800000, 'MTA', 'Uang pangkal untuk siswa MTA asrama', NOW(), NOW(), 'admin'),

-- UANG PANGKAL ALUMNI SMP AT-TAUHID KE SMA AT-TAUHID
('cost-014', '14', 14, 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid', 'Uang Pangkal Alumni Siswa SMP Non Asrama ke SMA Asrama', 8200000, 'SMP/SMA', 'Uang pangkal alumni SMP non asrama ke SMA asrama', NOW(), NOW(), 'admin'),
('cost-015', '15', 15, 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid', 'Uang Pangkal Alumni Siswa SMP Asrama ke SMA Asrama', 5200000, 'SMP/SMA', 'Uang pangkal alumni SMP asrama ke SMA asrama', NOW(), NOW(), 'admin'),
('cost-016', '16', 16, 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid', 'Uang Pangkal Alumni Siswa Non Asrama/Asrama ke SMA Non Asrama', 5200000, 'SMP/SMA', 'Uang pangkal alumni SMP ke SMA non asrama', NOW(), NOW(), 'admin'),

-- UANG PANGKAL ALUMNI MTA TINGKAT SMP KE MTA TINGKAT SMA
('cost-017', '17', 17, 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA', 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Non Asrama ke MTA Asrama', 6950000, 'MTA', 'Uang pangkal alumni MTA SMP non asrama ke MTA SMA asrama', NOW(), NOW(), 'admin'),
('cost-018', '18', 18, 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA', 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Asrama ke MTA Asrama', 3950000, 'MTA', 'Uang pangkal alumni MTA SMP asrama ke MTA SMA asrama', NOW(), NOW(), 'admin'),
('cost-019', '19', 19, 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA', 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Asrama/Non Asrama ke MTA Jenjang SMA Asrama', 3950000, 'MTA', 'Uang pangkal alumni MTA SMP ke MTA SMA asrama', NOW(), NOW(), 'admin');

-- Verifikasi data yang diinsert
SELECT 
  category,
  COUNT(*) as jumlah_item,
  SUM(amount) as_total_kategori
FROM costs 
GROUP BY category 
ORDER BY category;

-- Total semua biaya
SELECT 
  COUNT(*) as total_item,
  SUM(amount) as grand_total
FROM costs;
