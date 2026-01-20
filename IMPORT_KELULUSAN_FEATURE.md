# 📋 Fitur Import Status Kelulusan

## ✨ Fitur Baru

Sekarang Anda bisa **import data santri yang sudah ada status kelulusannya** melalui Excel!

## 🎯 Kegunaan

1. **Migrasi Data Lama** - Import data santri dari sistem lama yang sudah ada hasil tesnya
2. **Update Massal** - Update status kelulusan banyak santri sekaligus
3. **Data Lengkap** - Import data santri baru sekaligus dengan status kelulusannya

## 📊 Kolom Baru: Status Kelulusan

### Format yang Diterima:

| Input Excel | Hasil di Aplikasi |
|-------------|-------------------|
| LULUS | LULUS |
| L | LULUS |
| LOLOS | LULUS |
| CADANGAN | CADANGAN |
| C | CADANGAN |
| CAD | CADANGAN |
| TIDAK LULUS | TIDAK LULUS |
| TL | TIDAK LULUS |
| TIDAK | TIDAK LULUS |
| GAGAL | TIDAK LULUS |
| (kosong) | Belum Diuji |

### Aturan:

✅ **Kolom opsional** - Boleh dikosongkan
✅ **Case insensitive** - "lulus", "LULUS", "Lulus" semua diterima
✅ **Shortcut** - Bisa pakai "L", "C", "TL" untuk cepat
✅ **Auto status** - Jika ada kelulusan, status otomatis jadi "SUDAH DIUJI"

## 📝 Contoh Penggunaan

### Contoh 1: Import Santri Baru dengan Status Kelulusan

```
Nama Calon Siswa: Ahmad Husin
Status Kelulusan: LULUS
```

Hasil:
- Data santri tersimpan
- Status: SUDAH DIUJI
- Kelulusan: LULUS

### Contoh 2: Import Santri Baru Belum Diuji

```
Nama Calon Siswa: Fatimah Zahra
Status Kelulusan: (kosong)
```

Hasil:
- Data santri tersimpan
- Status: BELUM DIUJI
- Kelulusan: (belum ada)

### Contoh 3: Update Status Kelulusan Santri yang Sudah Ada

```
Nama Calon Siswa: Muhammad Ali (sudah ada di database)
Status Kelulusan: CADANGAN
```

Hasil:
- Data santri yang sudah ada diupdate
- Jika belum ada kelulusan, diisi dengan CADANGAN
- Jika sudah ada kelulusan, TIDAK DIUBAH (data protection)

## 🔒 Data Protection

**PENTING:** Status kelulusan yang sudah ada **TIDAK AKAN DITIMPA** saat import!

- ✅ Jika santri belum ada kelulusan → Diisi dari Excel
- ❌ Jika santri sudah ada kelulusan → Tetap pakai yang lama (tidak diubah)

Ini untuk melindungi data hasil tes yang sudah dilakukan.

## 📥 Download Template Baru

1. Login sebagai **TU**
2. Klik tombol **"Excel"** di lembaga yang diinginkan
3. Klik **"Download Template"**
4. Template baru sudah include kolom **"Status Kelulusan"**

## 📋 Struktur Template Lengkap

| No | Kolom | Wajib? | Contoh |
|----|-------|--------|--------|
| 1 | Nama Calon Siswa | ✅ Ya | Ahmad Husin |
| 2 | Nama Orang Tua | ❌ Tidak | Abdullah |
| 3 | NIK | ❌ Tidak | 1234567890123456 |
| 4 | Jenis Kelamin | ❌ Tidak | Laki-laki |
| 5 | Tempat Lahir | ❌ Tidak | Jakarta |
| 6 | Tanggal Lahir | ❌ Tidak | 2010-05-15 |
| 7 | No WhatsApp | ❌ Tidak | 081234567890 |
| 8 | Status Alumni | ❌ Tidak | Ya / Tidak |
| 9 | Tanggal Tes | ❌ Tidak | 2026-01-06 |
| 10 | Jam Tes | ❌ Tidak | 08:00 |
| 11 | Petugas TU | ❌ Tidak | Satria |
| 12 | Status Asrama | ❌ Tidak | ASRAMA / NON ASRAMA |
| 13 | **Status Kelulusan** | ❌ Tidak | LULUS / CADANGAN / TIDAK LULUS |

## 🎯 Use Cases

### Use Case 1: Migrasi Data dari Sistem Lama

Anda punya data santri tahun lalu di Excel dengan status kelulusan:

1. Format Excel sesuai template
2. Isi kolom "Status Kelulusan" dengan: LULUS, CADANGAN, atau TIDAK LULUS
3. Import ke aplikasi
4. ✅ Data langsung masuk dengan status kelulusan

### Use Case 2: Import Data Baru (Belum Tes)

Anda punya data pendaftar baru yang belum tes:

1. Format Excel sesuai template
2. **Kosongkan** kolom "Status Kelulusan"
3. Import ke aplikasi
4. ✅ Data masuk dengan status BELUM DIUJI

### Use Case 3: Update Status Kelulusan Massal

Setelah pengumuman, Anda mau update status kelulusan banyak santri:

1. Export data santri yang sudah ada
2. Tambahkan kolom "Status Kelulusan"
3. Isi dengan: LULUS, CADANGAN, atau TIDAK LULUS
4. Import kembali
5. ✅ Status kelulusan terupdate (hanya yang belum ada)

## ⚠️ Catatan Penting

1. **Hanya TU** yang bisa import Excel
2. **Status kelulusan yang sudah ada tidak akan diubah** (data protection)
3. **Jika ada kelulusan, status otomatis jadi SUDAH DIUJI**
4. **Kolom Status Kelulusan opsional** - boleh dikosongkan
5. **Format shortcut** bisa dipakai: L, C, TL

## 🚀 Deployment

Fitur ini sudah di-deploy dan siap digunakan!

**Commit:** (akan diisi setelah deploy)
**Date:** 2026-01-20

## 📞 Support

Jika ada pertanyaan atau masalah, hubungi admin sistem.

---

**Happy Importing! 🎉**
