import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  HardDrive,
  Database,
  ExternalLink,
  ShieldCheck,
  X,
  FileSpreadsheet,
  FolderGit2,
  Sparkles,
  Settings,
  Radio,
  FileCode
} from 'lucide-react';
import { storage } from '../../services/storageService';
import { googleSheetsSync } from '../../services/googleSheetsSyncService';
import { MASTER_LEMBAGA } from '../../data/lembagaConfig';
import { User } from '../../types';

interface DataSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
  onOpenGasGuide?: () => void;
  onOpenGuide?: () => void;
  onDataSynced?: () => void;
  currentUser?: User | null;
}

export const DataSyncModal: React.FC<DataSyncModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  onOpenGasGuide,
  onOpenGuide,
  onDataSynced,
  currentUser
}) => {
  if (!isOpen || (currentUser && currentUser.role !== 'ADMIN')) return null;

  const [syncState, setSyncState] = useState<'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'ACTIONS' | 'TABLES' | 'GAS_INFO'>('ACTIONS');
  const [isPushing, setIsPushing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testLatency, setTestLatency] = useState<number | null>(null);

  const gasConfig = storage.getGasConfig();

  // Item counts
  const usersCount = storage.getUsers().length;
  const materiCount = storage.getMateri().length;
  const quizCount = storage.getModulQuizAttempts().length;
  const ppdbCount = storage.getPendaftaran().length;
  const tugasCount = storage.getTugas().length;
  const submitCount = storage.getPengumpulanTugas().length;
  const ulanganCount = storage.getUlangan().length;
  const ujianAttemptCount = storage.getUjianAttempts().length;
  const tatapMukaCount = storage.getTatapMuka().length;

  useEffect(() => {
    const unsubscribe = googleSheetsSync.subscribeStatus((st, msg) => {
      setSyncState(st);
      if (msg) setStatusMessage(msg);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handlePushData = async () => {
    setIsPushing(true);
    setStatusMessage('Sedang mengirim seluruh data aplikasi ke Google Sheets...');
    try {
      const result = await googleSheetsSync.pushAllToGoogleSheets();
      setStatusMessage(result.message);
    } catch (e: any) {
      setStatusMessage(`Gagal: ${e.message}`);
    } finally {
      setIsPushing(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestLatency(null);
    try {
      const result = await googleSheetsSync.testConnection();
      setStatusMessage(result.message);
      if (result.latency !== undefined) {
        setTestLatency(result.latency);
      }
    } catch (e: any) {
      setStatusMessage(`Koneksi Gagal: ${e.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-indigo-50/50 dark:from-emerald-950/20 dark:to-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Pusat Sinkronisasi Google Sheets</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    syncState === 'SYNCING'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : gasConfig.webAppUrl
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      syncState === 'SYNCING'
                        ? 'bg-amber-500 animate-ping'
                        : gasConfig.webAppUrl
                        ? 'bg-emerald-500'
                        : 'bg-rose-500'
                    }`}
                  />
                  <span>
                    {syncState === 'SYNCING'
                      ? 'Sinkronisasi...'
                      : gasConfig.webAppUrl
                      ? '🟢 Terhubung'
                      : '🔴 Belum Konfigurasi'}
                  </span>
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Penyimpanan Utama Google Sheets • NPSN {MASTER_LEMBAGA.npsn}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alert Banner if any */}
        {statusMessage && (
          <div className="bg-slate-100 dark:bg-slate-800/80 px-6 py-2.5 border-b border-slate-200 dark:border-slate-700/60 text-xs font-medium flex items-center justify-between gap-3 text-slate-800 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{statusMessage}</span>
            </div>
            {testLatency !== null && (
              <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                {testLatency} ms
              </span>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('ACTIONS')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ACTIONS'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Kirim Data ke Sheets</span>
          </button>
          <button
            onClick={() => setActiveTab('TABLES')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'TABLES'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>12 Tabel Database Sheets</span>
          </button>
          <button
            onClick={() => setActiveTab('GAS_INFO')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'GAS_INFO'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Info Google Apps Script</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'ACTIONS' && (
            <div className="space-y-6">
              {/* Featured Action Card: Kirim Data */}
              <div className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50/60 to-white dark:from-emerald-950/30 dark:to-slate-900 flex flex-col justify-between space-y-5 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                        Kirim Data (Aplikasi ➔ Google Sheets)
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">
                        Sinkronisasi satu arah yang aman ke spreadsheet master
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                    Mengirim seluruh data aplikasi saat ini secara komprehensif ke 12 sheet Google Sheets (Pengguna, Modul, Kuis, PPDB, Tugas, Nilai, Ulangan, Presensi) tanpa ada field atau kolom yang terpotong.
                  </p>
                </div>

                <button
                  onClick={handlePushData}
                  disabled={isPushing}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all text-sm"
                >
                  <UploadCloud className={`w-4 h-4 ${isPushing ? 'animate-bounce' : ''}`} />
                  <span>{isPushing ? 'Sedang Mengirim Data...' : 'Kirim Seluruh Data ke Google Sheets Sekarang'}</span>
                </button>
              </div>

              {/* Quick Connection Tester */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-emerald-500" />
                    <span>Status Endpoint Google Apps Script</span>
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    ID Spreadsheet: <span className="font-mono text-slate-700 dark:text-slate-300">{gasConfig.spreadsheetId || '1JMaGtYl77Qm5enl9N2A49_6oivu0mAjwCHe6QApfbQM'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer transition-colors"
                  >
                    {isTesting ? 'Menguji...' : 'Uji Ping Koneksi'}
                  </button>
                  {onOpenSettings && (
                    <button
                      onClick={onOpenSettings}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold text-xs cursor-pointer transition-colors"
                    >
                      Ubah URL
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'TABLES' && (
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                Sistem mengintegrasikan 12 tabel Google Sheets dengan fitur <strong>Auto-Schema Migration</strong> (kolom baru akan dibuat otomatis tanpa menghapus data sebelumnya):
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: 'USERS', desc: 'Akun Siswa, Tutor, dan Administrator', count: usersCount },
                  { name: 'MATERI', desc: '121 E-Modul Pembelajaran Paket B & C', count: materiCount },
                  { name: 'MODUL_QUIZ_ATTEMPTS', desc: 'Hasil Evaluasi Kuis 100 Soal Modul', count: quizCount },
                  { name: 'PENDAFTARAN_PPDB', desc: 'Data Formulir & Berkas PPDB 2026', count: ppdbCount },
                  { name: 'TUGAS', desc: 'Daftar Tugas & Petunjuk dari Tutor', count: tugasCount },
                  { name: 'PENGUMPULAN_TUGAS', desc: 'Jawaban & Berkas Pengumpulan Siswa', count: submitCount },
                  { name: 'ULANGAN', desc: 'Bank Soal Ujian / Ulangan Online', count: ulanganCount },
                  { name: 'UJIAN_ATTEMPTS', desc: 'Lembar Pengerjaan & Nilai Ujian Siswa', count: ujianAttemptCount },
                  { name: 'TATAP_MUKA', desc: 'Jadwal Webinar & Kelas Tatap Muka', count: tatapMukaCount },
                  { name: 'PROGRESS_BELAJAR', desc: 'Pelacak Halaman Baca Modul Siswa', count: 'Real-time' },
                  { name: 'AKTIVITAS', desc: 'Log Audit & Jejak Aktivitas Pengguna', count: 'Audit' },
                  { name: 'SETTINGS', desc: 'Konfigurasi Lembaga & Kurikulum PKBM', count: 'Master' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-[10px]">
                      {typeof item.count === 'number' ? `${item.count} Record` : item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'GAS_INFO' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Petunjuk Deploy Google Apps Script</span>
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                  Pastikan skrip Google Apps Script di-deploy sebagai Web App dengan pengaturan:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
                  <li><strong>Execute as:</strong> Me (akun Google Anda)</li>
                  <li><strong>Who has access:</strong> Anyone (agar aplikasi dapat mengirim dan menarik data tanpa login OAuth)</li>
                </ul>
              </div>

              {onOpenGasGuide && (
                <button
                  onClick={onOpenGasGuide}
                  className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <FileCode className="w-4 h-4 text-indigo-500" />
                  <span>Lihat Panduan & Salin Kode Google Apps Script</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            PKBM Celah Cahaya • Cloud Sync Engine v4.0
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold rounded-xl cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
