import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Chrome, LogIn } from 'lucide-react';
import { FloatingInput, GradientButton, TrustBadge } from '../../components/auth/AuthUI';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Invalid identity credentials. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col lg:flex-row font-sans antialiased text-white relative overflow-hidden">
      {/* 1. BRANDING COLUMN (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative bg-[#09090b] border-r border-white/5 overflow-hidden">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1],
              x: [0, 50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-[-10%] left-[-10%] w-full h-full bg-indigo-500/20 blur-[130px] rounded-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl w-fit backdrop-blur-md">
            <LogIn className="w-5 h-5 text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sentinel Portal</span>
          </div>

          <h1 className="text-6xl font-black tracking-tighter leading-[0.9] mb-12">
             ACCESS <span className="text-gradient">SENTINEL</span> <br/> 
             WORKSPACE.
          </h1>

          <div className="space-y-12">
            {[
              { icon: <Mail className="w-6 h-6 text-indigo-400" />, title: "IDENTITY KEY", desc: "Encrypted session keys for multi-account management." },
              { icon: <Lock className="w-6 h-6 text-indigo-400" />, title: "ISOLATED VAULT", desc: "Credentials are never stored plain-text, only as hash-tokens." },
              { icon: <ArrowRight className="w-6 h-6 text-indigo-400" />, title: "DIRECT ACCESS", desc: "Immediate handshake with the back-end extraction engine." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="flex gap-6 max-w-md group"
              >
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
                   {feature.icon}
                </div>
                <div>
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">{feature.title}</h3>
                   <p className="text-sm text-zinc-500 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">CostIntel Secure Handshake • v4.2</p>
        </div>
      </div>

      {/* 2. FORM COLUMN */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-24 relative overflow-y-auto">
        {/* Mobile Background Ambience */}
        <div className="lg:hidden absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-indigo-500/10 blur-[100px] rounded-full" />
        </div>

        <div className="w-full max-w-md relative z-10 h-full flex flex-col justify-center py-12">
          <div className="text-center mb-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-4 opacity-80">Sentinel Identity</h2>
              <h1 className="text-4xl font-black tracking-tight text-white mb-2">Connect Session</h1>
              <p className="text-zinc-500 text-sm font-medium">Authentication required for operative access</p>
          </div>

          <div className="bg-[#111113]/90 backdrop-blur-2xl border border-white/10 p-10 rounded-[48px] shadow-2xl relative">
            
            <button 
              onClick={handleGoogleLogin}
              className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all mb-8 group"
            >
              <Chrome className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
              Continue with Google
            </button>

            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-x-0 h-px bg-white/10" />
              <span className="relative bg-[#111113] px-4 text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">or use identity keys</span>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 text-xs font-bold text-center mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-1">
              <FloatingInput 
                label="Email Address" 
                icon={<Mail className="w-4 h-4" />} 
                value={email}
                onChange={setEmail}
                required
              />
              <div className="relative">
                  <FloatingInput 
                      label="Identity Password" 
                      type="password"
                      icon={<Lock className="w-4 h-4" />} 
                      value={password}
                      onChange={setPassword}
                      required
                  />
                  <button type="button" className="absolute right-4 top-[18px] text-[9px] font-black text-zinc-600 hover:text-indigo-400 uppercase tracking-widest transition-colors z-30">
                      Forgot?
                  </button>
              </div>

              <GradientButton type="submit" loading={loading} className="mt-8">
                Verify & Enter <LogIn className="w-4 h-4" />
              </GradientButton>
            </form>

            <TrustBadge />

            <p className="mt-10 text-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              New operative? <Link to="/signup" className="text-white hover:text-indigo-400 transition-colors">Initialize account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
