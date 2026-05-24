import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, TrendingDown, Users, Sparkles } from 'lucide-react';
import { formatINR, formatINRCompact, cn } from '../../lib/utils';
import { Debtor } from '../../types';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface DebtSplitRadialProps {
  collected: number;
  remaining: number;
  totalManaged: number;
  debtors: Debtor[];
  monthPoints: { key: string; label: string; amount: number }[];
  totalProfiles: number;
  profilesCompleted: number;
  profilesRemaining: number;
}

export const DebtSplitRadial: React.FC<DebtSplitRadialProps> = ({ 
  collected, 
  remaining, 
  totalManaged, 
  debtors, 
  monthPoints, 
  totalProfiles, 
  profilesCompleted, 
  profilesRemaining
}) => {
  const safeTotal = Math.max(collected + remaining, 1);
  const collectedPercent = Math.min(100, Math.max(0, (collected / safeTotal) * 100));
  const remainingPercent = 100 - collectedPercent;
  const circumference = 2 * Math.PI * 92;
  const collectedDash = (collectedPercent / 100) * circumference;
  const remainingDash = (remainingPercent / 100) * circumference;
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (debtors.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % debtors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [debtors.length]);

  const currentDebtor = debtors[currentIndex];

  return (
    <div className="relative overflow-hidden p-6 sm:p-9.5 rounded-[36px] sm:rounded-[48px] min-h-[500px] flex flex-col bg-white/25 backdrop-blur-[35px] border border-white/50 shadow-[0_24px_64px_rgba(15,23,42,0.06),inset_0_1px_2px_rgba(255,255,255,0.6)] ring-1 ring-black/[0.01]">
      {/* Interior floating ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[36px] sm:rounded-[48px]">
        <motion.div 
          animate={{ x: [0, 50, -30, 0], y: [0, -40, 30, 0] }} 
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} 
          className="absolute -top-[15%] -left-[10%] w-[55%] h-[55%] rounded-full bg-emerald-400/12 blur-[90px]" 
        />
        <motion.div 
          animate={{ x: [0, -60, 40, 0], y: [0, 50, -30, 0] }} 
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} 
          className="absolute top-[25%] -right-[15%] w-[50%] h-[50%] rounded-full bg-rose-400/8 blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [0, 40, -50, 0], y: [0, 60, -40, 0] }} 
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }} 
          className="absolute -bottom-[20%] left-[25%] w-[45%] h-[45%] rounded-full bg-cyan-200/10 blur-[90px]" 
        />
      </div>

      {/* Top Banner Stats Grid */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0f172a] font-display">Financial Ledger Summary</h3>
          <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-[0.25em] mt-1.5 font-sans">Payment recovery metrics & targets</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <div className="rounded-2xl bg-white/40 px-4 py-2 border border-white/50 shadow-xs backdrop-blur-md shrink-0 select-none">
            <p className="text-[8.5px] uppercase tracking-widest text-[#3D4E3D] font-extrabold">Active Ledgers</p>
            <p className="text-xs sm:text-sm font-extrabold tabular-nums text-slate-800 mt-0.5">{formatINR(totalManaged)}</p>
          </div>
          <div className="rounded-2xl bg-white/40 px-4 py-2 border border-white/50 shadow-xs backdrop-blur-md shrink-0 select-none">
            <p className="text-[8.5px] uppercase tracking-widest text-slate-500 font-extrabold">Contacts Count</p>
            <p className="text-xs sm:text-sm font-extrabold tabular-nums text-slate-850 mt-0.5">{totalProfiles}</p>
          </div>
        </div>
      </div>

      {/* Circle & Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-[minmax(280px,1.1fr)_minmax(240px,0.9fr)] gap-8 items-center border-b border-white/10 pb-8">
        
        {/* Blown Glass Circle */}
        <div className="relative mx-auto h-64 w-64 sm:h-72 sm:w-72 flex items-center justify-center">
          <div className="absolute inset-5 rounded-full bg-white/20 border border-white/50 shadow-[inset_0_4px_12px_rgba(255,255,255,0.65),0_15px_35px_-8px_rgba(15,23,42,0.06)] backdrop-blur-3xl ring-1 ring-black/[0.01]" />
          <svg className="absolute inset-0 h-full w-full -rotate-90 drop-shadow-[0_4px_16px_rgba(16,185,129,0.08)]" viewBox="0 0 240 240">
            <circle cx="120" cy="120" r="92" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="26" />
            
            {/* Green progress (collected) */}
            <motion.circle 
              cx="120" 
              cy="120" 
              r="92" 
              fill="none" 
              stroke="url(#collectedGradient)" 
              strokeWidth="26" 
              strokeLinecap="round" 
              strokeDasharray={`${collectedDash} ${circumference - collectedDash}`} 
              initial={{ strokeDashoffset: circumference }} 
              animate={{ strokeDashoffset: 0 }} 
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }} 
            />
            {/* Red remainder progress */}
            <motion.circle 
              cx="120" 
              cy="120" 
              r="92" 
              fill="none" 
              stroke="url(#remainingGradient)" 
              strokeWidth="26" 
              strokeLinecap="round" 
              strokeDasharray={`${remainingDash} ${circumference - remainingDash}`} 
              strokeDashoffset={-collectedDash - 4} 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.25 }} 
              style={{ transformOrigin: '120px 120px' }} 
            />
            
            <defs>
              <linearGradient id="collectedGradient" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#86EFAC" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="remainingGradient" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#FCA5A5" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>
            </defs>
          </svg>
          <motion.div 
            initial={{ scale: 0.85, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.45 }} 
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <p className="text-5xl font-extrabold tracking-tight tabular-nums text-[#0f172a] font-display">
              {Math.round(collectedPercent)}
              <span className="text-xl ml-0.5 text-slate-400 font-bold">%</span>
            </p>
            <p className="text-[9.5px] uppercase tracking-[0.25em] font-extrabold text-[#3D4E3D] mt-2.5">Sovereignty</p>
          </motion.div>
        </div>

        {/* Dynamic side values stacked */}
        <div className="space-y-4">
          <div className="p-4 rounded-[24px] bg-white/20 backdrop-blur-xl border border-white/40 shadow-sm hover:bg-white/35 transition-all duration-300">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center border border-emerald-300/20">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400">Total Collected</p>
                <p className="text-xl font-extrabold tabular-nums text-emerald-700">{formatINR(collected)}</p>
              </div>
            </div>
            <div className="h-1 bg-emerald-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${collectedPercent}%` }} 
                transition={{ duration: 1 }}
                className="h-full bg-emerald-500" 
              />
            </div>
          </div>

          <div className="p-4 rounded-[24px] bg-white/20 backdrop-blur-xl border border-white/40 shadow-sm hover:bg-white/35 transition-all duration-300">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-700 flex items-center justify-center border border-rose-300/20">
                <TrendingDown size={16} />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400">Unsettled Outstanding</p>
                <p className="text-xl font-extrabold tabular-nums text-rose-700">{formatINR(remaining)}</p>
              </div>
            </div>
            <div className="h-1 bg-rose-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${remainingPercent}%` }} 
                transition={{ duration: 1 }}
                className="h-full bg-rose-500" 
              />
            </div>
          </div>

          {/* Solid glass footer indicators */}
          <div className="p-4 rounded-[24px] bg-white/10 backdrop-blur-md border border-white/25 shadow-inner">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-[#3D4E3D]/10 text-[#3D4E3D] flex items-center justify-center border border-[#3D4E3D]/20">
                <Users size={16} />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest font-extrabold text-slate-500 leading-tight">Settlement Segregation</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-white/30 px-2.5 py-2 rounded-xl border border-white/40 text-center">
                <p className="text-[8px] uppercase tracking-widest font-extrabold text-slate-500">Managed</p>
                <p className="text-base font-extrabold text-[#0f172a] mt-0.5 tabular-nums">{totalProfiles}</p>
              </div>
              <div className="bg-emerald-500/10 px-2.5 py-2 rounded-xl border border-emerald-400/20 text-center">
                <p className="text-[8px] uppercase tracking-widest font-extrabold text-emerald-800">Settled</p>
                <p className="text-base font-extrabold text-emerald-700 mt-0.5 tabular-nums">{profilesCompleted}</p>
              </div>
              <div className="bg-sky-500/10 px-2.5 py-2 rounded-xl border border-sky-400/20 text-center">
                <p className="text-[8px] uppercase tracking-widest font-extrabold text-sky-800">Remaining</p>
                <p className="text-base font-extrabold text-sky-700 mt-0.5 tabular-nums">{profilesRemaining}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recast bottom stats containing Area Chart */}
      <div className="relative z-10 pt-6">
        
        {/* Continuous area flow chart */}
        <div className="rounded-[26px] bg-white/15 border border-white/40 p-5 shadow-xs backdrop-blur-xl relative">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h4 className="text-base sm:text-lg font-extrabold text-[#0f172a] tracking-tight leading-none font-display">Momentum Ledger</h4>
              <p className="text-[8.5px] uppercase tracking-[0.2em] text-slate-500 font-extrabold mt-1.5 font-sans">Monthly payment inflows</p>
            </div>
            <div className="text-right">
              <p className="text-[8.5px] uppercase tracking-widest text-[#3D4E3D] font-extrabold leading-none">Last Period</p>
              <p className="text-sm font-extrabold text-[#0f172a] tabular-nums mt-1 font-display">
                {monthPoints.length ? formatINR(monthPoints[monthPoints.length - 1].amount) : formatINR(0)}
              </p>
            </div>
          </div>

          <div className="h-44 rounded-2xl bg-white/20 border border-white/30 p-2 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthPoints} margin={{ top: 10, right: 6, left: -14, bottom: 0 }}>
                <defs>
                  <linearGradient id="glowingInflowGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(56,189,248,0.5)" />
                    <stop offset="100%" stopColor="rgba(56,189,248,0.01)" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 5" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }}
                  tickFormatter={(value) => formatINRCompact(Number(value))}
                />
                <Tooltip
                  cursor={{ stroke: 'rgba(56,189,248,0.25)', strokeWidth: 1.5 }}
                  formatter={(value) => [formatINR(Number(value || 0)), 'Inflows']}
                  contentStyle={{
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.7)',
                    background: 'rgba(255,255,255,0.9)',
                    boxShadow: '0 12px 32px rgba(15,23,42,0.1)',
                    color: '#0f172a',
                    fontWeight: 800,
                    fontSize: 11
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#0ea5e9"
                  strokeWidth={2.5}
                  fill="url(#glowingInflowGradient)"
                  dot={{ r: 0 }}
                  activeDot={{ r: 4, strokeWidth: 0, fill: '#0ea5e9' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Floating active candidate auto-scroller comment ticker */}
      <div className="relative z-10 mt-5 p-4 rounded-[24px] bg-black/[0.02] border border-white/35 shadow-inner h-20 overflow-hidden flex items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          {currentDebtor ? (
            <motion.div 
              key={currentDebtor.id} 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: -30, opacity: 0 }} 
              transition={{ duration: 0.65 }} 
              className="flex items-center gap-3.5 w-full leading-snug"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#EFE7D2] to-[#dfd5ba] text-[#3D4E3D] flex items-center justify-center text-[10px] font-extrabold shrink-0 border border-white">
                {currentDebtor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[8.5px] uppercase tracking-widest font-extrabold text-slate-400 truncate leading-none mb-1">Active Contact Scroller</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold text-[#0f172a] truncate max-w-[70%]">{currentDebtor.name}</p>
                  <p className="text-xs font-extrabold text-[#3D4E3D] tabular-nums">
                    {Math.round((currentDebtor.amountPaid / Math.max(currentDebtor.totalDebt, 1)) * 100)}% Settled
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <p className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400 select-none">No active contacts logged in local bundle.</p>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
