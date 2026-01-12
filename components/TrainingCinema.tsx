
import React, { useState } from 'react';
import { generateTrainingVideo } from '../services/geminiService';
import { UserConfig } from '../types';

interface Props {
  config: UserConfig;
}

const TrainingCinema: React.FC<Props> = ({ config }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleGenerate = async () => {
    // API Key selection check for Veo
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }
    }
    
    setLoading(true);
    setError(false);
    const url = await generateTrainingVideo(config);
    if (url) {
      setVideoUrl(url);
    } else {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="glass-v2 p-10 border-t-2 border-rose-500 relative overflow-hidden animate-fade-in group min-h-[400px]">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-3xl font-orbitron font-black text-white italic tracking-tighter uppercase">VEO_TRAINING_CINEMA</h3>
          <p className="text-[8px] font-black text-rose-500 tracking-[0.4em] uppercase mt-2">Generate Neural Training Simulation</p>
        </div>
        <div className="text-[7px] text-slate-600 font-black uppercase">VEO_ENGINE_v3.1</div>
      </div>

      {videoUrl ? (
        <div className="space-y-6">
          <div className="relative aspect-video bg-black border border-white/10 rounded overflow-hidden shadow-[0_0_50px_rgba(225,29,72,0.2)]">
            <video src={videoUrl} controls autoPlay className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 bg-rose-500 text-black px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">LIVE_CALIBRATION</div>
          </div>
          <button onClick={() => setVideoUrl(null)} className="text-[8px] font-black text-slate-500 hover:text-white uppercase tracking-widest">Regenerate_Scene</button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 space-y-8">
          {loading ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-rose-500 animate-pulse uppercase tracking-[0.5em]">Rendering_Neural_Frames...</p>
                <p className="text-[7px] text-slate-600 uppercase">This may take up to 2 minutes</p>
              </div>
            </div>
          ) : (
            <>
              <div className="max-w-md text-center">
                 <p className="text-[11px] text-slate-400 font-bold uppercase leading-relaxed mb-8">
                   Generate a custom AI training video showcasing your {config.weaponCategory} skills with the {config.characterTheme} theme.
                 </p>
              </div>
              <button 
                onClick={handleGenerate}
                className="px-10 py-5 bg-rose-600 text-white font-orbitron font-black text-[11px] uppercase tracking-[0.3em] hover:bg-rose-500 hover:shadow-[0_0_40px_rgba(225,29,72,0.4)] transition-all"
              >
                INITIALIZE_VEO_SYNC
              </button>
              {error && <p className="text-rose-500 text-[8px] font-black uppercase">Error: Neural pipeline busy. Select paid API Key.</p>}
            </>
          )}
        </div>
      )}

      {/* Decorative */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default TrainingCinema;
