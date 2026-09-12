import React, { useState } from 'react';
import { useStore } from '../store';
import { MOLECULE_DATA } from '../constants';
import { Atom, Maximize2, RotateCcw, Box, Info, Layers, Beaker, Plus, Sparkles, Gamepad2, GraduationCap } from 'lucide-react';
import { AddHydroModal } from './AddHydroModal';
import { GameHUD } from './GameHUD';

export const HUD: React.FC = () => {
  const { mode, setMode, currentMolecule, setMolecule, customMolecules, catalogList, handActive, bondScale } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If in Game or Builder mode, render GameHUD
  if (mode === 'game' || mode === 'builder') {
    return <GameHUD />;
  }

  // Otherwise in Free Explore Mode
  const activeData = customMolecules[currentMolecule] || MOLECULE_DATA[currentMolecule] || MOLECULE_DATA.Methane;

  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-30 p-8 flex flex-col justify-between select-none">
        {/* Top Left: Title, Specs & Game Mode Switcher */}
        <div className="pointer-events-auto max-w-sm">
          <div className="flex items-center gap-3 mb-2">
            <Atom className="w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white leading-none">
                HOLO<span className="text-cyan-400">HYDRO</span>
              </h1>
              <p className="text-[10px] text-cyan-300/80 font-mono tracking-widest mt-0.5">
                FREE HOLOGRAPHIC MOLECULAR SIMULATOR
              </p>
            </div>
          </div>
          
          <div className="h-[1px] w-full bg-gradient-to-r from-cyan-500/80 to-transparent my-3"></div>

          {/* Quick Enter Game Mode CTA */}
          <button
            onClick={() => setMode('game')}
            className="w-full mb-3 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold font-mono text-xs flex items-center justify-between shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 stroke-[2.5]" />
              <span>ENTER CHEMISTRY GAME ARENA</span>
            </div>
            <GraduationCap className="w-4 h-4" />
          </button>

          {/* Telemetry Panel */}
          <div 
            className="border p-3 rounded space-y-1 font-mono text-[10px]"
            style={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', borderColor: 'rgba(6, 182, 212, 0.4)' }}
          >
            <div className="flex justify-between items-center text-cyan-400">
              <span>INPUT SOURCE:</span>
              <span className={handActive ? 'text-green-400 font-bold' : 'text-amber-400 font-bold'}>
                {handActive ? 'HAND_SENSORS' : 'IDLE_ORBIT'}
              </span>
            </div>
            <div className="flex justify-between items-center text-cyan-400">
              <span>SCALE FACTOR:</span>
              <span className="text-cyan-200 font-bold">{bondScale.toFixed(2)}x</span>
            </div>
            <div className="flex justify-between items-center text-cyan-400">
              <span>ATOMS COUNT:</span>
              <span className="text-cyan-200 font-bold">{activeData.atoms.length} Units</span>
            </div>
          </div>
        </div>

        {/* Top Right: Molecule Chemical Inspector */}
        <div 
          className="pointer-events-auto absolute top-8 right-8 max-w-xs border p-4 rounded shadow-[0_0_20px_rgba(0,243,255,0.15)]"
          style={{ backgroundColor: 'rgba(2, 6, 23, 0.92)', borderColor: 'rgba(6, 182, 212, 0.4)' }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-cyan-500/30 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <Beaker className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider truncate max-w-[150px]">
                {activeData.category}
              </span>
            </div>
            <span className="text-sm font-extrabold font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
              {activeData.formula}
            </span>
          </div>

          <h2 className="text-xl font-black text-white tracking-wide mb-1 leading-tight">
            {activeData.name}
          </h2>

          <p className="text-[11px] text-cyan-100/70 leading-relaxed mb-3">
            {activeData.description}
          </p>

          {/* Functional Groups Tag Cloud */}
          {activeData.functionalGroups && activeData.functionalGroups.length > 0 && (
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-cyan-400/80 uppercase tracking-widest block">
                FUNCTIONAL GROUPS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeData.functionalGroups.map((group) => (
                  <span
                    key={group}
                    className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1"
                  >
                    <Layers className="w-3 h-3 text-cyan-400" />
                    {group}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Middle Right: Molecule Selector Bar with Add Hydrocarbon Button */}
        <div className="pointer-events-auto absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-2 items-end">
          {/* Add Hydrocarbon Action Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-48 mb-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-extrabold font-mono text-xs flex items-center justify-between shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>ADD HYDROCARBON</span>
            </div>
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest mr-2 mb-1">
            MOLECULAR CATALOG ({catalogList.length})
          </span>

          <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {catalogList.map((m) => {
              const mData = customMolecules[m] || MOLECULE_DATA[m];
              if (!mData) return null;
              const isSelected = currentMolecule === m;
              return (
                <button
                  key={m}
                  onClick={() => setMolecule(m)}
                  className={`group relative flex items-center justify-between gap-3 transition-all duration-300 pr-4 pl-3 py-2 border-r-4 rounded-l w-48 text-left cursor-pointer ${
                    isSelected
                      ? 'border-cyan-400 text-white shadow-[0_0_15px_rgba(0,243,255,0.2)] translate-x-[-8px]'
                      : 'border-cyan-950 text-cyan-400/80 hover:text-cyan-200 hover:border-cyan-500/50'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.3)' : 'rgba(2, 6, 23, 0.88)'
                  }}
                >
                  <div className="flex flex-col truncate max-w-[130px]">
                    <span className="text-xs font-bold uppercase tracking-wider font-mono truncate">{m}</span>
                    <span className="text-[9px] text-cyan-300/80 font-mono">{mData.formula}</span>
                  </div>
                  <Box className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400 animate-pulse' : 'text-cyan-800'}`} />

                  {isSelected && (
                    <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-3 h-[2px] bg-cyan-400"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Left: Gesture Manual */}
        <div 
          className="pointer-events-auto max-w-sm p-3.5 rounded border shadow-[0_0_15px_rgba(0,243,255,0.1)]"
          style={{ backgroundColor: 'rgba(2, 6, 23, 0.92)', borderColor: 'rgba(6, 182, 212, 0.4)' }}
        >
          <div className="flex items-center gap-2 mb-2 border-b border-cyan-500/20 pb-1.5">
            <Info className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-cyan-300">
              CONTROLS & GESTURE MANUAL
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="flex items-start gap-2">
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-white font-bold uppercase">3D Rotation</p>
                <p className="text-[9px] text-cyan-300/60">Move wrist / Drag mouse</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-white font-bold uppercase">Scale Bonds</p>
                <p className="text-[9px] text-cyan-300/60">Thumb-Pinky gap / Scroll</p>
              </div>
            </div>
          </div>
        </div>

        {/* Background Reticle Grid */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-15">
          <div className="w-[520px] h-[520px] border border-cyan-500 rounded-full flex items-center justify-center">
            <div className="w-[500px] h-[500px] border border-cyan-500/50 rounded-full border-dashed"></div>
          </div>
        </div>
      </div>

      {/* Add Hydrocarbon Modal */}
      <AddHydroModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
