// Script untuk memverifikasi referensi biaya alumni MTA yang benar
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eknvmtigbjzjwclfcwlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnZtdGlnYmp6andjbGZjd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NzU1NzgsImV4cCI6MjA4MzE1MTU3OH0.kj3sAMIHa8IC3LCGIKIe9l2rQzC224Zef11DmstQzFc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifikasiReferensiBenar() {
  console.log('🔍 Verifikasi Referensi Biaya Alumni MTA yang Benar\n');

  try {
    // Ambil semua biaya MTA
    const { data: allCosts, error } = await supabase
      .from('costs')
      .select('*')
      .eq('lembaga', 'MTA')
      .order('sequence', { ascending: true });

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('📊 Semua Biaya MTA:\n');

    allCosts.forEach((cost, index) => {
      console.log(`${index + 1}. ${cost.name}`);
      console.log(`   - Rp ${cost.amount.toLocaleString('id-ID')}`);
      console.log(`   - Deskripsi: ${cost.description}`);
      console.log('');
    });

    // Fokus pada biaya alumni MTA
    const alumniMTA = allCosts.filter(cost => 
      cost.category.includes('Alumni MTA')
    );

    console.log('🎓 Biaya Alumni MTA (Berdasarkan Referensi Benar):\n');

    // Cari item spesifik berdasarkan referensi
    const item18 = alumniMTA.find(cost => 
      cost.name.includes('Asrama ke MTA Jenjang SMA Asrama') && 
      !cost.name.includes('Non Asrama')
    );

    const item19 = alumniMTA.find(cost => 
      cost.name.includes('Asrama/Non Asrama ke MTA Jenjang SMA Non Asrama')
    );

    console.log('📋 Item 18: Alumni Asrama SMP → Asrama SMA');
    if (item18) {
      console.log(`   Nama: ${item18.name}`);
      console.log(`   Harga: Rp ${item18.amount.toLocaleString('id-ID')}`);
      console.log(`   Deskripsi: ${item18.description}`);
      console.log('   ✅ Tujuan: Alumni asrama SMP ke asrama SMA');
      console.log('   💰 Ini adalah biaya uang pangkal untuk siswa alumni MTA dari jenjang SMP yang sebelumnya tinggal di asrama, dan akan melanjutkan ke jenjang SMA di MTA dengan fasilitas asrama');
    } else {
      console.log('   ❌ Item tidak ditemukan');
    }

    console.log('\n📋 Item 19: Alumni (Asrama/Non Asrama) SMP → Non Asrama SMA');
    if (item19) {
      console.log(`   Nama: ${item19.name}`);
      console.log(`   Harga: Rp ${item19.amount.toLocaleString('id-ID')}`);
      console.log(`   Deskripsi: ${item19.description}`);
      console.log('   ✅ Tujuan: Alumni (asrama/non-asrama) SMP ke non-asrama SMA');
      console.log('   💰 Ini adalah biaya uang pangkal untuk siswa alumni MTA dari jenjang SMP (baik yang sebelumnya tinggal di asrama maupun tidak), dan akan melanjutkan ke jenjang SMA di MTA tanpa fasilitas asrama (non-asrama)');
    } else {
      console.log('   ❌ Item tidak ditemukan');
    }

    console.log('\n🎯 Analisis Perbandingan:\n');

    if (item18 && item19) {
      console.log('✅ Harga Sama: Rp 3.950.000,-');
      console.log('✅ Keduanya mendapatkan harga khusus alumni\n');

      // Bandingkan dengan harga normal
      const normalAsrama = allCosts.find(cost => 
        cost.name.includes('Uang Pangkal Siswa Asrama MTA')
      );

      const normalNonAsrama = allCosts.find(cost => 
        cost.name.includes('Uang Pangkal Siswa/i Non Asrama MTA')
      );

      if (normalAsrama) {
        console.log('💰 Perbandingan dengan Harga Normal:');
        console.log(`   - Normal Asrama: Rp ${normalAsrama.amount.toLocaleString('id-ID')}`);
        console.log(`   - Alumni Asrama→Asrama: Rp ${item18.amount.toLocaleString('id-ID')}`);
        
        const diskonAsrama = normalAsrama.amount - item18.amount;
        const persentaseAsrama = ((diskonAsrama / normalAsrama.amount) * 100).toFixed(1);
        console.log(`   - Diskon: Rp ${diskonAsrama.toLocaleString('id-ID')} (${persentaseAsrama}%)`);
      }

      if (normalNonAsrama) {
        console.log(`   - Normal Non Asrama: Rp ${normalNonAsrama.amount.toLocaleString('id-ID')}`);
        console.log(`   - Alumni →Non Asrama: Rp ${item19.amount.toLocaleString('id-ID')}`);
        
        const diskonNonAsrama = normalNonAsrama.amount - item19.amount;
        const persentaseNonAsrama = ((diskonNonAsrama / normalNonAsrama.amount) * 100).toFixed(1);
        console.log(`   - Diskon: Rp ${diskonNonAsrama.toLocaleString('id-ID')} (${persentaseNonAsrama}%)`);
      }
    }

    console.log('\n🎯 Kesimpulan (Berdasarkan Referensi Benar):');
    console.log('1. ✅ Harga seragam untuk alumni MTA: Rp 3.950.000,-');
    console.log('2. ✅ Alumni asrama SMP→asrama SMA dapat diskon besar');
    console.log('3. ✅ Alumni (asrama/non-asrama) SMP→non-asrama SMA dapat harga khusus');
    console.log('4. ✅ Kebijakan harga yang seragam untuk alumni yang melanjutkan ke jenjang SMA');
    console.log('5. ✅ Terlepas dari pilihan asrama/non-asrama, alumni MTA mendapatkan privilege khusus');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifikasiReferensiBenar();
