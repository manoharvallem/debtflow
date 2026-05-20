import React from 'react';
import { Debtor, Transaction, WorkflowEntry } from '../../types';
import { ArrowLeft, Calendar, CheckCircle2, AlertCircle, ArrowUpCircle, ArrowDownCircle, User, Pencil, Workflow } from 'lucide-react';
import { cn, formatINR } from '../../lib/utils';
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
  const debtorTransactions = transactions.filter(t => t.debtorId === debtor.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const personWorkflow = workflowEntries.filter(entry => entry.debtorId === debtor.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const progress = debtor.totalDebt > 0 ? (debtor.amountPaid / debtor.totalDebt) * 100 : 0;
  const balance = debtor.totalDebt - debtor.amountPaid;
  const workflowProgress = getStageProgress(debtor.currentStage);
  const stageMeta = CANDIDATE_STAGE_META[debtor.currentStage];
  const currentStageIndex = getStageIndex(debtor.currentStage);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5 sm:space-y-8">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onBack} className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl text-gray-400 hover:text-[#3D4E3D] hover:bg-white font-bold text-sm transition-all group shadow-sm"><ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />Back</button>
        <div className="flex items-center gap-2">
          <button onClick={onOpenWorkflowUpdate} className="flex items-center gap-2 p-3 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl text-[#3D4E3D] hover:bg-white font-bold text-sm transition-all shadow-sm"><Workflow size={17} />Update Workflow</button>
          <button onClick={(event) => onEditDebtor(debtor, event)} className="flex items-center gap-2 p-3 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl text-[#3D4E3D] hover:bg-white font-bold text-sm transition-all shadow-sm"><Pencil size={17} />Edit</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/40 backdrop-blur-3xl p-5 sm:p-10 rounded-[28px] sm:rounded-[40px] shadow-[0_32px_64px_rgba(0,0,0,0.04)] border border-white/60 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-black/[0.02] group-hover:text-black/[0.04] transition-colors pointer-events-none"><User size={160} /></div>
            <div className="relative z-10">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-[#3D4E3D] to-[#1A1A1A] text-[#EFE7D2] rounded-[28px] sm:rounded-[36px] flex items-center justify-center font-bold text-2xl sm:text-4xl mx-auto mb-5 sm:mb-8 shadow-2xl shadow-[#3D4E3D]/20 transform transition-transform group-hover:scale-105">{debtor.name.split(' ').map(n => n[0]).join('')}</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight mb-2 break-words">{debtor.name}</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6 sm:mb-10">Portfolio ID: AIS-{debtor.id.padStart(4, '0')}</p>

              {debtor.labels.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {debtor.labels.map((label) => (
                    <span key={label} className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#3D4E3D] border border-white/70">
                      {label}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-center gap-2 mb-6 sm:mb-10">
                <span className={cn('px-5 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-sm', balance === 0 ? 'bg-emerald-50 text-emerald-600' : debtor.status === 'OVERDUE' ? 'bg-red-50 text-red-500' : 'bg-[#3D4E3D]/5 text-[#3D4E3D]')}>{balance === 0 ? 'Fully Settled' : debtor.status}</span>
              </div>

              <div className="relative w-44 h-44 sm:w-56 sm:h-56 mx-auto mb-6 sm:mb-10">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 224 224">
                  <circle cx="112" cy="112" r="90" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-gray-100/50" />
                  <motion.circle initial={{ strokeDashoffset: 565 }} animate={{ strokeDashoffset: 565 - (565 * progress) / 100 }} transition={{ duration: 1.5, ease: 'easeOut' }} cx="112" cy="112" r="90" stroke="currentColor" strokeWidth="16" strokeDasharray="565.4" fill="transparent" className="text-[#3D4E3D]" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-bold tracking-tight">{Math.round(progress)}%</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1 text-center">Recovered</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-left p-4 sm:p-6 bg-white/60 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] border border-white/60 shadow-sm">
                <div><p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Balance</p><p className="text-base sm:text-xl font-bold tabular-nums text-red-400 break-words">{formatINR(balance)}</p></div>
                <div className="border-l border-gray-100 pl-4"><p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Total</p><p className="text-base sm:text-xl font-bold tabular-nums break-words">{formatINR(debtor.totalDebt)}</p></div>
              </div>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-3xl p-5 sm:p-8 rounded-[28px] sm:rounded-[36px] border border-white/60 shadow-[0_20px_48px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1A] tracking-tight">Candidate Workflow</h3>
                <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-gray-400 mt-1">Secondary tracking</p>
              </div>
              <span className={cn('px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest', stageMeta.badgeClassName)}>{stageMeta.shortLabel}</span>
            </div>
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between gap-3"><p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Current Stage</p><p className="text-sm font-bold text-[#1A1A1A]">{stageMeta.label}</p></div>
              <div className="flex items-center justify-between gap-3"><p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Last Update</p><p className="text-sm font-bold text-[#1A1A1A]">{debtor.lastStageDate || '-'}</p></div>
              <div className="flex items-center justify-between gap-3"><p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Joining Date</p><p className="text-sm font-bold text-[#1A1A1A]">{debtor.joiningDate || '-'}</p></div>
            </div>
            <div className="h-2 rounded-full bg-gray-100/80 overflow-hidden mb-3"><motion.div initial={{ width: 0 }} animate={{ width: `${workflowProgress}%` }} className={cn('h-full rounded-full', stageMeta.accentClassName)} /></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-5">{Math.round(workflowProgress)}% Through Workflow</p>
            <div className="space-y-3">
              {CANDIDATE_STAGE_ORDER.map((stage, index) => {
                const meta = CANDIDATE_STAGE_META[stage];
                const isComplete = index < currentStageIndex || (debtor.currentStage === 'OFFER_RELEASED' && index <= currentStageIndex);
                const isCurrent = index === currentStageIndex;
                return (
                  <div key={stage} className="flex items-center gap-3">
                    <span className={cn('h-2.5 w-2.5 rounded-full shrink-0', isCurrent || isComplete ? meta.accentClassName : 'bg-gray-200')} />
                    <div className="flex items-center justify-between gap-3 flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1A1A1A] truncate">{meta.label}</p>
                      <span className={cn('text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full', isCurrent || isComplete ? meta.badgeClassName : 'bg-slate-100 text-slate-400')}>{isCurrent ? 'Current' : isComplete ? 'Done' : 'Pending'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/40 backdrop-blur-3xl p-5 sm:p-10 rounded-[28px] sm:rounded-[40px] shadow-[0_32px_64px_rgba(0,0,0,0.04)] border border-white/60 flex flex-col min-h-[420px] sm:min-h-[600px]">
            <div className="flex justify-between items-center mb-6 sm:mb-12">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">Activity Log</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1 text-center">Chronological audit trail</p>
              </div>
              <div className="bg-white/80 p-2 rounded-2xl shadow-sm border border-transparent hover:border-white transition-all cursor-pointer"><Calendar size={20} className="text-gray-400" /></div>
            </div>

            <div className="relative space-y-6 sm:space-y-10 flex-1">
              {debtorTransactions.length > 0 ? (
                <div className="space-y-6">
                  {debtorTransactions.map((tx, idx) => (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} key={tx.id} className="group flex items-start gap-4 sm:gap-6 p-4 sm:p-6 bg-white/60 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] border border-white/40 hover:bg-white hover:scale-[1.01] transition-all shadow-sm">
                      <div className={cn('flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl shrink-0 shadow-sm border border-white transition-transform group-hover:rotate-3', tx.type === 'PAYMENT' ? 'bg-emerald-50 text-emerald-600' : 'bg-[#1A1A1A] text-white shadow-xl shadow-black/10')}>
                        {tx.type === 'PAYMENT' ? <ArrowDownCircle size={24} /> : <ArrowUpCircle size={24} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                          <h4 className="font-bold text-[#1A1A1A] tracking-tight">{tx.type === 'PAYMENT' ? 'Instalment Received' : 'Balance Adjustments'}</h4>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{format(new Date(tx.date), 'MMM dd, yyyy')}</span>
                        </div>
                        <p className="text-sm text-gray-400 font-medium line-clamp-1 mb-4">{tx.note || 'Regular ledger entry'}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <span className={cn('text-xl font-bold tracking-tight tabular-nums', tx.type === 'PAYMENT' ? 'text-emerald-600' : 'text-[#1A1A1A]')}>{tx.type === 'PAYMENT' ? '-' : '+'}{formatINR(tx.amount)}</span>
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full border border-gray-50 shadow-sm"><CheckCircle2 size={12} className="text-emerald-500" /><span className="text-[9px] font-bold text-gray-400 uppercase">Verified</span></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400/50 py-20">
                  <div className="p-8 bg-gray-50 rounded-full mb-6 border border-dashed border-gray-200"><AlertCircle size={40} className="text-gray-300" /></div>
                  <p className="font-bold text-lg text-gray-300">Quiet periods are rare</p>
                  <p className="text-xs font-bold uppercase tracking-widest mt-1">No transactions recorded yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-3xl p-5 sm:p-8 rounded-[28px] sm:rounded-[36px] border border-white/60 shadow-[0_20px_48px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] tracking-tight">Workflow Notes</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Candidate context</p>
              </div>
            </div>

            {personWorkflow.length > 0 ? (
              <div className="space-y-4">
                {personWorkflow.map((entry) => {
                  const meta = CANDIDATE_STAGE_META[entry.stage];
                  return (
                    <div key={entry.id} className="rounded-[24px] border border-white/60 bg-white/55 p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-[#1A1A1A]">{meta.label}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">{format(new Date(entry.date), 'MMM dd, yyyy')}</p>
                        </div>
                        <span className={cn('px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest', meta.badgeClassName)}>{meta.shortLabel}</span>
                      </div>
                      <p className="mt-3 text-sm text-gray-500">{entry.note || 'No comments added for this workflow stage.'}</p>
                      {entry.joiningDate && (
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Joining Date: {entry.joiningDate}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-gray-200 bg-white/35 p-8 text-center">
                <p className="font-bold text-gray-400">No workflow updates yet</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mt-1">Use Update Workflow to start tracking rounds</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
