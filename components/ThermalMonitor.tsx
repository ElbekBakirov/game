
import React, { useState, useEffect } from 'react';

const ThermalMonitor: React.FC = () => {
  const [temp, setTemp] = useState(36.5);
  const [latencyBoost, setLatencyBoost] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTemp(prev => {
        const next = prev + (Math.random() - 0.45) * 0.5;
        const clamped = Math.max(30, Math.min(55, next));
        // Calculate latency penalty based on temp
        if (clamped > 42) setLatencyBoost((clamped - 42) * 2.5);
        else setLatencyBoost(0);
        return clamped;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatus = () => {
    if (temp < 38) return { label: 'OPTIMAL', color: 'text-emerald-500' };
    if (temp < 44) return { label: 'HEATING', color: 'text-yellow-500' };
    return { label: 'THROTTLING', color: 'text-rose-600' };
  };

  const status = getStatus();

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-fade-in">
      <div className="border-b border-rose-500/20 pb-8">
        <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter uppercase">THERMAL_THROTTLE_MONITOR</h2>
        <p className="text-[8px] font-black text-rose-500 tracking-[0.4em] uppercase mt-2">Simulated Heat-Sensitivity Correlation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="glass-v2 p-10 border-t-2 border-rose-600 flex flex-col items-center justify-center space-y-8">
           <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                <circle 
                  cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray="283%" strokeDashoffset={`${283 - (283 * ((temp - 30) / 25))}%`}
                  className={`${temp > 44 ? 'text-rose-600 animate-pulse' : temp > 38 ? 'text-yellow-500' : 'text-emerald-500'} transition-all duration-1000`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-5xl font-orbitron font-black text-white">{temp.toFixed(1)}°C</span>
                 <span className={`text-[8px] font-black uppercase tracking-widest mt-2 ${status.color}`}>{status.label}</span>
              </div>
           </div>
        </div>

        <div className="glass-v2 p-10 border-l-2 border-slate-800 bg-black/40 space-y-8">
           <div className="space-y-2">
              <span className="text-[7px] text-slate-500 font-black uppercase tracking-widest">Touch_Latency_Penalty</span>
              <div className="text-3xl font-orbitron font-black text-white">+{latencyBoost.toFixed(1)}ms</div>
              <div className="h-1 bg-white/5 w-full"><div className="h-full bg-rose-600" style={{ width: `${Math.min(100, latencyBoost * 5)}%` }}></div></div>
           </div>

           <div className="p-4 border border-rose-600/20 bg-rose-600/5">
              <p className="text-[9px] text-slate-400 font-bold uppercase leading-relaxed">
                <span className="text-rose-500">DIAGNOSTIC:</span> {temp > 42 ? "Qurilma qizishi tufayli sensorning sezgirligi 15% gacha tushishi mumkin. Cooler ishlatish tavsiya etiladi." : "Tizim barqaror. Hech qanday thermal throttle aniqlanmadi."}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ThermalMonitor;
