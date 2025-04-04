from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Course, Lesson, Test, Question, Answer, UserProgress, TestResult

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text']

class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'text', 'order', 'answers']

class TestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Test
        fields = ['id', 'title', 'description', 'passing_score', 'questions']

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'video_url', 'order']

class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    tests = TestSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'price', 'lessons', 'tests']

class UserProgressSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    current_lesson = LessonSerializer(read_only=True)
    completed_lessons = LessonSerializer(many=True, read_only=True)
    
    class Meta:
        model = UserProgress
        fields = ['id', 'user', 'course', 'current_lesson', 'completed_lessons', 
                 'is_paid', 'payment_date', 'created_at', 'updated_at']

class TestResultSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    test = TestSerializer(read_only=True)
    
    class Meta:
        model = TestResult
        fields = ['id', 'user', 'test', 'score', 'passed', 'completed_at']

class TelegramUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    first_name = serializers.CharField()
    username = serializers.CharField(required=False)
    photo_url = serializers.URLField(required=False) 