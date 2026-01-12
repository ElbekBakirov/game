
import React from 'react';
import { ArchiveRecord } from '../types';

interface Props {
  records: ArchiveRecord[];
  onSelect: (record: ArchiveRecord) => void;
  onClear: () => void;
}

const HistoryArchive: React.FC<Props> = ({ records, onSelect, onClear }) => {
  if (records.length === 0) {
    return (
      <div className="py-32 text-center animate-fade-in">
        <div className="text-4xl font-orbitron font-black text-slate-800 italic mb-4">ARCHIVE_EMPTY</div>
        <p className="text-[9px] font-black text-slate-600 tracking-widest uppercase">No neural logs detected in this sector.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-24">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-orbitron font-black text-white italic tracking-tighter">NEURAL_LOGS</h2>
          <p className="text-[8px] font-black text-purple-500 tracking-[0.3em] uppercase mt-2">Historical synchronization records</p>
        </div>
        <button 
          onClick={onClear}
          className="text-[8px] font-black text-rose-500 border border-rose-500/20 px-4 py-2 hover:bg-rose-500 hover:text-white transition-all uppercase tracking-widest"
        >
          Wipe Logs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((record) => (
          <div 
            key={record.id}
            onClick={() => onSelect(record)}
            className="glass-v2 p-6 border-l-2 border-white/5 hover:border-purple-500 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-[7px] text-slate-500 font-black mb-1">RECORD_ID</div>
                <div className="text-[10px] font-black text-white tracking-widest">{record.id.slice(0, 8)}</div>
              </div>
              <div className="text-right">
                <div className="text-[7px] text-slate-500 font-black mb-1">ACCURACY</div>
                <div className="text-[10px] font-black text-cyan-500">{record.result.accuracyScore.toFixed(1)}%</div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-300 uppercase truncate">{record.config.deviceBrand} {record.config.deviceModel}</h4>
              <div className="text-[7px] text-purple-500 font-black tracking-widest mt-1">
                {new Date(record.timestamp).toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-4 border-t border-white/5">
              <div className="text-center">
                <div className="text-[6px] text-slate-600 font-black uppercase">GEN</div>
                <div className="text-xs font-black text-white">{record.result.settings.general}</div>
              </div>
              <div className="text-center">
                <div className="text-[6px] text-slate-600 font-black uppercase">RED</div>
                <div className="text-xs font-black text-white">{record.result.settings.redDot}</div>
              </div>
              <div className="text-center">
                <div className="text-[6px] text-slate-600 font-black uppercase">BTN</div>
                <div className="text-xs font-black text-white">{record.result.settings.fireButtonSize}%</div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryArchive;
