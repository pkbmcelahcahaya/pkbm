import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  HardDrive,
  Users,
  Award,
  Search,
  LogIn,
  FileText,
  Clock,
  Shield,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Lock,
  UserPlus,
  Check,
  Building2,
  Layers,
  X,
  BookMarked,
  Filter,
  Cloud,
  Smartphone,
  LockKeyhole,
  Rocket
} from 'lucide-react';
import { Materi, PaketType } from '../types';
import { storage } from '../services/storageService';
import { MASTER_LEMBAGA, ALAMAT_LENGKAP_LEMBAGA } from '../data/lembagaConfig';
import { LogoPKBM } from './LogoPKBM';
import { useI18n } from '../services/i18n';
import { TextToSpeechButton } from './common/TextToSpeechButton';
import heroBannerImg from '../assets/images/pkbm_hero_real_photo_1786953345188.jpg';
import eduDigitalLearningImg from '../assets/images/student_digital_real_photo_1786953369405.jpg';
import eduVocationalSkillsImg from '../assets/images/vocational_skills_real_photo_1786953388996.jpg';
import eduGraduationFutureImg from '../assets/images/graduation_success_real_photo_1786953407237.jpg';

interface PublicHomeProps {
  onOpenLogin: (initialTab?: 'LOGIN' | 'REGISTER', targetMateri?: Materi) => void;
  onOpenPendaftaran?: (paket?: PaketType) => void;
  onOpenCekStatus?: () => void;
  onOpenProfil?: () => void;
  onOpenPanduan?: (role?: 'SISWA' | 'TUTOR' | 'ADMIN' | 'BANTUAN') => void;
  onOpenKurikulum?: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  onOpenLogin,
  onOpenPendaftaran,
  onOpenCekStatus,
  onOpenProfil,
  onOpenPanduan,
  onOpenKurikulum
}) => {
  const { t } = useI18n();
  const [selectedPaket, setSelectedPaket] = useState<PaketType | 'SEMUA'>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMapelFilter, setSelectedMapelFilter] = useState('SEMUA');

  const materiList = storage.getMateri('GUEST');
  const settings = storage.getSettings();

  // Extract unique mapel for quick filter pills
  const availableMapel = Array.from(new Set(materiList.map(m => m.mata_pelajaran))).slice(0, 8);

  const filteredMateri = materiList.filter(m => {
    const matchPaket = selectedPaket === 'SEMUA' || m.paket === selectedPaket;
    const matchMapel = selectedMapelFilter === 'SEMUA' || m.mata_pelajaran === selectedMapelFilter;
    const matchSearch =
      !searchQuery.trim() ||
      m.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mata_pelajaran.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.tingkatan && m.tingkatan.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchPaket && matchMapel && matchSearch;
  });

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Announcement bar if enabled */}
      {settings.tampilkan_pengumuman && settings.pengumuman && (
        <aside aria-label="Pengumuman Penting" className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shrink-0">
              Pengumuman
            </span>
            <p className="font-medium text-slate-800 dark:text-amber-100">{settings.pengumuman}</p>
          </div>
          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 shrink-0 hidden sm:inline">
            Tahun Pelajaran {MASTER_LEMBAGA.tahun_ajaran_aktif}
          </span>
        </aside>
      )}

      {/* 2026 Modern Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-6 sm:p-8 md:p-12 border border-indigo-900/50 shadow-2xl">
        {/* Subtle radial ambient gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Information & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Institution badge & Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              <LogoPKBM size="lg" imageClassName="bg-white p-1.5 rounded-2xl shadow-xl border border-slate-200" />
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>NPSN {MASTER_LEMBAGA.npsn} • {MASTER_LEMBAGA.status} ({MASTER_LEMBAGA.jenjang})</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  {MASTER_LEMBAGA.nama}
                </h1>
                <p className="text-xs sm:text-base font-semibold text-amber-300">
                  Platform Pembelajaran Digital PKBM Celah Cahaya — {MASTER_LEMBAGA.subjudul}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-normal">
              Layanan pembelajaran daring terpadu dengan kurikulum operasional resmi untuk mendukung kebutuhan belajar Warga Belajar Program <strong>Paket B (Setara SMP)</strong> dan <strong>Paket C (Setara SMA)</strong> secara fleksibel, interaktif, dan terarah.
            </p>

            {/* Access Policy Notice & Core Value */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-xs text-indigo-100 flex items-start sm:items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 mt-0.5 sm:mt-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white text-xs sm:text-sm">Akses Pembelajaran • Administrasi • Informasi Program</p>
                <p className="text-indigo-200 text-[11px] sm:text-xs">
                  Belajar Lebih Mudah, Terarah, dan Fleksibel — Modul buku teks digital & kuis 100 soal dapat diakses langsung oleh Warga Belajar resmi.
                </p>
              </div>
            </div>

            {/* Hero CTAs - Single, focused, high-contrast actions */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
              {onOpenPendaftaran && (
                <button
                  type="button"
                  onClick={() => onOpenPendaftaran()}
                  className="px-5 sm:px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-98 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{t('hero.cta.ppdb', 'Daftar PPDB 2026')}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onOpenLogin('LOGIN')}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-2xl border border-indigo-400/40 backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('nav.login', 'Masuk Portal')}</span>
              </button>

              {onOpenKurikulum && (
                <button
                  type="button"
                  onClick={onOpenKurikulum}
                  className="px-4 sm:px-5 py-3 bg-indigo-600/40 hover:bg-indigo-600/60 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-2xl border border-indigo-400/30 backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Layers className="w-4 h-4 text-amber-300" />
                  <span>{t('hero.cta.curriculum', 'Lihat Kurikulum')}</span>
                </button>
              )}

              {onOpenProfil && (
                <button
                  type="button"
                  onClick={onOpenProfil}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 active:scale-98 text-indigo-200 hover:text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>{t('nav.profile', 'Profil Lembaga')}</span>
                </button>
              )}

              {onOpenPanduan && (
                <button
                  type="button"
                  onClick={() => onOpenPanduan('SISWA')}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 active:scale-98 text-amber-300 hover:text-amber-200 font-bold text-xs sm:text-sm rounded-2xl border border-white/20 backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{t('nav.guide', 'Panduan')}</span>
                </button>
              )}
            </div>

            {/* Quick trust badges */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>NPSN Resmi: <strong>{MASTER_LEMBAGA.npsn}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sistem Data Cloud Terstruktur</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Akses Terarah Paket B & C</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Commemorative Poster Art */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm sm:max-w-md mx-auto group">
              {/* Outer decorative halo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-indigo-500/30 to-red-500/30 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-500" />
              
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-indigo-500/40 shadow-2xl">
                <img
                  src={heroBannerImg}
                  alt="PKBM Celah Cahaya - Semangat Pendidikan Kesetaraan 81 Tahun Indonesia Merdeka"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover max-h-[420px] sm:max-h-[480px] hover:scale-102 transition-transform duration-500"
                />
                
                {/* Overlay Footer Badge */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Platform Pembelajaran Digital
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                      Dirgahayu RI ke-81
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 truncate">
                    Belajar Lebih Mudah, Terarah, dan Berdaya di Era Digital
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Education Metrics / Highlights */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('stat.activeLearners', 'Warga Belajar Aktif')}
            </span>
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">250+</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Paket B & Paket C</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('stat.certifiedTutors', 'Tutor Pengampu')}
            </span>
            <GraduationCap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">16</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Tutor Berkompeten</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('stat.modulesAvailable', 'Modul Kesetaraan')}
            </span>
            <BookOpen className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">{materiList.length}+</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Buku Teks & 100-Kuis</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('stat.graduationRate', 'Kelulusan Resmi')}
            </span>
            <Award className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">100%</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Ijazah Kesetaraan Negara</p>
        </div>
      </section>

      {/* Visual Educational Showcase & Pillars Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Pengalaman Belajar Unggul
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Ekosistem Pendidikan Kesetaraan Modern & Terpadu
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Menghadirkan perpaduan modul digital berbasis kurikulum nasional, penguatan keterampilan vokasional terapan, serta jaminan ijazah kesetaraan resmi untuk masa depan gemilang.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Digital Learning */}
          <div className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between hover:border-indigo-500/50">
            <div className="space-y-4">
              <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={eduDigitalLearningImg}
                  alt="Akses Pembelajaran Digital dan E-Modul Interaktif PKBM Celah Cahaya"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-amber-300 backdrop-blur-md border border-white/10 shadow-xs flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Fleksibel & Digital
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 pt-0 space-y-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Pembelajaran Digital & Mandiri
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Akses modul buku teks digital kapan saja dan di mana saja. Dilengkapi sistem evaluasi kuis 100 soal per bab dengan auto-grading langsung.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>E-Modul Kemendikbudristek & Kuis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Vocational & Life Skills */}
          <div className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between hover:border-amber-500/50">
            <div className="space-y-4">
              <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={eduVocationalSkillsImg}
                  alt="Kecakapan Hidup dan Keterampilan Vokasional Terapan Warga Belajar"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-emerald-300 backdrop-blur-md border border-white/10 shadow-xs flex items-center gap-1.5">
                    <Award className="w-3 h-3 text-emerald-400" />
                    Life Skills & Vokasi
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 pt-0 space-y-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Kecakapan Hidup & Keterampilan
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Membekali warga belajar dengan kompetensi abad 21, literasi teknologi, prakarya terapan, dan kewirausahaan lokal yang siap pakai.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Kemandirian & Kesiapan Kerja</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Official Graduation & Bright Future */}
          <div className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between hover:border-emerald-500/50">
            <div className="space-y-4">
              <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={eduGraduationFutureImg}
                  alt="Kelulusan Ijazah Resmi dan Gerbang Menuju Jenjang Masa Depan Lebih Tinggi"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-indigo-300 backdrop-blur-md border border-white/10 shadow-xs flex items-center gap-1.5">
                    <GraduationCap className="w-3 h-3 text-indigo-400" />
                    Ijazah Negara
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 pt-0 space-y-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Kelulusan Resmi & Masa Depan
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Ijazah kesetaraan resmi diakui negara secara hukum dan memiliki hak sipil setara untuk melanjutkan ke jenjang kuliah ataupun berkarier.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Terdata Resmi Dapodik Kemendikbud</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Layanan Kami: Paket B & Paket C */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Program Kesetaraan
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Program Pembelajaran PKBM Celah Cahaya
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Kurikulum operasional berbasis kompetensi, literasi digital, dan kecakapan hidup (life skills).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Paket B */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black text-lg shadow-2xs">
                B
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                  {t('catalog.paketB', 'Paket B (Setara SMP)')}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                  Program Paket B
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Ditujukan bagi warga belajar yang ingin menuntaskan jenjang pendidikan dasar 9 tahun dengan mata pelajaran Bahasa Indonesia, Bahasa Inggris, Matematika, IPA, IPS, PPKn, dan Prakarya.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Derajat Terampil 1 (Setara Kelas 7 - 8)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Derajat Terampil 2 (Setara Kelas 9)</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedPaket('PAKET B');
                  document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Jelajahi Modul Paket B</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {onOpenPendaftaran && (
                <button
                  type="button"
                  onClick={() => onOpenPendaftaran('PAKET B')}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>Daftar Paket B</span>
                </button>
              )}
            </div>
          </div>

          {/* Card Paket C */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-black text-lg shadow-2xs">
                C
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                  {t('catalog.paketC', 'Paket C (Setara SMA)')}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                  Program Paket C
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Ditujukan bagi warga belajar untuk menyelesaikan jenjang pendidikan menengah atas dengan peminatan IPS / MIPA serta kesiapan kuliah maupun dunia kerja profesional.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Derajat Mahir 1 (Setara Kelas 10 - 11)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Derajat Mahir 2 (Setara Kelas 12)</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedPaket('PAKET C');
                  document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Jelajahi Modul Paket C</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {onOpenPendaftaran && (
                <button
                  type="button"
                  onClick={() => onOpenPendaftaran('PAKET C')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Daftar Paket C</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Kurikulum Spotlight Banner */}
        {onOpenKurikulum && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white border border-indigo-800/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-indigo-500/30 text-indigo-200 uppercase tracking-wider">
                  Standar Kurikulum Nasional
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                  Eksplorasi Kurikulum Kesetaraan Paket B & Paket C
                </h3>
                <p className="text-xs text-indigo-200 mt-0.5 leading-relaxed max-w-2xl">
                  Pelajari struktur Satuan Kredit Kompetensi (SKK), Capaian Pembelajaran (CP), Alur Tujuan (ATP), dan Kalender Akademik resmi.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenKurikulum}
              className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>{t('hero.cta.curriculum', 'Buka Kurikulum')}</span>
            </button>
          </div>
        )}
      </section>

      {/* Modul Catalogue Section */}
      <section id="katalog" className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {t('catalog.title', 'Katalog Pembelajaran')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Katalog Modul Buku Teks & Kuis Digital
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t('catalog.subtitle', 'Pilih paket dan mata pelajaran untuk mulai membaca buku teks digital dan kuis 100 soal')}
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Package toggle buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setSelectedPaket('SEMUA')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPaket === 'SEMUA' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {t('catalog.all', 'Semua')}
              </button>
              <button
                type="button"
                onClick={() => setSelectedPaket('PAKET B')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPaket === 'PAKET B' ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Paket B
              </button>
              <button
                type="button"
                onClick={() => setSelectedPaket('PAKET C')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPaket === 'PAKET C' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Paket C
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('catalog.searchPlaceholder', 'Cari judul, mapel...')}
                className="w-full pl-10 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick subject filter chips */}
        {availableMapel.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Mapel:
            </span>
            <button
              type="button"
              onClick={() => setSelectedMapelFilter('SEMUA')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedMapelFilter === 'SEMUA'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Semua Mapel
            </button>
            {availableMapel.map(mapel => (
              <button
                key={mapel}
                type="button"
                onClick={() => setSelectedMapelFilter(mapel)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedMapelFilter === mapel
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {mapel}
              </button>
            ))}
          </div>
        )}

        {/* Grid of Public Modules */}
        {filteredMateri.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
              {t('catalog.noResults', 'Tidak ada modul yang sesuai dengan pencarian Anda.')}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Coba gunakan kata kunci pencarian yang lain atau reset filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedPaket('SEMUA');
                setSelectedMapelFilter('SEMUA');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMateri.slice(0, 12).map(materi => (
              <article
                key={materi.id}
                onClick={() => onOpenLogin('LOGIN', materi)}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      materi.paket === 'PAKET B'
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300'
                        : 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/80 dark:text-indigo-300'
                    }`}>
                      {materi.paket}
                    </span>

                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      <Lock className="w-3 h-3 text-amber-500" />
                      <span>{t('catalog.locked', 'Perlu Login')}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {materi.judul}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed font-normal">
                    {materi.deskripsi}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[130px]">
                    {materi.mata_pelajaran}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <div onClick={(e) => e.stopPropagation()}>
                      <TextToSpeechButton
                        text={`Modul ${materi.mata_pelajaran}: ${materi.judul}. ${materi.deskripsi || ''}`}
                        title={materi.judul}
                        variant="icon"
                        size="sm"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenLogin('LOGIN', materi);
                      }}
                      className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border border-indigo-200 dark:border-indigo-800"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{t('catalog.readNow', 'Buka Modul')}</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Action Banner to Login / Register to read all modules */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-indigo-800/50 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-black">
              Ingin Membaca Seluruh Modul Paket B & Paket C?
            </h3>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl leading-relaxed">
              Daftar akun Warga Belajar sekarang juga secara gratis untuk membuka modul lengkap, menyimpan bookmark, dan mencatat progres belajar Anda.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenLogin('LOGIN')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl border border-white/20 transition-all cursor-pointer"
            >
              {t('nav.login', 'Masuk Akun')}
            </button>
            <button
              type="button"
              onClick={() => onOpenLogin('REGISTER')}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('nav.register', 'Daftar Siswa Baru')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Inovasi Digital 2026 - Fitur Unggulan Platform Digital PKBM Celah Cahaya */}
      <section className="p-6 sm:p-10 rounded-3xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Inovasi Digital 2026
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Fitur Unggulan Platform Digital PKBM Celah Cahaya
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Fitur 1: Cloud Terintegrasi */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 flex flex-col">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg shrink-0">
                ☁️
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Cloud Terintegrasi
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Seluruh modul dan dokumen pembelajaran tersimpan secara terpusat, aman, dan terorganisasi di cloud. Sistem penyimpanan berbasis cloud membantu menjaga keamanan data, meminimalkan risiko kehilangan berkas, serta memudahkan pengelolaan dan pembaruan materi pembelajaran.
            </p>
          </div>

          {/* Fitur 2: Pembelajaran Mandiri & Fleksibel */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 flex flex-col">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg shrink-0">
                📱
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Pembelajaran Mandiri &amp; Fleksibel
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Warga belajar dapat mengakses materi pembelajaran kapan saja dan dari berbagai perangkat, baik smartphone, tablet, maupun laptop. Dilengkapi fitur pelacakan halaman secara otomatis, proses belajar dapat dilanjutkan dengan mudah dari bagian terakhir yang telah dipelajari.
            </p>
          </div>

          {/* Fitur 3: Isolasi Akses Berdasarkan Program */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 flex flex-col">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg shrink-0">
                🔐
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Isolasi Akses Berdasarkan Program
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Sistem menerapkan pengelolaan akses berbasis program pembelajaran. Warga belajar Paket B hanya memperoleh akses terhadap modul Paket B, sedangkan warga belajar Paket C hanya dapat mengakses modul Paket C. Dengan demikian, materi pembelajaran menjadi lebih terstruktur, terkontrol, dan sesuai dengan program masing-masing.
            </p>
          </div>
        </div>

        {/* Ekosistem Pembelajaran Digital Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl border border-indigo-500/20 text-white space-y-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🚀</span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Ekosistem Pembelajaran Digital
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-normal">
            Dengan dukungan cloud terintegrasi, akses pembelajaran yang fleksibel, pelacakan progres belajar, serta pengelolaan hak akses berdasarkan program, PKBM Celah Cahaya membangun ekosistem pembelajaran digital yang aman, terstruktur, adaptif, dan berorientasi pada kebutuhan warga belajar.
          </p>
          <div className="pt-2 border-t border-indigo-800/60">
            <p className="text-xs sm:text-sm font-semibold text-amber-300">
              PKBM Celah Cahaya — Belajar Lebih Mudah, Terarah, dan Berdaya di Era Digital 2026.
            </p>
          </div>
        </div>
      </section>

      {/* Informasi Layanan & Akses Terpadu */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs text-xs">
        {/* Layanan 1: Akademik & Pembelajaran */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Layanan Akademik &amp; Modul</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Platform Pembelajaran Digital PKBM Celah Cahaya menyediakan modul resmi, audio TTS, dan uji kompetensi terpadu Paket B &amp; C.
            </p>
            <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] pt-1">
              Kurikulum Kesetaraan Dikmas
            </p>
          </div>
        </div>

        {/* Layanan 2: Informasi PPDB & Konsultasi */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Pusat Layanan &amp; PPDB</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {settings.telepon || '+62 821-1936-2454'}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Senin - Sabtu: 08.00 - 16.00 WIB (Konsultasi Pendaftaran &amp; Administrasi)
            </p>
          </div>
        </div>

        {/* Layanan 3: Administrasi & Data Terpadu */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Dukungan Sistem Data</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {settings.email || 'info@pkbmcelahcahaya.sch.id'}
            </p>
            <p className="text-amber-600 dark:text-amber-400 font-semibold text-[11px] pt-1">
              Sinkronisasi Cloud &amp; Verifikasi Berkas
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
