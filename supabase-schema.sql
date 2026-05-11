-- SPMB At Tauhid Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('TU', 'PENGUJI', 'ADMIN')),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "createdBy" TEXT
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  "noTes" TEXT UNIQUE NOT NULL,
  lembaga TEXT NOT NULL,
  "lembagaName" TEXT NOT NULL,
  data JSONB NOT NULL,
  "penilaianAnak" JSONB DEFAULT '{}',
  "penilaianOrtu" JSONB DEFAULT '{}',
  -- Kolom penilaian tambahan
  "mathCorrect" INTEGER DEFAULT 0,
  "hafalanBenar" INTEGER DEFAULT 0,
  "nilaiAkhir" INTEGER DEFAULT 0,
  "kelulusan" TEXT CHECK ("kelulusan" IN ('LULUS', 'CADANGAN', 'TIDAK LULUS')),
  status TEXT NOT NULL CHECK (status IN ('BELUM DIUJI', 'SUDAH DIUJI')),
  penguji TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rubric_guides table for editable assessment guides
CREATE TABLE IF NOT EXISTS rubric_guides (
  id TEXT PRIMARY KEY,
  variant TEXT UNIQUE NOT NULL CHECK (variant IN ('anak', 'ortu')),
  content TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedBy" TEXT
);

-- Create costs table for expense management
CREATE TABLE IF NOT EXISTS costs (
  id TEXT PRIMARY KEY,
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

-- Create app_settings table for global application settings
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedBy" TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_students_lembaga ON students(lembaga);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_noTes ON students("noTes");
CREATE INDEX IF NOT EXISTS idx_rubric_guides_variant ON rubric_guides(variant);
CREATE INDEX IF NOT EXISTS idx_costs_category ON costs(category);
CREATE INDEX IF NOT EXISTS idx_costs_lembaga ON costs(lembaga);
CREATE INDEX IF NOT EXISTS idx_costs_createdAt ON costs("createdAt");

-- Insert default admin user
INSERT INTO users (id, name, username, password, role, "createdAt")
VALUES ('admin-001', 'Administrator', 'admin', 'admin123', 'ADMIN', NOW())
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubric_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for users table (allow all operations for now)
DROP POLICY IF EXISTS "Allow all operations on users" ON users;
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policies for students table (allow all operations for now)
DROP POLICY IF EXISTS "Allow all operations on students" ON students;
CREATE POLICY "Allow all operations on students" ON students
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policies for rubric_guides table (allow all operations for now)
DROP POLICY IF EXISTS "Allow all operations on rubric_guides" ON rubric_guides;
CREATE POLICY "Allow all operations on rubric_guides" ON rubric_guides
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policies for costs table (allow all operations for now)
DROP POLICY IF EXISTS "Allow all operations on costs" ON costs;
CREATE POLICY "Allow all operations on costs" ON costs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policies for app_settings table (allow all operations for now)
DROP POLICY IF EXISTS "Allow all operations on app_settings" ON app_settings;
CREATE POLICY "Allow all operations on app_settings" ON app_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON users TO anon, authenticated;
GRANT ALL ON students TO anon, authenticated;
GRANT ALL ON rubric_guides TO anon, authenticated;
GRANT ALL ON costs TO anon, authenticated;
GRANT ALL ON app_settings TO anon, authenticated;

-- Upgrade section: tambahkan kolom baru jika tabel sudah ada
ALTER TABLE students ADD COLUMN IF NOT EXISTS "mathCorrect" INTEGER DEFAULT 0;
ALTER TABLE students ADD COLUMN IF NOT EXISTS "hafalanBenar" INTEGER DEFAULT 0;
ALTER TABLE students ADD COLUMN IF NOT EXISTS "nilaiAkhir" INTEGER DEFAULT 0;
ALTER TABLE students ADD COLUMN IF NOT EXISTS "kelulusan" TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE students ADD COLUMN IF NOT EXISTS "penguji" TEXT;
-- Kolom informasi tambahan
ALTER TABLE students ADD COLUMN IF NOT EXISTS "riwayatPenyakit" TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS "pekerjaanOrangTua" TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS "catatanPenguji" TEXT;
-- Perbarui constraint status untuk mendukung nilai baru (BELUM DIUJI/SUDAH DIUJI)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'students_status_check'
  ) THEN
    ALTER TABLE students DROP CONSTRAINT students_status_check;
  END IF;
  BEGIN
    ALTER TABLE students ADD CONSTRAINT students_status_check CHECK (status IN ('BELUM DIUJI', 'SUDAH DIUJI'));
  EXCEPTION WHEN duplicate_object THEN
    -- constraint already added in another run
    NULL;
  END;
END$$;
-- Tambahkan constraint untuk kelulusan jika belum ada
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'students_kelulusan_check'
  ) THEN
    ALTER TABLE students
      ADD CONSTRAINT students_kelulusan_check CHECK ("kelulusan" IS NULL OR "kelulusan" IN ('LULUS', 'TIDAK LULUS'));
  END IF;
END$$;

-- Pastikan tipe kolom id adalah TEXT (hindari error 400 saat filter eq)
DO $$
DECLARE coltype TEXT;
BEGIN
  SELECT data_type INTO coltype
  FROM information_schema.columns
  WHERE table_name = 'students' AND column_name = 'id' AND table_schema = 'public';

  IF coltype IS DISTINCT FROM 'text' THEN
    ALTER TABLE students ALTER COLUMN id TYPE TEXT USING id::text;
  END IF;
END$$;

-- Seed default rubric guides (idempotent)
INSERT INTO rubric_guides (id, variant, content, "updatedAt", "updatedBy")
VALUES
  ('rubric-anak', 'anak', 'Panduan kustom untuk Calon Siswa. Edit di Admin.', NOW(), 'system'),
  ('rubric-ortu', 'ortu', 'Panduan kustom untuk Orang Tua. Edit di Admin.', NOW(), 'system')
ON CONFLICT (variant) DO NOTHING;

-- Seed default app settings
INSERT INTO app_settings (key, value, description, "updatedAt", "updatedBy")
VALUES
  ('tahun_ajaran', '2627', 'Tahun ajaran aktif untuk generasi nomor tes', NOW(), 'system')
ON CONFLICT (key) DO NOTHING;



