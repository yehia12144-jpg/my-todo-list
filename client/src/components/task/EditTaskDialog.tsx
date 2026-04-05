import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useLanguage } from "../../context/LanguageContext";
import type { Task } from "../../types";

interface Props {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (id: string, patch: Partial<Task>) => void;
  existingCategories: string[];
}

export function EditTaskDialog({ task, open, onOpenChange, onEdit, existingCategories }: Props) {
  const { t } = useLanguage();
  const [title, setTitle]               = useState(task.title);
  const [description, setDescription]   = useState(task.description);
  const [priority, setPriority]         = useState(task.priority);
  const [category, setCategory]         = useState(task.category);
  const [startDate, setStartDate]       = useState(task.startDate ?? "");
  const [dueDate, setDueDate]           = useState(task.dueDate ?? "");
  const [estimatedTime, setEstimatedTime] = useState(task.estimatedTime?.toString() ?? "");
  const [useCustomCategory, setUseCustomCategory] = useState(false);

  // Sync when task prop changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setCategory(task.category);
    setStartDate(task.startDate ?? "");
    setDueDate(task.dueDate ?? "");
    setEstimatedTime(task.estimatedTime?.toString() ?? "");
  }, [task]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onEdit(task.id, {
      title: title.trim(),
      description: description.trim(),
      priority,
      category: category.trim(),
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
      estimatedTime: estimatedTime ? parseInt(estimatedTime) : undefined,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.editTaskTitle}</DialogTitle>
          <DialogDescription>{t.editTaskDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">{t.taskTitle} *</Label>
              <Input id="edit-title" placeholder={t.taskTitlePlaceholder} value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">{t.description}</Label>
              <Textarea id="edit-description" placeholder={t.descriptionPlaceholder} value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.priority}</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Task["priority"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t.low}</SelectItem>
                    <SelectItem value="medium">{t.medium}</SelectItem>
                    <SelectItem value="high">{t.high}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-estimatedTime">{t.estimatedTime} ({t.minutes})</Label>
                <Input id="edit-estimatedTime" type="number" min="1" placeholder={t.estimatedTimePlaceholder} value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.category}</Label>
              {!useCustomCategory && existingCategories.length > 0 ? (
                <div className="space-y-2">
                  <Select value={category} onValueChange={setCategory}>
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
                  <Input placeholder={t.newCategoryPlaceholder} value={category} onChange={(e) => setCategory(e.target.value)} />
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
                <Label htmlFor="edit-startDate">{t.startDate}</Label>
                <Input id="edit-startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dueDate">{t.dueDate}</Label>
                <Input id="edit-dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t.cancel}</Button>
            <Button type="submit">{t.save}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
