import { Task } from "../types";
import { TaskItem } from "./TaskItem";
import { useLanguage } from "../context/LanguageContext";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onUpdateTimer: (taskId: string, timeSpent: number, timerActive: boolean, timerStartedAt?: string) => void;
}

export function TaskList({ tasks, onEdit, onDelete, onToggleComplete, onUpdateTimer }: TaskListProps) {
  const { t } = useLanguage();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400">{t.noTasksAvailable}</p>
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
