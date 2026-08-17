import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Clock,
  FileText,
  Award,
  Sparkles,
  Type,
  ListOrdered,
  Share2,
  Check,
  RotateCcw,
  Focus,
  PanelLeft,
  Eye,
  EyeOff,
  Gauge,
  Volume2,
  Play,
  Pause,
  Timer,
  MessageSquare,
  GraduationCap
} from 'lucide-react';
import { Materi, User } from '../types';
import { storage } from '../services/storageService';
import { curriculumCache } from '../services/curriculumCacheService';
import { discussionService } from '../services/discussionService';
import { MateriDiscussionSection } from './discussion/MateriDiscussionSection';
import { TanyaTutorModal } from './discussion/TanyaTutorModal';
import { getAssignedTutorForMateri, TutorMasterInfo } from '../data/tutorData';
import confetti from 'canvas-confetti';
import { useI18n } from '../services/i18n';
import { TextToSpeechButton } from './common/TextToSpeechButton';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface PdfViewerModalProps {
  materi: Materi | null;
  currentUser: User | null;
  onClose: () => void;
  onBookmarkToggle?: (materiId: string) => void;
  isBookmarked?: boolean;
  onOpenQuiz?: (materi: Materi) => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  materi,
  currentUser,
  onClose,
  onBookmarkToggle,
  isBookmarked = false,
  onOpenQuiz
}) => {
  const { t } = useI18n();
  const {
    isPlaying: isTtsPlaying,
    isPaused: isTtsPaused,
    rate: ttsRate,
    setRate: setTtsRate,
    speak: speakTts,
    pause: pauseTts,
    resume: resumeTts,
    stop: stopTts
  } = useTextToSpeech();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(24);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'reader' | 'drive'>('reader');
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [sidebarTab, setSidebarTab] = useState<'toc' | 'discussion'>('toc');
  const [discussionCount, setDiscussionCount] = useState<number>(0);
  const [showSpeedSelector, setShowSpeedSelector] = useState<boolean>(false);
  const [isCompletionDismissed, setIsCompletionDismissed] = useState<boolean>(false);
  const [isTanyaTutorOpen, setIsTanyaTutorOpen] = useState<boolean>(false);

  // Assigned tutor lookup for the current module
  const assignedTutor: TutorMasterInfo = useMemo(() => {
    return getAssignedTutorForMateri(materi);
  }, [materi]);

  // Sync discussion comments count in real-time
  useEffect(() => {
    if (!materi) return;
    const updateCount = () => {
      const list = discussionService.getComments(materi.id);
      setDiscussionCount(list.length);
    };
    updateCount();
    const unsub = discussionService.subscribe(updateCount);
    return () => unsub();
  }, [materi?.id]);

  const modalContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Speed preset options
  const ttsSpeedPresets = [
    { label: '0.75×', name: 'Lambat', value: 0.75 },
    { label: '1×', name: 'Normal', value: 1.0 },
    { label: '1.25×', name: 'Cepat', value: 1.25 },
    { label: '1.5×', name: 'Sangat Cepat', value: 1.5 }
  ];

  // Exit focus mode with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        e.preventDefault();
        setIsFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  // Track scroll position in reader content view
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      setScrollProgress(100);
    } else {
      const pct = Math.min(100, Math.max(0, Math.round((scrollTop / maxScroll) * 100)));
      setScrollProgress(pct);
    }
  };

  // Reset scroll and recompute on page change or mode change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      setScrollProgress(0);
      setIsCompletionDismissed(false);
    }
  }, [currentPage, materi?.id, viewMode]);

  // Dynamic study pace based on scroll progress and engagement
  const studyPaceInfo = useMemo(() => {
    if (scrollProgress === 0) {
      return {
        label: 'Mulai Membaca',
        color: 'text-slate-600 dark:text-slate-300',
        badgeBg: 'bg-slate-100 dark:bg-slate-800'
      };
    }
    if (scrollProgress < 30) {
      return {
        label: 'Memahami Konsep Awal',
        color: 'text-indigo-600 dark:text-indigo-400',
        badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60'
      };
    }
    if (scrollProgress < 75) {
      return {
        label: 'Kecepatan Belajar Stabil',
        color: 'text-amber-600 dark:text-amber-400',
        badgeBg: 'bg-amber-50 dark:bg-amber-950/60'
      };
    }
    if (scrollProgress < 100) {
      return {
        label: 'Mendekati Akhir Materi',
        color: 'text-blue-600 dark:text-blue-400',
        badgeBg: 'bg-blue-50 dark:bg-blue-950/60'
      };
    }
    return {
      label: 'Modul Selesai Dibaca',
      color: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60'
    };
  }, [scrollProgress]);

  const currentPageSectionTitle =
    currentPage === 1 ? 'Pendahuluan & Capaian Pembelajaran (CP)' :
    currentPage === 2 ? 'Konsep Teori & Landasan Keilmuan' :
    currentPage === 3 ? 'Pembahasan Mendalam & Fakta Esensial' :
    currentPage === 4 ? 'Studi Kasus Kontekstual & Lingkungan Hidup' :
    currentPage === 5 ? 'Penerapan Praktis & Pemecahan Masalah' :
    `Lembar Aktivitas Mandiri & Eksplorasi Warga Belajar Bagian ${currentPage}`;

  const currentFullPageSpeechText = materi
    ? `Modul ${materi.mata_pelajaran}, ${materi.judul}, ${materi.paket}. Halaman ${currentPage} dari ${totalPages}. Tujuan Pembelajaran: ${materi.deskripsi || ''}. Bagian ${currentPageSectionTitle}. Dalam modul ${materi.judul}, warga belajar diarahkan untuk memahami kompetensi dasar secara mendalam melalui pendekatan mandiri dan terbimbing. Sesuai dengan pedoman kurikulum kesetaraan Kementerian Pendidikan Dasar dan Menengah, pembelajaran kesetaraan memadukan literasi akademis teoritis dan keterampilan aplikatif sehari-hari. Poin Kunci: Mengidentifikasi fakta dan data esensial, mengembangkan penalaran kritis, dan melatih penyusunan argumen terstruktur.`
    : '';

  // Load previous reading progress and automatically cache module for offline access
  useEffect(() => {
    if (currentUser && materi) {
      // Auto cache module for offline reading availability
      curriculumCache.cacheModule(materi);

      const saved = storage.getReadingProgress(currentUser.id, materi.id);
      if (saved) {
        setCurrentPage(saved.last_page || 1);
        setTotalPages(saved.total_pages || 24);
      } else {
        setCurrentPage(1);
        setTotalPages(24);
      }

      setIsCompleted(storage.isMateriCompleted(currentUser.id, materi.id));

      // Record view count and initial activity
      storage.incrementView(materi.id);
      storage.recordActivity({
        user_id: currentUser.id,
        nama: currentUser.nama,
        role: currentUser.role,
        aktivitas: `Membuka Modul: ${materi.judul}`,
        materi_id: materi.id,
        materi_judul: materi.judul,
        paket: materi.paket
      });
    }
  }, [materi?.id, currentUser?.id]);

  // Handle Mark Complete & Open 100-Question Quiz
  const handleMarkCompleteAndStartQuiz = () => {
    if (!currentUser || !materi) return;
    storage.markMateriCompleted(currentUser.id, materi.id);
    setIsCompleted(true);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (onOpenQuiz) {
      onOpenQuiz(materi);
    }
  };

  // Session-Based Study Timer: calculates study duration for this active session (HH:MM:SS) and records to student profile
  useEffect(() => {
    if (!materi || !currentUser) return;
    let accumulated = 0;
    const timer = setInterval(() => {
      setSessionSeconds(prev => prev + 1);
      accumulated += 1;
      // Record periodic chunks every 10 seconds
      if (accumulated >= 10) {
        storage.recordStudyTime(currentUser.id, materi.id, accumulated);
        accumulated = 0;
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      if (accumulated > 0) {
        storage.recordStudyTime(currentUser.id, materi.id, accumulated);
      }
    };
  }, [materi?.id, currentUser?.id]);

  // Format session study timer as 00:15:42 (HH:MM:SS)
  const formatSessionTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  };

  // Save reading progress on page change
  useEffect(() => {
    if (currentUser && materi) {
      storage.saveReadingProgress(currentUser.id, materi.id, currentPage, totalPages);

      const percent = Math.round((currentPage / totalPages) * 100);
      if (percent >= 90 && !hasCelebrated) {
        setHasCelebrated(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  }, [currentPage, totalPages, currentUser?.id, materi?.id, hasCelebrated]);

  if (!materi) return null;

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      modalContainerRef.current?.requestFullscreen().catch(err => {
        console.warn('Fullscreen request failed:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => {
        console.warn('Exit fullscreen failed:', err);
      });
      setIsFullscreen(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleDownload = () => {
    storage.incrementDownload(materi.id);
    if (currentUser) {
      storage.recordActivity({
        user_id: currentUser.id,
        nama: currentUser.nama,
        role: currentUser.role,
        aktivitas: `Mengunduh PDF Modul: ${materi.judul}`,
        materi_id: materi.id,
        paket: materi.paket
      });
    }
    window.open(materi.drive_url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPercent = Math.min(100, Math.round((currentPage / totalPages) * 100));

  const tableOfContents = [
    { page: 1, title: 'Bab 1: Pendahuluan & Capaian Pembelajaran' },
    { page: 4, title: 'Bab 2: Konsep Dasar & Teori Esensial' },
    { page: 9, title: 'Bab 3: Analisis Kontekstual & Studi Kasus' },
    { page: 15, title: 'Bab 4: Penerapan & Latihan Praktis' },
    { page: 20, title: 'Bab 5: Rangkuman & Lembar Kerja Mandiri' },
    { page: 24, title: 'Bab 6: Uji Kompetensi & Kuis 100 Soal' },
  ];

  return (
    <div
      id="pdf-viewer-overlay"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-3 md:p-6 animate-in fade-in-50 duration-200"
    >
      <div
        ref={modalContainerRef}
        className="bg-white dark:bg-slate-900 w-full h-full max-w-6xl sm:max-h-[94vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 relative"
      >
        {/* Top Header Bar with Smooth Slide-In / Slide-Out Animation for Focus Mode */}
        <AnimatePresence initial={false}>
          {!isFocusMode && (
            <motion.div
              key="main-top-header"
              initial={{ height: 0, opacity: 0, y: -25 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -25 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden bg-slate-900 dark:bg-slate-950 border-b border-slate-800 shrink-0 z-30"
            >
              <div className="px-4 sm:px-6 py-3 text-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/30 text-indigo-300 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        materi.paket === 'PAKET B' ? 'bg-amber-400 text-slate-950' : 'bg-indigo-500 text-white'
                      }`}>
                        {materi.paket}
                      </span>
                      <span className="text-xs text-slate-300 font-medium truncate">
                        {materi.mata_pelajaran} {materi.tingkatan ? `• ${materi.tingkatan}` : ''}
                      </span>
                    </div>
                    <h2 className="text-xs sm:text-sm md:text-base font-bold text-white truncate mt-0.5">
                      {materi.judul}
                    </h2>
                  </div>
                </div>

                {/* Action buttons on top right */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* Focus Mode Toggle Button */}
                  <button
                    id="btn-toggle-focus-mode"
                    onClick={() => setIsFocusMode(true)}
                    title="Aktifkan Mode Fokus: Sembunyikan Header & Bilah Samping untuk Belajar Tanpa Distraksi"
                    className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold border border-slate-700/80 cursor-pointer shadow-2xs hover:border-amber-400/50"
                  >
                    <Focus className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Mode Fokus</span>
                  </button>

                  {/* 100-Question Quiz Button */}
                  <button
                    id="btn-open-modul-quiz"
                    onClick={handleMarkCompleteAndStartQuiz}
                    title="Kerjakan Kuis Evaluasi 100 Soal Modul Ini"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400/40'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span className="hidden sm:inline">Kuis 100 Soal</span>
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />}
                  </button>

                  {onBookmarkToggle && (
                    <button
                      id="btn-bookmark-materi"
                      onClick={() => onBookmarkToggle(materi.id)}
                      title={isBookmarked ? 'Hapus Bookmark' : 'Simpan ke Bookmark'}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  )}

                  <button
                    id="btn-download-materi"
                    onClick={handleDownload}
                    title="Unduh PDF dari Google Drive"
                    className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white transition-all hidden sm:flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span className="hidden md:inline">{materi.ukuran_file}</span>
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-all cursor-pointer hidden sm:block"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>

                  <button
                    id="btn-close-pdf-modal"
                    onClick={onClose}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all ml-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Focus Mode HUD (Slide-In Distraction-Free Bar when Focus Mode is Active) */}
        <AnimatePresence initial={false}>
          {isFocusMode && (
            <motion.div
              key="focus-mode-hud"
              initial={{ height: 0, opacity: 0, y: -25 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -25 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden bg-slate-950/95 backdrop-blur-md border-b border-amber-400/30 text-white shrink-0 z-30 shadow-md"
            >
              <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black flex items-center gap-1.5 shrink-0 shadow-xs">
                    <Focus className="w-3.5 h-3.5 text-slate-950" />
                    <span>Mode Fokus</span>
                  </div>
                  
                  {/* Session Study Timer in Focus Mode */}
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-amber-300 font-mono font-bold" title="Durasi Belajar Sesi Ini (Study Time)">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{formatSessionTimer(sessionSeconds)}</span>
                  </div>

                  <div className="truncate hidden md:block">
                    <span className="text-xs text-slate-300 font-medium truncate">
                      {materi.mata_pelajaran} — <strong className="text-white">{materi.judul}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {viewMode === 'reader' && (
                    <>
                      {/* Page Navigator in Focus Mode */}
                      <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-0.5 text-xs">
                        <button
                          onClick={handlePrevPage}
                          disabled={currentPage <= 1}
                          className="p-1 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Halaman Sebelumnya"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-white px-1">
                          Hal. {currentPage} <span className="text-slate-500 font-normal">/ {totalPages}</span>
                        </span>
                        <button
                          onClick={handleNextPage}
                          disabled={currentPage >= totalPages}
                          className="p-1 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Halaman Berikutnya"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* TTS Speed Presets Controller in Focus Mode */}
                      <div className="hidden sm:flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded-xl border border-slate-800">
                        <Gauge className="w-3 h-3 text-indigo-400 ml-1" />
                        {ttsSpeedPresets.map((preset) => {
                          const isActive = Math.abs(ttsRate - preset.value) < 0.05;
                          return (
                            <button
                              key={preset.value}
                              type="button"
                              onClick={() => setTtsRate(preset.value)}
                              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'text-slate-400 hover:text-slate-200'
                              }`}
                              title={`Kecepatan ${preset.label} (${preset.name})`}
                            >
                              {preset.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Audio Text-to-Speech mini button */}
                      <TextToSpeechButton
                        text={currentFullPageSpeechText}
                        title={`${materi.judul} - Hal ${currentPage}`}
                        variant="compact"
                        size="xs"
                      />

                      {/* Font Size controls */}
                      <div className="hidden md:flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
                        <Type className="w-3 h-3 text-slate-400 mr-0.5" />
                        <button
                          onClick={() => setFontSize('normal')}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                            fontSize === 'normal' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                          }`}
                        >
                          A
                        </button>
                        <button
                          onClick={() => setFontSize('large')}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                            fontSize === 'large' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                          }`}
                        >
                          A+
                        </button>
                        <button
                          onClick={() => setFontSize('xlarge')}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-black cursor-pointer ${
                            fontSize === 'xlarge' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                          }`}
                        >
                          A++
                        </button>
                      </div>
                    </>
                  )}

                  {/* Tanya Tutor in Focus Mode */}
                  <button
                    id="btn-focus-tanya-tutor"
                    onClick={() => setIsTanyaTutorOpen(true)}
                    title={`Tanya Tutor Pengampu: ${assignedTutor.nama}`}
                    className="px-2.5 py-1.5 bg-indigo-600/90 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-600/30 border border-indigo-400/40"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Tanya Tutor</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </button>

                  {/* Exit Focus Mode Button */}
                  <button
                    id="btn-exit-focus-mode"
                    onClick={() => setIsFocusMode(false)}
                    title="Keluar dari Mode Fokus (Esc)"
                    className="px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 hover:text-amber-200 border border-amber-400/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Keluar Fokus</span>
                    <kbd className="hidden sm:inline-block text-[9px] bg-slate-800 text-slate-300 px-1 py-0.5 rounded font-mono">Esc</kbd>
                  </button>

                  <button
                    onClick={onClose}
                    title="Tutup Modul"
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Secondary Subbar: Mode Toggle, Session Study Timer, TTS Speed Presets, Reading Progress, and Font Controls */}
        <AnimatePresence initial={false}>
          {!isFocusMode && (
            <motion.div
              key="main-sub-toolbar"
              initial={{ height: 0, opacity: 0, y: -20 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -20 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 shrink-0 z-20"
            >
              <div className="px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Reader vs Drive Switch + TOC Sidebar Toggle */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 p-0.5 bg-slate-200 dark:bg-slate-800 rounded-xl">
                    <button
                      onClick={() => setViewMode('reader')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        viewMode === 'reader'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {t('reader.digitalBook', 'Buku Teks Interaktif')}
                    </button>
                    <button
                      onClick={() => setViewMode('drive')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        viewMode === 'drive'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {t('reader.originalPdf', 'PDF Dokumen Asli')}
                    </button>
                  </div>

                  {/* Table of Contents & Discussion Sidebar Toggle Buttons */}
                  {viewMode === 'reader' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        id="btn-toggle-toc-sidebar"
                        onClick={() => {
                          if (isSidebarOpen && sidebarTab === 'toc') {
                            setIsSidebarOpen(false);
                          } else {
                            setSidebarTab('toc');
                            setIsSidebarOpen(true);
                          }
                        }}
                        title={isSidebarOpen && sidebarTab === 'toc' ? 'Sembunyikan Daftar Isi' : 'Tampilkan Daftar Isi Modul'}
                        className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 text-xs transition-all cursor-pointer ${
                          isSidebarOpen && sidebarTab === 'toc'
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <PanelLeft className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Daftar Isi</span>
                      </button>

                      <button
                        id="btn-toggle-discussion-sidebar"
                        onClick={() => {
                          if (isSidebarOpen && sidebarTab === 'discussion') {
                            setIsSidebarOpen(false);
                          } else {
                            setSidebarTab('discussion');
                            setIsSidebarOpen(true);
                          }
                        }}
                        title="Buka Forum Diskusi & Tanya Jawab Modul"
                        className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 text-xs transition-all cursor-pointer ${
                          isSidebarOpen && sidebarTab === 'discussion'
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="hidden md:inline">Diskusi</span>
                        {discussionCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            {discussionCount}
                          </span>
                        )}
                      </button>

                      {/* Tanya Tutor Action in Subbar */}
                      <button
                        id="btn-subbar-tanya-tutor"
                        onClick={() => setIsTanyaTutorOpen(true)}
                        title={`Tanya Tutor Pengampu: ${assignedTutor.nama}`}
                        className="px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 text-xs transition-all cursor-pointer bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-2xs group"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                        <span>Tanya Tutor</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Session Study Timer & Reading Progress Bar */}
                <div className="flex items-center gap-4">
                  {/* Session-Based Study Timer (Format 00:15:42) */}
                  <div
                    id="study-session-timer-badge"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs"
                    title="Durasi Belajar Sesi Aktif (Study Time)"
                  >
                    <Timer className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-[pulse_2s_infinite]" />
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      Waktu Belajar: <strong className="text-slate-900 dark:text-white font-mono">{formatSessionTimer(sessionSeconds)}</strong>
                    </span>
                  </div>

                  {viewMode === 'reader' && (
                    <div className="hidden sm:flex items-center gap-2">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{progressPercent}%</span>
                      <div className="w-20 md:w-28 h-2 bg-slate-200 dark:bg-slate-750 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Page Navigator, TTS Controls & Presets, and Font Size Controller */}
                {viewMode === 'reader' && (
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {/* TTS Speed Presets Controller */}
                    <div className="hidden lg:flex items-center gap-1 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                      <Gauge className="w-3 h-3 text-indigo-500 ml-1" />
                      <span className="text-[10px] text-slate-400 font-semibold px-0.5">Speed:</span>
                      {ttsSpeedPresets.map((preset) => {
                        const isActive = Math.abs(ttsRate - preset.value) < 0.05;
                        return (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => setTtsRate(preset.value)}
                            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                              isActive
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                            title={`Kecepatan ${preset.label} (${preset.name})`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Text-to-Speech Read Entire Page Button */}
                    <TextToSpeechButton
                      text={currentFullPageSpeechText}
                      title={`${materi.judul} - Hal ${currentPage}`}
                      variant="pill"
                      size="sm"
                    />

                    {/* Font Size Selector */}
                    <div className="hidden md:flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      <Type className="w-3.5 h-3.5 text-slate-400 mr-1" />
                      <button
                        onClick={() => setFontSize('normal')}
                        className={`px-1.5 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                          fontSize === 'normal' ? 'bg-indigo-600 text-white' : 'text-slate-500'
                        }`}
                      >
                        A
                      </button>
                      <button
                        onClick={() => setFontSize('large')}
                        className={`px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                          fontSize === 'large' ? 'bg-indigo-600 text-white' : 'text-slate-500'
                        }`}
                      >
                        A+
                      </button>
                      <button
                        onClick={() => setFontSize('xlarge')}
                        className={`px-1.5 py-0.5 rounded text-[11px] font-black cursor-pointer ${
                          fontSize === 'xlarge' ? 'bg-indigo-600 text-white' : 'text-slate-500'
                        }`}
                      >
                        A++
                      </button>
                    </div>

                    {/* Prev / Next Page controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage <= 1}
                        className="p-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-slate-200 dark:border-slate-800 cursor-pointer shadow-2xs"
                        title="Halaman Sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <span className="text-[11px] text-slate-400">Hal.</span>
                        <input
                          type="number"
                          min={1}
                          max={totalPages}
                          value={currentPage}
                          onChange={e => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val >= 1 && val <= totalPages) {
                              setCurrentPage(val);
                            }
                          }}
                          className="w-10 px-1 py-0.5 text-center font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                        />
                        <span className="text-slate-400">/ {totalPages}</span>
                      </div>

                      <button
                        onClick={handleNextPage}
                        disabled={currentPage >= totalPages}
                        className="p-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-slate-200 dark:border-slate-800 cursor-pointer shadow-2xs"
                        title="Halaman Berikutnya"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visual Reading Progress Bar pinned at the top of content */}
        {viewMode === 'reader' && (
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200/80 dark:border-slate-800 shrink-0 z-20 shadow-2xs">
            {/* Real-time reading pace and page progress stats */}
            <div className="px-4 sm:px-6 py-1.5 flex items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shrink-0">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="hidden sm:inline">Progres Baca Halaman {currentPage}:</span>
                  <span className="sm:hidden">Hal {currentPage}:</span>
                  <strong className="text-indigo-600 dark:text-indigo-400 font-black">{scrollProgress}%</strong>
                </span>

                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border border-current/20 flex items-center gap-1 shrink-0 ${studyPaceInfo.color} ${studyPaceInfo.badgeBg}`}>
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{studyPaceInfo.label}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-slate-500 dark:text-slate-400 text-[10px]">
                <span className="hidden md:inline font-medium">
                  {scrollProgress < 100 ? `Estimasi: ~${Math.max(1, Math.ceil((100 - scrollProgress) / 25))} mnt tersisa` : '100% Selesai Dibaca'}
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-semibold text-slate-600 dark:text-slate-300 font-mono">
                  ⏱ {formatSessionTimer(sessionSeconds)}
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-semibold text-slate-600 dark:text-slate-300">
                  {currentPage} / {totalPages} Bab
                </span>
              </div>
            </div>

            {/* Continuous fluid gradient progress line */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-amber-400 to-emerald-500 relative"
                style={{ width: `${scrollProgress}%` }}
                animate={{ width: `${scrollProgress}%` }}
                transition={{ duration: 0.1, ease: 'easeOut' }}
              >
                {/* Glow dot at the edge */}
                {scrollProgress > 0 && scrollProgress < 100 && (
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
              </motion.div>
            </div>
          </div>
        )}

        {/* Reading Canvas & Collapsible Sidebar Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Collapsible Sidebar with Tabs: Table of Contents & Materi Discussion */}
          <AnimatePresence initial={false}>
            {isSidebarOpen && !isFocusMode && viewMode === 'reader' && (
              <motion.div
                key="toc-sidebar"
                initial={{ width: 0, opacity: 0, x: -30 }}
                animate={{ width: sidebarTab === 'discussion' ? 340 : 290, opacity: 1, x: 0 }}
                exit={{ width: 0, opacity: 0, x: -30 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="overflow-hidden bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 z-10"
              >
                {/* Sidebar Header & Tab Switcher */}
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 min-w-[288px]">
                  <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setSidebarTab('toc')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        sidebarTab === 'toc'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                      <span>Daftar Isi</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSidebarTab('discussion')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        sidebarTab === 'discussion'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Diskusi</span>
                      {discussionCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {discussionCount}
                        </span>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="Tutup Bilah Samping"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sidebar Body */}
                <div className="p-3 space-y-1 overflow-y-auto flex-1 min-w-[288px] custom-scrollbar">
                  {sidebarTab === 'toc' ? (
                    tableOfContents.map((tocItem, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentPage(tocItem.page);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                          currentPage >= tocItem.page && (idx === tableOfContents.length - 1 || currentPage < tableOfContents[idx + 1].page)
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 shadow-2xs'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold shrink-0 text-slate-700 dark:text-slate-300">
                          {tocItem.page}
                        </span>
                        <span className="line-clamp-2 leading-relaxed">{tocItem.title}</span>
                      </button>
                    ))
                  ) : (
                    <MateriDiscussionSection
                      materi={materi}
                      currentUser={currentUser}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      isCompact={true}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Reading Canvas */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 bg-slate-100 dark:bg-slate-950 overflow-y-auto p-3 sm:p-6 flex flex-col items-center justify-start custom-scrollbar relative"
          >
            {viewMode === 'drive' ? (
              <div className="w-full h-full min-h-[550px] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
                <iframe
                  title={materi.judul}
                  src={materi.preview_url || `https://drive.google.com/file/d/${materi.file_id}/preview`}
                  className="w-full flex-1 border-0 rounded-2xl min-h-[540px]"
                  allow="autoplay; encrypted-media"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div
                className={`w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-10 transition-all duration-200 min-h-[600px] flex flex-col justify-between digital-reader-content ${
                  fontSize === 'large' ? 'text-base' : fontSize === 'xlarge' ? 'text-lg' : 'text-sm'
                }`}
              >
                {/* Header inside pure digital page */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                      MODUL KURIKULUM RESMI PKBM CELAH CAHAYA — {materi.paket}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {materi.mata_pelajaran}: {materi.judul}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-bold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                  </div>
                </div>

                {/* Dynamic Content per page */}
                <div className="space-y-6">
                  <div className="p-4 sm:p-5 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/60">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-slate-900 dark:text-indigo-200 flex items-center gap-2 text-sm sm:text-base">
                        <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        Tujuan & Ringkasan Pembelajaran Modul
                      </h4>
                      <TextToSpeechButton
                        text={`Tujuan dan Ringkasan Pembelajaran Modul ${materi.judul}: ${materi.deskripsi || ''}`}
                        title={`Ringkasan: ${materi.judul}`}
                        variant="compact"
                        size="xs"
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      {materi.deskripsi}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        {currentPage === 1 && '1. Pendahuluan & Capaian Pembelajaran (CP)'}
                        {currentPage === 2 && '2. Konsep Teori & Landasan Keilmuan'}
                        {currentPage === 3 && '3. Pembahasan Mendalam & Fakta Esensial'}
                        {currentPage === 4 && '4. Studi Kasus Kontekstual & Lingkungan Hidup'}
                        {currentPage === 5 && '5. Penerapan Praktis & Pemecahan Masalah'}
                        {currentPage > 5 && `${currentPage}. Lembar Aktivitas Mandiri & Eksplorasi Warga Belajar`}
                      </h4>
                      <TextToSpeechButton
                        text={`Bagian ${currentPageSectionTitle}. Dalam modul ${materi.judul} (${materi.paket}), warga belajar diarahkan untuk memahami kompetensi dasar secara mendalam melalui pendekatan mandiri dan terbimbing.`}
                        title={currentPageSectionTitle}
                        variant="icon"
                        size="sm"
                      />
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                      Dalam modul <strong>{materi.judul}</strong> ({materi.paket}), warga belajar diarahkan untuk memahami kompetensi dasar secara mendalam melalui pendekatan mandiri dan terbimbing. Sesuai dengan pedoman kurikulum kesetaraan Kementerian Pendidikan Dasar dan Menengah, pembelajaran kesetaraan memadukan literasi akademis teoritis dan keterampilan aplikatif sehari-hari.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-750">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                            💡 Poin Kunci Pembelajaran
                          </p>
                          <TextToSpeechButton
                            text={`Poin Kunci Pembelajaran ${materi.mata_pelajaran}: Mengidentifikasi fakta dan data esensial, mengembangkan penalaran kritis dan solusi berbasis kearifan lokal, serta melatih penyusunan argumen terstruktur dan beretika.`}
                            title="Poin Kunci"
                            variant="icon"
                            size="xs"
                          />
                        </div>
                        <ul className="list-disc list-inside text-xs sm:text-sm space-y-1 text-slate-600 dark:text-slate-300">
                          <li>Mengidentifikasi fakta dan data esensial dalam mata pelajaran {materi.mata_pelajaran}.</li>
                          <li>Mengembangkan penalaran kritis dan solusi berbasis kearifan lokal.</li>
                          <li>Melatih penyusunan argumen terstruktur dan beretika.</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-750">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                            🎯 Target Pemahaman & SKK
                          </p>
                          <TextToSpeechButton
                            text="Target Pemahaman dan SKK: Warga belajar mampu menyelesaikan lembar tugas mingguan, berdiskusi aktif bersama Tutor pengampu, dan memperoleh nilai minimal kelulusan KKM 75."
                            title="Target SKK"
                            variant="icon"
                            size="xs"
                          />
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          Warga belajar mampu menyelesaikan lembar tugas mingguan, berdiskusi aktif bersama Tutor pengampu, dan memperoleh nilai minimal kelulusan (KKM 75).
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                      File dokumen resmi modul ini tersimpan secara aman di <strong>Google Drive PKBM Celah Cahaya</strong> dengan ID: <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[11px] text-slate-800 dark:text-slate-200">{materi.file_id}</code>. Warga belajar dapat mengunduh dan mencetak modul ini untuk belajar secara luring kapan pun dibutuhkan.
                    </p>
                  </div>

                  {/* 1. End of Module Indicator: Subtle Badge / Card at Bottom of Content when Scroll reaches 100% */}
                  <AnimatePresence>
                    {scrollProgress >= 100 && (
                      <motion.div
                        id="end-of-module-card"
                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.97 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-emerald-950/30 rounded-3xl border border-emerald-500/40 shadow-lg text-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 animate-in fade-in"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg shadow-emerald-500/30">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/80">
                                Modul Selesai • 100%
                              </span>
                              <span className="text-xs text-slate-300 font-mono flex items-center gap-1">
                                <Clock className="w-3 h-3 text-emerald-400" />
                                Waktu Belajar: {formatSessionTimer(sessionSeconds)}
                              </span>
                            </div>
                            <h4 className="text-sm sm:text-base font-black text-white mt-1">
                              Module Completed / Modul Selesai Dibaca
                            </h4>
                            <p className="text-xs text-slate-300 mt-0.5">
                              Kerja bagus! Anda telah menyelesaikan seluruh isi materi modul ini. Uji pemahaman Anda melalui evaluasi kuis 100 soal.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                          <button
                            id="btn-completion-start-quiz"
                            onClick={handleMarkCompleteAndStartQuiz}
                            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-500/25 active:scale-98"
                          >
                            <Award className="w-4 h-4" />
                            <span>{isCompleted ? 'Kerjakan Kuis Lagi' : 'Tandai & Mulai Kuis'}</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 100-Question Evaluation Quiz Banner */}
                  <div className="p-5 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl border border-indigo-800/60 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="font-black text-sm sm:text-base text-white">
                          Evaluasi Akhir: Kuis 100 Soal Modul
                        </h5>
                        <p className="text-xs text-indigo-200 mt-0.5">
                          Selesaikan membaca modul dan uji tingkat pemahaman Anda melalui 100 soal pilihan ganda berpenilaian otomatis.
                        </p>
                      </div>
                    </div>

                    <button
                      id="btn-footer-start-quiz"
                      onClick={handleMarkCompleteAndStartQuiz}
                      className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isCompleted ? 'Kerjakan Kuis Lagi' : 'Tandai Selesai & Mulai Kuis'}</span>
                    </button>
                  </div>

                  {/* Materi Discussion & Q&A Comment Section */}
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                    <MateriDiscussionSection
                      materi={materi}
                      currentUser={currentUser}
                      currentPage={currentPage}
                      totalPages={totalPages}
                    />
                  </div>

                  {/* Download and Share footer */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Kurikulum Resmi Kemdikbud • Tahun Terbit: {materi.tahun || '2024'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyLink}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Tersalin' : 'Bagi Tautan'}</span>
                      </button>

                      <button
                        onClick={handleDownload}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh PDF ({materi.ukuran_file})</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom footer pagination label */}
                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>PKBM Celah Cahaya • Garut, Jawa Barat</span>
                  <span>Dokumen Pembelajaran Mandiri — Hal. {currentPage} dari {totalPages}</span>
                </div>
              </div>
            )}

            {/* Subtle Floating Bottom Badge for Module Completion (Only when scroll progress is 100%) */}
            <AnimatePresence>
              {scrollProgress >= 100 && !isCompletionDismissed && (
                <motion.div
                  id="floating-end-of-module-indicator"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="sticky bottom-3 z-40 max-w-xl w-full px-3 mt-4"
                >
                  <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-emerald-500/50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                            100% Selesai
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            ⏱ {formatSessionTimer(sessionSeconds)}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                          Modul Selesai Dibaca
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={handleMarkCompleteAndStartQuiz}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Kuis 100 Soal</span>
                        <span className="sm:hidden">Kuis</span>
                      </button>
                      <button
                        onClick={() => setIsCompletionDismissed(true)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Tutup Notifikasi"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating Quick Action Dock & Tanya Tutor Floating Control Panel */}
            {viewMode === 'reader' && (
              <aside
                aria-label="Floating Controls"
                className="fixed bottom-6 right-6 z-40 flex items-center gap-2 pointer-events-auto"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="bg-slate-900/95 dark:bg-slate-950/95 text-white backdrop-blur-md px-3 py-2 rounded-2xl shadow-2xl border border-slate-750 dark:border-slate-800 flex items-center gap-2.5"
                >
                  {/* Tanya Tutor Floating Button */}
                  <button
                    id="btn-floating-tanya-tutor"
                    onClick={() => setIsTanyaTutorOpen(true)}
                    title={`Tanya Tutor Pengampu: ${assignedTutor.nama}`}
                    className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all cursor-pointer group active:scale-95"
                  >
                    <div className="relative">
                      <img
                        src={assignedTutor.foto}
                        alt={assignedTutor.nama}
                        className="w-5 h-5 rounded-full object-cover border border-white/40"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900 animate-pulse" />
                    </div>
                    <span>Tanya Tutor</span>
                  </button>

                  <div className="w-px h-5 bg-slate-800" />

                  {/* Page Navigation */}
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage <= 1}
                      className="p-1 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Halaman Sebelumnya"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-xs font-bold text-white px-1">
                      {currentPage}/{totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages}
                      className="p-1 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Halaman Berikutnya"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="w-px h-5 bg-slate-800 hidden sm:block" />

                  {/* Discussion Sidebar Toggle */}
                  <button
                    id="btn-floating-discussion-toggle"
                    onClick={() => {
                      if (isSidebarOpen && sidebarTab === 'discussion') {
                        setIsSidebarOpen(false);
                      } else {
                        setSidebarTab('discussion');
                        setIsSidebarOpen(true);
                      }
                    }}
                    title="Buka Forum Diskusi & Tanya Jawab"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer relative"
                  >
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                    {discussionCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                        {discussionCount}
                      </span>
                    )}
                  </button>
                </motion.div>
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* Tanya Tutor Modal Component */}
      {isTanyaTutorOpen && (
        <TanyaTutorModal
          isOpen={isTanyaTutorOpen}
          onClose={() => setIsTanyaTutorOpen(false)}
          materi={materi}
          currentUser={currentUser}
          currentPage={currentPage}
          totalPages={totalPages}
          onOpenDiscussionSidebar={() => {
            setSidebarTab('discussion');
            setIsSidebarOpen(true);
          }}
        />
      )}
    </div>
  );
};
