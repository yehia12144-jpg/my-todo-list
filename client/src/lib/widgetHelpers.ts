import type { Widget } from "../types/widgets";

export const createWidget = (data: Omit<Widget, "id" | "userId" | "createdAt">, userId: string): Widget => ({
  ...data, id: crypto.randomUUID(), userId, createdAt: new Date().toISOString(),
});

export const removeWidget = (widgets: Widget[], id: string): Widget[] =>
  widgets.filter((w) => w.id !== id);
