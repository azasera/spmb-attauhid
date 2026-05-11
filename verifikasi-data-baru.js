// Script untuk memverifikasi data database sesuai dengan BiayaPendidikanTable.tsx
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eknvmtigbjzjwclfcwlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnZtdGlnYmp6andjbGZjd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NzU1NzgsImV4cCI6MjA4MzE1MTU3OH0.kj3sAMIHa8IC3LCGIKIe9l2rQzC224Zef11DmstQzFc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Data yang seharusnya ada (dari BiayaPendidikanTable.tsx)
const expectedData = [
  // PENDAFTARAN
  { name: 'Pendaftaran Calon Siswa/i TK', amount: 100000, category: 'Pendaftaran Calon Siswa Baru', lembaga: 'TK' },
  { name: 'Pendaftaran Calon Siswa/i SD, SMP, SMA & MTA', amount: 300000, category: 'Pendaftaran Calon Siswa Baru', lembaga: 'SD/SMP/SMA/MTA' },
  
  // SPP
  { name: 'SPP siswa/i TK', amount: 350000, category: 'SPP', lembaga: 'TK' },
  { name: 'SPP siswa/i SD, SMP, SMA & MTA Non Asrama', amount: 2700000, category: 'SPP', lembaga: 'SD/SMP/SMA/MTA' },
  { name: 'Angsuran SPP Non Asrama / bulan', amount: 450000, category: 'SPP', lembaga: 'SD/SMP/SMA/MTA' },
  { name: 'SPP siswa/i Asrama SMP, SMA & MTA', amount: 7800000, category: 'SPP', lembaga: 'SMP/SMA/MTA' },
  { name: 'Angsuran SPP Asrama / bulan', amount: 1300000, category: 'SPP', lembaga: 'SMP/SMA/MTA' },
  
  // UANG PANGKAL NON ASRAMA
  { name: 'Uang Pangkal Siswa/i TK', amount: 4200000, category: 'Uang Pangkal Siswa Non Asrama', lembaga: 'TK' },
  { name: 'Daftar ulang TK-A ke TK-B', amount: 1900000, category: 'Uang Pangkal Siswa Non Asrama', lembaga: 'TK' },
  { name: 'Uang Pangkal Siswa/i SD', amount: 9100000, category: 'Uang Pangkal Siswa Non Asrama', lembaga: 'SD' },
  { name: 'Uang Pangkal Siswa/i Non Asrama SMP', amount: 9800000, category: 'Uang Pangkal Siswa Non Asrama', lembaga: 'SMP' },
  { name: 'Uang Pangkal Siswa/i Non Asrama SMA', amount: 9800000, category: 'Uang Pangkal Siswa Non Asrama', lembaga: 'SMA' },
  { name: 'Uang Pangkal Siswa Non Asrama MTA', amount: 6700000, category: 'Uang Pangkal Siswa Non Asrama', lembaga: 'MTA' },
  
  // UANG PANGKAL ASRAMA
  { name: 'Uang Pangkal Siswa Asrama SMP', amount: 12800000, category: 'Uang Pangkal Siswa Asrama', lembaga: 'SMP' },
  { name: 'Uang Pangkal Siswa Asrama SMA', amount: 12800000, category: 'Uang Pangkal Siswa Asrama', lembaga: 'SMA' },
  { name: 'Uang Pangkal Siswa Asrama MTA', amount: 9700000, category: 'Uang Pangkal Siswa Asrama', lembaga: 'MTA' },
  
  // ALUMNI SMP AT-TAUHID
  { name: 'Non Asrama → SMA Asrama', amount: 8200000, category: 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid', lembaga: 'SMP/SMA' },
  { name: 'Asrama → SMA Asrama', amount: 5200000, category: 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid', lembaga: 'SMP/SMA' },
  { name: 'Non Asrama / Asrama → SMA Non Asrama', amount: 5200000, category: 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid', lembaga: 'SMP/SMA' },
  
  // ALUMNI MTA
  { name: 'Non Asrama → MTA SMA Asrama', amount: 6950000, category: 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA', lembaga: 'MTA' },
  { name: 'Asrama → MTA SMA Asrama', amount: 3950000, category: 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA', lembaga: 'MTA' },
  { name: 'Asrama / Non Asrama → MTA SMA Non Asrama', amount: 3950000, category: 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA', lembaga: 'MTA' }
];

async function verifikasiDataBaru() {
  console.log('🔍 Verifikasi Data Database vs BiayaPendidikanTable.tsx\n');

  try {
    // Ambil semua data biaya dari database
    const { data: costs, error } = await supabase
      .from('costs')
      .select('*')
      .order('sequence', { ascending: true });

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`📊 Total Data di Database: ${costs.length} item`);
    console.log(`📋 Total Expected: ${expectedData.length} item\n`);

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
      console.log('\n🎉 VERIFIKASI SEMPURNA! Data database sesuai dengan BiayaPendidikanTable.tsx');
    } else {
      console.log('\n⚠️ MASIH ADA PERBEDAAN!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifikasiDataBaru();
