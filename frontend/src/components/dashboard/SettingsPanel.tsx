import { useState } from 'react';
import { User, Bell, Key, CreditCard, Shield, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

export function SettingsPanel() {
  const [activeMenu, setActiveMenu] = useState('profile');

  const menuItems = [
    { id: 'profile', label: 'Profile & Account', icon: User },
    { id: 'notifications', label: 'Alert Preferences', icon: Bell },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
  ];

  return (
    <div className="max-w-[1200px] mx-auto pt-6 pb-24 antialiased text-white/90">
      
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Workspace Settings</h1>
        <p className="text-sm text-zinc-400">Manage your CostIntel account, billing, and API integrations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* SETTINGS SIDEBAR */}
        <div className="w-full lg:w-64 shrink-0 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeMenu === item.id 
                  ? 'bg-zinc-800/50 text-white border border-white/10 shadow-lg' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
              }`}
            >
              <item.icon className={`w-4 h-4 ${activeMenu === item.id ? 'text-indigo-400' : 'text-zinc-500'}`} />
              {item.label}
            </button>
          ))}
        </div>

        {/* SETTINGS CONTENT */}
        <div className="flex-1">
          {activeMenu === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              
              <div className="bg-[#111113]/50 border border-white/5 p-8 rounded-3xl">
                 <h2 className="text-lg font-semibold text-white mb-6">Personal Information</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Full Name</label>
                      <input type="text" defaultValue="Alex Developer" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input type="email" defaultValue="alex@acmecorp.com" disabled className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-500 cursor-not-allowed" />
                    </div>
                 </div>
                 <div className="mt-6 flex justify-end">
                    <button className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-zinc-200 transition-colors">Save Changes</button>
                 </div>
              </div>

              <div className="bg-[#111113]/50 border border-white/5 p-8 rounded-3xl">
                 <h2 className="text-lg font-semibold text-white mb-6">Security Context</h2>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                             <Shield className="w-5 h-5 text-indigo-400" />
                          </div>
                          <div>
                             <p className="text-sm font-semibold text-white">Password Authentication</p>
                             <p className="text-xs text-zinc-500">Last changed 3 months ago</p>
                          </div>
                       </div>
                       <button className="px-4 py-2 border border-white/10 rounded-lg text-xs font-semibold text-white hover:bg-white/5 transition-colors">Update Password</button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                             <Smartphone className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div>
                             <p className="text-sm font-semibold text-white">Two-Factor Authentication (2FA)</p>
                             <p className="text-xs text-zinc-500">Currently enabled via Authenticator App</p>
                          </div>
                       </div>
                       <button className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold transition-colors border border-emerald-500/20">Configured</button>
                    </div>
                 </div>
              </div>

            </motion.div>
          )}

          {activeMenu === 'api' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="bg-[#111113]/50 border border-white/5 p-8 rounded-3xl">
                 <h2 className="text-lg font-semibold text-white mb-2">API Keys</h2>
                 <p className="text-sm text-zinc-400 mb-8 max-w-lg">Manage your secret keys for programmable access to CostIntel routing and reporting architectures. Do not share your keys.</p>
                 
                 <div className="space-y-4 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-black/40 border border-white/10 rounded-2xl gap-4">
                       <div>
                          <p className="text-sm font-bold text-white mb-1">Production Automation Key</p>
                          <p className="text-xs text-zinc-500 font-mono">sk_live_1ax8...93nf</p>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-zinc-500 mr-2">Created Jan 12, 2024</span>
                          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-white border border-white/10 transition-colors">Revoke</button>
                       </div>
                    </div>
                 </div>

                 <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-colors">Generate New Key</button>
              </div>
            </motion.div>
          )}

          {/* Placeholders for others */}
          {['notifications', 'billing'].includes(activeMenu) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111113]/50 border border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center text-center py-24">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  {activeMenu === 'notifications' ? <Bell className="w-8 h-8 text-zinc-500" /> : <CreditCard className="w-8 h-8 text-zinc-500" />}
               </div>
               <h2 className="text-xl font-bold text-white mb-2">Section in Development</h2>
               <p className="text-sm text-zinc-500 max-w-sm">The {activeMenu} configuration panel is currently being updated to the latest routing architecture.</p>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
