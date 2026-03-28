import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Loader2 } from 'lucide-react';

// --- SHARED PREMIUM COMPONENTS ---

export const FloatingInput: React.FC<{
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
  required?: boolean;
}> = ({ label, type = "text", value, onChange, icon, required }) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFilled = value !== undefined && value !== null && value.length > 0;

  return (
    <div className="relative group mb-6 w-full">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 z-10 ${isFocused || isFilled ? 'opacity-0 scale-75' : 'opacity-40 text-white'}`}>
        {icon}
      </div>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        placeholder={label}
        className={`w-full bg-white/[0.05] border ${isFocused ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-white/10'} rounded-2xl py-4 ${icon ? 'pl-12' : 'pl-5'} pr-5 text-sm font-medium text-white transition-all outline-none placeholder-transparent relative z-10`}
      />
      <label 
        className={`absolute left-4 transition-all duration-300 pointer-events-none font-bold uppercase tracking-widest text-[10px] z-20 ${
          isFocused || isFilled 
            ? '-top-2.5 bg-[#111113] px-2 text-indigo-400 scale-90 translate-x-2' 
            : `top-1/2 -translate-y-1/2 ${icon ? 'left-12' : 'left-5'} text-zinc-400`
        }`}
      >
        {label}
      </label>
      {isFocused && (
        <div className="absolute inset-0 rounded-2xl bg-indigo-500/5 blur-md -z-10" />
      )}
    </div>
  );
};

export const GradientButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, type = "button", loading, disabled, className = "" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl flex items-center justify-center gap-3 overflow-hidden group disabled:opacity-50 z-10 ${className}`}
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : children}
    </motion.button>
  );
};

export const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div 
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i + 1 <= currentStep ? 'w-12 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)]' : 'w-8 bg-white/10'
            }`} 
        />
      ))}
    </div>
  );
};

export const TrustBadge: React.FC = () => (
  <div className="flex flex-col items-center gap-3 mt-10">
    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
      <Shield className="w-3 h-3 text-indigo-400/50" />
      Secure • No credit card required • AWS-safe
    </div>
    <div className="flex items-center gap-1.5 opacity-40">
        <Lock className="w-3 h-3 text-zinc-400" />
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Military Grade Encryption</span>
    </div>
  </div>
);
