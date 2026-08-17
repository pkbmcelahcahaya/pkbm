import {
  TatapMuka,
  Tugas,
  PengumpulanTugas,
  Soal,
  Ulangan,
  UjianAttempt,
  NotifikasiApp
} from '../types';

export const INITIAL_TATAP_MUKA: TatapMuka[] = [
  {
    id: 'TM-001',
    judul: 'Bedah Teks Eksplanasi & Analisis Struktur Kebahasaan',
    deskripsi: 'Sesi tatap muka interaktif membahas telaah teks eksplanasi ilmiah dan fenomena alam sesuai Modul 1 Bahasa Indonesia Paket B.',
    mata_pelajaran: 'Bahasa Indonesia',
    kelas: 'Kelas 8 Paket B',
    paket: 'PAKET B',
    tutor_id: 'USR-TUT-01',
    tutor_nama: 'Dr. Opik, M.Pd',
    tanggal: '2026-08-15',
    jam_mulai: '09:00',
    jam_selesai: '11:30',
    link_meet: 'https://meet.google.com/abc-defg-hij',
    materi_id: 'MAT-B-001',
    materi_judul: 'Bahasa Indonesia Modul 1: Indahnya Alam Negeriku',
    status: 'BERLANGSUNG',
    created_at: '2026-08-14'
  },
  {
    id: 'TM-002',
    judul: 'Konsultasi Aljabar Linear & Penyelesaian Soal Cerita',
    deskripsi: 'Pendalaman materi bentuk aljabar, persamaan linear satu variabel, dan tanya jawab tugas mandiri.',
    mata_pelajaran: 'Matematika',
    kelas: 'Kelas 9 Paket B',
    paket: 'PAKET B',
    tutor_id: 'USR-TUT-05',
    tutor_nama: 'Ruli Lesmana, S.T',
    tanggal: '2026-08-16',
    jam_mulai: '13:30',
    jam_selesai: '15:00',
    link_meet: 'https://meet.google.com/mat-pkbm-cel',
    materi_id: 'MAT-B-004',
    materi_judul: 'Matematika Modul 2: Asyiknya Berdagang',
    status: 'AKAN_DATANG',
    created_at: '2026-08-14'
  },
  {
    id: 'TM-003',
    judul: 'Kajian Realitas Sosial & Dinamika Kelompok Masyarakat',
    deskripsi: 'Diskusi interaktif studi kasus gejala sosial dan diferensiasi sosial di era digital.',
    mata_pelajaran: 'Sosiologi',
    kelas: 'Kelas 11 Paket C',
    paket: 'PAKET C',
    tutor_id: 'USR-TUT-02',
    tutor_nama: 'Nita Nurhayati, M.Hum',
    tanggal: '2026-08-15',
    jam_mulai: '10:00',
    jam_selesai: '12:00',
    link_meet: 'https://meet.google.com/sos-celah-cahaya',
    materi_id: 'MAT-C-002',
    materi_judul: 'Sosiologi Modul 1: Memahami Gejala Sosial dalam Masyarakat',
    status: 'BERLANGSUNG',
    created_at: '2026-08-14'
  },
  {
    id: 'TM-004',
    judul: 'Apresiasi Sastra & Penulisan Proposal Penelitian Singkat',
    deskripsi: 'Sesi pengenalan metodologi penulisan karya ilmiah dan telaah artikel opini media massa.',
    mata_pelajaran: 'Bahasa Indonesia',
    kelas: 'Kelas 12 Paket C',
    paket: 'PAKET C',
    tutor_id: 'USR-TUT-02',
    tutor_nama: 'Nita Nurhayati, M.Hum',
    tanggal: '2026-08-17',
    jam_mulai: '08:30',
    jam_selesai: '10:00',
    link_meet: 'https://meet.google.com/bin-c12-pkbm',
    status: 'AKAN_DATANG',
    created_at: '2026-08-13'
  }
];

export const INITIAL_TUGAS: Tugas[] = [
  {
    id: 'TGS-001',
    judul: 'Tugas Mandiri 1: Analisis Struktur Teks Hasil Observasi',
    deskripsi: 'Baca Modul 1 Bahasa Indonesia halaman 12-18. Buatlah ringkasan struktur teks laporan hasil observasi lingkungan sekitar tempat tinggal Anda (Definisi Umum, Deskripsi Bagian, dan Manfaat/Kesimpulan). Tuliskan jawaban pada kolom isian atau lampirkan berkas PDF/Word.',
    kelas: 'Kelas 8 Paket B',
    paket: 'PAKET B',
    mata_pelajaran: 'Bahasa Indonesia',
    materi_terkait_id: 'MAT-B-001',
    materi_terkait_judul: 'Bahasa Indonesia Modul 1: Indahnya Alam Negeriku',
    tutor_id: 'USR-TUT-01',
    tutor_nama: 'Dr. Opik, M.Pd',
    tanggal_mulai: '2026-08-10',
    batas_pengumpulan: '2026-08-18T23:59',
    nilai_maksimal: 100,
    file_lampiran_nama: 'Lembar_Kerja_Observasi_PaketB.pdf',
    file_lampiran_url: 'https://drive.google.com/drive/folders/1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX',
    status: 'AKTIF',
    created_at: '2026-08-10'
  },
  {
    id: 'TGS-002',
    judul: 'Latihan 2: Pemodelan Matematika & Sistem Persamaan Linear',
    deskripsi: 'Kerjakan 5 butir soal latihan aljabar pada lembar modul bab 2. Sertakan langkah-langkah penyelesaian matematis secara berurutan dan jelas.',
    kelas: 'Kelas 8 & 9 Paket B',
    paket: 'PAKET B',
    mata_pelajaran: 'Matematika',
    materi_terkait_id: 'MAT-B-004',
    materi_terkait_judul: 'Matematika Modul 2: Asyiknya Berdagang',
    tutor_id: 'USR-TUT-05',
    tutor_nama: 'Ruli Lesmana, S.T',
    tanggal_mulai: '2026-08-12',
    batas_pengumpulan: '2026-08-20T23:59',
    nilai_maksimal: 100,
    status: 'AKTIF',
    created_at: '2026-08-12'
  },
  {
    id: 'TGS-003',
    judul: 'Tugas Portofolio 1: Telaah Fenomena Interaksi Sosial di Media Digital',
    deskripsi: 'Buatlah esai analisis kritis (panjang 500-800 kata) mengenai bentuk-bentuk interaksi sosial asosiatif dan disosiatif pada komunitas daring di Indonesia. Cantumkan contoh kasus nyata dan saran solutif.',
    kelas: 'Kelas 11 Paket C',
    paket: 'PAKET C',
    mata_pelajaran: 'Sosiologi',
    materi_terkait_id: 'MAT-C-002',
    materi_terkait_judul: 'Sosiologi Modul 1: Memahami Gejala Sosial dalam Masyarakat',
    tutor_id: 'USR-TUT-02',
    tutor_nama: 'Nita Nurhayati, M.Hum',
    tanggal_mulai: '2026-08-08',
    batas_pengumpulan: '2026-08-16T23:59',
    nilai_maksimal: 100,
    file_lampiran_nama: 'Rubrik_Penilaian_Esai_Sosiologi.pdf',
    file_lampiran_url: 'https://drive.google.com/drive/folders/1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX',
    status: 'AKTIF',
    created_at: '2026-08-08'
  },
  {
    id: 'TGS-004',
    judul: 'Tugas Praktik: Penyusunan Artikel Opini Bertema Pendidikan',
    deskripsi: 'Susun artikel opini argumentatif minimal 3 paragraf dengan kaidah kebahasaan baku EYD V. Lampirkan berkas dokumen atau ketik langsung.',
    kelas: 'Kelas 12 Paket C',
    paket: 'PAKET C',
    mata_pelajaran: 'Bahasa Indonesia',
    tutor_id: 'USR-TUT-02',
    tutor_nama: 'Nita Nurhayati, M.Hum',
    tanggal_mulai: '2026-08-11',
    batas_pengumpulan: '2026-08-19T23:59',
    nilai_maksimal: 100,
    status: 'AKTIF',
    created_at: '2026-08-11'
  }
];

export const INITIAL_PENGUMPULAN_TUGAS: PengumpulanTugas[] = [
  {
    id: 'SUB-001',
    tugas_id: 'TGS-001',
    user_id: 'USR-SIS-01',
    siswa_nama: 'Ahmad Faisal Pratama',
    siswa_paket: 'PAKET B',
    waktu_pengumpulan: '2026-08-14 15:30 WIB',
    teks_jawaban: 'Berikut adalah hasil analisis laporan observasi kebun hidroponik di lingkungan RW 04:\n1. Definisi Umum: Tanaman hidroponik adalah budidaya tanaman tanpa media tanah dengan nutrisi air.\n2. Deskripsi Bagian: Terdiri dari instalasi pipa PVC, pompa sirkulasi air, netpot tanaman, dan larutan nutrisi AB Mix.\n3. Manfaat: Menghemat lahan, panen sayuran lebih bersih, bebas pestisida kimia, dan ramah lingkungan.',
    file_nama: 'Laporan_Observasi_Faisal_PaketB.pdf',
    file_url: 'https://drive.google.com/drive/folders/1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX',
    file_tipe: 'application/pdf',
    file_ukuran: '1.2 MB',
    status: 'SUDAH_DINILAI',
    nilai: 92,
    feedback_tutor: 'Sangat baik dan sistematis! Struktur definisi dan deskripsi bagian sudah sesuai kaidah teks hasil observasi. Pertahankan kualitas tulisanmu.',
    dinilai_oleh: 'Dr. Opik, M.Pd',
    dinilai_pada: '2026-08-15 08:45 WIB'
  },
  {
    id: 'SUB-002',
    tugas_id: 'TGS-003',
    user_id: 'USR-SIS-02',
    siswa_nama: 'Siti Nurhaliza',
    siswa_paket: 'PAKET C',
    waktu_pengumpulan: '2026-08-14 19:40 WIB',
    teks_jawaban: 'Esai analisis gejala sosial dalam interaksi media digital terlampir pada dokumen PDF. Ringkasan poin: fenomena fear of missing out (FOMO) dan cyberbullying dapat diminimalisir melalui literasi digital inklusif serta penanaman etika komunikasi.',
    file_nama: 'Esai_Sosiologi_Siti_Nurhaliza.pdf',
    file_url: 'https://drive.google.com/drive/folders/1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX',
    file_tipe: 'application/pdf',
    file_ukuran: '2.4 MB',
    status: 'SUDAH_DIKUMPULKAN'
  }
];

export const INITIAL_BANK_SOAL: Soal[] = [
  // Paket B Soal
  {
    id: 'SOAL-B-001',
    mata_pelajaran: 'Bahasa Indonesia',
    paket: 'PAKET B',
    topik_materi: 'Teks Hasil Observasi',
    tipe: 'PILIHAN_GANDA',
    pertanyaan: 'Bagian teks laporan hasil observasi yang memuat penjelasan awal mengenai objek yang diamati secara umum disebut...',
    opsi_pilihan: [
      { key: 'A', text: 'Deskripsi Bagian' },
      { key: 'B', text: 'Pernyataan Umum / Definisi' },
      { key: 'C', text: 'Deskripsi Manfaat' },
      { key: 'D', text: 'Penutup / Simpulan' }
    ],
    kunci_jawaban: 'B',
    bobot_nilai: 10,
    penjelasan: 'Pernyataan umum/definisi merupakan pembuka yang berisi keterangan umum objek yang diobservasi.',
    kesulitan: 'MUDAH',
    created_at: '2026-08-10'
  },
  {
    id: 'SOAL-B-002',
    mata_pelajaran: 'Bahasa Indonesia',
    paket: 'PAKET B',
    topik_materi: 'Kaidah Kebahasaan',
    tipe: 'BENAR_SALAH',
    pertanyaan: 'Teks laporan hasil observasi harus bersifat subjektif dan memuat opini pribadi penulis tanpa data fakta nyata di lapangan.',
    kunci_jawaban: 'SALAH',
    bobot_nilai: 10,
    penjelasan: 'Teks hasil observasi wajib bersifat objektif berdasarkan fakta dan data nyata yang diperoleh dari pengamatan.',
    kesulitan: 'MUDAH',
    created_at: '2026-08-10'
  },
  {
    id: 'SOAL-B-003',
    mata_pelajaran: 'Matematika',
    paket: 'PAKET B',
    topik_materi: 'Aljabar & Persamaan Linear',
    tipe: 'PILIHAN_GANDA',
    pertanyaan: 'Jika 3x + 7 = 22, maka nilai dari x adalah...',
    opsi_pilihan: [
      { key: 'A', text: '3' },
      { key: 'B', text: '4' },
      { key: 'C', text: '5' },
      { key: 'D', text: '6' }
    ],
    kunci_jawaban: 'C',
    bobot_nilai: 15,
    penjelasan: '3x = 22 - 7 => 3x = 15 => x = 5.',
    kesulitan: 'MUDAH',
    created_at: '2026-08-10'
  },
  {
    id: 'SOAL-B-004',
    mata_pelajaran: 'Matematika',
    paket: 'PAKET B',
    topik_materi: 'Aritmatika Sosial',
    tipe: 'ISIAN_SINGKAT',
    pertanyaan: 'Seorang pedagang membeli barang seharga Rp 100.000 dan menjualnya kembali seharga Rp 125.000. Berapakah persentase keuntungan pedagang tersebut? (Tuliskan angka persennya saja, contoh: 25)',
    kunci_jawaban: '25',
    bobot_nilai: 15,
    penjelasan: 'Untung = 125.000 - 100.000 = 25.000. Persentase = (25.000 / 100.000) * 100% = 25%.',
    kesulitan: 'SEDANG',
    created_at: '2026-08-10'
  },
  {
    id: 'SOAL-B-005',
    mata_pelajaran: 'Bahasa Indonesia',
    paket: 'PAKET B',
    topik_materi: 'Analisis Paragraf',
    tipe: 'URAIAN',
    pertanyaan: 'Jelaskan 3 ciri utama teks laporan hasil observasi dan berikan 1 contoh kalimat klasifikasi!',
    kunci_jawaban: 'Rubrik: 1. Bersifat objektif, 2. Berdasarkan fakta lapangan, 3. Disusun terstruktur. Contoh klasifikasi: "Berdasarkan habitatnya, hewan digolongkan menjadi hewan darat, air, dan amfibi."',
    bobot_nilai: 20,
    penjelasan: 'Jawaban uraian dinilai berdasarkan kelengkapan 3 ciri dan ketepatan contoh kalimat klasifikasi.',
    kesulitan: 'SEDANG',
    created_at: '2026-08-10'
  },

  // Paket C Soal
  {
    id: 'SOAL-C-001',
    mata_pelajaran: 'Sosiologi',
    paket: 'PAKET C',
    topik_materi: 'Gejala Sosial',
    tipe: 'PILIHAN_GANDA',
    pertanyaan: 'Faktor pendorong terjadinya mobilitas sosial vertikal naik pada masyarakat modern adalah...',
    opsi_pilihan: [
      { key: 'A', text: 'Sistem stratifikasi sosial tertutup' },
      { key: 'B', text: 'Akses pendidikan bermutu dan keahlian profesi' },
      { key: 'C', text: 'Diskriminasi gender dan ras' },
      { key: 'D', text: 'Pola kepemimpinan tradisional turun temurun' }
    ],
    kunci_jawaban: 'B',
    bobot_nilai: 10,
    penjelasan: 'Pendidikan merupakan saluran utama (social elevator) untuk mobilitas vertikal naik.',
    kesulitan: 'MUDAH',
    created_at: '2026-08-10'
  },
  {
    id: 'SOAL-C-002',
    mata_pelajaran: 'Sosiologi',
    paket: 'PAKET C',
    topik_materi: 'Interaksi Sosial',
    tipe: 'BENAR_SALAH',
    pertanyaan: 'Akomodasi adalah bentuk proses sosial asosiatif yang bertujuan meredakan pertentangan tanpa menghancurkan pihak lawan.',
    kunci_jawaban: 'BENAR',
    bobot_nilai: 10,
    penjelasan: 'Akomodasi adalah upaya penyelesaian konflik demi terciptanya kestabilan sosial.',
    kesulitan: 'MUDAH',
    created_at: '2026-08-10'
  },
  {
    id: 'SOAL-C-003',
    mata_pelajaran: 'Bahasa Indonesia',
    paket: 'PAKET C',
    topik_materi: 'Karya Ilmiah',
    tipe: 'PILIHAN_GANDA',
    pertanyaan: 'Kalimat rumusan masalah yang tepat dalam proposal penelitian karya ilmiah adalah...',
    opsi_pilihan: [
      { key: 'A', text: 'Pendidikan kesetaraan sangat bermanfaat bagi masyarakat luas.' },
      { key: 'B', text: 'Bagaimanakah efektivitas modul digital terhadap kemandirian belajar warga belajar Paket C?' },
      { key: 'C', text: 'Penelitian ini bertujuan untuk membuktikan hipotesis awal.' },
      { key: 'D', text: 'Kita harus mendukung program PKBM di seluruh Indonesia.' }
    ],
    kunci_jawaban: 'B',
    bobot_nilai: 15,
    penjelasan: 'Rumusan masalah dirumuskan dalam bentuk kalimat tanya yang jelas, terukur, dan operasional.',
    kesulitan: 'SEDANG',
    created_at: '2026-08-10'
  },
  {
    id: 'SOAL-C-004',
    mata_pelajaran: 'Sosiologi',
    paket: 'PAKET C',
    topik_materi: 'Metodologi Penelitian',
    tipe: 'URAIAN',
    pertanyaan: 'Jelaskan perbedaan mendasar antara metode penelitian sosial kuantitatif dengan kualitatif beserta contoh teknik pengumpulan datanya!',
    kunci_jawaban: 'Rubrik: Kuantitatif menekankan data numerik/statistik (teknik: kuesioner/angket), sedangkan kualitatif menekankan makna mendalam/deskripsi (teknik: wawancara mendalam, observasi partisipatif).',
    bobot_nilai: 25,
    penjelasan: 'Uraian dinilai berdasarkan ketepatan definisi, perbandingan orientasi data, dan keabsahan contoh instrumen.',
    kesulitan: 'SULIT',
    created_at: '2026-08-10'
  }
];

export const INITIAL_ULANGAN: Ulangan[] = [
  {
    id: 'ULG-001',
    judul: 'Ulangan Harian 1: Pemahaman Teks & Dasar Aljabar',
    deskripsi: 'Evaluasi kompetensi capaian pembelajaran Modul 1 & 2 Paket B. Pastikan membaca petunjuk soal sebelum memulai.',
    petunjuk: '1. Berdoalah sebelum mengerjakan.\n2. Waktu pengerjaan adalah 30 menit.\n3. Jawaban disimpan secara otomatis oleh sistem.\n4. Periksa kembali jawaban sebelum menekan tombol Submit.',
    mata_pelajaran: 'Bahasa Indonesia & Matematika',
    paket: 'PAKET B',
    kelas: 'Kelas 8 & 9 Paket B',
    tutor_id: 'USR-TUT-01',
    tutor_nama: 'Dr. Opik, M.Pd',
    waktu_mulai: '2026-08-15T00:00',
    waktu_selesai: '2026-08-25T23:59',
    durasi_menit: 30,
    nilai_maksimal: 100,
    batas_percobaan: 2,
    status: 'AKTIF',
    publikasikan_nilai: true,
    daftar_soal: [
      INITIAL_BANK_SOAL[0],
      INITIAL_BANK_SOAL[1],
      INITIAL_BANK_SOAL[2],
      INITIAL_BANK_SOAL[3],
      INITIAL_BANK_SOAL[4]
    ],
    created_at: '2026-08-12'
  },
  {
    id: 'ULG-002',
    judul: 'Evaluasi Tengah Modul: Sosiologi & Karya Ilmiah',
    deskripsi: 'Ujian pemahaman struktur sosial, dinamika interaksi, dan metodologi penulisan karya ilmiah Paket C.',
    petunjuk: '1. Pastikan koneksi internet stabil.\n2. Waktu pengerjaan adalah 45 menit.\n3. Soal terdiri dari pilihan ganda, benar/salah, dan analisis uraian.\n4. Kerjakan secara mandiri dan jujur.',
    mata_pelajaran: 'Sosiologi & Bahasa Indonesia',
    paket: 'PAKET C',
    kelas: 'Kelas 11 & 12 Paket C',
    tutor_id: 'USR-TUT-02',
    tutor_nama: 'Nita Nurhayati, M.Hum',
    waktu_mulai: '2026-08-14T00:00',
    waktu_selesai: '2026-08-28T23:59',
    durasi_menit: 45,
    nilai_maksimal: 100,
    batas_percobaan: 2,
    status: 'AKTIF',
    publikasikan_nilai: true,
    daftar_soal: [
      INITIAL_BANK_SOAL[5],
      INITIAL_BANK_SOAL[6],
      INITIAL_BANK_SOAL[7],
      INITIAL_BANK_SOAL[8]
    ],
    created_at: '2026-08-13'
  }
];

export const INITIAL_UJIAN_ATTEMPT: UjianAttempt[] = [
  {
    id: 'ATT-001',
    ulangan_id: 'ULG-001',
    ulangan_judul: 'Ulangan Harian 1: Pemahaman Teks & Dasar Aljabar',
    user_id: 'USR-SIS-01',
    siswa_nama: 'Ahmad Faisal Pratama',
    siswa_paket: 'PAKET B',
    mulai_pada: '2026-08-15 08:00 WIB',
    selesai_pada: '2026-08-15 08:22 WIB',
    status: 'SELESAI',
    jawaban: {
      'SOAL-B-001': 'B',
      'SOAL-B-002': 'SALAH',
      'SOAL-B-003': 'C',
      'SOAL-B-004': '25',
      'SOAL-B-005': 'Ciri teks laporan hasil observasi: 1. Objektif, 2. Berdasarkan fakta nyata, 3. Disusun sistematis. Contoh: Berdasarkan jenisnya, limbah terbagi menjadi limbah organik dan anorganik.'
    },
    nilai_otomatis: 50,
    nilai_uraian: 40,
    nilai_total: 90,
    dinilai: true,
    feedback_tutor: 'Pemahaman materi sangat kuat! Pengerjaan uraian dan klasifikasi sangat tepat.'
  }
];

export const INITIAL_NOTIFIKASI: NotifikasiApp[] = [
  {
    id: 'NOTIF-001',
    target_role: 'SISWA',
    target_paket: 'ALL',
    judul: '📹 Sesi Tatap Muka Online Aktif!',
    pesan: 'Kelas tatap muka online sedang berlangsung via Google Meet. Klik agenda untuk bergabung sekarang.',
    tipe: 'TATAP_MUKA',
    dibaca: false,
    link_tab: 'TATAP_MUKA',
    created_at: '2026-08-15 09:00 WIB'
  },
  {
    id: 'NOTIF-002',
    target_role: 'SISWA',
    target_paket: 'PAKET B',
    judul: '📝 Tugas Baru: Analisis Struktur Teks Observasi',
    pesan: 'Tutor Dr. Opik, M.Pd telah menugaskan Tugas Mandiri 1. Batas pengumpulan: 18 Agustus 2026.',
    tipe: 'TUGAS',
    dibaca: false,
    link_tab: 'TUGAS',
    created_at: '2026-08-14 10:00 WIB'
  },
  {
    id: 'NOTIF-003',
    target_role: 'SISWA',
    target_paket: 'ALL',
    judul: '🧠 Ulangan Harian Online Telah Dibuka',
    pesan: 'Ulangan evaluasi modul telah aktif. Anda dapat mengerjakan ulangan secara online dengan batas waktu terukur.',
    tipe: 'ULANGAN',
    dibaca: true,
    link_tab: 'ULANGAN',
    created_at: '2026-08-13 14:00 WIB'
  },
  {
    id: 'NOTIF-004',
    target_role: 'TUTOR',
    target_paket: 'ALL',
    judul: '📥 Pengumpulan Tugas Baru',
    pesan: 'Warga Belajar Siti Nurhaliza telah mengumpulkan tugas portofolio Sosiologi.',
    tipe: 'TUGAS',
    dibaca: false,
    link_tab: 'TUGAS',
    created_at: '2026-08-14 19:42 WIB'
  }
];
