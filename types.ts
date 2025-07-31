

export enum TimerCategory {
  STUDY = 'Study',
  CODING = 'Coding',
}

export interface Session {
  id: string;
  category: TimerCategory;
  startTime: string; // ISO string
  endTime: string; // ISO string
  duration: number; // in seconds
  note?: string;
}

export interface DailySummary {
  date: string; // YYYY-MM-DD
  [TimerCategory.STUDY]: number; // seconds
  [TimerCategory.CODING]: number; // seconds
}

export interface Goal {
  [TimerCategory.STUDY]: number; // minutes
  [TimerCategory.CODING]: number; // minutes
}

export enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export interface Task {
  id: string;
  title: string;
  category: TimerCategory | 'Other';
  status: TaskStatus;
  createdAt: string; // ISO string
  dueDate?: string; // YYYY-MM-DD
}

export interface ActiveSessionInfo {
    category: TimerCategory;
    startTime: number; // From Date.now()
}

export interface ReminderSettings {
  enabled: boolean;
  interval: number; // in minutes
}