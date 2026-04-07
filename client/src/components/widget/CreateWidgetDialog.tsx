import { useState } from "react";
import { ListTodo, Timer, BarChart3 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Task } from "../../types";
import type { Widget, WidgetType } from "../../types/widgets";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (widget: Omit<Widget, "id" | "userId" | "createdAt">) => void;
  tasks: Task[];
  categories: string[];
}

const WIDGET_TYPES: { type: WidgetType; label: string; desc: string; icon: React.ReactNode }[] = [
  { type: "task-list", label: "Task List",  desc: "Show a filtered list of tasks",  icon: <ListTodo className="w-6 h-6" /> },
  { type: "countdown", label: "Countdown",  desc: "Countdown to a task's due date", icon: <Timer className="w-6 h-6" /> },
  { type: "analytics", label: "Analytics",  desc: "Visualize your task statistics",  icon: <BarChart3 className="w-6 h-6" /> },
];

const DEFAULT_TITLES: Record<WidgetType, string> = {
  "task-list": "My Tasks",
  "countdown": "Task Countdown",
  "analytics": "Analytics",
};

export function CreateWidgetDialog({ open, onOpenChange, onCreate, tasks, categories }: Props) {
  const [step, setStep]             = useState<1 | 2>(1);
  const [widgetType, setWidgetType] = useState<WidgetType>("task-list");
  const [title, setTitle]           = useState("");
  const [filterPriority, setFilterPriority]   = useState<"all" | "high" | "medium" | "low">("all");
  // ✅ FIX: use "all" instead of "" to avoid Radix UI empty string error
  const [filterCategory, setFilterCategory]   = useState("all");
  const [filterCompleted, setFilterCompleted] = useState<"all" | "active" | "completed">("all");
  const [maxTasks, setMaxTasks]     = useState("5");
  const [taskId, setTaskId]         = useState("");
  const [chartType, setChartType]   = useState<"task-status" | "priority-distribution" | "category-distribution" | "weekly-activity">("task-status");

  function reset() {
    setStep(1); setWidgetType("task-list"); setTitle("");
    setFilterPriority("all"); setFilterCategory("all"); setFilterCompleted("all"); setMaxTasks("5");
    setTaskId(""); setChartType("task-status");
  }

  function handleNext(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setStep(2);
  }

  function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const config =
      widgetType === "task-list" ? {
        filterPriority,
        // ✅ FIX: convert "all" back to undefined so the filter is ignored
        filterCategory: filterCategory === "all" ? undefined : filterCategory,
        filterCompleted,
        maxTasks: parseInt(maxTasks)
      } :
      widgetType === "countdown" ? { taskId } :
      { chartType };
    onCreate({ type: widgetType, title: title || DEFAULT_TITLES[widgetType], config });
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Widget</DialogTitle>
          <DialogDescription>{step === 1 ? "Select a widget type" : "Configure your widget"}</DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-3 py-4">
            {WIDGET_TYPES.map(({ type, label, desc, icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => setWidgetType(type)}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-colors ${
                  widgetType === type
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className={`p-2 rounded-lg ${widgetType === type ? "bg-blue-100 dark:bg-blue-900 text-blue-600" : "bg-gray-100 dark:bg-gray-800 text-gray-600"}`}>
                  {icon}
                </div>
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="widget-title">Widget Title</Label>
              <Input id="widget-title" placeholder={DEFAULT_TITLES[widgetType]} value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            {widgetType === "task-list" && (
              <>
                <div className="space-y-2">
                  <Label>Filter by Priority</Label>
                  <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as typeof filterPriority)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {categories.length > 0 && (
                  <div className="space-y-2">
                    <Label>Filter by Category</Label>
                    {/* ✅ FIX: value="all" instead of value="" */}
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Filter by Status</Label>
                  <Select value={filterCompleted} onValueChange={(v) => setFilterCompleted(v as typeof filterCompleted)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tasks</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-tasks">Max Tasks to Show</Label>
                  <Input id="max-tasks" type="number" min="1" max="20" value={maxTasks} onChange={(e) => setMaxTasks(e.target.value)} />
                </div>
              </>
            )}

            {widgetType === "countdown" && (
              <div className="space-y-2">
                <Label>Select Task</Label>
                {tasks.length === 0 ? (
                  <p className="text-sm text-gray-500">No tasks found. Create a task first.</p>
                ) : (
                  <Select value={taskId} onValueChange={setTaskId}>
                    <SelectTrigger><SelectValue placeholder="Select a task..." /></SelectTrigger>
                    <SelectContent>
                      {tasks.map((task) => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {widgetType === "analytics" && (
              <div className="space-y-2">
                <Label>Chart Type</Label>
                <Select value={chartType} onValueChange={(v) => setChartType(v as typeof chartType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task-status">Task Status</SelectItem>
                    <SelectItem value="priority-distribution">Priority Distribution</SelectItem>
                    <SelectItem value="category-distribution">Category Distribution</SelectItem>
                    <SelectItem value="weekly-activity">Weekly Activity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {step === 2 && <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>}
          <Button type="button" variant="outline" onClick={() => { reset(); onOpenChange(false); }}>Cancel</Button>
          {step === 1
            ? <Button type="button" onClick={handleNext}>Next</Button>
            : <Button type="button" onClick={handleSubmit}>Create</Button>
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
