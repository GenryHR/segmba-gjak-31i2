import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import { Task, TabType, AppSettings } from '@/types/task';
import { useTaskManager } from '@/hooks/useTaskManager';
import { loadSettings, saveSettings } from '@/utils/localStorage';
import { translations, TranslationKey } from '@/utils/translations';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { GardenView } from '@/components/GardenView';
import { CategoryList } from '@/components/CategoryList';
import { SettingsDialog } from '@/components/SettingsDialog';
import { OnboardingDialog } from '@/components/OnboardingDialog';
import { AtmosphericBackground } from '@/components/AtmosphericBackground';
import { MusicPlayer } from '@/components/MusicPlayer';
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
import { Button } from '@/components/ui/button';
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

  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [settings, setSettings] = useState<AppSettings>({ 
    theme: 'fantasy', 
    language: 'en' 
  });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TabType>('today');

  const { toast } = useToast();

  // Load settings and check for first visit
  useEffect(() => {
    const savedSettings = loadSettings();
    const hasVisited = localStorage.getItem('growtasks-has-visited');
    
    // Enhanced settings with theme support
    const enhancedSettings = {
      theme: savedSettings.theme || 'fantasy',
      language: savedSettings.language || 'en'
    };
    
    setSettings(enhancedSettings);
    
    // Apply theme class
    document.documentElement.classList.remove(
      'theme-fantasy', 'theme-nature', 'theme-beach', 'theme-arthouse'
    );
    if (enhancedSettings.theme !== 'fantasy') {
      document.documentElement.classList.add(`theme-${enhancedSettings.theme}`);
    }
    
    // Show onboarding for first-time users
    if (!hasVisited) {
      setShowOnboarding(true);
    }
  }, []);

  // Save settings when changed
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const t = (key: TranslationKey) => translations[settings.language][key];

  // Complete onboarding
  const handleOnboardingComplete = () => {
    localStorage.setItem('growtasks-has-visited', 'true');
    setShowOnboarding(false);
  };

  // Handle category tap to open task form
  const handleCategoryTap = (category: TabType) => {
    setSelectedCategory(category);
    setShowTaskForm(true);
  };

  // Get task counts for each category
  const getTaskCounts = (): Record<TabType, number> => {
    return {
      today: getTasksByTab('today').length,
      tomorrow: getTasksByTab('tomorrow').length,
      week: getTasksByTab('week').length,
      someday: getTasksByTab('someday').length,
      all: getTasksByTab('all').length,
      completed: getTasksByTab('completed').length,
      garden: gardenProgress
    };
  };

  const handleAddTask = (title: string, description: string, priority: any, date: any) => {
    // Use selected category if available, otherwise use the date parameter
    const taskDate = selectedCategory !== 'all' && selectedCategory !== 'completed' && selectedCategory !== 'garden' 
      ? selectedCategory 
      : date;
    
    addTask(title, description, priority, taskDate);
    setShowTaskForm(false);
    setSelectedCategory('today'); // Reset selection
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

  const currentTasks = getTasksByTab(activeTab);
  const completedTasksCount = tasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Atmospheric Background */}
      <AtmosphericBackground theme={settings.theme} />
      
      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen relative z-10">
        {/* Sidebar */}
        <div className="w-80 border-r border-border bg-card/80 backdrop-blur-md">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">{t('appName')}</h1>
            <div className="flex items-center gap-2">
              <MusicPlayer language={settings.language} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="p-2"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <CategoryList
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onCategoryTap={handleCategoryTap}
            language={settings.language}
            taskCounts={getTaskCounts()}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden bg-background/50 backdrop-blur-sm">
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'garden' ? (
                  <motion.div
                    key="garden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <GardenView 
                      completedTasks={gardenProgress} 
                      language={settings.language} 
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {t(activeTab as TranslationKey)}
                      </h2>
                      <p className="text-muted-foreground">
                        {currentTasks.length} {settings.language === 'en' ? 'tasks' : 'задач'}
                        {activeTab === 'completed' && ` • ${gardenProgress} ${t('tasksCompleted')}`}
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
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen relative z-10">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-md border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">{t('appName')}</h1>
            <div className="flex items-center gap-2">
              <MusicPlayer language={settings.language} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="p-2"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Category Sidebar */}
            <div className="w-2/5 border-r border-border bg-card/50 backdrop-blur-sm">
              <CategoryList
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onCategoryTap={handleCategoryTap}
                language={settings.language}
                taskCounts={getTaskCounts()}
              />
            </div>
            
            {/* Task Content */}
            <div className="flex-1 overflow-y-auto bg-background/30 backdrop-blur-sm">
              <div className="p-4">
                <AnimatePresence mode="wait">
                  {activeTab === 'garden' ? (
                    <motion.div
                      key="garden"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                    >
                      <GardenView 
                        completedTasks={gardenProgress} 
                        language={settings.language} 
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-4">
                        <h2 className="text-lg font-bold text-foreground mb-1">
                          {t(activeTab as TranslationKey)}
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
          </div>
        </div>
      </div>

      {/* Onboarding Dialog */}
      <OnboardingDialog
        open={showOnboarding}
        onComplete={handleOnboardingComplete}
        language={settings.language}
      />

      {/* Task Form Dialog */}
      <Dialog open={showTaskForm} onOpenChange={(open) => {
        setShowTaskForm(open);
        if (!open) {
          setEditingTask(undefined);
          setSelectedCategory('today');
        }
      }}>
        <DialogContent className="sm:max-w-md p-0 border-0 bg-card/95 backdrop-blur-md">
          <TaskForm
            task={editingTask}
            onSave={editingTask ? handleUpdateTask : handleAddTask}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(undefined);
              setSelectedCategory('today');
            }}
            language={settings.language}
          />
        </DialogContent>
      </Dialog>

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
        <AlertDialogContent className="bg-card/95 backdrop-blur-md border border-border/50">
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
