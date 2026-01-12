
import React, { useState } from 'react';

const DpiConverter: React.FC = () => {
  const [sourceDpi, setSourceDpi] = useState(800);
  const [sourceSensi, setSourceSensi] = useState(100);
  const [targetDpi, setTargetDpi] = useState(440);

  const calculatedSensi = Math.round((sourceSensi * sourceDpi) / targetDpi);

  return (
    <div className="glass-v2 p-10 border-t-2 border-purple-500 animate-fade-in max-w-4xl mx-auto mb-20">
      <div className="flex justify-between items-end border-b border-white/5 pb-6 mb-10">
        <div>
          <h3 className="text-2xl font-orbitron font-black text-white italic uppercase">DPI_SCALING_ENGINE</h3>
          <p className="text-[8px] font-black text-purple-500 tracking-[0.4em] uppercase mt-2">Professional Conversion Matrix</p>
        </div>
        <div className="text-[7px] text-slate-700 font-black italic">PHANTOM_MATH_v2.5</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="space-y-4">
          <label className="text-[9px] font-black text-slate-500 uppercase">Pro_Source_DPI</label>
          <input 
            type="number" value={sourceDpi} onChange={e => setSourceDpi(Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 p-4 text-white font-orbitron font-black outline-none focus:border-purple-500"
          />
        </div>
        <div className="space-y-4">
          <label className="text-[9px] font-black text-slate-500 uppercase">Pro_Sensi_Value</label>
          <input 
            type="number" value={sourceSensi} onChange={e => setSourceSensi(Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 p-4 text-white font-orbitron font-black outline-none focus:border-purple-500"
          />
        </div>
        <div className="space-y-4">
          <label className="text-[9px] font-black text-slate-500 uppercase">Your_Target_DPI</label>
          <input 
            type="number" value={targetDpi} onChange={e => setTargetDpi(Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 p-4 text-white font-orbitron font-black outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="bg-purple-500/10 border border-purple-500/20 p-8 text-center relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
         <span className="text-[8px] font-black text-purple-500 uppercase tracking-widest block mb-2">Calculated_Equivalent_Sensi</span>
         <div className="text-6xl font-orbitron font-black text-white italic group-hover:scale-110 transition-transform">
           {calculatedSensi > 200 ? 200 : calculatedSensi}
         </div>
         <p className="text-[7px] text-slate-600 font-bold uppercase mt-4">Note: If result {' > '} 200, system caps at engine limit.</p>
      </div>
    </div>
  );
};

export default DpiConverter;
