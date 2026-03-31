import React, { useState } from 'react';
import VenueMap from '../components/VenueMap';
import { ShieldAlert, Radio } from 'lucide-react';

export default function AdminDashboard() {
  const [dangerZones, setDangerZones] = useState(['A']);
  const [broadcastTarget, setBroadcastTarget] = useState('All');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
      {/* Sidebar Focus */}
      <div className="col-span-1 flex flex-col gap-6">
        <div className="glass-panel p-6 rounded-3xl">
          <h2 className="text-2xl font-black text-bwai-navy dark:text-white flex items-center gap-2 mb-6 font-display capitalize">
            <ShieldAlert className="text-red-500" /> System Status
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="glass-card p-4 rounded-2xl flex flex-col items-center border-[0.5px] border-red-500/20 bg-red-500/5 dark:bg-red-500/10 hover:shadow-[0_8px_30px_rgba(220,38,38,0.2)]">
              <span className="text-4xl font-black text-red-600 dark:text-red-400 drop-shadow-md">1</span>
              <span className="text-xs font-bold text-red-600/80 dark:text-red-100 uppercase tracking-widest mt-1">Active Alerts</span>
            </div>
            <div className="glass-card p-4 rounded-2xl flex flex-col items-center">
              <span className="text-4xl font-black text-bwai-navy dark:text-white drop-shadow-md">12</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-200 uppercase tracking-widest mt-1 text-center font-mono">Deployed Staff</span>
            </div>
          </div>
        </div>

        {/* Manual Override Form */}
        <div className="glass-panel p-6 rounded-3xl flex-1 flex flex-col">
          <h3 className="font-bold text-lg text-bwai-navy dark:text-white mb-2 flex items-center gap-2 font-display capitalize">
            <Radio className="text-bwai-purple" size={20} /> Public Address System
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-100 mb-6 leading-relaxed font-mono font-bold">Bypass automated logic and force an emergency broadcast push notification.</p>
          
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-100 uppercase tracking-widest mb-2 opacity-90 font-mono">Target Zone</label>
          <select 
            className="w-full bg-white/50 dark:bg-black/40 border border-white/50 dark:border-white/20 rounded-xl p-3 mb-5 focus:outline-none focus:ring-2 focus:ring-bwai-purple text-bwai-navy dark:text-white font-bold shadow-inner font-mono"
            value={broadcastTarget}
            onChange={(e) => setBroadcastTarget(e.target.value)}
          >
            <option>All Zones (Global)</option>
            <option>Zone A (Active Incident)</option>
            <option>Zone B</option>
          </select>

          <label className="block text-xs font-bold text-slate-700 dark:text-slate-100 uppercase tracking-widest mb-2 opacity-90 font-mono">Emergency Message</label>
          <textarea 
            className="w-full bg-white/50 dark:bg-black/40 border border-white/50 dark:border-white/20 rounded-xl p-4 mb-6 focus:outline-none focus:ring-2 focus:ring-bwai-purple h-32 resize-none text-bwai-navy dark:text-white font-bold shadow-inner placeholder-slate-400 dark:placeholder-slate-300 font-mono"
            placeholder="Ensure calm and direct phrasing..."
          ></textarea>

          <button className="w-full mt-auto bg-bwai-purple hover:bg-bwai-purple/90 text-white font-black text-lg py-4 rounded-xl shadow-[0_0_15px_rgba(206,133,212,0.4)] transition-all active:scale-95 border border-white/20 font-mono uppercase tracking-wider">
            Broadcast Now
          </button>
        </div>
      </div>

      {/* Main Map View */}
      <div className="col-span-1 lg:col-span-2 glass-panel rounded-3xl p-6 md:p-8 flex flex-col h-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="font-black text-2xl text-bwai-navy dark:text-white font-display capitalize">Live Venue Details</h3>
          <div className="flex gap-2 w-full sm:w-auto font-mono">
            <button onClick={() => setDangerZones([])} className="flex-1 sm:flex-none text-xs px-4 py-2 bg-green-500/10 dark:bg-green-500/30 text-green-700 dark:text-green-100 border border-green-500/20 dark:border-green-500/40 rounded-lg font-bold hover:bg-green-500/20 transition shadow-sm">Clear Map</button>
            <button onClick={() => setDangerZones(['A'])} className="flex-1 sm:flex-none text-xs px-4 py-2 bg-red-500/10 dark:bg-red-500/30 text-red-700 dark:text-red-100 border border-red-500/20 dark:border-red-500/40 rounded-lg font-bold hover:bg-red-500/20 transition shadow-sm">Simulate Zone A</button>
          </div>
        </div>
        <div className="flex-1 w-full relative min-h-[500px] rounded-2xl overflow-hidden border border-white/50 dark:border-white/10 shadow-inner bg-white/20 dark:bg-black/20">
           <VenueMap dangerZones={dangerZones} safeZones={['B','C','D']} showPaths={true} />
        </div>
      </div>
    </div>
  );
}
