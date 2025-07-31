
import { useState, useRef, useCallback, useEffect } from 'react';

export interface TimerState {
    elapsedSeconds: number;
    isActive: boolean;
    isPaused: boolean;
}

export interface TimerActions {
    start: () => void;
    pause: () => void;
    resume: () => void;
    stop: () => number;
    reset: () => void;
    restore: (seconds: number) => void;
}

export const useTimer = (): [TimerState, TimerActions] => {
    const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);

    const rafRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const pauseTimeRef = useRef<number>(0);

    const tick = useCallback(() => {
        if (isPaused) return;
        setElapsedSeconds((performance.now() - startTimeRef.current) / 1000);
        rafRef.current = requestAnimationFrame(tick);
    }, [isPaused]);

    useEffect(() => {
        if (isActive && !isPaused) {
            rafRef.current = requestAnimationFrame(tick);
        } else {
            cancelAnimationFrame(rafRef.current);
        }
        return () => cancelAnimationFrame(rafRef.current);
    }, [isActive, isPaused, tick]);

    const start = useCallback(() => {
        setIsActive(true);
        setIsPaused(false);
        setElapsedSeconds(0);
        startTimeRef.current = performance.now();
    }, []);

    const pause = useCallback(() => {
        if (isActive && !isPaused) {
            setIsPaused(true);
            pauseTimeRef.current = performance.now();
        }
    }, [isActive, isPaused]);

    const resume = useCallback(() => {
        if (isActive && isPaused) {
            startTimeRef.current += (performance.now() - pauseTimeRef.current);
            setIsPaused(false);
        }
    }, [isActive, isPaused]);
    
    const stop = useCallback(() => {
        const finalDuration = elapsedSeconds;
        setIsActive(false);
        setIsPaused(false);
        cancelAnimationFrame(rafRef.current);
        setElapsedSeconds(0);
        return finalDuration;
    }, [elapsedSeconds]);

    const reset = useCallback(() => {
        stop();
    }, [stop]);
    
    const restore = useCallback((seconds: number) => {
        setIsActive(true);
        setIsPaused(false);
        setElapsedSeconds(seconds);
        startTimeRef.current = performance.now() - seconds * 1000;
    }, []);

    return [
        { elapsedSeconds, isActive, isPaused },
        { start, pause, resume, stop, reset, restore }
    ];
};
