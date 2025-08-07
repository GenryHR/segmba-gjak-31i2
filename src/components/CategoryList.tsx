import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CalendarDays, CalendarRange, Clock, List, CheckCircle, Sprout } from 'lucide-react';
import { TabType } from '@/types/task';
import { translations, TranslationKey } from '@/utils/translations';
import { cn } from '@/lib/utils';

interface CategoryListProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onCategoryTap: (tab: TabType) => void;
  language: 'en' | 'ru';
  taskCounts: Record<TabType, number>;
}

const categoryIcons = {
  today: Calendar,
  tomorrow: CalendarDays,
  week: CalendarRange,
  someday: Clock,
  all: List,
  completed: CheckCircle,
  garden: Sprout
};

export const CategoryList: React.FC<CategoryListProps> = ({
  activeTab,
  onTabChange,
  onCategoryTap,
  language,
  taskCounts
}) => {
  const t = (key: TranslationKey) => translations[language][key];

  const categories: { key: TabType; label: string }[] = [
    { key: 'today', label: t('today') },
    { key: 'tomorrow', label: t('tomorrow') },
    { key: 'week', label: t('week') },
    { key: 'someday', label: t('someday') },
    { key: 'all', label: t('all') },
    { key: 'completed', label: t('completed') },
    { key: 'garden', label: t('garden') }
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-2">
        {categories.map((category, index) => {
          const Icon = categoryIcons[category.key];
          const isActive = activeTab === category.key;
          const taskCount = taskCounts[category.key];
          const isEmpty = taskCount === 0 && category.key !== 'garden';
          
          return (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative p-4 rounded-xl border transition-all duration-300 cursor-pointer group",
                "hover:shadow-lg hover:scale-[1.02]",
                isActive 
                  ? "bg-primary/10 border-primary shadow-md" 
                  : "bg-card/50 backdrop-blur-sm border-border hover:bg-card/80"
              )}
              onClick={() => {
                onTabChange(category.key);
                if (category.key !== 'garden' && category.key !== 'completed') {
                  onCategoryTap(category.key);
                }
              }}
            >
              {/* Fog overlay for empty categories */}
              {isEmpty && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-muted/20 via-muted/40 to-muted/20 backdrop-blur-[1px]"
                />
              )}
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="category-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      isActive 
                        ? "bg-primary/20 text-primary" 
                        : "bg-muted/50 text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                  
                  <div>
                    <h3 className={cn(
                      "font-medium transition-colors",
                      isActive ? "text-primary" : "text-foreground"
                    )}>
                      {category.label}
                    </h3>
                    
                    {isEmpty && category.key !== 'garden' && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-muted-foreground italic"
                      >
                        {t('emptyCategory')}
                      </motion.p>
                    )}
                  </div>
                </div>
                
                {/* Task count */}
                {taskCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {taskCount}
                  </motion.div>
                )}
              </div>
              
              {/* Tap hint for empty categories */}
              {isEmpty && category.key !== 'garden' && category.key !== 'completed' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-2 text-xs text-muted-foreground/60 italic"
                >
                  {t('tapToAdd')}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};