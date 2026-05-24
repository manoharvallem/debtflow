import React, { useEffect, useState } from 'react';
import { X, User, IndianRupee, Tag, Save, Calendar, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Debtor } from '../../types';

interface EditDebtorModalProps {
  debtor: Debtor | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { id: string; name: string; totalDebt: number; labels: string[]; joiningDate?: string; mobile: string; email: string }) => void;
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

export const EditDebtorModal: React.FC<EditDebtorModalProps> = ({ debtor, isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [totalDebt, setTotalDebt] = useState('');
  const [labels, setLabels] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!debtor) return;
    setName(debtor.name);
    setTotalDebt(String(debtor.totalDebt));
    setLabels(debtor.labels.join(', '));
    setJoiningDate(debtor.joiningDate || '');
    setMobile(debtor.mobile || '');
    setEmail(debtor.email || '');
  }, [debtor]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!debtor || !name.trim() || parseFloat(totalDebt) < 0) return;
    onSave({
      id: debtor.id,
      name: name.trim(),
      totalDebt: parseFloat(totalDebt) || 0,
      labels: labels.split(',').map((label) => label.trim()).filter(Boolean),
      joiningDate: debtor.currentStage === 'OFFER_RELEASED' ? joiningDate || undefined : debtor.joiningDate,
      mobile,
      email,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && debtor && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-3 sm:p-6">
          {/* Frosted deep backdrop shadow */}
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
            transition={{ type: 'spring', duration: 0.45 }}
            className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto glass-panel-strong rounded-[36px] sm:rounded-[44px] shadow-2xl border border-white/60 focus:outline-none animate-glass-enter"
          >
            {/* Header banner gradient reflecting emerald collection tones */}
            <div className="relative overflow-hidden border-b border-white/20 bg-gradient-to-br from-white/50 via-white/10 to-emerald-100/20 p-6 sm:p-9 backdrop-blur-3xl rounded-t-[36px] sm:rounded-t-[44px]">
              <div className="absolute top-0 right-0 p-6 text-emerald-700/5 pointer-events-none rotate-12">
                <User size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f172a] font-display">Edit Profile</h3>
                  <button 
                    type="button"
                    onClick={onClose} 
                    className="p-2.5 rounded-xl text-slate-500 hover:bg-white/40 hover:text-[#0f172a] transition-all focus:outline-none"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-xs font-bold text-[#475569]/90 tracking-tight leading-relaxed">
                  Modify full contact name or overall system balance while maintaining full activity logs & comments history intact.
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
                {/* Full Name */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4E3D]" size={16} />
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(event) => setName(event.target.value)} 
                      required 
                      className="w-full pl-13 pr-5 py-4 bg-white/35 rounded-2xl font-bold text-sm outline-none transition-all" 
                    />
                  </div>
                </motion.div>

                {/* Total Debt */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2">Active Total Impact</label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4E3D]" size={16} />
                    <input 
                      type="number" 
                      min="0" 
                      step="0.01"
                      value={totalDebt} 
                      onChange={(event) => setTotalDebt(event.target.value)} 
                      required 
                      className="w-full pl-13 pr-5 py-4 bg-white/35 rounded-2xl font-bold text-sm outline-none transition-all" 
                    />
                  </div>
                </motion.div>

                {/* Contact fields */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2">Mobile Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4E3D]" size={16} />
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="e.g. +91 98xxxxxx10"
                        className="w-full pl-13 pr-5 py-4 bg-white/35 rounded-2xl font-bold text-sm outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4E3D]" size={16} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. name@company.com"
                        className="w-full pl-13 pr-5 py-4 bg-white/35 rounded-2xl font-bold text-sm outline-none transition-all"
                      />
                    </div>
                  </div>
                </motion.div>

                 {/* Tag Selection */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2">Portfolio Labels</label>
                  <div className="relative group">
                    <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4E3D]" size={16} />
                    <input 
                      type="text" 
                      value={labels} 
                      onChange={(event) => setLabels(event.target.value)} 
                      placeholder="e.g. personal, urgent, office" 
                      className="w-full pl-13 pr-5 py-4 bg-white/35 rounded-2xl font-bold text-sm outline-none transition-all" 
                    />
                  </div>
                  <p className="text-[9.5px] text-gray-500 font-semibold px-2">Separate multiple labels with commas</p>
                </motion.div>

                {/* Date of joining option when stage has OFFER_RELEASED */}
                {debtor.currentStage === 'OFFER_RELEASED' && (
                  <motion.div variants={itemVariants} className="space-y-2 animate-glass-enter">
                    <label className="text-[10px] font-extrabold text-[#059669] uppercase tracking-[0.2em] ml-2">Release Date of Joining</label>
                    <div className="relative group">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4E3D]" size={16} />
                      <input 
                        type="date" 
                        value={joiningDate} 
                        onChange={(e) => setJoiningDate(e.target.value)} 
                        className="w-full pl-13 pr-5 py-4 bg-white/35 rounded-2xl font-bold text-sm outline-none transition-all" 
                      />
                    </div>
                  </motion.div>
                )}

                {/* Footer buttons */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 pb-2 sm:pb-3">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="py-4 rounded-2xl text-[10.5px] font-extrabold uppercase tracking-widest text-[#475569] hover:text-[#0f172a] hover:bg-white/30 transition-all focus:outline-none"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit" 
                    className="py-4 rounded-2xl text-[10.5px] flex items-center justify-center gap-2 font-extrabold uppercase tracking-[0.18em] bg-[#3D4E3D] text-[#EFE7D2] shadow-lg shadow-[#3D4E3D]/30 hover:brightness-105 transition-all active:scale-97 cursor-pointer"
                  >
                    <Save size={14} />
                    Save Changes
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
