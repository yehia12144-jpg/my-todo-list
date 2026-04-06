import { Task } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from "recharts";
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, isWithinInterval, subWeeks } from "date-fns";
import { PremiumUpgrade } from "./PremiumUpgrade";
import { useLanguage } from "../context/LanguageContext"; // ✅ added

interface AnalyticsProps {
  tasks: Task[];
  isPremium?: boolean;
  onUpgrade?: () => void;
}

export function Analytics({ tasks, isPremium = false, onUpgrade }: AnalyticsProps) {
  const { t } = useLanguage(); // ✅ added

  if (!isPremium) {
    return <PremiumUpgrade onUpgrade={onUpgrade} />;
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = tasks.filter(t => !t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const highPriorityTasks = tasks.filter(t => t.priority === "high" && !t.completed).length;
  const mediumPriorityTasks = tasks.filter(t => t.priority === "medium" && !t.completed).length;
  const lowPriorityTasks = tasks.filter(t => t.priority === "low" && !t.completed).length;

  const categoryData = Array.from(
    tasks.reduce((acc, task) => {
      acc.set(task.category, (acc.get(task.category) || 0) + 1);
      return acc;
    }, new Map<string, number>())
  ).map(([name, value]) => ({ name, value }));

  const priorityData = [
    { name: t.high, value: tasks.filter(t => t.priority === "high").length, color: "#ef4444" },
    { name: t.medium, value: tasks.filter(t => t.priority === "medium").length, color: "#eab308" },
    { name: t.low, value: tasks.filter(t => t.priority === "low").length, color: "#22c55e" },
  ].filter(item => item.value > 0);

  const statusData = [
    { name: t.completed, value: completedTasks, color: "#22c55e" },
    { name: t.active, value: activeTasks, color: "#3b82f6" },
  ].filter(item => item.value > 0);

  const now = new Date();
  const tasksDueSoon = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false;
    const dueDate = parseISO(t.dueDate);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });

  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false;
    const dueDate = parseISO(t.dueDate);
    return dueDate < now;
  });

  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weeklyActivityData = daysInWeek.map(day => {
    const tasksOnDay = tasks.filter(t => {
      const taskDate = parseISO(t.createdAt);
      return format(taskDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
    }).length;
    return { day: format(day, "EEE"), tasks: tasksOnDay };
  });

  const last4Weeks = Array.from({ length: 4 }, (_, i) => {
    const weekStart = startOfWeek(subWeeks(now, 3 - i));
    const weekEnd = endOfWeek(subWeeks(now, 3 - i));
    const tasksInWeek = tasks.filter(t => {
      const taskDate = parseISO(t.createdAt);
      return isWithinInterval(taskDate, { start: weekStart, end: weekEnd });
    }).length;
    const completedInWeek = tasks.filter(t => {
      const taskDate = parseISO(t.createdAt);
      return t.completed && isWithinInterval(taskDate, { start: weekStart, end: weekEnd });
    }).length;
    return { week: `Week ${i + 1}`, created: tasksInWeek, completed: completedInWeek };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">{t.analyticsTitle}</h2>
        <p className="text-gray-600 dark:text-gray-400">{t.analyticsSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{t.totalTasks}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">{t.allTasksCreated}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{t.completedTasks}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">{completionRate}% {t.completionRate}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{t.activeTasks}</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{activeTasks}</div>
            <p className="text-xs text-muted-foreground">{t.tasksInProgress}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{t.overdueTasks}</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{overdueTasks.length}</div>
            <p className="text-xs text-muted-foreground">{t.needsAttention}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.taskStatus}</CardTitle>
            <CardDescription>{t.taskStatusDescription}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">{t.noTasksAvailable}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.priorityDistribution}</CardTitle>
            <CardDescription>{t.priorityDistributionDescription}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={priorityData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {priorityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">{t.noTasksAvailable}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.tasksByCategory}</CardTitle>
            <CardDescription>{t.tasksByCategoryDescription}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">{t.noTasksAvailable}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.weeklyActivity}</CardTitle>
            <CardDescription>{t.weeklyActivityDescription}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivityData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.fourWeekTrend}</CardTitle>
          <CardDescription>{t.fourWeekTrendDescription}</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last4Weeks}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2} name={t.addTask} />
              <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} name={t.completedTasks} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.activeTasksByPriority}</CardTitle>
            <CardDescription>{t.activeTasksBreakdown}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>{t.high}</span>
              </div>
              <Badge variant="destructive">{highPriorityTasks}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>{t.medium}</span>
              </div>
              <Badge variant="secondary">{mediumPriorityTasks}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>{t.low}</span>
              </div>
              <Badge variant="outline">{lowPriorityTasks}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.upcomingDeadlines}</CardTitle>
            <CardDescription>{t.upcomingDeadlinesDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            {tasksDueSoon.length > 0 ? (
              <div className="space-y-3">
                {tasksDueSoon.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-start justify-between gap-2 pb-3 border-b dark:border-gray-800 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{task.title}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mt-1">
                        <CalendarIcon className="w-3 h-3" />
                        {task.dueDate && format(parseISO(task.dueDate), "MMM d, yyyy")}
                      </div>
                    </div>
                    <Badge variant="outline" className={
                      task.priority === "high" ? "border-red-300 text-red-700 dark:border-red-800 dark:text-red-300"
                      : task.priority === "medium" ? "border-yellow-300 text-yellow-700 dark:border-yellow-800 dark:text-yellow-300"
                      : "border-green-300 text-green-700 dark:border-green-800 dark:text-green-300"
                    }>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>{t.noUpcomingDeadlines}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}