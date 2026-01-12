
import React, { useState, useEffect } from 'react';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('INITIALIZING_NEURAL_CORE');
  const [logs, setLogs] = useState<string[]>(['[SYS] Link initialization...']);

  const statusMessages = [
    { threshold: 0, text: 'SCANNING_HARDWARE_SIGNATURE' },
    { threshold: 15, text: 'CALIBRATING_TOUCH_SAMPLING_RATE' },
    { threshold: 35, text: 'ANALYZING_RAM_LATENCY_VECTORS' },
    { threshold: 55, text: 'GENERATING_HYPER_SENSITIVITY_MATRIX' },
    { threshold: 75, text: 'OPTIMIZING_J_CURVE_PARABOLA' },
    { threshold: 90, text: 'WAITING_FOR_CLOUD_RESPONSE' },
    { threshold: 98, text: 'STABILIZING_NEURAL_LINK' }
  ];

  const terminalLogs = [
    'CONNECTING_TO_GEMINI_V3_PRO...',
    'FETCHING_CALIBRATION_COEFFICIENTS...',
    'LATENCY_CHECK: 24ms...',
    'UPDATING_DRAG_VECTORS...',
    'APPLYING_DPI_COMPENSATION...',
    'SYNCING_WITH_GLOBAL_META_2025...',
    'NEURAL_SYNAPSE_ESTABLISHED.'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev < 40) return prev + Math.random() * 5;
        if (prev < 70) return prev + Math.random() * 2;
        if (prev < 90) return prev + Math.random() * 1;
        if (prev < 99.5) return prev + 0.05; // Extremely slow near 100 to wait for data
        return prev;
      });
    }, 100);

    const logTimer = setInterval(() => {
      setLogs(prev => {
        const nextLog = terminalLogs[Math.floor(Math.random() * terminalLogs.length)];
        return [...prev.slice(-4), `[LOG] ${nextLog}`];
      });
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(logTimer);
    };
  }, []);

  useEffect(() => {
    const currentStatus = statusMessages
      .filter(m => progress >= m.threshold)
      .pop();
    if (currentStatus) setStatus(currentStatus.text);
  }, [progress]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] space-y-12 animate-fade-in">
      <div className="relative w-56 h-56 flex items-center justify-center">
        <div className="absolute inset-0 border border-purple-500/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute inset-2 border border-cyan-500/10 rounded-full animate-[spin_6s_linear_infinite_reverse]"></div>
        <div className="absolute inset-8 border-2 border-dashed border-purple-500/20 rounded-full animate-[spin_15s_linear_infinite]"></div>
        <div className="absolute w-full h-[1px] bg-cyan-500 shadow-[0_0_20px_#06b6d4] animate-[scan_2s_ease-in-out_infinite]"></div>
        
        <div className="text-center relative z-10">
          <div className="text-5xl font-orbitron font-black text-white italic tabular-nums">
            {Math.floor(progress)}<span className="text-xs text-purple-500 ml-1">%</span>
          </div>
          <div className="text-[7px] font-black text-purple-500 tracking-[0.4em] mt-3 uppercase opacity-60">Neural_Load</div>
        </div>
      </div>

      <div className="space-y-6 w-full max-w-sm text-center">
        <div className="relative h-1 bg-white/5 w-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-cyan-400 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="text-[9px] font-black text-white tracking-[0.3em] uppercase transition-all duration-300">
            {status}
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-1 h-1 bg-purple-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
        </div>

        <div className="glass-v2 p-4 text-left border-l border-cyan-500/30 font-mono h-28 overflow-hidden">
          {logs.map((log, idx) => (
            <div key={idx} className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-2">
              <span className="text-cyan-500 mr-2">{'>'}</span> {log}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-80px) scaleX(0.5); opacity: 0; }
          50% { transform: translateY(0px) scaleX(1); opacity: 1; }
          100% { transform: translateY(80px) scaleX(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
