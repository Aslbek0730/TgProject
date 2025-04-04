from django.contrib import admin
from .models import (
    Course, Lesson, Test, Question,
    Answer, UserProgress, TestResult
)

class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 4

class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1
    show_change_link = True

class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    show_change_link = True

class TestInline(admin.TabularInline):
    model = Test
    extra = 1
    show_change_link = True

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title', 'description')
    inlines = [LessonInline, TestInline]

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'created_at')
    list_filter = ('course', 'created_at')
    search_fields = ('title', 'description')
    ordering = ('course', 'order')

@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'passing_score', 'created_at')
    list_filter = ('course', 'created_at')
    search_fields = ('title', 'description')
    inlines = [QuestionInline]

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'test', 'order')
    list_filter = ('test',)
    search_fields = ('text',)
    inlines = [AnswerInline]
    ordering = ('test', 'order')

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('text', 'question', 'is_correct')
    list_filter = ('question__test', 'is_correct')
    search_fields = ('text',)

@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'is_paid', 'payment_date')
    list_filter = ('is_paid', 'course', 'payment_date')
    search_fields = ('user__username', 'course__title')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(TestResult)
class TestResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'test', 'score', 'passed', 'completed_at')
    list_filter = ('passed', 'test__course', 'completed_at')
    search_fields = ('user__username', 'test__title')
    readonly_fields = ('completed_at',) 