import React, { useState } from 'react';
import {
  X,
  BookOpen,
  GraduationCap,
  Users,
  Shield,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  LogIn,
  LayoutDashboard,
  FileText,
  ClipboardList,
  Award,
  CalendarCheck,
  Bell,
  Lock,
  LogOut,
  FolderPlus,
  BarChart3,
  Settings,
  Database,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  ExternalLink
} from 'lucide-react';
import { MASTER_LEMBAGA } from '../data/lembagaConfig';
import { LogoPKBM } from './LogoPKBM';

interface PanduanPenggunaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'SISWA' | 'TUTOR' | 'ADMIN' | 'BANTUAN';
}

interface GuideSection {
  id: string;
  title: string;
  badge?: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const PanduanPenggunaModal: React.FC<PanduanPenggunaModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'SISWA'
}) => {
  const [activeTab, setActiveTab] = useState<'SISWA' | 'TUTOR' | 'ADMIN' | 'BANTUAN'>(initialRole);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'wb-intro': true,
    'wb-login': true,
    'tut-intro': true,
    'adm-intro': true,
    'help-wb': true
  });

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialRole);
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    [...WARGA_BELAJAR_GUIDES, ...TUTOR_GUIDES, ...ADMIN_GUIDES, ...BANTUAN_GUIDES].forEach(g => {
      allExpanded[g.id] = true;
    });
    setExpandedSections(allExpanded);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  // --- DATA PANDUAN WARGA BELAJAR ---
  const WARGA_BELAJAR_GUIDES: GuideSection[] = [
    {
      id: 'wb-intro',
      title: 'A. Mengenal Platform Pembelajaran LMS PKBM Celah Cahaya',
      badge: 'Pengantar',
      icon: <Sparkles className="w-4 h-4 text-[#C8102E]" />,
      content: (
        <div className="space-y-3 text-sm text-[#1F2937] leading-[1.6]">
          <p>
            <strong>LMS PKBM Celah Cahaya</strong> adalah platform pembelajaran digital resmi bagi Warga Belajar program <strong>Paket B (Setara SMP)</strong> dan <strong>Paket C (Setara SMA)</strong> yang diselenggarakan oleh PKBM Celah Cahaya (NPSN: P9984574).
          </p>
          <div className="p-4 bg-[#F5F6F8] rounded-xl border border-gray-200 space-y-2">
            <h5 className="font-bold text-[#172033] text-xs uppercase tracking-wider">Manfaat bagi Warga Belajar:</h5>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-gray-700 leading-[1.6]">
              <li>Akses modul pembelajaran digital standar nasional kapan saja dan di mana saja.</li>
              <li>Membaca modul interaktif dengan penanda progres halaman otomatis.</li>
              <li>Mengerjakan tugas daring, ujian modul, dan mengecek rekap nilai secara transparan.</li>
              <li>Komunikasi jadwal tatap muka/webinar dan presensi kehadiran terintegrasi.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'wb-login',
      title: 'B. Cara Masuk Akun (Login)',
      badge: 'Akses',
      icon: <LogIn className="w-4 h-4 text-[#172033]" />,
      content: (
        <div className="space-y-3 text-sm text-[#1F2937] leading-[1.6]">
          <ol className="list-decimal list-inside space-y-2 text-xs text-gray-700 leading-[1.6]">
            <li>Buka situs web LMS PKBM Celah Cahaya melalui peramban di HP, tablet, atau komputer.</li>
            <li>Klik tombol <strong>"Masuk Portal"</strong> pada bilah atas (navbar) atau beranda utama.</li>
            <li>Masukkan <strong>Username</strong> atau <strong>NISN</strong> yang telah didaftarkan pihak PKBM.</li>
            <li>Masukkan <strong>Password</strong> akun Anda dengan benar.</li>
            <li>Klik tombol <strong>"Masuk ke Portal Belajar"</strong>.</li>
          </ol>
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 leading-[1.6]">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span><strong>Penanganan Gagal Login:</strong> Pastikan penulisan huruf besar/kecil password tepat. Jika lupa akun atau terkunci, hubungi Tutor Wali Kelas atau Admin PKBM.</span>
          </div>
        </div>
      )
    },
    {
      id: 'wb-dashboard',
      title: 'C. Fungsi Menu Dashboard Warga Belajar',
      badge: 'Navigasi',
      icon: <LayoutDashboard className="w-4 h-4 text-[#172033]" />,
      content: (
        <div className="space-y-3 text-sm text-[#1F2937] leading-[1.6]">
          <p className="text-xs text-gray-600">Dashboard warga belajar dirancang khusus sesuai paket kesetaraan Anda:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-lg bg-[#F5F6F8] border border-gray-200">
              <span className="font-bold text-[#172033]">📖 Modul Saya</span>: Daftar seluruh buku/modul PDF resmi sesuai tingkat kelas.
            </div>
            <div className="p-3 rounded-lg bg-[#F5F6F8] border border-gray-200">
              <span className="font-bold text-[#172033]">📝 Tugas & Lembar Kerja</span>: Tempat melihat instruksi dan mengunggah tugas.
            </div>
            <div className="p-3 rounded-lg bg-[#F5F6F8] border border-gray-200">
              <span className="font-bold text-[#172033]">⏱️ Ujian / Asesmen Modul</span>: Pelaksanaan ujian modul berbasis pilihan ganda & esai.
            </div>
            <div className="p-3 rounded-lg bg-[#F5F6F8] border border-gray-200">
              <span className="font-bold text-[#172033]">📅 Tatap Muka & Presensi</span>: Jadwal kelas sinkronus / luring dan bukti hadir.
            </div>
            <div className="p-3 rounded-lg bg-[#F5F6F8] border border-gray-200">
              <span className="font-bold text-[#172033]">📊 Rekap Nilai</span>: Lembar hasil belajar dan catatan umpan balik tutor.
            </div>
            <div className="p-3 rounded-lg bg-[#F5F6F8] border border-gray-200">
              <span className="font-bold text-[#172033]">🔔 Notifikasi</span>: Pemberitahuan batas waktu tugas dan informasi terkini.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'wb-profil',
      title: 'D. Profil Warga Belajar',
      badge: 'Data Diri',
      icon: <Users className="w-4 h-4 text-[#172033]" />,
      content: (
        <div className="space-y-2 text-xs text-gray-700 leading-[1.6]">
          <ul className="list-disc list-inside space-y-1.5">
            <li>Buka menu profil di pojok kanan atas untuk memeriksa NIK, NISN, Nama Lengkap, dan Paket Kesetaraan.</li>
            <li>Pastikan data ejaan nama sama persis dengan Ijazah sebelumnya atau Akta Kelahiran.</li>
            <li>Anda dapat memperbarui foto profil dan informasi kontak aktif jika diizinkan sistem.</li>
            <li>Selalu jaga kerahasiaan data pribadi dan jangan membagikan informasi akun kepada pihak luar.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'wb-materi',
      title: 'E. Membaca & Mengunduh Materi Pembelajaran',
      badge: 'Modul',
      icon: <BookOpen className="w-4 h-4 text-[#C8102E]" />,
      content: (
        <div className="space-y-2 text-xs text-gray-700 leading-[1.6]">
          <ol className="list-decimal list-inside space-y-2">
            <li>Pilih mata pelajaran yang ingin dipelajari dari daftar Modul Pembelajaran.</li>
            <li>Klik tombol <strong>"Buka Modul (PDF Reader)"</strong> untuk membaca secara interaktif.</li>
            <li>Gunakan fitur navigasi halaman, zoom, dan penanda buku (bookmark).</li>
            <li>Jika fitur unduhan diaktifkan oleh pengelola, klik <strong>"Unduh PDF"</strong> untuk disimpan ke perangkat dan dibaca saat offline.</li>
            <li>Progres membaca akan tersimpan otomatis ke akun belajar Anda.</li>
          </ol>
        </div>
      )
    },
    {
      id: 'wb-tugas',
      title: 'F. Pengerjaan & Pengumpulan Tugas',
      badge: 'Tugas',
      icon: <ClipboardList className="w-4 h-4 text-[#172033]" />,
      content: (
        <div className="space-y-2 text-xs text-gray-700 leading-[1.6]">
          <ol className="list-decimal list-inside space-y-2">
            <li>Buka tab <strong>"Tugas"</strong> pada dashboard.</li>
            <li>Pilih tugas aktif dan cermati instruksi serta batas waktu pengumpulan (deadline).</li>
            <li>Unduh lembar kerja pendukung jika disediakan oleh tutor.</li>
            <li>Kerjakan tugas, kemudian unggah berkas jawaban (format PDF, DOCX, atau Foto) atau tulis jawaban pada kolom yang disediakan.</li>
            <li>Klik <strong>"Kirim Tugas"</strong> dan pastikan status tugas berubah menjadi <em>"Terkirim / Menunggu Penilaian"</em>.</li>
            <li>Setelah dikoreksi, Anda dapat melihat nilai perolehan beserta catatan koreksi dari tutor.</li>
          </ol>
        </div>
      )
    },
    {
      id: 'wb-ujian',
      title: 'G. Pelaksanaan Asesmen & Ujian Modul',
      badge: 'Ujian',
      icon: <Award className="w-4 h-4 text-[#C8102E]" />,
      content: (
        <div className="space-y-2 text-xs text-gray-700 leading-[1.6]">
          <ol className="list-decimal list-inside space-y-2">
            <li>Buka tab <strong>"Ujian"</strong> pada dashboard.</li>
            <li>Pilih ujian yang sedang berlangsung dan periksa alokasi waktu pengerjaan.</li>
            <li>Jawab seluruh soal pilihan ganda maupun esai secara teliti.</li>
            <li>Klik tombol <strong>"Selesaikan Ujian"</strong> sebelum batas waktu berakhir.</li>
            <li>Hasil nilai pilihan ganda akan ditampilkan langsung secara otomatis.</li>
          </ol>
        </div>
      )
    }
  ];

  // --- DATA PANDUAN TUTOR ---
  const TUTOR_GUIDES: GuideSection[] = [
    {
      id: 'tut-intro',
      title: 'A. Peran & Akses Tutor PKBM',
      badge: 'Peran',
      icon: <GraduationCap className="w-4 h-4 text-[#C8102E]" />,
      content: (
        <div className="space-y-3 text-sm text-[#1F2937] leading-[1.6]">
          <p className="text-xs text-gray-700">
            Tutor memiliki wewenang mengelola modul ajar, memberikan penugasan, menyelenggarakan ujian modul, memantau absensi tatap muka, dan memberikan penilaian formatif/sumatif.
          </p>
          <div className="p-3.5 bg-[#F5F6F8] rounded-xl border border-gray-200 text-xs text-gray-700">
            <span className="font-bold text-[#172033] block mb-1">Kewajiban Tutor:</span>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Memastikan modul ajar terunggah lengkap sesuai capaian pembelajaran (CP).</li>
              <li>Memberikan umpan balik tugas maksimal 3 hari kerja setelah batas pengumpulan.</li>
              <li>Mengisi catatan perkembangan warga belajar pada lembar rekapitulasi.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'tut-modul',
      title: 'B. Mengunggah & Memperbarui Modul Ajar',
      badge: 'Kelola Materi',
      icon: <FolderPlus className="w-4 h-4 text-[#172033]" />,
      content: (
        <div className="space-y-2 text-xs text-gray-700 leading-[1.6]">
          <ol className="list-decimal list-inside space-y-2">
            <li>Buka tab <strong>"Manajemen Modul"</strong> pada dashboard Tutor.</li>
            <li>Pilih mata pelajaran dan paket kesetaraan (Paket B / Paket C).</li>
            <li>Unggah file PDF modul ke Google Drive resmi PKBM atau masukkan URL file.</li>
            <li>Lengkapi data modul: Judul, Tingkatan, Tahun Terbit, dan Deskripsi Capaian Pembelajaran.</li>
            <li>Klik <strong>"Simpan Modul"</strong> agar materi tampil di dashboard warga belajar.</li>
          </ol>
        </div>
      )
    },
    {
      id: 'tut-nilai',
      title: 'C. Koreksi Tugas & Penilaian Rekapitulasi',
      badge: 'Penilaian',
      icon: <BarChart3 className="w-4 h-4 text-[#172033]" />,
      content: (
        <div className="space-y-2 text-xs text-gray-700 leading-[1.6]">
          <ol className="list-decimal list-inside space-y-2">
            <li>Buka tab <strong>"Koreksi Tugas"</strong> untuk melihat daftar kiriman siswa.</li>
            <li>Unduh atau tinjau berkas jawaban warga belajar.</li>
            <li>Berikan nilai numerik (skala 0–100) dan catatan deskriptif umpan balik.</li>
            <li>Klik <strong>"Simpan Nilai"</strong> untuk merekam data ke buku nilai digital.</li>
          </ol>
        </div>
      )
    }
  ];

  // --- DATA PANDUAN ADMIN ---
  const ADMIN_GUIDES: GuideSection[] = [
    {
      id: 'adm-intro',
      title: 'A. Manajemen Pengguna & Otorisasi Sistem',
      badge: 'Admin',
      icon: <Shield className="w-4 h-4 text-[#C8102E]" />,
      content: (
        <div className="space-y-3 text-sm text-[#1F2937] leading-[1.6]">
          <p className="text-xs text-gray-700">
            Administrator memegang kendali penuh atas seluruh master data, akun pengguna (Siswa, Tutor, Admin), manajemen KOSP kurikulum, dan integrasi cloud storage.
          </p>
        </div>
      )
    },
    {
      id: 'adm-kurikulum',
      title: 'B. Pengelolaan Kurikulum Operasional (KOSP)',
      badge: 'Kurikulum',
      icon: <FileText className="w-4 h-4 text-[#172033]" />,
      content: (
        <div className="space-y-2 text-xs text-gray-700 leading-[1.6]">
          <p>
            Mengatur kurikulum kesetaraan, struktur mata pelajaran wajib dan peminatan, alokasi modul pembelajaran, serta tahun ajaran aktif <strong>(2026/2027)</strong> melalui Modul Kurikulum Operasional.
          </p>
        </div>
      )
    },
    {
      id: 'adm-integrasi',
      title: 'C. Integrasi Google Sheets & Drive PKBM',
      badge: 'Database',
      icon: <Database className="w-4 h-4 text-[#172033]" />,
      content: (
        <div className="space-y-2 text-xs text-gray-700 leading-[1.6]">
          <p>
            Kelola integrasi basis data Google Spreadsheet, sinkronisasi folder Google Drive resmi PKBM, deploy Web App Google Apps Script, dan kelola cadangan (backup) data sistem.
          </p>
        </div>
      )
    }
  ];

  // --- DATA PUSAT BANTUAN ---
  const BANTUAN_GUIDES: GuideSection[] = [
    {
      id: 'help-wb',
      title: '❓ Panduan Pemecahan Masalah Warga Belajar',
      badge: 'Kendala Siswa',
      icon: <HelpCircle className="w-4 h-4 text-[#C8102E]" />,
      content: (
        <div className="space-y-3 text-xs text-gray-700 leading-[1.6]">
          <p className="text-gray-600">Jika Anda mengalami kendala teknis dalam menggunakan LMS, lakukan langkah-langkah berikut secara berurutan:</p>
          <div className="space-y-2">
            <div className="p-3 bg-[#F5F6F8] rounded-xl border border-gray-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#172033] text-white font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
              <div>
                <strong>Periksa kembali Username dan Password:</strong> Pastikan tidak ada spasi di awal/akhir dan huruf besar/kecil sesuai.
              </div>
            </div>
            <div className="p-3 bg-[#F5F6F8] rounded-xl border border-gray-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#172033] text-white font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
              <div>
                <strong>Periksa Koneksi Internet:</strong> Pastikan jaringan data atau Wi-Fi Anda stabil saat membuka modul atau mengirim tugas.
              </div>
            </div>
            <div className="p-3 bg-[#F5F6F8] rounded-xl border border-gray-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#172033] text-white font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
              <div>
                <strong>Refresh Halaman Peramban:</strong> Muat ulang halaman untuk memperbarui data tampilan terkini.
              </div>
            </div>
            <div className="p-3 bg-[#F5F6F8] rounded-xl border border-gray-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#172033] text-white font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
              <div>
                <strong>Logout dan Login Kembali:</strong> Keluar dari akun lalu masuk kembali untuk menyegarkan sesi otentikasi.
              </div>
            </div>
            <div className="p-3 bg-[#F5F6F8] rounded-xl border border-gray-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#172033] text-white font-bold flex items-center justify-center shrink-0 text-[11px]">5</span>
              <div>
                <strong>Hubungi Tutor Pembimbing:</strong> Untuk kendala materi, tugas, atau nilai yang belum masuk.
              </div>
            </div>
            <div className="p-3 bg-[#F5F6F8] rounded-xl border border-gray-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#172033] text-white font-bold flex items-center justify-center shrink-0 text-[11px]">6</span>
              <div>
                <strong>Hubungi Administrator PKBM Celah Cahaya:</strong> Untuk kendala verifikasi berkas atau akun terblokir.
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'help-tut',
      title: '❓ Panduan Pemecahan Masalah Tutor',
      badge: 'Kendala Tutor',
      icon: <HelpCircle className="w-4 h-4 text-[#172033]" />,
      content: (
        <div className="space-y-3 text-xs text-gray-700 leading-[1.6]">
          <p className="text-gray-600">Langkah penanganan kendala bagi Tutor:</p>
          <div className="space-y-2">
            <div className="p-3 bg-[#F5F6F8] rounded-xl border border-gray-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#C8102E] text-white font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
              <div><strong>Periksa Koneksi Internet:</strong> Pastikan koneksi stabil terutama saat mengunggah modul atau file tugas besar.</div>
            </div>
            <div className="p-3 bg-[#F5F6F8] rounded-xl border border-gray-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#C8102E] text-white font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
              <div><strong>Pastikan Format Berkas Sesuai:</strong> Unggah file dalam format PDF untuk modul dan PDF/DOCX/JPG untuk lampiran tugas.</div>
            </div>
            <div className="p-3 bg-[#F5F6F8] rounded-xl border border-gray-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#C8102E] text-white font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
              <div><strong>Hubungi Administrator Sistem:</strong> Untuk kendala sinkronisasi Google Sheets atau penambahan kelas baru.</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Filter based on active tab & search query
  const getCurrentList = () => {
    let list: GuideSection[] = [];
    if (activeTab === 'SISWA') list = WARGA_BELAJAR_GUIDES;
    else if (activeTab === 'TUTOR') list = TUTOR_GUIDES;
    else if (activeTab === 'ADMIN') list = ADMIN_GUIDES;
    else if (activeTab === 'BANTUAN') list = BANTUAN_GUIDES;

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(q);
      const badgeMatch = item.badge?.toLowerCase().includes(q);
      return titleMatch || badgeMatch;
    });
  };

  const currentGuides = getCurrentList();

  return (
    <div
      id="panduan-modal-overlay"
      className="fixed inset-0 z-50 bg-[#172033]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn font-sans"
    >
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#172033] p-5 sm:p-6 text-white flex items-center justify-between border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <LogoPKBM size="md" imageClassName="bg-white p-0.5 rounded-lg" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white tracking-tight">
                  PANDUAN PENGGUNA RESMI
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C8102E] text-white uppercase">
                  LMS 2026
                </span>
              </div>
              <p className="text-xs text-gray-300">
                {MASTER_LEMBAGA.nama} • Paket B & Paket C
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation & Search Toolbar (edX MOOC style) */}
        <div className="px-6 py-3 bg-[#F5F6F8] border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Horizontal Text Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('SISWA')}
              className={`py-2 text-xs font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
                activeTab === 'SISWA'
                  ? 'text-[#172033]'
                  : 'text-gray-500 hover:text-[#172033]'
              }`}
            >
              <span>Warga Belajar</span>
              {activeTab === 'SISWA' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8102E] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('TUTOR')}
              className={`py-2 text-xs font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
                activeTab === 'TUTOR'
                  ? 'text-[#172033]'
                  : 'text-gray-500 hover:text-[#172033]'
              }`}
            >
              <span>Tutor</span>
              {activeTab === 'TUTOR' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8102E] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('ADMIN')}
              className={`py-2 text-xs font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
                activeTab === 'ADMIN'
                  ? 'text-[#172033]'
                  : 'text-gray-500 hover:text-[#172033]'
              }`}
            >
              <span>Administrator</span>
              {activeTab === 'ADMIN' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8102E] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('BANTUAN')}
              className={`py-2 text-xs font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
                activeTab === 'BANTUAN'
                  ? 'text-[#172033]'
                  : 'text-gray-500 hover:text-[#172033]'
              }`}
            >
              <span>Pusat Bantuan</span>
              {activeTab === 'BANTUAN' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8102E] rounded-full" />
              )}
            </button>
          </div>

          {/* Search bar & collapse controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari topik panduan..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs text-[#172033] focus:outline-none focus:border-[#C8102E]"
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={expandAll}
                className="p-1.5 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-[11px] font-semibold cursor-pointer"
                title="Buka Semua"
              >
                Buka Semua
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="p-1.5 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-[11px] font-semibold cursor-pointer"
                title="Tutup Semua"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Accordion Guides */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#F5F6F8] text-[#1F2937]">
          {currentGuides.length === 0 ? (
            <div className="text-center py-12 text-gray-400 space-y-2 bg-white rounded-xl border border-gray-200 p-8">
              <HelpCircle className="w-10 h-10 mx-auto text-gray-300" />
              <p className="text-xs text-gray-600">Tidak ditemukan panduan dengan kata kunci "{searchQuery}".</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-[#C8102E] hover:underline cursor-pointer"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            currentGuides.map((guide) => {
              const isExpanded = expandedSections[guide.id] ?? false;
              return (
                <div
                  key={guide.id}
                  className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(guide.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 hover:bg-gray-50/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#F5F6F8] text-[#172033] border border-gray-200">
                        {guide.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#172033] leading-tight">
                          {guide.title}
                        </h4>
                        {guide.badge && (
                          <span className="inline-block mt-0.5 text-[10px] font-semibold text-gray-500">
                            {guide.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-1 rounded text-gray-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 sm:p-6 pt-0 border-t border-gray-100 bg-white">
                      {guide.content}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 sm:p-5 bg-white border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-gray-500">
            {MASTER_LEMBAGA.copyright}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#C8102E] hover:bg-[#A30D25] text-white font-semibold text-xs rounded-md cursor-pointer shadow-xs transition-all"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
