import React from 'react';
import { motion } from 'framer-motion';
import { Check, Edit, Trash2 } from 'lucide-react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onUndo: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  language: 'en' | 'ru';
}

const priorityColors = {
  low: 'bg-priority-low text-priority-low-foreground',
  medium: 'bg-priority-medium text-priority-medium-foreground',
  high: 'bg-priority-high text-priority-high-foreground'
};

const priorityLabels = {
  en: { low: 'Low', medium: 'Medium', high: 'High' },
  ru: { low: 'Низкий', medium: 'Средний', high: 'Высокий' }
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onComplete,
  onUndo,
  onEdit,
  onDelete,
  language
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: task.completed ? 0.6 : 1, 
        y: 0,
        scale: task.completed ? 0.95 : 1
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className={cn(
        "group hover:shadow-md transition-all duration-300",
        task.completed && "opacity-60"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "mt-1 h-6 w-6 rounded-full border-2 transition-all duration-300",
                task.completed 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "border-muted-foreground/30 hover:border-primary hover:bg-primary/10"
              )}
              onClick={() => task.completed ? onUndo(task.id) : onComplete(task.id)}
            >
              {task.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="h-3 w-3" />
                </motion.div>
              )}
            </Button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className={cn(
                  "font-medium text-foreground text-base leading-tight",
                  task.completed && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h3>
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs shrink-0", priorityColors[task.priority])}
                >
                  {priorityLabels[language][task.priority]}
                </Badge>
              </div>
              
              {task.description && (
                <p className={cn(
                  "text-sm text-muted-foreground mb-3 leading-relaxed",
                  task.completed && "line-through"
                )}>
                  {task.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(task)}
                  className="h-7 px-2 text-xs"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  {language === 'en' ? 'Edit' : 'Изменить'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(task.id)}
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  {language === 'en' ? 'Delete' : 'Удалить'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};