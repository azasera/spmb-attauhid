-- Migration script to add rowNumber and sequence fields to existing costs table
-- Run this SQL in your Supabase SQL Editor if you have an existing costs table

-- Add new columns if they don't exist
ALTER TABLE costs ADD COLUMN IF NOT EXISTS "rowNumber" TEXT;
ALTER TABLE costs ADD COLUMN IF NOT EXISTS sequence REAL;

-- Update existing records with default row numbers based on creation order
-- This will assign sequential numbers to existing records
UPDATE costs SET
  "rowNumber" = CASE
    WHEN id = 'cost-001' THEN '1'
    WHEN id = 'cost-002' THEN '2'
    WHEN id = 'cost-003' THEN '3'
    WHEN id = 'cost-004' THEN '4'
    WHEN id = 'cost-004a' THEN '4a'
    WHEN id = 'cost-005' THEN '5'
    WHEN id = 'cost-005a' THEN '5a'
    WHEN id = 'cost-006' THEN '6'
    WHEN id = 'cost-006a' THEN '6a'
    WHEN id = 'cost-007' THEN '7'
    WHEN id = 'cost-008' THEN '8'
    WHEN id = 'cost-009' THEN '9'
    WHEN id = 'cost-010' THEN '10'
    WHEN id = 'cost-011' THEN '11'
    WHEN id = 'cost-012' THEN '12'
    WHEN id = 'cost-013' THEN '13'
    WHEN id = 'cost-014' THEN '14'
    WHEN id = 'cost-015' THEN '15'
    WHEN id = 'cost-016' THEN '16'
    WHEN id = 'cost-017' THEN '17'
    WHEN id = 'cost-018' THEN '18'
    WHEN id = 'cost-019' THEN '19'
    ELSE CAST(ROW_NUMBER() OVER (ORDER BY "createdAt") AS TEXT)
  END,
  sequence = CASE
    WHEN id = 'cost-001' THEN 1
    WHEN id = 'cost-002' THEN 2
    WHEN id = 'cost-003' THEN 3
    WHEN id = 'cost-004' THEN 4
    WHEN id = 'cost-004a' THEN 4.1
    WHEN id = 'cost-005' THEN 5
    WHEN id = 'cost-005a' THEN 5.1
    WHEN id = 'cost-006' THEN 6
    WHEN id = 'cost-006a' THEN 6.1
    WHEN id = 'cost-007' THEN 7
    WHEN id = 'cost-008' THEN 8
    WHEN id = 'cost-009' THEN 9
    WHEN id = 'cost-010' THEN 10
    WHEN id = 'cost-011' THEN 11
    WHEN id = 'cost-012' THEN 12
    WHEN id = 'cost-013' THEN 13
    WHEN id = 'cost-014' THEN 14
    WHEN id = 'cost-015' THEN 15
    WHEN id = 'cost-016' THEN 16
    WHEN id = 'cost-017' THEN 17
    WHEN id = 'cost-018' THEN 18
    WHEN id = 'cost-019' THEN 19
    ELSE ROW_NUMBER() OVER (ORDER BY "createdAt")
  END
WHERE "rowNumber" IS NULL OR sequence IS NULL;