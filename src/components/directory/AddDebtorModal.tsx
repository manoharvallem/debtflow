import React, { useState } from 'react';
import { X, User, IndianRupee, FileText, Calendar, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

interface AddDebtorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; initialDebt: number; note: string; referredDate: string; labels: string[] }) => void;
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
          {/* Frosted deep glass backdrop */}
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
            transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
            className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto glass-panel-strong rounded-[36px] sm:rounded-[44px] shadow-2xl border border-white/60 focus:outline-none"
          >
            {/* Header section with radial light sheen */}
            <div className="relative overflow-hidden border-b border-white/20 bg-gradient-to-br from-white/40 via-white/10 to-sky-100/20 p-6 sm:p-9 backdrop-blur-3xl rounded-t-[36px] sm:rounded-t-[44px]">
              <div className="absolute top-0 right-0 p-6 text-[#3D4E3D]/5 pointer-events-none rotate-12">
                <User size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f172a] font-display">Onboard Contact</h3>
                  <button 
                    type="button"
                    onClick={onClose} 
                    className="p-2.5 rounded-xl text-slate-500 hover:bg-white/40 hover:text-[#0f172a] transition-all focus:outline-none"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-xs font-bold text-[#475569]/90 tracking-tight leading-relaxed">
                  Onboard a new borrower by setting an initial opening debt balance and adding supporting system labels.
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
                {/* Identity input */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2">Full Identity</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4E3D]" size={16} />
                    <input 
                      type="text" 
                      placeholder="e.g. Rahul Sharma" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                      className="w-full pl-13 pr-5 py-4 bg-white/35 rounded-2xl font-bold text-sm outline-none transition-all" 
                    />
                  </div>
                </motion.div>

                {/* Debt and Date fields */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2">Opening Balance</label>
                    <div className="relative group">
                      <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4E3D]" size={16} />
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        value={initialDebt} 
                        onChange={(e) => setInitialDebt(e.target.value)} 
                        className="w-full pl-13 pr-5 py-4 bg-white/35 rounded-2xl font-bold text-sm outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2">Onboarding Date</label>
                    <div className="relative group">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4E3D]" size={16} />
                      <input 
                        type="date" 
                        value={referredDate} 
                        onChange={(e) => setReferredDate(e.target.value)} 
                        required 
                        className="w-full pl-13 pr-5 py-4 bg-white/35 rounded-2xl font-bold text-sm outline-none transition-all" 
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Memo textbox */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2">Onboarding Comment</label>
                  <div className="relative group">
                    <FileText className="absolute left-5 top-4.5 text-[#3D4E3D]" size={16} />
                    <textarea 
                      placeholder="Add loan context, agreements, or reference details..." 
                      value={note} 
                      onChange={(e) => setNote(e.target.value)} 
                      rows={2.5} 
                      className="w-full pl-13 pr-5 py-4 bg-white/35 rounded-2xl font-bold text-sm outline-none transition-all resize-none" 
                    />
                  </div>
                </motion.div>

                {/* Label tags input */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2">Labels / Categories</label>
                  <div className="relative group">
                    <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4E3D]" size={16} />
                    <input 
                      type="text" 
                      placeholder="e.g. business, friend, urgent" 
                      value={labels} 
                      onChange={(e) => setLabels(e.target.value)} 
                      className="w-full pl-13 pr-5 py-4 bg-white/35 rounded-2xl font-bold text-sm outline-none transition-all" 
                    />
                  </div>
                  <p className="text-[9.5px] text-gray-500 font-semibold px-2">Separate multiple labels with commas (e.g. personal, office, priority)</p>
                </motion.div>

                {/* Footer buttons */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 pb-2 sm:pb-3">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="py-4 rounded-2xl text-[10.5px] font-extrabold uppercase tracking-widest text-[#475569] hover:text-[#0f172a] hover:bg-white/30 transition-all focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="py-4 rounded-2xl text-[10.5px] font-extrabold uppercase tracking-[0.18em] bg-[#3D4E3D] text-[#EFE7D2] shadow-lg shadow-[#3D4E3D]/30 hover:bg-[#3D4E3D]/95 transition-all active:scale-97 cursor-pointer"
                  >
                    Create Profile
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
