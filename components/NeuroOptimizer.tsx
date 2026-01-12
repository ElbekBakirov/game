
import React, { useState, useEffect } from 'react';

const NeuroOptimizer: React.FC = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [optimized, setOptimized] = useState(false);

  const optimizationSteps = [
    "KILLING_BACKGROUND_PROCESSES...",
    "FLUSHING_TOUCH_SAMPLING_CACHE...",
    "SYNCHRONIZING_GPU_BUFFERS...",
    "RE-CALIBRATING_INTERRUPT_REQUESTS...",
    "KERNEL_PANIC_PREVENTION_ACTIVE...",
    "NEURAL_LATENCY_NORMALIZED: 1.2ms"
  ];

  const handleOptimize = () => {
    setIsOptimizing(true);
    setOptimized(false);
    setLogs(["[CORE] Starting High-Velocity Optimization..."]);
    
    let step = 0;
    const interval = setInterval(() => {
      if (step < optimizationSteps.length) {
        setLogs(prev => [...prev, `[SYS] ${optimizationSteps[step]}`]);
        step++;
      } else {
        clearInterval(interval);
        setIsOptimizing(false);
        setOptimized(true);
      }
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-fade-in">
      <div className="border-b border-rose-500/20 pb-8">
        <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter uppercase">NEURO_OPTIMIZER_v25</h2>
        <p className="text-[8px] font-black text-rose-500 tracking-[0.4em] uppercase mt-2">Extreme Latency Reduction & Touch Sync</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-v2 p-10 border-t-2 border-rose-600 space-y-10 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4">
              <div className={`w-3 h-3 rounded-full ${optimized ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500 animate-pulse'}`}></div>
           </div>

           <div className="space-y-4">
              <h4 className="text-xl font-orbitron font-black text-white italic uppercase">DEVICE_OVERCLOCK</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">
                Tizimning sezgirligini (Sensi) 140+ darajasida barqaror saqlash uchun drayverlarni sinxronizatsiya qiling.
              </p>
           </div>

           <div className="space-y-6">
              {[
                { label: 'TOUCH_SAMPLING', val: optimized ? 99 : 45, color: 'text-cyan-500' },
                { label: 'GPU_RENDER_PIPE', val: optimized ? 98 : 32, color: 'text-purple-500' },
                { label: 'CPU_REFLEX_CORE', val: optimized ? 100 : 12, color: 'text-rose-500' }
              ].map(stat => (
                <div key={stat.label} className="space-y-2">
                   <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                      <span className="text-slate-500">{stat.label}</span>
                      <span className={stat.color}>{stat.val}%</span>
                   </div>
                   <div className="h-1 bg-white/5 w-full">
                      <div className={`h-full ${stat.color.replace('text', 'bg-')} transition-all duration-1000`} style={{ width: `${stat.val}%` }}></div>
                   </div>
                </div>
              ))}
           </div>

           <button 
             onClick={handleOptimize}
             disabled={isOptimizing}
             className={`w-full py-6 font-orbitron font-black text-xs uppercase tracking-[0.5em] transition-all relative overflow-hidden group ${optimized ? 'bg-emerald-600 text-black' : 'bg-rose-600 text-white hover:bg-rose-500'}`}
           >
              {isOptimizing ? 'SYNCHRONIZING...' : (optimized ? 'OPTIMIZATION_LOCKED' : 'CLEAN_LATENCY_CACHE')}
              <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
           </button>
        </div>

        <div className="glass-v2 p-8 border-l-2 border-slate-800 bg-black/40 h-[400px] overflow-hidden flex flex-col">
           <div className="text-[8px] font-black text-slate-600 uppercase mb-4 border-b border-white/5 pb-2">Terminal_Log_Stream</div>
           <div className="flex-grow space-y-2 overflow-y-auto font-mono scrollbar-none">
              {logs.map((log, i) => (
                <div key={i} className="text-[9px] font-bold text-slate-400 uppercase tracking-widest animate-fade-in">
                   <span className="text-rose-500 mr-2">{' >> '}</span> {log}
                </div>
              ))}
              {isOptimizing && (
                <div className="w-1 h-3 bg-rose-500 animate-pulse mt-2"></div>
              )}
           </div>
           {optimized && (
             <div className="mt-4 p-4 border border-emerald-500/20 bg-emerald-500/5">
                <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">SYSTEM_READY: You are now at kiber-sport performance level.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default NeuroOptimizer;
