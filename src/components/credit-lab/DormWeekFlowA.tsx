import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, GraduationCap, Sparkles, User, Mail, Lock } from 'lucide-react';
import { CreditUAdmissionsMachineV2 as CreditUAdmissionsMachine } from '../../nodes/DormWeekPreReg/CreditUAdmissionsMachineV2';
import { useDormWeek } from '../../hooks/useDormWeek';

export default function DormWeekFlowA() {
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [admissionComplete, setAdmissionComplete] = useState(false);
  const [winnings, setWinnings] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E6911D]/10 via-black to-black">
      
      {/* High-Glamour Ambient Lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E6911D]/15 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-900/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {phase === 1 && (
            <AdmissionAuditA 
              key="audit" 
              onComplete={(name, email) => {
                setUserName(name);
                setUserEmail(email);
                setAdmissionComplete(true);
                setPhase(2);
              }} 
            />
          )}

          {phase === 2 && admissionComplete && (
            <motion.div 
              key="slots" 
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center w-full"
            >
              <CreditUAdmissionsMachine 
                email={userEmail} 
                onResult={(spinResult: any) => {
                  if (spinResult.spinCount >= 3) {
                     // Get the actual titles of the prizes won
                     const wonTitles = (spinResult.rewards || []).map((r: any) => r.title || r);
                     
                     // Ensure we always have 2 slots for the ID Card
                     let w1 = wonTitles.length > 0 ? wonTitles[0].toUpperCase() : 'ALPHA ASSET SECURED';
                     let w2 = wonTitles.length > 1 ? wonTitles[1].toUpperCase() : 'FICO POTENTIAL UNLOCKED';
                     
                     setWinnings([w1, w2]);
                     setPhase(3);
                  }
                }} 
              />
            </motion.div>
          )}

          {phase === 3 && (
            <IDCardMinting 
              key="id-card" 
              userName={userName} 
              winnings={winnings} 
              onEnterCampus={() => window.location.href = '/locker'} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==========================================
// PHASE 1: ALL-IN-ONE REGISTRATION + AUDIT
// ==========================================
function AdmissionAuditA({ onComplete }: { onComplete: (name: string, email: string) => void }) {
  const [data, setData] = useState({ name: '', email: '', password: '', fico: '', debtFocus: '', bigWhy: '' });
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const { captureLead } = useDormWeek();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setError('');
    
    try {
      // PROPER REGISTRATION PIPELINE! Initialize session properly for Slot Machine
      const capture = await captureLead(data.name, data.email, {
        password: data.password
      });

      if (!capture.success) {
          throw new Error('Registration interrupted, try again.');
      }

      // Upsert Audit Data natively for Dorm Week logic
      // FIX: Updating by email instead of calling auth.getUser() to prevent the "Navigator LockManager" race condition during hot-reloads!
      await supabase.from('profiles').update({
        baseline_fico: data.fico,
        debt_focus: data.debtFocus,
        the_big_why: data.bigWhy,
        entrance_cleared_at: new Date().toISOString()
      }).eq('email', data.email);

      setTimeout(() => {
        onComplete(data.name.toUpperCase() || 'FRESHMAN', data.email);
      }, 2500);

    } catch (err: any) {
      console.error(err);
      
      const errorMessage = err.message || 'Calibration failed. Re-enter vitals.';
      // Catch specific browser lock issues
      if (errorMessage.includes('LOCKMANAGER') || errorMessage.includes('LockManager')) {
         setError('BROWSER LOCK ACTIVE: Please hard refresh this page (F5 or CMD+R) to clear the security lock.');
      } else {
         setError(errorMessage);
      }
      setIsScanning(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      transition={{ duration: 0.6 }}
      className="bg-[#050505]/90 backdrop-blur-2xl border border-[#E6911D]/30 rounded-3xl p-10 shadow-[0_0_60px_rgba(230,145,29,0.15)] relative overflow-hidden"
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
        <p className="text-zinc-400 text-sm tracking-widest uppercase">Register & Submit Vitals For Calibration</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="p-4 bg-red-900/30 border border-red-500/50 text-red-500 text-sm font-bold uppercase tracking-wider text-center rounded-xl">{error}</div>}
        
        <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-[10px] font-black text-[#E6911D]/80 mb-2 uppercase tracking-[0.2em]"><User className="inline w-3 h-3 mr-1"/> Full Name</label>
               <input required type="text" onChange={e => setData({...data, name: e.target.value})} className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-4 text-white focus:border-[#E6911D] outline-none transition-all placeholder:text-zinc-700 tracking-wider" placeholder="John Doe" />
            </div>
            <div>
               <label className="block text-[10px] font-black text-[#E6911D]/80 mb-2 uppercase tracking-[0.2em]"><Mail className="inline w-3 h-3 mr-1"/> Protocol Email</label>
               <input required type="email" onChange={e => setData({...data, email: e.target.value})} className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-4 text-white focus:border-[#E6911D] outline-none transition-all placeholder:text-zinc-700 tracking-wider" placeholder="student@creditu.com" />
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-[10px] font-black text-[#E6911D]/80 mb-2 uppercase tracking-[0.2em]"><Lock className="inline w-3 h-3 mr-1"/> Create Password</label>
               <input required type="password" onChange={e => setData({...data, password: e.target.value})} className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-4 text-white focus:border-[#E6911D] outline-none transition-all placeholder:text-zinc-700 tracking-wider" placeholder="••••••••" />
            </div>
            <div>
               <label className="block text-[10px] font-black text-[#E6911D]/80 mb-2 uppercase tracking-[0.2em]">Baseline FICO</label>
               <input required type="number" onChange={e => setData({...data, fico: e.target.value})} className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-4 text-white focus:border-[#E6911D] outline-none transition-all placeholder:text-zinc-700 font-mono tracking-widest" placeholder="XXX" />
            </div>
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
          {isScanning ? 'Syncing...' : 'Register & Submit Vitals'}
        </button>
      </form>
    </motion.div>
  );
}

// FreshmanSlotMachine intentionally removed and replaced by CreditUAdmissionsMachineV2

function IDCardMinting({ userName, winnings, onEnterCampus }: { userName: string, winnings: string[], onEnterCampus: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, rotateY: -90, scale: 0.8 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }} transition={{ duration: 1.2, type: "spring", bounce: 0.3 }} className="space-y-10 flex flex-col items-center w-full">
      <div className="w-full max-w-lg bg-[#0A0D18] border border-[#1C2333] rounded-3xl p-8 relative overflow-hidden shadow-[0_0_100px_rgba(230,145,29,0.15)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-[#E6911D] to-[#c67c17]" />
        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="text-[#3B82F6] text-[9px] font-black tracking-[0.3em] mb-2 uppercase">Dorm Week™ Student ID</p>
            <h2 className="text-3xl font-black italic tracking-widest text-white">CREDIT UNIVERSITY</h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#1C2333] flex items-center justify-center border border-[#2D3748] shadow-inner"><GraduationCap className="w-6 h-6 text-[#E6911D]" /></div>
        </div>
        <div className="space-y-8">
          <div><p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] mb-2">FULL NAME</p><h3 className="text-4xl font-black italic tracking-wider text-white">{userName}</h3></div>
          <div className="flex border-b border-[#1C2333] pb-8"><div className="flex-1"><p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] mb-2">STUDENT ID</p><p className="text-xl font-mono tracking-widest font-semibold text-white">258736-7</p></div><div className="flex-1"><p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] mb-2">CAMPUS STATUS</p><p className="text-lg font-black italic tracking-widest text-[#E6911D] flex items-center"><Sparkles className="w-4 h-4 mr-2" /> FRESHMAN</p></div></div>
          <div className="flex items-center text-[#10B981] font-bold tracking-[0.2em] text-[11px] pt-2"><ShieldCheck className="w-4 h-4 mr-2" />SECURITY VERIFIED</div>
        </div>
      </div>
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="w-full max-w-lg flex flex-col sm:flex-row gap-4">
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center"><p className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest mb-2">Dorm Access</p><p className="text-white font-black italic text-lg tracking-widest">{winnings[0] || 'DORM KEY ISSUED'}</p></div>
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center"><p className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest mb-2">FICO Potential</p><p className="text-[#10B981] font-black italic text-lg tracking-widest">{winnings[1] || '+500 PTS'}</p></div>
      </motion.div>
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} onClick={onEnterCampus} className="w-full max-w-lg bg-white hover:bg-zinc-200 text-black font-black italic uppercase tracking-[0.2em] px-8 py-6 rounded-2xl flex justify-center items-center space-x-3 transition-transform hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.15)]"><span className="text-lg">PROCEED TO LOCKER</span><ArrowRight className="w-6 h-6" /></motion.button>
    </motion.div>
  );
}
