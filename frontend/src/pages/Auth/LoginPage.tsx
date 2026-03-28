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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans antialiased text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-500/10 blur-[130px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-4 opacity-80">Sentinel Identity</h2>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">Connect Session</h1>
            <p className="text-zinc-500 text-sm font-medium">Authentication required for operative access</p>
        </div>

        <div className="bg-[#111113]/90 backdrop-blur-2xl border border-white/10 p-10 rounded-[48px] shadow-2xl">
          
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
      </motion.div>
    </div>
  );
};
