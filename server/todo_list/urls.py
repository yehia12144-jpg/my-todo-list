from django.urls import path
from . import views

urlpatterns = [
    # ───────────────────────────────────────────────
    # Category endpoints
    # ───────────────────────────────────────────────
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),

    # ───────────────────────────────────────────────
    # Task endpoints
    # ───────────────────────────────────────────────
    path('tasks/', views.TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', views.TaskDetailView.as_view(), name='task-detail'),
    path('tasks/<int:pk>/complete/', views.TaskCompleteView.as_view(), name='task-complete'),

    # ───────────────────────────────────────────────
    # Subtask endpoints (nested under task)
    # ───────────────────────────────────────────────
    path('tasks/<int:task_id>/subtasks/', views.SubtaskListCreateView.as_view(), name='subtask-list-create'),
    path('tasks/<int:task_id>/subtasks/<int:pk>/', views.SubtaskDetailView.as_view(), name='subtask-detail'),

    # ───────────────────────────────────────────────
    # Reminder endpoints (nested under task)
    # ───────────────────────────────────────────────
    path('tasks/<int:task_id>/reminders/', views.ReminderListCreateView.as_view(), name='reminder-list-create'),
    path('tasks/<int:task_id>/reminders/<int:pk>/', views.ReminderDetailView.as_view(), name='reminder-detail'),

    # ───────────────────────────────────────────────
    # Analytics endpoints
    # ───────────────────────────────────────────────
    path('analytics/', views.AnalyticsListCreateView.as_view(), name='analytics-list-create'),
    path('analytics/<int:pk>/', views.AnalyticsDetailView.as_view(), name='analytics-detail'),
]