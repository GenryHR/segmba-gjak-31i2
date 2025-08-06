import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CalendarDays, CalendarRange, Clock, List, CheckCircle, Sprout, Settings } from 'lucide-react';
import { TabType } from '@/types/task';
import { Button } from '@/components/ui/button';
import { translations, TranslationKey } from '@/utils/translations';
import { cn } from '@/lib/utils';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onSettingsClick: () => void;
  language: 'en' | 'ru';
  className?: string;
}

const tabIcons = {
  today: Calendar,
  tomorrow: CalendarDays,
  week: CalendarRange,
  someday: Clock,
  all: List,
  completed: CheckCircle,
  garden: Sprout
};

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  onSettingsClick,
  language,
  className
}) => {
  const t = (key: TranslationKey) => translations[language][key];

  const tabs: { key: TabType; label: string }[] = [
    { key: 'today', label: t('today') },
    { key: 'tomorrow', label: t('tomorrow') },
    { key: 'week', label: t('week') },
    { key: 'someday', label: t('someday') },
    { key: 'all', label: t('all') },
    { key: 'completed', label: t('completed') },
    { key: 'garden', label: t('garden') }
  ];

  return (
    <div className={cn("bg-background border-t border-border", className)}>
      {/* Mobile: Bottom Navigation */}
      <div className="block md:hidden">
        <div className="flex justify-around py-2 px-2">
          {tabs.slice(0, 4).map((tab) => {
            const Icon = tabIcons[tab.key];
            const isActive = activeTab === tab.key;
            
            return (
              <Button
                key={tab.key}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(tab.key)}
                className={cn(
                  "flex flex-col gap-1 h-auto py-2 px-2 relative",
                  isActive && "text-primary"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-tab-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-md"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="h-4 w-4" />
                <span className="text-xs leading-none">{tab.label}</span>
              </Button>
            );
          })}
          
          {/* More button for additional tabs */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            className="flex flex-col gap-1 h-auto py-2 px-2"
          >
            <Settings className="h-4 w-4" />
            <span className="text-xs leading-none">•••</span>
          </Button>
        </div>
      </div>

      {/* Desktop: Side Navigation */}
      <div className="hidden md:block">
        <div className="flex flex-col p-2 space-y-1">
          {tabs.map((tab) => {
            const Icon = tabIcons[tab.key];
            const isActive = activeTab === tab.key;
            
            return (
              <Button
                key={tab.key}
                variant="ghost"
                onClick={() => onTabChange(tab.key)}
                className={cn(
                  "justify-start gap-3 relative",
                  isActive && "bg-primary/10 text-primary"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-tab-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
          
          <div className="pt-4 border-t border-border mt-4">
            <Button
              variant="ghost"
              onClick={onSettingsClick}
              className="justify-start gap-3 w-full"
            >
              <Settings className="h-4 w-4" />
              {t('settings')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};