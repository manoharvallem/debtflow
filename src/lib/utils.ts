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

export function formatDateOnly(value: string | undefined | null) {
  if (!value) return undefined;
  const date = new Date(String(value).trim());
  if (Number.isNaN(date.getTime())) return String(value).trim();
  return format(date, 'dd - MMM - yy');
}
