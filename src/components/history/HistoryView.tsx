import React, { useMemo, useState } from 'react';
import { Transaction, Debtor } from '../../types';
import { ArrowUpDown, Search, Filter, ArrowUpCircle, ArrowDownCircle, ChevronDown } from 'lucide-react';
import { cn, formatINR } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

interface HistoryViewProps {
  transactions: Transaction[];
  debtors: Debtor[];
}

type SortField = 'date' | 'amount' | 'name';
type SortOrder = 'asc' | 'desc';

export const HistoryView: React.FC<HistoryViewProps> = ({ transactions, debtors }) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const sortedTransactions = useMemo(() => {
    let list = [...transactions];
    if (searchTerm) {
      list = list.filter(t => {
        const debtor = debtors.find(d => d.id === t.debtorId);
        return (
          debtor?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          t.note?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    list.sort((a, b) => {
      let valA: number | string = '';
      let valB: number | string = '';
      if (sortField === 'date') {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      } else if (sortField === 'amount') {
        valA = a.amount;
        valB = b.amount;
      } else {
        valA = debtors.find(d => d.id === a.debtorId)?.name || '';
        valB = debtors.find(d => d.id === b.debtorId)?.name || '';
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [transactions, debtors, sortField, sortOrder, searchTerm]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => sortField !== field
    ? <ArrowUpDown size={12} className="text-slate-400" />
    : <ChevronDown size={12} className={cn('text-[#3D4E3D] transition-transform duration-200', sortOrder === 'asc' ? 'rotate-180' : 'rotate-0')} />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      className="space-y-6 sm:space-y-8 font-sans pb-20"
    >
      {/* Search Header layout */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 z-10 shrink-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f172a] font-display">Ledger History</h2>
          <p className="text-gray-500 font-medium tracking-tight text-sm">Full audit trail of all financial movements across active profiles.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D4E3D]/80" size={16} />
            <input 
              type="text" 
              placeholder="Search statements..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-11 pr-5 py-3 hover:bg-white/50 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm focus:ring-4 focus:ring-[#3D4E3D]/5 w-full md:w-64 text-sm font-bold text-[#0f172a] outline-none transition-all" 
            />
          </div>
          <button type="button" className="p-3 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm text-[#3D4E3D] hover:bg-white/60 transition-all focus:outline-none">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Feed */}
      <div className="md:hidden space-y-4">
        <AnimatePresence mode="popLayout">
          {sortedTransactions.map((tx) => {
            const debtor = debtors.find(d => d.id === tx.debtorId);
            const isPayment = tx.type === 'PAYMENT';
            return (
              <motion.div 
                layout 
                initial={{ opacity: 0, y: 12 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }} 
                key={tx.id} 
                className="rounded-[28px] border border-white/50 bg-white/35 p-5 shadow-sm backdrop-blur-2xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={cn(
                      'h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center border border-white/40', 
                      isPayment ? 'bg-emerald-500/10 text-emerald-700' : 'bg-[#1A1A1A] text-[#efede4]'
                    )}>
                      {isPayment ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold text-[#0f172a] truncate text-sm leading-tight">
                        {debtor?.name || 'Decommissioned Contact'}
                      </p>
                      <p className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400 mt-1">
                        {format(new Date(tx.date), 'dd - MMM - yy')}
                      </p>
                    </div>
                  </div>
                  <p className={cn(
                    'font-extrabold text-sm shrink-0 tabular-nums', 
                    isPayment ? 'text-emerald-700' : 'text-[#0f172a]'
                  )}>
                    {isPayment ? '-' : '+'}{formatINR(tx.amount)}
                  </p>
                </div>
                {tx.note && <p className="mt-3 text-xs text-slate-650 font-semibold line-clamp-3 bg-white/20 p-2.5 rounded-xl border border-white/10">{tx.note}</p>}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {sortedTransactions.length === 0 && (
          <div className="glass-panel p-16 text-center">
            <p className="text-gray-500 text-sm font-extrabold">No statements found</p>
          </div>
        )}
      </div>

      {/* Desktop table inside glass frame */}
      <div className="hidden md:block glass-panel shadow-md overflow-hidden relative z-10 w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#3D4E3D]/80 border-b border-white/20 bg-white/10 select-none">
                <th className="px-8 py-5 cursor-pointer hover:text-[#3D4E3D] transition-colors" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-1.5">Identity <SortIcon field="name" /></div>
                </th>
                <th className="px-6 py-5 cursor-pointer hover:text-[#3D4E3D] transition-colors" onClick={() => toggleSort('date')}>
                  <div className="flex items-center gap-1.5">Posting Date <SortIcon field="date" /></div>
                </th>
                <th className="px-6 py-5">Workflow Movement Type</th>
                <th className="px-6 py-5 cursor-pointer hover:text-[#3D4E3D] transition-colors" onClick={() => toggleSort('amount')}>
                  <div className="flex items-center gap-1.5">Amount <SortIcon field="amount" /></div>
                </th>
                <th className="px-6 py-5">Memo Details</th>
                <th className="px-8 py-5 text-right">Ledger Audit State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <AnimatePresence mode="popLayout">
                {sortedTransactions.map((tx) => {
                  const debtor = debtors.find(d => d.id === tx.debtorId);
                  const isPayment = tx.type === 'PAYMENT';
                  return (
                    <motion.tr 
                      layout 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }} 
                      key={tx.id} 
                      className="group hover:bg-white/25 transition-colors duration-200"
                    >
                      <td className="px-8 py-4.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8.5 h-8.5 bg-gradient-to-br from-[#EFE7D2] to-[#dfd5ba] text-[#3D4E3D] rounded-full flex items-center justify-center font-extrabold text-[9.5px] shadow-xs border border-white">
                            {debtor?.name.split(' ').map(n => n[0]).join('') || '??'}
                          </div>
                          <span className="text-xs font-extrabold text-[#0f172a]">
                            {debtor?.name || 'Decommissioned Contact'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 text-xs font-extrabold text-slate-500">
                        {format(new Date(tx.date), 'dd - MMM - yy')}
                      </td>
                      <td className="px-6 py-4.5">
                        <div className={cn(
                          'flex items-center gap-1.5 text-[8.5px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full w-fit border', 
                          isPayment 
                            ? 'bg-emerald-500/10 text-emerald-700 border-emerald-400/20' 
                            : 'bg-slate-900/10 text-[#0f172a] border-slate-500/20'
                        )}>
                          {isPayment ? <ArrowDownCircle size={11} /> : <ArrowUpCircle size={11} />}
                          {tx.type}
                        </div>
                      </td>
                      <td className={cn(
                        'px-6 py-4.5 text-xs font-extrabold tabular-nums', 
                        isPayment ? 'text-emerald-700' : 'text-[#0f172a]'
                      )}>
                        {isPayment ? '-' : '+'}{formatINR(tx.amount)}
                      </td>
                      <td className="px-6 py-4.5">
                        <p className="text-xs text-slate-500 font-semibold max-w-[200px] truncate" title={tx.note}>
                          {tx.note || '-'}
                        </p>
                      </td>
                      <td className="px-8 py-4.5 text-right">
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-extrabold text-slate-400 uppercase select-none">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.5)] animate-pulse" />
                          Audited OK
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {sortedTransactions.length === 0 && (
            <div className="p-24 text-center">
              <p className="text-[#0f172a] font-extrabold text-sm">Quiet Ledger</p>
              <p className="text-gray-500 text-xs mt-1">No payments or balances logged yet.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
