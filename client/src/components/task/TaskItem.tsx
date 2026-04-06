import { format } from "date-fns";
import { Calendar, Edit2, Trash2, Clock, Play } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { TaskTimer } from "./TaskTimer";
import { useLanguage } from "../../context/LanguageContext";
import type { Task } from "../../types";

const PRIORITY_COLORS: Record<Task["priority"], string> = {
  high:   "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
  low:    "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
};

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onUpdateTimer: (id: string, timeSpent: number, timerActive: boolean, timerStartedAt?: string) => void;
}

export function TaskItem({ task, onEdit, onDelete, onToggleComplete, onUpdateTimer }: Props) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <Checkbox checked={task.completed} onCheckedChange={() => onToggleComplete(task.id)} className="mt-1" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg ${task.completed ? "line-through text-gray-500 dark:text-gray-600" : ""}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-sm mt-1 ${task.completed ? "text-gray-400 dark:text-gray-600" : "text-gray-600 dark:text-gray-400"}`}>
                  {task.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => onEdit(task)} className="h-8 w-8">
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge className={PRIORITY_COLORS[task.priority]} variant="outline">
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            <Badge variant="secondary">{task.category}</Badge>
            {task.estimatedTime && (
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded">
                <Clock className="w-3 h-3" />
                <span>{t.estimatedTime}: {task.estimatedTime}{t.minutes}</span>
              </div>
            )}
            {task.startDate && (
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 bg-purple-50 dark:bg-purple-950 px-2 py-1 rounded">
                <Play className="w-3 h-3" />
                <span>{t.startDate}: {format(new Date(task.startDate), "MMM d, yyyy")}</span>
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 bg-orange-50 dark:bg-orange-950 px-2 py-1 rounded">
                <Calendar className="w-3 h-3" />
                <span>{t.dueDate}: {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
              </div>
            )}
          </div>

          {!task.completed && (
            <TaskTimer
              taskId={task.id}
              timeSpent={task.timeSpent ?? 0}
              timerActive={task.timerActive ?? false}
              timerStartedAt={task.timerStartedAt}
              onUpdateTimer={onUpdateTimer}
            />
          )}
        </div>
      </div>
    </div>
  );
}
