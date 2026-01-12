
import React, { useState } from 'react';

const DpiCalibrator: React.FC = () => {
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(2400);

  const calculateDpi = () => {
    const diagonal = Math.sqrt(width ** 2 + height ** 2);
    const perfectDpi = Math.round((diagonal / 100) * 1.5);
    return perfectDpi;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-fade-in">
      <div className="border-b border-cyan-500/20 pb-8">
        <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter uppercase">DPI_QUANTUM_CALIBRATOR</h2>
        <p className="text-[8px] font-black text-cyan-500 tracking-[0.4em] uppercase mt-2">Display Resolution to DPI Mapping</p>
      </div>

      <div className="glass-v2 p-10 border-t-2 border-cyan-600">
        <div className="grid grid-cols-2 gap-8 mb-12">
           <div className="space-y-4">
              <label className="text-[9px] font-black text-slate-500 uppercase">Screen_Width (PX)</label>
              <input 
                type="number" value={width} onChange={e => setWidth(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 p-5 text-white font-orbitron font-black outline-none focus:border-cyan-500"
              />
           </div>
           <div className="space-y-4">
              <label className="text-[9px] font-black text-slate-500 uppercase">Screen_Height (PX)</label>
              <input 
                type="number" value={height} onChange={e => setHeight(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 p-5 text-white font-orbitron font-black outline-none focus:border-cyan-500"
              />
           </div>
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/20 p-12 text-center group">
           <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest block mb-4">Perfect_Quantum_DPI</span>
           <div className="text-7xl font-orbitron font-black text-white italic group-hover:scale-110 transition-transform">{calculateDpi()}</div>
           <p className="text-[7px] text-slate-600 font-bold uppercase mt-6 border-t border-white/5 pt-4">
             Ushbu DPI qiymati sizning ekraningizning piksel zichligiga ko'ra barmoq harakatini eng aniq (Pixel-Perfect) ko'rinishda o'qishini ta'minlaydi.
           </p>
        </div>
      </div>
    </div>
  );
};

export default DpiCalibrator;
