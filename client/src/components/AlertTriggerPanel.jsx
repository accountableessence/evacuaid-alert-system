import React, { useState } from 'react';
import { ShieldAlert, Zap, Users, Flame, Wind, Lock } from 'lucide-react';
import { socket } from '../socket';

const ALERT_TYPES = [
  { id: 'CROWD_DENSITY',  label: 'Crowd Density',   icon: Users,      color: 'text-orange-400', border: 'border-orange-500/40', bg: 'bg-orange-500/10' },
  { id: 'EMERGENCY',      label: 'Emergency',        icon: ShieldAlert, color: 'text-red-400',    border: 'border-red-500/40',    bg: 'bg-red-500/10'    },
  { id: 'FIRE',           label: 'Fire',             icon: Flame,      color: 'text-rose-400',   border: 'border-rose-500/40',   bg: 'bg-rose-500/10'   },
  { id: 'SECURITY',       label: 'Security Threat',  icon: Lock,       color: 'text-yellow-400', border: 'border-yellow-500/40', bg: 'bg-yellow-500/10' },
  { id: 'ZONE_BREACH',    label: 'Zone Breach',      icon: Wind,       color: 'text-purple-400', border: 'border-purple-500/40', bg: 'bg-purple-500/10' },
];

const ZONES = ['All Zones', 'Zone A', 'Zone B', 'Zone C', 'Zone D'];

const SEVERITY = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const SEVERITY_STYLES = {
  LOW:      'bg-green-500/20  text-green-300  border-green-500/40',
  MEDIUM:   'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  HIGH:     'bg-orange-500/20 text-orange-300 border-orange-500/40',
  CRITICAL: 'bg-red-500/20    text-red-300    border-red-500/40',
};

export default function AlertTriggerPanel() {
  const [alertType, setAlertType]   = useState('EMERGENCY');
  const [zone, setZone]             = useState('All Zones');
  const [severity, setSeverity]     = useState('HIGH');
  const [message, setMessage]       = useState('');
  const [firing, setFiring]         = useState(false);
  const [lastFired, setLastFired]   = useState(null);

  const handleFire = () => {
    if (!message.trim()) return;

    const payload = {
      id:        `alert_${Date.now()}`,
      type:      alertType,
      zone:      zone === 'All Zones' ? 'ALL' : zone.replace('Zone ', ''),
      severity,
      message:   message.trim(),
      timestamp: new Date().toISOString(),
      source:    'ADMIN_MANUAL',
    };

    setFiring(true);

    // Emit to backend — triggers attendee push + staff dispatch
    socket.emit('admin:trigger_alert', payload);

    // Also update the map danger zones
    if (zone !== 'All Zones') {
      socket.emit('admin:update_map', {
        dangerZones: [zone.replace('Zone ', '')],
      });
    }

    setLastFired(payload);
    setMessage('');
    setTimeout(() => setFiring(false), 1500);
  };

  const selectedType = ALERT_TYPES.find(t => t.id === alertType);

  return (
    <div className="glass-panel p-6 rounded-3xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-bwai-purple/20 rounded-xl border border-bwai-purple/30">
          <Zap className="text-bwai-purple" size={22} />
        </div>
        <div>
          <h3 className="font-black text-white font-display capitalize text-lg">Alert Trigger Panel</h3>
          <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">Manual Admin Override</p>
        </div>
      </div>

      {/* Alert Type Selector */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 font-mono">
          Incident Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ALERT_TYPES.map(({ id, label, icon: Icon, color, border, bg }) => (
            <button
              key={id}
              onClick={() => setAlertType(id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border font-mono text-xs font-bold transition-all ${
                alertType === id
                  ? `${bg} ${border} ${color} scale-[1.03] shadow-md`
                  : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Zone + Severity Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">
            Target Zone
          </label>
          <select
            value={zone}
            onChange={e => setZone(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white font-bold font-mono text-sm focus:outline-none focus:ring-2 focus:ring-bwai-purple/50 shadow-inner"
          >
            {ZONES.map(z => <option key={z}>{z}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">
            Severity
          </label>
          <div className="flex flex-col gap-1.5">
            {SEVERITY.map(s => (
              <button
                key={s}
                onClick={() => setSeverity(s)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-black font-mono tracking-widest transition-all ${
                  severity === s ? SEVERITY_STYLES[s] + ' scale-[1.02]' : 'border-white/10 text-slate-500 hover:text-slate-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">
          Alert Message <span className="text-slate-600">(sent to attendees & staff)</span>
        </label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={3}
          placeholder="Use calm, direct phrasing. E.g: Please move towards Zone D exit calmly..."
          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-bold font-mono text-sm focus:outline-none focus:ring-2 focus:ring-bwai-purple/50 resize-none placeholder-slate-600 shadow-inner"
        />
        <p className="text-right text-xs text-slate-600 font-mono mt-1">{message.length}/280</p>
      </div>

      {/* Fire Button */}
      <button
        onClick={handleFire}
        disabled={!message.trim() || firing}
        className={`w-full py-4 rounded-xl font-black font-mono uppercase tracking-widest text-sm transition-all border flex items-center justify-center gap-2 ${
          firing
            ? 'bg-green-600/80 border-green-400/40 text-white scale-95'
            : !message.trim()
            ? 'bg-white/5 border-white/10 text-slate-600 cursor-not-allowed'
            : `${selectedType?.bg} ${selectedType?.border} ${selectedType?.color} hover:scale-[1.02] shadow-lg active:scale-95`
        }`}
      >
        {firing ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            Broadcasting...
          </>
        ) : (
          <>
            <Zap size={16} />
            Fire Alert — {zone}
          </>
        )}
      </button>

      {/* Last Fired Confirmation */}
      {lastFired && (
        <div className="glass-card bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-xs font-mono">
          <p className="text-green-400 font-black uppercase tracking-widest mb-1">Last Broadcast</p>
          <p className="text-slate-300">
            <span className="text-green-300">[{lastFired.severity}]</span>{' '}
            <span className="text-bwai-purple">{lastFired.type}</span> →{' '}
            <span className="text-white">{lastFired.zone === 'ALL' ? 'All Zones' : `Zone ${lastFired.zone}`}</span>
          </p>
          <p className="text-slate-500 mt-1">{new Date(lastFired.timestamp).toLocaleTimeString()}</p>
        </div>
      )}
    </div>
  );
}