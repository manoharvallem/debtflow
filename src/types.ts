export type TransactionType = 'DEBT' | 'PAYMENT';

export interface Transaction {
  id: string;
  debtorId: string;
  amount: number;
  type: TransactionType;
  date: string;
  note?: string;
}

export interface Debtor {
  id: string;
  name: string;
  totalDebt: number;
  amountPaid: number;
  lastPaymentDate?: string;
  status: 'CURRENT' | 'PENDING' | 'OVERDUE';
}

export interface DashboardStats {
  totalOutstanding: number;
  collectedToday: number;
  recoveryRate: number;
  trendData: { name: string; amount: number }[];
}
