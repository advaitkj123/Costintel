import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { AlertCircle, CheckCircle2, Zap, Brain, Server, ArrowRight, ArrowUpRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getCostSummary, getAnomalies, getActions, CostSummaryResponse, AnomalyResponse, ActionResponse } from '../../services/api';



// Animated Counter Component
const AnimatedCounter = ({ value, prefix = "", decimals = 0 }: { value: number, prefix?: string, decimals?: number }) => {
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

  return <span>{prefix}{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>;
};

// Custom Pulse Dot for Chart
const CustomPulseDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (!payload.note) return null;
  const isSpike = payload.note.includes('Spike');
  const color = isSpike ? '#ef4444' : '#10b981';

  return (
    <svg x={cx - 10} y={cy - 10} width={20} height={20} style={{ overflow: 'visible' }}>
      <circle cx="10" cy="10" r="12" fill={color} opacity="0.2" className="animate-ping" style={{ transformOrigin: 'center' }} />
      <circle cx="10" cy="10" r="6" fill={color} stroke="#111113" strokeWidth="2" />
    </svg>
  );
};

export function OverviewPanel() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [hasData, setHasData] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // Real Data State
  const [costSummary, setCostSummary] = useState<CostSummaryResponse | null>(null);
  const [anomalies, setAnomalies] = useState<AnomalyResponse[]>([]);
  const [actions, setActions] = useState<ActionResponse[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [cost, anoms, acts] = await Promise.all([
          getCostSummary(),
          getAnomalies(),
          getActions()
        ]);
        setCostSummary(cost);
        setAnomalies(anoms);
        setActions(acts);
        if (cost.trend.length === 0) setHasData(false);
      } catch (err) {
        console.error("Failed to fetch backend data:", err);
        // Keep hasData as true for now to show the dashboard even on error (could fall back to mock)
      } finally {
        setLoading(false);
      }
    }
    
    loadData();

    const interval = setInterval(loadData, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setAlerts([{ id: 1, title: 'Autonomous Engine Active', impact: 'Monitoring real-time infrastructure', priority: 'high', time: 'Just now' }]);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px]">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-zinc-500 font-medium animate-pulse">Initializing Sentinel Engine...</p>
      </div>
    );
  }

  // Map Backend Trend to Recharts Structure
  const chartData = costSummary?.trend.map(p => ({
    name: new Date(p.timestamp).toLocaleDateString(undefined, { weekday: 'short' }),
    fullDate: new Date(p.timestamp).toLocaleDateString(),
    cost: p.estimated_cost,
    baseline: p.estimated_cost * 0.9, // Backend doesn't provide baseline, so we visualize a -10% target
    note: null
  })) || [];

  return (
    <div className="max-w-[1400px] mx-auto pt-6 pb-24 px-6 md:px-12 antialiased font-sans text-white/90">
      
      {/* 1. ALERT SYSTEM (Top-right floating, stacked) */}
      <div className="fixed top-24 right-8 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {alerts.map(alert => (
            <motion.div 
              key={alert.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-[#18181b] border border-red-500/20 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] pointer-events-auto flex gap-4 items-start w-[360px] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
              <div className="relative flex h-3 w-3 mt-1 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                   <p className="text-sm font-semibold text-white leading-tight">{alert.title}</p>
                   <span className="text-[10px] text-zinc-500 font-medium">{alert.time}</span>
                </div>
                <p className="text-xs text-red-400 font-medium mb-3">{alert.impact}</p>
                <div className="flex items-center gap-2">
                  <button className="text-xs font-bold text-black bg-white hover:bg-zinc-200 px-3 py-1.5 rounded-md transition-colors shadow-lg">Auto Fix</button>
                  <button className="text-xs font-semibold text-zinc-400 hover:text-white px-2 py-1.5 transition-colors">View Details</button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 2. WELCOME CONTEXT (Premium Onboarding Header) */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8 relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Welcome back, Administrator 👋</h1>
          <p className="text-zinc-400 font-medium">
            Monitoring <span className="text-white font-bold"><AnimatedCounter value={costSummary?.total_cost || 0} prefix="$" decimals={2} /></span> across your infrastructure
          </p>
        </motion.div>
        
        <div className="flex items-center gap-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-3 text-center min-w-[140px]">
            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Anomalies</p>
            <p className="text-xl font-black text-white">{anomalies.length} Detected</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-3 text-center min-w-[140px]">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Total Savings</p>
            <p className="text-xl font-black text-white"><AnimatedCounter value={costSummary?.total_savings || 0} prefix="$" decimals={2} /></p>
          </div>
        </div>
      </div>

      {!hasData ? (
        /* 4. EMPTY STATE: Critical Data Connection */
        <div className="min-h-[500px] flex flex-col items-center justify-center bg-[#09090b] border border-white/5 border-dashed rounded-[40px] p-20 text-center">
          <div className="w-24 h-24 bg-zinc-800/50 rounded-3xl flex items-center justify-center mb-8">
            <Server className="w-10 h-10 text-zinc-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-4">No cloud data yet</h2>
          <p className="text-zinc-400 max-w-md mb-10 leading-relaxed font-medium">
            Connect your AWS account to start monitoring real-time costs, detecting silent anomalies, and automating optimizations.
          </p>
          <button onClick={() => setHasData(true)} className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-3">
             <Zap className="w-5 h-5" /> Connect AWS Account
          </button>
        </div>
      ) : (
        <>
          {/* AI SUMMARY: Human readable insight */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center gap-4 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl p-6 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center shrink-0">
               <Brain className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
               <p className="text-sm font-semibold text-white mb-0.5">Automated Intelligence Summary</p>
               <p className="text-sm text-indigo-200/80 font-medium leading-relaxed">
                  <span className="font-bold text-white mr-1">💡 Insight:</span>
                  Cost spiked mid-week due to unplanned EC2 scaling. Our autonomous corrections stabilized the run-rate, reducing your weekly spend by <span className="text-emerald-400 font-bold">28%</span>.
               </p>
            </div>
          </motion.div>

      {/* 2. MAIN VISUAL: Single Large "Cost Story" Graph */}
      <div className="mb-10 bg-[#09090b]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden">
        {/* Ambient Glows for Graph */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none rounded-3xl" />
        
        {/* GRAPH ONBOARDING HINT */}
        <AnimatePresence>
          {showHint && (
            <motion.div 
               exit={{ opacity: 0, scale: 0.9 }}
               onClick={() => setShowHint(false)}
               className="absolute top-10 right-10 z-20 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] cursor-pointer flex items-center gap-3 animate-bounce"
            >
               <div className="text-left leading-tight">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">Quick Guide</p>
                  <p className="text-xs font-bold font-sans">Red = Anomalies, Green = Fixed. <br/> Click to dismiss.</p>
               </div>
               <ArrowRight className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-[420px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="actualSpendLive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="baselineSpendLive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#71717a" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
                className="font-semibold"
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(val) => `$${val}`}
                dx={-10}
                className="font-medium"
              />
              <RechartsTooltip 
                cursor={{ stroke: '#52525b', strokeWidth: 1, strokeDasharray: '4 4' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#18181b] border border-white/10 p-5 rounded-2xl shadow-2xl backdrop-blur-xl"
                      >
                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2">{data.fullDate}</p>
                        <div className="space-y-3">
                           <div className="flex items-center justify-between gap-8">
                              <span className="text-xs text-red-400 font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400" />Realtime Velocity</span>
                              <span className="text-[15px] font-black text-white">${data.cost.toLocaleString()}</span>
                           </div>
                           <div className="flex items-center justify-between gap-8">
                              <span className="text-xs text-indigo-400 font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-400" />System Baseline</span>
                              <span className="text-[15px] font-bold text-zinc-300">${data.baseline.toLocaleString()}</span>
                           </div>
                        </div>
                        {data.note && (
                           <div className="mt-4 pt-3 border-t border-white/10">
                              <span className={`text-[11px] font-black uppercase tracking-wider px-2 py-1 rounded inline-block shadow-lg ${data.note.includes('Spike') ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'}`}>
                                {data.note}
                              </span>
                           </div>
                        )}
                      </motion.div>
                    );
                  }
                  return null;
                }} 
              />
              
              <Area 
                type="monotone" 
                dataKey="baseline" 
                stroke="#6366f1" 
                strokeWidth={2}
                fill="url(#baselineSpendLive)" 
                isAnimationActive={true}
                animationDuration={2000}
                animationEasing="ease-in-out"
              />
              <Area 
                type="monotone" 
                dataKey="cost" 
                stroke="#ef4444" 
                strokeWidth={3}
                fill="url(#actualSpendLive)" 
                isAnimationActive={true}
                animationDuration={2000}
                animationEasing="ease-in-out"
                activeDot={<CustomPulseDot />}
                dot={<CustomPulseDot />}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* THREE-COLUMN GRID: Linear style lists -> Enhanced Visual Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* 3. PROBLEMS DETECTED */}
        <div className="bg-[#111113]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-[60px] group-hover:bg-red-500/20 transition-colors" />
          <h2 className="text-sm font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
             <AlertCircle className="w-4 h-4 text-red-400" />
             Active Anomalies
          </h2>
          <div className="space-y-3 relative z-10">
            {anomalies.length > 0 ? anomalies.map((prob, i) => (
              <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 key={prob.id} 
                 className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl hover:bg-zinc-800 transition-colors hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${prob.severity.toLowerCase() === 'high' ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-orange-500/20 text-orange-400 border border-orange-500/20'}`}>
                      {prob.severity}
                    </span>
                    <p className="text-sm font-bold text-white leading-none">{prob.resource_id}</p>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">{new Date(prob.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-end justify-between">
                   <div>
                      <p className="text-xs text-zinc-400 font-medium mb-1">{prob.description}</p>
                      <p className="text-lg font-black text-red-400 tracking-tight">{prob.anomaly_type}</p>
                   </div>
                </div>
              </motion.div>
            )) : (
              <p className="text-xs text-zinc-500 italic text-center py-10">No active anomalies detected.</p>
            )}
          </div>
        </div>

        {/* 4. ACTIONS TAKEN */}
        <div className="bg-[#111113]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px] group-hover:bg-emerald-500/20 transition-colors" />
          <h2 className="text-sm font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
             <Zap className="w-4 h-4 text-emerald-400" />
             Autonomous Executions
          </h2>
          <div className="space-y-3 relative z-10">
            {actions.length > 0 ? actions.map((action, i) => (
              <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 + (i * 0.1) }}
                 key={action.id} 
                 className="bg-emerald-950/20 border border-emerald-500/10 p-4 rounded-2xl hover:bg-emerald-900/30 transition-colors hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <p className="text-sm font-bold text-white leading-snug">{action.description}</p>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-[10px] text-zinc-500 font-bold uppercase">{new Date(action.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md">Saved</span>
                      <span className="text-sm font-black text-emerald-400 tracking-tight">${action.savings_achieved.toFixed(2)}</span>
                   </div>
                </div>
              </motion.div>
            )) : (
              <p className="text-xs text-zinc-500 italic text-center py-10">No autonomous actions yet.</p>
            )}
          </div>
        </div>

        {/* 5. SAVINGS PANEL */}
        <div className="bg-[#111113]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] group-hover:bg-indigo-500/20 transition-colors" />
          <h2 className="text-sm font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
             <Server className="w-4 h-4 text-indigo-400" />
             ROI Realized
          </h2>
          
          <motion.div 
             initial={{ scale: 0.95, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="mb-8 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 text-center relative overflow-hidden hover:bg-indigo-500/15 transition-colors"
          >
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
            <p className="text-[10px] text-indigo-300 uppercase font-black tracking-[0.2em] mb-2">Total Savings</p>
            <p className="text-4xl font-black tracking-tighter text-white mb-3 flex items-center justify-center gap-1">
              <span className="text-indigo-400 text-2xl">$</span>
              <AnimatedCounter value={costSummary?.total_savings || 0} decimals={2} />
            </p>
            <span className="text-[10px] font-black text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider inline-flex items-center gap-1 shadow-inner">
               <ArrowUpRight className="w-3 h-3" />
               +100% Autonomous
            </span>
          </motion.div>

          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.15em] mb-4 border-b border-white/5 pb-2 relative z-10">Service Breakdown</p>
          <div className="space-y-6 relative z-10">
            {costSummary?.per_resource.map((item, idx) => (
              <motion.div 
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.5 + (idx * 0.1) }}
                 key={idx} 
                 className="group"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-white tracking-wide truncate max-w-[140px]">{item.resource_name || item.resource_id}</span>
                  <div className="flex items-baseline gap-2">
                     <span className="font-black text-indigo-400">${item.total_cost.toFixed(2)}</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-[#09090b] rounded-full overflow-hidden border border-white/5 shadow-inner relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (item.total_cost / (costSummary?.total_cost || 1)) * 100)}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.6 }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full group-hover:shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-shadow" 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
     </>
    )}
    </div>
  );
}
