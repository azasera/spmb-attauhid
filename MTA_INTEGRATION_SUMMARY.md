# Integrasi Lembaga MTA (Manzhumah Takhoshush Al Qur'an)

## Ringkasan Perubahan

Telah berhasil menambahkan dukungan untuk lembaga MTA (Manzhumah Takhoshush Al Qur'an) ke dalam sistem SPMB At-Tauhid tanpa merusak fungsi yang sudah ada.

## File yang Dimodifikasi

### 1. `src/data/constants.ts`
- ✅ Menambahkan data lembaga MTA dengan ID 'MTA'
- ✅ Menambahkan `penilaianMTA` dengan kriteria penilaian khusus MTA
- ✅ Menambahkan rubrik penilaian untuk "Alasan memilih MTA At Tauhid"
- ✅ Warna gradient: `from-orange-500 to-orange-600`
- ✅ Prefix nomor tes: `MTA`

### 2. `src/utils/helpers.ts`
- ✅ Import `penilaianMTA` dari constants
- ✅ Update fungsi `generateNoTes()` untuk mendukung prefix MTA
- ✅ Update fungsi `getPenilaianByLembaga()` untuk mengembalikan `penilaianMTA`
- ✅ Update fungsi `calculateKelulusan()` untuk menggunakan sistem penilaian SMP/SMA/MTA (30% wawancara, 35% matematika, 35% hafalan)

### 3. `src/utils/suratKeteranganGenerator.ts`
- ✅ Deteksi nomor tes MTA (prefix 'MTA-')
- ✅ Data kepala sekolah MTA: Apriyanto, S.Pd. (NIY: 199001151220231161)
- ✅ Email khusus MTA: mta.attauhid@gmail.com
- ✅ Nomor surat khusus MTA
- ✅ Nama lengkap lembaga: "Manzhumah Takhoshush Al Qur'an"

## Fitur yang Didukung untuk MTA

1. **Pendaftaran Siswa**: Siswa dapat mendaftar dengan memilih lembaga MTA
2. **Nomor Tes**: Format `MTA-YYYY-XXX` (contoh: MTA-2627-001)
3. **Penilaian**: Menggunakan sistem penilaian yang sama dengan SMP/SMA
4. **Surat Keterangan**: PDF surat keterangan dengan header dan data MTA
5. **Export Data**: Semua fungsi export mendukung data siswa MTA
6. **Dashboard**: Filter dan pencarian mendukung lembaga MTA

## Sistem Penilaian MTA

MTA menggunakan sistem penilaian yang sama dengan SMP/SMA:
- **Wawancara**: 30%
- **Matematika**: 35% 
- **Hafalan**: 35%
- **KKM**: 70 (Lulus), 60-69 (Cadangan), <60 (Tidak Lulus)

## Penilaian Khusus MTA

Kriteria penilaian MTA memiliki beberapa penyesuaian:
- "Alasan memilih MTA At Tauhid" (bukan "sekolah di At Tauhid")
- Fokus pada program khusus tahfizh Al-Qur'an
- Rubrik penilaian disesuaikan dengan visi MTA

## Cara Penggunaan

1. **Admin/TU**: Dapat memilih "MTA" saat mendaftarkan siswa baru
2. **Penguji**: Dapat melakukan penilaian siswa MTA dengan kriteria yang sesuai
3. **Export**: Semua fungsi export otomatis mendukung data MTA
4. **Surat**: Generate surat keterangan dengan format MTA

## Kompatibilitas

- ✅ Tidak merusak fungsi lembaga yang sudah ada (SDITA, SMPITA, SMAITA)
- ✅ Database tetap kompatibel (hanya menambah data, tidak mengubah struktur)
- ✅ Semua komponen UI otomatis mendukung MTA
- ✅ Sistem backup dan restore tetap berfungsi normal

## File SQL Tambahan

Tersedia file `add-mta-lembaga.sql` untuk keperluan database jika diperlukan.

---

**Status**: ✅ Implementasi Selesai  
**Testing**: ✅ Tidak ada error diagnostik  
**Deployment**: Siap untuk production