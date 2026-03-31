import React, { useState } from 'react';
import VenueMap from '../components/VenueMap';
import SOSButton from '../components/SOSButton';
import { AlertTriangle, Navigation, CheckCircle, ArrowRightCircle } from 'lucide-react';

export default function AttendeeDashboard() {
  const [activeAlert, setActiveAlert] = useState(false);

  const handleSOS = () => {
    setActiveAlert(true);
  };

  return (
    <div className="max-w-md mx-auto relative min-h-[85vh] flex flex-col mt-4 z-10">
      
      {activeAlert ? (
        <div className="glass-panel !bg-red-600/90 dark:!bg-red-900/90 text-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(220,38,38,0.7)] animate-in slide-in-from-bottom flex-1 flex flex-col justify-center items-center text-center border-2 border-red-300/50 backdrop-blur-3xl">
            <div className="bg-white/30 p-5 rounded-full mb-8 shadow-inner border border-white/40">
               <AlertTriangle size={80} className="animate-pulse drop-shadow-lg text-white" strokeWidth={2.5}/>
            </div>
            <h2 className="text-5xl font-black mb-4 tracking-tight drop-shadow-md font-display uppercase text-white">STAY CALM</h2>
            <div className="glass-card bg-black/40 p-8 rounded-3xl mb-12 shadow-inner border-white/20 w-full text-white">
               <p className="text-xl font-bold leading-relaxed opacity-100 font-mono text-white">Please proceed immediately to the</p>
               <div className="my-4 py-4 border-y border-white/30">
                 <strong className="font-black text-3xl block text-[#F6D5FF] drop-shadow-[0_0_15px_rgba(246,213,255,0.8)] font-display uppercase tracking-widest flex items-center justify-center gap-2">
                   MAIN EXIT <ArrowRightCircle size={28}/>
                 </strong>
               </div>
               <p className="text-lg font-bold opacity-100 font-mono text-white">(Zone D). Follow the green path on your map.</p>
            </div>
            <button onClick={() => setActiveAlert(false)} className="px-8 py-5 bg-white text-red-800 hover:bg-slate-100 rounded-2xl transition w-full font-black text-xl shadow-2xl uppercase tracking-widest active:scale-95 border border-white font-mono">
              I am out of danger
            </button>
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-[2.5rem] shadow-2xl flex-1 flex flex-col relative z-10 overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-bwai-purple rounded-full opacity-20 filter blur-3xl mix-blend-screen pointer-events-none"></div>

          <div className="mb-8 flex justify-between items-center relative z-10">
            <div>
               <h2 className="text-3xl font-black text-bwai-navy dark:text-white tracking-widest font-display capitalize">Your Location</h2>
               <p className="text-bwai-purple dark:text-[#E8A5F4] flex items-center gap-1.5 font-bold uppercase tracking-widest text-sm mt-1 font-mono"><Navigation size={16}/> Zone A</p>
            </div>
            <div className="glass-card bg-bwai-navy/80 dark:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-white/30 uppercase font-mono tracking-widest">
               General
            </div>
          </div>
          
          <div className="glass-card bg-green-500/10 dark:bg-green-500/30 text-green-800 dark:text-green-100 p-6 rounded-[2rem] mb-10 border border-green-500/40 shadow-inner relative overflow-hidden group hover:bg-green-500/20 transition-colors">
            <div className="absolute -top-4 -right-4 p-2 opacity-15 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
               <CheckCircle size={100} />
            </div>
            <h3 className="font-bold flex items-center gap-2 mb-2 text-2xl tracking-wide font-display capitalize"><CheckCircle className="text-green-600 dark:text-green-300" size={26} strokeWidth={3}/> Status Normal</h3>
            <p className="font-bold opacity-90 leading-relaxed text-sm font-mono tracking-tight">Enjoy the event! You are currently located in a designated safe zone.</p>
          </div>

          <p className="text-xs font-bold text-slate-700 dark:text-slate-100 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10 font-mono">
             Live Blueprint <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,1)] border border-green-200"></span>
          </p>
          <div className="flex-1 min-h-[400px] mb-28 rounded-3xl overflow-hidden relative shadow-inner border-4 border-white/60 dark:border-white/20 z-10 bg-white/30 dark:bg-black/30 backdrop-blur-sm">
            <VenueMap dangerZones={[]} safeZones={['A','B','C','D']} showPaths={false} />
          </div>
        </div>
      )}

      {!activeAlert && <SOSButton onTrigger={handleSOS} />}
    </div>
  );
}
