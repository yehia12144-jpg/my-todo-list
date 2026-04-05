import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";

interface Props {
  taskId: string;
  timeSpent: number;
  timerActive: boolean;
  timerStartedAt?: string;
  onUpdateTimer: (taskId: string, timeSpent: number, timerActive: boolean, timerStartedAt?: string) => void;
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function TaskTimer({ taskId, timeSpent, timerActive, timerStartedAt, onUpdateTimer }: Props) {
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

  return (
    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
      <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      <span className="text-sm font-mono min-w-[60px]">{formatTime(currentTime)}</span>
      <div className="flex items-center gap-1">
        {!timerActive ? (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onUpdateTimer(taskId, timeSpent, true, new Date().toISOString())}>
            <Play className="w-3 h-3" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onUpdateTimer(taskId, currentTime, false, undefined)}>
            <Pause className="w-3 h-3" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onUpdateTimer(taskId, 0, false, undefined)} disabled={currentTime === 0}>
          <RotateCcw className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
