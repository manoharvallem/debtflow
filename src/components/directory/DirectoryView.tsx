import React, { useState } from 'react';
import { Debtor } from '../../types';
import { Search, Filter, ChevronRight, Pencil } from 'lucide-react';
import { cn, formatINR } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface DirectoryViewProps {
  debtors: Debtor[];
  onSelectDebtor: (debtor: Debtor) => void;
  onDeleteDebtor: (id: string, e: React.MouseEvent) => void;
  onEditDebtor: (debtor: Debtor, e?: React.MouseEvent) => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({ debtors, onSelectDebtor, onDeleteDebtor, onEditDebtor }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDebtors = debtors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-5 sm:space-y-8 flex-1 flex flex-col"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 shrink-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">Network Directory</h2>
          <p className="text-gray-500 font-medium tracking-tight">Managing {debtors.length} active profiles across your dashboard.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search names..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm focus:ring-2 ring-[#3D4E3D]/10 w-full md:w-64 text-sm font-medium" 
            />
          </div>
          <button className="p-3 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm text-gray-500 hover:bg-white transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredDebtors.map((debtor) => {
            const balance = debtor.totalDebt - debtor.amountPaid;
            const progress = (debtor.amountPaid / debtor.totalDebt) * 100 || 0;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                key={debtor.id}
                onClick={() => onSelectDebtor(debtor)}
                className="rounded-[26px] border border-white/60 bg-white/55 p-4 shadow-[0_18px_44px_rgba(0,0,0,0.04)] backdrop-blur-2xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-11 w-11 shrink-0 rounded-2xl bg-[#EFE7D2] text-[#3D4E3D] flex items-center justify-center font-bold text-xs border border-white">
                      {debtor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#1A1A1A] truncate">{debtor.name}</p>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{balance === 0 ? 'Settled' : debtor.status}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => onEditDebtor(debtor, e)}
                    className="h-10 w-10 shrink-0 rounded-2xl text-gray-300 hover:bg-[#3D4E3D]/5 hover:text-[#3D4E3D] transition-all"
                    aria-label={`Edit ${debtor.name}`}
                  >
                    <Pencil size={17} className="mx-auto" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteDebtor(debtor.id, e); }}
                    className="h-10 w-10 shrink-0 rounded-2xl text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all"
                    aria-label={`Delete ${debtor.name}`}
                  >
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Total</p>
                    <p className="font-bold truncate">{formatINR(debtor.totalDebt)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Paid</p>
                    <p className="font-bold text-emerald-600 truncate">{formatINR(debtor.amountPaid)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Due</p>
                    <p className="font-bold truncate">{formatINR(balance)}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="h-1.5 bg-gray-100/70 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-[#3D4E3D] rounded-full"
                    />
                  </div>
                  <p className="mt-2 text-[9px] text-gray-400 font-bold uppercase tracking-tight">{Math.round(progress)}% Recovered</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="hidden md:block bg-white/40 backdrop-blur-3xl rounded-[40px] border border-white/60 shadow-[0_32px_64px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100/50">
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">Total Impact</th>
                <th className="px-8 py-6">Settled</th>
                <th className="px-8 py-6">Outstanding</th>
                <th className="px-8 py-6">Recovery</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/30">
              <AnimatePresence mode="popLayout">
                {filteredDebtors.map((debtor) => {
                  const balance = debtor.totalDebt - debtor.amountPaid;
                  const progress = (debtor.amountPaid / debtor.totalDebt) * 100 || 0;
                  return (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={debtor.id} 
                      onClick={() => onSelectDebtor(debtor)}
                      className="group hover:bg-white/40 cursor-pointer transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#EFE7D2] text-[#3D4E3D] rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm border border-white transition-transform group-hover:scale-110">
                            {debtor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#3D4E3D] transition-colors">{debtor.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-[#1A1A1A]">{formatINR(debtor.totalDebt)}</td>
                      <td className="px-8 py-5 text-sm font-medium text-emerald-600">{formatINR(debtor.amountPaid)}</td>
                      <td className="px-8 py-5 text-sm font-bold text-[#1A1A1A]">
                        {formatINR(balance)}
                      </td>
                      <td className="px-8 py-5 min-w-[160px]">
                        <div className="w-full h-1.5 bg-gray-100/50 rounded-full overflow-hidden mb-1.5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-[#3D4E3D] rounded-full shadow-[0_0_8px_rgba(61,78,61,0.2)]"
                          />
                        </div>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{Math.round(progress)}% Recovered</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                          debtor.status === 'OVERDUE' ? "bg-red-50 text-red-500 shadow-[0_4px_12px_rgba(239,68,68,0.1)]" : 
                          balance === 0 ? "bg-emerald-50 text-emerald-600 shadow-[0_4px_12px_rgba(16,185,129,0.1)]" : "bg-blue-50 text-blue-500 shadow-[0_4px_12px_rgba(59,130,246,0.1)]"
                        )}>
                          {balance === 0 ? 'SETTLED' : debtor.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => onEditDebtor(debtor, e)}
                            className="p-2.5 text-gray-300 hover:text-[#3D4E3D] hover:bg-[#3D4E3D]/5 rounded-xl transition-all"
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteDebtor(debtor.id, e); }}
                            className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <div className="p-2 text-gray-300 group-hover:text-[#3D4E3D] group-hover:translate-x-1 transition-all">
                            <ChevronRight size={20} />
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredDebtors.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                <Search size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-bold text-sm">No matches found in directory</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
