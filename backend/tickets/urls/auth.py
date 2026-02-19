from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import AllowAny

from ..views import RegisterViewSet

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(permission_classes=[AllowAny])),
    path("token/refresh/", TokenRefreshView.as_view(permission_classes=[AllowAny])),
    path("register/", RegisterViewSet.as_view({"post": "create"})),
]
