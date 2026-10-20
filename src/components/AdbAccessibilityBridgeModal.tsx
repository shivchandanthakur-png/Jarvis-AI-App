import React, { useState } from 'react';
import { X, Terminal, Shield, Copy, Check, Download, ExternalLink, Cpu } from 'lucide-react';

interface AdbAccessibilityBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdbAccessibilityBridgeModal: React.FC<AdbAccessibilityBridgeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const scriptContent = `#!/bin/bash
# ==========================================
# J.A.R.V.I.S. ANDROID AUTONOMOUS DAEMON v4.2
# Tony Stark Autonomous Device Protocol
# ==========================================

echo "⚡ Initializing JARVIS Android Controller..."

# 1. Enable Accessibility & Input Injection
adb shell settings put secure enabled_accessibility_services com.stark.jarvis/com.stark.jarvis.AccessibilityService

# 2. Grant Device Admin & Permissions
adb shell pm grant com.stark.jarvis android.permission.WRITE_SECURE_SETTINGS
adb shell pm grant com.stark.jarvis android.permission.SYSTEM_ALERT_WINDOW

# 3. Hardware control commands:
# Flashlight: adb shell "echo 1 > /sys/class/leds/torch-light/brightness"
# Brightness: adb shell settings put system screen_brightness 255
# Alarm: adb shell am start -a android.intent.action.SET_ALARM --ei android.intent.extra.alarm.HOUR 6 --ei android.intent.extra.alarm.MINUTES 30
# WhatsApp: adb shell am start -a android.intent.action.VIEW -d "whatsapp://send?phone=...&text=..."

echo "✓ JARVIS Android Daemon Bridge Connected!"
`;

  const commands = [
    {
      title: 'पूरी स्क्रीन ब्राइटनेस 100% (ADB)',
      cmd: 'adb shell settings put system screen_brightness 255',
    },
    {
      title: 'टॉर्च चालू करें (Hardware Torch)',
      cmd: 'termux-torch on  # या: adb shell "cmd flashlight on"',
    },
    {
      title: 'अलार्म सेट करें (Android Clock Alarm)',
      cmd: 'adb shell am start -a android.intent.action.SET_ALARM --ei android.intent.extra.alarm.HOUR 6 --ei android.intent.extra.alarm.MINUTES 30',
    },
    {
      title: 'व्हाट्सएप ऑटोमेशन (Direct WhatsApp Intent)',
      cmd: 'adb shell am start -a android.intent.action.VIEW -d "whatsapp://send?text=JARVIS_AUTONOMOUS_MESSAGE"',
    },
    {
      title: 'डिवाइस लॉक करें (Lock Android Screen)',
      cmd: 'adb shell input keyevent 26',
    },
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadScript = () => {
    const blob = new Blob([scriptContent], { type: 'text/x-shellscript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jarvis_android_daemon.sh';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-cyan-500/50 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,229,255,0.3)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/20 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-scifi text-sm sm:text-base font-bold text-cyan-200 tracking-wider">
                ANDROID ADB & ACCESSIBILITY BRIDGE
              </h3>
              <p className="text-xs text-slate-400 font-hindi">
                पूरे एंड्रॉयड सिस्टम का 100% डीप कंट्रोल और बैकग्राउंड ऑटोमेशन
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Explanation Banner */}
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 flex items-start gap-3">
            <Shield className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="font-hindi text-xs sm:text-sm leading-relaxed">
              <strong className="text-cyan-300 font-sans block mb-1">
                जार्विस वास्तविक एंड्रॉयड डिवाइस को कैसे नियंत्रित करता है?
              </strong>
              1. <strong>वेब हार्डवेयर एपीआई:</strong> कैमरा टॉर्च, वाइब्रेशन, बैटरी, वेक-लॉक और ऑडियो सीधे इस ऐप से काम करते हैं।
              <br />
              2. <strong>सिस्टम इंटेंट्स:</strong> व्हाट्सएप, फोन कॉल, यूट्यूब और मैप्स सीधे ऐप में खुलते हैं।
              <br />
              3. <strong>डीप ऑटोमेशन (ADB/Termux/Shizuku):</strong> यदि आप किसी भी ऐप में स्वचालित क्लिक या बैकग्राउंड ऑटोमेशन चाहते हैं, तो नीचे दिया गया ब्रिज स्क्रिप्ट चलाएं।
            </div>
          </div>

          {/* Quick Copy ADB Commands */}
          <div>
            <h4 className="font-scifi text-xs font-bold text-cyan-300 tracking-wider mb-2">
              QUICK ADB / TERMUX COMMANDS
            </h4>
            <div className="space-y-2">
              {commands.map((c, i) => (
                <div
                  key={i}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-hindi text-cyan-400 block mb-0.5">{c.title}</span>
                    <code className="text-[10px] sm:text-xs font-mono text-slate-300 truncate block">
                      {c.cmd}
                    </code>
                  </div>
                  <button
                    onClick={() => handleCopy(c.cmd, i)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-cyan-900/50 text-cyan-300 shrink-0 transition-colors"
                    title="Copy command"
                  >
                    {copiedIndex === i ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Download Script */}
          <div className="pt-2">
            <button
              onClick={handleDownloadScript}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-scifi rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.5)] active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              JARVIS_ANDROID_DAEMON.SH डाउनलोड करें
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
