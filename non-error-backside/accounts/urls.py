# accounts/urls.py
from django.urls import path
from accounts.views import home_view, SuperuserRegisterView
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('', home_view),  # for api/auth/
    path('login/', obtain_auth_token, name='login'),
    path('register-superuser/', SuperuserRegisterView.as_view(), name='register-superuser'),
]
