// Script untuk memeriksa detail data biaya di database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eknvmtigbjzjwclfcwlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnZtdGlnYmp6andjbGZjd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NzU1NzgsImV4cCI6MjA4MzE1MTU3OH0.kj3sAMIHa8IC3LCGIKIe9l2rQzC224Zef11DmstQzFc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkBiayaDetails() {
  console.log('🔍 Memeriksa detail data biaya...\n');

  try {
    // Ambil semua data biaya
    const { data: costs, error } = await supabase
      .from('costs')
      .select('*')
      .order('sequence', { ascending: true });

    if (error) {
      console.error('❌ Error mengambil data biaya:', error);
      return;
    }

    console.log(`📊 Total data biaya: ${costs.length} item\n`);

    // Group by category
    const categoryGroups = {};
    costs.forEach(cost => {
      if (!categoryGroups[cost.category]) {
        categoryGroups[cost.category] = [];
      }
      categoryGroups[cost.category].push(cost);
    });

    // Tampilkan per kategori
    Object.entries(categoryGroups).forEach(([category, items]) => {
      console.log(`📋 ${category}:`);
      console.log(`   Jumlah: ${items.length} item`);
      
      items.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name}`);
        console.log(`      - No: ${item.rowNumber || '-'}`);
        console.log(`      - Lembaga: ${item.lembaga || 'Umum'}`);
        console.log(`      - Jumlah: Rp ${item.amount.toLocaleString('id-ID')}`);
        console.log(`      - Dibuat: ${new Date(item.createdAt).toLocaleDateString('id-ID')}`);
        if (item.description) {
          console.log(`      - Deskripsi: ${item.description}`);
        }
        console.log('');
      });
    });

    // Hitung total
    const totalAmount = costs.reduce((sum, cost) => sum + cost.amount, 0);
    console.log(`💰 Grand Total: Rp ${totalAmount.toLocaleString('id-ID')}`);

    // Cek duplikasi
    const duplicates = {};
    costs.forEach(cost => {
      const key = `${cost.name}-${cost.lembaga}`;
      if (duplicates[key]) {
        duplicates[key].push(cost);
      } else {
        duplicates[key] = [cost];
      }
    });

    const duplicateItems = Object.entries(duplicates).filter(([key, items]) => items.length > 1);
    if (duplicateItems.length > 0) {
      console.log('\n⚠️ Data duplikat ditemukan:');
      duplicateItems.forEach(([key, items]) => {
        console.log(`   - ${key}: ${items.length} item`);
      });
    } else {
      console.log('\n✅ Tidak ada data duplikat');
    }

    // Cek data yang mungkin kosong
    const emptyFields = [];
    costs.forEach(cost => {
      if (!cost.name || cost.name.trim() === '') {
        emptyFields.push(`ID ${cost.id}: Nama kosong`);
      }
      if (!cost.category || cost.category.trim() === '') {
        emptyFields.push(`ID ${cost.id}: Kategori kosong`);
      }
      if (!cost.amount || cost.amount <= 0) {
        emptyFields.push(`ID ${cost.id}: Jumlah tidak valid`);
      }
    });

    if (emptyFields.length > 0) {
      console.log('\n⚠️ Data yang bermasalah:');
      emptyFields.forEach(field => console.log(`   - ${field}`));
    } else {
      console.log('\n✅ Semua data lengkap dan valid');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkBiayaDetails();
