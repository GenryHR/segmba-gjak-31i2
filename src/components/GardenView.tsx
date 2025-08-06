import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, TreePine, Flower, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { translations, TranslationKey } from '@/utils/translations';

interface GardenViewProps {
  completedTasks: number;
  language: 'en' | 'ru';
}

export const GardenView: React.FC<GardenViewProps> = ({ completedTasks, language }) => {
  const t = (key: TranslationKey) => translations[language][key];

  const getGardenItems = (count: number) => {
    const items = [];
    const maxItems = Math.min(count, 20); // Limit visual elements
    
    for (let i = 0; i < maxItems; i++) {
      const type = i % 4;
      const delay = i * 0.1;
      
      let IconComponent;
      let color;
      
      switch (type) {
        case 0:
          IconComponent = Sprout;
          color = "text-growth-green";
          break;
        case 1:
          IconComponent = TreePine;
          color = "text-growth-brown";
          break;
        case 2:
          IconComponent = Flower;
          color = "text-primary";
          break;
        default:
          IconComponent = Leaf;
          color = "text-growth-green";
      }
      
      items.push(
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            delay,
            duration: 0.5,
            type: "spring",
            stiffness: 100
          }}
          className={`inline-block ${color}`}
          style={{
            fontSize: `${Math.random() * 8 + 16}px`,
            transform: `rotate(${Math.random() * 30 - 15}deg)`
          }}
        >
          <IconComponent />
        </motion.div>
      );
    }
    
    return items;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card className="min-h-[60vh] bg-gradient-to-b from-growth-sky/20 to-growth-green/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">
            {t('garden')}
          </CardTitle>
          <p className="text-muted-foreground">
            {completedTasks} {t('tasksCompleted')}
          </p>
        </CardHeader>
        
        <CardContent className="relative overflow-hidden">
          {completedTasks === 0 ? (
            <div className="text-center py-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl mb-4"
              >
                🌱
              </motion.div>
              <p className="text-muted-foreground text-lg">
                {t('addFirstTask')}
              </p>
            </div>
          ) : (
            <>
              {/* Sky background with animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-growth-sky/30 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              />
              
              {/* Ground */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-growth-brown/40 to-transparent"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8 }}
              />
              
              {/* Garden items */}
              <div className="relative z-10 flex flex-wrap gap-2 justify-center items-end min-h-[300px] pt-8 pb-16">
                {getGardenItems(completedTasks)}
              </div>
              
              {/* Growth message */}
              {completedTasks > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-4"
                >
                  <p className="text-primary font-medium">
                    {t('growthMessage')}
                  </p>
                </motion.div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};