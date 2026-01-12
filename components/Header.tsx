
import React, { useState, useEffect } from 'react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  userName: string;
}

const Header: React.FC<Props> = ({ activeTab, onTabChange, onLogout, userName }) => {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setUptime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const tabs = [
    { id: 'generator', label: 'GEN' },
    { id: 'optimizer', label: 'OPTIMIZER' },
    { id: 'regedit', label: 'REGEDIT' },
    { id: 'aimscan', label: 'AIM_SCAN' },
    { id: 'macro', label: 'MACRO_BUILDER', special: true },
    { id: 'tourney', label: 'TOURNEY_RADAR', special: true },
    { id: 'thermal', label: 'THERMAL_WATCH', special: true },
    { id: 'dpi_cal', label: 'DPI_QUANTUM' },
    { id: 'kill_forge', label: 'KILL_FORGE' },
    { id: 'audio', label: 'AUDIO_LAB' },
    { id: 'drag', label: 'DRAG' },
    { id: 'recoil', label: 'RECOIL' },
    { id: 'lab', label: 'WEAPON_LAB' },
    { id: 'forge', label: 'SKIN_FORGE' },
    { id: 'map', label: 'STRAT_MAP' },
    { id: 'hub', label: 'HUB' },
    { id: 'pro', label: 'PRO' },
    { id: 'voice', label: 'NEURO_VOICE' }
  ];

  return (
    <header className="py-4 px-10 border-b border-white/5 sticky top-0 z-[110] bg-[#020617]/95 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-xl font-black font-orbitron tracking-tighter text-white flex items-center gap-3">
              <span className={`w-1.5 h-5 bg-emerald-500 shadow-[0_0_15px_#10b981]`}></span>
              PHANTOM <span className={`text-emerald-500 font-bold text-[8px] bg-white/5 px-2 py-0.5`}>SINGULAR_v25_OMEGA</span>
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[6px] text-slate-500 font-black uppercase tracking-widest">OPERATOR: {userName}</span>
              <button onClick={onLogout} className="text-[6px] text-rose-500 hover:text-rose-400 font-black uppercase tracking-widest border border-rose-500/20 px-2 py-0.5">[DISCONNECT]</button>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end">
          <span className="text-[6px] font-black text-slate-600 uppercase tracking-widest">Neural_Uptime</span>
          <span className={`text-[10px] font-bold font-orbitron text-emerald-400`}>{formatUptime(uptime)}</span>
        </div>
      </div>

      <nav className="flex justify-center border-t border-white/5 pt-3">
        <div className="flex gap-1 bg-white/5 p-1 rounded-sm overflow-x-auto no-scrollbar max-w-full">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 text-[8px] font-black font-orbitron tracking-[0.2em] transition-all uppercase whitespace-nowrap ${
                activeTab === tab.id 
                ? (tab.special ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.4)]' : 'bg-purple-500 text-black shadow-[0_0_10px_rgba(168,85,247,0.4)]') 
                : 'text-slate-500 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
