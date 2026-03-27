import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { motion } from 'framer-motion';

export function DashboardLayout({ children, activeTab, setActiveTab }: { children: ReactNode, activeTab: string, setActiveTab: (tab: string) => void }) {
  return (
    <div className="flex min-h-screen text-zinc-100 selection:bg-primary/30 font-sans relative overflow-hidden bg-[#05060a]">
      {/* 1. ANIMATED ATMOSPHERIC BASE (Cinematic Lighting) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.08, 0.05],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/20 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.06, 0.03],
            x: [0, -40, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-500/20 blur-[130px]"
        />
      </div>

      {/* 2. TELEMETRY GRID (Deep Infrastructure Feel) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      
      {/* 3. NOISE OVERLAY */}
      <div className="fixed inset-0 z-10 pointer-events-none opacity-[0.03] mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative z-20">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 xl:p-10 max-w-[1600px] w-full mx-auto relative">
           {children}
        </main>
      </div>
    </div>
  );
}
