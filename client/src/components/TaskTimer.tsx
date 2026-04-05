import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";

interface TaskTimerProps {
  taskId: string;
  timeSpent: number; // in seconds
  timerActive: boolean;
  timerStartedAt?: string;
  onUpdateTimer: (taskId: string, timeSpent: number, timerActive: boolean, timerStartedAt?: string) => void;
}

export function TaskTimer({ taskId, timeSpent, timerActive, timerStartedAt, onUpdateTimer }: TaskTimerProps) {
  const [currentTime, setCurrentTime] = useState(timeSpent);

  useEffect(() => {
    if (timerActive && timerStartedAt) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - new Date(timerStartedAt).getTime()) / 1000);
        setCurrentTime(timeSpent + elapsed);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCurrentTime(timeSpent);
    }
  }, [timerActive, timerStartedAt, timeSpent]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    onUpdateTimer(taskId, timeSpent, true, new Date().toISOString());
  };

  const handlePause = () => {
    onUpdateTimer(taskId, currentTime, false, undefined);
  };

  const handleReset = () => {
    onUpdateTimer(taskId, 0, false, undefined);
  };

  return (
    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
      <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      <span className="text-sm font-mono min-w-[60px]">{formatTime(currentTime)}</span>
      <div className="flex items-center gap-1">
        {!timerActive ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleStart}
          >
            <Play className="w-3 h-3" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handlePause}
          >
            <Pause className="w-3 h-3" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleReset}
          disabled={currentTime === 0}
        >
          <RotateCcw className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
