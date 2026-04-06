import { Task } from "../types";
import { Widget } from "../types/widgets";
import { Button } from "./ui/button";
import { X, GripVertical } from "lucide-react";
import { TaskListWidget } from "./widgets/TaskListWidget";
import { CountdownWidget } from "./widgets/CountdownWidget";
import { AnalyticsWidget } from "./widgets/AnalyticsWidget";

interface WidgetCardProps {
  widget: Widget;
  tasks: Task[];
  onDelete: (widgetId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export function WidgetCard({ widget, tasks, onDelete, onToggleComplete }: WidgetCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 p-4 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
          <h3 className="font-semibold">{widget.title}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(widget.id)}
          className="h-8 w-8 text-gray-500 hover:text-red-600"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="widget-content">
        {widget.type === "task-list" && (
          <TaskListWidget widget={widget} tasks={tasks} onToggleComplete={onToggleComplete} />
        )}
        {widget.type === "countdown" && (
          <CountdownWidget widget={widget} tasks={tasks} />
        )}
        {widget.type === "analytics" && (
          <AnalyticsWidget widget={widget} tasks={tasks} />
        )}
      </div>
    </div>
  );
}
