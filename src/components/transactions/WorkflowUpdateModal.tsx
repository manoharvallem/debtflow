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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 24,
    },
  },
} as const;

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
    return CANDIDATE_STAGE_ORDER; // Let user choose any stage instead of strict limiting, but pre-select current
  }, [selectedDebtor]);

  useEffect(() => {
    if (selectedDebtor) {
      setStage(selectedDebtor.currentStage);
    }
  }, [selectedDebtorId, selectedDebtor]);

  const isValid = Boolean(selectedDebtorId && stage);
  const selectedStageMeta = CANDIDATE_STAGE_META[stage];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 30 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.94, y: 30 }} 
            transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
            className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto glass-panel-strong rounded-[36px] sm:rounded-[44px] shadow-2xl border border-white/60 focus:outline-none"
          >
            {/* Header section with radial sheen */}
            <div className="relative overflow-hidden border-b border-white/20 bg-gradient-to-br from-white/50 via-white/10 to-indigo-100/20 p-6 sm:p-9 backdrop-blur-3xl rounded-t-[36px] sm:rounded-t-[44px]">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <CheckCircle2 size={110} />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f172a] font-display">Update Stage</h3>
                  <button 
                    type="button"
                    onClick={onClose} 
                    className="p-2.5 rounded-xl text-slate-500 hover:bg-white/40 hover:text-[#0f172a] transition-all focus:outline-none"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-xs font-bold text-[#475569]/90 tracking-tight leading-relaxed">
                  Fast track interview rounds and sync active dates of join directly down to the spreadsheet pipeline.
                </p>
              </div>
            </div>

            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                if (!isValid) return; 
                onSave({ 
                  debtorId: selectedDebtorId, 
                  stage, 
                  note, 
                  date, 
                  joiningDate: stage === 'OFFER_RELEASED' ? joiningDate || undefined : undefined 
                }); 
                onClose(); 
              }} 
              className="p-6 sm:p-9"
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6 sm:space-y-7"
              >
                {/* Person Select */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2 font-sans">Contact Candidate</label>
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4E3D]" size={15} />
                    <select 
                      value={selectedDebtorId} 
                      onChange={(e) => setSelectedDebtorId(e.target.value)} 
                      required 
                      className="w-full pl-13 pr-10 py-4 bg-white/40 rounded-2xl border border-white/50 shadow-xs appearance-none font-extrabold text-sm tracking-tight outline-none transition-all hover:bg-white/60 cursor-pointer"
                    >
                      <option value="" disabled>Select candidate...</option>
                      {debtors.map(debtor => <option key={debtor.id} value={debtor.id}>{debtor.name}</option>)}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </motion.div>

                {/* Current Status banner */}
                <motion.div variants={itemVariants} className="space-y-1 relative z-10">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2">Current Active Status</label>
                  <div className="rounded-2xl border border-white/40 bg-white/30 px-5 py-3.5 shadow-xs backdrop-blur-md">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-extrabold text-[#0f172a] leading-none">
                          {selectedDebtor ? 'Pipeline Verified' : 'No Contact Elected'}
                        </p>
                        <p className="mt-2 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                          {selectedDebtor ? `Current stage: ${CANDIDATE_STAGE_META[selectedDebtor.currentStage].label}` : 'Choose contact above first'}
                        </p>
                      </div>
                      {selectedDebtor && (
                        <span className={cn('px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest whitespace-nowrap', CANDIDATE_STAGE_META[selectedDebtor.currentStage].badgeClassName)}>
                          {CANDIDATE_STAGE_META[selectedDebtor.currentStage].shortLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Stage Picker Grid */}
                <motion.div variants={itemVariants} className="space-y-2 relative z-10">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2">Set Target Stage</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[160px] overflow-y-auto pr-1">
                    {stageOptions.map(option => {
                      const meta = CANDIDATE_STAGE_META[option];
                      const isSelected = stage === option;
                      return (
                        <button 
                          key={option} 
                          type="button" 
                          onClick={() => setStage(option)} 
                          className={cn(
                            'rounded-2xl border p-3 text-left transition-all backdrop-blur-xl focus:outline-none', 
                            isSelected 
                              ? 'border-white bg-white/75 shadow-md scale-[1.01]' 
                              : 'border-white/20 bg-white/20 hover:bg-white/40 hover:border-white/40'
                          )}
                        >
                          <div className="flex items-center justify-between gap-2.5">
                            <p className="text-xs font-extrabold text-[#0f172a]">{meta.label}</p>
                            <span className={cn('h-2.5 w-2.5 rounded-full shadow-xs shrink-0', meta.accentClassName)} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Date of update & preview indicator */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-[#3d4e3d] uppercase tracking-[0.2em] ml-2">Update Date</label>
                    <div className="relative group">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4E3D]" size={16} />
                      <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        required 
                        className="w-full pl-13 pr-5 py-4 bg-white/35 rounded-2xl font-bold text-sm outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2 font-sans">Active Target State</label>
                    <div className={cn('rounded-2xl border border-white/50 bg-gradient-to-r px-5 py-3.5 shadow-xs whitespace-nowrap overflow-hidden', selectedStageMeta.panelClassName)}>
                      <p className="text-[8px] font-extrabold uppercase tracking-widest text-[#3D4E3D]">Stage target is</p>
                      <p className="mt-1 text-xs font-extrabold text-[#0f172a] truncate">{selectedStageMeta.label}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Comments fields */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] ml-2">Recruiter / Feedback comment</label>
                  <div className="relative group">
                    <FileText className="absolute left-5 top-4.5 text-[#3D4E3D]" size={16} />
                    <textarea 
                      value={note} 
                      onChange={(e) => setNote(e.target.value)} 
                      rows={2.5} 
                      placeholder="Capture interviewer feedback, interview milestones, scale notes, BGV checks..." 
                      className="w-full pl-13 pr-5 py-4 bg-white/35 rounded-2xl font-bold text-sm outline-none transition-all resize-none" 
                    />
                  </div>
                </motion.div>

                {/* Date of joining hook if "OFFER_RELEASED" selected */}
                {stage === 'OFFER_RELEASED' && (
                  <motion.div variants={itemVariants} className="space-y-2 animate-glass-enter">
                    <label className="text-[10px] font-extrabold text-[#059669] uppercase tracking-[0.2em] ml-2">Release Date of Joining</label>
                    <div className="relative group">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4E3D]" size={16} />
                      <input 
                        type="date" 
                        value={joiningDate} 
                        onChange={(e) => setJoiningDate(e.target.value)} 
                        className="w-full pl-13 pr-5 py-4 bg-white/35 rounded-2xl font-bold text-sm outline-none transition-all" 
                      />
                    </div>
                  </motion.div>
                )}

                {/* Submit footer */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 pt-4 pb-2 sm:pb-3">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="py-4 rounded-2xl text-[10.5px] font-extrabold uppercase tracking-widest text-[#475569] hover:text-[#0f172a] hover:bg-white/30 transition-all focus:outline-none"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit" 
                    disabled={!isValid} 
                    className={cn(
                      'py-4 rounded-2xl text-[10.5px] font-extrabold uppercase tracking-[0.18em] shadow-xl transition-all active:scale-97 cursor-pointer', 
                      !isValid 
                        ? 'bg-slate-300 text-slate-400 cursor-not-allowed' 
                        : 'bg-[#1A1A1A] text-slate-200 hover:bg-slate-900 shadow-slate-900/10'
                    )}
                  >
                    Save Stage Update
                  </button>
                </motion.div>
              </motion.div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
