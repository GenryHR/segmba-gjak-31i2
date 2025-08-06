import { useState, useEffect, useCallback } from 'react';
import { Task, Priority, TaskDate } from '@/types/task';
import { loadTasks, saveTasks, loadGardenProgress, saveGardenProgress } from '@/utils/localStorage';
import { isToday, isTomorrow, isThisWeek, startOfWeek } from 'date-fns';

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [gardenProgress, setGardenProgress] = useState(0);

  useEffect(() => {
    setTasks(loadTasks());
    setGardenProgress(loadGardenProgress());
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveGardenProgress(gardenProgress);
  }, [gardenProgress]);

  const addTask = useCallback((title: string, description: string, priority: Priority, date: TaskDate) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description: description || undefined,
      priority,
      date,
      completed: false,
      createdAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const completeTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, completed: true, completedAt: new Date() } 
        : task
    ));
    setGardenProgress(prev => prev + 1);
  }, []);

  const uncompleteTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, completed: false, completedAt: undefined } 
        : task
    ));
    setGardenProgress(prev => Math.max(0, prev - 1));
  }, []);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
    setGardenProgress(0);
  }, []);

  const getTasksByTab = useCallback((tab: string): Task[] => {
    const now = new Date();
    
    switch (tab) {
      case 'today':
        return tasks.filter(task => {
          if (task.completed) return false;
          if (task.date === 'today') return true;
          if (task.date instanceof Date) return isToday(task.date);
          return false;
        });
      
      case 'tomorrow':
        return tasks.filter(task => {
          if (task.completed) return false;
          if (task.date === 'tomorrow') return true;
          if (task.date instanceof Date) return isTomorrow(task.date);
          return false;
        });
      
      case 'week':
        return tasks.filter(task => {
          if (task.completed) return false;
          if (task.date === 'week') return true;
          if (task.date instanceof Date) {
            return isThisWeek(task.date, { weekStartsOn: 1 }) && 
                   !isToday(task.date) && !isTomorrow(task.date);
          }
          return false;
        });
      
      case 'someday':
        return tasks.filter(task => 
          !task.completed && task.date === 'someday'
        );
      
      case 'all':
        return tasks.filter(task => !task.completed);
      
      case 'completed':
        return tasks.filter(task => task.completed);
      
      default:
        return [];
    }
  }, [tasks]);

  return {
    tasks,
    gardenProgress,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    uncompleteTask,
    clearAllTasks,
    getTasksByTab
  };
};