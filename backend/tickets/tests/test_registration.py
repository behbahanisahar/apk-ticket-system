import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User


@pytest.mark.django_db
class TestRegistration:
    def test_register_success(self):
        client = APIClient()
        url = reverse("auth-register")
        data = {
            "username": "newuser",
            "password": "securepass123",
            "email": "new@test.com",
            "first_name": "نام",
            "last_name": "نام خانوادگی",
        }
        resp = client.post(url, data, format="json")
        assert resp.status_code == status.HTTP_201_CREATED
        assert resp.data["username"] == "newuser"
        assert User.objects.filter(username="newuser").exists()

    def test_register_duplicate_username_rejected(self, user):
        client = APIClient()
        url = reverse("auth-register")
        data = {"username": "testuser", "password": "pass123", "email": "a@b.com"}
        resp = client.post(url, data, format="json")
        assert resp.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_missing_credentials_rejected(self):
        client = APIClient()
        url = reverse("auth-register")
        resp = client.post(url, {"email": "a@b.com"}, format="json")
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
