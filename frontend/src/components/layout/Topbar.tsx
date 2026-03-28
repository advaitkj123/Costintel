import { Bell, Search, User, Menu, Server, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAnomalies, AnomalyResponse } from '../../services/api';

export function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [anomalies, setAnomalies] = useState<AnomalyResponse[]>([]);
  const [seenAnomalies, setSeenAnomalies] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const data = await getAnomalies();
        setAnomalies(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = anomalies.filter(a => !seenAnomalies.has(a.id)).length;

  const handleOpenDropdown = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setSeenAnomalies(new Set(anomalies.map(a => a.id)));
    }
  };
  return (
    <header className="h-[72px] bg-[#09090b] border-b border-white/[0.05] sticky top-0 z-40 flex items-center justify-between px-6 xl:px-8">
      
      {/* LEFT AREA: Mobile menu + Search Side Elements */}
      <div className="flex items-center gap-6">
        <button className="lg:hidden text-zinc-500 hover:text-white transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden md:flex items-center gap-3 text-zinc-500 focus-within:text-white transition-all bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 w-[400px] hover:bg-white/[0.04] focus-within:border-white/10 focus-within:bg-white/[0.04]">
          <Search className="w-4 h-4 shrink-0 transition-colors" />
          <input 
            type="text" 
            placeholder="Search resources, anomalies, or insights..." 
            className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:text-zinc-600 focus:placeholder:text-zinc-400"
          />
        </div>
      </div>

      {/* RIGHT AREA: Notifications & Profile */}
      <div className="flex items-center gap-6 md:gap-8">
        
        <div className="relative flex items-center">
          <button 
            onClick={handleOpenDropdown}
            className="relative text-zinc-500 hover:text-white transition-colors group"
          >
            <Bell className={`w-[18px] h-[18px] group-hover:scale-110 transition-transform origin-top ${unreadCount > 0 ? 'text-red-400' : ''}`} />
            {unreadCount > 0 && <div className="absolute -top-0.5 -right-0.5 w-[6px] h-[6px] rounded-full bg-red-500 border border-[#09090b]" />}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-10 right-0 w-80 bg-[#18181b] border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 text-left"
              >
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <p className="text-sm font-bold text-white">System Alerts</p>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-red-500/20 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">{unreadCount} New</span>
                  )}
                </div>
                <div className="p-2 max-h-[300px] overflow-y-auto">
                  <div className="p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors flex gap-3 items-start border-b border-white/5 mb-1 pb-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex shrink-0 items-center justify-center mt-0.5">
                      <Server className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white mb-1">Engine Connected</p>
                      <p className="text-[11.5px] text-zinc-400 leading-snug">Sentinel Engine is actively connected to AWS instance metrics.</p>
                    </div>
                  </div>
                  
                  {anomalies.length > 0 ? (
                    anomalies.map(anomaly => (
                      <div key={anomaly.id} className="p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors flex gap-3 items-start">
                        <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center mt-0.5 ${anomaly.severity.toLowerCase() === 'high' ? 'bg-red-500/20' : 'bg-orange-500/20'}`}>
                          <AlertCircle className={`w-4 h-4 ${anomaly.severity.toLowerCase() === 'high' ? 'text-red-400' : 'text-orange-400'}`} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white mb-1">{anomaly.resource_id} Event</p>
                          <p className="text-[11.5px] text-zinc-400 leading-snug">{anomaly.description}</p>
                          <p className="text-[9px] text-zinc-500 font-bold tracking-wider uppercase mt-2">{new Date(anomaly.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-500 italic text-center py-6">No recent anomalies detected.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="h-6 w-px bg-white/[0.05]" />
        
        <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-bold text-white mb-0.5">AWS Free Tier</p>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest text-opacity-80">Admin</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <User className="w-[18px] h-[18px] opacity-90" />
          </div>
        </button>

      </div>
    </header>
  );
}
