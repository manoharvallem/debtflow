export type CandidateStage =
  | 'REFERRED_TO_HR'
  | 'INTERVIEW_COMPLETED'
  | 'HR_ROUND_COMPLETED'
  | 'BGV_INITIATED'
  | 'OFFER_RELEASED';

export type TransactionType = 'DEBT' | 'PAYMENT';

export interface Transaction {
  id: string;
  debtorId: string;
  amount: number;
  type: TransactionType;
  date: string;
  note?: string;
}

export interface WorkflowEntry {
  id: string;
  debtorId: string;
  stage: CandidateStage;
  date: string;
  note?: string;
  joiningDate?: string;
}

export interface Debtor {
  id: string;
  name: string;
  totalDebt: number;
  amountPaid: number;
  lastPaymentDate?: string;
  status: 'CURRENT' | 'PENDING' | 'OVERDUE';
  currentStage: CandidateStage;
  lastStageDate?: string;
  joiningDate?: string;
  labels: string[];
  mobile?: string;
  email?: string;
}
