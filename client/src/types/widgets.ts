export type WidgetType = "task-list" | "countdown" | "analytics";

export interface WidgetConfig {
  filterPriority?: "all" | "high" | "medium" | "low";
  filterCategory?: string;
  filterCompleted?: "all" | "active" | "completed";
  maxTasks?: number;
  taskId?: string;
  chartType?: "task-status" | "priority-distribution" | "category-distribution" | "weekly-activity";
}

export interface Widget {
  id: string;
  userId: string;
  type: WidgetType;
  title: string;
  createdAt: string;
  config: WidgetConfig;
}
