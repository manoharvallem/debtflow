import { CandidateStage } from './types';

export const CANDIDATE_STAGE_ORDER: CandidateStage[] = [
  'REFERRED_TO_HR',
  'INTERVIEW_COMPLETED',
  'HR_ROUND_COMPLETED',
  'BGV_INITIATED',
  'OFFER_RELEASED',
];

export const CANDIDATE_STAGE_META: Record<
  CandidateStage,
  {
    label: string;
    shortLabel: string;
    badgeClassName: string;
    accentClassName: string;
    panelClassName: string;
  }
> = {
  REFERRED_TO_HR: {
    label: 'Referred To HR',
    shortLabel: 'Referred',
    badgeClassName: 'bg-cyan-500/12 text-cyan-900 border border-cyan-500/25 shadow-[0_4px_12px_rgba(34,211,238,0.12)] backdrop-blur-md',
    accentClassName: 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]',
    panelClassName: 'from-cyan-500/20 to-cyan-300/5',
  },
  INTERVIEW_COMPLETED: {
    label: 'Interview Completed',
    shortLabel: 'Interview',
    badgeClassName: 'bg-indigo-500/12 text-indigo-900 border border-indigo-500/25 shadow-[0_4px_12px_rgba(129,140,248,0.12)] backdrop-blur-md',
    accentClassName: 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.6)]',
    panelClassName: 'from-indigo-400/20 to-indigo-300/5',
  },
  HR_ROUND_COMPLETED: {
    label: 'HR Round Completed',
    shortLabel: 'HR Round',
    badgeClassName: 'bg-amber-500/14 text-amber-950 border border-amber-500/25 shadow-[0_4px_12px_rgba(251,191,36,0.12)] backdrop-blur-md',
    accentClassName: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]',
    panelClassName: 'from-amber-300/20 to-yellow-200/5',
  },
  BGV_INITIATED: {
    label: 'BGV Initiated',
    shortLabel: 'BGV',
    badgeClassName: 'bg-rose-500/12 text-rose-900 border border-rose-500/25 shadow-[0_4px_12px_rgba(251,113,133,0.12)] backdrop-blur-md',
    accentClassName: 'bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.6)]',
    panelClassName: 'from-rose-300/20 to-orange-200/5',
  },
  OFFER_RELEASED: {
    label: 'Offer Released',
    shortLabel: 'Offer Released',
    badgeClassName: 'bg-emerald-500/12 text-emerald-900 border border-emerald-500/25 shadow-[0_4px_12px_rgba(52,211,153,0.12)] backdrop-blur-md',
    accentClassName: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]',
    panelClassName: 'from-emerald-300/20 to-teal-200/5',
  },
};

export function getStageIndex(stage: CandidateStage) {
  return CANDIDATE_STAGE_ORDER.indexOf(stage);
}

export function getStageProgress(stage: CandidateStage) {
  return ((getStageIndex(stage) + 1) / CANDIDATE_STAGE_ORDER.length) * 100;
}
