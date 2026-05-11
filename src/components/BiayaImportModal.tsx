import React, { useState } from 'react';
import { X, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { BiayaItem } from '../types';
import { downloadBiayaTemplate, parseBiayaExcelFile, ParsedBiayaItem } from '../utils/biayaUtils';

interface BiayaImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingItems: BiayaItem[];
  onImportComplete: (items: BiayaItem[]) => Promise<void>;
}

const BiayaImportModal: React.FC<BiayaImportModalProps> = ({
  isOpen,
  onClose,
  existingItems,
  onImportComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedBiayaItem[]>([]);
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<{ successCount: number; failedCount: number; errors: string[] } | null>(null);

  if (!isOpen) return null;

  const validCount = parsedRows.filter((row) => row.isValid).length;
  const invalidCount = parsedRows.filter((row) => !row.isValid).length;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      alert('File harus berformat Excel (.xlsx atau .xls)');
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);

    try {
      const parsed = await parseBiayaExcelFile(selectedFile);
      setParsedRows(parsed);
      setStep('preview');
    } catch (error) {
      alert('Gagal membaca file: ' + (error as Error).message);
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!parsedRows.length) return;

    setIsProcessing(true);
    try {
      const validRows = parsedRows.filter((row) => row.isValid);
      const mergedItems = [...existingItems];
      const normalized = (value: string) => value.trim().toLowerCase();

      validRows.forEach((row) => {
        const duplicateIndex = mergedItems.findIndex((item) =>
          normalized(item.category) === normalized(row.item.category) &&
          normalized(item.name) === normalized(row.item.name)
        );

        if (duplicateIndex >= 0) {
          mergedItems[duplicateIndex] = {
            ...mergedItems[duplicateIndex],
            amount: row.item.amount,
            description: row.item.description || mergedItems[duplicateIndex].description,
            updatedAt: new Date().toISOString()
          };
        } else {
          mergedItems.push(row.item);
        }
      });

      await onImportComplete(mergedItems);
      setImportResult({
        successCount: validRows.length,
        failedCount: invalidCount,
        errors: parsedRows.filter((row) => !row.isValid).map((row) => `Baris ${row.rowNumber}: ${row.errors.join(', ')}`)
      });
      setStep('result');
    } catch (error) {
      alert('Gagal import biaya: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setParsedRows([]);
    setStep('upload');
    setImportResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black">Import Data Biaya</h2>
                <p className="text-sm text-emerald-100">Gunakan file Excel untuk menambah atau memperbarui rencana biaya.</p>
              </div>
            </div>
            <button onClick={handleClose} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/40 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          {step === 'upload' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-3xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-blue-900">Download Template Excel</h3>
                    <p className="text-sm text-blue-700">Isi template dengan kolom Kategori, Rincian Biaya, Nominal, Deskripsi.</p>
                  </div>
                  <button
                    type="button"
                    onClick={downloadBiayaTemplate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download Template
                  </button>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-3xl p-10 text-center hover:border-emerald-400 transition">
                <input id="biaya-excel-upload" type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileChange} disabled={isProcessing} />
                <label htmlFor="biaya-excel-upload" className="cursor-pointer flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{isProcessing ? 'Memproses file...' : 'Pilih File Excel'}</p>
                    <p className="text-sm text-gray-600">Format: .xlsx atau .xls</p>
                  </div>
                  {file && <div className="text-sm font-medium text-emerald-700">{file.name}</div>}
                </label>
              </div>

              <div className="bg-gray-50 rounded-3xl p-4 text-sm text-gray-700">
                <p className="font-semibold mb-2">Panduan Import:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Isi kolom Kategori, Rincian Biaya, Nominal.</li>
                  <li>Nominal harus angka tanpa titik atau simbol.</li>
                  <li>Deskripsi bersifat opsional.</li>
                  <li>Jika produk sudah ada, nominal dan deskripsi akan diperbarui.</li>
                </ul>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-3xl p-4 text-center">
                  <p className="text-3xl font-black text-green-700">{parsedRows.length}</p>
                  <p className="text-sm text-green-800">Total Baris</p>
                </div>
                <div className="bg-blue-50 rounded-3xl p-4 text-center">
                  <p className="text-3xl font-black text-blue-700">{validCount}</p>
                  <p className="text-sm text-blue-800">Valid</p>
                </div>
                <div className="bg-red-50 rounded-3xl p-4 text-center">
                  <p className="text-3xl font-black text-red-700">{invalidCount}</p>
                  <p className="text-sm text-red-800">Error</p>
                </div>
              </div>

              {invalidCount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-3xl p-4 max-h-64 overflow-y-auto">
                  <div className="flex items-center gap-2 text-red-900 font-semibold mb-3">
                    <AlertCircle className="w-5 h-5" />
                    Data tidak valid
                  </div>
                  <div className="space-y-3 text-sm text-red-700">
                    {parsedRows.filter((row) => !row.isValid).map((row) => (
                      <div key={row.rowNumber} className="bg-white rounded-2xl p-3 shadow-sm">
                        <p className="font-semibold">Baris {row.rowNumber}</p>
                        <p>{row.errors.join(', ')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-3xl border border-gray-200 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">Siap diimpor</h3>
                    <p className="text-sm text-gray-600">{validCount} baris valid akan disimpan.</p>
                  </div>
                  <button
                    type="button"
                    disabled={isProcessing || validCount === 0}
                    onClick={handleImport}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Import Biaya
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'result' && importResult && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-emerald-900">
                <p className="font-bold text-lg">Import selesai</p>
                <p className="mt-2 text-sm">Berhasil: {importResult.successCount}, Gagal: {importResult.failedCount}</p>
              </div>
              {importResult.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-3xl p-4 text-red-700 text-sm">
                  <p className="font-semibold mb-3">Kesalahan:</p>
                  <ul className="list-disc list-inside space-y-2">
                    {importResult.errors.slice(0, 5).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {importResult.errors.length > 5 && <li>...dan {importResult.errors.length - 5} error lainnya</li>}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiayaImportModal;
