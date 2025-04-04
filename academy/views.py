from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import Course, Lesson, Test, Question, Answer, UserProgress, TestResult
from .serializers import (
    CourseSerializer, LessonSerializer, TestSerializer,
    QuestionSerializer, AnswerSerializer, UserProgressSerializer,
    TestResultSerializer, TelegramUserSerializer
)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'])
    def lessons(self, request, pk=None):
        course = self.get_object()
        lessons = course.lessons.all()
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def tests(self, request, pk=None):
        course = self.get_object()
        tests = course.tests.all()
        serializer = TestSerializer(tests, many=True)
        return Response(serializer.data)

class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        if course_id:
            return Lesson.objects.filter(course_id=course_id)
        return super().get_queryset()

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        test = self.get_object()
        answers = request.data.get('answers', [])
        
        # Calculate score
        total_questions = test.questions.count()
        correct_answers = 0
        
        for answer in answers:
            question_id = answer.get('question_id')
            answer_id = answer.get('answer_id')
            
            question = get_object_or_404(Question, id=question_id, test=test)
            correct_answer = question.answers.filter(is_correct=True).first()
            
            if correct_answer and correct_answer.id == answer_id:
                correct_answers += 1
        
        score = (correct_answers / total_questions) * 100
        passed = score >= test.passing_score
        
        # Save test result
        test_result = TestResult.objects.create(
            user=request.user,
            test=test,
            score=score,
            passed=passed
        )
        
        serializer = TestResultSerializer(test_result)
        return Response(serializer.data)

class UserProgressViewSet(viewsets.ModelViewSet):
    queryset = UserProgress.objects.all()
    serializer_class = UserProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProgress.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def complete_lesson(self, request, pk=None):
        progress = self.get_object()
        lesson_id = request.data.get('lesson_id')
        
        if lesson_id:
            lesson = get_object_or_404(Lesson, id=lesson_id, course=progress.course)
            progress.completed_lessons.add(lesson)
            
            # Update current lesson to the next one
            next_lesson = Lesson.objects.filter(
                course=progress.course,
                order__gt=lesson.order
            ).order_by('order').first()
            
            if next_lesson:
                progress.current_lesson = next_lesson
                progress.save()
        
        serializer = self.get_serializer(progress)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_payment(self, request, pk=None):
        progress = self.get_object()
        progress.is_paid = True
        progress.payment_date = timezone.now()
        progress.save()
        
        serializer = self.get_serializer(progress)
        return Response(serializer.data)

class TelegramAuthView(viewsets.ViewSet):
    def create(self, request):
        serializer = TelegramUserSerializer(data=request.data)
        if serializer.is_valid():
            telegram_data = serializer.validated_data
            
            # Create or get user
            user, created = User.objects.get_or_create(
                username=f"telegram_{telegram_data['id']}",
                defaults={
                    'first_name': telegram_data['first_name'],
                    'email': f"{telegram_data['id']}@telegram.user"
                }
            )
            
            # Return user data
            return Response({
                'user_id': user.id,
                'username': user.username,
                'first_name': user.first_name
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 