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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/35 backdrop-blur-md" />
          <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto liquid-panel rounded-[40px] sm:rounded-[56px] border border-white/70">
            <div className="relative overflow-hidden rounded-t-[40px] sm:rounded-t-[56px] border-b border-white/50 bg-gradient-to-br from-white/55 via-white/30 to-cyan-100/30 p-6 sm:p-10 backdrop-blur-3xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <FileText size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">Financial Entry</h3>
                  <button onClick={onClose} className="p-3 rounded-2xl text-slate-500 hover:bg-white/30 hover:text-[#1A1A1A] transition-all">
                    <X size={24} />
                  </button>
                </div>
                <p className="text-gray-500 font-medium tracking-tight sm:max-w-[80%]">Record a new debt or payment without changing the design language of the app.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-10 space-y-5 sm:space-y-8">
              <div className="flex p-1.5 bg-black/[0.03] backdrop-blur-xl rounded-[28px] border border-black/5 ring-1 ring-white/20">
                <button type="button" onClick={() => setType('PAYMENT')} className={cn('flex-1 flex items-center justify-center gap-2 sm:gap-3 py-4 rounded-[18px] text-[10px] uppercase tracking-widest font-bold transition-all', type === 'PAYMENT' ? 'bg-white text-[#1A1A1A] shadow-[0_8px_16px_rgba(0,0,0,0.05)]' : 'text-gray-400 hover:text-gray-600')}>
                  <ArrowDownCircle size={18} />
                  Payment In
                </button>
                <button type="button" onClick={() => setType('DEBT')} className={cn('flex-1 flex items-center justify-center gap-2 sm:gap-3 py-4 rounded-[18px] text-[10px] uppercase tracking-widest font-bold transition-all', type === 'DEBT' ? 'bg-[#3D4E3D] text-[#EFE7D2] shadow-[0_8px_16px_rgba(61,78,61,0.2)]' : 'text-gray-400 hover:text-gray-600')}>
                  <ArrowUpCircle size={18} />
                  New Debt
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Person</label>
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={18} />
                    <select value={selectedDebtorId} onChange={(e) => setSelectedDebtorId(e.target.value)} required className="w-full pl-14 pr-10 py-5 bg-white/40 rounded-[28px] border border-white shadow-sm focus:ring-4 focus:ring-black/5 appearance-none font-bold text-sm tracking-tight outline-none transition-all hover:bg-white/60">
                      <option value="" disabled>Choose person...</option>
                      {debtors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Amount</label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={18} />
                    <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full pl-14 pr-6 py-5 bg-white/40 rounded-[28px] border border-white shadow-sm focus:ring-4 focus:ring-black/5 font-bold text-sm outline-none transition-all hover:bg-white/60" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Transaction Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={18} />
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full pl-14 pr-6 py-5 bg-white/60 rounded-[28px] border border-white/80 shadow-sm focus:ring-4 focus:ring-[#3D4E3D]/5 font-bold text-sm outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Memo / Reference</label>
                  <div className="relative group">
                    <FileText className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={18} />
                    <input type="text" placeholder="Optional details..." value={note} onChange={(e) => setNote(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-white/60 rounded-[28px] border border-white/80 shadow-sm focus:ring-4 focus:ring-[#3D4E3D]/5 font-bold text-sm outline-none transition-all" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:flex gap-3 sm:gap-4 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-4 sm:py-5 rounded-[28px] text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#1A1A1A] hover:bg-white/40 transition-all">Discard</button>
                <button type="submit" disabled={!isValid} className={cn('flex-[1.5] py-4 sm:py-5 rounded-[28px] text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95', type === 'PAYMENT' ? 'bg-[#1A1A1A] text-white shadow-black/10 hover:bg-black' : 'bg-[#3D4E3D] text-[#EFE7D2] shadow-[#3D4E3D]/20 hover:brightness-110', !isValid && 'opacity-50 cursor-not-allowed grayscale')}>
                  Commit Ledger
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
