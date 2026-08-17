import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  FileCheck,
  RotateCcw,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import { Ulangan, Soal, UjianAttempt, User, PaketType, TipeSoal } from '../types';
import { storage } from '../services/storageService';
import { googleSheetsSync } from '../services/googleSheetsSyncService';
import { TextToSpeechButton } from './common/TextToSpeechButton';

interface UlanganSectionProps {
  currentUser: User;
}

export const UlanganSection: React.FC<UlanganSectionProps> = ({ currentUser }) => {
  const isStudent = currentUser.role === 'SISWA';

  // Master Data
  const [ulanganList, setUlanganList] = useState<Ulangan[]>(() =>
    storage.getUlangan(currentUser.role, isStudent ? currentUser.paket : undefined)
  );
  const [attempts, setAttempts] = useState<UjianAttempt[]>(() =>
    storage.getUjianAttempts(undefined, isStudent ? currentUser.id : undefined)
  );
  const [bankSoal, setBankSoal] = useState<Soal[]>(() =>
    storage.getBankSoal(isStudent ? currentUser.paket : undefined)
  );

  // Tabs for Tutor: 'ULANGAN' vs 'BANK_SOAL' vs 'HASIL_SISWA'
  const [tutorTab, setTutorTab] = useState<'ULANGAN' | 'BANK_SOAL' | 'HASIL_SISWA'>('ULANGAN');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPaket, setFilterPaket] = useState<string>('SEMUA');
  const [filterMapel, setFilterMapel] = useState('SEMUA');

  // Active Exam Taking State (Student)
  const [activeTakingUlangan, setActiveTakingUlangan] = useState<Ulangan | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<UjianAttempt | null>(null);
  const [currentSoalIndex, setCurrentSoalIndex] = useState(0);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [viewingResultAttempt, setViewingResultAttempt] = useState<UjianAttempt | null>(null);

  // Modals for Tutor
  const [isCreateUlanganOpen, setIsCreateUlanganOpen] = useState(false);
  const [isCreateSoalOpen, setIsCreateSoalOpen] = useState(false);
  const [gradingAttempt, setGradingAttempt] = useState<UjianAttempt | null>(null);
  const [essayScores, setEssayScores] = useState<Record<string, number>>({});
  const [essayFeedback, setEssayFeedback] = useState('');

  // Form State for Ulangan (Tutor)
  const [formJudul, setFormJudul] = useState('');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formMapel, setFormMapel] = useState('Bahasa Indonesia');
  const [formKelas, setFormKelas] = useState('Kelas 8 Paket B');
  const [formPaket, setFormPaket] = useState<PaketType>(currentUser.paket || 'PAKET B');
  const [formDurasi, setFormDurasi] = useState(30);
  const [formKkm, setFormKkm] = useState(75);
  const [selectedSoalIds, setSelectedSoalIds] = useState<string[]>([]);

  // Form State for Soal (Tutor)
  const [soalTipe, setSoalTipe] = useState<TipeSoal>('PILIHAN_GANDA');
  const [soalPertanyaan, setSoalPertanyaan] = useState('');
  const [soalOpsiA, setSoalOpsiA] = useState('');
  const [soalOpsiB, setSoalOpsiB] = useState('');
  const [soalOpsiC, setSoalOpsiC] = useState('');
  const [soalOpsiD, setSoalOpsiD] = useState('');
  const [soalKunci, setSoalKunci] = useState('A');
  const [soalBobot, setSoalBobot] = useState(10);
  const [soalPembahasan, setSoalPembahasan] = useState('');

  const mapelOptions = useMemo(() => storage.getMapel(), []);

  const refreshData = () => {
    setUlanganList(storage.getUlangan(currentUser.role, isStudent ? currentUser.paket : undefined));
    setAttempts(storage.getUjianAttempts(undefined, isStudent ? currentUser.id : undefined));
    setBankSoal(storage.getBankSoal(isStudent ? currentUser.paket : undefined));
  };

  // Timer countdown for active exam taking
  useEffect(() => {
    if (!activeTakingUlangan || !currentAttempt || currentAttempt.status === 'SELESAI') {
      return;
    }

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
  }, [activeTakingUlangan, currentAttempt, timeRemainingSeconds]);

  // Student starts an exam
  const handleStartExam = (ulangan: Ulangan) => {
    const attempt = storage.startUjian(currentUser.id, currentUser.nama, currentUser.paket || 'PAKET B', ulangan);
    setCurrentAttempt(attempt);
    setActiveTakingUlangan(ulangan);
    setCurrentSoalIndex(0);
    setTimeRemainingSeconds(ulangan.durasi_menit * 60);
  };

  // Student answers a question
  const handleAnswerQuestion = (soalId: string, answerValue: string) => {
    if (!currentAttempt) return;
    storage.saveJawabanUjian(currentAttempt.id, soalId, answerValue);
    setCurrentAttempt({
      ...currentAttempt,
      jawaban: {
        ...currentAttempt.jawaban,
        [soalId]: answerValue
      }
    });
  };

  // Student final submits exam
  const handleFinalSubmit = () => {
    if (!activeTakingUlangan || !currentAttempt) return;
    const finalAttempt = storage.submitUjian(currentAttempt.id, activeTakingUlangan);
    setIsSubmitConfirmOpen(false);
    setActiveTakingUlangan(null);
    setCurrentAttempt(null);
    refreshData();
    if (finalAttempt) {
      googleSheetsSync.syncUjianAttempt(finalAttempt).catch(err => console.warn('Ujian attempt sync:', err));
      setViewingResultAttempt(finalAttempt);
    }
  };

  // Tutor saves new Ulangan
  const handleSaveUlangan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul.trim() || selectedSoalIds.length === 0) {
      alert('Mohon isi judul dan pilih minimal 1 soal dari bank soal.');
      return;
    }

    const daftarSoal = bankSoal.filter(s => selectedSoalIds.includes(s.id));

    const created = storage.addUlangan({
      judul: formJudul,
      deskripsi: formDeskripsi,
      mata_pelajaran: formMapel,
      kelas: formKelas,
      paket: formPaket,
      tutor_id: currentUser.id,
      tutor_nama: currentUser.nama,
      durasi_menit: formDurasi,
      kkm: formKkm,
      status: 'AKTIF',
      daftar_soal: daftarSoal
    });

    if (created) {
      googleSheetsSync.syncUlangan(created, 'add').catch(err => console.warn('Ulangan sync:', err));
    }

    setIsCreateUlanganOpen(false);
    refreshData();
  };

  // Tutor saves new Soal to Bank Soal
  const handleSaveSoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!soalPertanyaan.trim()) return;

    let opsi: string[] | undefined = undefined;
    if (soalTipe === 'PILIHAN_GANDA') {
      opsi = [
        `A. ${soalOpsiA}`,
        `B. ${soalOpsiB}`,
        `C. ${soalOpsiC}`,
        `D. ${soalOpsiD}`
      ];
    } else if (soalTipe === 'BENAR_SALAH') {
      opsi = ['Benar', 'Salah'];
    }

    storage.addSoal({
      mata_pelajaran: formMapel,
      paket: formPaket,
      tingkat_kesulitan: 'SEDANG',
      tipe: soalTipe,
      pertanyaan: soalPertanyaan,
      opsi_jawaban: opsi,
      kunci_jawaban: soalKunci,
      bobot_nilai: soalBobot,
      pembahasan: soalPembahasan
    });

    setIsCreateSoalOpen(false);
    setSoalPertanyaan('');
    setSoalOpsiA('');
    setSoalOpsiB('');
    setSoalOpsiC('');
    setSoalOpsiD('');
    refreshData();
  };

  // Tutor grades essay attempts
  const handleSaveGrading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingAttempt) return;

    let totalEssayScore = 0;
    Object.values(essayScores).forEach(sc => {
      totalEssayScore += Number(sc) || 0;
    });

    const updated = storage.gradeUjianAttempt(
      gradingAttempt.id,
      totalEssayScore,
      essayFeedback,
      currentUser.nama
    );

    if (updated) {
      googleSheetsSync.syncUjianAttempt(updated).catch(err => console.warn('Grading sync:', err));
    }

    setGradingAttempt(null);
    refreshData();
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ACTIVE EXAM TAKING INTERFACE (FOCUS MODE)
  if (activeTakingUlangan && currentAttempt) {
    const soalList = activeTakingUlangan.daftar_soal;
    const currentSoal = soalList[currentSoalIndex];
    const currentAnswer = currentAttempt.jawaban[currentSoal.id] || '';
    const answeredCount = Object.keys(currentAttempt.jawaban).length;
    const isUrgentTime = timeRemainingSeconds < 300; // < 5 mins

    return (
      <div className="fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                {activeTakingUlangan.judul}
              </h2>
              <p className="text-[11px] text-slate-500">
                {activeTakingUlangan.mata_pelajaran} • {activeTakingUlangan.paket}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto-save badge */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Jawaban Tersimpan Otomatis</span>
            </div>

            {/* Countdown Timer */}
            <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 font-mono font-black text-sm sm:text-base ${
              isUrgentTime
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-indigo-600 text-white shadow-md'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeRemainingSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Urgent alert bar if < 5 mins */}
        {isUrgentTime && (
          <div className="px-4 py-1.5 bg-rose-500 text-white text-center text-xs font-bold flex items-center justify-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Waktu pengerjaan tersisa kurang dari 5 menit! Periksa dan segera selesaikan jawaban Anda.</span>
          </div>
        )}

        {/* Main Exam Stage */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Question Viewer */}
          <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
            <div className="max-w-3xl w-full mx-auto space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="px-3 py-1 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-black text-xs">
                  Soal Nomor {currentSoalIndex + 1} dari {soalList.length}
                </span>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    Tipe: <strong>{currentSoal.tipe.replace('_', ' ')}</strong> (Bobot: {currentSoal.bobot_nilai || 10} Poin)
                  </span>
                  <TextToSpeechButton
                    text={`Soal nomor ${currentSoalIndex + 1}. ${currentSoal.pertanyaan}. ${
                      currentSoal.tipe === 'PILIHAN_GANDA' && currentSoal.opsi_jawaban
                        ? 'Pilihan: ' + currentSoal.opsi_jawaban.join('. ')
                        : ''
                    }`}
                    title={`Soal No ${currentSoalIndex + 1}`}
                    variant="compact"
                    size="xs"
                  />
                </div>
              </div>

              {/* Question Body */}
              <div className="text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed font-medium">
                {currentSoal.pertanyaan}
              </div>

              {/* Question Input by Type */}
              <div className="pt-2">
                {currentSoal.tipe === 'PILIHAN_GANDA' && currentSoal.opsi_jawaban && (
                  <div className="space-y-3">
                    {currentSoal.opsi_jawaban.map((opsi, idx) => {
                      const letter = String.fromCharCode(65 + idx); // A, B, C, D
                      const isSelected = currentAnswer.toUpperCase() === letter;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAnswerQuestion(currentSoal.id, letter)}
                          className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {letter}
                          </div>
                          <span className="text-xs sm:text-sm">{opsi.replace(/^[A-D]\.\s*/, '')}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {currentSoal.tipe === 'BENAR_SALAH' && (
                  <div className="grid grid-cols-2 gap-4">
                    {['Benar', 'Salah'].map(val => {
                      const isSelected = currentAnswer.toLowerCase() === val.toLowerCase();
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleAnswerQuestion(currentSoal.id, val)}
                          className={`p-5 rounded-2xl border font-bold text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                )}

                {currentSoal.tipe === 'ISIAN_SINGKAT' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">
                      Tuliskan jawaban singkat Anda:
                    </label>
                    <input
                      type="text"
                      value={currentAnswer}
                      onChange={e => handleAnswerQuestion(currentSoal.id, e.target.value)}
                      placeholder="Ketik jawaban..."
                      className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm"
                    />
                  </div>
                )}

                {currentSoal.tipe === 'URAIAN' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">
                      Tuliskan uraian penjelasan lengkap Anda:
                    </label>
                    <textarea
                      rows={5}
                      value={currentAnswer}
                      onChange={e => handleAnswerQuestion(currentSoal.id, e.target.value)}
                      placeholder="Ketik uraian jawaban secara rinci..."
                      className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm leading-relaxed"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="max-w-3xl w-full mx-auto pt-6 flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
              <button
                disabled={currentSoalIndex === 0}
                onClick={() => setCurrentSoalIndex(prev => Math.max(0, prev - 1))}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center gap-2 disabled:opacity-40 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              {currentSoalIndex < soalList.length - 1 ? (
                <button
                  onClick={() => setCurrentSoalIndex(prev => Math.min(soalList.length - 1, prev + 1))}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Selanjutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setIsSubmitConfirmOpen(true)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Kirim & Selesaikan Ulangan</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Question Palette Drawer */}
          <div className="w-full md:w-80 bg-white dark:bg-slate-900 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
                Nomor Soal ({answeredCount}/{soalList.length} Terjawab)
              </h4>

              <div className="grid grid-cols-5 gap-2">
                {soalList.map((s, idx) => {
                  const isAnswered = !!currentAttempt.jawaban[s.id];
                  const isActive = idx === currentSoalIndex;

                  return (
                    <button
                      key={s.id}
                      onClick={() => setCurrentSoalIndex(idx)}
                      className={`h-10 rounded-xl font-black text-xs flex items-center justify-center transition-all cursor-pointer ${
                        isActive
                          ? 'ring-2 ring-indigo-500 bg-indigo-600 text-white shadow-md'
                          : isAnswered
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsSubmitConfirmOpen(true)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>Selesaikan Ujian</span>
              </button>
            </div>
          </div>
        </div>

        {/* SUBMIT CONFIRMATION MODAL */}
        {isSubmitConfirmOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">
                Konfirmasi Penyelesaian Ulangan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Anda telah menjawab <strong>{answeredCount}</strong> dari <strong>{soalList.length}</strong> soal.
                {answeredCount < soalList.length && (
                  <span className="text-rose-600 font-bold block mt-1">
                    *Terdapat {soalList.length - answeredCount} soal yang belum Anda jawab.
                  </span>
                )}
                Apakah Anda yakin ingin mengakhiri dan mengirim seluruh lembar jawaban?
              </p>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitConfirmOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold cursor-pointer"
                >
                  Kembali ke Soal
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
                >
                  Ya, Kirim Jawaban
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // RESULT SCREEN AFTER SUBMIT
  if (viewingResultAttempt) {
    const ulangan = storage.getUlanganById(viewingResultAttempt.ulangan_id);
    const kkm = ulangan?.kkm || 75;
    const isPassed = (viewingResultAttempt.nilai_total || 0) >= kkm;

    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Award className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Hasil Ulangan Siswa
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {viewingResultAttempt.ulangan_judul}
          </h2>
          <p className="text-xs text-slate-500">
            Warga Belajar: <strong>{viewingResultAttempt.siswa_nama}</strong> ({viewingResultAttempt.siswa_paket})
          </p>
        </div>

        {/* Score Card */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 text-center space-y-3">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Total Nilai Akhir
          </div>
          <div className="text-4xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400">
            {viewingResultAttempt.nilai_total || 0}
            <span className="text-lg text-slate-400 font-normal"> / 100</span>
          </div>

          <div className="pt-2">
            <span className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black ${
              isPassed
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {isPassed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              <span>{isPassed ? 'TUNTAS (Memenuhi KKM)' : 'BELUM TUNTAS (Di Bawah KKM)'}</span>
            </span>
          </div>
        </div>

        {viewingResultAttempt.feedback_tutor && (
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs">
            <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-1">
              Catatan Ulasan Tutor:
            </span>
            <p className="text-slate-700 dark:text-slate-300 italic">
              "{viewingResultAttempt.feedback_tutor}"
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={() => setViewingResultAttempt(null)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
          >
            Kembali ke Daftar Ulangan
          </button>
        </div>
      </div>
    );
  }

  // TUTOR & STUDENT MAIN DASHBOARD VIEW
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>{isStudent ? 'Ulangan & Ujian Online' : 'Pusat Ujian & Bank Soal'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isStudent
              ? 'Evaluasi pemahaman materi pelajaran dengan sistem ujian interaktif berwaktu'
              : 'Susun paket ulangan online, kelola bank soal kesetaraan, dan evaluasi hasil belajar'}
          </p>
        </div>

        {!isStudent && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateSoalOpen(true)}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Bank Soal</span>
            </button>

            <button
              onClick={() => setIsCreateUlanganOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Paket Ulangan</span>
            </button>
          </div>
        )}
      </div>

      {/* Tutor Sub-Tabs */}
      {!isStudent && (
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
          {[
            { key: 'ULANGAN', label: `Daftar Ulangan (${ulanganList.length})` },
            { key: 'BANK_SOAL', label: `Bank Soal (${bankSoal.length})` },
            { key: 'HASIL_SISWA', label: `Hasil & Penilaian Siswa (${attempts.length})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setTutorTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
                tutorTab === tab.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* TUTOR TAB: BANK SOAL */}
      {!isStudent && tutorTab === 'BANK_SOAL' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <select
              value={filterMapel}
              onChange={e => setFilterMapel(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
            >
              <option value="SEMUA">Semua Mapel</option>
              {mapelOptions.map(m => (
                <option key={m.id} value={m.nama_mata_pelajaran}>
                  {m.nama_mata_pelajaran} ({m.paket})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {bankSoal
              .filter(s => filterMapel === 'SEMUA' || s.mata_pelajaran === filterMapel)
              .map((soal, idx) => (
                <div
                  key={soal.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-indigo-600">#{idx + 1}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800">
                        {soal.tipe}
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {soal.mata_pelajaran} ({soal.paket})
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm('Hapus soal ini dari Bank Soal?')) {
                          storage.deleteSoal(soal.id);
                          refreshData();
                        }
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="font-medium text-slate-900 dark:text-white leading-relaxed">
                    {soal.pertanyaan}
                  </p>

                  {soal.opsi_jawaban && (
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                      {soal.opsi_jawaban.map((op, oIdx) => (
                        <div key={oIdx} className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                          {op}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Kunci Jawaban: {soal.kunci_jawaban}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TUTOR TAB: HASIL & PENILAIAN SISWA */}
      {!isStudent && tutorTab === 'HASIL_SISWA' && (
        <div className="space-y-3">
          {attempts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Belum ada riwayat pengerjaan ulangan oleh siswa.
            </div>
          ) : (
            attempts.map(att => (
              <div
                key={att.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {att.siswa_nama}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                      {att.siswa_paket}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      Selesai: {att.selesai_pada}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300">
                    Ulangan: <strong>{att.ulangan_judul}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-black text-base text-indigo-600 dark:text-indigo-400">
                      {att.nilai_total || 0} / 100
                    </span>
                    <span className="text-[10px] block text-slate-400">
                      {att.dinilai ? '✓ Sudah Dinilai' : '⏳ Butuh Koreksi Uraian'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setGradingAttempt(att);
                      setEssayFeedback(att.feedback_tutor || 'Hasil memuaskan.');
                    }}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                  >
                    Koreksi & Review
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* STUDENT OR TUTOR ULANGAN LIST */}
      {(isStudent || tutorTab === 'ULANGAN') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {ulanganList.length === 0 ? (
            <div className="col-span-2 p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Award className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Belum ada ulangan yang tersedia
              </h4>
            </div>
          ) : (
            ulanganList.map(ulangan => {
              const myAttempt = attempts.find(a => a.ulangan_id === ulangan.id && (!isStudent || a.user_id === currentUser.id));
              const isCompleted = myAttempt?.status === 'SELESAI';

              return (
                <div
                  key={ulangan.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-200 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md ${
                          ulangan.paket === 'PAKET B'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}>
                          {ulangan.paket}
                        </span>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          {ulangan.mata_pelajaran}
                        </span>
                      </div>

                      {isStudent && isCompleted && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <Check className="w-3.5 h-3.5" />
                          <span>Nilai: {myAttempt.nilai_total}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                      {ulangan.judul}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {ulangan.deskripsi}
                    </p>

                    <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Durasi</span>
                        <strong className="text-indigo-600 dark:text-indigo-400">{ulangan.durasi_menit} Menit</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Jumlah Soal</span>
                        <strong>{ulangan.daftar_soal.length} Butir</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">KKM</span>
                        <strong className="text-emerald-600">{ulangan.kkm}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-850/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    {isStudent ? (
                      isCompleted ? (
                        <button
                          onClick={() => setViewingResultAttempt(myAttempt)}
                          className="flex-1 py-2.5 px-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Lihat Rincian Nilai</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartExam(ulangan)}
                          className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Play className="w-4 h-4" />
                          <span>Mulai Kerjakan Ulangan</span>
                        </button>
                      )
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs text-slate-400 font-medium">
                          Tutor: {ulangan.tutor_nama}
                        </span>

                        <button
                          onClick={() => {
                            if (confirm(`Hapus ulangan "${ulangan.judul}"?`)) {
                              storage.deleteUlangan(ulangan.id);
                              refreshData();
                            }
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* MODAL: CREATE ULANGAN (TUTOR) */}
      {isCreateUlanganOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] flex flex-col">
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-3">
              Buat Paket Ulangan Online Baru
            </h3>

            <form onSubmit={handleSaveUlangan} className="flex-1 overflow-y-auto space-y-3.5 text-xs pr-1">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Ulangan / Ujian
                </label>
                <input
                  type="text"
                  required
                  value={formJudul}
                  onChange={e => setFormJudul(e.target.value)}
                  placeholder="Contoh: Penilaian Harian Modul 3 PPKn"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Program Paket
                  </label>
                  <select
                    value={formPaket}
                    onChange={e => setFormPaket(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="PAKET B">PAKET B (SMP)</option>
                    <option value="PAKET C">PAKET C (SMA)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mata Pelajaran
                  </label>
                  <select
                    value={formMapel}
                    onChange={e => setFormMapel(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  >
                    {mapelOptions.filter(m => m.paket === formPaket).map(mp => (
                      <option key={mp.id} value={mp.nama_mata_pelajaran}>
                        {mp.nama_mata_pelajaran}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Durasi Pengerjaan (Menit)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={formDurasi}
                    onChange={e => setFormDurasi(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nilai KKM Kelulusan
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={formKkm}
                    onChange={e => setFormKkm(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Soal dari Bank Soal ({selectedSoalIds.length} Terpilih)
                </label>
                <div className="max-h-48 overflow-y-auto p-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2">
                  {bankSoal.map(s => {
                    const isChecked = selectedSoalIds.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className="flex items-start gap-2.5 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedSoalIds(prev => [...prev, s.id]);
                            } else {
                              setSelectedSoalIds(prev => prev.filter(id => id !== s.id));
                            }
                          }}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-[11px] block">{s.pertanyaan}</span>
                          <span className="text-[10px] text-slate-400">
                            {s.mata_pelajaran} • {s.tipe} ({s.bobot_nilai || 10} Poin)
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateUlanganOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
                >
                  Terbitkan Ulangan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE SOAL (TUTOR) */}
      {isCreateSoalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] flex flex-col">
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-3">
              Tambah Butir Soal Baru ke Bank Soal
            </h3>

            <form onSubmit={handleSaveSoal} className="flex-1 overflow-y-auto space-y-3.5 text-xs pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipe Soal
                  </label>
                  <select
                    value={soalTipe}
                    onChange={e => setSoalTipe(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="PILIHAN_GANDA">Pilihan Ganda (A-D)</option>
                    <option value="BENAR_SALAH">Benar / Salah</option>
                    <option value="ISIAN_SINGKAT">Isian Singkat</option>
                    <option value="URAIAN">Uraian / Esai</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bobot Nilai
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={soalBobot}
                    onChange={e => setSoalBobot(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pertanyaan / Soal
                </label>
                <textarea
                  rows={3}
                  required
                  value={soalPertanyaan}
                  onChange={e => setSoalPertanyaan(e.target.value)}
                  placeholder="Ketik teks pertanyaan..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl leading-relaxed"
                />
              </div>

              {soalTipe === 'PILIHAN_GANDA' && (
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Opsi Pilihan Ganda:
                  </label>
                  <input
                    type="text"
                    required
                    value={soalOpsiA}
                    onChange={e => setSoalOpsiA(e.target.value)}
                    placeholder="Pilihan A"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                  <input
                    type="text"
                    required
                    value={soalOpsiB}
                    onChange={e => setSoalOpsiB(e.target.value)}
                    placeholder="Pilihan B"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                  <input
                    type="text"
                    required
                    value={soalOpsiC}
                    onChange={e => setSoalOpsiC(e.target.value)}
                    placeholder="Pilihan C"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                  <input
                    type="text"
                    required
                    value={soalOpsiD}
                    onChange={e => setSoalOpsiD(e.target.value)}
                    placeholder="Pilihan D"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Kunci Jawaban Benar
                    </label>
                    <select
                      value={soalKunci}
                      onChange={e => setSoalKunci(e.target.value)}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-black text-indigo-600"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                </div>
              )}

              {soalTipe === 'BENAR_SALAH' && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kunci Jawaban
                  </label>
                  <select
                    value={soalKunci}
                    onChange={e => setSoalKunci(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                  >
                    <option value="Benar">Benar</option>
                    <option value="Salah">Salah</option>
                  </select>
                </div>
              )}

              {soalTipe === 'ISIAN_SINGKAT' && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kunci Jawaban Singkat
                  </label>
                  <input
                    type="text"
                    required
                    value={soalKunci}
                    onChange={e => setSoalKunci(e.target.value)}
                    placeholder="Ketik kata kunci jawaban yang tepat..."
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-medium"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateSoalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
                >
                  Simpan ke Bank Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GRADING ATTEMPT (TUTOR) */}
      {gradingAttempt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] flex flex-col">
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">
              Koreksi Jawaban: {gradingAttempt.siswa_nama}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Nilai Otomatis: <strong>{gradingAttempt.nilai_otomatis || 0}</strong> • Total Saat Ini: <strong>{gradingAttempt.nilai_total || 0}</strong>
            </p>

            <form onSubmit={handleSaveGrading} className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tambahan Nilai Uraian / Penyesuaian Skor
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={essayScores['manual'] || gradingAttempt.nilai_uraian || 0}
                  onChange={e => setEssayScores({ manual: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Evaluasi / Ulasan Tutor
                </label>
                <textarea
                  rows={3}
                  value={essayFeedback}
                  onChange={e => setEssayFeedback(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingAttempt(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
                >
                  Simpan Hasil Ujian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
