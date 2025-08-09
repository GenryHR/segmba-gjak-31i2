import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { translations, TranslationKey } from '@/utils/translations';

interface MusicPlayerProps {
  language: 'en' | 'ru';
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ language }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const t = (key: TranslationKey) => translations[language][key];

  useEffect(() => {
    // Create audio element with a LoFi study track
    // Using a free LoFi track from a CDN or you can replace with your own
    const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav');
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const fadeIn = () => {
    if (!audioRef.current) return;
    
    audioRef.current.volume = 0;
    let volume = 0;
    const targetVolume = 0.3; // Keep volume low for background music
    const fadeStep = 0.02;
    
    fadeIntervalRef.current = setInterval(() => {
      volume += fadeStep;
      if (volume >= targetVolume) {
        volume = targetVolume;
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
      }
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    }, 100);
  };

  const fadeOut = () => {
    if (!audioRef.current) return;
    
    let volume = audioRef.current.volume;
    
    fadeIntervalRef.current = setInterval(() => {
      volume -= 0.02;
      if (volume <= 0) {
        volume = 0;
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    }, 100);
  };

  const togglePlayback = async () => {
    if (!audioRef.current) return;

    try {
      setIsLoading(true);
      
      if (isPlaying) {
        fadeOut();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        fadeIn();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      // Fallback: create a simple tone for demo purposes
      if (!isPlaying) {
        createSimpleTone();
        setIsPlaying(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createSimpleTone = () => {
    // Fallback: create a simple ambient tone using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 220; // A3 note
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 2);
      
      oscillator.start();
      
      // Stop after 30 seconds for demo
      setTimeout(() => {
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);
        setTimeout(() => {
          oscillator.stop();
          setIsPlaying(false);
        }, 2000);
      }, 30000);
    } catch (error) {
      console.error('Web Audio API not supported:', error);
      setIsPlaying(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlayback}
            disabled={isLoading}
            className="relative group transition-all duration-300 hover:bg-primary/10 hover:scale-105"
          >
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4 text-primary" />
              ) : (
                <Play className="h-4 w-4 text-primary" />
              )}
              <Volume2 className="h-3 w-3 text-muted-foreground" />
            </div>
            
            {isPlaying && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-sm">
          <p>{isPlaying ? t('pauseMusic') : t('playMusic')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};