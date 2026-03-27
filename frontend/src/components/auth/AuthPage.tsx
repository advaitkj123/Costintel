import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Mail, Lock, ArrowRight, AlertCircle, User, Building, ShieldCheck, ChevronLeft } from 'lucide-react';
import { login, signup } from '../../services/auth';

export function AuthPage({ onLogin, onBack }: { onLogin: () => void, onBack: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [awsAccessKey, setAwsAccessKey] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`[Auth] Starting ${mode} for ${email}`);
    setLoading(true);
    setError(null);
    
    try {
      if (mode === 'login') {
        const result = await login(email, password);
        console.log("[Auth] Login successful", result);
        onLogin();
      } else {
        console.log("[Auth] Starting signup...");
        await signup({
          email,
          password,
          full_name: fullName,
          workspace_name: workspaceName,
          aws_access_key: awsAccessKey // Optional in backend if not provided
        });
        console.log("[Auth] Signup successful, logging in...");
        await login(email, password);
        onLogin();
      }
    } catch (err: any) {
      console.error("[Auth] Error:", err);
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px]" />
      </div>

      <button 
         onClick={onBack}
         className="absolute top-12 left-12 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group text-sm font-bold uppercase tracking-widest"
      >
         <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
         Back to home
      </button>

      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="w-full max-w-[440px] relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary shadow-2xl shadow-primary/20 mb-6">
            <Zap className="w-8 h-8 text-white fill-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight uppercase italic italic">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-zinc-500 font-medium">
            {mode === 'login' ? 'Sign in to your dashboard' : 'Join the autonomous cost revolution'}
          </p>
        </div>

        <div className="glass p-8 md:p-10 rounded-[40px] border-white/[0.05] shadow-2xl relative inner-glow">
          <AnimatePresence mode="wait">
             {error && (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="mb-8 p-4 rounded-2xl bg-danger/10 border border-danger/20 flex items-center gap-3"
                >
                   <AlertCircle className="w-4 h-4 text-danger shrink-0" />
                   <p className="text-xs font-bold text-danger leading-snug">{error}</p>
                </motion.div>
             )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="popLayout">
              {mode === 'signup' && (
                <motion.div 
                  key="signup-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <Input 
                    label="Full Name" 
                    icon={<User className="w-4 h-4" />} 
                    placeholder="John Doe" 
                    value={fullName}
                    onChange={setFullName}
                    required
                  />
                  <Input 
                    label="Workspace Name" 
                    icon={<Building className="w-4 h-4" />} 
                    placeholder="Acme Cloud" 
                    value={workspaceName}
                    onChange={setWorkspaceName}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input 
              label="Email Address" 
              icon={<Mail className="w-4 h-4" />} 
              placeholder="name@company.com" 
              value={email}
              onChange={setEmail}
              type="email"
              required
            />

            <Input 
              label="AWS Access Key (Optional)" 
              icon={<ShieldCheck className="w-4 h-4" />} 
              placeholder="AKIA..." 
              value={awsAccessKey}
              onChange={setAwsAccessKey}
              type="password"
            />

            <Input 
              label="Password" 
              icon={<Lock className="w-4 h-4" />} 
              placeholder="••••••••••••" 
              value={password}
              onChange={setPassword}
              type="password"
              required
            />

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-white text-black rounded-2xl text-sm font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group shadow-xl disabled:opacity-50 h-[56px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                   Processing...
                </span>
              ) : (
                <>
                  {mode === 'login' ? 'Sign in' : 'Create Account'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-zinc-500 font-medium">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError(null);
                }}
                className="ml-2 text-white font-bold hover:underline decoration-primary decoration-2 underline-offset-4"
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-12 text-center text-[10px] text-zinc-700 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4">
           <span>SOC2 Compliant</span>
           <span className="w-1 h-1 rounded-full bg-zinc-800" />
           <span>256-bit Encrypted</span>
        </p>
      </motion.div>
    </div>
  );
}

function Input({ label, icon, placeholder, value, onChange, type = "text", required = false }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-primary transition-colors">
          {icon}
        </div>
        <input 
          type={type} 
          placeholder={placeholder} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-white placeholder:text-zinc-700 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all focus:border-primary/50"
        />
      </div>
    </div>
  );
}
