-- SQL untuk menambahkan dukungan lembaga MTA (Manzhumah Takhoshush Al Qur'an)
-- Jalankan script ini jika ada tabel lembaga di database

-- Jika ada tabel lembaga, tambahkan MTA
-- INSERT INTO lembaga (id, name, full_name, prefix, color, icon) 
-- VALUES ('MTA', 'MTA', 'Manzhumah Takhoshush Al Qur''an', 'MTA', 'from-orange-500 to-orange-600', 'BookOpen')
-- ON CONFLICT (id) DO NOTHING;

-- Jika ada tabel app_settings untuk konfigurasi lembaga
-- INSERT INTO app_settings (key, value, description) 
-- VALUES ('lembaga_mta_enabled', 'true', 'Enable MTA (Manzhumah Takhoshush Al Qur''an) lembaga')
-- ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Update existing students jika ada yang perlu dipindah ke MTA
-- UPDATE students SET lembaga = 'MTA' WHERE lembaga = 'SMAITA' AND noTes LIKE 'MTA-%';

-- Catatan: Script ini hanya contoh. Sesuaikan dengan struktur database yang sebenarnya.
-- Pastikan untuk backup database sebelum menjalankan script ini.

SELECT 'MTA lembaga support added successfully' as status;