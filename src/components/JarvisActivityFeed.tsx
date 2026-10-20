import React from 'react';
import { JarvisMessage } from '../types/jarvis';
import { Volume2, CheckCircle2, Shield, ArrowRight, User, Cpu } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface JarvisActivityFeedProps {
  messages: JarvisMessage[];
  onReplayAudio: (msg: JarvisMessage) => void;
}

export const JarvisActivityFeed: React.FC<JarvisActivityFeedProps> = ({
  messages,
  onReplayAudio,
}) => {
  return (
    <div className="bg-slate-900/60 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-2xl flex flex-col h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h3 className="font-scifi text-sm sm:text-base font-bold text-cyan-200 tracking-wider">
            JARVIS MISSION & ACTIVITY FEED
          </h3>
        </div>
        <span className="text-[11px] font-hindi text-cyan-400 font-medium">
          हिंदी वॉयस और ऑटोमेशन लॉग
        </span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-2xl border transition-all ${
              msg.sender === 'user'
                ? 'bg-slate-950/80 border-slate-700/60 ml-6 text-right'
                : 'bg-cyan-950/20 border-cyan-500/30 mr-2 text-left'
            }`}
          >
            {/* Sender and Time */}
            <div className={`flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/80 mb-1 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}>
              {msg.sender === 'user' ? (
                <>
                  <span>आप (User Voice)</span>
                  <User className="w-3 h-3 text-cyan-400" />
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,229,255,1)]" />
                  <span className="font-bold text-cyan-300">J.A.R.V.I.S. (हिंदी AI)</span>
                </>
              )}
              <span className="text-slate-500">· {msg.timestamp}</span>
            </div>

            {/* Message Body */}
            <p className="text-xs sm:text-sm font-hindi leading-relaxed text-slate-100">
              {msg.text}
            </p>

            {/* English Translation Subtitle */}
            {msg.englishTranslation && (
              <p className="text-[11px] font-sans text-slate-400 mt-1 italic">
                "{msg.englishTranslation}"
              </p>
            )}

            {/* Audio Replay Button */}
            {msg.sender === 'jarvis' && (
              <div className="mt-2 pt-2 border-t border-cyan-500/10 flex items-center justify-between">
                <button
                  onClick={() => {
                    soundEffects.playJarvisBeep();
                    onReplayAudio(msg);
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 hover:text-cyan-200 px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  हिंदी ऑडियो दोबारा सुनें (Replay Hindi Voice)
                </button>

                {msg.hudMetrics && (
                  <span className="text-[10px] font-mono text-cyan-500/80">
                    CPU: {msg.hudMetrics.cpuLoad}
                  </span>
                )}
              </div>
            )}

            {/* Execution Steps Log */}
            {msg.executionSteps && msg.executionSteps.length > 0 && (
              <div className="mt-2.5 p-2 bg-slate-950/90 rounded-xl border border-cyan-500/20 space-y-1">
                <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  डिवाइस निष्पादन चरण (Execution Steps):
                </div>
                {msg.executionSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="text-[10px] sm:text-[11px] font-hindi text-slate-300 flex items-start gap-1.5 pl-1"
                  >
                    <ArrowRight className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
