from django.urls import path
from .views import SuperuserRegisterView, CustomAuthToken, ProtectedPingView, home_view

urlpatterns = [
    path('', home_view),                              # GET /api/auth/
    path('register/', SuperuserRegisterView.as_view()),  # POST /api/auth/register/
    path('login/', CustomAuthToken.as_view()),           # POST /api/auth/login/
    path('protected/', ProtectedPingView.as_view()),     # GET /api/auth/protected/
]
