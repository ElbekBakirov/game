
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Tourney {
  title: string;
  uri: string;
}

const TournamentRadar: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Tourney[]>([]);

  const scanTournaments = async () => {
    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Find current and upcoming Free Fire e-sports tournaments, community cups, and registration links for 2025. Be specific with locations or global platforms.",
        config: { tools: [{ googleSearch: {} }] }
      });
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const links = chunks.filter((c: any) => c.web).map((c: any) => ({
        title: c.web.title,
        uri: c.web.uri
      }));
      setResults(links);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-fade-in">
      <div className="border-b border-cyan-500/20 pb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter uppercase">TOURNAMENT_RADAR</h2>
          <p className="text-[8px] font-black text-cyan-500 tracking-[0.4em] uppercase mt-2">Global E-Sports Event Scouter</p>
        </div>
        <button 
          onClick={scanTournaments}
          disabled={loading}
          className="px-8 py-4 bg-cyan-600 text-black font-orbitron font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all disabled:opacity-50"
        >
          {loading ? 'RADAR_SCANNING...' : 'SCAN_GLOBAL_META'}
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-10">
           <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 border-2 border-cyan-500 rounded-full animate-ping"></div>
              <div className="absolute inset-4 border-4 border-cyan-500/20 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-1 h-1 bg-cyan-500 rounded-full shadow-[0_0_15px_cyan]"></div>
              </div>
           </div>
           <p className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.5em] animate-pulse">Syncing_with_global_servers...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {results.map((t, i) => (
             <div key={i} className="glass-v2 p-8 border-l-2 border-cyan-500 group hover:bg-cyan-500/5 transition-all">
                <div className="text-[7px] text-slate-500 font-black mb-2 uppercase tracking-widest">Global_Event_Signal</div>
                <h4 className="text-xl font-orbitron font-black text-white italic mb-6 leading-tight group-hover:text-cyan-400 transition-colors">{t.title}</h4>
                <a href={t.uri} target="_blank" className="inline-block py-3 px-6 border border-cyan-500/20 text-cyan-500 font-black text-[8px] uppercase tracking-widest hover:bg-cyan-600 hover:text-white transition-all">Join_Sector</a>
             </div>
           ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-white/5">
           <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.5em]">Radar idle. Initialize global scan to find events.</p>
        </div>
      )}
    </div>
  );
};

export default TournamentRadar;
