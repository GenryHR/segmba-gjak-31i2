export type Priority = 'low' | 'medium' | 'high';

export type TaskDate = 'today' | 'tomorrow' | 'week' | 'someday' | Date;

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  date: TaskDate;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
}

export type TabType = 'today' | 'tomorrow' | 'week' | 'someday' | 'all' | 'completed' | 'garden';

export type AppTheme = 'light' | 'dark' | 'fantasy' | 'nature' | 'beach' | 'arthouse';

export interface AppSettings {
  theme: AppTheme;
  language: 'en' | 'ru';
  hasSeenOnboarding: boolean;
  musicEnabled: boolean;
}