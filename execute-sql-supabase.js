// Script untuk menjalankan SQL di Supabase menggunakan REST API
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eknvmtigbjzjwclfcwlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnZtdGlnYmp6andjbGZjd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NzU1NzgsImV4cCI6MjA4MzE1MTU3OH0.kj3sAMIHa8IC3LCGIKIe9l2rQzC224Zef11DmstQzFc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SQL script yang akan dijalankan
const sqlScript = `
-- Create costs table for expense management
CREATE TABLE IF NOT EXISTS costs (
  id TEXT PRIMARY KEY,
  rowNumber TEXT,
  sequence NUMERIC,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  description TEXT,
  lembaga TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "createdBy" TEXT NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_costs_category ON costs(category);
CREATE INDEX IF NOT EXISTS idx_costs_lembaga ON costs(lembaga);
CREATE INDEX IF NOT EXISTS idx_costs_createdAt ON costs("createdAt");

-- Enable RLS
ALTER TABLE costs ENABLE ROW LEVEL SECURITY;

-- Create policy
DROP POLICY IF EXISTS "Allow all operations on costs" ON costs;
CREATE POLICY "Allow all operations on costs" ON costs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON costs TO anon, authenticated;
`;

async function executeSQL() {
  console.log('🔄 Menjalankan SQL untuk membuat tabel costs...\n');

  try {
    // Coba menggunakan endpoint REST langsung
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify({ sql: sqlScript })
    });

    if (!response.ok) {
      console.log('❌ Error menjalankan SQL via RPC');
      console.log('📝 Harap jalankan SQL manual di Supabase SQL Editor');
      console.log('\n🔗 Link: https://supabase.com/dashboard/project/eknvmtigbjzjwclfcwlh/sql');
      console.log('\n📋 SQL yang perlu dijalankan:');
      console.log(sqlScript);
      return false;
    }

    const result = await response.json();
    console.log('✅ SQL berhasil dijalankan');
    return true;

  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\n📝 Harap jalankan SQL manual di Supabase SQL Editor');
    console.log('\n🔗 Link: https://supabase.com/dashboard/project/eknvmtigbjzjwclfcwlh/sql');
    console.log('\n📋 SQL yang perlu dijalankan:');
    console.log(sqlScript);
    return false;
  }
}

async function checkTableExists() {
  console.log('\n🔍 Memeriksa apakah tabel costs sudah ada...');
  
  try {
    const { data, error } = await supabase
      .from('costs')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Tabel costs belum ada:', error.message);
      return false;
    } else {
      console.log('✅ Tabel costs sudah ada');
      return true;
    }
  } catch (error) {
    console.log('❌ Error checking table:', error);
    return false;
  }
}

async function main() {
  const tableExists = await checkTableExists();
  
  if (!tableExists) {
    console.log('📝 Instruksi lengkap:');
    console.log('1. Buka: https://supabase.com/dashboard/project/eknvmtigbjzjwclfcwlh/sql');
    console.log('2. Copy seluruh SQL dari file: create-costs-table-complete.sql');
    console.log('3. Paste di SQL Editor dan klik "Run"');
    console.log('4. Setelah selesai, jalankan: node setup-biaya-data.js');
  } else {
    console.log('✅ Tabel costs sudah ada, siap untuk mengisi data');
    console.log('📝 Jalankan: node setup-biaya-data.js');
  }
}

main();
