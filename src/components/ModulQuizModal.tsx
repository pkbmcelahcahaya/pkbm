import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  RotateCcw,
  Bookmark,
  BookOpen,
  FileCheck,
  Printer,
  ChevronRight,
  ChevronLeft,
  Layers,
  Flag,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Materi, User, ModulQuizSoal, ModulQuizAttempt } from '../types';
import { storage } from '../services/storageService';
import { googleSheetsSync } from '../services/googleSheetsSyncService';
import { generate100QuestionsForMateri } from '../data/modulQuizGenerator';
import confetti from 'canvas-confetti';
import { PrintPreviewModal } from './common/PrintPreviewModal';
import { TextToSpeechButton } from './common/TextToSpeechButton';

interface ModulQuizModalProps {
  materi: Materi;
  currentUser: User;
  onClose: () => void;
  onQuizCompleted?: (attempt: ModulQuizAttempt) => void;
}

export const ModulQuizModal: React.FC<ModulQuizModalProps> = ({
  materi,
  currentUser,
  onClose,
  onQuizCompleted
}) => {
  // Generate or load 100 questions for this module
  const rawQuestions = useMemo(() => generate100QuestionsForMateri(materi), [materi.id]);
  const [questions, setQuestions] = useState<ModulQuizSoal[]>(rawQuestions);

  // Storage key for resilient autosave in local session
  const autoSaveKey = `pkbm_quiz_progress_${currentUser.id}_${materi.id}`;

  // Exam States
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem(autoSaveKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [filterGrid, setFilterGrid] = useState<'ALL' | 'ANSWERED' | 'UNANSWERED' | 'FLAGGED'>('ALL');
  const [isGridOpen, setIsGridOpen] = useState(false);

  // Timer: default 90 minutes (5400 seconds)
  const totalDurationSeconds = 90 * 60;
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(totalDurationSeconds);
  const startTimeRef = useRef<Date>(new Date());

  // Result & Review State
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [completedAttempt, setCompletedAttempt] = useState<ModulQuizAttempt | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'ALL' | 'CORRECT' | 'INCORRECT'>('ALL');
  const [reviewIndex, setReviewIndex] = useState(0);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Autosave answers on change
  useEffect(() => {
    try {
      localStorage.setItem(autoSaveKey, JSON.stringify(answers));
    } catch (e) {
      console.warn('Autosave failed:', e);
    }
  }, [answers, autoSaveKey]);

  // Countdown timer
  useEffect(() => {
    if (completedAttempt) return;

    if (timeRemainingSeconds <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemainingSeconds, completedAttempt]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length; // 100
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Answer handler
  const handleSelectOption = (nomor: number, key: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => ({
      ...prev,
      [nomor]: key
    }));
  };

  const toggleFlag = (nomor: number) => {
    setFlagged(prev => ({
      ...prev,
      [nomor]: !prev[nomor]
    }));
  };

  // Submit and auto-grade 100 questions
  const handleFinalSubmit = () => {
    setIsSubmitConfirmOpen(false);

    const now = new Date();
    const durationSpentSeconds = Math.max(1, totalDurationSeconds - timeRemainingSeconds);

    let correctCount = 0;
    const kunciSnapshot: Record<number, string> = {};
    const pembahasanSnapshot: Record<number, string> = {};

    questions.forEach(q => {
      kunciSnapshot[q.nomor] = q.kunci_jawaban;
      pembahasanSnapshot[q.nomor] = q.pembahasan;
      if (answers[q.nomor] === q.kunci_jawaban) {
        correctCount++;
      }
    });

    const score = correctCount; // 100 questions -> 1 point each = 0-100
    const kkm = 75;
    const isPassed = score >= kkm;

    const attemptData: Omit<ModulQuizAttempt, 'id' | 'timestamp'> = {
      materi_id: materi.id,
      materi_judul: materi.judul,
      mata_pelajaran: materi.mata_pelajaran,
      paket: materi.paket,
      tingkatan: materi.tingkatan,
      user_id: currentUser.id,
      siswa_nama: currentUser.nama,
      siswa_nisn: currentUser.nisn,
      kelas: currentUser.kelas,
      mulai_pada: startTimeRef.current.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      selesai_pada: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      durasi_detik: durationSpentSeconds,
      jawaban: answers,
      ragu_ragu: flagged,
      kunci_jawaban_snapshot: kunciSnapshot,
      pembahasan_snapshot: pembahasanSnapshot,
      jumlah_soal: 100,
      jumlah_benar: correctCount,
      jumlah_salah: totalQuestions - correctCount - (100 - answeredCount),
      jumlah_kosong: 100 - answeredCount,
      nilai: score,
      kkm,
      status_kelulusan: isPassed ? 'LULUS' : 'TIDAK_LULUS',
      percobaan_ke: 1
    };

    const savedAttempt = storage.saveModulQuizAttempt(attemptData);

    // Sync to Google Sheets in background
    googleSheetsSync.syncQuizAttemptToGoogleSheets(savedAttempt).catch(err => {
      console.warn('Google Sheets Quiz Sync:', err);
    });

    // Clear autosave session
    try {
      localStorage.removeItem(autoSaveKey);
    } catch {}

    setCompletedAttempt(savedAttempt);
    if (onQuizCompleted) {
      onQuizCompleted(savedAttempt);
    }

    if (isPassed) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setFlagged({});
    setCurrentIndex(0);
    setTimeRemainingSeconds(totalDurationSeconds);
    startTimeRef.current = new Date();
    setCompletedAttempt(null);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} Menit ${s} Detik`;
  };

  return (
    <div
      id="modul-quiz-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 font-sans animate-fadeIn"
    >
      <div className="bg-white dark:bg-slate-900 w-full h-full max-w-6xl max-h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* ========================================================= */}
        {/* CASE 1: ACTIVE EXAM IN PROGRESS                           */}
        {/* ========================================================= */}
        {!completedAttempt ? (
          <>
            {/* Header Bar */}
            <div className="bg-slate-900 px-4 sm:px-6 py-3.5 text-white flex items-center justify-between gap-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-indigo-500 text-white uppercase tracking-wider">
                      {materi.paket}
                    </span>
                    <span className="text-xs text-slate-300 font-medium truncate">
                      Kuis Evaluasi 100 Soal • {materi.mata_pelajaran}
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-white truncate mt-0.5">
                    {materi.judul}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Timer Display */}
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs sm:text-sm font-bold ${
                    timeRemainingSeconds < 600
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : 'bg-slate-800 text-amber-300 border-slate-700'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>{formatTimer(timeRemainingSeconds)}</span>
                </div>

                {/* Question Grid Toggle (Mobile) */}
                <button
                  onClick={() => setIsGridOpen(!isGridOpen)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span className="hidden sm:inline">Peta Soal</span>
                  <span>({answeredCount}/100)</span>
                </button>

                {/* Close with warning */}
                <button
                  onClick={() => {
                    if (answeredCount > 0) {
                      if (confirm('Jawaban Anda tersimpan otomatis. Yakin ingin keluar dari kuis?')) {
                        onClose();
                      }
                    } else {
                      onClose();
                    }
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Tutup Kuis"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Subbar: Progress & Quick Stats */}
            <div className="bg-slate-100 dark:bg-slate-950 px-4 sm:px-6 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 shrink-0">
              <div className="flex items-center gap-4">
                <span>
                  Soal <strong className="text-indigo-600 dark:text-indigo-400">{currentIndex + 1}</strong> dari 100
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline text-emerald-600 dark:text-emerald-400 font-semibold">
                  Terjawab: {answeredCount}
                </span>
                <span className="hidden sm:inline text-slate-400">
                  Sisa: {unansweredCount}
                </span>
              </div>

              {/* Linear Progress Bar */}
              <div className="flex items-center gap-2 w-36 sm:w-56">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="font-bold font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                  {progressPercent}%
                </span>
              </div>
            </div>

            {/* Main Area: Question Taking & Grid Drawer */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Question Screen */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col justify-between">
                <div className="max-w-3xl mx-auto w-full space-y-6">
                  
                  {/* Question Header & Category Badge */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black text-sm flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                        {currentQuestion.nomor}
                      </span>
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        currentQuestion.tingkat_kesulitan === 'MUDAH'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : currentQuestion.tingkat_kesulitan === 'SEDANG'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        Tingkat: {currentQuestion.tingkat_kesulitan}
                      </span>
                      {currentQuestion.topik_bab && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                          {currentQuestion.topik_bab}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <TextToSpeechButton
                        text={`Soal nomor ${currentQuestion.nomor}. ${currentQuestion.pertanyaan}. Pilihan A: ${currentQuestion.pilihan.A}. Pilihan B: ${currentQuestion.pilihan.B}. Pilihan C: ${currentQuestion.pilihan.C}. Pilihan D: ${currentQuestion.pilihan.D}.`}
                        title={`Soal No ${currentQuestion.nomor}`}
                        variant="compact"
                        size="xs"
                      />

                      <button
                        onClick={() => toggleFlag(currentQuestion.nomor)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          flagged[currentQuestion.nomor]
                            ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Flag className={`w-3.5 h-3.5 ${flagged[currentQuestion.nomor] ? 'fill-amber-500 text-amber-500' : ''}`} />
                        <span>{flagged[currentQuestion.nomor] ? 'Ditandai Ragu' : 'Tandai Ragu'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
                    <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
                      {currentQuestion.pertanyaan}
                    </p>
                  </div>

                  {/* 4 Multiple Choice Options */}
                  <div className="space-y-3">
                    {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                      const optText = currentQuestion.pilihan[optKey];
                      const isSelected = answers[currentQuestion.nomor] === optKey;

                      return (
                        <div
                          key={optKey}
                          onClick={() => handleSelectOption(currentQuestion.nomor, optKey)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                            isSelected
                              ? 'bg-indigo-50/80 dark:bg-indigo-950/70 border-indigo-600 dark:border-indigo-500 shadow-xs ring-2 ring-indigo-500/20'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {optKey}
                          </div>
                          <div className="flex-1 pt-0.5 text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-normal">
                            {optText}
                          </div>
                          {isSelected && (
                            <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Navigation Buttons */}
                <div className="max-w-3xl mx-auto w-full pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {currentIndex < totalQuestions - 1 ? (
                      <button
                        onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-colors cursor-pointer"
                      >
                        <span>Berikutnya</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsSubmitConfirmOpen(true)}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Selesaikan Kuis (100 Soal)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 100-Question Grid Sidebar Drawer (Desktop & Mobile Popout) */}
              <div
                className={`w-80 bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 p-4 overflow-y-auto flex flex-col justify-between shrink-0 transition-all ${
                  isGridOpen ? 'block fixed sm:static inset-y-0 right-0 z-50 shadow-2xl sm:shadow-none' : 'hidden md:flex'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      Peta 100 Soal
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500">
                        {answeredCount}/100
                      </span>
                      {isGridOpen && (
                        <button
                          onClick={() => setIsGridOpen(false)}
                          className="sm:hidden p-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="grid grid-cols-4 gap-1 bg-slate-200 dark:bg-slate-900 p-1 rounded-lg text-[10px] font-bold text-center">
                    <button
                      onClick={() => setFilterGrid('ALL')}
                      className={`py-1 rounded ${filterGrid === 'ALL' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      Semua
                    </button>
                    <button
                      onClick={() => setFilterGrid('ANSWERED')}
                      className={`py-1 rounded ${filterGrid === 'ANSWERED' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      Terisi
                    </button>
                    <button
                      onClick={() => setFilterGrid('UNANSWERED')}
                      className={`py-1 rounded ${filterGrid === 'UNANSWERED' ? 'bg-white dark:bg-slate-800 text-slate-700 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      Kosong
                    </button>
                    <button
                      onClick={() => setFilterGrid('FLAGGED')}
                      className={`py-1 rounded ${filterGrid === 'FLAGGED' ? 'bg-white dark:bg-slate-800 text-amber-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      Ragu
                    </button>
                  </div>

                  {/* 1-100 Quick Jump Grid */}
                  <div className="grid grid-cols-5 gap-1.5 max-h-[380px] overflow-y-auto p-1">
                    {questions.map((q, idx) => {
                      const isAnswered = !!answers[q.nomor];
                      const isFlagged = !!flagged[q.nomor];
                      const isActive = currentIndex === idx;

                      // Filter check
                      if (filterGrid === 'ANSWERED' && !isAnswered) return null;
                      if (filterGrid === 'UNANSWERED' && isAnswered) return null;
                      if (filterGrid === 'FLAGGED' && !isFlagged) return null;

                      return (
                        <button
                          key={q.nomor}
                          onClick={() => {
                            setCurrentIndex(idx);
                            setIsGridOpen(false);
                          }}
                          className={`h-8 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                            isActive
                              ? 'ring-2 ring-indigo-500 bg-indigo-600 text-white shadow-xs font-black'
                              : isAnswered
                              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{q.nomor}</span>
                          {isFlagged && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-white" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Trigger from Sidebar */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Sudah Dijawab:</span>
                      <strong className="text-emerald-600">{answeredCount} Soal</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Belum Dijawab:</span>
                      <strong className="text-slate-600 dark:text-slate-400">{unansweredCount} Soal</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsSubmitConfirmOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Jawaban (100 Soal)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SUBMIT CONFIRMATION MODAL */}
            {isSubmitConfirmOpen && (
              <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>

                  <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Konfirmasi Akhiri Kuis Modul
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Apakah Anda yakin ingin menyelesaikan dan mengirim lembar jawaban 100 soal ini?
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Total Soal:</span>
                      <span className="font-bold">100 Soal</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Sudah Dijawab:</span>
                      <span className="font-bold text-emerald-600">{answeredCount} Soal</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Belum Dijawab:</span>
                      <span className={`font-bold ${unansweredCount > 0 ? 'text-rose-600' : 'text-slate-600'}`}>
                        {unansweredCount} Soal
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Sisa Waktu:</span>
                      <span className="font-bold font-mono">{formatTimer(timeRemainingSeconds)}</span>
                    </div>
                  </div>

                  {unansweredCount > 0 && (
                    <p className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/60 p-2.5 rounded-lg border border-rose-200 text-center font-medium">
                      ⚠️ Terdapat {unansweredCount} soal yang belum Anda isi. Soal kosong akan dihitung salah.
                    </p>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setIsSubmitConfirmOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                    >
                      Lanjutkan Mengerjakan
                    </button>
                    <button
                      onClick={handleFinalSubmit}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      Ya, Selesaikan Kuis
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* ========================================================= */
          /* CASE 2: INSTANT AUTO-GRADING & REVIEW RESULT SCREEN       */
          /* ========================================================= */
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
            
            {/* Result Header */}
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                    Hasil Penilaian Otomatis Kuis 100 Soal
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    {materi.mata_pelajaran}: {materi.judul}
                  </h2>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Result Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
              
              {/* Score Hero Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/50 shadow-xl relative overflow-hidden text-center max-w-4xl mx-auto">
                <div className="relative z-10 space-y-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      completedAttempt.status_kelulusan === 'LULUS'
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Status: {completedAttempt.status_kelulusan} (KKM: {completedAttempt.kkm})
                  </span>

                  <div className="pt-2">
                    <p className="text-xs text-indigo-200 font-medium">Nilai Akhir Anda</p>
                    <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mt-1">
                      {completedAttempt.nilai}
                      <span className="text-xl text-indigo-300 font-normal"> / 100</span>
                    </h1>
                  </div>

                  <p className="text-xs sm:text-sm text-indigo-200 max-w-lg mx-auto">
                    {completedAttempt.status_kelulusan === 'LULUS'
                      ? 'Selamat! Anda telah menguasai kompetensi dasar modul ini dengan sangat baik. Nilai otomatis tercatat di akun Tutor & Admin.'
                      : 'Nilai Anda belum mencapai KKM (75). Silakan pelajari kembali modul dan lakukan remedial/percobaan kuis.'}
                  </p>
                </div>
              </div>

              {/* 4 Detail Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <p className="text-xs text-slate-500">Jawaban Benar</p>
                  <h4 className="text-2xl font-black text-emerald-600 mt-1">
                    {completedAttempt.jumlah_benar} <span className="text-xs text-slate-400">/ 100</span>
                  </h4>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <p className="text-xs text-slate-500">Jawaban Salah</p>
                  <h4 className="text-2xl font-black text-rose-600 mt-1">
                    {completedAttempt.jumlah_salah} <span className="text-xs text-slate-400">Soal</span>
                  </h4>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <p className="text-xs text-slate-500">Durasi Pengerjaan</p>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                    {formatDuration(completedAttempt.durasi_detik)}
                  </h4>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <p className="text-xs text-slate-500">Tingkat Akurasi</p>
                  <h4 className="text-2xl font-black text-indigo-600 mt-1">
                    {completedAttempt.nilai}%
                  </h4>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto pt-2">
                <button
                  onClick={handleRetake}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Coba Kuis Lagi</span>
                </button>

                <button
                  onClick={() => setShowPrintModal(true)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Cetak & Simpan PDF Lembar Nilai</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesai & Kembali ke Modul</span>
                </button>
              </div>

              {/* 100-Question Review & Explanation Section */}
              <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      Pembahasan Lengkap 100 Butir Soal
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tinjau jawaban Anda dan pelajari kunci jawaban serta penjelasan ilmiah tiap nomor.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setReviewFilter('ALL')}
                      className={`px-3 py-1 rounded-lg ${reviewFilter === 'ALL' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs' : 'text-slate-600'}`}
                    >
                      Semua (100)
                    </button>
                    <button
                      onClick={() => setReviewFilter('CORRECT')}
                      className={`px-3 py-1 rounded-lg ${reviewFilter === 'CORRECT' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-600'}`}
                    >
                      Benar ({completedAttempt.jumlah_benar})
                    </button>
                    <button
                      onClick={() => setReviewFilter('INCORRECT')}
                      className={`px-3 py-1 rounded-lg ${reviewFilter === 'INCORRECT' ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-xs' : 'text-slate-600'}`}
                    >
                      Salah ({completedAttempt.jumlah_salah})
                    </button>
                  </div>
                </div>

                {/* Review Questions List */}
                <div className="space-y-4 pt-2">
                  {questions
                    .filter(q => {
                      const isCorrect = completedAttempt.jawaban[q.nomor] === q.kunci_jawaban;
                      if (reviewFilter === 'CORRECT') return isCorrect;
                      if (reviewFilter === 'INCORRECT') return !isCorrect;
                      return true;
                    })
                    .map(q => {
                      const studentAnswer = completedAttempt.jawaban[q.nomor];
                      const isCorrect = studentAnswer === q.kunci_jawaban;

                      return (
                        <div
                          key={q.nomor}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                            isCorrect
                              ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                              : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                                #{q.nomor}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isCorrect
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-rose-500 text-white'
                              }`}>
                                {isCorrect ? 'BENAR' : studentAnswer ? 'SALAH' : 'TIDAK DIJAWAB'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                                Tingkat: {q.tingkat_kesulitan}
                              </span>
                              <TextToSpeechButton
                                text={`Soal nomor ${q.nomor}. ${q.pertanyaan}. Jawaban benar: Pilihan ${q.kunci_jawaban}, ${q.pilihan[q.kunci_jawaban]}. Pembahasan: ${q.pembahasan || 'Tidak ada pembahasan tambahan.'}`}
                                title={`Review Soal No ${q.nomor}`}
                                variant="icon"
                                size="xs"
                              />
                            </div>
                          </div>

                          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                            {q.pertanyaan}
                          </p>

                          {/* Options grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                            {(['A', 'B', 'C', 'D'] as const).map(k => {
                              const isKey = q.kunci_jawaban === k;
                              const isChosen = studentAnswer === k;

                              return (
                                <div
                                  key={k}
                                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                                    isKey
                                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-400 font-bold'
                                      : isChosen && !isKey
                                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border-rose-300 line-through'
                                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                  }`}
                                >
                                  <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-black/10">
                                    {k}
                                  </span>
                                  <span className="flex-1 truncate">{q.pilihan[k]}</span>
                                  {isKey && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                                  {isChosen && !isKey && <X className="w-4 h-4 text-rose-600 shrink-0" />}
                                </div>
                              );
                            })}
                          </div>

                          {/* Explanation Card */}
                          <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                            <strong className="text-indigo-600 dark:text-indigo-400 mr-1">💡 Pembahasan:</strong>
                            {q.pembahasan}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Print Preview & PDF Modal */}
      {showPrintModal && completedAttempt && (
        <PrintPreviewModal
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          defaultDocType="LEMBAR_NILAI_KUIS"
          docData={completedAttempt}
          title={`Hasil Kuis - ${materi.judul}`}
        />
      )}
    </div>
  );
};
