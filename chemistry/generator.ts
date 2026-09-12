import { GoogleGenAI, Type } from '@google/genai';
import { BASELINE_CHALLENGES } from './curriculum';
import { validateValency } from './validator';

export function parseSDF3D(sdfText: string, searchName: string, formulaStr?: string, iupacStr?: string) {
  const lines = sdfText.split('\n');
  let countsLineIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('V2000')) {
      countsLineIndex = i;
      break;
    }
  }

  if (countsLineIndex === -1) return null;

  const countsLine = lines[countsLineIndex];
  const numAtoms = parseInt(countsLine.substring(0, 3).trim(), 10);
  const numBonds = parseInt(countsLine.substring(3, 6).trim(), 10);

  if (isNaN(numAtoms) || numAtoms <= 0) return null;

  const atoms: any[] = [];
  let cx = 0, cy = 0, cz = 0;

  for (let i = countsLineIndex + 1; i <= countsLineIndex + numAtoms; i++) {
    const line = lines[i];
    if (!line) continue;
    const x = parseFloat(line.substring(0, 10).trim());
    const y = parseFloat(line.substring(10, 20).trim());
    const z = parseFloat(line.substring(20, 30).trim());
    const symbol = line.substring(31, 34).trim();

    cx += x;
    cy += y;
    cz += z;

    const elem = symbol.toUpperCase();
    let t: 'C' | 'H' | 'O' | 'N' = 'C';
    if (elem === 'H') t = 'H';
    else if (elem === 'O') t = 'O';
    else if (elem === 'N') t = 'N';

    atoms.push({
      p: [x, y, z],
      t,
      symbol: elem,
      name: `${elem} ${atoms.length + 1}`
    });
  }

  // Center around origin
  cx /= numAtoms;
  cy /= numAtoms;
  cz /= numAtoms;
  for (const a of atoms) {
    a.p[0] = Math.round((a.p[0] - cx) * 100) / 100;
    a.p[1] = Math.round((a.p[1] - cy) * 100) / 100;
    a.p[2] = Math.round((a.p[2] - cz) * 100) / 100;
  }

  const bonds: any[] = [];
  const bondsStartIndex = countsLineIndex + numAtoms + 1;
  for (let i = bondsStartIndex; i < bondsStartIndex + numBonds; i++) {
    const line = lines[i];
    if (!line || line.length < 9) continue;
    const s = parseInt(line.substring(0, 3).trim(), 10) - 1;
    const e = parseInt(line.substring(3, 6).trim(), 10) - 1;
    const order = parseInt(line.substring(6, 9).trim(), 10) || 1;
    if (s >= 0 && s < numAtoms && e >= 0 && e < numAtoms) {
      bonds.push({ s, e, order: order > 3 ? 1 : order });
    }
  }

  return {
    name: searchName,
    formula: formulaStr || 'C₆H₁₂',
    category: 'Hydrocarbon / PubChem 3D',
    description: `Real 3D conformer structure of ${searchName} (${iupacStr || searchName}) retrieved from PubChem 3D database.`,
    functionalGroups: ['Hydrocarbon Structure'],
    atoms,
    bonds
  };
}

export function generateProceduralIUPAC(rawName: string) {
  const name = rawName.toLowerCase().replace(/\s+/g, '');
  const isEnoxy = name.includes('enoxy') || name.includes('oxy');
  
  const atoms: any[] = [];
  const bonds: any[] = [];

  if (name.includes('dimethyl') || name.includes('dimethyal') || name.includes('but')) {
    atoms.push({ p: [-2.1, 0.7, 0], t: 'C', symbol: 'C', name: 'C1 (Methyl)' });
    atoms.push({ p: [-0.7, 0, 0], t: 'C', symbol: 'C', name: 'C2 (sp2 Alkene C)' });
    atoms.push({ p: [0.7, 0, 0], t: 'C', symbol: 'C', name: 'C3 (sp2 Alkene C)' });
    atoms.push({ p: [2.1, -0.7, 0], t: 'C', symbol: 'C', name: 'C4 (Methyl)' });
    atoms.push({ p: [-0.7, -1.4, 0], t: 'C', symbol: 'C', name: 'C5 (Methyl on C2)' });

    if (isEnoxy) {
      atoms.push({ p: [0.7, 1.4, 0], t: 'O', symbol: 'O', name: 'O (Enoxy Oxygen)' });
      atoms.push({ p: [1.5, 2.0, 0], t: 'H', symbol: 'H', name: 'H (Oxygen Radical/H)' });
    } else {
      atoms.push({ p: [0.7, 1.4, 0], t: 'C', symbol: 'C', name: 'C6 (Methyl on C3)' });
    }

    bonds.push({ s: 0, e: 1, order: 1 });
    bonds.push({ s: 1, e: 2, order: 2 });
    bonds.push({ s: 2, e: 3, order: 1 });
    bonds.push({ s: 1, e: 4, order: 1 });
    bonds.push({ s: 2, e: 5, order: 1 });
    if (isEnoxy) {
      bonds.push({ s: 5, e: 6, order: 1 });
    }

    const addMethylHydrogens = (cIdx: number, basePos: [number, number, number]) => {
      const hOffsets: [number, number, number][] = [
        [0.6, 0.6, 0.7],
        [0.6, 0.6, -0.7],
        [-0.8, 0.6, 0]
      ];
      for (const off of hOffsets) {
        const hIdx = atoms.length;
        atoms.push({
          p: [
            Math.round((basePos[0] + off[0]) * 100) / 100,
            Math.round((basePos[1] + off[1]) * 100) / 100,
            Math.round((basePos[2] + off[2]) * 100) / 100
          ],
          t: 'H',
          symbol: 'H',
          name: 'H'
        });
        bonds.push({ s: cIdx, e: hIdx, order: 1 });
      }
    };

    addMethylHydrogens(0, [-2.1, 0.7, 0]);
    addMethylHydrogens(3, [2.1, -0.7, 0]);
    addMethylHydrogens(4, [-0.7, -1.4, 0]);
    if (!isEnoxy) {
      addMethylHydrogens(5, [0.7, 1.4, 0]);
    }

    return {
      name: rawName,
      formula: isEnoxy ? 'C₆H₁₁O' : 'C₆H₁₂',
      category: isEnoxy ? 'Enoxy / Branched Alkene Radical' : 'Tetrasubstituted Alkene Hydrocarbon',
      description: `3D structure of ${rawName} featuring a central C=C double bond (1.34 Å) with attached methyl branches and tetrahedral H positions.`,
      functionalGroups: isEnoxy ? ['Alkene (C=C)', 'Enoxy (-O-)', 'Methyl (-CH₃)'] : ['Alkene (C=C)', 'Methyl Branches (-CH₃)'],
      atoms,
      bonds
    };
  }

  // Default fallback
  const numCarbons = 6;
  for (let i = 0; i < numCarbons; i++) {
    const angle = (i / numCarbons) * Math.PI * 2;
    const r = 1.4;
    const x = Math.round(Math.cos(angle) * r * 100) / 100;
    const y = Math.round(Math.sin(angle) * r * 100) / 100;
    atoms.push({ p: [x, y, 0], t: 'C', symbol: 'C', name: `Carbon ${i + 1}` });
  }
  for (let i = 0; i < numCarbons; i++) {
    bonds.push({ s: i, e: (i + 1) % numCarbons, order: i % 2 === 0 ? 2 : 1 });
  }

  return {
    name: rawName,
    formula: 'C₆H₁₂',
    category: 'Custom Hydrocarbon',
    description: `3D molecular geometry representation generated for ${rawName}.`,
    functionalGroups: ['Hydrocarbon Ring / Chain'],
    atoms,
    bonds
  };
}

export async function generateMoleculeData(queryName: string): Promise<{ success: boolean; molecule: any; source: string }> {
  // 1. First try Gemini API if API key is present
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const systemPrompt = `You are an expert computational chemist and structural molecular scientist.
Convert the given chemical or IUPAC compound name into exact, realistic 3D atomic Cartesian coordinates in Angstroms centered around [0,0,0], with accurate 3D geometry (e.g., tetrahedral ~109.5°, trigonal planar ~120°, linear 180°), proper bond orders (1 for single, 2 for double, 3 for triple), formula, category, description, and functional groups.

Rules:
1. Coordinates 'p' MUST be realistic 3D float arrays [x, y, z] in Angstroms centered at origin (0,0,0). Typical C-C distance ~1.3-1.5, C-H ~1.0-1.1, C-O ~1.4, C=O ~1.2.
2. Atom types 't' MUST be uppercase element symbols like 'C', 'H', 'O', 'N', 'S', 'F', 'Cl', 'Br'.
3. 'bonds' array contains 's' (start atom 0-based index) and 'e' (end atom 0-based index) and 'order' (1, 2, or 3).
4. Do not omit any Hydrogen atoms necessary for standard valency unless explicitly specified as an radical/ion.
5. Provide concise scientific description and functional groups array.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate 3D molecular structure data for the compound: "${queryName}"`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Capitalized formal chemical or IUPAC name' },
              formula: { type: Type.STRING, description: 'Hill formula string, e.g., C6H11O or C6H12' },
              category: { type: Type.STRING, description: 'Organic class, e.g., Branched Alkene, Alkoxy Radical, Functionalized Hydrocarbon' },
              description: { type: Type.STRING, description: '1-2 sentence detailed chemical description' },
              functionalGroups: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of functional groups present in molecule'
              },
              atoms: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    p: {
                      type: Type.ARRAY,
                      items: { type: Type.NUMBER },
                      description: '3D coordinates [x, y, z] in Angstroms centered near origin'
                    },
                    t: { type: Type.STRING, description: 'Element symbol e.g. C, H, O, N' },
                    symbol: { type: Type.STRING, description: 'Element symbol e.g. C, H, O, N' },
                    name: { type: Type.STRING, description: 'Atom label e.g. Carbon 1 or Hydroxyl Oxygen' }
                  },
                  required: ['p', 't', 'symbol']
                }
              },
              bonds: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    s: { type: Type.INTEGER, description: '0-based index of start atom' },
                    e: { type: Type.INTEGER, description: '0-based index of end atom' },
                    order: { type: Type.INTEGER, description: 'Bond order: 1, 2, or 3' }
                  },
                  required: ['s', 'e']
                }
              }
            },
            required: ['name', 'formula', 'category', 'description', 'functionalGroups', 'atoms', 'bonds']
          }
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text.trim());
        if (data.atoms && data.atoms.length > 0) {
          return { success: true, molecule: data, source: 'gemini' };
        }
      }
    } catch (err) {
      console.warn('Gemini molecule generation attempt failed, using PubChem / Procedural fallback:', err);
    }
  }

  // 2. PubChem REST API Fallback
  try {
    const pubchemUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(queryName)}/property/Title,IUPACName,MolecularFormula,CanonicalSMILES/JSON`;
    const pubRes = await fetch(pubchemUrl);
    if (pubRes.ok) {
      const pubData = await pubRes.json();
      const compoundProps = pubData?.PropertyTable?.Properties?.[0];
      if (compoundProps) {
        const cid = compoundProps.CID;
        if (cid) {
          const sdfUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/SDF?record_type=3d`;
          const sdfRes = await fetch(sdfUrl);
          if (sdfRes.ok) {
            const sdfText = await sdfRes.text();
            const parsedSdf = parseSDF3D(sdfText, queryName, compoundProps.MolecularFormula, compoundProps.IUPACName || queryName);
            if (parsedSdf && parsedSdf.atoms.length > 0) {
              return { success: true, molecule: parsedSdf, source: 'pubchem' };
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('PubChem lookup failed, using procedural IUPAC engine:', err);
  }

  // 3. Fallback: Procedural IUPAC Generator
  const proceduralMol = generateProceduralIUPAC(queryName);
  return { success: true, molecule: proceduralMol, source: 'procedural' };
}

export async function generateQuestionsData(
  educationLevel: string = 'class_11',
  count: number = 3,
  weakTopics: string[] = []
): Promise<{ success: boolean; questions: any[]; source: string }> {
  const validLevel = ['class_11', 'class_12', 'engineering', 'advanced'].includes(educationLevel)
    ? educationLevel
    : 'class_11';

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const levelDifficultyMap: Record<string, string> = {
        class_11: 'Difficulty 1-2 (Foundation: Alkanes, basic branched alkanes, simple alkenes, small cycloalkanes)',
        class_12: 'Difficulty 2-3 (Intermediate: Dienes, constitutional isomers, cis/trans stereoisomers, benzene, xylenes)',
        engineering: 'Difficulty 3-4 (Competitive Entrance: Complex polysubstituted IUPAC, enynes, norbornane/decalin bicyclics, spiroalkanes)',
        advanced: 'Difficulty 4-5 (Olympiad / Research: Cumulenes, allenes, non-benzenoid aromatics like azulene, strained cages like cubane/prismane)'
      };

      const promptText = `Generate ${count} distinct, high-quality chemistry game challenges strictly for educational level: "${validLevel}".
Target difficulty and scope: ${levelDifficultyMap[validLevel]}.
Focus preferentially on concepts related to: ${weakTopics.length > 0 ? weakTopics.join(', ') : 'Hydrocarbons, IUPAC nomenclature, isomerism, bonding geometry'}.
Ensure the difficulty integer (1 to 5) precisely matches this target level.
Make a mixture of 'structure_to_name' (identifying 3D structure) and 'name_to_structure' (constructing 3D structure from IUPAC name).
Ensure all generated 3D Cartesian coordinates are centered at origin, chemically accurate in Angstroms, with valid bond valency (Carbon = 4, Hydrogen = 1, Oxygen = 2, Nitrogen = 3).`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
        config: {
          systemInstruction: `You are an expert computational chemistry educator creating 3D hydrocarbon challenges.
Strict rules:
1. All generated questions must adhere strictly to curriculum for ${validLevel}.
2. Ensure atom coordinates 'p' form valid 3D geometry.
3. Output valid JSON array matching the schema.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['structure_to_name', 'name_to_structure', 'formula_to_structure', 'isomer_challenge'] },
                educationLevel: { type: Type.STRING },
                difficulty: { type: Type.INTEGER, description: '1 to 5' },
                topic: { type: Type.STRING },
                prompt: { type: Type.STRING },
                targetMoleculeName: { type: Type.STRING },
                molecularFormula: { type: Type.STRING },
                expectedAnswer: { type: Type.STRING },
                acceptedAnswers: { type: Type.ARRAY, items: { type: Type.STRING } },
                hints: { type: Type.ARRAY, items: { type: Type.STRING } },
                explanation: { type: Type.STRING },
                structure: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    formula: { type: Type.STRING },
                    category: { type: Type.STRING },
                    description: { type: Type.STRING },
                    functionalGroups: { type: Type.ARRAY, items: { type: Type.STRING } },
                    atoms: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          p: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                          t: { type: Type.STRING },
                          symbol: { type: Type.STRING },
                          name: { type: Type.STRING }
                        },
                        required: ['p', 't', 'symbol']
                      }
                    },
                    bonds: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          s: { type: Type.INTEGER },
                          e: { type: Type.INTEGER },
                          order: { type: Type.INTEGER }
                        },
                        required: ['s', 'e']
                      }
                    }
                  },
                  required: ['name', 'formula', 'category', 'description', 'functionalGroups', 'atoms', 'bonds']
                }
              },
              required: [
                'id',
                'type',
                'educationLevel',
                'difficulty',
                'topic',
                'prompt',
                'targetMoleculeName',
                'expectedAnswer',
                'acceptedAnswers',
                'hints',
                'explanation',
                'structure'
              ]
            }
          }
        }
      });

      if (response.text) {
        const rawList = JSON.parse(response.text.trim());
        const validatedList: any[] = [];

        for (const item of rawList) {
          if (item.structure && item.structure.atoms && item.structure.bonds) {
            const vReport = validateValency(item.structure.atoms, item.structure.bonds);
            if (vReport.isValid || vReport.errors.length === 0) {
              item.educationLevel = validLevel;
              if (!item.acceptedAnswers || item.acceptedAnswers.length === 0) {
                item.acceptedAnswers = [item.expectedAnswer, item.targetMoleculeName];
              }
              validatedList.push(item);
            }
          }
        }

        if (validatedList.length > 0) {
          return { success: true, questions: validatedList, source: 'gemini' };
        }
      }
    } catch (err) {
      console.warn('AI question generation error, using deterministic fallback pool:', err);
    }
  }

  // Fallback to baseline curriculum
  const matching = BASELINE_CHALLENGES.filter(c => c.educationLevel === validLevel);
  const pool = matching.length > 0 ? matching : BASELINE_CHALLENGES;
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const sampled = shuffled.slice(0, count).map((q, i) => ({
    ...q,
    id: `synth_${Date.now()}_${i}`
  }));

  return { success: true, questions: sampled, source: 'fallback' };
}
