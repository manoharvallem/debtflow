import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number, showDecimals: boolean = false) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
}

function formatShortNumber(value: number, maxFractionDigits: number) {
  const rounded = Number(value.toFixed(maxFractionDigits));
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

// Compact number labels for charts (e.g. 100000 -> 1L, 250000 -> 2.5L, 10000000 -> 1Cr)
export function formatINRCompact(amount: number) {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) return '';

  const abs = Math.abs(numeric);
  const sign = numeric < 0 ? '-' : '';

  if (abs >= 1e7) return `${sign}${formatShortNumber(abs / 1e7, 1)}Cr`;
  if (abs >= 1e5) return `${sign}${formatShortNumber(abs / 1e5, 1)}L`;
  if (abs >= 1e3) return `${sign}${formatShortNumber(abs / 1e3, 1)}K`;
  return `${sign}${Math.round(abs)}`;
}

export function formatDateOnly(value: string | undefined | null) {
  if (!value) return undefined;
  const date = new Date(String(value).trim());
  if (Number.isNaN(date.getTime())) return String(value).trim();
  return format(date, 'dd - MMM - yy');
}
