import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { useLanguage } from "../../context/LanguageContext";
import type { Task } from "../../types";
import type { Widget } from "../../types/widgets";

const PRIORITY_COLORS: Record<string, string> = {
  high:   "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300",
  low:    "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300",
};

interface Props { widget: Widget; tasks: Task[]; onToggleComplete: (id: string) => void }

export function TaskListWidget({ widget, tasks, onToggleComplete }: Props) {
  const { t } = useLanguage();
  const { filterPriority, filterCategory, filterCompleted, maxTasks } = widget.config;

  let filtered = [...tasks];
  if (filterPriority && filterPriority !== "all") filtered = filtered.filter((t) => t.priority === filterPriority);
  if (filterCategory) filtered = filtered.filter((t) => t.category === filterCategory);
  if (filterCompleted === "active") filtered = filtered.filter((t) => !t.completed);
  else if (filterCompleted === "completed") filtered = filtered.filter((t) => t.completed);
  if (maxTasks) filtered = filtered.slice(0, maxTasks);

  if (filtered.length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">{t.noTasksAvailable}</p>;
  }

  return (
    <div className="space-y-2">
      {filtered.map((task) => (
        <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <Checkbox checked={task.completed} onCheckedChange={() => onToggleComplete(task.id)} className="mt-1" />
          <div className="flex-1 min-w-0">
            <p className={`text-sm ${task.completed ? "line-through text-gray-500" : ""}`}>{task.title}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge className={`${PRIORITY_COLORS[task.priority]} text-xs`} variant="outline">{task.priority}</Badge>
              {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <Calendar className="w-3 h-3" /><span>{format(new Date(task.dueDate), "MMM d")}</span>
                </div>
              )}
              {task.estimatedTime && (
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <Clock className="w-3 h-3" /><span>{task.estimatedTime}m</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
