import React from 'react';

interface PortfolioHealthProps {
  currentCount: number;
  pendingCount: number;
  overdueCount: number;
  settledCount: number;
}

export const PortfolioHealth: React.FC<PortfolioHealthProps> = ({
  currentCount,
  pendingCount,
  overdueCount,
  settledCount,
}) => {
  const total = Math.max(currentCount + pendingCount + overdueCount + settledCount, 1);
  const currentPct = (currentCount / total) * 100;
  const pendingPct = (pendingCount / total) * 100;
  const overduePct = (overdueCount / total) * 100;
  const settledPct = (settledCount / total) * 100;

  const donutStyle = {
    background: `conic-gradient(
      rgba(16, 185, 129, 0.88) 0% ${currentPct}%,
      rgba(250, 204, 21, 0.85) ${currentPct}% ${currentPct + pendingPct}%,
      rgba(248, 113, 113, 0.88) ${currentPct + pendingPct}% ${currentPct + pendingPct + overduePct}%,
      rgba(59, 130, 246, 0.86) ${currentPct + pendingPct + overduePct}% 100%
    )`,
  } as React.CSSProperties;

  const rows = [
    { label: 'Current', value: currentCount, color: 'bg-emerald-300' },
    { label: 'Pending', value: pendingCount, color: 'bg-amber-300' },
    { label: 'Overdue', value: overdueCount, color: 'bg-rose-300' },
    { label: 'Settled', value: settledCount, color: 'bg-blue-300' },
  ];

  return (
    <div className="liquid-panel rounded-[28px] sm:rounded-[36px] p-5 sm:p-7">
      <h3 className="text-lg font-bold text-glass-main">Portfolio Health</h3>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-glass-subtle mt-1 mb-6">Debtor status mix</p>

      <div className="flex gap-6 items-center">
        <div className="relative h-32 w-32 shrink-0">
          <div className="absolute inset-0 rounded-full border border-white/20" style={donutStyle} />
          <div className="absolute inset-4 rounded-full liquid-chip flex items-center justify-center">
            <span className="text-sm font-bold text-glass-main">{total}</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {rows.map(row => (
            <div key={row.label} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`h-2.5 w-2.5 rounded-full ${row.color}`} />
                <span className="text-sm text-glass-subtle font-semibold truncate">{row.label}</span>
              </div>
              <span className="text-sm font-bold text-glass-main tabular-nums">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
