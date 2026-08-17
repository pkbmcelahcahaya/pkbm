export type UserRole = 'SISWA' | 'TUTOR' | 'ADMIN';
export type PaketType = 'PAKET B' | 'PAKET C';
export type UserStatus = 'AKTIF' | 'NONAKTIF';

export interface User {
  id: string;
  username: string;
  password?: string;
  nama: string;
  email: string;
  telepon?: string;
  role: UserRole;
  paket?: PaketType;
  kelas?: string;
  nisn?: string;
  status: UserStatus;
  foto?: string;
  foto_url?: string;
  mata_pelajaran?: string; // For Tutor (Ringkasan / Utama)
  mapel_paket_b?: string; // For Tutor: Mapel di Paket B (SMP)
  mapel_paket_c?: string; // For Tutor: Mapel di Paket C (SMA)
  last_login?: string;
  created_at: string;
  updated_at?: string;
  // Extended Dapodik / Biodata Siswa & Tutor Fields
  no_sk?: string;
  pendidikan?: string;
  nipd?: string;
  jenis_kelamin?: 'L' | 'P';
  tempat_lahir?: string;
  tanggal_lahir?: string;
  nik?: string;
  agama?: string;
  alamat?: string;
  rt?: string;
  rw?: string;
  dusun?: string;
  kelurahan?: string;
  kecamatan?: string;
  kode_pos?: string;
  rombel?: string;
}

export interface Materi {
  id: string;
  judul: string;
  deskripsi: string;
  paket: PaketType;
  mata_pelajaran: string;
  kategori: string;
  nama_file: string;
  file_id: string;
  drive_url: string;
  preview_url: string;
  ukuran_file: string;
  tahun: string;
  sumber_url?: string;
  urutan: number;
  status: 'AKTIF' | 'DRAF' | 'ARSIP';
  tingkatan?: string; // e.g. 'Kelas 7', 'Kelas 8', 'Kelas 10'
  view_count?: number;
  download_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface Kelas {
  id: string;
  nama_kelas: string;
  nama?: string;
  paket: PaketType;
  tingkat: string;
  wali_tutor?: string;
  wali_kelas?: string;
  jumlah_siswa?: number;
  status: 'AKTIF' | 'NONAKTIF';
  created_at: string;
}

export interface MataPelajaran {
  id: string;
  kode: string;
  nama_mata_pelajaran: string;
  nama?: string;
  paket: PaketType;
  tingkatan?: string; // e.g. 'Kelas 7-9' or 'Kelas 10-12'
  tingkat?: string;
  fase?: string; // e.g. 'Fase D' or 'Fase E/F'
  kelompok?: 'UMUM' | 'PEMBERDAYAAN' | 'KETERAMPILAN' | 'PEMINATAN' | 'MUATAN_LOKAL' | string;
  deskripsi: string;
  icon?: string;
  alokasi_waktu_jam?: number;
  alokasi_skk?: number;
  skk?: number;
  urutan?: number;
  status: 'AKTIF' | 'NONAKTIF' | 'ARSIP';
}

// ==========================================
// 📚 KURIKULUM KESETARAAN PAKET B & C TYPES
// ==========================================

export type KurikulumStatus = 'AKTIF' | 'DRAF' | 'PENINJAUAN' | 'ARSIP';
export type DokumenKurikulumStatus = 'DRAF' | 'REVIEW' | 'DISETUJUI' | 'AKTIF' | 'ARSIP' | 'PUBLIK' | 'INTERNAL';
export type KelompokMapel = 'UMUM' | 'PEMBERDAYAAN' | 'KETERAMPILAN' | 'PEMINATAN' | 'MUATAN_LOKAL';
export type AsesmenJenis =
  | 'DIAGNOSTIK'
  | 'FORMATIF'
  | 'SUMATIF_MODUL'
  | 'SUMATIF_AKHIR_SEMESTER'
  | 'UJIAN_KESETARAAN'
  | 'PENUGASAN_PROYEK'
  | 'PENUGASAN'
  | 'UPK'
  | 'PORTOFOLIO'
  | 'LAINNYA';
export type JenisAsesmen = AsesmenJenis;

export type KategoriDokumenKurikulum =
  | 'KOSP_DOKUMEN_1'
  | 'KOSP_KTSP'
  | 'STRUKTUR_KURIKULUM'
  | 'CAPAIAN_PEMBELAJARAN'
  | 'ALUR_TUJUAN_PEMBELAJARAN'
  | 'MODUL_AJAR'
  | 'PANDUAN_ASESMEN'
  | 'PANDUAN_SOP'
  | 'KALENDER_PENDIDIKAN'
  | 'SK_LEGAL'
  | 'SK_LEGALITAS'
  | 'PROGRAM_TAHUNAN'
  | 'PROGRAM_SEMESTER'
  | 'LAINNYA';

export interface KurikulumProfile {
  id: string;
  nama_kurikulum: string;
  tahun_pelajaran: string;
  semester_aktif: string;
  status_penerapan: KurikulumStatus;
  dasar_penyusunan: string;
  karakteristik_satuan: string;
  karakteristik_warga_belajar: string;
  visi: string;
  misi: string;
  tujuan: string;
  pendekatan_pembelajaran: string;
  model_pembelajaran: string;
  strategi_pembelajaran: string;
  prinsip_asesmen: string;
  penguatan_karakter: string;
  versi: string;
  is_public: boolean;
  updated_at: string;
  updated_by: string;
}

export interface KurikulumProgramDetail {
  id: string;
  program: PaketType;
  nama_resmi: string;
  tingkatan_kelas: string[];
  fase: string;
  beban_belajar_skk: number;
  deskripsi_program: string;
  kelompok_belajar: string;
  dokumen_sk?: string;
  tujuan_program: string;
  strategi_pembelajaran: string;
  prinsip_kelulusan: string;
  catatan?: string;
  updated_at: string;
}

export interface StrukturKurikulumItem {
  id: string;
  program: PaketType;
  tingkatan: string; // e.g. "Kelas 7", "Kelas 8", "Kelas 9", "Kelas 10", "Kelas 11", "Kelas 12", "Semua Tingkatan"
  fase?: string;
  kelompok: KelompokMapel;
  mata_pelajaran_id?: string;
  kode_mapel: string;
  nama_mata_pelajaran: string;
  alokasi_waktu_jam: number; // JP per minggu/semester
  alokasi_skk: number; // SKK
  porsi_tatap_muka_persen?: number; // e.g. 20%
  porsi_tutorial_persen?: number; // e.g. 30%
  porsi_mandiri_persen?: number; // e.g. 50%
  urutan: number;
  status: 'AKTIF' | 'NONAKTIF' | 'ARSIP';
  catatan?: string;
}

export interface CapaianPembelajaran {
  id: string;
  program: PaketType;
  mata_pelajaran: string;
  fase: string; // e.g. 'Fase D', 'Fase E', 'Fase F'
  tingkatan: string; // e.g. 'Kelas 7-9', 'Kelas 10', 'Kelas 11-12'
  elemen: string; // e.g. 'Pemahaman Konsep', 'Keterampilan Proses', 'Menyimak', 'Menulis'
  deskripsi_cp: string;
  tahun_pelajaran: string;
  status: 'AKTIF' | 'DRAF' | 'ARSIP';
  created_at: string;
  updated_at?: string;
}

export interface TujuanPembelajaran {
  id: string;
  cp_id: string;
  kode_tp: string;
  program: PaketType;
  mata_pelajaran: string;
  tingkatan: string;
  fase: string;
  semester: 'GANJIL' | 'GENAP' | 'SEMUA';
  deskripsi_tp: string;
  indikator_ketercapaian: string;
  materi_terkait?: string;
  materi_id?: string;
  alokasi_jp: number;
  urutan: number;
  asesmen_rekomendasi?: string;
  catatan_tutor?: string;
  status: 'AKTIF' | 'DRAF' | 'ARSIP';
}

export interface AlokasiWaktuItem {
  id: string;
  program: PaketType;
  tingkatan: string;
  mata_pelajaran: string;
  semester: 'GANJIL' | 'GENAP' | 'TAHUNAN';
  jumlah_pertemuan: number;
  durasi_menit_pertemuan: number;
  total_jam_pelajaran: number;
  porsi_tatap_muka_jp: number;
  porsi_tutorial_jp: number;
  porsi_mandiri_jp: number;
  total_skk: number;
  catatan?: string;
}

export interface KalenderPendidikanEvent {
  id: string;
  tahun_pelajaran: string;
  semester: 'GANJIL' | 'GENAP' | 'SEMUA';
  judul_kegiatan?: string;
  nama_kegiatan?: string;
  tanggal_mulai: string; // YYYY-MM-DD
  tanggal_selesai?: string; // YYYY-MM-DD
  kategori: string;
  warna?: string;
  warna_label?: string;
  keterangan?: string;
  deskripsi?: string;
  target_program?: 'SEMUA' | 'PAKET B' | 'PAKET C';
  program_terkait?: 'SEMUA' | 'PAKET B' | 'PAKET C';
}

export interface AsesmenKurikulumItem {
  id: string;
  nama_asesmen: string;
  jenis_asesmen: AsesmenJenis;
  program: 'SEMUA' | 'PAKET B' | 'PAKET C';
  mata_pelajaran?: string;
  tingkatan?: string;
  tp_terkait?: string;
  bentuk_instrumen?: string;
  kriteria_ketuntasan: string;
  bobot_persen?: number;
  catatan?: string;
  status?: 'AKTIF' | 'NONAKTIF';
  deskripsi?: string;
  tujuan_asesmen?: string;
  teknik_penilaian?: string;
  instrumen?: string;
  tindak_lanjut?: string;
}

export interface DokumenKurikulum {
  id: string;
  nama_dokumen?: string;
  judul_dokumen?: string;
  kategori: KategoriDokumenKurikulum;
  program: 'SEMUA' | 'PAKET B' | 'PAKET C';
  tahun_pelajaran: string;
  deskripsi?: string;
  format_file?: string;
  tipe_file?: string;
  file_url?: string;
  url_file?: string;
  ukuran_file?: string;
  status_publikasi?: DokumenKurikulumStatus | 'PUBLIK' | 'INTERNAL' | 'DRAF' | 'AKTIF';
  is_public?: boolean;
  uploaded_by?: string;
  created_at?: string;
  tanggal_unggah?: string;
  updated_at?: string;
}

export interface VersiKurikulum {
  id: string;
  nomor_versi: string;
  nama_versi: string;
  tahun_pelajaran: string;
  tanggal_rilis: string;
  pengubah_nama: string;
  ringkasan_perubahan: string;
  status: 'AKTIF' | 'DRAF' | 'ARSIP';
  catatan?: string;
}

export interface RiwayatPerubahanKurikulum {
  id: string;
  waktu: string;
  admin_id: string;
  admin_nama: string;
  modul: 'RINGKASAN' | 'PAKET_B' | 'PAKET_C' | 'STRUKTUR' | 'CP' | 'TP' | 'MATA_PELAJARAN' | 'ALOKASI_WAKTU' | 'KALENDER' | 'ASESMEN' | 'DOKUMEN' | 'VERSI' | 'PENGATURAN';
  jenis_perubahan: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'ARCHIVE' | 'RESTORE' | 'IMPORT';
  judul_perubahan: string;
  keterangan: string;
}

export interface Aktivitas {
  id: string;
  user_id: string;
  nama: string;
  role: UserRole;
  aktivitas: string;
  materi_id?: string;
  materi_judul?: string;
  paket?: PaketType;
  waktu: string;
  ip?: string;
  browser?: string;
  durasi_detik?: number;
  progress_persen?: number;
}

export interface LoginLog {
  id: string;
  user_id: string;
  username: string;
  nama: string;
  role: UserRole;
  waktu_login: string;
  waktu_logout?: string;
  durasi?: string;
  browser: string;
  device: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  materi_id: string;
  created_at: string;
}

export interface ReadingProgress {
  user_id: string;
  materi_id: string;
  last_page: number;
  total_pages: number;
  progress_percent: number;
  last_read_at: string;
  completed: boolean;
}

export interface ImportItem {
  id: string;
  nama_file: string;
  judul: string;
  paket: PaketType;
  mata_pelajaran: string;
  sumber_url: string;
  status: 'MENUNGGU' | 'DIPROSES' | 'BERHASIL' | 'DUPLIKAT' | 'GAGAL';
  drive_url?: string;
  file_id?: string;
  ukuran_file?: string;
  pesan_error?: string;
  tanggal?: string;
}

export interface GasConfig {
  webAppUrl: string;
  spreadsheetId: string;
  driveFolderId: string;
  apiKey?: string;
  isLiveConnected: boolean;
  lastSync?: string;
  autoSync: boolean;
}

export interface WebsiteSetting {
  nama_sekolah: string;
  subjudul: string;
  npsn?: string;
  alamat: string;
  desa_kelurahan?: string;
  kecamatan?: string;
  kabupaten?: string;
  provinsi?: string;
  status?: string;
  bentuk_pendidikan?: string;
  jenjang?: string;
  program_layanan?: string;
  sk_pendirian?: string;
  tanggal_sk_pendirian?: string;
  sk_operasional?: string;
  tanggal_sk_operasional?: string;
  logo_url?: string;
  email: string;
  telepon: string;
  email_pkbm?: string;
  telepon_pkbm?: string;
  alamat_pkbm?: string;
  deskripsi: string;
  pengumuman: string;
  tampilkan_pengumuman: boolean;
  izin_download_siswa: boolean;
}

// --- 2026 LMS EXTENDED TYPES ---

export type TatapMukaStatus = 'AKAN_DATANG' | 'BERLANGSUNG' | 'SELESAI' | 'DIBATALKAN';

export interface TatapMuka {
  id: string;
  judul: string;
  deskripsi: string;
  mata_pelajaran: string;
  kelas: string;
  paket: PaketType;
  tutor_id: string;
  tutor_nama: string;
  tanggal: string; // YYYY-MM-DD
  jam_mulai: string; // HH:MM
  jam_selesai: string; // HH:MM
  link_meet: string; // Google Meet URL
  materi_id?: string;
  materi_judul?: string;
  status: TatapMukaStatus;
  created_at: string;
}

export type TugasStatus = 'BELUM_DIKERJAKAN' | 'SEDANG_DIKERJAKAN' | 'SUDAH_DIKUMPULKAN' | 'TERLAMBAT' | 'SUDAH_DINILAI';

export interface Tugas {
  id: string;
  judul: string;
  deskripsi: string;
  deskripsi_petunjuk?: string;
  kelas: string;
  paket: PaketType;
  mata_pelajaran: string;
  materi_terkait_id?: string;
  materi_terkait_judul?: string;
  tutor_id: string;
  tutor_nama: string;
  tanggal_mulai?: string;
  batas_pengumpulan: string; // ISO / YYYY-MM-DDTHH:mm
  nilai_maksimal?: number;
  bobot_nilai?: number;
  file_lampiran_nama?: string;
  file_lampiran_url?: string;
  status: 'AKTIF' | 'NONAKTIF';
  created_at: string;
}

export interface PengumpulanTugas {
  id: string;
  tugas_id: string;
  user_id: string;
  siswa_nama: string;
  siswa_paket: PaketType;
  waktu_pengumpulan: string;
  teks_jawaban: string;
  file_nama?: string;
  file_url?: string;
  file_tipe?: string;
  file_ukuran?: string;
  status: TugasStatus;
  nilai?: number;
  feedback_tutor?: string;
  dinilai_oleh?: string;
  dinilai_pada?: string;
}

export type TipeSoal = 'PILIHAN_GANDA' | 'BENAR_SALAH' | 'ISIAN_SINGKAT' | 'URAIAN';
export type TingkatKesulitan = 'MUDAH' | 'SEDANG' | 'SULIT';

export interface OpsiPilihan {
  key: string; // e.g. 'A', 'B', 'C', 'D'
  text: string;
}

export interface Soal {
  id: string;
  mata_pelajaran: string;
  paket: PaketType;
  topik_materi?: string;
  tipe: TipeSoal;
  pertanyaan: string;
  gambar_url?: string;
  opsi_pilihan?: OpsiPilihan[];
  opsi_jawaban?: string[];
  kunci_jawaban: string; // 'A', 'BENAR', text, or rubrik
  bobot_nilai: number;
  penjelasan?: string;
  pembahasan?: string;
  kesulitan?: TingkatKesulitan;
  tingkat_kesulitan?: TingkatKesulitan;
  created_at: string;
}

export type UlanganStatus = 'DRAF' | 'AKTIF' | 'NONAKTIF' | 'SELESAI';

export interface Ulangan {
  id: string;
  judul: string;
  deskripsi: string;
  petunjuk?: string;
  mata_pelajaran: string;
  paket: PaketType;
  kelas: string;
  tutor_id: string;
  tutor_nama: string;
  waktu_mulai?: string; // YYYY-MM-DDTHH:mm
  waktu_selesai?: string; // YYYY-MM-DDTHH:mm
  durasi_menit: number;
  nilai_maksimal?: number;
  kkm?: number;
  batas_percobaan?: number;
  status: UlanganStatus;
  publikasikan_nilai?: boolean;
  daftar_soal: Soal[];
  created_at: string;
}

export interface UjianAttempt {
  id: string;
  ulangan_id: string;
  ulangan_judul: string;
  user_id: string;
  siswa_nama: string;
  siswa_paket: PaketType;
  mulai_pada: string;
  selesai_pada?: string;
  durasi_detik_habis?: number;
  status: 'SEDANG_MENGERJAKAN' | 'SELESAI' | 'WAKTU_HABIS';
  jawaban: Record<string, string>; // soal_id -> jawaban
  nilai_otomatis?: number;
  nilai_uraian?: number;
  nilai_total?: number;
  dinilai: boolean;
  feedback_tutor?: string;
  catatan_per_soal?: Record<string, { nilai: number; feedback?: string }>;
}

// --- 📝 100-QUESTION MODULE QUIZ SYSTEM TYPES ---

export interface ModulQuizSoal {
  id: string;
  nomor: number; // 1 to 100
  topik_bab?: string;
  pertanyaan: string;
  pilihan: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  kunci_jawaban: 'A' | 'B' | 'C' | 'D';
  pembahasan: string;
  tingkat_kesulitan: 'MUDAH' | 'SEDANG' | 'SULIT';
}

export interface ModulQuizAttempt {
  id: string; // MQA-...
  materi_id: string;
  materi_judul: string;
  mata_pelajaran: string;
  paket: PaketType;
  tingkatan?: string;
  user_id: string;
  siswa_nama: string;
  siswa_nisn?: string;
  kelas?: string;
  tutor_id?: string;
  tutor_nama?: string;
  mulai_pada: string; // ISO / formatted
  selesai_pada: string;
  durasi_detik: number;
  jawaban: Record<number, string>; // nomor -> 'A'|'B'|'C'|'D'
  ragu_ragu?: Record<number, boolean>;
  kunci_jawaban_snapshot?: Record<number, string>;
  pembahasan_snapshot?: Record<number, string>;
  pertanyaan_snapshot?: Record<number, { pertanyaan: string; pilihan: Record<string, string> }>;
  jumlah_soal: number; // 100
  jumlah_benar: number;
  jumlah_salah: number;
  jumlah_kosong: number;
  nilai: number; // 0-100
  kkm: number; // default 75
  status_kelulusan: 'LULUS' | 'TIDAK_LULUS';
  percobaan_ke: number;
  timestamp: string;
}

export interface ModulProgressDetail {
  materi_id: string;
  user_id: string;
  is_completed: boolean;
  completed_at?: string;
  total_attempts: number;
  highest_score: number;
  latest_score: number;
  status_kelulusan: 'LULUS' | 'TIDAK_LULUS' | 'BELUM_KUIS';
}

export interface NotifikasiApp {
  id: string;
  user_id?: string; // specific user or undefined for broadcast
  target_role?: UserRole | 'ALL';
  target_paket?: PaketType | 'ALL';
  judul: string;
  pesan: string;
  tipe: 'TUGAS' | 'ULANGAN' | 'TATAP_MUKA' | 'SISTEM' | 'NILAI';
  dibaca: boolean;
  link_tab?: string;
  created_at: string;
}

// --- 2026 PENDAFTARAN & DAPODIK SYSTEM TYPES ---

export type PendaftaranStatus = 'DRAFT' | 'DIAJUKAN' | 'DIVERIFIKASI' | 'PERLU_PERBAIKAN' | 'DITERIMA' | 'DITOLAK';
export type DokumenStatus = 'BELUM_DIVERIFIKASI' | 'VALID' | 'TIDAK_VALID' | 'PERLU_PERBAIKAN';
export type JenisDokumen =
  | 'PAS_FOTO'
  | 'KK'
  | 'AKTA_KELAHIRAN'
  | 'KTP_SISWA'
  | 'KTP_ORANGTUA'
  | 'IJAZAH'
  | 'SKHUN'
  | 'KIP'
  | 'PKH'
  | 'KKS'
  | 'RAPOR'
  | 'SURAT_PINDAH'
  | 'LAINNYA';

export interface DokumenPendaftaran {
  id: string;
  jenis: JenisDokumen;
  label: string;
  nama_file: string;
  url: string; // Base64 or object URL
  tipe_file: string;
  ukuran_bytes: number;
  status_verifikasi: DokumenStatus;
  catatan_operator?: string;
  uploaded_at: string;
}

export interface PendaftaranWargaBelajar {
  id: string;
  nomor_pendaftaran: string; // e.g. PKBM-2026-000123
  tahun_ajaran: string; // e.g. 2026/2027
  gelombang: string; // e.g. Gelombang 1 (Januari - Juni 2026)
  program_pilihan: PaketType; // PAKET B or PAKET C
  jenis_pendaftaran: 'BARU' | 'PINDAHAN';
  status: PendaftaranStatus;
  status_pendaftaran?: string;
  tanggal_pendaftaran: string; // ISO string
  catatan_operator?: string;
  diverifikasi_oleh?: string;
  diverifikasi_pada?: string;
  user_id_terbuat?: string;

  // 1. Identitas Warga Belajar
  nama_lengkap: string;
  nisn?: string;
  nik: string; // 16 digits
  nomor_kk: string; // 16 digits
  jenis_kelamin: 'L' | 'P';
  tempat_lahir: string;
  tanggal_lahir: string; // YYYY-MM-DD
  agama: 'ISLAM' | 'KRISTEN' | 'KATOLIK' | 'HINDU' | 'BUDDHA' | 'KONGHUCU' | 'LAINNYA';
  kewarganegaraan: 'WNI' | 'WNA';
  kebutuhan_khusus: string; // e.g. 'Tidak Ada', 'Netra', etc.
  anak_ke: number;
  jumlah_saudara_kandung: number;

  // 2. Data Tempat Tinggal
  alamat_lengkap: string;
  alamat_domisili?: {
    alamat_lengkap?: string;
    desa_kelurahan?: string;
    kecamatan?: string;
    kode_pos?: string;
  };
  rt: string;
  rw: string;
  dusun_kampung?: string;
  desa_kelurahan: string;
  kecamatan: string;
  kabupaten_kota: string;
  provinsi: string;
  kode_pos: string;
  status_tempat_tinggal: 'MILIK_SENDIRI' | 'RUMAH_ORANG_TUA' | 'SEWA_KONTRAK' | 'ASRAMA' | 'MENUMPANG' | 'LAINNYA';
  moda_transportasi: 'JALAN_KAKI' | 'SEPEDA' | 'SEPEDA_MOTOR' | 'ANGKUTAN_UMUM' | 'KENDARAAN_PRIBADI' | 'OJEK_ONLINE' | 'LAINNYA';
  jarak_ke_pkbm: '< 1 km' | '1 - 3 km' | '3 - 5 km' | '5 - 10 km' | '> 10 km';
  waktu_tempuh_menit: number;

  // 3. Data Kontak
  nomor_hp: string;
  nomor_wa: string;
  email: string;
  kontak_darurat_nomor?: string;
  kontak_darurat_nama?: string;
  kontak_darurat_hubungan?: string;

  // 4. Data Ayah Kandung
  ayah_nama: string;
  ayah_nik?: string;
  ayah_tahun_lahir?: number;
  ayah_pendidikan?: string;
  ayah_pekerjaan?: string;
  ayah_penghasilan?: string;
  ayah_status: 'MASIH_HIDUP' | 'MENINGGAL' | 'TIDAK_DIKETAHUI';

  // 5. Data Ibu Kandung
  ibu_nama: string;
  ibu_nik?: string;
  ibu_tahun_lahir?: number;
  ibu_pendidikan?: string;
  ibu_pekerjaan?: string;
  ibu_penghasilan?: string;
  ibu_status: 'MASIH_HIDUP' | 'MENINGGAL' | 'TIDAK_DIKETAHUI';

  // 6. Data Wali (Kondisional)
  tinggal_bersama: 'ORANG_TUA' | 'WALI' | 'SENDIRI' | 'ASRAMA_PANTI';
  wali_nama?: string;
  wali_nik?: string;
  wali_tahun_lahir?: number;
  wali_pendidikan?: string;
  wali_pekerjaan?: string;
  wali_penghasilan?: string;
  wali_hubungan?: string;
  wali_telepon?: string;

  // 7. Data Periodik
  tinggi_badan_cm?: number;
  berat_badan_kg?: number;
  lingkar_kepala_cm?: number;

  // 8. Data Kesejahteraan
  punya_kip: boolean;
  nomor_kip?: string;
  punya_pkh: boolean;
  nomor_pkh?: string;
  punya_kks: boolean;
  nomor_kks?: string;

  // 9. Riwayat Pendidikan
  sekolah_asal: string;
  npsn_sekolah_asal?: string;
  nomor_peserta_ujian?: string;
  nomor_seri_ijazah?: string;
  tahun_lulus?: number;
  status_pendidikan_terakhir?: string;
  surat_pindah_nomor?: string;
  surat_pindah_tanggal?: string;

  // 10. Dokumen Terunggah
  dokumen: DokumenPendaftaran[];
  pas_foto_url?: string;

  created_at: string;
  updated_at?: string;
}

export interface LearningStreakDay {
  dayName: string; // 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'
  fullDayName: string; // 'Senin', 'Selasa', ...
  dateStr: string; // 'YYYY-MM-DD'
  displayDate: string; // '17 Agu'
  studied: boolean;
  isToday: boolean;
  activitiesCount: number;
}

export interface LearningStreakData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  studiedToday: boolean;
  activeDates: string[];
  weekDays: LearningStreakDay[];
  lastStudyDate?: string;
  motivationalMessage: string;
  nextMilestone: number;
  daysToNextMilestone: number;
}

export interface RecentModuleActivity {
  materi_id: string;
  judul: string;
  mata_pelajaran: string;
  paket: PaketType;
  last_accessed: string; // ISO string
  progress_percent: number;
  last_page: number;
  total_pages: number;
  completed: boolean;
  total_time_seconds?: number;
}

export interface MateriCommentReply {
  id: string;
  comment_id: string;
  user_id: string;
  user_name: string;
  user_role: 'SISWA' | 'TUTOR' | 'ADMIN';
  content: string;
  created_at: string;
  likes: string[];
  is_tutor_answer?: boolean;
}

export interface MateriComment {
  id: string;
  materi_id: string;
  user_id: string;
  user_name: string;
  user_role: 'SISWA' | 'TUTOR' | 'ADMIN';
  avatar_url?: string;
  page_number?: number;
  type: 'QUESTION' | 'INSIGHT' | 'GENERAL';
  content: string;
  created_at: string;
  likes: string[];
  replies: MateriCommentReply[];
  is_pinned?: boolean;
}

export interface StudyGoalData {
  weeklyGoalHours: number;
  actualStudyHoursThisWeek: number;
  totalAllTimeSeconds: number;
  progressPercent: number;
  updated_at: string;
}


