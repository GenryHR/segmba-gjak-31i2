import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const t = (key: TranslationKey) => translations[language][key];

  useEffect(() => {
    // Create audio element with a LoFi track URL
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    
    // Using a royalty-free LoFi track from a public source
    // In a real app, you'd want to host your own audio file
    audioRef.current.src = 'https://www.soundjay.com/misc/sounds/beep-07a.wav'; // Placeholder - replace with actual LoFi track
    
    audioRef.current.addEventListener('canplaythrough', () => {
      setIsLoading(false);
    });

    audioRef.current.addEventListener('error', () => {
      setIsLoading(false);
      console.log('Audio loading failed - using silence for demo');
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlayback = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        // Fade out
        const fadeOut = setInterval(() => {
          if (audioRef.current && audioRef.current.volume > 0.05) {
            audioRef.current.volume -= 0.05;
          } else {
            clearInterval(fadeOut);
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.volume = 0.3;
            }
          }
        }, 50);
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        audioRef.current.volume = 0;
        await audioRef.current.play();
        
        // Fade in
        const fadeIn = setInterval(() => {
          if (audioRef.current && audioRef.current.volume < 0.25) {
            audioRef.current.volume += 0.05;
          } else {
            clearInterval(fadeIn);
            if (audioRef.current) {
              audioRef.current.volume = 0.3;
            }
          }
        }, 50);
        
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.log('Audio playback failed:', error);
      setIsLoading(false);
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
            className="relative p-2 rounded-full hover:bg-primary/10 transition-all duration-300"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
                />
              ) : isPlaying ? (
                <Pause className="h-4 w-4 text-primary" />
              ) : (
                <Play className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
              )}
              
              {/* Audio waves animation when playing */}
              {isPlaying && !isLoading && (
                <motion.div
                  className="absolute -inset-2 rounded-full border-2 border-primary/20"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.div>
            
            <Volume2 className="h-3 w-3 text-muted-foreground/50 absolute -bottom-1 -right-1" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            {isPlaying ? t('pauseMusic') : t('playMusic')}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};