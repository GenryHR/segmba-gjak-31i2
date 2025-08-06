import React from 'react';
import { Moon, Sun, Trash2 } from 'lucide-react';
import { AppSettings } from '@/types/task';
import { translations, TranslationKey } from '@/utils/translations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  onClearAllTasks: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
  onClearAllTasks
}) => {
  const t = (key: TranslationKey) => translations[settings.language][key];

  const handleThemeChange = (theme: 'light' | 'dark') => {
    onSettingsChange({ ...settings, theme });
    document.documentElement.classList.toggle('dark', theme === 'dark');
  };

  const handleLanguageChange = (language: 'en' | 'ru') => {
    onSettingsChange({ ...settings, language });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('settings')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="space-y-3">
            <Label className="text-base font-medium">{t('theme')}</Label>
            <RadioGroup
              value={settings.theme}
              onValueChange={handleThemeChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  {t('light')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  {t('dark')}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Language Settings */}
          <div className="space-y-3">
            <Label className="text-base font-medium">{t('language')}</Label>
            <RadioGroup
              value={settings.language}
              onValueChange={handleLanguageChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="en" />
                <Label htmlFor="en">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ru" id="ru" />
                <Label htmlFor="ru">Русский</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Danger Zone */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-destructive">
              {t('clearAll')}
            </Label>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('clearAll')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('clearAll')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('confirmClear')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('no')}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      onClearAllTasks();
                      onOpenChange(false);
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {t('yes')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};