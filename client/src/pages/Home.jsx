import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Users, Navigation } from 'lucide-react';

export default function Home() {
  return (
    <div className="text-center mt-8 md:mt-16 max-w-5xl mx-auto px-4 relative z-10">
      
      {/* --- Dynamic Snow Particles --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 flex w-full h-[150vh]">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full animate-snow backdrop-blur-md shadow-[0_0_12px_rgba(154,79,186,0.5)] dark:shadow-[0_0_8px_rgba(255,255,255,0.7)]"
            style={{
               backgroundColor: i % 2 === 0 ? 'rgba(78, 122, 177, 0.4)' : 'rgba(154, 79, 186, 0.5)',
               width: Math.random() * 6 + 3 + 'px',
               height: Math.random() * 6 + 3 + 'px',
               top: '-10%', 
               left: Math.random() * 100 + '%',
               animationDuration: Math.random() * 8 + 8 + 's', 
               animationDelay: '-' + (Math.random() * 15) + 's',
               opacity: Math.random() * 0.7 + 0.3
            }}
          ></div>
        ))}
      </div>

      <div className="inline-flex py-1.5 px-6 rounded-full glass-card text-bwai-purple dark:text-[#E8A5F4] font-bold tracking-widest text-xs mb-8 uppercase shadow-sm font-mono border border-bwai-purple/20">
        Phase 2.2: Elegant Glassmorphism
      </div>
      
      <h2 className="text-4xl md:text-6xl font-black text-bwai-navy dark:text-white mb-8 tracking-wide leading-tight drop-shadow-sm font-display capitalize">
        Next-Gen Crowd Control <br className="hidden md:block"/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-bwai-purple via-bwai-steel to-bwai-navy dark:from-[#E8A5F4] dark:to-white drop-shadow-sm">Intelligence Platform</span>
      </h2>
      
      {/* Light mode restored to softer Slate, Dark mode pushed to Slate-100 */}
      <p className="mt-6 text-slate-700 dark:text-slate-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-16 font-bold font-mono drop-shadow-sm">
        A mission-critical system designed to detect early congestion, streamline staff task dispatching, and provide intelligent, calm instructions to attendees during scenarios.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link to="/admin" className="group p-8 rounded-3xl glass-card relative flex flex-col items-center text-center backdrop-blur-3xl border border-white/40 dark:border-white/10">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-bwai-navy to-bwai-steel opacity-80 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 bg-white/70 dark:bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white dark:border-white/20 group-hover:scale-110 transition-transform shadow-inner">
            <ShieldAlert className="text-bwai-navy dark:text-white" size={32} />
          </div>
          <h3 className="text-xl font-bold text-bwai-navy dark:text-white mb-3 group-hover:text-bwai-steel dark:group-hover:text-slate-200 transition-colors font-display tracking-wide capitalize">Admin Console</h3>
          <p className="text-slate-600 dark:text-slate-200 text-sm font-bold font-mono leading-relaxed">Global overview, manual override controls, and active incident mapping.</p>
        </Link>
        
        <Link to="/staff" className="group p-8 rounded-3xl glass-card relative flex flex-col items-center text-center backdrop-blur-3xl border border-white/40 dark:border-white/10">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-bwai-steel to-bwai-slate opacity-80 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 bg-white/70 dark:bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white dark:border-white/20 group-hover:scale-110 transition-transform shadow-inner">
            <Users className="text-bwai-steel dark:text-white" size={32} />
          </div>
          <h3 className="text-xl font-bold text-bwai-navy dark:text-white mb-3 group-hover:text-bwai-steel dark:group-hover:text-slate-200 transition-colors font-display tracking-wide capitalize">Staff Terminal</h3>
          <p className="text-slate-600 dark:text-slate-200 text-sm font-bold font-mono leading-relaxed">Dynamic task dispatching and sector-based operational controls.</p>
        </Link>
        
        <Link to="/attendee" className="group p-8 rounded-3xl glass-card relative flex flex-col items-center text-center backdrop-blur-3xl border border-white/40 dark:border-white/10">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-bwai-purple to-red-400 opacity-90 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 bg-bwai-purple/20 dark:bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-bwai-purple/30 dark:border-white/20 group-hover:scale-110 transition-transform shadow-inner">
            <Navigation className="text-bwai-purple dark:text-white" size={32} />
          </div>
          <h3 className="text-xl font-bold text-bwai-navy dark:text-white mb-3 group-hover:text-bwai-purple dark:group-hover:text-[#E8A5F4] transition-colors font-display tracking-wide capitalize">Attendee App</h3>
          <p className="text-slate-600 dark:text-slate-200 text-sm font-bold font-mono leading-relaxed">Mobile-first calm guidance interface with live push instructions and SOS panic button.</p>
        </Link>
      </div>
    </div>
  );
}
