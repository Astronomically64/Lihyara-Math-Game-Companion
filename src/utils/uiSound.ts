type UiSound = 'tap' | 'success' | 'error' | 'countdown';

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;

  const AudioContextConstructor = window.AudioContext
    ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextConstructor) return null;

  audioContext ??= new AudioContextConstructor();
  if (audioContext.state === 'suspended') {
    void audioContext.resume();
  }
  return audioContext;
};

export const playUiSound = (sound: UiSound): void => {
  const context = getAudioContext();
  if (!context) return;

  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const settings = {
    tap: { frequency: 520, duration: 0.055, volume: 0.035, type: 'sine' as OscillatorType },
    success: { frequency: 660, duration: 0.12, volume: 0.05, type: 'sine' as OscillatorType },
    error: { frequency: 180, duration: 0.14, volume: 0.04, type: 'triangle' as OscillatorType },
    countdown: { frequency: 740, duration: 0.08, volume: 0.04, type: 'square' as OscillatorType },
  }[sound];

  oscillator.type = settings.type;
  oscillator.frequency.setValueAtTime(settings.frequency, now);
  if (sound === 'success') {
    oscillator.frequency.setValueAtTime(880, now + 0.08);
  }
  if (sound === 'error') {
    oscillator.frequency.exponentialRampToValueAtTime(130, now + settings.duration);
  }

  gain.gain.setValueAtTime(settings.volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + settings.duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + settings.duration);
};