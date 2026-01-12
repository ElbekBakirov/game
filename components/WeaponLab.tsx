
import React, { useState } from 'react';
import { WeaponStats } from '../types';

const mockWeapons: WeaponStats[] = [
  { id: '1', name: 'UMP-45', damage: 82, rateOfFire: 95, range: 45, recoil: 30, headshotPotential: 88 },
  { id: '2', name: 'MP40', damage: 78, rateOfFire: 99, range: 35, recoil: 45, headshotPotential: 92 },
  { id: '3', name: 'M1887', damage: 98, rateOfFire: 40, range: 25, recoil: 60, headshotPotential: 95 },
  { id: '4', name: 'Desert Eagle', damage: 95, rateOfFire: 35, range: 55, recoil: 70, headshotPotential: 99 },
];

const WeaponLab: React.FC = () => {
  const [selected, setSelected] = useState<string[]>(['1', '2']);

  const toggleWeapon = (id: string) => {
    if (selected.includes(id)) {
      if (selected.length > 1) setSelected(prev => prev.filter(w => w !== id));
    } else {
      if (selected.length < 3) setSelected(prev => [...prev, id]);
    }
  };

  const statsKeys: (keyof WeaponStats)[] = ['damage', 'rateOfFire', 'range', 'recoil', 'headshotPotential'];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-fade-in">
      <div className="border-b border-cyan-500/20 pb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter uppercase">WEAPON_LAB_SIM</h2>
          <p className="text-[8px] font-black text-cyan-500 tracking-[0.4em] uppercase mt-2">Neural Damage & Accuracy Profiler</p>
        </div>
        <div className="flex gap-2">
           {mockWeapons.map(w => (
             <button 
               key={w.id} 
               onClick={() => toggleWeapon(w.id)}
               className={`px-3 py-1 text-[8px] font-black border transition-all ${selected.includes(w.id) ? 'bg-cyan-500 text-black border-cyan-500' : 'text-slate-500 border-white/5'}`}
             >
               {w.name}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        <div className="glass-v2 p-10 border-t-2 border-cyan-600 overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                    <th className="pb-8">Metric</th>
                    {selected.map(id => (
                      <th key={id} className="pb-8 text-center text-white">{mockWeapons.find(w => w.id === id)?.name}</th>
                    ))}
                 </tr>
              </thead>
              <tbody className="space-y-6">
                 {statsKeys.map(key => (
                   <tr key={key} className="border-b border-white/5 group">
                      {/* Fix: Explicitly convert key to string to handle potential number/symbol types in keyof */}
                      <td className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{String(key).replace(/([A-Z])/g, '_$1')}</td>
                      {selected.map(id => {
                        const val = mockWeapons.find(w => w.id === id)?.[key] as number;
                        return (
                          <td key={id} className="py-6 px-4">
                             <div className="flex flex-col items-center gap-2">
                                <span className="text-xs font-black text-white font-orbitron">{val}%</span>
                                <div className="w-full h-1 bg-white/5 relative">
                                   <div className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" style={{ width: `${val}%` }}></div>
                                </div>
                             </div>
                          </td>
                        );
                      })}
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>

        <div className="glass-v2 p-10 border-l-4 border-rose-600 bg-rose-600/[0.02]">
           <h4 className="text-xl font-orbitron font-black text-white italic tracking-tighter mb-4">NEURAL_VERDICT</h4>
           <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">
             Siz tanlagan qurollar uchun Phantom v25 engine sezgirlikni optimallashtirdi. 
             <span className="text-emerald-500"> MP40 </span> uchun headshot potentsiali hozirgi sozlamalarda <span className="text-white">+12.4%</span> ga oshadi.
           </p>
        </div>
      </div>
    </div>
  );
};

export default WeaponLab;
