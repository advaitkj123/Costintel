import { useState } from 'react';
import { Server, ArrowRight, TrendingDown, Target, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

const mockChartData = [
  { day: 'Mon', baseline: 5200, optimized: 5200 },
  { day: 'Tue', baseline: 5400, optimized: 5350 },
  { day: 'Wed', baseline: 5800, optimized: 4100 },
  { day: 'Thu', baseline: 6100, optimized: 3800 },
  { day: 'Fri', baseline: 6300, optimized: 3750 },
  { day: 'Sat', baseline: 5900, optimized: 3600 },
  { day: 'Sun', baseline: 5800, optimized: 3600 },
];

const mockSavings = {
  total: 11250.00,
  before: 40500.00,
  after: 29250.00,
  percent: 28,
  trend: '+14% vs last week',
  services: [
    { name: 'Amazon EC2', before: 18200, after: 12100, saved: 6100, percent: 34 },
    { name: 'Amazon RDS', before: 8400, after: 6200, saved: 2200, percent: 26 },
    { name: 'Amazon S3', before: 4100, after: 3600, saved: 500, percent: 12 },
  ],
  drivers: [
    { action: 'Right-sized i-4a2c instances', saved: 3400.00 },
    { action: 'Deleted 14 unattached EBS volumes', saved: 1150.00 },
    { action: 'Enabled S3 Intelligent-Tiering', saved: 500.00 },
    { action: 'Terminated 3 idle dev clusters', saved: 2200.00 },
  ]
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111113] border border-white/10 p-4 rounded-xl shadow-2xl">
        <p className="text-white font-bold mb-2">{label}</p>
        <div className="space-y-1 text-sm">
           <p className="text-zinc-500">Baseline: <span className="text-zinc-300">${payload[0].value}</span></p>
           <p className="text-emerald-500 font-bold">Optimized: ${payload[1].value}</p>
        </div>
      </div>
    );
  }
  return null;
};

export function SavingsPanel() {
  return (
    <div className="max-w-[1200px] mx-auto pt-6 pb-24 antialiased text-white/90">
      
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Savings Portfolio</h1>
        <p className="text-sm text-zinc-400">Financial transformation reporting: cause, action, and realized ROI.</p>
      </div>

      {/* BEFORE VS AFTER + TOTAL HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Before -> After Block */}
        <div className="lg:col-span-2 bg-[#111113]/50 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
           <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Target className="w-4 h-4 text-zinc-500" />
              Impact Transformation
           </h2>
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              
              <div className="flex-1">
                 <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-2">Baseline Spend</p>
                 <p className="text-4xl font-bold text-red-400 opacity-80">${mockSavings.before.toLocaleString()}</p>
              </div>

              <div className="flex flex-col items-center justify-center -mt-4 shrink-0">
                 <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full mb-2">-{mockSavings.percent}% Reduction</span>
                 <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                 </div>
              </div>

              <div className="flex-1 md:text-right">
                 <p className="text-xs text-emerald-500 uppercase font-bold tracking-wider mb-2">Optimized Spend</p>
                 <p className="text-5xl font-black text-emerald-400 tracking-tight">${mockSavings.after.toLocaleString()}</p>
                 <p className="text-xs text-zinc-500 mt-2 font-medium">Active weekly run-rate</p>
              </div>

           </div>
        </div>

        {/* Total Savings Block */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 to-primary" />
          <p className="text-sm font-semibold text-indigo-300 uppercase tracking-widest mb-4">Total Realized Savings</p>
          <h2 className="text-5xl font-black tracking-tight text-white mb-3">${mockSavings.total.toLocaleString()}</h2>
          <div className="flex items-center gap-2">
             <TrendingDown className="w-4 h-4 text-emerald-400" />
             <span className="text-sm font-bold text-emerald-400">{mockSavings.trend}</span>
          </div>
        </div>

      </div>

      {/* SAVINGS OVER TIME GRAPH */}
      <div className="bg-[#111113]/50 border border-white/5 rounded-3xl p-8 mb-8">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-400" />
              Optimization Trajectory
           </h2>
           <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-zinc-600" /> Baseline Projection
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> Actual Cost
              </div>
           </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} axisLine={false} />
              <YAxis 
                 stroke="rgba(255,255,255,0.2)" 
                 fontSize={12} 
                 axisLine={false} 
                 tickLine={false}
                 tickFormatter={(val) => `$${val}`}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="baseline" 
                stroke="#52525b" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="none" 
              />
              <Area 
                type="monotone" 
                dataKey="optimized" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorOptimized)" 
              />
              <ReferenceDot x="Wed" y={4100} r={6} fill="#10b981" stroke="#09090b" strokeWidth={2} />
              <ReferenceDot x="Wed" y={5800} r={4} fill="#52525b" stroke="#09090b" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SERVICE BREAKDOWN & DRIVERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Optimization by Service */}
        <div className="bg-[#111113]/50 border border-white/5 rounded-3xl p-8">
          <h3 className="text-sm font-semibold text-white mb-8 flex items-center gap-2">
            <Server className="w-4 h-4 text-zinc-400" />
            Optimization By Service
          </h3>
          <div className="space-y-8">
            {mockSavings.services.map((svc, idx) => (
              <div key={idx} className="group cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white">{svc.name}</span>
                  <div className="flex items-center gap-3">
                     <span className="text-xs text-zinc-500 line-through">${svc.before.toLocaleString()}</span>
                     <ArrowRight className="w-3 h-3 text-zinc-600" />
                     <span className="text-sm font-bold text-emerald-400">${svc.after.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                   <div className="flex-1 h-2 bg-black rounded-full overflow-hidden border border-white/5 relative">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${svc.percent}%` }}
                       transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.1 }}
                       className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full" 
                     />
                   </div>
                   <div className="w-20 text-right">
                      <span className="text-xs font-bold text-emerald-500 uppercase">-{svc.percent}%</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Savings Drivers */}
        <div className="bg-[#111113]/50 border border-white/5 rounded-3xl p-8">
          <h3 className="text-sm font-semibold text-white mb-8 flex items-center gap-2">
            <Zap className="w-4 h-4 text-zinc-400" />
            Key Savings Drivers
          </h3>
          <div className="space-y-4">
            {mockSavings.drivers.map((driver, idx) => (
               <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase">A.I.</span>
                     </div>
                     <span className="text-sm font-medium text-white">{driver.action}</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-400">${driver.saved.toLocaleString()}</span>
               </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
