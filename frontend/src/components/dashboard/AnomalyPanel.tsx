import { useState, useEffect } from 'react';
import { Filter, Zap, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAnomalies, getActions, AnomalyResponse, ActionResponse } from '../../services/api';

export function AnomalyPanel() {
  const [filter, setFilter] = useState('All');
  const [anomalies, setAnomalies] = useState<AnomalyResponse[]>([]);
  const [logs, setLogs] = useState<ActionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [anoms, acts] = await Promise.all([
          getAnomalies(),
          getActions()
        ]);
        setAnomalies(anoms);
        setLogs(acts);
      } catch (err) {
        console.error("Failed to fetch anomaly data:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered = anomalies.filter(a => filter === 'All' || a.severity === filter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] antialiased text-white/90">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
        <p className="text-zinc-500 font-medium animate-pulse">Scanning infrastructure telemetry...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto pt-6 pb-24 antialiased text-white/90">
      
      {/* HEADER & FILTERS */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2 flex items-center gap-3">
             <ShieldAlert className="w-8 h-8 text-red-500" />
             Active Anomalies
          </h1>
          <p className="text-sm text-zinc-400">Detecting abnormal spending patterns via Sentinel AI telemetry.</p>
        </div>

        <div className="flex items-center gap-3 bg-[#111113]/80 p-1.5 rounded-xl border border-white/5">
           <Filter className="w-4 h-4 text-zinc-500 ml-2" />
           {['All', 'High', 'Medium', 'Low'].map(f => (
             <button 
               key={f}
               onClick={() => setFilter(f)}
               className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${filter === f ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      {/* ANOMALIES LIST */}
      <div className="space-y-4">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-zinc-500 bg-[#111113]/50 border border-white/5 rounded-2xl">
              <ShieldAlert className="w-12 h-12 text-emerald-500/50 mx-auto mb-4" />
              <p>No anomalies detected matching the current filter.</p>
            </motion.div>
          ) : (
            filtered.map(prob => (
              <motion.div 
                key={prob.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-[#111113]/50 border ${prob.severity === 'High' && !prob.is_resolved ? 'border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.05)]' : 'border-white/5'} p-6 rounded-2xl hover:bg-white/[0.02] transition-colors relative overflow-hidden group`}
              >
                {prob.is_resolved && (
                   <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold">
                         <CheckCircle2 className="w-4 h-4" />
                         Fix Deployed
                      </div>
                   </div>
                )}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${prob.severity === 'High' ? 'bg-red-500/10 text-red-500' : prob.severity === 'Medium' ? 'bg-orange-500/10 text-orange-500' : 'bg-zinc-500/10 text-zinc-400'}`}>
                        {prob.severity} Severity
                      </span>
                      <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest">{new Date(prob.timestamp).toLocaleString()}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{prob.resource_id}</h3>
                    <p className="text-sm text-zinc-400 font-medium">{prob.description}</p>
                  </div>

                  <div className="flex items-center gap-12">
                     <div className="text-right">
                       <p className="text-sm font-semibold text-red-400 mb-0.5 max-w-[150px] truncate">{prob.anomaly_type}</p>
                       <p className="text-lg font-bold text-white tracking-tight">Investigating</p>
                     </div>
                     
                     <div className="flex flex-col gap-2 min-w-[120px]">
                        <button className="w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-colors">
                           View Details
                        </button>
                        {!prob.is_resolved && (
                          <button className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2">
                             <Zap className="w-3 h-3" /> Auto Fix
                          </button>
                        )}
                     </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* ANOMALY DETECTION LOG TABLE (Using Actions as proxy for logs) */}
      <div className="mt-16 bg-[#111113]/50 border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
           <h2 className="text-lg font-semibold text-white tracking-tight">Anomaly Resolution Log</h2>
           <p className="text-xs text-zinc-500 mt-1">Actions taken to mitigate anomalies.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Action Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Estimated Savings</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-zinc-500">No actions recorded yet.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm text-zinc-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-mono text-zinc-300">{log.action_type}</td>
                    <td className="px-6 py-4 text-sm text-zinc-300">{log.description}</td>
                    <td className="px-6 py-4 text-sm text-emerald-400 font-bold">${log.savings_achieved.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded text-xs font-bold uppercase tracking-wide bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                        Resolved
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
