import React, { useEffect, useMemo, useState } from 'react';
import { PlusCircle, Upload, Trash2, Edit3, Download, CheckCircle, ChevronRight } from 'lucide-react';
import { BiayaItem } from '../types';
import { loadBiayaConfig, saveBiayaConfig } from '../utils/biayaUtils';
import BiayaImportModal from './BiayaImportModal';

const formatAmount = (amount: number) => {
  return amount.toLocaleString('id-ID');
};

const BiayaManagement: React.FC = () => {
  const [items, setItems] = useState<BiayaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ id: '', category: '', name: '', amount: '', description: '' });
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      const loaded = await loadBiayaConfig();
      setItems(loaded);
      setIsLoading(false);
    };

    loadItems();
  }, []);

  const btnLabel = editMode ? 'Perbarui Biaya' : 'Tambah Biaya';

  const resetForm = () => {
    setForm({ id: '', category: '', name: '', amount: '', description: '' });
    setEditMode(false);
  };

  const handleEdit = (item: BiayaItem) => {
    setForm({
      id: item.id,
      category: item.category,
      name: item.name,
      amount: String(item.amount),
      description: item.description || ''
    });
    setEditMode(true);
  };

  const handleDelete = async (itemId: string) => {
    const confirmed = window.confirm('Hapus biaya ini dari daftar?');
    if (!confirmed) return;
    const nextItems = items.filter((item) => item.id !== itemId);
    setItems(nextItems);
    await saveBiayaConfig(nextItems);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const category = form.category.trim();
    const name = form.name.trim();
    const amount = Number(form.amount.replace(/[^0-9\-]/g, ''));

    if (!category || !name || Number.isNaN(amount) || amount <= 0) {
      alert('Kategori, rincian, dan nominal harus diisi dengan benar.');
      return;
    }

    setIsSaving(true);

    const nextItems = [...items];
    if (editMode && form.id) {
      const index = nextItems.findIndex((item) => item.id === form.id);
      if (index >= 0) {
        nextItems[index] = {
          ...nextItems[index],
          category,
          name,
          amount,
          description: form.description.trim(),
          updatedAt: new Date().toISOString()
        };
      }
    } else {
      nextItems.push({
        id: crypto.randomUUID(),
        category,
        name,
        amount,
        description: form.description.trim(),
        createdAt: new Date().toISOString()
      });
    }

    setItems(nextItems);
    await saveBiayaConfig(nextItems);
    setIsSaving(false);
    resetForm();
  };

  const handleImportSuccess = async (nextItems: BiayaItem[]) => {
    setItems(nextItems);
    await saveBiayaConfig(nextItems);
    setShowImportModal(false);
  };

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.amount, 0),
    [items]
  );

  const latestUpdate = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.createdAt).getTime();
      const bTime = new Date(b.updatedAt || b.createdAt).getTime();
      return bTime - aTime;
    });
    return sorted.length ? new Date(sorted[0].updatedAt || sorted[0].createdAt).toLocaleString('id-ID') : null;
  }, [items]);

  return (
    <div className="space-y-8">
      <div className="rounded-[40px] border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Bagian Admin</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Manajemen Biaya</h1>
            <p className="mt-2 text-sm text-slate-600">Tambahkan, sunting, atau impor daftar biaya untuk pengelolaan administrasi.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center gap-2 rounded-3xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 transition"
            >
              <Upload className="h-4 w-4" />
              Import dari Excel
            </button>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 transition"
            >
              <PlusCircle className="h-4 w-4" />
              Tambah Biaya Manual
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Jumlah Item</p>
            <p className="mt-3 text-3xl font-black text-slate-900">{items.length}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Total Nominal</p>
            <p className="mt-3 text-3xl font-black text-slate-900">Rp {formatAmount(totalAmount)}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Terakhir Diperbarui</p>
            <p className="mt-3 text-base font-semibold text-slate-900">{latestUpdate ?? 'Belum ada'}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-[40px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">Daftar Biaya</h2>
              <p className="mt-1 text-sm text-slate-600">Kelola biaya yang akan ditampilkan pada sistem.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
              <ChevronRight className="h-4 w-4" />
              {isLoading ? 'Memuat...' : 'Siap digunakan'}
            </span>
          </div>

          <div className="mt-6 overflow-x-auto rounded-[32px] border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4 font-semibold text-slate-700">Kategori</th>
                  <th className="px-5 py-4 font-semibold text-slate-700">Rincian</th>
                  <th className="px-5 py-4 font-semibold text-slate-700">Nominal</th>
                  <th className="px-5 py-4 font-semibold text-slate-700">Deskripsi</th>
                  <th className="px-5 py-4 font-semibold text-slate-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-500">Belum ada data biaya.</td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-4 font-semibold text-slate-900">{item.category}</td>
                      <td className="px-5 py-4 text-slate-700">{item.name}</td>
                      <td className="px-5 py-4 text-slate-700">Rp {formatAmount(item.amount)}</td>
                      <td className="px-5 py-4 text-slate-600">{item.description || '-'}</td>
                      <td className="px-5 py-4 text-slate-700">
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => handleEdit(item)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </button>
                          <button type="button" onClick={() => handleDelete(item.id)} className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition">
                            <Trash2 className="h-4 w-4" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[40px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-900">Tambah / Sunting Biaya</h2>
            <p className="mt-1 text-sm text-slate-600">Masukkan rincian biaya baru atau perbarui data yang sudah ada.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSave}>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Kategori</label>
              <input
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Contoh: SPP, Uang Pangkal"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Rincian Biaya</label>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Contoh: Pendaftaran, SPP Semester 1"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Nominal</label>
              <input
                type="text"
                value={form.amount}
                onChange={(event) => setForm({ ...form, amount: event.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Contoh: 1500000"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Deskripsi (opsional)</label>
              <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                className="mt-2 min-h-[120px] w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Catatan tambahan untuk biaya ini"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-3xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 transition disabled:opacity-50">
                <CheckCircle className="h-4 w-4" />
                {isSaving ? 'Menyimpan...' : btnLabel}
              </button>
              {editMode && (
                <button type="button" onClick={resetForm} className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition">
                  Batal
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Download className="h-4 w-4 text-slate-400" />
              Klik "Import dari Excel" untuk memuat beberapa biaya sekaligus.
            </div>
          </div>
        </section>
      </div>

      <BiayaImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        existingItems={items}
        onImportComplete={handleImportSuccess}
      />
    </div>
  );
};

export default BiayaManagement;
