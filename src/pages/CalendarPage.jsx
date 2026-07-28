import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function CalendarPage({ tasks, onAddTask, onDeleteTask, currentTheme }) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [calTitle, setCalTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!calTitle.trim()) return;
    onAddTask({
      id: Date.now(),
      title: calTitle,
      completed: false,
      source: 'calendar',
      day: selectedDay
    });
    setCalTitle('');
  };

  const dayTasks = tasks.filter(t => t.source === 'calendar' && t.day === selectedDay);

  return (
    <div className="flex-1 flex flex-col gap-3 py-1 overflow-hidden">
      {/* Page Header */}
      <div className={`p-3 rounded-2xl ${currentTheme.card} border shadow-sm`}>
        <h2 className="font-bold text-sm sm:text-base">Weekly Calendar</h2>
        <p className="text-[11px] opacity-70">Tasks scheduled here auto-sync directly to your Staircase Roadmap!</p>
      </div>

      {/* Evenly Spaced 7-Day Grid Strip */}
      <div className="grid grid-cols-7 gap-1.5 shrink-0 w-full">
        {daysOfWeek.map((day) => {
          const isSelected = selectedDay === day;
          const dayTaskCount = tasks.filter(t => t.source === 'calendar' && t.day === day).length;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center w-full border ${
                isSelected 
                  ? `${currentTheme.accent} shadow-sm border-transparent` 
                  : 'bg-white/80 border-gray-200 text-gray-700 hover:bg-white'
              }`}
            >
              <span className="text-[11px]">{day.slice(0, 3)}</span>
              {dayTaskCount > 0 && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full mt-0.5 ${isSelected ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-700'}`}>
                  {dayTaskCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Add Task Input for Selected Day */}
      <form onSubmit={handleSubmit} className="flex gap-2 shrink-0">
        <input 
          type="text"
          placeholder={`Add task for ${selectedDay}...`}
          value={calTitle}
          onChange={(e) => setCalTitle(e.target.value)}
          className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <button 
          type="submit"
          className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold ${currentTheme.accent} flex items-center gap-1 shadow-sm`}
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </form>

      {/* Task List for Selected Day Only */}
      <div className="bg-white/70 backdrop-blur p-3 rounded-2xl border border-white/60 shadow-sm flex-1 overflow-y-auto space-y-2">
        <span className="text-xs font-bold opacity-70 px-1">{selectedDay}'s Schedule:</span>
        {dayTasks.length === 0 ? (
          <p className="text-xs opacity-50 italic text-center py-6">No tasks scheduled for {selectedDay} yet.</p>
        ) : (
          dayTasks.map((task) => (
            <div key={task.id} className="p-2.5 rounded-xl bg-white border border-gray-100 flex justify-between items-center text-xs shadow-sm">
              <span className={task.completed ? 'line-through opacity-50' : 'font-medium text-gray-800'}>
                {task.title}
              </span>
              {!task.completed && (
                <button 
                  onClick={() => onDeleteTask(task.id)} 
                  className="text-gray-400 hover:text-red-500 transition p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}