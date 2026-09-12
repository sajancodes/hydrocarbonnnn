import { MoleculeData, MoleculeType } from './types';

export const MOLECULE_DATA: Record<MoleculeType, MoleculeData> = {
  Methane: {
    name: 'Methane',
    formula: 'CH₄',
    category: 'Alkane Hydrocarbon',
    description: 'Simplest hydrocarbon with tetrahedral molecular geometry (109.5° bond angle).',
    functionalGroups: ['Alkane (-CH₃)'],
    atoms: [
      { p: [0, 0, 0], t: 'C', symbol: 'C', name: 'Carbon' },
      { p: [0.635, 0.635, 0.635], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [0.635, -0.635, -0.635], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [-0.635, 0.635, -0.635], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [-0.635, -0.635, 0.635], t: 'H', symbol: 'H', name: 'Hydrogen' }
    ],
    bonds: [
      { s: 0, e: 1, order: 1 },
      { s: 0, e: 2, order: 1 },
      { s: 0, e: 3, order: 1 },
      { s: 0, e: 4, order: 1 }
    ]
  },
  Ethane: {
    name: 'Ethane',
    formula: 'C₂H₆',
    category: 'Alkane Hydrocarbon',
    description: 'Saturated hydrocarbon featuring a C-C single bond and staggered tetrahedral geometry.',
    functionalGroups: ['Alkane'],
    atoms: [
      { p: [-0.77, 0, 0], t: 'C', symbol: 'C', name: 'Carbon 1' },
      { p: [0.77, 0, 0], t: 'C', symbol: 'C', name: 'Carbon 2' },
      { p: [-1.15, 1.02, 0], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [-1.15, -0.51, 0.88], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [-1.15, -0.51, -0.88], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [1.15, -1.02, 0], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [1.15, 0.51, 0.88], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [1.15, 0.51, -0.88], t: 'H', symbol: 'H', name: 'Hydrogen' }
    ],
    bonds: [
      { s: 0, e: 1, order: 1 },
      { s: 0, e: 2, order: 1 },
      { s: 0, e: 3, order: 1 },
      { s: 0, e: 4, order: 1 },
      { s: 1, e: 5, order: 1 },
      { s: 1, e: 6, order: 1 },
      { s: 1, e: 7, order: 1 }
    ]
  },
  Benzene: {
    name: 'Benzene',
    formula: 'C₆H₆',
    category: 'Aromatic Hydrocarbon',
    description: 'Planar hexagonal aromatic ring with delocalized pi-electrons and alternating double bonds.',
    functionalGroups: ['Aromatic Ring (Phenyl)'],
    atoms: [
      { p: [1.40, 0, 0], t: 'C', symbol: 'C', name: 'Carbon 1' },
      { p: [0.70, 1.212, 0], t: 'C', symbol: 'C', name: 'Carbon 2' },
      { p: [-0.70, 1.212, 0], t: 'C', symbol: 'C', name: 'Carbon 3' },
      { p: [-1.40, 0, 0], t: 'C', symbol: 'C', name: 'Carbon 4' },
      { p: [-0.70, -1.212, 0], t: 'C', symbol: 'C', name: 'Carbon 5' },
      { p: [0.70, -1.212, 0], t: 'C', symbol: 'C', name: 'Carbon 6' },
      { p: [2.48, 0, 0], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [1.24, 2.148, 0], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [-1.24, 2.148, 0], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [-2.48, 0, 0], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [-1.24, -2.148, 0], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [1.24, -2.148, 0], t: 'H', symbol: 'H', name: 'Hydrogen' }
    ],
    bonds: [
      { s: 0, e: 1, order: 2 },
      { s: 1, e: 2, order: 1 },
      { s: 2, e: 3, order: 2 },
      { s: 3, e: 4, order: 1 },
      { s: 4, e: 5, order: 2 },
      { s: 5, e: 0, order: 1 },
      { s: 0, e: 6, order: 1 },
      { s: 1, e: 7, order: 1 },
      { s: 2, e: 8, order: 1 },
      { s: 3, e: 9, order: 1 },
      { s: 4, e: 10, order: 1 },
      { s: 5, e: 11, order: 1 }
    ]
  },
  Ethanol: {
    name: 'Ethanol',
    formula: 'C₂H₅OH',
    category: 'Alcohol Hydrocarbon Deriv.',
    description: 'Primary alcohol comprising an ethyl group linked to a hydroxyl (-OH) functional group.',
    functionalGroups: ['Hydroxyl (-OH)', 'Ethyl (-C₂H₅)'],
    atoms: [
      { p: [-1.2, 0, 0], t: 'C', symbol: 'C', name: 'Carbon 1 (Methyl)' },
      { p: [0.3, 0.3, 0], t: 'C', symbol: 'C', name: 'Carbon 2 (Methylene)' },
      { p: [1.3, -0.6, 0], t: 'O', symbol: 'O', name: 'Oxygen (Hydroxyl)' },
      { p: [2.1, -0.3, 0], t: 'H', symbol: 'H', name: 'Hydrogen (Hydroxyl)' },
      { p: [-1.6, 1.0, 0], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [-1.6, -0.5, 0.87], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [-1.6, -0.5, -0.87], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [0.3, 0.9, 0.87], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [0.3, 0.9, -0.87], t: 'H', symbol: 'H', name: 'Hydrogen' }
    ],
    bonds: [
      { s: 0, e: 1, order: 1 },
      { s: 1, e: 2, order: 1 },
      { s: 2, e: 3, order: 1 },
      { s: 0, e: 4, order: 1 },
      { s: 0, e: 5, order: 1 },
      { s: 0, e: 6, order: 1 },
      { s: 1, e: 7, order: 1 },
      { s: 1, e: 8, order: 1 }
    ]
  },
  Acetone: {
    name: 'Acetone',
    formula: 'CH₃COCH₃',
    category: 'Ketone Hydrocarbon Deriv.',
    description: 'Simplest ketone containing a central carbonyl (C=O) group double bonded to Oxygen.',
    functionalGroups: ['Carbonyl (C=O)', 'Ketone'],
    atoms: [
      { p: [0, -0.3, 0], t: 'C', symbol: 'C', name: 'Carbonyl Carbon' },
      { p: [0, 1.0, 0], t: 'O', symbol: 'O', name: 'Carbonyl Oxygen' },
      { p: [-1.3, -1.0, 0], t: 'C', symbol: 'C', name: 'Methyl Carbon 1' },
      { p: [1.3, -1.0, 0], t: 'C', symbol: 'C', name: 'Methyl Carbon 2' },
      { p: [-1.3, -1.6, 0.87], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [-1.3, -1.6, -0.87], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [-2.1, -0.4, 0], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [1.3, -1.6, 0.87], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [1.3, -1.6, -0.87], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [2.1, -0.4, 0], t: 'H', symbol: 'H', name: 'Hydrogen' }
    ],
    bonds: [
      { s: 0, e: 1, order: 2 }, // Carbonyl C=O double bond
      { s: 0, e: 2, order: 1 },
      { s: 0, e: 3, order: 1 },
      { s: 2, e: 4, order: 1 },
      { s: 2, e: 5, order: 1 },
      { s: 2, e: 6, order: 1 },
      { s: 3, e: 7, order: 1 },
      { s: 3, e: 8, order: 1 },
      { s: 3, e: 9, order: 1 }
    ]
  },
  Water: {
    name: 'Water',
    formula: 'H₂O',
    category: 'Inorganic Hydride',
    description: 'Bent molecular structure with polar covalent O-H bonds at a 104.5° angle.',
    functionalGroups: ['Hydride'],
    atoms: [
      { p: [0, 0.2, 0], t: 'O', symbol: 'O', name: 'Oxygen' },
      { p: [0.76, -0.42, 0], t: 'H', symbol: 'H', name: 'Hydrogen' },
      { p: [-0.76, -0.42, 0], t: 'H', symbol: 'H', name: 'Hydrogen' }
    ],
    bonds: [
      { s: 0, e: 1, order: 1 },
      { s: 0, e: 2, order: 1 }
    ]
  }
};
