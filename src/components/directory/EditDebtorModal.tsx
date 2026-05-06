import React, { useEffect, useState } from 'react';
import { X, User, IndianRupee, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Debtor } from '../../types';

interface EditDebtorModalProps {
  debtor: Debtor | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { id: string; name: string; totalDebt: number }) => void;
}

export const EditDebtorModal: React.FC<EditDebtorModalProps> = ({
  debtor,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [totalDebt, setTotalDebt] = useState('');

  useEffect(() => {
    if (!debtor) return;
    setName(debtor.name);
    setTotalDebt(String(debtor.totalDebt));
  }, [debtor]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!debtor || !name.trim() || parseFloat(totalDebt) < 0) return;

    onSave({
      id: debtor.id,
      name: name.trim(),
      totalDebt: parseFloat(totalDebt) || 0,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && debtor && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 28 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto liquid-panel rounded-[32px] sm:rounded-[48px]"
          >
            <div className="bg-[#1A1A1A] p-6 sm:p-10 text-white relative overflow-hidden rounded-t-[32px] sm:rounded-t-[48px]">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none rotate-12">
                <User size={140} />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Profile</h3>
                  <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
                    <X size={24} />
                  </button>
                </div>
                <p className="text-white/70 font-medium tracking-tight">Update the debtor name or total impact amount.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-10 space-y-5 sm:space-y-8">
              <div className="space-y-3">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    className="w-full pl-14 pr-6 py-5 bg-white/60 rounded-[28px] border border-white/80 shadow-sm focus:ring-4 focus:ring-[#3D4E3D]/5 font-bold text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Total Impact</label>
                <div className="relative group">
                  <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={18} />
                  <input
                    type="number"
                    min="0"
                    value={totalDebt}
                    onChange={(event) => setTotalDebt(event.target.value)}
                    required
                    className="w-full pl-14 pr-6 py-5 bg-white/60 rounded-[28px] border border-white/80 shadow-sm focus:ring-4 focus:ring-[#3D4E3D]/5 font-bold text-sm outline-none transition-all"
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
                  className="flex-[1.5] flex items-center justify-center gap-3 py-4 sm:py-5 rounded-[28px] text-[10px] font-bold uppercase tracking-[0.2em] bg-[#3D4E3D] text-[#EFE7D2] shadow-xl shadow-[#3D4E3D]/20 hover:brightness-110 transition-all active:scale-95 px-8 sm:px-12"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
