import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Target, Clock, Edit2, Check, Sparkles, TrendingUp } from 'lucide-react';
import { StudyGoalData } from '../../types';

interface StudyGoalCardProps {
  goalData: StudyGoalData;
  onUpdateGoal: (hours: number) => void;
}

export const StudyGoalCard: React.FC<StudyGoalCardProps> = ({
  goalData,
  onUpdateGoal
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputHours, setInputHours] = useState(goalData.weeklyGoalHours.toString());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(inputHours);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 50) {
      onUpdateGoal(parsed);
      setIsEditing(false);
    }
  };

  const actualHours = goalData.actualStudyHoursThisWeek;
  const goalHours = goalData.weeklyGoalHours;
  const percent = Math.min(100, Math.round((actualHours / Math.max(0.1, goalHours)) * 100));
  const remainingHours = Math.max(0, Math.round((goalHours - actualHours) * 10) / 10);

  // Recharts Gauge / Semi-Circle Pie Data
  // Angles 180 to 0 (half circle)
  const chartData = [
    { name: 'Tercapai', value: Math.min(actualHours, goalHours), color: '#4f46e5' }, // indigo-600
    { name: 'Sisa Target', value: Math.max(0, goalHours - actualHours), color: '#e2e8f0' } // slate-200
  ];

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs relative overflow-hidden flex flex-col justify-between">
      {/* Background soft ambient glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 relative z-10 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Target Belajar Mingguan</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Target Jam Membaca Minggu Ini</p>
          </div>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={() => {
              setInputHours(goalData.weeklyGoalHours.toString());
              setIsEditing(true);
            }}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Ubah Target Jam Belajar"
          >
            <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline text-[11px]">Ubah</span>
          </button>
        ) : (
          <form onSubmit={handleSave} className="flex items-center gap-1.5">
            <input
              type="number"
              min="1"
              max="50"
              step="0.5"
              value={inputHours}
              onChange={e => setInputHours(e.target.value)}
              className="w-14 px-2 py-1 text-xs font-bold rounded-lg border border-indigo-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <span className="text-xs text-slate-500">Jam</span>
            <button
              type="submit"
              className="p-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
              title="Simpan"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>

      {/* Gauge Chart Visual with Recharts */}
      <div className="relative flex flex-col items-center justify-center my-1">
        <div className="w-full h-36 max-w-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="85%"
                startAngle={180}
                endAngle={0}
                innerRadius={58}
                outerRadius={78}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                <Cell fill="#4f46e5" />
                <Cell fill="#cbd5e1" className="dark:fill-slate-800" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gauge Inner Metric Readout */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {percent}%
          </span>
          <p className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
            Tercapai
          </p>
        </div>
      </div>

      {/* Summary Stats Bottom */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Waktu Tercatat</p>
          <p className="font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>{actualHours} Jam</span>
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Target Mingguan</p>
          <p className="font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>{goalHours} Jam</span>
          </p>
        </div>
      </div>

      {/* Motivational message */}
      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 text-center leading-relaxed">
        {percent >= 100 ? (
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Target mingguan terpenuhi! Luar biasa!
          </span>
        ) : (
          `Sisa ${remainingHours} jam lagi untuk mencapai target minggu ini.`
        )}
      </p>
    </div>
  );
};
