import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Layers,
  Sparkles,
  X,
  Radio,
  CheckCircle2,
  FolderGit2,
  AlertCircle,
  Database,
  Cloud
} from 'lucide-react';
import { getAllGasFiles, GasFile } from '../services/gasCodeGenerator';
import { storage } from '../services/storageService';
import { MASTER_LEMBAGA } from '../data/lembagaConfig';

interface GasDeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GasDeploymentGuideModal: React.FC<GasDeploymentGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const gasFiles: GasFile[] = getAllGasFiles();
  const [selectedFile, setSelectedFile] = useState<GasFile>(gasFiles[0] || { name: 'Code.gs', description: '', code: '' });
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'CODE' | 'STEPS' | 'PERMISSIONS'>('STEPS');

  const gasConfig = storage.getGasConfig();

  if (!isOpen) return null;

  const handleCopySingle = (file: GasFile) => {
    navigator.clipboard.writeText(file.code);
    setCopiedFile(file.name);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const handleCopyAllCombined = () => {
    const combined = gasFiles
      .map(
        f => `// ==========================================\n// FILE: ${f.name}\n// ${f.description}\n// ==========================================\n\n${f.code}\n`
      )
      .join('\n\n');
    navigator.clipboard.writeText(combined);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Panduan Integrasi Google Apps Script (GAS)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  v4.0 Full Sync Engine
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                12 Tabel Database Google Sheets • Google Drive Upload • Auto-Schema Expansion
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

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 gap-6 text-xs font-bold bg-slate-50/50 dark:bg-slate-850">
          <button
            onClick={() => setActiveTab('STEPS')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'STEPS'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Langkah Deploy Web App</span>
          </button>
          <button
            onClick={() => setActiveTab('CODE')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'CODE'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Koleksi File Skrip ({gasFiles.length} File)</span>
          </button>
          <button
            onClick={() => setActiveTab('PERMISSIONS')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'PERMISSIONS'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Izin Akses & CORS Web App</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: STEPS */}
          {activeTab === 'STEPS' && (
            <div className="space-y-6">
              {/* Step Items */}
              <div className="space-y-4">
                {[
                  {
                    num: '01',
                    title: 'Buka Spreadsheet Database PKBM Celah Cahaya',
                    desc: `Buka spreadsheet Google Sheets Anda (ID: ${gasConfig.spreadsheetId || '1JMaGtYl77Qm5enl9N2A49_6oivu0mAjwCHe6QApfbQM'}). Di bilah menu atas, klik Extensions (Ekstensi) ➔ Apps Script.`,
                    link: `https://docs.google.com/spreadsheets/d/${gasConfig.spreadsheetId || '1JMaGtYl77Qm5enl9N2A49_6oivu0mAjwCHe6QApfbQM'}/edit`
                  },
                  {
                    num: '02',
                    title: 'Salin Seluruh Kode Skrip Google Apps Script',
                    desc: 'Buka tab "Koleksi File Skrip", lalu salin file Code.gs, Config.gs, atau gunakan tombol "Salin Seluruh Kode Gabungan". Tempelkan ke editor Apps Script.'
                  },
                  {
                    num: '03',
                    title: 'Jalankan Fungsi Inisialisasi (Opsional tapi Direkomendasikan)',
                    desc: 'Pilih fungsi initAllSheets dari dropdown fungsi di bagian atas editor GAS, lalu klik Run (Jalankan). Berikan izin akun Google jika diminta. Fungsi ini akan menyiapkan 12 sheet database lengkap beserta header berwarna.'
                  },
                  {
                    num: '04',
                    title: 'Deploy sebagai Web App Baru (New Deployment)',
                    desc: 'Klik tombol biru Deploy (Terapkan) ➔ New deployment (Penerapan baru). Pilih jenis Web app (ikon bola dunia).'
                  },
                  {
                    num: '05',
                    title: 'PENTING: Konfigurasi Akses Web App',
                    desc: 'Atur "Execute as" (Jalankan sebagai) = Me (Akun Google Anda) dan "Who has access" (Siapa yang memiliki akses) = Anyone (Siapa saja). Klik Deploy.'
                  },
                  {
                    num: '06',
                    title: 'Salin URL Web App & Masukkan ke Aplikasi LMS',
                    desc: 'Salin Web App URL (berakhiran /exec) dan tempelkan ke form URL Google Apps Script di menu Pengaturan LMS PKBM Celah Cahaya.'
                  }
                ].map((st, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-start gap-4"
                  >
                    <span className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black text-sm flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
                      {st.num}
                    </span>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {st.title}
                        </h4>
                        {st.link && (
                          <a
                            href={st.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold flex items-center gap-1 text-[11px]"
                          >
                            <span>Buka Sheets</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-indigo-900 dark:text-indigo-200">
                    Siap Menyalin Seluruh Kode?
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Salin seluruh {gasFiles.length} file skrip sekaligus ke clipboard dalam satu klik.
                  </p>
                </div>
                <button
                  onClick={handleCopyAllCombined}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all whitespace-nowrap"
                >
                  {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedAll ? 'Tersalin ke Clipboard!' : 'Salin Seluruh Kode Gabungan'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CODE COLLECTION */}
          {activeTab === 'CODE' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                {/* File Dropdown Selector */}
                <div className="flex items-center gap-2 flex-wrap">
                  {gasFiles.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedFile(file)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer ${
                        selectedFile.name === file.name
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {file.name}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleCopySingle(selectedFile)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                >
                  {copiedFile === selectedFile.name ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFile === selectedFile.name ? 'Tersalin!' : `Salin ${selectedFile.name}`}</span>
                </button>
              </div>

              {/* File Info */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-600 dark:text-slate-300 text-xs">
                  <strong>Deskripsi File:</strong> {selectedFile.description}
                </p>
              </div>

              {/* Code Viewer Box */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 p-4 font-mono text-[11px] max-h-[380px] overflow-y-auto scrollbar-thin">
                <pre className="whitespace-pre-wrap">{selectedFile.code}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: PERMISSIONS & FAQ */}
          {activeTab === 'PERMISSIONS' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Peringatan Izin Google "Unverified App" (Aplikasi Belum Diverifikasi)</span>
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                  Ketika Anda menjalankan fungsi pertama kali di Apps Script, Google akan menampilkan peringatan keamanan:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>Klik tombol <strong>Advanced (Lanjutan)</strong> di pojok kiri bawah jendela popup Google.</li>
                  <li>Klik tautan <strong>Go to PKBM Celah Cahaya Backend (unsafe) / Buka PKBM (tidak aman)</strong>.</li>
                  <li>Klik tombol <strong>Allow (Izinkan)</strong> untuk memberikan akses baca & tulis spreadsheet serta Google Drive ke skrip Anda sendiri.</li>
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Keamanan Data & Privasi</span>
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  Skrip ini berjalan langsung di bawah akun Google Workspace / Gmail milik lembaga Anda sendiri. Tidak ada pihak ketiga yang memiliki akses ke spreadsheet atau Google Drive selain link Web App yang Anda konfigurasi.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            PKBM Celah Cahaya • Garut, Jawa Barat
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-sm"
          >
            Selesai & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
