import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Flame,
  CheckCircle2,
  Calendar,
  Trophy,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Info,
  Clock,
  Zap,
  Award,
  ShieldCheck,
  Star,
  Check,
  HelpCircle,
  X
} from 'lucide-react';
import { LearningStreakData } from '../../types';

interface LearningStreakCardProps {
  streakData: LearningStreakData;
  onExploreMateri?: () => void;
  onCheckInToday?: () => void;
  compact?: boolean;
}

interface MilestoneBadge {
  days: number;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
}

export const LearningStreakCard: React.FC<LearningStreakCardProps> = ({
  streakData,
  onExploreMateri,
  onCheckInToday,
  compact = false
}) => {
  const {
    currentStreak,
    longestStreak,
    totalActiveDays,
    studiedToday,
    weekDays,
    motivationalMessage,
    nextMilestone,
    daysToNextMilestone
  } = streakData;

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  const milestoneProgress = Math.min(
    100,
    Math.round(((nextMilestone - daysToNextMilestone) / Math.max(1, nextMilestone)) * 100)
  );

  // Determine streak tier
  const getStreakTier = (streak: number) => {
    if (streak >= 30) return { label: 'Master Konsistensi', color: 'from-amber-400 to-yellow-300 text-slate-950', icon: Trophy };
    if (streak >= 14) return { label: 'Disiplin Belajar', color: 'from-purple-500 to-indigo-500 text-white', icon: Star };
    if (streak >= 7) return { label: 'Pejuang 1 Minggu', color: 'from-blue-500 to-cyan-500 text-white', icon: Award };
    if (streak >= 3) return { label: 'Pembelajar Aktif', color: 'from-orange-500 to-amber-500 text-white', icon: Zap };
    return { label: 'Langkah Awal', color: 'from-slate-600 to-slate-500 text-white', icon: Flame };
  };

  const tier = getStreakTier(currentStreak);
  const TierIcon = tier.icon;

  const badgesList: MilestoneBadge[] = [
    { days: 3, title: 'Pembelajar Rajin 3 Hari', desc: 'Belajar 3 hari berturut-turut', icon: '🥉', unlocked: longestStreak >= 3 },
    { days: 7, title: 'Juara Pekanan 7 Hari', desc: 'Konsisten 1 minggu penuh tanpa jeda', icon: '🥈', unlocked: longestStreak >= 7 },
    { days: 14, title: 'Pejuang Mandiri 14 Hari', desc: 'Disiplin belajar 2 minggu berturut-turut', icon: '🥇', unlocked: longestStreak >= 14 },
    { days: 21, title: 'Habit Juara 21 Hari', desc: 'Membangun kebiasaan belajar sejati', icon: '🌟', unlocked: longestStreak >= 21 },
    { days: 30, title: 'Bintang Kesetaraan 30 Hari', desc: 'Satu bulan penuh aktif membaca modul', icon: '👑', unlocked: longestStreak >= 30 },
    { days: 50, title: 'Master Akademik 50 Hari', desc: 'Dedikasi luar biasa pendidikan kesetaraan', icon: '💎', unlocked: longestStreak >= 50 },
    { days: 100, title: 'Legenda PKBM 100 Hari', desc: 'Pencapaian emas 100 hari berturut-turut', icon: '🏆', unlocked: longestStreak >= 100 },
  ];

  const handleInstantCheckIn = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // safe fallback
    }

    setJustCheckedIn(true);
    if (onCheckInToday) {
      onCheckInToday();
    }
  };

  return (
    <div
      id="learning-streak-card"
      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300 hover:border-amber-400/60 dark:hover:border-amber-500/40 relative"
    >
      {/* Subtle warm ambient background glow for streak */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="p-5 sm:p-6 relative z-10 space-y-5">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <div
                className={`w-13 h-13 sm:w-15 sm:h-15 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  currentStreak > 0
                    ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/30 ring-4 ring-amber-400/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <Flame className={`w-8 h-8 ${currentStreak > 0 ? 'animate-bounce fill-current' : ''}`} />
              </div>
              {(studiedToday || justCheckedIn) && (
                <span
                  title="Sudah Belajar Hari Ini"
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  Learning Streak
                </span>

                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    studiedToday || justCheckedIn
                      ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse'
                  }`}
                >
                  {studiedToday || justCheckedIn ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      Sudah Aktif Hari Ini
                    </>
                  ) : (
                    'Belum Belajar Hari Ini'
                  )}
                </span>

                <button
                  type="button"
                  onClick={() => setShowInfoModal(true)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 transition-colors cursor-pointer"
                  title="Apa itu Learning Streak?"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-baseline gap-2.5 mt-1">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {currentStreak}{' '}
                  <span className="text-sm sm:text-base font-bold text-slate-500 dark:text-slate-400">
                    Hari Berturut-turut
                  </span>
                </h3>

                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md bg-gradient-to-r ${tier.color} shadow-xs hidden sm:inline-flex items-center gap-1`}>
                  <TierIcon className="w-3 h-3" />
                  {tier.label}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Badges & Badges Button */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap">
            <div className="px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-750 text-left min-w-[90px]">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                <Trophy className="w-3 h-3 text-amber-500" />
                <span>Rekor Terpanjang</span>
              </div>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5">
                {longestStreak} Hari
              </p>
            </div>

            <div className="px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-750 text-left min-w-[90px]">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                <Calendar className="w-3 h-3 text-indigo-500" />
                <span>Total Aktif</span>
              </div>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5">
                {totalActiveDays} Hari
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowBadgesModal(true)}
              className="px-3 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Lihat Semua Lencana & Milestone Streak"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Lencana ({badgesList.filter(b => b.unlocked).length}/{badgesList.length})</span>
            </button>
          </div>
        </div>

        {/* 7-Day Weekly Habit Grid (Senin - Minggu) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              Aktivitas Belajar Minggu Ini
            </span>
            <span className="text-[11px]">
              Target Berikutnya: <strong className="text-amber-600 dark:text-amber-400">{nextMilestone} Hari</strong> ({daysToNextMilestone} hari lagi)
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
            {weekDays.map((day, idx) => {
              const isDayDone = day.studied || (day.isToday && justCheckedIn);

              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center py-2.5 sm:py-3 px-1 rounded-2xl border transition-all text-center relative ${
                    day.isToday
                      ? 'border-amber-400 dark:border-amber-500/80 ring-2 ring-amber-400/20 bg-amber-50/50 dark:bg-amber-950/20'
                      : isDayDone
                      ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/40 text-slate-400'
                  }`}
                  title={`${day.fullDayName}, ${day.displayDate} - ${isDayDone ? 'Sudah Belajar (Aktif)' : 'Belum Ada Aktivitas'}`}
                >
                  <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                    day.isToday ? 'text-amber-700 dark:text-amber-300 font-black' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {day.dayName}
                  </span>

                  <div className="my-1.5 flex items-center justify-center">
                    {isDayDone ? (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                      </div>
                    ) : (
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                        day.isToday
                          ? 'border-amber-400 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900'
                          : 'border-slate-300 dark:border-slate-700 text-slate-400'
                      }`}>
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 font-medium truncate w-full px-0.5">
                    {day.displayDate.split(' ')[0]}
                  </span>

                  {day.isToday && (
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-amber-500 text-white text-[8px] font-black rounded-full uppercase shadow-xs">
                      Hari Ini
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
              <span>Kemajuan Menuju Lencana {nextMilestone} Hari</span>
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{milestoneProgress}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${milestoneProgress}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-full relative shadow-xs"
            >
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
            </motion.div>
          </div>
        </div>

        {/* Motivation and Call-to-Action Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <p className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{motivationalMessage}</span>
          </p>

          <div className="flex items-center gap-2 shrink-0">
            {!studiedToday && !justCheckedIn && (
              <button
                id="btn-streak-checkin-direct"
                type="button"
                onClick={handleInstantCheckIn}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                title="Catat aktivitas belajar hari ini"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Check-in Hari Ini</span>
              </button>
            )}

            {onExploreMateri && (
              <button
                id="btn-streak-cta-belajar"
                type="button"
                onClick={onExploreMateri}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs ${
                  studiedToday || justCheckedIn
                    ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black shadow-md shadow-orange-500/20'
                }`}
              >
                <span>{studiedToday || justCheckedIn ? 'Buka E-Modul' : 'Belajar Sekarang (+1 Streak)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: INFO LEARNING STREAK */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                    <Flame className="w-5 h-5 fill-current" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Tentang Learning Streak PKBM
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
                <p>
                  <strong>Learning Streak</strong> adalah pelacak konsistensi belajar harian warga belajar di PKBM Celah Cahaya. Setiap hari Anda membaca modul, mengerjakan kuis, atau menghadiri tatap muka, streak Anda akan bertambah +1 hari.
                </p>

                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600" />
                    Cara Menjaga & Meningkatkan Streak:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-300 text-[11px]">
                    <li>Membaca E-Modul Paket B / Paket C minimal 1 halaman per hari.</li>
                    <li>Mengerjakan Kuis Modul 100 Soal atau Ulangan Harian.</li>
                    <li>Mengumpulkan Tugas atau klik tombol Check-in Harian.</li>
                    <li>Aktivitas belajar dihitung setiap hari sebelum pukul 23:59 WIB.</li>
                  </ul>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Dapatkan lencana prestasi belajar mulai dari 3 hari hingga 100 hari berturut-turut untuk sertifikat motivasi belajar kesetaraan!
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Mengerti
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: MILESTONE BADGES */}
      <AnimatePresence>
        {showBadgesModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Koleksi Lencana Streak Belajar
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Rekor Terpanjang Anda: <strong className="text-amber-500">{longestStreak} Hari</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBadgesModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {badgesList.map((badge, bIdx) => (
                  <div
                    key={bIdx}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                      badge.unlocked
                        ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                      badge.unlocked ? 'bg-white dark:bg-slate-800 shadow-xs' : 'bg-slate-200 dark:bg-slate-700 grayscale'
                    }`}>
                      {badge.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {badge.title}
                        </h4>
                        {badge.unlocked ? (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500 text-white uppercase shrink-0">
                            Tercapai
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold text-slate-400 shrink-0">
                            {badge.days} Hari
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {badge.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowBadgesModal(false)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

