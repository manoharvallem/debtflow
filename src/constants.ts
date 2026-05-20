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
    badgeClassName: 'bg-sky-50 text-sky-600 shadow-[0_4px_12px_rgba(14,165,233,0.12)]',
    accentClassName: 'bg-sky-400',
    panelClassName: 'from-sky-400/20 to-cyan-300/10',
  },
  INTERVIEW_COMPLETED: {
    label: 'Interview Completed',
    shortLabel: 'Interview',
    badgeClassName: 'bg-violet-50 text-violet-600 shadow-[0_4px_12px_rgba(139,92,246,0.12)]',
    accentClassName: 'bg-violet-400',
    panelClassName: 'from-violet-400/18 to-fuchsia-300/10',
  },
  HR_ROUND_COMPLETED: {
    label: 'HR Round Completed',
    shortLabel: 'HR Round',
    badgeClassName: 'bg-amber-50 text-amber-600 shadow-[0_4px_12px_rgba(245,158,11,0.12)]',
    accentClassName: 'bg-amber-400',
    panelClassName: 'from-amber-300/20 to-yellow-200/10',
  },
  BGV_INITIATED: {
    label: 'BGV Initiated',
    shortLabel: 'BGV',
    badgeClassName: 'bg-rose-50 text-rose-600 shadow-[0_4px_12px_rgba(244,63,94,0.12)]',
    accentClassName: 'bg-rose-400',
    panelClassName: 'from-rose-300/18 to-orange-200/10',
  },
  OFFER_RELEASED: {
    label: 'Offer Released',
    shortLabel: 'Offer Released',
    badgeClassName: 'bg-emerald-50 text-emerald-600 shadow-[0_4px_12px_rgba(16,185,129,0.14)]',
    accentClassName: 'bg-emerald-400',
    panelClassName: 'from-emerald-300/20 to-teal-200/10',
  },
};

export function getStageIndex(stage: CandidateStage) {
  return CANDIDATE_STAGE_ORDER.indexOf(stage);
}

export function getStageProgress(stage: CandidateStage) {
  return ((getStageIndex(stage) + 1) / CANDIDATE_STAGE_ORDER.length) * 100;
}
