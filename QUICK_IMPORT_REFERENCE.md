# 🚀 Quick Reference - Import Excel

## Akses Cepat
1. Login sebagai **TU**
2. Dashboard → Pilih lembaga (SDITA/SMPITA/SMAITA)
3. Klik tombol **📊 Excel**

## Format Excel (12 Kolom)

| # | Kolom | Format | Contoh | Required |
|---|-------|--------|--------|----------|
| 1 | Nama Calon Siswa | Text | Ahmad Husin | ✅ WAJIB |
| 2 | Nama Orang Tua | Text | Abdullah | ⚪ Opsional |
| 3 | NIK | 16 digit | 1234567890123456 | ⚪ Opsional |
| 4 | Jenis Kelamin | L/P atau Laki-laki/Perempuan | Laki-laki | ⚪ Opsional |
| 5 | Tempat Lahir | Text | Jakarta | ⚪ Opsional |
| 6 | Tanggal Lahir | YYYY-MM-DD | 2010-05-15 | ⚪ Opsional |
| 7 | No WhatsApp | 08xxx atau 628xxx | 081234567890 | ⚪ Opsional |
| 8 | Status Alumni | Ya/Tidak | Tidak | ⚪ Opsional |
| 9 | Tanggal Tes | YYYY-MM-DD | 2026-01-06 | ⚪ Opsional |
| 10 | Jam Tes | HH:MM | 08:00 | ⚪ Opsional |
| 11 | Petugas TU | Text | Satria | ⚪ Opsional |
| 12 | Status Asrama | Asrama/Non Asrama | Non Asrama | ⚪ Opsional |

**ATURAN BARU:** Hanya Nama Calon Siswa yang wajib! Sisanya boleh kosong, bisa diisi manual nanti.

## Shortcut Format

### Jenis Kelamin
- `L` = Laki-laki
- `P` = Perempuan

### Status Alumni
- `Y` = Ya
- `T` = Tidak

### Status Asrama
- `A` = Asrama
- Kosong = Non Asrama

### Tanggal
- `2010-05-15` ✅
- `15/05/2010` ✅
- `15-05-2010` ✅

### No WhatsApp
- `081234567890` → auto convert ke `6281234567890`
- `0812-3456-7890` → auto remove dash
- `+62812` → auto normalize

## Error Umum & Solusi

| Error | Solusi |
|-------|--------|
| Nama Calon Siswa wajib diisi | Isi kolom Nama Calon Siswa (satu-satunya yang wajib) |
| Format tanggal tidak valid | Gunakan YYYY-MM-DD atau kosongkan |
| Jenis Kelamin harus... | Isi dengan L/P atau kosongkan |
| Data lain kosong | ✅ Boleh! Bisa diisi manual nanti via edit |

## Tips Cepat

✅ **DO**
- Minimal isi Nama Calon Siswa (wajib)
- Kolom lain boleh kosong, isi nanti via edit
- Download template dulu
- Cek data sebelum upload
- Import bertahap jika data banyak

❌ **DON'T**
- Jangan kosongkan Nama Calon Siswa
- Jangan ubah nama kolom
- Jangan hapus header
- Jangan tambah kolom baru

## Workflow 3 Step

```
1. UPLOAD          2. PREVIEW         3. RESULT
   ↓                  ↓                  ↓
Download Template  Validasi Data    Import Success
Fill Data          Fix Errors       Reload Dashboard
Upload File        Confirm Import   Done! ✅
```

## Keyboard Shortcuts

- `Ctrl + S` - Save Excel
- `F5` - Refresh dashboard
- `Esc` - Close modal

## Support

📧 Contact: Administrator  
📱 WhatsApp: [Your Number]  
🌐 Docs: IMPORT_EXCEL_GUIDE.md

---

**Last Updated:** 6 Jan 2026  
**Version:** 1.0.0
