import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Award, Briefcase, Tag, Target, ArrowRight, Percent, CheckCircle2 } from 'lucide-react';
import { CandidateStage, Debtor } from '../../types';
import { CANDIDATE_STAGE_META, CANDIDATE_STAGE_ORDER } from '../../constants';
import { formatINR, cn } from '../../lib/utils';

interface InteractiveInfographicsProps {
  debtors: Debtor[];
  onSelectDebtor: (debtor: Debtor) => void;
}

export const InteractiveInfographics: React.FC<InteractiveInfographicsProps> = ({
  debtors,
  onSelectDebtor,
}) => {
  const [selectedStage, setSelectedStage] = useState<CandidateStage | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 1. Pipeline Funnel Calculation
  const funnelData = useMemo(() => {
    // Total referred acts as the base (100% conversion begins here or total dataset)
    const totalReferred = debtors.length;
    
    // For each stage, calculate how many candidates have reached OR passed this stage.
    // In our linear workflow, a candidate is currently in a specific stage, 
    // but they must have passed previous stages.
    const stageIndices = CANDIDATE_STAGE_ORDER.reduce<Record<CandidateStage, number>>((acc, stage, idx) => {
      acc[stage] = idx;
      return acc;
    }, {} as Record<CandidateStage, number>);

    return CANDIDATE_STAGE_ORDER.map((stage, idx) => {
      // Candidates currently in this stage or any subsequent stage
      const reachedCount = debtors.filter(d => stageIndices[d.currentStage] >= idx).length;
      const activeHereCount = debtors.filter(d => d.currentStage === stage).length;
      
      const previousStageCount = idx === 0 
        ? totalReferred 
        : debtors.filter(d => stageIndices[d.currentStage] >= (idx - 1)).length;

      const conversionFromPrev = previousStageCount > 0 
        ? Math.round((reachedCount / previousStageCount) * 100) 
        : 0;

      const totalConversion = totalReferred > 0 
        ? Math.round((reachedCount / totalReferred) * 100) 
        : 0;

      return {
        stage,
        label: CANDIDATE_STAGE_META[stage].label,
        shortLabel: CANDIDATE_STAGE_META[stage].shortLabel,
        reachedCount,
        activeHereCount,
        conversionFromPrev,
        totalConversion,
        meta: CANDIDATE_STAGE_META[stage],
      };
    });
  }, [debtors]);

  // 2. Joining and Offer releases
  const offerStats = useMemo(() => {
    const offerReleasedDebtors = debtors.filter(d => d.currentStage === 'OFFER_RELEASED');
    const totalOffers = offerReleasedDebtors.length;
    const withJoiningDate = offerReleasedDebtors.filter(d => d.joiningDate).length;
    
    const upcomingJoinings = offerReleasedDebtors
      .filter(d => d.joiningDate)
      .map(d => ({
        id: d.id,
        name: d.name,
        joiningDate: d.joiningDate!,
        totalDebt: d.totalDebt,
        labels: d.labels,
        debtor: d
      }))
      .sort((a, b) => a.joiningDate.localeCompare(b.joiningDate));

    const offerRatio = totalOffers > 0 ? Math.round((withJoiningDate / totalOffers) * 100) : 0;

    return {
      totalOffers,
      withJoiningDate,
      offerRatio,
      upcomingJoinings,
    };
  }, [debtors]);

  // 3. Labels Distribution Scatter/Bubble metrics
  const labelCloud = useMemo(() => {
    const counts: Record<string, { count: number; totalBudget: number; debtors: Debtor[] }> = {};
    
    debtors.forEach(d => {
      d.labels.forEach(label => {
        const trimmed = label.trim();
        if (!trimmed) return;
        if (!counts[trimmed]) {
          counts[trimmed] = { count: 0, totalBudget: 0, debtors: [] };
        }
        counts[trimmed].count += 1;
        counts[trimmed].totalBudget += d.totalDebt;
        counts[trimmed].debtors.push(d);
      });
    });

    return Object.entries(counts)
      .map(([name, stat]) => ({
        name,
        count: stat.count,
        totalBudget: stat.totalBudget,
        debtors: stat.debtors,
      }))
      .sort((a, b) => b.count - a.count);
  }, [debtors]);

  // Handle click on stage funnel block
  const handleStageClick = (stage: CandidateStage) => {
    if (selectedStage === stage) {
      setSelectedStage(null);
    } else {
      setSelectedStage(stage);
      setSelectedTag(null);
    }
  };

  // Handle click on tag pill
  const handleTagClick = (tagName: string) => {
    if (selectedTag === tagName) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tagName);
      setSelectedStage(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      
      {/* SECTION 1: INTERACTIVE CONVERSION FUNNEL BAR */}
      <div className="p-6 sm:p-8 rounded-[36px] bg-white/25 backdrop-blur-[35px] border border-white/50 shadow-[0_24px_64px_rgba(15,23,42,0.06),inset_0_1px_2px_rgba(255,255,255,0.6)] flex flex-col relative overflow-hidden group">
        <div className="pointer-events-none absolute -bottom-[10%] -right-[10%] w-[45%] h-[45%] rounded-full bg-[#3D4E3D]/5 blur-[70px]" />
        
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#3D4E3D]/10 text-[#3D4E3D] font-extrabold text-[9px] uppercase tracking-widest rounded-full mb-3">
            <Target size={11} /> Pipeline Efficiency
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-[#0f172a] font-display tracking-tight">Interactive Conversion Funnel</h3>
          <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide mt-1">Click stages to filter current candidates at that stage</p>
        </div>

        {/* Funnel chart steps */}
        <div className="space-y-3.5 flex-1 select-none">
          {funnelData.map((data, index) => {
            const isSelected = selectedStage === data.stage;
            const percentageWidth = Math.max(20, data.totalConversion);
            
            return (
              <div key={data.stage} className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleStageClick(data.stage)}
                  className={cn(
                    "w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group flex items-center justify-between cursor-pointer",
                    isSelected 
                      ? "bg-[#1E231E]/95 text-[#EFE7D2] border-[#3D4E3D] shadow-lg scale-[1.01]" 
                      : "bg-white/40 border-white/55 hover:bg-white/60 text-slate-800 shadow-xs"
                  )}
                >
                  {/* Visual progress filler inside row */}
                  <div 
                    className={cn(
                      "absolute left-0 top-0 bottom-0 pointer-events-none opacity-8 transition-all duration-500",
                      isSelected ? "bg-emerald-400" : "bg-[#3D4E3D]"
                    )}
                    style={{ width: `${percentageWidth}%` }}
                  />

                  <div className="flex items-center gap-3 relative z-10 min-w-0">
                    <span className={cn(
                      "h-3 w-3 rounded-full shrink-0 shadow-xs", 
                      data.meta.accentClassName
                    )} />
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold truncate">{data.label}</p>
                      <p className={cn(
                        "text-[9px] font-bold mt-0.5",
                        isSelected ? "text-slate-300" : "text-slate-500"
                      )}>
                        {data.activeHereCount} currently active  •  Total reached: {data.reachedCount}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 relative z-10 shrink-0 font-mono">
                    <div className="text-right">
                      <p className="text-xs font-black">{data.totalConversion}%</p>
                      {index > 0 && (
                        <p className={cn(
                          "text-[8px] font-bold mt-0.5",
                          isSelected ? "text-emerald-400" : "text-emerald-700"
                        )}>
                          ↓ {data.conversionFromPrev}% pass
                        </p>
                      )}
                    </div>
                    <ArrowRight size={13} className={cn(
                      "transition-transform",
                      isSelected ? "rotate-90 text-emerald-400" : "group-hover:translate-x-1 text-slate-400"
                    )} />
                  </div>
                </button>

                {/* Sub-list of candidates currently inside this stage */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white/50 border border-slate-200/50 rounded-2xl p-3.5 space-y-2 mt-1 mx-2">
                        <p className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest px-1 mb-2">Candidates currently at {data.shortLabel}:</p>
                        {debtors.filter(d => d.currentStage === data.stage).length === 0 ? (
                          <p className="text-xs text-slate-500 font-semibold px-1 py-1 italic">No active candidates in this step of the workflow.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {debtors.filter(d => d.currentStage === data.stage).map(d => (
                              <button
                                key={d.id}
                                type="button"
                                onClick={() => onSelectDebtor(d)}
                                className="p-2 sm:p-2.5 rounded-xl bg-white/70 hover:bg-white border border-slate-200 text-left transition-all hover:shadow-xs hover:border-slate-300 flex items-center justify-between group cursor-pointer"
                              >
                                <div className="min-w-0">
                                  <p className="text-xs font-extrabold text-slate-800 truncate group-hover:text-emerald-800">{d.name}</p>
                                  <p className="text-[10px] font-mono text-slate-500 mt-0.5">{formatINR(d.totalDebt)} package</p>
                                </div>
                                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 ml-1.5 shrink-0" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: JOINING DATES & ACCEPTANCES BENTO GRID */}
      <div className="space-y-6 lg:space-y-8">
        
        {/* UPPER BENTO: JOINING RATE GAUGING AND ACCEPTANCE */}
        <div className="p-6 sm:p-8 rounded-[36px] bg-white/25 backdrop-blur-[35px] border border-white/50 shadow-[0_24px_64px_rgba(15,23,42,0.06),inset_0_1px_2px_rgba(255,255,255,0.6)] relative overflow-hidden flex flex-col justify-between min-h-[190px] group">
          <div className="pointer-events-none absolute -top-10 -right-10 w-[40%] h-[40%] bg-emerald-400/8 rounded-full blur-[50px]" />
          
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-[#059669] font-extrabold text-[9px] uppercase tracking-widest rounded-full mb-3">
                <Calendar size={11} /> Onboarding Milestones
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#0f172a] font-display tracking-tight">Joining Schedules</h3>
            </div>
            <div className="h-14 w-14 rounded-full bg-white/60 border border-white flex items-center justify-center shadow-inner shrink-0 font-mono select-none">
              <div className="text-center">
                <p className="text-base font-black text-slate-800 leading-none">{offerStats.offerRatio}%</p>
                <p className="text-[7.5px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Ratio</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              Ratio of issued offers that have release schedules set successfully:
            </p>
            
            <div className="space-y-2">
              <div className="h-2.5 w-full bg-slate-200/50 rounded-full overflow-hidden border border-white/20 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${offerStats.offerRatio}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-black text-slate-600 px-1 font-mono">
                <p>{offerStats.withJoiningDate} Scheduled</p>
                <p>{offerStats.totalOffers} Total Released Offers</p>
              </div>
            </div>
          </div>
        </div>

        {/* LOWER BENTO: DYNAMIC TAG BUBBLE DISTRIBUTIONS */}
        <div className="p-6 sm:p-8 rounded-[36px] bg-white/25 backdrop-blur-[35px] border border-white/50 shadow-[0_24px_64px_rgba(15,23,42,0.06),inset_0_1px_2px_rgba(255,255,255,0.6)] flex flex-col justify-between min-h-[220px] relative overflow-hidden">
          <div className="pointer-events-none absolute -bottom-10 -left-10 w-[35%] h-[35%] bg-amber-400/5 rounded-full blur-[50px]" />
          
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-800 font-extrabold text-[9px] uppercase tracking-widest rounded-full mb-3">
              <Tag size={11} /> Label Aggregators
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#0f172a] font-display tracking-tight">Tactile Label Analysis</h3>
            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide mt-1">Tap a tag to review related candidates & allocated budgets</p>
          </div>

          {/* Interactive Tags bubble cloud */}
          <div className="flex flex-wrap gap-2 py-2 select-none">
            {labelCloud.length === 0 ? (
              <p className="text-xs text-slate-500 font-semibold italic">No labels or tags assigned in this portfolio yet.</p>
            ) : (
              labelCloud.map(l => {
                const isSelected = selectedTag === l.name;
                return (
                  <button
                    key={l.name}
                    type="button"
                    onClick={() => handleTagClick(l.name)}
                    className={cn(
                      "px-3.5 py-2.5 rounded-2xl font-bold text-xs border transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-2xs hover:scale-102",
                      isSelected 
                        ? "bg-[#3D4E3D] text-[#EFE7D2] border-[#3D4E3D] shadow-md" 
                        : "bg-white/45 border-white/60 hover:bg-white/60 text-slate-700"
                    )}
                  >
                    <span>#{l.name}</span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-full text-[9px] font-black",
                      isSelected ? "bg-slate-800 text-slate-200" : "bg-slate-200/60 text-slate-600"
                    )}>
                      {l.count}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Expanded listing for selected tag */}
          <AnimatePresence>
            {selectedTag && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-4"
              >
                <div className="bg-white/55 border border-slate-200/55 rounded-2xl p-4 space-y-3">
                  {(() => {
                    const matchedTagObj = labelCloud.find(l => l.name === selectedTag);
                    if (!matchedTagObj) return null;
                    return (
                      <>
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                          <p className="text-xs font-black text-slate-700 uppercase tracking-widest">Matched: #{selectedTag}</p>
                          <p className="text-xs font-black text-[#3D4E3D] font-mono">Total Budget: {formatINR(matchedTagObj.totalBudget)}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-0.5">
                          {matchedTagObj.debtors.map(d => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => onSelectDebtor(d)}
                              className="p-2 sm:p-2.5 rounded-xl bg-white/70 hover:bg-white border border-slate-200 text-left transition-all hover:shadow-2xs flex items-center justify-between group cursor-pointer"
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-extrabold text-slate-800 truncate group-hover:text-emerald-800">{d.name}</p>
                                <p className="text-[9.5px] font-sans text-emerald-800 font-bold mt-0.5">
                                  {CANDIDATE_STAGE_META[d.currentStage].shortLabel}
                                </p>
                              </div>
                              <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 shrink-0" />
                            </button>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SECTION 3: UPCOMING JOINING SCHEDULE CARDS (WIDE ACCORDION) */}
      <div className="col-span-1 lg:col-span-2 p-6 sm:p-8 rounded-[36px] bg-white/25 backdrop-blur-[35px] border border-white/50 shadow-[0_24px_64px_rgba(15,23,42,0.06),inset_0_1px_2px_rgba(255,255,255,0.6)] relative overflow-hidden group">
        <div className="pointer-events-none absolute -bottom-10 -right-10 w-[30%] h-[30%] bg-emerald-400/5 rounded-full blur-[40px]" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-[#059669] font-extrabold text-[9px] uppercase tracking-widest rounded-full mb-3">
              <Calendar size={11} /> Onboarding Pipeline Calendar
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#0f172a] font-display tracking-tight">Onboarding Timeline</h3>
            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide mt-1">Confirmed Joining Dates for Released Offers</p>
          </div>
          <div className="text-slate-500 text-xs font-bold font-mono bg-white/40 border border-white/50 px-3.5 py-2 rounded-2xl shrink-0 select-none">
            {offerStats.upcomingJoinings.length} active scheduled candidates
          </div>
        </div>

        {offerStats.upcomingJoinings.length === 0 ? (
          <div className="text-center py-10 rounded-2xl bg-white/10 border border-white/30 backdrop-blur-md">
            <Calendar size={32} className="mx-auto text-slate-400 opacity-60 mb-3" />
            <p className="text-sm font-extrabold text-slate-755">No upcoming joinings set</p>
            <p className="text-xs font-semibold text-slate-550 mt-1 max-w-[340px] mx-auto leading-relaxed">
              When a candidate reaches the **Offer Released** stage, edit their file to provide an official date of joining to track scheduling in this layout.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {offerStats.upcomingJoinings.map(j => {
              const formattedDate = new Date(j.joiningDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              // calculate days remaining safely
              const daysDiff = Math.ceil(
                (new Date(j.joiningDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div 
                  key={j.id} 
                  className="p-5 rounded-2xl bg-white/40 border border-white/60 hover:bg-white/60 transition-all duration-300 shadow-3xs flex flex-col justify-between min-h-[160px] relative hover:scale-101"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onSelectDebtor(j.debtor)}
                          className="text-sm font-black text-slate-800 tracking-tight hover:text-emerald-800 text-left truncate block cursor-pointer transition-colors"
                        >
                          {j.name}
                        </button>
                        <p className="text-[10px] font-mono text-slate-500 font-bold mt-1">Package: {formatINR(j.totalDebt)}</p>
                      </div>
                      
                      <div className="h-8 w-8 rounded-xl bg-[#3D4E3D]/10 text-[#3D4E3D] flex items-center justify-center shrink-0 border border-[#3D4E3D]/15">
                        <Award size={14} />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {j.labels.map(l => (
                        <span key={l} className="px-2 py-0.5 rounded-lg bg-white/50 border border-white text-[8.5px] font-black text-slate-550">
                          #{l}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-200/50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-emerald-700" />
                      <span className="text-xs font-extrabold text-slate-750 font-sans">{formattedDate}</span>
                    </div>

                    {daysDiff > 0 ? (
                      <span className="text-[9.5px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-500/10 px-2 py-1 rounded-lg">
                        In {daysDiff} Days
                      </span>
                    ) : daysDiff === 0 ? (
                      <span className="text-[9.5px] font-black uppercase tracking-wider text-amber-800 bg-amber-500/10 px-2 py-1 rounded-lg animate-pulse">
                        Joining Today
                      </span>
                    ) : (
                      <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-1 rounded-lg">
                        Joined
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
