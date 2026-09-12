import { AtomData, BondData, MoleculeData } from '../types';

export interface ChemicalGraph {
  atoms: { id: number; symbol: string; position: [number, number, number] }[];
  bonds: { from: number; to: number; order: number }[];
}

export interface ValenceReport {
  isValid: boolean;
  atomValencies: { index: number; symbol: string; currentValence: number; maxValence: number; isOctetSatisfied: boolean }[];
  errors: string[];
}

export interface FormulaComparison {
  isMatch: boolean;
  expectedFormula: string;
  actualFormula: string;
  expectedCounts: Record<string, number>;
  actualCounts: Record<string, number>;
}

// Maximum covalent valency in neutral organic hydrocarbon systems
export const ELEMENT_MAX_VALENCE: Record<string, number> = {
  C: 4,
  H: 1,
  O: 2,
  N: 3,
  S: 2,
  F: 1,
  CL: 1,
  BR: 1,
  I: 1,
  P: 3
};

/**
 * Normalizes chemical & IUPAC nomenclature strings for robust comparison
 * Handles punctuation, case, spacing, locant dash formatting e.g. "2,3-dimethyl-but-2-ene" === "2,3-dimethylbut-2-ene"
 */
export function normalizeIUPACName(rawName: string): string {
  if (!rawName) return '';
  return rawName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '') // remove spaces
    .replace(/[–—−]/g, '-') // normalize unicode dashes
    .replace(/,\s*/g, ',') // normalize commas
    .replace(/-\s*/g, '-')
    .replace(/\s*-/g, '-')
    .replace(/n-(\w+)/, '$1') // normalize n-butane to butane
    .replace(/cyclo\s+/g, 'cyclo')
    .replace(/methyl\s+/g, 'methyl')
    .replace(/ethyl\s+/g, 'ethyl');
}

/**
 * Checks if two IUPAC names are chemically equivalent or close variations
 */
export function compareIUPACNames(input: string, expected: string, aliases: string[] = []): boolean {
  const normInput = normalizeIUPACName(input);
  const normExpected = normalizeIUPACName(expected);
  
  if (normInput === normExpected) return true;
  
  // Check synonyms/aliases
  for (const alias of aliases) {
    if (normInput === normalizeIUPACName(alias)) return true;
  }
  
  // Handle common positional inversions e.g. but-2-ene vs 2-butene
  const altExpected = normExpected
    .replace(/(\w+)-(\d+(?:,\d+)*)-(\w+)/g, '$2-$1$3')
    .replace(/(\d+(?:,\d+)*)-(\w+)(\w{3,})/g, '$2-$1-$3');
  const altInput = normInput
    .replace(/(\w+)-(\d+(?:,\d+)*)-(\w+)/g, '$2-$1$3')
    .replace(/(\d+(?:,\d+)*)-(\w+)(\w{3,})/g, '$2-$1-$3');

  return altInput === altExpected || normInput === altExpected || altInput === normExpected;
}

/**
 * Calculates chemical Hill formula from atom list (e.g. C5H12, C6H6, C2H5OH)
 */
export function calculateHillFormula(atoms: { symbol: string }[]): string {
  const counts: Record<string, number> = {};
  for (const a of atoms) {
    const sym = a.symbol.toUpperCase();
    counts[sym] = (counts[sym] || 0) + 1;
  }

  const formatElement = (sym: string) => {
    const count = counts[sym];
    if (!count) return '';
    return count > 1 ? `${sym}${toSubscript(count)}` : sym;
  };

  let formula = '';
  // Hill system: C first, then H, then alphabetical
  if (counts['C']) {
    formula += formatElement('C');
    delete counts['C'];
    if (counts['H']) {
      formula += formatElement('H');
      delete counts['H'];
    }
  }

  const remaining = Object.keys(counts).sort();
  for (const sym of remaining) {
    formula += formatElement(sym);
  }

  return formula || 'CH₄';
}

function toSubscript(num: number): string {
  const map: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };
  return num.toString().split('').map(d => map[d] || d).join('');
}

export function parseFormulaCounts(formulaStr: string): Record<string, number> {
  const clean = formulaStr
    .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => ({
      '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
      '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
    }[m] || m));

  const counts: Record<string, number> = {};
  const regex = /([A-Z][a-z]*)(\d*)/g;
  let match;
  while ((match = regex.exec(clean)) !== null) {
    if (match[1]) {
      const sym = match[1].toUpperCase();
      const count = match[2] ? parseInt(match[2], 10) : 1;
      counts[sym] = (counts[sym] || 0) + count;
    }
  }
  return counts;
}

/**
 * Validates atom valency across the entire molecular graph
 */
export function validateValency(atoms: { symbol: string }[], bonds: { s: number; e: number; order?: number }[]): ValenceReport {
  const atomValencies = atoms.map((a, i) => ({
    index: i,
    symbol: a.symbol.toUpperCase(),
    currentValence: 0,
    maxValence: ELEMENT_MAX_VALENCE[a.symbol.toUpperCase()] || 4,
    isOctetSatisfied: false
  }));

  const errors: string[] = [];

  for (const b of bonds) {
    const s = b.s;
    const e = b.e;
    const order = b.order || 1;

    if (s < 0 || s >= atoms.length || e < 0 || e >= atoms.length) {
      errors.push(`Bond links invalid atom indices: ${s} -> ${e}`);
      continue;
    }

    if (s === e) {
      errors.push(`Self-bonding detected on atom ${s}`);
      continue;
    }

    atomValencies[s].currentValence += order;
    atomValencies[e].currentValence += order;
  }

  let isValid = true;
  for (const av of atomValencies) {
    if (av.currentValence > av.maxValence) {
      isValid = false;
      errors.push(`${av.symbol} (atom #${av.index + 1}) exceeds maximum valency: ${av.currentValence}/${av.maxValence}`);
    } else if (av.currentValence === av.maxValence) {
      av.isOctetSatisfied = true;
    } else {
      // Under-valency
      av.isOctetSatisfied = false;
    }
  }

  if (errors.length > 0) isValid = false;

  return {
    isValid,
    atomValencies,
    errors
  };
}

/**
 * Computes canonical adjacency matrix / degree signature to check structural graph equivalence (Isomerism & connectivity)
 */
export function areGraphsIsomorphic(
  atoms1: { symbol: string }[],
  bonds1: { s: number; e: number; order?: number }[],
  atoms2: { symbol: string }[],
  bonds2: { s: number; e: number; order?: number }[]
): boolean {
  if (atoms1.length !== atoms2.length) return false;
  if (bonds1.length !== bonds2.length) return false;

  // Compare atom type frequencies
  const f1: Record<string, number> = {};
  for (const a of atoms1) f1[a.symbol.toUpperCase()] = (f1[a.symbol.toUpperCase()] || 0) + 1;
  const f2: Record<string, number> = {};
  for (const a of atoms2) f2[a.symbol.toUpperCase()] = (f2[a.symbol.toUpperCase()] || 0) + 1;

  for (const k of Object.keys(f1)) {
    if (f1[k] !== f2[k]) return false;
  }

  // Generate degree signatures for non-H backbone
  const getDegreeSeq = (atoms: { symbol: string }[], bonds: { s: number; e: number; order?: number }[]) => {
    return atoms.map((a, i) => {
      let bondSum = 0;
      let neighbors: string[] = [];
      for (const b of bonds) {
        if (b.s === i) {
          bondSum += b.order || 1;
          neighbors.push(`${atoms[b.e].symbol.toUpperCase()}:${b.order || 1}`);
        } else if (b.e === i) {
          bondSum += b.order || 1;
          neighbors.push(`${atoms[b.s].symbol.toUpperCase()}:${b.order || 1}`);
        }
      }
      neighbors.sort();
      return `${a.symbol.toUpperCase()}_v${bondSum}_[${neighbors.join(',')}]`;
    }).sort().join('|');
  };

  const seq1 = getDegreeSeq(atoms1, bonds1);
  const seq2 = getDegreeSeq(atoms2, bonds2);

  return seq1 === seq2;
}

/**
 * Validates a user-constructed 3D molecular structure against a target challenge structure.
 * Supports both full explicit-hydrogen structures and carbon backbone skeletons (with auto-hydrogens).
 */
export function validateConstructedStructure(
  builtAtoms: { symbol: string }[],
  builtBonds: { s: number; e: number; order?: number }[],
  targetAtoms: { symbol: string }[],
  targetBonds: { s: number; e: number; order?: number }[]
): { isMatch: boolean; feedback: string } {
  if (!builtAtoms || builtAtoms.length === 0) {
    return { isMatch: false, feedback: 'Workspace is empty. Add carbon atoms to synthesize the target structure!' };
  }

  // 1. Check built valency
  const valCheck = validateValency(builtAtoms, builtBonds);
  if (!valCheck.isValid) {
    return {
      isMatch: false,
      feedback: `Valence error: ${valCheck.errors[0] || 'An atom violates maximum valency rules.'}`
    };
  }

  // 2. Direct full graph match if user explicitly added all atoms (e.g. including hydrogens)
  if (areGraphsIsomorphic(builtAtoms, builtBonds, targetAtoms, targetBonds)) {
    return { isMatch: true, feedback: 'Accurate molecular synthesis! Fully matched all atoms and bond orders.' };
  }

  // 3. Carbon/heteroatom backbone graph match (essential for organic chemistry)
  const extractNonHydrogenGraph = (
    atoms: { symbol: string }[],
    bonds: { s: number; e: number; order?: number }[]
  ) => {
    const nonHIndices: number[] = [];
    atoms.forEach((a, idx) => {
      if (a.symbol.toUpperCase() !== 'H') {
        nonHIndices.push(idx);
      }
    });

    const nonHIndexMap = new Map<number, number>();
    nonHIndices.forEach((origIdx, newIdx) => {
      nonHIndexMap.set(origIdx, newIdx);
    });

    const subAtoms = nonHIndices.map(idx => atoms[idx]);
    const subBonds: { s: number; e: number; order?: number }[] = [];

    for (const b of bonds) {
      if (nonHIndexMap.has(b.s) && nonHIndexMap.has(b.e)) {
        subBonds.push({
          s: nonHIndexMap.get(b.s)!,
          e: nonHIndexMap.get(b.e)!,
          order: b.order || 1
        });
      }
    }

    return { atoms: subAtoms, bonds: subBonds };
  };

  const builtSkel = extractNonHydrogenGraph(builtAtoms, builtBonds);
  const targetSkel = extractNonHydrogenGraph(targetAtoms, targetBonds);

  if (builtSkel.atoms.length !== targetSkel.atoms.length) {
    const targetC = targetSkel.atoms.filter(a => a.symbol.toUpperCase() === 'C').length;
    const builtC = builtSkel.atoms.filter(a => a.symbol.toUpperCase() === 'C').length;
    return {
      isMatch: false,
      feedback: `Carbon count mismatch: Built molecule has ${builtC} carbon(s), but target requires ${targetC} carbon(s).`
    };
  }

  const skelMatch = areGraphsIsomorphic(
    builtSkel.atoms,
    builtSkel.bonds,
    targetSkel.atoms,
    targetSkel.bonds
  );

  if (skelMatch) {
    return { isMatch: true, feedback: 'Accurate carbon backbone and bond order connectivity!' };
  }

  return {
    isMatch: false,
    feedback: 'Connectivity mismatch: Bond orders or carbon branch locations do not match the target molecule.'
  };
}

/**
 * Automatically populates hydrogens on a carbon skeleton satisfying valence = 4
 */
export function autoPopulateHydrogens(
  carbonAtoms: { p: [number, number, number]; symbol: string }[],
  existingBonds: { s: number; e: number; order?: number }[]
): { atoms: AtomData[]; bonds: BondData[] } {
  const atoms: AtomData[] = carbonAtoms.map((c, i) => ({
    p: [...c.p] as [number, number, number],
    t: c.symbol.toUpperCase() as any,
    symbol: c.symbol.toUpperCase(),
    name: `${c.symbol.toUpperCase()} ${i + 1}`
  }));

  const bonds: BondData[] = existingBonds.map(b => ({
    s: b.s,
    e: b.e,
    order: b.order || 1
  }));

  const numAtoms = carbonAtoms.length;

  for (let i = 0; i < numAtoms; i++) {
    const parentAtom = carbonAtoms[i];
    const maxValence = ELEMENT_MAX_VALENCE[parentAtom.symbol.toUpperCase()] || 4;

    // Calculate current bond order sum
    let currentValence = 0;
    const neighborVectors: [number, number, number][] = [];

    for (const b of existingBonds) {
      if (b.s === i) {
        currentValence += b.order || 1;
        const target = carbonAtoms[b.e];
        neighborVectors.push([target.p[0] - parentAtom.p[0], target.p[1] - parentAtom.p[1], target.p[2] - parentAtom.p[2]]);
      } else if (b.e === i) {
        currentValence += b.order || 1;
        const target = carbonAtoms[b.s];
        neighborVectors.push([target.p[0] - parentAtom.p[0], target.p[1] - parentAtom.p[1], target.p[2] - parentAtom.p[2]]);
      }
    }

    const hydrogensNeeded = Math.max(0, maxValence - currentValence);

    if (hydrogensNeeded > 0) {
      const hDist = 1.05; // C-H bond length in Angstroms
      const hOffsets = generateHydrogenPositions(neighborVectors, hydrogensNeeded, hDist);

      for (const off of hOffsets) {
        const hIdx = atoms.length;
        atoms.push({
          p: [
            Math.round((parentAtom.p[0] + off[0]) * 100) / 100,
            Math.round((parentAtom.p[1] + off[1]) * 100) / 100,
            Math.round((parentAtom.p[2] + off[2]) * 100) / 100
          ],
          t: 'H',
          symbol: 'H',
          name: 'Hydrogen'
        });
        bonds.push({ s: i, e: hIdx, order: 1 });
      }
    }
  }

  return { atoms, bonds };
}

function generateHydrogenPositions(
  neighborVectors: [number, number, number][],
  count: number,
  dist: number
): [number, number, number][] {
  const result: [number, number, number][] = [];

  if (neighborVectors.length === 0) {
    // Isolated carbon -> regular tetrahedron
    const baseTetra: [number, number, number][] = [
      [1, 1, 1],
      [1, -1, -1],
      [-1, 1, -1],
      [-1, -1, 1]
    ];
    for (let k = 0; k < Math.min(count, 4); k++) {
      const v = baseTetra[k];
      const norm = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
      result.push([(v[0] / norm) * dist, (v[1] / norm) * dist, (v[2] / norm) * dist]);
    }
    return result;
  }

  // Calculate average opposite direction from existing neighbors
  let oppX = 0, oppY = 0, oppZ = 0;
  for (const nv of neighborVectors) {
    const len = Math.sqrt(nv[0] ** 2 + nv[1] ** 2 + nv[2] ** 2) || 1;
    oppX -= nv[0] / len;
    oppY -= nv[1] / len;
    oppZ -= nv[2] / len;
  }

  const oppLen = Math.sqrt(oppX ** 2 + oppY ** 2 + oppZ ** 2);
  let mainDir: [number, number, number] = oppLen > 0.01 
    ? [oppX / oppLen, oppY / oppLen, oppZ / oppLen]
    : [0, 1, 0];

  if (count === 1) {
    result.push([mainDir[0] * dist, mainDir[1] * dist, mainDir[2] * dist]);
  } else if (count === 2) {
    // Spread sideways perpendicular to mainDir
    const perp1: [number, number, number] = Math.abs(mainDir[0]) > 0.8 ? [0, 0, 1] : [1, 0, 0];
    result.push([
      (mainDir[0] * 0.7 + perp1[0] * 0.7) * dist,
      (mainDir[1] * 0.7 + perp1[1] * 0.7) * dist,
      (mainDir[2] * 0.7 + perp1[2] * 0.7) * dist
    ]);
    result.push([
      (mainDir[0] * 0.7 - perp1[0] * 0.7) * dist,
      (mainDir[1] * 0.7 - perp1[1] * 0.7) * dist,
      (mainDir[2] * 0.7 - perp1[2] * 0.7) * dist
    ]);
  } else if (count === 3) {
    // 3 hydrogens e.g. methyl cap
    const spreadAngle = (Math.PI * 2) / 3;
    const perpX = Math.abs(mainDir[1]) < 0.9 ? 0 : 1;
    const perpY = Math.abs(mainDir[1]) < 0.9 ? 1 : 0;
    const perpZ = 0;

    for (let k = 0; k < 3; k++) {
      const angle = k * spreadAngle;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      result.push([
        (mainDir[0] * 0.5 + cos * 0.8) * dist,
        (mainDir[1] * 0.5 + sin * 0.8) * dist,
        (mainDir[2] * 0.5 + perpZ) * dist
      ]);
    }
  }

  return result;
}
