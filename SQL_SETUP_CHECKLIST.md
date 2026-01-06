# ✅ SQL Setup Checklist - SPMB At Tauhid

## Status SQL Files

### 🔴 BELUM DIJALANKAN (Perlu Action)

#### 1. **setup-backup-storage.sql** ⚠️ PENTING
**Status:** ❌ Belum dijalankan  
**Fungsi:** Membuat bucket storage untuk fitur backup  
**Prioritas:** Medium (tidak urgent, tapi penting untuk production)

**Cara Jalankan:**
```
1. Buka: https://supabase.com/dashboard
2. Pilih project: eknvmtigbjzjwclfcwlh
3. Klik: SQL Editor
4. Copy-paste isi file setup-backup-storage.sql
5. Klik: Run
```

**Atau Manual (Lebih Mudah):**
```
1. Buka: Storage di Supabase Dashboard
2. Klik: New bucket
3. Name: backups
4. Public: OFF
5. File size limit: 50 MB
6. Create
```

---

### ✅ SUDAH DIJALANKAN (Kemungkinan Besar)

#### 2. **supabase-schema.sql** ✅
**Status:** ✅ Kemungkinan sudah dijalankan  
**Fungsi:** Membuat table utama (users, students, rubric_guides, app_settings)  
**Bukti:** Aplikasi bisa login dan menyimpan data

**Cara Verifikasi:**
```sql
-- Jalankan di SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'students', 'rubric_guides', 'app_settings');
```

**Expected Result:**
```
users
students
rubric_guides
app_settings
```

Jika ke-4 table muncul = ✅ Sudah dijalankan

---

### 📝 FILE SQL LAINNYA (Opsional/Maintenance)

#### 3. **add-catatan-penguji.sql**
**Status:** ⚪ Opsional  
**Fungsi:** Menambah kolom catatan_penguji (jika belum ada)

#### 4. **check-user-data.sql**
**Status:** ⚪ Query untuk cek data  
**Fungsi:** Verifikasi data user

#### 5. **sync_tahun_ajaran.sql**
**Status:** ⚪ Maintenance  
**Fungsi:** Sync tahun ajaran

#### 6. **update_tahun_ajaran.sql**
**Status:** ⚪ Maintenance  
**Fungsi:** Update tahun ajaran

#### 7. **update-kelulusan-cadangan.sql**
**Status:** ⚪ Maintenance  
**Fungsi:** Update status kelulusan

---

## 🎯 Action Required

### Untuk Menghilangkan Error Backup:

**Pilih salah satu:**

### Opsi A: Jalankan SQL (Recommended)
```sql
-- Copy-paste ke Supabase SQL Editor dan Run

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'backups',
  'backups',
  false,
  52428800,
  ARRAY['application/json']
)
ON CONFLICT (id) DO NOTHING;

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
```

### Opsi B: Manual via Dashboard (Lebih Mudah)
1. Buka Supabase Dashboard
2. Storage → New bucket
3. Name: `backups`, Public: OFF
4. Create

### Opsi C: Abaikan (Temporary)
- Error tidak berbahaya
- Aplikasi tetap jalan
- Backup manual masih bisa (download lokal)

---

## 🔍 Cara Cek Status Database

### Cek Table yang Ada:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Cek Jumlah Data:
```sql
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM students) as total_students,
  (SELECT COUNT(*) FROM rubric_guides) as total_rubrics,
  (SELECT COUNT(*) FROM app_settings) as total_settings;
```

### Cek Storage Buckets:
```sql
SELECT id, name, public, file_size_limit 
FROM storage.buckets;
```

### Cek Storage Policies:
```sql
SELECT policyname, tablename 
FROM pg_policies 
WHERE tablename = 'objects';
```

---

## 📊 Summary

| SQL File | Status | Action | Priority |
|----------|--------|--------|----------|
| supabase-schema.sql | ✅ Done | None | - |
| setup-backup-storage.sql | ❌ Pending | Run SQL atau Manual | Medium |
| setup-storage-bucket.sql | ❌ Pending | Same as above | Medium |
| Other SQL files | ⚪ Optional | As needed | Low |

---

## 🚀 Quick Action (2 Menit)

**Untuk fix error backup sekarang:**

1. Buka: https://supabase.com/dashboard/project/eknvmtigbjzjwclfcwlh/storage/buckets
2. Klik: **New bucket**
3. Isi:
   - Name: `backups`
   - Public: **OFF** (unchecked)
   - File size limit: `50` MB
4. Klik: **Create bucket**
5. Refresh aplikasi (F5)
6. ✅ Done! Error hilang

---

## 📞 Support

Jika ada pertanyaan:
1. Cek console browser (F12) untuk error
2. Verifikasi di Supabase Dashboard
3. Lihat dokumentasi: SETUP_STORAGE_BUCKET.md

---

**Last Updated:** 6 Januari 2026  
**Project:** SPMB At Tauhid  
**Database:** eknvmtigbjzjwclfcwlh.supabase.co
