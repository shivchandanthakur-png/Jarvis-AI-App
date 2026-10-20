export interface DeviceState {
  batteryLevel: number | null;
  isCharging: boolean;
  isTorchOn: boolean;
  brightness: number; // 0 - 100
  volume: number; // 0 - 100
  isWifiOn: boolean;
  isBluetoothOn: boolean;
  isDndOn: boolean;
  isScreenLocked: boolean;
  currentApp: string | null;
  ramUsageMb: number;
  totalRamMb: number;
  wakeLockActive: boolean;
  alarmSetTime: string | null;
  lastPhotoUrl: string | null;
}

export type JarvisState = 'STANDBY' | 'LISTENING' | 'PROCESSING' | 'EXECUTING' | 'SPEAKING';

export interface DeviceAction {
  id: string;
  type: 
    | 'FLASH_TORCH' 
    | 'SET_BRIGHTNESS' 
    | 'SET_ALARM' 
    | 'SEND_WHATSAPP' 
    | 'LAUNCH_APP' 
    | 'CHECK_BATTERY' 
    | 'TOGGLE_WIFI' 
    | 'TOGGLE_BLUETOOTH' 
    | 'TAKE_PHOTO' 
    | 'MAKE_CALL' 
    | 'VOLUME_CONTROL' 
    | 'OPEN_MAPS' 
    | 'OPTIMIZE_MEMORY' 
    | 'LOCK_DEVICE' 
    | 'SET_DND' 
    | 'PLAY_MUSIC'
    | 'SYSTEM_AUDIT'
    | 'GENERAL_QUERY';
  title: string;
  target: string;
  params?: {
    value?: any;
    contact?: string;
    message?: string;
    time?: string;
    appName?: string;
    level?: number;
    phone?: string;
    query?: string;
  };
  status?: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
}

export interface JarvisMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string; // User message or Jarvis Hindi response
  englishTranslation?: string;
  timestamp: string;
  actions?: DeviceAction[];
  executionSteps?: string[];
  audioBase64?: string;
  hudMetrics?: {
    corePower?: string;
    cpuLoad?: string;
    activeThreads?: number;
    securityStatus?: string;
  };
}

export interface AndroidAppInfo {
  id: string;
  name: string;
  hindiName: string;
  iconName: string;
  color: string;
  category: 'social' | 'system' | 'media' | 'utility';
  packageIntent?: string;
  defaultAction?: string;
}
