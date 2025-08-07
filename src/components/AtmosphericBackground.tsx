import React from 'react';
import { motion } from 'framer-motion';

interface AtmosphericBackgroundProps {
  theme: string;
}

export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({ theme }) => {
  const getBackgroundElements = () => {
    switch (theme) {
      case 'fantasy':
        return (
          <>
            {/* Floating sparkles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
            
            {/* Magic mist */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5"
              animate={{
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </>
        );

      case 'nature':
        return (
          <>
            {/* Floating leaves */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`leaf-${i}`}
                className="absolute w-2 h-2 rounded-full bg-green-400/20"
                animate={{
                  x: [0, 30, -20, 0],
                  y: [0, -40, -80, -120],
                  rotate: [0, 180, 360],
                  opacity: [1, 0.5, 0],
                }}
                transition={{
                  duration: 6 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '100%',
                }}
              />
            ))}
            
            {/* Wind effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-transparent to-emerald-400/5"
              animate={{
                x: [-100, 100, -100],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </>
        );

      case 'beach':
        return (
          <>
            {/* Sand particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`sand-${i}`}
                className="absolute w-0.5 h-0.5 bg-yellow-300/40 rounded-full"
                animate={{
                  x: [0, Math.random() * 200 - 100],
                  y: [0, Math.random() * 50 - 25],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
            
            {/* Ocean waves */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-400/10 to-transparent"
              animate={{
                scaleY: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
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
            {/* Geometric shapes */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`shape-${i}`}
                className="absolute border border-foreground/10"
                style={{
                  width: `${20 + Math.random() * 40}px`,
                  height: `${20 + Math.random() * 40}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  rotate: [0, 360],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 10 + Math.random() * 5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 3,
                }}
              />
            ))}
            
            {/* Minimal grid */}
            <div className="absolute inset-0 opacity-5">
              <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
                {[...Array(144)].map((_, i) => (
                  <div key={i} className="border-r border-b border-foreground/10" />
                ))}
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {getBackgroundElements()}
    </div>
  );
};