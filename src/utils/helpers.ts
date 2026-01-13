import { Student, PenilaianData, PenilaianScores, KelulusanStatus } from '../types';
import { penilaianSD, penilaianSMP, penilaianSMA } from '../data/constants';
import { supabase } from '../lib/supabase';

// Fungsi untuk mendapatkan tahun ajaran (format: 2627)
// Bisa dioverride via:
// - localStorage: tahunAjaran (di-set dari Dashboard TU)
// - database: app_settings (tahun_ajaran)
// - env: VITE_TAHUN_AJARAN=2627
export const getTahunAjaran = (): string => {
  // Env override (mis. untuk memaksa 2627 pada transisi tahun)
  const envTa = (import.meta as any)?.env?.VITE_TAHUN_AJARAN as string | undefined;
  // LocalStorage override (prioritas lebih tinggi karena dikontrol via UI)
  try {
    const lsTa = typeof window !== 'undefined' ? window.localStorage.getItem('tahunAjaran') || '' : '';
    if (/^\d{4}$/.test(lsTa)) return lsTa;
  } catch { /* noop */ }
  if (envTa && /^\d{4}$/.test(envTa)) return envTa;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12

  // Default aturan akademik: mulai Juli (7)
  const tahunMulai = month >= 7 ? year : year - 1;
  const tahunAkhir = tahunMulai + 1;

  const tahunMulaiStr = tahunMulai.toString().slice(-2);
  const tahunAkhirStr = tahunAkhir.toString().slice(-2);
  return `${tahunMulaiStr}${tahunAkhirStr}`;
};

// Fungsi untuk update nomor tes siswa agar sesuai dengan tahun ajaran yang aktif
export const updateStudentNoTesToCurrentYear = async (): Promise<{ success: boolean; message: string; updated: number }> => {
  try {
    const currentTahunAjaran = getTahunAjaran();

    // Get all students
    const { data: students, error: fetchError } = await supabase
      .from('students')
      .select('id, noTes');

    if (fetchError) {
      return { success: false, message: 'Gagal mengambil data siswa', updated: 0 };
    }

    if (!students || students.length === 0) {
      return { success: true, message: 'Tidak ada data siswa', updated: 0 };
    }

    // Filter siswa yang perlu diupdate (nomor tes tidak sesuai dengan tahun ajaran aktif)
    const studentsToUpdate = students.filter(student => {
      const parsedTA = parseTahunAjaranFromNoTes(student.noTes);
      return parsedTA && parsedTA !== currentTahunAjaran;
    });

    if (studentsToUpdate.length === 0) {
      return { success: true, message: 'Semua nomor tes sudah sesuai', updated: 0 };
    }

    // Update nomor tes untuk setiap siswa
    let updatedCount = 0;
    for (const student of studentsToUpdate) {
      const newNoTes = student.noTes.replace(/\d{4}/, currentTahunAjaran);

      const { error: updateError } = await supabase
        .from('students')
        .update({ noTes: newNoTes })
        .eq('id', student.id);

      if (!updateError) {
        updatedCount++;
      }
    }

    return {
      success: true,
      message: `Berhasil update ${updatedCount} dari ${studentsToUpdate.length} siswa`,
      updated: updatedCount
    };

  } catch (error) {
    console.error('Error updating student noTes:', error);
    return { success: false, message: 'Terjadi kesalahan saat update', updated: 0 };
  }
};

// Fungsi async untuk mendapatkan tahun ajaran dari database
export const getTahunAjaranFromDatabase = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'tahun_ajaran')
      .single();

    if (error) {
      console.warn('Gagal load tahun ajaran dari database:', error);
      return null;
    }

    const value = data?.value;
    if (/^\d{4}$/.test(value)) {
      return value;
    }

    return null;
  } catch (error) {
    console.warn('Error loading tahun ajaran from database:', error);
    return null;
  }
};

// Parse tahun ajaran (empat digit, mis. 2627) dari noTes format PREFIX-TA-NNN atau TA-NNN atau TANNN
export const parseTahunAjaranFromNoTes = (noTes: string): string | null => {
  try {
    const clean = (noTes || '').trim();
    if (!clean) return null;

    // Format 1: PREFIX-TA-NNN (e.g., SD-2627-001)
    const parts = clean.split('-');
    if (parts.length === 3 && /^\d{4}$/.test(parts[1])) {
      return parts[1];
    }

    // Format 2: TA-NNN (e.g., 2627-001)
    if (parts.length === 2 && /^\d{4}$/.test(parts[0])) {
      return parts[0];
    }

    // Format 3: TANNN (e.g., 2627001) - ambil 4 digit pertama
    if (/^\d{4,}/.test(clean)) {
      const ta = clean.slice(0, 4);
      // Validasi tahun ajaran masuk akal (20xx/20xx)
      const start = parseInt(ta.slice(0, 2), 10);
      const end = parseInt(ta.slice(2, 4), 10);
      if (start >= 20 && start <= 99 && end === start + 1) {
        return ta;
      }
    }

    return null;
  } catch {
    return null;
  }
};

// Format tahun ajaran empat digit (2627) menjadi 2026/2027
export const formatTahunAjaranDisplay = (ta: string): string => {
  const safe = (ta || '').trim();
  if (!/^\d{4}$/.test(safe)) {
    return safe;
  }
  const start = parseInt(safe.slice(0, 2), 10);
  const end = parseInt(safe.slice(2, 4), 10);
  return `20${start}/20${end}`;
};

export const generateNoTes = (lembagaId: string, registeredStudents: Student[]): string => {
  const tahunAjaran = getTahunAjaran();

  // Tentukan prefix berdasarkan lembaga ID
  let prefix = '';
  switch (lembagaId) {
    case 'SDITA':
      prefix = 'SD';
      break;
    case 'SMPITA':
      prefix = 'SMP';
      break;
    case 'SMAITA':
      prefix = 'SMA';
      break;
    default:
      prefix = lembagaId;
  }

  // Filter siswa dengan lembaga yang sama
  const existingNumbers = registeredStudents
    .filter(s => s.lembaga === lembagaId)
    .map(s => {
      // Parse nomor urut dari format: SD-2627-001
      const parts = s.noTes.split('-');
      if (parts.length === 3) {
        return parseInt(parts[2]);
      }
      return 0;
    })
    .filter(n => !isNaN(n) && n > 0);

  const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;

  // Format: SD-2627-001
  return `${prefix}-${tahunAjaran}-${nextNumber.toString().padStart(3, '0')}`;
};

export const getPenilaianByLembaga = (lembagaId: string): PenilaianData => {
  switch (lembagaId) {
    case 'SDITA':
      return penilaianSD;
    case 'SMPITA':
      return penilaianSMP;
    case 'SMAITA':
      return penilaianSMA;
    default:
      return penilaianSMP;
  }
};

export const getFilteredStudents = (
  students: Student[],
  filterLembaga: string,
  filterStatus: string,
  searchQuery: string,
  filterDateFrom?: string,
  filterDateTo?: string
): Student[] => {
  let filtered = students;

  if (filterLembaga !== 'ALL') {
    filtered = filtered.filter(s => s.lembaga === filterLembaga);
  }

  if (filterStatus !== 'ALL') {
    if (filterStatus === 'LULUS' || filterStatus === 'CADANGAN' || filterStatus === 'TIDAK LULUS') {
      filtered = filtered.filter(s => s.kelulusan === filterStatus);
    } else if (filterStatus === 'SUDAH DIUJI') {
      filtered = filtered.filter(s => s.status === 'SUDAH DIUJI');
    } else if (filterStatus === 'BELUM DIUJI') {
      filtered = filtered.filter(s => s.status === 'BELUM DIUJI');
    }
  }

  if (searchQuery) {
    filtered = filtered.filter(s =>
      s.data.namaSiswa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.data.namaOrangTua.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.noTes.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filter by date range (createdAt)
  if (filterDateFrom) {
    filtered = filtered.filter(s => {
      if (!s.createdAt) return false;
      const createdDate = new Date(s.createdAt).toISOString().split('T')[0];
      return createdDate >= filterDateFrom;
    });
  }

  if (filterDateTo) {
    filtered = filtered.filter(s => {
      if (!s.createdAt) return false;
      const createdDate = new Date(s.createdAt).toISOString().split('T')[0];
      return createdDate <= filterDateTo;
    });
  }

  // PENGUJI sekarang melihat semua siswa (sama seperti TU/Admin)
  // Filter tanggal dihapus agar konsisten dengan role lain

  return filtered;
};

export const getInitialFormData = () => ({
  namaOrangTua: '',
  namaSiswa: '',
  tempatLahir: '',
  tanggalLahir: '',
  nik: '',
  jenisKelamin: '',
  kontakOrtu: '',
  tanggalTes: '',
  jamTes: '',
  alumni: 'TIDAK' as const,
  asrama: 'NON ASRAMA' as const,
  petugas: ''
});

// Hitung kelulusan berdasarkan bobot:
// SD: Wawancara 100%
// SMP/SMA: Wawancara 30%, Matematika 35%, Hafalan 35%
// KKM: 70
export const calculateKelulusan = (
  penilaianAnak: PenilaianScores,
  penilaianOrtu: PenilaianScores,
  mathCorrect: number,
  hafalanBenar: number,
  lembaga?: string
): {
  finalScore: number;
  status: KelulusanStatus;
  breakdown: { interview: number; math: number; hafalan: number };
} => {
  // Clamp input ranges
  const mathBenar = Math.max(0, Math.min(5, Math.round(mathCorrect)));
  const hafalanOk = Math.max(0, Math.min(15, Math.round(hafalanBenar)));

  const anakScores = Object.values(penilaianAnak || {});
  const ortuScores = Object.values(penilaianOrtu || {});
  const allInterviewScores = [...anakScores, ...ortuScores];

  let interviewPercent = 0;
  if (allInterviewScores.length > 0) {
    const avg = allInterviewScores.reduce((sum, v) => sum + v, 0) / allInterviewScores.length;
    interviewPercent = (avg / 5) * 100; // normalize 1-5 to 0-100
  }

  const mathPercent = (mathBenar / 5) * 100;
  const hafalanPercent = (hafalanOk / 15) * 100;

  let finalScoreRaw: number;

  // Untuk SD hanya menggunakan wawancara (100%)
  if (lembaga === 'SDITA') {
    finalScoreRaw = interviewPercent;
  } else {
    // Untuk SMP/SMA menggunakan bobot: Wawancara 30%, Matematika 35%, Hafalan 35%
    const weightedInterview = interviewPercent * 0.30;
    const weightedMath = mathPercent * 0.35;
    const weightedHafalan = hafalanPercent * 0.35;
    finalScoreRaw = weightedInterview + weightedMath + weightedHafalan;
  }

  const finalScore = Math.round(finalScoreRaw * 100) / 100; // 2 decimal places

  // Tentukan status berdasarkan nilai akhir
  let status: KelulusanStatus;
  if (finalScore >= 70) {
    status = 'LULUS';
  } else if (finalScore >= 60) {
    status = 'CADANGAN';
  } else {
    status = 'TIDAK LULUS';
  }

  return {
    finalScore,
    status,
    breakdown: {
      interview: Math.round(interviewPercent * 100) / 100,
      math: Math.round(mathPercent * 100) / 100,
      hafalan: Math.round(hafalanPercent * 100) / 100
    }
  };
};

// Format tanggal ke format Indonesia (contoh: "Senin, 6 Januari 2026")
export const formatTanggalIndonesia = (dateString: string): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

// Format tanggal ke format Indonesia singkat (contoh: "06/01/2026")
export const formatTanggalSingkat = (dateString: string): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

