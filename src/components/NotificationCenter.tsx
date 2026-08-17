import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Video, FileText, Award, AlertCircle } from 'lucide-react';
import { NotifikasiApp, User } from '../types';
import { storage } from '../services/storageService';

interface NotificationCenterProps {
  currentUser: User | null;
  onNavigateTab?: (tabKey: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ currentUser, onNavigateTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotifikasiApp[]>([]);

  const refreshNotifs = () => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }
    const list = storage.getNotifikasi(currentUser.role, currentUser.paket, currentUser.id);
    setNotifications(list);
  };

  useEffect(() => {
    refreshNotifs();
    const interval = setInterval(refreshNotifs, 10000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const unreadCount = notifications.filter(n => !n.dibaca).length;

  const handleMarkAllRead = () => {
    storage.markAllNotifikasiRead(currentUser?.id);
    refreshNotifs();
  };

  const handleItemClick = (notif: NotifikasiApp) => {
    storage.markNotifikasiRead(notif.id);
    refreshNotifs();
    setIsOpen(false);
    if (notif.link_tab && onNavigateTab) {
      onNavigateTab(notif.link_tab);
    }
  };

  const getIcon = (type: NotifikasiApp['tipe']) => {
    switch (type) {
      case 'TATAP_MUKA':
        return <Video className="w-4 h-4 text-emerald-500" />;
      case 'TUGAS':
        return <FileText className="w-4 h-4 text-indigo-500" />;
      case 'ULANGAN':
      case 'NILAI':
        return <Award className="w-4 h-4 text-amber-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 sm:p-2 min-h-12 sm:min-h-0 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:lg:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        title="Notifikasi LMS"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden">
            <div className="p-3.5 px-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Notifikasi LMS
                </span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {unreadCount} Baru
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Tandai Semua Dibaca</span>
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada notifikasi pembelajaran.
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => handleItemClick(notif)}
                    className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex items-start gap-3 ${
                      !notif.dibaca ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon(notif.tipe)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className={`text-xs ${!notif.dibaca ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                          {notif.judul}
                        </h4>
                        {!notif.dibaca && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                        {notif.pesan}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {notif.created_at}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
