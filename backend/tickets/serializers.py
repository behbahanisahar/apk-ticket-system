from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Ticket, TicketResponse


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "is_staff"]


class TicketResponseSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = TicketResponse
        fields = ["id", "ticket", "user", "message", "created_at"]
        read_only_fields = ["user"]


class TicketSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    responses = TicketResponseSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = [
            "id",
            "title",
            "description",
            "priority",
            "status",
            "user",
            "responses",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "status"]


class TicketCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ["title", "description", "priority"]


class TicketUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ["title", "description", "priority", "status"]


class TicketResponseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketResponse
        fields = ["message"]
