
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const MacroBuilder: React.FC = () => {
  const [macroType, setMacroType] = useState('Fast Gloo Wall');
  const [isBuilding, setIsBuilding] = useState(false);
  const [sequence, setSequence] = useState<string | null>(null);

  const buildMacro = async () => {
    setIsBuilding(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a professional Free Fire macro sequence script simulation for '${macroType}'. Include millisecond timings, finger movements (e.g. Index Finger, Thumb), and button coordinates (X, Y). Format it as a technical step-by-step guide.`,
      });
      setSequence(response.text || "Failed to compile sequence.");
    } catch (e) {
      setSequence("SEQUENCE_ERROR: Neural bypass failed.");
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-fade-in">
      <div className="border-b border-rose-500/20 pb-8">
        <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter uppercase">NEURAL_MACRO_BUILDER</h2>
        <p className="text-[8px] font-black text-rose-500 tracking-[0.4em] uppercase mt-2">Elite Button Sequence Orchestration</p>
      </div>

      <div className="glass-v2 p-10 border-t-2 border-rose-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {['Fast Gloo Wall', 'Quick Scope Switch', 'Jump Shot Sync', '360 Drag-Tap'].map(type => (
            <button 
              key={type}
              onClick={() => setMacroType(type)}
              className={`py-4 text-[9px] font-black border transition-all uppercase ${macroType === type ? 'bg-rose-600 border-rose-600 text-white' : 'border-white/5 text-slate-500 hover:border-white/10'}`}
            >
              {type}
            </button>
          ))}
        </div>

        {isBuilding ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-rose-500 uppercase animate-pulse tracking-[0.4em]">Compiling_Movement_Vectors...</p>
          </div>
        ) : sequence ? (
          <div className="space-y-6 animate-fade-in">
             <div className="bg-black/60 p-8 border border-white/5 font-mono text-[10px] text-cyan-400 leading-relaxed max-h-96 overflow-y-auto scrollbar-thin">
                <div className="text-rose-500 mb-4 font-black"># MACRO_READY: {macroType.toUpperCase()}</div>
                <pre className="whitespace-pre-wrap">{sequence}</pre>
             </div>
             <button onClick={() => setSequence(null)} className="w-full py-4 bg-white/5 text-slate-500 font-black text-[9px] uppercase hover:text-white">Clear_Buffer</button>
          </div>
        ) : (
          <div className="text-center py-20 space-y-8">
            <p className="text-[11px] text-slate-500 font-bold uppercase max-w-md mx-auto">AI yordamida o'yin ichidagi eng murakkab harakatlar uchun millisekundli skriptlarni yarating.</p>
            <button 
              onClick={buildMacro}
              className="px-14 py-6 bg-rose-600 text-white font-orbitron font-black text-xs uppercase tracking-[0.5em] hover:bg-rose-500 shadow-[0_0_30px_rgba(225,29,72,0.3)] transition-all"
            >
              INITIALIZE_BUILD
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MacroBuilder;
