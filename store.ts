import { create } from 'zustand';
import { 
  HoloState, 
  MoleculeData, 
  MoleculeType, 
  EducationLevel, 
  Challenge, 
  PlayerProfile, 
  Achievement, 
  BuilderState 
} from './types';
import { MOLECULE_DATA } from './constants';
import { getInitialActivePool } from './chemistry/curriculum';
import { 
  compareIUPACNames, 
  areGraphsIsomorphic, 
  calculateHillFormula, 
  validateValency,
  autoPopulateHydrogens,
  validateConstructedStructure
} from './chemistry/validator';

const INITIAL_CATALOG = ['Methane', 'Ethane', 'Benzene', 'Ethanol', 'Acetone', 'Water'];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_molecule', title: 'First Synthesis', description: 'Solve or build your very first molecular structure.', unlockedAt: null, iconName: 'Sparkles' },
  { id: 'streak_5', title: 'Hot Molecule Streak', description: 'Achieve a 5-question consecutive streak without mistakes.', unlockedAt: null, iconName: 'Flame' },
  { id: 'streak_10', title: 'Quantum Master', description: 'Reach a legendary 10-question flawless streak.', unlockedAt: null, iconName: 'Trophy' },
  { id: 'iupac_expert', title: 'IUPAC Naming Master', description: 'Identify 5 molecular structures accurately.', unlockedAt: null, iconName: 'Beaker' },
  { id: 'carbon_architect', title: 'Carbon Architect', description: 'Construct 5 target hydrocarbons in the 3D builder.', unlockedAt: null, iconName: 'Atom' },
  { id: 'perfect_valence', title: 'Octet Rule Enforcer', description: 'Submit 3 structures with 100% satisfied valencies.', unlockedAt: null, iconName: 'CheckCircle2' }
];

const INITIAL_PROFILE: PlayerProfile = {
  educationLevel: 'class_11',
  score: 0,
  streak: 0,
  bestStreak: 0,
  xp: 0,
  level: 1,
  totalAttempts: 0,
  totalCorrect: 0,
  accuracy: 100,
  topicStats: {},
  achievements: DEFAULT_ACHIEVEMENTS
};

const loadSavedProfile = (): PlayerProfile => {
  try {
    const saved = localStorage.getItem('holohydro_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { 
        ...INITIAL_PROFILE, 
        ...parsed,
        achievements: DEFAULT_ACHIEVEMENTS.map(def => {
          const found = (parsed.achievements || []).find((a: any) => a.id === def.id);
          return found ? { ...def, unlockedAt: found.unlockedAt } : def;
        })
      };
    }
  } catch (e) {
    // fallback
  }
  return INITIAL_PROFILE;
};

const saveProfile = (prof: PlayerProfile) => {
  try {
    localStorage.setItem('holohydro_profile', JSON.stringify(prof));
  } catch (e) {
    // ignore
  }
};

const INITIAL_BUILDER: BuilderState = {
  selectedElement: 'C',
  selectedBondOrder: 1,
  hydrogenMode: 'auto',
  activeTool: 'place_atom',
  atoms: [
    { p: [0, 0, 0], t: 'C', symbol: 'C', name: 'C1' }
  ],
  bonds: [],
  selectedAtomIndex: null,
  hoveredAtomIndex: null
};

export const useStore = create<HoloState>((set, get) => ({
  // Mode
  mode: 'game',
  setMode: (mode) => set({ mode }),

  // Hand Tracker / Camera System
  handActive: false,
  bondScale: 1.5,
  rotation: [0, 0],
  setHandData: (active, scale, rot) => {
    const safeScale = Number.isFinite(scale) && scale > 0 ? Math.max(0.5, Math.min(4, scale)) : 1.5;
    const safeRot: [number, number] = [
      rot && Number.isFinite(rot[0]) ? Math.max(-10, Math.min(10, rot[0])) : 0,
      rot && Number.isFinite(rot[1]) ? Math.max(-10, Math.min(10, rot[1])) : 0,
    ];
    set({ 
      handActive: active, 
      bondScale: safeScale, 
      rotation: safeRot 
    });
  },

  // Free Explore Mode Molecules
  currentMolecule: 'Methane',
  customMolecules: {},
  catalogList: INITIAL_CATALOG,
  setMolecule: (m: MoleculeType) => set({ currentMolecule: m }),
  addCustomMolecule: (data: MoleculeData) => {
    const keyName = data.name;
    set((state) => {
      const updatedCustom = { ...state.customMolecules, [keyName]: data };
      const updatedCatalog = state.catalogList.includes(keyName)
        ? state.catalogList
        : [keyName, ...state.catalogList];
      return {
        customMolecules: updatedCustom,
        catalogList: updatedCatalog,
        currentMolecule: keyName
      };
    });
  },

  // Player Profile & Analytics
  profile: loadSavedProfile(),

  // Game Engine & Active 10 Pool
  educationLevel: 'class_11',
  activeQuestions: getInitialActivePool('class_11'),
  reserveQuestions: [],
  currentChallengeIndex: 0,
  activeChallenge: getInitialActivePool('class_11')[0] || null,
  isReplenishing: false,

  setEducationLevel: (lvl: EducationLevel) => {
    const freshPool = getInitialActivePool(lvl);
    set((state) => ({
      educationLevel: lvl,
      activeQuestions: freshPool,
      reserveQuestions: [],
      currentChallengeIndex: 0,
      profile: {
        ...state.profile,
        educationLevel: lvl
      }
    }));
    get().setActiveChallenge(freshPool[0] || null, 0);
    get().replenishPool();
  },

  setActiveChallenge: (challenge, index) => {
    if (challenge) {
      // If challenge is a construction challenge, load starter carbon or template into builder
      if (challenge.type === 'name_to_structure' || challenge.type === 'formula_to_structure') {
        set({
          activeChallenge: challenge,
          currentChallengeIndex: index !== undefined ? index : get().currentChallengeIndex,
          mode: 'builder',
          builder: {
            ...INITIAL_BUILDER,
            atoms: [{ p: [0, 0, 0], t: 'C', symbol: 'C', name: 'C1' }],
            bonds: []
          }
        });
        return;
      }
      set({
        activeChallenge: challenge,
        currentChallengeIndex: index !== undefined ? index : get().currentChallengeIndex,
        mode: 'game'
      });
    } else {
      set({ activeChallenge: null });
    }
  },

  nextChallenge: () => {
    const state = get();
    const pool = state.activeQuestions;
    if (!pool || pool.length === 0) return;
    const currentIdx = state.currentChallengeIndex;
    const nextIdx = (currentIdx + 1) % pool.length;
    const nextQ = pool[nextIdx] || pool[0];
    if (nextQ) {
      state.setActiveChallenge(nextQ, nextIdx);
    }
  },

  prevChallenge: () => {
    const state = get();
    const pool = state.activeQuestions;
    if (!pool || pool.length === 0) return;
    const currentIdx = state.currentChallengeIndex;
    const prevIdx = (currentIdx - 1 + pool.length) % pool.length;
    const prevQ = pool[prevIdx] || pool[0];
    if (prevQ) {
      state.setActiveChallenge(prevQ, prevIdx);
    }
  },

  completeCurrentChallenge: (userAnswer, isCorrectInput, hintsUsed, completionTimeSec) => {
    const state = get();
    const challenge = state.activeChallenge;
    if (!challenge) return { isCorrect: false, feedback: 'No active challenge', points: 0 };

    let isCorrect = false;
    let feedback = '';

    if (typeof userAnswer === 'object' && userAnswer !== null) {
      // 3D Hydrocarbon Structure synthesis validation
      const constructedMol = userAnswer as MoleculeData;
      if (!constructedMol.atoms || constructedMol.atoms.length === 0) {
        return { isCorrect: false, feedback: 'Workspace is empty. Add carbon atoms to build your hydrocarbon structure!', points: 0 };
      }

      const matchRes = validateConstructedStructure(
        constructedMol.atoms,
        constructedMol.bonds,
        challenge.structure.atoms,
        challenge.structure.bonds
      );

      isCorrect = matchRes.isMatch;
      if (isCorrect) {
        feedback = `Superb 3D synthesis! You accurately constructed ${challenge.targetMoleculeName} in 3D! ${challenge.explanation || ''}`;
      } else {
        feedback = matchRes.feedback;
      }
    } else {
      // IUPAC nomenclature text answer validation
      const answerStr = (typeof userAnswer === 'string' ? userAnswer : '').trim();
      if (!answerStr) {
        return { isCorrect: false, feedback: 'Please enter your IUPAC nomenclature answer before submitting.', points: 0 };
      }
      isCorrect = compareIUPACNames(answerStr, challenge.expectedAnswer, challenge.acceptedAnswers);
      if (isCorrect) {
        feedback = `Excellent! ${challenge.targetMoleculeName} is correct! ${challenge.explanation || ''}`;
      } else {
        feedback = `Incorrect IUPAC name. Check the longest carbon chain, bond positions, and substituent numbering, then try again! (You entered: "${answerStr}")`;
      }
    }

    // Scoring & XP math
    let points = 0;
    const oldProf = state.profile;
    const newAttempts = oldProf.totalAttempts + 1;
    const newCorrect = oldProf.totalCorrect + (isCorrect ? 1 : 0);
    const newAccuracy = Math.round((newCorrect / newAttempts) * 100);

    let newStreak = isCorrect ? oldProf.streak + 1 : 0;
    let newBestStreak = Math.max(oldProf.bestStreak, newStreak);

    if (isCorrect) {
      const basePoints = challenge.difficulty * 100;
      const speedBonus = Math.max(0, Math.round((60 - completionTimeSec) * 2));
      const hintPenalty = hintsUsed * 25;
      const streakMultiplier = 1 + Math.min(newStreak * 0.1, 1.0);
      points = Math.max(50, Math.round((basePoints + speedBonus - hintPenalty) * streakMultiplier));
    } else {
      points = 10; // small participation XP
    }

    const newXp = oldProf.xp + points;
    const newScore = oldProf.score + (isCorrect ? points : 0);
    const newLevel = Math.floor(newXp / 500) + 1;

    // Topic stats
    const topicKey = challenge.topic || 'general';
    const oldTopicStat = oldProf.topicStats[topicKey] || { topicId: topicKey, attempts: 0, correct: 0, accuracy: 100, lastPracticed: 0 };
    const topicAttempts = oldTopicStat.attempts + 1;
    const topicCorrect = oldTopicStat.correct + (isCorrect ? 1 : 0);
    const topicAccuracy = Math.round((topicCorrect / topicAttempts) * 100);

    const updatedTopicStats = {
      ...oldProf.topicStats,
      [topicKey]: {
        topicId: topicKey,
        attempts: topicAttempts,
        correct: topicCorrect,
        accuracy: topicAccuracy,
        lastPracticed: Date.now()
      }
    };

    // Achievements unlock check
    const now = Date.now();
    const updatedAchievements = oldProf.achievements.map((ach) => {
      if (ach.unlockedAt) return ach;
      if (ach.id === 'first_molecule' && newCorrect >= 1) return { ...ach, unlockedAt: now };
      if (ach.id === 'streak_5' && newStreak >= 5) return { ...ach, unlockedAt: now };
      if (ach.id === 'streak_10' && newStreak >= 10) return { ...ach, unlockedAt: now };
      if (ach.id === 'iupac_expert' && challenge.type === 'structure_to_name' && newCorrect >= 5) return { ...ach, unlockedAt: now };
      if (ach.id === 'carbon_architect' && (challenge.type === 'name_to_structure' || challenge.type === 'formula_to_structure') && newCorrect >= 5) return { ...ach, unlockedAt: now };
      return ach;
    });

    // Remove solved challenge from the 10-question active pool & replenish!
    const currentActive = [...state.activeQuestions];
    const finishedIdx = state.currentChallengeIndex;
    let replacement: Challenge | null = null;

    if (state.reserveQuestions.length > 0) {
      replacement = state.reserveQuestions[0];
      const newReserve = state.reserveQuestions.slice(1);
      currentActive[finishedIdx] = replacement;
      set({ reserveQuestions: newReserve });
    } else {
      // Pull fresh from baseline curriculum
      const initialPool = getInitialActivePool(state.educationLevel);
      const fallbackNew = initialPool[Math.floor(Math.random() * initialPool.length)];
      currentActive[finishedIdx] = {
        ...fallbackNew,
        id: `fresh_${Date.now()}`
      };
    }

    const updatedProfile: PlayerProfile = {
      ...oldProf,
      score: newScore,
      streak: newStreak,
      bestStreak: newBestStreak,
      xp: newXp,
      level: newLevel,
      totalAttempts: newAttempts,
      totalCorrect: newCorrect,
      accuracy: newAccuracy,
      topicStats: updatedTopicStats,
      achievements: updatedAchievements
    };

    saveProfile(updatedProfile);

    set({
      activeQuestions: currentActive,
      activeChallenge: state.activeChallenge,
      profile: updatedProfile
    });

    // Proactively generate replacement in background
    get().replenishPool();

    return { isCorrect, feedback, points };
  },

  replenishPool: async () => {
    const state = get();
    if (state.isReplenishing) return;

    set({ isReplenishing: true });

    try {
      // Find weak topics
      const weakTopics: string[] = [];
      const stats = state.profile?.topicStats || {};
      for (const [topId, stat] of Object.entries(stats)) {
        if (stat.accuracy < 65) weakTopics.push(topId);
      }

      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          educationLevel: state.educationLevel,
          count: 3,
          weakTopics
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.questions && json.questions.length > 0) {
          set((s) => ({
            reserveQuestions: [...s.reserveQuestions, ...json.questions].slice(-8),
            isReplenishing: false
          }));
          return;
        }
      }
    } catch (e) {
      console.warn('Background question replenishment error:', e);
    } finally {
      set({ isReplenishing: false });
    }
  },

  resetProgress: () => {
    saveProfile(INITIAL_PROFILE);
    set({
      profile: INITIAL_PROFILE,
      activeQuestions: getInitialActivePool('class_11'),
      reserveQuestions: [],
      activeChallenge: null
    });
  },

  // Interactive 3D Builder State
  builder: INITIAL_BUILDER,

  setBuilderElement: (el) => set((s) => ({ builder: { ...s.builder, selectedElement: el } })),
  setBuilderBondOrder: (order) => set((s) => ({ builder: { ...s.builder, selectedBondOrder: order } })),
  setBuilderHydrogenMode: (mode) => set((s) => ({ builder: { ...s.builder, hydrogenMode: mode } })),
  setBuilderTool: (tool) => set((s) => ({ builder: { ...s.builder, activeTool: tool } })),

  addBuilderAtom: (pos) => {
    set((s) => {
      const sym = s.builder.selectedElement;
      const count = s.builder.atoms.filter(a => a.symbol === sym).length + 1;
      const newAtom = {
        p: [Math.round(pos[0] * 100) / 100, Math.round(pos[1] * 100) / 100, Math.round(pos[2] * 100) / 100] as [number, number, number],
        t: sym,
        symbol: sym,
        name: `${sym}${count}`
      };
      return {
        builder: {
          ...s.builder,
          atoms: [...s.builder.atoms, newAtom]
        }
      };
    });
  },

  deleteBuilderAtom: (index) => {
    set((s) => {
      const remainingAtoms = s.builder.atoms.filter((_, i) => i !== index);
      const remainingBonds = s.builder.bonds
        .filter(b => b.s !== index && b.e !== index)
        .map(b => ({
          ...b,
          s: b.s > index ? b.s - 1 : b.s,
          e: b.e > index ? b.e - 1 : b.e
        }));
      return {
        builder: {
          ...s.builder,
          atoms: remainingAtoms,
          bonds: remainingBonds,
          selectedAtomIndex: null
        }
      };
    });
  },

  toggleBuilderBond: (atomIndex1, atomIndex2) => {
    if (atomIndex1 === atomIndex2) return;
    set((s) => {
      const order = s.builder.selectedBondOrder;
      const existingIdx = s.builder.bonds.findIndex(
        b => (b.s === atomIndex1 && b.e === atomIndex2) || (b.s === atomIndex2 && b.e === atomIndex1)
      );

      let newBonds = [...s.builder.bonds];
      if (existingIdx >= 0) {
        if (newBonds[existingIdx].order === order) {
          // Remove bond
          newBonds.splice(existingIdx, 1);
        } else {
          // Update order
          newBonds[existingIdx] = { ...newBonds[existingIdx], order };
        }
      } else {
        // Add new bond
        newBonds.push({ s: Math.min(atomIndex1, atomIndex2), e: Math.max(atomIndex1, atomIndex2), order });
      }

      return {
        builder: {
          ...s.builder,
          bonds: newBonds,
          selectedAtomIndex: null
        }
      };
    });
  },

  clearBuilder: () => {
    set({
      builder: {
        ...INITIAL_BUILDER,
        atoms: [{ p: [0, 0, 0], t: 'C', symbol: 'C', name: 'C1' }],
        bonds: []
      }
    });
  },

  loadMoleculeIntoBuilder: (mol) => {
    set({
      builder: {
        ...INITIAL_BUILDER,
        atoms: mol.atoms,
        bonds: mol.bonds
      }
    });
  },

  selectBuilderAtom: (index) => set((s) => ({ builder: { ...s.builder, selectedAtomIndex: index } })),
  setHoveredBuilderAtom: (index) => set((s) => ({ builder: { ...s.builder, hoveredAtomIndex: index } }))
}));
