import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { Widget } from "../types/widgets";
import { useAuth } from "./AuthContext";
import { createWidget, removeWidget } from "../lib/widgetHelpers";

interface Ctx {
  widgets: Widget[];
  addWidget: (data: Omit<Widget, "id" | "userId" | "createdAt">) => void;
  deleteWidget: (id: string) => void;
}

const WidgetCtx = createContext<Ctx | undefined>(undefined);

export function WidgetProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [all, setAll] = useState<Widget[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("widgets");
    if (raw) setAll(JSON.parse(raw));
  }, []);

  useEffect(() => {
    all.length > 0 ? localStorage.setItem("widgets", JSON.stringify(all)) : localStorage.removeItem("widgets");
  }, [all]);

  const widgets = user ? all.filter((w) => w.userId === user.id) : [];

  function addWidget(data: Omit<Widget, "id" | "userId" | "createdAt">) {
    if (!user) return;
    setAll((prev) => [createWidget(data, user.id), ...prev]);
    toast.success("Widget created successfully");
  }

  function deleteWidget(id: string) {
    setAll((prev) => removeWidget(prev, id));
    toast.success("Widget deleted successfully");
  }

  return <WidgetCtx.Provider value={{ widgets, addWidget, deleteWidget }}>{children}</WidgetCtx.Provider>;
}

export function useWidgets(): Ctx {
  const ctx = useContext(WidgetCtx);
  if (!ctx) throw new Error("useWidgets must be inside WidgetProvider");
  return ctx;
}
