import { Zap, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar({ onLogin, onSignup }: { onLogin: () => void, onSignup: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/[0.05] bg-[#09090b]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white uppercase italic">CostIntel</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#product">Product</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#docs">Docs</NavLink>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onLogin}
            className="hidden sm:block px-5 py-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
          >
            Log in
          </button>
          <button 
            onClick={onSignup}
            className="px-6 py-2.5 bg-white text-black text-sm font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/10"
          >
            Start Free
          </button>
          <button 
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#09090b] border-b border-white/5 p-6 animate-in slide-in-from-top duration-300">
           <div className="flex flex-col gap-6 font-bold text-zinc-400">
              <a href="#product" className="hover:text-white" onClick={() => setIsMenuOpen(false)}>Product</a>
              <a href="#pricing" className="hover:text-white" onClick={() => setIsMenuOpen(false)}>Pricing</a>
              <a href="#docs" className="hover:text-white" onClick={() => setIsMenuOpen(false)}>Docs</a>
              <hr className="border-white/5" />
              <button 
                onClick={() => { onLogin(); setIsMenuOpen(false); }}
                className="text-left py-2 hover:text-white"
              >
                Log in
              </button>
           </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="text-sm font-bold text-zinc-500 hover:text-zinc-200 transition-colors uppercase tracking-widest"
    >
      {children}
    </a>
  );
}
