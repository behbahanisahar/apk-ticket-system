import pytest
import io
from PIL import Image
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User

from tickets.models import Ticket, TicketResponse, TicketImage


def create_test_image(name="test.jpg", size=(100, 100), format="JPEG"):
    """Create a test image file."""
    file = io.BytesIO()
    image = Image.new("RGB", size, color="red")
    image.save(file, format)
    file.seek(0)
    return SimpleUploadedFile(name, file.read(), content_type=f"image/{format.lower()}")


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

    def test_other_user_cannot_respond(self, user):
        ticket = Ticket.objects.create(
            title="تست", description="تست", priority="medium", user=user
        )
        other = User.objects.create_user(username="other", password="pass123")
        client = APIClient()
        client.force_authenticate(user=other)
        url = reverse("ticket-respond", kwargs={"pk": ticket.pk})
        resp = client.post(url, {"message": "پاسخ کاربر"}, format="json")
        assert resp.status_code in (status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND)


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


@pytest.mark.django_db
class TestTicketListAccess:
    def test_user_sees_only_own_tickets(self, user):
        Ticket.objects.create(title="تست۱", description="د", priority="medium", user=user)
        other = User.objects.create_user(username="other", password="pass123")
        Ticket.objects.create(title="تست۲", description="د", priority="low", user=other)
        client = APIClient()
        client.force_authenticate(user=user)
        url = reverse("ticket-list")
        resp = client.get(url)
        assert resp.status_code == status.HTTP_200_OK
        assert len(resp.data["results"]) == 1
        assert resp.data["results"][0]["title"] == "تست۱"

    def test_admin_sees_all_tickets(self, user, admin_user):
        Ticket.objects.create(title="تست۱", description="د", priority="medium", user=user)
        Ticket.objects.create(title="تست۲", description="د", priority="low", user=admin_user)
        client = APIClient()
        client.force_authenticate(user=admin_user)
        url = reverse("ticket-list")
        resp = client.get(url)
        assert resp.status_code == status.HTTP_200_OK
        assert len(resp.data["results"]) >= 2


@pytest.mark.django_db
class TestTicketRetrieve:
    def test_owner_can_retrieve_ticket(self, user):
        ticket = Ticket.objects.create(
            title="تست", description="تست", priority="medium", user=user
        )
        client = APIClient()
        client.force_authenticate(user=user)
        url = reverse("ticket-detail", kwargs={"pk": ticket.pk})
        resp = client.get(url)
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["title"] == "تست"

    def test_other_user_cannot_retrieve_ticket(self, user):
        ticket = Ticket.objects.create(
            title="تست", description="تست", priority="medium", user=user
        )
        other = User.objects.create_user(username="other", password="pass123")
        client = APIClient()
        client.force_authenticate(user=other)
        url = reverse("ticket-detail", kwargs={"pk": ticket.pk})
        resp = client.get(url)
        assert resp.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestTicketDelete:
    def test_owner_can_delete_open_ticket(self, user):
        ticket = Ticket.objects.create(
            title="تست", description="تست", priority="medium", user=user
        )
        client = APIClient()
        client.force_authenticate(user=user)
        url = reverse("ticket-detail", kwargs={"pk": ticket.pk})
        resp = client.delete(url)
        assert resp.status_code == status.HTTP_204_NO_CONTENT
        assert not Ticket.objects.filter(pk=ticket.pk).exists()

    def test_owner_cannot_delete_closed_ticket(self, user, admin_user):
        ticket = Ticket.objects.create(
            title="تست", description="تست", priority="medium", user=user, status="closed"
        )
        client = APIClient()
        client.force_authenticate(user=user)
        url = reverse("ticket-detail", kwargs={"pk": ticket.pk})
        resp = client.delete(url)
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert Ticket.objects.filter(pk=ticket.pk).exists()


@pytest.mark.django_db
class TestTicketResponseValidation:
    def test_respond_requires_message(self, user):
        ticket = Ticket.objects.create(
            title="تست", description="تست", priority="medium", user=user
        )
        client = APIClient()
        client.force_authenticate(user=user)
        url = reverse("ticket-respond", kwargs={"pk": ticket.pk})
        resp = client.post(url, {}, format="json")
        assert resp.status_code == status.HTTP_400_BAD_REQUEST

    def test_admin_respond_changes_status_to_in_progress(self, user, admin_user):
        ticket = Ticket.objects.create(
            title="تست", description="تست", priority="medium", user=user
        )
        assert ticket.status == "open"
        client = APIClient()
        client.force_authenticate(user=admin_user)
        url = reverse("ticket-respond", kwargs={"pk": ticket.pk})
        resp = client.post(url, {"message": "پاسخ ادمین"}, format="json")
        assert resp.status_code == status.HTTP_201_CREATED
        ticket.refresh_from_db()
        assert ticket.status == "in_progress"


@pytest.mark.django_db
class TestTicketImageUpload:
    def test_create_ticket_with_single_image(self, user):
        client = APIClient()
        client.force_authenticate(user=user)
        url = reverse("ticket-list")
        image = create_test_image()
        data = {
            "title": "تست تصویر",
            "description": "تست آپلود تصویر",
            "priority": "medium",
            "images": [image],
        }
        resp = client.post(url, data, format="multipart")
        assert resp.status_code == status.HTTP_201_CREATED
        ticket = Ticket.objects.get(pk=resp.data["id"])
        assert ticket.images.count() == 1

    def test_create_ticket_with_multiple_images(self, user):
        client = APIClient()
        client.force_authenticate(user=user)
        url = reverse("ticket-list")
        images = [create_test_image(f"test{i}.jpg") for i in range(3)]
        data = {
            "title": "تست چند تصویر",
            "description": "تست آپلود چند تصویر",
            "priority": "high",
            "images": images,
        }
        resp = client.post(url, data, format="multipart")
        assert resp.status_code == status.HTTP_201_CREATED
        ticket = Ticket.objects.get(pk=resp.data["id"])
        assert ticket.images.count() == 3

    def test_create_ticket_exceeds_max_image_count(self, user):
        client = APIClient()
        client.force_authenticate(user=user)
        url = reverse("ticket-list")
        images = [create_test_image(f"test{i}.jpg") for i in range(6)]
        data = {
            "title": "تست تعداد زیاد",
            "description": "تست بیش از ۵ تصویر",
            "priority": "low",
            "images": images,
        }
        resp = client.post(url, data, format="multipart")
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert "حداکثر" in resp.data.get("detail", "")

    def test_ticket_response_includes_images(self, user):
        client = APIClient()
        client.force_authenticate(user=user)
        url = reverse("ticket-list")
        image = create_test_image()
        data = {
            "title": "تست پاسخ",
            "description": "تست تصویر در پاسخ",
            "priority": "medium",
            "images": [image],
        }
        resp = client.post(url, data, format="multipart")
        assert resp.status_code == status.HTTP_201_CREATED
        assert "images" in resp.data
        assert len(resp.data["images"]) == 1

    def test_create_ticket_without_images(self, user):
        client = APIClient()
        client.force_authenticate(user=user)
        url = reverse("ticket-list")
        data = {
            "title": "تست بدون تصویر",
            "description": "تیکت بدون تصویر",
            "priority": "medium",
        }
        resp = client.post(url, data, format="multipart")
        assert resp.status_code == status.HTTP_201_CREATED
        ticket = Ticket.objects.get(pk=resp.data["id"])
        assert ticket.images.count() == 0
