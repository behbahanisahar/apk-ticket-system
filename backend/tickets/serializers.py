from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Ticket, TicketResponse, TicketImage


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


class TicketImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = TicketImage
        fields = ["id", "image"]

    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None


class TicketSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    responses = TicketResponseSerializer(many=True, read_only=True)
    images = TicketImageSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = [
            "id",
            "ticket_number",
            "title",
            "description",
            "images",
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
