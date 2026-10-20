// Advanced Acoustic Clap & Impulse Detector using Web Audio API

export interface ClapDetectorOptions {
  threshold?: number; // 0.0 to 1.0 (sensitivity threshold)
  cooldownMs?: number; // Minimum time between claps
  energyRiseRatio?: number; // Rapid energy rise ratio required for snap/clap
}

class AcousticClapDetector {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphoneStream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private isListening: boolean = false;
  private lastClapTime: number = 0;
  private prevEnergy: number = 0;
  private threshold: number = 0.65; // Sensitivity default
  private cooldownMs: number = 600;

  // Listeners
  private onClapCallback: ((volume: number) => void) | null = null;
  private onVolumeChangeCallback: ((level: number) => void) | null = null;

  async start(
    onClap: (volume: number) => void,
    onVolumeChange?: (level: number) => void,
    customThreshold: number = 0.65
  ): Promise<boolean> {
    this.onClapCallback = onClap;
    this.onVolumeChangeCallback = onVolumeChange || null;
    this.threshold = customThreshold;

    if (this.isListening) return true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      this.microphoneStream = stream;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtx();
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      const source = this.audioCtx.createMediaStreamSource(stream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.15; // Fast response for transients

      // Bandpass filter to isolate clap frequency (1000Hz - 4000Hz)
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, this.audioCtx.currentTime);
      filter.Q.setValueAtTime(1.2, this.audioCtx.currentTime);

      source.connect(filter);
      filter.connect(this.analyser);

      this.isListening = true;
      this.startAnalysisLoop();
      return true;
    } catch (err) {
      console.warn('Microphone permission not granted or audio error:', err);
      return false;
    }
  }

  setSensitivity(val: number) {
    // Val is 0.1 (very sensitive) to 0.95 (hard clap)
    this.threshold = Math.max(0.1, Math.min(0.95, val));
  }

  private startAnalysisLoop() {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const checkAudio = () => {
      if (!this.isListening || !this.analyser) return;

      this.analyser.getByteFrequencyData(dataArray);

      // Calculate instantaneous high-frequency transient energy
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length; // 0 to 255
      const normalizedEnergy = avg / 255; // 0.0 to 1.0

      this.onVolumeChangeCallback?.(normalizedEnergy);

      const now = Date.now();
      // Clap detection logic: Sudden explosive spike in energy vs previous frame
      const energyDelta = normalizedEnergy - this.prevEnergy;

      if (
        normalizedEnergy > this.threshold &&
        energyDelta > 0.25 &&
        now - this.lastClapTime > this.cooldownMs
      ) {
        this.lastClapTime = now;
        this.onClapCallback?.(normalizedEnergy);
      }

      this.prevEnergy = normalizedEnergy;
      this.animFrameId = requestAnimationFrame(checkAudio);
    };

    this.animFrameId = requestAnimationFrame(checkAudio);
  }

  stop() {
    this.isListening = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.microphoneStream) {
      this.microphoneStream.getTracks().forEach((t) => t.stop());
      this.microphoneStream = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

export const clapDetector = new AcousticClapDetector();
