import React, { useEffect, useMemo, useState } from 'react';
import { X, Search, Calendar, FileText, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CandidateStage, Debtor } from '../../types';
import { cn } from '../../lib/utils';
import { CANDIDATE_STAGE_META, CANDIDATE_STAGE_ORDER, getStageIndex } from '../../constants';
import { format } from 'date-fns';

interface WorkflowUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  debtors: Debtor[];
  onSave: (data: { debtorId: string; stage: CandidateStage; note: string; date: string; joiningDate?: string }) => void;
  defaultDebtorId?: string;
}

export const WorkflowUpdateModal: React.FC<WorkflowUpdateModalProps> = ({ isOpen, onClose, debtors, onSave, defaultDebtorId }) => {
  const [selectedDebtorId, setSelectedDebtorId] = useState(defaultDebtorId || '');
  const [stage, setStage] = useState<CandidateStage>('REFERRED_TO_HR');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [joiningDate, setJoiningDate] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setSelectedDebtorId(defaultDebtorId || '');
    setNote('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setJoiningDate('');
  }, [defaultDebtorId, isOpen]);

  const selectedDebtor = useMemo(() => debtors.find(d => d.id === selectedDebtorId), [debtors, selectedDebtorId]);
  const stageOptions = useMemo(() => {
    if (!selectedDebtor) return CANDIDATE_STAGE_ORDER;
    return CANDIDATE_STAGE_ORDER.slice(getStageIndex(selectedDebtor.currentStage));
  }, [selectedDebtor]);

  useEffect(() => {
    if (selectedDebtor) {
      setStage(stageOptions.includes(selectedDebtor.currentStage) ? selectedDebtor.currentStage : stageOptions[0]);
    }
  }, [selectedDebtorId]);

  const isValid = Boolean(selectedDebtorId && stage);
  const selectedStageMeta = CANDIDATE_STAGE_META[stage];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/35 backdrop-blur-md" />
          <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto liquid-panel rounded-[40px] sm:rounded-[56px] border border-white/70">
            <div className="relative overflow-hidden rounded-t-[40px] sm:rounded-t-[56px] border-b border-white/50 bg-gradient-to-br from-white/55 via-white/30 to-cyan-100/30 p-6 sm:p-10 backdrop-blur-3xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><CheckCircle2 size={120} /></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">Candidate Workflow</h3>
                  <button onClick={onClose} className="p-3 rounded-2xl text-slate-500 hover:bg-white/30 hover:text-[#1A1A1A] transition-all"><X size={24} /></button>
                </div>
                <p className="text-gray-500 font-medium tracking-tight sm:max-w-[80%]">Track where this person is in the interview process without changing the primary debt workflow.</p>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (!isValid) return; onSave({ debtorId: selectedDebtorId, stage, note, date, joiningDate: stage === 'OFFER_RELEASED' ? joiningDate || undefined : undefined }); onClose(); }} className="p-5 sm:p-10 space-y-5 sm:space-y-8">
              <div className="space-y-3">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Person</label>
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={18} />
                  <select value={selectedDebtorId} onChange={(e) => setSelectedDebtorId(e.target.value)} required className="w-full pl-14 pr-10 py-5 bg-white/40 rounded-[28px] border border-white shadow-sm focus:ring-4 focus:ring-black/5 appearance-none font-bold text-sm tracking-tight outline-none transition-all hover:bg-white/60">
                    <option value="" disabled>Choose person...</option>
                    {debtors.map(debtor => <option key={debtor.id} value={debtor.id}>{debtor.name}</option>)}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><ChevronDown size={18} /></div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Current Workflow Stage</label>
                <div className="rounded-[28px] border border-white/60 bg-white/40 px-5 py-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#1A1A1A]">{selectedDebtor ? CANDIDATE_STAGE_META[selectedDebtor.currentStage].label : 'Select a person'}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-widest font-bold text-gray-400">Workflow follows the candidate journey from HR to offer</p>
                    </div>
                    {selectedDebtor && <span className={cn('px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest', CANDIDATE_STAGE_META[selectedDebtor.currentStage].badgeClassName)}>{CANDIDATE_STAGE_META[selectedDebtor.currentStage].shortLabel}</span>}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Next Stage</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stageOptions.map(option => {
                    const meta = CANDIDATE_STAGE_META[option];
                    return (
                      <button key={option} type="button" onClick={() => setStage(option)} className={cn('rounded-[24px] border px-4 py-4 text-left transition-all backdrop-blur-xl', stage === option ? 'border-white/90 bg-white/75 shadow-[0_12px_28px_rgba(15,23,42,0.1)]' : 'border-white/50 bg-white/35 hover:bg-white/55')}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold text-[#1A1A1A]">{meta.label}</p>
                          <span className={cn('h-2.5 w-2.5 rounded-full shadow-sm', meta.accentClassName)} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Update Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={18} />
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full pl-14 pr-6 py-5 bg-white/60 rounded-[28px] border border-white/80 shadow-sm focus:ring-4 focus:ring-cyan-500/10 font-bold text-sm outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Stage Selected</label>
                  <div className={cn('rounded-[28px] border border-white/60 bg-gradient-to-r px-5 py-4 shadow-sm', selectedStageMeta.panelClassName)}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Workflow State</p>
                    <p className="mt-1 text-sm font-bold text-[#1A1A1A]">{selectedStageMeta.label}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Comments</label>
                <div className="relative group">
                  <FileText className="absolute left-5 top-5 text-gray-400 group-hover:text-black transition-colors" size={18} />
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="Capture recruiter notes, interview feedback, or BGV remarks..." className="w-full pl-14 pr-6 py-5 bg-white/60 rounded-[28px] border border-white/80 shadow-sm focus:ring-4 focus:ring-cyan-500/10 font-bold text-sm outline-none transition-all resize-none" />
                </div>
              </div>

              {stage === 'OFFER_RELEASED' && (
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Joining Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={18} />
                    <input
                      type="date"
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 bg-white/60 rounded-[28px] border border-white/80 shadow-sm focus:ring-4 focus:ring-cyan-500/10 font-bold text-sm outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:flex gap-3 sm:gap-4 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-4 sm:py-5 rounded-[28px] text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#1A1A1A] hover:bg-white/40 transition-all">Discard</button>
                <button type="submit" disabled={!isValid} className={cn('flex-[1.5] py-4 sm:py-5 rounded-[28px] text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 bg-[#1A1A1A] text-white shadow-black/10 hover:bg-black', !isValid && 'opacity-50 cursor-not-allowed grayscale')}>Save Workflow Update</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
