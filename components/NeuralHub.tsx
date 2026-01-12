
import React, { useState, useEffect } from 'react';
import { ArchiveRecord } from '../types';

const HUB_KEY = 'PHANTOM_GLOBAL_HUB_V12';

const NeuralHub: React.FC<{ onSelect: (r: ArchiveRecord) => void }> = ({ onSelect }) => {
  const [records, setRecords] = useState<ArchiveRecord[]>([]);

  useEffect(() => {
    const hubData = JSON.parse(localStorage.getItem(HUB_KEY) || '[]');
    setRecords(hubData.sort((a: any, b: any) => (b.likes || 0) - (a.likes || 0)));
  }, []);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = records.map(r => r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r);
    setRecords(updated);
    localStorage.setItem(HUB_KEY, JSON.stringify(updated));
  };

  return (
    <div className="space-y-10 animate-fade-in pb-24">
      <div className="flex justify-between items-end border-b border-purple-500/30 pb-8">
        <div>
          <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter uppercase">Neural_Hub</h2>
          <p className="text-[8px] font-black text-purple-500 tracking-[0.3em] uppercase mt-2">Global Operator Shared Vectors</p>
        </div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2">
          Shared: {records.length}
        </div>
      </div>

      {records.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/5">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">No shared data streams detected.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((r) => (
            <div 
              key={r.id} 
              onClick={() => onSelect(r)}
              className="glass-v2 p-6 border-l-2 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer group"
            >
              <div className="flex justify-between mb-4">
                <span className="text-[8px] font-black text-purple-500 uppercase tracking-widest italic">{r.userName || 'ANONYMOUS'}</span>
                <button 
                  onClick={(e) => handleLike(r.id, e)}
                  className="flex items-center gap-2 text-rose-500 hover:scale-110 transition-transform"
                >
                  <span className="text-[10px] font-black">{r.likes || 0}</span>
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </button>
              </div>
              <h4 className="text-sm font-black text-white uppercase mb-4">{r.config.deviceBrand} {r.config.deviceModel}</h4>
              <div className="grid grid-cols-3 gap-2 py-3 border-t border-white/5 text-center">
                <div>
                   <div className="text-[6px] text-slate-500 font-black">GEN</div>
                   <div className="text-xs font-black text-white">{r.result.settings.general}</div>
                </div>
                <div>
                   <div className="text-[6px] text-slate-500 font-black">RD</div>
                   <div className="text-xs font-black text-white">{r.result.settings.redDot}</div>
                </div>
                <div>
                   <div className="text-[6px] text-slate-500 font-black">ACC</div>
                   <div className="text-xs font-black text-cyan-500">{r.result.accuracyScore.toFixed(0)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NeuralHub;
