import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, TrendingDown, Users } from 'lucide-react';
import { formatINR, cn } from '../../lib/utils';
import { CandidateStage, Debtor } from '../../types';
import { CANDIDATE_STAGE_META, CANDIDATE_STAGE_ORDER, getStageProgress } from '../../constants';
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
  stageCounts: Record<CandidateStage, number>;
}

export const DebtSplitRadial: React.FC<DebtSplitRadialProps> = ({ collected, remaining, totalManaged, debtors, monthPoints, totalProfiles, profilesCompleted, profilesRemaining, stageCounts }) => {
  const safeTotal = Math.max(collected + remaining, 1);
  const collectedPercent = Math.min(100, Math.max(0, (collected / safeTotal) * 100));
  const remainingPercent = 100 - collectedPercent;
  const circumference = 2 * Math.PI * 92;
  const collectedDash = (collectedPercent / 100) * circumference;
  const remainingDash = (remainingPercent / 100) * circumference;
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (debtors.length <= 1) return;
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % debtors.length), 5000);
    return () => clearInterval(interval);
  }, [debtors.length]);

  const currentDebtor = debtors[currentIndex];
  return (
    <div className="relative overflow-hidden p-5 sm:p-10 rounded-[32px] sm:rounded-[48px] min-h-[520px] sm:min-h-[560px] flex flex-col bg-white/30 backdrop-blur-[40px] border border-white/60 shadow-[0_32px_64px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,0.5)] ring-1 ring-black/[0.02]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/15 blur-[100px]" />
        <motion.div animate={{ x: [0, -50, 30, 0], y: [0, 40, -20, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} className="absolute top-[20%] -right-[10%] w-[45%] h-[45%] rounded-full bg-red-400/10 blur-[100px]" />
        <motion.div animate={{ x: [0, 30, -40, 0], y: [0, 50, -30, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }} className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-amber-200/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(16,185,129,0.08),transparent_40%),radial-gradient(circle_at_90%_15%,rgba(248,113,113,0.08),transparent_40%)]" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-[#1A1A1A]">Collection Split</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Received vs remaining balance</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-2xl bg-white/40 px-4 py-2 border border-white/50 shadow-sm backdrop-blur-xl shrink-0 ring-1 ring-black/[0.02]"><p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Total Impact</p><p className="text-sm font-bold tabular-nums">{formatINR(totalManaged)}</p></div>
          <div className="rounded-2xl bg-white/40 px-4 py-2 border border-white/50 shadow-sm backdrop-blur-xl shrink-0 ring-1 ring-black/[0.02]"><p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Total Profiles</p><p className="text-sm font-bold tabular-nums">{totalProfiles}</p></div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-[minmax(280px,1fr)_minmax(220px,0.9fr)] gap-8 items-center">
        <div className="relative mx-auto h-64 w-64 sm:h-72 sm:w-72">
          <div className="absolute inset-6 rounded-full bg-white/25 border border-white/45 shadow-[inset_0_6px_18px_rgba(255,255,255,0.7),0_22px_44px_rgba(0,0,0,0.06)] backdrop-blur-2xl ring-1 ring-black/[0.01]" />
          <svg className="absolute inset-0 h-full w-full -rotate-90 drop-shadow-[0_0_20px_rgba(16,185,129,0.14)]" viewBox="0 0 240 240">
            <circle cx="120" cy="120" r="92" fill="none" stroke="rgba(255,255,255,0.58)" strokeWidth="28" />
            <motion.circle cx="120" cy="120" r="92" fill="none" stroke="url(#collectedGradient)" strokeWidth="28" strokeLinecap="round" strokeDasharray={`${collectedDash} ${circumference - collectedDash}`} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }} />
            <motion.circle cx="120" cy="120" r="92" fill="none" stroke="url(#remainingGradient)" strokeWidth="28" strokeLinecap="round" strokeDasharray={`${remainingDash} ${circumference - remainingDash}`} strokeDashoffset={-collectedDash - 8} initial={{ opacity: 0, rotate: 8 }} animate={{ opacity: 1, rotate: 0 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }} style={{ transformOrigin: '120px 120px' }} />
            <defs>
              <linearGradient id="collectedGradient" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stopColor="#6EE7B7" /><stop offset="100%" stopColor="#059669" /></linearGradient>
              <linearGradient id="remainingGradient" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stopColor="#FCA5A5" /><stop offset="100%" stopColor="#EF4444" /></linearGradient>
            </defs>
          </svg>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 60, damping: 12, delay: 0.5 }} className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-5xl font-bold tracking-tight tabular-nums text-[#0f172a] drop-shadow-sm">{Math.round(collectedPercent)}<span className="text-2xl ml-0.5 opacity-50">%</span></p>
            <p className="text-[10px] uppercase tracking-[0.22em] font-bold text-gray-400 mt-2">Collected</p>
          </motion.div>
        </div>

        <div className="space-y-3">
          <div className="p-5 rounded-[28px] bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_8px_20px_rgba(0,0,0,0.02)] group hover:bg-white/40 transition-all duration-500">
            <div className="flex items-center gap-3 mb-4"><div className="h-10 w-10 rounded-2xl bg-emerald-50/50 text-emerald-600 flex items-center justify-center border border-emerald-100/50"><CheckCircle2 size={18} className="group-hover:scale-110 transition-transform duration-500" /></div><div><p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Received</p><p className="text-2xl font-bold tabular-nums text-emerald-600">{formatINR(collected)}</p></div></div>
            <div className="h-1.5 rounded-full bg-emerald-50 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${collectedPercent}%` }} transition={{ type: 'spring', stiffness: 40, damping: 20, delay: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-emerald-600" /></div>
          </div>

          <div className="p-5 rounded-[28px] bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_8px_20px_rgba(0,0,0,0.02)] group hover:bg-white/40 transition-all duration-500">
            <div className="flex items-center gap-3 mb-4"><div className="h-10 w-10 rounded-2xl bg-red-50/50 text-red-500 flex items-center justify-center border border-red-100/50"><TrendingDown size={18} className="group-hover:scale-110 transition-transform duration-500" /></div><div><p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Remaining</p><p className="text-2xl font-bold tabular-nums text-red-500">{formatINR(remaining)}</p></div></div>
            <div className="h-1.5 rounded-full bg-red-50 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${remainingPercent}%` }} transition={{ type: 'spring', stiffness: 40, damping: 20, delay: 0.7 }} className="h-full rounded-full bg-gradient-to-r from-red-300 to-red-500" /></div>
          </div>

          <div className="p-5 rounded-[28px] bg-black/[0.02] backdrop-blur-xl border border-white/40 shadow-inner relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-[#EFE7D2]/80 text-[#3D4E3D] flex items-center justify-center border border-white/60"><Users size={18} /></div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Profile Split</p>
                <p className="text-sm font-bold text-[#1A1A1A]">Total, completed and remaining</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/60 px-3 py-3 border border-white/70"><p className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Total</p><p className="mt-1 text-lg font-bold text-[#1A1A1A]">{totalProfiles}</p></div>
              <div className="rounded-2xl bg-emerald-50/70 px-3 py-3 border border-emerald-100/70"><p className="text-[9px] uppercase tracking-widest font-bold text-emerald-600">Completed</p><p className="mt-1 text-lg font-bold text-emerald-700">{profilesCompleted}</p></div>
              <div className="rounded-2xl bg-sky-50/70 px-3 py-3 border border-sky-100/70"><p className="text-[9px] uppercase tracking-widest font-bold text-sky-600">Remaining</p><p className="mt-1 text-lg font-bold text-sky-700">{profilesRemaining}</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-8 grid grid-cols-1 xl:grid-cols-[minmax(280px,1.2fr)_minmax(220px,0.8fr)] gap-4">
        <div className="liquid-chip rounded-[26px] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div><h4 className="text-base sm:text-lg font-bold text-glass-main">Collection Momentum</h4><p className="text-[10px] uppercase tracking-[0.18em] text-glass-subtle font-semibold">Monthly amount collected</p></div>
            <div className="text-right"><p className="text-[10px] uppercase tracking-widest text-glass-subtle font-semibold">Latest Month</p><p className="text-sm font-bold text-glass-main tabular-nums">{monthPoints.length ? formatINR(monthPoints[monthPoints.length - 1].amount) : formatINR(0)}</p></div>
          </div>
          <div className="h-56 rounded-[24px] bg-white/35 border border-white/55 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthPoints} margin={{ top: 14, right: 10, left: 4, bottom: 2 }}>
                <defs>
                  <linearGradient id="collectionMomentumFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(56,189,248,0.55)" />
                    <stop offset="100%" stopColor="rgba(56,189,248,0.05)" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="4 6" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                  tickFormatter={(value) => formatINR(Number(value))}
                  width={72}
                />
                <Tooltip
                  cursor={{ stroke: 'rgba(56,189,248,0.25)', strokeWidth: 1.5 }}
                  formatter={(value) => [formatINR(Number(value || 0)), 'Collected']}
                  contentStyle={{
                    borderRadius: 18,
                    border: '1px solid rgba(255,255,255,0.72)',
                    background: 'rgba(255,255,255,0.88)',
                    boxShadow: '0 18px 44px rgba(15,23,42,0.16)',
                    color: '#0f172a',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  fill="url(#collectionMomentumFill)"
                  dot={{ r: 0 }}
                  activeDot={{ r: 4, strokeWidth: 0, fill: '#0284c7' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="liquid-chip rounded-[26px] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div><h4 className="text-base sm:text-lg font-bold text-glass-main">Candidate Workflow</h4><p className="text-[10px] uppercase tracking-[0.18em] text-glass-subtle font-semibold">Secondary tracking across interview stages</p></div>
          </div>
          <div className="space-y-3">
            {CANDIDATE_STAGE_ORDER.map(stage => {
              const meta = CANDIDATE_STAGE_META[stage];
              return (
                <div key={stage} className="flex items-center justify-between gap-3 rounded-2xl bg-white/45 border border-white/60 px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0"><span className={cn('h-2.5 w-2.5 rounded-full shadow-sm', meta.accentClassName)} /><p className="text-sm font-semibold text-glass-main truncate">{meta.label}</p></div>
                  <p className="text-sm font-bold text-glass-main tabular-nums">{stageCounts[stage]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 p-5 rounded-[28px] bg-black/[0.02] backdrop-blur-xl border border-white/40 shadow-inner h-[92px] overflow-hidden flex items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          {currentDebtor && (
            <motion.div key={currentDebtor.id} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-3 w-full">
              <div className="h-10 w-10 rounded-2xl bg-[#EFE7D2]/80 text-[#3D4E3D] flex items-center justify-center text-xs font-bold shrink-0">{currentDebtor.name.split(' ').map(n => n[0]).join('')}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 truncate">{currentDebtor.name}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-sm font-bold text-[#1A1A1A]">Paid Progress</p>
                  <p className="text-sm font-bold text-[#3D4E3D] tabular-nums">{Math.round((currentDebtor.amountPaid / Math.max(currentDebtor.totalDebt, 1)) * 100)}%</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!currentDebtor && <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">No managed accounts yet</p>}
      </div>
    </div>
  );
};
