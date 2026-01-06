# 📊 Panduan Import Data Santri dari Excel

## Fitur Baru: Import Excel

Fitur import Excel memungkinkan Anda untuk menambahkan banyak data calon santri sekaligus menggunakan file Excel, menghemat waktu dibandingkan input manual satu per satu.

## Cara Menggunakan

### 1. Download Template Excel
- Login sebagai **TU (Tata Usaha)**
- Di dashboard, klik tombol **Excel** pada lembaga yang diinginkan (SDITA/SMPITA/SMAITA)
- Klik tombol **"Download Template"**
- Template Excel akan terdownload dengan format yang sudah sesuai

### 2. Isi Data di Excel
Buka file template dan isi data sesuai kolom yang tersedia:

| Kolom | Keterangan | Contoh | Wajib |
|-------|------------|--------|-------|
| Nama Calon Siswa | Nama lengkap calon santri | Ahmad Husin | ✅ WAJIB |
| Nama Orang Tua | Nama ayah/ibu/wali | Abdullah | ⚪ Opsional |
| NIK | Nomor Induk Kependudukan (16 digit) | 1234567890123456 | ⚪ Opsional |
| Jenis Kelamin | Laki-laki atau Perempuan | Laki-laki | ⚪ Opsional |
| Tempat Lahir | Kota/kabupaten lahir | Jakarta | ⚪ Opsional |
| Tanggal Lahir | Format: YYYY-MM-DD atau DD/MM/YYYY | 2010-05-15 | ⚪ Opsional |
| No WhatsApp | Nomor WA orang tua (08xxx atau 628xxx) | 081234567890 | ⚪ Opsional |
| Status Alumni | Ya atau Tidak | Tidak | ⚪ Opsional |
| Tanggal Tes | Tanggal ujian masuk | 2026-01-06 | ⚪ Opsional |
| Jam Tes | Waktu ujian | 08:00 | ⚪ Opsional |
| Petugas TU | Nama petugas yang input | Satria | ⚪ Opsional |
| Status Asrama | Asrama atau Non Asrama | Non Asrama | ⚪ Opsional |

**Catatan:**
- ✅ = Kolom wajib diisi (HANYA Nama Calon Siswa)
- ⚪ = Kolom opsional (boleh kosong, bisa diisi manual nanti via edit)
- **Aturan Baru:** Hanya nama siswa yang wajib, sisanya boleh kosong!
- Data yang kosong bisa dilengkapi nanti dengan klik tombol Edit di dashboard

### 3. Upload File Excel
- Klik tombol **"Pilih File Excel"**
- Pilih file Excel yang sudah diisi
- Sistem akan otomatis memvalidasi data

### 4. Preview & Validasi
Setelah file diupload, sistem akan menampilkan:
- **Total Baris**: Jumlah data yang dibaca
- **Valid**: Data yang lolos validasi
- **Error**: Data yang ada kesalahan

Jika ada error, sistem akan menampilkan detail error per baris:
- Nomor baris yang error
- Jenis kesalahan
- Data yang bermasalah

### 5. Import Data
- Jika ada data valid, klik tombol **"Import X Data"**
- Sistem akan memproses dan menyimpan data ke database
- Setelah selesai, akan muncul ringkasan hasil import

## Format Data yang Diterima

### ✅ Kolom Wajib (HANYA 1)
- **Nama Calon Siswa** - Wajib diisi, tidak boleh kosong

### ⚪ Kolom Opsional (Boleh Kosong)
Semua kolom lain boleh dikosongkan dan bisa diisi manual nanti via edit:
- Nama Orang Tua
- NIK
- Jenis Kelamin
- Tempat Lahir
- Tanggal Lahir
- No WhatsApp
- Status Alumni
- Tanggal Tes
- Jam Tes
- Petugas TU
- Status Asrama

**Keuntungan:**
- Import lebih cepat (isi nama dulu, detail nanti)
- Tidak perlu data lengkap untuk import
- Bisa edit manual setelah import
- Fleksibel untuk data yang belum lengkap

### Format Jika Diisi

### Jenis Kelamin
Sistem menerima berbagai format:
- `Laki-laki`, `L`, `LAKI-LAKI` → akan dikonversi ke "Laki-laki"
- `Perempuan`, `P`, `PEREMPUAN` → akan dikonversi ke "Perempuan"

### Status Alumni
- `Ya`, `Y`, `YA`, `YES` → akan dikonversi ke "YA"
- `Tidak`, `T`, `TIDAK`, `NO` → akan dikonversi ke "TIDAK"

### Status Asrama
- `Asrama`, `A`, `ASRAMA` → akan dikonversi ke "ASRAMA"
- `Non Asrama`, `NON ASRAMA`, `NON-ASRAMA` → akan dikonversi ke "NON ASRAMA"
- Jika kosong → default "NON ASRAMA"

### Format Tanggal
Sistem menerima berbagai format tanggal:
- `YYYY-MM-DD` (contoh: 2010-05-15)
- `DD/MM/YYYY` (contoh: 15/05/2010)
- `DD-MM-YYYY` (contoh: 15-05-2010)
- Excel serial date (otomatis dari Excel)

### Nomor WhatsApp
Sistem akan otomatis menormalisasi nomor:
- `081234567890` → `62812345678890`
- `0812-3456-7890` → `6281234567890`
- `+62812345678890` → `6281234567890`

## Tips & Best Practices

### ✅ DO (Lakukan)
1. **Gunakan template** yang sudah disediakan
2. **Cek data** sebelum upload (pastikan tidak ada yang kosong)
3. **Format tanggal** konsisten (gunakan YYYY-MM-DD untuk lebih aman)
4. **Backup data** Excel sebelum upload
5. **Import bertahap** jika data sangat banyak (maksimal 100 baris per file)

### ❌ DON'T (Jangan)
1. **Jangan ubah nama kolom** di template
2. **Jangan hapus header** (baris pertama)
3. **Jangan tambah kolom** baru di tengah-tengah
4. **Jangan gunakan karakter khusus** yang aneh di nama
5. **Jangan upload file yang rusak** atau format salah

## Troubleshooting

### Error: "Nama Calon Siswa wajib diisi"
- Pastikan kolom Nama Calon Siswa terisi untuk semua baris
- Ini adalah satu-satunya kolom yang wajib diisi

### Data lain kosong, apakah boleh?
- ✅ Boleh! Semua kolom selain Nama Calon Siswa boleh kosong
- Data yang kosong bisa dilengkapi nanti dengan edit manual
- Klik tombol Edit (✏️) di dashboard untuk melengkapi data

### Error: "Format Tanggal tidak valid"
- Hanya muncul jika Anda mengisi tanggal dengan format salah
- Gunakan format YYYY-MM-DD (contoh: 2010-05-15)
- Atau DD/MM/YYYY (contoh: 15/05/2010)
- Atau kosongkan saja, isi manual nanti

### Error: "Jenis Kelamin harus Laki-laki atau Perempuan"
- Hanya muncul jika Anda mengisi dengan format salah
- Isi dengan "Laki-laki" atau "Perempuan"
- Atau gunakan singkatan "L" atau "P"
- Atau kosongkan saja, isi manual nanti

### Data tidak muncul setelah import
- Refresh halaman (F5)
- Cek filter lembaga (pastikan tidak terfilter)
- Cek di database Supabase

## Keamanan & Validasi

Sistem melakukan validasi otomatis:
1. ✅ Validasi field wajib (hanya Nama Calon Siswa)
2. ✅ Validasi format data jika diisi (tanggal, jenis kelamin, dll)
3. ✅ Generate nomor tes unik otomatis
4. ✅ Cek duplikasi nomor tes
5. ✅ Normalisasi data (format konsisten)
6. ✅ Kolom kosong diperbolehkan (bisa diisi manual nanti)

## Contoh Data Excel

```
Nama Calon Siswa | Nama Orang Tua | NIK              | Jenis Kelamin | Tempat Lahir | Tanggal Lahir | No WhatsApp   | Status Alumni | Tanggal Tes | Jam Tes | Petugas TU | Status Asrama
Ahmad Husin      | Abdullah       | 1234567890123456 | Laki-laki     | Jakarta      | 2010-05-15    | 081234567890  | Tidak         | 2026-01-06  | 08:00   | Satria     | Non Asrama
Fatimah Zahra    | Ali            | 1234567890123457 | Perempuan     | Bandung      | 2011-03-20    | 081234567891  | Ya            | 2026-01-06  | 08:00   | Satria     | Asrama
```

## Support

Jika mengalami kendala:
1. Cek console browser (F12) untuk error detail
2. Pastikan koneksi internet stabil
3. Pastikan Supabase database aktif
4. Hubungi administrator sistem

---

**Dibuat:** 6 Januari 2026  
**Versi:** 1.0.0
