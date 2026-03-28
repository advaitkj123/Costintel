import { LayoutDashboard, AlertTriangle, Zap, Settings, Brain, LogOut, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
  { id: 'insights', label: 'Insights', icon: Brain },
  { id: 'actions', label: 'Actions', icon: Zap },
  { id: 'savings', label: 'Savings', icon: Server },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const { user, logout } = useAuth();
  return (
    <aside className="w-[280px] h-screen bg-[#09090b] border-r border-white/[0.05] flex flex-col relative z-50 inner-glow overflow-y-auto">
      <div className="h-[72px] px-6 border-b border-white/[0.05] flex items-center gap-4 group cursor-pointer shrink-0" onClick={() => window.location.href = '/landing'}>
        <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shadow-inner group-hover:bg-white/[0.05] transition-all overflow-hidden relative">
          <div className="absolute inset-0 bg-indigo-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <Zap className="w-5 h-5 text-indigo-400 relative z-10" />
        </div>
        <div>
          <h1 className="text-[14px] font-black text-white tracking-[0.15em] leading-none mb-1.5 uppercase">COSTINTEL</h1>
          <div className="flex flex-col gap-1.5">
            <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-[0.2em] leading-none opacity-80">Sentinel V4.2</p>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse shrink-0" />
              <span className="text-[10px] font-medium text-emerald-400/70 tracking-wide">Live</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300 group relative ${
                isActive 
                  ? 'text-white bg-white/[0.03] inner-glow border border-white/5' 
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02]'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                isActive ? 'text-primary' : 'text-zinc-600 group-hover:text-zinc-400'
              }`} />
              {item.label}
              
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-[-16px] w-[2px] h-6 bg-primary rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                />
              )}
            </button>
          )
        })}

        <button
          onClick={() => {
            logout();
          }}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[13px] font-bold text-zinc-500 hover:text-danger hover:bg-danger/5 transition-all duration-300 group mt-4"
        >
          <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 text-zinc-600 group-hover:text-danger" />
          Logout
        </button>
      </nav>

      <div className="p-6">
        <div className="p-6 rounded-[32px] bg-gradient-to-b from-primary/10 to-transparent border border-white/[0.05] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-12 h-12 text-primary" />
          </div>
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Pro Plan</p>
          <p className="text-xs font-bold text-zinc-400 leading-relaxed mb-4">Unlimited anomaly extraction and AI insights.</p>
          <button className="w-full py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all">
            Upgrade
          </button>
        </div>
        
        {/* User Profile Info */}
        {user && (
          <div className="mt-6 flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-[10px] font-black text-white truncate">{user.email}</p>
               <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter">Verified Identity</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
