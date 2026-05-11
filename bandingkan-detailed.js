// Script untuk membandingkan data database dengan gambar secara detail
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eknvmtigbjzjwclfcwlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnZtdGlnYmp6andjbGZjd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NzU1NzgsImV4cCI6MjA4MzE1MTU3OH0.kj3sAMIHa8IC3LCGIKIe9l2rQzC224Zef11DmstQzFc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function bandingkanDetailed() {
  console.log('🔍 Perbandingan Detail Data Database vs Gambar\n');

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

    console.log('📊 Data di Database (Urut berdasarkan sequence):\n');

    costs.forEach((cost, index) => {
      console.log(`${index + 1}. ${cost.name}`);
      console.log(`   - No: ${cost.rowNumber || '-'}`);
      console.log(`   - Sequence: ${cost.sequence || '-'}`);
      console.log(`   - Kategori: ${cost.category}`);
      console.log(`   - Lembaga: ${cost.lembaga || '-'}`);
      console.log(`   - Jumlah: Rp ${cost.amount.toLocaleString('id-ID')}`);
      console.log(`   - Deskripsi: ${cost.description || '-'}`);
      console.log('');
    });

    console.log('📋 Data yang seharusnya ada (Berdasarkan gambar Biaya spmb.jpeg):\n');

    const expectedData = [
      { no: '1', name: 'Pendaftaran Calon Siswa/i TK', category: 'Pendaftaran Calon Siswa Baru', lembaga: 'TK', amount: 100000 },
      { no: '2', name: 'Pendaftaran Calon Siswa/i SD, SMP, SMA & MTA', category: 'Pendaftaran Calon Siswa Baru', lembaga: 'SD/SMP/SMA/MTA', amount: 300000 },
      { no: '3', name: 'SPP siswa/i TK', category: 'SPP', lembaga: 'TK', amount: 350000 },
      { no: '4', name: 'SPP siswa/i SD dan siswa/i SMP, SMA & MTA Non Asrama per semester', category: 'SPP', lembaga: 'SD/SMP/SMA/MTA', amount: 2700000 },
      { no: '4a', name: 'Angsuran SPP siswa/i non asrama perbulan', category: 'SPP', lembaga: 'SD/SMP/SMA/MTA', amount: 450000 },
      { no: '5', name: 'SPP Siswa Asrama SMP, SMA & MTA per semester', category: 'SPP', lembaga: 'SMP/SMA/MTA', amount: 7800000 },
      { no: '5a', name: 'Angsuran SPP siswa/i asrama perbulan', category: 'SPP', lembaga: 'SMP/SMA/MTA', amount: 1300000 },
      { no: '6', name: 'Uang Pangkal Siswa/i TK', category: 'Uang Pangkal Siswa Non Asrama', lembaga: 'TK', amount: 4200000 },
      { no: '6a', name: 'Daftar ulang bagi siswa TK jenjang TK-A ke jenjang TK-B', category: 'Uang Pangkal Siswa Non Asrama', lembaga: 'TK', amount: 1900000 },
      { no: '7', name: 'Uang Pangkal Siswa/i SD', category: 'Uang Pangkal Siswa Non Asrama', lembaga: 'SD', amount: 9100000 },
      { no: '8', name: 'Uang Pangkal Siswa/i Non Asrama SMP', category: 'Uang Pangkal Siswa Non Asrama', lembaga: 'SMP', amount: 9800000 },
      { no: '9', name: 'Uang Pangkal Siswa/i Non Asrama SMA', category: 'Uang Pangkal Siswa Non Asrama', lembaga: 'SMA', amount: 9800000 },
      { no: '10', name: 'Uang Pangkal Siswa/i Non Asrama MTA', category: 'Uang Pangkal Siswa Non Asrama', lembaga: 'MTA', amount: 9700000 },
      { no: '11', name: 'Uang Pangkal Siswa Asrama SMP', category: 'Uang Pangkal Siswa Asrama', lembaga: 'SMP', amount: 12800000 },
      { no: '12', name: 'Uang Pangkal Siswa Asrama SMA', category: 'Uang Pangkal Siswa Asrama', lembaga: 'SMA', amount: 12800000 },
      { no: '13', name: 'Uang Pangkal Siswa Asrama MTA', category: 'Uang Pangkal Siswa Asrama', lembaga: 'MTA', amount: 9700000 },
      { no: '14', name: 'Uang Pangkal Alumni Siswa SMP Non Asrama ke SMA Asrama', category: 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid', lembaga: 'SMP/SMA', amount: 8200000 },
      { no: '15', name: 'Uang Pangkal Alumni Siswa SMP Asrama ke SMA Asrama', category: 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid', lembaga: 'SMP/SMA', amount: 5200000 },
      { no: '16', name: 'Uang Pangkal Alumni Siswa Non Asrama/Asrama ke SMA Non Asrama', category: 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid', lembaga: 'SMP/SMA', amount: 5200000 },
      { no: '17', name: 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Non Asrama ke MTA Asrama', category: 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA', lembaga: 'MTA', amount: 6950000 },
      { no: '18', name: 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Asrama ke MTA Asrama', category: 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA', lembaga: 'MTA', amount: 3950000 },
      { no: '19', name: 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Asrama/Non Asrama ke MTA Jenjang SMA Asrama', category: 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA', lembaga: 'MTA', amount: 3950000 }
    ];

    expectedData.forEach((item, index) => {
      console.log(`${item.no}. ${item.name}`);
      console.log(`   - Kategori: ${item.category}`);
      console.log(`   - Lembaga: ${item.lembaga}`);
      console.log(`   - Jumlah: Rp ${item.amount.toLocaleString('id-ID')}`);
      console.log('');
    });

    console.log('🔍 Perbandingan Item per Item:\n');

    expectedData.forEach((expected, index) => {
      const found = costs.find(cost => cost.name === expected.name);
      
      if (found) {
        const nameMatch = found.name === expected.name;
        const categoryMatch = found.category === expected.category;
        const lembagaMatch = found.lembaga === expected.lembaga;
        const amountMatch = found.amount === expected.amount;
        
        const allMatch = nameMatch && categoryMatch && lembagaMatch && amountMatch;
        
        console.log(`${expected.no}. ${expected.name}`);
        console.log(`   Nama: ${nameMatch ? '✅' : '❌'} ${found.name}`);
        console.log(`   Kategori: ${categoryMatch ? '✅' : '❌'} ${found.category}`);
        console.log(`   Lembaga: ${lembagaMatch ? '✅' : '❌'} ${found.lembaga}`);
        console.log(`   Jumlah: ${amountMatch ? '✅' : '❌'} Rp ${found.amount.toLocaleString('id-ID')} (Expected: Rp ${expected.amount.toLocaleString('id-ID')})`);
        
        if (!allMatch) {
          console.log(`   ❌ TIDAK SESUAI!`);
        } else {
          console.log(`   ✅ SESUAI`);
        }
      } else {
        console.log(`${expected.no}. ${expected.name}`);
        console.log(`   ❌ TIDAK DITEMUKAN DI DATABASE`);
      }
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

bandingkanDetailed();
