// Logo constants untuk PDF
// Base64 encoded logos imported from separate files to avoid large file issues

import { ictBase64 } from './data/ict';
import { smpBase64 } from './data/smp';
import { smaBase64 } from './data/sma';
import { mtaBase64 } from './data/mta';
import { sditaBase64 } from './data/sdita';

export const LOGO_PONPES_ICT = {
  base64: ictBase64,
  width: 24,
  height: 24
};

export const LOGO_SMP_ATTAUHID = {
  base64: smpBase64,
  width: 24,
  height: 24
};

export const LOGO_SMA_ATTAUHID = {
  base64: smaBase64,
  width: 24,
  height: 24
};

export const LOGO_MTA_ATTAUHID = {
  base64: mtaBase64,
  width: 24,
  height: 24
};

export const LOGO_SDITA_ATTAUHID = {
  base64: sditaBase64,
  width: 24,
  height: 24
};

// Fungsi helper untuk menambahkan logo ke PDF
export const addLogoPDF = (doc: any, logoData: any, x: number, y: number, logoType: string = 'LOGO') => {
  if (logoData.base64) {
    try {
      doc.addImage(logoData.base64, 'PNG', x, y, logoData.width, logoData.height);
    } catch (error) {
      console.warn('Failed to add logo, using placeholder');
      // Fallback ke placeholder jika logo gagal dimuat
      addLogoPlaceholder(doc, x + logoData.width / 2, y + logoData.height / 2, logoData.width / 2, logoType);
    }
  } else {
    // Gunakan placeholder jika base64 belum tersedia
    addLogoPlaceholder(doc, x + logoData.width / 2, y + logoData.height / 2, logoData.width / 2, logoType);
  }
};

// Fungsi placeholder logo (lingkaran dengan teks)
export const addLogoPlaceholder = (doc: any, centerX: number, centerY: number, radius: number, logoType: string = 'LOGO') => {
  // Gambar lingkaran
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.5);
  doc.circle(centerX, centerY, radius);

  // Tambah teks sesuai jenis logo
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');

  if (logoType === 'PONPES') {
    doc.text('PONPES', centerX, centerY - 2, { align: 'center' });
    doc.text('ICT', centerX, centerY + 2, { align: 'center' });
  } else if (logoType === 'SMP') {
    doc.text('SMP', centerX, centerY - 2, { align: 'center' });
    doc.text('AT-TAUHID', centerX, centerY + 2, { align: 'center' });
  } else if (logoType === 'SMA') {
    doc.text('SMA', centerX, centerY - 2, { align: 'center' });
    doc.text('AT-TAUHID', centerX, centerY + 2, { align: 'center' });
  } else if (logoType === 'SDITA') {
    doc.text('SDITA', centerX, centerY - 2, { align: 'center' });
    doc.text('AT-TAUHID', centerX, centerY + 2, { align: 'center' });
  } else if (logoType === 'MTA') {
    doc.text('MTA', centerX, centerY - 2, { align: 'center' });
    doc.text('AT-TAUHID', centerX, centerY + 2, { align: 'center' });
  } else {
    doc.text(logoType, centerX, centerY, { align: 'center' });
  }
};