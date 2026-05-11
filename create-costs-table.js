// Script untuk membuat tabel costs di Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eknvmtigbjzjwclfcwlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnZtdGlnYmp6andjbGZjd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NzU1NzgsImV4cCI6MjA4MzE1MTU3OH0.kj3sAMIHa8IC3LCGIKIe9l2rQzC224Zef11DmstQzFc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createCostsTable() {
  console.log('🔨 Membuat tabel costs...\n');

  try {
    // Jalankan SQL untuk membuat tabel costs
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    if (error) {
      console.error('❌ Error membuat tabel:', error);
      
      // Coba alternatif dengan menggunakan SQL Editor manual
      console.log('\n📝 Harap jalankan SQL berikut di Supabase SQL Editor:');
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
    } else {
      console.log('✅ Tabel costs berhasil dibuat');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createCostsTable();
