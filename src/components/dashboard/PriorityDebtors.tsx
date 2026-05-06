import React from 'react';
import { Debtor } from '../../types';
import { ChevronRight } from 'lucide-react';
import { cn, formatINR } from '../../lib/utils';

import { motion } from 'motion/react';

interface PriorityDebtorsProps {
  debtors: Debtor[];
  onViewAll: () => void;
  onSelectDebtor: (debtor: Debtor) => void;
}

export const PriorityDebtors: React.FC<PriorityDebtorsProps> = ({ 
  debtors, 
  onViewAll,
  onSelectDebtor
}) => {
  const sortedDebtors = [...debtors].sort((a, b) => (b.totalDebt - b.amountPaid) - (a.totalDebt - a.amountPaid)).slice(0, 5);

  return (
    <div className="p-5 sm:p-8 rounded-[32px] sm:rounded-[48px] bg-white/40 backdrop-blur-3xl border border-white/60 shadow-[0_32px_64px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.4)] h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Active Accounts</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Requiring Attention</p>
        </div>
        <button 
          onClick={onViewAll}
          className="text-xs font-bold text-[#3D4E3D] hover:bg-white/60 rounded-xl px-4 py-2 transition-all shadow-sm border border-white/20 hover:border-white/60 backdrop-blur-lg"
        >
          View All
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {sortedDebtors.map((debtor) => {
          const balance = debtor.totalDebt - debtor.amountPaid;
          return (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              key={debtor.id} 
              onClick={() => onSelectDebtor(debtor)}
              className="flex items-center justify-between gap-3 p-4 sm:p-5 bg-white/40 backdrop-blur-xl rounded-[24px] sm:rounded-[28px] cursor-pointer hover:scale-[1.02] hover:bg-white/70 transition-all border border-white/60 shadow-sm group ring-1 ring-black/[0.01]"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#EFE7D2]/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#3D4E3D] font-bold text-xs shadow-sm border border-white transition-transform group-hover:rotate-6 shrink-0">
                  {debtor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-[#1A1A1A] group-hover:text-[#3D4E3D] transition-colors truncate">{debtor.name}</p>
                  <p className={cn(
                    "text-[10px] font-bold uppercase",
                    balance > 10000 ? "text-red-400" : "text-gray-400"
                  )}>
                    {balance > 10000 ? 'High Debt' : 'Stable'}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-[#1A1A1A] tabular-nums">{formatINR(balance)}</p>
                <div className="flex items-center justify-end gap-1 text-[9px] font-bold text-gray-400 uppercase mt-0.5">
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  Audit Due
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
