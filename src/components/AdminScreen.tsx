import React, { useState, useEffect } from 'react';
import { User as UserType } from '../types';
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Key, 
  X, 
  Save,
  ArrowLeft,
  Shield,
  UserCheck,
  FileText,
  ChevronDown,
  ChevronUp,
  Database
} from 'lucide-react';

interface AdminScreenProps {
  users: UserType[];
  currentUser: UserType;
  onCreateUser: (userData: Omit<UserType, 'id' | 'createdAt'>) => Promise<{ success: boolean; message: string }>;
  onUpdateUser: (userId: string, updates: Partial<UserType>) => Promise<{ success: boolean; message: string }>;
  onDeleteUser: (userId: string) => Promise<{ success: boolean; message: string }>;
  onResetPassword: (userId: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  onBack: () => void;
  onOpenBackup: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

interface UserFormData {
  name: string;
  username: string;
  password: string;
  role: 'TU' | 'PENGUJI' | 'ADMIN';
}

const AdminScreen: React.FC<AdminScreenProps> = ({
  users,
  currentUser,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  onResetPassword,
  onBack,
  onOpenBackup,
  showToast
}) => {
  // Rubric guide editor state
  const [guideAnak, setGuideAnak] = useState('');
  const [guideOrtu, setGuideOrtu] = useState('');
  const [savingGuide, setSavingGuide] = useState(false);
  const [guideError, setGuideError] = useState<string | null>(null);
  const [activeGuideTab, setActiveGuideTab] = useState<'anak' | 'ortu'>('ortu');
  const [guidePanelOpen, setGuidePanelOpen] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'reset'>('create');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    username: '',
    password: '',
    role: 'TU'
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      password: '',
      role: 'TU'
    });
    setNewPassword('');
    setConfirmPassword('');
    setSelectedUser(null);
    setFormError('');
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const handleOpenEditModal = (user: UserType) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      password: '',
      role: user.role
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleOpenResetModal = (user: UserType) => {
    setSelectedUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setModalMode('reset');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Load rubric guides via Supabase
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { supabase, TABLES } = await import('../lib/supabase');
        const { data, error } = await supabase
          .from(TABLES.RUBRIC_GUIDES)
          .select('*');
        if (error) throw error;
        const anak = data?.find((d: any) => d.variant === 'anak')?.content || '';
        const ortu = data?.find((d: any) => d.variant === 'ortu')?.content || '';
        if (mounted) {
          setGuideAnak(anak);
          setGuideOrtu(ortu);
        }
      } catch (e: any) {
        console.warn('Gagal memuat panduan:', e?.message || e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const saveGuide = async (variant: 'anak' | 'ortu', content: string) => {
    setSavingGuide(true);
    setGuideError(null);
    try {
      const { supabase, TABLES } = await import('../lib/supabase');
      const payload = {
        id: `rubric-${variant}`,
        variant,
        content,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser?.username || 'admin'
      };
      const { error } = await supabase
        .from(TABLES.RUBRIC_GUIDES)
        .upsert(payload, { onConflict: 'variant' });
      if (error) throw error;
      showToast('Panduan berhasil disimpan', 'success');
    } catch (e: any) {
      setGuideError(e?.message || 'Gagal menyimpan panduan');
      showToast('Gagal menyimpan panduan', 'error');
    } finally {
      setSavingGuide(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(''); // Clear previous errors

    if (modalMode === 'create') {
      if (!formData.name.trim() || !formData.username.trim() || !formData.password.trim()) {
        setFormError('Semua field harus diisi!');
        return;
      }

      const result = await onCreateUser({
        name: formData.name.trim(),
        username: formData.username.trim(),
        password: formData.password,
        role: formData.role,
        createdBy: currentUser.username
      });

      showToast(result.message, result.success ? 'success' : 'error');
      if (result.success) {
        handleCloseModal();
      }
    } else if (modalMode === 'edit' && selectedUser) {
      if (!formData.name.trim() || !formData.username.trim()) {
        setFormError('Nama dan username harus diisi!');
        return;
      }

      const updates: Partial<UserType> = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        role: formData.role
      };

      // Only update password if provided
      if (formData.password.trim()) {
        updates.password = formData.password;
      }

      const result = await onUpdateUser(selectedUser.id, updates);
      showToast(result.message, result.success ? 'success' : 'error');
      if (result.success) {
        handleCloseModal();
      }
    } else if (modalMode === 'reset' && selectedUser) {
      if (!newPassword.trim()) {
        setFormError('Password baru harus diisi!');
        return;
      }

      if (newPassword !== confirmPassword) {
        setFormError('Password tidak cocok!');
        return;
      }

      const result = await onResetPassword(selectedUser.id, newPassword);
      showToast(result.message, result.success ? 'success' : 'error');
      if (result.success) {
        handleCloseModal();
      }
    }
  };

  const handleDelete = async (user: UserType) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus user "${user.name}"?`)) {
      const result = await onDeleteUser(user.id);
      showToast(result.message, result.success ? 'success' : 'error');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-4 h-4" />;
      case 'PENGUJI':
        return <UserCheck className="w-4 h-4" />;
      case 'TU':
        return <FileText className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700';
      case 'PENGUJI':
        return 'bg-emerald-100 text-emerald-700';
      case 'TU':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-blue-500 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
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
                <div className="bg-gradient-to-br from-white to-purple-50 p-3 rounded-2xl mr-3 shadow-xl">
                  <Users className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white drop-shadow-lg">Manajemen User</h1>
                  <p className="text-sm text-white/90 font-medium drop-shadow">Kelola pengguna sistem</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onOpenBackup}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold"
              >
                <Database className="w-5 h-5 mr-2" />
                Backup Data
              </button>
              <button
                onClick={handleOpenCreateModal}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-white to-purple-50 text-purple-700 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tambah User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Editor Panduan Penilaian */}
        <div className="glass rounded-3xl shadow-2xl overflow-hidden mb-8 animate-fade-in hover-lift">
          <div className="p-6 border-b border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-800">📝 Panduan Penilaian</h2>
                <p className="text-sm text-gray-600 font-medium">Edit panduan untuk Calon Siswa dan Orang Tua</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Nav top tabs */}
              <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setActiveGuideTab('anak')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${activeGuideTab === 'anak' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}
                  aria-pressed={activeGuideTab === 'anak'}
                >
                  Calon Siswa
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGuideTab('ortu')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${activeGuideTab === 'ortu' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}
                  aria-pressed={activeGuideTab === 'ortu'}
                >
                  Orang Tua
                </button>
              </div>
              {/* Toggle open/close */}
              <button
                type="button"
                onClick={() => setGuidePanelOpen(!guidePanelOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-expanded={guidePanelOpen}
                aria-label={guidePanelOpen ? 'Tutup panel panduan' : 'Buka panel panduan'}
              >
                {guidePanelOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
          {guidePanelOpen && (
            <div className="p-6">
              {activeGuideTab === 'anak' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Panduan — Calon Siswa</label>
                  <textarea
                    value={guideAnak}
                    onChange={(e) => setGuideAnak(e.target.value)}
                    placeholder="Tulis panduan khusus untuk penilaian calon siswa..."
                    className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => saveGuide('anak', guideAnak)}
                      disabled={savingGuide}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      Simpan Panduan Anak
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Panduan — Orang Tua</label>
                  <textarea
                    value={guideOrtu}
                    onChange={(e) => setGuideOrtu(e.target.value)}
                    placeholder="Tulis panduan khusus untuk penilaian orang tua..."
                    className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => saveGuide('ortu', guideOrtu)}
                      disabled={savingGuide}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      Simpan Panduan Ortu
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {guideError && (
            <div className="px-6 pb-6">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {guideError}
              </div>
            </div>
          )}
        </div>

        <div className="glass rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-purple-700 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-purple-700 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-purple-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-purple-700 uppercase tracking-wider">
                    Dibuat Oleh
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-purple-700 uppercase tracking-wider">
                    Tanggal Dibuat
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-black text-purple-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/50 transition-all group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-600">{user.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1">{user.role}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.createdBy || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-2.5 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg rounded-xl transition-all transform hover:scale-110"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenResetModal(user)}
                          className="p-2.5 text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg rounded-xl transition-all transform hover:scale-110"
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={user.id === currentUser.id}
                          className="p-2.5 text-white bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-lg rounded-xl transition-all transform hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                          title="Hapus User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Belum ada user</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                {modalMode === 'create' && '➕ Tambah User Baru'}
                {modalMode === 'edit' && '✏️ Edit User'}
                {modalMode === 'reset' && '🔑 Reset Password'}
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
              {modalMode === 'reset' ? (
                <>
                  <div>
                    <label htmlFor="reset-user-name" className="block text-sm font-medium text-gray-700 mb-2">
                      User
                    </label>
                    <input
                      id="reset-user-name"
                      type="text"
                      value={selectedUser?.name || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Masukkan password baru"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Konfirmasi password baru"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Masukkan username"
                    />
                  </div>
                  <div>
                    <label htmlFor="user-role" className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      id="user-role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'TU' | 'PENGUJI' | 'ADMIN' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="TU">TU (Tata Usaha)</option>
                      <option value="PENGUJI">PENGUJI</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password {modalMode === 'edit' && '(Kosongkan jika tidak ingin mengubah)'}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder={modalMode === 'edit' ? 'Masukkan password baru (opsional)' : 'Masukkan password'}
                    />
                  </div>
                </>
              )}

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
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-xl transition-all flex items-center justify-center font-bold transform hover:scale-105"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminScreen;

