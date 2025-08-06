import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/task';
import { TaskCard } from './TaskCard';
import { translations, TranslationKey } from '@/utils/translations';

interface TaskListProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onUndo: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  language: 'en' | 'ru';
  emptyMessage?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onComplete,
  onUndo,
  onEdit,
  onDelete,
  language,
  emptyMessage
}) => {
  const t = (key: TranslationKey) => translations[language][key];

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="text-6xl mb-4">📝</div>
        <p className="text-muted-foreground text-lg">
          {emptyMessage || t('noTasks')}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={onComplete}
            onUndo={onUndo}
            onEdit={onEdit}
            onDelete={onDelete}
            language={language}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};