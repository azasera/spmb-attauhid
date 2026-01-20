import * as XLSX from 'xlsx';
import { FormData, Student } from '../types';
import { supabase, TABLES } from '../lib/supabase';

export interface ImportRow {
  'Nama Calon Siswa': string;
  'Nama Orang Tua': string;
  'NIK': string;
  'Jenis Kelamin': string;
  'Tempat Lahir': string;
  'Tanggal Lahir': string;
  'No WhatsApp': string;
  'Status Alumni': string;
  'Tanggal Tes': string;
  'Jam Tes': string;
  'Petugas TU': string;
  'Status Asrama': string;
  'Status Kelulusan': string;
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  successCount: number;
  failedCount: number;
  errors: Array<{ row: number; error: string; data?: any }>;
  students?: Student[];
}

export interface ParsedStudent {
  formData: FormData;
  kelulusan?: 'LULUS' | 'CADANGAN' | 'TIDAK LULUS';
  rowNumber: number;
  isValid: boolean;
  errors: string[];
}

// Parse Excel file and return array of student data
export const parseExcelFile = async (file: File): Promise<ParsedStudent[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData: ImportRow[] = XLSX.utils.sheet_to_json(worksheet);

        // Parse and validate each row
        const parsedStudents = jsonData.map((row, index) =>
          parseStudentRow(row, index + 2) // +2 because Excel rows start at 1 and header is row 1
        );

        resolve(parsedStudents);
      } catch (error) {
        reject(new Error('Gagal membaca file Excel: ' + (error as Error).message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca file'));
    };

    reader.readAsBinaryString(file);
  });
};

// Parse and validate a single row
const parseStudentRow = (row: ImportRow, rowNumber: number): ParsedStudent => {
  const errors: string[] = [];

  // Helper to safely convert to string
  const toString = (val: any): string => {
    if (val === null || val === undefined) return '';
    return String(val).trim();
  };

  // ATURAN BARU: Hanya Nama Calon Siswa yang WAJIB
  // Kolom lain boleh kosong, bisa diisi manual nanti via edit
  if (!toString(row['Nama Calon Siswa'])) {
    errors.push('Nama Calon Siswa wajib diisi');
  }

  // Validate format jika diisi (tidak wajib)
  const jenisKelamin = toString(row['Jenis Kelamin']).toUpperCase();
  if (jenisKelamin && !['LAKI-LAKI', 'PEREMPUAN', 'L', 'P', ''].includes(jenisKelamin)) {
    errors.push('Jenis Kelamin harus "Laki-laki" atau "Perempuan" (atau kosongkan)');
  }

  const alumni = toString(row['Status Alumni']).toUpperCase();
  if (alumni && !['YA', 'TIDAK', 'Y', 'T', ''].includes(alumni)) {
    errors.push('Status Alumni harus "Ya" atau "Tidak" (atau kosongkan)');
  }

  // Status Asrama - accept any format, normalizeAsrama will handle it
  const asrama = toString(row['Status Asrama']);
  // No validation needed - normalizeAsrama accepts: "ASRAMA", "NON ASRAMA", "SMA ( ASRAMA )", etc

  // Validate date format only if filled
  const tanggalLahir = toString(row['Tanggal Lahir']);
  const tanggalTes = toString(row['Tanggal Tes']);

  if (tanggalLahir && !isValidDate(tanggalLahir)) {
    errors.push('Format Tanggal Lahir tidak valid (gunakan YYYY-MM-DD atau DD/MM/YYYY)');
  }

  if (tanggalTes && !isValidDate(tanggalTes)) {
    errors.push('Format Tanggal Tes tidak valid (gunakan YYYY-MM-DD atau DD/MM/YYYY)');
  }

  // Normalize phone number
  let kontakOrtu = toString(row['No WhatsApp']);
  kontakOrtu = normalizePhoneNumber(kontakOrtu);

  // Parse status kelulusan (optional)
  const kelulusan = normalizeKelulusan(toString(row['Status Kelulusan']));

  // Create FormData object
  const formData: FormData = {
    namaSiswa: toString(row['Nama Calon Siswa']),
    namaOrangTua: toString(row['Nama Orang Tua']),
    nik: toString(row['NIK']),
    jenisKelamin: normalizeJenisKelamin(jenisKelamin),
    tempatLahir: toString(row['Tempat Lahir']),
    tanggalLahir: normalizeDate(tanggalLahir),
    kontakOrtu,
    alumni: normalizeAlumni(alumni),
    tanggalTes: normalizeDate(tanggalTes),
    jamTes: toString(row['Jam Tes']),
    petugas: toString(row['Petugas TU']),
    asrama: normalizeAsrama(asrama)
  };

  return {
    formData,
    kelulusan,
    rowNumber,
    isValid: errors.length === 0,
    errors
  };
};

// Helper functions for normalization
const normalizeJenisKelamin = (value: string): string => {
  const upper = value?.toUpperCase();
  if (upper === 'L' || upper === 'LAKI-LAKI') return 'Laki-laki';
  if (upper === 'P' || upper === 'PEREMPUAN') return 'Perempuan';
  return value || '';
};

const normalizeAlumni = (value: string): 'YA' | 'TIDAK' => {
  const upper = value?.toUpperCase();
  if (upper === 'Y' || upper === 'YA' || upper === 'YES') return 'YA';
  return 'TIDAK';
};

const normalizeAsrama = (value: string): 'ASRAMA' | 'NON ASRAMA' => {
  if (!value) return 'NON ASRAMA';

  const upper = value.toUpperCase().trim();

  // Remove extra spaces and parentheses
  const cleaned = upper.replace(/\s+/g, ' ').replace(/[()]/g, '');

  // Handle various formats:
  // "SMA ASRAMA" -> "ASRAMA"
  // "SMA NON ASRAMA" -> "NON ASRAMA"
  // "ASRAMA" -> "ASRAMA"
  // "NON ASRAMA" -> "NON ASRAMA"
  // "A" -> "ASRAMA"
  // "N" or "NA" -> "NON ASRAMA"

  if (cleaned.includes('NON ASRAMA') || cleaned.includes('NON-ASRAMA') || cleaned.includes('NONASRAMA')) {
    return 'NON ASRAMA';
  }

  if (cleaned.includes('ASRAMA') || cleaned === 'A') {
    return 'ASRAMA';
  }

  if (cleaned === 'N' || cleaned === 'NA' || cleaned === 'NON') {
    return 'NON ASRAMA';
  }

  // Default to NON ASRAMA for any unrecognized format
  return 'NON ASRAMA';
};

const normalizeKelulusan = (value: string): 'LULUS' | 'CADANGAN' | 'TIDAK LULUS' | undefined => {
  if (!value) return undefined;
  
  const upper = value.toUpperCase().trim();
  
  // Handle various formats
  if (upper === 'LULUS' || upper === 'L' || upper === 'LOLOS') {
    return 'LULUS';
  }
  
  if (upper === 'CADANGAN' || upper === 'C' || upper === 'CAD') {
    return 'CADANGAN';
  }
  
  if (upper === 'TIDAK LULUS' || upper === 'TL' || upper === 'TIDAK' || upper === 'GAGAL') {
    return 'TIDAK LULUS';
  }
  
  // If unrecognized, return undefined (will be treated as not yet tested)
  return undefined;
};
    return 'NON ASRAMA';
  }

  // Default to NON ASRAMA for any unrecognized format
  return 'NON ASRAMA';
};

const normalizePhoneNumber = (phone: string): string => {
  if (!phone) return ''; // Return empty if no phone number

  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  if (!cleaned) return ''; // Return empty if nothing left after cleaning

  // If starts with 0, replace with 62
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }

  // If doesn't start with 62, add it
  if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }

  return cleaned;
};

const normalizeDate = (dateStr: string): string => {
  if (!dateStr) return '';

  const str = String(dateStr).trim();
  console.log('[normalizeDate] Input:', str);

  // Try Excel serial date first (most common from Excel)
  const serialDate = parseFloat(str);
  if (!isNaN(serialDate) && serialDate > 100 && serialDate < 100000) {
    // Excel serial date (days since 1900-01-01)
    // Use UTC throughout to avoid timezone offset issues
    // Excel epoch: December 30, 1899 at 12:00:00 UTC (noon to avoid boundary issues)
    const excelEpochTime = Date.UTC(1899, 11, 30, 12, 0, 0);
    const targetTime = excelEpochTime + (serialDate * 86400000);
    const date = new Date(targetTime);

    // Extract date components in UTC to avoid timezone shift
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const result = `${year}-${month}-${day}`;
    console.log(`[normalizeDate] Excel serial ${serialDate} -> ${result} (12h offset)`);
    return result;
  }

  // Format: DD/MM/YYYY or DD-MM-YYYY (4-digit year)
  const ddmmyyyyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    const result = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    console.log(`[normalizeDate] DD/MM/YYYY ${str} -> ${result}`);
    return result;
  }

  // Format: DD/MM/YY or DD-MM-YY (2-digit year)
  const ddmmyyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/);
  if (ddmmyyMatch) {
    const [, day, month, yy] = ddmmyyMatch;
    // Convert 2-digit year to 4-digit
    // 00-49 -> 2000-2049, 50-99 -> 1950-1999
    const year = parseInt(yy) < 50 ? `20${yy}` : `19${yy}`;
    const result = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    console.log(`[normalizeDate] DD/MM/YY ${str} -> ${result}`);
    return result;
  }

  // Format: YYYY-MM-DD (already correct)
  const yyyymmddMatch = str.match(/^\d{4}-\d{2}-\d{2}$/);
  if (yyyymmddMatch) {
    console.log(`[normalizeDate] YYYY-MM-DD ${str} -> ${str}`);
    return str;
  }

  // Format: YYYY/MM/DD
  const yyyymmddSlashMatch = str.match(/^(\d{4})[\/](\d{1,2})[\/](\d{1,2})$/);
  if (yyyymmddSlashMatch) {
    const [, year, month, day] = yyyymmddSlashMatch;
    const result = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    console.log(`[normalizeDate] YYYY/MM/DD ${str} -> ${result}`);
    return result;
  }

  // Debug: log unrecognized format
  console.warn('[normalizeDate] Date format not recognized:', str);
  return str;
};

const isValidDate = (dateStr: string): boolean => {
  const normalized = normalizeDate(dateStr);
  const date = new Date(normalized);
  return date instanceof Date && !isNaN(date.getTime());
};

// Import students to database
export const importStudentsToDatabase = async (
  parsedStudents: ParsedStudent[],
  lembagaId: string,
  lembagaName: string,
  importMode: 'add-only' | 'update-empty' = 'update-empty'
): Promise<ImportResult> => {
  const result: ImportResult = {
    success: false,
    totalRows: parsedStudents.length,
    successCount: 0,
    failedCount: 0,
    errors: [],
    students: []
  };

  // Filter only valid students
  const validStudents = parsedStudents.filter(ps => ps.isValid);
  const invalidStudents = parsedStudents.filter(ps => !ps.isValid);

  // Add invalid students to errors
  invalidStudents.forEach(ps => {
    result.errors.push({
      row: ps.rowNumber,
      error: ps.errors.join(', '),
      data: ps.formData
    });
    result.failedCount++;
  });

  // Import valid students
  for (const parsedStudent of validStudents) {
    try {
      // Check if student already exists
      const existingStudent = await findExistingStudent(
        parsedStudent.formData.namaSiswa,
        parsedStudent.formData.nik,
        lembagaId
      );

      if (existingStudent) {
        // Student exists - update empty fields only
        if (importMode === 'update-empty') {
          const updatedData = mergeStudentData(existingStudent.data, parsedStudent.formData);
          
          // Prepare update object
          const updateObj: any = { data: updatedData };
          
          // Update kelulusan if provided and existing is empty
          if (parsedStudent.kelulusan && !existingStudent.kelulusan) {
            updateObj.kelulusan = parsedStudent.kelulusan;
            // If kelulusan is set, also set status to SUDAH DIUJI
            updateObj.status = 'SUDAH DIUJI';
          }

          const { error } = await supabase
            .from(TABLES.STUDENTS)
            .update(updateObj)
            .eq('id', existingStudent.id);

          if (error) throw error;

          result.successCount++;
          console.log(`✅ Updated: ${parsedStudent.formData.namaSiswa} (melengkapi data kosong)`);
        } else {
          // Mode add-only: skip existing students
          result.failedCount++;
          result.errors.push({
            row: parsedStudent.rowNumber,
            error: `Data sudah ada: Siswa "${parsedStudent.formData.namaSiswa}" sudah terdaftar`,
            data: parsedStudent.formData
          });
        }
      } else {
        // Student doesn't exist - insert new
        const noTes = await generateUniqueNoTes(lembagaId);

        const student: Student = {
          id: crypto.randomUUID(),
          noTes,
          lembaga: lembagaId,
          lembagaName,
          data: parsedStudent.formData,
          penilaianAnak: {},
          penilaianOrtu: {},
          status: parsedStudent.kelulusan ? 'SUDAH DIUJI' : 'BELUM DIUJI',
          kelulusan: parsedStudent.kelulusan,
          mathCorrect: 0,
          hafalanBenar: 0,
          nilaiAkhir: 0,
          createdAt: new Date().toISOString()
        };

        const { error } = await supabase
          .from(TABLES.STUDENTS)
          .insert([student]);

        if (error) throw error;

        result.successCount++;
        result.students?.push(student);
        console.log(`✅ Added: ${parsedStudent.formData.namaSiswa} (data baru)`);
      }
    } catch (error) {
      result.failedCount++;
      result.errors.push({
        row: parsedStudent.rowNumber,
        error: (error as Error).message,
        data: parsedStudent.formData
      });
    }
  }

  result.success = result.successCount > 0;
  return result;
};

// Generate unique noTes with retry logic
const generateUniqueNoTes = async (lembagaId: string, maxRetries = 10): Promise<string> => {
  for (let i = 0; i < maxRetries; i++) {
    // Generate noTes without needing registeredStudents
    const tahunAjaran = new Date().getFullYear().toString().slice(-2) + (new Date().getFullYear() + 1).toString().slice(-2);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const noTes = `${lembagaId}-${tahunAjaran}-${randomNum}`;

    // Check if noTes already exists
    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .select('id')
      .eq('noTes', noTes)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking noTes:', error);
    }

    if (!data) {
      // Not found, noTes is unique
      return noTes;
    }

    // If found, retry with delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  throw new Error('Gagal generate nomor tes unik setelah beberapa percobaan');
};

// Find existing student by name or NIK
const findExistingStudent = async (
  namaSiswa: string,
  nik: string,
  lembagaId: string
): Promise<any | null> => {
  try {
    if (!namaSiswa) return null;

    // First try to find by name in the same lembaga
    const { data: byName, error: nameError } = await supabase
      .from(TABLES.STUDENTS)
      .select('*')
      .eq('lembaga', lembagaId)
      .ilike('data->>namaSiswa', namaSiswa)
      .maybeSingle();

    if (nameError && nameError.code !== 'PGRST116') {
      console.error('Error finding by name:', nameError);
    }

    if (byName) {
      return byName;
    }

    // If not found by name, try by NIK (if provided)
    if (nik && nik.length >= 16) {
      const { data: byNik, error: nikError } = await supabase
        .from(TABLES.STUDENTS)
        .select('*')
        .eq('data->>nik', nik)
        .maybeSingle();

      if (nikError && nikError.code !== 'PGRST116') {
        console.error('Error finding by NIK:', nikError);
      }

      if (byNik) {
        return byNik;
      }
    }

    return null; // Not found
  } catch (error) {
    console.error('Error finding existing student:', error);
    return null;
  }
};

// Merge student data - only fill empty fields, keep existing data
const mergeStudentData = (existingData: FormData, newData: FormData): FormData => {
  const merged: FormData = { ...existingData };

  // Helper to check if field is empty
  const isEmpty = (value: any): boolean => {
    return value === '' || value === null || value === undefined;
  };

  // Only update fields that are empty in existing data
  if (isEmpty(merged.namaOrangTua) && !isEmpty(newData.namaOrangTua)) {
    merged.namaOrangTua = newData.namaOrangTua;
  }
  if (isEmpty(merged.nik) && !isEmpty(newData.nik)) {
    merged.nik = newData.nik;
  }
  if (isEmpty(merged.jenisKelamin) && !isEmpty(newData.jenisKelamin)) {
    merged.jenisKelamin = newData.jenisKelamin;
  }
  if (isEmpty(merged.tempatLahir) && !isEmpty(newData.tempatLahir)) {
    merged.tempatLahir = newData.tempatLahir;
  }
  if (isEmpty(merged.tanggalLahir) && !isEmpty(newData.tanggalLahir)) {
    merged.tanggalLahir = newData.tanggalLahir;
  }
  if (isEmpty(merged.kontakOrtu) && !isEmpty(newData.kontakOrtu)) {
    merged.kontakOrtu = newData.kontakOrtu;
  }
  if (isEmpty(merged.tanggalTes) && !isEmpty(newData.tanggalTes)) {
    merged.tanggalTes = newData.tanggalTes;
  }
  if (isEmpty(merged.jamTes) && !isEmpty(newData.jamTes)) {
    merged.jamTes = newData.jamTes;
  }
  if (isEmpty(merged.petugas) && !isEmpty(newData.petugas)) {
    merged.petugas = newData.petugas;
  }

  // Alumni and Asrama: only update if existing is default value
  if (merged.alumni === 'TIDAK' && newData.alumni === 'YA') {
    merged.alumni = newData.alumni;
  }
  if (merged.asrama === 'NON ASRAMA' && newData.asrama === 'ASRAMA') {
    merged.asrama = newData.asrama;
  }

  return merged;
};

// Download template Excel
export const downloadImportTemplate = () => {
  const template: ImportRow[] = [
    {
      'Nama Calon Siswa': 'Ahmad Husin',
      'Nama Orang Tua': 'Abdullah',
      'NIK': '1234567890123456',
      'Jenis Kelamin': 'Laki-laki',
      'Tempat Lahir': 'Jakarta',
      'Tanggal Lahir': '2010-05-15',
      'No WhatsApp': '081234567890',
      'Status Alumni': 'Tidak',
      'Tanggal Tes': '2026-01-06',
      'Jam Tes': '08:00',
      'Petugas TU': 'Satria',
      'Status Asrama': 'ASRAMA',
      'Status Kelulusan': 'LULUS'
    },
    {
      'Nama Calon Siswa': 'Fatimah Zahra',
      'Nama Orang Tua': 'Siti Aminah',
      'NIK': '1234567890123457',
      'Jenis Kelamin': 'Perempuan',
      'Tempat Lahir': 'Bandung',
      'Tanggal Lahir': '2010-08-20',
      'No WhatsApp': '081234567891',
      'Status Alumni': 'Ya',
      'Tanggal Tes': '2026-01-06',
      'Jam Tes': '08:00',
      'Petugas TU': 'Satria',
      'Status Asrama': 'NON ASRAMA',
      'Status Kelulusan': 'CADANGAN'
    },
    {
      'Nama Calon Siswa': 'Muhammad Ali',
      'Nama Orang Tua': '', // Contoh: boleh kosong, bisa diisi manual nanti
      'NIK': '',
      'Jenis Kelamin': 'Laki-laki',
      'Tempat Lahir': '',
      'Tanggal Lahir': '',
      'No WhatsApp': '',
      'Status Alumni': '',
      'Tanggal Tes': '',
      'Jam Tes': '',
      'Petugas TU': '',
      'Status Asrama': 'ASRAMA',
      'Status Kelulusan': '' // Kosong = belum diuji
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Import');

  // Set column widths
  worksheet['!cols'] = [
    { wch: 25 }, // Nama Calon Siswa
    { wch: 25 }, // Nama Orang Tua
    { wch: 18 }, // NIK
    { wch: 15 }, // Jenis Kelamin
    { wch: 20 }, // Tempat Lahir
    { wch: 15 }, // Tanggal Lahir
    { wch: 15 }, // No WhatsApp
    { wch: 15 }, // Status Alumni
    { wch: 15 }, // Tanggal Tes
    { wch: 10 }, // Jam Tes
    { wch: 15 }, // Petugas TU
    { wch: 15 }, // Status Asrama
    { wch: 18 }  // Status Kelulusan
  ];

  XLSX.writeFile(workbook, 'Template_Import_Santri_Baru.xlsx');
};
