import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Molecule } from './components/Molecule';
import { HUD } from './components/HUD';
import { HandTracker } from './components/HandTracker';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [canvasKey, setCanvasKey] = React.useState(0);

  const handleCreated = React.useCallback(({ gl, scene }: any) => {
    gl.setClearColor(new THREE.Color('#020617'), 1.0);
    scene.background = new THREE.Color('#020617');
    const canvasEl = gl.domElement;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost detected! Triggering automatic Canvas remount recovery...');
      setTimeout(() => {
        setCanvasKey(prev => prev + 1);
      }, 200);
    };

    canvasEl.addEventListener('webglcontextlost', handleContextLost, false);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-[#020617]">
      {/* 3D Canvas Scene */}
      <div className="absolute inset-0 bg-[#020617] z-0"></div>
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#020617]">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
        </div>
      }>
        <Canvas 
          key={canvasKey}
          gl={{ 
            antialias: true, 
            alpha: false,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: false
          }} 
          dpr={[1, 1.25]}
          style={{ background: '#020617', backgroundColor: '#020617', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
          onCreated={handleCreated}
        >
          <color attach="background" args={['#020617']} />

          {/* Fallback 3D Space Background Sphere */}
          <mesh scale={[-1, 1, 1]}>
            <sphereGeometry args={[50, 16, 16]} />
            <meshBasicMaterial color="#020617" side={THREE.BackSide} />
          </mesh>
          
          <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
          
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ffffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00f3ff" />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#00f3ff" />
          <spotLight 
            position={[0, 10, 0]} 
            angle={0.5} 
            penumbra={1} 
            intensity={2} 
            color="#00f3ff" 
          />
          
          <Molecule />
          
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minDistance={3} 
            maxDistance={12} 
            rotateSpeed={0.5}
            makeDefault
          />
        </Canvas>
      </Suspense>

      {/* UI Layers on top of 3D Canvas */}
      <HUD />
      <HandTracker />

      {/* Decorative Overlays */}
      <div className="fixed inset-0 pointer-events-none border-[20px] border-cyan-500/10 opacity-60 z-20"></div>
      <div className="fixed top-0 left-0 w-full h-1 bg-cyan-500/30 z-30"></div>
      <div className="fixed bottom-0 left-0 w-full h-1 bg-cyan-500/30 z-30"></div>
    </div>
  );
}
