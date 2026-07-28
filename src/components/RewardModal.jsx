import React from 'react';

export default function RewardModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-pink-200 text-center space-y-4 animate-in fade-in zoom-in duration-200">
        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center text-2xl mx-auto shadow-inner">
          🌟
        </div>
        
        <div className="space-y-2">
          {/* Softened header font weight */}
          <h3 className="font-semibold text-base text-gray-800">
            Extra Effort Recognized
          </h3>
          
          {/* Main message */}
          <p className="text-xs text-gray-500 leading-relaxed">
            You cleared your goals and kept going.
          </p>

          {/* Reward badge on a completely new row */}
          <div className="pt-1">
            <span className="inline-block bg-amber-50 text-amber-700 border border-amber-200 font-bold text-xs px-3 py-1 rounded-full shadow-xs">
              +60 Coins added ✨
            </span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs shadow-sm transition"
        >
          Keep Going
        </button>
      </div>
    </div>
  );
}