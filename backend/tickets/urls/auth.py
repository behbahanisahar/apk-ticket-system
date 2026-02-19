from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from ..views import RegisterViewSet
from ..serializers import UserSerializer


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


urlpatterns = [
    path("token/", TokenObtainPairView.as_view(permission_classes=[AllowAny])),
    path("token/refresh/", TokenRefreshView.as_view(permission_classes=[AllowAny])),
    path("register/", RegisterViewSet.as_view({"post": "create"})),
    path("me/", CurrentUserView.as_view()),
]
