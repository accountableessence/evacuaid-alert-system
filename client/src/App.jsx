import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AttendeeDashboard from './pages/AttendeeDashboard';
import { socket } from './socket';

function App() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    socket.on('connect',    () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen selection:bg-bwai-purple selection:text-white pb-32 transition-colors duration-500 relative overflow-hidden bg-[#060e1d] text-slate-100">

        {/* Background blobs */}
        <div className="absolute top-0 -left-64 w-[500px] h-[500px] bg-bwai-purple rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob pointer-events-none"></div>
        <div className="absolute top-0 -right-64 w-[500px] h-[500px] bg-bwai-steel rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
        <div className="absolute -bottom-64 left-1/2 w-[500px] h-[500px] bg-bwai-navy rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000 pointer-events-none"></div>

        {/* Navbar — baby blue */}
        <nav className="sticky top-0 z-40 border-b border-[#a8d4f0]/30 shadow-[0_4px_30px_rgba(168,212,240,0.15)] bg-[#a8d4f0]/20 backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="flex items-center group">
              <img src="/logo.png" alt="EvacuAid" className="h-10 md:h-12 object-contain group-hover:scale-105 transition-transform" />
            </Link>

            <div className="flex bg-[#0d1f38]/60 backdrop-blur-md rounded-full p-1 border border-[#a8d4f0]/20 shadow-inner w-full md:w-auto overflow-x-auto relative z-10 font-mono">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/admin">Admin</NavLink>
              <NavLink to="/staff">Staff</NavLink>
              <NavLink to="/attendee">Attendee</NavLink>
            </div>

            <div className={`hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black shadow-inner uppercase font-mono tracking-wider backdrop-blur-md ${connected ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-red-400'}`}></div>
              {connected ? 'LIVE SYNC' : 'OFFLINE'}
            </div>
          </div>
        </nav>

        <main className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-700 relative z-10">
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/admin"    element={<AdminDashboard />} />
            <Route path="/staff"    element={<StaffDashboard />} />
            <Route path="/attendee" element={<AttendeeDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`px-5 py-2.5 rounded-full transition-all duration-300 flex-1 text-center whitespace-nowrap text-sm ${
        isActive
          ? 'bg-[#a8d4f0] text-[#0d1f38] shadow-md scale-105 border border-[#a8d4f0]/50 font-black'
          : 'text-slate-200 hover:text-white hover:bg-[#a8d4f0]/20 font-bold'
      }`}
    >
      {children}
    </Link>
  );
}

export default App;