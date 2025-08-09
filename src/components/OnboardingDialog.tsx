import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { translations, TranslationKey } from '@/utils/translations';

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: 'en' | 'ru';
  onComplete: () => void;
}

export const OnboardingDialog: React.FC<OnboardingDialogProps> = ({
  open,
  onOpenChange,
  language,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const t = (key: TranslationKey) => translations[language][key];

  const steps = [
    {
      icon: ChevronRight,
      title: t('onboardingStep1'),
      description: language === 'en' 
        ? 'Simply tap on any category to create your first task'
        : 'Просто нажмите на любую категорию для создания первой задачи'
    },
    {
      icon: CheckCircle,
      title: t('onboardingStep2'),
      description: language === 'en'
        ? 'Mark tasks as complete to see your garden grow'
        : 'Отмечайте задачи выполненными и наблюдайте, как растёт ваш сад'
    },
    {
      icon: Edit,
      title: t('onboardingStep3'),
      description: language === 'en'
        ? 'Long press or swipe to edit and delete tasks'
        : 'Долгое нажатие или свайп для редактирования и удаления'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      onOpenChange(false);
    }
  };

  const handleSkip = () => {
    onComplete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl gradient-text">
            {currentStep === 0 ? t('welcomeTitle') : steps[currentStep].title}
          </DialogTitle>
          {currentStep === 0 && (
            <p className="text-muted-foreground mt-2">
              {t('welcomeDescription')}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-6 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {currentStep > 0 && (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-primary/10 glow-effect">
                      {React.createElement(steps[currentStep - 1].icon, {
                        className: "h-8 w-8 text-primary"
                      })}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground">
                    {steps[currentStep - 1].description}
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Progress indicators */}
          {currentStep > 0 && (
            <div className="flex justify-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            {language === 'en' ? 'Skip' : 'Пропустить'}
          </Button>
          
          <Button 
            onClick={handleNext}
            className="bg-primary hover:bg-primary/90 glow-effect"
          >
            {currentStep === steps.length - 1 ? t('getStarted') : 
             (language === 'en' ? 'Next' : 'Далее')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};