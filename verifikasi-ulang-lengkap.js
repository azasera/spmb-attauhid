// Script untuk verifikasi ulang lengkap setelah perbaikan
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eknvmtigbjzjwclfcwlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnZtdGlnYmp6andjbGZjd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NzU1NzgsImV4cCI6MjA4MzE1MTU3OH0.kj3sAMIHa8IC3LCGIKIe9l2rQzC224Zef11DmstQzFc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifikasiUlangLengkap() {
  console.log('🔍 Verifikasi Ulang Lengkap Setelah Perbaikan\n');

  try {
    // Ambil semua data biaya
    const { data: costs, error } = await supabase
      .from('costs')
      .select('*')
      .order('sequence', { ascending: true });

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`📊 Total Data Biaya di Database: ${costs.length} item\n`);

    // Data yang seharusnya ada berdasarkan gambar (dengan harga yang diperbaiki)
    const expectedData = [
      // PENDAFTARAN CALON SISWA BARU
      { rowNumber: '1', name: 'Pendaftaran Calon Siswa/i TK', amount: 100000, category: 'Pendaftaran Calon Siswa Baru' },
      { rowNumber: '2', name: 'Pendaftaran Calon Siswa/i SD, SMP, SMA & MTA', amount: 300000, category: 'Pendaftaran Calon Siswa Baru' },
      
      // SPP
      { rowNumber: '3', name: 'SPP siswa/i TK', amount: 350000, category: 'SPP' },
      { rowNumber: '4', name: 'SPP siswa/i SD dan siswa/i SMP, SMA & MTA Non Asrama per semester', amount: 2700000, category: 'SPP' },
      { rowNumber: '4a', name: 'Angsuran SPP siswa/i non asrama perbulan', amount: 450000, category: 'SPP' },
      { rowNumber: '5', name: 'SPP Siswa Asrama SMP, SMA & MTA per semester', amount: 7800000, category: 'SPP' },
      { rowNumber: '5a', name: 'Angsuran SPP siswa/i asrama perbulan', amount: 1300000, category: 'SPP' },
      
      // UANG PANGKAL SISWA NON ASRAMA
      { rowNumber: '6', name: 'Uang Pangkal Siswa/i TK', amount: 4200000, category: 'Uang Pangkal Siswa Non Asrama' },
      { rowNumber: '6a', name: 'Daftar ulang bagi siswa TK jenjang TK-A ke jenjang TK-B', amount: 1900000, category: 'Uang Pangkal Siswa Non Asrama' },
      { rowNumber: '7', name: 'Uang Pangkal Siswa/i SD', amount: 9100000, category: 'Uang Pangkal Siswa Non Asrama' },
      { rowNumber: '8', name: 'Uang Pangkal Siswa/i Non Asrama SMP', amount: 9800000, category: 'Uang Pangkal Siswa Non Asrama' },
      { rowNumber: '9', name: 'Uang Pangkal Siswa/i Non Asrama SMA', amount: 9800000, category: 'Uang Pangkal Siswa Non Asrama' },
      { rowNumber: '10', name: 'Uang Pangkal Siswa/i Non Asrama MTA', amount: 9700000, category: 'Uang Pangkal Siswa Non Asrama' },
      
      // UANG PANGKAL SISWA ASRAMA
      { rowNumber: '11', name: 'Uang Pangkal Siswa Asrama SMP', amount: 12800000, category: 'Uang Pangkal Siswa Asrama' },
      { rowNumber: '12', name: 'Uang Pangkal Siswa Asrama SMA', amount: 12800000, category: 'Uang Pangkal Siswa Asrama' },
      { rowNumber: '13', name: 'Uang Pangkal Siswa Asrama MTA', amount: 9700000, category: 'Uang Pangkal Siswa Asrama' }, // DIPERBAIKI
      
      // UANG PANGKAL ALUMNI SMP AT-TAUHID KE SMA AT-TAUHID
      { rowNumber: '14', name: 'Uang Pangkal Alumni Siswa SMP Non Asrama ke SMA Asrama', amount: 8200000, category: 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid' },
      { rowNumber: '15', name: 'Uang Pangkal Alumni Siswa SMP Asrama ke SMA Asrama', amount: 5200000, category: 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid' },
      { rowNumber: '16', name: 'Uang Pangkal Alumni Siswa Non Asrama/Asrama ke SMA Non Asrama', amount: 5200000, category: 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid' },
      
      // UANG PANGKAL ALUMNI MTA TINGKAT SMP KE MTA TINGKAT SMA
      { rowNumber: '17', name: 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Non Asrama ke MTA Asrama', amount: 6950000, category: 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA' },
      { rowNumber: '18', name: 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Asrama ke MTA Asrama', amount: 3950000, category: 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA' },
      { rowNumber: '19', name: 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Asrama/Non Asrama ke MTA Jenjang SMA Asrama', amount: 3950000, category: 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA' }
    ];

    console.log('📋 Verifikasi Data Berdasarkan Gambar (Setelah Perbaikan):\n');

    let totalMatched = 0;
    let totalExpected = expectedData.length;
    const discrepancies = [];

    expectedData.forEach((expected, index) => {
      const found = costs.find(cost => 
        cost.name === expected.name && 
        cost.amount === expected.amount &&
        cost.category === expected.category
      );

      if (found) {
        console.log(`✅ ${index + 1}. ${expected.name}`);
        console.log(`   - Harga: Rp ${expected.amount.toLocaleString('id-ID')} ✓`);
        console.log(`   - Kategori: ${expected.category} ✓`);
        totalMatched++;
      } else {
        console.log(`❌ ${index + 1}. ${expected.name}`);
        console.log(`   - Expected: Rp ${expected.amount.toLocaleString('id-ID')} - ${expected.category}`);
        
        // Cari data yang ada di database
        const existing = costs.find(cost => cost.name === expected.name);
        if (existing) {
          console.log(`   - Actual: Rp ${existing.amount.toLocaleString('id-ID')} - ${existing.category} ❌`);
          discrepancies.push({
            index: index + 1,
            name: expected.name,
            expectedAmount: expected.amount,
            actualAmount: existing.amount,
            issue: 'Harga tidak sesuai'
          });
        } else {
          console.log(`   - Actual: Tidak ditemukan ❌`);
          discrepancies.push({
            index: index + 1,
            name: expected.name,
            expectedAmount: expected.amount,
            issue: 'Tidak ditemukan di database'
          });
        }
      }
      console.log('');
    });

    // Summary
    console.log('📊 Summary Verifikasi:\n');
    console.log(`✅ Data Sesuai: ${totalMatched}/${totalExpected} item`);
    console.log(`❌ Data Tidak Sesuai: ${discrepancies.length} item`);

    if (discrepancies.length > 0) {
      console.log('\n❌ Detail Ketidaksesuaian:\n');
      discrepancies.forEach(disc => {
        console.log(`Item ${disc.index}: ${disc.name}`);
        console.log(`   Issue: ${disc.issue}`);
        if (disc.expectedAmount && disc.actualAmount) {
          console.log(`   Expected: Rp ${disc.expectedAmount.toLocaleString('id-ID')}`);
          console.log(`   Actual: Rp ${disc.actualAmount.toLocaleString('id-ID')}`);
        }
        console.log('');
      });
    }

    if (totalMatched === totalExpected) {
      console.log('\n🎉 VERIFIKASI SEMPURNA! Semua data sesuai dengan gambar.');
    } else {
      console.log('\n⚠️ MASIH ADA PERBEDAAN! Perlu diperbaiki.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifikasiUlangLengkap();
