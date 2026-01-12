
import React from 'react';

const RecoilMatrix: React.FC<{ weapon: string, sensitivity: number }> = ({ weapon, sensitivity }) => {
  const isShotgun = weapon.includes('M1887');
  const isSMG = weapon.includes('SMG');

  return (
    <div className="glass-v2 p-10 border-t-2 border-cyan-500 animate-fade-in mb-20">
      <div className="flex justify-between items-end border-b border-white/5 pb-6 mb-10">
        <div>
          <h3 className="text-2xl font-orbitron font-black text-white italic uppercase">RECOIL_PATTERN_PREDICTION</h3>
          <p className="text-[8px] font-black text-cyan-500 tracking-[0.4em] uppercase mt-2">Neural Bullet Spread Analysis</p>
        </div>
        <div className="text-[7px] text-slate-700 font-black italic">{weapon} // ACTIVE</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-black/60 border border-white/5 relative flex items-center justify-center p-10 group">
           {/* Grid lines */}
           <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-5">
              {[...Array(16)].map((_, i) => <div key={i} className="border border-white"></div>)}
           </div>

           {/* Spread visualization */}
           <div className="relative w-full h-full">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]"></div>
              
              {isShotgun ? (
                // Shotgun pattern
                [...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-1.5 h-1.5 bg-rose-500/60 rounded-full animate-pulse"
                    style={{ 
                      top: `${50 + (Math.random() - 0.5) * 40}%`, 
                      left: `${50 + (Math.random() - 0.5) * 40}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                ))
              ) : isSMG ? (
                // Vertical spray
                [...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-1 h-1 bg-cyan-400/80 rounded-full"
                    style={{ 
                      top: `${50 - (i * 4)}%`, 
                      left: `${50 + (Math.random() - 0.5) * (i * 0.5)}%`,
                      opacity: 1 - (i * 0.08)
                    }}
                  ></div>
                ))
              ) : (
                // Marksman pattern
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center">
                   <div className="w-1 bg-rose-500 h-20 shadow-[0_0_15px_rgba(244,63,94,0.5)]"></div>
                   <div className="text-[6px] text-rose-500 font-black mt-2">HEADSHOT_ZONE</div>
                </div>
              )}
           </div>
           
           <div className="absolute bottom-4 left-4 text-[7px] font-black text-slate-700 uppercase tracking-widest">Vector_Simulation_v25</div>
        </div>

        <div className="space-y-8">
           <div className="space-y-3">
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Drift_Analysis</h4>
              <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase italic border-l-2 border-cyan-500 pl-6">
                "{weapon} uchun tebranish {isSMG ? 'vertikal spray' : 'nuqtaviy'} ko'rinishda. {sensitivity > 180 ? 'Tezkor drag talab qilinadi.' : 'Yumshoq boshqaruv tavsiya etiladi.'}"
              </p>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-5 border border-white/5 bg-white/[0.02]">
                 <span className="text-[7px] text-slate-500 font-black uppercase block mb-1">Vertical_Drag</span>
                 <span className="text-xl font-orbitron font-black text-emerald-400">88%</span>
              </div>
              <div className="p-5 border border-white/5 bg-white/[0.02]">
                 <span className="text-[7px] text-slate-500 font-black uppercase block mb-1">Horizontal_Stability</span>
                 <span className="text-xl font-orbitron font-black text-cyan-400">94%</span>
              </div>
           </div>

           <div className="pt-6">
              <div className="flex justify-between text-[8px] font-black text-slate-500 mb-2 uppercase tracking-widest">
                 <span>Recoil_Control_Ease</span>
                 <span>72%</span>
              </div>
              <div className="h-1 bg-white/5 w-full"><div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: '72%' }}></div></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RecoilMatrix;
