import React from 'react';
import { cn } from '../../lib/utils';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  amount: string;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  color?: string;
  icon?: LucideIcon;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  amount, 
  trend, 
  trendType,
  color = 'bg-white/60',
  icon: Icon,
  className
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, scale: 1.015, transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] } }}
      className={cn(
        "liquid-panel p-5 sm:p-8 rounded-[28px] sm:rounded-[40px] transition-all duration-300 relative overflow-hidden flex flex-col justify-between group",
        color,
        className
      )}
    >
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      {/* Decorative background icon */}
      {Icon && (
        <div className="absolute -right-6 -bottom-6 text-black/[0.03] group-hover:text-black/[0.05] transition-colors pointer-events-none transform -rotate-12">
          <Icon size={110} />
        </div>
      )}

      <div className="relative z-10">
        <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2 truncate">
          {title}
        </p>
        <p className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A] tabular-nums break-words">{amount}</p>
      </div>
      
      {trend && (
        <div className={cn(
          "mt-4 sm:mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight w-fit px-3 py-1.5 rounded-2xl relative z-10",
          trendType === 'up' ? "text-emerald-600 bg-emerald-50/50" : 
          trendType === 'down' ? "text-red-600 bg-red-50/50" : 
          "text-gray-500 bg-gray-50/50"
        )}>
          {trendType === 'up' && <ArrowUpRight size={12} />}
          {trendType === 'down' && <ArrowDownRight size={12} />}
          {trend}
        </div>
      )}
    </motion.div>
  );
};
