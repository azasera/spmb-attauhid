# 🔄 Fitur Auto Backup Data - SPMB At Tauhid

## 📋 Deskripsi

Fitur auto backup data memungkinkan sistem untuk secara otomatis membuat backup data secara berkala dan memberikan kemampuan untuk restore data jika diperlukan.

## ✨ Fitur Utama

### 1. **Auto Backup (Otomatis)**
- Sistem otomatis membuat backup setiap **24 jam**
- Backup pertama dibuat saat user login pertama kali
- Tidak mengganggu performa aplikasi
- Backup disimpan di Supabase Storage

### 2. **Manual Backup**
- Admin dapat membuat backup kapan saja
- Backup langsung tersimpan di cloud storage
- Dapat didownload ke komputer lokal

### 3. **Export ke JSON**
- Export semua data ke file JSON
- Download langsung tanpa melalui storage
- Format standar untuk portabilitas data

### 4. **Import dari JSON**
- Upload file backup JSON
- Restore data dari file lokal
- Validasi format file otomatis

### 5. **Restore dari Backup**
- Pilih backup yang ingin di-restore
- Sistem otomatis backup data saat ini sebelum restore
- Konfirmasi keamanan sebelum restore

### 6. **Manajemen Backup**
- List semua backup yang tersedia
- Lihat detail: tanggal, ukuran, tipe (auto/manual)
- Download backup ke lokal
- Hapus backup yang tidak diperlukan

## 🎯 Cara Menggunakan

### Akses Fitur Backup

1. Login sebagai **ADMIN**
2. Klik menu **"Manajemen User"**
3. Klik tombol **"Backup Data"** di header

### Membuat Backup Manual

1. Klik tombol **"Buat Backup Manual"**
2. Tunggu proses selesai
3. Backup akan muncul di daftar riwayat backup

### Export Data ke JSON

1. Klik tombol **"Export ke JSON"**
2. File akan otomatis terdownload
3. Simpan file di lokasi yang aman

### Import Data dari JSON

1. Klik tombol **"Choose File"** di bagian Import
2. Pilih file backup JSON (.json)
3. Klik **"Import Data"**
4. Konfirmasi proses import
5. Data akan di-restore dan aplikasi reload otomatis

### Restore dari Backup Cloud

1. Pilih backup dari daftar riwayat
2. Klik icon **Restore** (🔄)
3. Konfirmasi restore
4. Tunggu proses selesai
5. Aplikasi akan reload otomatis

### Download Backup

1. Pilih backup dari daftar
2. Klik icon **Download** (⬇️)
3. File akan terdownload ke komputer

### Hapus Backup

1. Pilih backup yang ingin dihapus
2. Klik icon **Hapus** (🗑️)
3. Konfirmasi penghapusan

## 📊 Data yang Di-backup

Backup mencakup semua tabel penting:

- ✅ **Students** - Data calon santri dan penilaian
- ✅ **Rubric Guides** - Panduan penilaian
- ✅ **App Settings** - Pengaturan aplikasi
- ❌ **Users** - Tidak di-backup untuk keamanan

## 🔒 Keamanan

### Backup Otomatis Sebelum Restore
Setiap kali melakukan restore atau import, sistem otomatis membuat backup data saat ini dengan nama:
```
backup_manual_system_before_restore_[timestamp].json
backup_manual_system_before_import_[timestamp].json
```

### Data User
Data user **TIDAK** di-restore untuk alasan keamanan. Ini mencegah:
- Overwrite akun admin
- Kehilangan akses sistem
- Konflik kredensial

## 📁 Format Backup

File backup menggunakan format JSON dengan struktur:

```json
{
  "timestamp": "2026-01-05T10:30:00.000Z",
  "version": "1.0.0",
  "tables": {
    "students": [...],
    "users": [...],
    "rubric_guides": [...],
    "app_settings": [...]
  },
  "metadata": {
    "totalStudents": 150,
    "totalUsers": 5,
    "backupType": "manual",
    "createdBy": "Admin Name"
  }
}
```

## 🗂️ Lokasi Penyimpanan

### Cloud Storage (Supabase)
- Bucket: `backups`
- Path: `/backup_[type]_[timestamp].json`
- Akses: Private (hanya authenticated users)
- Limit: 50MB per file

### Local Storage
- Browser localStorage untuk tracking auto backup
- Key: `last_auto_backup`
- Value: timestamp terakhir backup

## ⚙️ Konfigurasi

### Interval Auto Backup
Default: 24 jam

Untuk mengubah interval, edit file `src/utils/backupService.ts`:

```typescript
private readonly BACKUP_INTERVAL_HOURS = 24; // Ubah sesuai kebutuhan
```

### Ukuran Maksimal File
Default: 50MB

Untuk mengubah limit, edit saat create bucket di `backupService.ts`:

```typescript
fileSizeLimit: 52428800, // 50MB dalam bytes
```

## 🚨 Troubleshooting

### Backup Gagal Dibuat
**Penyebab:**
- Koneksi internet terputus
- Storage bucket belum dibuat
- Quota storage penuh

**Solusi:**
1. Cek koneksi internet
2. Pastikan Supabase Storage aktif
3. Hapus backup lama yang tidak diperlukan

### Restore Gagal
**Penyebab:**
- File backup corrupt
- Format JSON tidak valid
- Koneksi database terputus

**Solusi:**
1. Coba backup lain
2. Validasi format JSON
3. Cek koneksi Supabase

### Auto Backup Tidak Jalan
**Penyebab:**
- Browser localStorage disabled
- User tidak login dalam 24 jam
- Service worker error

**Solusi:**
1. Enable localStorage di browser
2. Buat backup manual
3. Reload aplikasi

## 📝 Best Practices

### Backup Rutin
- ✅ Buat backup manual sebelum update besar
- ✅ Download backup penting ke lokal
- ✅ Simpan backup di multiple lokasi
- ✅ Test restore secara berkala

### Manajemen Storage
- 🗑️ Hapus backup lama yang tidak diperlukan
- 📦 Compress backup besar
- 💾 Simpan backup penting offline
- 🔄 Rotate backup secara berkala

### Keamanan
- 🔒 Jangan share file backup publik
- 🔐 Encrypt backup sensitif
- 👥 Batasi akses ke fitur backup
- 📋 Audit log backup activity

## 🔧 Setup Supabase Storage

Jika bucket backup belum ada, sistem akan otomatis membuatnya. Namun jika ingin setup manual:

### Via Supabase Dashboard

1. Buka Supabase Dashboard
2. Pilih project Anda
3. Klik **Storage** di sidebar
4. Klik **New Bucket**
5. Nama: `backups`
6. Public: **OFF** (Private)
7. File size limit: `50MB`
8. Klik **Create Bucket**

### Via SQL

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('backups', 'backups', false, 52428800);

-- Set policies
CREATE POLICY "Allow authenticated users to upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'backups');

CREATE POLICY "Allow authenticated users to read"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'backups');

CREATE POLICY "Allow authenticated users to delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'backups');
```

## 📞 Support

Jika mengalami masalah dengan fitur backup:

1. Cek console browser untuk error messages
2. Verifikasi Supabase Storage aktif
3. Test koneksi database
4. Hubungi administrator sistem

## 🎉 Kesimpulan

Fitur auto backup memberikan keamanan data yang lebih baik dengan:
- ✅ Backup otomatis tanpa intervensi manual
- ✅ Restore mudah jika terjadi masalah
- ✅ Export/Import untuk portabilitas
- ✅ Manajemen backup yang user-friendly
- ✅ Keamanan data terjaga

**Selalu backup data penting Anda!** 🔐
