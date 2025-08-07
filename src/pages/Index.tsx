import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, TabType, AppSettings } from '@/types/task';
import { useTaskManager } from '@/hooks/useTaskManager';
import { loadSettings, saveSettings } from '@/utils/localStorage';
import { translations, TranslationKey } from '@/utils/translations';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { GardenView } from '@/components/GardenView';
import { TabNavigation } from '@/components/TabNavigation';
import { SettingsDialog } from '@/components/SettingsDialog';
import { FloatingAddButton } from '@/components/FloatingAddButton';
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
  const [settings, setSettings] = useState<AppSettings>({ theme: 'light', language: 'en' });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const { toast } = useToast();

  // Load settings on mount
  useEffect(() => {
    const savedSettings = loadSettings();
    setSettings(savedSettings);
    document.documentElement.classList.toggle('dark', savedSettings.theme === 'dark');
  }, []);

  // Save settings when changed
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const t = (key: TranslationKey) => translations[settings.language][key];

  const handleAddTask = (title: string, description: string, priority: any, date: any) => {
    addTask(title, description, priority, date);
    setShowTaskForm(false);
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
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card">
          <div className="p-4 border-b border-border">
            <h1 className="text-xl font-bold text-primary">{t('appName')}</h1>
          </div>
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSettingsClick={() => setShowSettings(true)}
            language={settings.language}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'garden' ? (
                  <motion.div
                    key="garden"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <GardenView 
                      completedTasks={gardenProgress} 
                      language={settings.language} 
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-foreground mb-2">
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
      <div className="md:hidden flex flex-col h-screen">
        {/* Header */}
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-bold text-primary text-center">{t('appName')}</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-20">
          <div className="p-4">
            <AnimatePresence mode="wait">
              {activeTab === 'garden' ? (
                <motion.div
                  key="garden"
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
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-foreground mb-1">
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

        {/* Bottom Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSettingsClick={() => setShowSettings(true)}
          language={settings.language}
          className="fixed bottom-0 left-0 right-0 z-40"
        />
      </div>

      {/* Floating Add Button */}
      {activeTab !== 'garden' && activeTab !== 'completed' && (
        <FloatingAddButton onClick={() => setShowTaskForm(true)} />
      )}

      {/* Task Form Dialog */}
      <Dialog open={showTaskForm} onOpenChange={(open) => {
        setShowTaskForm(open);
        if (!open) setEditingTask(undefined);
      }}>
        <DialogContent className="sm:max-w-md p-0">
          <TaskForm
            task={editingTask}
            onSave={editingTask ? handleUpdateTask : handleAddTask}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(undefined);
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
