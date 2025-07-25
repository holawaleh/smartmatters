from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from rest_framework import status
from django.http import HttpResponse


class SuperuserRegisterView(APIView):
    permission_classes = [AllowAny]  # Public, for bootstrapping admin

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=400)

        user = User.objects.create_superuser(username=username, email=email, password=password)
        return Response({'message': 'Superuser created successfully'}, status=201)


class CustomAuthToken(ObtainAuthToken):
    permission_classes = [AllowAny]  # Public login route

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'email': user.email,
            'is_superuser': user.is_superuser 
        })


class ProtectedPingView(APIView):
    permission_classes = [IsAuthenticated]  # 🔐 Token required

    def get(self, request):
        return Response({'message': f'Hello {request.user.username}, you are authenticated.'})


def home_view(request):
    return HttpResponse("Smartmat backend is running!")
