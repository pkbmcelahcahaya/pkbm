import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Bookmark,
  Clock,
  Download,
  Flame,
  Award,
  Bell,
  Sparkles,
  ArrowRight,
  User as UserIcon,
  KeyRound,
  FileText,
  Eye,
  Check,
  Video,
  Radio,
  Calendar,
  Layers,
  HelpCircle,
  Printer,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { User, Materi, MataPelajaran } from '../types';
import { storage } from '../services/storageService';
import { Breadcrumb } from './Breadcrumb';
import { TatapMukaSection } from './TatapMukaSection';
import { TugasSection } from './TugasSection';
import { UlanganSection } from './UlanganSection';
import { ModulQuizModal } from './ModulQuizModal';
import { TextToSpeechButton } from './common/TextToSpeechButton';
import { PrintPreviewModal } from './common/PrintPreviewModal';
import { DocumentPrintConfig } from '../utils/printDocTemplates';
import { LearningStreakCard } from './student/LearningStreakCard';
import { StudyGoalCard } from './student/StudyGoalCard';
import { RecentActivityWidget } from './student/RecentActivityWidget';
import { ModuleProgressBar } from './student/ModuleProgressBar';
import { useI18n } from '../services/i18n';

interface StudentDashboardProps {
  currentUser: User;
  onOpenPdf: (materi: Materi) => void;
  onBookmarkToggle: (materiId: string) => void;
  bookmarkedIds: string[];
  onProfileUpdate: (updated: User) => void;
  defaultMainTab?: string;
  onOpenQuizModalDirect?: (materi: Materi) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  onOpenPdf,
  onBookmarkToggle,
  bookmarkedIds,
  onProfileUpdate,
  defaultMainTab = 'DASHBOARD',
  onOpenQuizModalDirect
}) => {
  const { t } = useI18n();

  // Navigation tabs: 'DASHBOARD' | 'MATERI' | 'TATAP_MUKA' | 'TUGAS' | 'ULANGAN'
  const [mainTab, setMainTab] = useState<'DASHBOARD' | 'MATERI' | 'TATAP_MUKA' | 'TUGAS' | 'ULANGAN'>(
    (defaultMainTab as any) || 'DASHBOARD'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('SEMUA');
  const [sortBy, setSortBy] = useState<'TERBARU' | 'A-Z' | 'POPULER'>('TERBARU');
  const [materiSubTab, setMateriSubTab] = useState<'SEMUA' | 'BOOKMARK' | 'RIWAYAT'>('SEMUA');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showKtsPrint, setShowKtsPrint] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [activeQuizMateri, setActiveQuizMateri] = useState<Materi | null>(null);
  const [streakRefreshKey, setStreakRefreshKey] = useState(0);
  const [printReportConfig, setPrintReportConfig] = useState<DocumentPrintConfig | null>(null);

  // Retrieve isolated materials for this student's package (Paket B or Paket C)
  const allPaketMateri = useMemo(() => {
    return storage.getMateri('SISWA', currentUser.paket);
  }, [currentUser.paket]);

  const allMapel = useMemo(() => {
    return storage.getMapel().filter(m => !currentUser.paket || m.paket === currentUser.paket);
  }, [currentUser.paket]);

  const readingProgressList = useMemo(() => {
    return storage.getUserAllProgress(currentUser.id);
  }, [currentUser.id, streakRefreshKey]);

  // Recent 5 accessed modules
  const recentAccessedModules = useMemo(() => {
    return storage.getRecentAccessedModules(currentUser.id, 5);
  }, [currentUser.id, readingProgressList, streakRefreshKey]);

  // Weekly study goal data
  const studyGoalData = useMemo(() => {
    return storage.getWeeklyStudyGoal(currentUser.id);
  }, [currentUser.id, readingProgressList, streakRefreshKey]);

  const settings = useMemo(() => storage.getSettings(), []);

  // 2026 LMS entities for quick widget overview
  const ongoingTatapMuka = useMemo(() => {
    const list = storage.getTatapMuka('SISWA', currentUser.paket);
    return list.filter(tm => tm.status === 'BERLANGSUNG');
  }, [currentUser.paket]);

  const pendingTugasList = useMemo(() => {
    const list = storage.getTugas('SISWA', currentUser.paket);
    const mySubmissions = storage.getPengumpulanTugas(undefined, currentUser.id);
    return list.filter(t => !mySubmissions.some(s => s.tugas_id === t.id));
  }, [currentUser.paket, currentUser.id]);

  const activeUlanganList = useMemo(() => {
    const list = storage.getUlangan('SISWA', currentUser.paket);
    const myAttempts = storage.getUjianAttempts(undefined, currentUser.id);
    return list.filter(u => !myAttempts.some(a => a.ulangan_id === u.id && a.status === 'SELESAI'));
  }, [currentUser.paket, currentUser.id]);

  // Stats calculation
  const totalMateri = allPaketMateri.length;
  const completedMateriCount = readingProgressList.filter(r => r.completed || r.progress_percent >= 90).length;
  const inProgressCount = readingProgressList.length;
  const overallProgressPercent = totalMateri > 0 ? Math.min(100, Math.round((completedMateriCount / totalMateri) * 100)) : 0;

  // Learning Streak data for student
  const learningStreakData = useMemo(() => {
    return storage.getStudentLearningStreak(currentUser.id);
  }, [currentUser.id, readingProgressList, streakRefreshKey]);

  // Filtered materials
  const filteredMateri = useMemo(() => {
    let result = [...allPaketMateri];

    // Filter by Sub Tab
    if (materiSubTab === 'BOOKMARK') {
      result = result.filter(m => bookmarkedIds.includes(m.id));
    } else if (materiSubTab === 'RIWAYAT') {
      const readIds = readingProgressList.map(r => r.materi_id);
      result = result.filter(m => readIds.includes(m.id));
    }

    // Filter by Mapel
    if (selectedMapel !== 'SEMUA') {
      result = result.filter(m => m.mata_pelajaran.toLowerCase().includes(selectedMapel.toLowerCase()));
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        m =>
          m.judul.toLowerCase().includes(q) ||
          m.mata_pelajaran.toLowerCase().includes(q) ||
          m.deskripsi.toLowerCase().includes(q) ||
          (m.tingkatan && m.tingkatan.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'A-Z') {
      result.sort((a, b) => a.judul.localeCompare(b.judul));
    } else if (sortBy === 'POPULER') {
      result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    } else {
      result.sort((a, b) => b.urutan - a.urutan);
    }

    return result;
  }, [allPaketMateri, materiSubTab, selectedMapel, searchQuery, sortBy, bookmarkedIds, readingProgressList]);

  // Last read module
  const lastReadItem = useMemo(() => {
    if (readingProgressList.length === 0) return null;
    const sorted = [...readingProgressList].sort(
      (a, b) => new Date(b.last_read_at).getTime() - new Date(a.last_read_at).getTime()
    );
    const targetMateri = allPaketMateri.find(m => m.id === sorted[0].materi_id);
    return targetMateri ? { materi: targetMateri, progress: sorted[0] } : null;
  }, [readingProgressList, allPaketMateri]);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('Password minimal 6 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Konfirmasi password tidak cocok');
      return;
    }

    storage.updateUser(currentUser.id, { password: newPassword });
    onProfileUpdate({ ...currentUser, password: newPassword });
    setProfileSuccessMsg('Password berhasil diperbarui.');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setProfileSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Location Breadcrumb */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs px-4 py-2.5 flex items-center justify-between">
        <Breadcrumb
          homeLabel={t('nav.home', 'Portal Belajar')}
          onHomeClick={() => {
            setMainTab('DASHBOARD');
            setSelectedMapel('SEMUA');
          }}
          items={[
            {
              label: currentUser.paket || 'Kesetaraan',
              onClick: () => {
                setMainTab('MATERI');
                setSelectedMapel('SEMUA');
              }
            },
            {
              label:
                mainTab === 'DASHBOARD'
                  ? t('student.tab.dashboard', 'Ikhtisar Warga Belajar')
                  : mainTab === 'MATERI'
                  ? t('student.tab.materi', 'Modul Pembelajaran')
                  : mainTab === 'TATAP_MUKA'
                  ? t('student.tab.tatapmuka', 'Tatap Muka & Presensi')
                  : mainTab === 'TUGAS'
                  ? t('student.tab.tugas', 'Tugas & LKPD')
                  : t('student.tab.ulangan', 'Ujian & Asesmen'),
              onClick:
                selectedMapel !== 'SEMUA'
                  ? () => setSelectedMapel('SEMUA')
                  : undefined,
              active: selectedMapel === 'SEMUA'
            },
            ...(selectedMapel !== 'SEMUA'
              ? [
                  {
                    label: selectedMapel,
                    active: true
                  }
                ]
              : [])
          ]}
        />
      </div>

      {/* Announcement banner if enabled */}
      {settings.tampilkan_pengumuman && settings.pengumuman && (
        <aside aria-label="Pengumuman Penting" className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-950 dark:text-amber-200">
          <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold mr-1">Pengumuman PKBM:</span>
            <span>{settings.pengumuman}</span>
          </div>
        </aside>
      )}

      {/* Greeting & Student Profile Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white relative overflow-hidden shadow-xl border border-indigo-900/50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-20 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <img
                src={currentUser.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.nama}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-400/40 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 text-[10px] font-black rounded-md bg-amber-400 text-slate-950 uppercase shadow-md">
                {currentUser.paket}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 backdrop-blur-sm">
                  {currentUser.kelas || 'Warga Belajar Aktif'}
                </span>
                {currentUser.nisn && (
                  <span className="text-[11px] text-indigo-300 font-mono">
                    NISN: {currentUser.nisn}
                  </span>
                )}
                {/* Header Streak Indicator Badge */}
                <div
                  className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500/25 to-orange-500/25 border border-amber-400/40 text-amber-300 backdrop-blur-xs cursor-pointer hover:border-amber-400 transition-colors shadow-2xs"
                  onClick={() => setMainTab('DASHBOARD')}
                  title="Klik untuk melihat detail streak belajar"
                >
                  <Flame className={`w-3.5 h-3.5 ${learningStreakData.currentStreak > 0 ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-400'}`} />
                  <span className="text-xs font-black">
                    {learningStreakData.currentStreak} Hari Streak
                  </span>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white mt-1">
                {t('student.welcome', 'Selamat Datang')}, {currentUser.nama}!
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200 mt-1 flex flex-wrap items-center gap-2">
                <span>Pusat Kegiatan Belajar Masyarakat Celah Cahaya</span>
                <span>•</span>
                <span className="text-amber-300 font-bold">Akses Modul Resmi {currentUser.paket}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                const totalHours = Math.round((storage.getTotalStudyTimeSeconds(currentUser.id) / 3600) * 10) / 10;
                const config: DocumentPrintConfig = {
                  docType: 'LEARNING_REPORT',
                  title: 'LAPORAN HASIL DAN DURASI BELAJAR MANDIRI (LEARNING REPORT)',
                  subtitle: `Pusat Kegiatan Belajar Masyarakat (PKBM) Celah Cahaya • Tahun Ajaran 2026/2027`,
                  nomorSurat: `421.1/LR-${currentUser.id.slice(0, 6).toUpperCase()}/PKBM/2026`,
                  orientation: 'PORTRAIT',
                  data: {
                    studentName: currentUser.nama,
                    nisn: currentUser.nisn || '320501239841',
                    paket: currentUser.paket,
                    kelas: currentUser.kelas || 'Rombel Reguler A',
                    totalStudyHours: totalHours,
                    completedCount: completedMateriCount,
                    weeklyGoalHours: studyGoalData.weeklyGoalHours,
                    overallProgressPercent: overallProgressPercent,
                    modules: recentAccessedModules.length > 0 ? recentAccessedModules : allPaketMateri.slice(0, 6).map((m, i) => ({
                      materi_id: m.id,
                      judul: m.judul,
                      mata_pelajaran: m.mata_pelajaran,
                      paket: m.paket,
                      last_page: (i + 1) * 3,
                      total_pages: 24,
                      progress_percent: (i + 1) * 15,
                      completed: i === 0,
                      total_time_seconds: (i + 1) * 600,
                      studyTimeFormatted: `${(i + 1) * 10} mnt`
                    }))
                  }
                };
                setPrintReportConfig(config);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-xs font-black text-white transition-all flex items-center gap-2 cursor-pointer shadow-md"
              title="Unduh & Cetak Laporan Hasil Belajar (Learning Report)"
            >
              <FileText className="w-4 h-4" />
              <span>Unduh Learning Report</span>
            </button>

            <button
              type="button"
              onClick={() => setShowKtsPrint(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-xs font-black text-slate-950 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              title="Cetak & Simpan PDF Kartu Tanda Siswa Resmi PKBM Celah Cahaya"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Kartu Siswa (KTS)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold text-white transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              <span>{t('mob.account', 'Profil & Akun')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main LMS 2026 Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white dark:bg-slate-900 p-1.5 sm:p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs text-xs font-bold custom-scrollbar">
        {[
          { key: 'DASHBOARD', label: t('student.tab.dashboard', 'Ikhtisar'), icon: Layers },
          { key: 'MATERI', label: `${t('student.tab.materi', 'E-Modul')} (${totalMateri})`, icon: BookOpen },
          {
            key: 'TATAP_MUKA',
            label: `${t('student.tab.tatapmuka', 'Tatap Muka')} ${ongoingTatapMuka.length > 0 ? '🔴 LIVE' : ''}`,
            icon: Video
          },
          {
            key: 'TUGAS',
            label: `${t('student.tab.tugas', 'Tugas')} ${pendingTugasList.length > 0 ? `(${pendingTugasList.length})` : ''}`,
            icon: FileText
          },
          {
            key: 'ULANGAN',
            label: `${t('student.tab.ulangan', 'Ulangan')} ${activeUlanganList.length > 0 ? `(${activeUlanganList.length})` : ''}`,
            icon: Award
          }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = mainTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setMainTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: DASHBOARD OVERVIEW */}
      {mainTab === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* Live Google Meet Session Alert if any */}
          {ongoingTatapMuka.length > 0 && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Radio className="w-5 h-5 animate-pulse text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase bg-white text-rose-600 px-2 py-0.5 rounded">
                    Sedang Berlangsung Sekarang
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white mt-1">
                    {ongoingTatapMuka[0].judul} ({ongoingTatapMuka[0].mata_pelajaran})
                  </h3>
                  <p className="text-xs text-rose-100">
                    Tutor: {ongoingTatapMuka[0].tutor_nama} • {ongoingTatapMuka[0].jam_mulai} - {ongoingTatapMuka[0].jam_selesai} WIB
                  </p>
                </div>
              </div>

              <a
                href={ongoingTatapMuka[0].link_meet}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-white hover:bg-rose-50 text-rose-600 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>🔴 GABUNG KELAS LIVE</span>
              </a>
            </div>
          )}

          {/* Learning Streak Tracker Card */}
          <LearningStreakCard
            streakData={learningStreakData}
            onExploreMateri={() => {
              setMainTab('MATERI');
              setSelectedMapel('SEMUA');
            }}
            onCheckInToday={() => {
              storage.recordStudyActivity(currentUser.id);
              setStreakRefreshKey(prev => prev + 1);
            }}
          />

          {/* Interactive Learning Engagement Hub: Recent Activity & Weekly Study Goal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Activity Widget */}
            <RecentActivityWidget
              recentModules={recentAccessedModules}
              onOpenMateri={(materiId) => {
                const mat = allPaketMateri.find(m => m.id === materiId);
                if (mat) onOpenPdf(mat);
              }}
              allMateri={allPaketMateri}
            />

            {/* Weekly Study Goal Gauge Card */}
            <StudyGoalCard
              goalData={studyGoalData}
              onUpdateGoal={(hours) => {
                storage.setWeeklyStudyGoal(currentUser.id, hours);
                setStreakRefreshKey(prev => prev + 1);
              }}
            />
          </div>

          {/* Metrics & Progress Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div
              onClick={() => setMainTab('MATERI')}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3 sm:gap-4 cursor-pointer hover:border-indigo-400 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">Total Modul {currentUser.paket}</p>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                  {totalMateri} <span className="text-xs font-normal text-slate-400">Modul</span>
                </h4>
              </div>
            </div>

            <div
              onClick={() => setMainTab('TUGAS')}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3 sm:gap-4 cursor-pointer hover:border-indigo-400 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">Tugas Mandiri</p>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                  {pendingTugasList.length} <span className="text-xs font-normal text-slate-400">Tugas</span>
                </h4>
              </div>
            </div>

            <div
              onClick={() => setMainTab('ULANGAN')}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3 sm:gap-4 cursor-pointer hover:border-indigo-400 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">Ulangan Siap</p>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                  {activeUlanganList.length} <span className="text-xs font-normal text-slate-400">Ujian</span>
                </h4>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">Progress Belajar</p>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{overallProgressPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden relative">
                  <motion.div
                    key={`overall-progress-${overallProgressPercent}`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${overallProgressPercent}%` }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 rounded-full relative shadow-xs"
                  >
                    <div className="absolute inset-0 bg-white/25 rounded-full animate-pulse" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Resume Last Read Hero if available */}
          {lastReadItem && (
            <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">
                    Terakhir Dibaca • {lastReadItem.progress.progress_percent}% Selesai
                  </p>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {lastReadItem.materi.judul}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-slate-400">
                      Halaman {lastReadItem.progress.last_page} dari {lastReadItem.progress.total_pages}
                    </p>
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        key={`lastread-progress-${lastReadItem.progress.progress_percent}`}
                        initial={{ width: '0%' }}
                        animate={{ width: `${lastReadItem.progress.progress_percent}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full bg-amber-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TextToSpeechButton
                  text={`Modul ${lastReadItem.materi.mata_pelajaran}, ${lastReadItem.materi.judul}. ${lastReadItem.materi.deskripsi || ''}`}
                  title={lastReadItem.materi.judul}
                  variant="pill"
                  size="sm"
                />

                <button
                  type="button"
                  onClick={() => onOpenPdf(lastReadItem.materi)}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <span>Lanjutkan Membaca</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Quick Hub Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setMainTab('TATAP_MUKA')}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all cursor-pointer space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                  <Video className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Tatap Muka Online</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Akses jadwal video tatap muka Google Meet bersama para tutor.
              </p>
            </div>

            <div
              onClick={() => setMainTab('TUGAS')}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all cursor-pointer space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Tugas & Pengumpulan</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Kumpulkan lembar jawaban dan pantau perolehan nilai dari tutor.
              </p>
            </div>

            <div
              onClick={() => setMainTab('ULANGAN')}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all cursor-pointer space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Ulangan & Kuis Online</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Uji kemampuan materi dengan kuis interaktif berwaktu & penilaian otomatis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MATERI E-MODUL */}
      {mainTab === 'MATERI' && (
        <div className="space-y-5">
          {/* Main Section Header: Tabs, Search & Filters */}
          <div className="space-y-4 pt-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Sub-tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
                <button
                  type="button"
                  onClick={() => setMateriSubTab('SEMUA')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    materiSubTab === 'SEMUA'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Semua Modul ({allPaketMateri.length})
                </button>
                <button
                  type="button"
                  onClick={() => setMateriSubTab('BOOKMARK')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    materiSubTab === 'BOOKMARK'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Ditandai ({bookmarkedIds.length})
                </button>
                <button
                  type="button"
                  onClick={() => setMateriSubTab('RIWAYAT')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    materiSubTab === 'RIWAYAT'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Riwayat Baca ({readingProgressList.length})
                </button>
              </div>

              {/* Search & Sort */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[240px] flex-1 sm:flex-initial">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={t('catalog.searchPlaceholder', 'Cari materi pembelajaran...')}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="TERBARU">Urutan: Standar / Terbaru</option>
                  <option value="A-Z">Urutan: Judul A - Z</option>
                  <option value="POPULER">Urutan: Paling Sering Dibaca</option>
                </select>
              </div>
            </div>

            {/* Subject Filters Horizontal Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedMapel('SEMUA')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedMapel === 'SEMUA'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                Semua Mapel ({allPaketMateri.length})
              </button>
              {allMapel.map(mapel => {
                const count = allPaketMateri.filter(m =>
                  m.mata_pelajaran.toLowerCase().includes(mapel.nama_mata_pelajaran.toLowerCase())
                ).length;
                return (
                  <button
                    key={mapel.id}
                    type="button"
                    onClick={() => setSelectedMapel(mapel.nama_mata_pelajaran)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedMapel === mapel.nama_mata_pelajaran
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {mapel.nama_mata_pelajaran} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid of Materials */}
          {filteredMateri.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
                Tidak ada materi yang sesuai
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Silakan coba ubah kata kunci pencarian atau pilih mata pelajaran yang berbeda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredMateri.map(materi => {
                const isBookmarked = bookmarkedIds.includes(materi.id);
                const progress = readingProgressList.find(p => p.materi_id === materi.id);
                const percent = progress?.progress_percent || 0;
                const isCompleted = storage.isMateriCompleted(currentUser.id, materi.id);
                const quizProgress = storage.getModulProgressDetail(currentUser.id, materi.id);

                return (
                  <article
                    key={materi.id}
                    className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-2xs"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                            {materi.mata_pelajaran}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Selesai
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <TextToSpeechButton
                            text={`Modul ${materi.mata_pelajaran}: ${materi.judul}. ${materi.deskripsi || ''}`}
                            title={materi.judul}
                            variant="icon"
                            size="sm"
                          />

                          <button
                            type="button"
                            onClick={() => onBookmarkToggle(materi.id)}
                            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                              isBookmarked
                                ? 'text-purple-600 bg-purple-50 dark:bg-purple-950'
                                : 'text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                            title={isBookmarked ? 'Hapus bookmark' : 'Tandai materi'}
                          >
                            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                        {materi.judul}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed font-normal">
                        {materi.deskripsi || `Buku modul resmi ${materi.mata_pelajaran} ${materi.paket}.`}
                      </p>

                      {/* Visual Reading Progress Bar using Recharts */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <ModuleProgressBar
                          percent={percent}
                          isCompleted={isCompleted}
                        />

                        {/* Quiz 100 Status Badge */}
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="text-slate-500 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-indigo-500" />
                            Kuis 100:
                          </span>
                          {quizProgress.status_kelulusan === 'LULUS' ? (
                            <span className="font-black text-emerald-600 dark:text-emerald-400">
                              Nilai {quizProgress.highest_score} (LULUS)
                            </span>
                          ) : quizProgress.status_kelulusan === 'TIDAK_LULUS' ? (
                            <span className="font-bold text-rose-600 dark:text-rose-400">
                              Nilai {quizProgress.latest_score} (Remedial)
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">
                              Belum Kuis
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-850/60 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenPdf(materi)}
                          className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t('catalog.readNow', 'Baca Modul')}</span>
                        </button>

                        {materi.drive_url && (
                          <a
                            href={materi.drive_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Buka File Google Drive"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      {/* Direct 100-Question Quiz Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenQuizModalDirect) {
                            onOpenQuizModalDirect(materi);
                          } else {
                            setActiveQuizMateri(materi);
                          }
                        }}
                        className={`w-full py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                          quizProgress.status_kelulusan === 'LULUS'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                            : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 shadow-2xs'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>
                          {quizProgress.status_kelulusan === 'LULUS'
                            ? `Kuis 100 Soal (Skor: ${quizProgress.highest_score})`
                            : quizProgress.status_kelulusan === 'TIDAK_LULUS'
                            ? `Remedial Kuis 100 Soal (${quizProgress.latest_score})`
                            : 'Kerjakan Kuis 100 Soal'}
                        </span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: TATAP MUKA (GOOGLE MEET) */}
      {mainTab === 'TATAP_MUKA' && (
        <TatapMukaSection currentUser={currentUser} />
      )}

      {/* TAB CONTENT: TUGAS */}
      {mainTab === 'TUGAS' && (
        <TugasSection currentUser={currentUser} />
      )}

      {/* TAB CONTENT: ULANGAN */}
      {mainTab === 'ULANGAN' && (
        <UlanganSection currentUser={currentUser} />
      )}

      {/* PROFILE & PASSWORD MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-1">
              Profil Warga Belajar
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Informasi data akun dan pengaturan kata sandi pembelajaran Anda.
            </p>

            {profileSuccessMsg && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs space-y-2 mb-4">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Nama Lengkap:</span>
                <span className="font-bold">{currentUser.nama}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Username:</span>
                <span className="font-mono font-bold">{currentUser.username}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Program / Paket:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{currentUser.paket}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Kelas / Rombel:</span>
                <span className="font-semibold">{currentUser.kelas}</span>
              </div>
              {currentUser.nisn && (
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">NISN:</span>
                  <span className="font-mono font-semibold">{currentUser.nisn}</span>
                </div>
              )}
              {currentUser.nik && (
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">NIK (KTP/KK):</span>
                  <span className="font-mono">{currentUser.nik}</span>
                </div>
              )}
              {currentUser.tempat_lahir && (
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Tempat, Tgl Lahir:</span>
                  <span>{currentUser.tempat_lahir}, {currentUser.tanggal_lahir || '-'}</span>
                </div>
              )}
              {currentUser.alamat && (
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Alamat:</span>
                  <span className="text-right max-w-[65%]">{currentUser.alamat} {currentUser.kelurahan ? `, ${currentUser.kelurahan}` : ''} {currentUser.kecamatan ? `, ${currentUser.kecamatan}` : ''}</span>
                </div>
              )}
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 pt-1">
                Ganti Kata Sandi (Password)
              </h4>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                  Password Baru (Min 6 Karakter):
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                  Konfirmasi Password Baru:
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Simpan Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KTS Print Modal */}
      {showKtsPrint && (
        <PrintPreviewModal
          isOpen={showKtsPrint}
          onClose={() => setShowKtsPrint(false)}
          config={{
            docType: 'KARTU_PELAJAR',
            title: 'KARTU TANDA SISWA (KTS) ELEKTRONIK',
            subtitle: 'Pusat Kegiatan Belajar Masyarakat (PKBM) Celah Cahaya',
            nomorSurat: `421.1/KTS-${currentUser.id.slice(0, 6).toUpperCase()}/PKBM/2026`,
            data: currentUser,
            orientation: 'PORTRAIT'
          }}
        />
      )}

      {/* Learning Report Print / PDF Modal */}
      {printReportConfig && (
        <PrintPreviewModal
          isOpen={!!printReportConfig}
          onClose={() => setPrintReportConfig(null)}
          config={printReportConfig}
        />
      )}

      {/* 100-Question Curriculum Module Quiz Modal */}
      {activeQuizMateri && (
        <ModulQuizModal
          materi={activeQuizMateri}
          currentUser={currentUser}
          onClose={() => setActiveQuizMateri(null)}
          onQuizCompleted={() => {
            // State will refresh on next render via storage
          }}
        />
      )}
    </div>
  );
};
