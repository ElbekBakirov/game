
import React, { useState } from 'react';
import { generateOperatorAvatar } from '../services/geminiService';

interface Props {
  onComplete: (name: string, avatarUrl: string) => void;
}

const UserAuth: React.FC<Props> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState('Cyberpunk');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3 || loading) return;
    
    setLoading(true);
    const avatar = await generateOperatorAvatar(name, style);
    setLoading(false);
    onComplete(name.trim().toUpperCase(), avatar);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#020617] flex items-center justify-center p-6 backdrop-blur-3xl">
      <div className="absolute inset-0 phantom-grid opacity-20"></div>
      
      <div className="max-w-md w-full glass-v2 p-10 border-t-2 border-purple-500 relative overflow-hidden animate-fade-in">
        {loading && (
          <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-[10px] font-black text-purple-500 uppercase animate-pulse">Generating_Neural_Avatar...</div>
          </div>
        )}

        <div className="mb-10 text-center">
          <div className="text-[9px] font-black text-purple-500 tracking-[0.5em] uppercase mb-4">Identity Matrix</div>
          <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter">GENESIS_LINK</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Operator Nickname</label>
            <input 
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="PHANTOM_ID"
              className="w-full bg-white/[0.03] border-b border-white/5 py-4 px-2 text-white font-orbitron font-black text-xl tracking-widest focus:outline-none focus:border-purple-500 transition-all uppercase"
            />
            
            <div className="grid grid-cols-3 gap-2">
               {['Cyberpunk', 'Military', 'Neon-Ghost'].map(s => (
                 <button 
                   key={s} type="button" onClick={() => setStyle(s)}
                   className={`py-2 text-[7px] font-black border uppercase transition-all ${style === s ? 'bg-purple-500 border-purple-500 text-black' : 'border-white/5 text-slate-500'}`}
                 >
                   {s}
                 </button>
               ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={name.trim().length < 3}
            className={`w-full py-5 font-orbitron font-black tracking-[0.4em] transition-all border ${
              name.trim().length >= 3 
              ? 'border-purple-500 text-white hover:bg-purple-500 hover:text-black shadow-[0_0_30px_rgba(168,85,247,0.3)]' 
              : 'border-slate-800 text-slate-700'
            }`}
          >
            INITIALIZE_SYNC
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserAuth;
