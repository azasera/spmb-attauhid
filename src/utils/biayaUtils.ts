import * as XLSX from 'xlsx';
import { supabase, TABLES } from '../lib/supabase';
import { BiayaItem } from '../types';

export interface ParsedBiayaRow {
  Kategori?: string;
  'Rincian Biaya'?: string;
  Nominal?: string | number;
  Deskripsi?: string;
}

export interface ParsedBiayaItem {
  item: BiayaItem;
  rowNumber: number;
  isValid: boolean;
  errors: string[];
}

const STORAGE_KEY = 'biaya_config';

export const downloadBiayaTemplate = () => {
  const template = [
    { Kategori: 'Uang Pangkal', 'Rincian Biaya': 'Pendaftaran TK', Nominal: '100000', Deskripsi: 'Contoh nominal dalam rupiah tanpa titik' },
    { Kategori: 'SPP', 'Rincian Biaya': 'SPP SD Non Asrama', Nominal: '2700000', Deskripsi: 'Besaran biaya per semester' }
  ];
  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Biaya');
  XLSX.writeFile(workbook, 'Template_Import_Biaya.xlsx');
};

const toNumber = (value: string | number | undefined): number => {
  if (value === undefined || value === null) return NaN;
  const cleaned = String(value).replace(/[^0-9\-]/g, '').trim();
  return cleaned === '' ? NaN : Number(cleaned);
};

export const parseBiayaExcelFile = async (file: File): Promise<ParsedBiayaItem[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData: ParsedBiayaRow[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        const parsed: ParsedBiayaItem[] = jsonData.map((row, index) => {
          const errors: string[] = [];
          const category = String(row.Kategori || '').trim();
          const name = String(row['Rincian Biaya'] || '').trim();
          const amountValue = row.Nominal;
          const description = String(row.Deskripsi || '').trim();
          const amount = toNumber(amountValue);

          if (!category) {
            errors.push('Kategori wajib diisi');
          }
          if (!name) {
            errors.push('Rincian Biaya wajib diisi');
          }
          if (Number.isNaN(amount) || amount <= 0) {
            errors.push('Nominal harus angka lebih besar dari 0');
          }

          const item: BiayaItem = {
            id: crypto.randomUUID(),
            category,
            name,
            amount: Number.isNaN(amount) ? 0 : amount,
            description,
            createdAt: new Date().toISOString(),
          };

          return {
            item,
            rowNumber: index + 2,
            isValid: errors.length === 0,
            errors,
          };
        });

        resolve(parsed);
      } catch (error) {
        reject(new Error('Gagal membaca file Excel: ' + (error as Error).message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca file')); 
    };

    reader.readAsBinaryString(file);
  });
};

export const loadBiayaConfig = async (): Promise<BiayaItem[]> => {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'biaya_config')
      .single();

    if (error) {
      console.warn('Gagal load biaya_config dari DB:', error.message || error);
    }

    if (data?.value) {
      try {
        const parsed = JSON.parse(data.value);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (error) {
        console.warn('Gagal parse biaya_config dari DB:', error);
      }
    }
  } catch (error) {
    console.warn('Gagal load biaya_config:', error);
  }

  try {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // noop
  }

  return [];
};

export const saveBiayaConfig = async (items: BiayaItem[]): Promise<{ success: boolean; message: string }> => {
  const stringValue = JSON.stringify(items);

  try {
    const { error } = await supabase
      .from('app_settings')
      .upsert({ key: 'biaya_config', value: stringValue }, { onConflict: 'key' });

    if (error) {
      console.warn('Gagal simpan biaya_config ke DB:', error.message || error);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, stringValue);
      }
      return { success: false, message: 'Disimpan secara lokal karena DB gagal' };
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, stringValue);
    }
    return { success: true, message: 'Biaya berhasil disimpan' };
  } catch (error) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, stringValue);
    }
    return { success: false, message: 'Gagal menyimpan biaya (disimpan lokal)' };
  }
};

export const mergeBiayaItems = (existing: BiayaItem[], parsed: ParsedBiayaItem[]): BiayaItem[] => {
  const merged = [...existing];
  const normalized = (value: string) => value.trim().toLowerCase();

  parsed
    .filter((row) => row.isValid)
    .forEach((row) => {
      const duplicateIndex = merged.findIndex((item) =>
        normalized(item.category) === normalized(row.item.category) &&
        normalized(item.name) === normalized(row.item.name)
      );

      if (duplicateIndex >= 0) {
        const existingItem = merged[duplicateIndex];
        merged[duplicateIndex] = {
          ...existingItem,
          amount: row.item.amount,
          description: row.item.description || existingItem.description,
          updatedAt: new Date().toISOString(),
        };
      } else {
        merged.push(row.item);
      }
    });

  return merged;
};
