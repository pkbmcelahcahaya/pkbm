import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  LogIn,
  LogOut,
  Moon,
  Sun,
  Shield,
  GraduationCap,
  Users,
  HardDrive,
  FileCode,
  Sparkles,
  ChevronDown,
  User as UserIcon,
  HelpCircle,
  FolderGit2,
  Building2,
  BookMarked,
  Layers,
  Globe
} from 'lucide-react';
import { User, Materi, PaketType, PendaftaranWargaBelajar } from './types';
import { storage } from './services/storageService';
import { MASTER_LEMBAGA, ALAMAT_LENGKAP_LEMBAGA } from './data/lembagaConfig';
import { LogoPKBM } from './components/LogoPKBM';
import { PublicHome } from './components/PublicHome';
import { StudentDashboard } from './components/StudentDashboard';
import { TutorDashboard } from './components/TutorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { ProfilLembagaModal } from './components/ProfilLembagaModal';
import { PanduanPenggunaModal } from './components/PanduanPenggunaModal';
import { KurikulumDashboard } from './components/KurikulumDashboard';
import { NotificationCenter } from './components/NotificationCenter';
import { ModulQuizModal } from './components/ModulQuizModal';
import { RegistrationForm } from './components/RegistrationForm';
import { CekStatusModal } from './components/CekStatusModal';
import { Toast, ToastMessage } from './components/Toast';
import { StatusSinkronisasi } from './components/StatusSinkronisasi';
import { DataSyncModal } from './components/common/DataSyncModal';
import { LanguageProvider, useI18n } from './services/i18n';
import { LanguageSelector } from './components/common/LanguageSelector';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { FloatingTtsPlayer } from './components/common/FloatingTtsPlayer';

function AppContent() {
  const { t } = useI18n();
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [authLockNotice, setAuthLockNotice] = useState<string | undefined>(undefined);
  const [pendingMateriToOpen, setPendingMateriToOpen] = useState<Materi | null>(null);
  const [activeQuizModalMateri, setActiveQuizModalMateri] = useState<Materi | null>(null);

  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [registrationPaket, setRegistrationPaket] = useState<PaketType>('PAKET B');
  const [isCekStatusOpen, setIsCekStatusOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  const [isProfilModalOpen, setIsProfilModalOpen] = useState(false);
  const [isPanduanModalOpen, setIsPanduanModalOpen] = useState(false);
  const [isKurikulumViewOpen, setIsKurikulumViewOpen] = useState(false);
  const [panduanInitialRole, setPanduanInitialRole] = useState<'SISWA' | 'TUTOR' | 'ADMIN' | 'BANTUAN'>('SISWA');

  const [activePdfMateri, setActivePdfMateri] = useState<Materi | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('pkbm_theme') === 'dark';
  });
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const user = storage.getCurrentUser();
    return storage.getBookmarkedMateriIds(user?.id);
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Refresh bookmarks when user changes
  useEffect(() => {
    if (currentUser) {
      setBookmarkedIds(storage.getBookmarkedMateriIds(currentUser.id));
    } else {
      setBookmarkedIds([]);
    }
  }, [currentUser]);

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pkbm_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pkbm_theme', 'light');
    }
  }, [darkMode]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleOpenAuthModal = (tab: 'LOGIN' | 'REGISTER' = 'LOGIN', targetMateri?: Materi) => {
    setAuthInitialTab(tab);
    setPendingMateriToOpen(targetMateri || null);
    if (targetMateri) {
      setAuthLockNotice(`Modul "${targetMateri.judul}" (${targetMateri.paket}) terkunci. Silakan masuk atau daftar Warga Belajar untuk membuka modul ini.`);
    } else {
      setAuthLockNotice(undefined);
    }
    setIsAuthModalOpen(true);
  };

  const handleOpenPanduan = (role?: 'SISWA' | 'TUTOR' | 'ADMIN' | 'BANTUAN') => {
    if (role) {
      setPanduanInitialRole(role);
    } else if (currentUser?.role === 'TUTOR') {
      setPanduanInitialRole('TUTOR');
    } else if (currentUser?.role === 'ADMIN') {
      setPanduanInitialRole('ADMIN');
    } else {
      setPanduanInitialRole('SISWA');
    }
    setIsPanduanModalOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    setBookmarkedIds(storage.getBookmarkedMateriIds(user.id));
    addToast('success', `Selamat Datang, ${user.nama}!`, `Berhasil masuk sebagai ${user.role} (${user.paket || 'LMS PKBM'})`);

    // If there was a pending module to open
    if (pendingMateriToOpen) {
      const target = pendingMateriToOpen;
      setPendingMateriToOpen(null);
      setAuthLockNotice(undefined);

      if (user.role === 'ADMIN' || user.role === 'TUTOR' || user.paket === target.paket) {
        setTimeout(() => {
          setActivePdfMateri(target);
        }, 150);
      } else {
        addToast(
          'info',
          `Akses Modul ${target.paket}`,
          `Akun Anda terdaftar di ${user.paket}. Modul ${target.judul} adalah untuk ${target.paket}. Modul yang tersedia di dashboard Anda sudah disesuaikan secara otomatis.`
        );
      }
    }
  };

  const handleLogout = () => {
    const userName = currentUser?.nama || 'Pengguna';
    storage.logout();
    setCurrentUser(null);
    setBookmarkedIds([]);
    setActivePdfMateri(null);
    setPendingMateriToOpen(null);
    addToast('info', 'Sampai Jumpa', `${userName} telah berhasil keluar dari sistem.`);
  };

  const handleBookmarkToggle = (materiId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const updated = storage.toggleBookmark(currentUser.id, materiId);
    setBookmarkedIds(updated);
    if (updated.includes(materiId)) {
      addToast('success', 'Tersimpan', 'Modul berhasil ditandai ke daftar favorit Anda.');
    } else {
      addToast('info', 'Dihapus', 'Modul dihapus dari daftar tersimpan.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans pb-20 md:pb-0">
      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-16 py-2 flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
          {/* Official Logo & Brand Identity */}
          <div
            onClick={() => setIsProfilModalOpen(true)}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-w-0 flex-1 sm:flex-initial select-none"
            title="Klik untuk melihat Profil Resmi Lembaga"
          >
            <LogoPKBM size="sm" imageClassName="group-hover:scale-105 transition-transform shrink-0" />
            <div className="flex flex-col justify-center min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-black text-xs sm:text-sm md:text-base tracking-tight text-slate-900 dark:text-white leading-tight uppercase truncate">
                  PKBM CELAH CAHAYA
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider hidden sm:inline-block shadow-2xs shrink-0">
                  NPSN: {MASTER_LEMBAGA.npsn}
                </span>
              </div>
              <div className="flex flex-col mt-0.5 min-w-0">
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight truncate">
                  Sistem Pembelajaran Digital 2026
                </p>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 min-w-0">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider truncate">
                    Paket B
                  </span>
                  <span className="text-slate-300 dark:text-slate-700 text-[10px] select-none shrink-0">•</span>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider truncate">
                    Paket C
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Multilingual Selector (9 Languages) */}
            <LanguageSelector />

            {/* Status Sinkronisasi Google Sheets - STRICTLY ADMIN ONLY */}
            {currentUser?.role === 'ADMIN' && (
              <StatusSinkronisasi
                isAdmin={true}
                onOpenSyncModal={() => setIsSyncModalOpen(true)}
                onSyncComplete={(msg) => addToast('success', 'Sinkronisasi Google Sheets', msg)}
              />
            )}

            {/* Kurikulum Kesetaraan Menu Button */}
            <button
              type="button"
              onClick={() => setIsKurikulumViewOpen(prev => !prev)}
              className={`hidden md:flex px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors items-center gap-1.5 cursor-pointer ${
                isKurikulumViewOpen
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:lg:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
              title="Kurikulum Kesetaraan Paket B & C PKBM Celah Cahaya"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden lg:inline">{t('nav.curriculum', 'Kurikulum')}</span>
            </button>

            {/* Profil Lembaga Menu Button */}
            <button
              type="button"
              onClick={() => setIsProfilModalOpen(true)}
              className="hidden sm:flex px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:lg:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors items-center gap-1.5 cursor-pointer"
              title="Profil PKBM Celah Cahaya"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden lg:inline">{t('nav.profile', 'Profil')}</span>
            </button>

            {/* Panduan Pengguna Menu Button */}
            <button
              type="button"
              onClick={() => handleOpenPanduan()}
              className="hidden sm:flex px-2.5 sm:px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:lg:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors items-center gap-1.5 cursor-pointer"
              title="Buku Panduan Pengguna Warga Belajar & Tutor"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden lg:inline">{t('nav.guide', 'Panduan')}</span>
            </button>

            {/* PPDB 2026 Direct Registration Button */}
            {!currentUser && (
              <button
                type="button"
                onClick={() => {
                  setRegistrationPaket('PAKET B');
                  setIsRegistrationOpen(true);
                }}
                className="hidden lg:flex px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition-colors items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>{t('nav.ppdb', 'PPDB 2026')}</span>
              </button>
            )}

            {/* In-App Notification Center */}
            {currentUser && <NotificationCenter currentUser={currentUser} />}

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 sm:p-2 min-h-12 sm:min-h-0 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:lg:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
              title={darkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Auth Buttons / User Avatar */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={currentUser.nama}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                  />
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {currentUser.nama}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {currentUser.role} {currentUser.paket ? `• ${currentUser.paket}` : ''}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-3 sm:p-2 min-h-12 sm:min-h-0 rounded-xl text-rose-500 hover:lg:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer flex items-center justify-center"
                  title="Keluar (Logout)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRegistrationPaket('PAKET B');
                    setIsRegistrationOpen(true);
                  }}
                  className="hidden md:flex px-3 py-1.5 rounded-xl text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:lg:bg-indigo-100 dark:hover:bg-indigo-900 font-bold text-xs transition-colors items-center gap-1 cursor-pointer border border-indigo-200 dark:border-indigo-800"
                >
                  <span>PPDB</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAuthModal('LOGIN')}
                  className="hidden sm:flex p-3 sm:px-4 sm:py-2 min-h-12 sm:min-h-0 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-2xs items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t('nav.login', 'Masuk')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isKurikulumViewOpen ? (
          <KurikulumDashboard
            currentUser={currentUser}
            onBack={() => setIsKurikulumViewOpen(false)}
            onPreviewPdf={(title, url) =>
              setActivePdfMateri({
                id: 'doc_' + Date.now(),
                judul: title,
                drive_id: '',
                tipe: 'PDF',
                paket: 'PAKET B',
                kelas: '',
                mata_pelajaran: '',
                link_drive: url
              } as any)
            }
            onNavigateToLms={() => {
              setIsKurikulumViewOpen(false);
            }}
          />
        ) : (
          <>
            {!currentUser && (
              <PublicHome
                onOpenLogin={(tab, targetMateri) => handleOpenAuthModal(tab || 'LOGIN', targetMateri)}
                onOpenPendaftaran={(paket) => {
                  setRegistrationPaket(paket || 'PAKET B');
                  setIsRegistrationOpen(true);
                }}
                onOpenCekStatus={() => setIsCekStatusOpen(true)}
                onOpenProfil={() => setIsProfilModalOpen(true)}
                onOpenPanduan={(role) => handleOpenPanduan(role)}
                onOpenKurikulum={() => setIsKurikulumViewOpen(true)}
              />
            )}

            {currentUser?.role === 'SISWA' && (
              <StudentDashboard
                currentUser={currentUser}
                onOpenPdf={(materi) => setActivePdfMateri(materi)}
                onBookmarkToggle={handleBookmarkToggle}
                bookmarkedIds={bookmarkedIds}
                onProfileUpdate={(updated) => setCurrentUser(updated)}
              />
            )}

            {currentUser?.role === 'TUTOR' && (
              <TutorDashboard
                currentUser={currentUser}
                onOpenPdf={(materi) => setActivePdfMateri(materi)}
              />
            )}

            {currentUser?.role === 'ADMIN' && (
              <AdminDashboard
                currentUser={currentUser}
                onOpenPdf={(materi) => setActivePdfMateri(materi)}
              />
            )}
          </>
        )}
      </main>

      {/* Official Master Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            {/* Logo & Full Institutional Address */}
            <div className="flex items-start gap-3.5 max-w-2xl">
              <LogoPKBM size="md" imageClassName="bg-white p-0.5 rounded-lg" />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    {MASTER_LEMBAGA.nama}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    NPSN: {MASTER_LEMBAGA.npsn}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Status: {MASTER_LEMBAGA.status} ({MASTER_LEMBAGA.jenjang})
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {ALAMAT_LENGKAP_LEMBAGA}
                </p>
                <p className="text-[11px] text-slate-500">
                  Program/Layanan: <strong className="text-slate-700 dark:text-slate-200">Paket B & Paket C</strong> • SK Pendirian & Operasional: <span className="font-mono text-slate-700 dark:text-slate-300">{MASTER_LEMBAGA.sk_operasional} ({MASTER_LEMBAGA.tanggal_sk_operasional_lengkap})</span>
                </p>
              </div>
            </div>

            {/* Quick Navigation Action Links */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-semibold shrink-0">
              <button
                type="button"
                onClick={() => setIsKurikulumViewOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 transition-colors cursor-pointer font-bold"
              >
                {t('nav.curriculum', 'Kurikulum Kesetaraan')}
              </button>

              <button
                type="button"
                onClick={() => setIsProfilModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                {t('nav.profile', 'Profil Lembaga')}
              </button>

              <button
                type="button"
                onClick={() => handleOpenPanduan()}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                {t('nav.guide', 'Panduan Pengguna')}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
            <p>
              {MASTER_LEMBAGA.copyright}
            </p>
            <div className="flex items-center gap-4">
              <span>Kurikulum Kesetaraan Dikmas Kemendikbudristek</span>
              <span>•</span>
              <span>Google Workspace Cloud Ecosystem</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modern Mobile Bottom Navigation (Visible on Small Screens) */}
      <MobileBottomNav
        currentUser={currentUser}
        onOpenLogin={() => handleOpenAuthModal('LOGIN')}
        onOpenPendaftaran={() => {
          setRegistrationPaket('PAKET B');
          setIsRegistrationOpen(true);
        }}
        onOpenProfil={() => setIsProfilModalOpen(true)}
        onOpenPanduan={() => handleOpenPanduan()}
        onOpenKurikulum={() => setIsKurikulumViewOpen(true)}
      />

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingMateriToOpen(null);
          setAuthLockNotice(undefined);
        }}
        onLoginSuccess={handleLoginSuccess}
        lockNotice={authLockNotice}
        initialTab={authInitialTab}
        onOpenPanduan={() => {
          setIsAuthModalOpen(false);
          handleOpenPanduan('SISWA');
        }}
        onOpenProfil={() => {
          setIsAuthModalOpen(false);
          setIsProfilModalOpen(true);
        }}
      />

      <ProfilLembagaModal
        isOpen={isProfilModalOpen}
        onClose={() => setIsProfilModalOpen(false)}
        onOpenPendaftaran={() => {
          setRegistrationPaket('PAKET B');
          setIsRegistrationOpen(true);
        }}
      />

      <PanduanPenggunaModal
        isOpen={isPanduanModalOpen}
        onClose={() => setIsPanduanModalOpen(false)}
        initialRole={panduanInitialRole}
      />

      <PdfViewerModal
        materi={activePdfMateri}
        currentUser={currentUser}
        onClose={() => setActivePdfMateri(null)}
        onBookmarkToggle={(materiId) => {
          if (currentUser) {
            const updated = storage.toggleBookmark(currentUser.id, materiId);
            setBookmarkedIds(updated);
          }
        }}
        isBookmarked={activePdfMateri ? bookmarkedIds.includes(activePdfMateri.id) : false}
        onOpenQuiz={(materi) => {
          setActivePdfMateri(null);
          setActiveQuizModalMateri(materi);
        }}
      />

      {/* Global Modul Quiz Modal */}
      {activeQuizModalMateri && currentUser && (
        <ModulQuizModal
          materi={activeQuizModalMateri}
          currentUser={currentUser}
          onClose={() => setActiveQuizModalMateri(null)}
          onQuizCompleted={(attempt) => {
            addToast(
              attempt.status_kelulusan === 'LULUS' ? 'success' : 'info',
              `Kuis 100 Soal Selesai: Nilai ${attempt.nilai}/100`,
              `Hasil kuis modul ${attempt.materi_judul} berhasil disimpan dan dikirim ke Tutor.`
            );
          }}
        />
      )}

      <RegistrationForm
        isOpen={isRegistrationOpen}
        initialPaket={registrationPaket}
        onClose={() => setIsRegistrationOpen(false)}
        onSuccess={(record) => {
          addToast(
            'success',
            'Pendaftaran Berhasil Terkirim!',
            `Nomor Pendaftaran Anda: ${record.nomor_pendaftaran}. Simpan nomor ini untuk memantau status verifikasi berkas Dapodik.`
          );
        }}
      />

      <CekStatusModal
        isOpen={isCekStatusOpen}
        onClose={() => setIsCekStatusOpen(false)}
        onOpenFormulir={(paket) => {
          setIsCekStatusOpen(false);
          setRegistrationPaket(paket || 'PAKET B');
          setIsRegistrationOpen(true);
        }}
      />

      {/* Centralized Data Sync Hub Modal - STRICTLY ADMIN ONLY */}
      {isSyncModalOpen && currentUser?.role === 'ADMIN' && (
        <DataSyncModal
          isOpen={isSyncModalOpen}
          onClose={() => setIsSyncModalOpen(false)}
          currentUser={currentUser}
        />
      )}

      {/* Floating Text-to-Speech Control Panel */}
      <FloatingTtsPlayer />

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
