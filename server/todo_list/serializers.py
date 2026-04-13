from rest_framework import serializers
from .models import Category, Task, Subtask, Reminder, Analytics


class CategorySerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.id')#doesn't allow the user to change the id

    class Meta:
        model = Category#Tells Django to use the model category...
        fields = ['id', 'category_name', 'user']#and only include the following fields listed 
        read_only_fields = ['id', 'user']#id and user can't be changed by front-end

    def create(self, validated_data):#Assigns a user to their category
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask #Tells Django to look into model subtask
        fields = ['id', 'subtask_title', 'is_completed', 'task']# and include only the following fields
        read_only_fields = ['id']#id can't be changed by front-end


class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder #Tells Django to look at Reminder model
        fields = [
            'id',
            'reminder_time',
            'alert_enabled',
            'notification_type',
            'timer_value',
            'countdown_value',
            'task'
        ]#and only include the following fields
        read_only_fields = ['id']#id can't be changed by front-end


class TaskSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.id')#doesn't allow the user to change their id
    subtasks = SubtaskSerializer(many=True, read_only=True)#allows the task to have many subtasks 
    reminders = ReminderSerializer(many=True, read_only=True)#allows the task to have many reminders

    class Meta:
        model = Task#tells Django to look at Task model
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
        ]#and include only the following fields
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']#front-end can't change the following fields

    def validate_category(self, value):#checks if the category belongs to the following user if not then error
        """
        Make sure the selected category belongs to the logged-in user.
        """
        request = self.context.get('request')
        if value and request and value.user != request.user:
            raise serializers.ValidationError("You can only assign your own categories to your tasks.")
        return value

    def create(self, validated_data):#assigns logged-in users to their tasks
        """
        Automatically save task for the logged-in user.
        """
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):#shows any new updates but if there aren't any updates then it will stay as is.
        """
        Supports editing existing task fields including:
        - title
        - description
        - due_date
        - priority_level
        - status
        - category
        """
        instance.title = validated_data.get('title', instance.title)#if no change then keep the old title
        instance.description = validated_data.get('description', instance.description)#if no change then keep the old description
        instance.due_date = validated_data.get('due_date', instance.due_date)#if no change then keep the old due date
        instance.status = validated_data.get('status', instance.status)#if no change then keep the same status
        instance.priority_level = validated_data.get('priority_level', instance.priority_level)#if no change then keep the same priority level
        instance.dark_mode = validated_data.get('dark_mode', instance.dark_mode)
        instance.category = validated_data.get('category', instance.category)
        instance.save()#saves new changes
        return instance#sends new changes to the front-end


class TaskCompleteSerializer(serializers.ModelSerializer):
    """
    Optional serializer just for marking a task as complete/incomplete.
    """
    class Meta:
        model = Task #tells Django to look at Task model
        fields = ['id', 'status']#and to only include the following fields
        read_only_fields = ['id']#doesn't allow front-end to change id

    def validate_status(self, value):#changes the status of the task
        allowed_values = ['pending', 'in_progress', 'completed']
        if value not in allowed_values:
            raise serializers.ValidationError("Invalid status value.")
        return value#checks if the status is one of these options, if not then error


class AnalyticsSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.id')#doesn't allow the user to change their id

    class Meta:
        model = Analytics#tells Django to look at model Analytics
        fields = [
            'id',
            'period_start',
            'period_end',
            'tasks_completed',
            'tasks_pending',
            'completion_rate',
            'user',
            'task'
        ]#and to include the following fields
        read_only_fields = ['id', 'user']#doesn't allow front-end to change id and user

    def create(self, validated_data):#automatically assigns logged-in users to their analytics
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)