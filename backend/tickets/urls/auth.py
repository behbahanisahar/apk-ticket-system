from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from ..views import RegisterViewSet
from ..serializers import UserSerializer
from ..throttling import AuthRateThrottle


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class ThrottledTokenObtainPairView(TokenObtainPairView):
    """Token endpoint with rate limiting to prevent brute force attacks."""
    throttle_classes = [AuthRateThrottle]


class ThrottledRegisterView(RegisterViewSet):
    """Register endpoint with rate limiting."""
    throttle_classes = [AuthRateThrottle]


urlpatterns = [
    path("token/", ThrottledTokenObtainPairView.as_view(permission_classes=[AllowAny])),
    path("token/refresh/", TokenRefreshView.as_view(permission_classes=[AllowAny])),
    path("register/", ThrottledRegisterView.as_view({"post": "create"}), name="auth-register"),
    path("me/", CurrentUserView.as_view()),
]
