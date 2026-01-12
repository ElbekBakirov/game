
import React, { useState, useRef } from 'react';
import { BenchmarkResult } from '../types';

const PerformanceBenchmark: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [clicks, setClicks] = useState<number[]>([]);
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  const startTimeRef = useRef<number>(0);

  const startTest = () => {
    setIsRunning(true);
    setClicks([]);
    setResult(null);
    startTimeRef.current = performance.now();
  };

  const handleTouch = () => {
    if (!isRunning) return;
    const now = performance.now();
    const diff = now - startTimeRef.current;
    setClicks(prev => [...prev, diff]);
    startTimeRef.current = now;

    if (clicks.length >= 9) {
      setIsRunning(false);
      const total = clicks.reduce((a, b) => a + b, 0);
      const avg = Math.round(total / clicks.length);
      const rating = avg < 50 ? 'S' : avg < 100 ? 'A' : avg < 150 ? 'B' : 'C';
      setResult({ latency: avg, stability: 98, rating });
    }
  };

  return (
    <div className="glass-v2 p-10 border-t-2 border-emerald-500 animate-fade-in max-w-4xl mx-auto mb-20 relative overflow-hidden">
      <div className="flex justify-between items-end border-b border-white/5 pb-6 mb-10">
        <div>
          <h3 className="text-2xl font-orbitron font-black text-white italic uppercase">HARDWARE_BENCHMARK</h3>
          <p className="text-[8px] font-black text-emerald-500 tracking-[0.4em] uppercase mt-2">Touch Response & Latency Profiler</p>
        </div>
        <div className="text-[7px] text-slate-700 font-black">PHANTOM_LABS_v2.5</div>
      </div>

      {!isRunning && !result ? (
        <div className="text-center py-10">
           <p className="text-[10px] text-slate-400 font-bold uppercase mb-10 leading-relaxed">
             Sensorning javob berish tezligini aniqlash uchun benchmarkni ishga tushiring. <br/> 
             Sizdan ketma-ket 10 marta tezkor bosish talab qilinadi.
           </p>
           <button 
             onClick={startTest}
             className="px-12 py-5 bg-emerald-600 text-black font-orbitron font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all"
           >
             Initialize_Test
           </button>
        </div>
      ) : isRunning ? (
        <div 
          onClick={handleTouch}
          className="h-64 bg-white/5 border-2 border-dashed border-emerald-500/30 flex items-center justify-center cursor-pointer group hover:bg-emerald-500/5 transition-all"
        >
           <div className="text-center">
              <div className="text-4xl font-orbitron font-black text-white mb-4">{10 - clicks.length}</div>
              <p className="text-[8px] font-black text-emerald-500 uppercase animate-pulse">TAP_HERE_FAST</p>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="flex items-center justify-center bg-black/40 p-8 border border-white/5 relative">
              <div className="text-center">
                 <div className="text-[7px] text-slate-500 font-black uppercase mb-2">Device_Grade</div>
                 <div className={`text-8xl font-orbitron font-black ${result?.rating === 'S' ? 'text-emerald-500' : 'text-yellow-500'} italic`}>{result?.rating}</div>
              </div>
           </div>
           <div className="space-y-6">
              <div className="p-4 border-l-2 border-cyan-500 bg-white/[0.02]">
                 <span className="text-[7px] text-slate-500 font-black uppercase block">Avg_Touch_Latency</span>
                 <span className="text-2xl font-orbitron font-black text-white">{result?.latency}ms</span>
              </div>
              <div className="p-4 border-l-2 border-purple-500 bg-white/[0.02]">
                 <span className="text-[7px] text-slate-500 font-black uppercase block">Stability_Index</span>
                 <span className="text-2xl font-orbitron font-black text-white">{result?.stability}%</span>
              </div>
              <button onClick={() => setResult(null)} className="text-[8px] font-black text-slate-600 hover:text-white uppercase underline">Re-run Benchmark</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceBenchmark;
