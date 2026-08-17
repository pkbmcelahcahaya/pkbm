import React, { useState } from 'react';
import {
  DownloadCloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  ExternalLink,
  ShieldCheck,
  FolderSync,
  Layers,
  Database,
  Search,
  Filter,
  Check,
  XCircle,
  Play,
  Trash2,
  Copy,
  Sparkles,
  Code,
  X
} from 'lucide-react';
import { ImportItem } from '../types';
import { CATALOGUE_PAKET_B, CATALOGUE_PAKET_C } from '../data/importCatalogue';
import { storage } from '../services/storageService';
import { getAllGasFiles } from '../services/gasCodeGenerator';

interface ImportManagerProps {
  onImportComplete?: () => void;
}

export const ImportManager: React.FC<ImportManagerProps> = ({ onImportComplete }) => {
  const [importQueue, setImportQueue] = useState<ImportItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentProcessingItem, setCurrentProcessingItem] = useState<ImportItem | null>(null);
  const [currentStepText, setCurrentStepText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('SEMUA');

  // Counters
  const [stats, setStats] = useState({
    total: 0,
    berhasil: 0,
    duplikat: 0,
    gagal: 0
  });

  const [showScriptModal, setShowScriptModal] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const directScript = getAllGasFiles().find(f => f.name === 'DirectDriveDownloader.gs')?.code || '';

  const handleCopyScript = () => {
    navigator.clipboard.writeText(directScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleStartImport = async (type: 'PAKET B' | 'PAKET C' | 'ALL', forceOverwrite = false) => {
    if (isProcessing) return;

    let itemsToImport: ImportItem[] = [];
    if (type === 'PAKET B') {
      itemsToImport = CATALOGUE_PAKET_B.map(item => ({ ...item, status: 'MENUNGGU' }));
    } else if (type === 'PAKET C') {
      itemsToImport = CATALOGUE_PAKET_C.map(item => ({ ...item, status: 'MENUNGGU' }));
    } else {
      itemsToImport = [
        ...CATALOGUE_PAKET_B.map(item => ({ ...item, status: 'MENUNGGU' as const })),
        ...CATALOGUE_PAKET_C.map(item => ({ ...item, status: 'MENUNGGU' as const }))
      ];
    }

    setImportQueue(itemsToImport);
    setIsProcessing(true);
    setProgressPercent(0);

    const result = await storage.importBatchMateri(itemsToImport, (progress, item) => {
      setProgressPercent(progress);
      setCurrentProcessingItem(item);
      setCurrentStepText(`Membaca sumber ${item.paket} ➜ Mengunduh metadata PDF ➜ Menyiapkan tautan Google Drive (${progress}%)`);
      setImportQueue([...itemsToImport]);
    }, forceOverwrite);

    setStats({
      total: itemsToImport.length,
      berhasil: result.berhasil,
      duplikat: result.duplikat,
      gagal: result.gagal
    });

    setImportQueue([...result.items]);
    setIsProcessing(false);
    setCurrentProcessingItem(null);
    setCurrentStepText(`Proses import selesai! Berhasil: ${result.berhasil}, Duplikat: ${result.duplikat}, Gagal: ${result.gagal}`);

    if (onImportComplete) onImportComplete();
  };

  const handleResetDuplicates = () => {
    if (confirm('Bersihkan status duplikat dan reset database modul agar dapat di-import ulang dari awal?')) {
      storage.resetMateriToDefault();
      setImportQueue([]);
      setStats({ total: 0, berhasil: 0, duplikat: 0, gagal: 0 });
      alert('Status duplikat & antrean berhasil di-reset!');
      if (onImportComplete) onImportComplete();
    }
  };

  const handleRetryFailed = async () => {
    const failedItems = importQueue.filter(i => i.status === 'GAGAL');
    if (failedItems.length === 0) {
      alert('Tidak ada item yang berstatus gagal.');
      return;
    }

    setIsProcessing(true);
    setProgressPercent(0);

    const resetFailed = failedItems.map(i => ({ ...i, status: 'MENUNGGU' as const }));
    const result = await storage.importBatchMateri(resetFailed, (progress, item) => {
      setProgressPercent(progress);
      setCurrentProcessingItem(item);
      setCurrentStepText(`Mencoba ulang: ${item.judul} (${progress}%)`);
    });

    // Update main queue
    const updatedQueue = importQueue.map(item => {
      const retried = result.items.find(r => r.id === item.id);
      return retried || item;
    });

    setImportQueue(updatedQueue);
    setIsProcessing(false);
    setCurrentProcessingItem(null);
    if (onImportComplete) onImportComplete();
  };

  const filteredQueue = importQueue.filter(item => {
    const matchStatus = statusFilter === 'SEMUA' || item.status === statusFilter;
    const matchSearch =
      item.judul.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.mata_pelajaran.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.nama_file.toLowerCase().includes(searchFilter.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Importer Hub Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              <DownloadCloud className="w-4 h-4" />
              <span>Pusat Import & Download Modul Kesetaraan</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Download & Simpan Modul Paket B & C ke Google Drive
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Mengunduh seluruh katalog modul dari <span className="text-amber-300 font-semibold">modul.pkbm.id/modul-paket-b.html</span> dan <span className="text-indigo-300 font-semibold">modul.pkbm.id/modul-paket-c.html</span>, mengunggah ke Google Drive (<code className="text-amber-300 font-mono">1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX</code>), dan sinkronisasi metadata ke Spreadsheet.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleStartImport('ALL')}
              disabled={isProcessing}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 hover:opacity-95 active:scale-95 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <DownloadCloud className="w-4 h-4 text-slate-950" />
              <span>Download Semua Paket (B & C)</span>
            </button>
            <button
              onClick={() => setShowScriptModal(true)}
              className="px-4 py-3 rounded-2xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 border border-indigo-400/30 transition-all cursor-pointer"
            >
              <Code className="w-4 h-4 text-amber-300" />
              <span>Skrip 1-Klik Google Apps Script</span>
            </button>
            <a
              href="https://drive.google.com/drive/folders/1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX?usp=drive_link"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka Google Drive</span>
            </a>
          </div>
        </div>
      </div>

      {/* Notice regarding Browser vs Apps Script Execution */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Mengapa File Harus Diunduh melalui Google Apps Script?
            </h4>
            <p className="mt-0.5 text-slate-600 dark:text-slate-300 leading-relaxed">
              Browser web tidak memiliki izin langsung untuk membuat file PDF fisik di dalam Google Drive tanpa eksekusi script Google Apps Script. Untuk memasukkan semua file PDF asli ke folder <code className="font-mono font-bold text-amber-600 dark:text-amber-400">1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX</code>, jalankan fungsi <code className="font-mono font-bold text-indigo-600 dark:text-indigo-400">downloadDanSimpanSemuaModulKeDrive</code> di Apps Script Spreadsheet Anda.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowScriptModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lihat Skrip & Panduan Eksekusi</span>
          </button>
        </div>
      </div>

      {/* Sources Control Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Source Paket B */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                SUMBER MATERI PAKET B (SMP)
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {CATALOGUE_PAKET_B.length} Modul Tersedia
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
              Kurikulum Kesetaraan Paket B
            </h3>
            <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-1 mb-3">
              <ExternalLink className="w-3.5 h-3.5" />
              <a href="https://modul.pkbm.id/modul-paket-b.html" target="_blank" rel="noreferrer" className="hover:underline">
                https://modul.pkbm.id/modul-paket-b.html
              </a>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Mencakup modul Bahasa Indonesia, Matematika, IPA, IPS, Bahasa Inggris, PPKn, Seni Budaya, dan PJOK.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Folder: <code className="font-mono text-slate-600 dark:text-slate-300">MATERI/PAKET B/</code></span>
            <button
              onClick={() => handleStartImport('PAKET B')}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Import Semua Materi Paket B</span>
            </button>
          </div>
        </div>

        {/* Source Paket C */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
                SUMBER MATERI PAKET C (SMA)
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {CATALOGUE_PAKET_C.length} Modul Tersedia
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
              Kurikulum Kesetaraan Paket C
            </h3>
            <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-1 mb-3">
              <ExternalLink className="w-3.5 h-3.5" />
              <a href="https://modul.pkbm.id/modul-paket-c.html" target="_blank" rel="noreferrer" className="hover:underline">
                https://modul.pkbm.id/modul-paket-c.html
              </a>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Mencakup Bahasa Indonesia, Sosiologi, Ekonomi, Geografi, Sejarah Indonesia, Matematika Wajib, Bahasa Inggris, Biologi, Fisika, Kimia, dan PPKn.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Folder: <code className="font-mono text-slate-600 dark:text-slate-300">MATERI/PAKET C/</code></span>
            <button
              onClick={() => handleStartImport('PAKET C')}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Import Semua Materi Paket C</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Reset & Overwrite Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="text-xs text-slate-500">
          Status bermasalah atau terdeteksi duplikat? Bersihkan antrean untuk memulai ulang:
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDuplicates}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Reset Status Duplikat</span>
          </button>
          <button
            onClick={() => handleStartImport('ALL', true)}
            disabled={isProcessing}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
            <span>Paksa Import Ulang Semua (Overwrite)</span>
          </button>
        </div>
      </div>

      {/* Live Import Engine & Progress State */}
      {isProcessing && (
        <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center animate-spin">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-indigo-950 dark:text-indigo-200">
                  Sedang Menjalankan Batch Import Modul PDF...
                </h4>
                <p className="text-xs text-indigo-800 dark:text-indigo-300 font-mono mt-0.5">
                  {currentStepText}
                </p>
              </div>
            </div>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full h-3 bg-indigo-200 dark:bg-indigo-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {currentProcessingItem && (
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate mr-2">
                📄 {currentProcessingItem.judul}
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 font-bold shrink-0">
                {currentProcessingItem.paket}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Stats Summary Bar */}
      {importQueue.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500">Total PDF Ditemukan</p>
            <h4 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {stats.total || importQueue.length}
            </h4>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
            <p className="text-xs text-emerald-700 dark:text-emerald-400">Total Berhasil</p>
            <h4 className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
              {stats.berhasil}
            </h4>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
            <p className="text-xs text-amber-700 dark:text-amber-400">Total Duplikat (Dilewati)</p>
            <h4 className="text-xl font-black text-amber-700 dark:text-amber-300 mt-0.5">
              {stats.duplikat}
            </h4>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
            <p className="text-xs text-rose-700 dark:text-rose-400">Total Gagal</p>
            <div className="flex items-center justify-between mt-0.5">
              <h4 className="text-xl font-black text-rose-700 dark:text-rose-300">
                {stats.gagal}
              </h4>
              {stats.gagal > 0 && !isProcessing && (
                <button
                  onClick={handleRetryFailed}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Ulangi Gagal
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Live Table of Imported / Scraped Files */}
      {importQueue.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm space-y-3 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Tabel Antrean & Hasil Import PDF Modul
            </h3>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
              >
                <option value="SEMUA">Semua Status</option>
                <option value="BERHASIL">BERHASIL</option>
                <option value="DUPLIKAT">DUPLIKAT</option>
                <option value="GAGAL">GAGAL</option>
                <option value="MENUNGGU">MENUNGGU</option>
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  placeholder="Cari file..."
                  className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3 pl-4">No</th>
                  <th className="p-3">Nama File & Judul Modul</th>
                  <th className="p-3">Paket & Mapel</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Google Drive</th>
                  <th className="p-3 pr-4 text-right">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredQueue.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 pl-4 font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{item.judul}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {item.nama_file} ({item.ukuran_file})
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded mr-1 ${
                        item.paket === 'PAKET B' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {item.paket}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 font-medium">{item.mata_pelajaran}</span>
                    </td>
                    <td className="p-3">
                      {item.status === 'BERHASIL' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                          <Check className="w-3 h-3" />
                          BERHASIL
                        </span>
                      )}
                      {item.status === 'DUPLIKAT' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" />
                          DUPLIKAT
                        </span>
                      )}
                      {item.status === 'GAGAL' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1 w-fit">
                          <XCircle className="w-3 h-3" />
                          GAGAL
                        </span>
                      )}
                      {item.status === 'DIPROSES' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 flex items-center gap-1 w-fit animate-pulse">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          DIPROSES
                        </span>
                      )}
                      {item.status === 'MENUNGGU' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          MENUNGGU
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <a
                        href={item.drive_url || 'https://drive.google.com/drive/folders/1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Buka di Drive</span>
                      </a>
                    </td>
                    <td className="p-3 pr-4 text-right text-slate-400 font-mono text-[11px]">
                      {item.tanggal || new Date().toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Script Execution Modal */}
      {showScriptModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col text-white shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    Skrip Google Apps Script: Direct Drive Downloader
                  </h3>
                  <p className="text-xs text-slate-400">
                    Otomatis mendownload PDF dari web dan mengunggah ke Google Drive Anda
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowScriptModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-800/50 space-y-2">
                <h4 className="font-bold text-indigo-300">Langkah 3 Detik di Spreadsheet:</h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-relaxed">
                  <li>Buka <a href="https://docs.google.com/spreadsheets/d/1JMaGtYl77Qm5enl9N2A49_6oivu0mAjwCHe6QApfbQM/edit?usp=sharing" target="_blank" rel="noreferrer" className="text-amber-300 underline font-semibold">Spreadsheet Database PKBM</a>.</li>
                  <li>Klik menu <strong>Extensions &gt; Apps Script</strong>.</li>
                  <li>Buat file baru bernama <code className="text-amber-300 font-mono bg-slate-800 px-1 rounded">DirectDriveDownloader.gs</code>, paste kode di bawah, lalu klik <strong>Simpan</strong>.</li>
                  <li>Pilih fungsi <code className="text-amber-300 font-mono font-bold bg-slate-800 px-1 rounded">downloadDanSimpanSemuaModulKeDrive</code> dan klik <strong>Run (Jalankan)</strong>.</li>
                </ol>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-slate-400">DirectDriveDownloader.gs</span>
                  <button
                    onClick={handleCopyScript}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Tersalin ke Clipboard!' : 'Salin Kode Skrip'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-72 leading-relaxed">
                  {directScript}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <a
                href="https://drive.google.com/drive/folders/1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX?usp=drive_link"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Folder Google Drive Target</span>
              </a>
              <button
                onClick={() => setShowScriptModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
