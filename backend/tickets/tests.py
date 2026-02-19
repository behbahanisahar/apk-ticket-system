import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User

from .models import Ticket, TicketResponse


@pytest.mark.django_db
class TestTicketCreation:
    def test_user_creates_ticket_and_is_owner(self, user):
        client = APIClient()
        client.force_authenticate(user=user)
        url = reverse("ticket-list")
        data = {
            "title": "مشکل لاگین",
            "description": "نمی‌تونم وارد بشم",
            "priority": "high",
        }
        resp = client.post(url, data, format="json")
        assert resp.status_code == status.HTTP_201_CREATED
        assert Ticket.objects.filter(user=user).count() == 1
        assert Ticket.objects.first().user == user

    def test_anonymous_cannot_create_ticket(self):
        client = APIClient()
        url = reverse("ticket-list")
        data = {"title": "تست", "description": "تست", "priority": "low"}
        resp = client.post(url, data, format="json")
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestTicketResponse:
    def test_owner_can_respond(self, user):
        ticket = Ticket.objects.create(
            title="تست", description="تست", priority="medium", user=user
        )
        client = APIClient()
        client.force_authenticate(user=user)
        url = reverse("ticket-respond", kwargs={"pk": ticket.pk})
        resp = client.post(url, {"message": "پاسخ کاربر"}, format="json")
        assert resp.status_code == status.HTTP_201_CREATED
        assert TicketResponse.objects.filter(ticket=ticket).count() == 1

    def test_admin_can_respond_to_any_ticket(self, user, admin_user):
        ticket = Ticket.objects.create(
            title="تست", description="تست", priority="medium", user=user
        )
        client = APIClient()
        client.force_authenticate(user=admin_user)
        url = reverse("ticket-respond", kwargs={"pk": ticket.pk})
        resp = client.post(url, {"message": "پاسخ ادمین"}, format="json")
        assert resp.status_code == status.HTTP_201_CREATED

    def test_other_user_cannot_respond(self, user, admin_user):
        ticket = Ticket.objects.create(
            title="تست", description="تست", priority="medium", user=user
        )
        other = User.objects.create_user(username="other", password="pass123")
        client = APIClient()
        client.force_authenticate(user=other)
        url = reverse("ticket-respond", kwargs={"pk": ticket.pk})
        resp = client.post(url, {"message": "پاسخ غریبه"}, format="json")
        assert resp.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestStatusChange:
    def test_user_cannot_change_status(self, user):
        ticket = Ticket.objects.create(
            title="تست", description="تست", priority="medium", user=user
        )
        client = APIClient()
        client.force_authenticate(user=user)
        url = reverse("ticket-detail", kwargs={"pk": ticket.pk})
        resp = client.patch(url, {"status": "closed"}, format="json")
        assert resp.status_code == status.HTTP_200_OK
        ticket.refresh_from_db()
        assert ticket.status == "open"

    def test_admin_can_change_status(self, user, admin_user):
        ticket = Ticket.objects.create(
            title="تست", description="تست", priority="medium", user=user
        )
        client = APIClient()
        client.force_authenticate(user=admin_user)
        url = reverse("ticket-detail", kwargs={"pk": ticket.pk})
        resp = client.patch(url, {"status": "closed"}, format="json")
        assert resp.status_code == status.HTTP_200_OK
        ticket.refresh_from_db()
        assert ticket.status == "closed"
