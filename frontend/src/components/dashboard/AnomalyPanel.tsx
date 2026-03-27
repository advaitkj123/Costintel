import { useState } from 'react';
import { Filter, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const mockAnomalies = [
  { id: 1, service: 'Amazon EC2', impact: '+32%', cost: '+$1,800/wk', severity: 'High', time: 'Wed 14:20', details: 'Unattached instances in us-east-1', isFixed: false },
  { id: 2, service: 'Amazon RDS', impact: '+14%', cost: '+$420/wk', severity: 'Medium', time: 'Thu 09:15', details: 'Over-provisioned memory bounds', isFixed: false },
  { id: 3, service: 'Amazon S3', impact: '+8%', cost: '+$112/wk', severity: 'Low', time: 'Thu 21:05', details: 'Un-tiered standard storage blobs', isFixed: true },
  { id: 4, service: 'Amazon EKS', impact: '+45%', cost: '+$2,400/wk', severity: 'High', time: 'Mon 04:30', details: 'Failed node downscaling', isFixed: true },
];

const mockLogData = [
  { id: 1, time: '2024-03-15 14:32', resource: 'ec2-prod-api-01', issue: 'CPU spike to 98%', action: 'Auto-scaled to 3 instances', status: 'resolved' },
  { id: 2, time: '2024-03-15 13:10', resource: 'rds-main-db', issue: 'Unusual query pattern', action: 'Alert sent to team', status: 'detected' },
  { id: 3, time: '2024-03-15 11:45', resource: 's3-media-bucket', issue: 'Storage cost anomaly', action: 'Lifecycle policy applied', status: 'resolved' },
  { id: 4, time: '2024-03-15 09:20', resource: 'lambda-processor', issue: 'Invocation count 5x normal', action: 'Investigating', status: 'detected' },
  { id: 5, time: '2024-03-14 22:05', resource: 'ec2-staging-02', issue: 'Idle instance detected', action: 'Instance stopped', status: 'resolved' },
];

export function AnomalyPanel() {
  const [filter, setFilter] = useState('All');

  const filtered = mockAnomalies.filter(a => filter === 'All' || a.severity === filter);

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
        {filtered.map(prob => (
          <motion.div 
            key={prob.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-[#111113]/50 border ${prob.severity === 'High' && !prob.isFixed ? 'border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.05)]' : 'border-white/5'} p-6 rounded-2xl hover:bg-white/[0.02] transition-colors relative overflow-hidden group`}
          >
            {prob.isFixed && (
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
                  <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest">{prob.time}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{prob.service}</h3>
                <p className="text-sm text-zinc-400 font-medium">{prob.details}</p>
              </div>

              <div className="flex items-center gap-12">
                 <div className="text-right">
                   <p className="text-sm font-semibold text-red-400 mb-0.5">{prob.impact}</p>
                   <p className="text-2xl font-bold text-white tracking-tight">{prob.cost}</p>
                 </div>
                 
                 <div className="flex flex-col gap-2 min-w-[120px]">
                    <button className="w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-colors">
                       View Details
                    </button>
                    <button className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2">
                       <Zap className="w-3 h-3" /> Auto Fix
                    </button>
                 </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ANOMALY DETECTION LOG TABLE */}
      <div className="mt-16 bg-[#111113]/50 border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
           <h2 className="text-lg font-semibold text-white tracking-tight">Anomaly Detection Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Action Taken</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockLogData.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm text-zinc-400 whitespace-nowrap">{log.time}</td>
                  <td className="px-6 py-4 text-sm font-mono text-zinc-300">{log.resource}</td>
                  <td className="px-6 py-4 text-sm text-zinc-300">{log.issue}</td>
                  <td className="px-6 py-4 text-sm text-zinc-400">{log.action}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                      log.status === 'resolved' 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                        : 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
