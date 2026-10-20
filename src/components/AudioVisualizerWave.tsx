import React, { useEffect, useState } from 'react';
import { JarvisState } from '../types/jarvis';

interface AudioVisualizerWaveProps {
  jarvisState: JarvisState;
  isActive: boolean;
  barCount?: number;
}

export const AudioVisualizerWave: React.FC<AudioVisualizerWaveProps> = ({
  jarvisState,
  isActive,
  barCount = 32,
}) => {
  const [frequencies, setFrequencies] = useState<number[]>(() =>
    Array.from({ length: barCount }, () => 15)
  );

  useEffect(() => {
    let animId: number;

    const updateWave = () => {
      if (isActive || jarvisState === 'LISTENING' || jarvisState === 'SPEAKING' || jarvisState === 'PROCESSING') {
        setFrequencies((prev) =>
          prev.map((_, i) => {
            const centerDist = Math.abs(i - barCount / 2) / (barCount / 2);
            const peak = (1 - centerDist * 0.65);
            
            if (jarvisState === 'SPEAKING') {
              // Hindi speech cadence
              const val = Math.sin(Date.now() / 150 + i * 0.4) * 35 + 45;
              return Math.max(12, Math.min(95, val * peak + (Math.random() * 20)));
            } else if (jarvisState === 'LISTENING') {
              // Microphone audio reactive wave
              const val = Math.sin(Date.now() / 100 + i * 0.6) * 40 + 40;
              return Math.max(10, Math.min(90, val * peak + (Math.random() * 25)));
            } else if (jarvisState === 'PROCESSING') {
              // High speed computational ripples
              const val = ((i + Math.floor(Date.now() / 60)) % 8) * 10 + 20;
              return Math.max(12, Math.min(80, val));
            } else {
              return Math.max(8, Math.sin(Date.now() / 400 + i * 0.2) * 12 + 18);
            }
          })
        );
      } else {
        // Idle gentle wave
        setFrequencies((prev) =>
          prev.map((_, i) => Math.max(8, Math.sin(Date.now() / 600 + i * 0.25) * 8 + 14))
        );
      }
      animId = requestAnimationFrame(updateWave);
    };

    animId = requestAnimationFrame(updateWave);
    return () => cancelAnimationFrame(animId);
  }, [isActive, jarvisState, barCount]);

  const getBarColor = (height: number) => {
    if (jarvisState === 'LISTENING') {
      return height > 60 ? 'bg-red-400' : 'bg-red-500/80';
    }
    if (jarvisState === 'PROCESSING') {
      return height > 60 ? 'bg-amber-400' : 'bg-amber-500/80';
    }
    if (jarvisState === 'SPEAKING') {
      return height > 65 ? 'bg-cyan-200' : 'bg-cyan-400';
    }
    return height > 20 ? 'bg-cyan-400/70' : 'bg-cyan-600/40';
  };

  return (
    <div className="w-full flex flex-col items-center gap-1.5 py-2">
      <div className="w-full max-w-md h-12 flex items-center justify-center gap-1 px-4 bg-slate-950/40 rounded-xl border border-cyan-500/20 backdrop-blur-sm shadow-inner">
        {frequencies.map((height, idx) => (
          <div
            key={idx}
            className={`w-1 rounded-full transition-all duration-75 shadow-[0_0_8px_rgba(0,229,255,0.4)] ${getBarColor(
              height
            )}`}
            style={{
              height: `${height}%`,
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between w-full max-w-md px-2 text-[10px] text-cyan-400/70 font-mono">
        <span>AUDIO: {jarvisState === 'SPEAKING' ? 'HINDI SPEECH OUT' : jarvisState === 'LISTENING' ? 'MIC AUDIO IN' : 'IDLE 24kHz'}</span>
        <span className="text-cyan-300">STARK AUDIO ENGINE v4.2</span>
        <span>LATENCY: 8ms</span>
      </div>
    </div>
  );
};
