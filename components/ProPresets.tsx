
import React from 'react';
import { ProPreset } from '../types';

const presets: ProPreset[] = [
  {
    name: "Nobru",
    device: "iPhone 15 Pro Max",
    specialty: "King of Movement",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nobru",
    settings: { general: 182, redDot: 170, scope2x: 164, scope4x: 156, sniperScope: 90 }
  },
  {
    name: "DJEXO FF",
    device: "ROG Phone 7 / Android",
    specialty: "Fast Shot Demon",
    image: "https://api.dicebear.com/7.x/bottts/svg?seed=Djexo&backgroundColor=b6e3f4,c0aede,d1d4f9",
    settings: { general: 200, redDot: 195, scope2x: 188, scope4x: 182, sniperScope: 95 }
  },
  {
    name: "White444",
    device: "PC / Emulator",
    specialty: "One-Tap King",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=White",
    settings: { general: 200, redDot: 190, scope2x: 180, scope4x: 170, sniperScope: 100 }
  },
  {
    name: "Ruok FF",
    device: "iPad Pro",
    specialty: "Precision Aim",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ruok",
    settings: { general: 190, redDot: 180, scope2x: 170, scope4x: 160, sniperScope: 80 }
  }
];

const ProPresets: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 animate-fade-in max-w-6xl mx-auto pb-20">
      {presets.map((p) => (
        <div key={p.name} className="glass p-8 border-t-2 border-white/10 hover:border-purple-500 transition-all group bg-black/60 relative overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-500/20 to-transparent pointer-events-none"></div>
          
          <div className="flex items-center gap-6 mb-8 relative z-10">
            <div className="w-20 h-20 rounded-none bg-slate-900 border-2 border-white/5 group-hover:border-purple-500 transition-all p-1">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
            </div>
            <div>
              <h4 className="text-2xl font-black font-orbitron text-white leading-none uppercase">{p.name}</h4>
              <p className="text-[9px] text-purple-500 font-black uppercase tracking-widest mt-2">{p.specialty}</p>
            </div>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{p.device}</span>
              <span className="text-[8px] border border-purple-500/40 text-purple-500 px-2 py-0.5 font-black italic">PHANTOM_ARCHIVE</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {/* Added explicit type cast to ensure 'val' is recognized as ReactNode-compatible number */}
              {(Object.entries(p.settings) as [string, number][]).map(([key, val]) => (
                <div key={key} className="border-b border-white/5 pb-2 hover:border-purple-500/30 transition-colors">
                  <div className="text-[7px] text-slate-600 font-black uppercase tracking-widest mb-1">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <div className="font-orbitron font-black text-white text-lg">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProPresets;
