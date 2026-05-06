import React, { useState, useMemo } from 'react';
import { Transaction, Debtor } from '../../types';
import { 
  ArrowUpDown, Search, Filter, ArrowUpCircle, 
  ArrowDownCircle, ChevronDown 
} from 'lucide-react';
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

    // Filter
    if (searchTerm) {
      list = list.filter(t => {
        const debtor = debtors.find(d => d.id === t.debtorId);
        return (
          debtor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.note?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Sort
    list.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortField === 'date') {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      } else if (sortField === 'amount') {
        valA = a.amount;
        valB = b.amount;
      } else if (sortField === 'name') {
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
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="text-gray-300" />;
    return <ChevronDown size={14} className={cn("transition-transform duration-200", sortOrder === 'asc' ? "rotate-180" : "rotate-0")} />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-5 sm:space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">Payment History</h2>
          <p className="text-gray-500 font-medium tracking-tight">Full audit trail of all financial movements in your network.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search history..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.03)] focus:ring-2 ring-[#3D4E3D]/10 transition-all font-medium text-sm w-full md:w-64" 
            />
          </div>
          <button className="p-3 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.03)] text-gray-500 hover:bg-white transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedTransactions.map((tx) => {
            const debtor = debtors.find(d => d.id === tx.debtorId);

            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                key={tx.id}
                className="rounded-[26px] border border-white/60 bg-white/55 p-4 shadow-[0_18px_44px_rgba(0,0,0,0.04)] backdrop-blur-2xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={cn(
                      "h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center border border-white",
                      tx.type === 'PAYMENT' ? "bg-emerald-50 text-emerald-600" : "bg-[#1A1A1A] text-white"
                    )}>
                      {tx.type === 'PAYMENT' ? <ArrowDownCircle size={22} /> : <ArrowUpCircle size={22} />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#1A1A1A] truncate">{debtor?.name || 'Deleted Contact'}</p>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{format(new Date(tx.date), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <p className={cn(
                    "font-bold text-sm shrink-0 tabular-nums",
                    tx.type === 'PAYMENT' ? "text-emerald-600" : "text-[#1A1A1A]"
                  )}>
                    {tx.type === 'PAYMENT' ? '-' : '+'}{formatINR(tx.amount)}
                  </p>
                </div>
                <p className="mt-4 text-sm text-gray-500 line-clamp-2">{tx.note || 'No note'}</p>
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
                <th 
                  className="px-8 py-6 cursor-pointer hover:text-[#3D4E3D] transition-colors"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Person <SortIcon field="name" />
                  </div>
                </th>
                <th 
                  className="px-8 py-6 cursor-pointer hover:text-[#3D4E3D] transition-colors"
                  onClick={() => toggleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    Date <SortIcon field="date" />
                  </div>
                </th>
                <th className="px-8 py-6">Type</th>
                <th 
                  className="px-8 py-6 cursor-pointer hover:text-[#3D4E3D] transition-colors"
                  onClick={() => toggleSort('amount')}
                >
                  <div className="flex items-center gap-2">
                    Amount <SortIcon field="amount" />
                  </div>
                </th>
                <th className="px-8 py-6">Note</th>
                <th className="px-8 py-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/30">
              <AnimatePresence mode="popLayout">
                {sortedTransactions.map((tx, idx) => {
                  const debtor = debtors.find(d => d.id === tx.debtorId);
                  return (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={tx.id} 
                      className="group hover:bg-white/40 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-[#EFE7D2] to-white text-[#3D4E3D] rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm border border-white">
                            {debtor?.name.split(' ').map(n => n[0]).join('') || '??'}
                          </div>
                          <span className="text-sm font-bold text-[#1A1A1A]">{debtor?.name || 'Deleted Contact'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-gray-500">
                        {format(new Date(tx.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-8 py-5">
                        <div className={cn(
                          "flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight px-3 py-1 rounded-full w-fit",
                          tx.type === 'PAYMENT' ? "bg-emerald-50 text-emerald-600" : "bg-[#1A1A1A] text-white"
                        )}>
                          {tx.type === 'PAYMENT' ? <ArrowDownCircle size={12} /> : <ArrowUpCircle size={12} />}
                          {tx.type}
                        </div>
                      </td>
                      <td className={cn(
                        "px-8 py-5 text-sm font-bold",
                        tx.type === 'PAYMENT' ? "text-emerald-600" : "text-[#1A1A1A]"
                      )}>
                        {tx.type === 'PAYMENT' ? '-' : '+'}{formatINR(tx.amount)}
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm text-gray-500 max-w-[200px] truncate">{tx.note || '-'}</p>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          Settled
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
