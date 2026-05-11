// Script untuk memperbaiki harga Uang Pangkal Siswa Asrama MTA
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eknvmtigbjzjwclfcwlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnZtdGlnYmp6andjbGZjd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NzU1NzgsImV4cCI6MjA4MzE1MTU3OH0.kj3sAMIHa8IC3LCGIKIe9l2rQzC224Zef11DmstQzFc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixMTAAsramaAmount() {
  console.log('🔧 Memperbaiki harga Uang Pangkal Siswa Asrama MTA...\n');

  try {
    // Cari item yang akan diperbaiki
    const { data: currentData, error: findError } = await supabase
      .from('costs')
      .select('*')
      .eq('name', 'Uang Pangkal Siswa Asrama MTA')
      .single();

    if (findError) {
      console.error('❌ Error mencari data:', findError);
      return;
    }

    console.log('📋 Data saat ini:');
    console.log(`   Nama: ${currentData.name}`);
    console.log(`   Harga saat ini: Rp ${currentData.amount.toLocaleString('id-ID')}`);
    console.log(`   Harga yang benar: Rp 9.700.000`);
    
    if (currentData.amount === 9700000) {
      console.log('\n✅ Data sudah benar! Tidak perlu perbaikan.');
      return;
    }

    console.log('\n🔄 Memperbaiki data...');

    // Update data
    const { data: updatedData, error: updateError } = await supabase
      .from('costs')
      .update({ 
        amount: 9700000,
        updatedAt: new Date().toISOString()
      })
      .eq('id', currentData.id)
      .select();

    if (updateError) {
      console.error('❌ Error memperbaiki data:', updateError);
      return;
    }

    console.log('✅ Data berhasil diperbaiki!');
    console.log(`   Harga baru: Rp ${updatedData[0].amount.toLocaleString('id-ID')}`);

    // Verifikasi semua data biaya asrama
    console.log('\n📊 Verifikasi semua biaya asrama:\n');
    
    const { data: asramaCosts } = await supabase
      .from('costs')
      .select('*')
      .ilike('category', '%Asrama%')
      .order('sequence', { ascending: true });

    asramaCosts.forEach((cost, index) => {
      console.log(`${index + 1}. ${cost.name}`);
      console.log(`   - Rp ${cost.amount.toLocaleString('id-ID')}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixMTAAsramaAmount();
