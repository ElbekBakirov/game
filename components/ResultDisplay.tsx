
import React, { useState, useEffect } from 'react';
import { GenerateSensiResponse, UserConfig, ArchiveRecord } from '../types';
import DragPatternIcon from './DragPatternIcon';
import AimSimulator from './AimSimulator';
import TrainingCinema from './TrainingCinema';

interface Props {
  data: GenerateSensiResponse;
  config: UserConfig;
  userName: string;
  avatarUrl: string;
  onReset: () => void;
}

const HUB_KEY = 'PHANTOM_GLOBAL_HUB_V12';

const ResultDisplay: React.FC<Props> = ({ data, config, userName, avatarUrl, onReset }) => {
  const settings = data?.settings || {} as any;
  const explanation = data?.explanation || "Neural calibration processed.";
  const initialAccuracy = data?.accuracyScore || 0;
  const [accuracyScore, setAccuracyScore] = useState(initialAccuracy);
  const audioBase64 = data?.audioBase64;
  const hardwareSpecs = data?.hardwareSpecs;
  const adjustments = settings.microAdjustments || {};
  const isHyperSync = data?.hyperSyncActive;
  const is200 = config.hyperOverdrive;
  
  const [copied, setCopied] = useState(false);
  const [published, setPublished] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);

  useEffect(() => {
    if (audioBase64) {
      const playAudio = async () => {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          const binary = atob(audioBase64);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          const dataInt16 = new Int16Array(bytes.buffer);
          const buffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
          const channelData = buffer.getChannelData(0);
          for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
          const source = audioCtx.createBufferSource();
          source.buffer = buffer;
          source.connect(audioCtx.destination);
          source.start();
        } catch (e) {}
      };
      playAudio();
    }
  }, [audioBase64]);

  const handleBoost = () => {
    setIsBoosting(true);
    let current = initialAccuracy;
    const interval = setInterval(() => {
      current += 0.05;
      if (current >= 100) {
        setAccuracyScore(100);
        clearInterval(interval);
        setIsBoosting(false);
      } else {
        setAccuracyScore(current);
      }
    }, 15);
  };

  const handlePublish = () => {
    const hubData = JSON.parse(localStorage.getItem(HUB_KEY) || '[]');
    const newRecord: ArchiveRecord = {
      id: `PUB_${Date.now()}`,
      timestamp: Date.now(),
      config,
      result: { ...data, accuracyScore },
      userName,
      likes: 0
    };
    localStorage.setItem(HUB_KEY, JSON.stringify([...hubData, newRecord]));
    setPublished(true);
    setTimeout(() => setPublished(false), 3000);
  };

  return (
    <div className={`max-w-7xl mx-auto pb-32 space-y-16 animate-fade-in relative ${is200 ? 'border-x border-rose-600/30' : ''}`}>
      {is200 && (
        <div className="fixed inset-0 pointer-events-none z-[200] border-[15px] border-rose-600/10 animate-[pulse_2s_infinite]"></div>
      )}

      <div className="flex flex-col md:flex-row gap-10 items-center justify-between border-b-2 border-white/5 pb-12">
        <div className="flex items-center gap-8">
          <div className={`w-32 h-32 border-4 p-1 relative ${is200 ? 'border-rose-600 shadow-[0_0_40px_rgba(225,29,72,0.8)]' : 'border-purple-500 shadow-xl'}`}>
             <img src={avatarUrl} alt="Avatar" className={`w-full h-full object-cover grayscale brightness-125 ${is200 ? 'contrast-150' : ''}`} />
             <div className={`absolute -top-4 -left-4 text-black px-3 py-1 text-[8px] font-black uppercase ${is200 ? 'bg-rose-600 animate-bounce' : 'bg-purple-600'}`}>
                {is200 ? 'GOD_MODE_200%' : 'QUANTUM_UNIT'}
             </div>
          </div>
          <div className="space-y-3">
            <h2 className={`text-7xl font-orbitron font-black italic tracking-tighter uppercase leading-none ${is200 ? 'text-rose-600 animate-pulse' : 'text-white'}`}>
              {userName} <span className={is200 ? 'text-white' : 'text-purple-500'}>OVERDRIVE</span>
            </h2>
            <div className="flex items-center gap-4">
               <span className={`text-[10px] font-black tracking-widest uppercase py-1 px-4 ${is200 ? 'bg-rose-600 text-white' : 'bg-white/5 text-slate-400'}`}>{config.deviceModel}</span>
               <span className={`text-[10px] font-black tracking-widest uppercase py-1 px-4 border ${is200 ? 'border-rose-600 text-rose-500' : 'border-emerald-500/20 text-emerald-500 bg-emerald-500/10'}`}>
                 PRECISION_FLOOR: 140+
               </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handlePublish} 
            className={`px-10 py-5 font-orbitron font-black text-[10px] uppercase tracking-widest border transition-all ${is200 ? 'border-rose-600 bg-rose-900/20 text-white hover:bg-rose-600 hover:text-black shadow-[0_0_20px_#e11d48]' : 'border-purple-500 text-white'}`}
          >
            {published ? 'LINK_ESTABLISHED' : 'BROADCAST_OVERDRIVE'}
          </button>
          <button 
            onClick={() => { navigator.clipboard.writeText(`GENERAL:${settings.general} RD:${settings.redDot}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }} 
            className="px-10 py-5 btn-phantom font-orbitron font-black text-[10px] uppercase tracking-widest"
          >
            {copied ? 'EXTRACTED' : 'EXTRACT_DNA'}
          </button>
        </div>
      </div>

      {is200 && (
        <div className="glass-v2 p-8 border-y border-rose-600 bg-rose-600/5 flex items-center justify-center gap-10 overflow-hidden relative">
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[marquee_5s_linear_infinite]"></div>
           <span className="text-[11px] font-black text-rose-500 uppercase tracking-[1em] animate-pulse">NEURAL_SYNC_MAX_LIMIT_EXCEEDED_200%_ACTIVE</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { label: 'GENERAL_DRAG', val: settings.general, color: is200 ? 'text-rose-500' : 'text-purple-500' },
              { label: 'RED_DOT_LOCK', val: settings.redDot, color: is200 ? 'text-rose-400' : 'text-cyan-400' },
              { label: 'SCOPE_2X_SYNC', val: settings.scope2x, color: is200 ? 'text-rose-300' : 'text-emerald-400' },
              { label: 'SCOPE_4X_MATRIX', val: settings.scope4x, color: is200 ? 'text-rose-200' : 'text-blue-400' },
              { label: 'SNIPER_ONE_TAP', val: settings.sniperScope, color: 'text-white' },
              { label: 'FIRE_TRIGGER', val: settings.fireButtonSize, unit: '%', color: is200 ? 'text-rose-600' : 'text-white' },
            ].map((s, i) => (
              <div key={i} className={`glass-v2 p-10 border-t-2 relative group overflow-hidden ${is200 ? 'border-rose-600 bg-rose-600/[0.03]' : 'border-white/5'}`}>
                <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">{s.label}</div>
                <div className={`text-7xl font-orbitron font-black ${s.color} italic mb-4 tracking-tighter`}>{s.val}{s.unit || ''}</div>
                <div className="h-1.5 w-full bg-white/5 relative">
                   <div className={`h-full ${s.color.replace('text-', 'bg-')} shadow-[0_0_15px_currentColor]`} style={{ width: `${(s.val / 200) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className={`glass-v2 p-10 border-t-2 ${is200 ? 'border-rose-600' : 'border-cyan-500'} grid grid-cols-1 md:grid-cols-2 gap-12`}>
             <div className="space-y-8">
                <h4 className={`text-2xl font-orbitron font-black italic tracking-tighter uppercase ${is200 ? 'text-rose-500' : 'text-white'}`}>MICRO_CALIBRATION</h4>
                <div className="grid grid-cols-2 gap-6">
                   <div className="p-6 border border-white/5 bg-white/[0.02]">
                      <span className="text-[7px] text-slate-500 font-black uppercase mb-1">DPI_FORCE</span>
                      <span className="text-3xl font-orbitron font-black text-white">{adjustments.dpiValue || 620}</span>
                   </div>
                   <div className="p-6 border border-white/5 bg-white/[0.02]">
                      <span className="text-[7px] text-slate-500 font-black uppercase mb-1">REFRESH_SYNC</span>
                      <span className="text-3xl font-orbitron font-black text-white">{config.refreshRate}Hz</span>
                   </div>
                </div>
             </div>
             <div className="flex flex-col justify-center">
                <p className={`text-[11px] font-bold uppercase leading-relaxed italic border-l-4 pl-6 ${is200 ? 'border-rose-600 text-rose-100' : 'border-cyan-500 text-slate-300'}`}>
                  {is200 
                    ? "200% OVERDRIVE: Tizim qurilmangizning barcha parametrlarini o'yin dvigatelining maksimal chegarasiga (200) majburladi. Har bir harakat sub-piksel darajasida headshotga yo'naltirilgan." 
                    : explanation}
                </p>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className={`glass-v2 p-10 border-t-2 ${is200 ? 'border-rose-600' : 'border-emerald-500'} relative overflow-hidden`}>
             <div className="relative w-full aspect-square flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                   <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                   <circle 
                     cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="6" fill="transparent" 
                     strokeDasharray="283%" strokeDashoffset={283 - (283 * accuracyScore) / 100 + "%"} 
                     className={`${is200 ? 'text-rose-600 animate-pulse' : 'text-purple-500'} transition-all duration-[2000ms]`} 
                   />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-5xl font-orbitron font-black text-white">{accuracyScore.toFixed(1)}%</span>
                   <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest mt-2">AIM_SYNC_LEVEL</span>
                </div>
             </div>
             {is200 && accuracyScore < 100 && (
               <button onClick={handleBoost} className="w-full mt-6 py-4 bg-rose-600 text-white font-black text-[9px] uppercase tracking-widest animate-pulse">FORCE_100%_CONVERGENCE</button>
             )}
          </div>

          <div className="glass-v2 p-10 flex flex-col items-center border-l-4 border-rose-600 bg-rose-950/20">
             <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mb-12">HYPER_DRAG_VECTOR</h4>
             <DragPatternIcon type={settings.dragPattern || 'J-Curve'} />
             <div className="mt-14 w-full p-4 bg-white/5 text-center">
                <span className="text-[7px] text-slate-500 font-black uppercase block mb-1">Pattern_Stability</span>
                <span className="text-sm font-orbitron font-black text-emerald-400 uppercase">ABSOLUTE_ZERO</span>
             </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-20">
        <button onClick={onReset} className="px-14 py-6 text-[11px] font-black text-slate-700 hover:text-rose-600 transition-all tracking-[1.5em] border border-white/5 hover:border-rose-600/30">ABORT_HYPER_SESSION</button>
      </div>
    </div>
  );
};

export default ResultDisplay;
