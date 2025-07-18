from rest_framework import serializers
from .models import Student, Course, CourseRegistration, WeeklyLog

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class CourseRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseRegistration
        fields = '__all__'

class WeeklyLogSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    student_id = serializers.IntegerField(source='student.id', read_only=True)
    course_name = serializers.CharField(source='course.title', read_only=True)
    course_id = serializers.IntegerField(source='course.id', read_only=True)

    class Meta:
        model = WeeklyLog
        fields = [
            'id',
            'timestamp',   # 👈 Add this line
            'status',
            'student_id',
            'student_name',
            'course_id',
            'course_name',
        ]
