import { useState, useEffect } from 'react';
import { CheckCircle2, Zap, Settings2, SquareTerminal, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getActions, ActionResponse } from '../../services/api';

export function ActionsPanel() {
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [actions, setActions] = useState<ActionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActions() {
      try {
        const data = await getActions();
        setActions(data);
      } catch (err) {
        console.error("Failed to fetch actions:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchActions();
    const int = setInterval(fetchActions, 30000);
    return () => clearInterval(int);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] antialiased text-white/90">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-zinc-500 font-medium animate-pulse">Loading execution logs...</p>
      </div>
    );
  }

  // Calculate dynamics
  const totalMonthlySavings = actions.reduce((sum, act) => sum + (act.savings_achieved * 4), 0); // approx monthly

  return (
    <div className="max-w-[1200px] mx-auto pt-6 pb-24 antialiased text-white/90">
      
      {/* HEADER & CONTROLS */}
      <div className="mb-12 flex flex-col items-start gap-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2 flex items-center gap-3">
             <SquareTerminal className="w-8 h-8 text-emerald-500" />
             Execution Log
          </h1>
          <p className="text-sm text-zinc-400">History of all autonomous and manual cost optimizations.</p>
        </div>

        <div className="flex items-center gap-4 bg-[#111113]/50 p-6 rounded-2xl border border-white/5 w-full max-w-2xl">
           <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Zap className={`w-6 h-6 ${automationEnabled ? 'text-indigo-400' : 'text-zinc-600'}`} />
           </div>
           <div className="flex-1">
              <h3 className="text-base font-bold text-white mb-1">Autonomous Optimization</h3>
              <p className="text-xs text-zinc-400">Sentinel AI will execute safe, non-destructive savings automatically.</p>
           </div>
           <div className="flex flex-col gap-2 shrink-0">
              <button 
                onClick={() => setAutomationEnabled(!automationEnabled)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${automationEnabled ? 'bg-indigo-600 text-white' : 'bg-white/10 text-zinc-400'}`}
              >
                {automationEnabled ? 'Active' : 'Disabled'}
              </button>
           </div>
        </div>
      </div>

      {/* ACTIONS LOG */}
      <div className="space-y-4">
        <AnimatePresence>
          {actions.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-zinc-500 italic">
              No recent autonomous executions found.
            </motion.div>
          )}
          {actions.slice(0, 5).map((action, idx) => (
            <motion.div 
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#111113]/50 border border-white/5 p-6 rounded-2xl hover:bg-white/[0.02] transition-colors group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400">
                        Autonomous
                      </span>
                      <span className="text-xs text-zinc-500 font-medium">{new Date(action.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{action.description}</h3>
                    <p className="text-xs text-zinc-500 font-mono">Action Type: {action.action_type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 shrink-0">
                   <div className="text-right">
                     <p className="text-xs font-medium text-zinc-500 mb-0.5 uppercase tracking-wider">Estimated Savings</p>
                     <p className="text-2xl font-bold text-emerald-400 tracking-tight">${action.savings_achieved.toFixed(2)}</p>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Manual Action Button */}
      <div className="mt-8 mb-16">
         <button className="w-full border border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 text-zinc-400 hover:text-white rounded-2xl py-6 flex items-center justify-center gap-3 transition-all text-sm font-semibold">
           <Settings2 className="w-5 h-5" />
           Run Manual Diagnostics & Optimization
         </button>
      </div>

      {/* OPTIMIZATION EXECUTIONS SECTION */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-white mb-1">Optimization Executions</h2>
          <p className="text-sm text-zinc-400">{actions.length} total — saving ${totalMonthlySavings.toFixed(2)}/mo</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#111113]/50 border border-white/5 p-6 rounded-2xl flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
             </div>
             <div>
                <p className="text-2xl font-bold text-white leading-none mb-1">{actions.length}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Completed</p>
             </div>
          </div>
          <div className="bg-[#111113]/50 border border-white/5 p-6 rounded-2xl flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <div>
                <p className="text-2xl font-bold text-white leading-none mb-1">0</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">In Progress</p>
             </div>
          </div>
          <div className="bg-[#111113]/50 border border-white/5 p-6 rounded-2xl flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-indigo-400" />
             </div>
             <div>
                <p className="text-2xl font-bold text-white leading-none mb-1">${totalMonthlySavings.toFixed(2)}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Monthly Savings</p>
             </div>
          </div>
        </div>

        {/* Execution History Table */}
        <div className="bg-[#111113]/50 border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
             <h3 className="text-lg font-semibold text-white tracking-tight">Execution History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Impact Details</th>
                  <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Savings</th>
                  <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Executed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {actions.length === 0 ? (
                   <tr><td colSpan={6} className="px-6 py-8 text-center text-zinc-500 text-sm">No executions recorded.</td></tr>
                ) : actions.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-zinc-400 whitespace-nowrap">OPT-{row.id.toString().padStart(3, '0')}</td>
                    <td className="px-6 py-4 text-sm font-medium text-white">{row.description}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{row.impact_description || row.action_type}</td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-400">${row.savings_achieved.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        completed
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500 text-right whitespace-nowrap">{new Date(row.timestamp).toLocaleDateString()} {new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
