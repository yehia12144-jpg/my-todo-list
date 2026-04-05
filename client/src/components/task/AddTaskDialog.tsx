import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useLanguage } from "../../context/LanguageContext";
import type { Task } from "../../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (task: Omit<Task, "id" | "userId" | "createdAt">) => void;
  existingCategories: string[];
}

const EMPTY = { title: "", description: "", priority: "medium" as Task["priority"], category: "", startDate: "", dueDate: "", estimatedTime: "" };

export function AddTaskDialog({ open, onOpenChange, onAdd, existingCategories }: Props) {
  const { t } = useLanguage();
  const [fields, setFields] = useState(EMPTY);
  const [useCustomCategory, setUseCustomCategory] = useState(false);

  function set<K extends keyof typeof EMPTY>(key: K, val: string) {
    setFields((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields.title.trim()) return;
    onAdd({
      title: fields.title.trim(),
      description: fields.description.trim(),
      priority: fields.priority,
      category: fields.category.trim() || "General",
      startDate: fields.startDate || undefined,
      dueDate: fields.dueDate || undefined,
      estimatedTime: fields.estimatedTime ? parseInt(fields.estimatedTime) : undefined,
      completed: false,
      timeSpent: 0,
      timerActive: false,
    });
    setFields(EMPTY);
    setUseCustomCategory(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.addTaskTitle}</DialogTitle>
          <DialogDescription>{t.addTaskDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t.taskTitle} *</Label>
              <Input id="title" placeholder={t.taskTitlePlaceholder} value={fields.title} onChange={(e) => set("title", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t.description}</Label>
              <Textarea id="description" placeholder={t.descriptionPlaceholder} value={fields.description} onChange={(e) => set("description", e.target.value)} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.priority}</Label>
                <Select value={fields.priority} onValueChange={(v) => set("priority", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t.low}</SelectItem>
                    <SelectItem value="medium">{t.medium}</SelectItem>
                    <SelectItem value="high">{t.high}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedTime">{t.estimatedTime} ({t.minutes})</Label>
                <Input id="estimatedTime" type="number" min="1" placeholder={t.estimatedTimePlaceholder} value={fields.estimatedTime} onChange={(e) => set("estimatedTime", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.category}</Label>
              {!useCustomCategory && existingCategories.length > 0 ? (
                <div className="space-y-2">
                  <Select value={fields.category} onValueChange={(v) => set("category", v)}>
                    <SelectTrigger><SelectValue placeholder={t.selectCategory} /></SelectTrigger>
                    <SelectContent>
                      {existingCategories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="link" size="sm" className="px-0" onClick={() => setUseCustomCategory(true)}>
                    + {t.createCategory}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input placeholder={t.newCategoryPlaceholder} value={fields.category} onChange={(e) => set("category", e.target.value)} />
                  {existingCategories.length > 0 && (
                    <Button type="button" variant="link" size="sm" className="px-0" onClick={() => setUseCustomCategory(false)}>
                      {t.selectCategory}
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">{t.startDate}</Label>
                <Input id="startDate" type="date" value={fields.startDate} onChange={(e) => set("startDate", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">{t.dueDate}</Label>
                <Input id="dueDate" type="date" value={fields.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t.cancel}</Button>
            <Button type="submit">{t.create}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
