import { useState, useEffect } from 'react';
import { Student, FormData, LembagaData, PenilaianScores, UserRole, User } from '../types';
import { generateNoTes, getInitialFormData, calculateKelulusan, getPenilaianByLembaga } from '../utils/helpers';
import { supabase, TABLES } from '../lib/supabase';

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const useStudentData = (currentUser: User | null = null) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [selectedLembaga, setSelectedLembaga] = useState<LembagaData | null>(null);
  const [registeredStudents, setRegisteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<FormData>(getInitialFormData());
  const [penilaianAnak, setPenilaianAnak] = useState<PenilaianScores>({});
  const [penilaianOrtu, setPenilaianOrtu] = useState<PenilaianScores>({});
  const [mathCorrect, setMathCorrect] = useState<number>(0);
  const [hafalanBenar, setHafalanBenar] = useState<number>(0);
  const [riwayatPenyakit, setRiwayatPenyakit] = useState<string>('');
  const [pekerjaanOrangTua, setPekerjaanOrangTua] = useState<string>('');
  const [catatanPenguji, setCatatanPenguji] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterLembaga, setFilterLembaga] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load students from Supabase on mount
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from(TABLES.STUDENTS)
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          console.warn('⚠️ Table "students" belum ada. Data akan menggunakan localStorage sementara.');
          // Don't show error toast, just use empty state
        } else {
          console.error('Error loading students:', error);
          showToast('Gagal memuat data siswa', 'error');
        }
      } else if (data) {
        // Migrate old status values to new ones
        const migratedData = data.map(student => ({
          ...student,
          status: student.status === 'BELUM DINILAI' ? 'BELUM DIUJI' : 
                  student.status === 'SUDAH DINILAI' ? 'SUDAH DIUJI' : 
                  student.status
        }));
        setRegisteredStudents(migratedData);
        
        // Update database if there are old status values
        const hasOldStatus = data.some(student => 
          student.status === 'BELUM DINILAI' || student.status === 'SUDAH DINILAI'
        );
        
        if (hasOldStatus) {
          console.log('🔄 Migrating old status values in database...');
          // Update each student with old status
          for (const student of data) {
            if (student.status === 'BELUM DINILAI' || student.status === 'SUDAH DINILAI') {
              const newStatus = student.status === 'BELUM DINILAI' ? 'BELUM DIUJI' : 'SUDAH DIUJI';
              await supabase
                .from(TABLES.STUDENTS)
                .update({ status: newStatus })
                .eq('id', student.id);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading students:', error);
      showToast('Terjadi kesalahan saat memuat data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
    setSelectedLembaga(null);
    resetForm();
  };

  const handleAddStudent = (lembaga: LembagaData) => {
    setSelectedLembaga(lembaga);
    setEditingId(null);
    resetForm();
    
    // Auto-fill petugas dengan user yang sedang login (jika TU)
    if (currentUser && currentUser.role === 'TU') {
      setFormData(prev => ({
        ...prev,
        petugas: currentUser.name
      }));
    }
  };

  const handleEditStudent = (student: Student, lembagaData: LembagaData[]) => {
    const lembaga = lembagaData.find(l => l.id === student.lembaga);
    if (lembaga) {
      setSelectedLembaga(lembaga);
    }
    setEditingId(student.id);
    setFormData(student.data);
    // Isi nilai default 3 untuk item yang belum ada
    const pen = getPenilaianByLembaga(student.lembaga);
    const defaultAnak: PenilaianScores = Object.fromEntries(
      pen.anak.map((item) => [item, (student.penilaianAnak && student.penilaianAnak[item]) || 3])
    );
    const defaultOrtu: PenilaianScores = Object.fromEntries(
      pen.ortu.map((item) => [item, (student.penilaianOrtu && student.penilaianOrtu[item]) || 3])
    );
    setPenilaianAnak(defaultAnak);
    setPenilaianOrtu(defaultOrtu);
    setMathCorrect(student.mathCorrect || 0);
    setHafalanBenar(student.hafalanBenar || 0);
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return;
    }

    try {
      const targetNoTes = registeredStudents.find(s => s.id === id)?.noTes || '';
      const { error } = await supabase
        .from(TABLES.STUDENTS)
        .delete()
        .eq('noTes', targetNoTes || id);

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          console.warn('⚠️ Supabase belum siap. Data dihapus dari state lokal saja.');
          setRegisteredStudents(registeredStudents.filter(s => s.id !== id));
          showToast('Data berhasil dihapus (lokal)!', 'success');
        } else {
          console.error('Supabase error:', error);
          showToast('Gagal menghapus data di database!', 'error');
        }
      } else {
        setRegisteredStudents(registeredStudents.filter(s => s.id !== id));
        showToast('Data berhasil dihapus!', 'success');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      showToast('Terjadi kesalahan saat menghapus data!', 'error');
    }
  };

  const handleSaveStudent = async () => {
    if (!selectedLembaga) return;

    try {
      const noTes = editingId 
        ? registeredStudents.find(s => s.id === editingId)!.noTes
        : generateNoTes(selectedLembaga.id, registeredStudents);

      const studentData: Student = {
        id: editingId || `student-${Date.now()}`,
        noTes,
        lembaga: selectedLembaga.id,
        lembagaName: selectedLembaga.fullName,
        data: formData,
        penilaianAnak: {},
        penilaianOrtu: {},
        status: 'BELUM DIUJI',
        createdAt: editingId 
          ? registeredStudents.find(s => s.id === editingId)!.createdAt
          : new Date().toISOString()
      };

      if (editingId) {
        // Update existing student
        const { error } = await supabase
          .from(TABLES.STUDENTS)
          .update(studentData)
          .eq('noTes', noTes);

        if (error) {
          if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
            console.warn('⚠️ Supabase belum siap. Data diupdate di state lokal saja.');
            setRegisteredStudents(registeredStudents.map(s => 
              s.id === editingId ? studentData : s
            ));
            showToast('Data berhasil diperbarui (lokal)!', 'success');
          } else {
            console.error('Supabase error:', error);
            showToast('Gagal mengupdate data di database!', 'error');
            return;
          }
        } else {
          setRegisteredStudents(registeredStudents.map(s => 
            s.id === editingId ? studentData : s
          ));
          showToast('Data berhasil diperbarui!', 'success');
        }
      } else {
        // Create new student dengan retry untuk bentrok noTes unik
        let attempts = 0;
        let lastError: any = null;
        let currentData = { ...studentData };
        // Tambahkan penampung daftar nomor urut yang sudah dipakai untuk lembaga ini
        const usedNumbers = new Set(
          registeredStudents
            .filter(s => s.lembaga === selectedLembaga.id)
            .map(s => {
              const parts = s.noTes.split('-');
              return parts.length === 3 ? parseInt(parts[2]) : 0;
            })
            .filter(n => !isNaN(n) && n > 0)
        );
        while (attempts < 5) {
          const { error } = await supabase
            .from(TABLES.STUDENTS)
            .insert([currentData]);

          if (!error) {
            setRegisteredStudents([...registeredStudents, currentData]);
            showToast('Data berhasil disimpan!', 'success');
            lastError = null;
            break;
          }

          lastError = error as any;
          const isUniqueNoTes = /duplicate key|unique constraint|noTes/i.test(
            `${(error as any)?.message || ''} ${(error as any)?.details || ''}`
          ) || (error as any)?.code === '23505';

          if (isUniqueNoTes) {
            // Bump nomor urut dan coba lagi
            const parts = currentData.noTes.split('-');
            const nextNum = (() => {
              if (parts.length === 3) {
                const cur = parseInt(parts[2]);
                let candidate = isNaN(cur) ? 1 : cur + 1;
                while (usedNumbers.has(candidate)) candidate += 1;
                usedNumbers.add(candidate);
                parts[2] = candidate.toString().padStart(3, '0');
                return parts.join('-');
              }
              // Fallback: regenerate dari helper
              return generateNoTes(selectedLembaga.id, [...registeredStudents, currentData]);
            })();
            currentData = { ...currentData, noTes: nextNum };
            attempts += 1;
            continue;
          }

          if ((error as any)?.code === 'PGRST116' || (error as any)?.message?.includes('does not exist')) {
            console.warn('⚠️ Supabase belum siap. Data disimpan di state lokal saja.');
            setRegisteredStudents([...registeredStudents, currentData]);
            showToast('Data berhasil disimpan (lokal)!', 'success');
            lastError = null;
            break;
          }

          console.error('Supabase error:', error);
          showToast('Gagal menyimpan data di database!', 'error');
          break;
        }

        if (lastError) {
          return;
        }
      }

      resetForm();
    } catch (error) {
      console.error('Error saving student:', error);
      showToast('Terjadi kesalahan saat menyimpan data!', 'error');
    }
  };

  const handleStartPenilaian = (student: Student) => {
    setSelectedStudent(student);
    const pen = getPenilaianByLembaga(student.lembaga);
    const defaultAnak: PenilaianScores = Object.fromEntries(
      pen.anak.map((item) => [item, (student.penilaianAnak && student.penilaianAnak[item]) || 3])
    );
    const defaultOrtu: PenilaianScores = Object.fromEntries(
      pen.ortu.map((item) => [item, (student.penilaianOrtu && student.penilaianOrtu[item]) || 3])
    );
    setPenilaianAnak(defaultAnak);
    setPenilaianOrtu(defaultOrtu);
    setMathCorrect(student.mathCorrect || 0);
    setHafalanBenar(student.hafalanBenar || 0);
    setRiwayatPenyakit(student.riwayatPenyakit || '');
    setPekerjaanOrangTua(student.pekerjaanOrangTua || '');
    setCatatanPenguji(student.catatanPenguji || '');
  };

  const handleSavePenilaian = async () => {
    if (!selectedStudent) return;

    try {
      const { finalScore, status } = calculateKelulusan(penilaianAnak, penilaianOrtu, mathCorrect, hafalanBenar, selectedStudent.lembaga);
      const finalScoreInt = Math.round(finalScore);
      
      // Debug: Log currentUser data
      console.log('🔍 Current User Data:', {
        id: currentUser?.id,
        name: currentUser?.name,
        username: currentUser?.username,
        role: currentUser?.role
      });
      
      const updatedStudent = {
        ...selectedStudent,
        penilaianAnak,
        penilaianOrtu,
        mathCorrect,
        hafalanBenar,
        riwayatPenyakit,
        pekerjaanOrangTua,
        catatanPenguji,
        nilaiAkhir: finalScoreInt,
        kelulusan: status,
        status: 'SUDAH DIUJI' as const,
        penguji: currentUser?.name || currentUser?.username || 'Unknown'
      };

      const { error } = await supabase
        .from(TABLES.STUDENTS)
        .update({
          penilaianAnak,
          penilaianOrtu,
          mathCorrect,
          hafalanBenar,
          riwayatPenyakit,
          pekerjaanOrangTua,
          catatanPenguji,
          nilaiAkhir: finalScoreInt,
          kelulusan: status,
          status: 'SUDAH DIUJI',
          penguji: currentUser?.name || currentUser?.username || 'Unknown'
        })
        .eq('noTes', selectedStudent.noTes);

      if (error) {
        const isTableMissing = error.code === 'PGRST116' || error.message.includes('does not exist');
        const isBadRequest = (error as any)?.status === 400 || /Bad Request/i.test(error.message);
        if (isTableMissing || isBadRequest) {
          console.warn('⚠️ Supabase belum siap atau skema belum diperbarui. Mencoba menyimpan kolom dasar...', {
            code: (error as any)?.code,
            status: (error as any)?.status,
            message: (error as any)?.message,
            details: (error as any)?.details,
            hint: (error as any)?.hint
          });
          // Attempt kedua: simpan kolom yang ada di skema awal
          try {
            const { error: fallbackError } = await supabase
              .from(TABLES.STUDENTS)
              .update({
                penilaianAnak,
                penilaianOrtu,
                status: 'SUDAH DIUJI',
                penguji: currentUser?.name || currentUser?.username || 'Unknown'
              })
              .eq('noTes', selectedStudent.noTes);

            if (fallbackError) {
              console.warn('Fallback update gagal, menyimpan lokal saja.', fallbackError);
              setRegisteredStudents(registeredStudents.map(s => {
                if (s.id === selectedStudent.id) {
                  return updatedStudent;
                }
                return s;
              }));
              showToast('Penilaian tersimpan (lokal). Jalankan ulang supabase-schema.sql.', 'warning');
            } else {
              // Update sebagian berhasil di DB, simpan state penuh di client
              setRegisteredStudents(registeredStudents.map(s => {
                if (s.id === selectedStudent.id) {
                  return updatedStudent;
                }
                return s;
              }));
              showToast('Penilaian tersimpan sebagian. Upgrade skema untuk menyimpan lengkap.', 'warning');
            }
          } catch (e) {
            console.warn('Fallback update exception, menyimpan lokal.', e);
            setRegisteredStudents(registeredStudents.map(s => {
              if (s.id === selectedStudent.id) {
                return updatedStudent;
              }
              return s;
            }));
            showToast('Penilaian tersimpan (lokal). Jalankan ulang supabase-schema.sql.', 'warning');
          }
        } else {
          console.error('Supabase error:', error);
          showToast('Gagal menyimpan penilaian di database!', 'error');
          return;
        }
      } else {
        setRegisteredStudents(registeredStudents.map(s => {
          if (s.id === selectedStudent.id) {
            return updatedStudent;
          }
          return s;
        }));
        showToast('Penilaian berhasil disimpan!', 'success');
      }

      setSelectedStudent(null);
    } catch (error) {
      console.error('Error saving penilaian:', error);
      showToast('Terjadi kesalahan saat menyimpan penilaian!', 'error');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePenilaianAnakChange = (item: string, value: number) => {
    setPenilaianAnak({
      ...penilaianAnak,
      [item]: value
    });
  };

  const handlePenilaianOrtuChange = (item: string, value: number) => {
    setPenilaianOrtu({
      ...penilaianOrtu,
      [item]: value
    });
  };

  const handleMathCorrectChange = (value: number) => {
    const v = Math.max(0, Math.min(5, Math.round(value)));
    setMathCorrect(v);
  };

  const handleHafalanBenarChange = (value: number) => {
    const v = Math.max(0, Math.min(15, Math.round(value)));
    setHafalanBenar(v);
  };

  const handleRiwayatPenyakitChange = (value: string) => {
    setRiwayatPenyakit(value);
  };

  const handlePekerjaanOrangTuaChange = (value: string) => {
    setPekerjaanOrangTua(value);
  };

  const handleCatatanPengujiChange = (value: string) => {
    setCatatanPenguji(value);
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
    setPenilaianAnak({});
    setPenilaianOrtu({});
    setMathCorrect(0);
    setHafalanBenar(0);
    setRiwayatPenyakit('');
    setPekerjaanOrangTua('');
    setCatatanPenguji('');
    setEditingId(null);
  };

  return {
    userRole,
    selectedLembaga,
    registeredStudents,
    selectedStudent,
    formData,
    penilaianAnak,
    penilaianOrtu,
    mathCorrect,
    hafalanBenar,
    riwayatPenyakit,
    pekerjaanOrangTua,
    catatanPenguji,
    editingId,
    filterLembaga,
    filterStatus,
    searchQuery,
    filterDateFrom,
    filterDateTo,
    toast,
    isLoading,
    setFilterLembaga,
    setFilterStatus,
    setSearchQuery,
    setFilterDateFrom,
    setFilterDateTo,
    showToast,
    hideToast,
    handleLogin,
    handleLogout,
    handleAddStudent,
    handleEditStudent,
    handleDeleteStudent,
    handleSaveStudent,
    handleStartPenilaian,
    handleSavePenilaian,
    handleFormChange,
    handlePenilaianAnakChange,
    handlePenilaianOrtuChange,
    handleMathCorrectChange,
    handleHafalanBenarChange,
    handleRiwayatPenyakitChange,
    handlePekerjaanOrangTuaChange,
    handleCatatanPengujiChange
  };
};
