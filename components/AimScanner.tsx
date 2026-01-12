
import React, { useState, useEffect } from 'react';

const AimScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [calibrationData, setCalibrationData] = useState<any>(null);

  const handleScan = () => {
    setScanning(true);
    setProgress(0);
    setCalibrationData(null);
  };

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setScanning(false);
            setCalibrationData({
              aimLock: 99.8,
              headshotChance: 97.4,
              pixelStability: "ULTRA",
              recommendation: "Increase RED_DOT by +4 for perfect 1-tap lock."
            });
            return 100;
          }
          return p + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [scanning]);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-fade-in">
      <div className="border-b border-cyan-500/20 pb-8">
        <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter uppercase">AIM_SCANNER_PRO</h2>
        <p className="text-[8px] font-black text-cyan-500 tracking-[0.4em] uppercase mt-2">Visual Crosshair Precision Analysis</p>
      </div>

      <div className="glass-v2 p-10 border-t-2 border-cyan-500 relative overflow-hidden h-[500px] flex flex-col">
         {/* Visual Scanner HUD */}
         <div className="flex-grow relative flex items-center justify-center bg-black/40 rounded-sm border border-white/5 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.05)_0%,_transparent_70%)]"></div>
            
            {/* Crosshair Animation */}
            <div className="relative w-40 h-40 flex items-center justify-center">
               <div className={`absolute inset-0 border-2 rounded-full border-cyan-500/20 ${scanning ? 'animate-ping' : ''}`}></div>
               <div className={`absolute inset-8 border border-dashed rounded-full border-cyan-500/40 ${scanning ? 'animate-spin' : ''}`}></div>
               <div className="w-1 h-1 bg-white shadow-[0_0_15px_white]"></div>
               <div className="absolute w-12 h-px bg-cyan-500/60"></div>
               <div className="absolute h-12 w-px bg-cyan-500/60"></div>
               
               {scanning && (
                 <div className="absolute top-0 left-0 w-full h-full border-t-2 border-cyan-400 animate-[scan_2s_linear_infinite]"></div>
               )}
            </div>

            {scanning && (
               <div className="absolute bottom-10 left-10 space-y-2">
                  <div className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">Scanning_Pixels...</div>
                  <div className="text-xl font-orbitron font-black text-white italic">{progress}%</div>
               </div>
            )}

            {!scanning && !calibrationData && (
              <button 
                onClick={handleScan}
                className="px-14 py-5 bg-cyan-600 text-black font-orbitron font-black text-xs uppercase tracking-[0.4em] hover:bg-cyan-400 transition-all z-20"
              >
                INITIALIZE_SCAN
              </button>
            )}

            {calibrationData && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md p-10 flex flex-col justify-center animate-fade-in">
                 <h4 className="text-2xl font-orbitron font-black text-white italic mb-10 uppercase border-b border-white/5 pb-4">SCAN_VERDICT</h4>
                 <div className="grid grid-cols-2 gap-8 mb-12">
                    <div className="space-y-1">
                       <span className="text-[7px] text-slate-500 font-black uppercase">AIM_LOCK_COEF</span>
                       <div className="text-3xl font-orbitron font-black text-cyan-400 italic">{calibrationData.aimLock}%</div>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[7px] text-slate-500 font-black uppercase">HS_PROBABILITY</span>
                       <div className="text-3xl font-orbitron font-black text-emerald-400 italic">{calibrationData.headshotChance}%</div>
                    </div>
                 </div>
                 <p className="text-[10px] text-slate-300 font-bold uppercase leading-relaxed mb-10 italic border-l-2 border-cyan-500 pl-6">
                    "{calibrationData.recommendation}"
                 </p>
                 <button onClick={() => setCalibrationData(null)} className="text-[8px] font-black text-slate-500 hover:text-white uppercase tracking-widest underline underline-offset-8">RE-SCAN_MODULE</button>
              </div>
            )}
         </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default AimScanner;
