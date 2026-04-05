import { TaskItem } from "./TaskItem";
import type { Task } from "../../types";

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onUpdateTimer: (id: string, timeSpent: number, timerActive: boolean, timerStartedAt?: string) => void;
}

export function TaskList({ tasks, onEdit, onDelete, onToggleComplete, onUpdateTimer }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No tasks found. Add a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          onUpdateTimer={onUpdateTimer}
        />
      ))}
    </div>
  );
}
