import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { storage } from '../services/storageService';
import { googleSheetsSync } from '../services/googleSheetsSyncService';

interface StatusSinkronisasiProps {
  onOpenSyncModal?: () => void;
  onSyncComplete?: (message: string) => void;
  className?: string;
  isAdmin?: boolean;
}

export const StatusSinkronisasi: React.FC<StatusSinkronisasiProps> = ({
  onOpenSyncModal,
  onSyncComplete,
  className = '',
  isAdmin = false
}) => {
  // STRICT ACCESS CONTROL: Completely hidden and disabled for non-admin users (Pengunjung, Warga Belajar, Tutor)
  if (!isAdmin) {
    return null;
  }

  const [syncState, setSyncState] = useState<'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    return localStorage.getItem('pkbm_last_sync_time') || null;
  });
  const [isPushing, setIsPushing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const gasConfig = storage.getGasConfig();
  const hasConfig = Boolean(gasConfig.webAppUrl);

  useEffect(() => {
    const unsubscribe = googleSheetsSync.subscribeStatus((st, msg) => {
      setSyncState(st);
      if (msg) setSyncMessage(msg);
      if (st === 'SUCCESS') {
        const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        setLastSyncTime(timeNow);
        localStorage.setItem('pkbm_last_sync_time', timeNow);
      }
    });
    return unsubscribe;
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKirimData = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isPushing) return;

    setIsPushing(true);
    try {
      const res = await googleSheetsSync.pushAllToGoogleSheets();
      if (res.success) {
        const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        setLastSyncTime(now);
        localStorage.setItem('pkbm_last_sync_time', now);
        if (onSyncComplete) {
          onSyncComplete('Seluruh data aplikasi berhasil dikirim ke Google Sheets.');
        }
      } else if (onSyncComplete) {
        onSyncComplete(res.message || 'Gagal mengirim data ke Google Sheets.');
      }
    } catch (err: any) {
      if (onSyncComplete) onSyncComplete(`Gagal kirim: ${err.message}`);
    } finally {
      setIsPushing(false);
      setIsDropdownOpen(false);
    }
  };

  // Determine indicator status: 🟢 Hijau, 🟡 Kuning, 🔴 Merah
  let statusEmoji = '🟢';
  let statusDotColor = 'bg-emerald-500';
  let statusBadgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
  let statusLabel = 'Connect Cloud';

  if (syncState === 'SYNCING' || isPushing) {
    statusEmoji = '🟡';
    statusDotColor = 'bg-amber-400 animate-ping';
    statusBadgeBg = 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
    statusLabel = isPushing ? 'Mengirim Data...' : 'Sinkronisasi...';
  } else if (!hasConfig || syncState === 'ERROR') {
    statusEmoji = '🔴';
    statusDotColor = 'bg-rose-500';
    statusBadgeBg = 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800';
    statusLabel = !hasConfig ? 'Sheets Belum Konek' : 'Kendala Koneksi';
  }

  return (
    <div ref={dropdownRef} className={`relative inline-flex items-center gap-1.5 ${className}`}>
      {/* Status Badge Trigger */}
      <button
        type="button"
        onClick={() => setIsDropdownOpen(prev => !prev)}
        className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none shadow-xs hover:opacity-90 ${statusBadgeBg}`}
        title={`Status Sinkronisasi Google Sheets: ${statusLabel}`}
        aria-expanded={isDropdownOpen}
      >
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusDotColor}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${statusDotColor}`} />
        </span>
        <span className="text-xs">{statusEmoji}</span>
        <span className="hidden xl:inline text-[11px] font-bold tracking-tight">
          {statusLabel}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Direct Quick Action Buttons (Visible ONLY for Admin on large screens) */}
      {isAdmin && (
        <div className="hidden lg:flex items-center gap-1">
          {/* Tombol Kirim Data */}
          <button
            type="button"
            onClick={handleKirimData}
            disabled={isPushing}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-2xs active:scale-95"
            title="Kirim seluruh data aplikasi ke Google Sheets"
          >
            <UploadCloud className={`w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ${isPushing ? 'animate-bounce' : ''}`} />
            <span className="text-[11px]">{isPushing ? 'Mengirim...' : 'Kirim Data'}</span>
          </button>
        </div>
      )}

      {/* Popover / Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-3.5 text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Popover */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                Status Sinkronisasi
              </h4>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${statusBadgeBg}`}>
              {statusEmoji} {hasConfig ? 'Aktif' : 'Offline'}
            </span>
          </div>

          {/* Status Details - disembunyikan di halaman admin */}
          {!isAdmin && (
            <div className="space-y-2 text-[11px] mb-3">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Database Google Sheets:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  12 Tabel Terkoneksi
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Sinkronisasi Terakhir:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {lastSyncTime ? `Pukul ${lastSyncTime} WIB` : 'Belum Pernah'}
                </span>
              </div>
            </div>
          )}

          {syncMessage && (
            <div className="p-2 mb-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{syncMessage}</span>
            </div>
          )}

          {/* Admin-only Action Buttons in Popover */}
          {isAdmin && (
            <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleKirimData}
                disabled={isPushing}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-between transition-colors cursor-pointer shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <UploadCloud className={`w-4 h-4 ${isPushing ? 'animate-bounce' : ''}`} />
                  <span>{isPushing ? 'Sedang Mengirim Data...' : 'Kirim Data ke Google Sheets'}</span>
                </span>
                <span className="text-[10px] opacity-80 font-mono">Push</span>
              </button>

              {onOpenSyncModal && (
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenSyncModal();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span>Pusat Sinkronisasi Lengkap</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
