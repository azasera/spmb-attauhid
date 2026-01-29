import jsPDF from 'jspdf';
import { Student } from '../types';
import { lembagaData } from '../data/constants';
import { LOGO_PONPES_ICT, LOGO_SMP_ATTAUHID, LOGO_SMA_ATTAUHID, LOGO_MTA_ATTAUHID, addLogoPDF } from '../assets/logos/logoConstants';

export const generateSuratKeteranganPDF = (student: Student): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [210, 330] // F4 size: 210mm x 330mm (lebih panjang dari A4)
  });

  // F4 size: 210mm x 330mm
  // Safe area: 20mm margins = 170mm x 290mm usable area

  // Format tanggal untuk display
  const formatTanggal = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Get lembaga info untuk menentukan logo yang sesuai
  const lembaga = lembagaData.find(l => l.id === student.lembaga);

  // Tentukan jenis lembaga berdasarkan nomor tes (lebih akurat)
  const isSMPFromNoTes = student.noTes.toUpperCase().startsWith('SMP');
  const isSMAFromNoTes = student.noTes.toUpperCase().startsWith('SMA');
  const isMTAFromNoTes = student.noTes.toUpperCase().startsWith('MTA');

  // Prioritaskan deteksi dari nomor tes, fallback ke data lembaga
  let isSMP: boolean;
  let isMTA: boolean;
  if (isSMPFromNoTes) {
    isSMP = true;
    isMTA = false;
  } else if (isSMAFromNoTes) {
    isSMP = false;
    isMTA = false;
  } else if (isMTAFromNoTes) {
    isSMP = false;
    isMTA = true;
  } else {
    // Fallback ke data lembaga jika nomor tes tidak jelas
    isSMP = lembaga?.id === 'SMPITA';
    isMTA = lembaga?.id === 'MTA';
  }

  const lembagaText = isSMP ? 'SMP' : (isMTA ? 'MTA' : 'SMA');
  const lembagaCode = isSMP ? 'SMPITA' : (isMTA ? 'MTA' : 'SMAITA');

  // Data kepala sekolah
  const kepalaSekolah = isSMP
    ? { nama: 'Meditoma, S.Pd.', niy: '199405220720181024' }
    : isMTA
    ? { nama: 'Azali, S.Pd.', niy: '199001151220231161' }
    : { nama: 'Delly Arhadath, S.Pd.', niy: '200001120120231160' };

  // Status asrama dari data form siswa
  const isAsrama = student.data.asrama === 'ASRAMA';

  // Generate nomor surat berdasarkan nomor tes siswa
  const generateNomorSurat = () => {
    const today = new Date();
    const bulan = String(today.getMonth() + 1).padStart(2, '0');
    const tahun = today.getFullYear();

    // Ekstrak nomor dari noTes siswa (contoh: SMP-2627-020 -> 020)
    let nomorUrut = '001'; // default fallback

    const nomorTesMatch = student.noTes.match(/-(\d+)$/);
    if (nomorTesMatch && nomorTesMatch[1]) {
      nomorUrut = nomorTesMatch[1].padStart(3, '0'); // pastikan 3 digit
    } else {
      // Fallback: gunakan timestamp untuk uniqueness
      const timestamp = Date.now().toString().slice(-3);
      nomorUrut = timestamp.padStart(3, '0');
    }

    return `${nomorUrut}/SLP/${lembagaCode}/${bulan}/${tahun}`;
  };

  // Generate tanggal surat
  const tanggalSurat = formatTanggal(new Date().toISOString());

  // Set font
  doc.setFont('helvetica');



  // Header - Kop Surat dengan Logo

  // Logo Kiri - Ponpes Islamic Centre At-Tauhid (geser ke atas)
  addLogoPDF(doc, LOGO_PONPES_ICT, 15, 10, 'PONPES');

  // Logo Kanan - Berdasarkan deteksi lembaga yang sudah diperbaiki (geser ke atas)
  const rightLogo = isSMP ? LOGO_SMP_ATTAUHID : (isMTA ? LOGO_MTA_ATTAUHID : LOGO_SMA_ATTAUHID);
  const rightLogoType = isSMP ? 'SMP' : (isMTA ? 'MTA' : 'SMA');
  addLogoPDF(doc, rightLogo, 171, 10, rightLogoType);

  // Teks Header
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PONDOK PESANTREN', 105, 15, { align: 'center' });
  doc.text('ISLAMIC CENTRE AT-TAUHID BANGKA BELITUNG', 105, 22, { align: 'center' });
  doc.text(`${lembagaCode} AT-TAUHID PANGKALPINANG`, 105, 29, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Jl. Gerunggang RT 08 RW 03 Kel. Gerunggang Kec. Kepala Tujuh, Kec. Gerunggang, Prov. Bangka Belitung', 105, 36, { align: 'center' });
  
  // Kontak yang berbeda untuk SMP, MTA, dan SMA
  const telpLembaga = isSMP ? '+62 857-5802-1593' : (isMTA ? '+62 812-9758-5207' : '+62 812-9758-5207');
  const emailLembaga = isSMP ? 'smpita.attauhid@gmail.com' : (isMTA ? 'mta.attauhid@gmail.com' : 'attauhidsmaita@gmail.com');
  doc.text(`Telp. ${telpLembaga} e-mail : ${emailLembaga}`, 105, 42, { align: 'center' });
  
  // Nomor/NPSN berbeda untuk SMP, MTA, dan SMA
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  if (isSMP) {
    // SMP: tampilkan NPSN
    doc.text('NPSN : 70044522', 105, 47, { align: 'center' });
  } else if (isMTA) {
    // MTA: tampilkan nomor khusus MTA
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('NOMOR : 188.5/ 04/ DINDIK. MTA/ DPMPTSP/2023', 105, 47, { align: 'center' });
  } else {
    // SMA: tampilkan nomor khusus (tanpa NPSN)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('NOMOR : 188.4/ 04/ DINDIK. SMA/ DPMPTSP/2023', 105, 47, { align: 'center' });
  }

  // Garis pemisah
  doc.setLineWidth(1);
  doc.line(20, 52, 190, 52); // 210mm - 20mm margin = 190mm
  doc.setLineWidth(0.5);
  doc.line(20, 54, 190, 54);

  // Judul Surat
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SURAT KETERANGAN TES SPMB 2026/2027', 105, 65, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`Nomor : ${generateNomorSurat()}`, 105, 73, { align: 'center' });

  // Pembukaan surat
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  let yPos = 85;

  const lembagaFullName = isMTA ? 'Manzhumah Takhoshush Al Qur\'an' : `${lembagaText} Islam Tahfizh Al-Qur'an`;
  const pembukaan = [
    `Yang bertanda tangan di bawah ini, Kepala ${lembagaFullName} At-Tauhid`,
    'Pangkalpinang Provinsi Bangka Belitung, menerangkan bahwa:'
  ];

  pembukaan.forEach(line => {
    doc.text(line, 20, yPos);
    yPos += 6;
  });

  yPos += 5;

  // Data siswa
  const statusAsrama = isAsrama ? 'Asrama' : 'Non Asrama';
  const dataLines = [
    { label: 'Nama', value: ': ' + student.data.namaSiswa },
    { label: 'Jenis Kelamin', value: ': ' + (student.data.jenisKelamin || '-') },
    { label: 'NIK', value: ': ' + (student.data.nik || '-') },
    { label: 'Tempat, Tgl. Lahir', value: ': ' + (student.data.tempatLahir || '-') + ', ' + (student.data.tanggalLahir ? formatTanggal(student.data.tanggalLahir) : '-') },
    { label: 'Nama Orangtua', value: ': ' + student.data.namaOrangTua },
    { label: 'Nomor Tes', value: ': ' + student.noTes },
    { label: 'Keterangan', value: ': ' + statusAsrama }
  ];

  const labelWidth = 50;

  dataLines.forEach(item => {
    doc.text(item.label.padEnd(35), 20, yPos);
    doc.text(item.value, 20 + labelWidth, yPos);
    yPos += 5; // Kurangi dari 6 ke 5
  });

  yPos += 4; // Kurangi dari 5 ke 4

  // Pernyataan kelulusan dan informasi pembayaran
  if (student.kelulusan === 'LULUS') {
    // Redaksi yang benar untuk siswa lulus
    const redaksiLulus = [
      'dinyatakan LULUS dari tes seleksi penerimaan peserta didik baru Tahun Ajaran 2026/2027.',
      'Mohon untuk segera melakukan pembayaran dengan ketentuan : Prosedur daftar ulang',
      'Adalah dengan membayar kewajiban Uang Pangkal sekurang kurangnya 50% dari total uang',
      'pangkal ditambah SPP Juli 2026 paling lambat 14 hari setelah surat ini diterbitkan dan',
      'sisanya dilunasi paling lambat 1 bulan setelahnya.'
    ];

    redaksiLulus.forEach(line => {
      doc.text(line, 20, yPos);
      yPos += 6;
    });

    yPos += 8;
  } else if (student.kelulusan === 'TIDAK LULUS') {
    // Redaksi sopan untuk siswa tidak lulus
    const redaksiTidakLulus = [
      'Dengan penuh hormat, kami mengucapkan terima kasih atas partisipasi Bapak/Ibu dan ananda',
      'yang telah mengikuti proses seleksi SISTEM PENERIMAAN SISWA BARU (SPMB) di SMP Islam',
      'Tahfizh Al-Qur\'an At-Tauhid Pangkalpinang.',
      '',
      'Berdasarkan hasil evaluasi seleksi akademik, wawancara, dan tahsin/tahfizh, kami sampaikan',
      'bahwa untuk saat ini ananda belum dapat dinyatakan lulus dalam seleksi penerimaan siswa',
      'baru tahun pelajaran 2026/2027.',
      '',
      'Keputusan ini diambil dengan mempertimbangkan hasil keseluruhan proses seleksi serta',
      'ketersediaan kuota peserta didik. Kami sangat menghargai semangat belajar dan usaha yang',
      'telah ditunjukkan oleh ananda selama mengikuti rangkaian tes.',
      '',
      'Kami berharap ananda tetap semangat untuk terus belajar dan berjuang meraih cita-cita,',
      'serta menjadikan pengalaman ini sebagai motivasi untuk menjadi pribadi yang lebih baik.',
      'Semoga Allah Subhanahu wa Ta\'ala senantiasa memberikan keberkahan dan kemudahan dalam',
      'setiap langkah ananda.',
      '',
      'Demikian informasi ini kami sampaikan. Atas perhatian dan kerja sama Bapak/Ibu kami',
      'ucapkan terima kasih.'
    ];

    redaksiTidakLulus.forEach(line => {
      if (line === '') {
        yPos += 3; // Spacing untuk baris kosong
      } else {
        doc.text(line, 20, yPos);
        yPos += 5; // Spacing lebih rapat untuk teks panjang
      }
    });

    yPos += 8;
  } else {
    // Belum ada status kelulusan
    doc.text('Rincian biaya jika dinyatakan lulus:', 20, yPos);
    yPos += 8;
  }

  // Tabel biaya hanya untuk siswa lulus atau belum diuji
  if (student.kelulusan !== 'TIDAK LULUS') {
    // Informasi cara pembayaran
    const infoPembayaran = [
      'Pembayaran tunai bisa langsung ke kasir sekolah pada jam operasional 06:50 WIB s/d 11:45 WIB,',
      'atau dapat dilakukan pembayaran via Aplikasi Hijrah https://apk-attauhid.kreasinternasional.com/'
    ];

    infoPembayaran.forEach(line => {
      doc.text(line, 20, yPos);
      yPos += 6;
    });

    yPos += 8;

    // Biaya berdasarkan asrama/non asrama
    const uangPangkal = isAsrama ? 'Rp. 12.800.000,-' : 'Rp. 9.800.000,-';
    const spp = isAsrama ? 'Rp. 1.300.000,-' : 'Rp. 450.000,-';
    const total = isAsrama ? 'Rp. 14.100.000,-' : 'Rp. 10.250.000,-';

    // Tabel biaya modern
    const tableX = 20;
    const tableWidth = 170; // Kembalikan ke 170mm
    const colWidth1 = 120;  // Kembalikan ke 120mm
    const colWidth2 = 50;
    const rowHeight = 8;

    // Header tabel
    doc.setFillColor(37, 99, 235);
    doc.rect(tableX, yPos, tableWidth, rowHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('RINCIAN BIAYA', tableX + 3, yPos + 5.5);
    doc.text('NOMINAL', tableX + colWidth1 + 3, yPos + 5.5);

    yPos += rowHeight;

    // Reset color untuk isi tabel
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    // Row 1: Uang Pangkal
    doc.setFillColor(248, 250, 252);
    doc.rect(tableX, yPos, tableWidth, rowHeight, 'F');
    doc.setLineWidth(0.3);
    doc.setDrawColor(200, 200, 200);
    doc.rect(tableX, yPos, colWidth1, rowHeight);
    doc.rect(tableX + colWidth1, yPos, colWidth2, rowHeight);
    doc.text('Kewajiban Uang Pangkal', tableX + 3, yPos + 5.5);
    doc.text(uangPangkal, tableX + colWidth1 + colWidth2 - 3, yPos + 5.5, { align: 'right' });

    yPos += rowHeight;

    // Row 2: SPP
    doc.rect(tableX, yPos, colWidth1, rowHeight);
    doc.rect(tableX + colWidth1, yPos, colWidth2, rowHeight);
    doc.text('Kewajiban SPP Juli 2026', tableX + 3, yPos + 5.5);
    doc.text(spp, tableX + colWidth1 + colWidth2 - 3, yPos + 5.5, { align: 'right' });

    yPos += rowHeight;

    // Row Total
    doc.setFillColor(37, 99, 235);
    doc.rect(tableX, yPos, tableWidth, rowHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL BIAYA', tableX + 3, yPos + 5.5);
    doc.text(total, tableX + colWidth1 + colWidth2 - 3, yPos + 5.5, { align: 'right' });

    // Reset
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setDrawColor(0, 0, 0);

    yPos += rowHeight + 10;
  }

  // Penutup dan tanda tangan
  doc.text(`Pangkalpinang, ${tanggalSurat}`, 130, yPos);
  yPos += 5;

  doc.text('Kepala Sekolah,', 130, yPos);
  yPos += 5;

  // Area untuk stempel (kotak placeholder)
  const stempelX = 105;
  const stempelY = yPos;
  const stempelWidth = 35;
  const stempelHeight = 20;

  // Kotak stempel dengan border abu-abu
  doc.setLineWidth(0.5);
  doc.setDrawColor(150, 150, 150);
  doc.rect(stempelX, stempelY, stempelWidth, stempelHeight);

  // Text placeholder stempel
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('STEMPEL', stempelX + stempelWidth / 2, stempelY + stempelHeight / 2 - 1, { align: 'center' });
  doc.text('SEKOLAH', stempelX + stempelWidth / 2, stempelY + stempelHeight / 2 + 2, { align: 'center' });

  // Reset color
  doc.setDrawColor(0, 0, 0);
  doc.setTextColor(0, 0, 0);

  // Area untuk tanda tangan (kotak placeholder)
  const ttdX = 130;
  const ttdY = yPos;
  const ttdWidth = 50;
  const ttdHeight = 18;

  // Kotak tanda tangan dengan border abu-abu
  doc.setLineWidth(0.5);
  doc.setDrawColor(150, 150, 150);
  doc.rect(ttdX, ttdY, ttdWidth, ttdHeight);

  // Text placeholder tanda tangan
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('TANDA TANGAN', ttdX + ttdWidth / 2, ttdY + ttdHeight / 2, { align: 'center' });

  // Reset color
  doc.setDrawColor(0, 0, 0);
  doc.setTextColor(0, 0, 0);

  yPos += 22;

  // Nama dan NIY kepala sekolah
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(kepalaSekolah.nama, 130, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`NIY. ${kepalaSekolah.niy}`, 130, yPos);
  yPos += 10; // Kurangi dari 15 ke 10

  // Tembusan (F4 memiliki ruang cukup)
  doc.setFontSize(10);
  doc.text('Tembusan :', 20, yPos);
  yPos += 5;

  const tembusan = [
    'Ketua Panitia PPDB Tahun Ajaran 2026/2027',
    'Staf Administrasi Sistem Yayasan',
    'Staf Keuangan Yayasan'
  ];

  tembusan.forEach(item => {
    doc.text('- ' + item, 25, yPos);
    yPos += 5; // Kembalikan spacing normal
  });

  return doc;
};

export const downloadSuratKeterangan = (student: Student) => {
  const doc = generateSuratKeteranganPDF(student);
  const filename = `Surat_Keterangan_${student.noTes}_${student.data.namaSiswa.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
};

export const getSuratKeteranganBlob = (student: Student): Blob => {
  const doc = generateSuratKeteranganPDF(student);
  return doc.output('blob');
};