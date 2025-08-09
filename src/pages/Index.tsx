import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Sprout } from 'lucide-react';
import { Task, TabType, AppSettings } from '@/types/task';
import { useTaskManager } from '@/hooks/useTaskManager';
import { loadSettings, saveSettings } from '@/utils/localStorage';
import { translations, TranslationKey } from '@/utils/translations';
import { CategoryList } from '@/components/CategoryList';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { GardenView } from '@/components/GardenView';
import { SettingsDialog } from '@/components/SettingsDialog';
import { OnboardingDialog } from '@/components/OnboardingDialog';
import { MusicPlayer } from '@/components/MusicPlayer';
import { AtmosphericBackground } from '@/components/AtmosphericBackground';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const {
    tasks,
    gardenProgress,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    uncompleteTask,
    clearAllTasks,
    getTasksByTab
  } = useTaskManager();

  const [activeView, setActiveView] = useState<'main' | 'garden' | 'all' | 'completed'>('main');
  const [selectedCategory, setSelectedCategory] = useState<TabType | null>(null);
  const [settings, setSettings] = useState<AppSettings>({ 
    theme: 'light', 
    language: 'en', 
    hasSeenOnboarding: false, 
    musicEnabled: false 
  });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const { toast } = useToast();

  // Load settings on mount
  useEffect(() => {
    const savedSettings = loadSettings();
    setSettings(savedSettings);
    
    // Apply theme
    const isDark = savedSettings.theme === 'dark' || savedSettings.theme === 'arthouse';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-theme', savedSettings.theme);
    
    // Show onboarding if first time
    if (!savedSettings.hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Save settings when changed
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const t = (key: TranslationKey) => translations[settings.language][key];

  const handleCategorySelect = (category: TabType) => {
    setSelectedCategory(category);
    setShowTaskForm(true);
  };

  const handleAddTask = (title: string, description: string, priority: any, date: any) => {
    // Use selected category or default to today
    const taskDate = selectedCategory ? selectedCategory === 'today' ? 'today' : 
                     selectedCategory === 'tomorrow' ? 'tomorrow' : 
                     selectedCategory === 'week' ? 'week' : 
                     selectedCategory === 'someday' ? 'someday' : date : date;
    
    addTask(title, description, priority, taskDate);
    setShowTaskForm(false);
    setSelectedCategory(null);
    toast({
      title: settings.language === 'en' ? 'Task added!' : 'Задача добавлена!',
      description: title,
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleUpdateTask = (title: string, description: string, priority: any, date: any) => {
    if (editingTask) {
      updateTask(editingTask.id, { title, description, priority, date });
      setEditingTask(undefined);
      setShowTaskForm(false);
      setSelectedCategory(null);
      toast({
        title: settings.language === 'en' ? 'Task updated!' : 'Задача обновлена!',
        description: title,
      });
    }
  };

  const handleCompleteTask = (id: string) => {
    completeTask(id);
    toast({
      title: t('growthMessage'),
      description: settings.language === 'en' ? 'Keep growing your garden!' : 'Продолжайте выращивать свой сад!',
    });
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    deleteTask(id);
    setTaskToDelete(null);
    toast({
      title: settings.language === 'en' ? 'Task deleted' : 'Задача удалена',
      description: task?.title,
    });
  };

  const handleOnboardingComplete = () => {
    setSettings(prev => ({ ...prev, hasSeenOnboarding: true }));
  };

  const getCurrentTasks = () => {
    switch (activeView) {
      case 'all':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'garden':
      case 'main':
      default:
        return [];
    }
  };

  const currentTasks = getCurrentTasks();
  const completedTasksCount = tasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen bg-background relative">
      <AtmosphericBackground theme={settings.theme} />
      
      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen relative z-10">
        {/* Sidebar */}
        <div className="w-80 border-r border-border bg-card/80 backdrop-blur-sm">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h1 className="text-xl font-bold gradient-text">{t('appName')}</h1>
            <div className="flex items-center gap-2">
              <MusicPlayer language={settings.language} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="hover:bg-primary/10"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="p-2 border-b border-border bg-muted/30">
            <div className="flex gap-1">
              <Button
                variant={activeView === 'main' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('main')}
                className="flex-1"
              >
                {t('mainScreen')}
              </Button>
              <Button
                variant={activeView === 'garden' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('garden')}
                className="flex-1"
              >
                <Sprout className="h-4 w-4 mr-1" />
                {t('garden')}
              </Button>
              <Button
                variant={activeView === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('all')}
                className="flex-1"
              >
                {t('all')}
              </Button>
              <Button
                variant={activeView === 'completed' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('completed')}
                className="flex-1"
              >
                {t('completed')}
              </Button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {activeView === 'main' && (
              <CategoryList
                tasks={tasks}
                language={settings.language}
                onCategorySelect={handleCategorySelect}
                getTasksByTab={getTasksByTab}
              />
            )}
            {(activeView === 'all' || activeView === 'completed') && (
              <div className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {t(activeView as TranslationKey)}
                </h3>
                <TaskList
                  tasks={currentTasks}
                  onComplete={handleCompleteTask}
                  onUndo={uncompleteTask}
                  onEdit={handleEditTask}
                  onDelete={(id) => setTaskToDelete(id)}
                  language={settings.language}
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeView === 'garden' && (
                <motion.div
                  key="garden"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <GardenView 
                    completedTasks={gardenProgress} 
                    language={settings.language} 
                  />
                </motion.div>
              )}
              {activeView === 'main' && (
                <motion.div
                  key="main"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 flex items-center justify-center h-full"
                >
                  <div className="text-center text-muted-foreground">
                    <div className="text-6xl mb-4">✨</div>
                    <h2 className="text-xl font-medium gradient-text mb-2">
                      {settings.language === 'en' ? 'Welcome to GrowTasks' : 'Добро пожаловать в GrowTasks'}
                    </h2>
                    <p className="text-sm">
                      {settings.language === 'en' 
                        ? 'Select a category from the sidebar to get started' 
                        : 'Выберите категорию на боковой панели для начала'}
                    </p>
                  </div>
                </motion.div>
              )}
              {(activeView === 'all' || activeView === 'completed') && (
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 flex items-center justify-center h-full"
                >
                  <div className="text-center text-muted-foreground">
                    <div className="text-6xl mb-4">
                      {activeView === 'all' ? '📋' : '✅'}
                    </div>
                    <h2 className="text-xl font-medium gradient-text mb-2">
                      {t(activeView as TranslationKey)}
                    </h2>
                    <p className="text-sm">
                      {currentTasks.length} {settings.language === 'en' ? 'tasks' : 'задач'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen relative z-10">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold gradient-text">{t('appName')}</h1>
            <div className="flex items-center gap-2">
              <MusicPlayer language={settings.language} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="hover:bg-primary/10"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="bg-muted/30 p-2 border-b border-border">
          <div className="flex gap-1 text-xs">
            <Button
              variant={activeView === 'main' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('main')}
              className="flex-1 h-8"
            >
              {t('mainScreen')}
            </Button>
            <Button
              variant={activeView === 'garden' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('garden')}
              className="flex-1 h-8"
            >
              <Sprout className="h-3 w-3 mr-1" />
              {t('garden')}
            </Button>
            <Button
              variant={activeView === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('all')}
              className="flex-1 h-8"
            >
              {t('all')}
            </Button>
            <Button
              variant={activeView === 'completed' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('completed')}
              className="flex-1 h-8"
            >
              {t('completed')}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeView === 'main' && (
              <motion.div
                key="main-mobile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CategoryList
                  tasks={tasks}
                  language={settings.language}
                  onCategorySelect={handleCategorySelect}
                  getTasksByTab={getTasksByTab}
                />
              </motion.div>
            )}
            {activeView === 'garden' && (
              <motion.div
                key="garden-mobile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GardenView 
                  completedTasks={gardenProgress} 
                  language={settings.language} 
                />
              </motion.div>
            )}
            {(activeView === 'all' || activeView === 'completed') && (
              <motion.div
                key={`${activeView}-mobile`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-4"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-foreground gradient-text mb-1">
                    {t(activeView as TranslationKey)}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {currentTasks.length} {settings.language === 'en' ? 'tasks' : 'задач'}
                  </p>
                </div>
                <TaskList
                  tasks={currentTasks}
                  onComplete={handleCompleteTask}
                  onUndo={uncompleteTask}
                  onEdit={handleEditTask}
                  onDelete={(id) => setTaskToDelete(id)}
                  language={settings.language}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Task Form Dialog */}
      <Dialog open={showTaskForm} onOpenChange={(open) => {
        setShowTaskForm(open);
        if (!open) {
          setEditingTask(undefined);
          setSelectedCategory(null);
        }
      }}>
        <DialogContent className="sm:max-w-md p-0 bg-card/95 backdrop-blur-sm">
          <TaskForm
            task={editingTask}
            onSave={editingTask ? handleUpdateTask : handleAddTask}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(undefined);
              setSelectedCategory(null);
            }}
            language={settings.language}
          />
        </DialogContent>
      </Dialog>

      {/* Onboarding Dialog */}
      <OnboardingDialog
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
        language={settings.language}
        onComplete={handleOnboardingComplete}
      />

      {/* Settings Dialog */}
      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        onSettingsChange={setSettings}
        onClearAllTasks={clearAllTasks}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirmDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('no')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => taskToDelete && handleDeleteTask(taskToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('yes')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
