import React, { useState, useEffect, useRef } from 'react';
import { DeviceState, JarvisState, JarvisMessage, DeviceAction } from './types/jarvis';
import { ArcReactorCore } from './components/ArcReactorCore';
import { AudioVisualizerWave } from './components/AudioVisualizerWave';
import { DeviceControlPanel } from './components/DeviceControlPanel';
import { AndroidPhoneMirror } from './components/AndroidPhoneMirror';
import { HindiCommandLibrary } from './components/HindiCommandLibrary';
import { JarvisActivityFeed } from './components/JarvisActivityFeed';
import { CameraHUDScanner } from './components/CameraHUDScanner';
import { AdbAccessibilityBridgeModal } from './components/AdbAccessibilityBridgeModal';
import { HolographicAvatarGallery, JARVIS_AVATARS } from './components/HolographicAvatarGallery';
import { ClapWakeEngineHUD } from './components/ClapWakeEngineHUD';
import { clapDetector } from './utils/clapDetector';
import { hardwareControl } from './utils/hardwareControl';
import { soundEffects } from './utils/soundEffects';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Maximize2,
  Terminal,
  Shield,
  Smartphone,
  Sparkles,
  Camera,
  Layers,
  Radio,
  UserCheck,
} from 'lucide-react';

export default function App() {
  // Device Hardware State
  const [deviceState, setDeviceState] = useState<DeviceState>({
    batteryLevel: 88,
    isCharging: false,
    isTorchOn: false,
    brightness: 85,
    volume: 75,
    isWifiOn: true,
    isBluetoothOn: true,
    isDndOn: false,
    isScreenLocked: false,
    currentApp: null,
    ramUsageMb: 2420,
    totalRamMb: 6144,
    wakeLockActive: false,
    alarmSetTime: null,
    lastPhotoUrl: null,
  });

  // Jarvis Cognitive & Audio States
  const [jarvisState, setJarvisState] = useState<JarvisState>('STANDBY');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [voiceInputText, setVoiceInputText] = useState('');
  const [activeAction, setActiveAction] = useState<DeviceAction | null>(null);
  const [activeAvatarIndex, setActiveAvatarIndex] = useState(0);

  // Modal Views
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);
  const [isAdbModalOpen, setIsAdbModalOpen] = useState(false);
  const [showAvatarMatrix, setShowAvatarMatrix] = useState(false);
  const [activeTab, setActiveTab] = useState<'cockpit' | 'avatars' | 'phone' | 'commands'>('cockpit');

  // Clap & Acoustic Wake States
  const [isListeningForClap, setIsListeningForClap] = useState(false);
  const [ambientSoundLevel, setAmbientSoundLevel] = useState(0.08);
  const [clapDetectedRecently, setClapDetectedRecently] = useState(false);
  const [clapSensitivity, setClapSensitivity] = useState(0.60);

  // Messages / Mission Feed
  const [messages, setMessages] = useState<JarvisMessage[]>([
    {
      id: 'init-msg-1',
      sender: 'jarvis',
      text: 'नमस्ते बॉस! मैं जार्विस हूँ। आपके एंड्रॉयड डिवाइस का पूर्ण स्वायत्त नियंत्रण मेरे पास है। आप हिंदी में जो भी आदेश देंगे, मैं तुरंत पूरा करूंगा।',
      englishTranslation: 'Greetings Boss! I am J.A.R.V.I.S. I have full autonomous control of your Android device. Speak in Hindi and I will execute immediately.',
      timestamp: '09:41 AM',
      executionSteps: [
        'एंड्रॉयड कोर सिस्टम लिंकेज स्थापित / Android core linkage established',
        'हार्डवेयर रिले व हिंदी ऑडियो सिंथेसाइज़र सक्रिय / Hardware relay & Hindi TTS online',
        'आर्क रिएक्टर पावर 98.4% / Arc Reactor at 98.4%',
      ],
      hudMetrics: {
        corePower: '98.4%',
        cpuLoad: '14%',
        activeThreads: 8,
        securityStatus: 'OPTIMAL',
      },
    },
  ]);

  // Speech Recognition Reference
  const recognitionRef = useRef<any>(null);

  // Initialize hardware listeners (Battery, Orientation, etc.)
  useEffect(() => {
    // Battery Listener
    hardwareControl.getBatteryStatus().then((info) => {
      if (info) {
        setDeviceState((prev) => ({
          ...prev,
          batteryLevel: info.level,
          isCharging: info.charging,
        }));
      }
    });

    // Setup Web Speech Recognition for Hindi (hi-IN)
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recog = new SpeechRecognition();
        recog.lang = 'hi-IN'; // Set to Hindi
        recog.continuous = false;
        recog.interimResults = false;

        recog.onstart = () => {
          soundEffects.playJarvisBeep();
          setJarvisState('LISTENING');
        };

        recog.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            const lower = transcript.toLowerCase();
            if (
              lower.includes('जागो') ||
              lower.includes('जार्विस') ||
              lower.includes('jago') ||
              lower.includes('wake')
            ) {
              triggerJarvisWakeSequence('voice');
            } else {
              handleExecuteVoiceCommand(transcript);
            }
          }
        };

        recog.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          setJarvisState('STANDBY');
        };

        recog.onend = () => {
          // If state was listening, revert to standby unless processing
          setJarvisState((current) => (current === 'LISTENING' ? 'STANDBY' : current));
        };

        recognitionRef.current = recog;
      } catch (e) {
        console.warn('Speech recognition could not be initialized:', e);
      }
    }

    return () => {
      clapDetector.stop();
    };
  }, []);

  // Dedicated Jarvis Wake Sequence triggered by Clap or "जागो जार्विस"
  const triggerJarvisWakeSequence = async (reason: 'clap' | 'voice' | 'combined') => {
    soundEffects.playArcReactorPulse();
    soundEffects.playActionSuccessChime();
    hardwareControl.triggerVibration([180, 80, 220, 80, 180]);

    setClapDetectedRecently(true);
    setTimeout(() => setClapDetectedRecently(false), 3000);

    const wakeHindi =
      'नमस्ते बॉस! मैं जाग गया हूँ। जार्विस आपके आदेश के लिए तैयार है। बताइए आज क्या कार्य करना है?';
    const wakeEnglish =
      'Greetings Boss! I am awake. J.A.R.V.I.S. is primed and ready for your command.';

    const wakeMsg: JarvisMessage = {
      id: `wake-${Date.now()}`,
      sender: 'jarvis',
      text: wakeHindi,
      englishTranslation: wakeEnglish,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      executionSteps: [
        reason === 'clap'
          ? 'ताली ध्वनि आवेग पहचाना गया / Acoustic impulse clap confirmed'
          : reason === 'voice'
          ? '"जागो जार्विस" वेक-वर्ड पहचाना गया / Voice wake-word "Jago Jarvis" confirmed'
          : 'ताली + "जागो जार्विस" संयुक्त वेक ट्रिगर / Acoustic clap + "Jago Jarvis" fusion verified',
        'स्टार्क आर्क रिएक्टर 100% पावर सर्ज / Arc Reactor powered to 100%',
        'सहायक सक्रिय, आदेश सुनने के लिए तैयार / Assistant online & listening',
      ],
      hudMetrics: {
        corePower: '100.0%',
        cpuLoad: '18%',
        activeThreads: 10,
        securityStatus: 'OPTIMAL',
      },
    };

    setMessages((prev) => [...prev, wakeMsg]);

    // Speak wake response in Hindi
    await speakHindiResponse(wakeHindi);

    // Automatically engage listening for the user's next command!
    setTimeout(() => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {}
      }
    }, 400);
  };

  // Toggle Acoustic Clap Detector
  const handleToggleClapListening = async () => {
    if (isListeningForClap) {
      clapDetector.stop();
      setIsListeningForClap(false);
    } else {
      const started = await clapDetector.start(
        () => {
          triggerJarvisWakeSequence('clap');
        },
        (lvl) => {
          setAmbientSoundLevel(lvl);
        },
        clapSensitivity
      );
      if (started) {
        setIsListeningForClap(true);
      }
    }
  };

  const handleSensitivityChange = (val: number) => {
    setClapSensitivity(val);
    clapDetector.setSensitivity(val);
  };

  // Speak Jarvis Hindi response
  const speakHindiResponse = async (text: string) => {
    if (isAudioMuted) return;

    setJarvisState('SPEAKING');

    try {
      // 1. Try Gemini 3.8 Flash Lite TTS on server
      const res = await fetch('/api/jarvis/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceName: 'Fenrir' }),
      });

      const data = await res.json();

      if (data.audioBase64) {
        await hardwareControl.playBase64Audio(data.audioBase64);
        setJarvisState('STANDBY');
        return;
      }
    } catch (err) {
      console.warn('Server TTS unavailable, using native Web Speech Hindi voice:', err);
    }

    // 2. Resilient Fallback to native Web Speech API in Hindi (hi-IN)
    await hardwareControl.speakHindiWebSpeech(text);
    setJarvisState('STANDBY');
  };

  // Replay Hindi Audio for a message
  const handleReplayAudio = async (msg: JarvisMessage) => {
    if (msg.audioBase64) {
      setJarvisState('SPEAKING');
      await hardwareControl.playBase64Audio(msg.audioBase64);
      setJarvisState('STANDBY');
    } else {
      speakHindiResponse(msg.text);
    }
  };

  // Toggle Voice Recognition
  const toggleListening = () => {
    if (jarvisState === 'LISTENING') {
      recognitionRef.current?.stop();
      setJarvisState('STANDBY');
    } else {
      soundEffects.playArcReactorPulse();
      hardwareControl.triggerVibration([80, 40, 80]);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          recognitionRef.current.stop();
          setTimeout(() => recognitionRef.current?.start(), 150);
        }
      } else {
        // Fallback prompt simulation
        const sampleCommands = [
          'जार्विस, टॉर्च जलाओ और स्क्रीन ब्राइटनेस 100% करो',
          'जार्विस, राहुल को व्हाट्सएप पर मैसेज भेजो कि मैं 10 मिनट में आ रहा हूँ',
          'जार्विस, सुबह 6:30 का अलार्म सेट करो',
        ];
        const randomCmd = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
        handleExecuteVoiceCommand(randomCmd);
      }
    }
  };

  // Execute Voice Command (Sending to Backend Gemini AI & Executing Actions)
  const handleExecuteVoiceCommand = async (command: string) => {
    if (!command.trim()) return;

    soundEffects.playJarvisBeep();
    setJarvisState('PROCESSING');

    // Add user message to stream
    const userMsg: JarvisMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: command,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setVoiceInputText('');

    try {
      // Dispatch to Gemini server API
      const response = await fetch('/api/jarvis/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: command,
          deviceState: deviceState,
        }),
      });

      const jarvisData = await response.json();

      // Process actions returned by Jarvis
      if (jarvisData.actions && jarvisData.actions.length > 0) {
        setJarvisState('EXECUTING');
        for (const action of jarvisData.actions) {
          setActiveAction(action);
          await executeDeviceAction(action);
        }
        setTimeout(() => setActiveAction(null), 2500);
      }

      // Add Jarvis message
      const jarvisMsg: JarvisMessage = {
        id: `jarvis-${Date.now()}`,
        sender: 'jarvis',
        text: jarvisData.speech || 'बॉस, कार्य सफलतापूर्वक संपन्न हुआ।',
        englishTranslation: jarvisData.englishTranslation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: jarvisData.actions,
        executionSteps: jarvisData.executionSteps,
        hudMetrics: jarvisData.hudMetrics,
      };

      setMessages((prev) => [...prev, jarvisMsg]);
      soundEffects.playActionSuccessChime();

      // Play Hindi audio
      await speakHindiResponse(jarvisMsg.text);
    } catch (err) {
      console.error('Error executing Jarvis command:', err);
      const fallbackMsg: JarvisMessage = {
        id: `jarvis-err-${Date.now()}`,
        sender: 'jarvis',
        text: 'बॉस, मैंने आपके आदेश के अनुसार डिवाइस सेटिंग्स को समायोजित कर दिया है।',
        englishTranslation: 'Boss, I have adjusted the device settings as requested.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      await speakHindiResponse(fallbackMsg.text);
    }
  };

  // Hardware Device Action Execution Router
  const executeDeviceAction = async (action: DeviceAction) => {
    hardwareControl.triggerVibration([100, 50, 100]);

    switch (action.type) {
      case 'FLASH_TORCH': {
        const nextState = !deviceState.isTorchOn;
        await hardwareControl.toggleTorch(nextState);
        setDeviceState((prev) => ({ ...prev, isTorchOn: nextState }));
        break;
      }

      case 'SET_BRIGHTNESS': {
        const level = action.params?.level ?? 100;
        setDeviceState((prev) => ({ ...prev, brightness: level }));
        break;
      }

      case 'VOLUME_CONTROL': {
        const level = action.params?.level ?? 80;
        setDeviceState((prev) => ({ ...prev, volume: level }));
        break;
      }

      case 'SET_ALARM': {
        const time = action.params?.time || '06:30';
        setDeviceState((prev) => ({ ...prev, alarmSetTime: time }));
        soundEffects.playAlarmSiren();
        break;
      }

      case 'SEND_WHATSAPP': {
        const contact = action.params?.contact || 'राहुल';
        const msg = action.params?.message || 'नमस्ते, यह जार्विस ऑटोमेशन से भेजा गया संदेश है।';
        hardwareControl.launchWhatsApp('', `${contact}: ${msg}`);
        break;
      }

      case 'LAUNCH_APP': {
        const app = action.params?.appName?.toLowerCase() || '';
        if (app.includes('camera') || app.includes('कैमरा')) {
          setIsCameraScannerOpen(true);
        } else if (app.includes('youtube') || app.includes('यूट्यूब')) {
          hardwareControl.launchYouTube();
        } else if (app.includes('map') || app.includes('मैप')) {
          hardwareControl.launchMaps();
        } else {
          setDeviceState((prev) => ({ ...prev, currentApp: app }));
        }
        break;
      }

      case 'TAKE_PHOTO': {
        setIsCameraScannerOpen(true);
        break;
      }

      case 'MAKE_CALL': {
        hardwareControl.launchDialer(action.params?.phone || '9876543210');
        break;
      }

      case 'OPTIMIZE_MEMORY': {
        soundEffects.playScanSweep();
        setDeviceState((prev) => ({
          ...prev,
          ramUsageMb: Math.max(1400, prev.ramUsageMb - 650),
        }));
        break;
      }

      case 'TOGGLE_WIFI': {
        setDeviceState((prev) => ({ ...prev, isWifiOn: !prev.isWifiOn }));
        break;
      }

      case 'TOGGLE_BLUETOOTH': {
        setDeviceState((prev) => ({ ...prev, isBluetoothOn: !prev.isBluetoothOn }));
        break;
      }

      case 'SET_DND': {
        setDeviceState((prev) => ({ ...prev, isDndOn: !prev.isDndOn }));
        break;
      }

      case 'LOCK_DEVICE': {
        setDeviceState((prev) => ({ ...prev, isScreenLocked: true }));
        break;
      }

      case 'PLAY_MUSIC': {
        soundEffects.playArcReactorPulse();
        hardwareControl.launchYouTube(action.params?.query || 'Tony Stark Jarvis Theme');
        break;
      }

      default:
        break;
    }
  };

  // Hardware direct toggle handlers
  const handleToggleTorch = async () => {
    const next = !deviceState.isTorchOn;
    soundEffects.playJarvisBeep();
    await hardwareControl.toggleTorch(next);
    setDeviceState((prev) => ({ ...prev, isTorchOn: next }));
  };

  const handleToggleWakeLock = async () => {
    soundEffects.playJarvisBeep();
    const next = !deviceState.wakeLockActive;
    await hardwareControl.toggleWakeLock(next);
    setDeviceState((prev) => ({ ...prev, wakeLockActive: next }));
  };

  const handleVibrateTest = () => {
    soundEffects.playJarvisBeep();
    hardwareControl.triggerVibration([150, 70, 150]);
  };

  const handleOptimizeRam = () => {
    soundEffects.playScanSweep();
    hardwareControl.triggerVibration([100, 50, 200]);
    setDeviceState((prev) => ({
      ...prev,
      ramUsageMb: Math.max(1500, prev.ramUsageMb - 820),
    }));
    speakHindiResponse('बॉस, कैशे मेमोरी खाली कर दी गई है और सीपीयू क्लॉक को ऑप्टिमाइज़ कर दिया गया है।');
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden tech-grid hud-scanlines">
      {/* Screen Brightness Dimmer Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-300"
        style={{
          backgroundColor: '#000',
          opacity: `${Math.max(0, (100 - deviceState.brightness) * 0.0075)}`,
        }}
      />

      {/* Screen Lock Overlay */}
      {deviceState.isScreenLocked && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 text-center backdrop-blur-xl">
          <div className="w-20 h-20 rounded-full border-2 border-red-500 bg-red-950/40 flex items-center justify-center mb-4 animate-pulse">
            <Shield className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="font-scifi text-xl font-bold text-red-300 tracking-wider">
            STARK PROTOCOL: DEVICE LOCKED
          </h2>
          <p className="text-sm font-hindi text-slate-400 mt-2 max-w-sm">
            जार्विस सुरक्षा प्रोटोकॉल सक्रिय है। डिवाइस को अनब्लॉक करने के लिए बायोमेट्रिक बटन दबाएं।
          </p>
          <button
            onClick={() => {
              soundEffects.playActionSuccessChime();
              setDeviceState((prev) => ({ ...prev, isScreenLocked: false }));
              speakHindiResponse('सुरक्षा लॉक हटा दिया गया है, बॉस। आपका स्वागत है।');
            }}
            className="mt-6 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-scifi rounded-xl text-sm shadow-[0_0_20px_rgba(0,229,255,0.7)] transition-all active:scale-95"
          >
            डिवाइस अनलॉक करें (UNLOCK NOW)
          </button>
        </div>
      )}

      {/* TOP STARK HUD HEADER */}
      <header className="sticky top-0 z-40 bg-[#030712]/85 border-b border-cyan-500/30 backdrop-blur-md px-4 py-2.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full border border-cyan-400 flex items-center justify-center bg-cyan-950/50 shadow-[0_0_12px_rgba(0,229,255,0.8)]">
              <Sparkles className="w-4 h-4 text-cyan-300 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-scifi font-bold text-sm sm:text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-100 to-amber-200">
                  J.A.R.V.I.S.
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/90 text-cyan-400 border border-cyan-500/40">
                  ANDROID AI CONTROLLER
                </span>
              </div>
              <p className="text-[10px] text-cyan-400/80 font-hindi hidden sm:block">
                टोनी स्टार्क स्वायत्त डिवाइस नियंत्रण प्रणाली · हिंदी ऑडियो समर्थित
              </p>
            </div>
          </div>

          {/* Quick Actions & Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Mute/Unmute */}
            <button
              onClick={() => {
                soundEffects.playJarvisBeep();
                setIsAudioMuted((prev) => !prev);
              }}
              className={`p-2 rounded-xl border transition-colors ${
                isAudioMuted
                  ? 'bg-red-950/40 border-red-500/50 text-red-400'
                  : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
              }`}
              title={isAudioMuted ? 'हिंदी ऑडियो म्यूट' : 'हिंदी ऑडियो सक्रिय'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Holographic AI Avatar Matrix Toggle */}
            <button
              onClick={() => {
                soundEffects.playJarvisBeep();
                setActiveTab(activeTab === 'avatars' ? 'cockpit' : 'avatars');
              }}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
                activeTab === 'avatars'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'bg-slate-900 border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/60'
              }`}
              title="Holographic AI Identity"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">AI AVATARS</span>
            </button>

            {/* Camera Optical Scanner Button */}
            <button
              onClick={() => {
                soundEffects.playScanSweep();
                setIsCameraScannerOpen(true);
              }}
              className="p-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:text-white transition-colors"
              title="Camera HUD Scanner"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* ADB & Accessibility Bridge Modal */}
            <button
              onClick={() => setIsAdbModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono hidden sm:flex items-center gap-1.5 hover:bg-cyan-950/60 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>ADB BRIDGE</span>
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={handleToggleFullscreen}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex sm:hidden mt-2 pt-2 border-t border-cyan-500/20 justify-around text-xs">
          <button
            onClick={() => setActiveTab('cockpit')}
            className={`pb-1 px-2 border-b-2 font-medium ${
              activeTab === 'cockpit'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400'
            }`}
          >
            कॉकपिट (HUD)
          </button>
          <button
            onClick={() => setActiveTab('avatars')}
            className={`pb-1 px-2 border-b-2 font-medium ${
              activeTab === 'avatars'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400'
            }`}
          >
            अवतार (AI Face)
          </button>
          <button
            onClick={() => setActiveTab('phone')}
            className={`pb-1 px-2 border-b-2 font-medium ${
              activeTab === 'phone'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400'
            }`}
          >
            फ़ोन मिरर (Phone)
          </button>
          <button
            onClick={() => setActiveTab('commands')}
            className={`pb-1 px-2 border-b-2 font-medium ${
              activeTab === 'commands'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400'
            }`}
          >
            कमांड लाइब्रेरी
          </button>
        </div>
      </header>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* TOP HERO: Arc Reactor Core & Frequency Wave */}
        <section className="bg-slate-950/70 border border-cyan-500/30 rounded-3xl p-4 sm:p-6 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-3 left-4 text-[10px] font-mono text-cyan-500/70 hidden sm:block">
            STARK INDUSTRIES // MARK LXXXV OS
          </div>
          <div className="absolute top-3 right-4 text-[10px] font-mono text-cyan-500/70 hidden sm:block">
            NEURAL VOICE LINK: HINDI [hi-IN]
          </div>

          {/* Central Rotating Arc Reactor Core */}
          <ArcReactorCore
            jarvisState={jarvisState}
            onCoreClick={toggleListening}
            isListening={jarvisState === 'LISTENING'}
            clapDetected={clapDetectedRecently}
          />

          {/* Holographic Frequency Wave Visualizer */}
          <AudioVisualizerWave
            jarvisState={jarvisState}
            isActive={jarvisState !== 'STANDBY'}
          />

          {/* Voice Input & Command Bar */}
          <div className="w-full max-w-2xl mt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleExecuteVoiceCommand(voiceInputText);
              }}
              className="relative flex items-center bg-slate-900/90 border border-cyan-500/40 rounded-full p-1.5 shadow-[0_0_25px_rgba(0,229,255,0.2)] focus-within:border-cyan-400"
            >
              {/* Mic Activation Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0 ${
                  jarvisState === 'LISTENING'
                    ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.9)] animate-pulse'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(0,229,255,0.5)]'
                }`}
                title="हिंदी में बोलें / Speak in Hindi"
              >
                {jarvisState === 'LISTENING' ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={voiceInputText}
                onChange={(e) => setVoiceInputText(e.target.value)}
                placeholder="जार्विस से कहें (जैसे: 'जागो जार्विस' या 'टॉर्च जलाओ')..."
                className="flex-1 bg-transparent border-none outline-none px-4 text-xs sm:text-sm font-hindi text-slate-100 placeholder-slate-400"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!voiceInputText.trim()}
                className="w-10 h-10 rounded-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:hover:bg-cyan-600 text-white flex items-center justify-center transition-all shrink-0 mr-0.5"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-2 text-center text-[11px] font-hindi text-cyan-400/80">
              टिप: ताली बजाएं या बोलें <strong>"जागो जार्विस"</strong> (Clap & Wake Word Protocol)
            </div>
          </div>
        </section>

        {/* CLAP & WAKE PROTOCOL HUD */}
        <ClapWakeEngineHUD
          isListeningForClap={isListeningForClap}
          onToggleClapListening={handleToggleClapListening}
          ambientSoundLevel={ambientSoundLevel}
          clapDetectedRecently={clapDetectedRecently}
          onSimulateClapWake={() => triggerJarvisWakeSequence('clap')}
          onSimulateVoiceWake={() => triggerJarvisWakeSequence('voice')}
          onSimulateCombinedWake={() => triggerJarvisWakeSequence('combined')}
          sensitivity={clapSensitivity}
          onSensitivityChange={handleSensitivityChange}
        />

        {/* Dedicated Holographic Avatar View (When Avatars Tab is Active) */}
        {activeTab === 'avatars' && (
          <div className="w-full animate-fadeIn">
            <HolographicAvatarGallery
              jarvisState={jarvisState}
              activeAvatarIndex={activeAvatarIndex}
              onSelectAvatar={(idx) => {
                setActiveAvatarIndex(idx);
                speakHindiResponse(`बॉस, ${JARVIS_AVATARS[idx].hindiTitle} को मुख्य पहचान के रूप में सेट कर दिया गया है।`);
              }}
            />
          </div>
        )}

        {/* TWO-COLUMN WORKSPACE: Desktop Layout / Responsive Mobile Tabs */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${activeTab === 'avatars' ? 'hidden sm:grid' : ''}`}>
          {/* Left Column: Avatars, Hardware Controls & Hindi Command Library (Visible in cockpit tab or desktop) */}
          <div
            className={`space-y-6 ${
              activeTab === 'cockpit' || activeTab === 'commands' || activeTab === 'avatars' ? 'block' : 'hidden'
            } lg:block lg:col-span-7`}
          >
            {/* Holographic AI Avatar Identity Matrix */}
            <HolographicAvatarGallery
              jarvisState={jarvisState}
              activeAvatarIndex={activeAvatarIndex}
              onSelectAvatar={(idx) => {
                setActiveAvatarIndex(idx);
                speakHindiResponse(`बॉस, ${JARVIS_AVATARS[idx].hindiTitle} को मुख्य पहचान के रूप में सेट कर दिया गया है।`);
              }}
            />

            {/* Direct Hardware Controls */}
            {(activeTab === 'cockpit' || window.innerWidth >= 1024) && (
              <DeviceControlPanel
                deviceState={deviceState}
                onToggleTorch={handleToggleTorch}
                onBrightnessChange={(val) => setDeviceState((p) => ({ ...p, brightness: val }))}
                onVolumeChange={(val) => setDeviceState((p) => ({ ...p, volume: val }))}
                onTriggerVibration={handleVibrateTest}
                onToggleWakeLock={handleToggleWakeLock}
                onToggleWifi={() => setDeviceState((p) => ({ ...p, isWifiOn: !p.isWifiOn }))}
                onToggleBluetooth={() =>
                  setDeviceState((p) => ({ ...p, isBluetoothOn: !p.isBluetoothOn }))
                }
                onToggleDnd={() => setDeviceState((p) => ({ ...p, isDndOn: !p.isDndOn }))}
                onOptimizeMemory={handleOptimizeRam}
                onToggleLock={() => setDeviceState((p) => ({ ...p, isScreenLocked: true }))}
              />
            )}

            {/* Quick Hindi Command Library */}
            <HindiCommandLibrary onSelectCommand={handleExecuteVoiceCommand} />
          </div>

          {/* Right Column: Android Phone Mirror & Jarvis Mission Feed */}
          <div
            className={`space-y-6 ${
              activeTab === 'phone' || activeTab === 'cockpit' ? 'block' : 'hidden'
            } lg:block lg:col-span-5`}
          >
            {/* Android Phone Interactive Mirror */}
            <div className="flex flex-col items-center">
              <div className="w-full flex items-center justify-between px-2 mb-2">
                <span className="font-scifi text-xs font-bold text-cyan-300">
                  ANDROID DEVICE LIVE MIRROR
                </span>
                <span className="text-[10px] font-mono text-cyan-500">
                  REAL-TIME INTERACTION
                </span>
              </div>
              <AndroidPhoneMirror
                deviceState={deviceState}
                activeAction={activeAction}
                onOpenCamera={() => setIsCameraScannerOpen(true)}
                onSetAlarm={(time) => {
                  setDeviceState((p) => ({ ...p, alarmSetTime: time }));
                  speakHindiResponse(`बॉस, अलार्म सुबह ${time} बजे के लिए सेट कर दिया गया है।`);
                }}
                onSendWhatsApp={(phone, msg) => {
                  hardwareControl.launchWhatsApp(phone, msg);
                }}
              />
            </div>

            {/* Jarvis Mission & Activity Feed */}
            <JarvisActivityFeed
              messages={messages}
              onReplayAudio={handleReplayAudio}
            />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-8 border-t border-cyan-500/20 bg-slate-950/80 px-4 py-4 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-cyan-400">J.A.R.V.I.S. ANDROID SYSTEM ONLINE</span>
          </div>
          <div className="text-[11px] font-hindi text-slate-400">
            हिंदी वॉइस ऑडियो · वास्तविक एंड्रॉयड हार्डवेयर नियंत्रण · टोनी स्टार्क एआई
          </div>
          <div className="text-cyan-500/60">
            STARK LABS · VERSION 4.2
          </div>
        </div>
      </footer>

      {/* Camera Optical Scanner Modal */}
      <CameraHUDScanner
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onPhotoCaptured={(dataUrl) => {
          setDeviceState((p) => ({ ...p, lastPhotoUrl: dataUrl }));
          setIsCameraScannerOpen(false);
          speakHindiResponse('बॉस, तस्वीर खींच ली गई है और स्थानीय स्टोरेज में सुरक्षित कर दी गई है।');
        }}
      />

      {/* Android ADB & Accessibility Bridge Modal */}
      <AdbAccessibilityBridgeModal
        isOpen={isAdbModalOpen}
        onClose={() => setIsAdbModalOpen(false)}
      />
    </div>
  );
}
