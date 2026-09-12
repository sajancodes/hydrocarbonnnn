import React from 'react';
import { useStore } from '../store';
import { Trophy, Award, Flame, Sparkles, Beaker, Atom, CheckCircle2, X } from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Flame,
  Trophy,
  Beaker,
  Atom,
  CheckCircle2,
  Award
};

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose }) => {
  const { profile } = useStore();

  if (!isOpen) return null;

  const safeProfile = profile || {
    xp: 0,
    level: 1,
    accuracy: 100,
    bestStreak: 0,
    achievements: [],
    topicStats: {}
  };

  const achievementsList = safeProfile.achievements || [];
  const topicStatsObj = safeProfile.topicStats || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-2xl border rounded-xl shadow-[0_0_40px_rgba(0,243,255,0.2)] overflow-hidden font-sans"
        style={{ backgroundColor: 'rgba(2, 6, 23, 0.96)', borderColor: 'rgba(6, 182, 212, 0.5)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/30 bg-cyan-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-400/40">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                QUANTUM CHEMISTRY ACHIEVEMENTS & STATS
              </h3>
              <p className="text-[11px] text-cyan-300/80 font-mono">
                TRACK YOUR MASTERED CONCEPTS & EARNED BADGES
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-cyan-400/70 hover:text-white hover:bg-cyan-500/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Top Level Summary Cards */}
          <div className="grid grid-cols-4 gap-3 font-mono">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-cyan-500/30 text-center">
              <span className="text-[10px] text-cyan-400/70 uppercase block">Total XP</span>
              <span className="text-xl font-black text-cyan-300">{safeProfile.xp || 0}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-cyan-500/30 text-center">
              <span className="text-[10px] text-cyan-400/70 uppercase block">Level</span>
              <span className="text-xl font-black text-white">Lvl {safeProfile.level || 1}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-cyan-500/30 text-center">
              <span className="text-[10px] text-cyan-400/70 uppercase block">Accuracy</span>
              <span className="text-xl font-black text-emerald-400">{safeProfile.accuracy || 100}%</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-cyan-500/30 text-center">
              <span className="text-[10px] text-cyan-400/70 uppercase block">Best Streak</span>
              <span className="text-xl font-black text-amber-400">{safeProfile.bestStreak || 0} 🔥</span>
            </div>
          </div>

          {/* Badges & Achievements Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              EARNED BADGES ({achievementsList.filter(a => a.unlockedAt).length}/{achievementsList.length})
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {achievementsList.map((ach) => {
                const IconComponent = ICON_MAP[ach.iconName] || Trophy;
                const isUnlocked = Boolean(ach.unlockedAt);

                return (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-lg border flex items-start gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-cyan-950/40 border-cyan-400/50 shadow-[0_0_15px_rgba(0,243,255,0.15)]'
                        : 'bg-slate-900/40 border-slate-800 opacity-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${isUnlocked ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold font-mono uppercase ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                          {ach.title}
                        </span>
                        {isUnlocked && (
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            UNLOCKED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-cyan-100/70 leading-relaxed font-sans">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Topic Mastery breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-widest">
              CURRICULUM TOPIC MASTERY
            </h4>

            {Object.keys(topicStatsObj).length === 0 ? (
              <p className="text-xs text-cyan-400/60 font-mono italic">
                Solve challenges to build your concept accuracy report.
              </p>
            ) : (
              <div className="space-y-2">
                {Object.values(topicStatsObj).map((stat) => (
                  <div key={stat.topicId} className="p-2.5 rounded bg-slate-900/60 border border-cyan-500/20 flex items-center justify-between font-mono text-xs">
                    <span className="text-cyan-200 uppercase">{stat.topicId.replace(/^c\d+_|^eng_|^adv_/, '').replace(/_/g, ' ')}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-cyan-400/70">{stat.correct}/{stat.attempts} Correct</span>
                      <span className={`font-bold px-2 py-0.5 rounded ${stat.accuracy >= 75 ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'}`}>
                        {stat.accuracy}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-cyan-500/20 bg-slate-950/80 flex justify-between items-center font-mono text-[10px] text-cyan-400/60">
          <span>HOLO-CHEMISTRY ADAPTIVE ENGINE</span>
          <span>CURRICULUM LEVEL: {profile.educationLevel.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
