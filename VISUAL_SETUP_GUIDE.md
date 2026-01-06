# 🎨 Visual Setup Guide - Storage Bucket

## 🎯 Tujuan
Menghilangkan error: `StorageApiError: Bucket not found`

## ⏱️ Waktu: 2 Menit

---

## 📱 CARA TERMUDAH: Manual via Dashboard

### 1️⃣ Buka Link Ini
```
https://supabase.com/dashboard/project/eknvmtigbjzjwclfcwlh/storage/buckets
```

### 2️⃣ Tampilan Awal
```
┌─────────────────────────────────────────────────┐
│ Storage                                         │
│                                                 │
│ [🆕 New bucket]  ← KLIK INI                    │
│                                                 │
│ No buckets yet                                  │
│ Create your first bucket to start storing      │
│ files                                           │
└─────────────────────────────────────────────────┘
```

### 3️⃣ Form Create Bucket
```
┌─────────────────────────────────────────────────┐
│ Create a new bucket                             │
├─────────────────────────────────────────────────┤
│                                                 │
│ Name *                                          │
│ ┌─────────────────────────────────────────┐   │
│ │ backups                                 │   │ ← KETIK: backups
│ └─────────────────────────────────────────┘   │
│                                                 │
│ ☐ Public bucket                                │ ← JANGAN DICENTANG!
│                                                 │
│ File size limit                                 │
│ ┌──────┐                                       │
│ │ 50   │ MB                                    │ ← KETIK: 50
│ └──────┘                                       │
│                                                 │
│ Allowed MIME types (optional)                   │
│ ┌─────────────────────────────────────────┐   │
│ │ application/json                        │   │ ← KETIK: application/json
│ └─────────────────────────────────────────┘   │
│                                                 │
│ [Cancel]  [Create bucket]                      │ ← KLIK: Create bucket
└─────────────────────────────────────────────────┘
```

### 4️⃣ Hasil Sukses
```
┌─────────────────────────────────────────────────┐
│ Storage                                         │
│                                                 │
│ [🆕 New bucket]                                 │
│                                                 │
│ Buckets                                         │
│ ┌─────────────────────────────────────────┐   │
│ │ 📦 backups                              │   │ ← BUCKET BERHASIL DIBUAT!
│ │    0 objects • 0 B                      │   │
│ │    Private • 50 MB limit                │   │
│ └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### 5️⃣ Verifikasi di Aplikasi
```
1. Buka aplikasi: http://localhost:3002/
2. Tekan F12 (buka Console)
3. Refresh halaman (F5)
4. Lihat console:
   
   Sebelum:
   ❌ StorageApiError: Bucket not found
   
   Sesudah:
   ✅ Bucket backup berhasil dibuat
   ✅ Auto backup berhasil
```

---

## 💻 CARA ALTERNATIF: Via SQL Editor

### 1️⃣ Buka SQL Editor
```
https://supabase.com/dashboard/project/eknvmtigbjzjwclfcwlh/sql/new
```

### 2️⃣ Tampilan SQL Editor
```
┌─────────────────────────────────────────────────┐
│ SQL Editor                                      │
├─────────────────────────────────────────────────┤
│ [New query]  [Templates ▼]  [Run ▶]           │
├─────────────────────────────────────────────────┤
│                                                 │
│ 1  -- Write your SQL here                      │
│ 2                                               │
│ 3                                               │
│ 4                                               │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 3️⃣ Copy-Paste SQL
Buka file: `run-this-sql.sql` dan copy semua isinya, lalu paste ke SQL Editor

### 4️⃣ Run SQL
```
┌─────────────────────────────────────────────────┐
│ SQL Editor                                      │
├─────────────────────────────────────────────────┤
│ [New query]  [Templates ▼]  [Run ▶] ← KLIK    │
├─────────────────────────────────────────────────┤
│                                                 │
│ 1  INSERT INTO storage.buckets ...             │
│ 2  VALUES ('backups', 'backups', ...           │
│ 3  ...                                          │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 5️⃣ Hasil Sukses
```
┌─────────────────────────────────────────────────┐
│ Results                                         │
├─────────────────────────────────────────────────┤
│ ✅ Success. No rows returned                    │
│                                                 │
│ Query 1: INSERT INTO storage.buckets           │
│ Query 2: CREATE POLICY ...                     │
│ Query 3: CREATE POLICY ...                     │
│ Query 4: CREATE POLICY ...                     │
│ Query 5: CREATE POLICY ...                     │
│ Query 6: SELECT * FROM storage.buckets         │
│                                                 │
│ status          | id      | name    | access   │
│ ✅ Bucket Created | backups | backups | ✅ Private│
└─────────────────────────────────────────────────┘
```

---

## 🎯 Checklist Setup

```
☐ 1. Buka Supabase Dashboard
☐ 2. Masuk ke Storage atau SQL Editor
☐ 3. Buat bucket "backups" (manual atau SQL)
☐ 4. Verifikasi bucket muncul di Storage
☐ 5. Refresh aplikasi (F5)
☐ 6. Cek console - error hilang
☐ 7. Test backup feature (optional)
```

---

## 🎬 Video Tutorial (Text Version)

```
[00:00] Buka browser
[00:05] Akses Supabase Dashboard
[00:10] Login dengan akun Anda
[00:15] Klik "Storage" di sidebar
[00:20] Klik "New bucket"
[00:25] Ketik "backups" di Name
[00:30] Pastikan Public: OFF
[00:35] Set File size limit: 50 MB
[00:40] Ketik "application/json" di MIME types
[00:45] Klik "Create bucket"
[00:50] Bucket berhasil dibuat! ✅
[00:55] Refresh aplikasi
[01:00] Error hilang! 🎉
[01:05] Done!
```

---

## 📸 Screenshot Checklist

### ✅ Bucket Berhasil Dibuat
```
Ciri-ciri:
- Ada folder "backups" di Storage
- Status: Private
- Size limit: 50 MB
- MIME types: application/json
```

### ✅ Error Hilang
```
Console browser (F12):
- Tidak ada error "Bucket not found"
- Tidak ada error 400
- Muncul log: "✅ Bucket backup berhasil dibuat"
```

### ✅ Backup Feature Working
```
Admin Dashboard:
- Menu "Backup & Restore" bisa diakses
- Tombol "Buat Backup Manual" berfungsi
- List backup muncul
```

---

## 🆘 Troubleshooting Visual

### ❌ Error: "Permission denied"
```
Penyebab: Bukan owner project
Solusi: Login dengan akun owner
```

### ❌ Error: "Bucket already exists"
```
Penyebab: Bucket sudah dibuat sebelumnya
Solusi: Skip setup, bucket sudah ada ✅
```

### ❌ Error masih muncul
```
Penyebab: Cache browser
Solusi: 
1. Hard refresh: Ctrl+Shift+R
2. Clear cache
3. Restart browser
```

---

## 🎉 Success Indicators

### Console Browser
```
✅ Bucket backup berhasil dibuat
✅ Auto backup berhasil: backup_auto_2026-01-06...
```

### Supabase Dashboard
```
Storage > Buckets > backups ✅
```

### Aplikasi
```
No error in console ✅
Backup feature working ✅
```

---

## 📞 Need Help?

Jika masih ada masalah:
1. Screenshot error
2. Cek console browser (F12)
3. Verifikasi di Supabase Dashboard
4. Hubungi administrator

---

**Estimated Time:** 2 minutes  
**Difficulty:** ⭐ Easy  
**Priority:** Medium (not urgent, but important)

**Good luck! 🚀**
