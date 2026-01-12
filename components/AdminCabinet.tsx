
import React, { useState } from 'react';
import { UserProfile, ArchiveRecord, BroadcastLevel } from '../types';

interface Props {
  allUsers: UserProfile[];
  onExit: () => void;
  onUpdateUsers: (newUsers: UserProfile[]) => void;
}

const GLOBAL_MSG_KEY = 'PHANTOM_GLOBAL_MESSAGE';
const GLOBAL_LVL_KEY = 'PHANTOM_GLOBAL_LEVEL';

const AdminCabinet: React.FC<Props> = ({ allUsers, onExit, onUpdateUsers }) => {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [globalMessage, setGlobalMessage] = useState(localStorage.getItem(GLOBAL_MSG_KEY) || 'NEURAL_LINK_ESTABLISHED');
  const [msgLevel, setMsgLevel] = useState<BroadcastLevel>((localStorage.getItem(GLOBAL_LVL_KEY) as BroadcastLevel) || 'NORMAL');

  const totalLogs = allUsers.reduce((acc, u) => acc + u.records.length, 0);

  const saveGlobalBroadcast = () => {
    localStorage.setItem(GLOBAL_MSG_KEY, globalMessage);
    localStorage.setItem(GLOBAL_LVL_KEY, msgLevel);
    alert("Global broadcast executed!");
    window.dispatchEvent(new Event('storage'));
  };

  const wipeUser = (name: string) => {
    if(confirm(`Wipe ${name}?`)) onUpdateUsers(allUsers.filter(u => u.name !== name));
  };

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      <div className="flex justify-between items-end border-b border-rose-500 pb-8">
        <div>
          <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter uppercase">ADMIN_CONTROL_HUB</h2>
          <p className="text-[8px] font-black text-rose-500 tracking-[0.3em] uppercase mt-2">Executive Data Management</p>
        </div>
        <button onClick={onExit} className="text-[8px] font-black text-white bg-rose-600 px-6 py-2 uppercase">Exit Terminal</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-v2 p-6 border-l-2 border-rose-500">
          <div className="text-[7px] font-black text-slate-600 uppercase mb-1">Total Operators</div>
          <div className="text-3xl font-orbitron font-black text-white">{allUsers.length}</div>
        </div>
        <div className="glass-v2 p-6 border-l-2 border-cyan-500">
          <div className="text-[7px] font-black text-slate-600 uppercase mb-1">Global Logs</div>
          <div className="text-3xl font-orbitron font-black text-white">{totalLogs}</div>
        </div>
        <div className="glass-v2 p-6 border-l-2 border-purple-500">
          <div className="text-[7px] font-black text-slate-600 uppercase mb-1">System Load</div>
          <div className="text-3xl font-orbitron font-black text-green-500">OPTIMAL</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 glass-v2 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[8px] font-black text-slate-500 uppercase">
                <th className="p-4">Operator</th>
                <th className="p-4">Records</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[10px] font-bold">
              {allUsers.map(u => (
                <tr key={u.name} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4 text-white font-orbitron">{u.name}</td>
                  <td className="p-4 text-purple-400">{u.records.length} Logs</td>
                  <td className="p-4 text-right">
                    <button onClick={() => wipeUser(u.name)} className="text-rose-500 font-black uppercase text-[7px] hover:underline">Wipe_Data</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass-v2 p-8 border-t-2 border-rose-500 space-y-6">
              <h4 className="text-[9px] font-black text-rose-500 uppercase">System Broadcast</h4>
              <div className="flex gap-2">
                 {['NORMAL', 'ALERT', 'CRITICAL'].map(l => (
                    <button key={l} onClick={() => setMsgLevel(l as any)} className={`flex-1 py-1 text-[7px] font-black border ${msgLevel === l ? 'bg-rose-500 text-black' : 'border-white/10 text-slate-600'}`}>{l}</button>
                 ))}
              </div>
              <textarea 
                value={globalMessage} 
                onChange={e => setGlobalMessage(e.target.value.toUpperCase())}
                className="w-full bg-white/5 border border-white/10 p-3 text-[10px] text-white h-24 uppercase font-bold"
              />
              <button onClick={saveGlobalBroadcast} className="w-full py-3 bg-rose-600 text-white font-black text-[9px] uppercase">Update Feed</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCabinet;
