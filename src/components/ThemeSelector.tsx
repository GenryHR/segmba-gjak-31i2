import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Sparkles, Leaf, Waves, Brush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { translations, TranslationKey } from '@/utils/translations';
import { cn } from '@/lib/utils';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  language: 'en' | 'ru';
}

const themes = [
  {
    key: 'fantasy',
    icon: Sparkles,
    className: 'theme-fantasy',
    gradient: 'from-purple-400/20 to-pink-400/20'
  },
  {
    key: 'nature',
    icon: Leaf,
    className: 'theme-nature',
    gradient: 'from-green-400/20 to-emerald-400/20'
  },
  {
    key: 'beach',
    icon: Waves,
    className: 'theme-beach',
    gradient: 'from-blue-400/20 to-cyan-400/20'
  },
  {
    key: 'arthouse',
    icon: Brush,
    className: 'theme-arthouse',
    gradient: 'from-gray-400/20 to-slate-400/20'
  }
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
  language
}) => {
  const t = (key: TranslationKey) => translations[language][key];

  const handleThemeChange = (themeKey: string) => {
    // Remove existing theme classes
    document.documentElement.classList.remove(
      'theme-fantasy', 'theme-nature', 'theme-beach', 'theme-arthouse'
    );
    
    // Add new theme class
    if (themeKey !== 'fantasy') {
      document.documentElement.classList.add(`theme-${themeKey}`);
    }
    
    onThemeChange(themeKey);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="h-4 w-4 text-primary" />
        <h3 className="font-medium text-foreground">{t('themes')}</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {themes.map((theme, index) => {
          const Icon = theme.icon;
          const isActive = currentTheme === theme.key;
          
          return (
            <motion.div
              key={theme.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant={isActive ? "default" : "outline"}
                onClick={() => handleThemeChange(theme.key)}
                className={cn(
                  "w-full h-20 p-3 flex flex-col items-center gap-2 relative overflow-hidden transition-all duration-300",
                  "hover:scale-105 hover:shadow-lg",
                  isActive && "ring-2 ring-primary ring-offset-2"
                )}
              >
                {/* Background gradient */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-30",
                  theme.gradient
                )} />
                
                {/* Animated particles for active theme */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/40 rounded-full"
                        animate={{
                          x: [0, Math.random() * 60 - 30],
                          y: [0, Math.random() * 60 - 30],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.5,
                        }}
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
                
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className={cn(
                      "p-2 rounded-lg",
                      isActive ? "bg-primary-foreground/20" : "bg-muted/50"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5",
                      isActive ? "text-primary-foreground" : "text-foreground"
                    )} />
                  </motion.div>
                  
                  <span className={cn(
                    "text-xs font-medium",
                    isActive ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {t(theme.key as TranslationKey)}
                  </span>
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};