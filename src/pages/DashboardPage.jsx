import React from 'react';
import { BarChart3, Sparkles } from 'lucide-react';

export default function DashboardPage({ tasks, completedCount, monthlyHistory, currentTheme }) {
  const totalMonthlyCompleted = monthlyHistory.reduce((acc, curr) => acc + curr.completed, 0) + completedCount;
  const totalMonthlyScheduled = monthlyHistory.reduce((acc, curr) => acc + curr.total, 0) + tasks.length;
  const monthlyPercentage = totalMonthlyScheduled > 0 ? Math.round((totalMonthlyCompleted / totalMonthlyScheduled) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col gap-3 py-1 overflow-y-auto">
      {/* Dino Box */}
      <div className={`p-4 rounded-3xl ${currentTheme.card} border flex flex-col items-center justify-center shadow-sm relative overflow-hidden shrink-0`}>
        <div className={`w-24 h-24 rounded-full ${currentTheme.dinoBg} flex items-center justify-center text-5xl shadow-inner animate-bounce`}>
          🦕
        </div>
        <p className="mt-2 font-bold text-base">{currentTheme.dinoName}</p>
        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/70 mt-0.5 font-medium">
          Level 1 Companion
        </span>
      </div>

      {/* Monthly Consistency Progress Card */}
      <div className="p-4 rounded-2xl bg-white/80 backdrop-blur border border-white/50 shadow-sm space-y-2 shrink-0">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 font-semibold">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Monthly Consistency</span>
          </div>
          <span className="font-bold text-emerald-600">{monthlyPercentage}% Overall</span>
        </div>
        <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
          <div className={`h-full ${currentTheme.accent} transition-all duration-500`} style={{ width: `${monthlyPercentage}%` }}></div>
        </div>
        <p className="text-[11px] opacity-70">
          You completed <span className="font-bold">{totalMonthlyCompleted}</span> of <span className="font-bold">{totalMonthlyScheduled}</span> scheduled tasks this month.
        </p>
      </div>

      {/* Weekly History Breakdown */}
      <div className="bg-white/70 p-3 rounded-2xl border border-white/60 shadow-sm space-y-2 shrink-0">
        <span className="text-xs font-bold opacity-70 px-1">Weekly History</span>
        <div className="grid grid-cols-2 gap-2">
          {monthlyHistory.map((wk, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-white border border-gray-100 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold">{wk.week}</p>
                <p className="text-[10px] opacity-60">{wk.completed}/{wk.total} Tasks</p>
              </div>
              <span className="font-extrabold text-emerald-600 text-xs">{wk.percentage}%</span>
            </div>
          ))}
          <div className="p-2.5 rounded-xl bg-pink-100/60 border border-pink-200 flex justify-between items-center text-xs">
            <div>
              <p className="font-bold text-pink-900">Current Week</p>
              <p className="text-[10px] opacity-70">{completedCount}/{tasks.length} Tasks</p>
            </div>
            <span className="font-extrabold text-pink-700 text-xs">
              {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className={`p-3.5 rounded-2xl ${currentTheme.card} border shadow-sm shrink-0`}>
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm font-medium italic">
            "Progress isn't linear. Small steps every day add up to giant leaps."
          </p>
        </div>
      </div>
    </div>
  );
}