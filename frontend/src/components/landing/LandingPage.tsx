import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Zap, AlertCircle, CheckCircle2, ArrowRight, Play, Activity, ShieldCheck } from 'lucide-react';
import { OverviewPanel } from '../dashboard/OverviewPanel';

// --- MOCK DATA FOR ANIMATIONS ---
const baselineData = Array.from({ length: 20 }, (_, i) => ({ x: i, y: 100 + Math.random() * 10 }));
const spikeData = [...baselineData.slice(0, 12), { x: 12, y: 180 }, { x: 13, y: 250 }, { x: 14, y: 340 }];
const resolvedData = [...spikeData, { x: 15, y: 150 }, { x: 16, y: 110 }, { x: 17, y: 105 }, { x: 18, y: 100 }, { x: 19, y: 95 }];

// Animated Counter Hook
const AnimatedCounter = ({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1500;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{Math.floor(count).toLocaleString()}{suffix}</span>;
};

// --- MAIN COMPONENTS ---

const HeroSystemSimulation = () => {
   const [phase, setPhase] = useState(0); // 0: steady, 1: spike, 2: fix, 3: resolved

   useEffect(() => {
      const cycle = () => {
         setPhase(0);
         setTimeout(() => setPhase(1), 2500); // Spike hits
         setTimeout(() => setPhase(2), 5000); // System detects and fixes
         setTimeout(() => setPhase(3), 6500); // Dropped
      };
      cycle();
      const interval = setInterval(cycle, 10000);
      return () => clearInterval(interval);
   }, []);

   const currentData = phase === 0 ? baselineData 
                     : phase === 1 ? spikeData 
                     : phase === 2 ? spikeData 
                     : resolvedData;

   return (
      <div className="relative w-full h-[500px] bg-[#09090b] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col">
         {/* Background Grid Particles */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
         <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

         {/* Top Bar Fake UI */}
         <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02] relative z-10">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">System Telemetry</span>
            </div>
            <div className="flex gap-1.5 opacity-40">
               <div className="w-2 h-2 rounded-full bg-white/20" />
               <div className="w-2 h-2 rounded-full bg-white/20" />
               <div className="w-2 h-2 rounded-full bg-white/20" />
            </div>
         </div>

         {/* Graph Area */}
         <div className="flex-1 relative p-6 z-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={currentData}>
                  <defs>
                     <linearGradient id="steadyPhase" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="spikePhase" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="resolvedPhase" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  
                  <Area 
                     type="monotone" 
                     dataKey="y" 
                     stroke={phase === 1 || phase === 2 ? "#ef4444" : phase === 3 ? "#10b981" : "#6366f1"} 
                     strokeWidth={3}
                     fill={phase === 1 || phase === 2 ? "url(#spikePhase)" : phase === 3 ? "url(#resolvedPhase)" : "url(#steadyPhase)"} 
                     isAnimationActive={true}
                     animationDuration={800}
                     animationEasing="ease-in-out"
                  />
                  
                  {/* Glowing Anomaly Point */}
                  {(phase === 1 || phase === 2) && (
                     <ReferenceDot x={14} y={340} r={6} fill="#ef4444" stroke="#09090b" strokeWidth={2} />
                  )}
               </AreaChart>
            </ResponsiveContainer>

            {/* OVERLAYS */}
            <AnimatePresence>
               {/* 2. Alert appear scale */}
               {phase === 1 && (
                  <motion.div 
                     initial={{ opacity: 0, x: 20, scale: 0.9 }}
                     animate={{ opacity: 1, x: 0, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     className="absolute top-10 right-10 bg-[#111113] border border-red-500/20 p-4 rounded-xl shadow-[0_10px_40px_rgba(239,68,68,0.15)] w-64"
                  >
                     <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Critical Spike</span>
                     </div>
                     <p className="text-sm font-semibold text-white">EC2 anomaly detected</p>
                     <p className="text-2xl font-black text-red-400 mt-1">+240%</p>
                  </motion.div>
               )}

               {/* 3. System Reaction Pulse */}
               {phase === 2 && (
                  <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black px-6 py-3 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-3 font-bold text-sm"
                  >
                     <Zap className="w-4 h-4" />
                     Fixing Architecture...
                  </motion.div>
               )}

               {/* 5. Savings Resolution Counter */}
               {phase === 3 && (
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.9, y: 20 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     transition={{ type: 'spring', delay: 0.2 }}
                     className="absolute bottom-10 right-10 bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl shadow-[0_10px_40px_rgba(16,185,129,0.15)] flex flex-col items-end backdrop-blur-md"
                  >
                     <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Threat Neutrialized
                     </p>
                     <p className="text-3xl font-black text-white">
                        <AnimatedCounter value={840} prefix="+$" />
                     </p>
                     <p className="text-xs font-semibold text-zinc-400 mt-1">Saved automatically</p>
                  </motion.div>
               )}
            </AnimatePresence>

         </div>
      </div>
   );
};

const DriftSimulation = () => {
   const driftData = Array.from({ length: 50 }, (_, i) => ({ 
      x: i, 
      baseline: 100,
      drift: 100 + (i * 0.8) + (i > 30 ? (i - 30) * 4 : 0) + (Math.random() * 3),
      label: i === 35 ? 'Unattached EBS' : i === 45 ? 'RDS Leak' : null
   }));

   return (
      <div className="w-full h-[240px] relative pointer-events-none group">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 rounded-3xl blur-3xl opacity-20 pointer-events-none" />
         
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={driftData} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
               <defs>
                  <linearGradient id="driftWarning" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                     <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="steadyBaseline" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#52525b" stopOpacity={0.05}/>
                     <stop offset="95%" stopColor="#52525b" stopOpacity={0}/>
                  </linearGradient>
               </defs>
               
               {/* 1. Steady Baseline Area */}
               <Area type="monotone" dataKey="baseline" stroke="#3f3f46" strokeWidth={1} strokeDasharray="5 5" fill="url(#steadyBaseline)" isAnimationActive={false} />
               
               {/* 2. Slow Ominous Drift */}
               <Area 
                  type="monotone" 
                  dataKey="drift" 
                  stroke="#71717a" 
                  strokeWidth={2} 
                  fill="url(#driftWarning)" 
                  isAnimationActive={true} 
                  animationDuration={5000} 
               />

               {/* 3. Glowing Anomalies */}
               {driftData.map((d, i) => d.label ? (
                  <ReferenceDot 
                     key={i} 
                     x={d.x} 
                     y={d.drift} 
                     r={4} 
                     fill="#ef4444" 
                     stroke="#000" 
                     strokeWidth={2}
                     className="animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]" 
                  />
               ) : null)}
            </AreaChart>
         </ResponsiveContainer>

         {/* Drift Annotations */}
         <div className="absolute bottom-4 left-6 flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-2 h-[1px] bg-zinc-600 border border-dashed border-zinc-600" />
               <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Baseline Projection</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-red-500/30 animate-pulse" />
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Silent Drift (Cumulative)</span>
            </div>
         </div>
         
         <div className="absolute top-1/2 right-10 -translate-y-1/2 flex flex-col items-end opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
            <p className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em] mb-1">Leak Detected</p>
            <p className="text-sm font-bold text-white tracking-tight">EBS Volumes (us-east-1)</p>
         </div>
      </div>
   );
};

const MorphSimulation = () => {
   const [isStabilized, setIsStabilized] = useState(false);

   useEffect(() => {
      const interval = setInterval(() => setIsStabilized(prev => !prev), 3000);
      return () => clearInterval(interval);
   }, []);

   const chaoticData = Array.from({ length: 20 }, (_, i) => ({ x: i, y: 150 + (Math.random() * 100) }));
   const stableData = Array.from({ length: 20 }, (_, i) => ({ x: i, y: 100 + (Math.random() * 5) }));

   return (
      <div className="w-full h-[200px] bg-[#09090b] border border-white/5 rounded-2xl overflow-hidden relative mb-12">
         <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isStabilized ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 animate-pulse'}`} />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">{isStabilized ? 'Stabilized' : 'Chaotic Inefficiency'}</span>
         </div>
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={isStabilized ? stableData : chaoticData}>
               <defs>
                  <linearGradient id="morphGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={isStabilized ? "#10b981" : "#ef4444"} stopOpacity={0.2}/>
                     <stop offset="95%" stopColor={isStabilized ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                  </linearGradient>
               </defs>
               <Area 
                  type="monotone" 
                  dataKey="y" 
                  stroke={isStabilized ? "#10b981" : "#ef4444"} 
                  strokeWidth={2} 
                  fill="url(#morphGradient)" 
                  isAnimationActive={true} 
                  animationDuration={1000} 
               />
               {!isStabilized && chaoticData.map((d, i) => i % 4 === 0 ? (
                  <ReferenceDot key={i} x={d.x} y={d.y} r={4} fill="#ef4444" stroke="#09090b" strokeWidth={2} />
               ) : null)}
               {isStabilized && stableData.map((d, i) => i % 4 === 0 ? (
                  <ReferenceDot key={i} x={d.x} y={d.y} r={4} fill="#10b981" stroke="#09090b" strokeWidth={2} />
               ) : null)}
            </AreaChart>
         </ResponsiveContainer>
      </div>
   );
};
export function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen text-zinc-400 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative"
         style={{ 
            background: `
               radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.12), transparent 40%),
               radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.08), transparent 50%),
               linear-gradient(to bottom, #05060a, #070b12)
            `
         }}>
      
      {/* 1. Global Background Vignette Overlay (Fixed) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         {/* Radial Vignette to ensure seamless section fades */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* 2. Global Noise/Grain Overlay (Fixed & Dynamic) */}
      <div className="fixed inset-0 z-10 pointer-events-none opacity-[0.04] mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      <div className="relative z-20">
         {/* GLOBAL NAVBAR - Premium Glass Effect */}
         <nav className="fixed top-0 w-full z-50 bg-[#000000]/30 backdrop-blur-[40px] border-b border-white/[0.03] transition-all duration-500 hover:bg-[#000000]/40">
            <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
               <div className="flex items-center gap-4 text-white group cursor-pointer" onClick={() => window.location.href = '/'}>
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shadow-inner group-hover:bg-white/[0.05] transition-all overflow-hidden relative">
                     <div className="absolute inset-0 bg-indigo-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                     <Zap className="w-5 h-5 text-indigo-400 relative z-10" />
                  </div>
                  <div className="flex flex-col">
                     <span className="font-black text-sm tracking-[0.2em] uppercase leading-none mb-1">COSTINTEL</span>
                     <div className="flex items-center gap-1.5 leading-none">
                        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest opacity-70">Sentinel V4.2</span>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-10 text-sm font-bold tracking-tight">
                  <div className="hidden md:flex items-center gap-8">
                     <a href="#" className="text-zinc-400 hover:text-white transition-colors">Performance</a>
                     <a href="#" className="text-zinc-400 hover:text-white transition-colors">Anomaly Detection</a>
                     <a href="#" className="text-zinc-400 hover:text-white transition-colors">Docs</a>
                  </div>
                  <button onClick={onGetStarted} className="px-8 py-3 bg-white text-black rounded-full hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                     Launch App
                  </button>
               </div>
            </div>
         </nav>

         <main className="pt-24">
            
            {/* SECTION 1: NARRATIVE HERO */}
            <section className="max-w-7xl mx-auto px-6 pt-24 pb-48 relative overflow-hidden">
               {/* Ambient Backdrop Glow behind Hero Visual */}
               <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/[0.05] blur-[150px] rounded-full pointer-events-none" />

               <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32">
                  {/* LEFT: Asymmetric Text */}
                  <div className="flex-1 text-left relative z-10">
                     <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                         {/* Minimal Status (Moved from Floating Pill) */}
                         <div className="flex items-center gap-2 mb-10 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 opacity-60">
                            &bull; Sentinel Engine Active &bull;
                         </div>

                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.95] mb-8">
                           Your cloud bill<br />
                           doesn't spike randomly.<br />
                           <span className="text-zinc-600">They spike silently.</span>
                        </h1>
                        <p className="text-xl text-zinc-300 max-w-xl mb-12 leading-relaxed font-semibold opacity-90">
                           CostIntel detects anomalies, takes action automatically, and prevents waste before it hits your bill. No dashboards. No manual debugging. Just pure automation.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                           <button onClick={onGetStarted} className="w-full sm:w-auto px-12 py-5 bg-white text-black rounded-2xl text-[15px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.15)] active:scale-95 flex items-center justify-center gap-3">
                              Get Started <ArrowRight className="w-5 h-5" />
                           </button>
                           <button className="w-full sm:w-auto px-12 py-5 bg-white/[0.03] border border-white/10 text-white rounded-2xl text-[15px] font-black uppercase tracking-[0.2em] hover:bg-white/[0.08] transition-all flex items-center justify-center gap-3">
                              <Play className="w-5 h-5 fill-current" /> Watch Demo
                           </button>
                        </div>
                     </motion.div>
                  </div>

                  {/* RIGHT: Live Simulation */}
                  <div className="flex-1 w-full relative z-0">
                     <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}>
                        <HeroSystemSimulation />
                     </motion.div>
                  </div>
               </div>
            </section>

         {/* SECTION 2: THE INVISIBLE PROBLEM */}
         <section className="py-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 text-center">
               <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4">
                     Cloud costs don't break.<br/>
                     <span className="italic text-zinc-500 font-normal">They drift.</span>
                  </h2>
                  <p className="text-zinc-400 max-w-2xl mx-auto font-medium mb-16">A forgotten RDS instance here. An unattached EBS volume there. The leak is slow, but the final invoice is catastrophic.</p>
                  
                  {/* Expanded Drift Visual with Side Callouts */}
                  <div className="max-w-7xl mx-auto px-6 relative">
                     <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Side Stat 1 */}
                        <div className="hidden lg:block w-48 text-left border-l border-white/5 pl-6 py-4">
                           <p className="text-2xl font-black text-white">$124</p>
                           <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1 italic">Silent Leak / Day</p>
                        </div>

                        <div className="flex-1 w-full bg-white/[0.02] border border-white/5 rounded-[40px] p-10 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                           <DriftSimulation />
                        </div>

                        {/* Side Stat 2 */}
                        <div className="hidden lg:block w-48 text-right border-r border-white/5 pr-6 py-4">
                           <p className="text-2xl font-black text-white">41.2%</p>
                           <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1 italic">Projected Drift Trend</p>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         </section>

         {/* SECTION 3: DETECTION ENGINE */}
         <section className="py-32 max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-16">
               <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-4">We detect anomalies before they become bills.</h3>
                  <p className="text-zinc-400 font-medium text-lg max-w-md">Our neural engine maps your exact baseline telemetry, instantly flagging deviations milliseconds after they occur.</p>
               </div>
               <div className="flex-1 w-full space-y-4">
                  {/* Sliding Cards */}
                  <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-[#09090b] border border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-2xl">
                     <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                           <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded">HIGH</span>
                              <span className="text-white font-bold">Amazon EC2</span>
                           </div>
                           <p className="text-xs text-zinc-500">Unattached instances in us-east-1</p>
                        </div>
                     </div>
                     <span className="text-2xl font-black text-red-400">+32%</span>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }} className="bg-[#09090b] border border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-2xl">
                     <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                           <Activity className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 border border-orange-500/30 text-orange-400 text-[9px] font-black uppercase tracking-widest rounded">MED</span>
                              <span className="text-white font-bold">Amazon RDS</span>
                           </div>
                           <p className="text-xs text-zinc-500">Over-provisioned read replicas</p>
                        </div>
                     </div>
                     <span className="text-2xl font-black text-orange-400">+14%</span>
                  </motion.div>
               </div>
            </div>
         </section>

         {/* SECTION 4 & 5: AUTOMATED RESPONSE & SAVINGS IMPACT */}
         <section className="py-32 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
               <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="inline-flex w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 items-center justify-center mb-8 border border-emerald-500/20">
                     <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-6">Autonomous execution. Complete visibility.</h2>
                  
                  {/* Expanded Visual Transformation Simulation */}
                  <div className="max-w-7xl mx-auto mt-12 px-6">
                     <div className="bg-[#09090b]/40 border border-white/5 rounded-[48px] p-8 md:p-16 backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative group">
                        {/* Top Context Indicators */}
                        <div className="flex items-center justify-between mb-12">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                 <Activity className="w-5 h-5 text-indigo-400" />
                              </div>
                              <div className="text-left">
                                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Execution Mode</p>
                                 <p className="text-xs font-bold text-white uppercase tracking-wider">AI Autonomous Fix</p>
                              </div>
                           </div>
                           <div className="hidden md:flex gap-8">
                              <div className="text-right">
                                 <p className="text-[10px] font-black font-sans text-zinc-500 uppercase tracking-[0.2em] mb-1">Impact Fixed</p>
                                 <p className="text-xl font-black text-emerald-400 tracking-tighter">$1,240.00</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-[10px] font-black font-sans text-zinc-500 uppercase tracking-[0.2em] mb-1">Risk Mitigated</p>
                                 <p className="text-xl font-black text-red-400 tracking-tighter">100.0%</p>
                              </div>
                           </div>
                        </div>

                        <MorphSimulation />

                        {/* Floating Status Badge */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                           <div className="bg-white text-black px-6 py-3 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.4)] flex items-center gap-2 font-black text-xs uppercase tracking-widest animate-bounce">
                              <ShieldCheck className="w-4 h-4" /> System Corrected
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Narrative Before-After Flow */}
                  <div className="mt-16 bg-[#111113] border border-white/5 rounded-[32px] p-8 md:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative text-left group hover:border-emerald-500/20 transition-colors">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none transition-colors group-hover:bg-emerald-500/10" />

                     {/* 3 Column Transformer */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center relative z-10">
                        {/* 1. Before */}
                        <div className="space-y-3 bg-[#09090b] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50" />
                           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">Initial Context</p>
                           <h4 className="text-4xl font-black text-white px-2">$18,900</h4>
                           <p className="text-xs font-semibold text-red-400 opacity-80 px-2">Projected Monthly Spend</p>
                           <div className="h-2 w-full bg-red-500/10 rounded-full overflow-hidden mt-4 mx-2 relative">
                               <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 1 }} className="absolute h-full w-full bg-red-500/80 rounded-full" />
                           </div>
                        </div>

                        {/* 2. Action Flow */}
                        <div className="flex flex-col items-center justify-center space-y-3 relative py-4">
                           <div className="hidden md:block w-[120%] h-px bg-gradient-to-r from-red-500/20 via-emerald-500/60 to-emerald-500/20 absolute top-1/2 -translate-y-1/2 -z-10 -ml-10" />
                           <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, type: 'spring' }} className="bg-[#050505] border border-white/10 rounded-full px-5 py-2.5 flex items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.15)] z-10 w-max">
                              <Zap className="w-4 h-4 text-emerald-400" />
                              <span className="text-xs font-bold text-white tracking-wide">Auto-Optimization Applied</span>
                           </motion.div>
                           <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.7 }} className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.1em] text-center leading-relaxed">
                              &bull; Stopped 4 idle instances<br/>
                              &bull; Downgraded 2 RDS replicas
                           </motion.div>
                        </div>

                        {/* 3. After */}
                        <div className="space-y-3 bg-[#09090b] border border-emerald-500/20 p-6 rounded-2xl relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.05)]">
                           <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest pl-2">Optimized Context</p>
                           <h4 className="text-4xl font-black text-white px-2">$6,450</h4>
                           <div className="flex items-center gap-2 px-2">
                              <p className="text-xs font-semibold text-emerald-400 opacity-90">Actual Monthly Spend</p>
                              <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded ml-auto">
                                 -66%
                              </span>
                           </div>
                           <div className="h-2 w-full bg-[#050505] rounded-full overflow-hidden mt-4 mx-2 relative border border-white/5">
                               <motion.div initial={{ width: 0 }} whileInView={{ width: '34%' }} viewport={{ once: true }} transition={{ duration: 1, delay: 1 }} className="absolute h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full shadow-[0_0_10px_#10b981]" />
                           </div>
                        </div>
                     </div>

                     {/* Sub-Footer Metric */}
                     <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-end justify-between gap-6 relative z-10">
                        <div>
                           <p className="text-[10px] font-black text-zinc-500 mb-2 uppercase tracking-widest">Total Realized Impact</p>
                           <h3 className="text-6xl md:text-7xl font-black text-white tracking-tighter flex items-center gap-1">
                              <span className="text-emerald-500 text-5xl">$</span> 
                              <AnimatedCounter value={12450} />
                           </h3>
                           <p className="text-xs font-bold text-emerald-400 uppercase tracking-[0.15em] mt-3">Saved this week</p>
                        </div>
                        <div className="h-[70px] w-full md:w-[260px] bg-[#050505] border border-white/5 rounded-xl overflow-hidden p-2 relative pointer-events-none">
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={resolvedData.slice(8, 20)}>
                                 <defs>
                                    <linearGradient id="dropGradient" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                 </defs>
                                 <Area type="monotone" dataKey="y" stroke="#10b981" strokeWidth={2.5} fill="url(#dropGradient)" isAnimationActive={true} animationDuration={1500} animationBegin={800} />
                              </AreaChart>
                           </ResponsiveContainer>
                           <div className="absolute top-2 left-3 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Run-Rate Drop</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         </section>

         {/* SECTION 6: PRODUCT IN CONTEXT */}
         <section className="py-32 relative overflow-hidden">
            <div className="text-center mb-16 relative z-10">
               <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-6">Command your cloud securely.</h2>
               <p className="text-zinc-400">View telemetry, audit AI executions, and export compliance reports directly from your browser.</p>
            </div>
            
            {/* Expanded Dashboard Replica Section (Fills Gaps) */}
            <div className="max-w-[1500px] mx-auto px-6 relative overflow-visible">
               <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[64px] h-[880px] shadow-[0_60px_150px_rgba(0,0,0,0.9)] relative overflow-hidden group">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 origin-top scale-[0.82] w-[122%] pointer-events-none opacity-90 select-none transition-all duration-1000 group-hover:scale-[0.84]">
                     <OverviewPanel />
                  </div>
                  
                  {/* Overlay Tooltip & Significant Bottom Gradient to blend */}
                  <div className="absolute inset-x-0 bottom-0 h-[400px] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />
                  
                  {/* Side floating stats to fill "website" gaps */}
                  <div className="absolute top-20 left-12 hidden 2xl:block space-y-8 z-20">
                     <div className="p-4 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Live Telemetry</p>
                        <p className="text-lg font-black text-white">4.2k <span className="text-[9px] text-zinc-600">req/s</span></p>
                     </div>
                     <div className="p-4 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Response Latency</p>
                        <p className="text-lg font-black text-white">0.4ms</p>
                     </div>
                  </div>

                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2, repeat: Infinity, repeatType: 'reverse', duration: 2.5 }} className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white text-black text-[17px] font-black px-10 py-5 rounded-full shadow-[0_20px_60px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 z-50">
                     <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                     Autonomous Fix Applied Successfully
                  </motion.div>
               </motion.div>
            </div>
         </section>

         {/* SECTION 7: FINAL CTA */}
         <section className="py-40 relative overflow-hidden">
            {/* Radial glow background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
               <h2 className="text-5xl md:text-7xl font-semibold text-white tracking-tight mb-8 leading-[1.1]">
                  Stop reacting to your cloud bill.<br/>
                  <span className="text-zinc-500">Start controlling it.</span>
               </h2>
               <div className="flex justify-center">
                  <button onClick={onGetStarted} className="px-10 py-5 bg-white text-black rounded-2xl text-[15px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center gap-3">
                     Activate CostIntel <ArrowRight className="w-5 h-5" />
                  </button>
               </div>
            </div>
         </section>

      </main>
      </div>
    </div>
  );
}
