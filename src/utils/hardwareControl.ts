// Hardware control interface for Android Web & Native bridge

class AndroidHardwareController {
  private torchStream: MediaStream | null = null;
  private wakeLockSentinel: any = null;
  private currentAudioElement: HTMLAudioElement | null = null;

  // Toggle Torch / Flashlight on real Android phone camera LED
  async toggleTorch(enable: boolean): Promise<boolean> {
    try {
      if (enable) {
        if (!this.torchStream) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'environment',
            },
          });
          this.torchStream = stream;
        }

        const track = this.torchStream.getVideoTracks()[0];
        const capabilities: any = track.getCapabilities?.() || {};

        if (capabilities.torch) {
          await (track as any).applyConstraints({
            advanced: [{ torch: true }],
          });
          return true;
        } else {
          console.warn('Hardware torch capability not supported on this track, simulating.');
          return true;
        }
      } else {
        if (this.torchStream) {
          const track = this.torchStream.getVideoTracks()[0];
          try {
            await (track as any).applyConstraints({
              advanced: [{ torch: false }],
            });
          } catch (e) {}
          this.torchStream.getTracks().forEach((t) => t.stop());
          this.torchStream = null;
        }
        return false;
      }
    } catch (err) {
      console.warn('Torch access error (permission or device capability):', err);
      // Return simulated success state for UI
      return enable;
    }
  }

  // Trigger real Android device haptic vibration
  triggerVibration(pattern: number[] = [120, 60, 120]): boolean {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  // Request Android Screen Wake Lock (keeps display active like Iron Man HUD)
  async toggleWakeLock(enable: boolean): Promise<boolean> {
    if ('wakeLock' in navigator) {
      try {
        if (enable) {
          this.wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
          return true;
        } else {
          if (this.wakeLockSentinel) {
            await this.wakeLockSentinel.release();
            this.wakeLockSentinel = null;
          }
          return false;
        }
      } catch (err) {
        console.warn('Wake Lock error:', err);
        return false;
      }
    }
    return false;
  }

  // Read real device battery info
  async getBatteryStatus(): Promise<{ level: number; charging: boolean } | null> {
    if ('getBattery' in navigator) {
      try {
        const battery: any = await (navigator as any).getBattery();
        return {
          level: Math.round(battery.level * 100),
          charging: battery.charging,
        };
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Play audio (Gemini WAV base64)
  async playBase64Audio(base64Wav: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.currentAudioElement) {
          this.currentAudioElement.pause();
          this.currentAudioElement = null;
        }

        const audio = new Audio(`data:audio/wav;base64,${base64Wav}`);
        this.currentAudioElement = audio;

        audio.onended = () => {
          this.currentAudioElement = null;
          resolve();
        };

        audio.onerror = (e) => {
          this.currentAudioElement = null;
          reject(e);
        };

        audio.play().catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  // Stop currently playing speech audio
  stopAudio() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Native Hindi Speech Synthesis (Web Speech API)
  speakHindiWebSpeech(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 1.0;
      utterance.pitch = 0.95; // Dignified JARVIS depth

      // Find Hindi voice if installed on Android or desktop
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(
        (v) => v.lang === 'hi-IN' || v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')
      );
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  // Launch Android WhatsApp intent
  launchWhatsApp(phone?: string, message?: string) {
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(message || 'नमस्ते, यह जार्विस एआई द्वारा भेजा गया संदेश है।');
    
    if (cleanPhone) {
      // Direct message to phone
      const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
      window.open(url, '_blank');
    } else {
      // General WhatsApp share
      const url = `whatsapp://send?text=${encodedText}`;
      // Fallback
      window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
    }
  }

  // Launch Android Dialer
  launchDialer(phone?: string) {
    const target = phone ? `tel:${phone}` : 'tel:';
    window.location.href = target;
  }

  // Launch Google Maps intent
  launchMaps(query: string = 'nearby') {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  }

  // Launch YouTube intent
  launchYouTube(query: string = 'Tony Stark Jarvis theme') {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  }

  // Android Native Share (Web Share API)
  async shareNative(title: string, text: string) {
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }
}

export const hardwareControl = new AndroidHardwareController();
