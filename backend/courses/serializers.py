from rest_framework import serializers
from .models import TelegramUser, Course, Lesson, Test, Question, Answer, UserProgress

class TelegramUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TelegramUser
        fields = ['telegram_id', 'username', 'first_name', 'last_name', 'language_code']
        read_only_fields = ['created_at', 'updated_at'] 