import React, { useEffect, useState } from 'react';
import { JarvisState } from '../types/jarvis';
import { Mic, MicOff, Volume2, Cpu, Zap, Activity } from 'lucide-react';

interface ArcReactorCoreProps {
  jarvisState: JarvisState;
  onCoreClick: () => void;
  isListening: boolean;
  voiceLevel?: number; // 0 to 100
  powerOutput?: string;
  clapDetected?: boolean;
}

export const ArcReactorCore: React.FC<ArcReactorCoreProps> = ({
  jarvisState,
  onCoreClick,
  isListening,
  voiceLevel = 25,
  powerOutput = '98.4%',
  clapDetected = false,
}) => {
  const [pulseAngle, setPulseAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAngle((prev) => (prev + 2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Determine glow color and state label
  const getStateMeta = () => {
    if (clapDetected) {
      return {
        glow: 'rgba(245, 158, 11, 1)',
        coreColor: '#f59e0b',
        label: 'ताली पहचानी गई! (CLAP DETECTED)',
        statusText: 'जागो जार्विस प्रोटोकॉल सक्रिय',
        badgeBg: 'bg-amber-500/30 text-amber-300 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-bounce',
      };
    }
    switch (jarvisState) {
      case 'LISTENING':
        return {
          glow: 'rgba(239, 68, 68, 0.85)', // Stark red listening
          coreColor: '#ef4444',
          label: 'सुन रहा हूँ... (LISTENING)',
          statusText: 'वॉयस इनपुट सक्रिय',
          badgeBg: 'bg-red-500/20 text-red-400 border-red-500/40',
        };
      case 'PROCESSING':
        return {
          glow: 'rgba(245, 158, 11, 0.85)', // Amber processing
          coreColor: '#f59e0b',
          label: 'विश्लेषण जारी... (ANALYZING)',
          statusText: 'जेमिनी न्यूरल कोर गणना',
          badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        };
      case 'EXECUTING':
        return {
          glow: 'rgba(16, 185, 129, 0.9)', // Emerald execution
          coreColor: '#10b981',
          label: 'डिवाइस कमांड सक्रिय... (EXECUTING)',
          statusText: 'एंड्रॉयड हार्डवेयर ऑटोमेशन',
          badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        };
      case 'SPEAKING':
        return {
          glow: 'rgba(0, 229, 255, 0.95)', // Cyan speaking
          coreColor: '#00e5ff',
          label: 'जार्विस बोल रहा है... (HINDI AUDIO)',
          statusText: 'हिंदी ऑडियो स्पीच आउटपुट',
          badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        };
      case 'STANDBY':
      default:
        return {
          glow: 'rgba(0, 229, 255, 0.65)',
          coreColor: '#00e5ff',
          label: 'जार्विस तैयार है (STANDBY)',
          statusText: 'आदेश के लिए तैयार',
          badgeBg: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/60',
        };
    }
  };

  const meta = getStateMeta();

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Outer Holographic Arc Reactor Container */}
      <div
        onClick={onCoreClick}
        role="button"
        tabIndex={0}
        aria-label="Toggle Jarvis Voice Control"
        className="relative w-64 h-64 sm:w-72 sm:h-72 cursor-pointer select-none group flex items-center justify-center transition-transform active:scale-95"
      >
        {/* Ambient Bloom Background */}
        <div
          className="absolute inset-4 rounded-full blur-3xl transition-all duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${meta.glow} 0%, rgba(0,0,0,0) 70%)`,
            opacity: jarvisState === 'STANDBY' ? 0.45 : 0.85,
          }}
        />

        {/* Outer Ring Segment 1 (Slow Clockwise) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 300 300"
          style={{
            transform: `rotate(${pulseAngle}deg)`,
            transition: 'transform 0.05s linear',
          }}
        >
          {/* Outer Dashed Circuit Orbit */}
          <circle
            cx="150"
            cy="150"
            r="138"
            fill="none"
            stroke="#00e5ff"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            strokeDasharray="4 8 16 8 32 8"
          />

          {/* Stark 10 Electromagnetic Capacitor Coils */}
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i * 36) * (Math.PI / 180);
            const x = 150 + 128 * Math.cos(angle);
            const y = 150 + 128 * Math.sin(angle);
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#030712"
                  stroke={meta.coreColor}
                  strokeWidth="2"
                  className="transition-colors duration-300"
                />
                <line
                  x1={150 + 118 * Math.cos(angle)}
                  y1={150 + 118 * Math.sin(angle)}
                  x2={150 + 138 * Math.cos(angle)}
                  y2={150 + 138 * Math.sin(angle)}
                  stroke="#00e5ff"
                  strokeWidth="2.5"
                  strokeOpacity="0.7"
                />
              </g>
            );
          })}
        </svg>

        {/* Inner Ring Segment 2 (Counter Clockwise) */}
        <svg
          className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] pointer-events-none"
          viewBox="0 0 300 300"
          style={{
            transform: `rotate(-${pulseAngle * 1.5}deg)`,
            transition: 'transform 0.05s linear',
          }}
        >
          <circle
            cx="150"
            cy="150"
            r="108"
            fill="none"
            stroke={meta.coreColor}
            strokeWidth="3"
            strokeOpacity="0.65"
            strokeDasharray="18 12 40 12"
          />
          {/* Inner tick marks */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15) * (Math.PI / 180);
            const x1 = 150 + 94 * Math.cos(angle);
            const y1 = 150 + 94 * Math.sin(angle);
            const x2 = 150 + 104 * Math.cos(angle);
            const y2 = 150 + 104 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#00e5ff"
                strokeWidth={i % 3 === 0 ? "2.5" : "1"}
                strokeOpacity={i % 3 === 0 ? "0.9" : "0.4"}
              />
            );
          })}
        </svg>

        {/* Central Triangle Arc Reactor Core (Mark 50 Style) */}
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-b from-[#061828] to-[#020617] border-2 border-cyan-400/80 shadow-[0_0_40px_rgba(0,229,255,0.4)] flex items-center justify-center overflow-hidden">
          {/* Micro Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:8px_8px] opacity-25" />

          {/* Central Rotating Core Element with Holographic Avatar Display */}
          <div
            className="absolute inset-2 sm:inset-3 rounded-full border border-cyan-300/40 flex items-center justify-center transition-all duration-300 overflow-hidden"
            style={{
              boxShadow: `inset 0 0 25px ${meta.glow}, 0 0 25px ${meta.glow}`,
            }}
          >
            {/* Holographic Avatar Display on SPEAKING, PROCESSING, or LISTENING */}
            {jarvisState === 'SPEAKING' ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src="/src/assets/images/jarvis_quantum_face_1791476112895.jpg"
                  alt="Jarvis Holographic AI Identity Speaking"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-110 animate-pulse duration-1000 filter brightness-110 contrast-125"
                />
                {/* Holographic scanline and audio ring overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/80 via-transparent to-cyan-500/20 mix-blend-screen pointer-events-none" />
                <div className="absolute bottom-1.5 inset-x-0 flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
                  <span className="text-[9px] font-mono tracking-widest text-cyan-200 font-bold bg-slate-950/80 px-2 py-0.5 rounded-full border border-cyan-400/60 shadow">
                    SPEAKING · हिंदी
                  </span>
                </div>
              </div>
            ) : jarvisState === 'PROCESSING' ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src="/src/assets/images/jarvis_amber_holo_1791476137655.jpg"
                  alt="Jarvis Neural Processing Avatar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-110 filter brightness-115 contrast-125 animate-spin-slow duration-[30s]"
                />
                {/* Amber holographic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-950/80 via-transparent to-amber-500/20 mix-blend-screen pointer-events-none" />
                <div className="absolute bottom-1.5 inset-x-0 flex items-center justify-center gap-1">
                  <Cpu className="w-2.5 h-2.5 text-amber-300 animate-spin" />
                  <span className="text-[9px] font-mono tracking-widest text-amber-200 font-bold bg-slate-950/80 px-2 py-0.5 rounded-full border border-amber-400/60 shadow">
                    PROCESSING · गणना
                  </span>
                </div>
              </div>
            ) : jarvisState === 'LISTENING' ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src="/src/assets/images/jarvis_crimson_scan_1791476160114.jpg"
                  alt="Jarvis Listening Biometric Avatar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-110 filter brightness-110 contrast-125 animate-pulse duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 via-transparent to-red-500/20 mix-blend-screen pointer-events-none" />
                <div className="absolute bottom-1.5 inset-x-0 flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                  <span className="text-[9px] font-mono tracking-widest text-red-200 font-bold bg-slate-950/80 px-2 py-0.5 rounded-full border border-red-400/60 shadow">
                    LISTENING · सुन रहा हूँ
                  </span>
                </div>
              </div>
            ) : (
              /* Standby Default Arc Reactor Logo with preview thumbnail on hover */
              <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform">
                <div className="flex flex-col items-center">
                  <Zap className="w-9 h-9 text-cyan-400 drop-shadow-[0_0_15px_rgba(0,229,255,0.9)]" />
                  <span className="text-[10px] font-scifi font-bold tracking-wider text-cyan-300 mt-1">J.A.R.V.I.S</span>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Audio Ripple Ring */}
          {jarvisState === 'LISTENING' && (
            <div
              className="absolute inset-1 rounded-full border-2 border-red-500/80 animate-ping opacity-75 pointer-events-none"
              style={{ animationDuration: '1.2s' }}
            />
          )}
          {jarvisState === 'SPEAKING' && (
            <div
              className="absolute inset-1 rounded-full border-2 border-cyan-400/80 animate-ping opacity-75 pointer-events-none"
              style={{ animationDuration: '1.4s' }}
            />
          )}
        </div>
      </div>

      {/* State & Instructions Sub-Badge */}
      <div className="mt-4 flex flex-col items-center text-center">
        <div className={`px-4 py-1.5 rounded-full border text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md ${meta.badgeBg}`}>
          {meta.label}
        </div>
        <p className="text-xs text-slate-400 font-hindi mt-1.5 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          {meta.statusText} · आर्क रिएक्टर पावर: <span className="text-cyan-300 font-mono font-bold">{powerOutput}</span>
        </p>
        <span className="text-[11px] text-cyan-500/80 mt-0.5 uppercase tracking-widest font-mono">
          [ टैप करें आवाज देने के लिए / TAP CORE TO COMMAND ]
        </span>
      </div>
    </div>
  );
};
