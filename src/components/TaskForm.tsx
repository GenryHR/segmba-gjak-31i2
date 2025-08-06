import React, { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Task, Priority, TaskDate } from '@/types/task';
import { TranslationKey, translations } from '@/utils/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  task?: Task;
  onSave: (title: string, description: string, priority: Priority, date: TaskDate) => void;
  onCancel: () => void;
  language: 'en' | 'ru';
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSave,
  onCancel,
  language
}) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'medium');
  const [dateType, setDateType] = useState<string>(() => {
    if (!task?.date) return 'today';
    if (typeof task.date === 'string') return task.date;
    return 'custom';
  });
  const [customDate, setCustomDate] = useState<Date | undefined>(() => {
    return task?.date instanceof Date ? task.date : undefined;
  });

  const t = (key: TranslationKey) => translations[language][key];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let finalDate: TaskDate;
    if (dateType === 'custom' && customDate) {
      finalDate = customDate;
    } else {
      finalDate = dateType as TaskDate;
    }

    onSave(title.trim(), description.trim(), priority, finalDate);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">
          {task ? t('editTask') : t('addTask')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t('taskTitle')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('taskTitle')}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('taskDescription')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('taskDescription')}
              rows={3}
            />
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <Label>{t('priority')}</Label>
            <RadioGroup value={priority} onValueChange={(value) => setPriority(value as Priority)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="text-priority-low font-medium">
                  {t('low')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="text-priority-medium font-medium">
                  {t('medium')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="text-priority-high font-medium">
                  {t('high')}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date */}
          <div className="space-y-3">
            <Label>{t('date')}</Label>
            <Select value={dateType} onValueChange={setDateType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">{t('today')}</SelectItem>
                <SelectItem value="tomorrow">{t('tomorrow')}</SelectItem>
                <SelectItem value="week">{t('week')}</SelectItem>
                <SelectItem value="someday">{t('someday')}</SelectItem>
                <SelectItem value="custom">{t('pickDate')}</SelectItem>
              </SelectContent>
            </Select>

            {dateType === 'custom' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !customDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customDate ? format(customDate, "PPP") : t('pickDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customDate}
                    onSelect={setCustomDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {t('save')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              {t('cancel')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};