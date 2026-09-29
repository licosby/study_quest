let currentAudio: HTMLAudioElement | null = null;

export function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export async function playNativeSpeech(
  text: string,
  options?: {
    language?: 'Spanish' | 'French' | 'German' | 'English';
    base64Audio?: string | null;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): Promise<void> {
  stopCurrentAudio();

  const langCodeMap: Record<string, string> = {
    Spanish: 'es-ES',
    French: 'fr-FR',
    German: 'de-DE',
    English: 'en-US',
  };

  const targetLang = options?.language || 'Spanish';
  const langCode = langCodeMap[targetLang] || 'es-ES';

  // 1. If base64 audio from Gemini TTS is provided, play it directly
  if (options?.base64Audio) {
    try {
      const audio = new Audio(`data:audio/wav;base64,${options.base64Audio}`);
      currentAudio = audio;
      audio.playbackRate = 1.0; // Strictly native speed (no slowing down)
      audio.onended = () => {
        currentAudio = null;
        options.onEnd?.();
      };
      audio.onerror = (e) => {
        console.warn('Base64 audio playback failed, falling back to Web Speech:', e);
        fallbackWebSpeech(text, langCode, options?.onEnd, options?.onError);
      };
      await audio.play();
      return;
    } catch (e) {
      console.warn('Audio play exception, fallback to Web Speech:', e);
    }
  }

  // 2. Web Speech API fallback at native speed 1.0
  fallbackWebSpeech(text, langCode, options?.onEnd, options?.onError);
}

function fallbackWebSpeech(
  text: string,
  langCode: string,
  onEnd?: () => void,
  onError?: (err: any) => void
) {
  if (!('speechSynthesis' in window)) {
    onError?.(new Error('Speech synthesis not supported in this browser.'));
    return;
  }

  window.speechSynthesis.cancel();

  // Clean dialogue prefixes like "Oficial:" or "Pasajero:" for clean pronunciation
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  utterance.rate = 1.0; // Strictly 1.0x native speed as required
  utterance.pitch = 1.0;

  // Try to find matching voice
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) => v.lang.startsWith(langCode.slice(0, 2)));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = (err) => {
    console.warn('SpeechSynthesis error:', err);
    onError?.(err);
  };

  window.speechSynthesis.speak(utterance);
}
