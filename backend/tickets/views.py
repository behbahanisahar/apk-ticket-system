import logging

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User

from .models import Ticket, TicketResponse, TicketImage
from .serializers import (
    TicketSerializer,
    TicketCreateSerializer,
    TicketUpdateSerializer,
    TicketResponseSerializer,
    TicketResponseCreateSerializer,
    UserSerializer,
)
from .permissions import IsOwnerOrAdmin, IsOwnerAndOpen, IsOwnerAndOpenOrAdmin
from .filters import TicketFilter

logger = logging.getLogger(__name__)


class RegisterViewSet(viewsets.GenericViewSet):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email", "")
        first_name = request.data.get("first_name", "")
        last_name = request.data.get("last_name", "")
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
            username=username,
            password=password,
            email=email,
            first_name=first_name,
            last_name=last_name,
        )
        logger.info(f"New user registered: {username} (id={user.id})")
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    filterset_class = TicketFilter
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ["created_at", "updated_at", "status"]
    ordering = ["-created_at"]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Ticket.objects.select_related("user").prefetch_related("responses__user", "images")
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
        if self.action == "destroy":
            return [IsAuthenticated(), IsOwnerAndOpen()]
        if self.action in ["update", "partial_update"]:
            return [IsAuthenticated(), IsOwnerAndOpenOrAdmin()]
        return [IsOwnerOrAdmin()]

    def create(self, request, *args, **kwargs):
        images = request.FILES.getlist("images") or []
        max_per_image = 2 * 1024 * 1024  # 2MB per image
        max_total = 8 * 1024 * 1024  # 8MB total
        max_count = 5
        if len(images) > max_count:
            return Response(
                {"detail": f"حداکثر {max_count} تصویر قابل آپلود است"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        total_size = 0
        for img in images:
            if img.size > max_per_image:
                return Response(
                    {"detail": "حداکثر حجم هر تصویر ۲ مگابایت است"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            total_size += img.size
        if total_size > max_total:
            return Response(
                {"detail": "مجموع حجم تصاویر نباید از ۸ مگابایت بیشتر باشد"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ticket = serializer.save(user=request.user)
        for img in images:
            TicketImage.objects.create(ticket=ticket, image=img)
        ticket.refresh_from_db()
        logger.info(
            f"Ticket created: {ticket.ticket_number} by user {request.user.username} "
            f"(priority={ticket.priority}, images={len(images)})"
        )
        return Response(TicketSerializer(ticket).data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        old_status = serializer.instance.status
        if not self.request.user.is_staff:
            serializer.validated_data.pop("status", None)
        instance = serializer.save()
        new_status = instance.status
        if old_status != new_status:
            logger.info(
                f"Ticket {instance.ticket_number} status changed: {old_status} -> {new_status} "
                f"by {self.request.user.username}"
            )
        else:
            logger.info(f"Ticket {instance.ticket_number} updated by {self.request.user.username}")

    def perform_destroy(self, instance):
        ticket_number = instance.ticket_number
        username = self.request.user.username
        instance.delete()
        logger.info(f"Ticket {ticket_number} deleted by owner {username}")

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
            role = "admin" if request.user.is_staff else "user"
            logger.info(
                f"Response added to ticket {ticket.ticket_number} by {role} {request.user.username}"
            )
            if request.user.is_staff and ticket.status == "open":
                ticket.status = "in_progress"
                ticket.save(update_fields=["status"])
                logger.info(
                    f"Ticket {ticket.ticket_number} auto-changed to in_progress after admin response"
                )
            return Response({"detail": "پاسخ ثبت شد"}, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
