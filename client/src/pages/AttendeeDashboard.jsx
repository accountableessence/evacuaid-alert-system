import React, { useState, useEffect } from 'react';
import VenueMap from '../components/VenueMap';
import SOSButton from '../components/SOSButton';
import { AlertTriangle, Navigation, CheckCircle, ArrowRightCircle } from 'lucide-react';
import { socket } from '../socket';

// FCM token registration helper
// Call this after login — registers device token with backend so push notifications work
async function registerFCMToken(userZone) {
  try {
    // Dynamic import so it only loads when needed
    const { initializeApp, getApps } = await import('firebase/app');
    const { getMessaging, getToken, onMessage } = await import('firebase/messaging');

    const firebaseConfig = {
      // ⚠️  Replace these with your actual Firebase project config values
      apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId:             import.meta.env.VITE_FIREBASE_APP_ID,
    };

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const messaging = getMessaging(app);

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (token) {
      // Send token + zone to backend so it can subscribe to the right FCM topic
      socket.emit('fcm:register', { token, zone: userZone, role: 'attendee' });
    }

    // Handle foreground push messages
    onMessage(messaging, (payload) => {
      console.log('FCM foreground message:', payload);
      // You can show a toast here if needed
    });
  } catch (err) {
    console.warn('FCM registration failed (non-blocking):', err.message);
  }
}

// Hardcoded for now — in production this comes from auth context / user profile
const MY_ZONE = 'A';

export default function AttendeeDashboard() {
  const [activeAlert, setActiveAlert] = useState(null); // null or alert object
  const [dangerZones, setDangerZones] = useState([]);

  useEffect(() => {
    // Register FCM token on mount
    registerFCMToken(MY_ZONE);

    // Listen for incoming alerts — only trigger UI if this zone is affected
    socket.on('admin:trigger_alert', (alert) => {
      const affectsMe = alert.zone === 'ALL' || alert.zone === MY_ZONE;
      if (affectsMe && alert.severity !== 'LOW') {
        setActiveAlert(alert);
        setDangerZones(prev =>
          alert.zone === 'ALL' ? ['A', 'B', 'C', 'D'] : [...new Set([...prev, alert.zone])]
        );
      }
    });

    socket.on('admin:map_update', (data) => {
      setDangerZones(data.dangerZones || []);
      // If my zone just became a danger zone and there's no active alert UI yet, show a generic one
      if ((data.dangerZones || []).includes(MY_ZONE) && !activeAlert) {
        setActiveAlert({
          type: 'CROWD_DENSITY',
          zone: MY_ZONE,
          severity: 'HIGH',
          message: 'Your zone has been flagged. Please follow staff instructions and move towards the nearest safe exit.',
        });
      }
    });

    return () => {
      socket.off('admin:trigger_alert');
      socket.off('admin:map_update');
    };
  }, [activeAlert]);

  const handleSOS = () => {
    socket.emit('incident:report', {
      type: 'EMERGENCY',
      zone: MY_ZONE,
      from: 'attendee',
      timestamp: new Date().toISOString(),
    });
    // Show a holding state while waiting for admin/staff response
    setActiveAlert({
      type: 'SOS',
      zone: MY_ZONE,
      severity: 'CRITICAL',
      message: 'Help is on the way. Stay where you are and remain calm. A staff member will reach you shortly.',
    });
  };

  const handleSafe = () => {
    setActiveAlert(null);
    setDangerZones([]);
    socket.emit('incident:report', {
      type: 'ALL_CLEAR',
      zone: MY_ZONE,
      from: 'attendee',
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="max-w-md mx-auto relative min-h-[85vh] flex flex-col mt-4 z-10">

      {activeAlert ? (
        <div className="glass-panel !bg-red-600/90 text-white p-8 rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom flex-1 flex flex-col justify-center items-center text-center border-2 border-red-300/50 backdrop-blur-3xl">
          <div className="bg-white/30 p-5 rounded-full mb-8 shadow-inner border border-white/40">
            <AlertTriangle size={80} className="animate-pulse text-white" strokeWidth={2.5} />
          </div>

          <h2 className="text-5xl font-black mb-4 tracking-tight drop-shadow-md font-display uppercase text-white">STAY CALM</h2>

          {/* Alert type badge */}
          <span className="text-xs font-black font-mono px-4 py-1.5 rounded-full bg-white/20 border border-white/30 uppercase tracking-widest mb-6">
            {activeAlert.type?.replace('_', ' ')} · Zone {activeAlert.zone === 'ALL' ? 'All' : activeAlert.zone}
          </span>

          <div className="bg-black/40 p-8 rounded-3xl mb-10 shadow-inner border border-white/20 w-full">
            <p className="text-lg font-bold leading-relaxed font-mono text-white opacity-90">
              {activeAlert.message}
            </p>
            {activeAlert.type !== 'SOS' && (
              <div className="my-4 py-4 border-y border-white/30">
                <strong className="font-black text-3xl block text-[#F6D5FF] font-display uppercase tracking-widest flex items-center justify-center gap-2">
                  MAIN EXIT <ArrowRightCircle size={28} />
                </strong>
                <p className="text-sm font-mono text-white/80 mt-2">Zone D — follow the green path on your map</p>
              </div>
            )}
          </div>

          <button
            onClick={handleSafe}
            className="px-8 py-5 bg-white text-red-800 hover:bg-slate-100 rounded-2xl transition w-full font-black text-xl shadow-2xl uppercase tracking-widest active:scale-95 border border-white font-mono"
          >
            I am out of danger
          </button>
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-[2.5rem] shadow-2xl flex-1 flex flex-col relative z-10 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-bwai-purple rounded-full opacity-20 filter blur-3xl mix-blend-screen pointer-events-none"></div>

          <div className="mb-8 flex justify-between items-center relative z-10">
            <div>
              <h2 className="text-3xl font-black text-white tracking-widest font-display capitalize">Your Location</h2>
              <p className="text-bwai-purple flex items-center gap-1.5 font-bold uppercase tracking-widest text-sm mt-1 font-mono">
                <Navigation size={16} /> Zone {MY_ZONE}
              </p>
            </div>
            <div className="glass-card bg-bwai-navy/80 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-white/30 uppercase font-mono tracking-widest">
              General
            </div>
          </div>

          <div className="glass-card bg-green-500/10 text-green-300 p-6 rounded-[2rem] mb-10 border border-green-500/40 shadow-inner relative overflow-hidden group hover:bg-green-500/20 transition-colors">
            <div className="absolute -top-4 -right-4 p-2 opacity-15 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
              <CheckCircle size={100} />
            </div>
            <h3 className="font-bold flex items-center gap-2 mb-2 text-2xl tracking-wide font-display capitalize">
              <CheckCircle className="text-green-400" size={26} strokeWidth={3} /> Status Normal
            </h3>
            <p className="font-bold opacity-90 leading-relaxed text-sm font-mono tracking-tight text-green-200">
              Enjoy the event! You are currently in a safe zone.
            </p>
          </div>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10 font-mono">
            Live Blueprint <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,1)] border border-green-200"></span>
          </p>
          <div className="flex-1 min-h-[400px] mb-28 rounded-3xl overflow-hidden relative shadow-inner border-4 border-white/20 z-10 bg-black/30 backdrop-blur-sm">
            <VenueMap
              dangerZones={dangerZones}
              safeZones={['A', 'B', 'C', 'D'].filter(z => !dangerZones.includes(z))}
              showPaths={dangerZones.includes(MY_ZONE)}
            />
          </div>
        </div>
      )}

      {!activeAlert && <SOSButton onTrigger={handleSOS} />}
    </div>
  );
}
