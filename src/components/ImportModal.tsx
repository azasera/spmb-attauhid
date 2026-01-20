import React, { useState } from 'react';
import { X, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { LembagaData } from '../types';
import { parseExcelFile, importStudentsToDatabase, downloadImportTemplate, ParsedStudent } from '../utils/importUtils';
import { formatTanggalSingkat } from '../utils/helpers';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLembaga: LembagaData;
  onImportComplete: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  selectedLembaga,
  onImportComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedStudent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      alert('File harus berformat Excel (.xlsx atau .xls)');
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);

    try {
      const parsed = await parseExcelFile(selectedFile);
      setParsedData(parsed);
      setStep('preview');
    } catch (error) {
      alert('Gagal membaca file: ' + (error as Error).message);
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!parsedData.length) return;

    setIsProcessing(true);
    try {
      const result = await importStudentsToDatabase(
        parsedData,
        selectedLembaga.id,
        selectedLembaga.name
      );
      setImportResult(result);
      setStep('result');

      if (result.successCount > 0) {
        onImportComplete();
      }
    } catch (error) {
      alert('Gagal import data: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setImportResult(null);
    setStep('upload');
    onClose();
  };

  const validCount = parsedData.filter(p => p.isValid).length;
  const invalidCount = parsedData.filter(p => !p.isValid).length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black">Import Data Santri</h2>
                <p className="text-emerald-50 text-sm">{selectedLembaga.fullName}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Download Template */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-bold text-blue-900 mb-1">Download Template Excel</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Download template Excel terlebih dahulu untuk memastikan format data sesuai
                    </p>
                    <button
                      onClick={downloadImportTemplate}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Template
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-emerald-400 transition-all">
                <input
                  type="file"
                  id="excel-upload"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isProcessing}
                />
                <label
                  htmlFor="excel-upload"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <Upload className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800 mb-1">
                      {isProcessing ? 'Memproses file...' : 'Pilih File Excel'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Format: .xlsx atau .xls
                    </p>
                  </div>
                  {file && (
                    <div className="px-4 py-2 bg-emerald-100 rounded-xl">
                      <p className="text-sm font-semibold text-emerald-700">{file.name}</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <h3 className="font-bold text-gray-800 mb-3">📋 Petunjuk Import:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">1.</span>
                    <span>Download template Excel dan isi data sesuai format</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">2.</span>
                    <span>Hanya Nama Calon Siswa yang wajib, kolom lain boleh kosong</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">3.</span>
                    <span>Format tanggal: YYYY-MM-DD atau DD/MM/YYYY (jika diisi)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">4.</span>
                    <span>Jenis Kelamin: "Laki-laki" atau "Perempuan" (jika diisi)</span>
                  </li>
                </ul>
              </div>

              {/* Warning Duplikat */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-blue-900 mb-1">✨ Mode Import: Update Data Kosong</h3>
                    <p className="text-sm text-blue-700 mb-2">
                      Sistem akan otomatis:
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1 ml-4">
                      <li>• <strong>Jika siswa sudah ada:</strong> Melengkapi kolom yang kosong saja</li>
                      <li>• <strong>Jika siswa belum ada:</strong> Menambah data baru</li>
                      <li>• <strong>Data yang sudah terisi:</strong> TIDAK akan ditimpa ✅</li>
                      <li>• <strong>Data tes:</strong> Tetap aman, tidak berubah ✅</li>
                    </ul>
                    <p className="text-sm text-blue-700 mt-2 font-semibold">
                      💡 Cocok untuk melengkapi data yang belum lengkap!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-black text-blue-600">{parsedData.length}</p>
                  <p className="text-sm font-semibold text-blue-700">Total Baris</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-black text-green-600">{validCount}</p>
                  <p className="text-sm font-semibold text-green-700">Valid</p>
                </div>
                <div className="bg-red-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-black text-red-600">{invalidCount}</p>
                  <p className="text-sm font-semibold text-red-700">Error</p>
                </div>
              </div>

              {/* Error List */}
              {invalidCount > 0 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 max-h-60 overflow-y-auto">
                  <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Data dengan Error ({invalidCount})
                  </h3>
                  <div className="space-y-2">
                    {parsedData
                      .filter(p => !p.isValid)
                      .map((p, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-3">
                          <p className="text-sm font-bold text-red-700">Baris {p.rowNumber}</p>
                          <p className="text-sm text-red-600">{p.errors.join(', ')}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {p.formData.namaSiswa || '(Nama kosong)'}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Valid Data Preview */}
              {validCount > 0 && (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
                  <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Data Valid ({validCount})
                  </h3>
                  <div className="bg-white rounded-xl overflow-hidden">
                    <div className="max-h-60 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100 sticky top-0">
                          <tr>
                            <th className="px-3 py-2 text-left font-bold">Nama Siswa</th>
                            <th className="px-3 py-2 text-left font-bold">Orang Tua</th>
                            <th className="px-3 py-2 text-left font-bold">Tanggal Tes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parsedData
                            .filter(p => p.isValid)
                            .map((p, idx) => (
                              <tr key={idx} className="border-t border-gray-100">
                                <td className="px-3 py-2">{p.formData.namaSiswa}</td>
                                <td className="px-3 py-2">{p.formData.namaOrangTua}</td>
                                <td className="px-3 py-2">{formatTanggalSingkat(p.formData.tanggalTes)}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setFile(null);
                    setParsedData([]);
                    setStep('upload');
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleImport}
                  disabled={validCount === 0 || isProcessing}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Mengimport...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Import {validCount} Data
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'result' && importResult && (
            <div className="space-y-6">
              {/* Result Summary */}
              <div className={`${importResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border-2 rounded-2xl p-6 text-center`}>
                <div className={`w-16 h-16 ${importResult.success ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {importResult.success ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <h3 className={`text-2xl font-black ${importResult.success ? 'text-green-900' : 'text-red-900'} mb-2`}>
                  {importResult.success ? 'Import Berhasil!' : 'Import Selesai dengan Error'}
                </h3>
                <p className={`${importResult.success ? 'text-green-700' : 'text-red-700'} font-semibold`}>
                  {importResult.successCount} data berhasil diimport
                  {importResult.failedCount > 0 && `, ${importResult.failedCount} data gagal`}
                </p>
              </div>

              {/* Error Details */}
              {importResult.errors.length > 0 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 max-h-60 overflow-y-auto">
                  <h3 className="font-bold text-red-900 mb-3">Detail Error:</h3>
                  <div className="space-y-2">
                    {importResult.errors.map((err: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-xl p-3">
                        <p className="text-sm font-bold text-red-700">Baris {err.row}</p>
                        <p className="text-sm text-red-600">{err.error}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold transition-all"
              >
                Selesai
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
