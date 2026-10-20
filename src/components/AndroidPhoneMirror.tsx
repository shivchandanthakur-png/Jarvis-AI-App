import React, { useState } from 'react';
import { DeviceState, DeviceAction } from '../types/jarvis';
import {
  MessageCircle,
  Phone,
  Camera,
  Youtube,
  MapPin,
  Clock,
  Music,
  Settings,
  Chrome,
  ArrowLeft,
  Send,
  Bell,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { hardwareControl } from '../utils/hardwareControl';
import { soundEffects } from '../utils/soundEffects';

interface AndroidPhoneMirrorProps {
  deviceState: DeviceState;
  activeAction?: DeviceAction | null;
  onOpenCamera: () => void;
  onSetAlarm: (time: string) => void;
  onSendWhatsApp: (phone: string, msg: string) => void;
}

export const AndroidPhoneMirror: React.FC<AndroidPhoneMirrorProps> = ({
  deviceState,
  activeAction,
  onOpenCamera,
  onSetAlarm,
  onSendWhatsApp,
}) => {
  const [activeApp, setActiveApp] = useState<string | null>(null);

  // App internal states
  const [waContact, setWaContact] = useState('राहुल वर्मा (+91 9876543210)');
  const [waMessage, setWaMessage] = useState('नमस्ते राहुल! मैं मीटिंग में हूँ, 15 मिनट में बात करता हूँ।');
  const [alarmInput, setAlarmInput] = useState('06:30');
  const [alarmActive, setAlarmActive] = useState(false);
  const [dialerNumber, setDialerNumber] = useState('+91 98765 43210');
  const [youtubeQuery, setYoutubeQuery] = useState('Tony Stark Jarvis Hindi Theme');

  const handleLaunchWhatsApp = () => {
    soundEffects.playActionSuccessChime();
    hardwareControl.launchWhatsApp('', waMessage);
  };

  const handleSetClockAlarm = () => {
    soundEffects.playJarvisBeep();
    setAlarmActive(true);
    onSetAlarm(alarmInput);
    soundEffects.playAlarmSiren();
  };

  const handleDial = () => {
    soundEffects.playActionSuccessChime();
    hardwareControl.launchDialer(dialerNumber);
  };

  const handleLaunchYouTube = () => {
    soundEffects.playActionSuccessChime();
    hardwareControl.launchYouTube(youtubeQuery);
  };

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[360px] mx-auto bg-slate-950 border-4 border-cyan-500/40 rounded-[38px] p-3 shadow-[0_0_50px_rgba(0,229,255,0.25)] overflow-hidden">
      {/* Phone Camera Notch & Speaker */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-b-xl border-x border-b border-cyan-500/30 flex items-center justify-center gap-2 z-30">
        <div className="w-2 h-2 rounded-full bg-cyan-400/80 shadow-[0_0_6px_rgba(0,229,255,1)]" />
        <div className="w-10 h-1 bg-slate-700 rounded-full" />
      </div>

      {/* Android Screen Container */}
      <div className="relative w-full h-[540px] bg-gradient-to-b from-slate-950 via-[#071322] to-slate-950 rounded-[28px] overflow-hidden flex flex-col border border-cyan-500/20">
        {/* Top Status Bar */}
        <div className="w-full pt-3 px-4 pb-1.5 flex items-center justify-between text-[11px] font-mono text-cyan-300 border-b border-cyan-500/10 z-20">
          <div className="font-bold flex items-center gap-1">
            <span>09:41</span>
            <span className="text-[9px] px-1 bg-cyan-950 rounded border border-cyan-500/40 text-cyan-300">JARVIS OS</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{deviceState.isWifiOn ? '5G WiFi' : 'LTE'}</span>
            <span>{deviceState.batteryLevel ?? 88}%</span>
          </div>
        </div>

        {/* Dynamic Holographic Tap Ripple during JARVIS auto-execution */}
        {activeAction && (
          <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center bg-cyan-500/5">
            <div className="flex flex-col items-center animate-bounce">
              <div className="w-12 h-12 rounded-full border-2 border-cyan-400 bg-cyan-400/20 shadow-[0_0_20px_rgba(0,229,255,0.8)] animate-ping" />
              <div className="mt-2 px-3 py-1 bg-slate-900/90 border border-cyan-400 rounded-full text-xs font-mono text-cyan-300 shadow-lg">
                JARVIS AUTO-TAP: {activeAction.target}
              </div>
            </div>
          </div>
        )}

        {/* Main Phone Viewport */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
          {!activeApp ? (
            /* Home Screen View */
            <div className="flex flex-col h-full justify-between">
              {/* Clock & Weather Widget */}
              <div className="pt-2 pb-4 text-center">
                <div className="text-3xl font-scifi font-bold text-cyan-200 tracking-wider">
                  09:41 <span className="text-xs text-cyan-400">AM</span>
                </div>
                <div className="text-xs font-hindi text-slate-300 mt-1">
                  नई दिल्ली · 28°C धूप · जार्विस ऑटोमेशन सक्रिय
                </div>
                {alarmActive && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/60 rounded-full text-[11px] font-mono text-amber-300 animate-pulse">
                    <Bell className="w-3 h-3" />
                    अलार्म सक्रिय: {alarmInput} AM
                  </div>
                )}
              </div>

              {/* App Grid */}
              <div className="grid grid-cols-3 gap-3 my-auto">
                {/* 1. WhatsApp */}
                <button
                  onClick={() => {
                    soundEffects.playJarvisBeep();
                    setActiveApp('whatsapp');
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-cyan-500/10 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-200">व्हाट्सएप</span>
                </button>

                {/* 2. Phone Dialer */}
                <button
                  onClick={() => {
                    soundEffects.playJarvisBeep();
                    setActiveApp('dialer');
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-cyan-500/10 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-200">फोन कॉल</span>
                </button>

                {/* 3. Camera */}
                <button
                  onClick={() => {
                    soundEffects.playJarvisBeep();
                    onOpenCamera();
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-cyan-500/10 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-900 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-lg group-hover:scale-105 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-200">कैमरा HUD</span>
                </button>

                {/* 4. Clock / Alarm */}
                <button
                  onClick={() => {
                    soundEffects.playJarvisBeep();
                    setActiveApp('clock');
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-cyan-500/10 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-black shadow-lg group-hover:scale-105 transition-transform">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-200">अलार्म घड़ी</span>
                </button>

                {/* 5. YouTube */}
                <button
                  onClick={() => {
                    soundEffects.playJarvisBeep();
                    setActiveApp('youtube');
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-cyan-500/10 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                    <Youtube className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-200">यूट्यूब</span>
                </button>

                {/* 6. Google Maps */}
                <button
                  onClick={() => {
                    soundEffects.playActionSuccessChime();
                    hardwareControl.launchMaps('कहाँ जाना है');
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-cyan-500/10 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-200">गूगल मैप्स</span>
                </button>
              </div>

              {/* Bottom Dock */}
              <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-2 flex items-center justify-around backdrop-blur-md">
                <button
                  onClick={() => setActiveApp('dialer')}
                  className="p-2 text-cyan-400 hover:text-white"
                  title="Phone"
                >
                  <Phone className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveApp('whatsapp')}
                  className="p-2 text-emerald-400 hover:text-white"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    soundEffects.playActionSuccessChime();
                    window.open('https://www.google.com', '_blank');
                  }}
                  className="p-2 text-amber-400 hover:text-white"
                  title="Chrome"
                >
                  <Chrome className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveApp('clock')}
                  className="p-2 text-purple-400 hover:text-white"
                  title="Clock"
                >
                  <Clock className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : activeApp === 'whatsapp' ? (
            /* WhatsApp Automated Screen */
            <div className="flex flex-col h-full bg-slate-900/90 rounded-xl p-3 border border-emerald-500/30">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 mb-3">
                <button
                  onClick={() => setActiveApp(null)}
                  className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-200"
                >
                  <ArrowLeft className="w-4 h-4" /> वापस
                </button>
                <span className="font-semibold text-xs text-emerald-300">व्हाट्सएप ऑटो-मैसेजिंग</span>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-mono">संपर्क (Contact)</label>
                  <input
                    type="text"
                    value={waContact}
                    onChange={(e) => setWaContact(e.target.value)}
                    className="w-full bg-slate-950 border border-emerald-500/40 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 mt-1"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-mono">संदेश (Hindi Message)</label>
                  <textarea
                    rows={4}
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-emerald-500/40 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 mt-1 resize-none"
                  />
                </div>

                <button
                  onClick={handleLaunchWhatsApp}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  जार्विस द्वारा व्हाट्सएप संदेश भेजें
                </button>
                <p className="text-[10px] text-slate-400 text-center font-hindi">
                  यह सीधे आपके फोन के WhatsApp ऐप में खुलेगा।
                </p>
              </div>
            </div>
          ) : activeApp === 'clock' ? (
            /* Clock & Alarm Screen */
            <div className="flex flex-col h-full bg-slate-900/90 rounded-xl p-3 border border-amber-500/30">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/20 mb-3">
                <button
                  onClick={() => setActiveApp(null)}
                  className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-200"
                >
                  <ArrowLeft className="w-4 h-4" /> वापस
                </button>
                <span className="font-semibold text-xs text-amber-300">जार्विस अलार्म मैनेजर</span>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="text-center">
                  <div className="text-xs text-slate-300 font-hindi mb-2">अलार्म का समय चुनें:</div>
                  <input
                    type="time"
                    value={alarmInput}
                    onChange={(e) => setAlarmInput(e.target.value)}
                    className="bg-slate-950 border-2 border-amber-400 rounded-xl px-4 py-2 text-2xl font-mono text-amber-300 text-center"
                  />
                </div>

                <button
                  onClick={handleSetClockAlarm}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
                >
                  <Bell className="w-4 h-4" />
                  अलार्म सेट करें और सायरन टेस्ट
                </button>

                {alarmActive && (
                  <p className="text-xs text-emerald-400 font-mono text-center">
                    ✓ अलार्म सफलतापूर्वक {alarmInput} बजे के लिए सेट किया गया!
                  </p>
                )}
              </div>
            </div>
          ) : activeApp === 'dialer' ? (
            /* Phone Dialer Screen */
            <div className="flex flex-col h-full bg-slate-900/90 rounded-xl p-3 border border-blue-500/30">
              <div className="flex items-center justify-between pb-2 border-b border-blue-500/20 mb-2">
                <button
                  onClick={() => setActiveApp(null)}
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-200"
                >
                  <ArrowLeft className="w-4 h-4" /> वापस
                </button>
                <span className="font-semibold text-xs text-blue-300">स्मार्ट कॉलिंग</span>
              </div>

              <div className="my-2">
                <input
                  type="text"
                  value={dialerNumber}
                  onChange={(e) => setDialerNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-blue-400/40 rounded-lg px-3 py-2 text-base font-mono text-cyan-200 text-center"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 flex-1 my-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => {
                      soundEffects.playJarvisBeep();
                      setDialerNumber((prev) => prev + digit);
                    }}
                    className="bg-slate-950/70 border border-cyan-900/60 hover:border-cyan-400 rounded-lg text-sm font-mono text-slate-200 py-2 flex items-center justify-center"
                  >
                    {digit}
                  </button>
                ))}
              </div>

              <button
                onClick={handleDial}
                className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <Phone className="w-4 h-4" />
                सीधे कॉल लगाएं (Dial Now)
              </button>
            </div>
          ) : (
            /* YouTube Player Screen */
            <div className="flex flex-col h-full bg-slate-900/90 rounded-xl p-3 border border-red-500/30">
              <div className="flex items-center justify-between pb-2 border-b border-red-500/20 mb-3">
                <button
                  onClick={() => setActiveApp(null)}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-200"
                >
                  <ArrowLeft className="w-4 h-4" /> वापस
                </button>
                <span className="font-semibold text-xs text-red-300">यूट्यूब मीडिया कंट्रोलर</span>
              </div>

              <div className="flex-1 space-y-3 flex flex-col justify-center">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-mono">गाने या वीडियो का नाम खोजें</label>
                  <input
                    type="text"
                    value={youtubeQuery}
                    onChange={(e) => setYoutubeQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-red-500/40 rounded-lg px-2.5 py-2 text-xs text-slate-200 mt-1"
                  />
                </div>

                <button
                  onClick={handleLaunchYouTube}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  यूट्यूब पर चलाएं (Play on YouTube)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Android Gesture Bar */}
        <div className="w-full py-2 flex justify-center items-center bg-slate-950 border-t border-cyan-500/10">
          <button
            onClick={() => setActiveApp(null)}
            className="w-24 h-1 bg-cyan-400/60 hover:bg-cyan-300 rounded-full transition-colors cursor-pointer"
            title="Home"
          />
        </div>
      </div>
    </div>
  );
};
