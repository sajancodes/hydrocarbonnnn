import React, { useState } from 'react';
import { useStore } from '../store';
import { MoleculeData } from '../types';
import { Plus, Beaker, Sparkles, X, Loader2, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { generateProceduralIUPAC } from '../chemistry/generator';

interface AddHydroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_SUGGESTIONS = [
  '2,3-dimethyl-but-2-enoxy',
  '2,3-dimethylbut-2-ene',
  'Cyclohexane',
  'Isopropanol',
  '3-Methylpentane',
  'Propene',
  'Aspirin',
  'Cyclopentane'
];

export const AddHydroModal: React.FC<AddHydroModalProps> = ({ isOpen, onClose }) => {
  const [inputName, setInputName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successSource, setSuccessSource] = useState<string | null>(null);

  const { addCustomMolecule } = useStore();

  if (!isOpen) return null;

  const handleSynthesize = async (targetName?: string) => {
    const nameToQuery = (targetName || inputName).trim();
    if (!nameToQuery) {
      setErrorMsg('Please enter an IUPAC or chemical compound name.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessSource(null);

    try {
      const res = await fetch('/api/generate-molecule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameToQuery })
      });

      const json = await res.json();

      if (json.success && json.molecule) {
        const molData: MoleculeData = json.molecule;
        addCustomMolecule(molData);
        setSuccessSource(json.source || '3D Engine');

        setTimeout(() => {
          setIsLoading(false);
          onClose();
        }, 600);
      } else {
        throw new Error(json.error || 'Failed to generate 3D molecule structure.');
      }
    } catch (err: any) {
      console.warn('API call failed, engaging procedural IUPAC generator fallback:', err);
      try {
        const fallbackMol = generateProceduralIUPAC(nameToQuery);
        addCustomMolecule(fallbackMol as MoleculeData);
        setSuccessSource('3D Generator');
        setTimeout(() => {
          setIsLoading(false);
          onClose();
        }, 600);
      } catch (innerErr: any) {
        setErrorMsg(err.message || 'Error generating 3D molecule structure.');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-lg border rounded-xl shadow-[0_0_40px_rgba(0,243,255,0.2)] overflow-hidden font-sans"
        style={{ backgroundColor: 'rgba(2, 6, 23, 0.96)', borderColor: 'rgba(6, 182, 212, 0.5)' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/30 bg-cyan-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-400/40">
              <Beaker className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                ADD HYDROCARBON / MOLECULE
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              </h3>
              <p className="text-[11px] text-cyan-300/80 font-mono">
                INPUT IUPAC NAME TO GENERATE REAL 3D MOLECULAR STRUCTURE
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

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Main Input Form */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider font-bold">
              CHEMICAL / IUPAC COMPOUND NAME
            </label>

            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-cyan-400/60" />
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSynthesize();
                }}
                placeholder="e.g. 2,3-dimethyl-but-2-enoxy, cyclohexane, isopropanol..."
                disabled={isLoading}
                className="w-full pl-10 pr-24 py-3 bg-slate-900/90 border border-cyan-500/40 rounded-lg text-white placeholder-cyan-500/40 font-mono text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all disabled:opacity-50"
              />

              <button
                onClick={() => handleSynthesize()}
                disabled={isLoading || !inputName.trim()}
                className="absolute right-1.5 px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs rounded-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    BUILDING...
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    SYNTHESIZE
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest block">
              POPULAR IUPAC HYDROCARBON PRESETS:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_SUGGESTIONS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setInputName(preset);
                    handleSynthesize(preset);
                  }}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Status Indicators */}
          {isLoading && (
            <div className="p-3.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center gap-3 font-mono text-xs text-cyan-300 animate-pulse">
              <Loader2 className="w-5 h-5 text-cyan-400 animate-spin shrink-0" />
              <div>
                <p className="font-bold text-white">Quantum 3D Structural Synthesis in Progress...</p>
                <p className="text-[10px] text-cyan-300/70">Computing 3D Cartesian coordinates, bond angles, and valence geometry.</p>
              </div>
            </div>
          )}

          {successSource && (
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-2 font-mono text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>3D Molecule Synthesized Successfully ({successSource})! Loading hologram...</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center gap-2 font-mono text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-cyan-500/20 bg-slate-950/80 flex justify-between items-center font-mono text-[10px] text-cyan-400/60">
          <span>HOLO-SYNTHESIS ENGINE v2.4</span>
          <span>SUPPORTED: ALKANES, ALKENES, ALKYNES, ETHERS, ALCOHOLS</span>
        </div>
      </div>
    </div>
  );
};
