import { Task } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from "recharts";
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, isWithinInterval, subWeeks } from "date-fns";
import { PremiumUpgrade } from "./PremiumUpgrade";

interface AnalyticsProps {
  tasks: Task[];
  isPremium?: boolean;
  onUpgrade?: () => void;
}

export function Analytics({ tasks, isPremium = false, onUpgrade }: AnalyticsProps) {
  // Show premium upgrade if user is not premium
  if (!isPremium) {
    return <PremiumUpgrade onUpgrade={onUpgrade} />;
  }

  // Basic Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = tasks.filter(t => !t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Tasks by Priority
  const highPriorityTasks = tasks.filter(t => t.priority === "high" && !t.completed).length;
  const mediumPriorityTasks = tasks.filter(t => t.priority === "medium" && !t.completed).length;
  const lowPriorityTasks = tasks.filter(t => t.priority === "low" && !t.completed).length;

  // Tasks by Category
  const categoryData = Array.from(
    tasks.reduce((acc, task) => {
      acc.set(task.category, (acc.get(task.category) || 0) + 1);
      return acc;
    }, new Map<string, number>())
  ).map(([name, value]) => ({ name, value }));

  // Priority Distribution Data for Pie Chart
  const priorityData = [
    { name: "High", value: tasks.filter(t => t.priority === "high").length, color: "#ef4444" },
    { name: "Medium", value: tasks.filter(t => t.priority === "medium").length, color: "#eab308" },
    { name: "Low", value: tasks.filter(t => t.priority === "low").length, color: "#22c55e" },
  ].filter(item => item.value > 0);

  // Completion Status Data for Pie Chart
  const statusData = [
    { name: "Completed", value: completedTasks, color: "#22c55e" },
    { name: "Active", value: activeTasks, color: "#3b82f6" },
  ].filter(item => item.value > 0);

  // Tasks Due Soon (next 7 days)
  const now = new Date();
  const tasksDueSoon = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false;
    const dueDate = parseISO(t.dueDate);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });

  // Overdue Tasks
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false;
    const dueDate = parseISO(t.dueDate);
    return dueDate < now;
  });

  // Weekly Activity - Tasks created per day for the last 7 days
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const weeklyActivityData = daysInWeek.map(day => {
    const tasksOnDay = tasks.filter(t => {
      const taskDate = parseISO(t.createdAt);
      return format(taskDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
    }).length;

    return {
      day: format(day, "EEE"),
      tasks: tasksOnDay,
    };
  });

  // Last 4 Weeks Trend
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

    return {
      week: `Week ${i + 1}`,
      created: tasksInWeek,
      completed: completedInWeek,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">Track your productivity and task completion metrics</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">All tasks created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">{completionRate}% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{activeTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{overdueTasks.length}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
            <CardDescription>Distribution of completed vs active tasks</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No tasks available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>Tasks breakdown by priority level</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No tasks available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Category</CardTitle>
            <CardDescription>Task distribution across categories</CardDescription>
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
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No tasks available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>This Week's Activity</CardTitle>
            <CardDescription>Tasks created each day this week</CardDescription>
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

      {/* 4 Week Trend */}
      <Card>
        <CardHeader>
          <CardTitle>4-Week Trend</CardTitle>
          <CardDescription>Task creation and completion over the last 4 weeks</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last4Weeks}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2} name="Created" />
              <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} name="Completed" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Priority Breakdown & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Tasks by Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Active Tasks by Priority</CardTitle>
            <CardDescription>Current workload breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>High Priority</span>
              </div>
              <Badge variant="destructive">{highPriorityTasks}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Medium Priority</span>
              </div>
              <Badge variant="secondary">{mediumPriorityTasks}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Low Priority</span>
              </div>
              <Badge variant="outline">{lowPriorityTasks}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Tasks due in the next 7 days</CardDescription>
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
                    <Badge
                      variant="outline"
                      className={
                        task.priority === "high"
                          ? "border-red-300 text-red-700 dark:border-red-800 dark:text-red-300"
                          : task.priority === "medium"
                          ? "border-yellow-300 text-yellow-700 dark:border-yellow-800 dark:text-yellow-300"
                          : "border-green-300 text-green-700 dark:border-green-800 dark:text-green-300"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No upcoming deadlines</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}