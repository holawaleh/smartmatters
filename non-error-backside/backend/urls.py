from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def root_view(request):
    return JsonResponse({
        "message": "🎯 SmartMat Backend API is live.",
        "auth": "/api/auth/",
        "admin": "/admin/"
    })

urlpatterns = [
    path('', root_view),  # 👈 This fixes the homepage 404
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
]
