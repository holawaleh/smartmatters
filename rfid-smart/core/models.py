from django.db import models
from django.utils import timezone

class Student(models.Model):
    full_name = models.CharField(max_length=100)
    matric_no = models.CharField(max_length=20, unique=True)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    department = models.CharField(max_length=50)
    level = models.CharField(max_length=15)
    rfid_uid = models.CharField(max_length=50, unique=True, null=True, blank=True)

    def __str__(self):
        return self.full_name

class Course(models.Model):
    title = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return f"{self.code} - {self.title}"

class CourseRegistration(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date_registered = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.full_name} - {self.course.code}"

class WeeklyLog(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.timestamp}: {self.student.full_name} - {self.status}"
