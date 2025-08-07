import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle, Music, Sprout } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { translations, TranslationKey } from '@/utils/translations';

interface OnboardingDialogProps {
  open: boolean;
  onComplete: () => void;
  language: 'en' | 'ru';
}

export const OnboardingDialog: React.FC<OnboardingDialogProps> = ({
  open,
  onComplete,
  language
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const t = (key: TranslationKey) => translations[language][key];

  const steps = [
    {
      icon: CheckCircle,
      title: t('onboardingStep1'),
      description: 'Categories are your starting point for productivity'
    },
    {
      icon: Sprout,
      title: t('onboardingStep2'),
      description: 'Watch your digital garden flourish with each accomplishment'
    },
    {
      icon: Music,
      title: t('onboardingStep3'),
      description: 'LoFi music helps maintain focus and calm'
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const skip = () => {
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md p-0 border-0 bg-transparent shadow-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 text-center">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10"
              animate={{
                background: [
                  'linear-gradient(135deg, hsl(var(--primary)/0.1), hsl(var(--accent)/0.1))',
                  'linear-gradient(135deg, hsl(var(--accent)/0.1), hsl(var(--primary)/0.1))',
                  'linear-gradient(135deg, hsl(var(--primary)/0.1), hsl(var(--accent)/0.1))'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <div className="relative z-10">
              <motion.h2
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-bold text-foreground mb-2"
              >
                {currentStep === 0 ? t('onboardingTitle') : steps[currentStep].title}
              </motion.h2>
              
              {/* Step indicator */}
              <div className="flex justify-center gap-2 mt-4">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                    animate={{
                      scale: index === currentStep ? 1.2 : 1
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {currentStep < steps.length && (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="mb-4 mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
                    >
                      {React.createElement(steps[currentStep].icon, {
                        className: "h-8 w-8 text-primary"
                      })}
                    </motion.div>
                    
                    <p className="text-muted-foreground mb-6">
                      {steps[currentStep].description}
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-3 justify-between">
              <Button
                variant="ghost"
                onClick={skip}
                className="text-muted-foreground hover:text-foreground"
              >
                {t('skip')}
              </Button>
              
              <Button
                onClick={nextStep}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
              >
                {currentStep < steps.length - 1 ? (
                  <>
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  t('getStarted')
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};