import React from 'react';
import { 
  LayoutDashboard, Users, History, Settings, 
  PlusCircle, UserPlus 
} from 'lucide-react';
import { cn, formatINR } from '../../lib/utils';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalManaged: number;
  onLogNew: () => void;
  onAddPerson: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  totalManaged,
  onLogNew,
  onAddPerson
}) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'directory', icon: Users, label: 'Directory' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
    <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-[#3D4E3D]/5 bg-[#FAFAF8]/90 px-4 py-3 backdrop-blur-2xl">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 bg-[#1A1A1A] rounded-2xl flex items-center justify-center p-2.5 shadow-xl shadow-black/10 shrink-0">
          <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20m10-10H2" />
            <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
          </svg>
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold tracking-tight text-[#1A1A1A] leading-tight">Paisa.</h1>
          <p className="text-[9px] uppercase tracking-[0.18em] font-bold text-gray-400 truncate">{formatINR(totalManaged)}</p>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={onAddPerson}
          aria-label="Add person"
          className="h-11 w-11 flex items-center justify-center rounded-2xl bg-white/70 border border-white text-[#3D4E3D] shadow-sm active:scale-95 transition-all"
        >
          <UserPlus size={19} />
        </button>
        <button
          onClick={onLogNew}
          aria-label="Log new entry"
          className="h-11 w-11 flex items-center justify-center rounded-2xl bg-[#1A1A1A] text-white shadow-sm active:scale-95 transition-all"
        >
          <PlusCircle size={20} />
        </button>
      </div>
    </header>

    <aside className="hidden lg:flex w-80 h-full flex-col p-8 border-r border-[#3D4E3D]/5 bg-[#FAFAF8]/40 backdrop-blur-3xl shrink-0">
      <div className="flex items-center gap-4 mb-16 px-4">
        <div className="w-12 h-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center p-2.5 shadow-2xl shadow-black/20">
          <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20m10-10H2" />
            <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1A1A1A]">Paisa.</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Recovery Pro</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-5 p-4 rounded-[20px] transition-all duration-300 group relative",
              activeTab === item.id 
                ? "bg-white text-[#1A1A1A] shadow-[0_8px_32px_rgba(0,0,0,0.06)] scale-[1.02]" 
                : "text-gray-400 hover:text-[#1A1A1A] hover:bg-white/40"
            )}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="sidebar-active"
                className="absolute left-0 w-1.5 h-6 bg-[#3D4E3D] rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <item.icon 
              size={22} 
              className={cn("transition-transform duration-300", activeTab === item.id ? "scale-110" : "group-hover:scale-110")} 
            />
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-6">
        <button 
          onClick={onAddPerson}
          className="w-full flex items-center justify-center gap-3 py-4 bg-white/60 backdrop-blur-xl border border-white/80 rounded-[24px] text-[#3D4E3D] hover:bg-white shadow-[0_8px_32px_rgba(0,0,0,0.02)] transition-all font-bold text-sm group"
        >
          <div className="p-1.5 bg-[#3D4E3D]/5 rounded-lg group-hover:scale-110 transition-transform">
            <UserPlus size={18} />
          </div>
          <span>Add Person</span>
        </button>

        <div className="bg-[#1A1A1A] rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-black/10">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
            <LayoutDashboard size={100} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">Total Managed</p>
            <p className="text-3xl font-bold tracking-tight tabular-nums">{formatINR(totalManaged)}</p>
            <button 
              onClick={onLogNew}
              className="mt-8 w-full bg-white text-[#1A1A1A] py-4 rounded-[20px] text-xs font-bold hover:bg-gray-100 transition-all active:scale-95 shadow-lg shadow-white/5"
            >
              Log New Entry
            </button>
          </div>
        </div>
      </div>
    </aside>

    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 gap-1 border-t border-[#3D4E3D]/5 bg-[#FAFAF8]/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur-2xl shadow-[0_-12px_32px_rgba(0,0,0,0.06)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={cn(
            "flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-bold transition-all",
            activeTab === item.id
              ? "bg-white text-[#1A1A1A] shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
              : "text-gray-400"
          )}
        >
          <item.icon size={20} />
          <span className="truncate">{item.label}</span>
        </button>
      ))}
    </nav>
    </>
  );
};
