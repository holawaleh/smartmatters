from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Student, Course, CourseRegistration, WeeklyLog
from .serializers import *

@api_view(['POST'])
def check_uid(request):
    uid = request.data.get('uid')
    try:
        student = Student.objects.get(rfid_uid=uid)
        return Response({"status": "valid", "student": student.full_name})
    except Student.DoesNotExist:
        return Response({"status": "invalid"})

@api_view(['POST'])
def register_student_to_course(request):
    student_id = request.data.get('student')
    course_ids = request.data.get('course', [])

    # Validation
    if not student_id or not course_ids:
        return Response({"error": "Student and course are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        student = Student.objects.get(id=student_id)

        for cid in course_ids:
            course = Course.objects.get(id=cid)
            CourseRegistration.objects.create(student=student, course=course)

        return Response({"message": "Student registered to selected courses!"}, status=status.HTTP_201_CREATED)

    except Student.DoesNotExist:
        return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

    except Course.DoesNotExist:
        return Response({"error": "One or more courses not found."}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def log_weekly_attendance(request):
    serializer = WeeklyLogSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Log saved!"})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_students(request):
    students = Student.objects.all()
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_courses(request):
    courses = Course.objects.all()
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_logs(request):
    logs = WeeklyLog.objects.all()
    serializer = WeeklyLogSerializer(logs, many=True)
    return Response(serializer.data)
