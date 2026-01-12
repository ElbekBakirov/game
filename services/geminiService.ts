
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { UserConfig, GenerateSensiResponse, SensiSettings, MetaTrend, MapIntel } from "../types";

const generateLocalFallback = (config: UserConfig): GenerateSensiResponse => {
  const boost = config.hyperOverdrive ? 25 : config.overclockEnabled ? 15 : 0;
  const baseBase = 175 + (config.refreshRate > 60 ? 15 : 0) + boost;
  const clampSensi = (val: number) => Math.max(140, Math.min(200, Math.round(val)));

  return {
    settings: {
      general: clampSensi(baseBase),
      redDot: clampSensi(baseBase * 1.1),
      scope2x: clampSensi(baseBase * 1.05),
      scope4x: clampSensi(baseBase * 1.02),
      sniperScope: clampSensi(160 + boost),
      freeLook: 200,
      fireButtonSize: config.fireButtonSize,
      graphicSettings: "Extreme (V-Sync OFF)",
      fpsSetting: "Max Unlocked",
      dragPattern: config.playStyle === 'Aggressive' ? 'J-Curve' : 'Straight',
      weaponMultiplier: 1.5,
      recoilControl: { vertical: 98, horizontal: 99, stabilization: 100 },
      metrics: { speed: 100, accuracy: 99.9, stability: 98, headshotRatio: 99 + (boost / 10) },
      microAdjustments: { 
        cursorSpeed: "Instant", 
        touchResponse: "Sub-Atomic", 
        pointerSpeed: "Quantum_Limit",
        dpiValue: config.dpi + 40
      },
      proTips: ["NEURAL_LINK_OFFLINE: Local engine active.", "Check API Key in Hosting Dashboard."]
    },
    explanation: "Local calibration mode. Pro models are disabled without API key.",
    accuracyScore: 99.1 + (config.hyperOverdrive ? 0.8 : 0),
    timestamp: Date.now(),
    hyperSyncActive: false
  };
};

export const generateSensiSettings = async (config: UserConfig): Promise<GenerateSensiResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === '') return generateLocalFallback(config);

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const hardwareQuery = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Free Fire Pro Optimization for ${config.deviceBrand} ${config.deviceModel}. 
      HyperOverdrive: ${config.hyperOverdrive}. Return JSON with precise sensitivities 140-200.`,
      config: { 
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            settings: {
              type: Type.OBJECT,
              properties: {
                general: { type: Type.NUMBER },
                redDot: { type: Type.NUMBER },
                scope2x: { type: Type.NUMBER },
                scope4x: { type: Type.NUMBER },
                sniperScope: { type: Type.NUMBER },
                fireButtonSize: { type: Type.NUMBER },
                graphicSettings: { type: Type.STRING },
                fpsSetting: { type: Type.STRING },
                dragPattern: { type: Type.STRING },
                recoilControl: { type: Type.OBJECT, properties: { vertical: { type: Type.NUMBER }, horizontal: { type: Type.NUMBER }, stabilization: { type: Type.NUMBER } } },
                microAdjustments: { type: Type.OBJECT, properties: { dpiValue: { type: Type.NUMBER }, pointerSpeed: { type: Type.STRING } } },
                proTips: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["general", "redDot", "fireButtonSize"]
            },
            explanation: { type: Type.STRING },
            accuracyScore: { type: Type.NUMBER }
          }
        }
      }
    });

    let parsed = JSON.parse(hardwareQuery.text || "{}");
    
    let audioBase64 = "";
    try {
      const tts = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: "Neural calibration complete. Pro mode active." }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
        }
      });
      audioBase64 = tts.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
    } catch (e) { console.warn("TTS Failed", e); }

    return { ...parsed, audioBase64, timestamp: Date.now(), hyperSyncActive: true };
  } catch (error) {
    console.error("AI Generation Error", error);
    return generateLocalFallback(config);
  }
};

export const generateTrainingVideo = async (config: UserConfig): Promise<string | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Cinematic Free Fire gameplay, ultra precision shots with ${config.weaponCategory}. 4K.`,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });
    while (!operation.done) {
      await new Promise(r => setTimeout(r, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }
    const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
    return uri ? `${uri}&key=${apiKey}` : null;
  } catch (e) { return null; }
};

export const fetchStrategicMapIntel = async (lat: number, lng: number): Promise<MapIntel[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return [];
  const ai = new GoogleGenAI({ apiKey });
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "List gaming hubs and esports arenas nearby.",
      config: { tools: [{ googleMaps: {} }], toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } } }
    });
    return (res.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
      .filter((c: any) => c.maps)
      .map((c: any) => ({ title: c.maps.title, uri: c.maps.uri, address: c.maps.address }));
  } catch (e) { return []; }
};

export const generateCustomSkin = async (prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Key missing");
  const ai = new GoogleGenAI({ apiKey });
  const res = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `Free Fire concept weapon skin: ${prompt}` }] }
  });
  const part = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (!part) throw new Error("No image");
  return `data:image/png;base64,${part.inlineData?.data}`;
};

export const fetchRealTimeMeta = async (): Promise<MetaTrend[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return [];
  const ai = new GoogleGenAI({ apiKey });
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Latest Free Fire meta weapon buffs 2025.",
      config: { tools: [{ googleSearch: {} }] }
    });
    return [{ title: "Meta Pulse", impact: "BUFF", description: res.text || "Synced", sourceUrl: "#" }];
  } catch (e) { return []; }
};

export const generateOperatorAvatar = async (name: string, style: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
  const ai = new GoogleGenAI({ apiKey });
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Cyberpunk gaming avatar for operator ${name}` }] }
    });
    const part = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    return part ? `data:image/png;base64,${part.inlineData?.data}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
  } catch (e) { return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`; }
};
