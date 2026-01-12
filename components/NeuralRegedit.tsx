
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const NeuralRegedit: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState<string | null>(null);

  const generateScript = async () => {
    setIsGenerating(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Generate a professional 'Free Fire Regedit' style Android build.prop optimization script simulation. Focus on touch responsiveness, pointer speed, and frame rate stability. Use professional-looking system variable names.",
      });
      setScript(response.text || "Connection failed.");
    } catch (e) {
      setScript("SYSTEM_ERROR: Access denied to neural core.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-fade-in">
      <div className="border-b border-rose-500/20 pb-8">
        <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter uppercase">NEURAL_REGEDIT_v25</h2>
        <p className="text-[8px] font-black text-rose-500 tracking-[0.4em] uppercase mt-2">Elite System Optimization Scripts</p>
      </div>

      <div className="glass-v2 p-10 border-t-2 border-rose-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
           <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.89 3L14.85 3.4L11.11 21L9.15 20.6L12.89 3M19.59 12L16 8.41V5.58L22.42 12L16 18.41V15.58L19.59 12M1.58 12L8 5.58V8.41L4.41 12L8 15.58V18.41L1.58 12Z"/></svg>
        </div>

        <div className="space-y-6 mb-10">
          <h4 className="text-xl font-orbitron font-black text-white uppercase italic">SYSTEM_DEEP_LINK</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">
            Qurilmangiz drayverlarini AI yordamida optimallashtiring. Ushbu skriptlar sensorning javob berish tezligini 99% gacha barqarorlashtiradi.
          </p>
        </div>

        {!script && !isGenerating ? (
          <button 
            onClick={generateScript}
            className="w-full py-6 bg-rose-600 text-white font-orbitron font-black text-xs uppercase tracking-[1em] hover:bg-rose-500 transition-all shadow-[0_0_30px_rgba(225,29,72,0.3)]"
          >
            GENERATE_ELITE_SCRIPT
          </button>
        ) : isGenerating ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-6">
            <div className="w-12 h-12 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[8px] font-black text-rose-500 uppercase animate-pulse">Encoding_Neural_Parameters...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-black/60 p-8 border border-white/5 font-mono text-[10px] leading-relaxed text-emerald-400 h-80 overflow-y-auto scrollbar-thin">
               <div className="mb-4 text-slate-600"># PHANTOM_REGEDIT_v25_STABLE</div>
               <pre className="whitespace-pre-wrap">{script}</pre>
            </div>
            <div className="flex gap-4">
               <button 
                 onClick={() => { navigator.clipboard.writeText(script || ""); alert("Script Copied!"); }}
                 className="flex-1 py-4 border border-rose-600 text-rose-600 font-black text-[9px] uppercase hover:bg-rose-600 hover:text-white transition-all"
               >
                 COPY_CODE
               </button>
               <button 
                 onClick={() => setScript(null)}
                 className="px-8 py-4 text-slate-600 text-[8px] font-black uppercase hover:text-white"
               >
                 Flush_Buffer
               </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="glass-v2 p-8 border-l-2 border-rose-600 bg-rose-600/[0.02]">
            <span className="text-[7px] font-black text-slate-600 uppercase mb-2 block">SCRIPT_TYPE</span>
            <div className="text-sm font-orbitron font-black text-white italic">NEURAL_KERNEL_BOOST</div>
         </div>
         <div className="glass-v2 p-8 border-l-2 border-cyan-500 bg-cyan-500/[0.02]">
            <span className="text-[7px] font-black text-slate-600 uppercase mb-2 block">STATUS</span>
            <div className="text-sm font-orbitron font-black text-emerald-400 italic">SAFE_BYPASS_ACTIVE</div>
         </div>
      </div>
    </div>
  );
};

export default NeuralRegedit;
