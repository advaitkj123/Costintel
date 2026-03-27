import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

const initialFeed = [
  { id: 1, type: 'anomaly', message: 'Spike detected in EC2 runtime costs', time: 'Just now' },
  { id: 2, type: 'action', message: 'Auto-pilot stopped idle EC2 instance i-0abcd8x...', time: '2m ago' },
  { id: 3, type: 'info', message: 'AWS Cost Explorer sync completed successfully', time: '15m ago' },
];

export function LiveActivityFeed() {
  const [feed, setFeed] = useState(initialFeed);
  const [isLive, setIsLive] = useState(true);

  // Simulate incoming live WebSocket data
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      const types = ['anomaly', 'action', 'info'];
      const messages = [
        'New lambda execution traffic spike detected',
        'Auto-scaled ECS cluster to prevent over-provisioning',
        'Daily budget threshold reached for Dev environment',
        'Released unattached EBS volume vol-8947b...',
      ];
      
      const newEvent = {
        id: Date.now(),
        type: types[Math.floor(Math.random() * types.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        time: 'Just now'
      };
      
      setFeed(prev => [newEvent, ...prev].slice(0, 5));
    }, 12000);
    
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="glass rounded-[2rem] p-8 h-full flex flex-col relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary" />
          Live Activity
        </h3>
        <button 
          onClick={() => setIsLive(!isLive)}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
            isLive ? 'bg-success/10 text-success border-success/20' : 'bg-white/5 text-zinc-500 border-white/5'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-success animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-600'}`} />
          {isLive ? 'Syncing' : 'Paused'}
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-hidden relative">
        {feed.map((item, i) => (
          <div 
            key={item.id} 
            className="flex gap-5 animate-in slide-in-from-right-4 fade-in duration-700"
          >
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-inner transition-transform hover:scale-110 ${
                item.type === 'anomaly' ? 'bg-danger/10 text-danger border-danger/20' :
                item.type === 'action' ? 'bg-warning/10 text-warning border-warning/20' :
                'bg-primary/10 text-primary border-primary/20'
              }`}>
                {item.type === 'anomaly' ? <AlertTriangle className="w-5 h-5" /> :
                 item.type === 'action' ? <Zap className="w-5 h-5" /> :
                 <CheckCircle2 className="w-5 h-5" />}
              </div>
              {i !== feed.length - 1 && <div className="w-px h-full bg-gradient-to-b from-white/10 to-transparent my-2" />}
            </div>
            <div className="pb-2">
              <p className="text-sm font-bold text-zinc-200 leading-relaxed mb-1 italic tracking-tight">{item.message}</p>
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5">
         <button className="w-full py-2 text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">
           View Full Audit Logs
         </button>
      </div>
    </div>
  );
}
