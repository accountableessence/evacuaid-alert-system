import React, { useState, useEffect } from 'react';
import VenueMap from '../components/VenueMap';
import { CheckCircle, AlertTriangle, MapPin, Shield, Plus, X } from 'lucide-react';
import { socket } from '../socket';

const INCIDENT_TYPES = ['CONGESTION', 'MEDICAL', 'FIRE', 'FIGHT', 'SECURITY'];
const ZONES = ['A', 'B', 'C', 'D'];

export default function StaffDashboard() {
  const [tasks, setTasks]               = useState([]);
  const [dangerZones, setDangerZones]   = useState([]);
  const [showReport, setShowReport]     = useState(false);
  const [incidentType, setIncidentType] = useState('CONGESTION');
  const [incidentZone, setIncidentZone] = useState('A');
  const [incidentNote, setIncidentNote] = useState('');
  const [submitting, setSubmitting]     = useState(false);
  const [submitted, setSubmitted]       = useState(false);

  useEffect(() => {
    socket.on('staff:dispatch', (newTask) => {
      setTasks(prev => [newTask, ...prev]);
    });
    socket.on('admin:map_update', (data) => setDangerZones(data.dangerZones || []));
    socket.on('admin:trigger_alert', (data) => {
      if (data.zone === 'ALL' || ZONES.includes(data.zone)) {
        setDangerZones(prev =>
          data.zone === 'ALL' ? ZONES : [...new Set([...prev, data.zone])]
        );
      }
    });

    return () => {
      socket.off('staff:dispatch');
      socket.off('admin:map_update');
      socket.off('admin:trigger_alert');
    };
  }, []);

  const updateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    socket.emit('task:update', { id, status: newStatus });
  };

  const handleReportSubmit = () => {
    if (submitting) return;
    setSubmitting(true);

    socket.emit('incident:report', {
      type: incidentType,
      zone: incidentZone,
      note: incidentNote.trim(),
      from: 'staff',
      timestamp: new Date().toISOString(),
    });

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setIncidentNote('');
      setTimeout(() => {
        setSubmitted(false);
        setShowReport(false);
      }, 1800);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in relative z-10">
      <div className="glass-panel rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/20 pb-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="bg-gradient-to-br from-bwai-purple to-bwai-navy border border-white/20 text-white p-4 rounded-2xl shadow-lg">
              <Shield size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-sm font-display capitalize">Staff Perimeter: Alpha 1</h2>
              <p className="text-bwai-purple dark:text-[#E8A5F4] text-sm font-black uppercase tracking-widest mt-1 font-mono">Monitoring Zones A & C</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-card bg-green-500/10 text-green-300 font-black px-6 py-3 rounded-full border border-green-500/30 shadow-inner flex items-center gap-2 font-mono text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Deployed
            </div>
            {/* Report Incident Button */}
            <button
              onClick={() => setShowReport(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 font-black font-mono text-sm uppercase tracking-widest hover:bg-orange-500/30 transition-all active:scale-95"
            >
              <Plus size={16} /> Report Incident
            </button>
          </div>
        </div>

        {/* Report Incident Modal */}
        {showReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass-panel rounded-3xl p-6 w-full max-w-md border border-white/20 shadow-2xl animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-white font-display capitalize text-xl flex items-center gap-2">
                  <AlertTriangle className="text-orange-400" size={22} /> Report Incident
                </h3>
                <button onClick={() => setShowReport(false)} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition">
                  <X size={18} />
                </button>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <CheckCircle size={48} className="text-green-400" />
                  <p className="text-green-300 font-black font-mono uppercase tracking-widest">Incident Reported!</p>
                  <p className="text-slate-400 font-mono text-sm">Admin has been notified.</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Incident Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {INCIDENT_TYPES.map(t => (
                        <button
                          key={t}
                          onClick={() => setIncidentType(t)}
                          className={`py-2 px-3 rounded-xl border text-xs font-black font-mono uppercase tracking-widest transition-all ${
                            incidentType === t
                              ? 'bg-orange-500/20 border-orange-500/50 text-orange-300 scale-[1.03]'
                              : 'border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Zone</label>
                    <div className="flex gap-2">
                      {ZONES.map(z => (
                        <button
                          key={z}
                          onClick={() => setIncidentZone(z)}
                          className={`flex-1 py-3 rounded-xl border font-black font-mono text-sm uppercase tracking-widest transition-all ${
                            incidentZone === z
                              ? 'bg-bwai-purple/30 border-bwai-purple/60 text-white scale-[1.03]'
                              : 'border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                          }`}
                        >
                          {z}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Additional Notes <span className="text-slate-600 normal-case">(optional)</span></label>
                    <textarea
                      value={incidentNote}
                      onChange={e => setIncidentNote(e.target.value)}
                      rows={3}
                      placeholder="Describe what you're seeing..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white font-bold font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 resize-none placeholder-slate-600 shadow-inner"
                    />
                  </div>

                  <button
                    onClick={handleReportSubmit}
                    disabled={submitting}
                    className="w-full py-4 rounded-xl font-black font-mono uppercase tracking-widest text-sm bg-orange-500/20 border border-orange-500/40 text-orange-300 hover:bg-orange-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <><div className="w-4 h-4 rounded-full border-2 border-orange-300/40 border-t-orange-300 animate-spin" /> Reporting...</>
                    ) : (
                      <><AlertTriangle size={16} /> Submit Report</>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Task List */}
          <div className="lg:col-span-7">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 font-display capitalize">
              <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/30">
                <AlertTriangle className="text-orange-400" size={24} />
              </div>
              Active Dispatch Commands
            </h3>

            {tasks.length === 0 ? (
              <div className="glass-card rounded-2xl p-10 text-center text-slate-500 italic font-bold font-mono">
                No current tasks. Maintain patrol pattern.
              </div>
            ) : (
              <div className="space-y-5">
                {tasks.map(task => (
                  <div key={task.id} className={`p-6 rounded-2xl border-l-[6px] shadow-lg transition-all backdrop-blur-md ${task.status === 'COMPLETED' ? 'border-l-green-500 bg-green-900/20' : 'border-l-bwai-purple bg-white/10 border border-white/20'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-black text-lg text-white flex items-center gap-3 tracking-tight font-display uppercase">
                        <span className={`w-3 h-3 rounded-full shadow-md ${task.status === 'COMPLETED' ? 'bg-green-500' : 'bg-bwai-purple animate-pulse'}`}></span>
                        {task.type} | Sector {task.zone}
                      </span>
                      <span className={`text-xs font-black px-4 py-1.5 rounded-lg shadow-inner uppercase tracking-widest font-mono ${task.status === 'COMPLETED' ? 'text-green-300 bg-green-500/20 border border-green-500/30' : task.status === 'IN_PROGRESS' ? 'text-orange-300 bg-orange-500/20 border border-orange-500/30' : 'text-white bg-bwai-purple/20 border border-bwai-purple/40'}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-base text-slate-200 mb-6 leading-relaxed bg-black/30 border border-white/10 p-4 rounded-xl font-bold font-mono shadow-inner">{task.instructions}</p>

                    {task.status !== 'COMPLETED' && (
                      <div className="flex gap-3 font-mono">
                        {task.status === 'ASSIGNED' && (
                          <button onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')} className="bg-bwai-purple hover:bg-bwai-purple/90 border border-white/20 text-white text-sm font-black py-3 px-8 rounded-xl shadow-lg transition-all active:scale-95 w-full sm:w-auto uppercase tracking-wide">Acknowledge</button>
                        )}
                        {task.status === 'IN_PROGRESS' && (
                          <button onClick={() => updateTaskStatus(task.id, 'COMPLETED')} className="bg-green-600/90 hover:bg-green-600 border border-green-400 text-white text-sm font-black py-3 px-8 rounded-xl shadow-lg transition-all active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2 uppercase tracking-wide">
                            <CheckCircle size={18} strokeWidth={3} /> Resolve Task
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-5 glass-card p-6 rounded-3xl flex flex-col h-full bg-white/5 border-white/10">
            <h3 className="font-black text-white mb-6 uppercase tracking-widest text-sm flex items-center gap-2 font-mono">
              <MapPin size={18} className="text-bwai-purple" /> Live Sector Map
            </h3>
            <div className="flex-1 bg-black/40 rounded-2xl shadow-inner border border-white/10 overflow-hidden min-h-[400px]">
              <VenueMap
                dangerZones={dangerZones}
                safeZones={['A', 'B', 'C', 'D'].filter(z => !dangerZones.includes(z))}
                showPaths={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

