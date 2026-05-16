import React, { useEffect, useState, useMemo } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { StatCard } from './components/dashboard/StatCard';
import { DebtSplitRadial } from './components/dashboard/DebtSplitRadial';
import { PriorityDebtors } from './components/dashboard/PriorityDebtors';
import { DirectoryView } from './components/directory/DirectoryView';
import { PersonDetailView } from './components/details/PersonDetailView';
import { LogEntryModal } from './components/transactions/LogEntryModal';
import { HistoryView } from './components/history/HistoryView';
import { AddDebtorModal } from './components/directory/AddDebtorModal';
import { EditDebtorModal } from './components/directory/EditDebtorModal';
import { Search, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Debtor, Transaction, TransactionType } from './types';
import { formatINR } from './lib/utils';
import { isSheetsSyncConfigured, postSheetAction, readSheetData } from './lib/sheetsApi';

const STORAGE_KEYS = {
  debtors: 'debtflow:debtors',
  transactions: 'debtflow:transactions',
};

function loadStoredList<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

interface SettingsScreenProps {
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
  onSyncNow: () => void;
  syncStatus: string;
  sheetsSyncEnabled: boolean;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onExport,
  onImport,
  onReset,
  onSyncNow,
  syncStatus,
  sheetsSyncEnabled,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 sm:space-y-8"
    >
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-glass-main">Settings</h2>
        <p className="font-medium tracking-tight text-glass-subtle">Keep this tracker free with Google Sheets sync and local backups.</p>
      </div>

      <div className="glass-surface rounded-[24px] sm:rounded-[32px] p-5 sm:p-10 max-w-3xl">
        <h3 className="text-xl font-bold tracking-tight mb-2 text-glass-main">Google Sheets Sync</h3>
        <p className="text-sm font-medium mb-8 text-glass-subtle">
          {sheetsSyncEnabled ? syncStatus : 'Add your Apps Script web app URL in .env to sync across devices.'}
        </p>

        <button
          onClick={onSyncNow}
          disabled={!sheetsSyncEnabled}
          className="glass-button mb-10 w-full sm:w-auto px-6 py-4 rounded-[20px] text-xs font-bold uppercase tracking-widest active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Refresh From Sheet
        </button>

        <h3 className="text-xl font-bold tracking-tight mb-2 text-glass-main">Backup</h3>
        <p className="text-sm font-medium mb-8 text-glass-subtle">Export a copy before clearing browser data or moving to a new device.</p>

        <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3 sm:gap-4">
          <button
            onClick={onExport}
            className="glass-button px-6 py-4 rounded-[20px] text-xs font-bold uppercase tracking-widest active:scale-95"
          >
            Export Data
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="glass-button px-6 py-4 rounded-[20px] text-xs font-bold uppercase tracking-widest active:scale-95"
          >
            Import Data
          </button>
          <button
            onClick={onReset}
            className="px-6 py-4 rounded-[20px] bg-red-500/22 text-red-100 border border-red-300/35 text-xs font-bold uppercase tracking-widest active:scale-95 transition-all hover:bg-red-500/35"
          >
            Reset
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onImport(file);
            event.target.value = '';
          }}
        />
      </div>
    </motion.div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isAddDebtorModalOpen, setIsAddDebtorModalOpen] = useState(false);
  const [editingDebtor, setEditingDebtor] = useState<Debtor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debtors, setDebtors] = useState<Debtor[]>(() => loadStoredList(STORAGE_KEYS.debtors, []));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadStoredList(STORAGE_KEYS.transactions, []));
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  const [syncStatus, setSyncStatus] = useState(() => (
    isSheetsSyncConfigured() ? 'Google Sheets sync is ready.' : 'Google Sheets sync is not configured.'
  ));
  const sheetsSyncEnabled = isSheetsSyncConfigured();

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.debtors, JSON.stringify(debtors));
  }, [debtors]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
  }, [transactions]);

  const currentSelectedDebtor = useMemo(() => {
    if (!selectedDebtor) return null;
    return debtors.find(d => d.id === selectedDebtor.id) || null;
  }, [debtors, selectedDebtor]);

  const pullFromSheets = async () => {
    if (!sheetsSyncEnabled) return;

    try {
      setSyncStatus('Reading latest data from Google Sheets...');
      const data = await readSheetData();
      setDebtors(data.debtors);
      setTransactions(data.transactions);
      setSelectedDebtor(prev => prev && data.debtors.some(d => d.id === prev.id) ? prev : null);
      setSyncStatus(`Synced from Google Sheets at ${new Date().toLocaleTimeString()}.`);
    } catch (error) {
      setSyncStatus(error instanceof Error ? error.message : 'Google Sheets sync failed.');
    }
  };

  useEffect(() => {
    pullFromSheets();
  }, []);

  const syncAction = async (action: Parameters<typeof postSheetAction>[0]) => {
    if (!sheetsSyncEnabled) return;

    try {
      setSyncStatus('Saving to Google Sheets...');
      await postSheetAction(action);
      setSyncStatus(`Saved to Google Sheets at ${new Date().toLocaleTimeString()}.`);
    } catch (error) {
      setSyncStatus(error instanceof Error ? error.message : 'Google Sheets save failed.');
    }
  };

  const stats = useMemo(() => {
    const totalOut = debtors.reduce((acc, d) => acc + Math.max(d.totalDebt - d.amountPaid, 0), 0);
    const collectedTillDate = transactions
      .filter(t => t.type === 'PAYMENT')
      .reduce((acc, t) => acc + t.amount, 0);
    const today = new Date();

    const monthPoints = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { month: 'short' });
      const amount = transactions
        .filter(transaction => {
          if (transaction.type !== 'PAYMENT') return false;
          const paymentDate = new Date(transaction.date);
          return paymentDate.getFullYear() === date.getFullYear() && paymentDate.getMonth() === date.getMonth();
        })
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      return { key, label, amount };
    });

    const settledCount = debtors.filter(debtor => debtor.totalDebt > 0 && debtor.totalDebt <= debtor.amountPaid).length;
    const currentCount = debtors.filter(debtor => debtor.status === 'CURRENT' && debtor.totalDebt > debtor.amountPaid).length;
    const pendingCount = debtors.filter(debtor => debtor.status === 'PENDING' && debtor.totalDebt > debtor.amountPaid).length;
    const overdueCount = debtors.filter(debtor => debtor.status === 'OVERDUE' && debtor.totalDebt > debtor.amountPaid).length;

    const withOutstanding = debtors
      .map(debtor => ({ ...debtor, outstanding: Math.max(debtor.totalDebt - debtor.amountPaid, 0) }))
      .sort((a, b) => b.outstanding - a.outstanding);
    const topDebtor = withOutstanding[0];

    const debtorsWithPaymentDate = debtors.filter(debtor => debtor.lastPaymentDate);
    const avgDaysSincePayment = debtorsWithPaymentDate.length
      ? Math.round(
          debtorsWithPaymentDate.reduce((sum, debtor) => {
            const days = Math.max(
              0,
              Math.floor((today.getTime() - new Date(debtor.lastPaymentDate as string).getTime()) / (1000 * 60 * 60 * 24))
            );
            return sum + days;
          }, 0) / debtorsWithPaymentDate.length
        )
      : 0;

    const paymentsLast30Days = transactions.filter(transaction => {
      if (transaction.type !== 'PAYMENT') return false;
      const paymentDate = new Date(transaction.date);
      return today.getTime() - paymentDate.getTime() <= 1000 * 60 * 60 * 24 * 30;
    }).length;
    
    return {
      totalOutstanding: totalOut,
      collectedTillDate,
      monthPoints,
      settledCount,
      currentCount,
      pendingCount,
      overdueCount,
      topDebtorName: topDebtor?.name || 'No debtors',
      topDebtorOutstanding: topDebtor?.outstanding || 0,
      avgDaysSincePayment,
      paymentsLast30Days,
    };
  }, [debtors, transactions]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return debtors
      .filter(debtor => debtor.name.toLowerCase().includes(query))
      .slice(0, 6);
  }, [debtors, searchQuery]);

  const totalManaged = useMemo(() => 
    debtors.reduce((acc, d) => acc + d.totalDebt, 0), 
    [debtors]
  );

  const handleLogSave = (data: { debtorId: string; amount: number; type: TransactionType; note: string; date: string }) => {
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      ...data
    };

    let updatedDebtor: Debtor | null = null;
    const nextDebtors = debtors.map(d => {
      if (d.id === data.debtorId) {
        if (data.type === 'PAYMENT') {
          updatedDebtor = { ...d, amountPaid: d.amountPaid + data.amount, lastPaymentDate: data.date };
          return updatedDebtor;
        }

        updatedDebtor = { ...d, totalDebt: d.totalDebt + data.amount };
        return updatedDebtor;
      }
      return d;
    });

    setTransactions(prev => [newTransaction, ...prev]);
    setDebtors(nextDebtors);
    syncAction({ type: 'upsertTransaction', transaction: newTransaction });
    if (updatedDebtor) syncAction({ type: 'upsertDebtor', debtor: updatedDebtor });
  };

  const handleDeleteDebtor = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this person and all their records?')) {
      setDebtors(prev => prev.filter(d => d.id !== id));
      setTransactions(prev => prev.filter(t => t.debtorId !== id));
      syncAction({ type: 'deleteDebtor', debtorId: id });
      if (selectedDebtor?.id === id) {
        setSelectedDebtor(null);
        setActiveTab('directory');
      }
    }
  };

  const handleSelectDebtor = (debtor: Debtor) => {
    setSelectedDebtor(debtor);
    setActiveTab('detail');
  };

  const handleAddDebtor = (data: { name: string; initialDebt: number; note: string }) => {
    const newDebtor: Debtor = {
      id: `${Date.now()}`,
      name: data.name,
      totalDebt: data.initialDebt,
      amountPaid: 0,
      status: 'PENDING'
    };

    setDebtors(prev => [newDebtor, ...prev]);
    syncAction({ type: 'upsertDebtor', debtor: newDebtor });

    if (data.initialDebt > 0) {
      const initialTx: Transaction = {
        id: `t${Date.now()}`,
        debtorId: newDebtor.id,
        amount: data.initialDebt,
        type: 'DEBT',
        date: new Date().toISOString().split('T')[0],
        note: data.note || 'Initial debt amount'
      };
      setTransactions(prev => [initialTx, ...prev]);
      syncAction({ type: 'upsertTransaction', transaction: initialTx });
    }
  };

  const handleEditDebtor = (data: { id: string; name: string; totalDebt: number }) => {
    let updatedDebtor: Debtor | null = null;
    const nextDebtors = debtors.map(debtor => {
      if (debtor.id !== data.id) return debtor;

      const nextBalance = data.totalDebt - debtor.amountPaid;
      updatedDebtor = {
        ...debtor,
        name: data.name,
        totalDebt: data.totalDebt,
        status: nextBalance <= 0 ? 'CURRENT' : debtor.status,
      };
      return updatedDebtor;
    });

    setDebtors(nextDebtors);
    if (selectedDebtor?.id === data.id && updatedDebtor) {
      setSelectedDebtor(updatedDebtor);
    }
    if (updatedDebtor) {
      syncAction({ type: 'upsertDebtor', debtor: updatedDebtor });
    }
  };

  const openEditDebtor = (debtor: Debtor, event?: React.MouseEvent) => {
    event?.stopPropagation();
    setEditingDebtor(debtor);
  };

  const handleExportData = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      debtors,
      transactions,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `debtflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!Array.isArray(data.debtors) || !Array.isArray(data.transactions)) {
          window.alert('This backup file does not look like DebtFlow data.');
          return;
        }

        setDebtors(data.debtors);
        setTransactions(data.transactions);
        setSelectedDebtor(null);
        setActiveTab('dashboard');
        syncAction({ type: 'replaceAll', debtors: data.debtors, transactions: data.transactions });
      } catch {
        window.alert('Could not read that backup file.');
      }
    };

    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (!window.confirm('Clear all people and transaction records from this browser?')) return;

    setDebtors([]);
    setTransactions([]);
    setSelectedDebtor(null);
    setActiveTab('dashboard');
    syncAction({ type: 'reset' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-5 sm:space-y-8"
          >
      {/* Sidebar - Handled in App.tsx wrapper */}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 gap-4 lg:gap-8 pb-8 flex-1 min-h-[400px]">
          <div>
            <DebtSplitRadial
              collected={stats.collectedTillDate}
              remaining={stats.totalOutstanding}
              totalManaged={totalManaged}
              debtors={debtors}
              monthPoints={stats.monthPoints}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 pb-10">
          <PriorityDebtors 
            debtors={debtors} 
            onViewAll={() => setActiveTab('directory')}
            onSelectDebtor={handleSelectDebtor}
          />
        </div>
          </motion.div>
        );
      case 'directory':
        return <DirectoryView debtors={debtors} onSelectDebtor={handleSelectDebtor} onDeleteDebtor={handleDeleteDebtor} onEditDebtor={openEditDebtor} />;
      case 'detail':
        return currentSelectedDebtor ? (
          <PersonDetailView 
            debtor={currentSelectedDebtor} 
            transactions={transactions} 
            onBack={() => setActiveTab('directory')} 
            onEditDebtor={openEditDebtor}
          />
        ) : <DirectoryView debtors={debtors} onSelectDebtor={handleSelectDebtor} onDeleteDebtor={handleDeleteDebtor} onEditDebtor={openEditDebtor} />;
      case 'history':
        return <HistoryView transactions={transactions} debtors={debtors} />;
      case 'settings':
        return (
          <SettingsScreen
            onExport={handleExportData}
            onImport={handleImportData}
            onReset={handleResetData}
            onSyncNow={pullFromSheets}
            syncStatus={syncStatus}
            sheetsSyncEnabled={sheetsSyncEnabled}
          />
        );
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <div className="flex w-full h-[100dvh] lg:h-screen flex-col lg:flex-row font-sans selection:bg-cyan-500/40 selection:text-white overflow-hidden relative">
      <Sidebar 
        activeTab={activeTab === 'detail' ? 'directory' : activeTab} 
        setActiveTab={setActiveTab} 
        totalManaged={totalManaged}
        onLogNew={() => setIsLogModalOpen(true)}
        onAddPerson={() => setIsAddDebtorModalOpen(true)}
      />

      <main className="flex-1 overflow-y-auto px-4 py-5 pb-28 sm:px-6 lg:px-12 lg:py-12 lg:pb-12 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab + (selectedDebtor?.id || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col"
          >
            {activeTab === 'dashboard' && (
              <header className="hidden lg:flex sticky top-4 z-30 justify-end items-center mb-8 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex glass-nav p-1.5 rounded-[28px]">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                          type="text"
                          placeholder="Search debtors..."
                          value={searchQuery}
                          onChange={(event) => setSearchQuery(event.target.value)}
                          className="glass-input w-72 rounded-[22px] py-3 pl-11 pr-4 text-sm font-bold outline-none transition-all"
                        />
                      </div>
                    </div>
                    <AnimatePresence>
                      {searchResults.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-80 liquid-panel rounded-[26px] p-2 shadow-[0_28px_80px_rgba(0,0,0,0.12)]"
                        >
                          {searchResults.map(debtor => {
                            const balance = Math.max(debtor.totalDebt - debtor.amountPaid, 0);

                            return (
                              <button
                                key={debtor.id}
                                onClick={() => {
                                  setSearchQuery('');
                                  handleSelectDebtor(debtor);
                                }}
                                className="w-full flex items-center justify-between gap-4 rounded-[20px] px-4 py-3 text-left hover:bg-white/70 transition-all"
                              >
                                <div className="min-w-0">
                                  <p className="font-bold text-sm truncate">{debtor.name}</p>
                                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Outstanding {formatINR(balance)}</p>
                                </div>
                                <div className="h-9 w-9 rounded-2xl bg-[#EFE7D2] text-[#3D4E3D] flex items-center justify-center text-[10px] font-bold shrink-0">
                                  {debtor.name.split(' ').map(n => n[0]).join('')}
                                </div>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="w-12 h-12 rounded-[22px] border border-white/60 shadow-lg overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#3D4E3D] flex items-center justify-center text-white shadow-black/20 ring-1 ring-white/20">
                    <IndianRupee size={22} />
                  </div>
                </div>
              </header>
            )}
            
            <div className="flex-1">
              {renderContent()}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <LogEntryModal 
        isOpen={isLogModalOpen} 
        onClose={() => setIsLogModalOpen(false)}
        debtors={debtors}
        onSave={handleLogSave}
      />

      <AddDebtorModal 
        isOpen={isAddDebtorModalOpen}
        onClose={() => setIsAddDebtorModalOpen(false)}
        onSave={handleAddDebtor}
      />

      <EditDebtorModal
        isOpen={Boolean(editingDebtor)}
        debtor={editingDebtor}
        onClose={() => setEditingDebtor(null)}
        onSave={handleEditDebtor}
      />
    </div>
  );
}
