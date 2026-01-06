# 🚀 Setup Storage Bucket - Langkah Demi Langkah

## 📍 Anda Sekarang Di Sini:
File: `setup-storage-bucket.sql` terbuka

## ✅ Langkah Setup (Pilih Salah Satu)

---

## 🎯 OPSI 1: Manual via Dashboard (TERMUDAH - 2 Menit)

### Step 1: Buka Supabase Dashboard
```
URL: https://supabase.com/dashboard/project/eknvmtigbjzjwclfcwlh/storage/buckets
```

### Step 2: Klik "New bucket"
Tombol hijau di kanan atas

### Step 3: Isi Form
```
Name: backups
Public bucket: ❌ OFF (jangan dicentang)
File size limit: 50 MB
Allowed MIME types: application/json
```

### Step 4: Klik "Create bucket"

### Step 5: Verifikasi
- Refresh aplikasi (F5)
- Error "Bucket not found" hilang
- ✅ Done!

---

## 🎯 OPSI 2: Via SQL Editor (3 Menit)

### Step 1: Buka SQL Editor
```
URL: https://supabase.com/dashboard/project/eknvmtigbjzjwclfcwlh/sql/new
```

### Step 2: Copy SQL Ini
```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('backups', 'backups', false, 52428800, ARRAY['application/json'])
ON CONFLICT (id) DO NOTHING;

-- Create policies
CREATE POLICY IF NOT EXISTS "Allow authenticated users to upload backups"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'backups');

CREATE POLICY IF NOT EXISTS "Allow authenticated users to read backups"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'backups');

CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete backups"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'backups');

-- Verify
SELECT * FROM storage.buckets WHERE name = 'backups';
```

### Step 3: Paste & Run
- Paste SQL di editor
- Klik "Run" atau Ctrl+Enter
- Lihat hasil di bawah

### Step 4: Expected Result
```
id      | name    | public | file_size_limit
--------|---------|--------|----------------
backups | backups | false  | 52428800
```

### Step 5: Verifikasi
- Refresh aplikasi (F5)
- Error hilang
- ✅ Done!

---

## 🔍 Verifikasi Setup Berhasil

### Cek di Console Browser (F12)
**Sebelum:**
```
❌ StorageApiError: Bucket not found
❌ Failed to load resource: 400
```

**Sesudah:**
```
✅ Bucket backup berhasil dibuat
✅ Auto backup berhasil
```

### Cek di Supabase Dashboard
```
Storage > Buckets > backups ✅
```

---

## 🎉 Setelah Setup Selesai

### Fitur yang Aktif:
1. ✅ Auto backup setiap 24 jam
2. ✅ Manual backup ke storage
3. ✅ Download backup lokal
4. ✅ Restore dari backup
5. ✅ List semua backup

### Test Fitur Backup:
1. Login sebagai ADMIN
2. Klik menu "Backup & Restore"
3. Klik "Buat Backup Manual"
4. Lihat backup muncul di list
5. ✅ Success!

---

## 🆘 Troubleshooting

### Error: "Permission denied"
**Solusi:** Pastikan Anda login sebagai owner project

### Error: "Bucket already exists"
**Solusi:** Bucket sudah ada, skip step ini. Cek di Storage > Buckets

### Error masih muncul setelah setup
**Solusi:** 
1. Hard refresh: Ctrl+Shift+R
2. Clear cache browser
3. Restart dev server

---

## 📊 Status Saat Ini

| Item | Status | Action |
|------|--------|--------|
| Database Tables | ✅ Ready | None |
| Import Excel Feature | ✅ Working | None |
| Storage Bucket | ❌ Pending | **Setup Now** |
| Backup Feature | ⚠️ Partial | Will work after bucket setup |

---

## 🚀 Quick Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/eknvmtigbjzjwclfcwlh
- **Storage Buckets:** https://supabase.com/dashboard/project/eknvmtigbjzjwclfcwlh/storage/buckets
- **SQL Editor:** https://supabase.com/dashboard/project/eknvmtigbjzjwclfcwlh/sql/new
- **Dev Server:** http://localhost:3002/

---

## ✨ Next Steps After Setup

1. ✅ Setup storage bucket (you are here)
2. Test import Excel feature
3. Test backup feature
4. Deploy to production
5. Train users

---

**Rekomendasi:** Gunakan **OPSI 1 (Manual via Dashboard)** - paling mudah dan cepat! 🎯
