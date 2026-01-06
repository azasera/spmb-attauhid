import { LucideIcon } from 'lucide-react';

export type UserRole = 'TU' | 'PENGUJI' | 'ADMIN' | null;

export type View = 'login' | 'dashboard' | 'form' | 'penilaian' | 'detail' | 'admin' | 'backup';

export type StudentStatus = 'BELUM DIUJI' | 'SUDAH DIUJI';
export type KelulusanStatus = 'LULUS' | 'CADANGAN' | 'TIDAK LULUS';

export interface FormData {
  namaOrangTua: string;
  namaSiswa: string;
  tempatLahir: string;
  tanggalLahir: string;
  nik: string;
  jenisKelamin: string;
  kontakOrtu: string;
  tanggalTes: string;
  jamTes: string;
  alumni: 'YA' | 'TIDAK';
  asrama: 'ASRAMA' | 'NON ASRAMA';
  petugas: string;
}

export interface LembagaData {
  id: string;
  name: string;
  fullName: string;
  icon: LucideIcon;
  color: string;
  prefix: string;
  address?: {
    building: string;
    street: string;
    mapsUrl: string;
  };
}

export interface Petugas {
  name: string;
  role: string;
}

export interface Penguji {
  name: string;
  role: string;
}

export interface PenilaianData {
  anak: string[];
  ortu: string[];
}

export interface PenilaianScores {
  [key: string]: number; // 1-5 scale
}

export interface Student {
  id: string;
  noTes: string;
  lembaga: string;
  lembagaName: string;
  data: FormData;
  penilaianAnak: PenilaianScores;
  penilaianOrtu: PenilaianScores;
  status: StudentStatus;
  penguji?: string;
  // Tambahan penilaian tes
  mathCorrect?: number; // 0-5
  hafalanBenar?: number; // 0-15
  nilaiAkhir?: number; // 0-100
  kelulusan?: KelulusanStatus;
  // Text area untuk informasi tambahan
  riwayatPenyakit?: string;
  pekerjaanOrangTua?: string;
  catatanPenguji?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  role: 'TU' | 'PENGUJI' | 'ADMIN';
  createdAt: string;
  createdBy?: string;
}

