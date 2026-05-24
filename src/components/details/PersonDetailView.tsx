import React from 'react';
import { Debtor, Transaction, WorkflowEntry } from '../../types';
import { ArrowLeft, Calendar, CheckCircle2, AlertCircle, ArrowUpCircle, ArrowDownCircle, User, Pencil, Workflow } from 'lucide-react';
import { cn, formatDateOnly, formatINR } from '../../lib/utils';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { CANDIDATE_STAGE_META, CANDIDATE_STAGE_ORDER, getStageIndex, getStageProgress } from '../../constants';

interface PersonDetailViewProps {
  debtor: Debtor;
  transactions: Transaction[];
  workflowEntries: WorkflowEntry[];
  onBack: () => void;
  onEditDebtor: (debtor: Debtor, e?: React.MouseEvent) => void;
  onOpenWorkflowUpdate: () => void;
}

export const PersonDetailView: React.FC<PersonDetailViewProps> = ({ debtor, transactions, workflowEntries, onBack, onEditDebtor, onOpenWorkflowUpdate }) => {
  const debtorTransactions = transactions
    .filter(t => t.debtorId === debtor.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  const personWorkflow = workflowEntries
    .filter(entry => entry.debtorId === debtor.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  const progress = debtor.totalDebt > 0 ? (debtor.amountPaid / debtor.totalDebt) * 100 : 0;
  const balance = Math.max(debtor.totalDebt - debtor.amountPaid, 0);
  const workflowProgress = getStageProgress(debtor.currentStage);
  const stageMeta = CANDIDATE_STAGE_META[debtor.currentStage];
  const currentStageIndex = getStageIndex(debtor.currentStage);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      className="space-y-6 sm:space-y-8 font-sans pb-20"
    >
      {/* Top action header controls */}
      <div className="flex items-center justify-between gap-3 z-10 shrink-0">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-4 py-2.5 bg-white/45 backdrop-blur-xl border border-white/50 rounded-2xl text-[#3D4E3D] hover:text-[#0f172a] hover:bg-white/70 font-bold text-xs select-none transition-all group shadow-sm focus:outline-none"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back List
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenWorkflowUpdate} 
            className="flex items-center gap-2 px-4 py-2.5 bg-white/45 backdrop-blur-xl border border-white/50 rounded-2xl text-[#3D4E3D] hover:text-[#0f172a] hover:bg-white/70 font-bold text-xs select-none transition-all shadow-sm focus:outline-none"
          >
            <Workflow size={15} />
            Update Stage
          </button>
          <button 
            onClick={(event) => onEditDebtor(debtor, event)} 
            className="flex items-center gap-2 px-4 py-2.5 bg-white/45 backdrop-blur-xl border border-white/50 rounded-2xl text-[#3D4E3D] hover:text-[#0f172a] hover:bg-white/70 font-bold text-xs select-none transition-all shadow-sm focus:outline-none"
          >
            <Pencil size={15} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Side: Frosted Profile Summary & Progress card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 sm:p-9 text-center relative overflow-hidden group">
            {/* Watermark background icon */}
            <div className="absolute top-[5%] right-[-10%] p-6 text-[#3D4E3D]/[0.02] group-hover:text-[#3D4E3D]/[0.04] transition-colors pointer-events-none">
              <User size={180} />
            </div>

            <div className="relative z-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#3D4E3D] to-[#202920] text-[#EFE7D2] rounded-[28px] sm:rounded-[32px] flex items-center justify-center font-extrabold text-2xl sm:text-3xl mx-auto mb-5 shadow-lg shadow-[#3D4E3D]/25 transition-transform group-hover:scale-103">
                {debtor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight mb-2 break-words leading-tight">{debtor.name}</h2>
              <p className="text-[9.5px] uppercase tracking-[0.25em] font-extrabold text-slate-400 mb-5">Ledger Port: DF-{debtor.id.slice(-4)}</p>

              {debtor.labels.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                  {debtor.labels.map((label) => (
                    <span key={label} className="rounded-full bg-white/60 px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest text-[#3D4E3D] border border-white/50">
                      {label}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-center mb-6 sm:mb-8">
                <span className={cn(
                  'px-4 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest shadow-sm border border-transparent', 
                  balance === 0 
                    ? 'bg-emerald-500/15 text-emerald-700 border-emerald-300/25' 
                    : debtor.status === 'OVERDUE' 
                      ? 'bg-rose-500/15 text-rose-700 border-rose-300/25' 
                      : 'bg-[#3D4E3D]/10 text-[#3D4E3D] border-[#3D4E3D]/20'
                )}>
                  {balance === 0 ? 'Settled Complete' : debtor.status}
                </span>
              </div>

              {/* High-end blown-glass radial progress chart */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-6 sm:mb-8">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_4px_16px_rgba(61,78,61,0.1)]" viewBox="0 0 220 220">
                  <circle cx="110" cy="110" r="88" stroke="rgba(15,23,42,0.05)" strokeWidth="15" fill="transparent" />
                  <motion.circle 
                    initial={{ strokeDashoffset: 553 }} 
                    animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }} 
                    transition={{ duration: 1.3, ease: 'easeOut' }} 
                    cx="110" 
                    cy="110" 
                    r="88" 
                    stroke="currentColor" 
                    strokeWidth="15" 
                    strokeDasharray="552.92" 
                    fill="transparent" 
                    className="text-[#3D4E3D]" 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f172a] font-display">{Math.round(progress)}%</span>
                  <span className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-extrabold mt-1">Paid off</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left p-4.5 bg-white/20 backdrop-blur-xl rounded-[24px] border border-white/50 shadow-sm">
                <div>
                  <p className="text-[8.5px] uppercase tracking-widest text-slate-500 font-extrabold mb-1">Due Balance</p>
                  <p className="text-base sm:text-lg font-extrabold tabular-nums text-red-600/95 break-words">{formatINR(balance)}</p>
                </div>
                <div className="border-l border-slate-300/30 pl-4">
                  <p className="text-[8.5px] uppercase tracking-widest text-[#3D4E3D] font-extrabold mb-1">Original Debt</p>
                  <p className="text-base sm:text-lg font-extrabold tabular-nums text-slate-800 break-words">{formatINR(debtor.totalDebt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Stage summary card */}
          <div className="glass-panel p-5 sm:p-7 space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#0f172a] tracking-tight leading-none font-display">Tracking Pipeline</h3>
                <p className="text-[8.5px] uppercase tracking-[0.2em] font-extrabold text-slate-500 mt-1.5">Candidate Context</p>
              </div>
              <span className={cn('px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest', stageMeta.badgeClassName)}>
                {stageMeta.shortLabel}
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-extrabold">Active Stage</p>
                <p className="font-extrabold text-[#0f172a] text-right">{stageMeta.label}</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-extrabold">Last Modified</p>
                <p className="font-extrabold text-slate-750 text-right">{formatDateOnly(debtor.lastStageDate) || '-'}</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[9px] uppercase tracking-widest text-[#3D4E3D] font-extrabold">Date of Joining</p>
                <p className="font-extrabold text-[#3D4E3D] text-right">{formatDateOnly(debtor.joiningDate) || '-'}</p>
              </div>
            </div>

            <div className="pt-2">
              <div className="h-1.5 rounded-full bg-gray-200/50 overflow-hidden mb-2">
                <motion.div initial={{ width: 0 }} animate={{ width: `${workflowProgress}%` }} className={cn('h-full rounded-full', stageMeta.accentClassName)} />
              </div>
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">{Math.round(workflowProgress)}% process pipeline completed</p>
            </div>

            {/* Stage tracker visualization list */}
            <div className="space-y-2.5 pt-3 border-t border-white/10">
              {CANDIDATE_STAGE_ORDER.map((stage, sIdx) => {
                const meta = CANDIDATE_STAGE_META[stage];
                const isComplete = sIdx < currentStageIndex || (debtor.currentStage === 'OFFER_RELEASED' && sIdx <= currentStageIndex);
                const isCurrent = sIdx === currentStageIndex;
                return (
                  <div key={stage} className="flex items-center gap-3">
                    <span className={cn('h-2.5 w-2.5 rounded-full shrink-0 outline-4 outline-transparent outline-offset-1', isCurrent || isComplete ? meta.accentClassName : 'bg-slate-300/80')} />
                    <div className="flex items-center justify-between gap-3 flex-1 min-w-0">
                      <p className={cn('text-xs font-bold truncate', isCurrent ? 'text-[#0f172a] font-extrabold' : 'text-slate-500')}>{meta.label}</p>
                      <span className={cn(
                        'text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full whitespace-nowrap', 
                        isCurrent || isComplete ? meta.badgeClassName : 'bg-white/20 text-slate-400'
                      )}>
                        {isCurrent ? 'Active' : isComplete ? 'Complete' : 'Pending'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Ledger Logs and Workflow comments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 sm:p-9 flex flex-col min-h-[440px] sm:min-h-[560px]">
            <div className="flex justify-between items-center mb-6 sm:mb-10 shrink-0 border-b border-white/15 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#0f172a] tracking-tight font-display">Ledger Movements</h3>
                <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-[0.25em] mt-1">Movement record history</p>
              </div>
              <div className="bg-white/50 p-2.5 rounded-xl shadow-sm border border-transparent hover:border-white/10 select-none">
                <Calendar size={16} className="text-[#3D4E3D]" />
              </div>
            </div>

            {/* Transaction feed timeline */}
            <div className="relative space-y-5 flex-1 overflowing-timeline overflow-y-auto max-h-[460px] pr-1">
              {debtorTransactions.length > 0 ? (
                <div className="space-y-4">
                  {debtorTransactions.map((tx, idx) => {
                    const isPayment = tx.type === 'PAYMENT';
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -16 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: Math.min(idx * 0.04, 0.4) }} 
                        key={tx.id} 
                        className="group flex items-start gap-4 p-4.5 bg-white/20 backdrop-blur-xl rounded-[20px] sm:rounded-[24px] border border-white/30 hover:bg-white/45 hover:scale-[1.01] transition-all shadow-sm"
                      >
                        <div className={cn(
                          'flex items-center justify-center w-11 h-11 rounded-2xl shrink-0 border border-white/20 shadow-sm transition-transform group-hover:rotate-12', 
                          isPayment 
                            ? 'bg-emerald-500/10 text-emerald-700' 
                            : 'bg-[#1A1A1A] text-[#efede4]'
                        )}>
                          {isPayment ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                            <h4 className="font-extrabold text-[#0f172a] text-sm tracking-tight leading-tight">
                              {isPayment ? 'Instalment Received' : 'Balance Added'}
                            </h4>
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                              {format(new Date(tx.date), 'dd - MMM - yy')}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-semibold line-clamp-2 mb-3">
                            {tx.note || 'Regular ledger ledger entry.'}
                          </p>
                          <div className="flex items-center justify-between gap-4 border-t border-slate-300/10 pt-2.5">
                            <span className={cn(
                              'text-base font-extrabold tracking-tight tabular-nums', 
                              isPayment ? 'text-emerald-700' : 'text-[#0f172a]'
                            )}>
                              {isPayment ? '-' : '+'}{formatINR(tx.amount)}
                            </span>
                            <div className="flex items-center gap-1 px-2.5 py-0.5 bg-white/70 rounded-full border border-slate-200/50 shadow-xs">
                              <CheckCircle2 size={10} className="text-emerald-500" />
                              <span className="text-[8.5px] font-extrabold text-[#3D4E3D] uppercase">Verified</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="p-7 bg-white/40 rounded-full mb-4 border border-dashed border-slate-300/40">
                    <AlertCircle size={32} className="text-slate-400" />
                  </div>
                  <p className="font-extrabold text-slate-800 text-sm">Clear balances, quiet history</p>
                  <p className="text-[9.5px] font-bold uppercase tracking-widest text-slate-400 mt-1">No transaction statements recorded yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Workflow Notes logs */}
          <div className="glass-panel p-5 sm:p-7">
            <div className="border-b border-white/10 pb-3 mb-4">
              <h3 className="text-base sm:text-lg font-extrabold text-[#0f172a] tracking-tight font-display">Notes & Recruitment Logs</h3>
              <p className="text-[8.5px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Stage movement notes</p>
            </div>

            {personWorkflow.length > 0 ? (
              <div className="space-y-3.5">
                {personWorkflow.map((entry) => {
                  const meta = CANDIDATE_STAGE_META[entry.stage];
                  return (
                    <div key={entry.id} className="rounded-[20px] border border-white/40 bg-white/20 p-4 shadow-xs">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-extrabold text-[#0f172a] leading-tight">{meta.label}</p>
                          <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mt-1">
                            {format(new Date(entry.date), 'dd - MMM - yy')}
                          </p>
                        </div>
                        <span className={cn('px-2.5 py-1 rounded-full text-[8.5px] font-extrabold uppercase tracking-widest whitespace-nowrap', meta.badgeClassName)}>
                          {meta.shortLabel}
                        </span>
                      </div>
                      <p className="mt-3.5 text-xs text-slate-600 font-semibold leading-relaxed">
                        {entry.note || 'No custom notes provided for this recruitment milestone.'}
                      </p>
                      {entry.joiningDate && (
                        <p className="mt-2.5 text-[9px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-500/10 px-2.5 py-1 rounded-md w-fit">
                          Confirmed Joining: {formatDateOnly(entry.joiningDate)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-slate-300/50 bg-white/15 p-8 text-center">
                <p className="font-extrabold text-slate-700 text-sm">No stage events recorded.</p>
                <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#3D4E3D]/70 mt-1">Click "Update Stage" to log interview feedback dates.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};
