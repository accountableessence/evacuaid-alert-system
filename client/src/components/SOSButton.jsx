import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function SOSButton({ onTrigger }) {
  const [loading, setLoading] = useState(false);

  const handleTrigger = () => {
    setLoading(true);
    setTimeout(() => {
      onTrigger();
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleTrigger}
        disabled={loading}
        className={`group relative flex items-center justify-center w-[85px] h-[85px] rounded-full shadow-[0_10px_30px_rgba(220,38,38,0.5)] transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-red-400/50 backdrop-blur-md ${loading ? 'opacity-70 cursor-not-allowed bg-red-600/50' : 'bg-red-600/90 dark:bg-red-600/80 hover:bg-red-500 animate-bounce'}`}
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-30 shadow-[0_0_20px_rgba(220,38,38,1)] pointer-events-none"></div>
        <AlertCircle size={44} className="relative z-10 text-white drop-shadow-md" />
      </button>
    </div>
  );
}
