from django.shortcuts import render

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Category, Task, Subtask, Reminder, Analytics
from .serializers import (
    CategorySerializer,
    TaskSerializer,
    TaskCompleteSerializer,
    SubtaskSerializer,
    ReminderSerializer,
    AnalyticsSerializer,
)


# ───────────────────────────────────────────────
# Category views
# ───────────────────────────────────────────────

class CategoryListCreateView(generics.ListCreateAPIView):
    """
    GET  /categories/       → list all categories for the logged-in user
    POST /categories/       → create a new category
    """
    serializer_class = CategorySerializer#uses CategorySerializer
    permission_classes = [permissions.IsAuthenticated]#only logged-in users have access to this

    def get_queryset(self):#returns logged-in user's categories and not someone elses
        return Category.objects.filter(user=self.request.user)


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):#handles get, put, patch, delete, automatically
    """
    GET    /categories/<id>/  → retrieve a category
    PUT    /categories/<id>/  → update a category
    PATCH  /categories/<id>/  → partial update
    DELETE /categories/<id>/  → delete a category
    """
    serializer_class = CategorySerializer#uses Category serializer
    permission_classes = [permissions.IsAuthenticated]#only logged-in users have acces

    def get_queryset(self):#returns the category that belongs to the logged-in user and not someone else
        return Category.objects.filter(user=self.request.user)


# ───────────────────────────────────────────────
# Task views
# ───────────────────────────────────────────────

class TaskListCreateView(generics.ListCreateAPIView):
    """
    GET  /tasks/   → list all tasks for the logged-in user
    POST /tasks/   → create a new task
    
    Optional query params:
      ?status=pending|in_progress|completed
      ?priority_level=low|medium|high
      ?category=<id>
    """
    serializer_class = TaskSerializer#uses task serliazer
    permission_classes = [permissions.IsAuthenticated]#only logged-in users have permission to access this

    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user).order_by('-created_at')#gets all the tasks that belong to the user

        status_param = self.request.query_params.get('status')
        priority = self.request.query_params.get('priority_level')
        category = self.request.query_params.get('category')#in charge of filters from the front-end

        if status_param:
            queryset = queryset.filter(status=status_param)
        if priority:
            queryset = queryset.filter(priority_level=priority)
        if category:
            queryset = queryset.filter(category__id=category)

        return queryset #returns the final queryset


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):#handles get, put, patch, and delete automatically
    """
    GET    /tasks/<id>/  → retrieve a task (includes subtasks & reminders)
    PUT    /tasks/<id>/  → full update
    PATCH  /tasks/<id>/  → partial update
    DELETE /tasks/<id>/  → delete a task
    """
    serializer_class = TaskSerializer#uses task serializer
    permission_classes = [permissions.IsAuthenticated]#only logged-in users have permission

    def get_queryset(self):#returns the tasks that belong to the logged-in user
        return Task.objects.filter(user=self.request.user)


class TaskCompleteView(generics.UpdateAPIView):#updates automatically
    """
    PATCH /tasks/<id>/complete/  → mark a task as complete/incomplete
    Body: { "status": "completed" | "pending" | "in_progress" }
    """
    serializer_class = TaskCompleteSerializer#uses taskcomplete serializer
    permission_classes = [permissions.IsAuthenticated]#only logged in users have access

    def get_queryset(self):#returns logged-in user's tasks
        return Task.objects.filter(user=self.request.user)


# ───────────────────────────────────────────────
# Subtask views
# ───────────────────────────────────────────────

class SubtaskListCreateView(generics.ListCreateAPIView):
    """
    GET  /tasks/<task_id>/subtasks/  → list subtasks for a task
    POST /tasks/<task_id>/subtasks/  → create a subtask
    """
    serializer_class = SubtaskSerializer#uses subtask serlializer
    permission_classes = [permissions.IsAuthenticated]#only logged-in users have access

    def get_task(self):#finds a specific task that belongs to a user if not then error 404
        return get_object_or_404(Task, id=self.kwargs['task_id'], user=self.request.user)

    def get_queryset(self):#returns the subtasks that belong to a logged-in user
        return Subtask.objects.filter(task=self.get_task())

    def perform_create(self, serializer):#automatically link subtask to task
        serializer.save(task=self.get_task())


class SubtaskDetailView(generics.RetrieveUpdateDestroyAPIView):#handles get, put, patch, delete
    """
    GET    /tasks/<task_id>/subtasks/<id>/  → retrieve a subtask
    PUT    /tasks/<task_id>/subtasks/<id>/  → update a subtask
    PATCH  /tasks/<task_id>/subtasks/<id>/  → partial update
    DELETE /tasks/<task_id>/subtasks/<id>/  → delete a subtask
    """
    serializer_class = SubtaskSerializer#uses subtask serializer
    permission_classes = [permissions.IsAuthenticated]#only logged-in users have permission

    def get_queryset(self):
        task = get_object_or_404(Task, id=self.kwargs['task_id'], user=self.request.user)#finds a specific task that belongs to user if not found then error 404
        return Subtask.objects.filter(task=task)


# ───────────────────────────────────────────────
# Reminder views
# ───────────────────────────────────────────────

class ReminderListCreateView(generics.ListCreateAPIView):
    """
    GET  /tasks/<task_id>/reminders/  → list reminders for a task
    POST /tasks/<task_id>/reminders/  → create a reminder
    """
    serializer_class = ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_task(self):
        return get_object_or_404(Task, id=self.kwargs['task_id'], user=self.request.user)

    def get_queryset(self):
        return Reminder.objects.filter(task=self.get_task())

    def perform_create(self, serializer):
        serializer.save(task=self.get_task())


class ReminderDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /tasks/<task_id>/reminders/<id>/  → retrieve a reminder
    PUT    /tasks/<task_id>/reminders/<id>/  → update a reminder
    PATCH  /tasks/<task_id>/reminders/<id>/  → partial update
    DELETE /tasks/<task_id>/reminders/<id>/  → delete a reminder
    """
    serializer_class = ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        task = get_object_or_404(Task, id=self.kwargs['task_id'], user=self.request.user)
        return Reminder.objects.filter(task=task)


# ───────────────────────────────────────────────
# Analytics views
# ───────────────────────────────────────────────

class AnalyticsListCreateView(generics.ListCreateAPIView):
    """
    GET  /analytics/  → list all analytics records for the logged-in user
    POST /analytics/  → create an analytics record
    """
    serializer_class = AnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Analytics.objects.filter(user=self.request.user).order_by('-period_start')


class AnalyticsDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /analytics/<id>/  → retrieve an analytics record
    PUT    /analytics/<id>/  → update
    PATCH  /analytics/<id>/  → partial update
    DELETE /analytics/<id>/  → delete
    """
    serializer_class = AnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Analytics.objects.filter(user=self.request.user)