import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Users, Navigation } from 'lucide-react';

export default function Home() {
  return (
    <div className="text-center mt-8 md:mt-16 max-w-5xl mx-auto px-4 relative z-10">

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 flex w-full h-[150vh]">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-snow backdrop-blur-md"
            style={{
              backgroundColor: i % 2 === 0 ? 'rgba(78, 122, 177, 0.4)' : 'rgba(154, 79, 186, 0.5)',
              width:  Math.random() * 6 + 3 + 'px',
              height: Math.random() * 6 + 3 + 'px',
              top: '-10%',
              left: Math.random() * 100 + '%',
              animationDuration: Math.random() * 8 + 8 + 's',
              animationDelay: '-' + (Math.random() * 15) + 's',
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-wide leading-tight drop-shadow-sm font-display capitalize">
        Next-Gen Crowd Control <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-bwai-purple via-bwai-steel to-bwai-navy dark:from-[#E8A5F4] dark:to-white drop-shadow-sm">
          Intelligence Platform
        </span>
      </h2>

      <p className="mt-6 text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-16 font-bold font-mono drop-shadow-sm">
        A mission-critical system designed to detect early congestion, streamline staff task dispatching, and provide intelligent, calm instructions to attendees during scenarios.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link to="/admin" className="group p-8 rounded-3xl glass-card relative flex flex-col items-center text-center backdrop-blur-3xl border border-white/40 dark:border-white/10">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-bwai-navy to-bwai-steel opacity-80 group-hover:opacity-100 transition-opacity rounded-t-3xl"></div>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20 group-hover:scale-110 transition-transform shadow-inner">
            <ShieldAlert className="text-white" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-bwai-steel transition-colors font-display tracking-wide capitalize">Admin Console</h3>
          <p className="text-slate-400 text-sm font-bold font-mono leading-relaxed">Global overview, manual override controls, and active incident mapping.</p>
        </Link>

        <Link to="/staff" className="group p-8 rounded-3xl glass-card relative flex flex-col items-center text-center backdrop-blur-3xl border border-white/40 dark:border-white/10">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-bwai-steel to-bwai-slate opacity-80 group-hover:opacity-100 transition-opacity rounded-t-3xl"></div>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20 group-hover:scale-110 transition-transform shadow-inner">
            <Users className="text-white" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-bwai-steel transition-colors font-display tracking-wide capitalize">Staff Terminal</h3>
          <p className="text-slate-400 text-sm font-bold font-mono leading-relaxed">Dynamic task dispatching and sector-based operational controls.</p>
        </Link>

        <Link to="/attendee" className="group p-8 rounded-3xl glass-card relative flex flex-col items-center text-center backdrop-blur-3xl border border-white/40 dark:border-white/10">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-bwai-purple to-red-400 opacity-90 group-hover:opacity-100 transition-opacity rounded-t-3xl"></div>
          <div className="w-16 h-16 bg-bwai-purple/20 rounded-2xl flex items-center justify-center mb-6 border border-bwai-purple/30 group-hover:scale-110 transition-transform shadow-inner">
            <Navigation className="text-white" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#E8A5F4] transition-colors font-display tracking-wide capitalize">Attendee App</h3>
          <p className="text-slate-400 text-sm font-bold font-mono leading-relaxed">Mobile-first calm guidance with live push instructions and SOS panic button.</p>
        </Link>
      </div>
    </div>
  );
}