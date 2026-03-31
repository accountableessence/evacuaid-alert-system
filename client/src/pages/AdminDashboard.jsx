import React, { useState, useEffect } from 'react';
import VenueMap from '../components/VenueMap';
import AlertTriggerPanel from '../components/AlertTriggerPanel';
import AlertHistory from '../components/AlertHistory';
import { ShieldAlert, Radio } from 'lucide-react';
import { socket } from '../socket';

export default function AdminDashboard() {
  const [dangerZones, setDangerZones]       = useState([]);
  const [broadcastTarget, setBroadcastTarget] = useState('All');
  const [broadcastMsg, setBroadcastMsg]     = useState('');
  const [activeAlertCount, setActiveAlertCount] = useState(0);
  const [staffCount] = useState(12);

  useEffect(() => {
    // Map updates from backend or from AlertTriggerPanel via admin:update_map
    socket.on('admin:map_update', (data) => setDangerZones(data.dangerZones || []));
    socket.on('admin:update_map',  (data) => setDangerZones(data.dangerZones || []));

    // Keep active alert count in sync
    socket.on('admin:trigger_alert', () => setActiveAlertCount(c => c + 1));
    socket.on('incident:report',     () => setActiveAlertCount(c => c + 1));
    socket.on('task:update', ({ status }) => {
      if (status === 'COMPLETED') setActiveAlertCount(c => Math.max(0, c - 1));
    });

    return () => {
      socket.off('admin:map_update');
      socket.off('admin:update_map');
      socket.off('admin:trigger_alert');
      socket.off('incident:report');
      socket.off('task:update');
    };
  }, []);

  const handleManualBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    socket.emit('admin:trigger_alert', {
      id:        `broadcast_${Date.now()}`,
      type:      'EMERGENCY',
      zone:      broadcastTarget === 'All Zones (Global)' ? 'ALL' : broadcastTarget.charAt(broadcastTarget.length - 2),
      severity:  'HIGH',
      message:   broadcastMsg.trim(),
      timestamp: new Date().toISOString(),
      source:    'ADMIN_BROADCAST',
    });
    setBroadcastMsg('');
  };

  return (
    <div className="flex flex-col gap-6 relative z-10">

      {/* ── Row 1: Status + Map ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sidebar */}
        <div className="col-span-1 flex flex-col gap-6">

          {/* System Status */}
          <div className="glass-panel p-6 rounded-3xl">
            <h2 className="text-2xl font-black text-white flex items-center gap-2 mb-6 font-display capitalize">
              <ShieldAlert className="text-red-500" /> System Status
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div className="glass-card p-4 rounded-2xl flex flex-col items-center border-[0.5px] border-red-500/20 bg-red-500/5 hover:shadow-[0_8px_30px_rgba(220,38,38,0.2)]">
                <span className="text-4xl font-black text-red-400 drop-shadow-md">{activeAlertCount}</span>
                <span className="text-xs font-bold text-red-300 uppercase tracking-widest mt-1 font-mono">Active Alerts</span>
              </div>
              <div className="glass-card p-4 rounded-2xl flex flex-col items-center">
                <span className="text-4xl font-black text-white drop-shadow-md">{staffCount}</span>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-1 text-center font-mono">Deployed Staff</span>
              </div>
            </div>
          </div>

          {/* Quick Public Address (existing feature kept) */}
          <div className="glass-panel p-6 rounded-3xl flex-1 flex flex-col">
            <h3 className="font-bold text-lg text-white mb-2 flex items-center gap-2 font-display capitalize">
              <Radio className="text-bwai-purple" size={20} /> Public Address
            </h3>
            <p className="text-sm text-slate-400 mb-4 font-mono font-bold">Force a quick push to all or one zone.</p>

            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Target Zone</label>
            <select
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-bwai-purple text-white font-bold shadow-inner font-mono"
              value={broadcastTarget}
              onChange={e => setBroadcastTarget(e.target.value)}
            >
              <option>All Zones (Global)</option>
              <option>Zone A (Active Incident)</option>
              <option>Zone B</option>
              <option>Zone C</option>
              <option>Zone D</option>
            </select>

            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Emergency Message</label>
            <textarea
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-bwai-purple h-28 resize-none text-white font-bold shadow-inner placeholder-slate-600 font-mono"
              placeholder="Ensure calm and direct phrasing..."
              value={broadcastMsg}
              onChange={e => setBroadcastMsg(e.target.value)}
            />
            <button
              onClick={handleManualBroadcast}
              className="w-full mt-auto bg-bwai-purple hover:bg-bwai-purple/90 text-white font-black text-sm py-4 rounded-xl shadow-[0_0_15px_rgba(206,133,212,0.4)] transition-all active:scale-95 border border-white/20 font-mono uppercase tracking-wider"
            >
              Broadcast Now
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="col-span-1 lg:col-span-2 glass-panel rounded-3xl p-6 md:p-8 flex flex-col h-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="font-black text-2xl text-white font-display capitalize">Live Venue Map</h3>
            <div className="flex gap-2 w-full sm:w-auto font-mono">
              <button
                onClick={() => setDangerZones([])}
                className="flex-1 sm:flex-none text-xs px-4 py-2 bg-green-500/10 text-green-300 border border-green-500/20 rounded-lg font-bold hover:bg-green-500/20 transition"
              >
                Clear Map
              </button>
              <button
                onClick={() => setDangerZones(['A'])}
                className="flex-1 sm:flex-none text-xs px-4 py-2 bg-red-500/10 text-red-300 border border-red-500/20 rounded-lg font-bold hover:bg-red-500/20 transition"
              >
                Simulate Zone A
              </button>
            </div>
          </div>
          <div className="flex-1 w-full relative min-h-[500px] rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-black/20">
            <VenueMap
              dangerZones={dangerZones}
              safeZones={['A', 'B', 'C', 'D'].filter(z => !dangerZones.includes(z))}
              showPaths={dangerZones.length > 0}
            />
          </div>
        </div>
      </div>

      {/* ── Row 2: Alert Trigger + Incident Log ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertTriggerPanel />
        <AlertHistory />
      </div>

    </div>
  );
}