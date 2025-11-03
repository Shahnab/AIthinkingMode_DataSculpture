import { useEffect, useRef, useState, useCallback } from 'react';

export const useAudioPlayer = (audioSrc: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize audio
  useEffect(() => {
    const audio = new Audio();
    audio.src = audioSrc;
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.7;
    
    const handleCanPlay = () => {
      setIsLoaded(true);
      setError(null);
    };

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    const handleError = (e: Event) => {
      setError(`Audio failed to load: ${audio.error?.message || 'Unknown error'}`);
      setIsLoaded(false);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);
    
    audioRef.current = audio;

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, [audioSrc]);

  const play = useCallback(async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setError(null);
      } catch (error) {
        setError(`Play failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsPlaying(false);
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  }, [isMuted]);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  return {
    play,
    pause,
    toggleMute,
    setVolume,
    isPlaying,
    isMuted,
    isLoaded,
    error,
  };
};