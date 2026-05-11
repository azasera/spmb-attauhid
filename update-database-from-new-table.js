// Script untuk update database dengan data dari BiayaPendidikanTable.tsx
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eknvmtigbjzjwclfcwlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnZtdGlnYmp6andjbGZjd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NzU1NzgsImV4cCI6MjA4MzE1MTU3OH0.kj3sAMIHa8IC3LCGIKIe9l2rQzC224Zef11DmstQzFc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Data dari BiayaPendidikanTable.tsx
const newBiayaData = [
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
  { name: 'Uang Pangkal Siswa Non Asrama MTA', amount: 6700000, category: 'Uang Pangkal Siswa Non Asrama', lembaga: 'MTA' }, // PERUBAHAN: 6.700.000
  
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
  { name: 'Asrama / Non Asrama → MTA SMA Non Asrama', amount: 3950000, category: 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA', lembaga: 'MTA' } // PERUBAHAN NAMA
];

async function updateDatabaseFromNewTable() {
  console.log('🔄 Update database dengan data dari BiayaPendidikanTable.tsx\n');

  try {
    // Hapus semua data biaya yang ada
    console.log('🗑️ Menghapus data biaya yang ada...');
    const { error: deleteError } = await supabase
      .from('costs')
      .delete()
      .neq('id', '');

    if (deleteError) {
      console.log('⚠️ Warning menghapus data:', deleteError.message);
    } else {
      console.log('✅ Data biaya lama berhasil dihapus');
    }

    // Insert data baru dengan sequence
    console.log('\n📝 Menginsert data biaya baru...');
    
    const formattedData = newBiayaData.map((item, index) => ({
      id: `cost-${String(index + 1).padStart(3, '0')}`,
      sequence: index + 1,
      name: item.name,
      category: item.category,
      amount: item.amount,
      lembaga: item.lembaga,
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin'
    }));

    const { data, error } = await supabase
      .from('costs')
      .insert(formattedData)
      .select();

    if (error) {
      console.error('❌ Error menginsert data biaya:', error);
      return;
    }

    console.log(`✅ Berhasil menginsert ${data.length} item biaya`);
    
    // Tampilkan summary
    console.log('\n📊 Summary Data Baru:\n');
    
    const categoryGroups = {};
    newBiayaData.forEach(item => {
      if (!categoryGroups[item.category]) {
        categoryGroups[item.category] = [];
      }
      categoryGroups[item.category].push(item);
    });

    Object.entries(categoryGroups).forEach(([category, items]) => {
      console.log(`📋 ${category}:`);
      console.log(`   Jumlah: ${items.length} item`);
      const total = items.reduce((sum, item) => sum + item.amount, 0);
      console.log(`   Total: Rp ${total.toLocaleString('id-ID')}`);
      console.log('');
    });

    const grandTotal = newBiayaData.reduce((sum, item) => sum + item.amount, 0);
    console.log(`💰 Grand Total: Rp ${grandTotal.toLocaleString('id-ID')}`);

    // Highlight perubahan
    console.log('\n🔍 Perubahan Penting:');
    console.log('   - Uang Pangkal Siswa Non Asrama MTA: Rp 6.700.000 (sebelumnya Rp 9.700.000)');
    console.log('   - Nama item alumni MTA terakhir disesuaikan');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateDatabaseFromNewTable();
