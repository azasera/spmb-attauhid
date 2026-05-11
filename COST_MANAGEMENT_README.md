# Manajemen Biaya SPMB At Tauhid

Fitur manajemen biaya memungkinkan admin untuk mengelola data biaya operasional SPMB dengan mudah, termasuk import dari Excel dan export data.

## Fitur Utama

### ✅ Kelola Biaya
- Tambah biaya baru dengan kategori dan jumlah
- Edit biaya yang sudah ada
- Hapus biaya
- Filter berdasarkan lembaga dan kategori
- Total biaya otomatis terhitung

### ✅ Import dari Excel
- Import data biaya dalam jumlah banyak dari file Excel
- Validasi otomatis format data
- Template Excel tersedia untuk download
- Mendukung kolom: Nama Biaya, Kategori, Jumlah, Deskripsi, Lembaga

### ✅ Export ke Excel
- Export semua data biaya ke file Excel
- Format yang rapi dengan informasi lengkap
- Termasuk tanggal dibuat dan pembuat

## Cara Menggunakan

### 1. Setup Database
Jalankan SQL berikut di Supabase SQL Editor:
```sql
-- Jalankan setup-costs.sql
```

### 2. Akses Menu
1. Login sebagai Admin
2. Klik menu "Admin" di dashboard
3. Klik tombol "💰 Manajemen Biaya"

### 3. Tambah Biaya Manual
1. Klik "Tambah Biaya"
2. Isi form:
   - Nama Biaya: Nama item biaya
   - Kategori: Kategori biaya (Konsumsi, Transport, ATK, dll)
   - Jumlah: Jumlah dalam Rupiah
   - Deskripsi: Keterangan tambahan (opsional)
   - Lembaga: Lembaga terkait (opsional)
3. Klik "Simpan"

### 4. Import dari Excel
1. Download template Excel dari aplikasi
2. Isi data sesuai format template
3. Klik "Import Excel"
4. Pilih file Excel yang sudah diisi
5. Data akan divalidasi dan diimpor otomatis

### 5. Export Data
1. Klik "Export Excel"
2. File akan didownload otomatis dengan nama `data-biaya-[tanggal].xlsx`

## Format Excel Import

File Excel harus memiliki header berikut (tidak case-sensitive):
- `Nama Biaya` (wajib): Nama item biaya
- `Kategori` (wajib): Kategori biaya
- `Jumlah (Rp)` (wajib): Jumlah dalam angka
- `Deskripsi` (opsional): Keterangan tambahan
- `Lembaga` (opsional): Kode lembaga (MI, RA, SD, SMP, SMA)

### Contoh Data Excel:
| Nama Biaya      | Kategori  | Jumlah (Rp) | Deskripsi              | Lembaga |
|-----------------|-----------|-------------|------------------------|---------|
| Snack Peserta  | Konsumsi | 250000     | Snack untuk 50 peserta| MI     |
| Transport      | Transport| 150000     | Transport penguji      |         |
| ATK Panitia    | ATK      | 75000      | Alat tulis kantor      |         |

## Validasi Data

Sistem akan memvalidasi:
- Header kolom wajib ada
- Jumlah harus angka positif
- Nama dan kategori tidak boleh kosong
- Format jumlah akan dibersihkan dari simbol mata uang

## Keamanan

- Hanya Admin yang dapat mengakses fitur ini
- Semua perubahan tercatat dengan nama pembuat
- Data disimpan dengan aman di Supabase

## Troubleshooting

### Import Gagal
- Pastikan header kolom sesuai template
- Periksa format jumlah (hanya angka)
- Pastikan file Excel tidak rusak

### Tidak Bisa Akses Menu
- Pastikan login sebagai Admin
- Refresh halaman jika perlu

### Data Tidak Muncul
- Periksa koneksi internet
- Pastikan database sudah setup dengan benar
- Cek console browser untuk error

## File Terkait

- `src/components/CostManagementScreen.tsx` - Komponen utama
- `src/utils/costImportUtils.ts` - Utilitas import/export Excel
- `setup-costs.sql` - Script setup database
- `template-data-biaya.xlsx` - Template Excel untuk import