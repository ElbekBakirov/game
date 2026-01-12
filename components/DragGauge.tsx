
import React, { useState, useRef } from 'react';

interface Props {
  onMeasured: (velocity: number) => void;
}

const DragGauge: React.FC<Props> = ({ onMeasured }) => {
  const [velocity, setVelocity] = useState(0);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const dragStartRef = useRef<{ y: number, t: number } | null>(null);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = { y, t: performance.now() };
    setIsMeasuring(true);
  };

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragStartRef.current) return;
    const y = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    const t = performance.now();
    
    const distance = dragStartRef.current.y - y; // Upward drag
    const time = t - dragStartRef.current.t;
    
    if (distance > 50 && time > 0) {
      const v = Math.round((distance / time) * 100);
      setVelocity(v);
      onMeasured(v);
    }
    
    setIsMeasuring(false);
    dragStartRef.current = null;
  };

  return (
    <div className="glass-v2 p-10 border-t-2 border-purple-500 animate-fade-in mb-20 relative overflow-hidden">
      <div className="flex justify-between items-end border-b border-white/5 pb-6 mb-10">
        <div>
          <h3 className="text-2xl font-orbitron font-black text-white italic uppercase">TACTICAL_DRAG_GAUGE</h3>
          <p className="text-[8px] font-black text-purple-500 tracking-[0.4em] uppercase mt-2">Biometric Swipe Velocity Analysis</p>
        </div>
        <div className="text-[10px] font-orbitron font-black text-white">{velocity} <span className="text-[7px] text-slate-500">v/ms</span></div>
      </div>

      <div 
        onMouseDown={handleStart} onMouseUp={handleEnd}
        onTouchStart={handleStart} onTouchEnd={handleEnd}
        className="h-64 bg-black/40 border-2 border-dashed border-purple-500/20 flex flex-col items-center justify-center cursor-ns-resize group relative overflow-hidden"
      >
        <div className={`absolute inset-0 bg-purple-500/5 transition-opacity ${isMeasuring ? 'opacity-100' : 'opacity-0'}`}></div>
        
        <div className="relative z-10 text-center">
           <svg className={`w-12 h-12 text-purple-500 mb-4 transition-transform ${isMeasuring ? 'animate-bounce' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
           </svg>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Perform a fast upward drag inside this zone</p>
        </div>

        {velocity > 0 && (
          <div className="absolute bottom-6 right-6">
             <div className="text-[7px] font-black text-purple-500 uppercase mb-1">Status</div>
             <div className="text-[9px] font-black text-white uppercase tracking-tighter">Velocity_Synced_v25</div>
          </div>
        )}
      </div>

      <p className="text-[8px] text-slate-600 uppercase italic mt-6 text-center">
        "Drag tezligingiz qanchalik yuqori bo'lsa, AI shunchalik barqaror General sezgirlikni tanlaydi."
      </p>
    </div>
  );
};

export default DragGauge;
