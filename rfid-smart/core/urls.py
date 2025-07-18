from django.urls import path
from .views import (
    check_uid,
    register_student_to_course,
    log_weekly_attendance,
    get_students,
    get_courses,
    get_logs,
)

urlpatterns = [
    path('check-uid/', check_uid),
    path('course/register/', register_student_to_course),
    path('log/', log_weekly_attendance),
    path('students/', get_students),
    path('courses/', get_courses),
    path('logs/', get_logs),
]
