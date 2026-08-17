import { User } from '../types';

export interface TutorMasterInfo {
  no: number;
  nama: string;
  no_sk: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  pendidikan: string;
  mata_pelajaran: string;
  mapel_paket_b: string;
  mapel_paket_c: string;
  paket: 'PAKET B' | 'PAKET C' | 'PAKET B & PAKET C';
  kelas: string;
  username: string;
  email: string;
  foto: string;
}

export const MASTER_TUTOR_LIST: TutorMasterInfo[] = [
  {
    no: 1,
    nama: 'Dr. Opik, M.Pd',
    no_sk: '01/PKBM-CC/I/2018',
    tempat_lahir: 'Garut',
    tanggal_lahir: '15 Juli 1983',
    jenis_kelamin: 'L',
    pendidikan: 'S2',
    mata_pelajaran: 'Bahasa Indonesia & IPS (Paket B & C)',
    mapel_paket_b: 'Bahasa Indonesia & IPS Terpadu',
    mapel_paket_c: 'Bahasa Indonesia & Sosiologi Terapan',
    paket: 'PAKET B & PAKET C',
    kelas: 'Kelas 7-9 Paket B & Kelas 10-12 Paket C',
    username: 'tutor.opik',
    email: 'opik@pkbmcelahcahaya.sch.id',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    no: 2,
    nama: 'Nita Nurhayati, M.Hum',
    no_sk: '02/PKBM-CC/I/2018',
    tempat_lahir: 'Serang',
    tanggal_lahir: '18 Maret 1989',
    jenis_kelamin: 'P',
    pendidikan: 'S2',
    mata_pelajaran: 'Seni Budaya & Humaniora (Paket B & C)',
    mapel_paket_b: 'Bahasa Sunda & Seni Budaya',
    mapel_paket_c: 'Bahasa Indonesia & Seni Rupa/Teater',
    paket: 'PAKET B & PAKET C',
    kelas: 'Kelas 7-9 Paket B & Kelas 10-12 Paket C',
    username: 'tutor.nita',
    email: 'nita.nurhayati@pkbmcelahcahaya.sch.id',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    no: 3,
    nama: 'Roni Nuroni, S.T',
    no_sk: '03/PKBM-CC/I/2018',
    tempat_lahir: 'Garut',
    tanggal_lahir: '9 September 1985',
    jenis_kelamin: 'L',
    pendidikan: 'S1',
    mata_pelajaran: 'Informatika & Komputer (Paket B & C)',
    mapel_paket_b: 'Informatika & Prakarya Rekayasa',
    mapel_paket_c: 'Informatika & Pemrograman Web/Aplikasi',
    paket: 'PAKET B & PAKET C',
    kelas: 'Kelas 7-9 Paket B & Kelas 10-12 Paket C',
    username: 'tutor.roni',
    email: 'roni.nuroni@pkbmcelahcahaya.sch.id',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    no: 4,
    nama: 'Budi Iskandar, S.Si., M.Pd.',
    no_sk: '04/PKBM-CC/I/2018',
    tempat_lahir: 'Garut',
    tanggal_lahir: '6 Oktober 1990',
    jenis_kelamin: 'L',
    pendidikan: 'S1',
    mata_pelajaran: 'IPA & Biologi (Paket B & C)',
    mapel_paket_b: 'Ilmu Pengetahuan Alam (IPA Terpadu)',
    mapel_paket_c: 'Biologi Lingkungan & Sains Terapan',
    paket: 'PAKET B & PAKET C',
    kelas: 'Kelas 7-9 Paket B & Kelas 10-12 Paket C',
    username: 'tutor.budiiskandar',
    email: 'budi.iskandar@pkbmcelahcahaya.sch.id',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    no: 5,
    nama: 'Ruli Lesmana, S.T',
    no_sk: '05/PKBM-CC/I/2018',
    tempat_lahir: 'Garut',
    tanggal_lahir: '14 September 1987',
    jenis_kelamin: 'L',
    pendidikan: 'S1',
    mata_pelajaran: 'Matematika & Fisika (Paket B & C)',
    mapel_paket_b: 'Matematika & Logika Dasar',
    mapel_paket_c: 'Matematika Wajib & Fisika Terapan',
    paket: 'PAKET B & PAKET C',
    kelas: 'Kelas 7-9 Paket B & Kelas 10-12 Paket C',
    username: 'tutor.ruli',
    email: 'ruli.lesmana@pkbmcelahcahaya.sch.id',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    no: 6,
    nama: 'Ine Yuniar Suryadi, S.Pd.I',
    no_sk: '06/PKBM-CC/I/2018',
    tempat_lahir: 'Tasikmalaya',
    tanggal_lahir: '10 Juni 1994',
    jenis_kelamin: 'P',
    pendidikan: 'S1',
    mata_pelajaran: 'Pendidikan Agama Islam (Paket B & C)',
    mapel_paket_b: 'Pendidikan Agama Islam (PAI) & Budi Pekerti',
    mapel_paket_c: 'Pendidikan Agama Islam (PAI) & Akhlak Mulia',
    paket: 'PAKET B & PAKET C',
    kelas: 'Kelas 7-9 Paket B & Kelas 10-12 Paket C',
    username: 'tutor.ine',
    email: 'ine.yuniar@pkbmcelahcahaya.sch.id',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    no: 7,
    nama: 'Hanifah Saadah, S.Pd., S.Kom.',
    no_sk: '07/PKBM-CC/I/2018',
    tempat_lahir: 'Garut',
    tanggal_lahir: '12 Mei 1992',
    jenis_kelamin: 'P',
    pendidikan: 'S1',
    mata_pelajaran: 'Informatika & TIK (Paket B & C)',
    mapel_paket_b: 'Literasi Komputer & TIK Terapan',
    mapel_paket_c: 'Informatika, Jaringan & Keamanan Siber',
    paket: 'PAKET B & PAKET C',
    kelas: 'Kelas 7-9 Paket B & Kelas 10-12 Paket C',
    username: 'tutor.hanifah',
    email: 'hanifah.saadah@pkbmcelahcahaya.sch.id',
    foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    no: 8,
    nama: 'Syifa Rahmawati, S.T.',
    no_sk: '08/PKBM-CC/I/2018',
    tempat_lahir: 'Garut',
    tanggal_lahir: '20 Agustus 1993',
    jenis_kelamin: 'P',
    pendidikan: 'S1',
    mata_pelajaran: 'Prakarya & Kewirausahaan (Paket B & C)',
    mapel_paket_b: 'Prakarya, Kerajinan & Desain',
    mapel_paket_c: 'Prakarya & Kewirausahaan (PKWU) Usaha Digital',
    paket: 'PAKET B & PAKET C',
    kelas: 'Kelas 7-9 Paket B & Kelas 10-12 Paket C',
    username: 'tutor.syifa',
    email: 'syifa.rahmawati@pkbmcelahcahaya.sch.id',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    no: 9,
    nama: 'Rini Nurani, S.Pd.I',
    no_sk: '09/PKBM-CC/I/2018',
    tempat_lahir: 'Garut',
    tanggal_lahir: '14 Februari 1991',
    jenis_kelamin: 'P',
    pendidikan: 'S1',
    mata_pelajaran: 'Pendidikan Agama Islam (Paket B & C)',
    mapel_paket_b: 'PAI & Praktik Ibadah',
    mapel_paket_c: 'PAI & Sejarah Peradaban Islam',
    paket: 'PAKET B & PAKET C',
    kelas: 'Kelas 7-9 Paket B & Kelas 10-12 Paket C',
    username: 'tutor.rini',
    email: 'rini.nurani@pkbmcelahcahaya.sch.id',
    foto: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80'
  },
  {
    no: 10,
    nama: 'Wina Mulyati, S.Pd',
    no_sk: '12/PKBM-CC/I/2018',
    tempat_lahir: 'Garut',
    tanggal_lahir: '6 Agustus 1981',
    jenis_kelamin: 'P',
    pendidikan: 'SMA',
    mata_pelajaran: 'Seni Budaya & Keterampilan (Paket B & C)',
    mapel_paket_b: 'Seni Budaya & Keterampilan Vokasional',
    mapel_paket_c: 'Keterampilan Tata Busana & Kerajinan',
    paket: 'PAKET B & PAKET C',
    kelas: 'Kelas 7-9 Paket B & Kelas 10-12 Paket C',
    username: 'tutor.wina',
    email: 'wina.mulyati@pkbmcelahcahaya.sch.id',
    foto: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80'
  },
  {
    no: 11,
    nama: 'Asep Sugiana, S.Pd.I',
    no_sk: '13/PKBM-CC/I/2018',
    tempat_lahir: 'Garut',
    tanggal_lahir: '24 Desember 1986',
    jenis_kelamin: 'L',
    pendidikan: 'S1',
    mata_pelajaran: 'PPKn & Pendidikan Pancasila (Paket B & C)',
    mapel_paket_b: 'Pendidikan Pancasila & Kewarganegaraan (PPKn)',
    mapel_paket_c: 'Pendidikan Pancasila & Hukum Ketatanegaraan',
    paket: 'PAKET B & PAKET C',
    kelas: 'Kelas 7-9 Paket B & Kelas 10-12 Paket C',
    username: 'tutor.asep',
    email: 'asep.sugiana@pkbmcelahcahaya.sch.id',
    foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
  },
  {
    no: 12,
    nama: 'Ridwan Abdul Aziz, S.T.',
    no_sk: '14/PKBM-CC/I/2018',
    tempat_lahir: 'Garut',
    tanggal_lahir: '17 Januari 1990',
    jenis_kelamin: 'L',
    pendidikan: 'S1',
    mata_pelajaran: 'Fisika & Sains Terapan (Paket B & C)',
    mapel_paket_b: 'IPA Terapan & Energi Alternatif',
    mapel_paket_c: 'Fisika Eksperimen & Kimia Lingkungan',
    paket: 'PAKET B & PAKET C',
    kelas: 'Kelas 7-9 Paket B & Kelas 10-12 Paket C',
    username: 'tutor.ridwan',
    email: 'ridwan.aziz@pkbmcelahcahaya.sch.id',
    foto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    no: 13,
    nama: 'Vita Situ Zulaikha, S.Pd., M.Pd.',
    no_sk: '15/PKBM-CC/I/2018',
    tempat_lahir: 'Bandung',
    tanggal_lahir: '22 April 1988',
    jenis_kelamin: 'P',
    pendidikan: 'S2',
    mata_pelajaran: 'Bahasa Inggris (Paket B & C)',
    mapel_paket_b: 'Bahasa Inggris Dasar & Percakapan',
    mapel_paket_c: 'Bahasa Inggris Lanjut & Korespondensi',
    paket: 'PAKET B & PAKET C',
    kelas: 'Kelas 7-9 Paket B & Kelas 10-12 Paket C',
    username: 'tutor.vita',
    email: 'vita.zulaikha@pkbmcelahcahaya.sch.id',
    foto: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80'
  },
  {
    no: 14,
    nama: 'Rangga Wiranata, S.Pd',
    no_sk: '16/PKBM-CC/I/2018',
    tempat_lahir: 'Garut',
    tanggal_lahir: '11 November 1993',
    jenis_kelamin: 'L',
    pendidikan: 'S1',
    mata_pelajaran: 'PJOK (Pendidikan Jasmani) (Paket B & C)',
    mapel_paket_b: 'PJOK & Pola Hidup Sehat',
    mapel_paket_c: 'PJOK, Kebugaran & Olahraga Rekreasi',
    paket: 'PAKET B & PAKET C',
    kelas: 'Kelas 7-9 Paket B & Kelas 10-12 Paket C',
    username: 'tutor.rangga',
    email: 'rangga.wiranata@pkbmcelahcahaya.sch.id',
    foto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
  },
  {
    no: 15,
    nama: 'Tanzilal, S.Ag',
    no_sk: '17/PKBM-CC/I/2018',
    tempat_lahir: 'Garut',
    tanggal_lahir: '5 Mei 1985',
    jenis_kelamin: 'L',
    pendidikan: 'S1',
    mata_pelajaran: 'Sosiologi & IPS Terpadu (Paket B & C)',
    mapel_paket_b: 'IPS Terpadu & Sejarah Kebangsaan',
    mapel_paket_c: 'Sosiologi Masyarakat & Antropologi Budaya',
    paket: 'PAKET B & PAKET C',
    kelas: 'Kelas 7-9 Paket B & Kelas 10-12 Paket C',
    username: 'tutor.tanzilal',
    email: 'tanzilal@pkbmcelahcahaya.sch.id',
    foto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80'
  },
  {
    no: 16,
    nama: 'Ai Nurhalimah, S.PD',
    no_sk: '18/PKBM-CC/I/2018',
    tempat_lahir: 'Garut',
    tanggal_lahir: '29 Oktober 1992',
    jenis_kelamin: 'P',
    pendidikan: 'S1',
    mata_pelajaran: 'Ekonomi, Geografi & IPS (Paket B & C)',
    mapel_paket_b: 'IPS Ekonomi & Pemberdayaan Usaha',
    mapel_paket_c: 'Ekonomi, Akuntansi Bisnis & Geografi',
    paket: 'PAKET B & PAKET C',
    kelas: 'Kelas 7-9 Paket B & Kelas 10-12 Paket C',
    username: 'tutor.ai',
    email: 'ai.nurhalimah@pkbmcelahcahaya.sch.id',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_TUTOR_USERS: User[] = MASTER_TUTOR_LIST.map((t, idx) => ({
  id: `USR-TUT-${String(idx + 1).padStart(2, '0')}`,
  username: t.username,
  password: 'password123',
  nama: t.nama,
  email: t.email,
  role: 'TUTOR',
  paket: 'PAKET B', // Base default Paket
  mata_pelajaran: t.mata_pelajaran,
  mapel_paket_b: t.mapel_paket_b,
  mapel_paket_c: t.mapel_paket_c,
  kelas: t.kelas,
  status: 'AKTIF',
  foto: t.foto,
  no_sk: t.no_sk,
  tempat_lahir: t.tempat_lahir,
  tanggal_lahir: t.tanggal_lahir,
  jenis_kelamin: t.jenis_kelamin,
  pendidikan: t.pendidikan,
  last_login: '2026-08-15 08:30 WIB',
  created_at: '2018-01-10'
}));

/**
 * Otomatis mendeteksi rekomendasi mata pelajaran & paket berdasarkan nama / kualifikasi tutor
 */
export function getAutoMataPelajaranByNama(namaTutor: string): {
  mata_pelajaran: string;
  mapel_paket_b: string;
  mapel_paket_c: string;
  paket: 'PAKET B' | 'PAKET C';
  kelas: string;
  no_sk?: string;
  pendidikan?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: 'L' | 'P';
} {
  const match = MASTER_TUTOR_LIST.find(
    t => t.nama.toLowerCase().includes(namaTutor.toLowerCase()) || namaTutor.toLowerCase().includes(t.nama.toLowerCase())
  );
  if (match) {
    return {
      mata_pelajaran: match.mata_pelajaran,
      mapel_paket_b: match.mapel_paket_b,
      mapel_paket_c: match.mapel_paket_c,
      paket: match.paket === 'PAKET C' ? 'PAKET C' : 'PAKET B',
      kelas: match.kelas,
      no_sk: match.no_sk,
      pendidikan: match.pendidikan,
      tempat_lahir: match.tempat_lahir,
      tanggal_lahir: match.tanggal_lahir,
      jenis_kelamin: match.jenis_kelamin
    };
  }

  // Smart heuristic fallback
  return {
    mata_pelajaran: 'Mata Pelajaran Umum (Paket B & C)',
    mapel_paket_b: 'Ilmu Pengetahuan Sosial & Bahasa',
    mapel_paket_c: 'Sosiologi & Bahasa Indonesia',
    paket: 'PAKET B',
    kelas: 'Kelas 7-9 Paket B & Kelas 10-12 Paket C'
  };
}

/**
 * Mendapatkan Tutor Pengampu resmi yang ditugaskan untuk Modul/Mata Pelajaran tertentu
 */
export function getAssignedTutorForMateri(materi?: { mata_pelajaran?: string; judul?: string; paket?: string } | null): TutorMasterInfo {
  if (!materi) return MASTER_TUTOR_LIST[0];

  const mapelLower = (materi.mata_pelajaran || '').toLowerCase();
  const judulLower = (materi.judul || '').toLowerCase();
  const text = `${mapelLower} ${judulLower}`;

  // 1. Direct specific subject matching
  if (text.includes('inggris') || text.includes('english')) {
    return MASTER_TUTOR_LIST.find(t => t.nama.includes('Vita')) || MASTER_TUTOR_LIST[12];
  }
  if (text.includes('matematika') || text.includes('aljabar') || text.includes('geometri') || text.includes('kalkulus')) {
    return MASTER_TUTOR_LIST.find(t => t.nama.includes('Ruli')) || MASTER_TUTOR_LIST[4];
  }
  if (text.includes('biologi') || text.includes('ipa') || text.includes('alam') || text.includes('lingkungan')) {
    return MASTER_TUTOR_LIST.find(t => t.nama.includes('Budi Iskandar')) || MASTER_TUTOR_LIST[3];
  }
  if (text.includes('fisika') || text.includes('kimia') || text.includes('energi')) {
    return MASTER_TUTOR_LIST.find(t => t.nama.includes('Ridwan')) || MASTER_TUTOR_LIST[11];
  }
  if (text.includes('agama') || text.includes('pai') || text.includes('islam') || text.includes('akhlak') || text.includes('ibadah')) {
    return MASTER_TUTOR_LIST.find(t => t.nama.includes('Ine')) || MASTER_TUTOR_LIST[5];
  }
  if (text.includes('informatika') || text.includes('komputer') || text.includes('tik') || text.includes('coding') || text.includes('digital')) {
    return MASTER_TUTOR_LIST.find(t => t.nama.includes('Roni')) || MASTER_TUTOR_LIST[2];
  }
  if (text.includes('pancasila') || text.includes('ppkn') || text.includes('kewarganegaraan') || text.includes('hukum')) {
    return MASTER_TUTOR_LIST.find(t => t.nama.includes('Asep')) || MASTER_TUTOR_LIST[10];
  }
  if (text.includes('ekonomi') || text.includes('geografi') || text.includes('akuntansi') || text.includes('uang')) {
    return MASTER_TUTOR_LIST.find(t => t.nama.includes('Ai Nurhalimah')) || MASTER_TUTOR_LIST[15];
  }
  if (text.includes('sosiologi') || text.includes('ips') || text.includes('sosial') || text.includes('sejarah') || text.includes('antropologi')) {
    return MASTER_TUTOR_LIST.find(t => t.nama.includes('Tanzilal')) || MASTER_TUTOR_LIST[14];
  }
  if (text.includes('prakarya') || text.includes('kewirausahaan') || text.includes('pkwu') || text.includes('bisnis') || text.includes('kerajinan')) {
    return MASTER_TUTOR_LIST.find(t => t.nama.includes('Syifa')) || MASTER_TUTOR_LIST[7];
  }
  if (text.includes('pjok') || text.includes('olahraga') || text.includes('jasmani') || text.includes('kebugaran') || text.includes('kesehatan')) {
    return MASTER_TUTOR_LIST.find(t => t.nama.includes('Rangga')) || MASTER_TUTOR_LIST[13];
  }
  if (text.includes('seni') || text.includes('budaya') || text.includes('sunda') || text.includes('musik') || text.includes('teater')) {
    return MASTER_TUTOR_LIST.find(t => t.nama.includes('Nita')) || MASTER_TUTOR_LIST[1];
  }
  if (text.includes('indonesia') || text.includes('sastra') || text.includes('bacaan') || text.includes('teks')) {
    return MASTER_TUTOR_LIST.find(t => t.nama.includes('Opik')) || MASTER_TUTOR_LIST[0];
  }

  // 2. Generic search across tutor subjects
  const match = MASTER_TUTOR_LIST.find(t => {
    const tutorMapel = `${t.mata_pelajaran} ${t.mapel_paket_b} ${t.mapel_paket_c}`.toLowerCase();
    return mapelLower.split(' ').some(word => word.length > 3 && tutorMapel.includes(word));
  });

  return match || MASTER_TUTOR_LIST[0];
}

