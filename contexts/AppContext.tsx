

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Session, Task, Goal, DailySummary, TimerCategory, TaskStatus, ActiveSessionInfo, ReminderSettings } from '../types';
import { DEFAULT_GOALS, DEFAULT_REMINDER_SETTINGS } from '../constants';
import { getTodayInIst, getIstDate, formatDuration } from '../lib/time';
import { useTimer, TimerState } from '../hooks/useTimer';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import Icon from '../components/shared/Icon';

interface AppContextType {
    sessions: Session[];
    addSession: (session: Omit<Session, 'id'>) => void;
    tasks: Task[];
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
    updateTask: (updatedTask: Task) => void;
    deleteTask: (taskId: string) => void;
    goals: Goal;
    updateGoals: (newGoals: Goal) => void;
    dailySummaries: Record<string, DailySummary>;
    getSummaryForDate: (date: string) => DailySummary;
    todaySummary: DailySummary;
    streaks: { current: number; best: number };
    allData: () => { sessions: Session[], tasks: Task[], goals: Goal, dailySummaries: Record<string, DailySummary>, reminderSettings: ReminderSettings };
    importData: (data: any) => { success: boolean, message: string };
    timerState: TimerState;
    activeTimerCategory: TimerCategory | null;
    startTimer: (category: TimerCategory) => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    stopTimer: (note?: string) => void;
    isOnBreak: boolean;
    breakTimerState: TimerState;
    startBreak: () => void;
    endBreak: () => void;
    reminderSettings: ReminderSettings;
    updateReminderSettings: (settings: ReminderSettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [sessions, setSessions] = useLocalStorage<Session[]>('sessions', []);
    const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
    const [goals, setGoals] = useLocalStorage<Goal>('goals', DEFAULT_GOALS);
    const [dailySummaries, setDailySummaries] = useLocalStorage<Record<string, DailySummary>>('dailySummaries', {});
    const [reminderSettings, setReminderSettings] = useLocalStorage<ReminderSettings>('reminderSettings', DEFAULT_REMINDER_SETTINGS);

    // Global Timer State
    const [timerState, timerActions] = useTimer();
    const [activeTimerInfo, setActiveTimerInfo] = useLocalStorage<ActiveSessionInfo | null>('activeTimer', null);
    const [activeTimerCategory, setActiveTimerCategory] = useState<TimerCategory | null>(null);

    // Break Timer State
    const [isOnBreak, setIsOnBreak] = useState<boolean>(false);
    const [breakTimerState, breakTimerActions] = useTimer();

    const lastReminderElapsedSecondsRef = useRef(0);

    const calculateSummaries = useCallback((allSessions: Session[]): Record<string, DailySummary> => {
        const summaries: Record<string, DailySummary> = {};
        for (const session of allSessions) {
            const date = getIstDate(new Date(session.startTime));
            if (!summaries[date]) {
                summaries[date] = { date, [TimerCategory.STUDY]: 0, [TimerCategory.CODING]: 0 };
            }
            summaries[date][session.category] += session.duration;
        }
        return summaries;
    }, []);
    
    useEffect(() => {
        setDailySummaries(calculateSummaries(sessions));
    }, [sessions, setDailySummaries, calculateSummaries]);

    const addSession = (sessionData: Omit<Session, 'id'>) => {
        const newSession: Session = {
            id: `sess_${Date.now()}`,
            ...sessionData
        };
        setSessions(prev => [newSession, ...prev]);
    };

    const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
        const newTask: Task = {
            id: `task_${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: TaskStatus.TODO,
            ...taskData
        };
        setTasks(prev => [newTask, ...prev]);
    };
    
    const updateTask = (updatedTask: Task) => {
        setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
    };

    const deleteTask = (taskId: string) => {
        setTasks(prev => prev.filter(task => task.id !== taskId));
    }

    const updateGoals = (newGoals: Goal) => {
        setGoals(newGoals);
    };
    
    const updateReminderSettings = (settings: ReminderSettings) => {
        setReminderSettings(settings);
    };

    const getSummaryForDate = useCallback((date: string): DailySummary => {
        return dailySummaries[date] || { date, [TimerCategory.STUDY]: 0, [TimerCategory.CODING]: 0 };
    }, [dailySummaries]);

    const todaySummary = getSummaryForDate(getTodayInIst());

    // Health Reminders Effect
    useEffect(() => {
        const { isActive, isPaused, elapsedSeconds } = timerState;
        const { enabled, interval } = reminderSettings;
    
        if (isActive && !isPaused && enabled && !isOnBreak) {
            const intervalInSeconds = interval * 60;
            if (elapsedSeconds >= lastReminderElapsedSecondsRef.current + intervalInSeconds) {
                toast.custom(
                    (t) => (
                        <div
                            className={`max-w-md w-full bg-card shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 transition-all ${
                                t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                        >
                            <div className="flex-1 w-0 p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 pt-0.5">
                                        <Icon name="Coffee" className="h-10 w-10 text-primary" />
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm font-medium text-foreground">Time for a break!</p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Stand up, stretch, and drink some water.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex border-l border-border">
                                <button
                                    onClick={() => toast.dismiss(t.id)}
                                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    ),
                    { duration: 10000, position: 'bottom-center' }
                );
                lastReminderElapsedSecondsRef.current = Math.floor(elapsedSeconds / intervalInSeconds) * intervalInSeconds;
            }
        }
    
        if (!isActive) {
            lastReminderElapsedSecondsRef.current = 0;
        }
    }, [timerState, reminderSettings, isOnBreak]);

    // Timer control functions
    useEffect(() => {
        if (activeTimerInfo) {
            const elapsedSeconds = (Date.now() - activeTimerInfo.startTime) / 1000;
            if (elapsedSeconds > 0) {
                setActiveTimerCategory(activeTimerInfo.category);
                timerActions.restore(elapsedSeconds);
            } else {
                setActiveTimerInfo(null);
            }
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const startTimer = (category: TimerCategory) => {
        if (isOnBreak) {
            breakTimerActions.stop();
            setIsOnBreak(false);
        }
        setActiveTimerCategory(category);
        timerActions.start();
        setActiveTimerInfo({ category, startTime: Date.now() });
    };

    const stopTimer = (note?: string) => {
        if (isOnBreak) {
            breakTimerActions.stop();
            setIsOnBreak(false);
        }

        const duration = timerActions.stop();
        const category = activeTimerCategory;
        
        setActiveTimerInfo(null);
        setActiveTimerCategory(null);
        lastReminderElapsedSecondsRef.current = 0;
        
        if (duration > 5 && category) {
            const sessionData = {
                category,
                startTime: new Date(Date.now() - duration * 1000).toISOString(),
                endTime: new Date().toISOString(),
                duration,
                note: note?.trim(),
            };
            addSession(sessionData);
            toast.success(`${category} session of ${formatDuration(duration)} saved!`);

            const oldTotal = todaySummary[category];
            const newTotal = oldTotal + duration;
            const goalSeconds = goals[category] * 60;

            if (goalSeconds > 0 && oldTotal < goalSeconds && newTotal >= goalSeconds) {
                toast.success(`Goal for ${category} reached! Great job!`, { duration: 5000 });
                confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
            }
        }
    };
    
    const startBreak = () => {
        if (timerState.isActive && !timerState.isPaused) {
            timerActions.pause();
            setIsOnBreak(true);
            breakTimerActions.start();
            toast('Break time! Resume when you are ready.', { icon: '☕' });
        }
    };

    const endBreak = () => {
        if (isOnBreak) {
            breakTimerActions.stop();
            setIsOnBreak(false);
            timerActions.resume();
            toast.success('Break over. Back to focus!');
        }
    };

    const calculateStreaks = useCallback(() => {
        const sortedDates = Object.keys(dailySummaries).sort();
        if (sortedDates.length === 0) return { current: 0, best: 0 };
    
        let currentStreak = 0;
        let bestStreak = 0;
        let lastDate: Date | null = null;
    
        for (const dateStr of sortedDates) {
            const summary = dailySummaries[dateStr];
            const totalGoalSeconds = (goals[TimerCategory.STUDY] + goals[TimerCategory.CODING]) * 60;
            const totalAchievedSeconds = summary[TimerCategory.STUDY] + summary[TimerCategory.CODING];
    
            if (totalAchievedSeconds >= totalGoalSeconds) {
                const currentDate = new Date(dateStr);
                if (lastDate) {
                    const diffTime = currentDate.getTime() - lastDate.getTime();
                    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays === 1) {
                        currentStreak++;
                    } else {
                        currentStreak = 1;
                    }
                } else {
                    currentStreak = 1;
                }
                lastDate = currentDate;
            } else {
                if(lastDate) {
                    const currentDate = new Date(dateStr);
                    const diffTime = currentDate.getTime() - lastDate.getTime();
                    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays > 1) {
                        currentStreak = 0;
                        lastDate = null;
                    }
                }
            }
            if (currentStreak > bestStreak) {
                bestStreak = currentStreak;
            }
        }
        
        const todayStr = getTodayInIst();
        if (lastDate) {
             const diffTime = new Date(todayStr).getTime() - lastDate.getTime();
             const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
             if (diffDays > 1) currentStreak = 0;
        }

        return { current: currentStreak, best: bestStreak };
    }, [dailySummaries, goals]);

    const streaks = calculateStreaks();

    const allData = () => ({
        sessions,
        tasks,
        goals,
        dailySummaries,
        reminderSettings
    });

    const importData = (data: any) => {
        try {
            if (data.goals) setGoals(data.goals);
            if (data.tasks && Array.isArray(data.tasks)) setTasks(data.tasks);
            if (data.sessions && Array.isArray(data.sessions)) {
                setSessions(data.sessions);
                setDailySummaries(calculateSummaries(data.sessions));
            } else if (data.dailySummaries) {
                setDailySummaries(data.dailySummaries);
            }
            if (data.reminderSettings) setReminderSettings(data.reminderSettings);
            return { success: true, message: "Data imported successfully." };
        } catch (e) {
            console.error("Import failed", e);
            return { success: false, message: "Failed to parse imported file. Please check the format." };
        }
    };


    const value: AppContextType = {
        sessions,
        addSession,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        goals,
        updateGoals,
        dailySummaries,
        getSummaryForDate,
        todaySummary,
        streaks,
        allData,
        importData,
        timerState,
        activeTimerCategory,
        startTimer,
        pauseTimer: timerActions.pause,
        resumeTimer: timerActions.resume,
        stopTimer,
        isOnBreak,
        breakTimerState,
        startBreak,
        endBreak,
        reminderSettings,
        updateReminderSettings,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};