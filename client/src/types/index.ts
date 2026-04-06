import type { Language } from "../i18n/translations";

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  createdAt: string;
  accountStatus?: string;
  themeMode?: string;
  isPremium?: boolean;
  language?: Language;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: string;
  startDate?: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  estimatedTime?: number;  // minutes
  timeSpent?: number;      // seconds
  timerActive?: boolean;
  timerStartedAt?: string;
}
