import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, HelpCircle, Shield, Hourglass, CheckCircle2, Clock } from 'lucide-react';

export default function TimerPage({ tasks, onToggleTask, currentTheme }) {
  // Help Modal State
  const [showHelpModal, setShowHelpModal] = useState(false);

  // --- TIMER A: TOTAL SESSION GUARD ---
  const [sessionTotalSeconds, setSessionTotalSeconds] = useState(10800); // Default 3 hours
  const [sessionRemaining, setSessionRemaining] = useState(10800);
  const [isSessionRunning, setIsSessionRunning] = useState(false);
  const [sessionInputHours, setSessionInputHours] = useState(3);

  // --- TIMER B: TASK / SPRINT TIMER ---
  const [sprintTotalSeconds, setSprintTotalSeconds] = useState(3600); // Default 1 hour
  const [sprintRemaining, setSprintRemaining] = useState(3600);
  const [isSprintRunning, setIsSprintRunning] = useState(false);
  const [sprintInputMins, setSprintInputMins] = useState(60);

  // Selected Task
  const activeTasks = tasks.filter(t => !t.completed);
  const [selectedTaskId, setSelectedTaskId] = useState(activeTasks[0]?.id || null);

  // Session Guard Engine
  useEffect(() => {
    let interval = null;
    if (isSessionRunning && sessionRemaining > 0) {
      interval = setInterval(() => {
        setSessionRemaining(prev => prev - 1);
      }, 1000);
    } else if (sessionRemaining === 0) {
      setIsSessionRunning(false);
    }
    return () => clearInterval(interval);
  }, [isSessionRunning, sessionRemaining]);

  // Sprint Timer Engine
  useEffect(() => {
    let interval = null;
    if (isSprintRunning && sprintRemaining > 0) {
      interval = setInterval(() => {
        setSprintRemaining(prev => prev - 1);
      }, 1000);
    } else if (sprintRemaining === 0) {
      setIsSprintRunning(false);
    }
    return () => clearInterval(interval);
  }, [isSprintRunning, sprintRemaining]);

  // Format Helper: Seconds -> HH:MM:SS
  const formatTime = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
    }
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Set Session Guard Hours
  const handleApplySessionHours = (hrs) => {
    const val = Math.max(0, Number(hrs));
    setSessionInputHours(val);
    const secs = val * 3600;
    setSessionTotalSeconds(secs);
    setSessionRemaining(secs);
    setIsSessionRunning(false);
  };

  // Set Sprint Minutes
  const handleApplySprintMins = (mins) => {
    const val = Math.max(0, Number(mins));
    setSprintInputMins(val);
    const secs = val * 60;
    setSprintTotalSeconds(secs);
    setSprintRemaining(secs);
    setIsSprintRunning(false);
  };

  return (
    <div className="flex-1 flex flex-col gap-3 py-1 overflow-hidden relative">
      
      {/* Help Modal Popup */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-pink-200 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-pink-500" />
                <span>How Dual Timers Work</span>
              </h3>
            </div>

            <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <p className="font-bold text-amber-900 mb-0.5">1. Total Session Guard (Macro)</p>
                <p>Your safety net! Set your total study block (e.g., 3 hours) so you know you won't work forever.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200">
                <p className="font-bold text-pink-900 mb-0.5">2. Task Sprint Timer (Micro)</p>
                <p>Paces your current subject or break (e.g., 1 hour task block, or 15-min break).</p>
              </div>

              <p className="text-[11px] opacity-70 italic text-center">
                ✨ Use both together, or just use whichever one you need today!
              </p>
            </div>

            <button 
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-sm transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className={`p-3 rounded-2xl ${currentTheme.card} border shadow-sm flex justify-between items-center shrink-0`}>
        <div>
          <h2 className="font-bold text-sm sm:text-base">Focus Timers</h2>
          <p className="text-[11px] opacity-70">Session limits & task sprint pacing.</p>
        </div>
        <button 
          onClick={() => setShowHelpModal(true)}
          className="flex items-center gap-1 text-xs font-semibold bg-white/80 hover:bg-white px-2.5 py-1 rounded-full border border-gray-200 shadow-2xs transition"
          title="Explain dual timers"
        >
          <HelpCircle className="w-3.5 h-3.5 text-pink-500" />
          <span>How it works</span>
        </button>
      </div>

      {/* Dual Timers Scroll Container */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
        
        {/* TIMER A: TOTAL SESSION GUARD */}
        <div className="p-4 rounded-3xl bg-white/80 backdrop-blur border border-amber-200/80 shadow-sm space-y-3 shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-gray-800">Total Session Guard</h3>
                <p className="text-[10px] text-gray-500">Safety net limit for today's entire session</p>
              </div>
            </div>

            {/* Quick Preset Inputs */}
            <div className="flex items-center gap-1 text-xs">
              <input 
                type="number"
                min="1"
                max="12"
                value={sessionInputHours}
                onChange={(e) => handleApplySessionHours(e.target.value)}
                className="w-12 text-center py-0.5 border border-gray-200 rounded-lg text-xs font-bold bg-white"
              />
              <span className="text-[10px] font-semibold text-gray-500">hrs</span>
            </div>
          </div>

          {/* Session Timer Display */}
          <div className="flex items-center justify-between bg-amber-50/60 p-3 rounded-2xl border border-amber-100">
            <div>
              <span className="text-xl font-black text-amber-950 tracking-tight">
                {formatTime(sessionRemaining)}
              </span>
              <span className="text-[10px] text-amber-700 block font-medium">
                {sessionRemaining === 0 ? 'Session Finished!' : 'Remaining in total study limit'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSessionRunning(!isSessionRunning)}
                className={`p-2 px-3 rounded-xl font-bold text-xs flex items-center gap-1 shadow-2xs transition ${
                  isSessionRunning 
                    ? 'bg-amber-400 text-amber-950' 
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                }`}
              >
                {isSessionRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isSessionRunning ? 'Pause' : 'Start'}</span>
              </button>

              <button
                onClick={() => {
                  setIsSessionRunning(false);
                  setSessionRemaining(sessionTotalSeconds);
                }}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                title="Reset session timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* TIMER B: TASK / SPRINT TIMER */}
        <div className={`p-4 rounded-3xl ${currentTheme.card} border shadow-sm space-y-3 flex-1 flex flex-col justify-between`}>
          <div className="space-y-2 shrink-0">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-pink-200 text-pink-900">
                  <Hourglass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-gray-800">Task Sprint Timer</h3>
                  <p className="text-[10px] text-gray-500">Pacing for active task block or break</p>
                </div>
              </div>

              {/* Quick Sprint Minutes Setter */}
              <div className="flex items-center gap-1 text-xs">
                <input 
                  type="number"
                  min="1"
                  max="180"
                  value={sprintInputMins}
                  onChange={(e) => handleApplySprintMins(e.target.value)}
                  className="w-12 text-center py-0.5 border border-gray-200 rounded-lg text-xs font-bold bg-white"
                />
                <span className="text-[10px] font-semibold text-gray-500">mins</span>
              </div>
            </div>

            {/* Task Selector */}
            {activeTasks.length > 0 && (
              <select
                value={selectedTaskId || ''}
                onChange={(e) => setSelectedTaskId(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-white/80 bg-white/90 text-gray-800 shadow-2xs focus:outline-none"
              >
                {activeTasks.map(task => (
                  <option key={task.id} value={task.id}>
                    {task.day ? `[${task.day.slice(0,3)}] ` : ''}{task.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Big Sprint Display */}
          <div className="flex flex-col items-center justify-center my-auto py-2">
            <div className={`w-32 h-32 rounded-full bg-white/90 border-4 ${isSprintRunning ? 'border-pink-400 ring-8 ring-pink-100/60 animate-pulse' : 'border-gray-200'} flex flex-col items-center justify-center shadow-md transition-all`}>
              <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">
                {isSprintRunning ? 'Sprint Active' : 'Paused'}
              </span>
              <span className="text-2xl font-black text-gray-800 my-0.5">
                {formatTime(sprintRemaining)}
              </span>
              <span className="text-[9px] text-gray-400 font-medium">
                Current Block
              </span>
            </div>
          </div>

          {/* Sprint Controls */}
          <div className="space-y-2 shrink-0">
            <div className="flex gap-2">
              <button
                onClick={() => setIsSprintRunning(!isSprintRunning)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95 ${
                  isSprintRunning 
                    ? 'bg-amber-400 text-amber-950' 
                    : `${currentTheme.accent}`
                }`}
              >
                {isSprintRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isSprintRunning ? 'Pause Sprint' : 'Start Sprint'}</span>
              </button>

              <button
                onClick={() => {
                  setIsSprintRunning(false);
                  setSprintRemaining(sprintTotalSeconds);
                }}
                className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-2xs"
                title="Reset sprint timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {selectedTaskId && (
              <button
                onClick={() => {
                  setIsSprintRunning(false);
                  onToggleTask(selectedTaskId);
                  setSprintRemaining(sprintTotalSeconds);
                }}
                className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Finish Task & Claim</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}