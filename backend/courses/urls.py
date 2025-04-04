from django.urls import path
from .views import (
    CourseList, CourseDetail, LessonDetail, TestDetail,
    TestSubmit, UserProgressView, TelegramUserAuth
)

urlpatterns = [
    path('courses/', CourseList.as_view(), name='course-list'),
    path('courses/<int:pk>/', CourseDetail.as_view(), name='course-detail'),
    path('lessons/<int:pk>/', LessonDetail.as_view(), name='lesson-detail'),
    path('tests/<int:pk>/', TestDetail.as_view(), name='test-detail'),
    path('tests/<int:pk>/submit/', TestSubmit.as_view(), name='test-submit'),
    path('progress/', UserProgressView.as_view(), name='user-progress'),
    path('users/register/', TelegramUserAuth.as_view(), name='telegram-user-auth'),
] 