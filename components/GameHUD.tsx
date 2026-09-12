import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { 
  EducationLevel, 
  Challenge 
} from '../types';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Plus, 
  Trash2, 
  Link, 
  Eye, 
  RotateCcw, 
  Zap, 
  GraduationCap, 
  ChevronRight,
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';
import { validateValency, calculateHillFormula, autoPopulateHydrogens } from '../chemistry/validator';
import { AchievementsModal } from './AchievementsModal';

const EDUCATION_LEVEL_LABELS: Record<EducationLevel, { label: string; desc: string; difficultyTag: string; stars: string; color: string; badge: string }> = {
  class_11: { 
    label: 'CLASS 11 (FOUNDATION)', 
    desc: 'Alkanes, Alkenes, Alkynes, Small Rings',
    difficultyTag: 'Diff 1-2 • Basic Foundations',
    stars: '★ - ★★',
    color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
    badge: 'BEGINNER'
  },
  class_12: { 
    label: 'CLASS 12 (INTERMEDIATE)', 
    desc: 'Dienes, Stereochemistry, Arenes, Isomers',
    difficultyTag: 'Diff 2-3 • Senior High & Board',
    stars: '★★ - ★★★',
    color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
    badge: 'INTERMEDIATE'
  },
  engineering: { 
    label: 'ENGINEERING (ENTRANCE)', 
    desc: 'Complex IUPAC, Enynes, Bicyclic & Spiro Systems',
    difficultyTag: 'Diff 3-4 • JEE & Competitive',
    stars: '★★★ - ★★★★',
    color: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
    badge: 'COMPETITIVE'
  },
  advanced: { 
    label: 'ADVANCED / OLYMPIAD', 
    desc: 'Cumulenes, Platonic Cages, Non-Benzenoid Arenes',
    difficultyTag: 'Diff 4-5 • Master & Research',
    stars: '★★★★ - ★★★★★',
    color: 'text-rose-400 border-rose-500/40 bg-rose-950/40',
    badge: 'MASTER'
  }
};

export const GameHUD: React.FC = () => {
  const {
    mode,
    setMode,
    educationLevel,
    setEducationLevel,
    activeQuestions,
    activeChallenge,
    currentChallengeIndex,
    setActiveChallenge,
    nextChallenge,
    prevChallenge,
    completeCurrentChallenge,
    profile,
    builder,
    setBuilderElement,
    setBuilderBondOrder,
    setBuilderHydrogenMode,
    setBuilderTool,
    clearBuilder
  } = useStore();

  const [inputAnswer, setInputAnswer] = useState('');
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [feedbackResult, setFeedbackResult] = useState<{ isCorrect: boolean; feedback: string; points: number } | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLevelMenu, setShowLevelMenu] = useState(false);

  // Auto-select first question if mode is game but activeChallenge is null
  useEffect(() => {
    if (mode === 'game' && !activeChallenge && activeQuestions.length > 0) {
      setActiveChallenge(activeQuestions[0], 0);
    }
  }, [mode, activeChallenge, activeQuestions, setActiveChallenge]);

  // Reset answer when challenge changes
  useEffect(() => {
    if (activeChallenge) {
      setInputAnswer('');
      setHintsRevealed(0);
      setStartTime(Date.now());
      setFeedbackResult(null);
    }
  }, [activeChallenge?.id]);

  // Compute live formula and valence for builder
  const builderFormula = React.useMemo(() => {
    if (builder.hydrogenMode === 'auto') {
      // Hydrogens added automatically
      return calculateHillFormula(builder.atoms);
    }
    return calculateHillFormula(builder.atoms);
  }, [builder.atoms, builder.hydrogenMode]);

  const valenceReport = React.useMemo(() => {
    return validateValency(builder.atoms, builder.bonds);
  }, [builder.atoms, builder.bonds]);

  const handleSubmitStructureToName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputAnswer.trim() || !activeChallenge) return;

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const res = completeCurrentChallenge(inputAnswer.trim(), true, hintsRevealed, timeSpent);
    setFeedbackResult(res);
  };

  const handleSubmit3DBuilder = () => {
    if (!activeChallenge) return;
    if (!builder.atoms || builder.atoms.length === 0) {
      setFeedbackResult({
        isCorrect: false,
        feedback: 'Workspace is empty. Click "+ ADD CARBON" to begin synthesizing your structure!',
        points: 0
      });
      return;
    }

    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    let finalAtoms = builder.atoms;
    let finalBonds = builder.bonds;

    if (builder.hydrogenMode === 'auto') {
      const autoMol = autoPopulateHydrogens(
        builder.atoms.map(a => ({ p: a.p, symbol: a.symbol })),
        builder.bonds
      );
      finalAtoms = autoMol.atoms as any;
      finalBonds = autoMol.bonds;
    }

    const constructedData = {
      name: 'User Custom Structure',
      formula: calculateHillFormula(finalAtoms),
      category: 'Built Hydrocarbon',
      description: 'Player constructed 3D hydrocarbon structure',
      atoms: finalAtoms,
      bonds: finalBonds
    };

    const res = completeCurrentChallenge(constructedData, true, hintsRevealed, timeSpent);
    setFeedbackResult(res);
  };

  const safeProfile = profile || {
    educationLevel: 'class_11' as EducationLevel,
    score: 0,
    streak: 0,
    bestStreak: 0,
    xp: 0,
    level: 1,
    totalAttempts: 0,
    totalCorrect: 0,
    accuracy: 100,
    topicStats: {},
    achievements: []
  };

  const currentLevelProgress = ((safeProfile.xp || 0) % 500) / 500 * 100;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-4 md:p-6 select-none font-mono">
      {/* Top Header Navigation & Player Status Bar */}
      <header className="pointer-events-auto flex flex-wrap items-center justify-between gap-3 w-full max-w-7xl mx-auto">
        {/* Left: Brand & Mode Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button
              onClick={() => setShowLevelMenu(!showLevelMenu)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/40 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,243,255,0.15)]"
            >
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              <div className="text-left">
                <span className="text-[9px] text-cyan-400/70 block leading-tight font-sans">CURRICULUM LEVEL</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {EDUCATION_LEVEL_LABELS[educationLevel].label.split(' ')[0]} {EDUCATION_LEVEL_LABELS[educationLevel].label.split(' ')[1]}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-cyan-400/60" />
            </button>

            {/* Level Selector Dropdown */}
            {showLevelMenu && (
              <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl p-2.5 z-50 backdrop-blur-xl">
                <div className="px-2 py-1 text-[10px] text-cyan-400/70 border-b border-cyan-500/20 mb-1.5 font-bold">
                  SELECT CURRICULUM DIFFICULTY:
                </div>
                {(Object.keys(EDUCATION_LEVEL_LABELS) as EducationLevel[]).map((lvl) => {
                  const info = EDUCATION_LEVEL_LABELS[lvl];
                  const isSelected = educationLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => {
                        setEducationLevel(lvl);
                        setShowLevelMenu(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer mb-1.5 border ${
                        isSelected
                          ? 'bg-cyan-500/20 text-white border-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                          : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold tracking-wide">{info.label}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${info.color}`}>
                          {info.stars}
                        </span>
                      </div>
                      <div className="text-[10px] text-cyan-300/80 font-mono mt-0.5">
                        {info.difficultyTag}
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                        {info.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-slate-950/80 p-1 border border-cyan-500/30">
            <button
              onClick={() => {
                setMode('game');
                if (!activeChallenge && activeQuestions.length > 0) {
                  setActiveChallenge(activeQuestions[0], 0);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'game'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,243,255,0.4)]'
                  : 'text-cyan-400/80 hover:text-white'
              }`}
            >
              CHALLENGES
            </button>

            <button
              onClick={() => {
                setMode('builder');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'builder'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,243,255,0.4)]'
                  : 'text-cyan-400/80 hover:text-white'
              }`}
            >
              3D BUILDER
            </button>

            <button
              onClick={() => setMode('explore')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'explore'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,243,255,0.4)]'
                  : 'text-cyan-400/80 hover:text-white'
              }`}
            >
              FREE LAB
            </button>
          </div>
        </div>

        {/* Right: Gamification Stats & XP */}
        <div className="flex items-center gap-3 font-mono">
          {/* Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold">{safeProfile.streak || 0} STREAK</span>
          </div>

          {/* XP & Level */}
          <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-cyan-500/40">
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-[10px] text-cyan-400/70">LEVEL {safeProfile.level || 1}</span>
                <span className="text-xs font-bold text-cyan-300">{safeProfile.xp || 0} XP</span>
              </div>
              <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1 border border-cyan-500/20">
                <div 
                  className="h-full bg-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(0,243,255,0.8)]"
                  style={{ width: `${currentLevelProgress}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setShowAchievements(true)}
              className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 border border-cyan-400/40 transition-all cursor-pointer"
              title="View Badges and Achievements"
            >
              <Trophy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Middle Interactive Zone */}
      <div className="pointer-events-none flex-1 flex items-center justify-end my-3 w-full max-w-7xl mx-auto">
        {/* Center / Right Challenge Workspace */}
        {mode === 'game' && activeChallenge && (
          <div className="pointer-events-auto w-full max-w-lg ml-auto p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 backdrop-blur-xl shadow-[0_0_30px_rgba(0,243,255,0.15)] space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-cyan-500/20 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    {activeChallenge.type === 'structure_to_name' ? '🔍 STRUCTURE → NAME' : '🧪 NAME → 3D SYNTHESIS'}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${
                    activeChallenge.difficulty >= 4
                      ? 'text-rose-400 bg-rose-950/60 border-rose-500/40'
                      : activeChallenge.difficulty === 3
                      ? 'text-amber-400 bg-amber-950/60 border-amber-500/40'
                      : 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40'
                  }`}>
                    DIFFICULTY: {'★'.repeat(activeChallenge.difficulty)} (L{activeChallenge.difficulty})
                  </span>
                </div>
                <div className="text-[11px] text-cyan-400/80 font-mono">
                  QUESTION {(currentChallengeIndex || 0) + 1} OF {activeQuestions.length || 10}
                </div>
                <h2 className="text-base font-bold text-white mt-1">
                  {activeChallenge.prompt}
                </h2>
              </div>

              {/* Quick Prev / Next Navigation Arrows */}
              <div className="flex items-center gap-1 shrink-0 pt-0.5">
                <button
                  type="button"
                  onClick={() => prevChallenge()}
                  className="p-1.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950 hover:text-white cursor-pointer transition-all"
                  title="Previous Question"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => nextChallenge()}
                  className="p-1.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950 hover:text-white cursor-pointer transition-all"
                  title="Next Question"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Validation Feedback Banner (shown after submission) */}
            {feedbackResult && (
              <div className={`p-3.5 rounded-xl border font-sans text-xs ${
                feedbackResult.isCorrect
                  ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-400 text-rose-200'
              }`}>
                <div className="flex items-center gap-2 font-bold font-mono text-sm mb-1">
                  {feedbackResult.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>CORRECT (+{feedbackResult.points} XP)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span>INCORRECT</span>
                    </>
                  )}
                </div>
                <p className="leading-relaxed">{feedbackResult.feedback}</p>
              </div>
            )}

            {/* If Correct: Show Primary NEXT QUESTION Button */}
            {feedbackResult?.isCorrect ? (
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={() => nextChallenge()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>PROCEED TO NEXT QUESTION</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Structure to Name input form */
              activeChallenge.type === 'structure_to_name' && (
                <form onSubmit={handleSubmitStructureToName} className="space-y-3">
                  <div>
                    <label className="text-[11px] text-cyan-300 block mb-1">
                      ENTER IUPAC NOMENCLATURE:
                    </label>
                    <input
                      type="text"
                      value={inputAnswer}
                      onChange={(e) => setInputAnswer(e.target.value)}
                      placeholder="e.g. 2,3-dimethylbut-2-ene"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
                      autoFocus
                    />
                  </div>

                  {/* Hints Box */}
                  {activeChallenge.hints && activeChallenge.hints.length > 0 && (
                    <div className="space-y-1.5 text-xs">
                      {hintsRevealed > 0 ? (
                        <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-200">
                          <span className="font-bold text-amber-300">💡 HINT: </span>
                          {activeChallenge.hints.slice(0, hintsRevealed).join(' ')}
                        </div>
                      ) : null}

                      {hintsRevealed < activeChallenge.hints.length && (
                        <button
                          type="button"
                          onClick={() => setHintsRevealed(h => h + 1)}
                          className="text-[11px] text-cyan-400 hover:text-cyan-200 underline cursor-pointer"
                        >
                          Need a hint? (-25 XP penalty)
                        </button>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)] cursor-pointer"
                  >
                    VALIDATE IUPAC ANSWER
                  </button>

                  {/* If incorrect, give option to skip */}
                  {feedbackResult && !feedbackResult.isCorrect && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">Stuck on this formula?</span>
                      <button
                        type="button"
                        onClick={() => nextChallenge()}
                        className="text-[11px] text-cyan-400 hover:text-cyan-200 underline cursor-pointer flex items-center gap-1"
                      >
                        <span>Skip to Next Question</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </form>
              )
            )}
          </div>
        )}

        {/* Fallback if mode is game but activeChallenge is not set */}
        {mode === 'game' && !activeChallenge && (
          <div className="pointer-events-auto w-full max-w-lg ml-auto p-6 rounded-2xl bg-slate-950/90 border border-cyan-500/40 backdrop-blur-xl shadow-[0_0_30px_rgba(0,243,255,0.15)] text-center space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">Next Question Ready</h2>
              <p className="text-xs text-cyan-300 mt-1">Click below to continue your chemistry practice.</p>
            </div>
            <button
              onClick={() => nextChallenge()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,243,255,0.4)]"
            >
              LOAD NEXT QUESTION ➔
            </button>
          </div>
        )}

        {/* 3D Builder Workspace Toolbar (in 'builder' mode or construction challenges) */}
        {mode === 'builder' && (
          <div className="pointer-events-auto w-full max-w-md ml-auto p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/40 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <div>
                <span className="text-[10px] text-cyan-400/80 font-sans uppercase">3D CARBON SYNTHESIS</span>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{activeChallenge?.targetMoleculeName || 'Free 3D Builder'}</span>
                </h3>
              </div>

              <button
                onClick={clearBuilder}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 border border-rose-500/30 transition-all cursor-pointer"
                title="Clear Workspace"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Element Picker */}
            <div className="space-y-1">
              <span className="text-[10px] text-cyan-400/70">SELECT ELEMENT:</span>
              <div className="grid grid-cols-4 gap-1.5">
                {(['C', 'H', 'O', 'N'] as const).map((el) => (
                  <button
                    key={el}
                    onClick={() => setBuilderElement(el)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      builder.selectedElement === el
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-black'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-500/50'
                    }`}
                  >
                    {el}
                  </button>
                ))}
              </div>
            </div>

            {/* Bond Order Picker */}
            <div className="space-y-1">
              <span className="text-[10px] text-cyan-400/70">BOND ORDER:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {([1, 2, 3] as const).map((order) => (
                  <button
                    key={order}
                    onClick={() => setBuilderBondOrder(order)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      builder.selectedBondOrder === order
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-500/50'
                    }`}
                  >
                    {order === 1 ? 'SINGLE (—)' : order === 2 ? 'DOUBLE (=)' : 'TRIPLE (≡)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Tools */}
            <div className="space-y-1">
              <span className="text-[10px] text-cyan-400/70">ACTIVE TOOL:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setBuilderTool('place_atom')}
                  className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border cursor-pointer ${
                    builder.activeTool === 'place_atom'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                      : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" /> ADD
                </button>
                <button
                  onClick={() => setBuilderTool('bond')}
                  className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border cursor-pointer ${
                    builder.activeTool === 'bond'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                      : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  <Link className="w-3.5 h-3.5" /> BOND
                </button>
                <button
                  onClick={() => setBuilderTool('delete')}
                  className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border cursor-pointer ${
                    builder.activeTool === 'delete'
                      ? 'bg-rose-500 text-white border-rose-300'
                      : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" /> DELETE
                </button>
              </div>
            </div>

            {/* Auto-Hydrogens Toggle & Valence Status */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-cyan-500/30 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className={`w-4 h-4 ${valenceReport.isValid ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span className="text-[10px]">
                  {valenceReport.isValid ? 'VALENCE SATISFIED' : 'OCTET INCOMPLETE'}
                </span>
              </div>

              <button
                onClick={() => setBuilderHydrogenMode(builder.hydrogenMode === 'auto' ? 'manual' : 'auto')}
                className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all border cursor-pointer ${
                  builder.hydrogenMode === 'auto'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-800 border-slate-600 text-slate-400'
                }`}
              >
                AUTO-H: {builder.hydrogenMode.toUpperCase()}
              </button>
            </div>

            {/* Submit structure if in challenge */}
            {activeChallenge && (
              <button
                onClick={handleSubmit3DBuilder}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)] cursor-pointer mt-2"
              >
                VALIDATE & SUBMIT 3D STRUCTURE
              </button>
            )}

            {/* Feedback for builder */}
            {feedbackResult && (
              <div className={`p-3 rounded-xl border font-sans text-xs ${
                feedbackResult.isCorrect
                  ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-400 text-rose-200'
              }`}>
                <p className="font-bold mb-0.5">{feedbackResult.isCorrect ? '✅ PERFECT SYNTHESIS!' : '❌ VALIDATION ISSUE'}</p>
                <p className="leading-relaxed">{feedbackResult.feedback}</p>
                {feedbackResult.isCorrect && (
                  <button
                    type="button"
                    onClick={() => nextChallenge()}
                    className="w-full mt-2.5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-slate-950 font-black text-xs uppercase cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>CONTINUE TO NEXT QUESTION</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Floating Status & Hand Control Indicator */}
      <footer className="pointer-events-auto flex items-center justify-between w-full max-w-7xl mx-auto px-4 py-2 rounded-xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md text-[11px] text-cyan-400/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold text-white">GESTURE CAMERA ACTIVE</span>
          </div>
          <span className="hidden sm:inline text-cyan-500/40">|</span>
          <span className="hidden sm:inline text-slate-300">Pinch to Zoom • Move Hand to Rotate 3D Hologram</span>
        </div>

        <div className="font-mono text-[10px] text-cyan-300/80">
          <span>AI ADAPTIVE CHEMISTRY V2.5</span>
        </div>
      </footer>

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
      />
    </div>
  );
};
