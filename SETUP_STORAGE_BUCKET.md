# 🗄️ Setup Storage Bucket untuk Backup

## ⚠️ Error yang Muncul

```
Failed to load resource: the server responded with a status of 400
StorageApiError: Bucket not found
```

Error ini terjadi karena **bucket storage "backups" belum dibuat** di Supabase.

## ✅ Solusi: Buat Bucket Storage Manual

### Langkah 1: Buka Supabase Dashboard

1. Buka browser dan akses: https://supabase.com/dashboard
2. Login dengan akun Anda
3. Pilih project: **eknvmtigbjzjwclfcwlh** (SPMB At Tauhid)

### Langkah 2: Buat Bucket Baru

1. Di sidebar kiri, klik **"Storage"**
2. Klik tombol **"New bucket"** (hijau, di kanan atas)
3. Isi form dengan data berikut:

```
Name: backups
Public: ❌ OFF (jangan dicentang)
File size limit: 50 MB
Allowed MIME types: application/json
```

4. Klik **"Create bucket"**

### Langkah 3: Set Storage Policies (Opsional)

Untuk keamanan, set policies agar hanya user authenticated yang bisa akses:

1. Klik bucket **"backups"** yang baru dibuat
2. Klik tab **"Policies"**
3. Klik **"New Policy"**
4. Pilih template **"Allow authenticated users"**
5. Atau jalankan SQL di SQL Editor:

```sql
-- Allow authenticated users to upload backups
CREATE POLICY "Allow authenticated users to upload backups"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'backups');

-- Allow authenticated users to read backups
CREATE POLICY "Allow authenticated users to read backups"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'backups');

-- Allow authenticated users to delete backups
CREATE POLICY "Allow authenticated users to delete backups"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'backups');
```

### Langkah 4: Verifikasi

1. Refresh halaman aplikasi (F5)
2. Error seharusnya sudah hilang
3. Cek console browser (F12), seharusnya muncul:
   ```
   ✅ Bucket backup berhasil dibuat
   ```

## 🔧 Alternatif: Disable Auto Backup

Jika tidak ingin menggunakan Supabase Storage, Anda bisa disable auto backup:

### Edit `src/utils/backupService.ts`

Ubah `BACKUP_INTERVAL_HOURS` menjadi sangat besar:

```typescript
private readonly BACKUP_INTERVAL_HOURS = 999999; // Disable auto backup
```

Atau comment out inisialisasi di `src/App.tsx`:

```typescript
// useEffect(() => {
//   backupService.initialize();
// }, []);
```

## 📊 Cara Kerja Backup

### Auto Backup
- Berjalan otomatis setiap 24 jam
- Menyimpan ke Supabase Storage bucket "backups"
- Tidak mengganggu user (background process)

### Manual Backup
- User klik tombol "Backup" di dashboard
- Bisa pilih:
  - **Upload ke Storage**: Simpan di Supabase
  - **Download Lokal**: Download file JSON langsung

### Fallback Mechanism
Jika bucket tidak tersedia:
- ✅ Manual backup tetap bisa (download lokal)
- ❌ Auto backup akan di-skip (tidak error)

## 🎯 Rekomendasi

### Untuk Production
✅ **Buat bucket storage** - Backup otomatis sangat penting!

### Untuk Development
⚪ **Opsional** - Bisa pakai download lokal saja

## 📸 Screenshot Panduan

### 1. Storage Menu
```
┌─────────────────────────────┐
│ Supabase Dashboard          │
├─────────────────────────────┤
│ 🏠 Home                     │
│ 📊 Table Editor             │
│ 🔐 Authentication           │
│ 🗄️ Storage        ← KLIK   │
│ 📝 SQL Editor               │
│ 🔧 Settings                 │
└─────────────────────────────┘
```

### 2. New Bucket Button
```
┌─────────────────────────────────────┐
│ Storage                             │
│                                     │
│ [🆕 New bucket]  ← KLIK            │
│                                     │
│ Buckets:                            │
│ (empty)                             │
└─────────────────────────────────────┘
```

### 3. Create Bucket Form
```
┌─────────────────────────────────────┐
│ Create a new bucket                 │
├─────────────────────────────────────┤
│ Name *                              │
│ [backups                        ]   │
│                                     │
│ ☐ Public bucket                     │
│                                     │
│ File size limit                     │
│ [50                ] MB             │
│                                     │
│ Allowed MIME types                  │
│ [application/json              ]    │
│                                     │
│ [Cancel]  [Create bucket]           │
└─────────────────────────────────────┘
```

### 4. Bucket Created
```
┌─────────────────────────────────────┐
│ Storage                             │
│                                     │
│ [🆕 New bucket]                     │
│                                     │
│ Buckets:                            │
│ ✅ backups (0 files, 0 B)          │
└─────────────────────────────────────┘
```

## 🆘 Troubleshooting

### Error: "Bucket not found"
**Solusi:** Buat bucket "backups" di Supabase Dashboard

### Error: "Permission denied"
**Solusi:** Set storage policies (lihat Langkah 3)

### Error: "File size limit exceeded"
**Solusi:** Tingkatkan file size limit di bucket settings

### Backup tidak jalan otomatis
**Solusi:** 
1. Cek console browser untuk error
2. Pastikan bucket sudah dibuat
3. Clear localStorage dan refresh

## 📞 Support

Jika masih ada masalah:
1. Cek console browser (F12) untuk error detail
2. Cek Supabase Dashboard > Storage > backups
3. Verifikasi policies sudah di-set
4. Hubungi administrator

---

**Dibuat:** 6 Januari 2026  
**Status:** Ready to Setup  
**Priority:** Medium (tidak urgent, tapi penting untuk production)
