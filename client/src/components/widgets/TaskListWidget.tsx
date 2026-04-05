import { Task } from "../../types";
import { Widget } from "../../types/widgets";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "../../context/LanguageContext";

interface TaskListWidgetProps {
  widget: Widget;
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
}

export function TaskListWidget({ widget, tasks, onToggleComplete }: TaskListWidgetProps) {
  const { t } = useLanguage();
  
  let filteredTasks = [...tasks];
  
  // Apply filters
  if (widget.config.filterPriority && widget.config.filterPriority !== "all") {
    filteredTasks = filteredTasks.filter(task => task.priority === widget.config.filterPriority);
  }
  
  if (widget.config.filterCategory) {
    filteredTasks = filteredTasks.filter(task => task.category === widget.config.filterCategory);
  }
  
  if (widget.config.filterCompleted === "active") {
    filteredTasks = filteredTasks.filter(task => !task.completed);
  } else if (widget.config.filterCompleted === "completed") {
    filteredTasks = filteredTasks.filter(task => task.completed);
  }
  
  // Limit tasks
  if (widget.config.maxTasks) {
    filteredTasks = filteredTasks.slice(0, widget.config.maxTasks);
  }
  
  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300",
    low: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300",
  };

  return (
    <div className="space-y-2">
      {filteredTasks.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          {t.noTasksAvailable}
        </p>
      ) : (
        filteredTasks.map((task) => (
          <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleComplete(task.id)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${task.completed ? "line-through text-gray-500" : ""}`}>
                {task.title}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge className={`${priorityColors[task.priority]} text-xs`} variant="outline">
                  {task.priority}
                </Badge>
                {task.dueDate && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(task.dueDate), "MMM d")}</span>
                  </div>
                )}
                {task.estimatedTime && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{task.estimatedTime}m</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
