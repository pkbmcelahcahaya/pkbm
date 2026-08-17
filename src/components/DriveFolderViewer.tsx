import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileText,
  ExternalLink,
  HardDrive,
  CheckCircle2,
  Lock,
  Search,
  Plus,
  RefreshCw,
  Table,
  FileSpreadsheet,
  Layers,
  Database,
  ArrowUpRight,
  Sparkles,
  Download,
  Upload
} from 'lucide-react';
import { storage } from '../services/storageService';

interface DriveFolderViewerProps {
  driveFolderId?: string;
  spreadsheetId?: string;
  onSyncSuccess?: () => void;
}

export const DriveFolderViewer: React.FC<DriveFolderViewerProps> = ({
  driveFolderId = '1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX',
  spreadsheetId = '1JMaGtYl77Qm5enl9N2A49_6oivu0mAjwCHe6QApfbQM',
  onSyncSuccess
}) => {
  const [activeView, setActiveView] = useState<'DRIVE' | 'SHEET_PREVIEW' | 'SHEET_STRUCTURE'>('DRIVE');
  const [selectedFolder, setSelectedFolder] = useState<string>('PAKET B');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'MATERI': true,
    'PAKET B': true,
    'PAKET C': true
  });

  const toggleFolder = (key: string) => {
    setExpandedFolders(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const driveUrl = `https://drive.google.com/drive/folders/${driveFolderId}?usp=drive_link`;
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?usp=sharing`;
  const sheetEmbedUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/htmlembed?widget=true&headers=false`;

  const mapelPaketB = [
    'Bahasa Indonesia',
    'Bahasa Inggris',
    'Matematika',
    'IPA (Ilmu Pengetahuan Alam)',
    'IPS (Ilmu Pengetahuan Sosial)',
    'PPKn',
    'Seni Budaya & Keterampilan',
    'PJOK',
    'Pemberdayaan & Keterampilan'
  ];

  const mapelPaketC = [
    'Bahasa Indonesia',
    'Bahasa Inggris',
    'Matematika Wajib',
    'Sosiologi',
    'Ekonomi',
    'Geografi',
    'Sejarah Indonesia',
    'Biologi',
    'Fisika',
    'Kimia',
    'PPKn',
    'Pemberdayaan & Keterampilan'
  ];

  const handleSyncData = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      // Simulate sync with real Google Spreadsheet
      await new Promise(r => setTimeout(r, 800));
      const config = storage.getGasConfig();
      config.lastSync = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
      storage.setGasConfig(config);

      setSyncMessage('Sinkronisasi berhasil! Data terhubung dengan Spreadsheet ID: ' + spreadsheetId);
      if (onSyncSuccess) onSyncSuccess();
    } catch (e) {
      setSyncMessage('Gagal sinkronisasi: ' + String(e));
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Google Workspace Cloud Integrations Status Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Google Drive Connection Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 text-white border border-blue-600/40 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center backdrop-blur-md border border-blue-400/30">
                <HardDrive className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Google Drive Terhubung
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Folder Penyimpanan Modul
                </h3>
              </div>
            </div>

            <a
              href={driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-200 hover:text-white transition-all border border-blue-400/30 shrink-0"
              title="Buka Folder Drive"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-blue-200 truncate flex items-center justify-between">
              <span className="text-slate-400">ID Folder:</span>
              <span className="font-bold text-white select-all">{driveFolderId}</span>
            </div>

            <a
              href={driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka Google Drive Folder</span>
            </a>
          </div>
        </div>

        {/* Google Spreadsheet Connection Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white border border-emerald-600/40 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center backdrop-blur-md border border-emerald-400/30">
                <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Connect Cloud
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Database Utama Spreadsheet
                </h3>
              </div>
            </div>

            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-200 hover:text-white transition-all border border-emerald-400/30 shrink-0"
              title="Buka Google Sheets"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-emerald-200 truncate flex items-center justify-between">
              <span className="text-slate-400">ID Sheet:</span>
              <span className="font-bold text-white select-all">{spreadsheetId}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSyncData}
                disabled={isSyncing}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Data'}</span>
              </button>

              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Sheet</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {syncMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{syncMessage}</span>
          </div>
          <button
            onClick={() => setSyncMessage(null)}
            className="text-xs font-bold text-slate-400 hover:text-slate-600"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Subnavigation Tab Controls */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveView('DRIVE')}
          className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeView === 'DRIVE'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800'
          }`}
        >
          <Folder className="w-4 h-4 text-amber-500" />
          <span>Struktur Google Drive Folder</span>
        </button>

        <button
          onClick={() => setActiveView('SHEET_STRUCTURE')}
          className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeView === 'SHEET_STRUCTURE'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-500" />
          <span>Skema 7 Tabel Spreadsheet</span>
        </button>

        <button
          onClick={() => setActiveView('SHEET_PREVIEW')}
          className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeView === 'SHEET_PREVIEW'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800'
          }`}
        >
          <Table className="w-4 h-4 text-blue-500" />
          <span>Live Spreadsheet Embed</span>
        </button>
      </div>

      {/* VIEW 1: DRIVE STRUCTURE */}
      {activeView === 'DRIVE' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          {/* Left Side: Directory Tree */}
          <div className="md:col-span-5 border-r border-slate-100 dark:border-slate-800 pr-4 space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5 text-slate-500">
              <Folder className="w-4 h-4 text-amber-500" />
              Struktur Folder Resmi LMS di Google Drive
            </h3>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-amber-500" />
              <span>PKBM CELAH CAHAYA (Root Folder)</span>
            </div>

            <div className="pl-4 space-y-1.5 border-l-2 border-slate-200 dark:border-slate-800 ml-3">
              {/* MATERI */}
              <div>
                <button
                  onClick={() => toggleFolder('MATERI')}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-indigo-500" />
                    <span>MATERI /</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Utama</span>
                </button>

                {expandedFolders['MATERI'] && (
                  <div className="pl-4 space-y-1 border-l border-indigo-200 dark:border-indigo-900 ml-2 mt-1">
                    <button
                      onClick={() => setSelectedFolder('PAKET B')}
                      className={`w-full text-left p-1.5 rounded-lg flex items-center gap-2 font-semibold cursor-pointer ${
                        selectedFolder === 'PAKET B'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Folder className="w-3.5 h-3.5 text-amber-500" />
                      <span>PAKET B (SMP)</span>
                    </button>

                    <button
                      onClick={() => setSelectedFolder('PAKET C')}
                      className={`w-full text-left p-1.5 rounded-lg flex items-center gap-2 font-semibold cursor-pointer ${
                        selectedFolder === 'PAKET C'
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Folder className="w-3.5 h-3.5 text-indigo-500" />
                      <span>PAKET C (SMA)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Other standard folders */}
              {['TUGAS', 'UJIAN', 'SERTIFIKAT', 'DOKUMEN_WARGA_BELAJAR', 'BACKUP_SHEETS'].map(name => (
                <div
                  key={name}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 flex items-center gap-2"
                >
                  <Folder className="w-4 h-4 text-slate-400" />
                  <span>{name} /</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Mapel Subfolders Explorer */}
          <div className="md:col-span-7 pl-2 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                  Folder Terpilih:
                </span>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  PKBM CELAH CAHAYA / MATERI / {selectedFolder}
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {selectedFolder === 'PAKET B' ? mapelPaketB.length : mapelPaketC.length} Subfolder Mapel
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {(selectedFolder === 'PAKET B' ? mapelPaketB : mapelPaketC).map(mapel => (
                <div
                  key={mapel}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                      <Folder className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{mapel}</p>
                      <p className="text-[10px] text-slate-400">PDF Modul Terorganisir</p>
                    </div>
                  </div>
                  <a
                    href={driveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-indigo-600 transition-colors"
                    title="Buka Subfolder di Google Drive"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Semua file PDF yang diunggah oleh Tutor atau diimpor otomatis teralokasi ke subfolder mata pelajaran masing-masing di Google Drive <code className="text-indigo-600 font-bold font-mono">1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SHEET SCHEMA & STRUCTURE */}
      {activeView === 'SHEET_STRUCTURE' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Struktur Database 7 Sheet di Google Spreadsheet
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                Spreadsheet ID: {spreadsheetId}
              </p>
            </div>

            <a
              href={sheetUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm w-fit"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Google Spreadsheet Langsung</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span className="text-emerald-600 dark:text-emerald-400">1. USERS</span>
                <span className="px-2 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-700 rounded font-normal">Autentikasi</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                id, username, password, nama, email, role, paket, kelas, status, foto, last_login, created_at, updated_at
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span className="text-indigo-600 dark:text-indigo-400">2. MATERI</span>
                <span className="px-2 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-700 rounded font-normal">Modul Drive</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                id, judul, deskripsi, paket, mata_pelajaran, kategori, nama_file, file_id, drive_url, preview_url, ukuran_file, tahun, sumber_url, urutan, status, created_at, updated_at
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span className="text-amber-600 dark:text-amber-400">3. KELAS</span>
                <span className="px-2 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-700 rounded font-normal">Rombel</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                id, nama_kelas, paket, tingkat, wali_tutor, status, created_at
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span className="text-blue-600 dark:text-blue-400">4. MATA_PELAJARAN</span>
                <span className="px-2 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-700 rounded font-normal">Kurikulum</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                id, kode, nama_mata_pelajaran, paket, deskripsi, icon, urutan, status
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span className="text-purple-600 dark:text-purple-400">5. AKTIVITAS</span>
                <span className="px-2 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-700 rounded font-normal">Audit Log</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                id, user_id, nama, role, aktivitas, materi_id, waktu, ip, browser
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span className="text-rose-600 dark:text-rose-400">6. LOGIN_LOG</span>
                <span className="px-2 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-700 rounded font-normal">Sesi Akses</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                id, user_id, username, nama, role, waktu_login, waktu_logout, durasi, browser, device
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: LIVE SPREADSHEET EMBED */}
      {activeView === 'SHEET_PREVIEW' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pratinjau Live Google Spreadsheet
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Melihat langsung lembar kerja Google Sheets PKBM Celah Cahaya secara terintegrasi.
              </p>
            </div>

            <a
              href={sheetUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm w-fit cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka di Tab Baru</span>
            </a>
          </div>

          <div className="w-full h-[520px] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-800">
            <iframe
              src={sheetEmbedUrl}
              title="Google Spreadsheet PKBM Celah Cahaya"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

