
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SensitivityForm from './components/SensitivityForm';
import ResultDisplay from './components/ResultDisplay';
import LoadingScreen from './components/LoadingScreen';
import UserAuth from './components/UserAuth';
import TacticalAssistant from './components/TacticalAssistant';
import NeuroOptimizer from './components/NeuroOptimizer';
import ProPresets from './components/ProPresets';
import DpiConverter from './components/DpiConverter';
import { UserConfig, GenerateSensiResponse, UserProfile } from './types';
import { generateSensiSettings } from './services/geminiService';

const SESSION_KEY = 'PHANTOM_CURRENT_OP_V12';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('generator');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateSensiResponse | null>(null);
  const [currentConfig, setCurrentConfig] = useState<UserConfig | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession);
        setCurrentUser(user);
      } catch (e) {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const handleAuthComplete = (name: string, avatarUrl: string) => {
    const user: UserProfile = { name, avatarUrl, records: [], lastActive: Date.now() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleGenerate = async (config: UserConfig) => {
    setLoading(true);
    setCurrentConfig(config);
    try {
      const data = await generateSensiSettings(config);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return <UserAuth onComplete={handleAuthComplete} />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        activeTab={activeTab} 
        onTabChange={(tab) => { setActiveTab(tab); setResult(null); }} 
        onLogout={() => { localStorage.removeItem(SESSION_KEY); setCurrentUser(null); }}
        userName={currentUser.name} 
      />

      <main className="flex-grow container mx-auto px-6 py-10">
        {loading ? (
          <LoadingScreen />
        ) : result && activeTab === 'generator' && currentConfig ? (
          <ResultDisplay 
            data={result} 
            config={currentConfig} 
            userName={currentUser.name} 
            avatarUrl={currentUser.avatarUrl || ''} 
            onReset={() => setResult(null)} 
          />
        ) : activeTab === 'generator' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8">
               <SensitivityForm onGenerate={handleGenerate} isLoading={loading} />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-v2 p-8 rounded-2xl border-l-4 border-blue-500">
                <h4 className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-4">Neural Status</h4>
                <p className="text-[11px] text-slate-400 font-medium">PHANTOM X V25 platformasi kiber-sport darajasidagi sezgirlikni tahlil qilishga tayyor.</p>
              </div>
              <ProPresets />
            </div>
          </div>
        ) : activeTab === 'assistant' ? (
          <TacticalAssistant />
        ) : activeTab === 'optimizer' ? (
          <NeuroOptimizer />
        ) : activeTab === 'pro' ? (
          <ProPresets />
        ) : activeTab === 'dpi_cal' ? (
          <DpiConverter />
        ) : (
          <div className="text-center py-20 opacity-50 uppercase text-[10px] font-bold">Module under construction</div>
        )}
      </main>

      <footer className="py-8 text-center text-[8px] text-slate-600 font-bold uppercase tracking-[1em]">
        PHANTOM SINGULAR v25 OMEGA // 2025
      </footer>
    </div>
  );
};

export default App;
