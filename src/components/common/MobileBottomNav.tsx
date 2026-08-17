import React from 'react';
import {
  Home,
  BookOpen,
  Layers,
  HelpCircle,
  User as UserIcon,
  Sparkles,
  LogIn
} from 'lucide-react';
import { User } from '../../types';
import { useI18n } from '../../services/i18n';

interface MobileBottomNavProps {
  currentUser: User | null;
  activeView?: 'HOME' | 'LEARN' | 'KURIKULUM';
  onNavigateHome?: () => void;
  onNavigateLearn?: () => void;
  onNavigateKurikulum?: () => void;
  onOpenPanduan: () => void;
  onOpenProfil: () => void;
  onOpenLogin: () => void;
  onOpenPendaftaran?: () => void;
  pendingCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentUser,
  activeView = 'HOME',
  onNavigateHome,
  onNavigateLearn,
  onNavigateKurikulum,
  onOpenPanduan,
  onOpenProfil,
  onOpenLogin,
  onOpenPendaftaran,
  pendingCount = 0
}) => {
  const { t } = useI18n();

  const handleHomeClick = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCatalogClick = () => {
    const el = document.getElementById('katalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onNavigateHome) {
      onNavigateHome();
      setTimeout(() => {
        document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav
      aria-label="Navigasi Bawah Mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-2xl safe-area-inset-bottom"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Tab 1: Beranda */}
        <button
          type="button"
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[52px] min-h-[44px] ${
            activeView === 'HOME'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Home className={`w-5 h-5 transition-transform ${activeView === 'HOME' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">{t('mob.home', 'Beranda')}</span>
        </button>

        {/* Tab 2: Modul Belajar (Logged In: Learn / Guest: Katalog) */}
        {currentUser ? (
          <button
            type="button"
            onClick={onNavigateLearn || handleHomeClick}
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[52px] min-h-[44px] ${
              activeView === 'LEARN'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className={`w-5 h-5 transition-transform ${activeView === 'LEARN' ? 'scale-110' : ''}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">{t('mob.learn', 'Belajar')}</span>
            {pendingCount > 0 && (
              <span className="absolute top-0.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCatalogClick}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer min-w-[52px] min-h-[44px]"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">{t('catalog.title', 'Katalog')}</span>
          </button>
        )}

        {/* Tab 3: Kurikulum */}
        <button
          type="button"
          onClick={onNavigateKurikulum}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[52px] min-h-[44px] ${
            activeView === 'KURIKULUM'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Layers className={`w-5 h-5 transition-transform ${activeView === 'KURIKULUM' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">{t('mob.curriculum', 'Kurikulum')}</span>
        </button>

        {/* Tab 4: Panduan */}
        <button
          type="button"
          onClick={onOpenPanduan}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all cursor-pointer min-w-[52px] min-h-[44px]"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">{t('mob.guide', 'Panduan')}</span>
        </button>

        {/* Tab 5: Akun Saya (Logged In) OR Masuk Portal (Guest) */}
        {currentUser ? (
          <button
            type="button"
            onClick={onOpenProfil}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all cursor-pointer min-w-[52px] min-h-[44px]"
          >
            {currentUser.foto ? (
              <img
                src={currentUser.foto}
                alt={currentUser.nama}
                className="w-5 h-5 rounded-full object-cover border border-indigo-400"
              />
            ) : (
              <UserIcon className="w-5 h-5" />
            )}
            <span className="text-[10px] mt-0.5 tracking-tight">{t('mob.account', 'Akun')}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenLogin}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all cursor-pointer min-w-[52px] min-h-[44px]"
          >
            <LogIn className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">{t('nav.login', 'Masuk')}</span>
          </button>
        )}
      </div>
    </nav>
  );
};
