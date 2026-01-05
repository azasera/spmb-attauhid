
import { createClient } from '@supabase/supabase-js';

// KONFIGURASI PROYEK BARU (ACTIVE)
const supabaseUrl = 'https://eknvmtigbjzjwclfcwlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnZtdGlnYmp6andjbGZjd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NzU1NzgsImV4cCI6MjA4MzE1MTU3OH0.kj3sAMIHa8IC3LCGIKIe9l2rQzC224Zef11DmstQzFc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const TABLES = {
  USERS: 'users',
  STUDENTS: 'students',
  RUBRIC_GUIDES: 'rubric_guides'
} as const;
