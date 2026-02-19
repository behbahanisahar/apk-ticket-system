from django.db import models
from django.contrib.auth.models import User


class Ticket(models.Model):
    STATUS_OPEN = "open"
    STATUS_IN_PROGRESS = "in_progress"
    STATUS_CLOSED = "closed"

    PRIORITY_CHOICES = [
        ("low", "کم"),
        ("medium", "متوسط"),
        ("high", "زیاد"),
    ]
    STATUS_CHOICES = [
        (STATUS_OPEN, "باز"),
        (STATUS_IN_PROGRESS, "در حال بررسی"),
        (STATUS_CLOSED, "بسته"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="medium")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tickets")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class TicketResponse(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name="responses")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ticket_responses")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.ticket.title} - {self.user.username}"
