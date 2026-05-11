import React, { useState, useEffect } from 'react';
import { User as UserType, CostItem } from '../types';
import {
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  ArrowLeft,
  Upload,
  Download,
  Calculator,
  Filter
} from 'lucide-react';
import { lembagaData } from '../data/constants';
import { defaultCostItems } from '../data/costDefaultData';

interface CostManagementScreenProps {
  currentUser: UserType;
  onBack: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

interface CostFormData {
  rowNumber: string;
  sequence: number;
  name: string;
  category: string;
  amount: number;
  description: string;
  lembaga: string;
}

const CostManagementScreen: React.FC<CostManagementScreenProps> = ({
  currentUser,
  onBack,
  showToast
}) => {
  const [costs, setCosts] = useState<CostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCost, setSelectedCost] = useState<CostItem | null>(null);
  const [formData, setFormData] = useState<CostFormData>({
    rowNumber: '',
    sequence: 0,
    name: '',
    category: '',
    amount: 0,
    description: '',
    lembaga: ''
  });
  const [formError, setFormError] = useState('');
  const [filterLembaga, setFilterLembaga] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [importing, setImporting] = useState(false);

  // Load costs from Supabase
  useEffect(() => {
    loadCosts();
  }, []);

  const loadCosts = async () => {
    setLoading(true);
    try {
      const { supabase, TABLES } = await import('../lib/supabase');
      const { data, error } = await supabase
        .from(TABLES.COSTS)
        .select('*')
        .order('sequence', { ascending: true });

      if (error) throw error;
      const costsFromDb = data || [];

      if (costsFromDb.length === 0) {
        const costsToInsert = defaultCostItems.map((cost) => ({
          ...cost,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: currentUser.username
        }));

        const { data: insertedCosts, error: insertError } = await supabase
          .from(TABLES.COSTS)
          .insert(costsToInsert)
          .select();

        if (insertError) throw insertError;
        setCosts(insertedCosts || []);
      } else {
        setCosts(costsFromDb);
      }
    } catch (e: any) {
      console.error('Gagal memuat data biaya:', e);
      showToast('Gagal memuat data biaya', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      rowNumber: '',
      sequence: 0,
      name: '',
      category: '',
      amount: 0,
      description: '',
      lembaga: ''
    });
    setSelectedCost(null);
    setFormError('');
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const handleOpenEditModal = (cost: CostItem) => {
    setSelectedCost(cost);
    setFormData({
      rowNumber: cost.rowNumber || '',
      sequence: cost.sequence || 0,
      name: cost.name,
      category: cost.category,
      amount: cost.amount,
      description: cost.description || '',
      lembaga: cost.lembaga || ''
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.category.trim() || formData.amount <= 0) {
      setFormError('Nama, kategori, dan jumlah harus diisi dengan benar!');
      return;
    }

    try {
      const { supabase, TABLES } = await import('../lib/supabase');

      const costData = {
        rowNumber: formData.rowNumber?.trim() || undefined,
        sequence: formData.sequence || 0,
        name: formData.name.trim(),
        category: formData.category.trim(),
        amount: formData.amount,
        description: formData.description.trim(),
        lembaga: formData.lembaga || null,
        updatedAt: new Date().toISOString(),
        createdBy: currentUser.username
      };

      if (modalMode === 'create') {
        const newCost = {
          ...costData,
          id: `cost-${Date.now()}`,
          createdAt: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from(TABLES.COSTS)
          .insert([newCost])
          .select()
          .single();

        if (error) throw error;
        setCosts(prev => [data, ...prev]);
        showToast('Biaya berhasil ditambahkan', 'success');
      } else if (modalMode === 'edit' && selectedCost) {
        const { data, error } = await supabase
          .from(TABLES.COSTS)
          .update(costData)
          .eq('id', selectedCost.id)
          .select()
          .single();

        if (error) throw error;
        setCosts(prev => prev.map(cost => cost.id === selectedCost.id ? data : cost));
        showToast('Biaya berhasil diperbarui', 'success');
      }

      handleCloseModal();
    } catch (e: any) {
      setFormError(e?.message || 'Gagal menyimpan data biaya');
      showToast('Gagal menyimpan data biaya', 'error');
    }
  };

  const handleDelete = async (cost: CostItem) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus biaya "${cost.name}"?`)) {
      try {
        const { supabase, TABLES } = await import('../lib/supabase');
        const { error } = await supabase
          .from(TABLES.COSTS)
          .delete()
          .eq('id', cost.id);

        if (error) throw error;
        setCosts(prev => prev.filter(c => c.id !== cost.id));
        showToast('Biaya berhasil dihapus', 'success');
      } catch (e: any) {
        showToast('Gagal menghapus biaya', 'error');
      }
    }
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const { importCostsFromExcel } = await import('../utils/costImportUtils');
      const importedCosts = await importCostsFromExcel(file);

      const { supabase, TABLES } = await import('../lib/supabase');
      const { data, error } = await supabase
        .from(TABLES.COSTS)
        .insert(importedCosts.map(cost => ({
          ...cost,
          createdBy: currentUser.username,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })))
        .select();

      if (error) throw error;
      setCosts(prev => [...data, ...prev]);
      showToast(`Berhasil mengimpor ${data.length} data biaya`, 'success');
    } catch (e: any) {
      showToast(`Gagal mengimpor: ${e.message}`, 'error');
    } finally {
      setImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleExportExcel = async () => {
    try {
      const { exportCostsToExcel } = await import('../utils/costImportUtils');
      await exportCostsToExcel(filteredCosts);
      showToast('Data biaya berhasil diekspor', 'success');
    } catch (e: any) {
      showToast('Gagal mengekspor data', 'error');
    }
  };

  const filteredCosts = costs.filter(cost => {
    const matchesLembaga = !filterLembaga || cost.lembaga === filterLembaga;
    const matchesCategory = !filterCategory || cost.category.toLowerCase().includes(filterCategory.toLowerCase());
    return matchesLembaga && matchesCategory;
  });

  const totalAmount = filteredCosts.reduce((sum, cost) => sum + cost.amount, 0);

  const categories = [...new Set(costs.map(cost => cost.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-400 to-teal-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mx-auto mb-4"></div>
          <p className="text-white font-semibold">Memuat data biaya...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-400 to-teal-500 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <div className="glass border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-3 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm transform hover:scale-110"
                aria-label="Kembali"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-white to-green-50 p-3 rounded-2xl mr-3 shadow-xl">
                  <DollarSign className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white drop-shadow-lg">💰 Manajemen Biaya</h1>
                  <p className="text-sm text-white/90 font-medium drop-shadow">Kelola biaya operasional SPMB</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportExcel}
                className="flex items-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold"
              >
                <Download className="w-5 h-5 mr-2" />
                Export Excel
              </button>
              <label className="flex items-center px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold cursor-pointer">
                <Upload className="w-5 h-5 mr-2" />
                Import Excel
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImportExcel}
                  disabled={importing}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleOpenCreateModal}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-white to-green-50 text-green-700 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tambah Biaya
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Summary Card */}
        <div className="glass rounded-3xl shadow-2xl p-6 mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-2xl shadow-lg">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-800">Total Biaya</h2>
                <p className="text-gray-600">Total semua biaya yang tercatat</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-green-600">
                Rp {totalAmount.toLocaleString('id-ID')}
              </div>
              <div className="text-sm text-gray-500">
                {filteredCosts.length} item{filteredCosts.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-3xl shadow-2xl p-6 mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-800">Filter Data</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lembaga</label>
              <select
                value={filterLembaga}
                onChange={(e) => setFilterLembaga(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Semua Lembaga</option>
                {lembagaData.map(lembaga => (
                  <option key={lembaga.id} value={lembaga.id}>{lembaga.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Semua Kategori</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cost Table */}
        <div className="glass rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="overflow-x-auto overflow-y-hidden">
            <div className="min-w-[1200px]">
              <table className="w-full">
              <thead className="bg-gradient-to-r from-green-100 to-emerald-100 border-b-2 border-green-200">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-black text-green-700 uppercase tracking-wider w-[280px] min-w-[200px]">
                    Nama Biaya
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-black text-green-700 uppercase tracking-wider w-[150px] min-w-[120px]">
                    Kategori
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-black text-green-700 uppercase tracking-wider w-[120px] min-w-[100px]">
                    Lembaga
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-black text-green-700 uppercase tracking-wider w-[120px] min-w-[100px]">
                    Jumlah
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-black text-green-700 uppercase tracking-wider w-[120px] min-w-[100px]">
                    Dibuat Oleh
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-black text-green-700 uppercase tracking-wider w-[120px] min-w-[100px]">
                    Tanggal
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-black text-green-700 uppercase tracking-wider w-[100px] min-w-[80px]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCosts.map((cost) => (
                  <tr key={cost.id} className="hover:bg-white/50 transition-all group">
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900 break-words">{cost.name}</div>
                      {cost.description && (
                        <div className="text-sm text-gray-500 mt-1 break-words">{cost.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {cost.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-gray-600 text-sm">
                        {cost.lembaga ? lembagaData.find(l => l.id === cost.lembaga)?.name || cost.lembaga : 'Umum'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="font-bold text-green-600 text-sm">
                        Rp {cost.amount.toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {cost.createdBy}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(cost.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleOpenEditModal(cost)}
                          className="p-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg rounded-lg transition-all transform hover:scale-110"
                          title="Edit Biaya"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cost)}
                          className="p-2 text-white bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-lg rounded-lg transition-all transform hover:scale-110"
                          title="Hapus Biaya"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>

          {filteredCosts.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Belum ada data biaya</p>
              <p className="text-sm text-gray-400 mt-1">Tambah biaya baru atau import dari Excel</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                {modalMode === 'create' && '➕ Tambah Biaya Baru'}
                {modalMode === 'edit' && '✏️ Edit Biaya'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-200 rounded-xl transition-all transform hover:scale-110"
                aria-label="Tutup"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Biaya
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Masukkan nama biaya"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No.
                  </label>
                  <input
                    type="text"
                    value={formData.rowNumber}
                    onChange={(e) => setFormData({ ...formData, rowNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Contoh: 1, 4a"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urutan
                  </label>
                  <input
                    type="number"
                    value={formData.sequence}
                    onChange={(e) => setFormData({ ...formData, sequence: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Contoh: 4, 4.1"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Contoh: SPP, Uang Pangkal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah (Rp)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lembaga (Opsional)
                </label>
                <select
                  value={formData.lembaga}
                  onChange={(e) => setFormData({ ...formData, lembaga: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Umum (Semua Lembaga)</option>
                  {lembagaData.map(lembaga => (
                    <option key={lembaga.id} value={lembaga.id}>{lembaga.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi (Opsional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Deskripsi tambahan..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-bold transform hover:scale-105"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-xl transition-all flex items-center justify-center font-bold transform hover:scale-105"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Loading Overlay */}
      {importing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass rounded-3xl shadow-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-800 font-semibold">Mengimpor data dari Excel...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostManagementScreen;