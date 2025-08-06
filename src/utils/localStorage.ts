import { Task, AppSettings } from '@/types/task';

const TASKS_KEY = 'growtasks-tasks';
const SETTINGS_KEY = 'growtasks-settings';
const GARDEN_PROGRESS_KEY = 'growtasks-garden';

export const loadTasks = (): Task[] => {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    if (!data) return [];
    
    const tasks = JSON.parse(data);
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      date: task.date instanceof Date ? new Date(task.date) : task.date
    }));
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const loadSettings = (): AppSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return { theme: 'light', language: 'en' };
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading settings:', error);
    return { theme: 'light', language: 'en' };
  }
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const loadGardenProgress = (): number => {
  try {
    const data = localStorage.getItem(GARDEN_PROGRESS_KEY);
    return data ? parseInt(data, 10) : 0;
  } catch (error) {
    console.error('Error loading garden progress:', error);
    return 0;
  }
};

export const saveGardenProgress = (progress: number): void => {
  try {
    localStorage.setItem(GARDEN_PROGRESS_KEY, progress.toString());
  } catch (error) {
    console.error('Error saving garden progress:', error);
  }
};

export const clearAllData = (): void => {
  try {
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(GARDEN_PROGRESS_KEY);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};