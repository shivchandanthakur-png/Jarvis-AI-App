import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, RefreshCw, Crosshair, ShieldCheck, Zap } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface CameraHUDScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured?: (url: string) => void;
}

export const CameraHUDScanner: React.FC<CameraHUDScannerProps> = ({
  isOpen,
  onClose,
  onPhotoCaptured,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [targetLock, setTargetLock] = useState(true);
  const [scanTelemetry, setScanTelemetry] = useState({
    distance: '1.42m',
    threatLevel: '0.0% (ZERO THREAT)',
    biometrics: 'STARK ENTITY VERIFIED',
  });

  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      return;
    }

    soundEffects.playScanSweep();

    async function initCamera() {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode },
          audio: false,
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera access denied or unavailable:', err);
      }
    }

    initCamera();

    const interval = setInterval(() => {
      setScanTelemetry({
        distance: `${(1.2 + Math.random() * 0.5).toFixed(2)}m`,
        threatLevel: '0.0% (OPTIMAL)',
        biometrics: Math.random() > 0.5 ? 'STARK ENTITY VERIFIED' : 'BIO-PATTERN RECOGNIZED',
      });
    }, 1500);

    return () => {
      clearInterval(interval);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  const handleCapture = () => {
    soundEffects.playActionSuccessChime();
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onPhotoCaptured?.(dataUrl);
      }
    }
  };

  const handleToggleFacing = () => {
    soundEffects.playJarvisBeep();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 backdrop-blur-md">
      <div className="relative w-full max-w-xl aspect-[3/4] sm:aspect-video bg-slate-950 border-2 border-cyan-400 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,229,255,0.4)] flex flex-col">
        {/* Top Header Bar */}
        <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between z-30 bg-gradient-to-b from-slate-950/90 to-transparent">
          <div className="flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            <span className="font-scifi text-xs sm:text-sm font-bold tracking-wider text-cyan-300">
              MARK 85 OPTICAL HUD SCANNER
            </span>
          </div>
          <button
            onClick={() => {
              soundEffects.playJarvisBeep();
              onClose();
            }}
            className="p-2 rounded-full bg-slate-900/80 border border-cyan-500/40 text-cyan-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Camera Feed */}
        <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Stark HUD Hologram Overlays */}
          <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
            {/* Top Telemetry */}
            <div className="flex justify-between items-start pt-10 text-[11px] font-mono text-cyan-300 drop-shadow">
              <div className="space-y-1 bg-slate-950/70 p-2 rounded-lg border border-cyan-500/30">
                <div>SENSOR: {facingMode === 'environment' ? 'REAR WIDE' : 'FRONT BIO'}</div>
                <div>RANGE: {scanTelemetry.distance}</div>
                <div>STATUS: {scanTelemetry.biometrics}</div>
              </div>

              <div className="space-y-1 text-right bg-slate-950/70 p-2 rounded-lg border border-cyan-500/30">
                <div>TARGET LOCK: ACTIVE</div>
                <div className="text-emerald-400">{scanTelemetry.threatLevel}</div>
                <div>FPS: 60.0</div>
              </div>
            </div>

            {/* Central Targeting Reticle */}
            <div className="relative self-center flex items-center justify-center">
              <div className="w-44 h-44 rounded-full border border-cyan-400/60 animate-ping opacity-40" />
              <div className="absolute w-36 h-36 border-2 border-dashed border-cyan-400/80 rounded-full animate-spin-slow" />
              <div className="absolute w-24 h-24 border border-cyan-300/90 rounded-lg" />
              <div className="absolute w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_red]" />
              {/* Corner brackets */}
              <div className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
            </div>

            {/* Bottom Target Tag */}
            <div className="self-center bg-cyan-950/80 border border-cyan-400/80 px-4 py-1 rounded-full text-xs font-mono text-cyan-200 tracking-wider">
              [ JARVIS NEURAL RECOGNITION ONLINE ]
            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="p-4 bg-slate-950 border-t border-cyan-500/30 flex items-center justify-around z-30">
          <button
            onClick={handleToggleFacing}
            className="p-3 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:text-white"
            title="Switch Camera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={handleCapture}
            className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-scifi text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.7)] active:scale-95 transition-all"
          >
            <Camera className="w-4 h-4" />
            तस्वीर लें (SNAP PHOTO)
          </button>

          <button
            onClick={() => {
              soundEffects.playScanSweep();
              setTargetLock((prev) => !prev);
            }}
            className={`p-3 rounded-full border ${
              targetLock
                ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            title="Toggle Lock"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
