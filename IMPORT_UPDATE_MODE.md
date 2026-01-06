# ✨ Mode Import: Update Data Kosong

## 🎯 Fitur Baru: Smart Import

Import Excel sekarang **PINTAR**! Sistem akan otomatis:
- ✅ Melengkapi data yang kosong
- ✅ Mempertahankan data yang sudah terisi
- ✅ Menambah data baru jika belum ada

---

## 🔄 Cara Kerja

### Mode: Update Empty Fields (Default)

```
Untuk setiap baris Excel:
  1. Cek apakah siswa sudah ada (by nama atau NIK)
  2. Jika SUDAH ADA:
     → Update hanya kolom yang KOSONG
     → Data yang sudah terisi TIDAK ditimpa
  3. Jika BELUM ADA:
     → Insert data baru
```

---

## 📊 Contoh Skenario

### Skenario 1: Melengkapi Data Kosong

**Database Sekarang:**
```
Ahmad Husin (SDITA)
- Nama Orang Tua: (kosong)
- NIK: (kosong)
- Jenis Kelamin: Laki-laki ✅
- Tanggal Lahir: 2010-05-15 ✅
- No WhatsApp: (kosong)
- Status: SUDAH DIUJI ✅
- Nilai: 85 ✅
```

**Import Excel:**
```
Ahmad Husin (SDITA)
- Nama Orang Tua: Abdullah
- NIK: 1234567890123456
- Jenis Kelamin: Perempuan (berbeda!)
- Tanggal Lahir: 2011-01-01 (berbeda!)
- No WhatsApp: 081234567890
```

**Hasil Setelah Import:**
```
Ahmad Husin (SDITA)
- Nama Orang Tua: Abdullah ✅ (diisi dari Excel)
- NIK: 1234567890123456 ✅ (diisi dari Excel)
- Jenis Kelamin: Laki-laki ✅ (TETAP, tidak ditimpa)
- Tanggal Lahir: 2010-05-15 ✅ (TETAP, tidak ditimpa)
- No WhatsApp: 081234567890 ✅ (diisi dari Excel)
- Status: SUDAH DIUJI ✅ (TETAP)
- Nilai: 85 ✅ (TETAP)
```

**Kesimpulan:**
- ✅ Data kosong dilengkapi
- ✅ Data yang sudah terisi TIDAK ditimpa
- ✅ Data tes tetap aman

---

### Skenario 2: Data Baru

**Database Sekarang:**
```
Ahmad Husin (SDITA)
Fatimah Zahra (SDITA)
```

**Import Excel:**
```
Ali Akbar (SDITA) - BARU
Siti Aisyah (SDITA) - BARU
```

**Hasil Setelah Import:**
```
Ahmad Husin (SDITA) - tidak berubah
Fatimah Zahra (SDITA) - tidak berubah
Ali Akbar (SDITA) ✅ - ditambahkan
Siti Aisyah (SDITA) ✅ - ditambahkan
```

**Kesimpulan:**
- ✅ Data baru ditambahkan
- ✅ Data lama tidak berubah

---

### Skenario 3: Mix (Update + Add)

**Database Sekarang:**
```
Ahmad Husin (SDITA)
- NIK: (kosong)
- No WhatsApp: (kosong)
```

**Import Excel:**
```
Ahmad Husin (SDITA)
- NIK: 1234567890123456
- No WhatsApp: 081234567890

Ali Akbar (SDITA) - BARU
- NIK: 1234567890123457
- No WhatsApp: 081234567891
```

**Hasil Setelah Import:**
```
Ahmad Husin (SDITA)
- NIK: 1234567890123456 ✅ (dilengkapi)
- No WhatsApp: 081234567890 ✅ (dilengkapi)

Ali Akbar (SDITA) ✅ (ditambahkan)
- NIK: 1234567890123457
- No WhatsApp: 081234567891
```

**Kesimpulan:**
- ✅ Data lama dilengkapi
- ✅ Data baru ditambahkan
- ✅ Semua dalam 1 import!

---

## 🛡️ Proteksi Data

### Data yang TIDAK Akan Ditimpa:

1. **Data Pribadi yang Sudah Terisi**
   - Nama Orang Tua
   - NIK
   - Jenis Kelamin
   - Tempat Lahir
   - Tanggal Lahir
   - No WhatsApp
   - dll

2. **Data Tes (100% Aman)**
   - Status (BELUM DIUJI / SUDAH DIUJI)
   - Penilaian Anak
   - Penilaian Orang Tua
   - Nilai Matematika
   - Nilai Hafalan
   - Nilai Akhir
   - Kelulusan
   - Catatan Penguji

3. **Metadata**
   - Nomor Tes
   - Tanggal Dibuat
   - Penguji

---

## 📝 Aturan Update

### Kolom yang Bisa Dilengkapi:

| Kolom | Aturan Update |
|-------|---------------|
| Nama Orang Tua | Jika kosong → diisi |
| NIK | Jika kosong → diisi |
| Jenis Kelamin | Jika kosong → diisi |
| Tempat Lahir | Jika kosong → diisi |
| Tanggal Lahir | Jika kosong → diisi |
| No WhatsApp | Jika kosong → diisi |
| Tanggal Tes | Jika kosong → diisi |
| Jam Tes | Jika kosong → diisi |
| Petugas TU | Jika kosong → diisi |
| Status Alumni | Jika TIDAK → bisa jadi YA |
| Status Asrama | Jika NON ASRAMA → bisa jadi ASRAMA |

### Kolom yang TIDAK Bisa Diubah:

| Kolom | Alasan |
|-------|--------|
| Nama Calon Siswa | Identifier utama |
| Nomor Tes | Auto-generate, unik |
| Status Tes | Proteksi data tes |
| Penilaian | Proteksi data tes |
| Nilai | Proteksi data tes |
| Kelulusan | Proteksi data tes |

---

## 🎯 Use Cases

### Use Case 1: Import Nama Dulu, Detail Nanti

**Step 1: Import Cepat (Hari 1)**
```excel
Nama Calon Siswa | Tanggal Tes | Jam Tes
Ahmad Husin      | 2026-01-10  | 08:00
Fatimah Zahra    | 2026-01-10  | 08:00
Ali Akbar        | 2026-01-10  | 09:00
```
✅ Import berhasil, data minimal tersimpan

**Step 2: Lengkapi Data (Hari 2)**
```excel
Nama Calon Siswa | Nama Orang Tua | NIK              | No WhatsApp
Ahmad Husin      | Abdullah       | 1234567890123456 | 081234567890
Fatimah Zahra    | Ali            | 1234567890123457 | 081234567891
Ali Akbar        | Ahmad          | 1234567890123458 | 081234567892
```
✅ Import berhasil, data dilengkapi!

**Hasil Akhir:**
```
Ahmad Husin
- Nama Orang Tua: Abdullah ✅
- NIK: 1234567890123456 ✅
- Tanggal Tes: 2026-01-10 ✅ (dari import pertama)
- Jam Tes: 08:00 ✅ (dari import pertama)
- No WhatsApp: 081234567890 ✅
```

---

### Use Case 2: Data dari Berbagai Sumber

**Sumber 1: Formulir Online (Hari 1)**
```
Import: Nama + Email + No HP
```

**Sumber 2: Verifikasi Dokumen (Hari 2)**
```
Import: Nama + NIK + Tanggal Lahir
```

**Sumber 3: Jadwal Tes (Hari 3)**
```
Import: Nama + Tanggal Tes + Jam Tes
```

**Hasil:** Data lengkap dari 3 sumber berbeda! ✅

---

### Use Case 3: Koreksi Data Kosong

**Situasi:** 100 siswa sudah diinput, tapi 50 siswa NIK-nya kosong

**Solusi:**
1. Export data ke Excel
2. Isi kolom NIK yang kosong
3. Import ulang
4. ✅ NIK terisi, data lain tetap aman!

---

## 💡 Tips & Best Practices

### ✅ DO (Lakukan)

1. **Import Bertahap**
   ```
   Step 1: Import nama + jadwal tes
   Step 2: Import data pribadi
   Step 3: Import kontak orang tua
   ```

2. **Gunakan untuk Melengkapi Data**
   ```
   - Ada data kosong? Import ulang dengan data lengkap
   - Sistem otomatis isi yang kosong saja
   ```

3. **Verifikasi Setelah Import**
   ```
   - Cek dashboard
   - Pastikan data terisi dengan benar
   ```

### ❌ DON'T (Jangan)

1. **Jangan Harap Data Salah Bisa Ditimpa**
   ```
   - Data yang sudah terisi TIDAK akan ditimpa
   - Jika salah, edit manual via dashboard
   ```

2. **Jangan Import Data Tes**
   ```
   - Data tes tidak bisa diimport
   - Harus input manual via form penilaian
   ```

---

## 🔍 Cara Cek Hasil Import

### Console Browser (F12)
```
✅ Updated: Ahmad Husin (melengkapi data kosong)
✅ Added: Ali Akbar (data baru)
✅ Updated: Fatimah Zahra (melengkapi data kosong)
```

### Dashboard
```
1. Klik nama siswa
2. Lihat detail data
3. Cek kolom yang dilengkapi
```

### Supabase Database
```sql
SELECT 
  "noTes",
  data->>'namaSiswa' as nama,
  data->>'nik' as nik,
  data->>'kontakOrtu' as hp,
  status
FROM students
WHERE lembaga = 'SDITA'
ORDER BY "createdAt" DESC;
```

---

## 🎉 Keuntungan

### Fleksibilitas:
- ✅ Import data bertahap
- ✅ Melengkapi data dari berbagai sumber
- ✅ Tidak perlu data lengkap sekaligus

### Keamanan:
- ✅ Data yang sudah terisi aman
- ✅ Data tes tidak berubah
- ✅ Tidak ada data yang hilang

### Efisiensi:
- ✅ Tidak perlu edit manual satu-satu
- ✅ Import ulang untuk melengkapi
- ✅ Hemat waktu 90%!

---

## 🆘 FAQ

### Q: Apakah data yang sudah terisi akan ditimpa?
**A:** TIDAK! Hanya kolom kosong yang diisi.

### Q: Bagaimana jika data salah dan ingin diubah?
**A:** Edit manual via dashboard (klik tombol Edit ✏️).

### Q: Apakah data tes akan berubah?
**A:** TIDAK! Data tes 100% aman, tidak bisa diubah via import.

### Q: Bagaimana sistem tahu siswa sudah ada?
**A:** Cek berdasarkan nama (per lembaga) atau NIK.

### Q: Apakah bisa import data baru dan update sekaligus?
**A:** Bisa! Sistem otomatis deteksi mana yang baru, mana yang update.

---

## 📊 Summary

### Mode Import: Update Empty Fields

| Aspek | Keterangan |
|-------|------------|
| Siswa Sudah Ada | Update kolom kosong saja |
| Siswa Belum Ada | Insert data baru |
| Data Terisi | TIDAK ditimpa ✅ |
| Data Tes | TIDAK berubah ✅ |
| Fleksibilitas | ⭐⭐⭐⭐⭐ |
| Keamanan | 🛡️ Tinggi |

**Kesimpulan:** Import pintar yang aman dan fleksibel! 🎉

---

**Created:** 6 Januari 2026  
**Version:** 3.0.0  
**Feature:** Smart Import with Update Mode  
**Status:** ✅ Production Ready
