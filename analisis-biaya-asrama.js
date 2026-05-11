// Script untuk menganalisis tujuan biaya asrama vs non asrama
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eknvmtigbjzjwclfcwlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnZtdGlnYmp6andjbGZjd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NzU1NzgsImV4cCI6MjA4MzE1MTU3OH0.kj3sAMIHa8IC3LCGIKIe9l2rQzC224Zef11DmstQzFc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function analisisBiayaAsrama() {
  console.log('🎯 Analisis Tujuan Biaya Asrama vs Non Asrama\n');

  try {
    const { data: costs, error } = await supabase
      .from('costs')
      .select('*')
      .order('sequence', { ascending: true });

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    // Group berdasarkan lembaga dan tipe asrama
    const lembagaGroups = {};
    costs.forEach(cost => {
      if (!lembagaGroups[cost.lembaga]) {
        lembagaGroups[cost.lembaga] = [];
      }
      lembagaGroups[cost.lembaga].push(cost);
    });

    console.log('📊 Perbandingan Biaya Asrama vs Non Asrama:\n');

    // Analisis per lembaga
    Object.entries(lembagaGroups).forEach(([lembaga, items]) => {
      if (lembaga === 'TK') {
        console.log(`🏫 ${lembaga} (Taman Kanak-Kanak):`);
        console.log('   - Hanya ada tipe Non Asrama (TK tidak ada asrama)');
        const uangPangkal = items.find(item => item.category.includes('Uang Pangkal'));
        if (uangPangkal) {
          console.log(`   - Uang Pangkal: Rp ${uangPangkal.amount.toLocaleString('id-ID')}`);
        }
        const spp = items.find(item => item.category === 'SPP');
        if (spp) {
          console.log(`   - SPP Bulanan: Rp ${spp.amount.toLocaleString('id-ID')}`);
        }
        console.log('');
      } else if (lembaga === 'SD') {
        console.log(`🏫 ${lembaga} (Sekolah Dasar):`);
        console.log('   - Hanya ada tipe Non Asrama (SD tidak ada asrama)');
        const uangPangkal = items.find(item => item.category.includes('Uang Pangkal'));
        if (uangPangkal) {
          console.log(`   - Uang Pangkal: Rp ${uangPangkal.amount.toLocaleString('id-ID')}`);
        }
        console.log('');
      } else if (lembaga === 'SMP' || lembaga === 'SMA' || lembaga === 'SMP/SMA') {
        console.log(`🏫 ${lembaga} (Sekolah Menengah):`);
        
        // Cari biaya non asrama
        const nonAsrama = items.find(item => 
          item.category.includes('Uang Pangkal') && 
          item.name.includes('Non Asrama')
        );
        
        // Cari biaya asrama
        const asrama = items.find(item => 
          item.category.includes('Uang Pangkal') && 
          item.name.includes('Asrama') && 
          !item.name.includes('Non Asrama')
        );
        
        if (nonAsrama) {
          console.log(`   - Non Asrama: Rp ${nonAsrama.amount.toLocaleString('id-ID')}`);
        }
        if (asrama) {
          console.log(`   - Asrama: Rp ${asrama.amount.toLocaleString('id-ID')}`);
          
          if (nonAsrama) {
            const selisih = asrama.amount - nonAsrama.amount;
            const persentase = ((selisih / nonAsrama.amount) * 100).toFixed(1);
            console.log(`   - 💰 Tambahan biaya asrama: Rp ${selisih.toLocaleString('id-ID')} (+${persentase}%)`);
          }
        }
        console.log('');
      } else if (lembaga === 'MTA') {
        console.log(`🏫 ${lembaga} (Madrasah Tsanawiyah Ali):`);
        
        // Cari biaya non asrama
        const nonAsrama = items.find(item => 
          item.category.includes('Uang Pangkal') && 
          item.name.includes('Non Asrama')
        );
        
        // Cari biaya asrama
        const asrama = items.find(item => 
          item.category.includes('Uang Pangkal') && 
          item.name.includes('Asrama') && 
          !item.name.includes('Non Asrama')
        );
        
        if (nonAsrama) {
          console.log(`   - Non Asrama: Rp ${nonAsrama.amount.toLocaleString('id-ID')}`);
        }
        if (asrama) {
          console.log(`   - Asrama: Rp ${asrama.amount.toLocaleString('id-ID')}`);
          
          if (nonAsrama) {
            const selisih = asrama.amount - nonAsrama.amount;
            const persentase = ((selisih / nonAsrama.amount) * 100).toFixed(1);
            console.log(`   - 💰 Tambahan biaya asrama: Rp ${selisih.toLocaleString('id-ID')} (+${persentase}%)`);
          }
        }
        console.log('');
      } else if (lembaga === 'SD/SMP/SMA/MTA') {
        console.log(`🏫 ${lembaga} (Kombinasi):`);
        
        // SPP untuk non asrama
        const sppNonAsrama = items.find(item => 
          item.category === 'SPP' && 
          item.name.includes('Non Asrama')
        );
        
        // SPP untuk asrama
        const sppAsrama = items.find(item => 
          item.category === 'SPP' && 
          item.name.includes('Asrama') && 
          !item.name.includes('Non Asrama')
        );
        
        if (sppNonAsrama) {
          console.log(`   - SPP Non Asrama/semester: Rp ${sppNonAsrama.amount.toLocaleString('id-ID')}`);
        }
        if (sppAsrama) {
          console.log(`   - SPP Asrama/semester: Rp ${sppAsrama.amount.toLocaleString('id-ID')}`);
          
          if (sppNonAsrama) {
            const selisihSemester = sppAsrama.amount - sppNonAsrama.amount;
            const persentaseSemester = ((selisihSemester / sppNonAsrama.amount) * 100).toFixed(1);
            console.log(`   - 💰 Tambahan SPP asrama/semester: Rp ${selisihSemester.toLocaleString('id-ID')} (+${persentaseSemester}%)`);
          }
        }
        
        // Angsuran bulanan
        const angsuranNonAsrama = items.find(item => 
          item.category === 'SPP' && 
          item.name.includes('non asrama perbulan')
        );
        
        const angsuranAsrama = items.find(item => 
          item.category === 'SPP' && 
          item.name.includes('asrama perbulan')
        );
        
        if (angsuranNonAsrama) {
          console.log(`   - Angsuran Non Asrama/bulan: Rp ${angsuranNonAsrama.amount.toLocaleString('id-ID')}`);
        }
        if (angsuranAsrama) {
          console.log(`   - Angsuran Asrama/bulan: Rp ${angsuranAsrama.amount.toLocaleString('id-ID')}`);
          
          if (angsuranNonAsrama) {
            const selisihBulanan = angsuranAsrama.amount - angsuranNonAsrama.amount;
            const persentaseBulanan = ((selisihBulanan / angsuranNonAsrama.amount) * 100).toFixed(1);
            console.log(`   - 💰 Tambahan angsuran asrama/bulan: Rp ${selisihBulanan.toLocaleString('id-ID')} (+${persentaseBulanan}%)`);
          }
        }
        console.log('');
      }
    });

    // Analisis alumni
    console.log('🎓 Analisis Biaya Alumni:\n');
    
    const alumniItems = costs.filter(item => 
      item.category.includes('Alumni')
    );
    
    console.log(`Total ${alumniItems.length} item biaya alumni:\n`);
    
    alumniItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}`);
      console.log(`   - Rp ${item.amount.toLocaleString('id-ID')}`);
      console.log(`   - ${item.lembaga}`);
      
      // Analisis tujuan dari nama
      if (item.name.includes('Non Asrama ke SMA Asrama')) {
        console.log('   📌 Tujuan: Alumni non asrama yang melanjut ke asrama SMA');
      } else if (item.name.includes('Asrama ke SMA Asrama')) {
        console.log('   📌 Tujuan: Alumni asrama yang melanjut ke asrama SMA (diskon)');
      } else if (item.name.includes('ke SMA Non Asrama')) {
        console.log('   📌 Tujuan: Alumni yang melanjut ke non asrama SMA');
      } else if (item.name.includes('MTA Jenjang SMP')) {
        console.log('   📌 Tujuan: Alumni MTA SMP yang melanjut ke MTA SMA');
      }
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

analisisBiayaAsrama();
