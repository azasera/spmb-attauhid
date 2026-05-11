-- Setup Costs Table for SPMB At Tauhid
-- Run this SQL in your Supabase SQL Editor to create the costs table

-- Create costs table for expense management
CREATE TABLE IF NOT EXISTS costs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  description TEXT,
  lembaga TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "createdBy" TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_costs_category ON costs(category);
CREATE INDEX IF NOT EXISTS idx_costs_lembaga ON costs(lembaga);
CREATE INDEX IF NOT EXISTS idx_costs_createdAt ON costs("createdAt");

-- Enable Row Level Security (RLS)
ALTER TABLE costs ENABLE ROW LEVEL SECURITY;

-- Create policies for costs table (allow all operations for now)
DROP POLICY IF EXISTS "Allow all operations on costs" ON costs;
CREATE POLICY "Allow all operations on costs" ON costs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON costs TO anon, authenticated;

-- Insert sample data (optional)
-- Uncomment the following lines to add sample cost data
/*
INSERT INTO costs (id, name, category, amount, description, lembaga, "createdBy") VALUES
  ('cost-001', 'Snack Peserta MI', 'Konsumsi', 250000, 'Snack untuk 50 peserta MI', 'MI', 'admin'),
  ('cost-002', 'Transport Penguji', 'Transport', 150000, 'Transportasi untuk 3 penguji', NULL, 'admin'),
  ('cost-003', 'ATK Panitia', 'ATK', 75000, 'Alat tulis kantor untuk panitia', NULL, 'admin'),
  ('cost-004', 'Sewa Gedung', 'Sewa', 500000, 'Sewa gedung untuk kegiatan SPMB', NULL, 'admin');
*/