
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

const NeuroVoice: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionPromiseRef = useRef<any>(null);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  };

  const startVoiceLink = async () => {
    if (isConnecting || isActive) return;
    setIsConnecting(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outCtx;

      let nextStartTime = 0;
      const sources = new Set<AudioBufferSourceNode>();

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            setTranscripts(prev => [...prev, "[SYS] NEURAL_LINK_ESTABLISHED", "Phantom: Operator, aloqadaman. Qanday taktik yordam kerak?"]);
          },
          onmessage: async (message: any) => {
            if (message.serverContent?.outputTranscription) {
               setTranscripts(prev => [...prev, `Phantom: ${message.serverContent.outputTranscription.text}`]);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
               const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current);
               const source = audioContextRef.current.createBufferSource();
               source.buffer = audioBuffer;
               source.connect(audioContextRef.current.destination);
               
               nextStartTime = Math.max(nextStartTime, audioContextRef.current.currentTime);
               source.start(nextStartTime);
               nextStartTime += audioBuffer.duration;
               sources.add(source);
               source.onended = () => sources.delete(source);
            }
          },
          onerror: () => {
            setTranscripts(prev => [...prev, "[ERROR] NEURAL_SYNC_FAILED"]);
            terminateLink();
          },
          onclose: () => terminateLink()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          systemInstruction: "Sen Free Fire kiber-sport bo'yicha Phantom AI professional yordamchisisan. Qisqa va professional javob ber."
        }
      });

    } catch (e) {
      console.error(e);
      setIsConnecting(false);
    }
  };

  const terminateLink = () => {
    setIsActive(false);
    setIsConnecting(false);
    if (audioContextRef.current) audioContextRef.current.close();
    setTranscripts([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-fade-in">
      <div className="border-b border-purple-500/20 pb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter uppercase">NEURO_VOICE_LINK_v2.5</h2>
          <p className="text-[8px] font-black text-purple-500 tracking-[0.4em] uppercase mt-2">Zero-Latency Cognitive E-sports Support</p>
        </div>
        <div className="text-[7px] text-slate-700 font-black italic">OMEGA_SYNC</div>
      </div>

      <div className="glass-v2 p-10 flex flex-col items-center justify-center space-y-12 border-t-2 border-purple-600">
         {!isActive ? (
           <button 
             onClick={startVoiceLink}
             disabled={isConnecting}
             className={`w-40 h-40 rounded-full border-2 border-purple-500 flex items-center justify-center group hover:bg-purple-500 transition-all shadow-[0_0_30px_rgba(168,85,247,0.2)] ${isConnecting ? 'animate-pulse opacity-50' : ''}`}
           >
              {isConnecting ? (
                <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-16 h-16 text-purple-500 group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
              )}
           </button>
         ) : (
           <div className="w-full space-y-8">
              <div className="flex justify-center gap-1 h-20 items-center">
                 {[...Array(24)].map((_, i) => (
                   <div key={i} className="w-1.5 bg-purple-500 animate-[bounce_1s_infinite]" style={{ height: `${Math.random() * 80 + 20}%`, animationDelay: `${i * 0.05}s` }}></div>
                 ))}
              </div>
              <div className="bg-black/60 p-8 h-80 overflow-y-auto font-mono text-[10px] space-y-4 border border-white/5 scrollbar-thin">
                 {transcripts.map((t, i) => (
                   <div key={i} className="text-slate-300 leading-relaxed uppercase border-l border-purple-500/30 pl-4 py-1">
                     <span className="text-purple-500 mr-2">[{i.toString().padStart(2, '0')}]</span> {t}
                   </div>
                 ))}
              </div>
              <button 
                onClick={terminateLink}
                className="w-full py-5 border border-rose-500 text-rose-500 font-black text-[9px] uppercase tracking-widest hover:bg-rose-500 hover:text-black transition-all"
              >
                TERMINATE_VOICE_SESSION
              </button>
           </div>
         )}
         <p className="text-[10px] text-slate-500 font-bold uppercase italic text-center max-w-sm">
           "Haqiqiy vaqt rejimida (Native Audio) taktik maslahatlar olish uchun tugmani bosing va mikrofonga savol bering."
         </p>
      </div>
    </div>
  );
};

export default NeuroVoice;
