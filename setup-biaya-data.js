// Script untuk mengisi data biaya ke database Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eknvmtigbjzjwclfcwlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnZtdGlnYmp6andjbGZjd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NzU1NzgsImV4cCI6MjA4MzE1MTU3OH0.kj3sAMIHa8IC3LCGIKIe9l2rQzC224Zef11DmstQzFc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Data biaya lengkap sesuai gambar
const biayaData = [
  // PENDAFTARAN CALON SISWA BARU
  {
    id: 'cost-001',
    rowNumber: '1',
    sequence: 1,
    category: 'Pendaftaran Calon Siswa Baru',
    name: 'Pendaftaran Calon Siswa/i TK',
    amount: 100000,
    lembaga: 'TK',
    description: 'Biaya pendaftaran untuk calon siswa Taman Kanak-Kanak'
  },
  {
    id: 'cost-002',
    rowNumber: '2',
    sequence: 2,
    category: 'Pendaftaran Calon Siswa Baru',
    name: 'Pendaftaran Calon Siswa/i SD, SMP, SMA & MTA',
    amount: 300000,
    lembaga: 'SD/SMP/SMA/MTA',
    description: 'Biaya pendaftaran untuk calon siswa SD, SMP, SMA, dan MTA'
  },

  // SPP
  {
    id: 'cost-003',
    rowNumber: '3',
    sequence: 3,
    category: 'SPP',
    name: 'SPP siswa/i TK',
    amount: 350000,
    lembaga: 'TK',
    description: 'SPP bulanan siswa Taman Kanak-Kanak'
  },
  {
    id: 'cost-004',
    rowNumber: '4',
    sequence: 4,
    category: 'SPP',
    name: 'SPP siswa/i SD dan siswa/i SMP, SMA & MTA Non Asrama per semester',
    amount: 2700000,
    lembaga: 'SD/SMP/SMA/MTA',
    description: 'SPP semesteran untuk siswa non asrama SD, SMP, SMA, dan MTA'
  },
  {
    id: 'cost-004a',
    rowNumber: '4a',
    sequence: 4.1,
    category: 'SPP',
    name: 'Angsuran SPP siswa/i non asrama perbulan',
    amount: 450000,
    lembaga: 'SD/SMP/SMA/MTA',
    description: 'Angsuran bulanan SPP untuk siswa non asrama'
  },
  {
    id: 'cost-005',
    rowNumber: '5',
    sequence: 5,
    category: 'SPP',
    name: 'SPP Siswa Asrama SMP, SMA & MTA per semester',
    amount: 7800000,
    lembaga: 'SMP/SMA/MTA',
    description: 'SPP semesteran untuk siswa asrama SMP, SMA, dan MTA'
  },
  {
    id: 'cost-005a',
    rowNumber: '5a',
    sequence: 5.1,
    category: 'SPP',
    name: 'Angsuran SPP siswa/i asrama perbulan',
    amount: 1300000,
    lembaga: 'SMP/SMA/MTA',
    description: 'Angsuran bulanan SPP untuk siswa asrama'
  },

  // UANG PANGKAL SISWA NON ASRAMA
  {
    id: 'cost-006',
    rowNumber: '6',
    sequence: 6,
    category: 'Uang Pangkal Siswa Non Asrama',
    name: 'Uang Pangkal Siswa/i TK',
    amount: 4200000,
    lembaga: 'TK',
    description: 'Uang pangkal untuk siswa Taman Kanak-Kanak non asrama'
  },
  {
    id: 'cost-006a',
    rowNumber: '6a',
    sequence: 6.1,
    category: 'Uang Pangkal Siswa Non Asrama',
    name: 'Daftar ulang bagi siswa TK jenjang TK-A ke jenjang TK-B',
    amount: 1900000,
    lembaga: 'TK',
    description: 'Biaya daftar ulang untuk siswa TK dari TK-A ke TK-B'
  },
  {
    id: 'cost-007',
    rowNumber: '7',
    sequence: 7,
    category: 'Uang Pangkal Siswa Non Asrama',
    name: 'Uang Pangkal Siswa/i SD',
    amount: 9100000,
    lembaga: 'SD',
    description: 'Uang pangkal untuk siswa SD non asrama'
  },
  {
    id: 'cost-008',
    rowNumber: '8',
    sequence: 8,
    category: 'Uang Pangkal Siswa Non Asrama',
    name: 'Uang Pangkal Siswa/i Non Asrama SMP',
    amount: 9800000,
    lembaga: 'SMP',
    description: 'Uang pangkal untuk siswa SMP non asrama'
  },
  {
    id: 'cost-009',
    rowNumber: '9',
    sequence: 9,
    category: 'Uang Pangkal Siswa Non Asrama',
    name: 'Uang Pangkal Siswa/i Non Asrama SMA',
    amount: 9800000,
    lembaga: 'SMA',
    description: 'Uang pangkal untuk siswa SMA non asrama'
  },
  {
    id: 'cost-010',
    rowNumber: '10',
    sequence: 10,
    category: 'Uang Pangkal Siswa Non Asrama',
    name: 'Uang Pangkal Siswa/i Non Asrama MTA',
    amount: 9700000,
    lembaga: 'MTA',
    description: 'Uang pangkal untuk siswa MTA non asrama'
  },

  // UANG PANGKAL SISWA ASRAMA
  {
    id: 'cost-011',
    rowNumber: '11',
    sequence: 11,
    category: 'Uang Pangkal Siswa Asrama',
    name: 'Uang Pangkal Siswa Asrama SMP',
    amount: 12800000,
    lembaga: 'SMP',
    description: 'Uang pangkal untuk siswa SMP asrama'
  },
  {
    id: 'cost-012',
    rowNumber: '12',
    sequence: 12,
    category: 'Uang Pangkal Siswa Asrama',
    name: 'Uang Pangkal Siswa Asrama SMA',
    amount: 12800000,
    lembaga: 'SMA',
    description: 'Uang pangkal untuk siswa SMA asrama'
  },
  {
    id: 'cost-013',
    rowNumber: '13',
    sequence: 13,
    category: 'Uang Pangkal Siswa Asrama',
    name: 'Uang Pangkal Siswa Asrama MTA',
    amount: 12800000,
    lembaga: 'MTA',
    description: 'Uang pangkal untuk siswa MTA asrama'
  },

  // UANG PANGKAL ALUMNI SMP AT-TAUHID KE SMA AT-TAUHID
  {
    id: 'cost-014',
    rowNumber: '14',
    sequence: 14,
    category: 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid',
    name: 'Uang Pangkal Alumni Siswa SMP Non Asrama ke SMA Asrama',
    amount: 8200000,
    lembaga: 'SMP/SMA',
    description: 'Uang pangkal alumni SMP non asrama ke SMA asrama'
  },
  {
    id: 'cost-015',
    rowNumber: '15',
    sequence: 15,
    category: 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid',
    name: 'Uang Pangkal Alumni Siswa SMP Asrama ke SMA Asrama',
    amount: 5200000,
    lembaga: 'SMP/SMA',
    description: 'Uang pangkal alumni SMP asrama ke SMA asrama'
  },
  {
    id: 'cost-016',
    rowNumber: '16',
    sequence: 16,
    category: 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid',
    name: 'Uang Pangkal Alumni Siswa Non Asrama/Asrama ke SMA Non Asrama',
    amount: 5200000,
    lembaga: 'SMP/SMA',
    description: 'Uang pangkal alumni SMP ke SMA non asrama'
  },

  // UANG PANGKAL ALUMNI MTA TINGKAT SMP KE MTA TINGKAT SMA
  {
    id: 'cost-017',
    rowNumber: '17',
    sequence: 17,
    category: 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA',
    name: 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Non Asrama ke MTA Asrama',
    amount: 6950000,
    lembaga: 'MTA',
    description: 'Uang pangkal alumni MTA SMP non asrama ke MTA SMA asrama'
  },
  {
    id: 'cost-018',
    rowNumber: '18',
    sequence: 18,
    category: 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA',
    name: 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Asrama ke MTA Asrama',
    amount: 3950000,
    lembaga: 'MTA',
    description: 'Uang pangkal alumni MTA SMP asrama ke MTA SMA asrama'
  },
  {
    id: 'cost-019',
    rowNumber: '19',
    sequence: 19,
    category: 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA',
    name: 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Asrama/Non Asrama ke MTA Jenjang SMA Asrama',
    amount: 3950000,
    lembaga: 'MTA',
    description: 'Uang pangkal alumni MTA SMP ke MTA SMA asrama'
  }
];

async function setupBiayaData() {
  console.log('🔄 Setup data biaya SPMB At Tauhid...\n');

  try {
    // Hapus data biaya yang ada
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

    // Insert data biaya baru
    console.log('\n📝 Menginsert data biaya baru...');
    
    const formattedData = biayaData.map(item => ({
      ...item,
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
    console.log('\n📊 Summary Data Biaya:');
    
    // Group by category
    const categorySummary = {};
    data.forEach(item => {
      if (!categorySummary[item.category]) {
        categorySummary[item.category] = {
          count: 0,
          total: 0
        };
      }
      categorySummary[item.category].count++;
      categorySummary[item.category].total += item.amount;
    });

    Object.entries(categorySummary).forEach(([category, summary]) => {
      console.log(`📋 ${category}:`);
      console.log(`   - Jumlah item: ${summary.count}`);
      console.log(`   - Total: Rp ${summary.total.toLocaleString('id-ID')}`);
    });

    // Grand total
    const grandTotal = data.reduce((sum, item) => sum + item.amount, 0);
    console.log('\n💰 Grand Total Semua Biaya:');
    console.log(`   - Total item: ${data.length}`);
    console.log(`   - Grand total: Rp ${grandTotal.toLocaleString('id-ID')}`);

    console.log('\n🎉 Setup data biaya selesai!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

setupBiayaData();
