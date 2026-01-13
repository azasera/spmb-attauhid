import React, { useState } from 'react';
import { ChevronLeft, Check, Users, User, ChevronDown } from 'lucide-react';
import { Student, PenilaianScores, PenilaianData } from '../types';
import RubricGuide from './RubricGuide';
import { calculateKelulusan, formatTanggalSingkat } from '../utils/helpers';
import { rubrikSantri, rubrikOrtu } from '../data/constants';

interface PenilaianScreenProps {
  selectedStudent: Student;
  penilaian: PenilaianData;
  penilaianAnak: PenilaianScores;
  penilaianOrtu: PenilaianScores;
  onBack: () => void;
  onSave: () => void;
  onPenilaianAnakChange: (item: string, value: number) => void;
  onPenilaianOrtuChange: (item: string, value: number) => void;
  mathCorrect?: number;
  hafalanBenar?: number;
  onMathCorrectChange?: (value: number) => void;
  onHafalanBenarChange?: (value: number) => void;
  riwayatPenyakit?: string;
  pekerjaanOrangTua?: string;
  catatanPenguji?: string;
  onRiwayatPenyakitChange?: (value: string) => void;
  onPekerjaanOrangTuaChange?: (value: string) => void;
  onCatatanPengujiChange?: (value: string) => void;
}

const PenilaianScreen: React.FC<PenilaianScreenProps> = ({
  selectedStudent,
  penilaian,
  penilaianAnak,
  penilaianOrtu,
  onBack,
  onSave,
  onPenilaianAnakChange,
  onPenilaianOrtuChange,
  mathCorrect = 0,
  hafalanBenar = 0,
  onMathCorrectChange,
  onHafalanBenarChange,
  riwayatPenyakit = '',
  pekerjaanOrangTua = '',
  catatanPenguji = '',
  onRiwayatPenyakitChange,
  onPekerjaanOrangTuaChange,
  onCatatanPengujiChange
}) => {
  const [showGuideAnak, setShowGuideAnak] = useState(false);
  const [showGuideOrtu, setShowGuideOrtu] = useState(false);
  const [expandedAnakItems, setExpandedAnakItems] = useState<Set<number>>(new Set());
  const [expandedOrtuItems, setExpandedOrtuItems] = useState<Set<number>>(new Set());
  const hasil = calculateKelulusan(penilaianAnak, penilaianOrtu, mathCorrect, hafalanBenar, selectedStudent.lembaga);

  const toggleAnakItem = (index: number) => {
    const newExpanded = new Set(expandedAnakItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedAnakItems(newExpanded);
  };

  const toggleOrtuItem = (index: number) => {
    const newExpanded = new Set(expandedOrtuItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedOrtuItems(newExpanded);
  };

  const levelTooltip = [
    'Definisi Level (umum)',
    '1 — Sangat Kurang: tidak menunjukkan indikator yang diharapkan; sering butuh arahan; tidak konsisten.',
    '2 — Kurang: sebagian kecil indikator muncul; perlu banyak bantuan; sering tidak tepat.',
    '3 — Cukup: indikator muncul secara dasar; cukup konsisten; masih ada kekurangan.',
    '4 — Baik: indikator muncul jelas; konsisten; hanya kekurangan kecil.',
    '5 — Sangat Baik: indikator kuat, konsisten, mandiri; melebihi harapan.'
  ].join('\n');

  const getScoreClasses = (score: number, active: boolean) => {
    const base = 'flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer transition-all';
    if (active) {
      switch (score) {
        case 1:
          return `${base} bg-red-600 text-white shadow-lg scale-110`;
        case 2:
          return `${base} bg-orange-500 text-white shadow-lg scale-110`;
        case 3:
          return `${base} bg-yellow-500 text-gray-900 shadow-lg scale-110`;
        case 4:
          return `${base} bg-lime-600 text-white shadow-lg scale-110`;
        case 5:
        default:
          return `${base} bg-emerald-600 text-white shadow-lg scale-110`;
      }
    } else {
      switch (score) {
        case 1:
          return `${base} bg-white border-2 border-red-300 text-gray-700 hover:border-red-400`;
        case 2:
          return `${base} bg-white border-2 border-orange-300 text-gray-700 hover:border-orange-400`;
        case 3:
          return `${base} bg-white border-2 border-yellow-300 text-gray-700 hover:border-yellow-400`;
        case 4:
          return `${base} bg-white border-2 border-lime-300 text-gray-700 hover:border-lime-400`;
        case 5:
        default:
          return `${base} bg-white border-2 border-emerald-300 text-gray-700 hover:border-emerald-400`;
      }
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-400 to-blue-500 pb-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <div className="glass rounded-3xl shadow-2xl p-4 md:p-6 mb-6 animate-fade-in hover-lift">
          <button
            onClick={onBack}
            className="flex items-center text-gray-700 hover:text-emerald-600 mb-4 transition-all font-semibold transform hover:translate-x-[-4px]"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Kembali ke Dashboard
          </button>

          <div className="mb-4">
            <h2 className="text-xl md:text-3xl font-black bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
              📝 Penilaian Calon Siswa
            </h2>
            <p className="text-gray-700 font-semibold">{selectedStudent.lembagaName}</p>
          </div>

          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-5 border-2 border-emerald-300 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-emerald-700 font-semibold">No. Tes:</span>
                <span className="ml-2 font-black text-emerald-800">{selectedStudent.noTes}</span>
              </div>
              <div>
                <span className="text-emerald-700 font-semibold">Nama:</span>
                <span className="ml-2 font-black text-gray-800">{selectedStudent.data.namaSiswa}</span>
              </div>
              <div>
                <span className="text-emerald-700 font-semibold">Orang Tua:</span>
                <span className="ml-2 font-bold text-gray-700">{selectedStudent.data.namaOrangTua}</span>
              </div>
              <div>
                <span className="text-emerald-700 font-semibold">Jadwal:</span>
                <span className="ml-2 font-bold text-gray-700">{formatTanggalSingkat(selectedStudent.data.tanggalTes)} - {selectedStudent.data.jamTes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Penilaian Calon Siswa */}
        <div className="glass rounded-3xl shadow-2xl p-4 md:p-6 mb-4 animate-fade-in hover-lift">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-800 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              Penilaian Calon Siswa (Skala 1-5)
            </h3>
            <button
              type="button"
              onClick={() => setShowGuideAnak((v) => !v)}
              aria-expanded={showGuideAnak}
              title={levelTooltip}
              className="text-sm px-4 py-2 md:px-3 md:py-1 rounded-lg border border-gray-300 text-gray-700 hover:border-emerald-400 hover:text-emerald-600"
            >
              Panduan
            </button>
          </div>
          {/* Panduan lengkap */}
          {showGuideAnak && (
            <div className="mb-3">
              <RubricGuide variant="anak" onClose={() => setShowGuideAnak(false)} />
            </div>
          )}
          <div className="space-y-4">
            {penilaian.anak.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">
                    {index + 1}. {item}
                  </p>
                  {rubrikSantri[item] && (
                    <button
                      onClick={() => toggleAnakItem(index)}
                      className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      title="Lihat indikator penilaian"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-gray-600 transition-transform ${expandedAnakItems.has(index) ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                  )}
                </div>
                {expandedAnakItems.has(index) && rubrikSantri[item] && (
                  <div className="mb-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                    <p className="text-xs text-blue-800 font-medium">
                      {rubrikSantri[item]}
                    </p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <label
                      key={score}
                      className={getScoreClasses(score, penilaianAnak[item] === score)}
                      title={`Skor ${score} — ${score === 1 ? 'Sangat kurang' : score === 2 ? 'Kurang' : score === 3 ? 'Cukup' : score === 4 ? 'Baik' : 'Sangat baik'}`}
                    >
                      <input
                        type="radio"
                        name={`anak-${index}`}
                        value={score}
                        checked={penilaianAnak[item] === score}
                        onChange={() => onPenilaianAnakChange(item, score)}
                        className="sr-only"
                      />
                      <span className="font-bold">{score}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Penilaian Orang Tua */}
        <div className="glass rounded-3xl shadow-2xl p-4 md:p-6 mb-4 animate-fade-in hover-lift">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-800 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              Penilaian Orang Tua (Skala 1-5)
            </h3>
            <button
              type="button"
              onClick={() => setShowGuideOrtu((v) => !v)}
              aria-expanded={showGuideOrtu}
              title={levelTooltip}
              className="text-sm px-4 py-2 md:px-3 md:py-1 rounded-lg border border-gray-300 text-gray-700 hover:border-emerald-400 hover:text-emerald-600"
            >
              Panduan
            </button>
          </div>
          {/* Panduan lengkap */}
          {showGuideOrtu && (
            <div className="mb-3">
              <RubricGuide variant="ortu" onClose={() => setShowGuideOrtu(false)} />
            </div>
          )}
          <div className="space-y-4">
            {penilaian.ortu.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">
                    {index + 1}. {item}
                  </p>
                  {rubrikOrtu[item] && (
                    <button
                      onClick={() => toggleOrtuItem(index)}
                      className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      title="Lihat indikator penilaian"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-gray-600 transition-transform ${expandedOrtuItems.has(index) ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                  )}
                </div>
                {expandedOrtuItems.has(index) && rubrikOrtu[item] && (
                  <div className="mb-3 p-3 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg">
                    <p className="text-xs text-purple-800 font-medium">
                      {rubrikOrtu[item]}
                    </p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <label
                      key={score}
                      className={getScoreClasses(score, penilaianOrtu[item] === score)}
                      title={`Skor ${score} — ${score === 1 ? 'Sangat kurang' : score === 2 ? 'Kurang' : score === 3 ? 'Cukup' : score === 4 ? 'Baik' : 'Sangat baik'}`}
                    >
                      <input
                        type="radio"
                        name={`ortu-${index}`}
                        value={score}
                        checked={penilaianOrtu[item] === score}
                        onChange={() => onPenilaianOrtuChange(item, score)}
                        className="sr-only"
                      />
                      <span className="font-bold">{score}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tes Matematika - Hanya untuk SMP dan SMA */}
        {selectedStudent.lembaga !== 'SDITA' && (
          <div className="glass rounded-3xl shadow-2xl p-4 md:p-6 mb-4 animate-fade-in hover-lift">
            <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🔢</span> Tes Matematika (5 soal)
            </h3>
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-gray-700">Jumlah benar:</label>
              <input
                type="number"
                min={0}
                max={5}
                value={mathCorrect}
                onChange={(e) => onMathCorrectChange?.(parseInt(e.target.value || '0', 10))}
                className="w-24 border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all bg-white/50 backdrop-blur-sm font-bold text-center"
                aria-label="Jumlah jawaban benar matematika"
              />
              <span className="text-sm text-gray-600 font-medium">dari 5 soal</span>
            </div>
          </div>
        )}

        {/* Tes Hafalan - Hanya untuk SMP dan SMA */}
        {selectedStudent.lembaga !== 'SDITA' && (
          <div className="glass rounded-3xl shadow-2xl p-4 md:p-6 mb-4 animate-fade-in hover-lift">
            <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📖</span> Tes Hafalan (15 baris)
            </h3>
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-gray-700">Jumlah baris benar:</label>
              <input
                type="number"
                min={0}
                max={15}
                value={hafalanBenar}
                onChange={(e) => onHafalanBenarChange?.(parseInt(e.target.value || '0', 10))}
                className="w-24 border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all bg-white/50 backdrop-blur-sm font-bold text-center"
                aria-label="Jumlah baris hafalan benar"
              />
              <span className="text-sm text-gray-600 font-medium">dari 15 baris</span>
            </div>
          </div>
        )}

        {/* Informasi Tambahan */}
        <div className="glass rounded-3xl shadow-2xl p-4 md:p-6 mb-4 animate-fade-in hover-lift">
          <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📝</span> Informasi Tambahan
          </h3>

          {/* Riwayat Penyakit */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Riwayat Penyakit Calon Santri
            </label>
            <textarea
              value={riwayatPenyakit}
              onChange={(e) => onRiwayatPenyakitChange?.(e.target.value)}
              placeholder="Catatan riwayat penyakit, alergi, atau kondisi kesehatan khusus..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all bg-white/50 backdrop-blur-sm font-medium resize-none text-gray-900"
              rows={3}
              aria-label="Riwayat penyakit calon santri"
            />
          </div>

          {/* Pekerjaan Orang Tua */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Pekerjaan Orang Tua
            </label>
            <textarea
              value={pekerjaanOrangTua}
              onChange={(e) => onPekerjaanOrangTuaChange?.(e.target.value)}
              placeholder="Jabatan, perusahaan, atau bidang pekerjaan orang tua..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all bg-white/50 backdrop-blur-sm font-medium resize-none text-gray-900"
              rows={3}
              aria-label="Pekerjaan orang tua"
            />
          </div>

          {/* Catatan Penguji */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Catatan Penguji
            </label>
            <textarea
              value={catatanPenguji || ''}
              onChange={(e) => onCatatanPengujiChange?.(e.target.value)}
              placeholder="Catatan khusus dari penguji mengenai calon santri dan orang tua..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-green-100 focus:border-green-400 transition-all bg-white/50 backdrop-blur-sm font-medium resize-none text-gray-900"
              rows={4}
              aria-label="Catatan penguji"
            />
          </div>
        </div>

        {/* Hasil Kelulusan */}
        <div className="glass rounded-3xl shadow-2xl p-4 md:p-6 mb-24 animate-fade-in hover-lift">
          <h3 className="text-2xl font-black text-gray-800 mb-3 flex items-center">
            <span className="mr-2">🎯</span> Hasil Kelulusan
          </h3>
          {selectedStudent.lembaga === 'SDITA' ? (
            <>
              <p className="text-sm text-gray-600 mb-4 font-medium">KKM 70 dengan bobot: Wawancara 100%</p>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg hover-lift">
                  <div className="text-sm text-white/90 font-semibold mb-1">Wawancara (100%)</div>
                  <div className="text-3xl font-black text-white">{hasil.breakdown.interview.toFixed(1)}%</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4 font-medium">KKM 70 dengan bobot: Wawancara 30%, Matematika 35%, Hafalan 35%</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg hover-lift">
                  <div className="text-sm text-white/90 font-semibold mb-1">Wawancara (30%)</div>
                  <div className="text-3xl font-black text-white">{((hasil.breakdown.interview / 100) * 30).toFixed(1)}%</div>
                </div>
                <div className="p-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg hover-lift">
                  <div className="text-sm text-white/90 font-semibold mb-1">Matematika (35%)</div>
                  <div className="text-3xl font-black text-white">{((hasil.breakdown.math / 100) * 35).toFixed(1)}%</div>
                </div>
                <div className="p-5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg hover-lift">
                  <div className="text-sm text-white/90 font-semibold mb-1">Hafalan (35%)</div>
                  <div className="text-3xl font-black text-white">{((hasil.breakdown.hafalan / 100) * 35).toFixed(1)}%</div>
                </div>
              </div>
            </>
          )}
          <div className={`p-6 rounded-2xl border-4 flex items-center justify-between shadow-xl ${hasil.status === 'LULUS'
            ? 'bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-400'
            : hasil.status === 'CADANGAN'
              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-400'
              : 'bg-gradient-to-r from-red-100 to-pink-100 border-red-400'
            }`}>
            <div>
              <div className="text-sm font-bold text-gray-700 mb-1">Nilai Akhir</div>
              <div className="text-5xl font-black text-gray-900">{hasil.finalScore.toFixed(2)}</div>
            </div>
            <div className={`text-3xl font-black px-6 py-3 rounded-2xl shadow-lg ${hasil.status === 'LULUS'
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
              : hasil.status === 'CADANGAN'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
              }`}>
              {hasil.status === 'LULUS' ? '✓ LULUS' : hasil.status === 'CADANGAN' ? '⚠ CADANGAN' : '✗ TIDAK LULUS'}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-4 glass rounded-2xl shadow-2xl p-4 animate-fade-in">
          <button
            onClick={onSave}
            className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white py-4 rounded-xl font-black text-lg hover:shadow-2xl transition-all transform hover:scale-[1.02] flex items-center justify-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative z-10 flex items-center">
              <Check className="w-6 h-6 mr-2" />
              💾 Simpan Penilaian
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenilaianScreen;

