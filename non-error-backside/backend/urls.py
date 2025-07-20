# backend/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),  # 🔥 Hook in your app URLs
]


from django.http import JsonResponse

def root_view(request):
    return JsonResponse({"message": "SmartMat API root. Go to /api/auth/ for auth routes."})

urlpatterns = [
    path('', root_view),  # 👈 Add this
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
]
