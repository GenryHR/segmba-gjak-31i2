import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Sun, Moon, Sparkles, Leaf, Waves, Zap } from 'lucide-react';
import { AppTheme } from '@/types/task';
import { translations, TranslationKey } from '@/utils/translations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ThemeSelectorProps {
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  language: 'en' | 'ru';
}

const themeIcons = {
  light: Sun,
  dark: Moon,
  fantasy: Sparkles,
  nature: Leaf,
  beach: Waves,
  arthouse: Zap
};

const themeColors = {
  light: 'from-slate-100 to-slate-200',
  dark: 'from-slate-800 to-slate-900',
  fantasy: 'from-purple-200 to-pink-200',
  nature: 'from-green-200 to-emerald-200',
  beach: 'from-blue-200 to-cyan-200',
  arthouse: 'from-gray-300 to-gray-400'
};

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
  language
}) => {
  const t = (key: TranslationKey) => translations[language][key];
  const themes: AppTheme[] = ['light', 'dark', 'fantasy', 'nature', 'beach', 'arthouse'];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Palette className="h-4 w-4" />
        {t('theme')}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {themes.map((theme) => {
          const Icon = themeIcons[theme];
          const isSelected = currentTheme === theme;
          
          return (
            <motion.div
              key={theme}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`relative cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'border-primary shadow-lg glow-effect' 
                    : 'hover:border-primary/50 hover:shadow-md'
                }`}
                onClick={() => onThemeChange(theme)}
              >
                <div className="p-3">
                  <div className={`w-full h-16 rounded-md bg-gradient-to-br ${themeColors[theme]} mb-3 relative overflow-hidden`}>
                    {theme === 'fantasy' && (
                      <div className="absolute inset-0 particle-effect opacity-60" />
                    )}
                    {theme === 'beach' && (
                      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-yellow-300/30 to-transparent" />
                    )}
                    {theme === 'nature' && (
                      <div className="absolute top-2 left-2">
                        <div className="w-2 h-2 rounded-full bg-green-600" />
                        <div className="w-1 h-1 rounded-full bg-green-700 ml-1 mt-1" />
                      </div>
                    )}
                    {theme === 'arthouse' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-transparent" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-card-foreground">
                      {t(theme as TranslationKey)}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    layoutId="theme-selector"
                    className="absolute inset-0 border-2 border-primary rounded-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};