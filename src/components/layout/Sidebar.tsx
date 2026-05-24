import React from 'react';
import { LayoutDashboard, Users, History, Settings, PlusCircle, UserPlus, IndianRupee } from 'lucide-react';
import { cn, formatINR } from '../../lib/utils';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalManaged: number;
  onLogNew: () => void;
  onAddPerson: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, totalManaged, onLogNew, onAddPerson }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'directory', icon: Users, label: 'Directory' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile top header */}
      <header className="lg:hidden sticky top-3 mx-3 z-40 flex items-center justify-between gap-3 glass-nav rounded-[24px] px-5 py-4 border border-white/40 shadow-lg">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-[#3D4E3D] to-[#2B382B] rounded-2xl flex items-center justify-center p-2 shadow-md">
            <IndianRupee size={18} className="text-[#EFE7D2]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold tracking-tight text-glass-main leading-tight font-display">DebtFlow</h1>
            <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-emerald-700/80 truncate font-sans">{formatINR(totalManaged)}</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button 
            type="button"
            onClick={onAddPerson} 
            aria-label="Add person" 
            className="h-10 w-10 flex items-center justify-center rounded-2xl glass-button focus:outline-none transition-transform active:scale-95"
          >
            <UserPlus size={16} />
          </button>
          <button 
            type="button"
            onClick={onLogNew} 
            aria-label="Log new entry" 
            className="h-10 w-10 flex items-center justify-center rounded-2xl bg-[#3D4E3D] text-[#EFE7D2] border border-[#3D4E3D]/30 shadow-md font-bold focus:outline-none hover:bg-[#3D4E3D]/95 transition-transform active:scale-95"
          >
            <PlusCircle size={18} />
          </button>
        </div>
      </header>

      {/* Desktop vertical sidebar */}
      <aside className="hidden lg:flex w-80 h-full flex-col p-8 glass-nav shrink-0 rounded-r-[40px] border-r border-white/50 relative overflow-hidden">
        {/* Subtle interior glow */}
        <div className="absolute top-[10%] -left-10 w-28 h-28 bg-[#3D4E3D]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 mb-14 px-4 relative z-10">
          <div className="w-11 h-11 bg-gradient-to-br from-[#3D4E3D] to-[#1A1A1A] rounded-2xl flex items-center justify-center p-2.5 shadow-lg shadow-[#3D4E3D]/25">
            <IndianRupee size={20} className="text-[#EFE7D2]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0f172a] font-display">DebtFlow</h1>
            <p className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-[#3D4E3D]/70">Paisa Tracker</p>
          </div>
        </div>

        <nav className="flex-1 space-y-3 relative z-10">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'w-full flex items-center gap-5 p-4 rounded-[20px] transition-all duration-350 group relative focus:outline-none font-sans',
                  isActive 
                    ? 'bg-white/55 text-[#0f172a] shadow-md border border-white/40 scale-[1.03]' 
                    : 'text-[#475569] hover:text-[#0f172a] hover:bg-white/20'
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active" 
                    className="absolute left-0 w-1.5 h-6 bg-[#3D4E3D] rounded-full" 
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }} 
                  />
                )}
                <item.icon 
                  size={20} 
                  className={cn(
                    'transition-all duration-350', 
                    isActive ? 'scale-115 text-[#3D4E3D]' : 'group-hover:scale-110 group-hover:text-[#3D4E3D]/80'
                  )} 
                />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-5 relative z-10">
          <button 
            type="button"
            onClick={onAddPerson} 
            className="w-full flex items-center justify-center gap-3 py-4 glass-button rounded-[24px] font-bold text-sm select-none transition-all duration-200 focus:outline-none group active:scale-98"
          >
            <div className="p-1.5 bg-[#3D4E3D]/5 rounded-lg group-hover:scale-110 transition-transform">
              <UserPlus size={16} className="text-[#3D4E3D]" />
            </div>
            <span className="text-[#3D4E3D]/90">Onboard Contact</span>
          </button>

          <div className="bg-[#1A1A1A]/95 text-white rounded-[32px] p-7 relative overflow-hidden group shadow-xl shadow-black/15 border border-white/10">
            {/* Ambient visual overlay inside the black box */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
              <LayoutDashboard size={100} />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-extrabold mb-2 font-display">Total Ledgers</p>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-emerald-400 font-display">{formatINR(totalManaged)}</p>
              <button 
                type="button"
                onClick={onLogNew} 
                className="mt-6 w-full bg-white text-[#1A1A1A] py-3.5 rounded-[20px] text-xs font-bold hover:bg-slate-100 transition-all active:scale-95 shadow-md shadow-white/5 focus:outline-none"
              >
                Log Entry
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sticky bottom navigator */}
      <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-50 grid grid-cols-4 gap-1.5 glass-nav rounded-[24px] px-3 pb-[max(env(safe-area-inset-bottom),0.6rem)] pt-3 border border-white/40 shadow-xl">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button 
              key={item.id} 
              type="button"
              onClick={() => setActiveTab(item.id)} 
              className={cn(
                'flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 text-[10px] font-bold transition-all focus:outline-none', 
                isActive 
                  ? 'bg-white/45 text-[#3D4E3D] shadow-sm border border-white/20' 
                  : 'text-[#475569]'
              )}
            >
              <item.icon size={18} className={cn('transition-transform duration-200', isActive && 'scale-110')} />
              <span className="truncate max-w-full">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
