
import React, { useState } from 'react';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '6729') {
      onSuccess();
    } else {
      setError(true);
      setPassword('');
      window.dispatchEvent(new CustomEvent('admin-denied'));
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="py-20 flex items-center justify-center animate-fade-in">
      <div className={`max-w-md w-full glass-v2 p-10 border-t-2 transition-all duration-300 ${error ? 'border-rose-600 shadow-[0_0_50px_rgba(225,29,72,0.4)]' : 'border-rose-500/30'}`}>
        <div className="mb-10 text-center">
          <div className="text-[9px] font-black text-rose-500 tracking-[0.5em] uppercase mb-4">Secure Terminal Access</div>
          <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter">ADMIN_CORE</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Authorization Key</label>
            <input 
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="****"
              className={`w-full bg-white/[0.03] border-b-2 py-4 px-2 text-white font-orbitron font-black text-2xl tracking-[1em] text-center focus:outline-none transition-all ${error ? 'border-rose-600 text-rose-500' : 'border-white/5 focus:border-rose-500'}`}
            />
          </div>

          {error && (
            <p className="text-[9px] text-rose-500 text-center font-black uppercase animate-pulse">
              ACCESS_DENIED: Noto'g'ri parol!
            </p>
          )}

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 py-4 font-orbitron font-black text-[9px] tracking-widest border border-slate-800 text-slate-500 hover:text-white transition-all uppercase"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-2 py-4 px-10 font-orbitron font-black text-[9px] tracking-widest border border-rose-500 text-white hover:bg-rose-500 hover:text-black shadow-[0_0_20px_rgba(225,29,72,0.2)] transition-all uppercase"
            >
              Verify_Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
