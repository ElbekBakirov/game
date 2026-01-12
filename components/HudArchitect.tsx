
import React, { useState } from 'react';

interface HudElement {
  id: string;
  name: string;
  x: number;
  y: number;
  size: number;
}

const HudArchitect: React.FC = () => {
  const [fingers, setFingers] = useState<2 | 3 | 4>(4);
  const [elements, setElements] = useState<HudElement[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const initializeLayout = (f: number) => {
    const base: HudElement[] = [
      { id: 'joystick', name: 'Joystick', x: 20, y: 70, size: 60 },
      { id: 'fire', name: 'Fire', x: 80, y: 70, size: 55 },
      { id: 'jump', name: 'Jump', x: 85, y: 50, size: 45 },
      { id: 'gloo', name: 'Gloo Wall', x: 45, y: 85, size: 50 }
    ];
    if (f >= 3) base.push({ id: 'scope', name: 'Scope', x: 75, y: 25, size: 50 });
    if (f === 4) {
      base.push({ id: 'scope-4', name: 'Scope L', x: 20, y: 20, size: 55 });
      base.push({ id: 'crouch', name: 'Crouch', x: 80, y: 25, size: 50 });
    }
    setElements(base);
  };

  React.useEffect(() => {
    initializeLayout(fingers);
  }, [fingers]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setElements(prev => prev.map(el => 
      el.id === draggingId ? { ...el, x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) } : el
    ));
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-5xl mx-auto pb-20">
      <div className="border-b border-white/5 pb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter">HUD_ARCHITECT</h2>
          <p className="text-[8px] font-black text-purple-500 tracking-[0.4em] uppercase mt-2">Interactive Button Mapping Terminal</p>
        </div>
        <div className="flex gap-2">
           {[2, 3, 4].map(f => (
             <button 
               key={f} onClick={() => setFingers(f as any)}
               className={`px-4 py-2 text-[9px] font-black border uppercase transition-all ${fingers === f ? 'bg-purple-500 text-black border-purple-500' : 'text-slate-500 border-white/5'}`}
             >
               {f}_Finger
             </button>
           ))}
        </div>
      </div>

      <div 
        className="relative aspect-video bg-black/80 border border-white/10 rounded-lg overflow-hidden phantom-grid cursor-default"
        onMouseMove={handleMouseMove}
        onMouseUp={() => setDraggingId(null)}
        onMouseLeave={() => setDraggingId(null)}
      >
         <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/5 text-[6px] font-black text-slate-700 uppercase tracking-[1em]">Device_Viewport_Calibration</div>
         
         {elements.map((btn) => (
           <div 
             key={btn.id} 
             style={{ left: `${btn.x}%`, top: `${btn.y}%`, width: `${btn.size}px`, height: `${btn.size}px` }}
             onMouseDown={(e) => { e.preventDefault(); setDraggingId(btn.id); }}
             className={`absolute -translate-x-1/2 -translate-y-1/2 border-2 ${draggingId === btn.id ? 'border-cyan-400 bg-cyan-400/20 z-50' : 'border-purple-500/20 bg-purple-500/5'} rounded-full flex items-center justify-center group/btn hover:border-purple-500 transition-colors cursor-move shadow-[0_0_15px_rgba(168,85,247,0.1)]`}
           >
              <div className="text-center">
                <span className={`text-[6px] font-black block uppercase ${draggingId === btn.id ? 'text-white' : 'text-purple-500/40'}`}>{btn.name}</span>
                <span className="text-[5px] text-slate-600 font-bold block opacity-0 group-hover/btn:opacity-100">{Math.round(btn.x)},{Math.round(btn.y)}</span>
              </div>
           </div>
         ))}

         <div className="absolute inset-0 pointer-events-none border border-white/5 opacity-20"></div>
      </div>

      <div className="glass-v2 p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="space-y-2">
            <span className="text-[8px] font-black text-slate-500 uppercase">Neural_Response_Lag</span>
            <div className="h-1 bg-white/5 w-full"><div className="h-full bg-cyan-500 w-1/12"></div></div>
         </div>
         <div className="space-y-2">
            <span className="text-[8px] font-black text-slate-500 uppercase">Claw_Ergonomics</span>
            <div className="h-1 bg-white/5 w-full"><div className="h-full bg-emerald-500 w-4/5"></div></div>
         </div>
         <div className="space-y-2">
            <span className="text-[8px] font-black text-slate-500 uppercase">Tactile_Complexity</span>
            <div className="h-1 bg-white/5 w-full"><div className="h-full bg-rose-500 w-full"></div></div>
         </div>
      </div>
    </div>
  );
};

export default HudArchitect;
