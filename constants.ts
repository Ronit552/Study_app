

import { ReminderSettings, TimerCategory } from './types';

export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/timers', label: 'Timers', icon: 'Timer' },
  { href: '/tasks', label: 'Tasks', icon: 'CheckSquare' },
  { href: '/history', label: 'History', icon: 'History' },
  { href: '/settings', label: 'Settings', icon: 'Settings' },
];

export const DEFAULT_GOALS = {
  [TimerCategory.STUDY]: 120, // 2 hours in minutes
  [TimerCategory.CODING]: 60,  // 1 hour in minutes
};

export const FALLBACK_QUOTES = [
    "The secret of getting ahead is getting started.",
    "Don't watch the clock; do what it does. Keep going.",
    "The only way to do great work is to love what you do.",
    "Focus on being productive instead of busy.",
    "The future depends on what you do today."
];

export const POMODORO_OPTIONS = {
  '25/5': { work: 25, break: 5 },
  '50/10': { work: 50, break: 10 },
  'Custom': { work: 0, break: 0 },
};

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enabled: true,
  interval: 45, // minutes
};
