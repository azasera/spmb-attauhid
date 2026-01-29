import { BookOpen, GraduationCap, School } from 'lucide-react';
import { LembagaData, Petugas, Penguji, PenilaianData } from '../types';

export const lembagaData: LembagaData[] = [
  {
    id: 'SDITA',
    name: 'SDITA',
    fullName: 'Sekolah Dasar Islam Tahfizh Al Qur\'an',
    icon: School,
    color: 'from-blue-500 to-blue-600',
    prefix: 'SD',
    address: {
      building: 'Gedung SDITA At-Tauhid',
      street: 'Jl. Jebung Dalam, Kec. Jerambah Gantung, Kec. Gabek, Kota Pangkalpinang',
      mapsUrl: 'https://maps.app.goo.gl/1rybmAgMprtLQjhU6'
    }
  },
  {
    id: 'SMPITA',
    name: 'SMPITA',
    fullName: 'Sekolah Menengah Pertama Islam Tahfizh Al Qur\'an',
    icon: BookOpen,
    color: 'from-green-500 to-green-600',
    prefix: 'SMP',
    address: {
      building: 'Ponpes Islamic Centre At-Tauhid Bangka Belitung',
      street: 'Jl. Gerunggang Dalam RT.08 RW.03, Kel. Air Kepala Tujuh, Kec. Gerunggang, Kota Pangkalpinang',
      mapsUrl: 'https://share.google/HItV1We2IbNUOh2R8'
    }
  },
  {
    id: 'SMAITA',
    name: 'SMAITA',
    fullName: 'Sekolah Menengah Atas Islam Tahfizh Al Qur\'an',
    icon: GraduationCap,
    color: 'from-purple-500 to-purple-600',
    prefix: 'SMA',
    address: {
      building: 'Ponpes Islamic Centre At-Tauhid Bangka Belitung',
      street: 'Jl. Gerunggang Dalam RT.08 RW.03, Kel. Air Kepala Tujuh, Kec. Gerunggang, Kota Pangkalpinang',
      mapsUrl: 'https://share.google/HItV1We2IbNUOh2R8'
    }
  },
  {
    id: 'MTA',
    name: 'MTA',
    fullName: 'Manzhumah Takhoshush Al Qur\'an',
    icon: BookOpen,
    color: 'from-orange-500 to-orange-600',
    prefix: 'MTA',
    address: {
      building: 'Ponpes Islamic Centre At-Tauhid Bangka Belitung',
      street: 'Jl. Gerunggang Dalam RT.08 RW.03, Kel. Air Kepala Tujuh, Kec. Gerunggang, Kota Pangkalpinang',
      mapsUrl: 'https://share.google/HItV1We2IbNUOh2R8'
    }
  }
];

export const petugasList: Petugas[] = [
  { name: 'Satria', role: 'TU SDITA' },
  { name: 'Nanda', role: 'TU SMPITA' },
  { name: 'Apriyanto', role: 'TU MTA / SMAITA' }
];

export const pengujiList: Penguji[] = [
  { name: 'Subrian Muji', role: 'PENGUJI AT TAUHID' },
  { name: 'Heri Febri', role: 'PENGUJI AT TAUHID' },
  { name: 'Faturahman', role: 'PENGUJI AT TAUHID' },
  { name: 'Akbar Wiguna', role: 'PENGUJI AT TAUHID' },
  { name: 'Azali Ahmad', role: 'PENGUJI ICT' },
  { name: 'Delly', role: 'PENGUJI ICT' },
  { name: 'Meditoma', role: 'PENGUJI ICT' },
  { name: 'Randhy Raviza', role: 'PENGUJI ICT' },
  { name: 'Yasser', role: 'PENGUJI ICT' },
  { name: 'Nayotama', role: 'PENGUJI ICT' }
];

export const penilaianSD: PenilaianData = {
  anak: [
    'Bangun Pagi',
    'Sholat Lima Waktu',
    'Iqra (menyimak bacaan Iqra)',
    'Pengenalan huruf Hijaiyah',
    'Jumlah Hafalan',
    'Penilaian Bacaan hafalan',
    'Penilaian Tajwid hafalan',
    'Bersedia Menghafal Al Qur\'an Setiap Hari',
    'Pengenalan abjad dan angka',
    'Kemampuan Membaca',
    'Kemampuan Menulis',
    'Kemampuan Berhitung',
    'Meninggalkan HP Game, Musik, Nonton Film'
  ],
  ortu: [
    'Penampilan orang tua',
    'Sikap orang tua jika anak tidak sholat 5 waktu',
    'Tipe anak (cari Info dari orang tua)',
    'Kajian yang diikuti orang tua',
    'Kesanggupan orang tua mengikuti kajian dan Program Tahsin Wali Santri',
    'Alasan memilih sekolah di At Tauhid',
    'Pernyataan sanggup sekolah meski kurikulumnya berat',
    'Komitmen melarang anak menonton tayangan tidak mendidik',
    'Prestasi yang diraih di Sekolah',
    'Cara orang tua agar anak bisa menghafal',
    'Kesanggupan membimbing anak menghafal di rumah',
    'Kesanggupan melunasi uang pangkal',
    'Kesanggupan membayar biaya tambahan kegiatan',
    'Kesanggupan melunasi biaya daftar ulang',
    'Sikap terhadap uang pangkal tidak bisa dikembalikan',
    'Kesanggupan mentaati semua aturan sekolah',
    'Penilaian terhadap Anak',
    'Penilaian terhadap orang tua',
    'Peraturan kredit poin'
  ]
};

export const penilaianSMP: PenilaianData = {
  anak: [
    'Bangun Pagi',
    'Sholat Lima Waktu',
    'Rutinitas Baca Al Qur\'an',
    'Kemampuan Baca Al Qur\'an | TES BACA QUR\'AN',
    'Jumlah Hafalan',
    'Nilai Tugas Hafalan',
    'Nilai Tajwid',
    'Bersedia Menghafal Al Qur\'an sesuai target Setiap hari',
    'Bersedia diberi sanksi jika tidak menghafal',
    'Kegiatan di rumah setelah isya dan Setelah subuh',
    'Alasan memilih sekolah di At Tauhid',
    'Komitmen tidak memiliki HP secara pribadi',
    'Komitmen untuk menaati semua aturan pondok',
    'Prestasi yang pernah diraih'
  ],
  ortu: [
    'Penampilan orang tua',
    'Sikap orang tua jika anak tidak sholat 5 waktu',
    'Tipe anak (cari Info dari orang tua)',
    'Kajian yang diikuti orang tua',
    'Kesanggupan mengikuti kajian dan Program Tahsin Wali Santri',
    'Alasan memilih sekolah di At Tauhid',
    'Pernyataan sanggup sekolah meski kurikulumnya berat',
    'Komitmen tidak memberikan HP kepada anak',
    'Cara orang tua agar anak bisa menghafal',
    'Komitmen membantu membimbing anak menghafal di rumah',
    'Kesanggupan melunasi uang pangkal',
    'Kesanggupan membayar biaya tambahan kegiatan',
    'Kesanggupan melunasi biaya daftar ulang Rp. 600.000',
    'Sikap terhadap uang pangkal tidak bisa dikembalikan',
    'Kesanggupan mentaati semua aturan sekolah',
    'Sikap terhadap Peraturan kredit poin',
    'Sikap terhadap SPP paling lambat tgl 10',
    'Penilaian terhadap Anak',
    'Penilaian terhadap orang tua'
  ]
};

export const penilaianSMA: PenilaianData = {
  anak: [
    'Bangun Pagi',
    'Sholat Lima Waktu',
    'Rutinitas Baca Al Qur\'an',
    'Kemampuan Baca Al Qur\'an | TES BACA QUR\'AN',
    'Jumlah Hafalan',
    'Nilai Tugas Hafalan',
    'Nilai Tajwid',
    'Bersedia Menghafal Al Qur\'an sesuai target Setiap hari',
    'Kegiatan di rumah setelah isya dan Setelah subuh',
    'Alasan memilih sekolah di At Tauhid',
    'Komitmen Tidak Menonton Tayangan Tidak Mendidik',
    'Komitmen untuk menaati semua aturan pondok',
    'Prestasi yang pernah diraih'
  ],
  ortu: [
    'Penampilan orang tua',
    'Sikap orang tua jika anak tidak sholat 5 waktu',
    'Tipe anak (cari Info dari orang tua)',
    'Kajian yang diikuti orang tua',
    'Kesanggupan mengikuti kajian dan Program Tahsin Wali Santri',
    'Alasan memilih sekolah di At Tauhid',
    'Pernyataan sanggup sekolah meski kurikulumnya berat',
    'Komitmen tidak memberikan HP kepada anak',
    'Cara orang tua agar anak bisa menghafal',
    'Komitmen membantu membimbing anak menghafal di rumah',
    'Kesanggupan melunasi uang pangkal',
    'Kesanggupan membayar biaya tambahan kegiatan',
    'Kesanggupan melunasi biaya daftar ulang Rp. 600.000',
    'Sikap terhadap uang pangkal tidak bisa dikembalikan',
    'Kesanggupan mentaati semua aturan sekolah',
    'Sikap terhadap Peraturan kredit poin',
    'Sikap terhadap SPP paling lambat tgl 10',
    'Sikap terhadap Peraturan Pengabdian santri',
    'Sikap terhadap Ijazah pondok diberikan setelah 1 tahun',
    'Penilaian terhadap Anak',
    'Penilaian terhadap orang tua'
  ]
};

export const penilaianMTA: PenilaianData = {
  anak: [
    'Bangun Pagi',
    'Sholat Lima Waktu',
    'Rutinitas Baca Al Qur\'an',
    'Kemampuan Baca Al Qur\'an | TES BACA QUR\'AN',
    'Jumlah Hafalan',
    'Nilai Tugas Hafalan',
    'Nilai Tajwid',
    'Bersedia Menghafal Al Qur\'an sesuai target Setiap hari',
    'Kegiatan di rumah setelah isya dan Setelah subuh',
    'Alasan memilih MTA At Tauhid',
    'Komitmen Tidak Menonton Tayangan Tidak Mendidik',
    'Komitmen untuk menaati semua aturan pondok',
    'Prestasi yang pernah diraih'
  ],
  ortu: [
    'Penampilan orang tua',
    'Sikap orang tua jika anak tidak sholat 5 waktu',
    'Tipe anak (cari Info dari orang tua)',
    'Kajian yang diikuti orang tua',
    'Kesanggupan mengikuti kajian dan Program Tahsin Wali Santri',
    'Alasan memilih MTA At Tauhid',
    'Pernyataan sanggup sekolah meski kurikulumnya berat',
    'Komitmen tidak memberikan HP kepada anak',
    'Cara orang tua agar anak bisa menghafal',
    'Komitmen membantu membimbing anak menghafal di rumah',
    'Kesanggupan melunasi uang pangkal',
    'Kesanggupan membayar biaya tambahan kegiatan',
    'Kesanggupan melunasi biaya daftar ulang Rp. 600.000',
    'Sikap terhadap uang pangkal tidak bisa dikembalikan',
    'Kesanggupan mentaati semua aturan sekolah',
    'Sikap terhadap Peraturan kredit poin',
    'Sikap terhadap SPP paling lambat tgl 10',
    'Sikap terhadap Peraturan Pengabdian santri',
    'Sikap terhadap Ijazah pondok diberikan setelah 1 tahun',
    'Penilaian terhadap Anak',
    'Penilaian terhadap orang tua'
  ]
};

// Rubrik penilaian (santri & ortu) untuk tooltip per item
// Catatan: ringkas, berbasis indikator yang mudah diamati
export const rubrikSantri: Record<string, string> = {
  'Bangun Pagi': '1: sering bangun lewat Subuh; 3: bangun Subuh dengan diingatkan; 5: bangun sebelum Subuh konsisten.',
  'Sholat Lima Waktu': '1: hampir tidak sholat; tidak ada komitmen. 2: sholat jarang; perlu dorongan kuat. 3: sholat sebagian; kadang lalai tanpa alasan kuat. 4: sholat konsisten; sesekali luput dengan alasan jelas. 5: sholat rutin; disiplin; komitmen kuat.',
  'Iqra (menyimak bacaan Iqra)': '1: belum mengenal huruf/iqra; 3: dapat menyimak iqra dasar; 5: menyimak lancar dan benar.',
  'Pengenalan huruf Hijaiyah': '1: belum kenal; 3: kenal sebagian huruf; 5: kenal semua huruf dan makhraj dasar.',
  'Jumlah Hafalan': '1: belum ada hafalan (0–1 baris). 2: hafalan sangat sedikit (2–4 baris); sering salah. 3: hafalan dasar (5–8 baris); ada koreksi. 4: hafalan cukup (9–12 baris); ketepatan baik. 5: hafalan kuat (13–15 baris); tepat dan mantap.',
  'Penilaian Bacaan hafalan': '1: terbata dan banyak salah; 3: lancar sebagian; 5: lancar jelas dan benar.',
  'Penilaian Tajwid hafalan': '1: sering salah tajwid; 3: tajwid dasar cukup; 5: tajwid baik dan konsisten.',
  'Bersedia Menghafal Al Qur\'an Setiap Hari': '1: menolak; 3: bersedia bila dibimbing; 5: semangat dan konsisten.',
  'Pengenalan abjad dan angka': '1: belum kenal; 3: kenal sebagian; 5: kenal semua huruf/angka.',
  'Kemampuan Membaca': '1: belum mengenal huruf; tidak mampu membentuk suku kata. 2: mengenal sebagian huruf; membaca terputus-putus dengan banyak salah. 3: membaca kata sederhana; kesalahan masih ada namun dipahami. 4: membaca lancar teks pendek; intonasi cukup; sedikit salah. 5: membaca lancar teks variatif; intonasi dan pemahaman baik.',
  'Kemampuan Menulis': '1: belum bisa; 3: menulis huruf/kalimat sederhana; 5: tulisan rapi dan jelas.',
  'Kemampuan Berhitung': '1: belum bisa; 3: tambah/kurang sederhana; 5: berhitung lancar sesuai jenjang.',
  'Meninggalkan HP Game, Musik, Nonton Film': '1: ketergantungan tinggi; 3: mulai dikurangi; 5: ditinggalkan/terkendali konsisten.',
  'Rutinitas Baca Al Qur\'an': '1: jarang; 3: 3–4 kali/minggu; 5: setiap hari konsisten.',
  'Kemampuan Baca Al Qur\'an | TES BACA QUR\'AN': '1: terbata, banyak salah; 3: cukup lancar, salah minor; 5: lancar, tajwid baik.',
  'Nilai Tugas Hafalan': '1: tugas jarang tuntas; 3: tuntas sebagian; 5: tuntas konsisten.',
  'Nilai Tajwid': '1: sering salah; 3: cukup; 5: baik dan konsisten.',
  'Bersedia Menghafal Al Qur\'an sesuai target Setiap hari': '1: menolak; 3: bersedia bila diarahkan; 5: konsisten sesuai target.',
  'Bersedia diberi sanksi jika tidak menghafal': '1: tidak bersedia; 3: bersedia dengan syarat; 5: bersedia dan patuh.',
  'Kegiatan di rumah setelah isya dan Setelah subuh': '1: tidak teratur; 3: kadang teratur; 5: teratur untuk ibadah/belajar.',
  'Alasan memilih sekolah di At Tauhid': '1: tidak jelas; 3: cukup jelas; 5: alasan kuat dan sejalan visi.',
  'Alasan memilih MTA At Tauhid': '1: tidak jelas; 3: cukup jelas; 5: alasan kuat dan sejalan visi MTA.',
  'Komitmen tidak memiliki HP secara pribadi': '1: tidak komit; 3: komit dengan pengecualian; 5: komit penuh.',
  'Komitmen untuk menaati semua aturan pondok': '1: sering melanggar; 3: kadang melanggar; 5: taat aturan.',
  'Komitmen Tidak Menonton Tayangan Tidak Mendidik': '1: sering menonton; 3: mulai dikurangi; 5: meninggalkan konsisten.',
  'Prestasi yang pernah diraih': '1: belum ada; 3: ada tingkat sekolah; 5: beragam/tingkat lebih tinggi.'
};

export const rubrikOrtu: Record<string, string> = {
  'Penampilan orang tua': '1: Tidak sopan dan tidak syar\'i. 2: Kurang rapi, sebagian tidak sesuai syariat. 3: Cukup rapi, menutup aurat namun belum sepenuhnya syar\'i. 4: Rapi, sopan, dan sesuai adab berpakaian Islami. 5: Syar\'i, rapi, dan mencerminkan keteladanan Islami.',
  'Sikap orang tua jika anak tidak sholat 5 waktu': '1: abai; 3: mengingatkan kadang; 5: tegas dan membimbing.',
  'Tipe anak (cari Info dari orang tua)': '1: mudah emosi/sulit diarahkan; 3: kadang sulit; 5: kooperatif dan disiplin.',
  'Kajian yang diikuti orang tua': '1: Jarang atau tidak pernah mengikuti kajian. 2: Sesekali hadir, tanpa istiqamah. 3: Kadang mengikuti kajian umum. 4: Cukup rutin mengikuti kajian keislaman. 5: Rutin mengikuti kajian sunnah dan bersemangat menuntut ilmu.',
  'Kesanggupan orang tua mengikuti kajian dan Program Tahsin Wali Santri': '1: tidak sanggup; 3: sanggup sebagian; 5: sanggup konsisten.',
  'Kesanggupan mengikuti kajian dan Program Tahsin Wali Santri': '1: tidak sanggup; 3: sanggup sebagian; 5: sanggup konsisten.',
  'Alasan memilih sekolah di At Tauhid': '1: Alasan tidak jelas atau bersifat umum (misal: ikut-ikutan, dekat rumah). 2: Ada alasan, namun kurang menunjukkan kesadaran akan visi Islami sekolah. 3: Alasan cukup jelas dan menunjukkan keinginan menyekolahkan anak di lingkungan Islami. 4: Alasan selaras dengan tujuan pendidikan Islam dan pembinaan akhlak. 5: Alasan sangat jelas, selaras dengan visi-misi At-Tauhid dalam membentuk generasi Qur\'ani dan berakhlak sunnah.',
  'Alasan memilih MTA At Tauhid': '1: Alasan tidak jelas atau bersifat umum (misal: ikut-ikutan, dekat rumah). 2: Ada alasan, namun kurang menunjukkan kesadaran akan visi MTA. 3: Alasan cukup jelas dan menunjukkan keinginan menyekolahkan anak di MTA. 4: Alasan selaras dengan tujuan pendidikan khusus Al-Qur\'an. 5: Alasan sangat jelas, selaras dengan visi-misi MTA dalam membentuk generasi hafizh Qur\'an.',
  'Pernyataan sanggup sekolah meski kurikulumnya berat': '1: ragu; 3: sanggup dengan catatan; 5: sanggup tegas.',
  'Komitmen melarang anak menonton tayangan tidak mendidik': '1: Tidak konsisten; anak masih bebas menonton tayangan tidak mendidik. 2: Sudah menasihati, tetapi belum tegas membatasi tontonan anak. 3: Mulai konsisten mengawasi tontonan anak, namun belum sepenuhnya terkontrol. 4: Konsisten mengarahkan anak pada tontonan bermanfaat dan islami. 5: Konsisten dan tegas melarang anak menonton tayangan tidak mendidik, serta menanamkan adab dan nilai syar\'i dalam penggunaan media.',
  'Komitmen tidak memberikan HP kepada anak': '1: tidak komit; 3: komit bersyarat; 5: komit penuh.',
  'Cara orang tua agar anak bisa menghafal': '1: tanpa rencana; 3: rencana dasar; 5: rencana jelas dan pendampingan.',
  'Komitmen membantu membimbing anak menghafal di rumah': '1: tidak sanggup; tidak ada waktu/komitmen. 2: sanggup terbatas; tanpa rencana jelas. 3: sanggup dengan rencana dasar; konsistensi sedang. 4: sanggup dengan rencana terstruktur; konsisten. 5: sangat sanggup; rencana detail; komitmen tinggi.',
  'Kesanggupan melunasi uang pangkal': '1: tidak sanggup; 3: sanggup bertahap; 5: sanggup sesuai ketentuan.',
  'Kesanggupan membayar biaya tambahan kegiatan': '1: keberatan; 3: bersedia terbatas; 5: bersedia sesuai ketentuan.',
  'Kesanggupan melunasi biaya daftar ulang': '1: tidak sanggup; 3: sanggup bertahap; 5: sanggup tepat waktu.',
  'Kesanggupan melunasi biaya daftar ulang Rp. 600.000': '1: tidak sanggup; 3: sanggup bertahap; 5: sanggup tepat waktu.',
  'Sikap terhadap uang pangkal tidak bisa dikembalikan': '1: tidak setuju; 3: setuju dengan catatan; 5: setuju dan paham aturan.',
  'Kesanggupan mentaati semua aturan sekolah': '1: Kurang siap menaati aturan sekolah. 3: Siap menaati sebagian aturan, namun masih perlu bimbingan. 5: Siap dan berkomitmen penuh menaati seluruh aturan sekolah dengan kesadaran syar\'i.',
  'Sikap terhadap Peraturan kredit poin': '1: menolak; 3: menerima sebagian; 5: menerima dan mendukung.',
  'Sikap terhadap SPP paling lambat tgl 10': '1: tidak setuju; 3: setuju dengan catatan; 5: setuju dan siap patuhi.',
  'Sikap terhadap Peraturan Pengabdian santri': '1: menolak; 3: menerima sebagian; 5: menerima dan mendukung.',
  'Sikap terhadap Ijazah pondok diberikan setelah 1 tahun': '1: menolak; 3: ragu; 5: menerima dan paham tujuan.',
  'Penilaian terhadap Anak': '1: Kurang sopan, enggan berinteraksi, atau menunjukkan sikap negatif. 3: Bersikap netral; menjawab seperlunya namun belum tampak antusias atau beradab kuat. 5: Menunjukkan adab yang baik, sopan, percaya diri, dan jawaban yang positif serta membangun.',
  'Penilaian terhadap orang tua': '1: tidak kooperatif; 3: cukup kooperatif; 5: kooperatif aktif.',
  'Peraturan kredit poin': '1: menolak; 3: menerima sebagian; 5: menerima dan mendukung.'
};

// Tambahan rubrik ortu (SD) yang spesifik
rubrikOrtu['Prestasi yang diraih di Sekolah'] = '1: belum ada prestasi; 3: prestasi tingkat sekolah; 5: prestasi beragam/tingkat lebih tinggi.';

// Sinkronisasi rubrik untuk butir SD yang menggunakan istilah "Kesanggupan membimbing anak menghafal di rumah"
rubrikOrtu['Kesanggupan membimbing anak menghafal di rumah'] = '1: tidak sanggup; tidak ada waktu/komitmen. 2: sanggup terbatas; tanpa rencana jelas. 3: sanggup dengan rencana dasar; konsistensi sedang. 4: sanggup dengan rencana terstruktur; konsisten. 5: sangat sanggup; rencana detail; komitmen tinggi.';

