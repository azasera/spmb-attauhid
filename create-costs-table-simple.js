// Script untuk membuat tabel costs menggunakan REST API Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eknvmtigbjzjwclfcwlh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnZtdGlnYmp6andjbGZjd2xoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzU3NTU3OCwiZXhwIjoyMDgzMTUxNTc4fQ.K4t9rT3oC7vK_8JXfDnJqQhGqWkxQJ8XfDnJqQhGqWkxQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createCostsTable() {
  console.log('🔨 Membuat tabel costs...\n');

  try {
    // Coba membuat tabel dengan service role key
    const { error } = await supabase
      .from('costs')
      .select('*')
      .limit(1);

    if (error && error.code === 'PGRST116') {
      // Table tidak ada, coba buat dengan SQL
      console.log('📝 Tabel costs tidak ada. Harap buat manual di Supabase SQL Editor:\n');
      console.log('-- Salin dan jalankan SQL berikut di Supabase SQL Editor --');
      console.log(`
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
      `);
    } else if (!error) {
      console.log('✅ Tabel costs sudah ada');
      return true;
    } else {
      console.log('❌ Error:', error);
      return false;
    }

  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }

  return false;
}

async function insertSampleData() {
  console.log('\n📝 Menginsert sample data untuk testing...');
  
  try {
    const sampleData = {
      id: 'cost-test-001',
      rowNumber: '1',
      sequence: 1,
      category: 'Test Category',
      name: 'Test Biaya',
      amount: 100000,
      lembaga: 'Test',
      description: 'Test description',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin'
    };

    const { data, error } = await supabase
      .from('costs')
      .insert([sampleData])
      .select();

    if (error) {
      console.log('❌ Error insert sample:', error);
      return false;
    } else {
      console.log('✅ Sample data berhasil diinsert');
      console.log('🗑️ Menghapus sample data...');
      
      await supabase
        .from('costs')
        .delete()
        .eq('id', 'cost-test-001');
        
      return true;
    }

  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

async function main() {
  const tableExists = await createCostsTable();
  
  if (tableExists) {
    const canInsert = await insertSampleData();
    
    if (canInsert) {
      console.log('\n🎉 Tabel costs siap digunakan!');
      console.log('📝 Sekarang jalankan: node setup-biaya-data.js');
    }
  }
}

main();
