import { EducationLevel, Challenge, MoleculeData } from '../types';

export interface CurriculumTopic {
  id: string;
  name: string;
  description: string;
  educationLevel: EducationLevel;
  minDifficulty: number;
  maxDifficulty: number;
  concepts: string[];
}

export const CURRICULUM_TOPICS: Record<EducationLevel, CurriculumTopic[]> = {
  class_11: [
    {
      id: 'c11_alkanes',
      name: 'Alkanes & Straight Chains',
      description: 'Saturated hydrocarbons (CnH2n+2), tetrahedral geometry and IUPAC naming.',
      educationLevel: 'class_11',
      minDifficulty: 1,
      maxDifficulty: 2,
      concepts: ['Saturated bonds', 'Tetrahedral angle 109.5°', 'Meth-, Eth-, Prop-, But- prefixes']
    },
    {
      id: 'c11_branched_alkanes',
      name: 'Branched Chain Alkanes',
      description: 'Methyl substituents, longest carbon chain rule, lowest locant rule.',
      educationLevel: 'class_11',
      minDifficulty: 1,
      maxDifficulty: 2,
      concepts: ['Longest parent chain', 'Locant numbering', 'Substituent prefixes (di-, tri-)']
    },
    {
      id: 'c11_alkenes',
      name: 'Alkenes & Double Bonds',
      description: 'Unsaturated hydrocarbons (CnH2n), sp2 hybridization, trigonal planar geometry.',
      educationLevel: 'class_11',
      minDifficulty: 2,
      maxDifficulty: 2,
      concepts: ['C=C double bond (1.34 Å)', 'Planar 120° angles', 'Locant position of double bond']
    },
    {
      id: 'c11_alkynes',
      name: 'Alkynes & Triple Bonds',
      description: 'CnH2n-2 hydrocarbons with linear 180° geometry and sp hybridization.',
      educationLevel: 'class_11',
      minDifficulty: 2,
      maxDifficulty: 2,
      concepts: ['C≡C triple bond (1.20 Å)', 'Linear 180° geometry', 'Terminal vs internal alkynes']
    },
    {
      id: 'c11_cycloalkanes',
      name: 'Cyclic Hydrocarbons',
      description: 'Cyclopropane, cyclobutane, cyclohexane ring geometry and ring strain.',
      educationLevel: 'class_11',
      minDifficulty: 2,
      maxDifficulty: 2,
      concepts: ['Cyclo- prefix', 'Ring closure', 'CnH2n formula for rings']
    }
  ],
  class_12: [
    {
      id: 'c12_polyenes',
      name: 'Dienes & Polyenes',
      description: 'Conjugated vs isolated double bonds, 1,3-butadiene, multiple unsaturations.',
      educationLevel: 'class_12',
      minDifficulty: 2,
      maxDifficulty: 3,
      concepts: ['Conjugated systems', 'Diene nomenclature', 'Numbered position precedence']
    },
    {
      id: 'c12_structural_isomers',
      name: 'Chain & Positional Isomerism',
      description: 'Constitutional isomers of pentane with differing branching and quaternary centers.',
      educationLevel: 'class_12',
      minDifficulty: 2,
      maxDifficulty: 3,
      concepts: ['Constitutional isomerism', 'Quaternary carbon', 'Isopentane vs neopentane']
    },
    {
      id: 'c12_geometric_isomers',
      name: 'Cis-Trans & Geometric Isomerism',
      description: 'Restricted rotation around C=C double bonds, (E)/(Z) and cis/trans configurations.',
      educationLevel: 'class_12',
      minDifficulty: 3,
      maxDifficulty: 3,
      concepts: ['Restricted rotation', 'Cis (same side) vs Trans (opposite side)', 'Planarity']
    },
    {
      id: 'c12_aromatic_arenes',
      name: 'Arenes & Aromatic Hydrocarbons',
      description: 'Benzene, toluene, xylenes, ortho/meta/para substituent positions and resonance.',
      educationLevel: 'class_12',
      minDifficulty: 3,
      maxDifficulty: 3,
      concepts: ['Aromatic pi-cloud', 'Ortho, meta, para naming', 'Hexagonal planar geometry']
    }
  ],
  engineering: [
    {
      id: 'eng_complex_iupac',
      name: 'Complex Polysubstituted Nomenclature',
      description: 'Multiple branching points, alkyl radicals (isopropyl, tert-butyl), tetrasubstituted alkenes.',
      educationLevel: 'engineering',
      minDifficulty: 3,
      maxDifficulty: 4,
      concepts: ['Complex substituents', 'Alphabetical priority rule', 'Lowest locant set at first point of difference']
    },
    {
      id: 'eng_enynes',
      name: 'Enynes & Conjugated Hydrocarbons',
      description: 'Molecules containing both double and triple bonds, IUPAC priority rules (-enyne).',
      educationLevel: 'engineering',
      minDifficulty: 4,
      maxDifficulty: 4,
      concepts: ['Ene vs yne priority', 'Numbered suffix precedence', 'Conjugated pi-orbitals']
    },
    {
      id: 'eng_bicyclic',
      name: 'Bicyclic & Bridged Hydrocarbons',
      description: 'Bicyclo[x.y.z]alkanes, bridgehead carbons, and spiro hydrocarbons.',
      educationLevel: 'engineering',
      minDifficulty: 4,
      maxDifficulty: 4,
      concepts: ['Bicyclo naming convention', 'Bridgehead carbons', 'Spiro quaternary carbon']
    }
  ],
  advanced: [
    {
      id: 'adv_allenes_cumulenes',
      name: 'Allenes, Cumulenes & Spiranes',
      description: 'Adjacent double bonds (C=C=C), perpendicular pi planes, axial chirality.',
      educationLevel: 'advanced',
      minDifficulty: 4,
      maxDifficulty: 5,
      concepts: ['Cumulated double bonds', 'Orthogonal p-orbitals', 'Spirane ring junctions']
    },
    {
      id: 'adv_non_benzenoid',
      name: 'Polycyclic & Non-Benzenoid Arenes',
      description: 'Naphthalene, Azulene, Anthracene, Phenanthrene, and antiaromaticity.',
      educationLevel: 'advanced',
      minDifficulty: 5,
      maxDifficulty: 5,
      concepts: ['Hückel rule (4n+2)', 'Ring fusion', 'Non-benzenoid dipole moment']
    },
    {
      id: 'adv_strained_cages',
      name: 'Highly Strained Platonic & Cage Hydrocarbons',
      description: 'Cubane, Prismane, and Barrelene cage structures with extreme bond angle deformation.',
      educationLevel: 'advanced',
      minDifficulty: 5,
      maxDifficulty: 5,
      concepts: ['Cage hydrocarbons', '90° angle strain in cubane', 'Homoconjugation in barrelene']
    }
  ]
};

// Curated pool of 100% verified baseline challenges (10 distinct challenges per education level)
export const BASELINE_CHALLENGES: Challenge[] = [
  // ==========================================
  // LEVEL 1: CLASS 11 FOUNDATIONS (DIFFICULTY 1 - 2)
  // ==========================================
  {
    id: 'ch_c11_01',
    type: 'structure_to_name',
    educationLevel: 'class_11',
    difficulty: 1,
    topic: 'c11_alkanes',
    prompt: 'Identify the IUPAC name of this saturated 3-carbon alkane structure.',
    targetMoleculeName: 'Propane',
    molecularFormula: 'C₃H₈',
    expectedAnswer: 'propane',
    acceptedAnswers: ['propane', 'n-propane'],
    hints: [
      'It contains a 3-carbon continuous chain with all single bonds.',
      'Prefix for 3 carbons is "prop-" followed by the saturated suffix "-ane".'
    ],
    explanation: 'Propane (C3H8) is a straight-chain alkane consisting of 3 carbon atoms with tetrahedral sp3 geometry.',
    structure: {
      name: 'Propane',
      formula: 'C₃H₈',
      category: 'Alkane Hydrocarbon',
      description: 'Three-carbon alkane gas with saturated C-C single bonds.',
      functionalGroups: ['Alkane'],
      atoms: [
        { p: [-1.27, 0.2, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [0, -0.4, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [1.27, 0.2, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [-1.6, 1.2, 0], t: 'H', symbol: 'H', name: 'H' },
        { p: [-1.6, -0.3, 0.88], t: 'H', symbol: 'H', name: 'H' },
        { p: [-1.6, -0.3, -0.88], t: 'H', symbol: 'H', name: 'H' },
        { p: [0, -1.4, 0], t: 'H', symbol: 'H', name: 'H' },
        { p: [0, -0.4, 1.0], t: 'H', symbol: 'H', name: 'H' },
        { p: [1.6, 1.2, 0], t: 'H', symbol: 'H', name: 'H' },
        { p: [1.6, -0.3, 0.88], t: 'H', symbol: 'H', name: 'H' },
        { p: [1.6, -0.3, -0.88], t: 'H', symbol: 'H', name: 'H' }
      ],
      bonds: [
        { s: 0, e: 1, order: 1 },
        { s: 1, e: 2, order: 1 },
        { s: 0, e: 3, order: 1 },
        { s: 0, e: 4, order: 1 },
        { s: 0, e: 5, order: 1 },
        { s: 1, e: 6, order: 1 },
        { s: 1, e: 7, order: 1 },
        { s: 2, e: 8, order: 1 },
        { s: 2, e: 9, order: 1 },
        { s: 2, e: 10, order: 1 }
      ]
    }
  },
  {
    id: 'ch_c11_02',
    type: 'structure_to_name',
    educationLevel: 'class_11',
    difficulty: 1,
    topic: 'c11_alkanes',
    prompt: 'Name this unbranched 4-carbon straight-chain alkane.',
    targetMoleculeName: 'Butane',
    molecularFormula: 'C₄H₁₀',
    expectedAnswer: 'butane',
    acceptedAnswers: ['butane', 'n-butane'],
    hints: [
      'It contains four linear carbon atoms connected by single bonds.',
      'Prefix for 4 carbons is "but-" with suffix "-ane".'
    ],
    explanation: 'Butane (C4H10) is an unbranched four-carbon alkane, often used as lighter fluid and fuel.',
    structure: {
      name: 'Butane',
      formula: 'C₄H₁₀',
      category: 'Straight Chain Alkane',
      description: 'Four-carbon straight chain saturated alkane.',
      functionalGroups: ['Alkane'],
      atoms: [
        { p: [-1.9, 0.35, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [-0.65, -0.35, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [0.65, 0.35, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [1.9, -0.35, 0], t: 'C', symbol: 'C', name: 'C4' }
      ],
      bonds: [
        { s: 0, e: 1, order: 1 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 1 }
      ]
    }
  },
  {
    id: 'ch_c11_03',
    type: 'name_to_structure',
    educationLevel: 'class_11',
    difficulty: 2,
    topic: 'c11_branched_alkanes',
    prompt: 'Construct the 3D molecular structure for 2-Methylpropane (Isobutane).',
    targetMoleculeName: '2-Methylpropane',
    molecularFormula: 'C₄H₁₀',
    expectedAnswer: '2-methylpropane',
    acceptedAnswers: ['2-methylpropane', 'isobutane', 'methylpropane'],
    hints: [
      'The parent chain is propane (3 carbons).',
      'Attach a methyl group (-CH3) to the central carbon (Carbon 2).'
    ],
    explanation: '2-Methylpropane (C4H10) is the simplest branched alkane with a central carbon bonded to 3 methyl groups and 1 hydrogen.',
    structure: {
      name: '2-Methylpropane',
      formula: 'C₄H₁₀',
      category: 'Branched Alkane',
      description: 'Simplest branched alkane featuring a tertiary carbon center.',
      functionalGroups: ['Branched Alkane'],
      atoms: [
        { p: [0, 0, 0], t: 'C', symbol: 'C', name: 'C2 (Central)' },
        { p: [-1.4, -0.5, 0], t: 'C', symbol: 'C', name: 'C1 (Methyl)' },
        { p: [1.4, -0.5, 0], t: 'C', symbol: 'C', name: 'C3 (Methyl)' },
        { p: [0, 1.45, 0], t: 'C', symbol: 'C', name: 'C (Branch Methyl)' }
      ],
      bonds: [
        { s: 0, e: 1, order: 1 },
        { s: 0, e: 2, order: 1 },
        { s: 0, e: 3, order: 1 }
      ]
    }
  },
  {
    id: 'ch_c11_04',
    type: 'structure_to_name',
    educationLevel: 'class_11',
    difficulty: 2,
    topic: 'c11_alkenes',
    prompt: 'Inspect this planar hydrocarbon with a double bond and provide its IUPAC name.',
    targetMoleculeName: 'Ethene',
    molecularFormula: 'C₂H₄',
    expectedAnswer: 'ethene',
    acceptedAnswers: ['ethene', 'ethylene'],
    hints: [
      'It contains 2 carbon atoms connected by a double bond.',
      'Geometry around each carbon is trigonal planar (~120°).'
    ],
    explanation: 'Ethene (C2H4) is the simplest alkene, featuring a carbon-carbon double bond with sp2 hybridization.',
    structure: {
      name: 'Ethene',
      formula: 'C₂H₄',
      category: 'Alkene Hydrocarbon',
      description: 'Simplest alkene with a carbon-carbon double bond and 120° planar geometry.',
      functionalGroups: ['Alkene (C=C)'],
      atoms: [
        { p: [-0.67, 0, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [0.67, 0, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [-1.23, 0.93, 0], t: 'H', symbol: 'H', name: 'H' },
        { p: [-1.23, -0.93, 0], t: 'H', symbol: 'H', name: 'H' },
        { p: [1.23, 0.93, 0], t: 'H', symbol: 'H', name: 'H' },
        { p: [1.23, -0.93, 0], t: 'H', symbol: 'H', name: 'H' }
      ],
      bonds: [
        { s: 0, e: 1, order: 2 },
        { s: 0, e: 2, order: 1 },
        { s: 0, e: 3, order: 1 },
        { s: 1, e: 4, order: 1 },
        { s: 1, e: 5, order: 1 }
      ]
    }
  },
  {
    id: 'ch_c11_05',
    type: 'structure_to_name',
    educationLevel: 'class_11',
    difficulty: 2,
    topic: 'c11_alkenes',
    prompt: 'Identify this 3-carbon alkene containing one double bond.',
    targetMoleculeName: 'Propene',
    molecularFormula: 'C₃H₆',
    expectedAnswer: 'propene',
    acceptedAnswers: ['propene', 'prop-1-ene', 'propylene', '1-propene'],
    hints: [
      '3-carbon chain with a double bond between C1 and C2.',
      'Prefix is "prop-" and suffix is "-ene".'
    ],
    explanation: 'Propene (propylene, C3H6) has one C=C double bond and one C-C single bond, forming the monomer for polypropylene.',
    structure: {
      name: 'Propene',
      formula: 'C₃H₆',
      category: 'Alkene Hydrocarbon',
      description: 'Three-carbon terminal alkene.',
      functionalGroups: ['Alkene (C=C)'],
      atoms: [
        { p: [-1.25, 0.35, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [0, -0.35, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [1.35, 0.35, 0], t: 'C', symbol: 'C', name: 'C3 (Methyl)' }
      ],
      bonds: [
        { s: 0, e: 1, order: 2 },
        { s: 1, e: 2, order: 1 }
      ]
    }
  },
  {
    id: 'ch_c11_06',
    type: 'name_to_structure',
    educationLevel: 'class_11',
    difficulty: 2,
    topic: 'c11_alkynes',
    prompt: 'Build the 3D molecular structure of Ethyne (Acetylene).',
    targetMoleculeName: 'Ethyne',
    molecularFormula: 'C₂H₂',
    expectedAnswer: 'ethyne',
    acceptedAnswers: ['ethyne', 'acetylene'],
    hints: [
      'Consists of two carbons linked by a triple bond.',
      'Linear 180° geometry with sp hybridization.'
    ],
    explanation: 'Ethyne (C2H2) is the simplest alkyne with a carbon-carbon triple bond and a linear 180° bond angle.',
    structure: {
      name: 'Ethyne',
      formula: 'C₂H₂',
      category: 'Alkyne Hydrocarbon',
      description: 'Linear two-carbon alkyne with a triple bond.',
      functionalGroups: ['Alkyne (C≡C)'],
      atoms: [
        { p: [-0.6, 0, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [0.6, 0, 0], t: 'C', symbol: 'C', name: 'C2' }
      ],
      bonds: [
        { s: 0, e: 1, order: 3 }
      ]
    }
  },
  {
    id: 'ch_c11_07',
    type: 'name_to_structure',
    educationLevel: 'class_11',
    difficulty: 2,
    topic: 'c11_alkynes',
    prompt: 'Build the 3D structure of Propyne (Methylacetylene).',
    targetMoleculeName: 'Propyne',
    molecularFormula: 'C₃H₄',
    expectedAnswer: 'propyne',
    acceptedAnswers: ['propyne', 'methylacetylene', 'prop-1-yne'],
    hints: [
      'Propyne contains 3 carbons with a triple bond between C1 and C2.',
      'The C≡C-C bond angle is linear (180°).'
    ],
    explanation: 'Propyne has a terminal triple bond (C≡C) with sp hybridization and a linear geometry linked to a methyl group.',
    structure: {
      name: 'Propyne',
      formula: 'C₃H₄',
      category: 'Alkyne Hydrocarbon',
      description: 'Three-carbon terminal alkyne with linear triple bond geometry.',
      functionalGroups: ['Alkyne (C≡C)'],
      atoms: [
        { p: [-1.2, 0, 0], t: 'C', symbol: 'C', name: 'C1 (Terminal alkyne C)' },
        { p: [0, 0, 0], t: 'C', symbol: 'C', name: 'C2 (sp alkyne C)' },
        { p: [1.45, 0, 0], t: 'C', symbol: 'C', name: 'C3 (sp3 Methyl C)' }
      ],
      bonds: [
        { s: 0, e: 1, order: 3 },
        { s: 1, e: 2, order: 1 }
      ]
    }
  },
  {
    id: 'ch_c11_08',
    type: 'structure_to_name',
    educationLevel: 'class_11',
    difficulty: 2,
    topic: 'c11_cycloalkanes',
    prompt: 'Identify the cyclic hydrocarbon shown in the 3D viewer.',
    targetMoleculeName: 'Cyclopropane',
    molecularFormula: 'C₃H₆',
    expectedAnswer: 'cyclopropane',
    acceptedAnswers: ['cyclopropane'],
    hints: [
      'This ring forms a 3-membered equilateral triangle.',
      'It possesses high ring strain with ~60° C-C-C bond angles.'
    ],
    explanation: 'Cyclopropane (C3H6) is the smallest cycloalkane with severe angle strain (60° compared to tetrahedral 109.5°).',
    structure: {
      name: 'Cyclopropane',
      formula: 'C₃H₆',
      category: 'Cycloalkane',
      description: 'Three-membered strained ring hydrocarbon.',
      functionalGroups: ['Cyclic Ring'],
      atoms: [
        { p: [0, 0.87, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [-0.75, -0.43, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [0.75, -0.43, 0], t: 'C', symbol: 'C', name: 'C3' }
      ],
      bonds: [
        { s: 0, e: 1, order: 1 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 0, order: 1 }
      ]
    }
  },
  {
    id: 'ch_c11_09',
    type: 'structure_to_name',
    educationLevel: 'class_11',
    difficulty: 2,
    topic: 'c11_cycloalkanes',
    prompt: 'Name this 4-carbon saturated ring hydrocarbon.',
    targetMoleculeName: 'Cyclobutane',
    molecularFormula: 'C₄H₈',
    expectedAnswer: 'cyclobutane',
    acceptedAnswers: ['cyclobutane'],
    hints: [
      'A 4-carbon ring with slightly puckered square geometry.',
      'Formula is C4H8.'
    ],
    explanation: 'Cyclobutane adopts a slightly puckered conformation to reduce eclipsing strain between adjacent C-H bonds.',
    structure: {
      name: 'Cyclobutane',
      formula: 'C₄H₈',
      category: 'Cycloalkane',
      description: 'Four-membered puckered ring cycloalkane.',
      functionalGroups: ['Cyclic Ring'],
      atoms: [
        { p: [-0.75, 0.75, 0.1], t: 'C', symbol: 'C', name: 'C1' },
        { p: [0.75, 0.75, -0.1], t: 'C', symbol: 'C', name: 'C2' },
        { p: [0.75, -0.75, 0.1], t: 'C', symbol: 'C', name: 'C3' },
        { p: [-0.75, -0.75, -0.1], t: 'C', symbol: 'C', name: 'C4' }
      ],
      bonds: [
        { s: 0, e: 1, order: 1 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 1 },
        { s: 3, e: 0, order: 1 }
      ]
    }
  },
  {
    id: 'ch_c11_10',
    type: 'name_to_structure',
    educationLevel: 'class_11',
    difficulty: 2,
    topic: 'c11_branched_alkanes',
    prompt: 'Construct the structure of 2-Methylbutane (Isopentane).',
    targetMoleculeName: '2-Methylbutane',
    molecularFormula: 'C₅H₁₂',
    expectedAnswer: '2-methylbutane',
    acceptedAnswers: ['2-methylbutane', 'isopentane', 'methylbutane'],
    hints: [
      'The parent chain is butane (4 carbons).',
      'Attach a methyl group to Carbon 2.'
    ],
    explanation: '2-Methylbutane is a branched isomer of pentane with a single methyl branch on the second carbon.',
    structure: {
      name: '2-Methylbutane',
      formula: 'C₅H₁₂',
      category: 'Branched Alkane',
      description: 'Branched five-carbon alkane with butane parent chain.',
      functionalGroups: ['Branched Alkane'],
      atoms: [
        { p: [-1.9, 0.3, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [-0.6, -0.3, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [0.7, 0.3, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [2.0, -0.3, 0], t: 'C', symbol: 'C', name: 'C4' },
        { p: [-0.6, -1.75, 0], t: 'C', symbol: 'C', name: 'Methyl on C2' }
      ],
      bonds: [
        { s: 0, e: 1, order: 1 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 1 },
        { s: 1, e: 4, order: 1 }
      ]
    }
  },

  // ==========================================
  // LEVEL 2: CLASS 12 INTERMEDIATE (DIFFICULTY 2 - 3)
  // ==========================================
  {
    id: 'ch_c12_01',
    type: 'structure_to_name',
    educationLevel: 'class_12',
    difficulty: 3,
    topic: 'c12_polyenes',
    prompt: 'Determine the IUPAC name for this conjugated diene.',
    targetMoleculeName: 'Buta-1,3-diene',
    molecularFormula: 'C₄H₆',
    expectedAnswer: 'buta-1,3-diene',
    acceptedAnswers: ['buta-1,3-diene', '1,3-butadiene', 'butadiene'],
    hints: [
      '4-carbon chain with two alternating double bonds separated by a single bond.',
      'Double bonds are located at carbons 1 and 3.'
    ],
    explanation: 'Buta-1,3-diene is the simplest conjugated diene with continuous pi-orbital overlap and s-trans/s-cis conformations.',
    structure: {
      name: 'Buta-1,3-diene',
      formula: 'C₄H₆',
      category: 'Conjugated Diene',
      description: '4-carbon conjugated diene with alternating single and double bonds.',
      functionalGroups: ['Conjugated Diene'],
      atoms: [
        { p: [-1.8, 0.4, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [-0.6, -0.2, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [0.6, 0.2, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [1.8, -0.4, 0], t: 'C', symbol: 'C', name: 'C4' }
      ],
      bonds: [
        { s: 0, e: 1, order: 2 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 2 }
      ]
    }
  },
  {
    id: 'ch_c12_02',
    type: 'structure_to_name',
    educationLevel: 'class_12',
    difficulty: 3,
    topic: 'c12_polyenes',
    prompt: 'Identify this non-conjugated isolated diene with terminal double bonds.',
    targetMoleculeName: 'Penta-1,4-diene',
    molecularFormula: 'C₅H₈',
    expectedAnswer: 'penta-1,4-diene',
    acceptedAnswers: ['penta-1,4-diene', '1,4-pentadiene'],
    hints: [
      'A 5-carbon chain with double bonds at positions 1 and 4.',
      'Separated by an isolated -CH2- methylene group at carbon 3.'
    ],
    explanation: 'Penta-1,4-diene is an isolated (non-conjugated) diene whose double bonds do not interact through resonance.',
    structure: {
      name: 'Penta-1,4-diene',
      formula: 'C₅H₈',
      category: 'Isolated Diene',
      description: 'Five-carbon non-conjugated diene with terminal double bonds.',
      functionalGroups: ['Alkene (C=C)'],
      atoms: [
        { p: [-2.4, 0.4, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [-1.2, -0.3, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [0, 0.4, 0], t: 'C', symbol: 'C', name: 'C3 (Methylene)' },
        { p: [1.2, -0.3, 0], t: 'C', symbol: 'C', name: 'C4' },
        { p: [2.4, 0.4, 0], t: 'C', symbol: 'C', name: 'C5' }
      ],
      bonds: [
        { s: 0, e: 1, order: 2 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 1 },
        { s: 3, e: 4, order: 2 }
      ]
    }
  },
  {
    id: 'ch_c12_03',
    type: 'name_to_structure',
    educationLevel: 'class_12',
    difficulty: 3,
    topic: 'c12_structural_isomers',
    prompt: 'Construct the constitutional isomer of pentane named 2,2-Dimethylpropane (Neopentane).',
    targetMoleculeName: '2,2-Dimethylpropane',
    molecularFormula: 'C₅H₁₂',
    expectedAnswer: '2,2-dimethylpropane',
    acceptedAnswers: ['2,2-dimethylpropane', 'neopentane'],
    hints: [
      'Formula is C5H12.',
      'A quaternary central carbon atom is bonded symmetrically to 4 methyl groups.'
    ],
    explanation: '2,2-Dimethylpropane (Neopentane) has high tetrahedral symmetry (Td) with a central quaternary carbon.',
    structure: {
      name: '2,2-Dimethylpropane',
      formula: 'C₅H₁₂',
      category: 'Branched Alkane Isomer',
      description: 'Highly symmetrical branched isomer of pentane with a central quaternary carbon.',
      functionalGroups: ['Quaternary Carbon', 'Methyl Groups'],
      atoms: [
        { p: [0, 0, 0], t: 'C', symbol: 'C', name: 'C2 (Quaternary Center)' },
        { p: [1.1, 1.1, 1.1], t: 'C', symbol: 'C', name: 'Methyl 1' },
        { p: [1.1, -1.1, -1.1], t: 'C', symbol: 'C', name: 'Methyl 2' },
        { p: [-1.1, 1.1, -1.1], t: 'C', symbol: 'C', name: 'Methyl 3' },
        { p: [-1.1, -1.1, 1.1], t: 'C', symbol: 'C', name: 'Methyl 4' }
      ],
      bonds: [
        { s: 0, e: 1, order: 1 },
        { s: 0, e: 2, order: 1 },
        { s: 0, e: 3, order: 1 },
        { s: 0, e: 4, order: 1 }
      ]
    }
  },
  {
    id: 'ch_c12_04',
    type: 'structure_to_name',
    educationLevel: 'class_12',
    difficulty: 3,
    topic: 'c12_geometric_isomers',
    prompt: 'Identify the stereoisomer of but-2-ene where the two methyl groups lie on OPPOSITE sides of the double bond.',
    targetMoleculeName: '(2E)-But-2-ene',
    molecularFormula: 'C₄H₈',
    expectedAnswer: '(2e)-but-2-ene',
    acceptedAnswers: ['(2e)-but-2-ene', 'trans-but-2-ene', 'trans-2-butene', 'but-2-ene', '2-butene', '(e)-but-2-ene'],
    hints: [
      'Double bond is at carbon 2.',
      'The methyl groups are in the trans or (E) configuration (opposite sides).'
    ],
    explanation: 'In (2E)-but-2-ene (trans-2-butene), the priority methyl groups lie on opposite sides of the rigid C=C double bond plane, giving zero net dipole moment.',
    structure: {
      name: '(2E)-But-2-ene',
      formula: 'C₄H₈',
      category: 'Alkene Geometric Isomer',
      description: 'Trans stereoisomer with methyl groups located on opposite sides of C=C.',
      functionalGroups: ['Alkene (C=C)', 'Trans Stereochemistry'],
      atoms: [
        { p: [-1.8, -1.0, 0], t: 'C', symbol: 'C', name: 'C1 (Methyl)' },
        { p: [-0.67, 0, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [0.67, 0, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [1.8, 1.0, 0], t: 'C', symbol: 'C', name: 'C4 (Methyl)' }
      ],
      bonds: [
        { s: 0, e: 1, order: 1 },
        { s: 1, e: 2, order: 2 },
        { s: 2, e: 3, order: 1 }
      ]
    }
  },
  {
    id: 'ch_c12_05',
    type: 'name_to_structure',
    educationLevel: 'class_12',
    difficulty: 3,
    topic: 'c12_geometric_isomers',
    prompt: 'Construct the cis-geometric isomer of but-2-ene ((2Z)-But-2-ene).',
    targetMoleculeName: '(2Z)-But-2-ene',
    molecularFormula: 'C₄H₈',
    expectedAnswer: '(2z)-but-2-ene',
    acceptedAnswers: ['(2z)-but-2-ene', 'cis-but-2-ene', 'cis-2-butene', '(z)-but-2-ene'],
    hints: [
      'Both methyl groups must be oriented on the SAME side of the C=C double bond.',
      'Designated with the (Z) or cis stereodescriptor.'
    ],
    explanation: '(2Z)-But-2-ene (cis-2-butene) has both methyl groups on the same side of the double bond, resulting in steric crowding and a small dipole moment.',
    structure: {
      name: '(2Z)-But-2-ene',
      formula: 'C₄H₈',
      category: 'Alkene Geometric Isomer',
      description: 'Cis stereoisomer with methyl substituents pointing to the same side.',
      functionalGroups: ['Alkene (C=C)', 'Cis Stereochemistry'],
      atoms: [
        { p: [-1.6, 1.1, 0], t: 'C', symbol: 'C', name: 'C1 (Methyl)' },
        { p: [-0.67, 0, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [0.67, 0, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [1.6, 1.1, 0], t: 'C', symbol: 'C', name: 'C4 (Methyl)' }
      ],
      bonds: [
        { s: 0, e: 1, order: 1 },
        { s: 1, e: 2, order: 2 },
        { s: 2, e: 3, order: 1 }
      ]
    }
  },
  {
    id: 'ch_c12_06',
    type: 'structure_to_name',
    educationLevel: 'class_12',
    difficulty: 3,
    topic: 'c12_aromatic_arenes',
    prompt: 'Identify this prototypical planar aromatic hydrocarbon with 6 delocalized pi-electrons.',
    targetMoleculeName: 'Benzene',
    molecularFormula: 'C₆H₆',
    expectedAnswer: 'benzene',
    acceptedAnswers: ['benzene', '[6]annulene'],
    hints: [
      'A planar 6-carbon regular hexagon with alternating double and single bonds.',
      'Satisfies Hückel rule with 4n+2 (n=1) pi-electrons.'
    ],
    explanation: 'Benzene (C6H6) is the fundamental aromatic hydrocarbon with complete cyclic conjugation and equal C-C bond lengths (1.39 Å).',
    structure: {
      name: 'Benzene',
      formula: 'C₆H₆',
      category: 'Aromatic Hydrocarbon',
      description: 'Planar hexagonal aromatic ring with delocalized pi-system.',
      functionalGroups: ['Aromatic Ring'],
      atoms: [
        { p: [1.4, 0, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [0.7, 1.21, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [-0.7, 1.21, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [-1.4, 0, 0], t: 'C', symbol: 'C', name: 'C4' },
        { p: [-0.7, -1.21, 0], t: 'C', symbol: 'C', name: 'C5' },
        { p: [0.7, -1.21, 0], t: 'C', symbol: 'C', name: 'C6' }
      ],
      bonds: [
        { s: 0, e: 1, order: 2 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 2 },
        { s: 3, e: 4, order: 1 },
        { s: 4, e: 5, order: 2 },
        { s: 5, e: 0, order: 1 }
      ]
    }
  },
  {
    id: 'ch_c12_07',
    type: 'name_to_structure',
    educationLevel: 'class_12',
    difficulty: 3,
    topic: 'c12_aromatic_arenes',
    prompt: 'Build the structure of Toluene (Methylbenzene).',
    targetMoleculeName: 'Toluene',
    molecularFormula: 'C₇H₈',
    expectedAnswer: 'toluene',
    acceptedAnswers: ['toluene', 'methylbenzene'],
    hints: [
      'A benzene ring substituted with a single methyl group.',
      'Molecular formula is C7H8.'
    ],
    explanation: 'Toluene (methylbenzene) is an arene consisting of a methyl group attached to a phenyl ring.',
    structure: {
      name: 'Toluene',
      formula: 'C₇H₈',
      category: 'Aromatic Hydrocarbon',
      description: 'Mono-substituted benzene bearing a methyl group.',
      functionalGroups: ['Aromatic Ring', 'Methyl Group'],
      atoms: [
        { p: [1.4, 0, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [0.7, 1.21, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [-0.7, 1.21, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [-1.4, 0, 0], t: 'C', symbol: 'C', name: 'C4' },
        { p: [-0.7, -1.21, 0], t: 'C', symbol: 'C', name: 'C5' },
        { p: [0.7, -1.21, 0], t: 'C', symbol: 'C', name: 'C6' },
        { p: [2.9, 0, 0], t: 'C', symbol: 'C', name: 'Methyl on C1' }
      ],
      bonds: [
        { s: 0, e: 1, order: 2 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 2 },
        { s: 3, e: 4, order: 1 },
        { s: 4, e: 5, order: 2 },
        { s: 5, e: 0, order: 1 },
        { s: 0, e: 6, order: 1 }
      ]
    }
  },
  {
    id: 'ch_c12_08',
    type: 'structure_to_name',
    educationLevel: 'class_12',
    difficulty: 3,
    topic: 'c12_aromatic_arenes',
    prompt: 'Identify this methylated benzene derivative with methyl substituents at positions 1 and 4.',
    targetMoleculeName: '1,4-Dimethylbenzene',
    molecularFormula: 'C₈H₁₀',
    expectedAnswer: '1,4-dimethylbenzene',
    acceptedAnswers: ['1,4-dimethylbenzene', 'p-xylene', 'para-xylene'],
    hints: [
      'A benzene ring with two methyl groups placed opposite each other (para position).',
      'Also known by the common name p-xylene.'
    ],
    explanation: '1,4-Dimethylbenzene (para-xylene) consists of a benzene ring with methyl groups at carbons 1 and 4, creating a center of symmetry.',
    structure: {
      name: '1,4-Dimethylbenzene',
      formula: 'C₈H₁₀',
      category: 'Aromatic Hydrocarbon',
      description: 'Para-disubstituted arene with methyl groups at positions 1 and 4.',
      functionalGroups: ['Aromatic Ring', 'Methyl Branches'],
      atoms: [
        { p: [0, 1.4, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [1.21, 0.7, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [1.21, -0.7, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [0, -1.4, 0], t: 'C', symbol: 'C', name: 'C4' },
        { p: [-1.21, -0.7, 0], t: 'C', symbol: 'C', name: 'C5' },
        { p: [-1.21, 0.7, 0], t: 'C', symbol: 'C', name: 'C6' },
        { p: [0, 2.9, 0], t: 'C', symbol: 'C', name: 'Methyl 1' },
        { p: [0, -2.9, 0], t: 'C', symbol: 'C', name: 'Methyl 2' }
      ],
      bonds: [
        { s: 0, e: 1, order: 2 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 2 },
        { s: 3, e: 4, order: 1 },
        { s: 4, e: 5, order: 2 },
        { s: 5, e: 0, order: 1 },
        { s: 0, e: 6, order: 1 },
        { s: 3, e: 7, order: 1 }
      ]
    }
  },
  {
    id: 'ch_c12_09',
    type: 'structure_to_name',
    educationLevel: 'class_12',
    difficulty: 3,
    topic: 'c12_aromatic_arenes',
    prompt: 'Name this ortho-disubstituted dimethylbenzene isomer.',
    targetMoleculeName: '1,2-Dimethylbenzene',
    molecularFormula: 'C₈H₁₀',
    expectedAnswer: '1,2-dimethylbenzene',
    acceptedAnswers: ['1,2-dimethylbenzene', 'o-xylene', 'ortho-xylene'],
    hints: [
      'Two methyl groups on adjacent carbons of a benzene ring.',
      'Also known as o-xylene.'
    ],
    explanation: '1,2-Dimethylbenzene (ortho-xylene) has two adjacent methyl groups on the aromatic ring, causing minor steric hindrance.',
    structure: {
      name: '1,2-Dimethylbenzene',
      formula: 'C₈H₁₀',
      category: 'Aromatic Hydrocarbon',
      description: 'Ortho-disubstituted arene with methyl groups at carbons 1 and 2.',
      functionalGroups: ['Aromatic Ring', 'Methyl Branches'],
      atoms: [
        { p: [0, 1.4, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [1.21, 0.7, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [1.21, -0.7, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [0, -1.4, 0], t: 'C', symbol: 'C', name: 'C4' },
        { p: [-1.21, -0.7, 0], t: 'C', symbol: 'C', name: 'C5' },
        { p: [-1.21, 0.7, 0], t: 'C', symbol: 'C', name: 'C6' },
        { p: [-0.5, 2.75, 0], t: 'C', symbol: 'C', name: 'Methyl on C1' },
        { p: [2.55, 1.35, 0], t: 'C', symbol: 'C', name: 'Methyl on C2' }
      ],
      bonds: [
        { s: 0, e: 1, order: 2 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 2 },
        { s: 3, e: 4, order: 1 },
        { s: 4, e: 5, order: 2 },
        { s: 5, e: 0, order: 1 },
        { s: 0, e: 6, order: 1 },
        { s: 1, e: 7, order: 1 }
      ]
    }
  },
  {
    id: 'ch_c12_10',
    type: 'name_to_structure',
    educationLevel: 'class_12',
    difficulty: 3,
    topic: 'c12_polyenes',
    prompt: 'Construct the 6-membered cyclic alkene named Cyclohexene.',
    targetMoleculeName: 'Cyclohexene',
    molecularFormula: 'C₆H₁₀',
    expectedAnswer: 'cyclohexene',
    acceptedAnswers: ['cyclohexene'],
    hints: [
      'A 6-carbon ring containing exactly one double bond.',
      'Formula is C6H10.'
    ],
    explanation: 'Cyclohexene (C6H10) is a six-membered cycloalkene adopting a half-chair conformation.',
    structure: {
      name: 'Cyclohexene',
      formula: 'C₆H₁₀',
      category: 'Cycloalkene',
      description: 'Six-membered ring with one internal C=C double bond.',
      functionalGroups: ['Cyclic Ring', 'Alkene (C=C)'],
      atoms: [
        { p: [-0.67, 1.3, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [0.67, 1.3, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [1.4, 0, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [0.7, -1.25, 0], t: 'C', symbol: 'C', name: 'C4' },
        { p: [-0.7, -1.25, 0], t: 'C', symbol: 'C', name: 'C5' },
        { p: [-1.4, 0, 0], t: 'C', symbol: 'C', name: 'C6' }
      ],
      bonds: [
        { s: 0, e: 1, order: 2 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 1 },
        { s: 3, e: 4, order: 1 },
        { s: 4, e: 5, order: 1 },
        { s: 5, e: 0, order: 1 }
      ]
    }
  },

  // ==========================================
  // LEVEL 3: ENGINEERING ENTRANCE (DIFFICULTY 3 - 4)
  // ==========================================
  {
    id: 'ch_eng_01',
    type: 'structure_to_name',
    educationLevel: 'engineering',
    difficulty: 4,
    topic: 'eng_complex_iupac',
    prompt: 'Name this tetrasubstituted alkene with symmetrical methyl branches across the double bond.',
    targetMoleculeName: '2,3-Dimethylbut-2-ene',
    molecularFormula: 'C₆H₁₂',
    expectedAnswer: '2,3-dimethylbut-2-ene',
    acceptedAnswers: ['2,3-dimethylbut-2-ene', '2,3-dimethyl-2-butene', 'tetramethylethylene'],
    hints: [
      'The parent alkene chain is 4 carbons (but-2-ene).',
      'Both sp2 double-bonded carbons have methyl substituents (positions 2 and 3).'
    ],
    explanation: '2,3-Dimethylbut-2-ene (tetramethylethylene) is a sterically hindered alkene with maximum hyperconjugation stabilization from 4 methyl groups.',
    structure: {
      name: '2,3-Dimethylbut-2-ene',
      formula: 'C₆H₁₂',
      category: 'Tetrasubstituted Alkene',
      description: 'Planar alkene core surrounded by four methyl substituents.',
      functionalGroups: ['Alkene (C=C)', 'Methyl Groups'],
      atoms: [
        { p: [-0.67, 0, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [0.67, 0, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [-1.45, 1.25, 0], t: 'C', symbol: 'C', name: 'C1 (Methyl)' },
        { p: [-1.45, -1.25, 0], t: 'C', symbol: 'C', name: 'Methyl on C2' },
        { p: [1.45, 1.25, 0], t: 'C', symbol: 'C', name: 'C4 (Methyl)' },
        { p: [1.45, -1.25, 0], t: 'C', symbol: 'C', name: 'Methyl on C3' }
      ],
      bonds: [
        { s: 0, e: 1, order: 2 },
        { s: 0, e: 2, order: 1 },
        { s: 0, e: 3, order: 1 },
        { s: 1, e: 4, order: 1 },
        { s: 1, e: 5, order: 1 }
      ]
    }
  },
  {
    id: 'ch_eng_02',
    type: 'name_to_structure',
    educationLevel: 'engineering',
    difficulty: 4,
    topic: 'eng_enynes',
    prompt: 'Construct the enyne hydrocarbon Pent-1-en-4-yne.',
    targetMoleculeName: 'Pent-1-en-4-yne',
    molecularFormula: 'C₅H₆',
    expectedAnswer: 'pent-1-en-4-yne',
    acceptedAnswers: ['pent-1-en-4-yne', '1-penten-4-yne'],
    hints: [
      '5-carbon parent chain containing both a double bond at C1 and a triple bond at C4.',
      'IUPAC suffix orders double bond before triple bond (-en-yne).'
    ],
    explanation: 'Pent-1-en-4-yne combines terminal alkene and alkyne functional groups separated by a methylene bridge.',
    structure: {
      name: 'Pent-1-en-4-yne',
      formula: 'C₅H₆',
      category: 'Enyne Hydrocarbon',
      description: '5-carbon chain featuring a terminal double bond and a terminal triple bond.',
      functionalGroups: ['Alkene (C=C)', 'Alkyne (C≡C)'],
      atoms: [
        { p: [-2.4, 0.5, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [-1.2, -0.2, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [0, 0.4, 0], t: 'C', symbol: 'C', name: 'C3 (Methylene)' },
        { p: [1.3, 0.4, 0], t: 'C', symbol: 'C', name: 'C4 (Alkyne)' },
        { p: [2.5, 0.4, 0], t: 'C', symbol: 'C', name: 'C5 (Terminal Alkyne)' }
      ],
      bonds: [
        { s: 0, e: 1, order: 2 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 1 },
        { s: 3, e: 4, order: 3 }
      ]
    }
  },
  {
    id: 'ch_eng_03',
    type: 'structure_to_name',
    educationLevel: 'engineering',
    difficulty: 4,
    topic: 'eng_complex_iupac',
    prompt: 'Identify the IUPAC name for this bulky terminal alkyne bearing a tert-butyl group.',
    targetMoleculeName: '3,3-Dimethylbut-1-yne',
    molecularFormula: 'C₆H₁₀',
    expectedAnswer: '3,3-dimethylbut-1-yne',
    acceptedAnswers: ['3,3-dimethylbut-1-yne', 'tert-butylacetylene', '3,3-dimethyl-1-butyne'],
    hints: [
      'Numbering starts from the terminal triple bond (Carbon 1).',
      'Two methyl substituents are located at Carbon 3.'
    ],
    explanation: '3,3-Dimethylbut-1-yne (tert-butylacetylene) has a quaternary carbon adjacent to the linear C≡C triple bond.',
    structure: {
      name: '3,3-Dimethylbut-1-yne',
      formula: 'C₆H₁₀',
      category: 'Branched Alkyne',
      description: 'Terminal alkyne bonded to a tert-butyl group.',
      functionalGroups: ['Alkyne (C≡C)', 'Tert-Butyl Group'],
      atoms: [
        { p: [-1.9, 0, 0], t: 'C', symbol: 'C', name: 'C1 (Terminal alkyne)' },
        { p: [-0.7, 0, 0], t: 'C', symbol: 'C', name: 'C2 (Alkyne)' },
        { p: [0.75, 0, 0], t: 'C', symbol: 'C', name: 'C3 (Quaternary)' },
        { p: [1.5, 1.3, 0], t: 'C', symbol: 'C', name: 'Methyl 1' },
        { p: [1.5, -1.3, 0], t: 'C', symbol: 'C', name: 'Methyl 2' },
        { p: [0.75, 0, 1.45], t: 'C', symbol: 'C', name: 'Methyl 3' }
      ],
      bonds: [
        { s: 0, e: 1, order: 3 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 1 },
        { s: 2, e: 4, order: 1 },
        { s: 2, e: 5, order: 1 }
      ]
    }
  },
  {
    id: 'ch_eng_04',
    type: 'structure_to_name',
    educationLevel: 'engineering',
    difficulty: 4,
    topic: 'eng_complex_iupac',
    prompt: 'Provide the IUPAC name for this highly branched octane isomer used as the 100-point benchmark for octane ratings.',
    targetMoleculeName: '2,2,4-Trimethylpentane',
    molecularFormula: 'C₈H₁₈',
    expectedAnswer: '2,2,4-trimethylpentane',
    acceptedAnswers: ['2,2,4-trimethylpentane', 'isooctane'],
    hints: [
      '5-carbon parent chain (pentane).',
      'Lowest locant set rule assigns 2,2,4- rather than 2,4,4-.'
    ],
    explanation: '2,2,4-Trimethylpentane (isooctane) is the international standard for anti-knock octane rating (assigned 100).',
    structure: {
      name: '2,2,4-Trimethylpentane',
      formula: 'C₈H₁₈',
      category: 'Polysubstituted Alkane',
      description: 'Standard isooctane with 2,2,4-trimethyl branching on a pentane parent chain.',
      functionalGroups: ['Branched Alkane'],
      atoms: [
        { p: [-2.0, 0, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [-0.6, 0, 0], t: 'C', symbol: 'C', name: 'C2 (Quaternary)' },
        { p: [0.7, 0.4, 0], t: 'C', symbol: 'C', name: 'C3 (CH2)' },
        { p: [1.9, -0.2, 0], t: 'C', symbol: 'C', name: 'C4 (CH)' },
        { p: [3.1, 0.4, 0], t: 'C', symbol: 'C', name: 'C5' },
        { p: [-0.6, 1.45, 0], t: 'C', symbol: 'C', name: 'Methyl on C2' },
        { p: [-0.6, -1.45, 0], t: 'C', symbol: 'C', name: 'Methyl on C2' },
        { p: [1.9, -1.65, 0], t: 'C', symbol: 'C', name: 'Methyl on C4' }
      ],
      bonds: [
        { s: 0, e: 1, order: 1 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 1 },
        { s: 3, e: 4, order: 1 },
        { s: 1, e: 5, order: 1 },
        { s: 1, e: 6, order: 1 },
        { s: 3, e: 7, order: 1 }
      ]
    }
  },
  {
    id: 'ch_eng_05',
    type: 'name_to_structure',
    educationLevel: 'engineering',
    difficulty: 4,
    topic: 'eng_enynes',
    prompt: 'Construct the terminal enyne hydrocarbon Hex-1-en-5-yne.',
    targetMoleculeName: 'Hex-1-en-5-yne',
    molecularFormula: 'C₆H₈',
    expectedAnswer: 'hex-1-en-5-yne',
    acceptedAnswers: ['hex-1-en-5-yne', '1-hexen-5-yne'],
    hints: [
      '6-carbon chain with a double bond at C1 and a triple bond at C5.',
      'Double bond receives locant 1 due to tie-breaking numbering rules.'
    ],
    explanation: 'Hex-1-en-5-yne has both double and triple bonds at terminal ends; IUPAC rules award lowest locant to the double bond in a tie.',
    structure: {
      name: 'Hex-1-en-5-yne',
      formula: 'C₆H₈',
      category: 'Enyne Hydrocarbon',
      description: 'Six-carbon terminal enyne with C1 double bond and C5 triple bond.',
      functionalGroups: ['Alkene (C=C)', 'Alkyne (C≡C)'],
      atoms: [
        { p: [-3.0, 0.4, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [-1.8, -0.3, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [-0.6, 0.4, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [0.6, -0.3, 0], t: 'C', symbol: 'C', name: 'C4' },
        { p: [1.8, -0.3, 0], t: 'C', symbol: 'C', name: 'C5' },
        { p: [3.0, -0.3, 0], t: 'C', symbol: 'C', name: 'C6' }
      ],
      bonds: [
        { s: 0, e: 1, order: 2 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 1 },
        { s: 3, e: 4, order: 1 },
        { s: 4, e: 5, order: 3 }
      ]
    }
  },
  {
    id: 'ch_eng_06',
    type: 'structure_to_name',
    educationLevel: 'engineering',
    difficulty: 4,
    topic: 'eng_bicyclic',
    prompt: 'Name this rigid bridged bicyclic alkane commonly known as Norbornane.',
    targetMoleculeName: 'Bicyclo[2.2.1]heptane',
    molecularFormula: 'C₇H₁₂',
    expectedAnswer: 'bicyclo[2.2.1]heptane',
    acceptedAnswers: ['bicyclo[2.2.1]heptane', 'norbornane'],
    hints: [
      'Two bridgehead carbons connected by bridges of lengths 2, 2, and 1 carbon.',
      'Total number of carbons in skeleton is 7 (heptane).'
    ],
    explanation: 'Bicyclo[2.2.1]heptane (norbornane) is a strained bridged bicyclic hydrocarbon with bridgehead carbons locked in a rigid boat conformation.',
    structure: {
      name: 'Bicyclo[2.2.1]heptane',
      formula: 'C₇H₁₂',
      category: 'Bridged Bicyclic Alkane',
      description: 'Norbornane bicyclic bridgehead system with [2.2.1] bridges.',
      functionalGroups: ['Bicyclic Ring', 'Bridgehead Carbons'],
      atoms: [
        { p: [-0.85, 0, -0.5], t: 'C', symbol: 'C', name: 'C1 (Bridgehead)' },
        { p: [-0.85, 1.1, 0.4], t: 'C', symbol: 'C', name: 'C2' },
        { p: [0.85, 1.1, 0.4], t: 'C', symbol: 'C', name: 'C3' },
        { p: [0.85, 0, -0.5], t: 'C', symbol: 'C', name: 'C4 (Bridgehead)' },
        { p: [0.85, -1.1, 0.4], t: 'C', symbol: 'C', name: 'C5' },
        { p: [-0.85, -1.1, 0.4], t: 'C', symbol: 'C', name: 'C6' },
        { p: [0, 0, 1.1], t: 'C', symbol: 'C', name: 'C7 (One-carbon bridge)' }
      ],
      bonds: [
        { s: 0, e: 1, order: 1 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 1 },
        { s: 3, e: 4, order: 1 },
        { s: 4, e: 5, order: 1 },
        { s: 5, e: 0, order: 1 },
        { s: 0, e: 6, order: 1 },
        { s: 3, e: 6, order: 1 }
      ]
    }
  },
  {
    id: 'ch_eng_07',
    type: 'structure_to_name',
    educationLevel: 'engineering',
    difficulty: 4,
    topic: 'eng_bicyclic',
    prompt: 'Name this fused bicyclic 10-carbon alkane formed by fusing two cyclohexane rings.',
    targetMoleculeName: 'Bicyclo[4.4.0]decane',
    molecularFormula: 'C₁₀H₁₈',
    expectedAnswer: 'bicyclo[4.4.0]decane',
    acceptedAnswers: ['bicyclo[4.4.0]decane', 'decalin', 'decahydronaphthalene'],
    hints: [
      'Two 6-membered rings sharing a common C-C bond (zero-carbon bridge).',
      'Common name is Decalin.'
    ],
    explanation: 'Bicyclo[4.4.0]decane (decalin) exists in cis and trans diastereomers and consists of two fused chair cyclohexane rings.',
    structure: {
      name: 'Bicyclo[4.4.0]decane',
      formula: 'C₁₀H₁₈',
      category: 'Fused Bicyclic Alkane',
      description: 'Two fused cyclohexane rings sharing two adjacent bridgehead carbons.',
      functionalGroups: ['Bicyclic Ring'],
      atoms: [
        { p: [0, 0.77, 0], t: 'C', symbol: 'C', name: 'C1 (Bridgehead)' },
        { p: [0, -0.77, 0], t: 'C', symbol: 'C', name: 'C6 (Bridgehead)' },
        { p: [1.25, 1.45, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [2.5, 0.77, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [2.5, -0.77, 0], t: 'C', symbol: 'C', name: 'C4' },
        { p: [1.25, -1.45, 0], t: 'C', symbol: 'C', name: 'C5' },
        { p: [-1.25, 1.45, 0], t: 'C', symbol: 'C', name: 'C7' },
        { p: [-2.5, 0.77, 0], t: 'C', symbol: 'C', name: 'C8' },
        { p: [-2.5, -0.77, 0], t: 'C', symbol: 'C', name: 'C9' },
        { p: [-1.25, -1.45, 0], t: 'C', symbol: 'C', name: 'C10' }
      ],
      bonds: [
        { s: 0, e: 1, order: 1 },
        { s: 0, e: 2, order: 1 },
        { s: 2, e: 3, order: 1 },
        { s: 3, e: 4, order: 1 },
        { s: 4, e: 5, order: 1 },
        { s: 5, e: 1, order: 1 },
        { s: 0, e: 6, order: 1 },
        { s: 6, e: 7, order: 1 },
        { s: 7, e: 8, order: 1 },
        { s: 8, e: 9, order: 1 },
        { s: 9, e: 1, order: 1 }
      ]
    }
  },
  {
    id: 'ch_eng_08',
    type: 'structure_to_name',
    educationLevel: 'engineering',
    difficulty: 4,
    topic: 'eng_bicyclic',
    prompt: 'Identify this spirocyclic hydrocarbon containing two 4-membered rings joined at a single atom.',
    targetMoleculeName: 'Spiro[3.3]heptane',
    molecularFormula: 'C₇H₁₂',
    expectedAnswer: 'spiro[3.3]heptane',
    acceptedAnswers: ['spiro[3.3]heptane'],
    hints: [
      'Joined at a single quaternary spiro carbon atom.',
      'Both rings have 3 ring carbons excluding the shared spiro center.'
    ],
    explanation: 'Spiro[3.3]heptane has a central spiro carbon shared between two mutually perpendicular cyclobutane rings.',
    structure: {
      name: 'Spiro[3.3]heptane',
      formula: 'C₇H₁₂',
      category: 'Spiro Hydrocarbon',
      description: 'Spirocyclic system with two cyclobutane rings meeting at a single carbon.',
      functionalGroups: ['Spiro Atom', 'Cyclic Ring'],
      atoms: [
        { p: [0, 0, 0], t: 'C', symbol: 'C', name: 'C4 (Spiro Center)' },
        { p: [-1.1, 0.8, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [-2.0, 0, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [-1.1, -0.8, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [1.1, 0, 0.8], t: 'C', symbol: 'C', name: 'C5' },
        { p: [2.0, 0, 0], t: 'C', symbol: 'C', name: 'C6' },
        { p: [1.1, 0, -0.8], t: 'C', symbol: 'C', name: 'C7' }
      ],
      bonds: [
        { s: 0, e: 1, order: 1 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 1 },
        { s: 3, e: 0, order: 1 },
        { s: 0, e: 4, order: 1 },
        { s: 4, e: 5, order: 1 },
        { s: 5, e: 6, order: 1 },
        { s: 6, e: 0, order: 1 }
      ]
    }
  },
  {
    id: 'ch_eng_09',
    type: 'name_to_structure',
    educationLevel: 'engineering',
    difficulty: 4,
    topic: 'eng_complex_iupac',
    prompt: 'Construct the trisubstituted alkene (3E)-3-Methylpent-2-ene.',
    targetMoleculeName: '(3E)-3-Methylpent-2-ene',
    molecularFormula: 'C₆H₁₂',
    expectedAnswer: '(3e)-3-methylpent-2-ene',
    acceptedAnswers: ['(3e)-3-methylpent-2-ene', '3-methylpent-2-ene', '(e)-3-methylpent-2-ene', '3-methyl-2-pentene'],
    hints: [
      '5-carbon parent chain (pent-2-ene) with a methyl at Carbon 3.',
      'High priority groups (ethyl vs methyl on C3, and methyl vs H on C2) are on opposite sides ((E) configuration).'
    ],
    explanation: '(3E)-3-Methylpent-2-ene uses CIP priority rules to establish the (E) stereodescriptor around the trisubstituted double bond.',
    structure: {
      name: '(3E)-3-Methylpent-2-ene',
      formula: 'C₆H₁₂',
      category: 'Trisubstituted Alkene',
      description: 'Trisubstituted alkene with (E) stereochemical configuration.',
      functionalGroups: ['Alkene (C=C)', 'Stereoisomer'],
      atoms: [
        { p: [-2.2, 0.9, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [-1.0, 0.1, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [0.25, -0.2, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [0.75, -1.6, 0], t: 'C', symbol: 'C', name: 'Methyl on C3' },
        { p: [1.2, 0.9, 0], t: 'C', symbol: 'C', name: 'C4' },
        { p: [2.6, 0.5, 0], t: 'C', symbol: 'C', name: 'C5' }
      ],
      bonds: [
        { s: 0, e: 1, order: 1 },
        { s: 1, e: 2, order: 2 },
        { s: 2, e: 3, order: 1 },
        { s: 2, e: 4, order: 1 },
        { s: 4, e: 5, order: 1 }
      ]
    }
  },
  {
    id: 'ch_eng_10',
    type: 'name_to_structure',
    educationLevel: 'engineering',
    difficulty: 3,
    topic: 'eng_complex_iupac',
    prompt: 'Construct the natural rubber precursor 2-Methylbuta-1,3-diene (Isoprene).',
    targetMoleculeName: '2-Methylbuta-1,3-diene',
    molecularFormula: 'C₅H₈',
    expectedAnswer: '2-methylbuta-1,3-diene',
    acceptedAnswers: ['2-methylbuta-1,3-diene', 'isoprene', '2-methyl-1,3-butadiene'],
    hints: [
      'A conjugated diene with double bonds at C1 and C3.',
      'A methyl substituent is placed on Carbon 2.'
    ],
    explanation: '2-Methylbuta-1,3-diene (isoprene) is the fundamental building block of terpenes, carotenoids, and natural rubber.',
    structure: {
      name: '2-Methylbuta-1,3-diene',
      formula: 'C₅H₈',
      category: 'Conjugated Diene',
      description: 'Methyl-branched conjugated diene monomer.',
      functionalGroups: ['Conjugated Diene', 'Methyl Branch'],
      atoms: [
        { p: [-1.6, 0.5, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [-0.4, -0.2, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [-0.4, -1.6, 0], t: 'C', symbol: 'C', name: 'Methyl on C2' },
        { p: [0.8, 0.4, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [2.0, -0.3, 0], t: 'C', symbol: 'C', name: 'C4' }
      ],
      bonds: [
        { s: 0, e: 1, order: 2 },
        { s: 1, e: 2, order: 1 },
        { s: 1, e: 3, order: 1 },
        { s: 3, e: 4, order: 2 }
      ]
    }
  },

  // ==========================================
  // LEVEL 4: ADVANCED / OLYMPIAD (DIFFICULTY 4 - 5)
  // ==========================================
  {
    id: 'ch_adv_01',
    type: 'structure_to_name',
    educationLevel: 'advanced',
    difficulty: 5,
    topic: 'adv_allenes_cumulenes',
    prompt: 'Name this cumulated diene containing two consecutive C=C double bonds with orthogonal terminal CH2 planes.',
    targetMoleculeName: 'Propa-1,2-diene',
    molecularFormula: 'C₃H₄',
    expectedAnswer: 'propa-1,2-diene',
    acceptedAnswers: ['propa-1,2-diene', 'allene', '1,2-propadiene'],
    hints: [
      'The central carbon is sp hybridized with two perpendicular unhybridized p-orbitals.',
      'Common name is Allene.'
    ],
    explanation: 'Propa-1,2-diene (allene) has cumulated double bonds. The terminal CH2 groups are orthogonal (90° rotated), bestowing D2d symmetry and axial chirality upon unsymmetrical substitution.',
    structure: {
      name: 'Propa-1,2-diene',
      formula: 'C₃H₄',
      category: 'Cumulene / Allene',
      description: 'Simplest cumulated diene with perpendicular pi-electron planes.',
      functionalGroups: ['Cumulene (C=C=C)'],
      atoms: [
        { p: [-1.3, 0, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [0, 0, 0], t: 'C', symbol: 'C', name: 'C2 (sp Carbon)' },
        { p: [1.3, 0, 0], t: 'C', symbol: 'C', name: 'C3' },
        // Orthogonal hydrogens
        { p: [-1.8, 0.9, 0], t: 'H', symbol: 'H', name: 'H (XY Plane)' },
        { p: [-1.8, -0.9, 0], t: 'H', symbol: 'H', name: 'H (XY Plane)' },
        { p: [1.8, 0, 0.9], t: 'H', symbol: 'H', name: 'H (XZ Plane)' },
        { p: [1.8, 0, -0.9], t: 'H', symbol: 'H', name: 'H (XZ Plane)' }
      ],
      bonds: [
        { s: 0, e: 1, order: 2 },
        { s: 1, e: 2, order: 2 },
        { s: 0, e: 3, order: 1 },
        { s: 0, e: 4, order: 1 },
        { s: 2, e: 5, order: 1 },
        { s: 2, e: 6, order: 1 }
      ]
    }
  },
  {
    id: 'ch_adv_02',
    type: 'structure_to_name',
    educationLevel: 'advanced',
    difficulty: 5,
    topic: 'adv_allenes_cumulenes',
    prompt: 'Identify this 4-carbon cumulene with cumulated double bonds at carbons 1 and 2.',
    targetMoleculeName: 'Buta-1,2-diene',
    molecularFormula: 'C₄H₆',
    expectedAnswer: 'buta-1,2-diene',
    acceptedAnswers: ['buta-1,2-diene', '1,2-butadiene', 'methylallene'],
    hints: [
      'Cumulated allene system C1=C2=C3 bonded to a terminal methyl at C4.',
      'IUPAC locants are 1,2-.'
    ],
    explanation: 'Buta-1,2-diene (methylallene) features cumulated double bonds where C2 is sp hybridized and C3 is bonded to a terminal methyl group.',
    structure: {
      name: 'Buta-1,2-diene',
      formula: 'C₄H₆',
      category: 'Cumulene',
      description: 'Four-carbon allene derivative with adjacent double bonds.',
      functionalGroups: ['Cumulene (C=C=C)'],
      atoms: [
        { p: [-1.9, 0, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [-0.65, 0, 0], t: 'C', symbol: 'C', name: 'C2 (sp center)' },
        { p: [0.65, 0, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [1.9, 0.6, 0], t: 'C', symbol: 'C', name: 'C4 (Methyl)' }
      ],
      bonds: [
        { s: 0, e: 1, order: 2 },
        { s: 1, e: 2, order: 2 },
        { s: 2, e: 3, order: 1 }
      ]
    }
  },
  {
    id: 'ch_adv_03',
    type: 'structure_to_name',
    educationLevel: 'advanced',
    difficulty: 5,
    topic: 'adv_non_benzenoid',
    prompt: 'Name this fused bicyclic aromatic hydrocarbon with 10 delocalized pi-electrons.',
    targetMoleculeName: 'Naphthalene',
    molecularFormula: 'C₁₀H₈',
    expectedAnswer: 'naphthalene',
    acceptedAnswers: ['naphthalene', 'bicyclo[4.4.0]deca-1,3,5,7,9-pentaene'],
    hints: [
      'Composed of two fused benzene rings sharing two adjacent carbons.',
      'Formula is C10H8 with 10 pi-electrons (Hückel 4n+2 for n=2).'
    ],
    explanation: 'Naphthalene (C10H8) is the simplest polycyclic aromatic hydrocarbon, having two fused rings with high resonance stabilization energy (61 kcal/mol).',
    structure: {
      name: 'Naphthalene',
      formula: 'C₁₀H₈',
      category: 'Polycyclic Aromatic Hydrocarbon',
      description: 'Two fused benzene rings sharing a common aromatic C-C bond.',
      functionalGroups: ['Aromatic Ring', 'Fused Pi System'],
      atoms: [
        { p: [0, 0.72, 0], t: 'C', symbol: 'C', name: 'C4a (Fusion)' },
        { p: [0, -0.72, 0], t: 'C', symbol: 'C', name: 'C8a (Fusion)' },
        { p: [1.24, 1.42, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [2.44, 0.72, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [2.44, -0.72, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [1.24, -1.42, 0], t: 'C', symbol: 'C', name: 'C4' },
        { p: [-1.24, 1.42, 0], t: 'C', symbol: 'C', name: 'C8' },
        { p: [-2.44, 0.72, 0], t: 'C', symbol: 'C', name: 'C7' },
        { p: [-2.44, -0.72, 0], t: 'C', symbol: 'C', name: 'C6' },
        { p: [-1.24, -1.42, 0], t: 'C', symbol: 'C', name: 'C5' }
      ],
      bonds: [
        { s: 0, e: 1, order: 1 },
        { s: 0, e: 2, order: 2 },
        { s: 2, e: 3, order: 1 },
        { s: 3, e: 4, order: 2 },
        { s: 4, e: 5, order: 1 },
        { s: 5, e: 1, order: 2 },
        { s: 0, e: 6, order: 1 },
        { s: 6, e: 7, order: 2 },
        { s: 7, e: 8, order: 1 },
        { s: 8, e: 9, order: 2 },
        { s: 9, e: 1, order: 1 }
      ]
    }
  },
  {
    id: 'ch_adv_04',
    type: 'structure_to_name',
    educationLevel: 'advanced',
    difficulty: 5,
    topic: 'adv_non_benzenoid',
    prompt: 'Identify this non-benzenoid 10 pi-electron aromatic hydrocarbon featuring fused 7-membered and 5-membered rings and a deep blue color.',
    targetMoleculeName: 'Azulene',
    molecularFormula: 'C₁₀H₈',
    expectedAnswer: 'azulene',
    acceptedAnswers: ['azulene', 'bicyclo[5.3.0]decapentaene'],
    hints: [
      'An isomer of naphthalene with fused 5- and 7-membered rings.',
      'Possesses a permanent dipole moment (1.08 D) due to aromatic charge separation (tropylium + cyclopentadienyl -).'
    ],
    explanation: 'Azulene (C10H8) is a classic non-benzenoid aromatic hydrocarbon. Its dipole moment arises from resonance contribution of an aromatic 6-pi tropylium cation fused to a 6-pi cyclopentadienyl anion.',
    structure: {
      name: 'Azulene',
      formula: 'C₁₀H₈',
      category: 'Non-Benzenoid Aromatic',
      description: 'Deep blue non-benzenoid aromatic isomer of naphthalene with fused 7- and 5-membered rings.',
      functionalGroups: ['Non-Benzenoid Aromatic', 'Dipolar Pi System'],
      atoms: [
        { p: [0, 0.77, 0], t: 'C', symbol: 'C', name: 'C3a' },
        { p: [0, -0.77, 0], t: 'C', symbol: 'C', name: 'C8a' },
        // 5-ring on right
        { p: [1.2, 0.95, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [1.9, 0, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [1.2, -0.95, 0], t: 'C', symbol: 'C', name: 'C3' },
        // 7-ring on left
        { p: [-1.0, 1.4, 0], t: 'C', symbol: 'C', name: 'C4' },
        { p: [-2.2, 0.9, 0], t: 'C', symbol: 'C', name: 'C5' },
        { p: [-2.5, -0.3, 0], t: 'C', symbol: 'C', name: 'C6' },
        { p: [-1.8, -1.3, 0], t: 'C', symbol: 'C', name: 'C7' },
        { p: [-0.7, -1.45, 0], t: 'C', symbol: 'C', name: 'C8' }
      ],
      bonds: [
        { s: 0, e: 1, order: 1 },
        { s: 0, e: 2, order: 2 },
        { s: 2, e: 3, order: 1 },
        { s: 3, e: 4, order: 2 },
        { s: 4, e: 1, order: 1 },
        { s: 0, e: 5, order: 1 },
        { s: 5, e: 6, order: 2 },
        { s: 6, e: 7, order: 1 },
        { s: 7, e: 8, order: 2 },
        { s: 8, e: 9, order: 1 },
        { s: 9, e: 1, order: 2 }
      ]
    }
  },
  {
    id: 'ch_adv_05',
    type: 'name_to_structure',
    educationLevel: 'advanced',
    difficulty: 5,
    topic: 'adv_non_benzenoid',
    prompt: 'Construct the linear tricyclic aromatic hydrocarbon Anthracene (C14H10).',
    targetMoleculeName: 'Anthracene',
    molecularFormula: 'C₁₄H₁₀',
    expectedAnswer: 'anthracene',
    acceptedAnswers: ['anthracene', 'paranaphthalene'],
    hints: [
      'Three benzene rings fused in a straight linear arrangement.',
      'Contains 14 delocalized pi-electrons.'
    ],
    explanation: 'Anthracene (C14H10) is a linear polycyclic aromatic hydrocarbon with reactive 9,10 positions that readily undergo Diels-Alder cycloadditions.',
    structure: {
      name: 'Anthracene',
      formula: 'C₁₄H₁₀',
      category: 'Polycyclic Aromatic Hydrocarbon',
      description: 'Three linearly fused benzene rings with 14 pi-electrons.',
      functionalGroups: ['Aromatic Ring', 'Acene System'],
      atoms: [
        { p: [-2.45, 0.7, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [-3.65, 0, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [-3.65, -1.4, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [-2.45, -2.1, 0], t: 'C', symbol: 'C', name: 'C4' },
        { p: [-1.22, -1.4, 0], t: 'C', symbol: 'C', name: 'C4a' },
        { p: [-1.22, 0, 0], t: 'C', symbol: 'C', name: 'C9a' },
        { p: [0, 0.7, 0], t: 'C', symbol: 'C', name: 'C9' },
        { p: [1.22, 0, 0], t: 'C', symbol: 'C', name: 'C8a' },
        { p: [2.45, 0.7, 0], t: 'C', symbol: 'C', name: 'C5' },
        { p: [3.65, 0, 0], t: 'C', symbol: 'C', name: 'C6' },
        { p: [3.65, -1.4, 0], t: 'C', symbol: 'C', name: 'C7' },
        { p: [2.45, -2.1, 0], t: 'C', symbol: 'C', name: 'C8' },
        { p: [1.22, -1.4, 0], t: 'C', symbol: 'C', name: 'C10a' },
        { p: [0, -2.1, 0], t: 'C', symbol: 'C', name: 'C10' }
      ],
      bonds: [
        { s: 0, e: 1, order: 2 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 2 },
        { s: 3, e: 4, order: 1 },
        { s: 4, e: 5, order: 2 },
        { s: 5, e: 0, order: 1 },
        { s: 5, e: 6, order: 1 },
        { s: 6, e: 7, order: 2 },
        { s: 7, e: 8, order: 1 },
        { s: 8, e: 9, order: 2 },
        { s: 9, e: 10, order: 1 },
        { s: 10, e: 11, order: 2 },
        { s: 11, e: 12, order: 1 },
        { s: 12, e: 7, order: 2 },
        { s: 12, e: 13, order: 1 },
        { s: 13, e: 4, order: 2 }
      ]
    }
  },
  {
    id: 'ch_adv_06',
    type: 'structure_to_name',
    educationLevel: 'advanced',
    difficulty: 5,
    topic: 'adv_non_benzenoid',
    prompt: 'Identify this angular tricyclic aromatic isomer of anthracene featuring a "bay region".',
    targetMoleculeName: 'Phenanthrene',
    molecularFormula: 'C₁₄H₁₀',
    expectedAnswer: 'phenanthrene',
    acceptedAnswers: ['phenanthrene'],
    hints: [
      'Contains three fused benzene rings arranged in an angular bend.',
      'Possesses higher resonance stabilization than its linear isomer anthracene.'
    ],
    explanation: 'Phenanthrene (C14H10) has three fused rings in an angular disposition. The C9-C10 bond has significant double-bond character (K-region) and adds bromine readily.',
    structure: {
      name: 'Phenanthrene',
      formula: 'C₁₄H₁₀',
      category: 'Polycyclic Aromatic Hydrocarbon',
      description: 'Angular tricyclic aromatic hydrocarbon with K-region and bay region.',
      functionalGroups: ['Aromatic Ring', 'Angular Phenacene'],
      atoms: [
        { p: [0, 1.4, 0], t: 'C', symbol: 'C', name: 'C9' },
        { p: [1.2, 0.7, 0], t: 'C', symbol: 'C', name: 'C10' },
        { p: [1.2, -0.7, 0], t: 'C', symbol: 'C', name: 'C10a' },
        { p: [0, -1.4, 0], t: 'C', symbol: 'C', name: 'C4a' },
        { p: [-1.2, -0.7, 0], t: 'C', symbol: 'C', name: 'C4b' },
        { p: [-1.2, 0.7, 0], t: 'C', symbol: 'C', name: 'C8a' },
        { p: [2.4, -1.4, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [3.6, -0.7, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [3.6, 0.7, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [2.4, 1.4, 0], t: 'C', symbol: 'C', name: 'C4' },
        { p: [-2.4, -1.4, 0], t: 'C', symbol: 'C', name: 'C5' },
        { p: [-3.6, -0.7, 0], t: 'C', symbol: 'C', name: 'C6' },
        { p: [-3.6, 0.7, 0], t: 'C', symbol: 'C', name: 'C7' },
        { p: [-2.4, 1.4, 0], t: 'C', symbol: 'C', name: 'C8' }
      ],
      bonds: [
        { s: 0, e: 1, order: 2 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 2 },
        { s: 3, e: 4, order: 1 },
        { s: 4, e: 5, order: 2 },
        { s: 5, e: 0, order: 1 },
        { s: 2, e: 6, order: 1 },
        { s: 6, e: 7, order: 2 },
        { s: 7, e: 8, order: 1 },
        { s: 8, e: 9, order: 2 },
        { s: 9, e: 1, order: 1 },
        { s: 4, e: 10, order: 1 },
        { s: 10, e: 11, order: 2 },
        { s: 11, e: 12, order: 1 },
        { s: 12, e: 13, order: 2 },
        { s: 13, e: 5, order: 1 }
      ]
    }
  },
  {
    id: 'ch_adv_07',
    type: 'structure_to_name',
    educationLevel: 'advanced',
    difficulty: 5,
    topic: 'adv_strained_cages',
    prompt: 'Name this extraordinary synthetic hydrocarbon with 8 carbon vertices forming a perfect geometric cube with 90° C-C-C bond angles.',
    targetMoleculeName: 'Cubane',
    molecularFormula: 'C₈H₈',
    expectedAnswer: 'cubane',
    acceptedAnswers: ['cubane', 'pentacyclo[4.2.0.02,5.03,8.04,7]octane'],
    hints: [
      'Platonic solid hydrocarbon with formula C8H8.',
      'Synthesized by Philip Eaton in 1964 despite extreme 90° angle strain.'
    ],
    explanation: 'Cubane (C8H8) possesses Oh cubic symmetry. Its C-C-C angles are forced to 90° (compared to 109.5° ideal), creating ~166 kcal/mol of total strain energy.',
    structure: {
      name: 'Cubane',
      formula: 'C₈H₈',
      category: 'Platonic Cage Hydrocarbon',
      description: 'Cubic cage hydrocarbon with eight CH vertices and 90° bond angles.',
      functionalGroups: ['Cage System', 'Platonic Hydrocarbon'],
      atoms: [
        { p: [-0.78, 0.78, 0.78], t: 'C', symbol: 'C', name: 'C1' },
        { p: [0.78, 0.78, 0.78], t: 'C', symbol: 'C', name: 'C2' },
        { p: [0.78, -0.78, 0.78], t: 'C', symbol: 'C', name: 'C3' },
        { p: [-0.78, -0.78, 0.78], t: 'C', symbol: 'C', name: 'C4' },
        { p: [-0.78, 0.78, -0.78], t: 'C', symbol: 'C', name: 'C5' },
        { p: [0.78, 0.78, -0.78], t: 'C', symbol: 'C', name: 'C6' },
        { p: [0.78, -0.78, -0.78], t: 'C', symbol: 'C', name: 'C7' },
        { p: [-0.78, -0.78, -0.78], t: 'C', symbol: 'C', name: 'C8' }
      ],
      bonds: [
        // Front face
        { s: 0, e: 1, order: 1 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 3, order: 1 },
        { s: 3, e: 0, order: 1 },
        // Back face
        { s: 4, e: 5, order: 1 },
        { s: 5, e: 6, order: 1 },
        { s: 6, e: 7, order: 1 },
        { s: 7, e: 4, order: 1 },
        // Connecting edges
        { s: 0, e: 4, order: 1 },
        { s: 1, e: 5, order: 1 },
        { s: 2, e: 6, order: 1 },
        { s: 3, e: 7, order: 1 }
      ]
    }
  },
  {
    id: 'ch_adv_08',
    type: 'structure_to_name',
    educationLevel: 'advanced',
    difficulty: 5,
    topic: 'adv_strained_cages',
    prompt: 'Identify this strained valence isomer of benzene forming a triangular prism cage.',
    targetMoleculeName: 'Prismane',
    molecularFormula: 'C₆H₆',
    expectedAnswer: 'prismane',
    acceptedAnswers: ['prismane', 'triprismane', 'tetracyclo[2.2.0.02,6.03,5]hexane'],
    hints: [
      'A triangular prism composed of two parallel 3-membered rings connected by 4-membered faces.',
      'Originally proposed by Albert Ladenburg in 1869 as a possible structure for benzene.'
    ],
    explanation: 'Prismane (C6H6, Ladenburg benzene) is a polycyclic cage hydrocarbon with D3h symmetry consisting of two cyclopropane rings connected to form three cyclobutane faces.',
    structure: {
      name: 'Prismane',
      formula: 'C₆H₆',
      category: 'Cage Valence Isomer',
      description: 'Triangular prism cage hydrocarbon valence isomer of benzene.',
      functionalGroups: ['Cage System'],
      atoms: [
        // Top triangle (z = +0.77)
        { p: [0, 0.89, 0.77], t: 'C', symbol: 'C', name: 'C1' },
        { p: [-0.77, -0.44, 0.77], t: 'C', symbol: 'C', name: 'C2' },
        { p: [0.77, -0.44, 0.77], t: 'C', symbol: 'C', name: 'C3' },
        // Bottom triangle (z = -0.77)
        { p: [0, 0.89, -0.77], t: 'C', symbol: 'C', name: 'C4' },
        { p: [-0.77, -0.44, -0.77], t: 'C', symbol: 'C', name: 'C5' },
        { p: [0.77, -0.44, -0.77], t: 'C', symbol: 'C', name: 'C6' }
      ],
      bonds: [
        // Top triangle
        { s: 0, e: 1, order: 1 },
        { s: 1, e: 2, order: 1 },
        { s: 2, e: 0, order: 1 },
        // Bottom triangle
        { s: 3, e: 4, order: 1 },
        { s: 4, e: 5, order: 1 },
        { s: 5, e: 3, order: 1 },
        // Vertical pillars
        { s: 0, e: 3, order: 1 },
        { s: 1, e: 4, order: 1 },
        { s: 2, e: 5, order: 1 }
      ]
    }
  },
  {
    id: 'ch_adv_09',
    type: 'structure_to_name',
    educationLevel: 'advanced',
    difficulty: 5,
    topic: 'adv_strained_cages',
    prompt: 'Name this barrel-shaped bicyclic triene hydrocarbon with transannular homoconjugation.',
    targetMoleculeName: 'Barrelene',
    molecularFormula: 'C₈H₈',
    expectedAnswer: 'barrelene',
    acceptedAnswers: ['barrelene', 'bicyclo[2.2.2]octa-2,5,7-triene'],
    hints: [
      'Bicyclo[2.2.2]octane skeleton with three double bonds on all three two-carbon bridges.',
      'Named for its visual resemblance to a wooden barrel with D3h symmetry.'
    ],
    explanation: 'Barrelene (bicyclo[2.2.2]octa-2,5,7-triene) possesses three parallel double bonds whose p-orbitals overlap across space (homoconjugation).',
    structure: {
      name: 'Barrelene',
      formula: 'C₈H₈',
      category: 'Bridged Triene Cage',
      description: 'Barrel-shaped D3h triene with homoconjugated double bonds.',
      functionalGroups: ['Alkene (C=C)', 'Bridged Cage'],
      atoms: [
        { p: [0, 0, 1.25], t: 'C', symbol: 'C', name: 'C1 (Bridgehead)' },
        { p: [0, 0, -1.25], t: 'C', symbol: 'C', name: 'C4 (Bridgehead)' },
        // Bridge 1 (double bond)
        { p: [1.3, 0, 0.67], t: 'C', symbol: 'C', name: 'C2' },
        { p: [1.3, 0, -0.67], t: 'C', symbol: 'C', name: 'C3' },
        // Bridge 2 (double bond)
        { p: [-0.65, 1.13, 0.67], t: 'C', symbol: 'C', name: 'C5' },
        { p: [-0.65, 1.13, -0.67], t: 'C', symbol: 'C', name: 'C6' },
        // Bridge 3 (double bond)
        { p: [-0.65, -1.13, 0.67], t: 'C', symbol: 'C', name: 'C7' },
        { p: [-0.65, -1.13, -0.67], t: 'C', symbol: 'C', name: 'C8' }
      ],
      bonds: [
        { s: 0, e: 2, order: 1 },
        { s: 2, e: 3, order: 2 },
        { s: 3, e: 1, order: 1 },
        { s: 0, e: 4, order: 1 },
        { s: 4, e: 5, order: 2 },
        { s: 5, e: 1, order: 1 },
        { s: 0, e: 6, order: 1 },
        { s: 6, e: 7, order: 2 },
        { s: 7, e: 1, order: 1 }
      ]
    }
  },
  {
    id: 'ch_adv_10',
    type: 'name_to_structure',
    educationLevel: 'advanced',
    difficulty: 5,
    topic: 'adv_allenes_cumulenes',
    prompt: 'Construct the chiral spiroalkadiene Spiro[4.4]nona-1,6-diene.',
    targetMoleculeName: 'Spiro[4.4]nona-1,6-diene',
    molecularFormula: 'C₉H₁₂',
    expectedAnswer: 'spiro[4.4]nona-1,6-diene',
    acceptedAnswers: ['spiro[4.4]nona-1,6-diene'],
    hints: [
      'Two cyclopentene rings joined at a single spiro carbon.',
      'Each 5-membered ring contains one double bond starting at the position adjacent to the spiro center.'
    ],
    explanation: 'Spiro[4.4]nona-1,6-diene is an inherently chiral spiro compound having C2 symmetry without any stereogenic centers, showcasing molecular chirality through orthogonal ring geometry.',
    structure: {
      name: 'Spiro[4.4]nona-1,6-diene',
      formula: 'C₉H₁₂',
      category: 'Chiral Spirodiene',
      description: 'Chiral spiro compound with orthogonal cyclopentene rings.',
      functionalGroups: ['Spiro Atom', 'Alkene (C=C)'],
      atoms: [
        { p: [0, 0, 0], t: 'C', symbol: 'C', name: 'C5 (Spiro Center)' },
        // Ring 1 in XY plane
        { p: [-1.2, 0.7, 0], t: 'C', symbol: 'C', name: 'C1' },
        { p: [-2.3, 0, 0], t: 'C', symbol: 'C', name: 'C2' },
        { p: [-2.0, -1.2, 0], t: 'C', symbol: 'C', name: 'C3' },
        { p: [-0.7, -1.2, 0], t: 'C', symbol: 'C', name: 'C4' },
        // Ring 2 in XZ plane
        { p: [1.2, 0, 0.7], t: 'C', symbol: 'C', name: 'C6' },
        { p: [2.3, 0, 0], t: 'C', symbol: 'C', name: 'C7' },
        { p: [2.0, 0, -1.2], t: 'C', symbol: 'C', name: 'C8' },
        { p: [0.7, 0, -1.2], t: 'C', symbol: 'C', name: 'C9' }
      ],
      bonds: [
        { s: 0, e: 1, order: 1 },
        { s: 1, e: 2, order: 2 },
        { s: 2, e: 3, order: 1 },
        { s: 3, e: 4, order: 1 },
        { s: 4, e: 0, order: 1 },
        { s: 0, e: 5, order: 1 },
        { s: 5, e: 6, order: 2 },
        { s: 6, e: 7, order: 1 },
        { s: 7, e: 8, order: 1 },
        { s: 8, e: 0, order: 1 }
      ]
    }
  }
];

/**
 * Returns an active pool of exactly 10 challenges tailored exclusively to the requested education level
 */
export function getInitialActivePool(educationLevel: EducationLevel): Challenge[] {
  const eligible = BASELINE_CHALLENGES.filter(c => c.educationLevel === educationLevel);
  
  if (eligible.length === 0) {
    return BASELINE_CHALLENGES.slice(0, 10);
  }

  // Return the level-specific challenges
  return eligible.slice(0, 10).map((base, idx) => ({
    ...base,
    id: `${base.id}_pool_${idx + 1}`
  }));
}
