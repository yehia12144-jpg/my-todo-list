import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Widget, WidgetType } from "../types/widgets";
import { Task } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { ListTodo, Timer, BarChart3 } from "lucide-react";

interface CreateWidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (widget: Omit<Widget, "id" | "userId" | "createdAt">) => void;
  tasks: Task[];
  categories: string[];
}

export function CreateWidgetDialog({ open, onOpenChange, onCreate, tasks, categories }: CreateWidgetDialogProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2>(1);
  const [widgetType, setWidgetType] = useState<WidgetType>("task-list");
  const [title, setTitle] = useState("");
  
  // Task List Widget Config
  const [filterPriority, setFilterPriority] = useState<"all" | "high" | "medium" | "low">("all");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterCompleted, setFilterCompleted] = useState<"all" | "active" | "completed">("all");
  const [maxTasks, setMaxTasks] = useState<string>("5");
  
  // Countdown Widget Config
  const [taskId, setTaskId] = useState<string>("");
  
  // Analytics Widget Config
  const [chartType, setChartType] = useState<"task-status" | "priority-distribution" | "category-distribution" | "weekly-activity">("task-status");
  
  const handleNext = () => {
    if (step === 1 && widgetType) {
      setStep(2);
    }
  };
  
  const handleBack = () => {
    setStep(1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const baseWidget = {
      type: widgetType,
      title: title || getDefaultTitle(),
      config: {},
    };
    
    if (widgetType === "task-list") {
      baseWidget.config = {
        filterPriority,
        filterCategory: filterCategory || undefined,
        filterCompleted,
        maxTasks: parseInt(maxTasks),
      };
    } else if (widgetType === "countdown") {
      baseWidget.config = {
        taskId,
      };
    } else if (widgetType === "analytics") {
      baseWidget.config = {
        chartType,
      };
    }
    
    onCreate(baseWidget);
    resetForm();
    onOpenChange(false);
  };
  
  const getDefaultTitle = () => {
    if (widgetType === "task-list") return "My Tasks";
    if (widgetType === "countdown") return "Task Countdown";
    if (widgetType === "analytics") return "Analytics";
    return "New Widget";
  };
  
  const resetForm = () => {
    setStep(1);
    setWidgetType("task-list");
    setTitle("");
    setFilterPriority("all");
    setFilterCategory("");
    setFilterCompleted("all");
    setMaxTasks("5");
    setTaskId("");
    setChartType("task-status");
  };
  
  const widgetTypes = [
    {
      type: "task-list" as WidgetType,
      icon: ListTodo,
      name: "Task List",
      description: "Display a filtered list of your tasks",
    },
    {
      type: "countdown" as WidgetType,
      icon: Timer,
      name: "Countdown",
      description: "Countdown to a specific task deadline",
    },
    {
      type: "analytics" as WidgetType,
      icon: BarChart3,
      name: "Analytics",
      description: "Show analytics charts and insights",
    },
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Widget</DialogTitle>
          <DialogDescription>
            {step === 1 ? "Choose a widget type to get started" : "Configure your widget settings"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4 py-4">
              <div className="grid gap-3">
                {widgetTypes.map((widget) => (
                  <button
                    key={widget.type}
                    type="button"
                    onClick={() => setWidgetType(widget.type)}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                      widgetType === widget.type
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      widgetType === widget.type
                        ? "bg-primary text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    }`}>
                      <widget.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{widget.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{widget.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="widget-title">Widget Title</Label>
                <Input
                  id="widget-title"
                  placeholder={getDefaultTitle()}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              {widgetType === "task-list" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="filter-priority">{t.priority}</Label>
                      <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
                        <SelectTrigger id="filter-priority">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t.allPriorities}</SelectItem>
                          <SelectItem value="high">{t.high}</SelectItem>
                          <SelectItem value="medium">{t.medium}</SelectItem>
                          <SelectItem value="low">{t.low}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="filter-status">Status</Label>
                      <Select value={filterCompleted} onValueChange={(value: any) => setFilterCompleted(value)}>
                        <SelectTrigger id="filter-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t.allTasks}</SelectItem>
                          <SelectItem value="active">{t.active}</SelectItem>
                          <SelectItem value="completed">{t.completed}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="filter-category">{t.category}</Label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger id="filter-category">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-tasks">Maximum Tasks to Show</Label>
                    <Input
                      id="max-tasks"
                      type="number"
                      min="1"
                      max="20"
                      value={maxTasks}
                      onChange={(e) => setMaxTasks(e.target.value)}
                    />
                  </div>
                </>
              )}
              
              {widgetType === "countdown" && (
                <div className="space-y-2">
                  <Label htmlFor="task-select">Select Task</Label>
                  <Select value={taskId} onValueChange={setTaskId}>
                    <SelectTrigger id="task-select">
                      <SelectValue placeholder="Choose a task..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tasks.filter(t => !t.completed && (t.dueDate || t.startDate)).map((task) => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Only tasks with a start date or due date are shown
                  </p>
                </div>
              )}
              
              {widgetType === "analytics" && (
                <div className="space-y-2">
                  <Label htmlFor="chart-type">Chart Type</Label>
                  <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                    <SelectTrigger id="chart-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="task-status">{t.taskStatus}</SelectItem>
                      <SelectItem value="priority-distribution">{t.priorityDistribution}</SelectItem>
                      <SelectItem value="category-distribution">{t.tasksByCategory}</SelectItem>
                      <SelectItem value="weekly-activity">{t.weeklyActivity}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            {step === 2 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => {
              resetForm();
              onOpenChange(false);
            }}>
              {t.cancel}
            </Button>
            {step === 1 ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={widgetType === "countdown" && !taskId}>
                Create Widget
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
