'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
}

export function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [waitingForInteraction, setWaitingForInteraction] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startAudiblePlayback = async () => {
    if (!audioRef.current) return;
    audioRef.current.muted = false;
    audioRef.current.volume = 0.6;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setWaitingForInteraction(false);
    } catch (err) {
      console.warn('Audio playback failed:', err);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Sync state with native audio events
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    // Register first-interaction listeners immediately
    const handleFirstInteraction = () => {
      startAudiblePlayback();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const handleToggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    // If waiting for interaction, start audible playback
    if (waitingForInteraction) {
      await startAudiblePlayback();
      return;
    }

    // Toggle play/pause
    if (isPlaying) {
      audio.pause();
    } else {
      audio.muted = false;
      audio.volume = 0.6;
      try {
        await audio.play();
      } catch (error) {
        console.warn('Audio playback failed:', error);
      }
    }
  };

  // Hide player if no audio URL provided
  if (!audioUrl) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className={`bg-white/90 backdrop-blur-md border border-stone-200 shadow-sm rounded-full px-3.5 py-2 flex items-center gap-2.5 text-stone-700 transition-all ${
        waitingForInteraction ? 'animate-pulse' : ''
      }`}>
        {/* Play/Pause Button */}
        <button
          onClick={handleToggle}
          className="flex items-center justify-center h-8 w-8 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors"
          aria-label={waitingForInteraction ? 'Play Music' : isPlaying ? 'Pause' : 'Play'}
        >
          {waitingForInteraction ? (
            <Music className="h-4 w-4 text-stone-700" />
          ) : isPlaying ? (
            <Pause className="h-4 w-4 text-stone-700" />
          ) : (
            <Play className="h-4 w-4 text-stone-700 ml-0.5" />
          )}
        </button>

        {/* Soundwave Indicator or waiting text */}
        {waitingForInteraction ? (
          <span className="text-xs font-medium text-stone-600">Play Music</span>
        ) : (
          <div className="flex items-center gap-0.5 h-4">
            <div
              className={`w-0.5 rounded-full bg-stone-400 transition-all ${
                isPlaying ? 'animate-soundwave-1' : 'h-1.5'
              }`}
              style={{ animationDelay: '0ms' }}
            />
            <div
              className={`w-0.5 rounded-full bg-stone-400 transition-all ${
                isPlaying ? 'animate-soundwave-2' : 'h-2'
              }`}
              style={{ animationDelay: '150ms' }}
            />
            <div
              className={`w-0.5 rounded-full bg-stone-400 transition-all ${
                isPlaying ? 'animate-soundwave-3' : 'h-2.5'
              }`}
              style={{ animationDelay: '300ms' }}
            />
            <div
              className={`w-0.5 rounded-full bg-stone-400 transition-all ${
                isPlaying ? 'animate-soundwave-2' : 'h-2'
              }`}
              style={{ animationDelay: '450ms' }}
            />
          </div>
        )}

        {/* Hidden Audio Element */}
        <audio ref={audioRef} src={audioUrl} loop />
      </div>
    </div>
  );
}
