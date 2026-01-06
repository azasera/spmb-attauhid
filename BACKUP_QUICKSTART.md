# 🚀 Quick Start - Auto Backup Feature

## Akses Fitur

1. Login sebagai **ADMIN**
2. Klik **"Manajemen User"**
3. Klik **"Backup Data"**

## Fitur Utama

### 🔄 Auto Backup
- Otomatis setiap 24 jam
- Tidak perlu konfigurasi

### 💾 Manual Backup
```
Klik "Buat Backup Manual" → Tunggu selesai → Selesai!
```

### 📥 Export JSON
```
Klik "Export ke JSON" → File terdownload → Simpan di tempat aman
```

### 📤 Import JSON
```
Pilih file → Klik "Import Data" → Konfirmasi → Selesai!
```

### ♻️ Restore
```
Pilih backup → Klik icon Restore → Konfirmasi → Selesai!
```

## ⚠️ Penting

- ✅ Sistem auto backup sebelum restore
- ✅ Data user TIDAK di-restore (keamanan)
- ✅ Simpan backup penting di lokal
- ✅ Test restore secara berkala

## 📋 Data yang Di-backup

- ✅ Students (calon santri)
- ✅ Rubric Guides (panduan penilaian)
- ✅ App Settings (pengaturan)
- ❌ Users (tidak untuk keamanan)

## 🔧 Setup Supabase Storage

Bucket `backups` akan otomatis dibuat saat pertama kali digunakan.

Jika perlu setup manual:
1. Buka Supabase Dashboard
2. Storage → New Bucket
3. Nama: `backups`
4. Public: OFF
5. Size limit: 50MB

Selesai! 🎉
