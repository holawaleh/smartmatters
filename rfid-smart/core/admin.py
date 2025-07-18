from django.contrib import admin
from .models import Student, Course, CourseRegistration, WeeklyLog

admin.site.register(Student)
admin.site.register(Course)
admin.site.register(CourseRegistration)
admin.site.register(WeeklyLog)
