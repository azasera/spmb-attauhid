# Sinkronisasi Surat Keterangan Lulus dengan Biaya Pendidikan

## 🎯 Overview

Fitur ini mensinkronkan sistem surat keterangan lulus dengan manajemen biaya pendidikan yang dapat dikelola secara dinamis oleh admin. Surat keterangan sekarang akan menampilkan biaya yang akurat berdasarkan data terbaru dari database.

## 🔧 Implementasi

### 1. **Utility Cost Integration** (`src/utils/costIntegration.ts`)
- **Fungsi**: Mengambil biaya siswa berdasarkan lembaga dan status asrama
- **Database Integration**: Menggunakan Supabase untuk mengambil data biaya real-time
- **Fallback System**: Jika database tidak tersedia, menggunakan nilai default
- **Smart Filtering**: Menentukan biaya berdasarkan:
  - Lembaga (TK, SDITA, SMPITA, SMAITA, MTA)
  - Status Asrama (Asrama/Non-Asrama)
  - Status Alumni (YA/TIDAK)

### 2. **Updated PDF Generator** (`src/utils/suratKeteranganGenerator.ts`)
- **Async Function**: `generateSuratKeteranganPDF()` sekarang async
- **Dynamic Cost Loading**: Mengambil biaya real-time dari database
- **Error Handling**: Graceful fallback jika terjadi error
- **Currency Formatting**: Format mata uang Indonesia yang konsisten

### 3. **Database Schema**
- **Tabel**: `costs` dengan field lengkap
- **Fields**: `rowNumber`, `sequence`, `name`, `category`, `amount`, `lembaga`
- **Default Data**: 19 item biaya pendidikan lengkap

## 📊 Logika Penentuan Biaya

### **Uang Pangkal Berdasarkan Lembaga:**

| Lembaga | Status | Non-Asrama | Asrama | Alumni |
|---------|--------|------------|--------|--------|
| **TK** | Baru | Rp 4.200.000 | - | - |
| | Daftar Ulang | Rp 1.900.000 | - | - |
| **SDITA** | Baru | Rp 9.100.000 | - | - |
| **SMPITA** | Baru | Rp 9.800.000 | Rp 12.800.000 | - |
| **SMAITA** | Baru | Rp 9.800.000 | Rp 12.800.000 | - |
| | Alumni SMP → SMA | Rp 5.200.000 | Rp 5.200.000 - Rp 8.200.000 | ✅ |
| **MTA** | Baru | Rp 9.700.000 | - | - |
| | Alumni SMP → SMA | - | Rp 3.950.000 - Rp 6.950.000 | ✅ |

### **Logika Alumni & Asrama:**

#### **SMAITA Alumni (dari SMP At-Tauhid):**
- **Alumni SMP Non-Asrama → SMA Asrama**: Rp 8.200.000
- **Alumni SMP Asrama → SMA Asrama**: Rp 5.200.000
- **Alumni SMP → SMA Non-Asrama**: Rp 5.200.000

#### **MTA Alumni (jenjang SMP → SMA):**
- **Alumni MTA SMP Non-Asrama → MTA Asrama**: Rp 6.950.000
- **Alumni MTA SMP Asrama → MTA Asrama**: Rp 3.950.000
- **Alumni MTA SMP → MTA SMA Asrama**: Rp 3.950.000

#### **Deteksi Status Alumni:**
- **SMAITA**: Alumni jika `student.data.alumni === 'YA'` + lembaga = 'SMAITA'
- **MTA**: Alumni jika `student.data.alumni === 'YA'` + lembaga = 'MTA'
- **Asrama Sebelumnya**: Dideteksi dari `student.catatanPenguji` (ASRAMA/NON ASRAMA)

### **SPP Berdasarkan Status:**

| Status | Jumlah |
|--------|--------|
| Asrama | Rp 1.300.000/bulan |
| Non-Asrama | Rp 450.000/bulan |

## 🔄 Cara Kerja Sinkronisasi

1. **Admin Update Biaya**: Admin mengubah biaya melalui menu "💰 Manajemen Biaya"
2. **Database Update**: Perubahan tersimpan di tabel `costs`
3. **PDF Generation**: Saat download surat keterangan, sistem mengambil biaya terbaru
4. **Real-time Sync**: Surat keterangan selalu menampilkan biaya yang akurat

## 📋 Keunggulan Sistem

### ✅ **Dynamic Pricing**
- Biaya dapat diubah kapan saja tanpa redeploy aplikasi
- Perubahan langsung terlihat di surat keterangan

### ✅ **Institution-Specific**
- Biaya berbeda untuk setiap lembaga (TK, SD, SMP, SMA, MTA)
- Penanganan khusus untuk alumni MTA

### ✅ **Dormitory-Aware**
- Biaya berbeda untuk siswa asrama vs non-asrama
- Otomatis mendeteksi dari data siswa

### ✅ **Error Resilient**
- Fallback ke nilai default jika database error
- Logging error untuk debugging

### ✅ **Admin Control**
- Full CRUD operations untuk biaya
- Import/Export Excel untuk bulk operations
- Audit trail dengan createdBy timestamps

## 🚀 Deployment Steps

### 1. **Database Setup**
```sql
-- Jalankan setup-costs.sql untuk membuat tabel
-- Atau migrate-costs-table.sql jika tabel sudah ada
```

### 2. **Deploy Application**
```bash
npm run build
npm run deploy
```

### 3. **Test Integration**
1. Login sebagai Admin
2. Akses menu "💰 Manajemen Biaya"
3. Update biaya jika diperlukan
4. Download surat keterangan siswa
5. Verifikasi biaya di PDF sesuai dengan database

## 📈 Monitoring & Maintenance

### **Admin dapat:**
- ✅ Melihat semua biaya dalam tabel dengan nomor baris
- ✅ Edit biaya dengan modal form
- ✅ Tambah biaya baru
- ✅ Hapus biaya dengan konfirmasi
- ✅ Filter berdasarkan lembaga/kategori
- ✅ Import biaya dari Excel
- ✅ Export biaya ke Excel

### **Sistem akan:**
- ✅ Selalu menggunakan biaya terbaru dari database
- ✅ Fallback ke default jika database unavailable
- ✅ Format mata uang yang konsisten
- ✅ Handle error dengan graceful degradation

## 🔧 Technical Details

### **API Integration**
```typescript
// Mengambil biaya siswa secara real-time
const studentCosts = await getStudentCosts(student);

// Format mata uang Indonesia
const formattedAmount = formatCurrency(amount);
```

### **Database Query**
```sql
SELECT * FROM costs
WHERE lembaga LIKE '%{studentLembaga}%'
AND category ILIKE '%uang pangkal%'
ORDER BY sequence ASC;
```

### **Error Handling**
```typescript
try {
  const costs = await fetchFromDatabase();
  return processCosts(costs);
} catch (error) {
  console.error('Database error:', error);
  return getFallbackCosts(student);
}
```

## 🎯 Benefits

1. **Operational Efficiency**: Admin dapat update biaya tanpa developer intervention
2. **Accuracy**: Surat keterangan selalu menampilkan biaya yang benar
3. **Flexibility**: Mendukung berbagai skenario biaya (alumni, asrama, dll)
4. **Reliability**: Fallback system memastikan aplikasi tetap berfungsi
5. **Maintainability**: Kode terstruktur dan mudah di-maintain

Sistem sinkronisasi ini memastikan bahwa surat keterangan lulus selalu akurat dan up-to-date dengan kebijakan biaya pendidikan terbaru! 🎓💰