import React, { useState } from 'react';
import { JarvisState } from '../types/jarvis';
import { Sparkles, Shield, Cpu, Volume2, Check, Radio, Eye } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface HolographicAvatarGalleryProps {
  jarvisState: JarvisState;
  activeAvatarIndex: number;
  onSelectAvatar: (index: number) => void;
}

export interface AvatarProfile {
  id: string;
  name: string;
  stateRole: string;
  hindiTitle: string;
  imageSrc: string;
  auraColor: string;
  borderGlow: string;
  badgeBg: string;
  description: string;
  frequency: string;
  neuralCoherence: string;
}

export const JARVIS_AVATARS: AvatarProfile[] = [
  {
    id: 'quantum-vocal',
    name: 'Quantum Vocal Hologram',
    stateRole: 'SPEAKING (हिंदी आउटपुट)',
    hindiTitle: 'क्वांटम वोकल होलोग्राफिक फेस',
    imageSrc: '/src/assets/images/jarvis_quantum_face_1791476112895.jpg',
    auraColor: 'from-cyan-500/20 to-blue-500/20',
    borderGlow: 'border-cyan-400 shadow-[0_0_25px_rgba(0,229,255,0.6)]',
    badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-400/50',
    description: 'इलेक्ट्रिक सियान ऑडियो-वेव और न्यूरल सर्किट का संगम, जो हिंदी भाषण के दौरान सक्रिय होता है।',
    frequency: '24.0 kHz Audio Out',
    neuralCoherence: '99.4%',
  },
  {
    id: 'amber-neural',
    name: 'Amber Neural Supercore',
    stateRole: 'PROCESSING (गणना व विश्लेषण)',
    hindiTitle: 'एम्बर न्यूरल सुपरकंप्यूटर कोर',
    imageSrc: '/src/assets/images/jarvis_amber_holo_1791476137655.jpg',
    auraColor: 'from-amber-500/20 to-yellow-500/20',
    borderGlow: 'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.6)]',
    badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-400/50',
    description: 'टोनी स्टार्क लैब का स्वर्णिम क्वांटम प्रोसेसिंग अवतार, जो जटिल डिवाइस कार्यों की गणना करता है।',
    frequency: '128 TFLOPS Neural',
    neuralCoherence: '99.8%',
  },
  {
    id: 'crimson-biometric',
    name: 'Mark 85 Biometric Wireframe',
    stateRole: 'LISTENING & EXECUTING (सुनना व एक्शन)',
    hindiTitle: 'मार्क 85 बायोमेट्रिक वायरफ्रेम',
    imageSrc: '/src/assets/images/jarvis_crimson_scan_1791476160114.jpg',
    auraColor: 'from-red-500/20 to-rose-500/20',
    borderGlow: 'border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.6)]',
    badgeBg: 'bg-red-950/80 text-red-300 border-red-400/50',
    description: 'स्टार्क आर्मर मार्क 85 से प्रेरित लाल-नीला बायोमेट्रिक फेस, जो वॉयस इनपुट और सेंसर स्कैन पर लॉक होता है।',
    frequency: '60 FPS Sensor Grid',
    neuralCoherence: '98.9%',
  },
];

export const HolographicAvatarGallery: React.FC<HolographicAvatarGalleryProps> = ({
  jarvisState,
  activeAvatarIndex,
  onSelectAvatar,
}) => {
  const [selectedPreview, setSelectedPreview] = useState<number | null>(null);

  // Current active avatar based on state or pinned choice
  const getContextualAvatar = () => {
    if (jarvisState === 'PROCESSING') return JARVIS_AVATARS[1];
    if (jarvisState === 'LISTENING') return JARVIS_AVATARS[2];
    return JARVIS_AVATARS[0]; // Speaking or default
  };

  const currentAvatar = getContextualAvatar();

  return (
    <div className="bg-slate-900/60 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-spin-slow" />
          <div>
            <h3 className="font-scifi text-sm sm:text-base font-bold text-cyan-200 tracking-wider">
              HOLOGRAPHIC AI AVATAR MATRIX
            </h3>
            <p className="text-[11px] font-hindi text-slate-400">
              जार्विस की मुख्य एआई पहचान (स्पीकिंग व प्रोसेसिंग में सक्रिय)
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 bg-cyan-950/80 text-cyan-300 rounded-full border border-cyan-500/40">
          IMAGEN 3D HUD
        </span>
      </div>

      {/* Main Active Hologram Stage */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 mb-4">
        {/* Holographic Projection Frame */}
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-cyan-400/80 shadow-[0_0_30px_rgba(0,229,255,0.4)] shrink-0 group">
          <img
            src={currentAvatar.imageSrc}
            alt={currentAvatar.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Hologram scanline and corner accents */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-cyan-500/10 pointer-events-none" />
          <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-300" />
          <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-cyan-300" />
          <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-cyan-300" />
          <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-300" />

          {/* State Indicator Badge */}
          <div className="absolute bottom-2 inset-x-2 flex justify-center">
            <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-950/90 text-cyan-300 border border-cyan-400/60 shadow">
              {jarvisState === 'STANDBY' ? 'AUTO-PROJECTION' : jarvisState}
            </span>
          </div>
        </div>

        {/* Avatar Telemetry Details */}
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h4 className="font-scifi text-sm sm:text-base font-bold text-slate-100">
              {currentAvatar.name}
            </h4>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${currentAvatar.badgeBg}`}>
              {currentAvatar.stateRole}
            </span>
          </div>

          <p className="text-xs font-hindi text-cyan-300/90">
            {currentAvatar.hindiTitle}
          </p>

          <p className="text-xs text-slate-300 font-hindi leading-relaxed">
            {currentAvatar.description}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] font-mono text-cyan-400/80">
            <span>सिंक: <strong className="text-cyan-200">{currentAvatar.neuralCoherence}</strong></span>
            <span>·</span>
            <span>बैंडविड्थ: <strong className="text-cyan-200">{currentAvatar.frequency}</strong></span>
          </div>
        </div>
      </div>

      {/* Series of Holographic Avatars Selector */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-cyan-400/80 flex items-center justify-between px-1">
          <span>AVATAR GALLERY (3 HOLOGRAPHIC IDENTITIES)</span>
          <span className="text-slate-400 font-hindi text-[11px]">टैप करें प्रीव्यू देखने के लिए:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {JARVIS_AVATARS.map((avatar, idx) => {
            const isSelected = activeAvatarIndex === idx;
            return (
              <button
                key={avatar.id}
                onClick={() => {
                  soundEffects.playJarvisBeep();
                  onSelectAvatar(idx);
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all duration-200 ${
                  isSelected
                    ? `${avatar.borderGlow} bg-slate-950/90`
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-cyan-500/50'
                }`}
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-cyan-500/30">
                  <img
                    src={avatar.imageSrc}
                    alt={avatar.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-cyan-200 drop-shadow" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-200 truncate">
                    {avatar.name}
                  </div>
                  <div className="text-[10px] font-hindi text-cyan-400 truncate">
                    {avatar.hindiTitle}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 truncate mt-0.5">
                    {avatar.stateRole}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
