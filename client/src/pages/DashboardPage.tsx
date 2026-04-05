import { useState } from "react";
import { Crown, Layout, Plus, Search, BarChart3, CheckCircle2 } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Toaster } from "../components/ui/sonner";

import { TaskList } from "../components/task/TaskList";
import { AddTaskDialog } from "../components/task/AddTaskDialog";
import { EditTaskDialog } from "../components/task/EditTaskDialog";
import { ProfileDialog } from "../components/task/ProfileDialog";
import { WidgetCard } from "../components/widget/WidgetCard";
import { CreateWidgetDialog } from "../components/widget/CreateWidgetDialog";
import { ThemeToggle } from "../components/layout/ThemeToggle";
import { LanguageSelector } from "../components/layout/LanguageSelector";

import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";
import { useWidgets } from "../context/WidgetContext";
import { filterTasks, uniqueCategories } from "../lib/taskHelpers";
import type { Task } from "../types";

// Lazy import Analytics and PremiumUpgrade to keep initial bundle smaller
import { Analytics } from "../components/task/Analytics";
import { PremiumUpgrade } from "../components/task/PremiumUpgrade";

type View = "tasks" | "analytics" | "widgets";

export default function DashboardPage() {
  const { user, updateProfile, logout } = useAuth();
  const { tasks, addTask, updateTask, deleteTask, toggleComplete, updateTimer } = useTasks();
  const { widgets, addWidget, deleteWidget } = useWidgets();

  // UI state — local only, no context needed
  const [activeView, setActiveView]   = useState<View>("tasks");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [activeTab, setActiveTab]     = useState("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAddOpen, setIsAddOpen]     = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (!user) return null;

  const categories   = uniqueCategories(tasks);
  const filteredTasks = filterTasks(tasks, { search: searchQuery, priority: filterPriority, category: filterCategory, tab: activeTab });

  function handleUpgrade() { updateProfile({ isPremium: true }); }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl">TaskFlow</h1>
                {user.isPremium && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">
                    <Crown className="w-3 h-3 mr-1" />PRO
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Welcome, {user.name}</p>
            </div>
          </div>

          {/* Nav + actions */}
          <div className="flex items-center gap-2">
            <Button variant={activeView === "tasks" ? "default" : "outline"} onClick={() => setActiveView("tasks")} className="gap-2">
              <CheckCircle2 className="w-4 h-4" /> Tasks
            </Button>
            <Button variant={activeView === "analytics" ? "default" : "outline"} onClick={() => setActiveView("analytics")} className="gap-2 relative">
              <BarChart3 className="w-4 h-4" /> Analytics
              {!user.isPremium && <Crown className="w-3 h-3 text-amber-500 absolute -top-1 -right-1" />}
            </Button>
            <Button variant={activeView === "widgets" ? "default" : "outline"} onClick={() => setActiveView("widgets")} className="gap-2 relative">
              <Layout className="w-4 h-4" /> Widgets
              {!user.isPremium && <Crown className="w-3 h-3 text-amber-500 absolute -top-1 -right-1" />}
            </Button>
            {!user.isPremium && (
              <Button onClick={handleUpgrade} className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                <Crown className="w-4 h-4" /> Upgrade
              </Button>
            )}
            <LanguageSelector />
            <ThemeToggle />
            <Button variant="outline" size="icon" onClick={() => setIsProfileOpen(true)}>
              <span className="text-sm font-medium">{user.name[0].toUpperCase()}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Premium banner */}
        {!user.isPremium && activeView === "tasks" && (
          <div className="mb-6">
            <PremiumUpgrade onUpgrade={handleUpgrade} inline />
          </div>
        )}

        {/* ── Tasks view ─────────────────────────────────────────────────── */}
        {activeView === "tasks" && (
          <>
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input type="search" placeholder="Search tasks by keyword..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={() => setIsAddOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" /> Add Task
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>

            <TaskList
              tasks={filteredTasks}
              onEdit={setEditingTask}
              onDelete={deleteTask}
              onToggleComplete={toggleComplete}
              onUpdateTimer={updateTimer}
            />
          </>
        )}

        {/* ── Analytics view ─────────────────────────────────────────────── */}
        {activeView === "analytics" && (
          <Analytics tasks={tasks} isPremium={user.isPremium} onUpgrade={handleUpgrade} />
        )}

        {/* ── Widgets view ───────────────────────────────────────────────── */}
        {activeView === "widgets" && (
          user.isPremium ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">My Widgets</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Customize your dashboard with personalized widgets</p>
                </div>
                <Button onClick={() => setIsWidgetOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" /> Create Widget
                </Button>
              </div>
              {widgets.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800">
                  <Layout className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Widgets Yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">Create your first widget to customize your dashboard.</p>
                  <Button onClick={() => setIsWidgetOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> Create Your First Widget</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {widgets.map((w) => (
                    <WidgetCard key={w.id} widget={w} tasks={tasks} onDelete={deleteWidget} onToggleComplete={toggleComplete} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <PremiumUpgrade onUpgrade={handleUpgrade} />
          )
        )}
      </main>

      {/* ── Dialogs ────────────────────────────────────────────────────────── */}
      <AddTaskDialog open={isAddOpen} onOpenChange={setIsAddOpen} onAdd={addTask} existingCategories={categories} />

      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          open={!!editingTask}
          onOpenChange={(o) => { if (!o) setEditingTask(null); }}
          onEdit={updateTask}
          existingCategories={categories}
        />
      )}

      <ProfileDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} />

      <CreateWidgetDialog open={isWidgetOpen} onOpenChange={setIsWidgetOpen} onCreate={addWidget} tasks={tasks} categories={categories} />
    </div>
  );
}
