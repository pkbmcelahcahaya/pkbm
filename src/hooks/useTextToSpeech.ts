import { useState, useEffect, useCallback } from 'react';
import { ttsService, TtsOptions, TtsStatus } from '../services/ttsService';

export function useTextToSpeech() {
  const [state, setState] = useState(() => ttsService.getState());

  useEffect(() => {
    const unsubscribe = ttsService.subscribe(newState => {
      setState({
        ...newState,
        isSupported: ttsService.isSupported()
      });
    });
    return unsubscribe;
  }, []);

  const speak = useCallback((text: string, options?: TtsOptions) => {
    ttsService.speak(text, options);
  }, []);

  const pause = useCallback(() => {
    ttsService.pause();
  }, []);

  const resume = useCallback(() => {
    ttsService.resume();
  }, []);

  const stop = useCallback(() => {
    ttsService.stop();
  }, []);

  const setRate = useCallback((rate: number) => {
    ttsService.setRate(rate);
  }, []);

  return {
    status: state.status,
    isPlaying: state.status === 'playing',
    isPaused: state.status === 'paused',
    isIdle: state.status === 'idle',
    currentText: state.currentText,
    currentTitle: state.currentTitle,
    rate: state.rate,
    isSupported: state.isSupported,
    speak,
    pause,
    resume,
    stop,
    setRate
  };
}
