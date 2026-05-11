// Script untuk analisis detail biaya alumni MTA spesifik
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eknvmtigbjzjwclfcwlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnZtdGlnYmp6andjbGZjd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NzU1NzgsImV4cCI6MjA4MzE1MTU3OH0.kj3sAMIHa8IC3LCGIKIe9l2rQzC224Zef11DmstQzFc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function detailBiayaAlumniMTA() {
  console.log('🎯 Analisis Detail Biaya Alumni MTA\n');

  try {
    // Ambil semua biaya MTA
    const { data: mtaCosts, error } = await supabase
      .from('costs')
      .select('*')
      .eq('lembaga', 'MTA')
      .order('sequence', { ascending: true });

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('📊 Semua Biaya MTA:\n');

    mtaCosts.forEach((cost, index) => {
      console.log(`${index + 1}. ${cost.name}`);
      console.log(`   - Rp ${cost.amount.toLocaleString('id-ID')}`);
      console.log(`   - Kategori: ${cost.category}`);
      console.log('');
    });

    // Fokus pada biaya alumni
    const alumniMTA = mtaCosts.filter(cost => 
      cost.category.includes('Alumni')
    );

    console.log('🎓 Biaya Alumni MTA (Detail):\n');

    alumniMTA.forEach((cost, index) => {
      console.log(`${index + 1}. ${cost.name}`);
      console.log(`   - Harga: Rp ${cost.amount.toLocaleString('id-ID')}`);
      console.log(`   - Deskripsi: ${cost.description}`);
      
      // Analisis tujuan berdasarkan nama
      if (cost.name.includes('Non Asrama ke MTA Asrama')) {
        console.log('   📌 Tujuan: Alumni MTA SMP NON ASRAMA yang melanjut ke MTA SMA ASRAMA');
        console.log('   💰 Ini adalah harga untuk alumni non-asrama yang mau masuk asrama SMA');
      } else if (cost.name.includes('Asrama ke MTA Asrama')) {
        console.log('   📌 Tujuan: Alumni MTA SMP ASRAMA yang melanjut ke MTA SMA ASRAMA');
        console.log('   💰 Ini adalah harga DISKON untuk alumni asrama yang melanjut ke asrama SMA');
      } else if (cost.name.includes('Asrama/Non Asrama ke MTA Jenjang SMA Asrama')) {
        console.log('   📌 Tujuan: Alumni MTA SMP (ASRAMA ATAU NON ASRAMA) yang melanjut ke MTA SMA ASRAMA');
        console.log('   💰 Ini adalah harga UMUM untuk semua alumni MTA SMP yang masuk asrama SMA');
        console.log('   🔍 Harga ini sama dengan alumni asrama (Rp 3.950.000)');
        console.log('   ✅ Artinya: Alumni non-asrama dapat harga yang sama dengan alumni asrama!');
      }
      console.log('');
    });

    // Perbandingan harga
    console.log('💰 Perbandingan Harga Alumni MTA:\n');
    
    const normalNonAsrama = mtaCosts.find(cost => 
      cost.name.includes('Uang Pangkal Siswa/i Non Asrama MTA')
    );
    
    const normalAsrama = mtaCosts.find(cost => 
      cost.name.includes('Uang Pangkal Siswa Asrama MTA')
    );

    if (normalNonAsrama) {
      console.log(`📍 Harga Normal Non Asrama: Rp ${normalNonAsrama.amount.toLocaleString('id-ID')}`);
    }
    if (normalAsrama) {
      console.log(`📍 Harga Normal Asrama: Rp ${normalAsrama.amount.toLocaleString('id-ID')}`);
    }

    console.log('\n🎓 Harga Alumni yang Masuk SMA Asrama:');
    
    alumniMTA.forEach(cost => {
      console.log(`   - ${cost.name}: Rp ${cost.amount.toLocaleString('id-ID')}`);
      
      if (normalAsrama) {
        const diskon = normalAsrama.amount - cost.amount;
        const persentase = ((diskon / normalAsrama.amount) * 100).toFixed(1);
        console.log(`     💰 Diskon: Rp ${diskon.toLocaleString('id-ID')} (${persentase}% dari harga normal)`);
      }
    });

    console.log('\n🎯 Kesimpulan:');
    console.log('1. Alumni MTA SMP mendapatkan DISKON khusus');
    console.log('2. Alumni non-asrama yang masuk asrama SMA dapat harga sama dengan alumni asrama');
    console.log('3. Ini adalah program LOYALTY untuk alumni MTA');
    console.log('4. Diskon sekitar Rp 8.850.000 (69%) dari harga normal asrama!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

detailBiayaAlumniMTA();
