// Auto Backup Service untuk SPMB At Tauhid
import { supabase } from '../lib/supabase';

export interface BackupData {
  timestamp: string;
  version: string;
  tables: {
    students: any[];
    users: any[];
    rubric_guides: any[];
    app_settings: any[];
  };
  metadata: {
    totalStudents: number;
    totalUsers: number;
    backupType: 'manual' | 'auto';
    createdBy?: string;
  };
}

export interface BackupRecord {
  id: string;
  filename: string;
  timestamp: string;
  size: number;
  type: 'manual' | 'auto';
  createdBy?: string;
}

class BackupService {
  private readonly BACKUP_BUCKET = 'backups';
  private readonly AUTO_BACKUP_KEY = 'last_auto_backup';
  private readonly BACKUP_INTERVAL_HOURS = 24; // Backup setiap 24 jam

  /**
   * Inisialisasi service dan cek apakah perlu auto backup
   */
  async initialize() {
    const bucketExists = await this.checkAndCreateBucket();
    if (bucketExists) {
      await this.checkAutoBackup();
    } else {
      console.warn('⚠️ Backup bucket tidak tersedia. Fitur backup akan menggunakan download lokal saja.');
    }
  }

  /**
   * Buat bucket backup jika belum ada
   */
  private async checkAndCreateBucket(): Promise<boolean> {
    try {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.warn('⚠️ Cannot access storage buckets. Please create "backups" bucket manually.');
        return false;
      }
      
      const backupBucket = buckets?.find(b => b.name === this.BACKUP_BUCKET);
      
      if (!backupBucket) {
        console.log('💡 Bucket "backups" not found. Please create it manually in Supabase Dashboard > Storage.');
        console.log('📖 See SETUP_STORAGE_BUCKET.md for instructions.');
        return false;
      }
      
      console.log('✅ Bucket "backups" found and ready');
      return true;
    } catch (error: any) {
      console.warn('⚠️ Storage not accessible:', error.message);
      return false;
    }
  }

  /**
   * Cek apakah sudah waktunya auto backup
   */
  private async checkAutoBackup() {
    try {
      const lastBackup = localStorage.getItem(this.AUTO_BACKUP_KEY);
      const now = Date.now();
      
      if (!lastBackup || now - parseInt(lastBackup) > this.BACKUP_INTERVAL_HOURS * 60 * 60 * 1000) {
        console.log('🔄 Menjalankan auto backup...');
        const result = await this.createBackup('auto');
        if (result.success) {
          localStorage.setItem(this.AUTO_BACKUP_KEY, now.toString());
          console.log('✅ Auto backup berhasil:', result.filename);
        } else {
          console.warn('⚠️ Auto backup gagal:', result.error);
        }
      }
    } catch (error: any) {
      console.warn('Error in auto backup:', error.message);
    }
  }

  /**
   * Buat backup data
   */
  async createBackup(type: 'manual' | 'auto' = 'manual', createdBy?: string): Promise<{ success: boolean; filename?: string; error?: string }> {
    try {
      // Ambil semua data dari database
      const [studentsRes, usersRes, rubricRes, settingsRes] = await Promise.all([
        supabase.from('students').select('*'),
        supabase.from('users').select('*'),
        supabase.from('rubric_guides').select('*'),
        supabase.from('app_settings').select('*'),
      ]);

      if (studentsRes.error) throw studentsRes.error;
      if (usersRes.error) throw usersRes.error;
      if (rubricRes.error) throw rubricRes.error;
      if (settingsRes.error) throw settingsRes.error;

      const backupData: BackupData = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        tables: {
          students: studentsRes.data || [],
          users: usersRes.data || [],
          rubric_guides: rubricRes.data || [],
          app_settings: settingsRes.data || [],
        },
        metadata: {
          totalStudents: studentsRes.data?.length || 0,
          totalUsers: usersRes.data?.length || 0,
          backupType: type,
          createdBy,
        },
      };

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `backup_${type}_${timestamp}.json`;

      // Convert to JSON
      const jsonData = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });

      // Cek apakah bucket tersedia
      const bucketExists = await this.checkBucketExists();
      
      if (!bucketExists) {
        // Fallback: simpan ke localStorage atau skip untuk auto backup
        if (type === 'manual') {
          console.warn('⚠️ Bucket tidak tersedia, menggunakan download lokal');
          // Download langsung ke local
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          return { success: true, filename };
        } else {
          // Skip auto backup jika bucket tidak ada
          return { success: false, error: 'Bucket not available for auto backup' };
        }
      }

      // Upload ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(this.BACKUP_BUCKET)
        .upload(filename, blob, {
          contentType: 'application/json',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      return { success: true, filename };
    } catch (error: any) {
      console.error('Error creating backup:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Cek apakah bucket backup ada
   */
  private async checkBucketExists(): Promise<boolean> {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      return buckets?.some(b => b.name === this.BACKUP_BUCKET) || false;
    } catch {
      return false;
    }
  }

  /**
   * List semua backup yang tersedia
   */
  async listBackups(): Promise<BackupRecord[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BACKUP_BUCKET)
        .list('', {
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) throw error;

      return (data || []).map(file => ({
        id: file.id,
        filename: file.name,
        timestamp: file.created_at,
        size: file.metadata?.size || 0,
        type: file.name.includes('_auto_') ? 'auto' : 'manual',
      }));
    } catch (error) {
      console.error('Error listing backups:', error);
      return [];
    }
  }

  /**
   * Download backup file
   */
  async downloadBackup(filename: string): Promise<{ success: boolean; data?: BackupData; error?: string }> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BACKUP_BUCKET)
        .download(filename);

      if (error) throw error;

      const text = await data.text();
      const backupData: BackupData = JSON.parse(text);

      return { success: true, data: backupData };
    } catch (error: any) {
      console.error('Error downloading backup:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Download backup ke local file
   */
  async downloadBackupToLocal(filename: string) {
    try {
      const result = await this.downloadBackup(filename);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to download backup');
      }

      // Create download link
      const jsonData = JSON.stringify(result.data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true };
    } catch (error: any) {
      console.error('Error downloading backup to local:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Restore data dari backup
   */
  async restoreBackup(filename: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.downloadBackup(filename);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to download backup');
      }

      const backupData = result.data;

      // Restore data ke database (dalam transaksi)
      // Note: Supabase tidak support transaksi penuh, jadi kita restore satu per satu
      
      // Backup existing data dulu (safety)
      await this.createBackup('manual', 'system_before_restore');

      // Clear existing data
      await Promise.all([
        supabase.from('students').delete().neq('id', ''),
        supabase.from('rubric_guides').delete().neq('id', ''),
        supabase.from('app_settings').delete().neq('key', ''),
      ]);

      // Insert backup data
      const insertPromises = [];

      if (backupData.tables.students.length > 0) {
        insertPromises.push(
          supabase.from('students').insert(backupData.tables.students)
        );
      }

      if (backupData.tables.rubric_guides.length > 0) {
        insertPromises.push(
          supabase.from('rubric_guides').insert(backupData.tables.rubric_guides)
        );
      }

      if (backupData.tables.app_settings.length > 0) {
        insertPromises.push(
          supabase.from('app_settings').insert(backupData.tables.app_settings)
        );
      }

      // Note: Users tidak di-restore untuk keamanan
      
      const results = await Promise.all(insertPromises);
      
      // Check for errors
      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        throw new Error(`Restore failed: ${errors.map(e => e.error?.message).join(', ')}`);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error restoring backup:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete backup file
   */
  async deleteBackup(filename: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(this.BACKUP_BUCKET)
        .remove([filename]);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting backup:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Export backup ke JSON (untuk download langsung tanpa storage)
   */
  async exportToJSON(createdBy?: string) {
    try {
      const [studentsRes, usersRes, rubricRes, settingsRes] = await Promise.all([
        supabase.from('students').select('*'),
        supabase.from('users').select('*'),
        supabase.from('rubric_guides').select('*'),
        supabase.from('app_settings').select('*'),
      ]);

      const backupData: BackupData = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        tables: {
          students: studentsRes.data || [],
          users: usersRes.data || [],
          rubric_guides: rubricRes.data || [],
          app_settings: settingsRes.data || [],
        },
        metadata: {
          totalStudents: studentsRes.data?.length || 0,
          totalUsers: usersRes.data?.length || 0,
          backupType: 'manual',
          createdBy,
        },
      };

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `spmb_backup_${timestamp}.json`;
      
      const jsonData = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true, filename };
    } catch (error: any) {
      console.error('Error exporting to JSON:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Import dari file JSON
   */
  async importFromJSON(file: File): Promise<{ success: boolean; error?: string }> {
    try {
      const text = await file.text();
      const backupData: BackupData = JSON.parse(text);

      // Validasi struktur backup
      if (!backupData.tables || !backupData.timestamp) {
        throw new Error('Invalid backup file format');
      }

      // Backup existing data dulu
      await this.createBackup('manual', 'system_before_import');

      // Clear existing data
      await Promise.all([
        supabase.from('students').delete().neq('id', ''),
        supabase.from('rubric_guides').delete().neq('id', ''),
        supabase.from('app_settings').delete().neq('key', ''),
      ]);

      // Insert backup data
      const insertPromises = [];

      if (backupData.tables.students?.length > 0) {
        insertPromises.push(
          supabase.from('students').insert(backupData.tables.students)
        );
      }

      if (backupData.tables.rubric_guides?.length > 0) {
        insertPromises.push(
          supabase.from('rubric_guides').insert(backupData.tables.rubric_guides)
        );
      }

      if (backupData.tables.app_settings?.length > 0) {
        insertPromises.push(
          supabase.from('app_settings').insert(backupData.tables.app_settings)
        );
      }

      const results = await Promise.all(insertPromises);
      
      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        throw new Error(`Import failed: ${errors.map(e => e.error?.message).join(', ')}`);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error importing from JSON:', error);
      return { success: false, error: error.message };
    }
  }
}

export const backupService = new BackupService();
