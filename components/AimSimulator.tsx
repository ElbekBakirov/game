
import React, { useState, useEffect, useRef } from 'react';

const AimSimulator: React.FC<{ sensitivity: number }> = ({ sensitivity }) => {
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState({ x: 50, y: 50 });
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const spawnTarget = () => {
    setTarget({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10
    });
  };

  const handleHit = () => {
    setScore(s => s + 1);
    spawnTarget();
    // Simulate haptic feel
    if (window.navigator.vibrate) window.navigator.vibrate(10);
  };

  return (
    <div className="glass-v2 p-8 border-t-2 border-cyan-500 animate-fade-in relative overflow-hidden h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-xl font-orbitron font-black text-white italic">NEURAL_TARGET_SYNC</h4>
          <p className="text-[7px] font-black text-cyan-500 uppercase tracking-widest">Test the feel of {sensitivity} Gen Sensi</p>
        </div>
        <div className="text-right">
          <div className="text-[7px] text-slate-500 font-black">SYNC_SCORE</div>
          <div className="text-2xl font-orbitron font-black text-white">{score}</div>
        </div>
      </div>

      {!isActive ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
          <button 
            onClick={() => { setIsActive(true); spawnTarget(); }}
            className="px-12 py-5 bg-cyan-500 text-black font-orbitron font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all"
          >
            Start Neural Calibration
          </button>
        </div>
      ) : (
        <div 
          ref={containerRef}
          className="relative w-full h-full cursor-crosshair border border-white/5 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.05)_0%,_transparent_70%)]"
        >
          <div 
            onClick={handleHit}
            style={{ left: `${target.x}%`, top: `${target.y}%` }}
            className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center transition-all duration-75"
          >
            <div className="absolute inset-0 border-2 border-cyan-500 rounded-full animate-ping"></div>
            <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white]"></div>
            <div className="absolute w-10 h-[1px] bg-cyan-500/50"></div>
            <div className="absolute h-10 w-[1px] bg-cyan-500/50"></div>
          </div>
          
          <button 
            onClick={() => { setIsActive(false); setScore(0); }}
            className="absolute bottom-4 right-4 text-[7px] font-black text-slate-600 hover:text-white uppercase"
          >
            Terminate Sim
          </button>
        </div>
      )}
    </div>
  );
};

export default AimSimulator;
