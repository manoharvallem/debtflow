import React, { useState } from 'react';
import { X, User, IndianRupee, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface AddDebtorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; initialDebt: number; note: string }) => void;
}

export const AddDebtorModal: React.FC<AddDebtorModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave
}) => {
  const [name, setName] = useState('');
  const [initialDebt, setInitialDebt] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (initialDebt && parseFloat(initialDebt) < 0)) return;

    onSave({
      name,
      initialDebt: parseFloat(initialDebt) || 0,
      note,
    });
    
    // Reset and close
    setName('');
    setInitialDebt('');
    setNote('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-3 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white/80 backdrop-blur-3xl rounded-[32px] sm:rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.15)] border border-white"
          >
            <div className="bg-[#B8A9C1] p-6 sm:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none rotate-12">
                <User size={140} />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">Onboard Member</h3>
                  <button 
                    onClick={onClose}
                    className="p-3 hover:bg-white/10 rounded-2xl transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>
                <p className="text-white/80 font-medium tracking-tight">Establish a new relationship in your recovery network.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-10 space-y-5 sm:space-y-8">
              {/* Name */}
              <div className="space-y-3">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Full Identity</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="e.g. Vikram Seth" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-14 pr-6 py-5 bg-white/60 rounded-[28px] border border-white/80 shadow-sm focus:ring-4 focus:ring-[#B8A9C1]/5 font-bold text-sm outline-none transition-all" 
                  />
                </div>
              </div>

              {/* Initial Debt */}
              <div className="space-y-3">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Opening Balance</label>
                <div className="relative group">
                  <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={18} />
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={initialDebt}
                    onChange={(e) => setInitialDebt(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-white/60 rounded-[28px] border border-white/80 shadow-sm focus:ring-4 focus:ring-[#B8A9C1]/5 font-bold text-sm outline-none transition-all" 
                  />
                </div>
              </div>

              {/* Note */}
              <div className="space-y-3">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Internal Remarks</label>
                <div className="relative group">
                  <FileText className="absolute left-5 top-5 text-gray-400 group-hover:text-black transition-colors" size={18} />
                  <textarea 
                    placeholder="Add contextual details if needed..." 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="w-full pl-14 pr-6 py-5 bg-white/60 rounded-[28px] border border-white/80 shadow-sm focus:ring-4 focus:ring-[#B8A9C1]/5 font-bold text-sm outline-none transition-all resize-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:flex gap-3 sm:gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 py-4 sm:py-5 rounded-[28px] text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#1A1A1A] hover:bg-white/40 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-[1.5] py-4 sm:py-5 rounded-[28px] text-[10px] font-bold uppercase tracking-[0.2em] bg-[#1A1A1A] text-white shadow-xl shadow-black/10 hover:bg-black transition-all active:scale-95 px-8 sm:px-12"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
