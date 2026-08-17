import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  Database,
  Printer,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { storage } from '../../services/storageService';
import { googleSheetsSync } from '../../services/googleSheetsSyncService';

interface SyncStatusToolbarProps {
  onOpenSyncModal: () => void;
  onOpenPrintCenter?: (type?: any, data?: any) => void;
  onOpenPrintModal?: () => void;
  onDataSynced?: () => void;
  onRefreshLocalState?: () => void;
}

export const SyncStatusToolbar: React.FC<SyncStatusToolbarProps> = ({
  onOpenSyncModal,
  onOpenPrintCenter,
  onOpenPrintModal,
  onDataSynced,
  onRefreshLocalState
}) => {
  const [syncState, setSyncState] = useState<'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [isPushing, setIsPushing] = useState(false);

  const gasConfig = storage.getGasConfig();

  useEffect(() => {
    const unsubscribe = googleSheetsSync.subscribeStatus((st, msg) => {
      setSyncState(st);
      if (msg) setSyncMessage(msg);
    });
    return unsubscribe;
  }, []);

  const handleQuickPush = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPushing(true);
    try {
      const res = await googleSheetsSync.pushAllToGoogleSheets();
      if (res.success) {
        if (onDataSynced) onDataSynced();
        if (onRefreshLocalState) onRefreshLocalState();
      }
    } finally {
      setIsPushing(false);
    }
  };

  const handlePrintClick = () => {
    if (onOpenPrintCenter) {
      onOpenPrintCenter();
    } else if (onOpenPrintModal) {
      onOpenPrintModal();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
      {/* Left: Status Badge & Description */}
      <div className="flex items-center gap-3">
        <div
          onClick={onOpenSyncModal}
          className="cursor-pointer group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Klik untuk membuka Pusat Sinkronisasi Data"
        >
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              syncState === 'SYNCING' || isPushing
                ? 'bg-amber-400 animate-ping'
                : gasConfig.webAppUrl
                ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                : 'bg-rose-500'
            }`}
          />
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {syncState === 'SYNCING' || isPushing
              ? 'Sedang Sinkronisasi...'
              : gasConfig.webAppUrl
              ? 'Tersinkron ke Google Sheets'
              : 'Penyimpanan Lokal (Offline)'}
          </span>
        </div>

        <p className="text-slate-500 dark:text-slate-400 hidden lg:block text-[11px]">
          {syncMessage || 'Semua data form, kuis, tugas, dan nilai otomatis tersimpan & terhubung.'}
        </p>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
        {/* Kirim Data Button */}
        <button
          onClick={handleQuickPush}
          disabled={isPushing}
          className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
          title="Kirim seluruh data aplikasi ke Google Sheets"
        >
          <UploadCloud className={`w-3.5 h-3.5 ${isPushing ? 'animate-bounce' : ''}`} />
          <span>{isPushing ? 'Mengirim...' : 'Kirim Data'}</span>
        </button>

        {/* Cetak Rekap Button */}
        {(onOpenPrintCenter || onOpenPrintModal) && (
          <button
            onClick={handlePrintClick}
            className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800 flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Cetak dan Ekspor Dokumen Resmi"
          >
            <Printer className="w-3.5 h-3.5 text-amber-600" />
            <span>Cetak Dokumen</span>
          </button>
        )}

        {/* Full Sync Hub Button */}
        <button
          onClick={onOpenSyncModal}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 cursor-pointer transition-colors dark:bg-slate-800 dark:hover:bg-slate-700"
          title="Kelola Pengaturan Sinkronisasi Lengkap"
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Pusat Sinkronisasi</span>
        </button>
      </div>
    </div>
  );
};
