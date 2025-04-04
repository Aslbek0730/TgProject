from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet, LessonViewSet, TestViewSet,
    UserProgressViewSet, TelegramAuthView
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'tests', TestViewSet)
router.register(r'progress', UserProgressViewSet)
router.register(r'auth/telegram', TelegramAuthView, basename='telegram-auth')

urlpatterns = [
    path('', include(router.urls)),
] 