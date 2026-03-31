import React, { useState } from 'react';
import VenueMap from '../components/VenueMap';
import { CheckCircle, AlertTriangle, MapPin, Shield } from 'lucide-react';

export default function StaffDashboard() {
  const [tasks, setTasks] = useState([
    { id: 1, type: 'Congestion', zone: 'A', instructions: 'Move quickly to the east perimeter of Zone A and physically guide attendees towards Zone D.', status: 'ASSIGNED' },
  ]);

  const updateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in relative z-10">
      <div className="glass-panel rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-300 dark:border-white/20 pb-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="bg-gradient-to-br from-bwai-purple to-bwai-navy border border-white/20 text-white p-4 rounded-2xl shadow-lg">
              <Shield size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-bwai-navy dark:text-white tracking-tight drop-shadow-sm font-display capitalize">Staff Perimeter: Alpha 1</h2>
              <p className="text-bwai-purple dark:text-[#E8A5F4] text-sm font-black uppercase tracking-widest mt-1 font-mono">Monitoring Zones A & C</p>
            </div>
          </div>
          <div className="glass-card bg-green-500/10 text-green-800 dark:text-green-100 font-black px-6 py-3 rounded-full border border-green-500/30 dark:border-green-400/30 shadow-inner flex items-center gap-2 font-mono text-sm max-h-[50px]">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Deployed
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <h3 className="text-xl font-black text-bwai-navy dark:text-white mb-6 flex items-center gap-3 font-display capitalize">
              <div className="p-2 bg-orange-500/10 dark:bg-orange-500/30 rounded-lg border border-orange-500/30">
                 <AlertTriangle className="text-orange-600 dark:text-orange-200" size={24} /> 
              </div>
              Active Dispatch Commands
            </h3>
            
            {tasks.length === 0 ? (
              <div className="glass-card rounded-2xl p-10 text-center text-slate-500 dark:text-white italic font-bold font-mono">
                No current tasks. Maintain patrol pattern.
              </div>
            ) : (
              <div className="space-y-5">
                {tasks.map(task => (
                  <div key={task.id} className={`p-6 rounded-2xl border-l-[6px] shadow-lg transition-all backdrop-blur-md ${task.status === 'COMPLETED' ? 'border-l-green-500 bg-green-50/40 dark:bg-green-900/30' : 'border-l-bwai-purple bg-white/60 dark:bg-white/10 border border-white/50 dark:border-white/20'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-black text-lg text-bwai-navy dark:text-white flex items-center gap-3 tracking-tight font-display uppercase">
                          <span className={`w-3 h-3 rounded-full shadow-md ${task.status === 'COMPLETED' ? 'bg-green-500' : 'bg-bwai-purple animate-pulse'}`}></span>
                          {task.type} | Sector {task.zone}
                      </span>
                      <span className={`text-xs font-black px-4 py-1.5 rounded-lg shadow-inner uppercase tracking-widest font-mono ${task.status === 'COMPLETED' ? 'text-green-900 dark:text-green-100 bg-green-500/30 border border-green-500/40' : task.status === 'IN_PROGRESS' ? 'text-orange-900 dark:text-orange-100 bg-orange-500/30 border border-orange-500/40' : 'text-bwai-navy dark:text-white bg-bwai-purple/20 border border-bwai-purple/40'}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-base text-slate-700 dark:text-white mb-6 leading-relaxed glass-card bg-white/40 dark:bg-black/40 border border-white/40 dark:border-white/10 p-4 rounded-xl font-bold font-mono shadow-inner">{task.instructions}</p>
                    
                    {task.status !== 'COMPLETED' && (
                      <div className="flex gap-3 font-mono">
                        {task.status === 'ASSIGNED' && (
                           <button onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')} className="bg-bwai-purple hover:bg-bwai-purple/90 border border-white/20 text-white text-sm font-black py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(154,79,186,0.6)] transition-all active:scale-95 w-full sm:w-auto uppercase tracking-wide">Acknowledge</button>
                        )}
                        {task.status === 'IN_PROGRESS' && (
                           <button onClick={() => updateTaskStatus(task.id, 'COMPLETED')} className="bg-green-600/90 hover:bg-green-600 backdrop-blur-md border border-green-400 text-white text-sm font-black py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.6)] transition-all active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2 uppercase tracking-wide">
                             <CheckCircle size={18} strokeWidth={3}/> Resolve Task
                           </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 glass-card p-6 rounded-3xl flex flex-col h-full bg-white/40 dark:bg-white/5 items-stretch border-white/60 dark:border-white/10">
             <h3 className="font-black text-bwai-navy dark:text-white mb-6 uppercase tracking-widest text-sm flex items-center gap-2 font-mono">
                <MapPin size={18} className="text-bwai-purple"/> Live Sector Map
             </h3>
             <div className="flex-1 bg-white/50 dark:bg-black/40 rounded-2xl shadow-inner border border-white/50 dark:border-white/10 overflow-hidden min-h-[400px]">
                <VenueMap dangerZones={['A']} safeZones={['B','C','D']} showPaths={false} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
