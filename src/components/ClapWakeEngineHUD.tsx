import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Volume2,
  Sliders,
  CheckCircle2,
  Mic,
  Activity,
  Power,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface ClapWakeEngineHUDProps {
  isListeningForClap: boolean;
  onToggleClapListening: () => void;
  ambientSoundLevel: number; // 0 to 1
  clapDetectedRecently: boolean;
  onSimulateClapWake: () => void;
  onSimulateVoiceWake: () => void;
  onSimulateCombinedWake: () => void;
  sensitivity: number;
  onSensitivityChange: (val: number) => void;
}

export const ClapWakeEngineHUD: React.FC<ClapWakeEngineHUDProps> = ({
  isListeningForClap,
  onToggleClapListening,
  ambientSoundLevel,
  clapDetectedRecently,
  onSimulateClapWake,
  onSimulateVoiceWake,
  onSimulateCombinedWake,
  sensitivity,
  onSensitivityChange,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="bg-slate-900/70 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-amber-500 flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.8)]">
            <span className="text-base">👏</span>
          </div>
          <div>
            <h3 className="font-scifi text-xs sm:text-sm font-bold text-cyan-200 tracking-wider">
              CLAP & "JAGO JARVIS" WAKE PROTOCOL
            </h3>
            <p className="text-[11px] font-hindi text-slate-300">
              ताली बजाएं या कहें <strong className="text-amber-300">"जागो जार्विस"</strong> (Acoustic Impulse & Voice Wake)
            </p>
          </div>
        </div>

        {/* Toggle Listening Button */}
        <button
          onClick={() => {
            soundEffects.playJarvisBeep();
            onToggleClapListening();
          }}
          className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all active:scale-95 ${
            isListeningForClap
              ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'bg-slate-950/70 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <Power className={`w-3.5 h-3.5 ${isListeningForClap ? 'text-emerald-400 animate-pulse' : ''}`} />
          <span>{isListeningForClap ? 'लिसनर सक्रिय' : 'सक्रिय करें'}</span>
        </button>
      </div>

      {/* Real-time Acoustic Energy Meter & Clap Trigger Indicator */}
      <div className="space-y-3">
        {/* Ambient Meter Strip */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-cyan-500/20 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400/80">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>ध्वनि स्तर (Acoustic dB Energy):</span>
            </div>
            <span className="text-cyan-200 font-bold">
              {Math.round(ambientSoundLevel * 100)}%
            </span>
          </div>

          {/* Energy Bar */}
          <div className="relative w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-900/50">
            <div
              className={`h-full transition-all duration-75 rounded-full ${
                clapDetectedRecently
                  ? 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,1)]'
                  : ambientSoundLevel > sensitivity
                  ? 'bg-red-400'
                  : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(3, ambientSoundLevel * 100))}%` }}
            />
            {/* Sensitivity marker threshold line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400/80 z-10"
              style={{ left: `${sensitivity * 100}%` }}
              title="Clap Threshold"
            />
          </div>

          {/* Clap Detection Alert Banner */}
          {clapDetectedRecently && (
            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center gap-2 animate-bounce">
              <span className="text-base">👏</span>
              <span className="text-xs font-bold font-scifi text-amber-300 tracking-wider">
                CLAP IMPULSE DETECTED! WAKING JARVIS...
              </span>
            </div>
          )}
        </div>

        {/* Dual Trigger Information Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Card 1: ताली बजाना */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-300 shrink-0">
              <span className="text-sm">👏</span>
            </div>
            <div>
              <strong className="text-cyan-300 font-sans block text-[11px] mb-0.5">
                विधि 1: ताली बजाएं (Acoustic Clap)
              </strong>
              <p className="text-[11px] font-hindi text-slate-400 leading-snug">
                जैसे ही आप ताली बजाएंगे, माइक्रोफोन एक तीव्र ध्वनि तरंग पहचानकर जार्विस को सक्रिय कर देगा।
              </p>
            </div>
          </div>

          {/* Card 2: जागो जार्विस कहना */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-950 border border-amber-500/30 text-amber-300 shrink-0">
              <Mic className="w-3.5 h-3.5" />
            </div>
            <div>
              <strong className="text-amber-300 font-sans block text-[11px] mb-0.5">
                विधि 2: "जागो जार्विस" कहें (Voice Wake)
              </strong>
              <p className="text-[11px] font-hindi text-slate-400 leading-snug">
                बोलें "जागो जार्विस" या "Jago Jarvis", और AI तुरंत जागकर हिंदी में उत्तर देगा।
              </p>
            </div>
          </div>
        </div>

        {/* Instant Test Buttons */}
        <div className="pt-1">
          <div className="text-[10px] font-mono text-cyan-400/80 mb-1.5 flex items-center justify-between">
            <span>QUICK TRIGGER SIMULATION (तुरंत टेस्ट करें):</span>
            <button
              onClick={() => setShowSettings((p) => !p)}
              className="text-cyan-400 hover:text-cyan-200 flex items-center gap-1 text-[10px]"
            >
              <Sliders className="w-3 h-3" />
              <span>संवेदनशीलता सेटिंग्स</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={onSimulateClapWake}
              className="py-2 px-2 bg-slate-950 border border-cyan-500/40 hover:border-cyan-400 rounded-xl text-[11px] font-hindi text-cyan-200 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow"
            >
              <span className="text-base">👏</span>
              <span>ताली बजाएं</span>
            </button>

            <button
              onClick={onSimulateVoiceWake}
              className="py-2 px-2 bg-slate-950 border border-amber-500/40 hover:border-amber-400 rounded-xl text-[11px] font-hindi text-amber-200 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow"
            >
              <Mic className="w-4 h-4 text-amber-400" />
              <span>'जागो जार्विस'</span>
            </button>

            <button
              onClick={onSimulateCombinedWake}
              className="py-2 px-2 bg-gradient-to-r from-cyan-600/30 to-amber-600/30 border border-cyan-400/80 rounded-xl text-[11px] font-hindi text-white flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] font-semibold"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>ताली + जागो जार्विस</span>
            </button>
          </div>
        </div>

        {/* Sensitivity Adjuster Drawer */}
        {showSettings && (
          <div className="mt-2 p-3 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-cyan-300 font-hindi">
              <span>ताली संवेदनशीलता थ्रेशोल्ड (Threshold):</span>
              <span className="font-mono">{Math.round(sensitivity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="0.9"
              step="0.05"
              value={sensitivity}
              onChange={(e) => onSensitivityChange(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-hindi">
              <span>अधिक संवेदनशील (हल्की ताली)</span>
              <span>कम संवेदनशील (तेज ताली)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
