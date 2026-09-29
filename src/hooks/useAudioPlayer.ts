import { useState, useEffect, useCallback } from 'react';
import { playNativeSpeech, stopCurrentAudio } from '../utils/audioHelper.js';
import { api } from '../api/client.js';

export function useAudioPlayer(initialPrompt?: string, language: 'Spanish' | 'French' | 'German' = 'Spanish') {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [base64Audio, setBase64Audio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const play = useCallback(async (promptText: string) => {
    setIsPlaying(true);
    setIsLoading(true);

    try {
      const data = await api.synthesizeSpeech(promptText);
      if (data.audioBase64) {
        setBase64Audio(data.audioBase64);
      }
      setIsLoading(false);

      await playNativeSpeech(promptText, {
        language,
        base64Audio: data.audioBase64,
        onEnd: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });
    } catch (e) {
      setIsLoading(false);
      await playNativeSpeech(promptText, {
        language,
        onEnd: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });
    }
  }, [language]);

  const stop = useCallback(() => {
    stopCurrentAudio();
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCurrentAudio();
    };
  }, []);

  return {
    isPlaying,
    isLoading,
    play,
    stop,
  };
}
