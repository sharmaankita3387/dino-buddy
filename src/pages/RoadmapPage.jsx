import React, { useState } from 'react';
import { Trophy, CheckCircle2, Trash2, Plus, Flag } from 'lucide-react';

export default function RoadmapPage({ tasks, completedCount, onToggleTask, onAddTask, onDeleteTask, currentTheme }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Day weights for chronological ordering
  const dayWeights = {
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
    'Sunday': 7,
    'This Week': 8
  };

  // Sort tasks chronologically starting from Monday
  const sortedTasks = [...tasks].sort((a, b) => {
    const weightA = dayWeights[a.day] || 8;
    const weightB = dayWeights[b.day] || 8;
    return weightA - weightB;
  });

  // Find the exact index of the next active (incomplete) task
  const activeTaskIndex = sortedTasks.findIndex(t => !t.completed);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({
      id: Date.now(),
      title: newTaskTitle,
      completed: false,
      source: 'roadmap',
      day: 'This Week'
    });
    setNewTaskTitle('');
  };

  // Alternating X-positions for circular nodes (Left, Center, Right, Center)
  const getNodePositionClass = (index) => {
    const positions = [
      'justify-start pl-6',   // Left
      'justify-center',       // Center
      'justify-end pr-6',     // Right
      'justify-center',       // Center
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="flex-1 flex flex-col gap-3 py-1 overflow-hidden">
      {/* Page Header */}
      <div className={`p-3 rounded-2xl ${currentTheme.card} border shadow-sm flex justify-between items-center shrink-0`}>
        <div>
          <h2 className="font-bold text-sm sm:text-base">Level Map</h2>
          <p className="text-[11px] opacity-70">Guide Dino down the path to reach the trophy!</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold bg-white/80 px-2.5 py-1 rounded-full border border-gray-200">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>{completedCount} / {tasks.length}</span>
        </div>
      </div>

      {/* Interactive Level Map Container */}
      <div className="bg-white/60 backdrop-blur p-4 rounded-3xl border border-white/80 shadow-sm flex-1 overflow-y-auto relative flex flex-col gap-5">
        
        {/* Level Map Nodes */}
        <div className="flex flex-col gap-6 relative py-2">
          
          {sortedTasks.map((task, idx) => {
            const stepNum = idx + 1;
            
            // Dino sits on the FIRST incomplete task (active target).
            // If ALL tasks are complete, Dino sits on the very last task!
            const isDinoHere = activeTaskIndex === -1 
              ? idx === sortedTasks.length - 1 
              : idx === activeTaskIndex;

            const isFirstOfDay = idx === 0 || sortedTasks[idx - 1].day !== task.day;
            const posClass = getNodePositionClass(idx);

            return (
              <React.Fragment key={task.id}>
                {/* Day Checkpoint Signpost */}
                {isFirstOfDay && (
                  <div className="flex items-center justify-center my-1 z-10">
                    <div className="flex items-center gap-1.5 bg-amber-100/90 border border-amber-300/80 px-3 py-1 rounded-full shadow-xs text-amber-900 font-bold text-[10px] tracking-wide">
                      <Flag className="w-3 h-3 text-amber-600" />
                      <span>{task.day} Checkpoint</span>
                    </div>
                  </div>
                )}

                {/* Level Node Row */}
                <div className={`flex items-center ${posClass} relative group z-10`}>
                  
                  {/* Circular Node + Label Group */}
                  <div className="flex items-center gap-3 relative max-w-[260px]">
                    
                    {/* Compact Circular Level Node */}
                    <div className="relative shrink-0">
                      
                      {/* Dino Standing Above Active Node */}
                      {isDinoHere && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-30 animate-bounce flex flex-col items-center pointer-events-none">
                          <span className="text-2xl drop-shadow-xs">🦕</span>
                        </div>
                      )}

                      {/* Clickable Circle Button */}
                      <button 
                        onClick={() => onToggleTask(task.id)}
                        className={`w-12 h-12 rounded-full font-extrabold text-sm flex items-center justify-center transition-all duration-200 shadow-md border-2 hover:scale-110 active:scale-95 ${
                          task.completed 
                            ? 'bg-emerald-400 text-white border-emerald-500 ring-4 ring-emerald-100' 
                            : `${currentTheme.dinoBg} text-gray-800 border-white ring-2 ring-pink-200 hover:border-pink-400`
                        }`}
                      >
                        {task.completed ? <CheckCircle2 className="w-6 h-6 text-white" /> : stepNum}
                      </button>
                    </div>

                    {/* Task Title Side Card */}
                    <div 
                      onClick={() => onToggleTask(task.id)}
                      className={`cursor-pointer p-2 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-2 shadow-xs transition-all flex-1 min-w-[140px] ${
                        task.completed 
                          ? 'bg-gray-100/80 border-gray-200 text-gray-400 line-through' 
                          : 'bg-white/90 border-gray-200/80 text-gray-800 hover:border-pink-300'
                      }`}
                    >
                      <span className="truncate max-w-[130px]">{task.title}</span>

                      {!task.completed && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTask(task.id);
                          }}
                          className="text-gray-300 hover:text-red-500 transition p-0.5 shrink-0"
                          title="Delete stage"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              </React.Fragment>
            );
          })}

        </div>

        {/* Goal Summit Trophy */}
        <div className="flex flex-col items-center justify-center pt-4 pb-2 z-10">
          <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300 shadow-md ${
            completedCount === tasks.length && tasks.length > 0 
              ? 'bg-amber-300 border-amber-400 animate-bounce scale-110' 
              : 'bg-amber-100/80 border-amber-200/60 opacity-60'
          }`}>
            <Trophy className="w-8 h-8 text-amber-600" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1 bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
            Goal Summit
          </span>
        </div>

      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 shrink-0">
        <input 
          type="text"
          placeholder="Add a new stage..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <button 
          type="submit"
          className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold ${currentTheme.accent} flex items-center gap-1 shadow-sm`}
        >
          <Plus className="w-4 h-4" />
          <span>Add Stage</span>
        </button>
      </form>
    </div>
  );
}