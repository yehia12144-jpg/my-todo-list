import type { Task } from "../types";

export const createTask = (data: Omit<Task, "id" | "userId" | "createdAt">, userId: string): Task => ({
  ...data, id: crypto.randomUUID(), userId, createdAt: new Date().toISOString(),
});

export const editTask = (tasks: Task[], id: string, patch: Partial<Task>): Task[] =>
  tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));

export const removeTask = (tasks: Task[], id: string): Task[] =>
  tasks.filter((t) => t.id !== id);

export const toggleComplete = (tasks: Task[], id: string): Task[] =>
  tasks.map((t) => {
    if (t.id !== id) return t;
    const extra = t.timerActive && t.timerStartedAt
      ? Math.floor((Date.now() - new Date(t.timerStartedAt).getTime()) / 1000)
      : 0;
    return { ...t, completed: !t.completed, timerActive: false, timerStartedAt: undefined, timeSpent: (t.timeSpent ?? 0) + extra };
  });

export const setTimer = (tasks: Task[], id: string, timeSpent: number, timerActive: boolean, timerStartedAt?: string): Task[] =>
  tasks.map((t) => (t.id === id ? { ...t, timeSpent, timerActive, timerStartedAt } : t));

export const filterTasks = (tasks: Task[], opts: { search: string; priority: string; category: string; tab: string }): Task[] => {
  const q = opts.search.toLowerCase();
  return tasks.filter((t) => {
    if (q && !t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
    if (opts.priority !== "all" && t.priority !== opts.priority) return false;
    if (opts.category !== "all" && t.category !== opts.category) return false;
    if (opts.tab === "active" && t.completed) return false;
    if (opts.tab === "completed" && !t.completed) return false;
    return true;
  });
};

export const uniqueCategories = (tasks: Task[]): string[] =>
  [...new Set(tasks.map((t) => t.category))];
