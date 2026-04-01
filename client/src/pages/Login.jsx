import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Key, Users, Navigation, UserPlus } from 'lucide-react';

export default function Login() {
  const [role, setRole] = useState('attendee'); // attendee, staff, admin
  const [isLogin, setIsLogin] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    // In a real app, Firebase Auth login/signup happens here.
    navigate(`/${role === 'attendee' ? 'attendee' : role}`);
  };

  const toggleForm = (e) => {
    e.preventDefault();
    setIsFlipping(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsFlipping(false);
    }, 300); // Swap content exactly midway through the 600ms rotation wrapper
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] relative z-10 w-full px-4">
      <div className="w-full max-w-lg" style={{ perspective: '1000px' }}>
        
        {/* Branding header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-sky-500/20 rounded-full border border-sky-400/30 mb-6 shadow-[0_0_30px_rgba(56,189,248,0.2)]">
            <Shield size={40} className="text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
          </div>
          <h2 className="text-4xl font-black text-white font-display tracking-widest uppercase">Evacu<span className="text-[#CE85D4]">Aid</span></h2>
          <p className="text-[#7B9CB6] font-mono font-bold tracking-widest uppercase text-sm mt-3">Authentication Gateway</p>
        </div>

        {/* 3D Flip Container */}
        <div 
           className="relative transition-transform duration-700 ease-in-out"
           style={{
             transformStyle: 'preserve-3d',
             transform: isLogin ? 'rotateY(0deg)' : 'rotateY(180deg)'
           }}
        >
          {/* Glass Panel - Front & Back share the same bounding box via absolute positioning trick 
              or we dynamically render the contents. We'll render the contents conditionally halfway. */}
          
          <div 
             className="glass-panel p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-white/10 backdrop-blur-3xl relative overflow-hidden"
             style={{
                // Prevent the element from physically backward rendering text backward, we keep it 0deg inside the wrapping rotation, wait actually if we rotate the wrapper, we must counter-rotate or just swap children.
                // The easiest CSS flip is swapping the inner components! We use `scale-x-[-1]` when not login so it reads correctly.
                transform: !isLogin ? 'rotateY(180deg)' : 'rotateY(0deg)'
             }}
          >
            {/* Subtle accent glow */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-sky-500 rounded-full opacity-10 filter blur-3xl pointer-events-none"></div>

            <div className={`transition-opacity duration-300 ${isFlipping ? 'opacity-0' : 'opacity-100'}`}>
              
              <div className="text-center mb-6">
                 <h3 className="text-xl font-bold font-mono tracking-widest text-white uppercase">
                   {isLogin ? 'Initialize Session' : 'Request Clearance'}
                 </h3>
              </div>

              {/* Role Selection Tabs */}
              <div className="flex bg-black/40 p-1.5 rounded-2xl mb-8 border border-white/5 font-mono shadow-inner relative z-10 transition-all">
                <button 
                  onClick={() => setRole('attendee')} 
                  className={`flex-1 py-3 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl transition flex justify-center items-center gap-1.5 ${role === 'attendee' ? 'bg-[#CE85D4] text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  <Navigation size={14}/> User
                </button>
                <button 
                  onClick={() => setRole('staff')} 
                  className={`flex-1 py-3 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl transition flex justify-center items-center gap-1.5 ${role === 'staff' ? 'bg-[#7B9CB6] text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  <Users size={14}/> Staff
                </button>
                <button 
                  onClick={() => setRole('admin')} 
                  className={`flex-1 py-3 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl transition flex justify-center items-center gap-1.5 ${role === 'admin' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  <Key size={14}/> Admin
                </button>
              </div>

              <form onSubmit={handleAuth} className="space-y-6 relative z-10">
                
                {/* Extra field for Sign Up */}
                {!isLogin && (
                  <div>
                    <label className="block text-xs font-bold text-[#7B9CB6] uppercase tracking-widest mb-2 font-mono">Agent Alias</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserPlus className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        required={!isLogin}
                        placeholder="John Doe"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-400 shadow-inner font-mono transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#7B9CB6] uppercase tracking-widest mb-2 font-mono">Secure ID / Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="email" 
                      required
                      placeholder="agent@evacuaid.system"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-400 shadow-inner font-mono transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7B9CB6] uppercase tracking-widest mb-2 font-mono">Passcode</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••••••"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-400 shadow-inner font-mono transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 bg-black/40" />
                    <span className="ml-2 font-mono text-slate-300 text-xs tracking-wider">Remember Clearance</span>
                  </label>
                  {isLogin && (
                    <a href="#" className="font-mono text-xs text-sky-400 hover:text-sky-300 transition-colors uppercase tracking-widest">Forgot Passcode?</a>
                  )}
                </div>

                <button type="submit" className={`w-full ${isLogin ? 'bg-sky-500 hover:bg-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.4)]' : 'bg-[#CE85D4] hover:bg-[#b978be] shadow-[0_0_20px_rgba(206,133,212,0.4)]'} text-white font-black py-4 rounded-xl font-mono uppercase tracking-widest transition-all active:scale-95 border border-white/20 mt-4`}>
                  {isLogin ? 'Access Gateway' : 'Create Clearance'}
                </button>
              </form>

              {/* Toggler */}
              <div className="mt-8 text-center">
                 <p className="text-slate-400 font-mono text-xs uppercase tracking-wider">
                   {isLogin ? "Don't have clearance yet?" : "Already registered?"}
                 </p>
                 <button 
                   onClick={toggleForm}
                   className="mt-2 text-sky-400 font-bold font-mono text-sm tracking-widest uppercase hover:text-white transition-colors border-b border-sky-400 hover:border-white pb-0.5"
                 >
                   {isLogin ? 'Register New Agent' : 'Return to Login'}
                 </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
