import { Debtor, Transaction, DashboardStats } from './types';

export const MOCK_DEBTORS: Debtor[] = [
  { id: '1', name: 'James Sullivan', totalDebt: 1200, amountPaid: 450, lastPaymentDate: '2024-04-25', status: 'OVERDUE' },
  { id: '2', name: 'Sarah Connor', totalDebt: 850, amountPaid: 850, lastPaymentDate: '2024-04-28', status: 'CURRENT' },
  { id: '3', name: 'Mike Ross', totalDebt: 12400, amountPaid: 5200, lastPaymentDate: '2024-04-20', status: 'PENDING' },
  { id: '4', name: 'Harvey Specter', totalDebt: 25000, amountPaid: 15000, lastPaymentDate: '2024-04-27', status: 'CURRENT' },
  { id: '5', name: 'Rachel Zane', totalDebt: 3200, amountPaid: 1200, lastPaymentDate: '2024-04-22', status: 'PENDING' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', debtorId: '1', amount: 200, type: 'PAYMENT', date: '2024-04-25', note: 'Monthly installment' },
  { id: 't2', debtorId: '3', amount: 1000, type: 'PAYMENT', date: '2024-04-20', note: 'Partial clearing' },
  { id: 't3', debtorId: '2', amount: 850, type: 'PAYMENT', date: '2024-04-28', note: 'Final settlement' },
  { id: 't4', debtorId: '4', amount: 5000, type: 'DEBT', date: '2024-04-10', note: 'Business loan' },
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalOutstanding: 120000,
  collectedToday: 4250,
  recoveryRate: 64,
  trendData: [
    { name: 'Mon', amount: 2400 },
    { name: 'Tue', amount: 1398 },
    { name: 'Wed', amount: 9800 },
    { name: 'Thu', amount: 3908 },
    { name: 'Fri', amount: 4800 },
    { name: 'Sat', amount: 3800 },
    { name: 'Sun', amount: 4300 },
  ],
};

export const COLORS = {
  background: '#F4F4F4',
  card: '#FFFFFF',
  primary: '#3D4E3D',
  secondary: '#EFE7D2',
  status: '#B8A9C1',
  text: '#1A1A1A',
};
