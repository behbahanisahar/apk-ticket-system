from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("tickets.urls.auth")),
    path("api/", include("tickets.urls.tickets")),
]
