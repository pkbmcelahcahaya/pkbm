import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface ModuleProgressBarProps {
  percent: number;
  isCompleted?: boolean;
}

export const ModuleProgressBar: React.FC<ModuleProgressBarProps> = ({
  percent,
  isCompleted
}) => {
  const safePercent = Math.min(100, Math.max(0, percent));
  
  // Recharts mini horizontal bar chart dataset
  const data = [
    {
      name: 'Progress',
      completed: safePercent,
      remaining: 100 - safePercent
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
        <span className="font-medium">Progres Baca:</span>
        <span className={`font-bold ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
          {safePercent}% {isCompleted ? '✓ Selesai' : ''}
        </span>
      </div>

      {/* Mini Recharts Bar Representation */}
      <div className="h-2 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="name" hide />
            <Bar
              dataKey="completed"
              stackId="a"
              fill={isCompleted ? '#10b981' : '#4f46e5'}
              radius={[4, 4, 4, 4]}
              isAnimationActive={true}
              animationDuration={800}
            />
            <Bar
              dataKey="remaining"
              stackId="a"
              fill="transparent"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
