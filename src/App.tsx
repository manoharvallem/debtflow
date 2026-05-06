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
import { Search, IndianRupee, HandCoins, Users as UsersIcon } from 'lucide-react';
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
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">Settings</h2>
        <p className="text-gray-500 font-medium tracking-tight">Keep this tracker free with Google Sheets sync and local backups.</p>
      </div>

      <div className="bg-white/40 backdrop-blur-3xl rounded-[28px] sm:rounded-[40px] border border-white/60 shadow-[0_32px_64px_rgba(0,0,0,0.04)] p-5 sm:p-10 max-w-3xl">
        <h3 className="text-xl font-bold tracking-tight mb-2">Google Sheets Sync</h3>
        <p className="text-sm text-gray-500 font-medium mb-8">
          {sheetsSyncEnabled ? syncStatus : 'Add your Apps Script web app URL in .env to sync across devices.'}
        </p>

        <button
          onClick={onSyncNow}
          disabled={!sheetsSyncEnabled}
          className="mb-10 w-full sm:w-auto px-6 py-4 rounded-[20px] bg-[#3D4E3D] text-[#EFE7D2] text-xs font-bold uppercase tracking-widest shadow-lg shadow-black/10 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Refresh From Sheet
        </button>

        <h3 className="text-xl font-bold tracking-tight mb-2">Backup</h3>
        <p className="text-sm text-gray-500 font-medium mb-8">Export a copy before clearing browser data or moving to a new device.</p>

        <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3 sm:gap-4">
          <button
            onClick={onExport}
            className="px-6 py-4 rounded-[20px] bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-black/10 active:scale-95 transition-all"
          >
            Export Data
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-4 rounded-[20px] bg-white/70 text-[#3D4E3D] border border-white text-xs font-bold uppercase tracking-widest shadow-sm active:scale-95 transition-all"
          >
            Import Data
          </button>
          <button
            onClick={onReset}
            className="px-6 py-4 rounded-[20px] bg-red-50 text-red-500 text-xs font-bold uppercase tracking-widest active:scale-95 transition-all"
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
    
    return {
      totalOutstanding: totalOut,
      collectedTillDate
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 pb-10 flex-1 min-h-[400px]">
          <div className="lg:col-span-2">
            <DebtSplitRadial
              collected={stats.collectedTillDate}
              remaining={stats.totalOutstanding}
              totalManaged={totalManaged}
              debtors={debtors}
            />
          </div>
          <div className="lg:col-span-1">
            <PriorityDebtors 
              debtors={debtors} 
              onViewAll={() => setActiveTab('directory')}
              onSelectDebtor={handleSelectDebtor}
            />
          </div>
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
    <div className="flex w-full h-[100dvh] lg:h-screen flex-col lg:flex-row bg-[#FAFAF8] text-[#1A1A1A] font-sans selection:bg-[#3D4E3D] selection:text-white overflow-hidden">
      <Sidebar 
        activeTab={activeTab === 'detail' ? 'directory' : activeTab} 
        setActiveTab={setActiveTab} 
        totalManaged={totalManaged}
        onLogNew={() => setIsLogModalOpen(true)}
        onAddPerson={() => setIsAddDebtorModalOpen(true)}
      />

      <main className="flex-1 overflow-y-auto px-4 py-5 pb-28 sm:px-6 lg:px-12 lg:py-12 lg:pb-12 flex flex-col relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab + (selectedDebtor?.id || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col"
          >
            {activeTab === 'dashboard' && (
              <header className="hidden lg:flex justify-between items-center mb-12 shrink-0">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Account Overview</h2>
                  <p className="text-gray-400 font-medium tracking-tight mt-1">Status of {debtors.length} key relationships in your network.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex bg-white/40 backdrop-blur-2xl p-1.5 border border-white/40 rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.02]">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          placeholder="Search debtors..."
                          value={searchQuery}
                          onChange={(event) => setSearchQuery(event.target.value)}
                          className="w-72 rounded-[22px] bg-white/30 py-3 pl-11 pr-4 text-sm font-bold outline-none transition-all placeholder:text-gray-400 focus:bg-white/60 focus:ring-4 focus:ring-black/5"
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
