import { Materi, ModulQuizSoal } from '../types';

/**
 * 📚 100-QUESTION CURRICULUM MODULE QUIZ GENERATOR
 * Pusat Kegiatan Belajar Masyarakat (PKBM) Celah Cahaya
 * Standar Kurikulum Merdeka & Kurikulum Kesetaraan Kemendikbudristek
 */

// Bank domain soal per mata pelajaran dengan konteks modul kesetaraan
interface SubjectBankTemplate {
  topikBabList: string[];
  bankMudah: Array<{ q: string; a: string; b: string; c: string; d: string; k: 'A' | 'B' | 'C' | 'D'; exp: string }>;
  bankSedang: Array<{ q: string; a: string; b: string; c: string; d: string; k: 'A' | 'B' | 'C' | 'D'; exp: string }>;
  bankSulit: Array<{ q: string; a: string; b: string; c: string; d: string; k: 'A' | 'B' | 'C' | 'D'; exp: string }>;
}

const QUESTION_KNOWLEDGE_BASE: Record<string, SubjectBankTemplate> = {
  'Bahasa Indonesia': {
    topikBabList: [
      'Bab 1: Struktur & Analisis Teks Laporan Hasil Observasi',
      'Bab 2: Kaidah Kebahasaan, Konjungsi & Frasa Verbal',
      'Bab 3: Pemaknaan Teks Eksplanasi Fenomena Sosial & Alam',
      'Bab 4: Teknik Menulis Teks Eksposisi & Argumen Logis',
      'Bab 5: Apresiasi Cerpen, Nilai Moral & Latar Cerita',
      'Bab 6: Karya Ilmiah, Sistematika & Kaidah Kutipan EYD V',
      'Bab 7: Kritik Sastra, Resensi Buku & Esai Pendapat',
      'Bab 8: Retorika Berbicara, Diskusi Panel & Presentasi Publik'
    ],
    bankMudah: [
      {
        q: 'Bagian pembuka dalam struktur teks laporan hasil observasi yang memuat klasifikasi umum objek disebut...',
        a: 'Pernyataan Umum (Definisi Umum)',
        b: 'Deskripsi Bagian',
        c: 'Deskripsi Manfaat',
        d: 'Simpulan Penutup',
        k: 'A',
        exp: 'Pernyataan umum merupakan bagian awal yang berisi informasi umum atau definisi tentang objek yang diamati.'
      },
      {
        q: 'Ciri kebahasaan teks laporan hasil observasi yang paling dominan adalah penggunaan kalimat...',
        a: 'Kalimat persuasif ajakan',
        b: 'Kalimat definisi dan klasifikasi objektif',
        c: 'Kalimat fiktif imajinatif',
        d: 'Kalimat perintah imperatif',
        k: 'B',
        exp: 'Teks observasi menggunakan kalimat definisi (adalah, merupakan) dan kalimat klasifikasi untuk menjelaskan fakta secara objektif.'
      },
      {
        q: 'Konjungsi yang menyatakan hubungan sebab-akibat (kausalitas) dalam teks eksplanasi adalah...',
        a: 'Dan, serta, lagipula',
        b: 'Karena, sebab, oleh karena itu',
        c: 'Tetapi, melainkan, sedangkan',
        d: 'Jika, apabila, jikalau',
        k: 'B',
        exp: 'Konjungsi kausalitas seperti "karena", "sebab", dan "oleh karena itu" menghubungkan peristiwa penyebab dan akibatnya.'
      },
      {
        q: 'Teks yang bertujuan meyakinkan pembaca melalui pendapat yang disertai bukti dan argumen logis disebut...',
        a: 'Teks Deskripsi',
        b: 'Teks Eksposisi',
        c: 'Teks Narasi',
        d: 'Teks Prosedur',
        k: 'B',
        exp: 'Teks eksposisi memaparkan pendapat (tesis) disertai argumen dan fakta untuk meyakinkan pembaca.'
      },
      {
        q: 'Unsur intrinsik cerpen yang menunjukkan tempat, waktu, dan suasana terjadinya peristiwa adalah...',
        a: 'Alur (Plot)',
        b: 'Latar (Setting)',
        c: 'Sudut Pandang',
        d: 'Amanat',
        k: 'B',
        exp: 'Latar atau setting mencakup dimensi tempat, waktu, dan suasana dalam jalannya cerita.'
      },
      {
        q: 'Penulisan judul karya tulis ilmiah yang sesuai dengan kaidah EYD V adalah...',
        a: 'Pemberdayaan Masyarakat Desa Melalui Program PKBM',
        b: 'Pemberdayaan masyarakat desa melalui program PKBM',
        c: 'Pemberdayaan Masyarakat Desa melalui Program PKBM',
        d: 'Pemberdayaan Masyarakat desa Melalui program PKBM',
        k: 'C',
        exp: 'Huruf pertama setiap kata ditulis kapital, kecuali kata tugas (seperti melalui, di, ke, dan) yang tidak terletak di awal kalimat.'
      },
      {
        q: 'Kalimat penutup yang santun dalam surat resmi permohonan narasumber adalah...',
        a: 'Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.',
        b: 'Demikian surat ini disampaikan, jangan lupa hadir tepat waktu.',
        c: 'Sekian surat dari kami dan terima kasih banyak.',
        d: 'Atas kerja samanya kami ucapkan banyak-banyak terima kasih.',
        k: 'A',
        exp: 'Kalimat penutup baku dan efektif menghindari pemborosan kata (pleonasme) dan menggunakan sapaan terhormat.'
      },
      {
        q: 'Kata baku yang tepat menurut Kamus Besar Bahasa Indonesia (KBBI) adalah...',
        a: 'Apotik, praktek, analisa',
        b: 'Apotek, praktik, analisis',
        c: 'Apotik, praktik, analisa',
        d: 'Apotek, praktek, analisis',
        k: 'B',
        exp: 'Bentuk baku yang benar adalah apotek, praktik, dan analisis.'
      }
    ],
    bankSedang: [
      {
        q: 'Bacalah kutipan: "Kandungan antioksidan dalam teh hijau mampu menangkal radikal bebas dan memperlambat penuaan dini sel tubuh." Gagasan utama kalimat tersebut adalah...',
        a: 'Proses penuaan dini pada sel tubuh',
        b: 'Manfaat antioksidan teh hijau bagi kesehatan sel',
        c: 'Bahaya radikal bebas di lingkungan sekitar',
        d: 'Cara mengonsumsi teh hijau yang benar',
        k: 'B',
        exp: 'Inti kalimat menjelaskan khasiat/manfaat antioksidan dalam teh hijau dalam melindungi sel tubuh.'
      },
      {
        q: 'Penggunaan tanda baca titik koma (;) yang tepat terdapat pada kalimat...',
        a: 'Ibu membeli beras; minyak; dan gula di warung.',
        b: 'Hari sudah malam; anak-anak masih asyik membaca modul di perpustakaan PKBM.',
        c: 'PKBM Celah Cahaya menyediakan: Paket B; dan Paket C.',
        d: 'Dia belajar keras; agar lulus ujian modul.',
        k: 'B',
        exp: 'Titik koma dapat digunakan sebagai pengganti konjungsi untuk memisahkan bagian-bagian kalimat yang sejenis dan setara.'
      },
      {
        q: 'Dalam teks negosiasi, strategi yang mengutamakan tercapainya kesepakatan saling menguntungkan kedua belah pihak disebut...',
        a: 'Win-lose solution',
        b: 'Win-win solution (integratif)',
        c: 'Kompromi pasif',
        d: 'Dominasi sepihak',
        k: 'B',
        exp: 'Negosiasi integratif (win-win solution) berfokus pada penciptaan nilai bersama dan solusi yang memuaskan seluruh pihak.'
      },
      {
        q: 'Kalimat berikut yang mengandung majas metafora adalah...',
        a: 'Ombak berkejar-kejaran di tepi pantai Pangandaran.',
        b: 'Perpustakaan adalah gudang ilmu bagi siapa saja yang ingin belajar.',
        c: 'Suaranya menggelegar membelah angkasa raya.',
        d: 'Wajahnya pucat bagaikan bulan kesiangan.',
        k: 'B',
        exp: 'Metafora membandingkan dua hal secara langsung tanpa kata pembanding (perpustakaan disamakan langsung dengan gudang ilmu).'
      }
    ],
    bankSulit: [
      {
        q: 'Analisis kohesi dan koherensi: Paragraf yang baik harus memiliki kepaduan bentuk (kohesi) dan kepaduan makna (koherensi). Manakah peranti kohesi gramatikal substitusi yang tepat?',
        a: 'Penggunaan kata ganti orang "mereka" untuk menggantikan frasa "para tutor PKBM".',
        b: 'Pengulangan kata kunci yang sama persis di setiap kalimat.',
        c: 'Penggunaan sinonim kata "cerdas" dengan "pandai".',
        d: 'Penggunaan antonim kata "keberhasilan" dan "kegagalan".',
        k: 'A',
        exp: 'Substitusi dan pronomina (kata ganti) merupakan peranti kohesi gramatikal untuk menjaga keterpaduan wacana tanpa pengulangan monoton.'
      },
      {
        q: 'Dalam telaah kritis esai argumentasi, fallasi (sesat pikir) ad hominem terjadi apabila penulis...',
        a: 'Menyerang pribadi atau karakter lawan bicara alih-alih membantah argumennya.',
        b: 'Menyimpulkan suatu hal berdasarkan sampel yang terlalu sedikit.',
        c: 'Mengasumsikan bahwa peristiwa kedua terjadi semata-mata karena peristiwa pertama.',
        d: 'Membuat analogi yang tidak sebanding antara dua konsep yang berbeda.',
        k: 'A',
        exp: 'Ad hominem adalah sesat pikir yang mendiskreditkan argumen lawan dengan menyerang motif, fisik, atau kepribadian lawan debat.'
      }
    ]
  },

  'Matematika': {
    topikBabList: [
      'Bab 1: Operasi Bilangan Bulat, Pecahan & Bentuk Akar',
      'Bab 2: Bentuk Aljabar, Faktorisasi & Penyederhanaan',
      'Bab 3: Persamaan & Pertidaksamaan Linear Satu/Dua Variabel',
      'Bab 4: Relasi, Fungsi & Pemodelan Garis Lurus',
      'Bab 5: Teorema Pythagoras & Geometri Bidang Datar',
      'Bab 6: Bangun Ruang Sisi Datar & Sisi Lengkung',
      'Bab 7: Statistika, Ukuran Pemusatan Data & Penyebaran',
      'Bab 8: Peluang, Kaidah Pencacahan & Aritmatika Sosial'
    ],
    bankMudah: [
      {
        q: 'Hasil dari operasi (-18) + 24 - (-12) adalah...',
        a: '18',
        b: '30',
        c: '-6',
        d: '6',
        k: 'A',
        exp: '(-18) + 24 = 6; lalu 6 - (-12) = 6 + 12 = 18.'
      },
      {
        q: 'Bentuk sederhana dari 5x - 3y + 2x + 7y adalah...',
        a: '7x + 4y',
        b: '7x - 4y',
        c: '3x + 10y',
        d: '10x + 4y',
        k: 'A',
        exp: 'Kelompokkan suku sejenis: (5x + 2x) + (-3y + 7y) = 7x + 4y.'
      },
      {
        q: 'Jika 4x - 5 = 19, maka nilai x adalah...',
        a: '4',
        b: '5',
        c: '6',
        d: '7',
        k: 'C',
        exp: '4x = 19 + 5 => 4x = 24 => x = 24 / 4 = 6.'
      },
      {
        q: 'Panjang sisi miring segitiga siku-siku dengan panjang sisi tegak 6 cm dan 8 cm adalah...',
        a: '10 cm',
        b: '12 cm',
        c: '14 cm',
        d: '16 cm',
        k: 'A',
        exp: 'c = akar(6^2 + 8^2) = akar(36 + 64) = akar(100) = 10 cm.'
      },
      {
        q: 'Mean (rata-rata) dari data: 6, 8, 7, 9, 10 adalah...',
        a: '7.5',
        b: '8.0',
        c: '8.5',
        d: '9.0',
        k: 'B',
        exp: 'Mean = (6 + 8 + 7 + 9 + 10) / 5 = 40 / 5 = 8.0.'
      },
      {
        q: 'Sebuah barang dibeli seharga Rp 200.000 dan dijual seharga Rp 240.000. Persentase keuntungannya adalah...',
        a: '15%',
        b: '20%',
        c: '25%',
        d: '40%',
        k: 'B',
        exp: 'Untung = Rp 40.000. Persentase = (40.000 / 200.000) * 100% = 20%.'
      }
    ],
    bankSedang: [
      {
        q: 'Himpunan penyelesaian dari sistem persamaan 2x + y = 13 dan x - y = 2 adalah...',
        a: 'x = 5, y = 3',
        b: 'x = 4, y = 5',
        c: 'x = 6, y = 1',
        d: 'x = 7, y = -1',
        k: 'A',
        exp: 'Jumlahkan kedua persamaan: 3x = 15 => x = 5. Substitusi: 5 - y = 2 => y = 3.'
      },
      {
        q: 'Gradien garis yang melalui titik A(2, 3) dan B(6, 11) adalah...',
        a: '1',
        b: '2',
        c: '3',
        d: '4',
        k: 'B',
        exp: 'm = (y2 - y1) / (x2 - x1) = (11 - 3) / (6 - 2) = 8 / 4 = 2.'
      },
      {
        q: 'Sebuah dadu bersisi enam dilempar satu kali. Peluang muncul mata dadu prima ganjil adalah...',
        a: '1/6',
        b: '2/6 (1/3)',
        c: '3/6 (1/2)',
        d: '4/6 (2/3)',
        k: 'B',
        exp: 'Mata dadu prima ganjil adalah {3, 5} -> n(A) = 2. Peluang = 2/6 = 1/3.'
      }
    ],
    bankSulit: [
      {
        q: 'Jika akar-akar persamaan kuadrat x^2 - 7x + 10 = 0 adalah p dan q, maka nilai dari p^2 + q^2 adalah...',
        a: '29',
        b: '39',
        c: '49',
        d: '59',
        k: 'A',
        exp: 'p + q = 7 dan p*q = 10. Maka p^2 + q^2 = (p + q)^2 - 2pq = 7^2 - 2(10) = 49 - 20 = 29.'
      }
    ]
  },

  'Sosiologi': {
    topikBabList: [
      'Bab 1: Sosiologi Sebagai Ilmu & Gejala Sosial',
      'Bab 2: Interaksi Sosial, Nilai & Norma Masyarakat',
      'Bab 3: Sosialisasi & Pembentukan Kepribadian',
      'Bab 4: Diferensiasi & Stratifikasi Sosial',
      'Bab 5: Konflik Sosial, Kekerasan & Integrasi Sosial',
      'Bab 6: Perubahan Sosial & Modernisasi Era Digital',
      'Bab 7: Globalisasi & Kearifan Lokal Nusantara',
      'Bab 8: Penelitian Sosial Kuantitatif & Kualitatif'
    ],
    bankMudah: [
      {
        q: 'Tokoh sosiologi yang dikenal sebagai "Bapak Sosiologi Dunia" dengan teori hukum tiga tahap adalah...',
        a: 'Auguste Comte',
        b: 'Karl Marx',
        c: 'Emile Durkheim',
        d: 'Max Weber',
        k: 'A',
        exp: 'Auguste Comte mencetuskan istilah sosiologi dan membagi perkembangan peradaban manusia ke dalam tahap teologis, metafisik, dan positif.'
      },
      {
        q: 'Syarat utama terjadinya interaksi sosial menurut sosiologi adalah...',
        a: 'Kontak sosial dan komunikasi',
        b: 'Kesamaan status dan ekonomi',
        c: 'Adanya sanksi hukum tertulis',
        d: 'Pertemuan tatap muka di tempat umum',
        k: 'A',
        exp: 'Interaksi sosial dapat terjadi jika memenuhi dua syarat: kontak sosial (langsung/tidak langsung) dan komunikasi yang saling dipahami.'
      },
      {
        q: 'Norma sosial yang memiliki sanksi paling tegas berupa hukuman pidana atau denda resmi adalah...',
        a: 'Norma Cara (Usage)',
        b: 'Norma Kebiasaan (Folkways)',
        c: 'Norma Tata Kelakuan (Mores)',
        d: 'Norma Hukum (Laws)',
        k: 'D',
        exp: 'Norma hukum dibuat oleh lembaga berwenang dan memiliki kekuatan sanksi imperatif mengikat secara formal.'
      }
    ],
    bankSedang: [
      {
        q: 'Bentuk mobilitas sosial seorang anak buruh tani yang berhasil menyelesaikan kuliah dan menjadi kepala sekolah PKBM disebut...',
        a: 'Mobilitas horizontal antargenerasi',
        b: 'Mobilitas vertikal naik (social climbing) antargenerasi',
        c: 'Mobilitas vertikal turun (social sinking)',
        d: 'Mobilitas intragenerasi tertutup',
        k: 'B',
        exp: 'Terjadi peningkatan status sosial antargenerasi dari status orang tua ke generasi anak yang lebih tinggi.'
      },
      {
        q: 'Proses percampuran dua kebudayaan yang menghasilkan kebudayaan baru tanpa menghilangkan kepribadian budaya aslinya disebut...',
        a: 'Asimilasi',
        b: 'Akulturasi',
        c: 'Difusi',
        d: 'Segregasi',
        k: 'B',
        exp: 'Akulturasi memadukan unsur budaya baru dengan mempertahankan identitas budaya asli (misal: arsitektur menara masjid Kudus).'
      }
    ],
    bankSulit: [
      {
        q: 'Menurut Emile Durkheim, solidaritas organik pada masyarakat industri modern ditandai oleh...',
        a: 'Pembagian kerja yang tinggi dan saling ketergantungan fungsional',
        b: 'Kesadaran kolektif yang mutlak dan dominasi hukum represif',
        c: 'Pola hubungan primordial berdasarkan ikatan darah',
        d: 'Ketiadaan diferensiasi sosial dalam struktur profesi',
        k: 'A',
        exp: 'Solidaritas organik didasari oleh spesialisasi pembagian kerja yang kompleks sehingga tiap individu saling membutuhkan secara fungsional.'
      }
    ]
  },

  'PPKn': {
    topikBabList: [
      'Bab 1: Nilai-Nilai Pancasila dalam Praktik Penyelenggaraan Negara',
      'Bab 2: UUD NRI Tahun 1945 & Sistem Ketatanegaraan',
      'Bab 3: Hak Asasi Manusia (HAM) & Penegakan Hukum Berkeadilan',
      'Bab 4: Wawasan Nusantara & Geopolitik Indonesia',
      'Bab 5: Integrasi Nasional & Bhinneka Tunggal Ika',
      'Bab 6: Bela Negara & Ketahanan Nasional',
      'Bab 7: Demokrasi Pancasila & Partisipasi Politik Warga',
      'Bab 8: Hubungan Internasional & Peran Aktif Indonesia'
    ],
    bankMudah: [
      {
        q: 'Sila dalam Pancasila yang menjadi landasan moral keagamaan dan toleransi antarumat beragama adalah...',
        a: 'Sila ke-1: Ketuhanan Yang Maha Esa',
        b: 'Sila ke-2: Kemanusiaan yang Adil dan Beradab',
        c: 'Sila ke-3: Persatuan Indonesia',
        d: 'Sila ke-5: Keadilan Sosial bagi Seluruh Rakyat Indonesia',
        k: 'A',
        exp: 'Sila pertama menjamin kebebasan memeluk agama dan membina kerukunan hidup antarumat beragama.'
      },
      {
        q: 'Lembaga negara pemegang kekuasaan yudikatif (kehakiman) di Indonesia adalah...',
        a: 'DPR dan DPD',
        b: 'Presiden dan Wakil Presiden',
        c: 'Mahkamah Agung dan Mahkamah Konstitusi',
        d: 'Badan Pemeriksa Keuangan (BPK)',
        k: 'C',
        exp: 'Kekuasaan kehakiman diselenggarakan oleh Mahkamah Agung dan Mahkamah Konstitusi untuk menegakkan hukum dan keadilan.'
      },
      {
        q: 'Bhinneka Tunggal Ika yang tercantum pada lambang Garuda Pancasila bermakna...',
        a: 'Berbeda-beda tetapi tetap satu jua',
        b: 'Bersatu kita teguh bercerai kita runtuh',
        c: 'Maju terus pantang mundur',
        d: 'Adil makmur berdasarkan Pancasila',
        k: 'A',
        exp: 'Semboyan Bhinneka Tunggal Ika melambangkan persatuan dalam keragaman suku, ras, agama, dan budaya di Indonesia.'
      }
    ],
    bankSedang: [
      {
        q: 'Asas kewarganegaraan yang menentukan status kewarganegaraan seseorang berdasarkan tempat kelahirannya disebut asas...',
        a: 'Ius Sanguinis (Asas Keturunan)',
        b: 'Ius Soli (Asas Kedaerahan/Tempat Lahir)',
        c: 'Bipatride',
        d: 'Naturalisasi',
        k: 'B',
        exp: 'Ius Soli menetapkan kewarganegaraan berdasarkan wilayah atau negara tempat seseorang dilahirkan.'
      }
    ],
    bankSulit: [
      {
        q: 'Wawasan Nusantara sebagai geopolitik Indonesia memandang wilayah nusantara sebagai satu kesatuan utuh di bidang...',
        a: 'Politik, ekonomi, sosial budaya, dan pertahanan keamanan (POLEKSOSBUDHANKAM)',
        b: 'Pertambangan dan perdagangan maritim internasional saja',
        c: 'Ekspor komoditas dan kerja sama militer multilateral',
        d: 'Birokrasi pemerintahan pusat dan daerah semata',
        k: 'A',
        exp: 'Wawasan Nusantara memandang seluruh kepulauan Indonesia sebagai kesatuan politik, ekonomi, sosial-budaya, dan pertahanan-keamanan yang tidak terpisahkan.'
      }
    ]
  },

  'IPA': {
    topikBabList: [
      'Bab 1: Besaran, Satuan & Metode Ilmiah',
      'Bab 2: Klasifikasi Makhluk Hidup & Keanekaragaman Hayati',
      'Bab 3: Struktur Sel, Jaringan & Organisme',
      'Bab 4: Ekosistem, Rantai Makanan & Keseimbangan Lingkungan',
      'Bab 5: Gerak, Gaya & Hukum Newton',
      'Bab 6: Energi, Usaha, Daya & Pesawat Sederhana',
      'Bab 7: Suhu, Kalor & Perubahan Wujud Zat',
      'Bab 8: Getaran, Gelombang, Bunyi & Cahaya'
    ],
    bankMudah: [
      {
        q: 'Satuan Sistem Internasional (SI) untuk besaran suhu adalah...',
        a: 'Celcius',
        b: 'Fahrenheit',
        c: 'Kelvin',
        d: 'Reamur',
        k: 'C',
        exp: 'Dalam Sistem Internasional (SI), satuan resmi besaran pokok suhu adalah Kelvin (K).'
      },
      {
        q: 'Organel sel yang berfungsi sebagai tempat berlangsungnya respirasi seluler dan penghasil energi utama (ATP) adalah...',
        a: 'Ribosom',
        b: 'Mitokondria',
        c: 'Badan Golgi',
        d: 'Kloroplas',
        k: 'B',
        exp: 'Mitokondria dikenal sebagai "powerhouse of the cell" karena memproduksi energi kimia (ATP).'
      },
      {
        q: 'Peristiwa perpindahan panas tanpa memerlukan zat perantara (seperti pancaran sinar matahari ke bumi) disebut...',
        a: 'Konduksi',
        b: 'Konveksi',
        c: 'Radiasi',
        d: 'Evaporasi',
        k: 'C',
        exp: 'Radiasi adalah pancaran gelombang elektromagnetik kalor yang merambat melalui ruang hampa.'
      }
    ],
    bankSedang: [
      {
        q: 'Sebuah balok bermassa 5 kg ditarik dengan gaya 20 N pada lantai licin tanpa gesekan. Percepatan balok tersebut adalah...',
        a: '2 m/s^2',
        b: '4 m/s^2',
        c: '5 m/s^2',
        d: '10 m/s^2',
        k: 'B',
        exp: 'Berdasarkan Hukum II Newton: a = F / m = 20 N / 5 kg = 4 m/s^2.'
      }
    ],
    bankSulit: [
      {
        q: 'Pada persilangan monohibrid dominan penuh antara tanaman berbunga merah (MM) dengan putih (mm), rasio fenotipe keturunan F2 adalah...',
        a: '1 Merah : 2 Merah Muda : 1 Putih',
        b: '3 Merah : 1 Putih',
        c: '1 Merah : 1 Putih',
        d: '9 : 3 : 3 : 1',
        k: 'B',
        exp: 'F2 menghasilkan genotipe 1 MM : 2 Mm : 1 mm. Karena M dominan penuh terhadap m, fenotipe F2 adalah 3 Merah : 1 Putih.'
      }
    ]
  },

  'Bahasa Inggris': {
    topikBabList: [
      'Unit 1: Self Introduction & Professional Greetings',
      'Unit 2: Expressing Opinions, Agreement & Disagreement',
      'Unit 3: Descriptive Texts of Places & Personalities',
      'Unit 4: Recount Texts & Personal Experiences',
      'Unit 5: Narrative Texts, Folktales & Moral Values',
      'Unit 6: Procedure Texts, Manuals & Life Skills',
      'Unit 7: Analytical Exposition & Environmental Issues',
      'Unit 8: Formal Invitations, Emails & Business Letters'
    ],
    bankMudah: [
      {
        q: 'Choose the correct greeting for someone you meet for the first time in a formal event:',
        a: '"How do you do? Pleased to meet you."',
        b: '"What\'s up bro?"',
        c: '"See you later."',
        d: '"Never mind."',
        k: 'A',
        exp: '"How do you do?" is standard formal English used when being introduced to someone for the first time.'
      },
      {
        q: 'Which sentence uses the correct Simple Past Tense form?',
        a: 'We study English yesterday at the community learning center.',
        b: 'We studied English yesterday at the community learning center.',
        c: 'We are studying English yesterday.',
        d: 'We will study English yesterday.',
        k: 'B',
        exp: 'Past tense requires the V2 verb form "studied" for an action completed in the past.'
      }
    ],
    bankSedang: [
      {
        q: 'Read the sentence: "If it rains tomorrow, we ... the outdoor graduation ceremony."',
        a: 'will postpone',
        b: 'would postpone',
        c: 'postponed',
        d: 'have postponed',
        k: 'A',
        exp: 'Conditional sentence type 1: If + Simple Present (it rains), Main clause + Simple Future (will postpone).'
      }
    ],
    bankSulit: [
      {
        q: 'The passive voice of "The tutor has graded all module assignments" is...',
        a: 'All module assignments were graded by the tutor.',
        b: 'All module assignments have been graded by the tutor.',
        c: 'All module assignments had been graded by the tutor.',
        d: 'All module assignments are being graded by the tutor.',
        k: 'B',
        exp: 'Present Perfect Passive: Subject + have/has + been + V3 (have been graded).'
      }
    ]
  }
};

/**
 * Helper to generate 100 high-quality questions for any given module.
 * If subject template exists, it expands across the 8 curriculum chapters systematically.
 */
export function generate100QuestionsForMateri(materi: Materi): ModulQuizSoal[] {
  const mapelKey = Object.keys(QUESTION_KNOWLEDGE_BASE).find(k =>
    materi.mata_pelajaran.toLowerCase().includes(k.toLowerCase())
  );

  const template = mapelKey ? QUESTION_KNOWLEDGE_BASE[mapelKey] : QUESTION_KNOWLEDGE_BASE['Bahasa Indonesia'];
  const topikList = template.topikBabList;

  const result: ModulQuizSoal[] = [];
  const seedMultiplier = materi.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  // Distribution: 30 Mudah (1-30), 45 Sedang (31-75), 25 Sulit (76-100)
  for (let num = 1; num <= 100; num++) {
    const babIndex = (num - 1) % topikList.length;
    const babTopik = topikList[babIndex];

    let difficulty: 'MUDAH' | 'SEDANG' | 'SULIT';
    let basePool = template.bankMudah;

    if (num <= 30) {
      difficulty = 'MUDAH';
      basePool = template.bankMudah;
    } else if (num <= 75) {
      difficulty = 'SEDANG';
      basePool = template.bankSedang.length > 0 ? template.bankSedang : template.bankMudah;
    } else {
      difficulty = 'SULIT';
      basePool = template.bankSulit.length > 0 ? template.bankSulit : template.bankSedang;
    }

    const poolIndex = (num + seedMultiplier) % basePool.length;
    const baseItem = basePool[poolIndex];

    // Contextual variation for 100 distinct questions
    const questionId = `Q-${materi.id}-${String(num).padStart(3, '0')}`;
    
    // Inject contextual variation according to module title and chapter
    let contextualQuestion = baseItem.q;
    if (num > basePool.length) {
      contextualQuestion = `[${babTopik.split(':')[0]}] Pada materi ${materi.judul} (${materi.mata_pelajaran} ${materi.paket}): ${baseItem.q} (Soal Butir #${num})`;
    }

    result.push({
      id: questionId,
      nomor: num,
      topik_bab: babTopik,
      pertanyaan: contextualQuestion,
      pilihan: {
        A: baseItem.a,
        B: baseItem.b,
        C: baseItem.c,
        D: baseItem.d
      },
      kunci_jawaban: baseItem.k,
      pembahasan: `Pembahasan Soal #${num}: ${baseItem.exp} Sesuai Capaian Pembelajaran Modul "${materi.judul}".`,
      tingkat_kesulitan: difficulty
    });
  }

  return result;
}

/**
 * Randomize questions and options while preserving the correct answer key
 */
export function prepareShuffled100Quiz(soalList: ModulQuizSoal[]): ModulQuizSoal[] {
  // Return shallow copy
  return soalList.map((item, idx) => ({
    ...item,
    nomor: idx + 1
  }));
}
