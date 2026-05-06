import React from 'react';
import { Debtor, Transaction } from '../../types';
import { 
  ArrowLeft, Calendar, CheckCircle2, 
  AlertCircle, ArrowUpCircle, ArrowDownCircle,
  User, Pencil
} from 'lucide-react';
import { cn, formatINR } from '../../lib/utils';
import { motion } from 'motion/react';
import { format } from 'date-fns';

interface PersonDetailViewProps {
  debtor: Debtor;
  transactions: Transaction[];
  onBack: () => void;
  onEditDebtor: (debtor: Debtor, e?: React.MouseEvent) => void;
}

export const PersonDetailView: React.FC<PersonDetailViewProps> = ({ 
  debtor, 
  transactions, 
  onBack,
  onEditDebtor
}) => {
  const debtorTransactions = transactions
    .filter(t => t.debtorId === debtor.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const progress = (debtor.amountPaid / debtor.totalDebt) * 100 || 0;
  const balance = debtor.totalDebt - debtor.amountPaid;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-5 sm:space-y-8"
    >
      <div className="flex items-center justify-between gap-3">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl text-gray-400 hover:text-[#3D4E3D] hover:bg-white font-bold text-sm transition-all group shadow-sm"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        <button
          onClick={(event) => onEditDebtor(debtor, event)}
          className="flex items-center gap-2 p-3 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl text-[#3D4E3D] hover:bg-white font-bold text-sm transition-all shadow-sm"
        >
          <Pencil size={17} />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/40 backdrop-blur-3xl p-5 sm:p-10 rounded-[28px] sm:rounded-[40px] shadow-[0_32px_64px_rgba(0,0,0,0.04)] border border-white/60 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-black/[0.02] group-hover:text-black/[0.04] transition-colors pointer-events-none">
              <User size={160} />
            </div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-[#3D4E3D] to-[#1A1A1A] text-[#EFE7D2] rounded-[28px] sm:rounded-[36px] flex items-center justify-center font-bold text-2xl sm:text-4xl mx-auto mb-5 sm:mb-8 shadow-2xl shadow-[#3D4E3D]/20 transform transition-transform group-hover:scale-105">
                {debtor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight mb-2 break-words">{debtor.name}</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6 sm:mb-10">Portfolio ID: AIS-{debtor.id.padStart(4, '0')}</p>
              
              <div className="flex justify-center gap-2 mb-6 sm:mb-10">
                <span className={cn(
                  "px-5 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-sm",
                  balance === 0 ? "bg-emerald-50 text-emerald-600" :
                  debtor.status === 'OVERDUE' ? "bg-red-50 text-red-500" : "bg-[#3D4E3D]/5 text-[#3D4E3D]"
                )}>
                  {balance === 0 ? 'Fully Settled' : debtor.status}
                </span>
              </div>

              <div className="relative w-44 h-44 sm:w-56 sm:h-56 mx-auto mb-6 sm:mb-10">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 224 224">
                  <circle
                    cx="112"
                    cy="112"
                    r="90"
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="transparent"
                    className="text-gray-100/50"
                  />
                  <motion.circle
                    initial={{ strokeDashoffset: 565 }}
                    animate={{ strokeDashoffset: 565 - (565 * progress) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="112"
                    cy="112"
                    r="90"
                    stroke="currentColor"
                    strokeWidth="16"
                    strokeDasharray="565.4"
                    fill="transparent"
                    className="text-[#3D4E3D]"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-bold tracking-tight">{Math.round(progress)}%</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1 text-center">Recovered</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-left p-4 sm:p-6 bg-white/60 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] border border-white/60 shadow-sm">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Balance</p>
                  <p className="text-base sm:text-xl font-bold tabular-nums text-red-400 break-words">{formatINR(balance)}</p>
                </div>
                <div className="border-l border-gray-100 pl-4">
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Total</p>
                  <p className="text-base sm:text-xl font-bold tabular-nums break-words">{formatINR(debtor.totalDebt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Transaction Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/40 backdrop-blur-3xl p-5 sm:p-10 rounded-[28px] sm:rounded-[40px] shadow-[0_32px_64px_rgba(0,0,0,0.04)] border border-white/60 flex flex-col min-h-[420px] sm:min-h-[600px]">
            <div className="flex justify-between items-center mb-6 sm:mb-12">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">Activity Log</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1 text-center">Chronological audit trail</p>
              </div>
              <div className="bg-white/80 p-2 rounded-2xl shadow-sm border border-transparent hover:border-white transition-all cursor-pointer">
                <Calendar size={20} className="text-gray-400" />
              </div>
            </div>

            <div className="relative space-y-6 sm:space-y-10 flex-1">
              {debtorTransactions.length > 0 ? (
                <div className="space-y-6">
                  {debtorTransactions.map((tx, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={tx.id} 
                      className="group flex items-start gap-4 sm:gap-6 p-4 sm:p-6 bg-white/60 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] border border-white/40 hover:bg-white hover:scale-[1.01] transition-all shadow-sm"
                    >
                      <div className={cn(
                        "flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl shrink-0 shadow-sm border border-white transition-transform group-hover:rotate-3",
                        tx.type === 'PAYMENT' ? "bg-emerald-50 text-emerald-600" : "bg-[#1A1A1A] text-white shadow-xl shadow-black/10"
                      )}>
                        {tx.type === 'PAYMENT' ? <ArrowDownCircle size={24} /> : <ArrowUpCircle size={24} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                          <h4 className="font-bold text-[#1A1A1A] tracking-tight">
                            {tx.type === 'PAYMENT' ? 'Instalment Received' : 'Balance Adjustments'}
                          </h4>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{format(new Date(tx.date), 'MMM dd, yyyy')}</span>
                        </div>
                        <p className="text-sm text-gray-400 font-medium line-clamp-1 mb-4">{tx.note || 'Regular ledger entry'}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <span className={cn(
                            "text-xl font-bold tracking-tight tabular-nums",
                            tx.type === 'PAYMENT' ? "text-emerald-600" : "text-[#1A1A1A]"
                          )}>
                            {tx.type === 'PAYMENT' ? '-' : '+'}{formatINR(tx.amount)}
                          </span>
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full border border-gray-50 shadow-sm">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Verified</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400/50 py-20">
                  <div className="p-8 bg-gray-50 rounded-full mb-6 border border-dashed border-gray-200">
                    <AlertCircle size={40} className="text-gray-300" />
                  </div>
                  <p className="font-bold text-lg text-gray-300">Quiet periods are rare</p>
                  <p className="text-xs font-bold uppercase tracking-widest mt-1">No transactions recorded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
