import React, { useRef, useMemo, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';
import { MOLECULE_DATA } from '../constants';
import { autoPopulateHydrogens, validateValency } from '../chemistry/validator';

// Static geometries to prevent WebGL memory churn and context loss
const sphereGeoC = new THREE.SphereGeometry(0.38, 20, 20);
const sphereGeoO = new THREE.SphereGeometry(0.34, 20, 20);
const sphereGeoN = new THREE.SphereGeometry(0.35, 20, 20);
const sphereGeoH = new THREE.SphereGeometry(0.22, 20, 20);

const sphereWireC = new THREE.SphereGeometry(0.38 * 1.12, 12, 12);
const sphereWireO = new THREE.SphereGeometry(0.34 * 1.12, 12, 12);
const sphereWireN = new THREE.SphereGeometry(0.35 * 1.12, 12, 12);
const sphereWireH = new THREE.SphereGeometry(0.22 * 1.12, 12, 12);

interface BondProps {
  start: [number, number, number];
  end: [number, number, number];
  order?: number;
  isGhost?: boolean;
}

const Bond: React.FC<BondProps> = React.memo(({ start, end, order = 1, isGhost = false }) => {
  const sV = useMemo(() => new THREE.Vector3(...start), [start[0], start[1], start[2]]);
  const eV = useMemo(() => new THREE.Vector3(...end), [end[0], end[1], end[2]]);

  const { center, quaternion, len, c1, c2, t1, t2, t3 } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(eV, sV);
    const length = dir.length();
    const ctr = sV.clone().add(dir.clone().multiplyScalar(0.5));
    const normDir = dir.clone().normalize();

    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      normDir
    );

    if (order === 2) {
      let perp = new THREE.Vector3(0, 0, 1).cross(normDir);
      if (perp.lengthSq() < 0.01) {
        perp = new THREE.Vector3(0, 1, 0).cross(normDir);
      }
      perp.normalize().multiplyScalar(0.07);

      return {
        center: ctr,
        quaternion: quat,
        len: length,
        c1: ctr.clone().add(perp),
        c2: ctr.clone().sub(perp),
        t1: null,
        t2: null,
        t3: null
      };
    } else if (order === 3) {
      let perp = new THREE.Vector3(0, 0, 1).cross(normDir);
      if (perp.lengthSq() < 0.01) {
        perp = new THREE.Vector3(0, 1, 0).cross(normDir);
      }
      perp.normalize().multiplyScalar(0.09);

      return {
        center: ctr,
        quaternion: quat,
        len: length,
        c1: null,
        c2: null,
        t1: ctr.clone().add(perp),
        t2: ctr.clone(),
        t3: ctr.clone().sub(perp)
      };
    }

    return { center: ctr, quaternion: quat, len: length, c1: null, c2: null, t1: null, t2: null, t3: null };
  }, [sV, eV, order]);

  const cylRadius = order > 1 ? 0.03 : 0.045;
  const cylGeo = useMemo(() => new THREE.CylinderGeometry(cylRadius, cylRadius, len, 10), [len, cylRadius]);

  const bondColor = isGhost ? '#06b6d4' : '#00f3ff';
  const bondOpacity = isGhost ? 0.35 : 0.75;

  if (order === 2 && c1 && c2) {
    return (
      <group>
        <mesh position={c1} quaternion={quaternion} geometry={cylGeo}>
          <meshStandardMaterial
            color={bondColor}
            transparent
            opacity={bondOpacity}
            emissive={bondColor}
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={c2} quaternion={quaternion} geometry={cylGeo}>
          <meshStandardMaterial
            color={bondColor}
            transparent
            opacity={bondOpacity}
            emissive={bondColor}
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
    );
  }

  if (order === 3 && t1 && t2 && t3) {
    return (
      <group>
        <mesh position={t1} quaternion={quaternion} geometry={cylGeo}>
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={bondOpacity}
            emissive="#38bdf8"
            emissiveIntensity={0.9}
          />
        </mesh>
        <mesh position={t2} quaternion={quaternion} geometry={cylGeo}>
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={bondOpacity}
            emissive="#38bdf8"
            emissiveIntensity={0.9}
          />
        </mesh>
        <mesh position={t3} quaternion={quaternion} geometry={cylGeo}>
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={bondOpacity}
            emissive="#38bdf8"
            emissiveIntensity={0.9}
          />
        </mesh>
      </group>
    );
  }

  return (
    <mesh position={center} quaternion={quaternion} geometry={cylGeo}>
      <meshStandardMaterial
        color={bondColor}
        transparent
        opacity={bondOpacity}
        emissive={bondColor}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
});

interface AtomProps {
  position: [number, number, number];
  type: string;
  symbol: string;
  isSelected?: boolean;
  isHovered?: boolean;
  isGhost?: boolean;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
}

const AtomMesh: React.FC<AtomProps> = React.memo(({ 
  position, 
  type, 
  symbol, 
  isSelected = false, 
  isHovered = false,
  isGhost = false,
  onClick,
  onPointerOver,
  onPointerOut
}) => {
  const cfg = useMemo(() => {
    switch (type.toUpperCase()) {
      case 'C':
        return {
          geo: sphereGeoC,
          wireGeo: sphereWireC,
          radius: 0.38,
          color: '#1e293b',
          emissive: isSelected ? '#38bdf8' : '#00f3ff',
          emissiveIntensity: isSelected ? 1.2 : 0.4,
          textColor: '#00f3ff',
          outlineColor: '#003847'
        };
      case 'O':
        return {
          geo: sphereGeoO,
          wireGeo: sphereWireO,
          radius: 0.34,
          color: '#9f1239',
          emissive: '#ff2a5f',
          emissiveIntensity: isSelected ? 1.2 : 0.7,
          textColor: '#ffffff',
          outlineColor: '#50071c'
        };
      case 'N':
        return {
          geo: sphereGeoN,
          wireGeo: sphereWireN,
          radius: 0.35,
          color: '#1d4ed8',
          emissive: '#3b82f6',
          emissiveIntensity: isSelected ? 1.2 : 0.7,
          textColor: '#ffffff',
          outlineColor: '#1e3a8a'
        };
      case 'S':
        return {
          geo: sphereGeoN,
          wireGeo: sphereWireN,
          radius: 0.37,
          color: '#854d0e',
          emissive: '#eab308',
          emissiveIntensity: 0.7,
          textColor: '#fef08a',
          outlineColor: '#713f12'
        };
      case 'F':
      case 'CL':
      case 'BR':
        return {
          geo: sphereGeoO,
          wireGeo: sphereWireO,
          radius: 0.36,
          color: '#15803d',
          emissive: '#22c55e',
          emissiveIntensity: 0.7,
          textColor: '#ffffff',
          outlineColor: '#14532d'
        };
      default: // H
        return {
          geo: sphereGeoH,
          wireGeo: sphereWireH,
          radius: 0.22,
          color: isGhost ? '#64748b' : '#e2e8f0',
          emissive: isGhost ? '#06b6d4' : '#ffffff',
          emissiveIntensity: isGhost ? 0.4 : 0.8,
          textColor: isGhost ? '#0891b2' : '#0f172a',
          outlineColor: '#00f3ff'
        };
    }
  }, [type, isSelected, isGhost]);

  return (
    <group 
      position={position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Holographic Selection Halo */}
      {(isSelected || isHovered) && (
        <mesh scale={[1.4, 1.4, 1.4]}>
          <sphereGeometry args={[cfg.radius, 16, 16]} />
          <meshBasicMaterial
            color={isSelected ? "#f59e0b" : "#00f3ff"}
            wireframe
            transparent
            opacity={0.6}
          />
        </mesh>
      )}

      {/* Holographic Wireframe Outer Ring */}
      <mesh geometry={cfg.wireGeo}>
        <meshBasicMaterial
          color={cfg.emissive}
          transparent
          opacity={isGhost ? 0.15 : (isSelected ? 0.7 : 0.25)}
          wireframe
        />
      </mesh>

      {/* Main Solid Atom Sphere */}
      <mesh geometry={cfg.geo}>
        <meshStandardMaterial
          color={cfg.color}
          emissive={cfg.emissive}
          emissiveIntensity={cfg.emissiveIntensity}
          roughness={0.15}
          metalness={0.75}
          transparent={isGhost}
          opacity={isGhost ? 0.45 : 1.0}
        />
      </mesh>

      {/* Symbol Text Facing Camera */}
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <Text
          position={[0, 0, cfg.radius + 0.02]}
          fontSize={cfg.radius * 0.95}
          color={cfg.textColor}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          outlineWidth={0.02}
          outlineColor={cfg.outlineColor}
        >
          {symbol}
        </Text>
      </Billboard>
    </group>
  );
});

export const Molecule: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const { 
    mode, 
    activeChallenge, 
    builder, 
    currentMolecule, 
    customMolecules, 
    bondScale, 
    rotation, 
    handActive,
    selectBuilderAtom,
    setHoveredBuilderAtom,
    toggleBuilderBond,
    addBuilderAtom,
    deleteBuilderAtom
  } = useStore();

  const safeScale = Number.isFinite(bondScale) && bondScale > 0 ? bondScale : 1.5;

  // Derive active rendering dataset
  const activeData = useMemo(() => {
    if (mode === 'builder') {
      if (builder.hydrogenMode === 'auto') {
        const autoMol = autoPopulateHydrogens(
          builder.atoms.map(a => ({ p: a.p, symbol: a.symbol })),
          builder.bonds
        );
        return {
          atoms: autoMol.atoms,
          bonds: autoMol.bonds
        };
      }
      return {
        atoms: builder.atoms,
        bonds: builder.bonds
      };
    }

    if (mode === 'game' && activeChallenge) {
      return {
        atoms: activeChallenge.structure.atoms,
        bonds: activeChallenge.structure.bonds
      };
    }

    // Default Explore Mode
    const baseMol = customMolecules[currentMolecule] || MOLECULE_DATA[currentMolecule] || MOLECULE_DATA.Methane;
    return {
      atoms: baseMol.atoms,
      bonds: baseMol.bonds
    };
  }, [mode, activeChallenge, builder.atoms, builder.bonds, builder.hydrogenMode, currentMolecule, customMolecules]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smoothly lerp group scale
      const currentS = groupRef.current.scale.x;
      const nextS = THREE.MathUtils.lerp(currentS, safeScale, 0.15);
      if (Number.isFinite(nextS)) {
        groupRef.current.scale.set(nextS, nextS, nextS);
      }

      // Smoothly lerp rotation
      const rotY = rotation && Number.isFinite(rotation[0]) ? rotation[0] : 0;
      const rotX = rotation && Number.isFinite(rotation[1]) ? rotation[1] : 0;

      const targetY = rotY * Math.PI * 2;
      const targetX = rotX * Math.PI * 2;

      const nextY = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.1);
      const nextX = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.1);

      if (Number.isFinite(nextY)) groupRef.current.rotation.y = nextY;
      if (Number.isFinite(nextX)) groupRef.current.rotation.x = nextX;

      if (!handActive) {
        // Slow holographic idle orbit
        groupRef.current.rotation.y += delta * 0.15;
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
      }
    }
  });

  const handleAtomClick = (index: number, e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (mode !== 'builder') return;

    if (builder.activeTool === 'delete') {
      deleteBuilderAtom(index);
      return;
    }

    if (builder.activeTool === 'bond') {
      if (builder.selectedAtomIndex === null) {
        selectBuilderAtom(index);
      } else {
        toggleBuilderBond(builder.selectedAtomIndex, index);
      }
      return;
    }

    if (builder.activeTool === 'place_atom') {
      // Connect new atom to this clicked atom at smart tetrahedral offset
      const targetAtom = builder.atoms[index];
      if (targetAtom) {
        const dist = 1.45;
        const angle = (builder.atoms.length * 1.8);
        const newPos: [number, number, number] = [
          targetAtom.p[0] + Math.cos(angle) * dist,
          targetAtom.p[1] + Math.sin(angle) * dist * 0.6,
          targetAtom.p[2] + Math.sin(angle) * dist * 0.7
        ];
        addBuilderAtom(newPos);
        toggleBuilderBond(index, builder.atoms.length);
      }
    }
  };

  const handleFloorClick = (e: ThreeEvent<MouseEvent>) => {
    if (mode !== 'builder' || builder.activeTool !== 'place_atom') return;
    const pt = e.point;
    addBuilderAtom([pt.x, pt.y, pt.z]);
  };

  return (
    <group ref={groupRef}>
      {activeData.atoms.map((a, i) => {
        const isSelected = mode === 'builder' && builder.selectedAtomIndex === i;
        const isHovered = mode === 'builder' && builder.hoveredAtomIndex === i;
        const isGhost = mode === 'builder' && builder.hydrogenMode === 'auto' && i >= builder.atoms.length;

        return (
          <AtomMesh
            key={`atom-${i}-${a.symbol}`}
            position={a.p}
            type={a.t}
            symbol={a.symbol}
            isSelected={isSelected}
            isHovered={isHovered}
            isGhost={isGhost}
            onClick={(e) => handleAtomClick(i, e)}
            onPointerOver={() => mode === 'builder' && setHoveredBuilderAtom(i)}
            onPointerOut={() => mode === 'builder' && setHoveredBuilderAtom(null)}
          />
        );
      })}

      {activeData.bonds.map((b, i) => {
        const sAtom = activeData.atoms[b.s];
        const eAtom = activeData.atoms[b.e];
        if (!sAtom || !eAtom) return null;

        const isGhost = mode === 'builder' && builder.hydrogenMode === 'auto' && (b.s >= builder.atoms.length || b.e >= builder.atoms.length);

        return (
          <Bond
            key={`bond-${i}-${b.s}-${b.e}`}
            start={sAtom.p}
            end={eAtom.p}
            order={b.order || 1}
            isGhost={isGhost}
          />
        );
      })}

      {/* Invisible Interactive Floor for Placing Atoms in 3D */}
      {mode === 'builder' && (
        <mesh 
          position={[0, 0, 0]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          onClick={handleFloorClick}
          visible={false}
        >
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}

      {/* Holographic Floor Grid */}
      <gridHelper
        args={[12, 24, 0x00ffff, 0x004444]}
        position={[0, -3, 0]}
        transparent
        opacity={0.15}
      />
    </group>
  );
};
