# 📸 Tampilan Fitur Import Excel

## Lokasi Tombol Import

Di Dashboard TU, setiap lembaga (SDITA, SMPITA, SMAITA) sekarang memiliki 2 tombol:

```
┌─────────────────────────────┐
│  🏫 SDITA                   │
│                             │
│  ┌──────────┐ ┌──────────┐ │
│  │➕ Manual │ │📊 Excel  │ │
│  └──────────┘ └──────────┘ │
└─────────────────────────────┘
```

- **➕ Manual**: Input data satu per satu (cara lama)
- **📊 Excel**: Import banyak data sekaligus (FITUR BARU!)

## Modal Import Excel

### Step 1: Upload File
```
╔═══════════════════════════════════════╗
║  📊 Import Data Santri                ║
║  SDITA - SD Islam Terpadu At Tauhid   ║
╠═══════════════════════════════════════╣
║                                       ║
║  📥 Download Template Excel           ║
║  [Download Template]                  ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │                                 │ ║
║  │        📤 Upload                │ ║
║  │   Pilih File Excel              │ ║
║  │   Format: .xlsx atau .xls       │ ║
║  │                                 │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  📋 Petunjuk Import:                  ║
║  1. Download template Excel           ║
║  2. Isi data sesuai format            ║
║  3. Upload file                       ║
╚═══════════════════════════════════════╝
```

### Step 2: Preview & Validasi
```
╔═══════════════════════════════════════╗
║  📊 Import Data Santri                ║
╠═══════════════════════════════════════╣
║                                       ║
║  ┌─────────┐ ┌─────────┐ ┌─────────┐║
║  │   50    │ │   48    │ │    2    │║
║  │  Total  │ │  Valid  │ │  Error  │║
║  └─────────┘ └─────────┘ └─────────┘║
║                                       ║
║  ❌ Data dengan Error (2)             ║
║  ┌─────────────────────────────────┐ ║
║  │ Baris 5                         │ ║
║  │ NIK wajib diisi                 │ ║
║  │ Ahmad Husin                     │ ║
║  └─────────────────────────────────┘ ║
║  ┌─────────────────────────────────┐ ║
║  │ Baris 12                        │ ║
║  │ Format Tanggal tidak valid      │ ║
║  │ Fatimah Zahra                   │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  ✅ Data Valid (48)                   ║
║  ┌─────────────────────────────────┐ ║
║  │ Nama      │ Orang Tua │ Tgl Tes │ ║
║  │ Ahmad     │ Abdullah  │ 2026-01 │ ║
║  │ Fatimah   │ Ali       │ 2026-01 │ ║
║  │ ...       │ ...       │ ...     │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  [Batal]  [Import 48 Data]           ║
╚═══════════════════════════════════════╝
```

### Step 3: Hasil Import
```
╔═══════════════════════════════════════╗
║  📊 Import Data Santri                ║
╠═══════════════════════════════════════╣
║                                       ║
║         ✅                            ║
║                                       ║
║    Import Berhasil!                   ║
║                                       ║
║  48 data berhasil diimport            ║
║  2 data gagal                         ║
║                                       ║
║  Detail Error:                        ║
║  • Baris 5: NIK wajib diisi          ║
║  • Baris 12: Format tanggal invalid  ║
║                                       ║
║         [Selesai]                     ║
╚═══════════════════════════════════════╝
```

## Format Excel Template

Template yang didownload akan terlihat seperti ini:

| Nama Calon Siswa | Nama Orang Tua | NIK | Jenis Kelamin | Tempat Lahir | Tanggal Lahir | No WhatsApp | Status Alumni | Tanggal Tes | Jam Tes | Petugas TU | Status Asrama |
|------------------|----------------|-----|---------------|--------------|---------------|-------------|---------------|-------------|---------|------------|---------------|
| Ahmad Husin | Abdullah | 1234567890123456 | Laki-laki | Jakarta | 2010-05-15 | 081234567890 | Tidak | 2026-01-06 | 08:00 | Satria | Non Asrama |

**Baris pertama** adalah header (jangan dihapus!)  
**Baris kedua** adalah contoh data (bisa dihapus dan diganti dengan data asli)

## Fitur Validasi Otomatis

Sistem akan otomatis:
- ✅ Validasi field wajib
- ✅ Normalisasi format (tanggal, nomor HP, dll)
- ✅ Generate nomor tes unik
- ✅ Cek duplikasi
- ✅ Konversi format (L→Laki-laki, P→Perempuan, dll)

## Keuntungan Import Excel

### Sebelum (Manual Input)
- ⏱️ Input 50 siswa = **~2 jam**
- 😓 Capek klik-klik
- ❌ Rawan salah ketik

### Sesudah (Import Excel)
- ⚡ Import 50 siswa = **~2 menit**
- 😊 Tinggal upload
- ✅ Data sudah divalidasi

**Hemat waktu 98%!** 🚀

---

Selamat menggunakan fitur import Excel! 🎉
