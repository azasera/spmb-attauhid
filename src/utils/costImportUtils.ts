import * as XLSX from 'xlsx';
import { CostItem } from '../types';

export const importCostsFromExcel = async (file: File): Promise<Omit<CostItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assume first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          throw new Error('File Excel harus memiliki header dan minimal 1 baris data');
        }

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];

        // Validate headers (case insensitive)
        const requiredHeaders = ['nama', 'kategori', 'jumlah'];
        const normalizedHeaders = headers.map(h => h?.toString().toLowerCase().trim());

        const missingHeaders = requiredHeaders.filter(header =>
          !normalizedHeaders.some(h => h.includes(header))
        );

        if (missingHeaders.length > 0) {
          throw new Error(`Header yang diperlukan tidak ditemukan: ${missingHeaders.join(', ')}`);
        }

        // Map column indices
        const nameIndex = normalizedHeaders.findIndex(h => h.includes('nama'));
        const categoryIndex = normalizedHeaders.findIndex(h => h.includes('kategori'));
        const amountIndex = normalizedHeaders.findIndex(h => h.includes('jumlah'));
        const descriptionIndex = normalizedHeaders.findIndex(h => h.includes('deskripsi') || h.includes('keterangan'));
        const lembagaIndex = normalizedHeaders.findIndex(h => h.includes('lembaga'));

        const costs: Omit<CostItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[] = [];

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const name = row[nameIndex]?.toString().trim();
          const category = row[categoryIndex]?.toString().trim();
          const amountStr = row[amountIndex]?.toString().trim();
          const description = row[descriptionIndex]?.toString().trim() || '';
          const lembaga = row[lembagaIndex]?.toString().trim() || '';

          if (!name || !category || !amountStr) {
            console.warn(`Baris ${i + 2} dilewati: data tidak lengkap`);
            continue;
          }

          // Parse amount (remove currency symbols and formatting)
          const cleanAmount = amountStr.replace(/[^\d.,]/g, '').replace(',', '');
          const amount = parseFloat(cleanAmount);

          if (isNaN(amount) || amount <= 0) {
            console.warn(`Baris ${i + 2} dilewati: jumlah tidak valid (${amountStr})`);
            continue;
          }

          costs.push({
            name,
            category,
            amount,
            description: description || undefined,
            lembaga: lembaga || undefined
          });
        }

        if (costs.length === 0) {
          throw new Error('Tidak ada data biaya yang valid ditemukan dalam file');
        }

        resolve(costs);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

export const exportCostsToExcel = async (costs: CostItem[]): Promise<void> => {
  // Prepare data for export
  const exportData = costs.map(cost => ({
    'Nama Biaya': cost.name,
    'Kategori': cost.category,
    'Jumlah (Rp)': cost.amount,
    'Deskripsi': cost.description || '',
    'Lembaga': cost.lembaga || '',
    'Dibuat Oleh': cost.createdBy,
    'Tanggal Dibuat': new Date(cost.createdAt).toLocaleDateString('id-ID'),
    'Terakhir Update': new Date(cost.updatedAt).toLocaleDateString('id-ID')
  }));

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();

  // Set column widths
  const colWidths = [
    { wch: 25 }, // Nama Biaya
    { wch: 15 }, // Kategori
    { wch: 15 }, // Jumlah
    { wch: 30 }, // Deskripsi
    { wch: 20 }, // Lembaga
    { wch: 15 }, // Dibuat Oleh
    { wch: 15 }, // Tanggal Dibuat
    { wch: 15 }  // Terakhir Update
  ];
  worksheet['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Biaya');

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `data-biaya-${timestamp}.xlsx`;

  // Save file
  XLSX.writeFile(workbook, filename);
};

export const generateCostTemplate = (): void => {
  const templateData = [
    {
      'Nama Biaya': 'Contoh: Snack Peserta',
      'Kategori': 'Konsumsi',
      'Jumlah (Rp)': 50000,
      'Deskripsi': 'Snack untuk 50 peserta',
      'Lembaga': 'MI' // Opsional
    },
    {
      'Nama Biaya': 'Contoh: Transport Penguji',
      'Kategori': 'Transport',
      'Jumlah (Rp)': 150000,
      'Deskripsi': 'Transportasi untuk 3 penguji',
      'Lembaga': '' // Kosongkan untuk biaya umum
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();

  // Set column widths
  const colWidths = [
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 30 },
    { wch: 20 }
  ];
  worksheet['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Biaya');

  XLSX.writeFile(workbook, 'template-data-biaya.xlsx');
};