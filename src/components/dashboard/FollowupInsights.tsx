import React from 'react';
import { formatINR } from '../../lib/utils';

interface FollowupInsightsProps {
  topDebtorName: string;
  topDebtorOutstanding: number;
  avgDaysSincePayment: number;
  paymentsLast30Days: number;
}

export const FollowupInsights: React.FC<FollowupInsightsProps> = ({
  topDebtorName,
  topDebtorOutstanding,
  avgDaysSincePayment,
  paymentsLast30Days,
}) => {
  return (
    <div className="liquid-panel rounded-[28px] sm:rounded-[36px] p-5 sm:p-7">
      <h3 className="text-lg font-bold text-glass-main">Follow-up Insights</h3>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-glass-subtle mt-1 mb-6">Actionable recovery signals</p>

      <div className="space-y-3">
        <div className="liquid-chip rounded-2xl p-3.5">
          <p className="text-[10px] uppercase tracking-widest text-glass-subtle font-bold">Largest Outstanding</p>
          <p className="text-base font-bold text-glass-main truncate mt-1">{topDebtorName}</p>
          <p className="text-sm font-bold text-rose-300 tabular-nums">{formatINR(topDebtorOutstanding)}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="liquid-chip rounded-2xl p-3.5">
            <p className="text-[10px] uppercase tracking-widest text-glass-subtle font-bold">Avg Lag</p>
            <p className="text-xl font-bold text-glass-main tabular-nums mt-1">{avgDaysSincePayment}d</p>
          </div>
          <div className="liquid-chip rounded-2xl p-3.5">
            <p className="text-[10px] uppercase tracking-widest text-glass-subtle font-bold">30d Payments</p>
            <p className="text-xl font-bold text-emerald-300 tabular-nums mt-1">{paymentsLast30Days}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
