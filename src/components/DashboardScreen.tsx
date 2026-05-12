import React, { useEffect, useState } from 'react';
import { LogOut, School, Calendar, FileText, Edit, Trash2, UserCheck, Eye, ClipboardList, Search, Settings, User as UserIcon, MessageCircle, Upload } from 'lucide-react';
import { UserRole, Student, LembagaData, User } from '../types';
import { downloadKartuPeserta, sendViaWhatsApp } from '../utils/pdfGenerator';
import { exportStudentToPDF } from '../utils/exportUtils';
import { downloadSuratKeterangan } from '../utils/suratKeteranganGenerator';
import { getTahunAjaranFromDatabase, updateStudentNoTesToCurrentYear, formatTanggalSingkat } from '../utils/helpers';
import ExportButtons from './ExportButtons';
import ImportModal from './ImportModal';
import BiayaPendidikanTable from './BiayaPendidikanTable';
import { supabase } from '../lib/supabase';

// Helper function to normalize penguji names
const normalizePenguji = (name: string | undefined): string => {
  if (!name) return 'Tidak Diketahui';
  const normalized = name.trim();
  if (normalized === 'Delly' || normalized === 'Delly Arhadhat' || normalized === 'Delly Arhadath') {
    return 'Delly Arhadath';
  }
  if (normalized === 'Herianto') {
    return 'Heri Ferbrianto';
  }
  return normalized;
};

interface DashboardScreenProps {
  userRole: UserRole;
  currentUser: User | null;
  registeredStudents: Student[];
  lembagaData: LembagaData[];
  filterLembaga: string;
  filterStatus: string;
  searchQuery: string;
  filterDateFrom?: string;
  filterDateTo?: string;
  filteredStudents: Student[];
  onLogout: () => void;
  onAddStudent: (lembaga: LembagaData) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onStartPenilaian: (student: Student) => void;
  onFilterLembagaChange: (value: string) => void;
  onFilterStatusChange: (value: string) => void;
  onSearchQueryChange: (value: string) => void;
  onFilterDateFromChange?: (value: string) => void;
  onFilterDateToChange?: (value: string) => void;
  onOpenAdmin: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userRole,
  currentUser,
  // registeredStudents, // not used in this component directly
  lembagaData,
  filterLembaga,
  filterStatus,
  searchQuery,
  filterDateFrom,
  filterDateTo,
  filteredStudents,
  onLogout,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onStartPenilaian,
  onFilterLembagaChange,
  onFilterStatusChange,
  onSearchQueryChange,
  onFilterDateFromChange,
  onFilterDateToChange,
  onOpenAdmin
}) => {
  const [tahunAjaranFromDB, setTahunAjaranFromDB] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showCosts, setShowCosts] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importLembaga, setImportLembaga] = useState<LembagaData | null>(null);

  // Load tahun ajaran dari database saat pertama kali
  useEffect(() => {
    const loadTahunAjaran = async () => {
      try {
        const taFromDB = await getTahunAjaranFromDatabase();
        if (taFromDB) {
          setTahunAjaranFromDB(taFromDB);
          // Sync ke localStorage jika belum ada
          if (!localStorage.getItem('tahunAjaran')) {
            localStorage.setItem('tahunAjaran', taFromDB);
          }
        }
      } catch (error) {
        console.warn('Error loading tahun ajaran from database:', error);
      }
    };

    loadTahunAjaran();
  }, []);

  // Fungsi untuk sync nomor tes siswa dengan tahun ajaran aktif
  const handleSyncTahunAjaran = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    try {
      const result = await updateStudentNoTesToCurrentYear();

      if (result.success) {
        if (result.updated > 0) {
          alert(`✅ ${result.message}\n\nHalaman akan di-reload untuk menampilkan perubahan.`);
          setTimeout(() => window.location.reload(), 1000);
        } else {
          alert(`ℹ️ ${result.message}`);
        }
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Error syncing tahun ajaran:', error);
      alert('❌ Terjadi kesalahan saat sinkronisasi');
    } finally {
      setIsSyncing(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-800">
      {/* Modern subtle background pattern/gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 mb-6 animate-fade-in relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                Dashboard {userRole === 'TU' ? 'Tata Usaha' : userRole === 'PENGUJI' ? 'Penguji' : 'Administrator'}
              </h1>
              <p className="text-slate-500 font-medium">SPMB Ponpes IC At Tauhid</p>
              {currentUser && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full">
                    <UserIcon className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700">{currentUser.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
                    {currentUser.role}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Toggle Biaya Pendidikan */}
              <button
                onClick={() => setShowCosts(!showCosts)}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all font-semibold"
              >
                <FileText className="w-5 h-5" />
                <span className="inline">Biaya Pendidikan</span>
                {showCosts ? '▲' : '▼'}
              </button>
              {/* Atur Tahun Ajaran (TU Only) */}
              {userRole === 'TU' && (
                <div className="hidden md:flex items-center gap-2 mr-2">
                  <label htmlFor="tahunAjaran" className="text-sm text-slate-600 font-medium">Tahun Ajaran</label>
                  <input
                    id="tahunAjaran"
                    type="text"
                    inputMode="numeric"
                    pattern="\\d{4}"
                    defaultValue={tahunAjaranFromDB || (typeof window !== 'undefined' && window.localStorage.getItem('tahunAjaran')) || ''}
                    onBlur={async (e) => {
                      const v = e.currentTarget.value.trim();
                      if (/^\d{4}$/.test(v)) {
                        window.localStorage.setItem('tahunAjaran', v);

                        // Simpan ke Supabase juga untuk sinkronisasi global
                        try {
                          const { error } = await supabase
                            .from('app_settings')
                            .upsert({ key: 'tahun_ajaran', value: v });

                          if (error) {
                            console.warn('Gagal menyimpan Tahun Ajaran ke database:', error);
                          } else {
                            setTahunAjaranFromDB(v);
                          }
                        } catch (err) {
                          console.warn('Error saving tahun ajaran to Supabase:', err);
                        }

                        setTimeout(() => window.location.reload(), 1000);
                      }
                    }}
                    placeholder="2627"
                    className="w-20 px-2 py-1.5 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 text-sm font-medium"
                    title="Format 4 digit, mis. 2627"
                  />
                  <button
                    onClick={handleSyncTahunAjaran}
                    disabled={isSyncing}
                    className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors font-medium disabled:opacity-50"
                    title="Sync nomor tes siswa dengan tahun ajaran aktif"
                  >
                    {isSyncing ? '⏳' : '🔄'} Sync
                  </button>
                </div>
              )}
              {currentUser?.role === 'ADMIN' && (
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all font-semibold"
                >
                  <Settings className="w-5 h-5" />
                  <span className="hidden md:inline">Kelola User</span>
                </button>
              )}
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all font-semibold"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Keluar</span>
              </button>
            </div>
          </div>

          {/* Collapsible Biaya Pendidikan Section */}
          {showCosts && (
            <div className="mt-6 animate-fade-in">
              <BiayaPendidikanTable viewOnly={true} />
            </div>
          )}

          {/* Statistik Dashboard - Dikelompokkan per Kategori */}

          {/* 1. Statistik Umum */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 md:p-5">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-blue-500">📊</span> Statistik Umum
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-white to-blue-50/70 border border-slate-200 border-l-4 border-l-blue-500 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-blue-700 text-sm font-semibold mb-2">
                  {filterLembaga === 'ALL' ? 'Total Pendaftar' : `Pendaftar ${lembagaData.find(l => l.id === filterLembaga)?.name || 'Lembaga'}`}
                </div>
                <div className="text-3xl font-black text-blue-900">{filteredStudents.length}</div>
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-white to-emerald-50/70 border border-slate-200 border-l-4 border-l-emerald-500 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-emerald-700 text-sm font-semibold mb-2">Sudah Diuji</div>
                <div className="text-3xl font-black text-emerald-900">
                  {filteredStudents.filter(s => s.status === 'SUDAH DIUJI').length}
                </div>
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(filteredStudents.filter(s => s.status === 'SUDAH DIUJI').length / Math.max(filteredStudents.length, 1)) * 100}%` }}></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-white to-amber-50/70 border border-slate-200 border-l-4 border-l-amber-500 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-amber-700 text-sm font-semibold mb-2">Belum Diuji</div>
                <div className="text-3xl font-black text-amber-900">
                  {filteredStudents.filter(s => s.status === 'BELUM DIUJI').length}
                </div>
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${(filteredStudents.filter(s => s.status === 'BELUM DIUJI').length / Math.max(filteredStudents.length, 1)) * 100}%` }}></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-white to-purple-50/70 border border-slate-200 border-l-4 border-l-purple-500 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-purple-700 text-sm font-semibold mb-2">Tes Hari Ini</div>
                <div className="text-3xl font-black text-purple-900">
                  {filteredStudents.filter(s => s.data.tanggalTes === new Date().toISOString().split('T')[0]).length}
                </div>
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${(filteredStudents.filter(s => s.data.tanggalTes === new Date().toISOString().split('T')[0]).length / Math.max(filteredStudents.length, 1)) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Statistik Kelulusan */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 md:p-5">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-emerald-500">🎓</span> Statistik Kelulusan
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-white to-emerald-50/70 border border-slate-200 border-l-4 border-l-emerald-500 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-emerald-700 text-sm font-semibold mb-2">✅ Lulus</div>
                <div className="text-3xl font-black text-emerald-900">
                  {filteredStudents.filter(s => s.kelulusan === 'LULUS').length}
                </div>
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(filteredStudents.filter(s => s.kelulusan === 'LULUS').length / Math.max(filteredStudents.length, 1)) * 100}%` }}></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-white to-amber-50/70 border border-slate-200 border-l-4 border-l-amber-500 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-amber-700 text-sm font-semibold mb-2 flex items-center gap-2">
                  <span>⚠️</span> Cadangan
                </div>
                <div className="text-3xl font-black text-amber-900">
                  {filteredStudents.filter(s => s.kelulusan === 'CADANGAN').length}
                </div>
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${(filteredStudents.filter(s => s.kelulusan === 'CADANGAN').length / Math.max(filteredStudents.length, 1)) * 100}%` }}></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-white to-rose-50/70 border border-slate-200 border-l-4 border-l-rose-500 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-rose-700 text-sm font-semibold mb-2">❌ Tidak Lulus</div>
                <div className="text-3xl font-black text-rose-900">
                  {filteredStudents.filter(s => s.kelulusan === 'TIDAK LULUS').length}
                </div>
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${(filteredStudents.filter(s => s.kelulusan === 'TIDAK LULUS').length / Math.max(filteredStudents.length, 1)) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Statistik Jenis Kelamin */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 md:p-5">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-cyan-500">👥</span> Statistik Jenis Kelamin
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-white to-blue-50/70 border border-slate-200 border-l-4 border-l-blue-500 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-blue-700 text-sm font-semibold mb-2 flex items-center gap-2">
                  <span>👨</span> Laki-laki
                </div>
                <div className="text-3xl font-black text-blue-900">
                  {filteredStudents.filter(s => s.data.jenisKelamin === 'Laki-laki').length}
                </div>
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(filteredStudents.filter(s => s.data.jenisKelamin === 'Laki-laki').length / Math.max(filteredStudents.length, 1)) * 100}%` }}></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-white to-pink-50/70 border border-slate-200 border-l-4 border-l-pink-500 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-pink-700 text-sm font-semibold mb-2 flex items-center gap-2">
                  <span>👩</span> Perempuan
                </div>
                <div className="text-3xl font-black text-pink-900">
                  {filteredStudents.filter(s => s.data.jenisKelamin === 'Perempuan').length}
                </div>
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500 rounded-full transition-all" style={{ width: `${(filteredStudents.filter(s => s.data.jenisKelamin === 'Perempuan').length / Math.max(filteredStudents.length, 1)) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Statistik Status Asrama */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 md:p-5">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-violet-500">🏠</span> Statistik Status Asrama
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-white to-violet-50/70 border border-slate-200 border-l-4 border-l-violet-500 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-violet-700 text-sm font-semibold mb-2 flex items-center gap-2">
                  <span>🏠</span> Asrama
                </div>
                <div className="text-3xl font-black text-violet-900">
                  {filteredStudents.filter(s => s.data.asrama === 'ASRAMA').length}
                </div>
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${(filteredStudents.filter(s => s.data.asrama === 'ASRAMA').length / Math.max(filteredStudents.length, 1)) * 100}%` }}></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-white to-orange-50/70 border border-slate-200 border-l-4 border-l-orange-500 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-orange-700 text-sm font-semibold mb-2 flex items-center gap-2">
                  <span>🏡</span> Non Asrama
                </div>
                <div className="text-3xl font-black text-orange-900">
                  {filteredStudents.filter(s => s.data.asrama === 'NON ASRAMA').length}
                </div>
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${(filteredStudents.filter(s => s.data.asrama === 'NON ASRAMA').length / Math.max(filteredStudents.length, 1)) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Statistik Per Penguji */}
          {(() => {
            // Hitung statistik per penguji
            const pengujiStats = filteredStudents
              .filter(s => s.status === 'SUDAH DIUJI' && s.penguji)
              .reduce((acc, student) => {
                const penguji = normalizePenguji(student.penguji);
                if (!acc[penguji]) {
                  acc[penguji] = 0;
                }
                acc[penguji]++;
                return acc;
              }, {} as Record<string, number>);

            const pengujiList = Object.entries(pengujiStats).sort((a, b) => b[1] - a[1]);

            if (pengujiList.length === 0) return null;

            const colors = [
              'bg-indigo-500',
              'bg-teal-500',
              'bg-fuchsia-500',
              'bg-lime-500',
              'bg-rose-500',
              'bg-sky-500',
            ];
            const borderColors = [
              'border-l-indigo-500',
              'border-l-teal-500',
              'border-l-fuchsia-500',
              'border-l-lime-500',
              'border-l-rose-500',
              'border-l-sky-500',
            ];
            const labelTextColors = [
              'text-indigo-700',
              'text-teal-700',
              'text-fuchsia-700',
              'text-lime-700',
              'text-rose-700',
              'text-sky-700',
            ];
            const valueTextColors = [
              'text-indigo-900',
              'text-teal-900',
              'text-fuchsia-900',
              'text-lime-900',
              'text-rose-900',
              'text-sky-900',
            ];
            const metaTextColors = [
              'text-indigo-600',
              'text-teal-600',
              'text-fuchsia-600',
              'text-lime-600',
              'text-rose-600',
              'text-sky-600',
            ];

            return (
              <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 md:p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="text-indigo-500">👤</span> Statistik Per Penguji
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {pengujiList.map(([penguji, count], index) => (
                    (() => {
                      const cIdx = index % colors.length;
                      return (
                    <div key={penguji} className={`bg-gradient-to-br from-white to-slate-50/70 border border-slate-200 border-l-4 ${borderColors[index % borderColors.length]} p-5 rounded-2xl shadow-sm hover:shadow-md transition-all`}>
                      <div className={`${labelTextColors[cIdx]} text-sm font-semibold mb-2 flex items-center gap-2`}>
                        <span>👤</span> {penguji}
                      </div>
                      <div className={`text-3xl font-black ${valueTextColors[cIdx]}`}>
                        {count}
                      </div>
                      <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${colors[index % colors.length]} rounded-full transition-all`} style={{ width: `${(count / Math.max(filteredStudents.filter(s => s.status === 'SUDAH DIUJI').length, 1)) * 100}%` }}></div>
                      </div>
                      <div className={`${metaTextColors[cIdx]} text-xs mt-2 font-medium`}>
                        {((count / Math.max(filteredStudents.filter(s => s.status === 'SUDAH DIUJI').length, 1)) * 100).toFixed(1)}% dari total
                      </div>
                    </div>
                      );
                    })()
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Add Student Button (TU Only) */}
        {userRole === 'TU' && (
          <div className="mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Tambah Calon Siswa Baru</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {lembagaData.map((lembaga) => {
                const Icon = lembaga.icon;
                return (
                  <div key={lembaga.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br ${lembaga.color} rounded-lg shadow-sm`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-sm font-bold text-slate-800">{lembaga.name}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onAddStudent(lembaga)}
                        className="flex-1 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all"
                      >
                        ➕ Manual
                      </button>
                      <button
                        onClick={() => {
                          setImportLembaga(lembaga);
                          setShowImportModal(true);
                        }}
                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        Excel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Import Modal */}
        {importLembaga && (
          <ImportModal
            isOpen={showImportModal}
            onClose={() => {
              setShowImportModal(false);
              setImportLembaga(null);
            }}
            selectedLembaga={importLembaga}
            onImportComplete={() => {
              // Reload page to show new data
              window.location.reload();
            }}
          />
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 mb-6 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 w-5 h-5 transition-colors" />
                <input
                  type="text"
                  placeholder="Cari nama siswa, orang tua, atau no. tes..."
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all bg-white font-medium text-slate-800"
                />
              </div>
            </div>
            <div className="w-full md:w-56">
              <select
                value={filterLembaga}
                onChange={(e) => onFilterLembagaChange(e.target.value)}
                aria-label="Filter Lembaga"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all bg-white font-semibold text-slate-800"
              >
                <option value="ALL">🏫 Semua Lembaga</option>
                {lembagaData.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-56">
              <select
                value={filterStatus}
                onChange={(e) => onFilterStatusChange(e.target.value)}
                aria-label="Filter Status"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all bg-white font-semibold text-slate-800"
              >
                <option value="ALL">📊 Semua Status</option>
                <option value="BELUM DIUJI">🔴 Belum Diuji</option>
                <option value="SUDAH DIUJI">🟡 Sudah Diuji</option>
                <option value="LULUS">🟢 Lulus</option>
                <option value="CADANGAN">🟠 Cadangan</option>
                <option value="TIDAK LULUS">🔴 Tidak Lulus</option>
              </select>
            </div>
          </div>

          {/* Date Filter Row */}
          <div className="flex flex-col md:flex-row gap-4 mt-4 pt-4 border-t border-slate-200">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">📅 Filter Tanggal Upload (Dari)</label>
              <input
                type="date"
                value={filterDateFrom || ''}
                onChange={(e) => onFilterDateFromChange?.(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all bg-white font-medium text-slate-800"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">📅 Filter Tanggal Upload (Sampai)</label>
              <input
                type="date"
                value={filterDateTo || ''}
                onChange={(e) => onFilterDateToChange?.(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all bg-white font-medium text-slate-800"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  onFilterDateFromChange?.('');
                  onFilterDateToChange?.('');
                }}
                className="px-6 py-3 bg-slate-100 text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-200 transition-all font-semibold whitespace-nowrap"
              >
                🔄 Reset Tanggal
              </button>
            </div>
          </div>
        </div>

        {/* Students List & Bulk Export */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {userRole === 'PENGUJI' ? '📅 Jadwal Tes Hari Ini' : '📋 Daftar Calon Siswa'}
          </h2>
          {/* Bulk export buttons (visible when data tersedia) */}
          <div className="flex justify-end mb-4">
            <ExportButtons students={filteredStudents} lembagaData={lembagaData} />
          </div>

          {filteredStudents.length === 0 ? (
            <div className="text-center py-16 animate-scale-in">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 font-semibold text-lg">
                {userRole === 'PENGUJI' ? 'Tidak ada jadwal tes hari ini' : 'Belum ada data pendaftaran'}
              </p>
              <p className="text-gray-400 text-sm mt-2">Silakan tambahkan data calon siswa baru</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student, index) => {
                const lembaga = lembagaData.find(l => l.id === student.lembaga);
                const Icon = lembaga?.icon || School;

                return (
                  <div key={student.id} className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md hover:bg-slate-50/30 transition-all group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className={`hidden md:flex items-center justify-center w-12 md:w-14 h-12 md:h-14 bg-gradient-to-br ${lembaga?.color} rounded-xl flex-shrink-0 shadow-sm ring-1 ring-slate-200/70 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 md:w-7 h-6 md:h-7 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2 md:mb-3">
                          <div>
                            <h3 className="font-black text-slate-800 text-lg md:text-xl mb-1">{student.data.namaSiswa}</h3>
                            <p className="text-xs md:text-sm text-slate-500 font-medium">👨‍👩‍👦 {student.data.namaOrangTua}</p>
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 ${student.status === 'SUDAH DIUJI'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-600 text-white'
                              }`}>
                              {student.status === 'SUDAH DIUJI' ? '✓' : '○'}
                              {student.status}
                            </span>
                            {student.status === 'SUDAH DIUJI' && student.kelulusan && (
                              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 ${student.kelulusan === 'LULUS'
                                ? 'bg-emerald-600 text-white'
                                : student.kelulusan === 'CADANGAN'
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-rose-600 text-white'
                                }`}>
                                {student.kelulusan === 'LULUS' ? '✓' : student.kelulusan === 'CADANGAN' ? '⚠' : '✗'}
                                {student.kelulusan}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 text-[10px] md:text-xs mb-2 md:mb-4">
                          <span className="inline-flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-emerald-600 rounded-lg text-white shadow-sm">
                            <FileText className="w-3 h-3 md:w-4 md:h-4 text-white/90" />
                            <span className="font-semibold">{student.noTes}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-blue-600 rounded-lg text-white shadow-sm">
                            <School className="w-3 h-3 md:w-4 md:h-4 text-white/90" />
                            <span className="font-semibold">{lembaga?.name}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-amber-600 rounded-lg text-white shadow-sm">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4 text-white/90" />
                            <span className="font-semibold">{formatTanggalSingkat(student.data.tanggalTes)} • {student.data.jamTes}</span>
                          </span>
                          {student.data.petugas && (
                            <span className="inline-flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-indigo-600 rounded-lg text-white shadow-sm">
                              <UserIcon className="w-3 h-3 md:w-4 md:h-4 text-white/90" />
                              <span>Petugas: <span className="font-semibold">{student.data.petugas}</span></span>
                            </span>
                          )}
                          {student.data.asrama && (
                            <span className="inline-flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-violet-600 rounded-lg text-white shadow-sm">
                              <UserCheck className="w-3 h-3 md:w-4 md:h-4 text-white/90" />
                              <span>Asrama: <span className="font-semibold">{student.data.asrama}</span></span>
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-rose-600 rounded-lg text-white shadow-sm">
                            <UserCheck className="w-3 h-3 md:w-4 md:h-4 text-white/90" />
                            <span>Alumni: <span className="font-semibold">{student.data.alumni === 'YA' ? 'Ya' : 'Tidak'}</span></span>
                          </span>
                        </div>

                        {/* Informasi Penguji dan Nilai */}
                        {student.status === 'SUDAH DIUJI' && (
                          <div className="mb-3 md:mb-4 p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                              {student.penguji && (
                                <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm">
                                  <div className="flex items-center gap-1.5 md:gap-2 text-slate-600">
                                    <UserCheck className="w-3 h-3 md:w-4 md:h-4 text-indigo-500" />
                                    <span>Diuji oleh:</span>
                                  </div>
                                  <span className="font-bold text-indigo-700">{normalizePenguji(student.penguji)}</span>
                                </div>
                              )}
                              {student.nilaiAkhir !== undefined && (
                                <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm">
                                  <div className="flex items-center gap-1.5 md:gap-2 text-slate-600">
                                    <FileText className="w-3 h-3 md:w-4 md:h-4 text-purple-500" />
                                    <span>Nilai Akhir:</span>
                                  </div>
                                  <span className="font-black text-purple-700">{student.nilaiAkhir}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1.5 md:gap-2 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-slate-100 justify-start md:justify-end">
                          {userRole === 'TU' && (
                            <>
                              <button
                                onClick={() => onEditStudent(student)}
                                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 md:py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all text-xs md:text-sm font-semibold"
                              >
                                <Edit className="w-3 h-3 md:w-4 md:h-4" />
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                              <button
                                onClick={() => onDeleteStudent(student.id)}
                                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 md:py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all text-xs md:text-sm font-semibold"
                              >
                                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                                <span className="hidden sm:inline">Hapus</span>
                              </button>
                            </>
                          )}
                          {userRole === 'PENGUJI' && (
                            <button
                              onClick={() => onStartPenilaian(student)}
                              className="flex items-center gap-1.5 px-2 md:px-4 py-1.5 md:py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all text-xs md:text-sm font-bold"
                            >
                              {student.status === 'SUDAH DIUJI' ? (
                                <>
                                  <Eye className="w-3 h-3 md:w-4 md:h-4" />
                                  <span className="hidden sm:inline">Lihat Penilaian</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-3 h-3 md:w-4 md:h-4" />
                                  <span className="hidden sm:inline">Mulai TES</span>
                                </>
                              )}
                            </button>
                          )}
                          {/* Aksi Kartu: Download PDF & Kirim WhatsApp */}
                          {student.status === 'SUDAH DIUJI' && (
                            <>
                              <button
                                onClick={async () => { await exportStudentToPDF(student, lembagaData); }}
                                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 md:py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all text-xs md:text-sm font-semibold"
                                aria-label="Download Hasil Tes PDF"
                                title="Export Hasil Tes PDF"
                              >
                                <FileText className="w-3 h-3 md:w-4 md:h-4" />
                                <span className="hidden sm:inline">Hasil PDF</span>
                              </button>
                              {student.kelulusan && (userRole === 'TU' || userRole === 'ADMIN') && (
                                <button
                                  onClick={() => downloadSuratKeterangan(student)}
                                  className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 md:py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all text-xs md:text-sm font-semibold"
                                  aria-label="Download Surat Keterangan"
                                  title="Download Surat Keterangan Lulus/Tidak Lulus"
                                >
                                  <FileText className="w-3 h-3 md:w-4 md:h-4" />
                                  <span className="hidden sm:inline">Surat Keterangan</span>
                                </button>
                              )}
                            </>
                          )}
                          <button
                            onClick={() => downloadKartuPeserta(student)}
                            className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 md:py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 rounded-xl transition-all text-xs md:text-sm font-semibold"
                            aria-label="Download Kartu Peserta PDF"
                          >
                            <FileText className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">Kartu</span>
                          </button>
                          <button
                            onClick={() => sendViaWhatsApp(student)}
                            className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 md:py-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-xl transition-all text-xs md:text-sm font-semibold"
                            aria-label="Kirim WhatsApp ke Orang Tua"
                          >
                            <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">WA</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
