import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Dices, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';

export default function DormInitiationSPA() {
  const [step, setStep] = useState(1);
  const [winnings, setWinnings] = useState<string[]>([]);
  const [userName, setUserName] = useState('ASHLEY'); // Fallback

  useEffect(() => {
    // Fetch real user name on mount
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.user_metadata?.first_name) {
        setUserName(data.user.user_metadata.first_name.toUpperCase());
      }
    };
    fetchUser();
  }, []);

  // Framer Motion Variants for ultra-smooth Dissolve / Slide transitions
  const pageVariants: any = {
    initial: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
    in: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: 'circOut' } },
    out: { opacity: 0, scale: 1.05, filter: 'blur(10px)', transition: { duration: 0.6, ease: 'circIn' } }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-amber-50 font-sans flex items-center justify-center p-6 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-[#050505] to-[#050505]">
      
      {/* Cinematic Ambient Lighting */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="audit" variants={pageVariants} initial="initial" animate="in" exit="out">
              <SecurityClearanceAudit onComplete={() => setStep(2)} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="slots" variants={pageVariants} initial="initial" animate="in" exit="out">
              <CreditCowgirlSlots 
                onJackpot={(prize) => {
                  setWinnings([prize]);
                  setStep(3);
                }} 
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="id-mint" variants={pageVariants} initial="initial" animate="in" exit="out">
              <StudentIDMint userName={userName} winnings={winnings} onEnter={() => window.location.href = '/dashboard'} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==========================================
// PHASE 1: THE BASELINE AUDIT
// ==========================================
function SecurityClearanceAudit({ onComplete }: { onComplete: () => void }) {
  const [data, setData] = useState({ score: '', debt: '', goal: '' });
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('student_progress').upsert({
          user_id: user.id,
          baseline_score: data.score,
          top_debt_amount: data.debt,
          primary_goal: data.goal
        });
      }
      onComplete(); // Triggers the Framer Motion dissolve to Phase 2
    } catch (err) {
      console.error(err);
      onComplete();
    }
  };

  return (
    <div className="bg-black/80 backdrop-blur-2xl border border-amber-500/20 rounded-[2rem] p-10 shadow-[0_0_50px_rgba(217,119,6,0.1)]">
      <div className="text-center space-y-3 mb-10">
        <ShieldCheck className="w-10 h-10 text-amber-500 mx-auto" />
        <h1 className="text-3xl font-serif text-amber-500 font-bold tracking-wide uppercase">Security Clearance</h1>
        <p className="text-zinc-400 text-sm tracking-wide">Professor Prosperity requires your vitals to calibrate your trajectory.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[11px] font-bold text-amber-500/80 mb-2 uppercase tracking-widest">Current FICO Score</label>
          <input required type="number" onChange={e => setData({...data, score: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-white focus:border-amber-500 outline-none transition-all placeholder:text-zinc-600 font-mono" placeholder="xxx" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-amber-500/80 mb-2 uppercase tracking-widest">Top Debt Target ($)</label>
          <input required type="number" onChange={e => setData({...data, debt: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-white focus:border-amber-500 outline-none transition-all placeholder:text-zinc-600 font-mono" placeholder="$0.00" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-amber-500/80 mb-2 uppercase tracking-widest">Financial Directive</label>
          <select required onChange={e => setData({...data, goal: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-white focus:border-amber-500 outline-none transition-all appearance-none cursor-pointer">
            <option value="" disabled selected>Awaiting Directive...</option>
            <option value="business">Secure Zero-Percent Funding</option>
            <option value="mortgage">Home Ownership Matrix</option>
            <option value="travel">Luxury Travel Architecture</option>
          </select>
        </div>
        
        <button type="submit" disabled={isSyncing} className="w-full mt-8 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest py-5 rounded-xl transition-all shadow-[0_0_30px_rgba(217,119,6,0.2)] disabled:opacity-50 flex justify-center items-center">
          {isSyncing ? 'Calibrating...' : 'Submit Vitals'}
        </button>
      </form>
    </div>
  );
}

// ==========================================
// PHASE 2: THE SLOT MACHINE
// ==========================================
function CreditCowgirlSlots({ onJackpot }: { onJackpot: (prize: string) => void }) {
  const [spinsLeft, setSpinsLeft] = useState(3);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayTxt, setDisplayTxt] = useState('PULL LEVER');

  const prizes = ['+100 Moo Points', 'Interest Rate Lasso', '+500 PTS'];

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const updatedSpins = spinsLeft - 1;
    setSpinsLeft(updatedSpins);
    
    // Simulate slot animation
    let counter = 0;
    setDisplayTxt('🎰 SPINNING... 🎰');
    
    const interval = setInterval(() => {
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        setIsSpinning(false);
        
        if (updatedSpins === 0) {
          // 3rd Spin = JACKPOT
          setDisplayTxt('JACKPOT! ✨');
          setTimeout(() => onJackpot('+500 PTS'), 1500); // Pass loot and trigger dissolve to Phase 3
        } else {
          setDisplayTxt(prizes[Math.floor(Math.random() * 2)]); // Fake smaller wins
        }
      }
    }, 100);
  };

  return (
    <div className="bg-black border border-amber-500/30 rounded-[2rem] p-12 text-center shadow-[0_0_80px_rgba(217,119,6,0.1)]">
      <Dices className="w-16 h-16 text-amber-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(217,119,6,0.5)]" />
      <h1 className="text-4xl font-serif text-amber-500 font-bold tracking-widest uppercase mb-2">The Vault</h1>
      <p className="text-zinc-500 text-sm font-bold tracking-[0.3em] mb-12">CREDIT COWGIRL SPINS: {spinsLeft}</p>
      
      <div className="bg-zinc-950 border-2 border-amber-900/50 rounded-2xl h-32 flex items-center justify-center mb-10 overflow-hidden relative shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none z-10" />
        <motion.div 
          key={displayTxt} 
          initial={{ y: 50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="text-3xl font-black italic tracking-widest text-amber-400 z-0"
        >
          {displayTxt}
        </motion.div>
      </div>

      <button 
        onClick={handleSpin} 
        disabled={isSpinning || spinsLeft === 0} 
        className="w-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-black font-black text-lg uppercase tracking-[0.2em] py-6 rounded-2xl transition-all shadow-[0_0_30px_rgba(217,119,6,0.4)] disabled:opacity-50 disabled:grayscale"
      >
        {isSpinning ? 'Machine Active...' : spinsLeft > 0 ? 'Use Gold Coin' : 'Access Granted'}
      </button>
    </div>
  );
}

// ==========================================
// PHASE 3: THE ID MINTING
// ==========================================
function StudentIDMint({ userName, winnings, onEnter }: { userName: string, winnings: string[], onEnter: () => void }) {
  return (
    <div className="space-y-10 flex flex-col items-center w-full">
      
      {/* Laser-etched animation on mount */}
      <motion.div 
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        className="w-full max-w-lg bg-[#0A0D18] border border-[#1C2333] rounded-3xl p-8 relative overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.15)]"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-amber-500 to-amber-700" />
        
        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="text-[#3B82F6] text-[10px] font-black tracking-[0.3em] mb-2 uppercase">Dorm Week™ Student ID</p>
            <h2 className="text-3xl font-black italic tracking-wider text-white">CREDIT UNIVERSITY</h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#1C2333] flex items-center justify-center border border-[#2D3748] shadow-inner">
            <GraduationCap className="w-6 h-6 text-amber-500" />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <p className="text-slate-500 text-xs font-bold tracking-[0.2em] mb-2">FULL NAME</p>
            <h3 className="text-4xl font-black italic tracking-wider text-white">{userName}</h3>
          </div>

          <div className="flex border-b border-[#1C2333] pb-8">
            <div className="flex-1">
              <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] mb-2">STUDENT ID</p>
              <p className="text-xl font-mono tracking-widest font-semibold text-white">258736-7</p>
            </div>
            <div className="flex-1">
              <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] mb-2">CAMPUS STATUS</p>
              <p className="text-lg font-black italic tracking-widest text-amber-500 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" /> FRESHMAN
              </p>
            </div>
          </div>

          <div className="flex items-center text-[#10B981] font-bold tracking-[0.2em] text-[11px] pt-2">
            <ShieldCheck className="w-4 h-4 mr-2" />
            SECURITY VERIFIED
          </div>
        </div>
      </motion.div>

      {/* Embedded Winnings */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="w-full max-w-lg flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-2">Dorm Access</p>
          <p className="text-white font-black italic text-xl tracking-wide">DORM KEY ISSUED</p>
        </div>
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-2">FICO Potential</p>
          <p className="text-[#10B981] font-black italic text-xl tracking-wide">{winnings[0] || '+500 PTS'}</p>
        </div>
      </motion.div>

      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={onEnter} 
        className="w-full max-w-lg bg-white hover:bg-zinc-200 text-black font-black italic uppercase tracking-[0.2em] px-8 py-6 rounded-2xl flex justify-center items-center space-x-3 transition-transform hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.15)]"
      >
        <span className="text-lg">Proceed to Campus</span>
        <ArrowRight className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
