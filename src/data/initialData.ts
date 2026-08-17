import { User, Materi, Kelas, MataPelajaran, Aktivitas, WebsiteSetting, GasConfig } from '../types';
import { INITIAL_MATERI_PAKET_B } from './paketBData';
import { INITIAL_MATERI_PAKET_C } from './paketCData';
import { INITIAL_SISWA_LIST } from './siswaData';
import { INITIAL_TUTOR_USERS } from './tutorData';

export const DEFAULT_GAS_CONFIG: GasConfig = {
  webAppUrl: 'https://script.google.com/macros/s/AKfycbzcceRjkYicvkUGnCprLftfbZ8YuK5fZWam0MRN8X3pSfoEDIi7gXVWaX3jOhcahymh/exec',
  spreadsheetId: '1JMaGtYl77Qm5enl9N2A49_6oivu0mAjwCHe6QApfbQM',
  driveFolderId: '1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX',
  isLiveConnected: true,
  autoSync: false,
  lastSync: undefined
};

export const DEFAULT_SETTINGS: WebsiteSetting = {
  nama_sekolah: 'PKBM CELAH CAHAYA',
  subjudul: 'Paket B & Paket C',
  npsn: 'P9984574',
  alamat: 'Kp. Sukawangi, Desa Sukawangi, Kec. Singajaya, Kab. Garut, Jawa Barat',
  desa_kelurahan: 'Sukawangi',
  kecamatan: 'Singajaya',
  kabupaten: 'Garut',
  provinsi: 'Jawa Barat',
  status: 'SWASTA',
  bentuk_pendidikan: 'PKBM',
  jenjang: 'DIKMAS',
  program_layanan: 'Paket B dan Paket C',
  sk_pendirian: '421.9/1145-DISDIK',
  tanggal_sk_pendirian: '22-07-2019',
  sk_operasional: '421.9/1145-DISDIK',
  tanggal_sk_operasional: '22-07-2019',
  logo_url: 'https://lh3.googleusercontent.com/d/1YOLykYW-nVj8Lj6SyVPCjXdXnkwdQKZ3',
  email: 'info@pkbmcelahcahaya.sch.id',
  telepon: '+62 821-1936-2454',
  deskripsi: 'PKBM Celah Cahaya menyelenggarakan pendidikan kesetaraan Paket B (setara SMP) dan Paket C (setara SMA) di Singajaya, Garut dengan kurikulum terpadu, modul digital, dan pembelajaran fleksibel.',
  pengumuman: 'Pemberitahuan: Pelaksanaan pembelajaran semester aktif telah dibuka. Seluruh warga belajar Paket B & Paket C dapat mengakses modul dan jadwal kegiatan belajar.',
  tampilkan_pengumuman: true,
  izin_download_siswa: true
};

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-ADM-01',
    username: 'admin',
    password: 'password123',
    nama: 'Dr. Hendra Gunawan, M.Pd.',
    email: 'admin@pkbmcelahcahaya.sch.id',
    role: 'ADMIN',
    status: 'AKTIF',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    last_login: '2026-08-15 10:15 WIB',
    created_at: '2026-01-10'
  },
  // All 16 Official Tutors of PKBM Celah Cahaya
  ...INITIAL_TUTOR_USERS,
  // All 32 Student Records from Dapodik PKBM Celah Cahaya
  ...INITIAL_SISWA_LIST
];

export const INITIAL_CLASSES: Kelas[] = [
  { id: 'KLS-B-07', nama_kelas: 'Kelas 7 Paket B', paket: 'PAKET B', tingkat: 'Tingkat 3 / Derajat Terampil 1', wali_tutor: 'Roni Nuroni, S.T', status: 'AKTIF', created_at: '2026-01-10' },
  { id: 'KLS-B-08', nama_kelas: 'Kelas 8 Paket B', paket: 'PAKET B', tingkat: 'Tingkat 3 / Derajat Terampil 2', wali_tutor: 'Budi Iskandar, S.Si., M.Pd.', status: 'AKTIF', created_at: '2026-01-10' },
  { id: 'KLS-B-09', nama_kelas: 'Kelas 9 Paket B', paket: 'PAKET B', tingkat: 'Tingkat 4 / Derajat Terampil 3', wali_tutor: 'Ruli Lesmana, S.T', status: 'AKTIF', created_at: '2026-01-10' },
  { id: 'KLS-C-10', nama_kelas: 'Kelas 10 Paket C', paket: 'PAKET C', tingkat: 'Tingkat 5 / Derajat Mahir 1', wali_tutor: 'Nita Nurhayati, M.Hum', status: 'AKTIF', created_at: '2026-01-10' },
  { id: 'KLS-C-11', nama_kelas: 'Kelas 11 Paket C', paket: 'PAKET C', tingkat: 'Tingkat 5 / Derajat Mahir 2', wali_tutor: 'Dr. Opik, M.Pd', status: 'AKTIF', created_at: '2026-01-10' },
  { id: 'KLS-C-12', nama_kelas: 'Kelas 12 Paket C', paket: 'PAKET C', tingkat: 'Tingkat 6 / Derajat Mahir 3', wali_tutor: 'Vita Situ Zulaikha, S.Pd., M.Pd.', status: 'AKTIF', created_at: '2026-01-10' }
];

export const INITIAL_MAPEL: MataPelajaran[] = [
  // Paket B
  { id: 'MP-B-01', kode: 'B-IND', nama_mata_pelajaran: 'Bahasa Indonesia', paket: 'PAKET B', deskripsi: 'Penguasaan teks narasi, eksposisi, laporan hasil observasi dan karya sastra.', icon: 'BookOpen', urutan: 1, status: 'AKTIF' },
  { id: 'MP-B-02', kode: 'B-ING', nama_mata_pelajaran: 'Bahasa Inggris', paket: 'PAKET B', deskripsi: 'Komunikasi dasar, ungkapan sehari-hari, reading comprehension dan descriptive text.', icon: 'Languages', urutan: 2, status: 'AKTIF' },
  { id: 'MP-B-03', kode: 'B-MAT', nama_mata_pelajaran: 'Matematika', paket: 'PAKET B', deskripsi: 'Aritmatika, aljabar, geometri, statistika dasar dan penyelesaian masalah matematis.', icon: 'Calculator', urutan: 3, status: 'AKTIF' },
  { id: 'MP-B-04', kode: 'B-IPA', nama_mata_pelajaran: 'IPA', paket: 'PAKET B', deskripsi: 'Pengukuran, klasifikasi makhluk hidup, suhu, kalor, dan organisasi kehidupan.', icon: 'Atom', urutan: 4, status: 'AKTIF' },
  { id: 'MP-B-05', kode: 'B-IPS', nama_mata_pelajaran: 'IPS', paket: 'PAKET B', deskripsi: 'Geografi nusantara, cikal bakal kebudayaan, interaksi sosial dan kegiatan ekonomi.', icon: 'Globe', urutan: 5, status: 'AKTIF' },
  { id: 'MP-B-06', kode: 'B-PPKN', nama_mata_pelajaran: 'PPKn', paket: 'PAKET B', deskripsi: 'Pancasila, norma hukum, keberagaman, kerjasama dan keutuhan NKRI.', icon: 'ShieldCheck', urutan: 6, status: 'AKTIF' },
  { id: 'MP-B-07', kode: 'B-SNB', nama_mata_pelajaran: 'Seni Budaya', paket: 'PAKET B', deskripsi: 'Ragam hias flora-fauna, kriya kayu, kerajinan kulit, dan musik ansambel.', icon: 'Palette', urutan: 7, status: 'AKTIF' },
  { id: 'MP-B-08', kode: 'B-PJK', nama_mata_pelajaran: 'PJOK', paket: 'PAKET B', deskripsi: 'Permainan bola besar/kecil, atletik, senam lantai, kebugaran dan P3K.', icon: 'Activity', urutan: 8, status: 'AKTIF' },
  { id: 'MP-B-09', kode: 'B-PRA', nama_mata_pelajaran: 'Prakarya', paket: 'PAKET B', deskripsi: 'Teknologi konstruksi, kerja kayu, miniatur rekayasa, dan kerajinan bahan keras.', icon: 'Briefcase', urutan: 9, status: 'AKTIF' },
  { id: 'MP-B-10', kode: 'B-INF', nama_mata_pelajaran: 'Informatika', paket: 'PAKET B', deskripsi: 'Berpikir komputasional, teknologi informasi komunikasi, dan etika digital.', icon: 'Cpu', urutan: 10, status: 'AKTIF' },
  { id: 'MP-B-11', kode: 'B-PAI', nama_mata_pelajaran: 'Pendidikan Agama Islam', paket: 'PAKET B', deskripsi: 'Akidah akhlak, fiqih ibadah, sejarah kebudayaan Islam, dan tadabbur Al-Qur\'an.', icon: 'BookMarked', urutan: 11, status: 'AKTIF' },

  // Paket C
  { id: 'MP-C-01', kode: 'C-IND', nama_mata_pelajaran: 'Bahasa Indonesia', paket: 'PAKET C', deskripsi: 'Kritik sastra, artikel opini, proposal ilmiah, karya ilmiah dan pidato resmi.', icon: 'BookOpen', urutan: 1, status: 'AKTIF' },
  { id: 'MP-C-02', kode: 'C-ING', nama_mata_pelajaran: 'Bahasa Inggris', paket: 'PAKET C', deskripsi: 'Academic writing, formal letter, analytical exposition, dan discussion text.', icon: 'Languages', urutan: 2, status: 'AKTIF' },
  { id: 'MP-C-03', kode: 'C-MAT', nama_mata_pelajaran: 'Matematika', paket: 'PAKET C', deskripsi: 'Aljabar, trigonometri lanjutan, kalkulus, matriks, dan matematika peminatan.', icon: 'Calculator', urutan: 3, status: 'AKTIF' },
  { id: 'MP-C-04', kode: 'C-SOS', nama_mata_pelajaran: 'Sosiologi', paket: 'PAKET C', deskripsi: 'Struktur sosial, perubahan sosial, konflik masyarakat, dan penelitian sosial.', icon: 'Users', urutan: 4, status: 'AKTIF' },
  { id: 'MP-C-05', kode: 'C-EKO', nama_mata_pelajaran: 'Ekonomi', paket: 'PAKET C', deskripsi: 'Ekonomi mikro & makro, akuntansi perusahaan, manajemen, dan pasar modal.', icon: 'TrendingUp', urutan: 5, status: 'AKTIF' },
  { id: 'MP-C-06', kode: 'C-GEO', nama_mata_pelajaran: 'Geografi', paket: 'PAKET C', deskripsi: 'Litologi, atmosfer, hidrosfer, penginderaan jauh, dan dinamika biosfer.', icon: 'Map', urutan: 6, status: 'AKTIF' },
  { id: 'MP-C-07', kode: 'C-SEJ', nama_mata_pelajaran: 'Sejarah', paket: 'PAKET C', deskripsi: 'Sejarah peminatan dan Sejarah Indonesia dari peradaban kuno hingga era modern.', icon: 'Landmark', urutan: 7, status: 'AKTIF' },
  { id: 'MP-C-08', kode: 'C-BIO', nama_mata_pelajaran: 'Biologi', paket: 'PAKET C', deskripsi: 'Keanekaragaman hayati, ekosistem, mikroorganisme, dan biologi terapan.', icon: 'Dna', urutan: 8, status: 'AKTIF' },
  { id: 'MP-C-09', kode: 'C-FIS', nama_mata_pelajaran: 'Fisika', paket: 'PAKET C', deskripsi: 'Mekanika, gelombang optik, tata surya, usaha energi, dan fisika modern.', icon: 'Zap', urutan: 9, status: 'AKTIF' },
  { id: 'MP-C-10', kode: 'C-KIM', nama_mata_pelajaran: 'Kimia', paket: 'PAKET C', deskripsi: 'Struktur atom, tabel periodik, ikatan kimia, larutan elektrolit, dan stoikiometri.', icon: 'FlaskConical', urutan: 10, status: 'AKTIF' },
  { id: 'MP-C-11', kode: 'C-PPKN', nama_mata_pelajaran: 'PPKn', paket: 'PAKET C', deskripsi: 'Tata kelola pemerintahan, penegakan HAM, sistem peradilan dan integrasi nasional.', icon: 'ShieldCheck', urutan: 11, status: 'AKTIF' },
  { id: 'MP-C-12', kode: 'C-SNB', nama_mata_pelajaran: 'Seni Budaya', paket: 'PAKET C', deskripsi: 'Seni rupa dua/tiga dimensi, apresiasi musik tradisional dan pertunjukan seni.', icon: 'Palette', urutan: 12, status: 'AKTIF' },
  { id: 'MP-C-13', kode: 'C-PJK', nama_mata_pelajaran: 'PJOK', paket: 'PAKET C', deskripsi: 'Aktivitas kebugaran, permainan bola, senam lantai, atletik, dan P3K.', icon: 'Activity', urutan: 13, status: 'AKTIF' },
  { id: 'MP-C-14', kode: 'C-PRA', nama_mata_pelajaran: 'Prakarya', paket: 'PAKET C', deskripsi: 'Kerajinan limbah, rekayasa budidaya lokal, dan kewirausahaan digital.', icon: 'Briefcase', urutan: 14, status: 'AKTIF' },
  { id: 'MP-C-15', kode: 'C-INF', nama_mata_pelajaran: 'Informatika', paket: 'PAKET C', deskripsi: 'Algoritma pemrograman, sistem komputer, analisis data, dan jaringan internet.', icon: 'Cpu', urutan: 15, status: 'AKTIF' },
  { id: 'MP-C-16', kode: 'C-PAI', nama_mata_pelajaran: 'Pendidikan Agama Islam', paket: 'PAKET C', deskripsi: 'Kajian akhlak terpuji, hukum Islam dalam masyarakat modern, dan peradaban Islam.', icon: 'BookMarked', urutan: 16, status: 'AKTIF' }
];

// Rich set of authentic modules scraped & structured from modul.pkbm.id / Kemendikbudristek Kesetaraan
export const INITIAL_MATERI: Materi[] = [
  // --- PAKET B (SMP SETARA - 41 Modul) ---
  ...INITIAL_MATERI_PAKET_B,

  // --- PAKET C (SMA SETARA - 80 Modul) ---
  ...INITIAL_MATERI_PAKET_C
];

export const INITIAL_ACTIVITIES: Aktivitas[] = [
  {
    id: 'ACT-001',
    user_id: 'USR-SIS-01',
    nama: 'Ahmad Faisal Pratama',
    role: 'SISWA',
    aktivitas: 'Membaca Materi',
    materi_id: 'MAT-B-001',
    materi_judul: 'Bahasa Indonesia Modul 1: Indahnya Alam Negeriku',
    paket: 'PAKET B',
    waktu: '2026-08-15 08:35 WIB',
    durasi_detik: 420,
    progress_persen: 85
  },
  {
    id: 'ACT-002',
    user_id: 'USR-SIS-02',
    nama: 'Siti Nurhaliza',
    role: 'SISWA',
    aktivitas: 'Membaca Materi',
    materi_id: 'MAT-C-002',
    materi_judul: 'Sosiologi Modul 1: Memahami Gejala Sosial dalam Masyarakat',
    paket: 'PAKET C',
    waktu: '2026-08-15 10:12 WIB',
    durasi_detik: 610,
    progress_persen: 100
  },
  {
    id: 'ACT-003',
    user_id: 'USR-TUT-01',
    nama: 'Budi Santoso, S.Pd.',
    role: 'TUTOR',
    aktivitas: 'Mengunggah Modul Baru',
    materi_id: 'MAT-B-004',
    materi_judul: 'Matematika Modul 2: Bentuk Aljabar dan Persamaan Linear',
    paket: 'PAKET B',
    waktu: '2026-08-15 09:40 WIB'
  },
  {
    id: 'ACT-004',
    user_id: 'USR-ADM-01',
    nama: 'Dr. Hendra Gunawan, M.Pd.',
    role: 'ADMIN',
    aktivitas: 'Sinkronisasi Database Google Sheets & Drive',
    waktu: '2026-08-15 10:20 WIB'
  }
];
