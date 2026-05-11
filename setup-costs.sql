-- Setup Costs Table for SPMB At Tauhid
-- Run this SQL in your Supabase SQL Editor to create the costs table

-- Create costs table for expense management
CREATE TABLE IF NOT EXISTS costs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "rowNumber" TEXT,
  sequence REAL,
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

-- Add missing columns if table already exists
ALTER TABLE costs ADD COLUMN IF NOT EXISTS "rowNumber" TEXT;
ALTER TABLE costs ADD COLUMN IF NOT EXISTS sequence REAL;

-- Insert default education cost data
INSERT INTO costs (id, "rowNumber", sequence, name, category, amount, description, lembaga, "createdBy") VALUES
  ('cost-001', '1', 1, 'Pendaftaran Calon Siswa/i TK', 'Pendaftaran Calon Siswa Baru', 100000, NULL, 'TK', 'admin'),
  ('cost-002', '2', 2, 'Pendaftaran Calon Siswa/i SD, SMP, SMA & MTA', 'Pendaftaran Calon Siswa Baru', 300000, NULL, 'SD/SMP/SMA/MTA', 'admin'),
  ('cost-003', '3', 3, 'SPP siswa/i TK', 'SPP', 350000, NULL, 'TK', 'admin'),
  ('cost-004', '4', 4, 'SPP siswa/i SD dan siswa/i SMP, SMA & MTA Non Asrama per semester', 'SPP', 2700000, NULL, 'SD/SMP/SMA/MTA', 'admin'),
  ('cost-004a', '4a', 4.1, 'Angsuran SPP siswa/i non asrama perbulan', 'SPP', 450000, NULL, 'SD/SMP/SMA/MTA', 'admin'),
  ('cost-005', '5', 5, 'SPP Siswa Asrama SMP, SMA & MTA per semester', 'SPP', 7800000, NULL, 'SMP/SMA/MTA', 'admin'),
  ('cost-005a', '5a', 5.1, 'Angsuran SPP siswa/i asrama perbulan', 'SPP', 1300000, NULL, 'SMP/SMA/MTA', 'admin'),
  ('cost-006', '6', 6, 'Uang Pangkal Siswa/i TK', 'Uang Pangkal Siswa Non Asrama', 4200000, NULL, 'TK', 'admin'),
  ('cost-006a', '6a', 6.1, 'Daftar ulang bagi siswa TK jenjang TK-A ke jenjang TK-B', 'Uang Pangkal Siswa Non Asrama', 1900000, NULL, 'TK', 'admin'),
  ('cost-007', '7', 7, 'Uang Pangkal Siswa/i SD', 'Uang Pangkal Siswa Non Asrama', 9100000, NULL, 'SD', 'admin'),
  ('cost-008', '8', 8, 'Uang Pangkal Siswa/i Non Asrama SMP', 'Uang Pangkal Siswa Non Asrama', 9800000, NULL, 'SMP', 'admin'),
  ('cost-009', '9', 9, 'Uang Pangkal Siswa/i Non Asrama SMA', 'Uang Pangkal Siswa Non Asrama', 9800000, NULL, 'SMA', 'admin'),
  ('cost-010', '10', 10, 'Uang Pangkal Siswa/i Non Asrama MTA', 'Uang Pangkal Siswa Non Asrama', 9700000, NULL, 'MTA', 'admin'),
  ('cost-011', '11', 11, 'Uang Pangkal Siswa Asrama SMP', 'Uang Pangkal Siswa Asrama', 12800000, NULL, 'SMP', 'admin'),
  ('cost-012', '12', 12, 'Uang Pangkal Siswa Asrama SMA', 'Uang Pangkal Siswa Asrama', 12800000, NULL, 'SMA', 'admin'),
  ('cost-013', '13', 13, 'Uang Pangkal Siswa Asrama MTA', 'Uang Pangkal Siswa Asrama', 9700000, NULL, 'MTA', 'admin'),
  ('cost-014', '14', 14, 'Uang Pangkal Alumni Siswa SMP Non Asrama ke SMA Asrama', 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid', 8200000, NULL, 'SMP/SMA', 'admin'),
  ('cost-015', '15', 15, 'Uang Pangkal Alumni Siswa SMP Asrama ke SMA Asrama', 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid', 5200000, NULL, 'SMP/SMA', 'admin'),
  ('cost-016', '16', 16, 'Uang Pangkal Alumni Siswa Non Asrama/Asrama ke SMA Non Asrama', 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid', 5200000, NULL, 'SMP/SMA', 'admin'),
  ('cost-017', '17', 17, 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Non Asrama ke MTA Asrama', 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA', 6950000, NULL, 'MTA', 'admin'),
  ('cost-018', '18', 18, 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Asrama ke MTA Asrama', 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA', 3950000, NULL, 'MTA', 'admin'),
  ('cost-019', '19', 19, 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Asrama/Non Asrama ke MTA Jenjang SMA Asrama', 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA', 3950000, NULL, 'MTA', 'admin')
ON CONFLICT (id) DO NOTHING;