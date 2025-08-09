import React from 'react';
import { motion } from 'framer-motion';
import { AppTheme } from '@/types/task';

interface AtmosphericBackgroundProps {
  theme: AppTheme;
}

export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({ theme }) => {
  const getBackgroundElements = () => {
    switch (theme) {
      case 'fantasy':
        return (
          <>
            <motion.div
              className="absolute top-20 left-10 w-4 h-4 bg-purple-300/30 rounded-full"
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute top-40 right-20 w-2 h-2 bg-pink-300/40 rounded-full"
              animate={{
                y: [0, -30, 0],
                x: [0, -15, 0],
                scale: [1, 0.8, 1]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
            <motion.div
              className="absolute bottom-32 left-1/4 w-3 h-3 bg-purple-400/20 rounded-full"
              animate={{
                y: [0, -25, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </>
        );
        
      case 'nature':
        return (
          <>
            <motion.div
              className="absolute top-16 right-16 w-6 h-6 text-green-300/20 text-2xl"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🍃
            </motion.div>
            <motion.div
              className="absolute bottom-24 right-12 w-4 h-4 text-green-400/30 text-xl"
              animate={{
                y: [0, -10, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              🌿
            </motion.div>
          </>
        );
        
      case 'beach':
        return (
          <>
            <motion.div
              className="absolute top-24 left-16 w-8 h-1 bg-gradient-to-r from-blue-200/30 to-transparent rounded-full"
              animate={{
                x: [0, 100, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-20 left-20 w-12 h-1 bg-gradient-to-r from-cyan-200/40 to-transparent rounded-full"
              animate={{
                x: [0, -80, 0],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3
              }}
            />
            <motion.div
              className="absolute top-1/2 right-24 w-2 h-2 bg-yellow-300/50 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </>
        );
        
      case 'arthouse':
        return (
          <>
            <motion.div
              className="absolute top-32 left-1/3 w-16 h-0.5 bg-gradient-to-r from-gray-400/20 to-transparent"
              animate={{
                scaleX: [0, 1, 0],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/4 w-0.5 h-12 bg-gradient-to-b from-gray-300/30 to-transparent"
              animate={{
                scaleY: [0, 1, 0],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4
              }}
            />
          </>
        );
        
      default:
        return null;
    }
  };

  if (theme === 'light' || theme === 'dark') {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {getBackgroundElements()}
      
      {/* Global fog effect for all themes except light/dark */}
      <motion.div
        className="absolute inset-0 fog-animation opacity-10"
        animate={{
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};