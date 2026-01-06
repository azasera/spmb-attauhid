# 🧪 Testing Guide - Auto Backup Feature

## Pre-requisites

1. ✅ Supabase project sudah setup
2. ✅ Storage bucket `backups` sudah dibuat (atau akan auto-create)
3. ✅ User dengan role ADMIN sudah ada
4. ✅ Ada data students untuk di-backup

## Test Scenarios

### 1. Test Auto Backup Initialization

**Steps:**
1. Login sebagai ADMIN
2. Buka browser console (F12)
3. Cek localStorage: `localStorage.getItem('last_auto_backup')`
4. Tunggu beberapa detik
5. Cek apakah backup pertama dibuat

**Expected Result:**
- ✅ `last_auto_backup` key ada di localStorage
- ✅ Backup file muncul di Supabase Storage
- ✅ Tidak ada error di console

### 2. Test Manual Backup

**Steps:**
1. Login sebagai ADMIN
2. Buka menu "Manajemen User"
3. Klik "Backup Data"
4. Klik "Buat Backup Manual"
5. Tunggu notifikasi sukses
6. Cek daftar backup

**Expected Result:**
- ✅ Toast notification "Backup berhasil dibuat"
- ✅ Backup baru muncul di list dengan type "Manual"
- ✅ Filename format: `backup_manual_[timestamp].json`

### 3. Test Export to JSON

**Steps:**
1. Buka Backup Screen
2. Klik "Export ke JSON"
3. Cek folder Downloads

**Expected Result:**
- ✅ File JSON terdownload
- ✅ Filename format: `spmb_backup_[timestamp].json`
- ✅ File bisa dibuka dan valid JSON
- ✅ Struktur data lengkap (students, users, rubric_guides, app_settings)

### 4. Test Download Backup

**Steps:**
1. Pilih backup dari list
2. Klik icon Download
3. Cek folder Downloads

**Expected Result:**
- ✅ File JSON terdownload
- ✅ Filename sesuai dengan backup yang dipilih
- ✅ File valid dan bisa dibuka

### 5. Test Import from JSON

**Steps:**
1. Buat backup manual terlebih dahulu (safety)
2. Klik "Choose File" di section Import
3. Pilih file backup JSON
4. Klik "Import Data"
5. Konfirmasi dialog
6. Tunggu proses selesai

**Expected Result:**
- ✅ Konfirmasi dialog muncul
- ✅ Toast "Data berhasil di-import"
- ✅ Aplikasi reload otomatis
- ✅ Data ter-restore sesuai backup
- ✅ Backup safety dibuat: `backup_manual_system_before_import_[timestamp].json`

### 6. Test Restore from Cloud Backup

**Steps:**
1. Buat beberapa data test
2. Buat backup manual
3. Ubah/hapus beberapa data
4. Pilih backup yang dibuat sebelumnya
5. Klik icon Restore
6. Konfirmasi dialog
7. Tunggu proses selesai

**Expected Result:**
- ✅ Konfirmasi dialog muncul
- ✅ Toast "Data berhasil di-restore"
- ✅ Aplikasi reload otomatis
- ✅ Data kembali seperti saat backup dibuat
- ✅ Backup safety dibuat: `backup_manual_system_before_restore_[timestamp].json`

### 7. Test Delete Backup

**Steps:**
1. Pilih backup yang ingin dihapus
2. Klik icon Hapus (Trash)
3. Konfirmasi dialog
4. Tunggu proses selesai

**Expected Result:**
- ✅ Konfirmasi dialog muncul
- ✅ Toast "Backup berhasil dihapus"
- ✅ Backup hilang dari list
- ✅ File terhapus dari Supabase Storage

### 8. Test Backup List & Refresh

**Steps:**
1. Buka Backup Screen
2. Cek list backup
3. Klik tombol "Refresh"
4. Cek apakah list ter-update

**Expected Result:**
- ✅ List menampilkan semua backup
- ✅ Info lengkap: filename, timestamp, size, type
- ✅ Refresh button berfungsi
- ✅ Loading indicator muncul saat refresh

### 9. Test Auto Backup Interval

**Steps:**
1. Login sebagai ADMIN
2. Cek `localStorage.getItem('last_auto_backup')`
3. Hapus key tersebut: `localStorage.removeItem('last_auto_backup')`
4. Reload aplikasi
5. Tunggu beberapa detik
6. Cek apakah backup baru dibuat

**Expected Result:**
- ✅ Backup baru dibuat otomatis
- ✅ `last_auto_backup` key ter-set lagi
- ✅ Type backup: "Auto"

### 10. Test Error Handling

**Test 10.1: Invalid JSON Import**
1. Buat file .json dengan konten invalid
2. Coba import file tersebut
3. Expected: Error message "Invalid backup file format"

**Test 10.2: Wrong File Type**
1. Pilih file non-JSON (e.g., .txt, .pdf)
2. Expected: Error message "Pilih file JSON yang valid"

**Test 10.3: Network Error**
1. Disconnect internet
2. Coba buat backup
3. Expected: Error message dengan detail error

**Test 10.4: Storage Full**
1. Upload banyak backup hingga mendekati limit
2. Coba buat backup baru
3. Expected: Error message tentang storage limit

## Validation Checklist

### Data Integrity
- [ ] Students data lengkap setelah restore
- [ ] Rubric guides tidak hilang
- [ ] App settings tetap sama
- [ ] Tidak ada data corrupt

### Security
- [ ] Users data tidak di-restore
- [ ] Backup hanya bisa diakses ADMIN
- [ ] File backup private (tidak public)
- [ ] Konfirmasi sebelum restore/import

### Performance
- [ ] Auto backup tidak freeze UI
- [ ] Manual backup selesai < 10 detik
- [ ] Export/Import smooth tanpa lag
- [ ] List backup load cepat

### UI/UX
- [ ] Toast notification jelas
- [ ] Loading indicator muncul
- [ ] Error message informatif
- [ ] Konfirmasi dialog user-friendly

## Browser Testing

Test di berbagai browser:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (jika ada Mac)

## Mobile Testing

Test di mobile browser:
- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Responsive layout OK

## Supabase Storage Verification

### Via Dashboard
1. Buka Supabase Dashboard
2. Klik Storage
3. Pilih bucket `backups`
4. Cek file backup ada

### Via SQL
```sql
SELECT 
  name,
  created_at,
  metadata->>'size' as size_bytes
FROM storage.objects
WHERE bucket_id = 'backups'
ORDER BY created_at DESC;
```

## Cleanup After Testing

```sql
-- Delete all test backups
DELETE FROM storage.objects
WHERE bucket_id = 'backups'
AND name LIKE 'backup_manual_%';

-- Or via Dashboard: Storage → backups → Select All → Delete
```

## Common Issues & Solutions

### Issue: Backup tidak muncul di list
**Solution:**
- Cek Supabase Storage policies
- Verify bucket `backups` exists
- Check browser console for errors

### Issue: Auto backup tidak jalan
**Solution:**
- Clear localStorage
- Reload aplikasi
- Check `last_auto_backup` key

### Issue: Import/Restore gagal
**Solution:**
- Verify JSON format valid
- Check Supabase connection
- Ensure sufficient permissions

### Issue: File size too large
**Solution:**
- Increase bucket file size limit
- Compress backup data
- Delete old unnecessary data

## Performance Benchmarks

Expected performance:
- Manual backup: < 5 seconds
- Export JSON: < 3 seconds
- Import JSON: < 10 seconds
- Restore: < 15 seconds
- List backups: < 2 seconds

## Test Report Template

```
Date: [Date]
Tester: [Name]
Environment: [Production/Staging]

Test Results:
✅ Auto Backup: PASS
✅ Manual Backup: PASS
✅ Export JSON: PASS
✅ Import JSON: PASS
✅ Restore: PASS
✅ Delete: PASS
✅ List/Refresh: PASS
✅ Error Handling: PASS

Issues Found:
- [Issue 1]
- [Issue 2]

Notes:
[Additional notes]
```

## Automated Testing (Future)

Untuk automated testing, bisa menggunakan:
- Jest untuk unit tests
- Cypress untuk E2E tests
- Playwright untuk browser testing

Example test case:
```typescript
describe('Backup Service', () => {
  it('should create manual backup', async () => {
    const result = await backupService.createBackup('manual', 'test-user');
    expect(result.success).toBe(true);
    expect(result.filename).toMatch(/backup_manual_/);
  });
});
```

---

**Happy Testing! 🎉**
