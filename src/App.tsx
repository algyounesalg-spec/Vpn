/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  ShieldCheck, 
  Globe, 
  Zap, 
  Terminal, 
  Settings, 
  Moon, 
  Sun, 
  Lock, 
  Activity, 
  ChevronRight,
  Server as ServerIcon,
  Wifi,
  Cpu
} from 'lucide-react';
import { ConnectionStatus, Server, LogEntry, Theme } from './types';

const SERVERS: Server[] = [
  { id: '1', name: 'Frankfurt-01', country: 'Germany', city: 'Frankfurt', load: 45, latency: 22, isSmart: true },
  { id: '2', name: 'New York-Core', country: 'USA', city: 'New York', load: 82, latency: 110 },
  { id: '3', name: 'Tokyo-Main', country: 'Japan', city: 'Tokyo', load: 30, latency: 240 },
  { id: '4', name: 'London-Bridge', country: 'UK', city: 'London', load: 12, latency: 35 },
  { id: '5', name: 'Paris-Nexus', country: 'France', city: 'Paris', load: 60, latency: 28 },
];

export default function App() {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [activeServer, setActiveServer] = useState<Server>(SERVERS[0]);
  const [theme, setTheme] = useState<Theme>('royal-black');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState('00:00:00');

  // Add initial logs
  useEffect(() => {
    addLog('System', 'info', 'Aura VPN Engine Initialized');
    addLog('Auth', 'info', 'User authenticated via TLS 1.3');
  }, []);

  // Duration timer
  useEffect(() => {
    let interval: number;
    if (status === ConnectionStatus.CONNECTED && startTime) {
      interval = window.setInterval(() => {
        const diff = Date.now() - startTime;
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setDuration(`${h}:${m}:${s}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, startTime]);

  const addLog = (source: string, level: LogEntry['level'], message: string) => {
    const entry: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message: `[${source}] ${message}`
    };
    setLogs(prev => [entry, ...prev].slice(0, 50));
  };

  const toggleConnection = async () => {
    if (status === ConnectionStatus.DISCONNECTED) {
      setStatus(ConnectionStatus.CONNECTING);
      addLog('VPN', 'info', `Initiating handshake with ${activeServer.name}...`);
      addLog('Protocol', 'debug', 'Protocol: WireGuard over HTTPS/443');
      
      // Simulate connection
      setTimeout(() => {
        setStatus(ConnectionStatus.CONNECTED);
        setStartTime(Date.now());
        addLog('VPN', 'info', 'Tunnel established. Encryption active.');
      }, 2000);
    } else if (status === ConnectionStatus.CONNECTED) {
      setStatus(ConnectionStatus.DISCONNECTING);
      addLog('VPN', 'warn', 'Breaking tunnel connection...');
      
      setTimeout(() => {
        setStatus(ConnectionStatus.DISCONNECTED);
        setStartTime(null);
        setDuration('00:00:00');
        addLog('VPN', 'info', 'Disconnected.');
      }, 1000);
    }
  };

  const colors = useMemo(() => {
    if (theme === 'royal-black') {
      return {
        bg: 'bg-aura-black',
        text: 'text-white',
        glass: 'bg-white/5 border-white/10',
        accent: 'white',
        sub: 'text-zinc-500'
      };
    }
    return {
      bg: 'bg-zinc-50',
      text: 'text-zinc-900',
      glass: 'bg-white/40 border-black/5',
      accent: 'black',
      sub: 'text-zinc-400'
    };
  }, [theme]);

  // Hidden Log Screen Trigger (Clicking specific area 3 times)
  const [clickCount, setClickCount] = useState(0);
  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount >= 2) {
      setShowLogs(!showLogs);
      setClickCount(0);
    }
  };

  const [showServerList, setShowServerList] = useState(false);

  const selectServer = (server: Server) => {
    setActiveServer(server);
    setShowServerList(false);
    addLog('System', 'info', `Switched node to ${server.name} (${server.city})`);
    if (status === ConnectionStatus.CONNECTED) {
      toggleConnection(); // Reconnect for new server
      setTimeout(() => toggleConnection(), 1500);
    }
  };

  return (
    <div id="aura-vpn-root" className={`relative min-h-screen ${colors.bg} ${colors.text} theme-transition font-sans overflow-hidden`}>
      {/* Background World Map Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 500" fill="currentColor">
          <path d="M150 100 Q 200 80, 250 120 T 350 100 T 450 150 T 600 120 T 800 180 T 900 130" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M100 250 Q 300 280, 450 200 T 650 250 T 850 220" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
        </svg>
      </div>

      {/* Foreground Service "Zajaji" Notification */}
      <AnimatePresence>
        {status === ConnectionStatus.CONNECTED && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-2 left-1/2 -translate-x-1/2 z-50 px-4 py-2 glass-panel rounded-full flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Aura Service Active</span>
            <div className="h-3 w-[1px] bg-white/10" />
            <span className="text-[10px] font-mono text-white/50">{activeServer.id === '1' ? 'Smart' : 'Direct'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <motion.div 
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer select-none"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
            <Lock size={20} className={theme === 'royal-black' ? 'text-white' : 'text-zinc-900'} />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-lg leading-none">AURA</h1>
            <span className="text-[10px] uppercase tracking-[0.3em] opacity-50">Secure VPN</span>
          </div>
        </motion.div>

        <div className="flex gap-4">
          <button 
            onClick={() => setTheme(theme === 'royal-black' ? 'marble-white' : 'royal-black')}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.glass} hover:bg-white/10 transition-colors backdrop-blur-md border`}
          >
            {theme === 'royal-black' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.glass} hover:bg-white/10 transition-colors backdrop-blur-md border`}>
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-10 px-6 gap-12 max-w-lg mx-auto h-[calc(100vh-80px)]">
        
        {/* Connection Interface */}
        <div className="flex flex-col items-center gap-8 w-full">
          <div className="relative">
            {/* Status Rings */}
            <motion.div 
              className={`absolute inset-[-40px] rounded-full border border-white/5`}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div 
              className={`absolute inset-[-20px] rounded-full border border-white/10`}
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />

            {/* Main Button */}
            <motion.button
              onClick={toggleConnection}
              disabled={status === ConnectionStatus.CONNECTING || status === ConnectionStatus.DISCONNECTING}
              className={`relative z-20 w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-700
                ${status === ConnectionStatus.CONNECTED ? 'bg-white text-aura-black glow-active' : 'bg-white/5 border border-white/20 backdrop-blur-3xl glow-white'}
                ${status === ConnectionStatus.CONNECTING || status === ConnectionStatus.DISCONNECTING ? 'opacity-50' : 'hover:scale-105 active:scale-95'}
              `}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={status}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  {status === ConnectionStatus.CONNECTED ? <ShieldCheck size={48} /> : <Shield size={48} />}
                </motion.div>
              </AnimatePresence>
              
              <div className="mt-4 flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">
                  {status === ConnectionStatus.CONNECTING ? 'Connecting...' : status === ConnectionStatus.CONNECTED ? 'Secure' : 'Protected'}
                </span>
                <span className="text-xl font-bold">
                  {status === ConnectionStatus.CONNECTED ? 'CONNECTED' : 'STANDBY'}
                </span>
              </div>

              {/* Pulsing Dot If Connected */}
              {status === ConnectionStatus.CONNECTED && (
                <motion.div 
                  className="absolute bottom-4 w-1.5 h-1.5 bg-green-500 rounded-full"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <GlassCard label="Latency" value={`${activeServer.latency}ms`} icon={<Activity size={14} />} colors={colors} />
            <GlassCard label="Duration" value={duration} icon={<Wifi size={14} />} colors={colors} />
            <GlassCard label="Load" value={`${activeServer.load}%`} icon={<Cpu size={14} />} colors={colors} />
          </div>
        </div>

        {/* Server Picker / Smart Tunneling */}
        <div className="flex flex-col gap-4 w-full mt-auto mb-10">
          <div className="flex justify-between items-end px-2">
            <h3 className="text-xs uppercase tracking-widest font-bold opacity-60">Select Mesh Node</h3>
            <div className="flex items-center gap-2 text-xs font-medium text-green-400">
               <Zap size={12} fill="currentColor" /> Smart Tunneling Active
            </div>
          </div>
          
          <motion.div 
            onClick={() => setShowServerList(true)}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-4 p-4 rounded-3xl ${colors.glass} border backdrop-blur-2xl cursor-pointer group active:bg-white/10`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
              <Globe size={24} className="opacity-80" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold opacity-50 uppercase leading-none mb-1">{activeServer.country}</p>
              <h4 className="text-lg font-bold leading-none">{activeServer.name}</h4>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold">WIREGUARD</div>
              <ChevronRight size={18} className="opacity-40 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Server Selection Modal */}
      <AnimatePresence>
        {showServerList && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowServerList(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`relative z-10 w-full max-h-[80vh] rounded-t-[40px] p-8 ${colors.glass} backdrop-blur-3xl border-t`}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Network Nodes</h2>
                  <p className="text-xs uppercase tracking-widest opacity-40">Choose optimal gateway</p>
                </div>
                <button 
                  onClick={() => setShowServerList(false)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <ChevronRight className="rotate-90" />
                </button>
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto max-h-[50vh] pr-2">
                {SERVERS.map(server => (
                  <motion.div
                    key={server.id}
                    onClick={() => selectServer(server)}
                    whileHover={{ x: 10 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border
                      ${activeServer.id === server.id ? 'bg-white text-aura-black border-white' : 'bg-white/5 border-white/5 hover:border-white/20'}
                    `}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeServer.id === server.id ? 'bg-aura-black' : 'bg-white/10'}`}>
                      <ServerIcon size={18} className={activeServer.id === server.id ? 'text-white' : ''} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">{server.name}</h4>
                      <p className={`text-[10px] uppercase font-medium opacity-60`}>{server.country} • {server.latency}ms</p>
                    </div>
                    {server.isSmart && (
                      <div className={`px-2 py-1 rounded text-[8px] font-black tracking-tighter ${activeServer.id === server.id ? 'bg-aura-black text-white' : 'bg-green-500/20 text-green-400 border border-green-500/20'}`}>
                        SMART
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Log System Overlay */}
      <AnimatePresence>
        {showLogs && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-3xl p-6 overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Terminal size={20} className="text-green-500" />
                <h2 className="font-mono text-sm tracking-tighter uppercase">Kernel Log System v4.2.0</h2>
              </div>
              <button 
                onClick={() => setShowLogs(false)}
                className="text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed opacity-80">
              {logs.map((log, i) => (
                <div key={i} className={`flex gap-3 mb-1 ${log.level === 'warn' ? 'text-yellow-400' : log.level === 'error' ? 'text-red-400' : 'text-zinc-500'}`}>
                  <span className="opacity-40 select-none">[{log.timestamp}]</span>
                  <span className="text-white/80">{log.message}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glass Footer / Quick Actions */}
      <div className={`fixed bottom-0 left-0 right-0 h-1 border-t border-white/5 transition-opacity ${status === ConnectionStatus.CONNECTED ? 'opacity-100' : 'opacity-0'}`}>
        <motion.div 
          className="h-full bg-white shadow-[0_0_20px_white]"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
    </div>
  );
}

function GlassCard({ label, value, icon, colors }: { label: string, value: string, icon: React.ReactNode, colors: any }) {
  return (
    <div className={`p-4 h-24 rounded-2xl ${colors.glass} border backdrop-blur-xl flex flex-col justify-between`}>
      <div className="flex justify-between items-center opacity-40">
        {icon}
        <span className="text-[10px] uppercase font-bold tracking-widest">{label}</span>
      </div>
      <span className="text-xl font-bold tracking-tighter">{value}</span>
    </div>
  );
}
