import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Dices, GraduationCap, Sparkles } from 'lucide-react';

export default function ArrivalAuditFlow() {
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [userName, setUserName] = useState('ASHLEY'); // Fallback username
  
  // State Tracking
  const [admissionComplete, setAdmissionComplete] = useState(false);
  const [spinsUsed, setSpinsUsed] = useState(0);
  const [winnings, setWinnings] = useState<string[]>([]);

  useEffect(() => {
    // Fetch authenticated user data on mount
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.user_metadata?.first_name) {
        setUserName(data.user.user_metadata.first_name.toUpperCase());
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E6911D]/10 via-black to-black rounded-3xl">
      
      {/* High-Glamour Ambient Lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E6911D]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E6911D]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {phase === 1 && (
            <AdmissionAudit 
              key="audit" 
              onComplete={() => {
                setAdmissionComplete(true);
                setPhase(2);
              }} 
            />
          )}

          {phase === 2 && admissionComplete && (
            <FreshmanSlotMachine 
              key="slots" 
              spinsUsed={spinsUsed}
              setSpinsUsed={setSpinsUsed}
              onJackpot={(prize) => {
                setWinnings([prize, '+500 FICO Potential']);
                setPhase(3);
              }} 
            />
          )}

          {phase === 3 && (
            <IDCardMinting 
              key="id-card" 
              userName={userName} 
              winnings={winnings} 
              onEnterCampus={() => window.location.href = '/dashboard'} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==========================================
// PHASE 1: THE ADMISSION AUDIT
// ==========================================
function AdmissionAudit({ onComplete }: { onComplete: () => void }) {
  const [data, setData] = useState({ fico: '', debtFocus: '', bigWhy: '' });
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Upsert the baseline audit data directly to profiles table as requested
        await supabase.from('profiles').update({
          baseline_fico: data.fico,
          debt_focus: data.debtFocus,
          the_big_why: data.bigWhy,
          entrance_cleared_at: new Date().toISOString()
        }).match({ id: user.id });
      }

      // Simulate the Framer Motion "Scanning..." dramatic effect
      setTimeout(() => {
        onComplete();
      }, 2500);

    } catch (err) {
      console.error(err);
      setTimeout(() => onComplete(), 2500); // Fallback for testing
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      transition={{ duration: 0.6 }}
      className="bg-[#050505]/90 backdrop-blur-2xl border border-[#E6911D]/30 rounded-3xl p-10 shadow-[0_0_60px_rgba(230,145,29,0.1)] relative overflow-hidden"
    >
      {isScanning && (
        <motion.div 
          initial={{ top: '-10%' }}
          animate={{ top: '110%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-8 bg-gradient-to-b from-transparent via-[#E6911D]/40 to-transparent z-50 pointer-events-none shadow-[0_0_30px_rgba(230,145,29,0.5)]"
        />
      )}

      <div className="text-center space-y-3 mb-10">
        <ShieldCheck className="w-12 h-12 text-[#E6911D] mx-auto" />
        <h1 className="text-3xl font-serif text-[#E6911D] font-bold tracking-widest uppercase">Security Clearance</h1>
        <p className="text-zinc-400 text-sm tracking-widest uppercase">Submit Vitals For Trajectory Calibration</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
           <label className="block text-[10px] font-black text-[#E6911D]/80 mb-2 uppercase tracking-[0.2em]">Baseline FICO</label>
           <input required type="number" onChange={e => setData({...data, fico: e.target.value})} className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-4 text-white focus:border-[#E6911D] outline-none transition-all placeholder:text-zinc-700 font-mono tracking-widest" placeholder="XXX" />
        </div>
        <div>
           <label className="block text-[10px] font-black text-[#E6911D]/80 mb-2 uppercase tracking-[0.2em]">Primary Debt Focus</label>
           <select required onChange={e => setData({...data, debtFocus: e.target.value})} className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-4 text-white focus:border-[#E6911D] outline-none transition-all cursor-pointer tracking-wider">
             <option value="" disabled selected>Select Target...</option>
             <option value="student_loans">Student Loans</option>
             <option value="credit_cards">Credit Card Balances</option>
             <option value="collections">Collection Accounts</option>
           </select>
        </div>
        <div>
           <label className="block text-[10px] font-black text-[#E6911D]/80 mb-2 uppercase tracking-[0.2em]">The "Big Why"</label>
           <input required type="text" onChange={e => setData({...data, bigWhy: e.target.value})} className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-4 text-white focus:border-[#E6911D] outline-none transition-all placeholder:text-zinc-700 tracking-wider" placeholder="e.g. First Home, Dream Car, Funding" />
        </div>
        
        <button type="submit" disabled={isScanning} className="w-full mt-8 bg-[#E6911D] hover:bg-[#c67c17] text-black font-black uppercase tracking-[0.2em] py-5 rounded-xl transition-all shadow-[0_0_30px_rgba(230,145,29,0.25)] flex justify-center items-center">
          {isScanning ? 'Scanning...' : 'Submit Vitals'}
        </button>
      </form>
    </motion.div>
  );
}

// ==========================================
// PHASE 2: THE FRESHMAN SLOT MACHINE
// ==========================================
function FreshmanSlotMachine({ spinsUsed, setSpinsUsed, onJackpot }: { spinsUsed: number, setSpinsUsed: (val: number) => void, onJackpot: (p: string) => void }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayPrize, setDisplayPrize] = useState('PULL LEVER');
  const [isShattering, setIsShattering] = useState(false);

  const spinMachine = () => {
    if (isSpinning || spinsUsed >= 3) return;
    
    setIsSpinning(true);
    const newSpins = spinsUsed + 1;
    setSpinsUsed(newSpins);

    setDisplayPrize('🎰 SPINNING... 🎰');
    
    setTimeout(() => {
      setIsSpinning(false);
      if (newSpins === 1) setDisplayPrize('50 MOO POINTS');
      else if (newSpins === 2) setDisplayPrize('100 MOO POINTS');
      else if (newSpins === 3) {
        // JACKPOT SHATTER EFFECT
        setDisplayPrize('DORM KEY ISSUED! ✨');
        setTimeout(() => {
          setIsShattering(true);
          setTimeout(() => onJackpot('DORM KEY ISSUED'), 800);
        }, 1200);
      }
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isShattering ? 0 : 1, 
        scale: isShattering ? 1.5 : 1,
        rotate: isShattering ? 5 : 0,
        filter: isShattering ? 'blur(20px)' : 'blur(0px)'
      }}
      transition={{ duration: isShattering ? 0.8 : 0.6, ease: "easeInOut" }}
      className="bg-[#050505] border-2 border-[#E6911D]/50 rounded-[2.5rem] p-12 text-center shadow-[0_0_80px_rgba(230,145,29,0.15)] relative"
    >
      <Dices className="w-16 h-16 text-[#E6911D] mx-auto mb-6 drop-shadow-[0_0_20px_rgba(230,145,29,0.6)]" />
      <h1 className="text-4xl font-serif text-[#E6911D] font-bold tracking-[0.2em] uppercase mb-2">The Vault</h1>
      <p className="text-[#E6911D]/60 text-xs font-black tracking-[0.3em] mb-12 uppercase">Spins Remaining: {3 - spinsUsed}</p>
      
      <div className="bg-[#0A0A0A] border-4 border-zinc-900 rounded-2xl h-36 flex items-center justify-center mb-10 overflow-hidden relative shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none z-10" />
        <motion.div 
          key={displayPrize} 
          initial={{ y: 80, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className={`text-3xl font-black italic tracking-widest z-0 ${displayPrize.includes('JACKPOT') || displayPrize.includes('DORM') ? 'text-[#E6911D] animate-pulse' : 'text-white'}`}
        >
          {displayPrize}
        </motion.div>
      </div>

      <button 
        onClick={spinMachine} 
        disabled={isSpinning || spinsUsed >= 3 || isShattering} 
        className="w-full bg-gradient-to-r from-[#E6911D] to-[#c67c17] hover:from-[#f5a536] hover:to-[#E6911D] text-black font-black text-xl uppercase tracking-[0.2em] py-6 rounded-2xl transition-all shadow-[0_0_40px_rgba(230,145,29,0.4)] disabled:opacity-50"
      >
        {isSpinning ? 'Machine Active...' : spinsUsed < 3 ? 'Use Gold Coin' : 'Access Granted'}
      </button>
    </motion.div>
  );
}

// ==========================================
// PHASE 3: THE ID CARD MINTING
// ==========================================
function IDCardMinting({ userName, winnings, onEnterCampus }: { userName: string, winnings: string[], onEnterCampus: () => void }) {
  const saveRewards = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
         await supabase.from('profiles').update({
           inventory: winnings, // Assuming an inventory array exists
           has_completed_arrival: true
         }).match({ id: user.id });
      }
      onEnterCampus();
    } catch (err) {
      console.error(err);
      onEnterCampus(); // Fallback bounds
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
      transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
      className="space-y-10 flex flex-col items-center w-full"
    >
      <div className="w-full max-w-lg bg-[#0A0D18] border border-[#1C2333] rounded-3xl p-8 relative overflow-hidden shadow-[0_0_100px_rgba(230,145,29,0.15)]">
        {/* Glowing Top Border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-[#E6911D] to-[#c67c17]" />
        
        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="text-[#3B82F6] text-[9px] font-black tracking-[0.3em] mb-2 uppercase">Dorm Week™ Student ID</p>
            <h2 className="text-3xl font-black italic tracking-widest text-white">CREDIT UNIVERSITY</h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#1C2333] flex items-center justify-center border border-[#2D3748] shadow-inner">
            <GraduationCap className="w-6 h-6 text-[#E6911D]" />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] mb-2">FULL NAME</p>
            <h3 className="text-4xl font-black italic tracking-wider text-white">{userName}</h3>
          </div>

          <div className="flex border-b border-[#1C2333] pb-8">
            <div className="flex-1">
              <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] mb-2">STUDENT ID</p>
              <p className="text-xl font-mono tracking-widest font-semibold text-white">258736-7</p>
            </div>
            <div className="flex-1">
              <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] mb-2">CAMPUS STATUS</p>
              <p className="text-lg font-black italic tracking-widest text-[#E6911D] flex items-center">
                <Sparkles className="w-4 h-4 mr-2" /> FRESHMAN
              </p>
            </div>
          </div>

          <div className="flex items-center text-[#10B981] font-bold tracking-[0.2em] text-[11px] pt-2">
            <ShieldCheck className="w-4 h-4 mr-2" />
            SECURITY VERIFIED
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="w-full max-w-lg flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest mb-2">Dorm Access</p>
          <p className="text-white font-black italic text-lg tracking-widest">{winnings[0] || 'DORM KEY ISSUED'}</p>
        </div>
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest mb-2">FICO Potential</p>
          <p className="text-[#10B981] font-black italic text-lg tracking-widest">{winnings[1] || '+500 PTS'}</p>
        </div>
      </motion.div>

      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={saveRewards} 
        className="w-full max-w-lg bg-white hover:bg-zinc-200 text-black font-black italic uppercase tracking-[0.2em] px-8 py-6 rounded-2xl flex justify-center items-center space-x-3 transition-transform hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.15)]"
      >
        <span className="text-lg">Proceed to Campus</span>
        <ArrowRight className="w-6 h-6" />
      </motion.button>
    </motion.div>
  );
}
