-- Test script to verify cost synchronization with graduation certificates
-- Run this in Supabase SQL Editor to check if costs are properly loaded

-- Check if costs table exists and has data
SELECT COUNT(*) as total_costs FROM costs;

-- Check cost distribution by category
SELECT category, COUNT(*) as count, lembaga
FROM costs
GROUP BY category, lembaga
ORDER BY category, lembaga;

-- Check specific costs for different institutions
SELECT name, category, amount, lembaga
FROM costs
WHERE lembaga LIKE '%MTA%'
ORDER BY sequence;

-- Check asrama vs non-asrama costs
SELECT name, category, amount, lembaga
FROM costs
WHERE name ILIKE '%asrama%'
ORDER BY sequence;

-- Verify row numbers and sequences are correct
SELECT rowNumber, sequence, name, category, amount
FROM costs
ORDER BY sequence
LIMIT 10;

-- Test specific alumni scenarios
-- SMA Alumni SMP Non-Asrama ke SMA Asrama: should be 8.200.000
SELECT name, amount FROM costs WHERE name ILIKE '%alumni%' AND name ILIKE '%smp%' AND name ILIKE '%non asrama%' AND name ILIKE '%sma%' AND name ILIKE '%asrama%';

-- SMA Alumni SMP Asrama ke SMA Asrama: should be 5.200.000
SELECT name, amount FROM costs WHERE name ILIKE '%alumni%' AND name ILIKE '%smp%' AND name ILIKE '%asrama%' AND name ILIKE '%sma%' AND NOT name ILIKE '%non asrama%';

-- MTA Alumni SMP Non-Asrama ke MTA Asrama: should be 6.950.000
SELECT name, amount FROM costs WHERE name ILIKE '%alumni%' AND name ILIKE '%mta%' AND name ILIKE '%non asrama%' AND name ILIKE '%asrama%';

-- MTA Alumni SMP Asrama ke MTA Asrama: should be 3.950.000
SELECT name, amount FROM costs WHERE name ILIKE '%alumni%' AND name ILIKE '%mta%' AND name ILIKE '%asrama%' AND NOT name ILIKE '%non asrama%';