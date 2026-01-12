
import React, { useState } from 'react';

const AudioLab: React.FC = () => {
  const [focus, setFocus] = useState('Footsteps');

  const configs: any = {
    'Footsteps': { low: '0dB', mid: '+12dB', high: '+6dB', boost: '3000Hz' },
    'Gunshots': { low: '-6dB', mid: '0dB', high: '+8dB', boost: '1500Hz' },
    'Vehicle': { low: '+10dB', mid: '-4dB', high: '0dB', boost: '250Hz' }
  };

  const current = configs[focus];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-fade-in">
      <div className="border-b border-purple-500/20 pb-8">
        <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter uppercase">AUDIO_COGNITION_LAB</h2>
        <p className="text-[8px] font-black text-purple-500 tracking-[0.4em] uppercase mt-2">Frequency Optimization for Strategic Hearing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-v2 p-10 border-t-2 border-purple-600 space-y-10">
           <div className="flex gap-2">
             {Object.keys(configs).map(k => (
               <button 
                 key={k} 
                 onClick={() => setFocus(k)}
                 className={`flex-1 py-3 text-[9px] font-black border transition-all ${focus === k ? 'bg-purple-600 border-purple-600 text-white' : 'border-white/5 text-slate-500'}`}
               >
                 {k}
               </button>
             ))}
           </div>

           <div className="space-y-8">
              {['LOW_FREQ', 'MID_FREQ', 'HIGH_FREQ', 'PEAK_BOOST'].map((label, i) => (
                <div key={label} className="space-y-3">
                   <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase">
                      <span>{label}</span>
                      <span className="text-white">{Object.values(current)[i]}</span>
                   </div>
                   <div className="h-1 bg-white/5 w-full relative">
                      <div className="h-full bg-purple-500" style={{ width: `${Math.random() * 50 + 50}%` }}></div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="glass-v2 p-10 border-l-2 border-slate-800 bg-black/40 flex flex-col justify-center space-y-8">
           <h4 className="text-xl font-orbitron font-black text-white italic uppercase tracking-tighter">PHANTOM_EAR_SYNC</h4>
           <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed border-l border-purple-500 pl-6">
             Dushmanning harakatlarini va qurol tovushlarini kiber-sport darajasida eshitish uchun telefoningiz ekvalayzerini ushbu qiymatlarga moslang.
           </p>
           <div className="pt-6 border-t border-white/5">
              <span className="text-[7px] text-slate-700 font-black uppercase tracking-widest block mb-4">Recommended_Device_Mode</span>
              <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-500 font-black text-[10px] uppercase text-center tracking-[0.5em]">DOLBY_ATMOS_GAMING</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AudioLab;
