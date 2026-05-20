import React, { useState } from 'react';
import { X, User, IndianRupee, FileText, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

interface AddDebtorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; initialDebt: number; note: string; referredDate: string; labels: string[] }) => void;
}

export const AddDebtorModal: React.FC<AddDebtorModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [initialDebt, setInitialDebt] = useState('');
  const [note, setNote] = useState('');
  const [labels, setLabels] = useState('');
  const [referredDate, setReferredDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || (initialDebt && parseFloat(initialDebt) < 0)) return;
    onSave({
      name: name.trim(),
      initialDebt: parseFloat(initialDebt) || 0,
      note,
      referredDate,
      labels: labels.split(',').map((label) => label.trim()).filter(Boolean),
    });
    setName('');
    setInitialDebt('');
    setNote('');
    setLabels('');
    setReferredDate(format(new Date(), 'yyyy-MM-dd'));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-3 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/35 backdrop-blur-md" />
          <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto liquid-panel rounded-[32px] sm:rounded-[48px] border border-white/80">
            <div className="relative overflow-hidden rounded-t-[32px] sm:rounded-t-[48px] border-b border-white/50 bg-gradient-to-br from-white/55 via-white/30 to-sky-100/35 p-6 sm:p-10 backdrop-blur-3xl">
              <div className="absolute top-0 right-0 p-8 text-black/[0.04] pointer-events-none rotate-12">
                <User size={140} />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">Onboard Member</h3>
                  <button onClick={onClose} className="p-3 rounded-2xl text-slate-500 hover:bg-white/30 hover:text-[#1A1A1A] transition-all"><X size={24} /></button>
                </div>
                <p className="font-medium tracking-tight text-glass-subtle">Create a debt profile first, then use the workflow section only as supporting candidate context.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-10 space-y-5 sm:space-y-8">
              <div className="space-y-3">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Full Identity</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={18} />
                  <input type="text" placeholder="e.g. Vikram Seth" value={name} onChange={(e) => setName(e.target.value)} required className="w-full pl-14 pr-6 py-5 bg-white/60 rounded-[28px] border border-white/80 shadow-sm focus:ring-4 focus:ring-sky-500/10 font-bold text-sm outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Opening Balance</label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={18} />
                    <input type="number" placeholder="0.00" value={initialDebt} onChange={(e) => setInitialDebt(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-white/60 rounded-[28px] border border-white/80 shadow-sm focus:ring-4 focus:ring-sky-500/10 font-bold text-sm outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Workflow Start Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={18} />
                    <input type="date" value={referredDate} onChange={(e) => setReferredDate(e.target.value)} required className="w-full pl-14 pr-6 py-5 bg-white/60 rounded-[28px] border border-white/80 shadow-sm focus:ring-4 focus:ring-sky-500/10 font-bold text-sm outline-none transition-all" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Comments</label>
                <div className="relative group">
                  <FileText className="absolute left-5 top-5 text-gray-400 group-hover:text-black transition-colors" size={18} />
                  <textarea placeholder="Add repayment or interview context if needed..." value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full pl-14 pr-6 py-5 bg-white/60 rounded-[28px] border border-white/80 shadow-sm focus:ring-4 focus:ring-sky-500/10 font-bold text-sm outline-none transition-all resize-none" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Labels</label>
                <div className="relative group">
                  <FileText className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="e.g. high-priority, friend, direct"
                    value={labels}
                    onChange={(e) => setLabels(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-white/60 rounded-[28px] border border-white/80 shadow-sm focus:ring-4 focus:ring-sky-500/10 font-bold text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:flex gap-3 sm:gap-4 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-4 sm:py-5 rounded-[28px] text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#1A1A1A] hover:bg-white/40 transition-all">Cancel</button>
                <button type="submit" className="flex-[1.5] py-4 sm:py-5 rounded-[28px] text-[10px] font-bold uppercase tracking-[0.2em] bg-[#1A1A1A] text-white shadow-xl shadow-black/10 hover:bg-black transition-all active:scale-95 px-8 sm:px-12">Create Profile</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
