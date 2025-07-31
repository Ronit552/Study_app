import React from 'react';
import Button from '../ui/Button';
import Icon from '../shared/Icon';

interface TimerControlsProps {
    isActive: boolean;
    isPaused: boolean;
    onStart: () => void;
    onPause: () => void;
    onResume: () => void;
    onStop: () => void;
    onTakeBreak: () => void;
    isPipSupported: boolean;
    isPipActive: boolean;
    onTogglePip: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
    isActive,
    isPaused,
    onStart,
    onPause,
    onResume,
    onStop,
    onTakeBreak,
    isPipSupported,
    isPipActive,
    onTogglePip,
}) => {
    return (
        <div className="flex justify-center items-center flex-wrap gap-2 md:gap-4 mt-8">
            {!isActive ? (
                <Button size="lg" onClick={onStart}>
                    <Icon name="Play" className="mr-2 h-5 w-5" />
                    Start
                </Button>
            ) : (
                <>
                    {isPaused ? (
                        <Button size="lg" onClick={onResume} className="bg-green-600 hover:bg-green-700">
                            <Icon name="Play" className="mr-2 h-5 w-5" />
                            Resume
                        </Button>
                    ) : (
                        <>
                            <Button size="lg" variant="secondary" onClick={onPause}>
                                <Icon name="Pause" className="mr-2 h-5 w-5" />
                                Pause
                            </Button>
                             <Button size="lg" variant="outline" onClick={onTakeBreak}>
                                <Icon name="Coffee" className="mr-2 h-5 w-5" />
                                Break
                            </Button>
                        </>
                    )}
                    <Button size="lg" variant="destructive" onClick={onStop}>
                        <Icon name="Square" className="mr-2 h-5 w-5" />
                        Stop
                    </Button>
                    {isPipSupported && (
                         <Button size="lg" variant="outline" onClick={onTogglePip}>
                            <Icon name={isPipActive ? "Minimize" : "PictureInPicture2"} className="mr-2 h-5 w-5" />
                            {isPipActive ? 'Exit PiP' : 'Keep on Top'}
                        </Button>
                    )}
                </>
            )}
        </div>
    );
};

export default TimerControls;
