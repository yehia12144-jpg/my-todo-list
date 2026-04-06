import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "../../context/LanguageContext";
import type { Task } from "../../types";
import type { Widget } from "../../types/widgets";

const COLORS = { completed: "#10b981", active: "#3b82f6", high: "#ef4444", medium: "#f59e0b", low: "#10b981" };

interface Props { widget: Widget; tasks: Task[] }

export function AnalyticsWidget({ widget, tasks }: Props) {
  const { t } = useLanguage();
  const chartType = widget.config.chartType ?? "task-status";

  if (chartType === "task-status") {
    const data = [
      { name: t.completed, value: tasks.filter((t) => t.completed).length, color: COLORS.completed },
      { name: t.active, value: tasks.filter((t) => !t.completed).length, color: COLORS.active },
    ];
    return (
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
              {data.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-2">
          {data.map((e) => (
            <div key={e.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }} />
              <span className="text-xs text-gray-600 dark:text-gray-400">{e.name}: {e.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (chartType === "priority-distribution") {
    const data = [
      { name: t.high, value: tasks.filter((t) => t.priority === "high").length, color: COLORS.high },
      { name: t.medium, value: tasks.filter((t) => t.priority === "medium").length, color: COLORS.medium },
      { name: t.low, value: tasks.filter((t) => t.priority === "low").length, color: COLORS.low },
    ];
    return (
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chartType === "category-distribution") {
    const cats = [...new Set(tasks.map((t) => t.category))];
    const data = cats.map((cat, i) => ({
      name: cat,
      value: tasks.filter((t) => t.category === cat).length,
      color: `hsl(${(i * 360) / cats.length}, 70%, 50%)`,
    }));
    return (
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={70} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
              {data.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chartType === "weekly-activity") {
    const now = new Date();
    const weekStart = new Date(now); weekStart.setDate(now.getDate() - 6);
    const data = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart); date.setDate(weekStart.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      return { name: date.toLocaleDateString("en-US", { weekday: "short" }), value: tasks.filter((t) => t.createdAt.startsWith(dateStr)).length };
    });
    return (
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
