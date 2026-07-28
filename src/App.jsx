import React, { useState } from 'react';
import { Calendar as CalendarIcon, Timer, Home, Heart, Map, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';

import RewardModal from './components/RewardModal';
import CalendarPage from './pages/CalendarPage';
import DashboardPage from './pages/DashboardPage';
import RoadmapPage from './pages/RoadmapPage';

export default function App() {
  const [theme, setTheme] = useState('candyland');
  const [activeTab, setActiveTab] = useState('calendar');
  
  // Coins & Streak
  const [coins, setCoins] = useState(120);
  const [streak] = useState(2);
  const [coinAnimating, setCoinAnimating] = useState(false);

  // Bonus Modal State
  const [hasCompletedInitialRoadmap, setHasCompletedInitialRoadmap] = useState(false);
  const [hasClaimedDivaBonus, setHasClaimedDivaBonus] = useState(false);
  const [showDivaModal, setShowDivaModal] = useState(false);

  // Tasks State
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Read 1 chapter of book', completed: true, source: 'calendar', day: 'Monday' },
    { id: 2, title: 'Outline V1 App Features', completed: true, source: 'calendar', day: 'Monday' },
    { id: 3, title: 'Set up Supabase backend', completed: false, source: 'roadmap', day: 'Tuesday' },
    { id: 4, title: '15-minute afternoon walk', completed: false, source: 'calendar', day: 'Wednesday' },
  ]);

  const [monthlyHistory] = useState([
    { week: 'Week 1', completed: 7, total: 7, percentage: 100 },
    { week: 'Week 2', completed: 6, total: 8, percentage: 75 },
    { week: 'Week 3', completed: 5, total: 6, percentage: 83 },
  ]);

  const themes = {
    candyland: {
      bg: 'bg-pink-50',
      card: 'bg-pink-100/70 border-pink-200',
      text: 'text-pink-900',
      accent: 'bg-pink-400 hover:bg-pink-500 text-white',
      dinoBg: 'bg-pink-200',
      dinoIcon: '🌸',
      dinoName: 'Pinky Dino',
      activeTab: 'bg-pink-300 text-pink-950',
      stairBg: 'bg-pink-200/80 border-pink-300',
      stairActive: 'bg-pink-400 text-white border-pink-500 shadow-md',
    },
    nature: {
      bg: 'bg-emerald-50',
      card: 'bg-emerald-100/70 border-emerald-200',
      text: 'text-emerald-900',
      accent: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      dinoBg: 'bg-emerald-200',
      dinoIcon: '🌱',
      dinoName: 'Sprout Dino',
      activeTab: 'bg-emerald-300 text-emerald-950',
      stairBg: 'bg-emerald-200/80 border-emerald-300',
      stairActive: 'bg-emerald-500 text-white border-emerald-600 shadow-md',
    },
    ocean: {
      bg: 'bg-sky-50',
      card: 'bg-sky-100/70 border-sky-200',
      text: 'text-sky-900',
      accent: 'bg-sky-400 hover:bg-sky-500 text-white',
      dinoBg: 'bg-sky-200',
      dinoIcon: '🌊',
      dinoName: 'Splash Dino',
      activeTab: 'bg-sky-300 text-sky-950',
      stairBg: 'bg-sky-200/80 border-sky-300',
      stairActive: 'bg-sky-400 text-white border-sky-500 shadow-md',
    }
  };

  const currentTheme = themes[theme];
  const completedCount = tasks.filter(t => t.completed).length;

  const triggerDopamineReward = (earnedCoins, triggerConfetti = false) => {
    setCoinAnimating(true);
    setTimeout(() => {
      setCoins(prev => prev + earnedCoins);
      setCoinAnimating(false);
    }, 400);

    if (triggerConfetti) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  const toggleTask = (id) => {
    const currentTask = tasks.find(t => t.id === id);
    if (!currentTask) return;

    const isNowCompleted = !currentTask.completed;
    const updated = tasks.map(t => t.id === id ? { ...t, completed: isNowCompleted } : t);
    setTasks(updated);

    if (isNowCompleted) {
      const allDoneNow = updated.every(t => t.completed);

      if (allDoneNow && !hasCompletedInitialRoadmap) {
        setHasCompletedInitialRoadmap(true);
        triggerDopamineReward(60, true);
      } else if (hasCompletedInitialRoadmap && !hasClaimedDivaBonus) {
        setHasClaimedDivaBonus(true);
        setShowDivaModal(true);
        triggerDopamineReward(60, true);
      } else if (hasCompletedInitialRoadmap && hasClaimedDivaBonus) {
        triggerDopamineReward(20, false);
      } else {
        triggerDopamineReward(10, false);
      }
    } else {
      let pointsToDeduct = 10;
      if (hasCompletedInitialRoadmap && updated.filter(t => t.completed).length < tasks.length) {
        setHasCompletedInitialRoadmap(false);
        pointsToDeduct = 60;
      }
      setCoins(prev => Math.max(0, prev - pointsToDeduct));
    }
  };

  const addTask = (newTask) => setTasks([...tasks, newTask]);
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  return (
    <div className={`h-screen w-full ${currentTheme.bg} ${currentTheme.text} transition-colors duration-300 font-sans flex flex-col overflow-hidden relative`}>
      
      {/* Grounded Reward Modal */}
      <RewardModal isOpen={showDivaModal} onClose={() => setShowDivaModal(false)} />

      {/* Top Header Bar */}
      <header className="w-full max-w-md mx-auto p-3 sm:p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl">{currentTheme.dinoIcon}</span>
          <h1 className="font-bold text-lg sm:text-xl tracking-wide">Dino Buddy</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-sm border border-amber-200 transition-transform ${coinAnimating ? 'scale-125 bg-amber-300' : ''}`}>
            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 animate-spin" />
            <span>{coins}</span>
          </div>

          <div className="flex gap-1 bg-white/60 p-1 rounded-full border border-gray-200 shadow-sm">
            <button onClick={() => setTheme('candyland')} className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-pink-300 ${theme === 'candyland' ? 'ring-2 ring-pink-500' : ''}`} title="Candy Land Theme" />
            <button onClick={() => setTheme('nature')} className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-400 ${theme === 'nature' ? 'ring-2 ring-emerald-600' : ''}`} title="Nature Theme" />
            <button onClick={() => setTheme('ocean')} className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-sky-300 ${theme === 'ocean' ? 'ring-2 ring-sky-500' : ''}`} title="Ocean Theme" />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-md mx-auto px-4 flex-1 flex flex-col overflow-hidden pb-24">
        {/* Daily Consistency Banner */}
        <div className="p-3 sm:p-4 rounded-2xl bg-white/80 backdrop-blur border border-white/50 shadow-sm flex items-center gap-3 shrink-0 mb-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-100 flex items-center justify-center text-lg shrink-0">
            ⚡
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-medium opacity-70">Daily Consistency</p>
            <p className="font-bold text-xs sm:text-sm">Day {streak} of being consistent! You got this! 🏆</p>
          </div>
        </div>

        {/* Page Views */}
        {activeTab === 'calendar' && (
          <CalendarPage 
            tasks={tasks} 
            onAddTask={addTask} 
            onDeleteTask={deleteTask} 
            currentTheme={currentTheme} 
          />
        )}

        {activeTab === 'main' && (
          <DashboardPage 
            tasks={tasks} 
            completedCount={completedCount} 
            monthlyHistory={monthlyHistory} 
            currentTheme={currentTheme} 
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapPage 
            tasks={tasks} 
            completedCount={completedCount} 
            onToggleTask={toggleTask} 
            onAddTask={addTask} 
            onDeleteTask={deleteTask} 
            currentTheme={currentTheme} 
          />
        )}

        {activeTab === 'timer' && (
          <div className="p-6 text-center bg-white/70 rounded-2xl my-auto">
            <h2 className="font-bold text-lg">⏳ Dual Timer Page</h2>
            <p className="text-sm opacity-70 mt-1">Coming next!</p>
          </div>
        )}

        {activeTab === 'motivation' && (
          <div className="p-6 text-center bg-white/70 rounded-2xl my-auto">
            <h2 className="font-bold text-lg">💡 Motivation Page</h2>
            <p className="text-sm opacity-70 mt-1">Coming next!</p>
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-3 left-4 right-4 bg-white/95 backdrop-blur border border-gray-200/80 py-2 px-4 flex justify-around items-center max-w-md mx-auto rounded-2xl shadow-lg z-50">
        <button onClick={() => setActiveTab('calendar')} className={`flex flex-col items-center p-1.5 rounded-xl text-[11px] font-medium transition ${activeTab === 'calendar' ? currentTheme.activeTab : 'opacity-60 hover:opacity-100'}`}>
          <CalendarIcon className="w-4 h-4 mb-0.5" />
          <span>Calendar</span>
        </button>

        <button onClick={() => setActiveTab('timer')} className={`flex flex-col items-center p-1.5 rounded-xl text-[11px] font-medium transition ${activeTab === 'timer' ? currentTheme.activeTab : 'opacity-60 hover:opacity-100'}`}>
          <Timer className="w-4 h-4 mb-0.5" />
          <span>Timer</span>
        </button>

        <button onClick={() => setActiveTab('main')} className={`flex flex-col items-center p-1.5 rounded-xl text-[11px] font-medium transition ${activeTab === 'main' ? currentTheme.activeTab : 'opacity-60 hover:opacity-100'}`}>
          <Home className="w-4 h-4 mb-0.5" />
          <span>Dino</span>
        </button>

        <button onClick={() => setActiveTab('motivation')} className={`flex flex-col items-center p-1.5 rounded-xl text-[11px] font-medium transition ${activeTab === 'motivation' ? currentTheme.activeTab : 'opacity-60 hover:opacity-100'}`}>
          <Heart className="w-4 h-4 mb-0.5" />
          <span>Stories</span>
        </button>

        <button onClick={() => setActiveTab('roadmap')} className={`flex flex-col items-center p-1.5 rounded-xl text-[11px] font-medium transition ${activeTab === 'roadmap' ? currentTheme.activeTab : 'opacity-60 hover:opacity-100'}`}>
          <Map className="w-4 h-4 mb-0.5" />
          <span>Roadmap</span>
        </button>
      </nav>

    </div>
  );
}