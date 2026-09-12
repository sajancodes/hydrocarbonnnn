export type MoleculeType = string;

export interface AtomData {
  p: [number, number, number];
  t: string; // 'C' | 'H' | 'O' | 'N' | 'S' | 'F' | 'Cl' | 'Br'
  symbol: string;
  name?: string;
  id?: string;
}

export interface BondData {
  s: number; // start atom index
  e: number; // end atom index
  order?: 1 | 2 | 3; // single, double, triple
  id?: string;
}

export interface MoleculeData {
  name: string;
  formula: string;
  category: string;
  description: string;
  functionalGroups?: string[];
  atoms: AtomData[];
  bonds: BondData[];
}

export type EducationLevel = 'class_11' | 'class_12' | 'engineering' | 'advanced';

export type ChallengeType = 
  | 'structure_to_name'
  | 'name_to_structure'
  | 'formula_to_structure'
  | 'isomer_challenge'
  | 'identify_bond_type';

export interface Challenge {
  id: string;
  type: ChallengeType;
  educationLevel: EducationLevel;
  difficulty: number; // 1 to 5
  topic: string;
  prompt: string;
  targetMoleculeName: string;
  molecularFormula: string;
  expectedAnswer: string;
  acceptedAnswers: string[];
  hints: string[];
  explanation: string;
  structure: MoleculeData;
}

export interface TopicStat {
  topicId: string;
  attempts: number;
  correct: number;
  accuracy: number; // 0 to 100
  lastPracticed: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: number | null;
  iconName: string;
}

export interface PlayerProfile {
  educationLevel: EducationLevel;
  score: number;
  streak: number;
  bestStreak: number;
  xp: number;
  level: number;
  totalAttempts: number;
  totalCorrect: number;
  accuracy: number;
  topicStats: Record<string, TopicStat>;
  achievements: Achievement[];
}

export type AppMode = 'game' | 'builder' | 'explore';

export interface BuilderState {
  selectedElement: 'C' | 'H' | 'O' | 'N';
  selectedBondOrder: 1 | 2 | 3;
  hydrogenMode: 'auto' | 'manual';
  activeTool: 'place_atom' | 'bond' | 'delete' | 'move';
  atoms: AtomData[];
  bonds: BondData[];
  selectedAtomIndex: number | null;
  hoveredAtomIndex: number | null;
}

export interface HoloState {
  // Mode
  mode: AppMode;
  setMode: (mode: AppMode) => void;

  // Hand Tracker / Camera System
  handActive: boolean;
  bondScale: number;
  rotation: [number, number];
  setHandData: (active: boolean, scale: number, rot: [number, number]) => void;

  // Free Explore Mode Molecules
  currentMolecule: MoleculeType;
  customMolecules: Record<string, MoleculeData>;
  catalogList: string[];
  setMolecule: (m: MoleculeType) => void;
  addCustomMolecule: (data: MoleculeData) => void;

  // Game Engine & Active 10 Pool
  educationLevel: EducationLevel;
  setEducationLevel: (lvl: EducationLevel) => void;
  activeQuestions: Challenge[];
  reserveQuestions: Challenge[];
  currentChallengeIndex: number;
  activeChallenge: Challenge | null;
  setActiveChallenge: (challenge: Challenge | null, index?: number) => void;
  nextChallenge: () => void;
  prevChallenge: () => void;
  completeCurrentChallenge: (userAnswer: string | MoleculeData, isCorrect: boolean, hintsUsed: number, completionTimeSec: number) => { isCorrect: boolean; feedback: string; points: number };
  replenishPool: () => Promise<void>;
  isReplenishing: boolean;

  // Player Profile & Analytics
  profile: PlayerProfile;
  resetProgress: () => void;

  // Interactive 3D Builder State
  builder: BuilderState;
  setBuilderElement: (el: 'C' | 'H' | 'O' | 'N') => void;
  setBuilderBondOrder: (order: 1 | 2 | 3) => void;
  setBuilderHydrogenMode: (mode: 'auto' | 'manual') => void;
  setBuilderTool: (tool: 'place_atom' | 'bond' | 'delete' | 'move') => void;
  addBuilderAtom: (pos: [number, number, number]) => void;
  deleteBuilderAtom: (index: number) => void;
  toggleBuilderBond: (atomIndex1: number, atomIndex2: number) => void;
  clearBuilder: () => void;
  loadMoleculeIntoBuilder: (mol: MoleculeData) => void;
  selectBuilderAtom: (index: number | null) => void;
  setHoveredBuilderAtom: (index: number | null) => void;
}
