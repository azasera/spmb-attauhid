import React, { useState, useEffect } from 'react';
import { Download, Upload, RefreshCw, Trash2, Database, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { backupService, BackupRecord } from '../utils/backupService';
import Toast from './Toast';

interface BackupScreenProps {
  currentUser: any;
  onBack?: () => void;
}

export const BackupScreen: React.FC<BackupScreenProps> = ({ currentUser, onBack }) => {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    setLoading(true);
    const backupList = await backupService.listBackups();
    setBackups(backupList);
    setLoading(false);
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    const result = await backupService.createBackup('manual', currentUser?.name);
    
    if (result.success) {
      setToast({ message: `Backup berhasil dibuat: ${result.filename}`, type: 'success' });
      await loadBackups();
    } else {
      setToast({ message: `Gagal membuat backup: ${result.error}`, type: 'error' });
    }
    setLoading(false);
  };

  const handleDownloadBackup = async (filename: string) => {
    setLoading(true);
    const result = await backupService.downloadBackupToLocal(filename);
    
    if (result.success) {
      setToast({ message: 'Backup berhasil didownload', type: 'success' });
    } else {
      setToast({ message: `Gagal download backup: ${result.error}`, type: 'error' });
    }
    setLoading(false);
  };

  const handleRestoreBackup = async (filename: string) => {
    if (!confirm(`Apakah Anda yakin ingin restore data dari backup "${filename}"?\n\nData saat ini akan diganti dengan data dari backup.`)) {
      return;
    }

    setLoading(true);
    const result = await backupService.restoreBackup(filename);
    
    if (result.success) {
      setToast({ message: 'Data berhasil di-restore dari backup', type: 'success' });
      setTimeout(() => window.location.reload(), 2000);
    } else {
      setToast({ message: `Gagal restore backup: ${result.error}`, type: 'error' });
    }
    setLoading(false);
  };

  const handleDeleteBackup = async (filename: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus backup "${filename}"?`)) {
      return;
    }

    setLoading(true);
    const result = await backupService.deleteBackup(filename);
    
    if (result.success) {
      setToast({ message: 'Backup berhasil dihapus', type: 'success' });
      await loadBackups();
    } else {
      setToast({ message: `Gagal menghapus backup: ${result.error}`, type: 'error' });
    }
    setLoading(false);
  };

  const handleExportJSON = async () => {
    setLoading(true);
    const result = await backupService.exportToJSON(currentUser?.name);
    
    if (result.success) {
      setToast({ message: 'Data berhasil di-export ke JSON', type: 'success' });
    } else {
      setToast({ message: `Gagal export data: ${result.error}`, type: 'error' });
    }
    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/json') {
      setSelectedFile(file);
    } else {
      setToast({ message: 'Pilih file JSON yang valid', type: 'error' });
    }
  };

  const handleImportJSON = async () => {
    if (!selectedFile) {
      setToast({ message: 'Pilih file backup terlebih dahulu', type: 'error' });
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin import data dari "${selectedFile.name}"?\n\nData saat ini akan diganti dengan data dari file backup.`)) {
      return;
    }

    setLoading(true);
    const result = await backupService.importFromJSON(selectedFile);
    
    if (result.success) {
      setToast({ message: 'Data berhasil di-import dari file', type: 'success' });
      setSelectedFile(null);
      setTimeout(() => window.location.reload(), 2000);
    } else {
      setToast({ message: `Gagal import data: ${result.error}`, type: 'error' });
    }
    setLoading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Kembali"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
              )}
              <Database className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Backup & Restore Data</h1>
            </div>
            <button
              onClick={loadBackups}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Info Auto Backup */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Auto Backup Aktif</h3>
              <p className="text-sm text-blue-700">
                Sistem akan otomatis membuat backup setiap 24 jam. Backup manual juga tersedia kapan saja.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={handleCreateBackup}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Database className="w-5 h-5" />
              Buat Backup Manual
            </button>

            <button
              onClick={handleExportJSON}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export ke JSON
            </button>
          </div>

          {/* Import Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Import dari File JSON
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleImportJSON}
                disabled={loading || !selectedFile}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                Import Data
              </button>
            </div>
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                File terpilih: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>

          {/* Backup List */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Riwayat Backup ({backups.length})
            </h3>

            {loading && backups.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                Memuat data backup...
              </div>
            ) : backups.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada backup tersedia</p>
                <p className="text-sm mt-1">Buat backup pertama Anda sekarang</p>
              </div>
            ) : (
              <div className="space-y-3">
                {backups.map((backup) => (
                  <div
                    key={backup.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-800">{backup.filename}</h4>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          backup.type === 'auto' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {backup.type === 'auto' ? 'Auto' : 'Manual'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(backup.timestamp)} • {formatFileSize(backup.size)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadBackup(backup.filename)}
                        disabled={loading}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRestoreBackup(backup.filename)}
                        disabled={loading}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Restore"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBackup(backup.filename)}
                        disabled={loading}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Perhatian:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Restore akan mengganti semua data saat ini dengan data dari backup</li>
                  <li>Sistem akan otomatis membuat backup sebelum melakukan restore</li>
                  <li>Data user tidak di-restore untuk alasan keamanan</li>
                  <li>Simpan backup penting di lokasi yang aman</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
