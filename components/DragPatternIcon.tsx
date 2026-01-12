
import React from 'react';
import { DragPattern } from '../types';

const DragPatternIcon: React.FC<{ type: DragPattern }> = ({ type }) => {
  const getPath = () => {
    switch (type) {
      case 'J-Curve': return "M 50 80 Q 55 85, 60 80 T 60 20";
      case 'Straight': return "M 50 80 L 50 20";
      case 'Circular': return "M 50 80 C 20 80, 20 20, 50 20 S 80 80, 50 80";
      default: return "M 50 80 L 50 20";
    }
  };

  return (
    <div className="relative w-24 h-32 bg-slate-900/50 border border-white/5 flex items-center justify-center p-2 group">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="dragGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
          </linearGradient>
        </defs>
        
        {/* Phone frame silhouette */}
        <rect x="10" y="5" width="80" height="90" rx="5" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
        
        {/* Animated path */}
        <path 
          d={getPath()} 
          fill="none" 
          stroke="url(#dragGradient)" 
          strokeWidth="3" 
          strokeLinecap="round"
          className="animate-[draw_2s_infinite]"
          style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
        />
        
        {/* Touch point */}
        <circle cx="50" cy="80" r="4" fill="#a855f7" className="animate-pulse" />
        
        {/* Arrow head */}
        <path d="M 45 25 L 50 20 L 55 25" fill="none" stroke="#a855f7" strokeWidth="2" />
      </svg>
      
      <style>{`
        @keyframes draw {
          to { strokeDashoffset: 0; }
        }
      `}</style>

      <div className="absolute -bottom-6 left-0 w-full text-center">
        <span className="text-[6px] font-black text-purple-500 uppercase tracking-widest">{type} DRAG</span>
      </div>
    </div>
  );
};

export default DragPatternIcon;
