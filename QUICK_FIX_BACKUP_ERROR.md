# 🚑 Quick Fix: Backup Error

## Error yang Muncul
```
StorageApiError: Bucket not found
Failed to load resource: 400
```

## ✅ Solusi Cepat (2 Menit)

### Opsi 1: Buat Bucket di Supabase (Recommended)

1. Buka: https://supabase.com/dashboard
2. Pilih project Anda
3. Klik **Storage** → **New bucket**
4. Nama: `backups`
5. Public: **OFF**
6. Klik **Create**

✅ **Done!** Refresh halaman, error hilang.

### Opsi 2: Disable Auto Backup (Temporary)

Jika tidak mau setup storage sekarang, edit file ini:

**File:** `src/App.tsx`

Cari baris ini (sekitar baris 30-35):

```typescript
useEffect(() => {
  backupService.initialize();
}, []);
```

Comment out (tambahkan `//`):

```typescript
// useEffect(() => {
//   backupService.initialize();
// }, []);
```

Save file, error akan hilang.

⚠️ **Catatan:** Auto backup tidak akan jalan, tapi manual backup masih bisa.

## 🎯 Rekomendasi

**Untuk Production:** Gunakan Opsi 1 (buat bucket)  
**Untuk Development:** Opsi 2 juga OK

## Penjelasan

Error ini **tidak berbahaya**, hanya warning bahwa:
- Bucket storage belum dibuat
- Auto backup tidak bisa jalan
- Aplikasi tetap berfungsi normal

Fitur backup adalah **opsional** untuk keamanan data.

---

**Fix Time:** 2 menit  
**Impact:** Low (tidak mempengaruhi fungsi utama)
