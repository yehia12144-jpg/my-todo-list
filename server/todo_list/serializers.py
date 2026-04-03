from rest_framework import serializers
from .models import Category, Task, Subtask, Reminder, Analytics


class CategorySerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = Category
        fields = ['id', 'category_name', 'user']
        read_only_fields = ['id', 'user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = ['id', 'subtask_title', 'is_completed', 'task']
        read_only_fields = ['id']


class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = [
            'id',
            'reminder_time',
            'alert_enabled',
            'notification_type',
            'timer_value',
            'countdown_value',
            'task'
        ]
        read_only_fields = ['id']


class TaskSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.id')
    subtasks = SubtaskSerializer(many=True, read_only=True)
    reminders = ReminderSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'due_date',
            'status',
            'priority_level',
            'created_at',
            'updated_at',
            'dark_mode',
            'user',
            'category',
            'subtasks',
            'reminders',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']

    def validate_category(self, value):
        """
        Make sure the selected category belongs to the logged-in user.
        """
        request = self.context.get('request')
        if value and request and value.user != request.user:
            raise serializers.ValidationError("You can only assign your own categories to your tasks.")
        return value

    def create(self, validated_data):
        """
        Automatically save task for the logged-in user.
        """
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """
        Supports editing existing task fields including:
        - title
        - description
        - due_date
        - priority_level
        - status
        - category
        """
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.due_date = validated_data.get('due_date', instance.due_date)
        instance.status = validated_data.get('status', instance.status)
        instance.priority_level = validated_data.get('priority_level', instance.priority_level)
        instance.dark_mode = validated_data.get('dark_mode', instance.dark_mode)
        instance.category = validated_data.get('category', instance.category)
        instance.save()
        return instance


class TaskCompleteSerializer(serializers.ModelSerializer):
    """
    Optional serializer just for marking a task as complete/incomplete.
    """
    class Meta:
        model = Task
        fields = ['id', 'status']
        read_only_fields = ['id']

    def validate_status(self, value):
        allowed_values = ['pending', 'in_progress', 'completed']
        if value not in allowed_values:
            raise serializers.ValidationError("Invalid status value.")
        return value


class AnalyticsSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = Analytics
        fields = [
            'id',
            'period_start',
            'period_end',
            'tasks_completed',
            'tasks_pending',
            'completion_rate',
            'user',
            'task'
        ]
        read_only_fields = ['id', 'user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)