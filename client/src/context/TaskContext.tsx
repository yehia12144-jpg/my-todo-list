import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { Task } from "../types";
import { useAuth } from "./AuthContext";
import { createTask, editTask, removeTask, toggleComplete, setTimer } from "../lib/taskHelpers";

interface Ctx {
  tasks: Task[];
  addTask: (data: Omit<Task, "id" | "userId" | "createdAt">) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  updateTimer: (id: string, timeSpent: number, active: boolean, startedAt?: string) => void;
}

const TaskCtx = createContext<Ctx | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [all, setAll] = useState<Task[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("tasks");
    if (raw) setAll(JSON.parse(raw));
  }, []);

  useEffect(() => {
    all.length > 0 ? localStorage.setItem("tasks", JSON.stringify(all)) : localStorage.removeItem("tasks");
  }, [all]);

  // Only the current user's tasks
  const tasks = user ? all.filter((t) => t.userId === user.id) : [];

  function addTask(data: Omit<Task, "id" | "userId" | "createdAt">) {
    if (!user) return;
    setAll((prev) => [createTask(data, user.id), ...prev]);
    toast.success("Task added successfully");
  }

  function updateTask(id: string, patch: Partial<Task>) {
    setAll((prev) => editTask(prev, id, patch));
    toast.success("Task updated successfully");
  }

  function deleteTask(id: string) {
    setAll((prev) => removeTask(prev, id));
    toast.success("Task deleted successfully");
  }

  function handleToggleComplete(id: string) {
    setAll((prev) => toggleComplete(prev, id));
  }

  function updateTimer(id: string, timeSpent: number, active: boolean, startedAt?: string) {
    setAll((prev) => setTimer(prev, id, timeSpent, active, startedAt));
  }

  return (
    <TaskCtx.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleComplete: handleToggleComplete, updateTimer }}>
      {children}
    </TaskCtx.Provider>
  );
}

export function useTasks(): Ctx {
  const ctx = useContext(TaskCtx);
  if (!ctx) throw new Error("useTasks must be inside TaskProvider");
  return ctx;
}
