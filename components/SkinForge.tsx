
import React, { useState } from 'react';
import { generateCustomSkin } from '../services/geminiService';

const SkinForge: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [skinUrl, setSkinUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleForge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || loading) return;
    setLoading(true);
    try {
      const url = await generateCustomSkin(prompt);
      setSkinUrl(url);
    } catch (e) {
      alert("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-fade-in">
      <div className="border-b border-white/5 pb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter uppercase">SKIN_FORGE_AI</h2>
          <p className="text-[8px] font-black text-rose-500 tracking-[0.4em] uppercase mt-2">Neural Weapon Concept Artificer</p>
        </div>
        <div className="text-[7px] text-slate-700 font-black">PHANTOM_IMG_v2.5</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <form onSubmit={handleForge} className="space-y-8 glass-v2 p-8 border-t-2 border-rose-500">
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Neural Concept Input</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g. Galaxy Dragon M1014 with purple lightning and chrome finish..."
                className="w-full bg-white/5 border border-white/10 p-5 text-sm font-bold text-white uppercase focus:border-rose-500 outline-none h-32"
              />
           </div>

           <button 
             type="submit" 
             disabled={loading}
             className="w-full py-5 bg-rose-600 text-black font-orbitron font-black text-xs uppercase tracking-widest hover:bg-rose-400 transition-all disabled:opacity-50"
           >
             {loading ? 'CALCULATING_ATOMS...' : 'FORGE_CONCEPT'}
           </button>
        </form>

        <div className="aspect-square glass-v2 border border-white/5 flex items-center justify-center relative overflow-hidden group">
           {loading ? (
             <div className="text-center">
                <div className="w-12 h-12 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[8px] font-black text-rose-500 uppercase animate-pulse">Forging_Neural_Matrix...</p>
             </div>
           ) : skinUrl ? (
             <div className="w-full h-full p-2">
                <img src={skinUrl} alt="Skin" className="w-full h-full object-cover rounded shadow-2xl" />
                <div className="absolute inset-0 bg-rose-500/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
           ) : (
             <div className="text-center px-10">
                <svg className="w-16 h-16 text-slate-800 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em]">Waiting_For_Input_Data</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default SkinForge;
