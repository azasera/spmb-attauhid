// Script untuk memverifikasi status database Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eknvmtigbjzjwclfcwlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnZtdGlnYmp6andjbGZjd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NzU1NzgsImV4cCI6MjA4MzE1MTU3OH0.kj3sAMIHa8IC3LCGIKIe9l2rQzC224Zef11DmstQzFc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabaseStatus() {
  console.log('🔍 Memeriksa status database...\n');
  
  const tables = [
    { name: 'users', description: 'Tabel pengguna sistem' },
    { name: 'students', description: 'Tabel data calon murid' },
    { name: 'rubric_guides', description: 'Tabel panduan penilaian' },
    { name: 'costs', description: 'Tabel manajemen biaya' },
    { name: 'app_settings', description: 'Tabel pengaturan aplikasi' }
  ];

  for (const table of tables) {
    try {
      console.log(`📋 Memeriksa tabel: ${table.name}`);
      
      // Cek apakah tabel ada dengan menghitung row
      const { count, error } = await supabase
        .from(table.name)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ ${table.name}: ERROR - ${error.message}`);
        console.log(`   Deskripsi: ${table.description}\n`);
      } else {
        console.log(`✅ ${table.name}: ADA (${count} baris)`);
        console.log(`   Deskripsi: ${table.description}\n`);
      }
    } catch (err) {
      console.log(`❌ ${table.name}: EXCEPTION - ${err.message}`);
      console.log(`   Deskripsi: ${table.description}\n`);
    }
  }

  // Cek data awal
  console.log('📊 Memeriksa data awal...\n');
  
  try {
    // Cek user admin
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'ADMIN')
      .single();

    if (adminError) {
      console.log('❌ User admin: Tidak ditemukan');
    } else {
      console.log(`✅ User admin: ${adminUser.username} (${adminUser.name})`);
    }
  } catch (err) {
    console.log('❌ User admin: Error checking');
  }

  try {
    // Cek rubric guides
    const { data: guides, error: guidesError } = await supabase
      .from('rubric_guides')
      .select('*');

    if (guidesError) {
      console.log('❌ Rubric guides: Tidak ditemukan');
    } else {
      console.log(`✅ Rubric guides: ${guides.length} item`);
      guides.forEach(guide => {
        console.log(`   - ${guide.variant}: ${guide.content.substring(0, 50)}...`);
      });
    }
  } catch (err) {
    console.log('❌ Rubric guides: Error checking');
  }

  try {
    // Cek app settings
    const { data: settings, error: settingsError } = await supabase
      .from('app_settings')
      .select('*');

    if (settingsError) {
      console.log('❌ App settings: Tidak ditemukan');
    } else {
      console.log(`✅ App settings: ${settings.length} item`);
      settings.forEach(setting => {
        console.log(`   - ${setting.key}: ${setting.value}`);
      });
    }
  } catch (err) {
    console.log('❌ App settings: Error checking');
  }

  console.log('\n🎉 Verifikasi selesai!');
}

checkDatabaseStatus().catch(console.error);
