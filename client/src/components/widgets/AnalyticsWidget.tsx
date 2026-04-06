import { Task } from "../../types";
import { Widget } from "../../types/widgets";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "../../context/LanguageContext";

interface AnalyticsWidgetProps {
  widget: Widget;
  tasks: Task[];
}

export function AnalyticsWidget({ widget, tasks }: AnalyticsWidgetProps) {
  const { t } = useLanguage();
  const chartType = widget.config.chartType || "task-status";
  
  const COLORS = {
    completed: "#10b981",
    active: "#3b82f6",
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#10b981",
  };
  
  if (chartType === "task-status") {
    const data = [
      { name: t.completed, value: tasks.filter(t => t.completed).length, color: COLORS.completed },
      { name: t.active, value: tasks.filter(t => !t.completed).length, color: COLORS.active },
    ];
    
    return (
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (chartType === "priority-distribution") {
    const data = [
      { name: t.high, value: tasks.filter(t => t.priority === "high").length, color: COLORS.high },
      { name: t.medium, value: tasks.filter(t => t.priority === "medium").length, color: COLORS.medium },
      { name: t.low, value: tasks.filter(t => t.priority === "low").length, color: COLORS.low },
    ];
    
    return (
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  if (chartType === "category-distribution") {
    const categories = Array.from(new Set(tasks.map(t => t.category)));
    const data = categories.map((cat, index) => ({
      name: cat,
      value: tasks.filter(t => t.category === cat).length,
      color: `hsl(${(index * 360) / categories.length}, 70%, 50%)`,
    }));
    
    return (
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  if (chartType === "weekly-activity") {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    
    const data = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        value: tasks.filter(t => t.createdAt.startsWith(dateStr)).length,
      };
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
