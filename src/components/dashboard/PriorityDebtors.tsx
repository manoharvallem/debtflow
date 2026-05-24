import React from 'react';
import { Debtor } from '../../types';
import { cn, formatINR } from '../../lib/utils';
import { motion } from 'motion/react';
import { CANDIDATE_STAGE_META } from '../../constants';

interface PriorityDebtorsProps {
  debtors: Debtor[];
  onViewAll: () => void;
  onSelectDebtor: (debtor: Debtor) => void;
}

const getProgressColor = (pct: number) => {
  if (pct >= 100) return 'text-emerald-600';     // Fully settled
  if (pct >= 66)  return 'text-[#3D4E3D]';       // Substantial progress
  if (pct >= 33)  return 'text-amber-600';       // Moderate progress
  if (pct > 0)    return 'text-rose-600';        // Low progress
  return 'text-slate-300';                       // Unsettled
};

export const PriorityDebtors: React.FC<PriorityDebtorsProps> = ({ debtors, onViewAll, onSelectDebtor }) => {
  const sortedDebtors = [...debtors]
    .map(debtor => ({ ...debtor, balance: Math.max(debtor.totalDebt - debtor.amountPaid, 0) }))
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5);

  return (
    <div className="p-6 sm:p-8 rounded-[36px] sm:rounded-[48px] bg-white/25 backdrop-blur-[35px] border border-white/50 shadow-[0_24px_64px_rgba(15,23,42,0.06),inset_0_1px_2px_rgba(255,255,255,0.6)] h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0 relative z-10">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0f172a] font-display">Attention Required</h3>
          <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-[0.2em] mt-1 font-sans">Greatest unpaid balance margins</p>
        </div>
        <button 
          onClick={onViewAll} 
          className="text-[10px] font-extrabold uppercase tracking-widest text-[#3D4E3D] hover:bg-white/60 bg-white/30 rounded-xl px-4 py-2 transition-all shadow-sm border border-white/40 backdrop-blur-md focus:outline-none"
        >
          View All
        </button>
      </div>

      <div className="space-y-3.5 flex-1 overflow-y-auto pr-1 custom-scrollbar relative z-10">
        {sortedDebtors.map((debtor, idx) => {
          const stageMeta = CANDIDATE_STAGE_META[debtor.currentStage];
          const progress = Math.min((debtor.amountPaid / Math.max(debtor.totalDebt, 1)) * 100, 100);

          return (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }} 
              key={debtor.id} 
              onClick={() => onSelectDebtor(debtor)} 
              className="flex items-center justify-between gap-3 p-4 bg-white/30 backdrop-blur-xl rounded-[20px] sm:rounded-[24px] cursor-pointer hover:scale-[1.015] hover:bg-white/55 transition-all border border-white/50 shadow-sm group relative"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar with Progress Ring and Custom Tooltip */}
                <div className="relative w-11 h-11 flex items-center justify-center shrink-0 group/avatar">
                  {/* Tooltip container */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pb-1.5 opacity-0 pointer-events-none group-hover/avatar:opacity-100 translate-y-1 group-hover/avatar:translate-y-0 transition-all duration-200 z-50 scale-95 group-hover/avatar:scale-100">
                    <div className="bg-[#1e231e]/95 border border-[#3D4E3D]/30 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl text-left min-w-[150px]">
                      <p className="text-[10px] font-extrabold text-[#EFE7D2] truncate border-b border-white/10 pb-1.5 mb-1.5 tracking-tight">{debtor.name}</p>
                      <div className="flex items-center gap-2.5 justify-between">
                        <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Total Debt</span>
                        <span className="text-[10px] font-black text-rose-400 font-sans leading-none">{formatINR(debtor.totalDebt)}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2.5 justify-between">
                        <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Settled</span>
                        <span className="text-[10px] font-black text-emerald-400 font-sans leading-none">{formatINR(debtor.amountPaid)}</span>
                      </div>
                    </div>
                    {/* Tooltip arrow */}
                    <div className="w-2 h-2 bg-[#1e231e] border-b border-r border-[#3D4E3D]/30 rotate-45 mx-auto -mt-1" />
                  </div>

                  <motion.div 
                    initial={{ scale: 0.82, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 20, delay: idx * 0.05 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 44 44">
                      {/* Background track circle */}
                      <circle
                        cx="22"
                        cy="22"
                        r="19"
                        fill="none"
                        stroke="rgba(15, 23, 42, 0.06)"
                        strokeWidth="2.5"
                      />
                      {/* Active settlement progress ring */}
                      <motion.circle
                        cx="22"
                        cy="22"
                        r="19"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeDasharray={119.38} // 2 * Math.PI * 19
                        initial={{ strokeDashoffset: 119.38 }}
                        animate={{ strokeDashoffset: 119.38 - (progress / 100) * 119.38 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 + idx * 0.06 }}
                        strokeLinecap="round"
                        className={cn("transition-colors duration-500", getProgressColor(progress))}
                      />
                    </svg>
                  </motion.div>
                  
                  {/* Initials Label inside ring */}
                  <div className="w-8 h-8 bg-gradient-to-br from-[#EFE7D2] to-[#dfd5ba] rounded-full flex items-center justify-center text-[#3D4E3D] font-extrabold text-[10px] shadow-xs border border-white/60 group-hover:rotate-6 transition-transform relative z-10 shrink-0">
                    {debtor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="font-extrabold text-sm text-[#0f172a] group-hover:text-[#3D4E3D] transition-colors truncate leading-tight">{debtor.name}</p>
                  <p className={cn('text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full mt-1.5 w-fit leading-none', stageMeta.badgeClassName)}>
                    {stageMeta.shortLabel}
                  </p>
                </div>
              </div>
              
              <div className="text-right shrink-0">
                <p className="text-sm font-extrabold text-red-600/90 tabular-nums font-sans leading-none">{formatINR(debtor.balance)}</p>
                <div className="flex items-center justify-end gap-1.5 text-[8.5px] font-extrabold uppercase mt-2.5 tracking-wider select-none leading-none">
                  <span className={cn('w-1.5 h-1.5 rounded-full inline-block shrink-0', stageMeta.accentClassName)} />
                  <span className={getProgressColor(progress)}>
                    {Math.round(progress)}% Settled
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {sortedDebtors.length === 0 && (
          <div className="py-12 px-6 text-center flex flex-col items-center justify-center h-full relative z-10">
            <div className="relative w-36 h-36 mb-5 flex items-center justify-center">
              {/* Layered decorative rotating ring */}
              <motion.div 
                className="absolute inset-0 rounded-full border border-dashed border-[#3D4E3D]/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              />
              {/* Frosted glass warm backdrop */}
              <div className="absolute inset-4 rounded-full bg-[#EFE7D2]/40 backdrop-blur-md border border-white/60 shadow-inner flex items-center justify-center" />
              
              {/* Minimalist Balanced Scale Inline SVG Vector */}
              <svg 
                className="relative w-18 h-18 text-[#3D4E3D]/70 drop-shadow-sm" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Scale Base */}
                <path d="M30 80 H70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M50 80 V30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M42 80 L50 72 L58 80" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Scale Beam (Balanced) */}
                <path d="M25 35 H75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                {/* Center Pivot */}
                <circle cx="50" cy="30" r="3" fill="currentColor" />
                
                {/* Left Pan */}
                <path d="M25 35 L12 60 H38 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <line x1="25" y1="35" x2="25" y2="45" stroke="currentColor" strokeWidth="1.5" />
                
                {/* Right Pan */}
                <path d="M75 35 L62 60 H88 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <line x1="75" y1="35" x2="75" y2="45" stroke="currentColor" strokeWidth="1.5" />

                {/* Floating Sage Green Zen Leaf */}
                <path 
                  d="M58 42 C62 42 68 45 66 50 C64 55 60 53 58 50 C56 47 56 42 58 42 Z" 
                  fill="#7FA07F" 
                  opacity="0.85" 
                />
                <path 
                  d="M58 50 C56 48 58 45 60 44" 
                  stroke="#EFE7D2" 
                  strokeWidth="1" 
                  strokeLinecap="round" 
                />
              </svg>
            </div>
            
            <h4 className="text-sm font-extrabold text-[#0f172a] tracking-tight">Equilibrium Restored</h4>
            <p className="mt-2 text-[10px] text-slate-500 font-semibold max-w-[260px] mx-auto leading-relaxed">
              No active claims or unpaid entries outstanding. Your ledgers are pristine, lightweight, and completely settled.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
