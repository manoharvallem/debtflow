import React from 'react';
import { formatINR } from '../../lib/utils';

interface MomentumPoint {
  key: string;
  label: string;
  amount: number;
}

interface CollectionMomentumProps {
  points: MomentumPoint[];
}

export const CollectionMomentum: React.FC<CollectionMomentumProps> = ({ points }) => {
  const maxAmount = Math.max(...points.map(point => point.amount), 1);
  const latest = points[points.length - 1]?.amount || 0;
  const previous = points[points.length - 2]?.amount || 0;
  const change = previous > 0 ? ((latest - previous) / previous) * 100 : latest > 0 ? 100 : 0;

  return (
    <div className="liquid-panel rounded-[28px] sm:rounded-[36px] p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-glass-main">Collection Momentum</h3>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-glass-subtle mt-1">Last 6 months</p>
        </div>
        <div className="liquid-chip rounded-2xl px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-glass-subtle">MoM</p>
          <p className={`text-sm font-bold tabular-nums ${change >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 items-end h-40">
        {points.map(point => {
          const barHeight = Math.max((point.amount / maxAmount) * 100, point.amount > 0 ? 8 : 0);
          return (
            <div key={point.key} className="flex flex-col items-center justify-end gap-2 h-full">
              <div className="w-full h-full flex items-end">
                <div
                  className="w-full rounded-xl bg-gradient-to-t from-cyan-400/85 to-indigo-300/90 border border-white/25"
                  style={{ height: `${barHeight}%` }}
                  title={`${point.label}: ${formatINR(point.amount)}`}
                />
              </div>
              <span className="text-[10px] font-bold text-glass-subtle uppercase tracking-wider">{point.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
