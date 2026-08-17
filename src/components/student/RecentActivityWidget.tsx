import React from 'react';
import { Clock, BookOpen, ArrowRight, CheckCircle2, WifiOff, Sparkles } from 'lucide-react';
import { RecentModuleActivity, Materi } from '../../types';
import { curriculumCache } from '../../services/curriculumCacheService';

interface RecentActivityWidgetProps {
  recentModules: RecentModuleActivity[];
  onOpenMateri: (materiId: string) => void;
  allMateri: Materi[];
}

export const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({
  recentModules,
  onOpenMateri,
  allMateri
}) => {
  const formatTimeAgo = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Baru saja';
      if (diffMins < 60) return `${diffMins} menit lalu`;
      if (diffHours < 24) return `${diffHours} jam lalu`;
      if (diffDays === 1) return 'Kemarin';
      if (diffDays < 7) return `${diffDays} hari lalu`;
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } catch {
      return 'Baru saja';
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Aktivitas Terakhir (Recent Activity)</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">5 Modul terakhir yang baru saja diakses</p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            Cepat Lanjut
          </span>
        </div>

        {recentModules.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            Belum ada riwayat aktivitas modul terbaru.
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentModules.map((item) => {
              const isCached = curriculumCache.isModuleCached(item.materi_id);
              return (
                <div
                  key={item.materi_id}
                  onClick={() => onOpenMateri(item.materi_id)}
                  className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/70 dark:bg-slate-850/60 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold text-xs">
                      <BookOpen className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100/70 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {item.mata_pelajaran}
                        </span>
                        {item.completed && (
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Selesai
                          </span>
                        )}
                        {isCached && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium" title="Tersedia Offline">
                            Offline Ready
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.judul}
                      </h4>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>Hal {item.last_page}/{item.total_pages} ({item.progress_percent}%)</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <Clock className="w-2.5 h-2.5" />
                          {formatTimeAgo(item.last_accessed)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 transition-all shrink-0"
                    title="Lanjutkan Baca"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Materi tersimpan otomatis untuk akses offline
        </span>
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          5 Item Terakhir
        </span>
      </div>
    </div>
  );
};
