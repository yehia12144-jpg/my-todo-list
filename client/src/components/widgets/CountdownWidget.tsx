import { useState, useEffect } from "react";
import { Task } from "../../types";
import { Widget } from "../../types/widgets";
import { Calendar, Clock, Target } from "lucide-react";
import { differenceInDays, differenceInHours, differenceInMinutes, format } from "date-fns";
import { useLanguage } from "../../context/LanguageContext";

interface CountdownWidgetProps {
  widget: Widget;
  tasks: Task[];
}

export function CountdownWidget({ widget, tasks }: CountdownWidgetProps) {
  const { t } = useLanguage();
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const task = tasks.find(t => t.id === widget.config.taskId);
  
  if (!task) {
    return (
      <div className="text-center py-8">
        <Target className="w-12 h-12 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Task not found</p>
      </div>
    );
  }
  
  const targetDate = task.dueDate ? new Date(task.dueDate) : task.startDate ? new Date(task.startDate) : null;
  
  if (!targetDate) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No date set for this task
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{task.title}</p>
      </div>
    );
  }
  
  const isPast = targetDate < now;
  const days = Math.abs(differenceInDays(targetDate, now));
  const hours = Math.abs(differenceInHours(targetDate, now)) % 24;
  const minutes = Math.abs(differenceInMinutes(targetDate, now)) % 60;
  
  return (
    <div className="text-center">
      <div className="mb-4">
        <h3 className="font-medium text-lg mb-1">{task.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {task.dueDate ? t.dueDate : t.startDate}: {format(targetDate, "MMM d, yyyy")}
        </p>
      </div>
      
      {task.completed ? (
        <div className="py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 mb-2">
            <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            {t.completed}!
          </p>
        </div>
      ) : (
        <div className="py-4">
          <div className={`grid grid-cols-3 gap-4 ${isPast ? "opacity-60" : ""}`}>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-2xl font-bold">{days}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Days</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-2xl font-bold">{hours}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Hours</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-2xl font-bold">{minutes}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Mins</div>
            </div>
          </div>
          {isPast && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-3 font-medium">
              {t.overdueTasks}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
