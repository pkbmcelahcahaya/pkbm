import React, { useState, useMemo } from 'react';
import {
  Award,
  Search,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  User as UserIcon,
  BookOpen,
  Layers,
  ChevronDown,
  X,
  FileSpreadsheet,
  BarChart3,
  Calendar,
  Sparkles,
  Printer,
  RefreshCw
} from 'lucide-react';
import { ModulQuizAttempt, User } from '../types';
import { storage } from '../services/storageService';
import { googleSheetsSync } from '../services/googleSheetsSyncService';
import { PrintPreviewModal } from './common/PrintPreviewModal';

interface ModulQuizResultsViewerProps {
  currentUser: User;
  onClose?: () => void;
}

export const ModulQuizResultsViewer: React.FC<ModulQuizResultsViewerProps> = ({
  currentUser,
  onClose
}) => {
  const [attempts, setAttempts] = useState<ModulQuizAttempt[]>(() => {
    return storage.getModulQuizAttempts();
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPaket, setFilterPaket] = useState<string>('SEMUA');
  const [filterMapel, setFilterMapel] = useState<string>('SEMUA');
  const [filterStatus, setFilterStatus] = useState<'SEMUA' | 'LULUS' | 'TIDAK_LULUS'>('SEMUA');
  const [selectedAttempt, setSelectedAttempt] = useState<ModulQuizAttempt | null>(null);
  const [detailFilterTipe, setDetailFilterTipe] = useState<'SEMUA' | 'BENAR' | 'SALAH'>('SEMUA');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ message: string; isError?: boolean } | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printDocConfig, setPrintDocConfig] = useState<{ type: 'REKAP_KUIS_100' | 'LEMBAR_NILAI_KUIS'; data: any; title: string }>({
    type: 'REKAP_KUIS_100',
    data: null,
    title: 'Rekap Nilai Kuis 100 Soal'
  });

  const handleSyncToSheets = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await googleSheetsSync.syncAllQuizAttempts(attempts);
      if (res.success) {
        setSyncFeedback({ message: `✅ Berhasil sinkron ${attempts.length} data kuis ke Google Sheets!` });
      } else {
        setSyncFeedback({ message: `⚠️ ${res.message}`, isError: true });
      }
    } catch (e: any) {
      setSyncFeedback({ message: `❌ Gagal sinkronisasi: ${e.message}`, isError: true });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(null), 5000);
    }
  };

  // Filtered Attempts
  const filteredAttempts = useMemo(() => {
    return attempts.filter(att => {
      // Role scope (Tutor with specific mapel or general)
      if (currentUser.role === 'TUTOR' && currentUser.mata_pelajaran && currentUser.mata_pelajaran !== 'Pengajar Kesetaraan') {
        const matchesTutorMapel = att.mata_pelajaran.toLowerCase().includes(currentUser.mata_pelajaran.toLowerCase());
        // Still allow seeing general if needed, but prioritizing mapel
      }

      if (filterPaket !== 'SEMUA' && att.paket !== filterPaket) return false;
      if (filterMapel !== 'SEMUA' && att.mata_pelajaran !== filterMapel) return false;
      if (filterStatus !== 'SEMUA' && att.status_kelulusan !== filterStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          att.user_nama.toLowerCase().includes(q) ||
          att.materi_judul.toLowerCase().includes(q) ||
          att.mata_pelajaran.toLowerCase().includes(q) ||
          (att.user_nisn && att.user_nisn.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [attempts, filterPaket, filterMapel, filterStatus, searchQuery, currentUser]);

  // Statistics
  const totalAttempts = filteredAttempts.length;
  const avgScore = totalAttempts > 0 ? Math.round(filteredAttempts.reduce((acc, a) => acc + a.nilai, 0) / totalAttempts) : 0;
  const passedCount = filteredAttempts.filter(a => a.status_kelulusan === 'LULUS').length;
  const passRate = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;
  const highestScore = totalAttempts > 0 ? Math.max(...filteredAttempts.map(a => a.nilai)) : 0;

  // Unique Mapel options
  const mapelOptions = useMemo(() => {
    const set = new Set(attempts.map(a => a.mata_pelajaran));
    return Array.from(set).sort();
  }, [attempts]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredAttempts.length === 0) {
      alert('Tidak ada data untuk diekspor.');
      return;
    }

    const headers = [
      'No',
      'Waktu Selesai',
      'Nama Siswa',
      'NISN',
      'Paket',
      'Mata Pelajaran',
      'Judul Modul',
      'Nilai (0-100)',
      'Total Benar',
      'Total Salah',
      'Durasi (Menit)',
      'Status Kelulusan'
    ];

    const rows = filteredAttempts.map((att, idx) => [
      idx + 1,
      new Date(att.completed_at).toLocaleString('id-ID'),
      `"${att.user_nama}"`,
      `"${att.user_nisn || '-'}"`,
      att.paket,
      `"${att.mata_pelajaran}"`,
      `"${att.materi_judul}"`,
      att.nilai,
      att.total_benar,
      att.total_salah,
      Math.round(att.durasi_detik / 60),
      att.status_kelulusan
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Kuis_100_Soal_PKBM_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white border border-indigo-900/50 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-400 text-slate-950 tracking-wider">
                STANDAR EVALUASI 100 SOAL
              </span>
              <span className="text-xs text-indigo-300 font-medium">
                Kurikulum Kesetaraan Paket B & Paket C
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              <span>Rekapitulasi Kuis Modul (100 Soal)</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Monitoring hasil evaluasi mandiri 100 butir soal per modul pembelajaran. Data terhubung otomatis dengan laporan kemajuan belajar Warga Belajar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setPrintDocConfig({
                  type: 'REKAP_KUIS_100',
                  data: {
                    paket: filterPaket,
                    mapel: filterMapel,
                    attempts: filteredAttempts
                  },
                  title: `Rekap Nilai Kuis 100 Soal - ${filterPaket !== 'SEMUA' ? filterPaket : 'Seluruh Paket'}`
                });
                setShowPrintModal(true);
              }}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              title="Cetak & Simpan PDF Rekapitulasi Nilai 100 Soal"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Rekap Nilai</span>
            </button>

            <button
              onClick={handleSyncToSheets}
              disabled={isSyncing}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              title="Kirim dan sinkronkan semua nilai kuis ke Google Sheets"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkron ke Sheets'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {syncFeedback && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              syncFeedback.isError
                ? 'bg-rose-500/20 text-rose-200 border border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
            }`}
          >
            <span>{syncFeedback.message}</span>
          </div>
        )}
      </div>

      {/* Summary KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Total Percobaan</span>
            <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalAttempts}
          </div>
          <span className="text-[11px] text-slate-500">Kuis 100 Soal Diselesaikan</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Rata-Rata Nilai</span>
            <BarChart3 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {avgScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-500">Skor Seluruh Peserta</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Tingkat Kelulusan</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {passRate}%
          </div>
          <span className="text-[11px] text-slate-500">{passedCount} dari {totalAttempts} Lulus (KKM ≥ 75)</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Nilai Tertinggi</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500">
            {highestScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-500">Skor Maksimal Diraih</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa, NISN, atau judul modul..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterPaket}
              onChange={e => setFilterPaket(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="SEMUA">Semua Paket</option>
              <option value="PAKET B">Paket B (SMP)</option>
              <option value="PAKET C">Paket C (SMA)</option>
            </select>

            <select
              value={filterMapel}
              onChange={e => setFilterMapel(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none max-w-[200px]"
            >
              <option value="SEMUA">Semua Mata Pelajaran</option>
              {mapelOptions.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="SEMUA">Semua Status</option>
              <option value="LULUS">LULUS (≥ 75)</option>
              <option value="TIDAK_LULUS">REMEDIAL (&lt; 75)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table of Quiz Attempts */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {filteredAttempts.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Award className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Belum ada data kuis 100 soal yang sesuai
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Data akan otomatis muncul setiap kali Warga Belajar menyelesaikan kuis evaluasi 100 soal pada modul.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Waktu</th>
                  <th className="p-3.5">Warga Belajar</th>
                  <th className="p-3.5">Program & Mapel</th>
                  <th className="p-3.5">Judul Modul</th>
                  <th className="p-3.5 text-center">Skor</th>
                  <th className="p-3.5 text-center">Benar / Salah</th>
                  <th className="p-3.5 text-center">Durasi</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAttempts.map(att => (
                  <tr key={att.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 whitespace-nowrap text-slate-500">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(att.completed_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block pl-5">
                        {new Date(att.completed_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {att.user_nama}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        NISN: {att.user_nisn || '-'}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-md mr-1.5 ${
                        att.paket === 'PAKET B'
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}>
                        {att.paket}
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {att.mata_pelajaran}
                      </span>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {att.materi_judul}
                      </div>
                      <span className="text-[10px] text-slate-400">100 Soal Kurikulum Terpadu</span>
                    </td>

                    <td className="p-3.5 text-center">
                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        {att.nilai}
                      </span>
                      <span className="text-[10px] text-slate-400 block">/ 100</span>
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{att.total_benar} B</span>
                      <span className="text-slate-400 mx-1">•</span>
                      <span className="text-rose-600 dark:text-rose-400 font-bold">{att.total_salah} S</span>
                    </td>

                    <td className="p-3.5 text-center text-slate-500 whitespace-nowrap">
                      {Math.round(att.durasi_detik / 60)} Menit
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap">
                      {att.status_kelulusan === 'LULUS' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          LULUS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          <XCircle className="w-3 h-3" />
                          REMEDIAL
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedAttempt(att)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 font-bold text-xs inline-flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Rincian</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: DETAIL 100 SOAL SISWA */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md ${
                    selectedAttempt.paket === 'PAKET B'
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300'
                  }`}>
                    {selectedAttempt.paket}
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {selectedAttempt.mata_pelajaran}
                  </span>
                  {selectedAttempt.status_kelulusan === 'LULUS' ? (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      ✓ LULUS (KKM ≥ 75)
                    </span>
                  ) : (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      ✗ PERLU REMEDIAL
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Lembar Evaluasi Kuis: {selectedAttempt.user_nama}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Modul: {selectedAttempt.materi_judul} • Selesai pada: {new Date(selectedAttempt.completed_at).toLocaleString('id-ID')}
                </p>
              </div>

              <button
                onClick={() => setSelectedAttempt(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Strip */}
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 grid grid-cols-4 gap-3 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">Skor Akhir</span>
                <strong className="text-lg font-black text-indigo-600 dark:text-indigo-400">{selectedAttempt.nilai} / 100</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Jawaban Benar</span>
                <strong className="text-lg font-black text-emerald-600">{selectedAttempt.total_benar} Butir</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Jawaban Salah</span>
                <strong className="text-lg font-black text-rose-600">{selectedAttempt.total_salah} Butir</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Durasi Pengerjaan</span>
                <strong className="text-lg font-black text-slate-700 dark:text-slate-200">{Math.round(selectedAttempt.durasi_detik / 60)} Menit</strong>
              </div>
            </div>

            {/* Sub-filter for detailed questions */}
            <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Daftar 100 Butir Soal & Kunci Jawaban
              </span>
              <div className="flex items-center gap-1">
                {(['SEMUA', 'BENAR', 'SALAH'] as const).map(tipe => (
                  <button
                    key={tipe}
                    onClick={() => setDetailFilterTipe(tipe)}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                      detailFilterTipe === tipe
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {tipe}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {selectedAttempt.soal_list
                ?.filter(soal => {
                  const studentAnswer = selectedAttempt.jawaban_user[soal.id];
                  const isCorrect = studentAnswer === soal.kunci_jawaban;
                  if (detailFilterTipe === 'BENAR') return isCorrect;
                  if (detailFilterTipe === 'SALAH') return !isCorrect;
                  return true;
                })
                .map((soal) => {
                  const studentAnswer = selectedAttempt.jawaban_user[soal.id];
                  const isCorrect = studentAnswer === soal.kunci_jawaban;

                  return (
                    <div
                      key={soal.id}
                      className={`p-4 rounded-2xl border text-xs space-y-3 transition-all ${
                        isCorrect
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                          : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-md font-black bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                          Nomor {soal.nomor}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            Tingkat: {soal.tingkat_kesulitan}
                          </span>
                          {isCorrect ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                              ✓ Benar
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold text-[10px]">
                              ✗ Salah
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="font-semibold text-slate-900 dark:text-white leading-relaxed">
                        {soal.pertanyaan}
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {soal.pilihan.map((pil, pIdx) => {
                          const isSelectedByStudent = studentAnswer === pIdx;
                          const isKeyAnswer = soal.kunci_jawaban === pIdx;

                          let optionClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                          if (isKeyAnswer) {
                            optionClass = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-400 font-bold';
                          } else if (isSelectedByStudent && !isCorrect) {
                            optionClass = 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border-rose-400 font-bold';
                          }

                          return (
                            <div
                              key={pIdx}
                              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${optionClass}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-black">{String.fromCharCode(65 + pIdx)}.</span>
                                <span>{pil}</span>
                              </div>
                              {isKeyAnswer && <span className="text-[10px] font-bold text-emerald-600">✓ Kunci</span>}
                              {isSelectedByStudent && !isCorrect && (
                                <span className="text-[10px] font-bold text-rose-600">✗ Dipilih Siswa</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Pembahasan */}
                      {soal.pembahasan && (
                        <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-slate-700 dark:text-slate-300">
                          <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">
                            💡 Pembahasan & Referensi Materi:
                          </strong>
                          <p className="text-[11px] leading-relaxed">
                            {soal.pembahasan}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setPrintDocConfig({
                    type: 'LEMBAR_NILAI_KUIS',
                    data: selectedAttempt,
                    title: `Lembar Nilai - ${selectedAttempt.user_nama}`
                  });
                  setShowPrintModal(true);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Lembar Nilai Siswa</span>
              </button>

              <button
                onClick={() => setSelectedAttempt(null)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Preview & PDF Modal */}
      {showPrintModal && (
        <PrintPreviewModal
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          defaultDocType={printDocConfig.type}
          docData={printDocConfig.data}
          title={printDocConfig.title}
        />
      )}
    </div>
  );
};
