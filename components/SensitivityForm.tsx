
import React, { useState } from 'react';
import { UserConfig, WeaponCategory } from '../types';

interface Props {
  onGenerate: (config: UserConfig) => void;
  isLoading: boolean;
}

const SensitivityForm: React.FC<Props> = ({ onGenerate, isLoading }) => {
  const [config, setConfig] = useState<UserConfig>({
    deviceBrand: '',
    deviceModel: '',
    deviceType: 'Android',
    dpi: 440,
    ramAmount: 8,
    playStyle: 'Aggressive',
    aimType: 'Precision',
    refreshRate: 120,
    fireButtonSize: 48,
    weaponCategory: 'All-Rounder',
    characterTheme: 'Cyber',
    overclockEnabled: false,
    hyperOverdrive: false,
    boosters: {
      regedit: true,
      macro: false,
      fpsBoost: true,
      vSyncFix: true,
      touchOptimization: true,
      hardwareAcceleration: false
    }
  });

  const [diagnosticStep, setDiagnosticStep] = useState<number | null>(null);

  const diagnosticLabels = config.hyperOverdrive ? [
    'INITIATING_HYPER_DRIVE_CORE_200%...',
    'FORCING_SUB_PIXEL_PRECISION...',
    'BYPASSING_KERNEL_TOUCH_LATENCY...',
    'SYNCHRONIZING_NEURAL_SYNAPSE...',
    'OVERDRIVE_ACTIVE_UNLEASH_GOD_MODE'
  ] : config.overclockEnabled ? [
    'INITIATING_HYPER_DRIVE_CORE...',
    'OVERCLOCKING_TOUCH_SAMPLING_SENSORS...',
    'FORCING_MAX_REFLEX_COEFFICIENTS...',
    'STABILIZING_99.9%_SYNC_LOCK...',
    'OVERCLOCK_ACTIVE_v25_READY'
  ] : [
    'CONNECTING_TO_GLOBAL_INTEL_NETWORK...',
    'ANALYZING_DEVICE_KERNEL_PARAMETERS...',
    'MAPPING_TOUCH_SAMPLING_COEFFICIENTS...',
    'STABILIZING_QUANTUM_WAVE_FUNCTION...',
    'SYNC_READY_v25_ACTIVE'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.deviceModel || !config.deviceBrand) return;
    
    let step = 0;
    setDiagnosticStep(0);
    const interval = setInterval(() => {
      step++;
      if (step >= diagnosticLabels.length) {
        clearInterval(interval);
        setDiagnosticStep(null);
        onGenerate(config);
      } else {
        setDiagnosticStep(step);
      }
    }, 400);
  };

  return (
    <div className={`glass-v2 p-12 relative overflow-hidden animate-fade-in group border-t-4 transition-all duration-500 ${config.hyperOverdrive ? 'border-rose-600 shadow-[0_0_100px_rgba(225,29,72,0.6)] bg-rose-950/5' : config.overclockEnabled ? 'border-orange-500 shadow-[0_0_60px_rgba(249,115,22,0.3)]' : 'border-purple-500/80 shadow-[0_0_50px_rgba(168,85,247,0.15)]'}`}>
      
      {config.hyperOverdrive && (
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] animate-pulse"></div>
      )}

      {diagnosticStep !== null && (
        <div className="absolute inset-0 z-[200] bg-black/98 flex flex-col items-center justify-center p-10 backdrop-blur-3xl">
          <div className="relative w-32 h-32 flex items-center justify-center mb-12">
             <div className={`absolute inset-0 border-2 rounded-full animate-ping ${config.hyperOverdrive ? 'border-rose-600' : 'border-purple-500'}`}></div>
             <div className={`absolute inset-4 border-4 rounded-full animate-spin ${config.hyperOverdrive ? 'border-rose-600/40' : 'border-cyan-500/20'}`}></div>
             <div className={`text-3xl font-orbitron font-black animate-pulse italic ${config.hyperOverdrive ? 'text-rose-500' : 'text-white'}`}>PH</div>
          </div>
          <div className={`${config.hyperOverdrive ? 'text-rose-500' : config.overclockEnabled ? 'text-orange-500' : 'text-purple-500'} font-orbitron font-black text-[11px] tracking-[0.6em] animate-pulse text-center`}>
            {diagnosticLabels[diagnosticStep]}
          </div>
        </div>
      )}

      <div className="mb-16 flex justify-between items-end border-b border-white/5 pb-8">
        <div className="space-y-2">
          <h3 className={`text-[10px] font-black uppercase tracking-[0.5em] ${config.hyperOverdrive ? 'text-rose-600 animate-pulse' : config.overclockEnabled ? 'text-orange-500' : 'text-purple-500'}`}>
            Neural Pipeline v25.0 {config.hyperOverdrive ? '// HYPER_OVERDRIVE_200%' : config.overclockEnabled ? '// OVERCLOCK_MODE' : ''}
          </h3>
          <p className="text-5xl font-orbitron font-black text-white italic tracking-tighter uppercase leading-none">QUANTUM<span className={`text-transparent [text-stroke:1px_white] ${config.hyperOverdrive ? '[text-stroke:1px_#e11d48]' : ''}`}>_SYNC</span></p>
        </div>
        <div className="flex flex-col items-end gap-3">
           <button 
             type="button"
             onClick={() => setConfig({...config, hyperOverdrive: !config.hyperOverdrive, overclockEnabled: !config.hyperOverdrive})}
             className={`px-6 py-3 border text-[9px] font-black transition-all flex items-center gap-4 ${config.hyperOverdrive ? 'bg-rose-600 border-rose-600 text-white shadow-[0_0_25px_#e11d48]' : 'border-white/10 text-slate-500 hover:text-white'}`}
           >
              <span>OVERDRIVE_200%</span>
              <div className={`w-10 h-5 rounded-full relative transition-all ${config.hyperOverdrive ? 'bg-black/40' : 'bg-slate-800'}`}>
                 <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${config.hyperOverdrive ? 'right-1 bg-white shadow-[0_0_12px_white]' : 'left-1 bg-slate-600'}`}></div>
              </div>
           </button>
           <button 
             type="button"
             onClick={() => setConfig({...config, overclockEnabled: !config.overclockEnabled})}
             className={`px-4 py-2 border text-[8px] font-black transition-all flex items-center gap-3 ${config.overclockEnabled && !config.hyperOverdrive ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/10 text-slate-500 hover:text-white opacity-50'}`}
             disabled={config.hyperOverdrive}
           >
              <span>NEURAL_OVERCLOCK</span>
           </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="space-y-6">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <span className={`w-1.5 h-1.5 ${config.hyperOverdrive ? 'bg-rose-600 shadow-[0_0_15px_red]' : config.overclockEnabled ? 'bg-orange-500 shadow-[0_0_10px_orange]' : 'bg-purple-500'}`}></span> CORE_IDENTITY
            </label>
            <div className="space-y-4">
               <input
                 type="text" required placeholder="BRAND (e.g. XIAOMI)"
                 className="w-full bg-white/[0.03] border-b border-white/10 px-0 py-5 text-white font-orbitron font-black uppercase focus:border-purple-500 outline-none text-sm tracking-widest transition-all placeholder:opacity-20"
                 value={config.deviceBrand} onChange={(e) => setConfig({ ...config, deviceBrand: e.target.value.toUpperCase() })}
               />
               <input
                 type="text" required placeholder="MODEL (e.g. 14 ULTRA)"
                 className="w-full bg-white/[0.03] border-b border-white/10 px-0 py-5 text-white font-orbitron font-black uppercase focus:border-purple-500 outline-none text-sm tracking-widest transition-all placeholder:opacity-20"
                 value={config.deviceModel} onChange={(e) => setConfig({ ...config, deviceModel: e.target.value.toUpperCase() })}
               />
               <input
                 type="number" required placeholder="CURRENT DPI"
                 className="w-full bg-white/[0.03] border-b border-white/10 px-0 py-5 text-white font-orbitron font-black uppercase focus:border-purple-500 outline-none text-sm tracking-widest transition-all placeholder:opacity-20"
                 value={config.dpi} onChange={(e) => setConfig({ ...config, dpi: Number(e.target.value) })}
               />
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <span className={`w-1.5 h-1.5 ${config.hyperOverdrive ? 'bg-cyan-400 shadow-[0_0_10px_cyan]' : 'bg-cyan-500'}`}></span> TACTICAL_VECTORS
            </label>
            <div className="space-y-4">
               <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-700 uppercase">WEAPON</span>
                  <select
                    className="w-full bg-white/[0.03] border border-white/5 px-6 py-5 text-xs font-black text-white uppercase focus:border-cyan-500 outline-none cursor-pointer appearance-none"
                    value={config.weaponCategory}
                    onChange={(e) => setConfig({ ...config, weaponCategory: e.target.value as WeaponCategory })}
                  >
                    <option value="All-Rounder">Universal Master</option>
                    <option value="M1887 (Shotgun)">Shotgun King</option>
                    <option value="Desert Eagle">Eagle One-Tap</option>
                    <option value="SMG Spray">MP40 / UMP Flow</option>
                    <option value="Woodpecker/SVD">Marksman Elite</option>
                  </select>
               </div>
               <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-700 uppercase">STYLE</span>
                  <select
                    className="w-full bg-white/[0.03] border border-white/5 px-6 py-5 text-xs font-black text-white uppercase focus:border-purple-500 outline-none cursor-pointer appearance-none"
                    value={config.playStyle}
                    onChange={(e) => setConfig({ ...config, playStyle: e.target.value as any })}
                  >
                    <option value="Aggressive">Rusher (Full Aggro)</option>
                    <option value="Balanced">Balanced (Esports)</option>
                    <option value="Passive">Sniper (Strategic)</option>
                  </select>
               </div>
            </div>
          </div>

          <div className="space-y-6">
             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className={`w-1.5 h-1.5 ${config.hyperOverdrive ? 'bg-rose-500' : 'bg-emerald-500'}`}></span> HYPER_BOOSTERS
             </label>
             <div className="grid grid-cols-2 gap-3">
                {Object.keys(config.boosters!).map(id => (
                  <button
                    key={id} type="button" onClick={() => setConfig(prev => ({...prev, boosters: {...prev.boosters!, [id]: !prev.boosters![id as keyof typeof config.boosters]}}))}
                    className={`py-4 px-4 border text-[9px] font-black transition-all uppercase tracking-tighter ${config.boosters![id as keyof typeof config.boosters] ? (config.hyperOverdrive ? 'bg-rose-600/20 border-rose-600 text-white shadow-[0_0_10px_rgba(225,29,72,0.2)]' : 'bg-emerald-500/20 border-emerald-500 text-white') : 'border-white/5 text-slate-600 hover:border-white/10'}`}
                  >
                    {id.replace(/([A-Z])/g, '_$1')}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <button
          type="submit" disabled={isLoading}
          className={`w-full py-10 text-white font-orbitron font-black text-md uppercase tracking-[1em] transition-all relative overflow-hidden group disabled:opacity-50 ${config.hyperOverdrive ? 'bg-gradient-to-r from-rose-900 via-rose-600 to-rose-900 hover:shadow-[0_0_150px_rgba(225,29,72,0.6)]' : config.overclockEnabled ? 'bg-gradient-to-r from-orange-700 to-black hover:from-orange-600' : 'bg-gradient-to-r from-purple-700 to-cyan-700 hover:from-purple-600'}`}
        >
          <span className="relative z-10">{config.hyperOverdrive ? 'UNLEASH_200%_GOD_MODE' : config.overclockEnabled ? 'FORCING_MAX_CALIBRATION' : 'INITIALIZE_QUANTUM_BURST'}</span>
          <div className="absolute inset-0 bg-white/10 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          {config.hyperOverdrive && (
            <div className="absolute inset-0 border-[3px] border-white/20 animate-pulse"></div>
          )}
        </button>
      </form>
    </div>
  );
};

export default SensitivityForm;
