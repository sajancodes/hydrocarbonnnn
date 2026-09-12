import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useStore } from '../store';
import { Activity, CameraOff, Video, VideoOff, Move, RotateCcw, GripHorizontal } from 'lucide-react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

let sharedLandmarker: HandLandmarker | null = null;
let landmarkerPromise: Promise<HandLandmarker> | null = null;

async function getHandLandmarker() {
  if (sharedLandmarker) return sharedLandmarker;
  if (landmarkerPromise) return landmarkerPromise;
  
  landmarkerPromise = (async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
    );
    const handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        // IMPORTANT: We use CPU to completely avoid WebGL context loss conflicts with Three.js
        delegate: "CPU"
      },
      runningMode: "VIDEO",
      numHands: 1,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    sharedLandmarker = handLandmarker;
    return handLandmarker;
  })();
  return landmarkerPromise;
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export const HandTracker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  // Draggable & Resizable State
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 240, height: 180 });
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const setHandData = useStore(s => s.setHandData);

  const toggleCamera = useCallback(() => {
    setCameraEnabled(prev => !prev);
  }, []);

  // Initialize position to bottom right of viewport
  useEffect(() => {
    const initPos = () => {
      const margin = 24;
      const x = Math.max(16, window.innerWidth - 240 - margin);
      const y = Math.max(16, window.innerHeight - 180 - 64);
      setPosition({ x, y });
    };

    if (!position) {
      initPos();
    }

    const handleWindowResize = () => {
      setPosition(prev => {
        if (!prev) return null;
        const clampedX = Math.min(Math.max(8, prev.x), Math.max(8, window.innerWidth - size.width - 8));
        const clampedY = Math.min(Math.max(8, prev.y), Math.max(8, window.innerHeight - size.height - 8));
        return { x: clampedX, y: clampedY };
      });
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [size.width, size.height, position]);

  // Reset to default bottom-right position
  const resetPosition = useCallback(() => {
    const margin = 24;
    setPosition({
      x: Math.max(16, window.innerWidth - size.width - margin),
      y: Math.max(16, window.innerHeight - size.height - 64)
    });
  }, [size.width, size.height]);

  // Set preset size
  const applyPresetSize = useCallback((w: number, h: number) => {
    setSize({ width: w, height: h });
    setPosition(prev => {
      if (!prev) return null;
      return {
        x: Math.min(Math.max(8, prev.x), Math.max(8, window.innerWidth - w - 8)),
        y: Math.min(Math.max(8, prev.y), Math.max(8, window.innerHeight - h - 8))
      };
    });
  }, []);

  // Handle Dragging Window Anywhere
  const handleDragPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if (!position) return;

    e.preventDefault();
    setIsDragging(true);

    const startPos = { ...position };
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;

    const handlePointerMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startMouseX;
      const dy = ev.clientY - startMouseY;
      const nextX = Math.min(Math.max(8, startPos.x + dx), window.innerWidth - size.width - 8);
      const nextY = Math.min(Math.max(8, startPos.y + dy), window.innerHeight - size.height - 8);
      setPosition({ x: nextX, y: nextY });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Handle Resizing From Edges & Corners
  const handleResizePointerDown = (dir: ResizeDirection, e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!position) return;

    setIsResizing(true);
    const startSize = { ...size };
    const startPos = { ...position };
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;

    const handlePointerMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startMouseX;
      const dy = ev.clientY - startMouseY;

      let newW = startSize.width;
      let newH = startSize.height;
      let newX = startPos.x;
      let newY = startPos.y;

      const minW = 160;
      const maxW = Math.min(640, window.innerWidth - 32);
      const minH = 120;
      const maxH = Math.min(480, window.innerHeight - 32);

      if (dir.includes('e')) {
        newW = Math.max(minW, Math.min(maxW, startSize.width + dx));
      }
      if (dir.includes('w')) {
        const candidateW = startSize.width - dx;
        newW = Math.max(minW, Math.min(maxW, candidateW));
        newX = startPos.x + (startSize.width - newW);
      }
      if (dir.includes('s')) {
        newH = Math.max(minH, Math.min(maxH, startSize.height + dy));
      }
      if (dir.includes('n')) {
        const candidateH = startSize.height - dy;
        newH = Math.max(minH, Math.min(maxH, candidateH));
        newY = startPos.y + (startSize.height - newH);
      }

      setSize({ width: Math.round(newW), height: Math.round(newH) });
      setPosition({
        x: Math.min(Math.max(8, newX), window.innerWidth - newW - 8),
        y: Math.min(Math.max(8, newY), window.innerHeight - newH - 8)
      });
    };

    const handlePointerUp = () => {
      setIsResizing(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  useEffect(() => {
    let isSubscribed = true;

    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (!cameraEnabled) {
      setCameraActive(false);
      setIsInitializing(false);
      setHandData(false, 1.5, [0, 0]);
      return;
    }

    const startTracker = async () => {
      setIsInitializing(true);
      setErrorState(null);

      try {
        const handLandmarker = await getHandLandmarker();
        if (!isSubscribed) return;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 320 },
            height: { ideal: 240 },
            facingMode: 'user'
          },
          audio: false
        });

        if (!isSubscribed) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }

        if (isSubscribed) {
          setCameraActive(true);
          setIsInitializing(false);
          setErrorState(null);
        }

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
        let lastProcessTime = 0;
        let isProcessingFrame = false;

        const renderLoop = () => {
          if (!isSubscribed) return;

          const now = performance.now();
          const video = videoRef.current;
          
          if (
            video && 
            video.readyState >= 2 && 
            video.videoWidth > 10 && 
            video.videoHeight > 10 && 
            !video.paused && 
            !video.ended && 
            !isProcessingFrame
          ) {
            // Throttle detection to ~15 FPS (every 66ms) to keep CPU & GPU silky smooth
            if (now - lastProcessTime > 66) {
              lastProcessTime = now;
              isProcessingFrame = true;
              
              try {
                const vw = video.videoWidth;
                const vh = video.videoHeight;

                if (tempCanvas.width !== vw || tempCanvas.height !== vh) {
                  tempCanvas.width = vw;
                  tempCanvas.height = vh;
                }
                
                if (tempCtx) {
                  // Draw frame to 2D canvas safely
                  tempCtx.drawImage(video, 0, 0, vw, vh);
                  
                  // Run MediaPipe detection on valid 2D canvas frame
                  const results = handLandmarker.detectForVideo(tempCanvas, now);

                  // Draw landmarks on HUD overlay canvas
                  if (canvasRef.current) {
                    const ctx = canvasRef.current.getContext('2d');
                    if (ctx) {
                      if (canvasRef.current.width !== vw) canvasRef.current.width = vw;
                      if (canvasRef.current.height !== vh) canvasRef.current.height = vh;
                      ctx.clearRect(0, 0, vw, vh);

                      if (results.landmarks && results.landmarks.length > 0) {
                        const landmarks = results.landmarks[0];
                        ctx.fillStyle = '#00f3ff';
                        ctx.strokeStyle = 'rgba(0, 243, 255, 0.5)';
                        ctx.lineWidth = 1.5;

                        for (const lm of landmarks) {
                          const cx = (1 - lm.x) * vw;
                          const cy = lm.y * vh;
                          ctx.beginPath();
                          ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
                          ctx.fill();
                        }
                      }
                    }
                  }

                  // Update global 3D molecule state
                  if (results.landmarks && results.landmarks.length > 0) {
                    const landmarks = results.landmarks[0];
                    if (landmarks[0] && landmarks[4] && landmarks[20]) {
                      const p0 = landmarks[0];
                      const p4 = landmarks[4];
                      const p20 = landmarks[20];

                      const rotX = (p0.y - 0.7) * 2;
                      const rotY = (p0.x - 0.5) * 2;

                      const dx = p4.x - p20.x;
                      const dy = p4.y - p20.y;
                      const dist = Math.sqrt(dx * dx + dy * dy);

                      const scale = Math.max(0.8, Math.min(3, 1 + dist * 5));
                      
                      if (Number.isFinite(rotX) && Number.isFinite(rotY) && Number.isFinite(scale)) {
                        setHandData(true, scale, [rotY, rotX]);
                      } else {
                        setHandData(false, 1.5, [0, 0]);
                      }
                    } else {
                      setHandData(false, 1.5, [0, 0]);
                    }
                  } else {
                    setHandData(false, 1.5, [0, 0]);
                  }
                }
              } catch (e) {
                console.warn("MediaPipe processing frame caught exception:", e);
              } finally {
                isProcessingFrame = false;
              }
            }
          }

          if (isSubscribed) {
            animFrameRef.current = requestAnimationFrame(renderLoop);
          }
        };

        animFrameRef.current = requestAnimationFrame(renderLoop);

      } catch (err: any) {
        if (isSubscribed) {
          setIsInitializing(false);
          setCameraActive(false);
          setErrorState(err?.name === "NotAllowedError" ? "PERMISSION DENIED" : "CAMERA DISCONNECTED");
        }
      }
    };

    startTracker();

    return () => {
      isSubscribed = false;
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setHandData(false, 1.5, [0, 0]);
    };
  }, [cameraEnabled, setHandData]);

  if (!cameraEnabled) {
    return (
      <div 
        className="fixed z-50 transition-transform"
        style={
          position 
            ? { left: `${position.x}px`, top: `${position.y}px` } 
            : { right: '24px', bottom: '24px' }
        }
      >
        <button
          onClick={toggleCamera}
          className="flex items-center gap-2 border border-slate-700 bg-slate-950/90 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 text-xs px-3 py-1.5 rounded-xl transition-all shadow-lg cursor-pointer backdrop-blur-md"
          title="Enable Hand Tracking Camera"
        >
          <VideoOff className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold">ENABLE SENSORS</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`fixed z-50 group/cam flex flex-col select-none transition-shadow ${
        isDragging || isResizing ? 'shadow-[0_0_35px_rgba(0,243,255,0.4)]' : 'shadow-[0_0_20px_rgba(0,0,0,0.6)]'
      }`}
      style={{
        left: position ? `${position.x}px` : undefined,
        top: position ? `${position.y}px` : undefined,
        right: !position ? '24px' : undefined,
        bottom: !position ? '24px' : undefined,
        width: `${size.width}px`
      }}
    >
      {/* Draggable Top Bar with Controls */}
      <div
        onPointerDown={handleDragPointerDown}
        className="flex items-center justify-between px-2.5 py-1.5 rounded-t-xl bg-slate-950/95 border-t border-x border-cyan-500/40 backdrop-blur-xl cursor-grab active:cursor-grabbing border-b border-cyan-500/20"
        title="Drag header to move camera anywhere on the screen"
      >
        <div className="flex items-center gap-1.5">
          <GripHorizontal className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-[10px] font-bold tracking-wider text-cyan-300 uppercase">
            CAMERA SENSOR
          </span>
        </div>

        {/* Action Controls: Size Presets, Reset Pos, Toggle */}
        <div className="flex items-center gap-1">
          {/* Quick Size Presets */}
          <div className="flex items-center bg-slate-900/90 rounded border border-cyan-500/30 p-0.5">
            <button
              onClick={() => applyPresetSize(180, 135)}
              className={`px-1 py-0.5 text-[9px] rounded font-bold cursor-pointer transition-colors ${
                size.width <= 200 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-cyan-300'
              }`}
              title="Compact Size (180x135)"
            >
              S
            </button>
            <button
              onClick={() => applyPresetSize(260, 195)}
              className={`px-1 py-0.5 text-[9px] rounded font-bold cursor-pointer transition-colors ${
                size.width > 200 && size.width <= 300 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-cyan-300'
              }`}
              title="Standard Size (260x195)"
            >
              M
            </button>
            <button
              onClick={() => applyPresetSize(360, 270)}
              className={`px-1 py-0.5 text-[9px] rounded font-bold cursor-pointer transition-colors ${
                size.width > 300 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-cyan-300'
              }`}
              title="Large Size (360x270)"
            >
              L
            </button>
          </div>

          {/* Reset position */}
          <button
            onClick={resetPosition}
            className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Snap camera to bottom-right"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          {/* Disable / Enable Camera */}
          <button
            onClick={toggleCamera}
            className="p-1 rounded text-cyan-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Disable Sensor Feed"
          >
            <Video className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Video & Canvas Container with Interactive Edge Handles */}
      <div 
        className="relative overflow-hidden rounded-b-xl border-b border-x border-cyan-500/50 bg-[#020617]"
        style={{ width: `${size.width}px`, height: `${size.height}px` }}
      >
        <video 
          ref={videoRef} 
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1] opacity-60 mix-blend-screen"
        />
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] border border-cyan-500/30 z-20">
          <Activity className={`w-2.5 h-2.5 ${cameraActive ? 'text-green-400 animate-pulse' : 'text-amber-400'}`} />
          <span className="uppercase tracking-widest font-mono text-cyan-300">
            {isInitializing ? 'INITIALIZING...' : cameraActive ? 'LIVE' : 'STANDBY'}
          </span>
        </div>

        {/* Initialization or Standby Overlay */}
        {(!cameraActive || isInitializing) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm z-20 px-3 text-center pointer-events-none">
            <CameraOff className="w-7 h-7 text-cyan-500/50 mb-1.5 animate-pulse" />
            <span className="text-[9px] text-cyan-400/90 font-mono tracking-wider">
              {isInitializing 
                ? 'COMPUTING SENSORS...' 
                : (errorState ? errorState.toUpperCase() : 'MANUAL ORBIT ACTIVE')}
            </span>
          </div>
        )}

        {/* Hover Hint: Resize & Drag Guide */}
        <div className="absolute bottom-1 right-1.5 z-20 pointer-events-none opacity-0 group-hover/cam:opacity-100 transition-opacity text-[8px] font-mono text-cyan-300/80 bg-slate-950/70 px-1 rounded">
          DRAG EDGES TO RESIZE
        </div>

        {/* Visual Corner Brackets */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400/70 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400/70 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400/70 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400/70 pointer-events-none"></div>

        {/* Interactive Resize Edge Handles */}
        {/* Top Edge */}
        <div
          onPointerDown={(e) => handleResizePointerDown('n', e)}
          className="absolute top-0 left-3 right-3 h-2 cursor-ns-resize z-30 group/edge"
          title="Drag edge to resize camera"
        >
          <div className="w-full h-0.5 bg-cyan-400/0 group-hover/edge:bg-cyan-400 transition-colors"></div>
        </div>

        {/* Bottom Edge */}
        <div
          onPointerDown={(e) => handleResizePointerDown('s', e)}
          className="absolute bottom-0 left-3 right-3 h-2 cursor-ns-resize z-30 group/edge"
          title="Drag edge to resize camera"
        >
          <div className="w-full h-0.5 bg-cyan-400/0 group-hover/edge:bg-cyan-400 transition-colors"></div>
        </div>

        {/* Left Edge */}
        <div
          onPointerDown={(e) => handleResizePointerDown('w', e)}
          className="absolute left-0 top-3 bottom-3 w-2 cursor-ew-resize z-30 group/edge"
          title="Drag edge to resize camera"
        >
          <div className="h-full w-0.5 bg-cyan-400/0 group-hover/edge:bg-cyan-400 transition-colors"></div>
        </div>

        {/* Right Edge */}
        <div
          onPointerDown={(e) => handleResizePointerDown('e', e)}
          className="absolute right-0 top-3 bottom-3 w-2 cursor-ew-resize z-30 group/edge"
          title="Drag edge to resize camera"
        >
          <div className="h-full w-0.5 bg-cyan-400/0 group-hover/edge:bg-cyan-400 transition-colors"></div>
        </div>

        {/* Corner Handles */}
        <div
          onPointerDown={(e) => handleResizePointerDown('nw', e)}
          className="absolute top-0 left-0 w-3.5 h-3.5 cursor-nwse-resize z-40"
          title="Drag corner to resize camera"
        />
        <div
          onPointerDown={(e) => handleResizePointerDown('ne', e)}
          className="absolute top-0 right-0 w-3.5 h-3.5 cursor-nesw-resize z-40"
          title="Drag corner to resize camera"
        />
        <div
          onPointerDown={(e) => handleResizePointerDown('sw', e)}
          className="absolute bottom-0 left-0 w-3.5 h-3.5 cursor-nesw-resize z-40"
          title="Drag corner to resize camera"
        />
        <div
          onPointerDown={(e) => handleResizePointerDown('se', e)}
          className="absolute bottom-0 right-0 w-3.5 h-3.5 cursor-nwse-resize z-40"
          title="Drag corner to resize camera"
        />
      </div>
    </div>
  );
};
