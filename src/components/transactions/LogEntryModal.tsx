import React, { useState } from 'react';
import { X, Search, IndianRupee, Calendar, FileText, ArrowUpCircle, ArrowDownCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Debtor, TransactionType } from '../../types';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  debtors: Debtor[];
  onSave: (data: { debtorId: string; amount: number; type: TransactionType; note: string; date: string }) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 24,
    },
  },
} as const;

export const LogEntryModal: React.FC<LogEntryModalProps> = ({ isOpen, onClose, debtors, onSave }) => {
  const [selectedDebtorId, setSelectedDebtorId] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('PAYMENT');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const isValid = selectedDebtorId && amount && parseFloat(amount) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebtorId || !amount || parseFloat(amount) <= 0) return;
    onSave({ debtorId: selectedDebtorId, amount: parseFloat(amount), type, note, date });
    setSelectedDebtorId('');
    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6">
          {/* Backdrop screen blur */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 30 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.94, y: 30 }} 
            transition={{ type: 'spring', duration: 0.48, bounce: 0.12 }}
            className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto glass-panel-strong rounded-[36px] sm:rounded-[44px] shadow-2xl border border-white/60 focus:outline-none"
          >
            {/* Header Radial layout */}
            <div className="relative overflow-hidden border-b border-white/20 bg-gradient-to-br from-white/50 via-white/10 to-cyan-100/20 p-6 sm:p-9 backdrop-blur-3xl rounded-t-[36px] sm:rounded-t-[44px]">
              <div className="absolute top-0 right-0 p-6 text-cyan-700/5 pointer-events-none">
                <FileText size={100} />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f172a] font-display">Commit Entry</h3>
                  <button 
                    type="button"
                    onClick={onClose} 
                    className="p-2.5 rounded-xl text-slate-500 hover:bg-white/40 hover:text-[#0f172a] transition-all focus:outline-none"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-xs font-bold text-[#475569]/90 tracking-tight leading-relaxed">
                  Log payments or register extra borrow requests against onboarded contacts.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-9">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6 sm:space-y-7"
              >
                {/* PAYMENT vs DEBT select pills */}
                <motion.div variants={itemVariants} className="flex p-1.5 bg-slate-900/5 backdrop-blur-xl rounded-[22px] border border-white/40 shadow-inner relative z-10">
                  <button 
                    type="button" 
                    onClick={() => setType('PAYMENT')} 
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-[16px] text-[10px] uppercase tracking-widest font-extrabold transition-all focus:outline-none', 
                      type === 'PAYMENT' 
                        ? 'bg-white text-[#3D4E3D] shadow-md border border-white/20 scale-[1.01]' 
                        : 'text-slate-500 hover:text-slate-800'
                    )}
                  >
                    <ArrowDownCircle size={15} />
                    Payment In
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setType('DEBT')} 
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-[16px] text-[10px] uppercase tracking-widest font-extrabold transition-all focus:outline-none', 
                      type === 'DEBT' 
                        ? 'bg-[#3D4E3D] text-[#EFE7D2] shadow-lg shadow-[#3D4E3D]/25 border border-white/10 scale-[1.01]' 
                        : 'text-slate-400 hover:text-slate-700'
                    )}
                  >
                    <ArrowUpCircle size={15} />
                    New Debt Out
                  </button>
                </motion.div>

                {/* Person Select & Amount input */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2">Select Person</label>
                    <div className="relative group">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4E3D]" size={15} />
                      <select 
                        value={selectedDebtorId} 
                        onChange={(e) => setSelectedDebtorId(e.target.value)} 
                        required 
                        className="w-full pl-13 pr-10 py-4 bg-white/40 rounded-2xl border border-white/50 shadow-xs appearance-none font-extrabold text-sm tracking-tight outline-none transition-all hover:bg-white/60 cursor-pointer"
                      >
                        <option value="" disabled>Choose name...</option>
                        {debtors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2">Amount</label>
                    <div className="relative group">
                      <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4E3D]" size={16} />
                      <input 
                        type="number" 
                        min="0.01"
                        step="0.01"
                        placeholder="0.00" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        required 
                        className="w-full pl-13 pr-5 py-4 bg-white/35 rounded-2xl font-bold text-sm outline-none transition-all" 
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Date & Note field */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2">Date of Posting</label>
                    <div className="relative group">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4E3D]" size={16} />
                      <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        required 
                        className="w-full pl-13 pr-5 py-4 bg-white/35 rounded-2xl font-bold text-sm outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2">Memos / Note context</label>
                    <div className="relative group">
                      <FileText className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4E3D]" size={16} />
                      <input 
                        type="text" 
                        placeholder="e.g. UPI, cash, lunch cost..." 
                        value={note} 
                        onChange={(e) => setNote(e.target.value)} 
                        className="w-full pl-13 pr-5 py-4 bg-white/35 rounded-2xl font-bold text-sm outline-none transition-all" 
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Action operations buttons */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 pt-4 pb-2 sm:pb-3">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="py-4 rounded-2xl text-[10.5px] font-extrabold uppercase tracking-widest text-[#475569] hover:text-[#0f172a] hover:bg-white/30 transition-all focus:outline-none"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit" 
                    disabled={!isValid} 
                    className={cn(
                      'py-4 rounded-2xl text-[10.5px] font-extrabold uppercase tracking-[0.18em] shadow-xl transition-all active:scale-97 cursor-pointer', 
                      type === 'PAYMENT' 
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-[#efede4] hover:brightness-105 shadow-emerald-500/20' 
                        : 'bg-gradient-to-r from-[#3D4E3D] to-[#4c5e4c] text-[#EFE7D2] hover:brightness-105 shadow-[#3D4E3D]/25', 
                      !isValid && 'opacity-40 cursor-not-allowed grayscale'
                    )}
                  >
                    Commit Ledger
                  </button>
                </motion.div>
              </motion.div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
