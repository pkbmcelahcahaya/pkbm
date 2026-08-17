import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start justify-between p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
            t.type === 'success'
              ? 'bg-emerald-950/95 text-emerald-100 border-emerald-500/40 shadow-emerald-950/30'
              : t.type === 'error'
              ? 'bg-rose-950/95 text-rose-100 border-rose-500/40 shadow-rose-950/30'
              : 'bg-slate-900/95 text-slate-100 border-indigo-500/40 shadow-slate-950/30'
          }`}
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="mt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
            </div>
            <div className="text-xs">
              {t.title && <p className="font-bold text-sm text-white mb-0.5">{t.title}</p>}
              {t.message && <p className="text-slate-300 leading-relaxed">{t.message}</p>}
            </div>
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-2 shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
