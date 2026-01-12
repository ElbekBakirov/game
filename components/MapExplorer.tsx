
import React, { useState, useEffect } from 'react';
import { fetchStrategicMapIntel } from '../services/geminiService';
import { MapIntel } from '../types';

const MapExplorer: React.FC = () => {
  const [intel, setIntel] = useState<MapIntel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanNearby = () => {
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const data = await fetchStrategicMapIntel(pos.coords.latitude, pos.coords.longitude);
        setIntel(data);
        setLoading(false);
      },
      (err) => {
        setError("GEOLOCATION_DENIED: Please enable location access.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto pb-24">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter uppercase">STRATEGIC_MAP_INTEL</h2>
          <p className="text-[8px] font-black text-emerald-500 tracking-[0.4em] uppercase mt-2">Locating E-Sports Hubs & Gaming Sectors</p>
        </div>
        <button 
          onClick={scanNearby}
          disabled={loading}
          className="px-10 py-4 bg-emerald-600 text-black font-orbitron font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all disabled:opacity-50"
        >
          {loading ? 'SCANNING...' : 'INITIALIZE_RADAR'}
        </button>
      </div>

      {error && (
        <div className="glass-v2 p-6 border-l-2 border-rose-500 text-rose-500 font-black text-xs uppercase">
          {error}
        </div>
      )}

      {intel.length === 0 && !loading ? (
        <div className="py-20 text-center border border-dashed border-white/5 rounded-lg">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">No tactical zones detected. Initialize Radar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {intel.map((item, idx) => (
            <div key={idx} className="glass-v2 p-8 border-t-2 border-emerald-500 group hover:border-white/20 transition-all relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                  <svg className="w-12 h-12 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
               </div>
               <h4 className="text-xl font-orbitron font-black text-white italic mb-2 truncate pr-10">{item.title}</h4>
               {item.rating && (
                 <div className="flex items-center gap-2 mb-4">
                    <div className="text-[8px] font-black text-yellow-500 uppercase tracking-widest">RANK: {item.rating}</div>
                    <div className="flex gap-0.5">
                       {[...Array(5)].map((_, i) => (
                         <div key={i} className={`w-1 h-1 rounded-full ${i < Math.round(item.rating!) ? 'bg-yellow-500' : 'bg-white/10'}`}></div>
                       ))}
                    </div>
                 </div>
               )}
               <p className="text-[9px] text-slate-500 font-bold uppercase mb-6 line-clamp-2">{item.address}</p>
               {item.snippet && (
                 <div className="p-3 bg-white/5 rounded italic text-[8px] text-slate-400 font-bold mb-6 border-l border-emerald-500/30">
                   "{item.snippet}"
                 </div>
               )}
               <a 
                 href={item.uri} 
                 target="_blank" 
                 rel="noreferrer"
                 className="block text-center py-3 border border-emerald-500/20 text-emerald-500 font-black text-[8px] uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
               >
                 Navigate_To_Sector
               </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapExplorer;
