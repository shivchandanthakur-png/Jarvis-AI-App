import React from 'react';
import { DeviceState } from '../types/jarvis';
import {
  Flashlight,
  Sun,
  Volume2,
  Battery,
  BatteryCharging,
  Vibrate,
  Eye,
  Wifi,
  Bluetooth,
  BellOff,
  Cpu,
  Lock,
  Unlock,
  Sparkles,
} from 'lucide-react';

interface DeviceControlPanelProps {
  deviceState: DeviceState;
  onToggleTorch: () => void;
  onBrightnessChange: (val: number) => void;
  onVolumeChange: (val: number) => void;
  onTriggerVibration: () => void;
  onToggleWakeLock: () => void;
  onToggleWifi: () => void;
  onToggleBluetooth: () => void;
  onToggleDnd: () => void;
  onOptimizeMemory: () => void;
  onToggleLock: () => void;
}

export const DeviceControlPanel: React.FC<DeviceControlPanelProps> = ({
  deviceState,
  onToggleTorch,
  onBrightnessChange,
  onVolumeChange,
  onTriggerVibration,
  onToggleWakeLock,
  onToggleWifi,
  onToggleBluetooth,
  onToggleDnd,
  onOptimizeMemory,
  onToggleLock,
}) => {
  const ramPercent = Math.round((deviceState.ramUsageMb / deviceState.totalRamMb) * 100);

  return (
    <div className="bg-slate-900/60 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,1)] animate-ping" />
          <h3 className="font-scifi text-sm sm:text-base font-bold tracking-wider text-cyan-200">
            ANDROID HARDWARE CONTROLS
          </h3>
        </div>
        <span className="text-[11px] font-hindi text-cyan-400/90 font-medium">
          डिवाइस ऑटोमेशन नियंत्रण
        </span>
      </div>

      {/* Grid of Direct Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* 1. Flashlight / Torch */}
        <button
          onClick={onToggleTorch}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
            deviceState.isTorchOn
              ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
              : 'bg-slate-950/50 border-cyan-900/50 hover:border-cyan-500/50 text-slate-300'
          }`}
        >
          <Flashlight
            className={`w-6 h-6 transition-transform ${
              deviceState.isTorchOn ? 'text-amber-300 scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,1)]' : 'text-slate-400'
            }`}
          />
          <div className="text-center">
            <span className="text-xs font-semibold block">टॉर्च (Torch)</span>
            <span className="text-[10px] font-mono text-cyan-400">
              {deviceState.isTorchOn ? 'सक्रिय (ON)' : 'बंद (OFF)'}
            </span>
          </div>
        </button>

        {/* 2. Vibration Haptics */}
        <button
          onClick={onTriggerVibration}
          className="p-3 rounded-xl border bg-slate-950/50 border-cyan-900/50 hover:border-cyan-400/60 text-slate-300 flex flex-col items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Vibrate className="w-6 h-6 text-cyan-400 animate-bounce" />
          <div className="text-center">
            <span className="text-xs font-semibold block">वाइब्रेशन (Haptic)</span>
            <span className="text-[10px] font-mono text-cyan-400">पल्स टेस्ट</span>
          </div>
        </button>

        {/* 3. Screen Wake Lock */}
        <button
          onClick={onToggleWakeLock}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
            deviceState.wakeLockActive
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
              : 'bg-slate-950/50 border-cyan-900/50 hover:border-cyan-500/50 text-slate-300'
          }`}
        >
          <Eye className={`w-6 h-6 ${deviceState.wakeLockActive ? 'text-cyan-300' : 'text-slate-400'}`} />
          <div className="text-center">
            <span className="text-xs font-semibold block">वेक लॉक (Awake)</span>
            <span className="text-[10px] font-mono text-cyan-400">
              {deviceState.wakeLockActive ? 'स्क्रीन ऑन' : 'स्टैंडबाय'}
            </span>
          </div>
        </button>

        {/* 4. RAM Optimizer */}
        <button
          onClick={onOptimizeMemory}
          className="p-3 rounded-xl border bg-slate-950/50 border-cyan-900/50 hover:border-cyan-400 text-slate-300 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group"
        >
          <Sparkles className="w-6 h-6 text-amber-400 group-hover:rotate-45 transition-transform" />
          <div className="text-center">
            <span className="text-xs font-semibold block">रैम बूस्ट (RAM)</span>
            <span className="text-[10px] font-mono text-amber-300">क्लीन मेमोरी</span>
          </div>
        </button>

        {/* 5. Wi-Fi Status */}
        <button
          onClick={onToggleWifi}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
            deviceState.isWifiOn
              ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-300'
              : 'bg-slate-950/50 border-slate-800 text-slate-500'
          }`}
        >
          <Wifi className="w-6 h-6" />
          <div className="text-center">
            <span className="text-xs font-semibold block">वाई-फाई (Wi-Fi)</span>
            <span className="text-[10px] font-mono">{deviceState.isWifiOn ? 'सक्रिय' : 'बंद'}</span>
          </div>
        </button>

        {/* 6. Bluetooth Status */}
        <button
          onClick={onToggleBluetooth}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
            deviceState.isBluetoothOn
              ? 'bg-blue-950/40 border-blue-500/60 text-blue-300'
              : 'bg-slate-950/50 border-slate-800 text-slate-500'
          }`}
        >
          <Bluetooth className="w-6 h-6" />
          <div className="text-center">
            <span className="text-xs font-semibold block">ब्लूटूथ (BT)</span>
            <span className="text-[10px] font-mono">{deviceState.isBluetoothOn ? 'सक्रिय' : 'बंद'}</span>
          </div>
        </button>

        {/* 7. DND Mode */}
        <button
          onClick={onToggleDnd}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
            deviceState.isDndOn
              ? 'bg-purple-950/40 border-purple-500/60 text-purple-300'
              : 'bg-slate-950/50 border-slate-800 text-slate-400'
          }`}
        >
          <BellOff className="w-6 h-6" />
          <div className="text-center">
            <span className="text-xs font-semibold block">डू नॉट डिस्टर्ब</span>
            <span className="text-[10px] font-mono">{deviceState.isDndOn ? 'साइलेंट' : 'सामान्य'}</span>
          </div>
        </button>

        {/* 8. Device Lock */}
        <button
          onClick={onToggleLock}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
            deviceState.isScreenLocked
              ? 'bg-red-950/40 border-red-500/60 text-red-300'
              : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
          }`}
        >
          {deviceState.isScreenLocked ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
          <div className="text-center">
            <span className="text-xs font-semibold block">सुरक्षा लॉक</span>
            <span className="text-[10px] font-mono">{deviceState.isScreenLocked ? 'लॉक्ड' : 'अनलॉक्ड'}</span>
          </div>
        </button>
      </div>

      {/* Sliders Section: Brightness, Volume, Diagnostics */}
      <div className="mt-4 pt-3 border-t border-cyan-500/20 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Brightness Slider */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-cyan-900/40">
          <div className="flex items-center justify-between text-xs mb-1.5 text-cyan-200">
            <div className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="font-hindi">स्क्रीन ब्राइटनेस (Brightness)</span>
            </div>
            <span className="font-mono font-bold">{deviceState.brightness}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={deviceState.brightness}
            onChange={(e) => onBrightnessChange(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Volume Slider */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-cyan-900/40">
          <div className="flex items-center justify-between text-xs mb-1.5 text-cyan-200">
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span className="font-hindi">सिस्टम वॉल्यूम (Volume)</span>
            </div>
            <span className="font-mono font-bold">{deviceState.volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={deviceState.volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>
      </div>

      {/* Real-time Hardware Telemetry Strip */}
      <div className="mt-3 pt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-cyan-400/80 px-1">
        <div className="flex items-center gap-1.5">
          {deviceState.isCharging ? (
            <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
          ) : (
            <Battery className="w-4 h-4 text-cyan-400" />
          )}
          <span>
            बैटरी: {deviceState.batteryLevel !== null ? `${deviceState.batteryLevel}%` : '85%'}
            {deviceState.isCharging && ' (चार्जिंग)'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>रैम उपयोग: {deviceState.ramUsageMb}MB / {deviceState.totalRamMb}MB ({ramPercent}%)</span>
        </div>
      </div>
    </div>
  );
};
