// Script untuk memeriksa redaksi biaya spesifik
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eknvmtigbjzjwclfcwlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnZtdGlnYmp6andjbGZjd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NzU1NzgsImV4cCI6MjA4MzE1MTU3OH0.kj3sAMIHa8IC3LCGIKIe9l2rQzC224Zef11DmstQzFc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSpecificBiayaRedaction() {
  console.log('🔍 Memeriksa redaksi biaya spesifik...\n');

  const targetName = 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Asrama/Non Asrama ke MTA Jenjang SMA Asrama';
  const targetDescription = 'Uang pangkal alumni MTA SMP ke MTA SMA asrama';

  try {
    const { data: costs, error } = await supabase
      .from('costs')
      .select('*')
      .eq('name', targetName);

    if (error) {
      console.error('❌ Error mengambil data biaya:', error);
      return;
    }

    if (costs.length === 0) {
      console.log(`⚠️ Tidak ditemukan biaya dengan nama: "${targetName}"`);
      console.log('\n🔍 Mencari biaya dengan kata kunci "MTA Jenjang SMA Asrama"...');
      
      // Cari dengan kata kunci
      const { data: searchResults, error: searchError } = await supabase
        .from('costs')
        .select('*')
        .ilike('name', '%MTA Jenjang SMA Asrama%');

      if (searchError) {
        console.error('❌ Error searching:', searchError);
        return;
      }

      console.log(`\n📋 Ditemukan ${searchResults.length} item terkait:`);
      searchResults.forEach((cost, index) => {
        console.log(`\n--- Item ${index + 1} ---`);
        console.log(`   Nama Biaya: ${cost.name}`);
        console.log(`   Deskripsi: ${cost.description}`);
        console.log(`   Kategori: ${cost.category}`);
        console.log(`   Lembaga: ${cost.lembaga}`);
        console.log(`   Jumlah: Rp ${cost.amount.toLocaleString('id-ID')}`);
        
        // Bandingkan dengan target
        const nameMatch = cost.name === targetName;
        const descMatch = cost.description === targetDescription;
        
        console.log(`   ✅ Nama Sesuai: ${nameMatch ? 'YA' : 'TIDAK'}`);
        console.log(`   ✅ Deskripsi Sesuai: ${descMatch ? 'YA' : 'TIDAK'}`);
      });
      
      return;
    }

    console.log(`✅ Ditemukan ${costs.length} item biaya dengan nama: "${targetName}"\n`);

    costs.forEach((cost, index) => {
      console.log(`--- Item ${index + 1} ---`);
      console.log(`   Nama Biaya: ${cost.name}`);
      console.log(`   Deskripsi: ${cost.description}`);
      console.log(`   Kategori: ${cost.category}`);
      console.log(`   Lembaga: ${cost.lembaga}`);
      console.log(`   Jumlah: Rp ${cost.amount.toLocaleString('id-ID')}`);
      console.log(`   Dibuat Oleh: ${cost.createdBy}`);
      console.log(`   Tanggal Dibuat: ${new Date(cost.createdAt).toLocaleDateString('id-ID')}`);
      
      if (cost.description === targetDescription) {
        console.log('   Status Deskripsi: ✅ Sesuai');
      } else {
        console.log(`   Status Deskripsi: ❌ Tidak Sesuai (Ditemukan: "${cost.description}")`);
      }
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkSpecificBiayaRedaction();
