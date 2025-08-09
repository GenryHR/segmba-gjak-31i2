import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CalendarDays, CalendarRange, Clock, Plus } from 'lucide-react';
import { Task, TabType } from '@/types/task';
import { translations, TranslationKey } from '@/utils/translations';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CategoryListProps {
  tasks: Task[];
  language: 'en' | 'ru';
  onCategorySelect: (category: TabType) => void;
  getTasksByTab: (tab: string) => Task[];
}

const categoryIcons = {
  today: Calendar,
  tomorrow: CalendarDays,
  week: CalendarRange,
  someday: Clock
};

const categories: TabType[] = ['today', 'tomorrow', 'week', 'someday'];

export const CategoryList: React.FC<CategoryListProps> = ({
  tasks,
  language,
  onCategorySelect,
  getTasksByTab
}) => {
  const t = (key: TranslationKey) => translations[language][key];

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-semibold text-foreground mb-4 gradient-text">
        {t('mainScreen')}
      </h2>
      
      <div className="space-y-3">
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          const categoryTasks = getTasksByTab(category);
          const taskCount = categoryTasks.length;
          const isEmpty = taskCount === 0;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] particle-effect"
                onClick={() => onCategorySelect(category)}
              >
                <CardContent className="p-4 relative overflow-hidden">
                  {isEmpty && (
                    <div className="absolute inset-0 fog-animation opacity-30" />
                  )}
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                          {t(category as TranslationKey)}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground">
                          {isEmpty ? t('emptyCategory') : `${taskCount} ${language === 'en' ? 'tasks' : 'задач'}`}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCategorySelect(category);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {!isEmpty && (
                    <div className="mt-3 space-y-2">
                      <AnimatePresence>
                        {categoryTasks.slice(0, 3).map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <div className={`w-2 h-2 rounded-full bg-priority-${task.priority}`} />
                            <span className="truncate">{task.title}</span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {taskCount > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{taskCount - 3} {language === 'en' ? 'more' : 'ещё'}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};