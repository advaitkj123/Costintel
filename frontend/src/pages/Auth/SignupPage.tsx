import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Building, Cloud, Globe, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { FloatingInput, GradientButton, StepIndicator, TrustBadge } from '../../components/auth/AuthUI';

export const SignupPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    workspaceName: '',
    cloudProvider: 'AWS',
    awsAccessKey: '',
    region: 'us-east-1'
  });

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (step === 1) {
      if (!formData.email || !formData.password) return setError("Please fill all fields");
      if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");
    }
    setError('');
    setStep(s => s + 1);
  };

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setError('');
    setStep(s => s - 1);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) return; // Prevent intermediate submits
    
    setLoading(true);
    setError('');

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create account');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans antialiased text-white relative overflow-hidden">
      {/* Dynamic Ambiance */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 blur-[130px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-4 opacity-80">Sentinel Protocol</h2>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">Initialize Session</h1>
            <p className="text-zinc-500 text-sm font-medium">Complete initialization to access dashboard</p>
        </div>

        <div className="bg-[#111113]/90 backdrop-blur-2xl border border-white/10 p-10 rounded-[48px] shadow-2xl">
          <StepIndicator currentStep={step} totalSteps={3} />

          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="relative transition-all duration-300">
              {step === 1 && (
                <div key="step1" className="space-y-1">
                  <FloatingInput 
                    label="Email Address" 
                    icon={<Mail className="w-4 h-4" />} 
                    value={formData.email}
                    onChange={(v) => updateForm('email', v)}
                    required
                  />
                  <FloatingInput 
                    label="Identity Password" 
                    type="password"
                    icon={<Lock className="w-4 h-4" />} 
                    value={formData.password}
                    onChange={(v) => updateForm('password', v)}
                    required
                  />
                  <FloatingInput 
                    label="Confirm Identity" 
                    type="password"
                    icon={<Lock className="w-4 h-4" />} 
                    value={formData.confirmPassword}
                    onChange={(v) => updateForm('confirmPassword', v)}
                    required
                  />
                  <GradientButton onClick={nextStep} className="mt-8">
                    Next Step <ArrowRight className="w-4 h-4" />
                  </GradientButton>
                </div>
              )}

              {step === 2 && (
                <div key="step2" className="space-y-1">
                  <FloatingInput 
                    label="Operational Name" 
                    icon={<User className="w-4 h-4" />} 
                    value={formData.fullName}
                    onChange={(v) => updateForm('fullName', v)}
                    required
                  />
                  <FloatingInput 
                    label="Workspace Identifier" 
                    icon={<Building className="w-4 h-4" />} 
                    value={formData.workspaceName}
                    onChange={(v) => updateForm('workspaceName', v)}
                    required
                  />
                  
                  <div className="space-y-2 mb-6 ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Cloud Infrastructure</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['AWS', 'Azure', 'GCP'].map(p => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => updateForm('cloudProvider', p)}
                                className={`py-4 rounded-2xl text-[10px] font-black border transition-all ${
                                    formData.cloudProvider === p 
                                    ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400' 
                                    : 'bg-white/5 border-white/10 text-zinc-500 hover:text-white'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button type="button" onClick={prevStep} className="flex-1 py-4 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
                        Back
                    </button>
                    <GradientButton onClick={nextStep} className="flex-[2]">
                        Continue <ArrowRight className="w-4 h-4" />
                    </GradientButton>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div key="step3" className="space-y-1">
                  <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-[2rem] mb-8">
                     <p className="text-[11px] text-zinc-500 font-medium leading-relaxed italic">
                        Initialize telemetry now by providing your read-only access keys, or skip to finish account setup.
                     </p>
                  </div>

                  <FloatingInput 
                    label="Access Key (Optional)" 
                    icon={<Cloud className="w-4 h-4" />} 
                    value={formData.awsAccessKey}
                    onChange={(v) => updateForm('awsAccessKey', v)}
                  />
                  <FloatingInput 
                    label="Deployment Region" 
                    icon={<Globe className="w-4 h-4" />} 
                    value={formData.region}
                    onChange={(v) => updateForm('region', v)}
                  />

                  <div className="flex gap-4 mt-8">
                    <button type="button" onClick={prevStep} className="flex-1 py-4 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
                        Back
                    </button>
                    <GradientButton type="submit" loading={loading} className="flex-[2]">
                        Finalize <Check className="w-4 h-4" />
                    </GradientButton>
                  </div>
                </div>
              )}
          </form>

          <TrustBadge />

          <p className="mt-10 text-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            Already registered? <Link to="/login" className="text-white hover:text-indigo-400 transition-colors">Connect Identity</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
