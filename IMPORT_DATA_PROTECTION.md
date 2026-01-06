# 🛡️ Proteksi Data Import Excel

## ✅ AMAN! Data Lama TIDAK Akan Ditimpa

### 🔒 Jaminan Keamanan

Import Excel menggunakan operasi **INSERT** (menambah data baru), bukan **UPDATE** (menimpa data lama).

**Artinya:**
- ✅ Data lama tetap aman
- ✅ Data tes yang sudah ada tidak hilang
- ✅ Penilaian yang sudah diinput tidak terhapus
- ✅ Import hanya menambah data baru

---

## 🔍 Deteksi Duplikat Otomatis

Sistem akan otomatis mendeteksi dan menolak data duplikat untuk mencegah data ganda.

### Kriteria Duplikat:

#### 1. Berdasarkan Nama Siswa
```
Cek: Nama siswa yang sama di lembaga yang sama
Contoh:
- Database: Ahmad Husin (SDITA)
- Import: Ahmad Husin (SDITA)
- Result: ❌ Ditolak (duplikat)
```

#### 2. Berdasarkan NIK
```
Cek: NIK yang sama (di semua lembaga)
Contoh:
- Database: NIK 1234567890123456 (SDITA)
- Import: NIK 1234567890123456 (SMPITA)
- Result: ❌ Ditolak (duplikat)
```

**Catatan:** NIK hanya dicek jika diisi (minimal 16 digit)

---

## 📊 Skenario Import

### Skenario 1: Data Baru (Tidak Ada Duplikat)
```
Database:
- Ahmad Husin (SDITA)
- Fatimah Zahra (SDITA)

Import Excel:
- Ali Akbar (SDITA)
- Siti Aisyah (SDITA)

Result:
✅ 2 data berhasil diimport
✅ Total data: 4 siswa
```

---

### Skenario 2: Ada Duplikat Nama
```
Database:
- Ahmad Husin (SDITA) - Sudah ada data tes ✅

Import Excel:
- Ahmad Husin (SDITA)
- Ali Akbar (SDITA)

Result:
❌ Ahmad Husin ditolak (duplikat)
✅ Ali Akbar berhasil diimport
⚠️ Error: "Data duplikat: Siswa dengan nama 'Ahmad Husin' sudah ada di database"
```

---

### Skenario 3: Ada Duplikat NIK
```
Database:
- Ahmad Husin (SDITA) - NIK: 1234567890123456

Import Excel:
- Ali Akbar (SMPITA) - NIK: 1234567890123456

Result:
❌ Ali Akbar ditolak (NIK duplikat)
⚠️ Error: "Data duplikat: Siswa dengan nama 'Ali Akbar' sudah ada di database"
```

---

### Skenario 4: Nama Sama, Lembaga Beda
```
Database:
- Ahmad Husin (SDITA)

Import Excel:
- Ahmad Husin (SMPITA)

Result:
✅ Ahmad Husin (SMPITA) berhasil diimport
✅ Dianggap siswa berbeda (lembaga berbeda)
```

---

### Skenario 5: Data Sudah Ada Tes
```
Database:
- Ahmad Husin (SDITA)
  - Status: SUDAH DIUJI ✅
  - Nilai: 85
  - Kelulusan: LULUS

Import Excel:
- Ahmad Husin (SDITA)

Result:
❌ Ditolak (duplikat)
✅ Data tes Ahmad Husin tetap aman, tidak berubah!
```

---

## 🎯 Cara Kerja Deteksi Duplikat

### Step 1: Parse Excel
```
Excel → Validasi Format → ParsedStudent[]
```

### Step 2: Cek Duplikat (Per Baris)
```
Untuk setiap siswa:
  1. Cek nama di lembaga yang sama
  2. Cek NIK (jika diisi)
  3. Jika duplikat → Skip, tambah ke error
  4. Jika tidak duplikat → Lanjut import
```

### Step 3: Import Data Baru
```
Data yang lolos:
  - Generate nomor tes unik
  - INSERT ke database (tidak UPDATE)
  - Status: BELUM DIUJI
```

---

## 🔧 Konfigurasi

### Deteksi Duplikat: ON (Default)
```typescript
importStudentsToDatabase(
  parsedStudents,
  lembagaId,
  lembagaName,
  checkDuplicate: true // Default
);
```

### Disable Deteksi Duplikat (Tidak Recommended)
```typescript
importStudentsToDatabase(
  parsedStudents,
  lembagaId,
  lembagaName,
  checkDuplicate: false // Force import semua
);
```

**⚠️ Warning:** Disable deteksi duplikat bisa menyebabkan data ganda!

---

## 📋 Error Messages

### Error: Data Duplikat
```
❌ Data duplikat: Siswa dengan nama "Ahmad Husin" sudah ada di database
```

**Artinya:**
- Siswa dengan nama yang sama sudah ada di lembaga yang sama
- Atau NIK yang sama sudah terdaftar

**Solusi:**
1. Cek data di database (mungkin sudah diinput manual)
2. Jika memang duplikat, skip baris ini
3. Jika beda siswa, ubah nama sedikit (tambah nama tengah, dll)

---

## 🛡️ Proteksi Data Tes

### Data yang Dilindungi:
- ✅ Status (BELUM DIUJI / SUDAH DIUJI)
- ✅ Penilaian Anak
- ✅ Penilaian Orang Tua
- ✅ Nilai Matematika
- ✅ Nilai Hafalan
- ✅ Nilai Akhir
- ✅ Kelulusan
- ✅ Catatan Penguji

**Jaminan:** Import Excel TIDAK AKAN mengubah data di atas!

---

## 🔍 Cara Cek Data Duplikat Manual

### Sebelum Import:

**Opsi 1: Cek di Dashboard**
```
1. Login sebagai TU/Admin
2. Dashboard → Filter lembaga
3. Search nama siswa
4. Jika ada → Duplikat
```

**Opsi 2: Cek di Supabase**
```sql
-- Cek nama duplikat
SELECT 
  "noTes",
  lembaga,
  data->>'namaSiswa' as nama,
  status
FROM students
WHERE lembaga = 'SDITA'
AND data->>'namaSiswa' ILIKE 'Ahmad Husin';

-- Cek NIK duplikat
SELECT 
  "noTes",
  lembaga,
  data->>'namaSiswa' as nama,
  data->>'nik' as nik
FROM students
WHERE data->>'nik' = '1234567890123456';
```

---

## 💡 Best Practices

### ✅ DO (Lakukan)

1. **Cek data sebelum import**
   - Review Excel sebelum upload
   - Pastikan tidak ada nama duplikat

2. **Gunakan NIK jika ada**
   - NIK unik per siswa
   - Mencegah duplikat lebih akurat

3. **Import bertahap**
   - Import per batch (50-100 siswa)
   - Lebih mudah track error

4. **Backup sebelum import besar**
   - Backup database dulu
   - Jaga-jaga jika ada masalah

### ❌ DON'T (Jangan)

1. **Jangan disable deteksi duplikat**
   - Bisa menyebabkan data ganda
   - Sulit dibersihkan nanti

2. **Jangan import ulang data yang sama**
   - Akan ditolak sistem
   - Buang waktu

3. **Jangan panik jika ada error duplikat**
   - Itu fitur proteksi
   - Data lama tetap aman

---

## 🎯 Summary

### Proteksi yang Diberikan:

| Proteksi | Status | Keterangan |
|----------|--------|------------|
| Data lama tidak ditimpa | ✅ | Menggunakan INSERT, bukan UPDATE |
| Deteksi duplikat nama | ✅ | Per lembaga |
| Deteksi duplikat NIK | ✅ | Semua lembaga |
| Data tes dilindungi | ✅ | Tidak akan berubah |
| Nomor tes unik | ✅ | Auto-generate, tidak duplikat |

### Kesimpulan:

**✅ AMAN 100%!**

- Data lama tidak akan ditimpa
- Data tes tidak akan hilang
- Duplikat otomatis ditolak
- Import hanya menambah data baru

**Silakan import dengan tenang!** 🛡️

---

## 🆘 FAQ

### Q: Apakah data tes akan hilang jika import ulang?
**A:** Tidak! Data tes dilindungi. Import ulang akan ditolak (duplikat).

### Q: Bagaimana jika nama siswa sama tapi beda orang?
**A:** Tambahkan nama tengah atau inisial untuk membedakan.

### Q: Apakah bisa import siswa yang sudah lulus tahun lalu?
**A:** Bisa, tapi akan ditolak jika nama sama di lembaga yang sama.

### Q: Bagaimana cara hapus data duplikat yang sudah terlanjur masuk?
**A:** Gunakan tombol Delete (🗑️) di dashboard untuk hapus data yang tidak perlu.

### Q: Apakah deteksi duplikat bisa dimatikan?
**A:** Bisa, tapi sangat tidak recommended. Bisa menyebabkan data ganda.

---

**Last Updated:** 6 Januari 2026  
**Version:** 2.0.0  
**Security Level:** 🛡️ High Protection
