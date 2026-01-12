
import React, { useState } from 'react';
import { generateCustomSkin } from '../services/geminiService';

const KillForge: React.FC = () => {
  const [operator, setOperator] = useState('PHANTOM');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const forgeBanner = async () => {
    setLoading(true);
    try {
      // Re-using the image gen logic for banners
      const url = await generateCustomSkin(`E-sports Kill Banner for player ${operator}. Neon red, aggressive typography, skull icon, cyberpunk style.`);
      setImageUrl(url);
    } catch (e) {
      alert("FORGE_ERROR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-fade-in">
      <div className="border-b border-rose-500/20 pb-8">
        <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter uppercase">KILL_FEED_FORGE</h2>
        <p className="text-[8px] font-black text-rose-500 tracking-[0.4em] uppercase mt-2">Neural Custom Kill Banner Artificer</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="glass-v2 p-10 border-t-2 border-rose-600 space-y-8">
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operator_Name</label>
              <input 
                type="text" value={operator} onChange={e => setOperator(e.target.value.toUpperCase())}
                className="w-full bg-white/5 border border-white/10 p-5 text-white font-orbitron font-black outline-none focus:border-rose-500 uppercase"
              />
           </div>
           <button 
             onClick={forgeBanner} disabled={loading}
             className="w-full py-5 bg-rose-600 text-black font-orbitron font-black text-xs uppercase tracking-widest hover:bg-rose-400 disabled:opacity-50"
           >
             {loading ? 'CALCULATING_ATOMS...' : 'FORGE_BANNER'}
           </button>
        </div>

        <div className="aspect-video glass-v2 border border-white/5 flex items-center justify-center overflow-hidden group">
           {loading ? (
             <div className="w-12 h-12 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
           ) : imageUrl ? (
             <img src={imageUrl} alt="Banner" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
           ) : (
             <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em]">Waiting_For_Forge</p>
           )}
        </div>
      </div>
    </div>
  );
};

export default KillForge;
