
import React, { useState, useEffect } from 'react';
import { MetaTrend } from '../types';
import { fetchRealTimeMeta } from '../services/geminiService';

const MetaAnalyzer: React.FC = () => {
  const [trends, setTrends] = useState<MetaTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealTimeMeta().then(data => {
      setTrends(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-10 animate-fade-in max-w-6xl mx-auto pb-20">
      <div className="border-b border-white/5 pb-8">
        <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter">META_ANALYZER_v15</h2>
        <p className="text-[8px] font-black text-cyan-500 tracking-[0.4em] uppercase mt-2">Real-time Weapon Buffs & Global Trends</p>
      </div>

      {loading ? (
        <div className="flex gap-2 items-center py-20 justify-center">
          <div className="w-1.5 h-1.5 bg-cyan-500 animate-bounce"></div>
          <div className="w-1.5 h-1.5 bg-cyan-500 animate-bounce delay-75"></div>
          <div className="w-1.5 h-1.5 bg-cyan-500 animate-bounce delay-150"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase ml-4">Syncing_With_Cloud_Data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trends.map((t, i) => (
            <div key={i} className="glass-v2 p-8 border-t border-white/5 relative group overflow-hidden">
              <div className={`absolute top-0 right-0 px-3 py-1 text-[7px] font-black uppercase ${t.impact === 'BUFF' ? 'bg-emerald-500 text-black' : t.impact === 'NERF' ? 'bg-rose-500 text-white' : 'bg-slate-700'}`}>
                {t.impact}
              </div>
              <h4 className="text-xl font-orbitron font-black text-white mb-4 italic">{t.title}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed mb-6">{t.description}</p>
              <div className="flex justify-between items-center">
                 <span className="text-[6px] text-slate-600 font-black uppercase">Verified_Source</span>
                 <a href={t.sourceUrl} target="_blank" className="text-[8px] text-cyan-500 font-black hover:underline uppercase">View_Details</a>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="glass-v2 p-10 border-l-4 border-purple-500">
         <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-6">Tactical_Map_Calibration</h4>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
               <div className="text-sm font-bold text-white uppercase">Bermuda_Remastered: Sector_4</div>
               <p className="text-[9px] text-slate-500 uppercase leading-relaxed font-bold">Current high-loot density detected in Peak and Observatory. Use sniper coverage at Bimasakti Strip.</p>
               <div className="h-1 w-full bg-white/5"><div className="h-full bg-purple-500 w-3/4"></div></div>
            </div>
            <div className="bg-black/40 aspect-video border border-white/5 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.1)_0%,_transparent_70%)] animate-pulse"></div>
               <span className="text-[7px] font-black text-slate-700 uppercase tracking-[0.5em]">Map_Simulation_Overlay</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default MetaAnalyzer;
