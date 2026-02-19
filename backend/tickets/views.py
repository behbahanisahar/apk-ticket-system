from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User

from .models import Ticket, TicketResponse
from .serializers import (
    TicketSerializer,
    TicketCreateSerializer,
    TicketUpdateSerializer,
    TicketResponseSerializer,
    TicketResponseCreateSerializer,
    UserSerializer,
)
from .permissions import IsOwnerOrAdmin
from .filters import TicketFilter


class RegisterViewSet(viewsets.GenericViewSet):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email", "")
        if not username or not password:
            return Response(
                {"detail": "نام کاربری و رمز عبور الزامی است"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if User.objects.filter(username=username).exists():
            return Response(
                {"detail": "این نام کاربری قبلاً استفاده شده"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = User.objects.create_user(
            username=username, password=password, email=email
        )
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    filterset_class = TicketFilter
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Ticket.objects.select_related("user").prefetch_related("responses__user")
        if self.request.user.is_staff:
            return qs
        return qs.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == "create":
            return TicketCreateSerializer
        if self.action in ["update", "partial_update"]:
            return TicketUpdateSerializer
        return TicketSerializer

    def get_permissions(self):
        if self.action in ["list", "create"]:
            return [IsAuthenticated()]
        return [IsOwnerOrAdmin()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if not self.request.user.is_staff:
            serializer.validated_data.pop("status", None)
        serializer.save()

    @action(detail=True, methods=["post"])
    def respond(self, request, pk=None):
        ticket = self.get_object()
        if not request.user.is_staff and ticket.user != request.user:
            return Response(
                {"detail": "شما اجازه پاسخ به این تیکت را ندارید"},
                status=status.HTTP_403_FORBIDDEN,
            )
        ser = TicketResponseCreateSerializer(data=request.data)
        if ser.is_valid():
            TicketResponse.objects.create(
                ticket=ticket, user=request.user, message=ser.validated_data["message"]
            )
            return Response({"detail": "پاسخ ثبت شد"}, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
