import React from 'react';

export default function VenueMap({ dangerZones = [], safeZones = ['A', 'B', 'C', 'D'], showPaths = false }) {
  const getZoneOverlay = (zoneId) => {
    if (dangerZones.includes(zoneId)) return 'fill-red-600/40 dark:fill-red-600/30 opacity-100 animate-pulse mix-blend-multiply dark:mix-blend-screen';
    if (safeZones.includes(zoneId)) return 'fill-green-500/20 dark:fill-green-500/10 opacity-100 transition duration-1000';
    return 'fill-transparent';
  };

  return (
    <div className="w-full h-full bg-[#f1f5f9] dark:bg-[#07101E] relative overflow-hidden flex items-center justify-center p-4">
      {/* Blueprint Grid Background Pattern */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: 'linear-gradient(rgba(78, 122, 177, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(78, 122, 177, 0.15) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}></div>

      <svg className="w-full h-full drop-shadow-xl relative z-10" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
        {/* Core Architecture (Walls, Rooms, Stage) */}
        <g stroke="currentColor" className="text-bwai-navy/80 dark:text-bwai-steel/60">
          <path d="M 20 20 L 380 20 L 380 280 L 20 280 Z" fill="none" strokeWidth="4" />
          {/* Main Stage */}
          <path d="M 120 20 L 280 20 L 280 80 Q 200 100 120 80 Z" fill="currentColor" opacity="0.1" strokeWidth="2" />
          <text x="200" y="55" fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="middle" opacity="0.6" letterSpacing="4" className="dark:text-white pointer-events-none">MAIN STAGE</text>
          
          {/* Divider Walls */}
          <path d="M 200 100 L 200 280" fill="none" strokeWidth="2" strokeDasharray="8 4"/>
          <path d="M 20 180 L 380 180" fill="none" strokeWidth="2" strokeDasharray="8 4"/>
          
          {/* Entrance / Exits */}
          <rect x="180" y="278" width="40" height="4" fill="currentColor" />
          <text x="200" y="295" fontSize="10" fill="currentColor" textAnchor="middle" fontWeight="bold" letterSpacing="2" className="dark:text-white pointer-events-none">SOUTH GATES</text>
          
          <rect x="18" y="140" width="4" height="40" fill="currentColor" />
          <text x="10" y="160" fontSize="8" fill="currentColor" textAnchor="middle" transform="rotate(-90 10 160)" letterSpacing="1" className="dark:text-white pointer-events-none">WEST EXIT</text>

          <rect x="378" y="140" width="4" height="40" fill="currentColor" />
          <text x="390" y="160" fontSize="8" fill="currentColor" textAnchor="middle" transform="rotate(90 390 160)" letterSpacing="1" className="dark:text-white pointer-events-none">EAST EXIT</text>
        </g>

        {/* Dynamic Zone Overlays (A: Top Left, B: Top Right, C: Bottom Left, D: Bottom Right) */}
        <g>
          {/* Zone A */}
          <path d="M 22 82 L 198 100 L 198 178 L 22 178 Z" className={`transition-all duration-700 ${getZoneOverlay('A')}`} />
          <text x="110" y="140" fontSize="24" fontWeight="900" fill="currentColor" className="text-bwai-navy dark:text-white opacity-40 mix-blend-overlay pointer-events-none">ZONE A</text>

          {/* Zone B */}
          <path d="M 378 82 L 202 100 L 202 178 L 378 178 Z" className={`transition-all duration-700 ${getZoneOverlay('B')}`} />
          <text x="290" y="140" fontSize="24" fontWeight="900" fill="currentColor" className="text-bwai-navy dark:text-white opacity-40 mix-blend-overlay pointer-events-none">ZONE B</text>

          {/* Zone C */}
          <path d="M 22 182 L 198 182 L 198 278 L 22 278 Z" className={`transition-all duration-700 ${getZoneOverlay('C')}`} />
          <text x="110" y="230" fontSize="24" fontWeight="900" fill="currentColor" className="text-bwai-navy dark:text-white opacity-40 mix-blend-overlay pointer-events-none">ZONE C</text>

          {/* Zone D */}
          <path d="M 202 182 L 378 182 L 378 278 L 202 278 Z" className={`transition-all duration-700 ${getZoneOverlay('D')}`} />
          <text x="290" y="230" fontSize="24" fontWeight="900" fill="currentColor" className="text-bwai-navy dark:text-white opacity-40 mix-blend-overlay pointer-events-none">ZONE D</text>
        </g>

        {/* Dynamic Nav Path for Safe Evacuation */}
        {showPaths && (
          <g>
            {/* Glowing blur trail */}
            <path d="M 110 140 Q 150 200 200 260" fill="none" stroke="rgba(34,197,94,0.4)" strokeWidth="12" strokeLinecap="round" className="filter blur-md animate-pulse" />
            <path d="M 110 140 Q 150 200 200 260" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="10 5" strokeLinecap="round" className="animate-[dash_2s_linear_infinite]" />
            <circle cx="200" cy="275" r="8" fill="#22c55e" className="animate-ping opacity-50" />
            <circle cx="200" cy="275" r="4" fill="#16a34a" stroke="white" strokeWidth="2" />
          </g>
        )}
      </svg>
      {/* Internal CSS for Map Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to { stroke-dashoffset: -30; }
        }
      `}} />
    </div>
  );
}
