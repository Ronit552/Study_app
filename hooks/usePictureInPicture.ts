
import { useState, useRef, useCallback, useEffect } from 'react';
import { TimerCategory } from '../types';
import { formatDuration } from '../lib/time';

interface PiPHookOptions {
    theme: 'light' | 'dark';
}

export const usePictureInPicture = ({ theme }: PiPHookOptions) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isPipActive, setIsPipActive] = useState(false);

    const isPipSupported = typeof document !== 'undefined' && document.pictureInPictureEnabled;

    const cleanup = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.remove();
            videoRef.current = null;
        }
        if (canvasRef.current) {
            canvasRef.current.remove();
            canvasRef.current = null;
        }
    }, []);

    const updatePipContent = useCallback((category: TimerCategory | 'Break', elapsedSeconds: number) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        
        const bgColor = theme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)';
        const textColor = theme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 84% 4.9%)';
        const categoryColor = theme === 'dark' ? '#818cf8' : '#4f46e5';

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        
        ctx.font = 'bold 28px sans-serif';
        ctx.fillStyle = categoryColor;
        ctx.textAlign = 'center';
        ctx.fillText(category, width / 2, height / 2 - 30);

        ctx.font = 'bold 60px "Courier New", monospace';
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.fillText(formatDuration(elapsedSeconds), width / 2, height / 2 + 40);

    }, [theme]);

    const enterPictureInPicture = useCallback(async (initialCategory: TimerCategory | 'Break', initialSeconds: number) => {
        if (!isPipSupported || isPipActive || document.pictureInPictureElement) return;

        const video = document.createElement('video');
        video.muted = true;
        video.style.display = 'none';
        video.playsInline = true;
        videoRef.current = video;

        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 250;
        canvas.style.display = 'none';
        canvasRef.current = canvas;
        
        document.body.appendChild(video);
        document.body.appendChild(canvas);

        video.addEventListener('leavepictureinpicture', () => {
            // This event fires when PiP is closed by the user or programmatically.
            // We simply update our state and clean up resources.
            setIsPipActive(false);
            cleanup();
        }, { once: true });
        
        updatePipContent(initialCategory, initialSeconds);
        
        // @ts-ignore
        video.srcObject = canvas.captureStream();
        
        try {
            await video.play();
            await video.requestPictureInPicture();
            setIsPipActive(true);
        } catch (error) {
            console.error("Error entering Picture-in-Picture mode:", error);
            cleanup();
        }

    }, [isPipSupported, isPipActive, cleanup, updatePipContent]);

    const exitPictureInPicture = useCallback(async () => {
        if (!isPipSupported || !isPipActive || !document.pictureInPictureElement) return;
        try {
            await document.exitPictureInPicture();
        } catch (error) {
            console.error("Error exiting Picture-in-Picture mode:", error);
            // On failure, manually reset state as the 'leave' event may not fire.
            setIsPipActive(false);
            cleanup();
        }
    }, [isPipSupported, isPipActive, cleanup]);

    useEffect(() => {
        // Cleanup effect for component unmount
        return () => {
            if (document.pictureInPictureElement && videoRef.current === document.pictureInPictureElement) {
                // Try to exit PiP if the component unmounts while it's active.
                document.exitPictureInPicture().catch(() => {});
            }
            cleanup();
        };
    }, [cleanup]);

    return {
        isPipSupported,
        isPipActive,
        enterPictureInPicture,
        exitPictureInPicture,
        updatePipContent,
    };
};
