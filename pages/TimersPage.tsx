
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { TimerCategory } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePictureInPicture } from '../hooks/usePictureInPicture';
import TimerDisplay from '../components/timers/TimerDisplay';
import TimerControls from '../components/timers/TimerControls';
import toast from 'react-hot-toast';
import DistractionChecklist from '../components/shared/DistractionChecklist';
import Button from '../components/ui/Button';
import Icon from '../components/shared/Icon';
import SessionNoteModal from '../components/timers/SessionNoteModal';

interface TimersPageProps {
  initialCategory?: TimerCategory;
}

const TimersPage: React.FC<TimersPageProps> = ({ initialCategory: propInitialCategory }) => {
    const { 
        timerState, 
        activeTimerCategory,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        isOnBreak,
        breakTimerState,
        startBreak,
        endBreak
    } = useAppContext();
    const location = useLocation();
    const { theme } = useTheme();
    
    const getCategoryFromPath = useCallback(() => {
        if (location.pathname.includes('/study')) return TimerCategory.STUDY;
        if (location.pathname.includes('/coding')) return TimerCategory.CODING;
        return propInitialCategory || TimerCategory.STUDY;
    }, [location.pathname, propInitialCategory]);
    
    const [selectedCategory, setSelectedCategory] = useState<TimerCategory>(getCategoryFromPath());
    const [showChecklist, setShowChecklist] = useState(false);
    const [isNoteModalOpen, setNoteModalOpen] = useState(false);
    
    const displayCategory = timerState.isActive ? activeTimerCategory! : selectedCategory;

    const pip = usePictureInPicture({
        theme,
    });

    const handleStopRequest = useCallback(() => {
        if (pip.isPipActive) {
            pip.exitPictureInPicture();
        }
        if (timerState.isActive && !isNoteModalOpen) {
            pauseTimer();
            setNoteModalOpen(true);
        }
    }, [pip, timerState.isActive, isNoteModalOpen, pauseTimer]);


    useEffect(() => {
        if (pip.isPipActive && timerState.isActive) {
            pip.updatePipContent(isOnBreak ? 'Break' : displayCategory, isOnBreak ? breakTimerState.elapsedSeconds : timerState.elapsedSeconds);
        }
    }, [timerState.elapsedSeconds, breakTimerState.elapsedSeconds, timerState.isActive, pip, displayCategory, isOnBreak]);

    useEffect(() => {
        if (!timerState.isActive && !isOnBreak) {
            setSelectedCategory(getCategoryFromPath());
             if (pip.isPipActive) {
                pip.exitPictureInPicture();
            }
        }
    }, [location.pathname, timerState.isActive, getCategoryFromPath, pip, isOnBreak]);

    const handleStartWithChecklist = () => {
        setShowChecklist(true);
    };

    const handleConfirmChecklist = () => {
        setShowChecklist(false);
        startTimer(selectedCategory);
    };

    const handleCategoryChange = (newCategory: TimerCategory) => {
        if (timerState.isActive) {
            toast.error("Please stop the current timer before switching categories.");
            return;
        }
        setSelectedCategory(newCategory);
    };

    const handleSaveSession = (note: string) => {
        if(pip.isPipActive) {
            pip.exitPictureInPicture();
        }
        stopTimer(note);
        setNoteModalOpen(false);
    };

    const handleCancelSession = () => {
        resumeTimer();
        setNoteModalOpen(false);
    };
    
    const handleTogglePip = () => {
        if (pip.isPipActive) {
            pip.exitPictureInPicture();
        } else if (timerState.isActive) {
            pip.enterPictureInPicture(displayCategory, timerState.elapsedSeconds);
        }
    };


    if (isOnBreak) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <TimerDisplay category="Break" elapsedSeconds={breakTimerState.elapsedSeconds} />
                <div className="mt-8">
                    <Button size="lg" onClick={endBreak} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Icon name="Play" className="mr-2 h-5 w-5" />
                        End Break & Resume
                    </Button>
                </div>
            </div>
        );
    }

    if (!displayCategory) {
        return null; 
    }

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <SessionNoteModal
                isOpen={isNoteModalOpen}
                onSave={handleSaveSession}
                onCancel={handleCancelSession}
            />
            
            {showChecklist && <DistractionChecklist onConfirm={handleConfirmChecklist} />}
            <div className="flex justify-center space-x-4 mb-8">
                <button
                    onClick={() => handleCategoryChange(TimerCategory.STUDY)}
                    disabled={timerState.isActive}
                    className={`px-6 py-2 text-lg font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        displayCategory === TimerCategory.STUDY ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}
                >
                    Study
                </button>
                <button
                    onClick={() => handleCategoryChange(TimerCategory.CODING)}
                    disabled={timerState.isActive}
                    className={`px-6 py-2 text-lg font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        displayCategory === TimerCategory.CODING ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}
                >
                    Coding
                </button>
            </div>

            <TimerDisplay category={displayCategory} elapsedSeconds={timerState.elapsedSeconds} />

            <TimerControls
                isActive={timerState.isActive}
                isPaused={timerState.isPaused}
                onStart={handleStartWithChecklist}
                onPause={pauseTimer}
                onResume={resumeTimer}
                onStop={handleStopRequest}
                onTakeBreak={startBreak}
                isPipSupported={pip.isPipSupported}
                isPipActive={pip.isPipActive}
                onTogglePip={handleTogglePip}
            />
        </div>
    );
};

export default TimersPage;
