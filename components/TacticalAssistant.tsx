
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

const TacticalAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: 'Hello, this is PHANTOM AI - New Neural Design (WEB). I am ready to generate your best Free Fire sensitivities. How can I assist you today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are Phantom AI for Free Fire. Keep responses concise and professional like a high-end gaming bot. User: ${userMsg}`,
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "Connection lost." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Error: System link offline. Check API Key." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[70vh] flex flex-col glass-v2 rounded-2xl overflow-hidden animate-fade-in shadow-2xl border border-blue-500/10">
      <div className="p-6 bg-blue-600 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-orbitron font-bold text-white">P</div>
          <div>
            <h3 className="text-white font-bold text-sm">PHANTOM BOT</h3>
            <p className="text-[9px] text-blue-100 uppercase tracking-widest font-bold">New Design (WEB)</p>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
      </div>

      <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 bg-[#020617]/40">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[80%] px-5 py-4 rounded-2xl text-[12px] font-medium leading-relaxed ${
              msg.role === 'user' 
              ? 'bg-blue-600 text-white rounded-br-none shadow-lg' 
              : 'bg-white/10 text-slate-200 rounded-bl-none border border-white/5'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-blue-500 text-[10px] font-bold">
            <div className="flex gap-1">
              <span className="w-1 h-1 bg-current rounded-full animate-bounce"></span>
              <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
            THINKING...
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/5">
        <div className="flex gap-3">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TacticalAssistant;
